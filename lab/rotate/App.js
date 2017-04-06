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
        this.app = new PIXI.Application(800, 600, {backgroundColor:0x191919});
        document.body.appendChild(this.app.view);

        this.canvas = this.app.renderer.view;
        this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.tick();
        this.addEvent();
    }

    initialize()
    {
        this.objects = [];

        this.createTriangle();
        //this.createRectangle();
        //this.createCube();
        //this.createSurface();
        this.createCoordinate();
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

        //this.rotateWithMotion(this.triangle, {rx:90, ry:0, rz:0}, 3, Sine.easeOut, 2);
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
        if (this.coordinate) {
            this.stage.removeChild(this.coordinate);
            this.coordinate = null;
        }

        this.coordinate = new CoordinatePlane(400, 400);
        this.coordinate.x = this.cx;
        this.coordinate.y = this.cy;
        // this.coordinate.y = this.canvas.height / 10 * 6;
        this.coordinate.generate();
        this.coordinate.draw();
        this.stage.addChild(this.coordinate);
        this.objects.push(this.coordinate);

        //this.rotateWithMotion(this.coordinate, {rx:90, ry:0, rz:0}, 3, Sine.easeOut, 2);
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
        this.config.rotateX = this.rotateX.bind(this);
        this.config.rotateY = this.rotateY.bind(this);
        this.config.rotateZ = this.rotateZ.bind(this);

        this.gui.add(this.config, 'createTriangle');
        this.gui.add(this.config, 'createRectangle');
        this.gui.add(this.config, 'createCube');
        this.gui.add(this.config, 'createSurface');
        this.gui.add(this.config, 'createCoordinate');
        this.gui.add(this.config, 'rotateX');
        this.gui.add(this.config, 'rotateY');
        this.gui.add(this.config, 'rotateZ');
    }

    tick(ms)
    {
        this.render(ms);
        requestAnimationFrame(this.tick.bind(this));
    }

    addEvent()
    {
        this.stage.interactive = true;
        this.prevwheel = 0;
        this.mousemoveListener = this.onmousemove.bind(this);
        this.canvas.addEventListener('mousedown', this.onmousedown.bind(this));
        this.canvas.addEventListener('mouseup', this.onmouseup.bind(this));
        this.canvas.addEventListener('mouseout', this.onmouseup.bind(this));
        this.canvas.addEventListener('mousewheel', this.onmousewheel.bind(this));
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

    /**
     *
     * @param target
     * @param to {Object} {rx:90, ry:90, rz:90}
     * @param time {Number}
     * @param easing {IEasing}
     * @param delay {Number}
     */
    rotateWithMotion(target, to, time = 3, easing = Sine.easeOut, delay = 0)
    {
        target._to = to;

        for (var prop in to) {
            target[prop] = 0;
            target['p' + prop] = target[prop];
        }

        var tween = Be.to(target, to, time, easing, delay);

        tween.onUpdate = () => {
            var to = target._to;
            for (var prop in to) {
                var value = target[prop];
                var pvalue = target['p' + prop];
                var d = value - pvalue;

                if (prop.indexOf('x') > -1) {
                    target.xRotate(d);
                }
                else if (prop.indexOf('y') > -1) {
                    target.yRotate(d);
                }
                else {
                    target.zRotate(d);
                }

                target['p' + prop] = value;
            }
        };

        if (delay === 0) {
            tween.play();
        }
        else {
            var delay = Be.delay(tween, delay);
            delay.play();
        }
    }

    rotateX()
    {
        this.rotateObjects('x');
    }

    rotateY()
    {
        this.rotateObjects('y');
    }

    rotateZ()
    {
        this.rotateObjects('z');
    }

    rotateObjects(property, degrees = 90)
    {
        var to = {};

        if (property === 'x') {
            to.rx = degrees;
        }
        else if (property === 'y') {
            to.ry = degrees;
        }
        else {
            to.rz = degrees;
        }

        var n = this.objects.length;

        for(var i = 0; i < n; i++) {
            var obj = this.objects[i];
            this.rotateWithMotion(obj, to);
        }

        this.rotateWithMotion(this.coordinate, to);
    }

    onmousedown(event)
    {
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
        this.canvas.addEventListener('mousemove', this.mousemoveListener);
    }

    onmousemove(event)
    {
        var dx = event.clientY - this.prevmousey;
        var dy = event.clientX - this.prevmousex;
        this.rotate('x', dx / 4);
        this.rotate('y', dy / 4);
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
    }

    onmousewheel(event)
    {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.rotate('z', delta / 4);
        this.prevwheel = delta;
    }

    onmouseup(event)
    {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
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