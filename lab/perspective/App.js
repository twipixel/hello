import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';
import Camera from './core/Camera';
import DeviceWithWorld from './core/DeviceWithWorld';
import Matrix from './geom/Matrix';
import Mesh from './geom/Mesh';
import Vector3D from './geom/Vector3D';
import Cube from './shape/Cube';


export default class App
{
    constructor()
    {
        this.app = new PIXI.Application(800, 600, {backgroundColor: 0x191919}, true);
        document.body.appendChild(this.app.view);

        this.canvas = this.app.renderer.view;
        this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.addEvent();
        this.tick();
    }

    initialize()
    {
        this.meshes = [];

        var size = 10;
        this.camera = new Camera();
        this.camera.position.z = -200;
        this.world = new Mesh({faces:[], vertices:[]});
        this.device = new DeviceWithWorld(this.canvas.width, this.canvas.height);
        this.stage.addChild(this.device);

        var shape = new Cube(size, size, size);
        var cube = this.cube = new Mesh(shape);
        this.meshes.push(cube);
    }

    render(ms)
    {
        this.camera.target = new Vector3D();
        //this.device.render(this.world, this.camera, this.meshes);

        this.device.clear();
        var meshes = this.device.projection(this.world, this.camera, this.meshes);

        /*
        for (var i = 0; i < meshes.length; i++) {
            var mesh = meshes[i];

            for (var j = 0; j < mesh.faces.length; j++) {
                var face = mesh.faces[j];
                this.device.drawTriangle(mesh.vertices[face.A], mesh.vertices[face.B], mesh.vertices[face.C], face.color, face.alpha);
            }
        }
        */
    }

    initializeGUI()
    {
        this.config = {};
        this.gui = new dat.GUI();
    }

    addEvent()
    {
        if (this.stage) {
            this.prevwheel = 0;
            this.stage.interactive = true;
            this.mousemoveListener = this.onmousemove.bind(this);
            this.canvas.addEventListener('mousedown', this.onmousedown.bind(this));
            this.canvas.addEventListener('mouseup', this.onmouseup.bind(this));
            this.canvas.addEventListener('mouseout', this.onmouseup.bind(this));
            this.canvas.addEventListener('mousewheel', this.onmousewheel.bind(this));
        }
    }

    tick(ms)
    {
        this.render(ms);
        requestAnimationFrame(this.tick.bind(this));
    }

    resize() {}

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
        this.rotateWorld('x', Math.toRadians(dx));
        this.rotateWorld('y', Math.toRadians(dy));
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
    }

    onmousewheel(event)
    {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.moveCamera('z', delta);
        this.prevwheel = delta;
    }

    onmouseup(event) {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
    }

    moveCamera(property, value)
    {
        this.camera.position[property] += value;
        console.log('moveCamera(', property, value, '), position:', this.camera.position);
    }

    moveWorld(property, value)
    {
        this.world.position[property] += value;
        console.log('moveWorld(', property, value, '), position:', this.world.position);
    }

    rotateWorld(property, value)
    {
        this.world.rotation[property] += value;
        console.log('rotateWorld(', property, value, '), rotation:', this.world.rotation);
    }

    zoomIn()
    {
        Be.to(this.camera.position, {x:0, y:0, z:-50}, 1, Quad.easeOut).play();
    }

    zoomOut()
    {
        Be.to(this.camera.position, {x:0, y:0, z:-300}, 1, Quad.easeOut).play();
    }

    reset()
    {
        var wt = Be.to(this.world.position, {x:0, y:0, z:0}, 1, Quad.easeOut);
        var wr = Be.to(this.world.rotation, {x:0, y:0, z:0}, 1, Quad.easeOut);
        var ct = Be.to(this.camera.position, {x:0, y:0, z:-300}, 1, Quad.easeOut);

        Be.parallel(wt, wr, ct).play();

        //this.world.position = new Vector3D();
        //this.world.rotation = new Vector3D();
        //this.camera.position = new Vector3D(0, 0, -10);
        //console.log('camera.position:', this.camera.position);
    }

    /*get canvas()
    {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
        }
        return this._canvas;
    }

    get ctx()
    {
        if (!this._context) {
            this._context = this.canvas.getContext('2d');
        }
        return this._context;
    }*/

    get w()
    {
        return this.canvas.width;
    }

    get h()
    {
        return this.canvas.height;
    }

    get cx()
    {
        if (!this._cx) {
            this._cx = this.canvas.width / 2;
        }
        return this._cx;
    }

    get cy()
    {
        if (!this._cy) {
            this._cy = this.canvas.height / 2;
        }
        return this._cy;
    }

    get img()
    {
        return document.getElementById('source');
    }
}