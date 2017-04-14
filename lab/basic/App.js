import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';

import Camera from './core/Camera';
import Device from './core/Device';
import DeviceWithWorld from './core/DeviceWithWorld';
import Matrix from './geom/Matrix';
import Mesh from './geom/Mesh';
import Axis from './shape/Axis';
import Vector3D from './geom/Vector3D';
import Octahedron from './shape/Octahedron';
import Icosphere from './shape/Icosphere';
import ProceduralSphere from './shape/ProceduralSphere';
import TriakisIcosahedron from './shape/TriakisIcosahedron';
import HammersleySphere from './shape/HammersleySphere';
import CoordinateBox from './debug/CoordinateBox';
import Triangle from './shape/Triangle';
import Rectangle from './shape/Rectangle';
import Cube from './shape/Cube';
import Num from './debug/Num';
import Arrow from './shape/Arrow';


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
        this.camera.position.z = -200;

        //this.device = new Device(this.canvas.width, this.canvas.height);
        this.device = new DeviceWithWorld(this.canvas.width, this.canvas.height);
        this.stage.addChild(this.device);

        this.world = new Mesh({faces:[], vertices:[]});

        //this.createTriangle(30);
        //this.createRectangle(30, 30);
        //this.createCube(15);
        //this.createOctahedron(100);
        this.createSphere();

        this.createAxis(30);
        //this.createAxisLine();
        this.createCoordinateBox(30, 30, 30);
    }

    createAxis(size = 10)
    {
        if (!this.xArrow) {
            var center = new Vector3D();
            var ax = new Arrow('x', center, new Vector3D(size, 0, 0));
            var ay = new Arrow('y', center, new Vector3D(0, size, 0));
            var az = new Arrow('z', center, new Vector3D(0, 0, size));
            var xArrow = this.xArrow = new Mesh(ax);
            var yArrow = this.yArrow = new Mesh(ay);
            var zArrow = this.zArrow = new Mesh(az);
        }

        this.meshes.push(this.xArrow);
        this.meshes.push(this.yArrow);
        this.meshes.push(this.zArrow);
    }

    createAxisLine(size = 100)
    {
        if (!this.xAxis) {
            var x = new Axis(new Vector3D(-size, 0, 0), new Vector3D(size, 0, 0));
            var y = new Axis(new Vector3D(0, -size, 0), new Vector3D(0, size, 0));
            var z = new Axis(new Vector3D(-size, -size, -size), new Vector3D(size, size, size));
            var xAxis = this.xAxis = new Mesh(x);
            var yAxis = this.yAxis = new Mesh(y);
            var zAxis = this.zAxis = new Mesh(z);
        }

        this.meshes.push(this.xAxis);
        this.meshes.push(this.yAxis);
        this.meshes.push(this.zAxis);
    }

    createCoordinateBox(x = 50, y = 50, z = 50)
    {
        if (!this.coordinateBox) {
            var shape = new CoordinateBox(x, y, z);
            var coordinateBox = this.coordinateBox = new Mesh(shape);
        }

        this.meshes.push(this.coordinateBox);
    }

    createTriangle(size = 10)
    {
        this.removeAll();

        if (!this.triangle) {
            var shape = new Triangle(size);
            var triangle = this.triangle = new Mesh(shape);
        }

        this.meshes.push(this.triangle);
    }

    createRectangle(width = 10, height = 10)
    {
        this.removeAll();

        if (!this.rectangle) {
            var shape = new Rectangle(width, height);
            var rectangle = this.rectangle = new Mesh(shape);
        }

        this.meshes.push(this.rectangle);
    }

    createCube(size = 10)
    {
        this.removeAll();

        if (!this.cube) {
            var shape = new Cube(size, size, size);
            var cube = this.cube = new Mesh(shape);
        }

        this.meshes.push(this.cube);
    }

    createOctahedron(num = 100)
    {
        this.removeAll();

        var shape, mesh, rotation = 360 / num, degrees, radians, half = num / 2, quater = num / 4;
        if (this.octahedrons.length === 0) {
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
        else {
            num = this.octahedrons.length;
            for (var i = 0; i < num; i++) {
                // if (i > half) {
                this.meshes.push(this.octahedrons[i]);
                // }
            }
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

    rotateSphere()
    {
        if (this.sphere0) {
            this.sphere0.rotation.x += 0.01;
            this.sphere1.rotation.x += 0.01;
            this.sphere2.rotation.x += 0.01;
            this.sphere0.rotation.y += 0.01;
            this.sphere1.rotation.y += 0.01;
            this.sphere2.rotation.y += 0.01;
        }
    }

    createSphere()
    {
        this.removeAll();

        if (!this.sphere0) {
            var sphereShape0 = new ProceduralSphere(10);
            var sphereShape1 = new Icosphere(10, 1);
            var sphereShape2 = new HammersleySphere(10, 3000);
            var sphere0 = this.sphere0 = new Mesh(sphereShape0);
            var sphere1 = this.sphere1 = new Mesh(sphereShape1);
            var sphere2 = this.sphere2 = new Mesh(sphereShape2);
            sphere0.position.x = -20;
            sphere1.position.x = 0;
            sphere2.position.x = 20;
        }

        this.meshes.push(this.sphere0);
        this.meshes.push(this.sphere1);
        this.meshes.push(this.sphere2);
    }

    removeAll()
    {
        this.meshes = [];
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

    clear()
    {
        this.removeAll();
    }

    initializeGUI()
    {
        this.config = {};
        this.gui = new dat.GUI();

        this.config.createTriangle = this.createTriangle.bind(this);
        this.config.createRectangle = this.createRectangle.bind(this);
        this.config.createCube = this.createCube.bind(this);
        this.config.createSphere = this.createSphere.bind(this);
        this.config.createOctahedron = this.createOctahedron.bind(this);
        this.config.createAxis = this.createAxis.bind(this);
        this.config.createAxisLine = this.createAxisLine.bind(this);
        this.config.createCoordinateBox = this.createCoordinateBox.bind(this);
        this.config.zoomIn = this.zoomIn.bind(this);
        this.config.zoomOut = this.zoomOut.bind(this);
        this.config.reset = this.reset.bind(this);
        this.config.clear = this.clear.bind(this);

        this.gui.add(this.config, 'createTriangle');
        this.gui.add(this.config, 'createRectangle');
        this.gui.add(this.config, 'createCube');
        this.gui.add(this.config, 'createSphere');
        this.gui.add(this.config, 'createOctahedron');
        this.gui.add(this.config, 'createAxis');
        this.gui.add(this.config, 'createAxisLine');
        this.gui.add(this.config, 'createCoordinateBox');
        this.gui.add(this.config, 'zoomIn');
        this.gui.add(this.config, 'zoomOut');
        this.gui.add(this.config, 'reset');
        this.gui.add(this.config, 'clear');
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

        //this.rotateOctahedron();
        //this.rotateSphere();

        this.device.render(this.world, this.camera, this.meshes);
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