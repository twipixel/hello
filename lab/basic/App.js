import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';

import Camera from '../../src/basic/core/Camera';
import Device from '../../src/basic/core/Device';
import Matrix from '../../src/basic/geom/Matrix';
import Mesh from '../../src/basic/geom/Mesh';
import Axis from '../../src/basic/shape/Axis';
import Vector3D from '../../src/basic/geom/Vector3D';
import Octahedron from '../../src/basic/shape/Octahedron';
import Icosphere from '../../src/basic/shape/Icosphere';
import ProceduralSphere from '../../src/basic/shape/ProceduralSphere';
import TriakisIcosahedron from '../../src/basic/shape/TriakisIcosahedron';
import HammersleySphere from '../../src/basic/shape/HammersleySphere';
import CoordinateBox from '../../src/basic/debug/CoordinateBox';


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
        this.octahedrons = [];
        this.camera = new Camera();
        this.camera.position.z = -10;

        this.device = new Device(this.canvas.width, this.canvas.height);
        this.stage.addChild(this.device);

        this.createAxis();
        this.createOctahedron(100);

        var sphereShape0 = new ProceduralSphere();
        var sphereShape1 = new Icosphere(1, 1);
        var sphereShape2 = new HammersleySphere(1, 3000);
        var sphere0 = this.sphere0 = new Mesh(sphereShape0);
        var sphere1 = this.sphere1 = new Mesh(sphereShape1);
        var sphere2 = this.sphere2 = new Mesh(sphereShape2);
        this.meshes.push(sphere0);
        this.meshes.push(sphere1);
        this.meshes.push(sphere2);

        sphere0.position.x = -2;
        sphere0.position.z = 2;
        sphere1.position.x = 0;
        sphere1.position.z = 2;
        sphere2.position.x = 2;
        sphere2.position.z = 2;

        // this.createCoordinateBox();
    }

    createAxis()
    {
        var size = 100;
        var xAxis = new Axis(new Vector3D(-size, 0, 0), new Vector3D(size, 0, 0));
        var yAxis = new Axis(new Vector3D(0, -size, 0), new Vector3D(0, size, 0));
        var zAxis = new Axis(new Vector3D(-size, -size, -size), new Vector3D(size, size, size));
        var xAxisMesh = this.xAxisMesh = new Mesh(xAxis);
        var yAxisMesh = this.yAxisMesh = new Mesh(yAxis);
        var zAxisMesh = this.zAxisMesh = new Mesh(zAxis);
        this.meshes.push(xAxisMesh);
        this.meshes.push(yAxisMesh);
        this.meshes.push(zAxisMesh);
    }

    createOctahedron(num)
    {
        var shape, mesh, rotation = 360 / num, degrees, radians, half = num / 2, quater = num / 4;

        for (var i = 0; i < num; i++) {
            shape = new Octahedron();
            mesh = new Mesh(shape);
            degrees = rotation * i;
            radians = Math.toRadians(degrees);
            mesh.position.x = 0 + 30 * Math.cos(radians);
            mesh.position.y = 0 + 3 * Math.sin(radians);
            mesh.position.z = 0 + 30 * Math.sin(radians);

            // if (i > half) {
                this.meshes.push(mesh);
                this.octahedrons.push(mesh);
            // }
        }
    }

    rotateOctahedron()
    {
        var mesh, n = this.octahedrons.length;
        for (var i = 0; i < n; i++) {
            mesh = this.octahedrons[i];
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
        }
    }

    createCoordinateBox()
    {
        var coordinateBox = new CoordinateBox();
        var coordinateBoxMesh = this.coordinateBoxMesh = new Mesh(coordinateBox);
        coordinateBoxMesh.position.z = -500;
        this.meshes.push(coordinateBoxMesh);
    }

    moveCamera(property, value)
    {
        this.camera.position[property] += value;
        console.log('moveCamera(', property, value, '), position:', this.camera.position);
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
        this.camera.target = new Vector3D();

        this.rotateOctahedron();

        this.sphere0.rotation.x += 0.01;
        this.sphere1.rotation.x += 0.01;
        this.sphere2.rotation.x += 0.01;
        this.sphere0.rotation.y += 0.01;
        this.sphere1.rotation.y += 0.01;
        this.sphere2.rotation.y += 0.01;

        //this.camera.yaw += 0.01;
        //this.camera.roll += 0.01;
        //this.camera.pitch += 0.01;

        if (this.coordinateBoxMesh) {
            this.coordinateBoxMesh.rotation.x += 0.01;
            this.coordinateBoxMesh.rotation.y += 0.01;
        }

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