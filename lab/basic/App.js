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
        this.stage.addChild(this.device);

        var shape0 = new TriakisIcosahedron();
        var shape1 = new Octahedron();
        var shape2 = new Octahedron();
        var shape3 = new Octahedron();
        var shape4 = new Octahedron();

        var mesh0 = this.mesh0 = new Mesh(shape0);
        var mesh1 = this.mesh1 = new Mesh(shape1);
        var mesh2 = this.mesh2 = new Mesh(shape2);
        var mesh3 = this.mesh3 = new Mesh(shape3);
        var mesh4 = this.mesh4 = new Mesh(shape4);

        this.meshes.push(mesh0);
        this.meshes.push(mesh1);
        this.meshes.push(mesh2);
        this.meshes.push(mesh3);
        this.meshes.push(mesh4);

        mesh0.position.x =1;
        mesh0.position.z = -20;

        mesh1.position.x =5;
        mesh1.position.y = 10;
        mesh1.position.z = -20;

        mesh2.position.y = 4;
        mesh2.position.z =-10;

        mesh3.position.x =-2;
        mesh3.position.y =-2;
        mesh3.position.z =-2;

        mesh4.position.x =5;
        mesh4.position.y =5;
        mesh4.position.z =-10;
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
        this.mesh0.rotation.x += 0.01;
        this.mesh0.rotation.z += 0.01;

        this.mesh1.rotation.y += 0.01;
        this.mesh2.rotation.y += 0.01;
        this.mesh3.rotation.y += 0.01;
        this.mesh4.rotation.y += 0.01;

        this.mesh1.rotation.z += 0.01;
        this.mesh2.rotation.x += 0.01;
        this.mesh3.rotation.z += 0.01;
        this.mesh4.rotation.x += 0.01;

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