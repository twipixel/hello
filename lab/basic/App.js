import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';

import Camera from './core/Camera';
import Device from './core/Device';
import Matrix from './geom/Matrix';
import Mesh from './geom/Mesh';
import Vector3D from './geom/Vector3D';
import Octahedron from './shape/Octahedron';
import TriakisIcosahedron from './shape/TriakisIcosahedron';


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
        this.addEvent();
    }

    initialize()
    {
        this.meshes = [];
        this.camera = new Camera();
        this.device = new Device(this.canvas.width, this.canvas.height);
        //this.device.x = this.camera.width / 2;
        //this.device.y = this.canvas.height / 2;

        var shape0 = new TriakisIcosahedron();
        var shape1 = new Octahedron();
        var shape2 = new Octahedron();
        var shape3 = new Octahedron();
        var shape4 = new Octahedron();

        var mesh0 = new Mesh(shape0);
        var mesh1 = new Mesh(shape1);
        var mesh2 = new Mesh(shape2);
        var mesh3 = new Mesh(shape3);
        var mesh4 = new Mesh(shape4);

        this.meshes.push(mesh0);
        this.meshes.push(mesh1);
        this.meshes.push(mesh2);
        this.meshes.push(mesh3);
        this.meshes.push(mesh4);
    }

    initializeGUI()
    {
        this.config = {};
        this.gui = new dat.GUI();
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

    render(ms)
    {
        this.device.render(this.camera, this.meshes);
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
        //this.rotate('x', dx / 4);
        //this.rotate('y', dy / 4);
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
    }

    onmousewheel(event)
    {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //this.rotate('z', delta / 4);
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