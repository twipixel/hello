import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';

import Cube from './geom/Cube';
import Surface from './geom/Surface';
import Triangle from './geom/Triangle';
import Rectangle from './geom/Rectangle';
import CoordinatePlane from './geom/CoordinatePlane';


export default class App
{
    constructor()
    {
        this.app = new PIXI.Application(800, 600, {backgroundColor:0x000000});
        document.body.appendChild(this.app.view);

        this.canvas = this.app.renderer.view;
        this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.tick();
    }

    initialize()
    {
        this.objects = [];

        //this.createTriangle();
        //this.createRectangle();
        //this.createCube();
        this.createSurface();
    }

    createTriangle()
    {
        this.removeAll();
        this.triangle = new Triangle(100);
        this.triangle.x = this.cx;
        this.triangle.y = this.cy;
        this.triangle.generate();
        this.triangle.draw();
        this.stage.addChild(this.triangle);
        this.objects.push(this.triangle);
    }

    createRectangle()
    {
        this.removeAll();
        this.rectangle = new Rectangle(100, 100);
        this.rectangle.x = this.cx;
        this.rectangle.y = this.cy;
        this.rectangle.generate();
        this.rectangle.draw();
        this.stage.addChild(this.rectangle);
        this.objects.push(this.rectangle);

        /*var tween = Be.to(this.rectangle, {z:200}, 2, Sine.easeOut);
         tween.onUpdate = () => {
         this.rectangle.draw();

         console.log('update(), z:', this.rectangle.z);
         };
         tween.play();*/
    }

    createCube()
    {
        this.removeAll();
        this.cube = new Cube();
        this.cube.x = this.cx;
        this.cube.y = this.cy;
        this.cube.generate();
        this.cube.draw();
        this.stage.addChild(this.cube);
        this.objects.push(this.cube);
    }

    createSurface()
    {
        this.removeAll();
        this.surface = new Surface();
        this.surface.x = this.canvas.width / 2;
        this.surface.y = this.canvas.height / 2;
        this.surface.generate();
        this.surface.color();
        this.surface.draw();
        this.stage.addChild(this.surface);
        this.objects.push(this.surface);
    }

    createCoordinate()
    {
        if(this.coordinate) {
            this.stage.removeChild(this.coordinate);
            this.coordinate = null;
        }
        else {
            this.coordinate = new CoordinatePlane(400, 400);
            this.coordinate.x = this.cx;
            this.coordinate.y = this.canvas.height / 10 * 8;
            this.coordinate.generate();
            this.coordinate.draw();
            this.stage.addChild(this.coordinate);
            this.objects.push(this.coordinate);
        }
    }

    removeAll()
    {
        this.objects = [];
        this.stage.removeChildren();
    }

    initializeGUI()
    {
        this.config = {};
        this.gui = new dat.GUI();

        this.config.createTriangle = this.createTriangle.bind(this);
        this.config.createRectangle = this.createRectangle.bind(this);
        this.config.createCube = this.createCube.bind(this);
        this.config.createSurface = this.createSurface.bind(this);
        this.config.createCoordinate = this.createCoordinate.bind(this);

        this.gui.add(this.config, 'createTriangle');
        this.gui.add(this.config, 'createRectangle');
        this.gui.add(this.config, 'createCube');
        this.gui.add(this.config, 'createSurface');
        this.gui.add(this.config, 'createCoordinate');
    }

    tick(ms)
    {
        this.render(ms);
        requestAnimationFrame(this.tick.bind(this));
    }

    render(ms) {}

    resize() {}

    rotate(property, sign)
    {
        var n = this.objects.length;

        for(var i = 0; i < n; i++) {
            var obj = this.objects[i];
            obj[property + 'Rotate'].call(obj, sign);
        }
    }

    get cx()
    {
        return this.canvas.width / 2;
    }

    get cy()
    {
        return this.canvas.height / 2;
    }
}