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
import Arrow from './shape/Arrow';
import Octahedron from './shape/Octahedron';
import TriakisIcosahedron from './shape/TriakisIcosahedron';
import SphereOctahedron from './shape/SphereOctahedron';


export default class App
{
    constructor()
    {
        this.app = new PIXI.Application(800, 600, {backgroundColor:0x191919}, true);
        document.body.appendChild(this.app.view);

        //this.app.renderer.roundPixels = true;
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

        var xAxis = new Arrow(new Vector3D(0, 0, 0), new Vector3D(this.cx, 0, 0));
        var yAxis = new Arrow(new Vector3D(0, 0, 0), new Vector3D(0, this.cy, 0));
        var zAxis = new Arrow(new Vector3D(0, 0, 0), new Vector3D(0, 0, this.cx));
        var xMesh = new Mesh(xAxis);
        var yMesh = new Mesh(yAxis);
        var zMesh = new Mesh(zAxis);

        var shape0 = new Octahedron();
        var shape1 = new Octahedron();
        var shape2 = new Octahedron();
        var shape3 = new Octahedron();
        var shape4 = new TriakisIcosahedron();
        var shape5 = new SphereOctahedron();

        var mesh0 = this.mesh0 = new Mesh(shape0);
        var mesh1 = this.mesh1 = new Mesh(shape1);
        var mesh2 = this.mesh2 = new Mesh(shape2);
        var mesh3 = this.mesh3 = new Mesh(shape3);
        var mesh4 = this.mesh4 = new Mesh(shape4);
        var mesh5 = this.mesh5 = new Mesh(shape5);

        this.meshes.push(xMesh);
        this.meshes.push(yMesh);
        this.meshes.push(zMesh);

        this.meshes.push(mesh0);
        this.meshes.push(mesh1);
        this.meshes.push(mesh2);
        this.meshes.push(mesh3);
        this.meshes.push(mesh4);
        this.meshes.push(mesh5);

        mesh0.position.x = 2;
        mesh0.position.y = 2;
        mesh0.position.z = -10;

        mesh1.position.x = 4;
        mesh1.position.y = 4;
        mesh1.position.z = -20;

        mesh2.position.x = 6;
        mesh2.position.y = 6;
        mesh2.position.z = -30;

        mesh3.position.x = 8;
        mesh3.position.y = 8;
        mesh3.position.z = -40;

        //mesh4.position.x = 20;
        mesh4.position.y = 20;
        mesh4.position.z = -80;

        mesh5.x = 0;
        mesh5.y = 0;
        mesh5.z = 0;
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
        this.mesh1.rotation.x += 0.01;
        this.mesh2.rotation.x += 0.01;
        this.mesh3.rotation.x += 0.01;
        this.mesh4.rotation.x += 0.01;
        this.mesh5.rotation.x += 0.01;

        this.mesh0.rotation.y += 0.01;
        this.mesh1.rotation.y += 0.01;
        this.mesh2.rotation.y += 0.01;
        this.mesh3.rotation.y += 0.01;
        this.mesh4.rotation.y += 0.01;
        this.mesh5.rotation.y += 0.01;

        //this.camera.yaw += 0.01;
        //this.camera.roll += 0.01;
        //this.camera.pitch += 0.01;

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