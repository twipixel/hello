import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';


export default class App
{
    constructor()
    {
        this.app = new PIXI.Application(800, 600, {backgroundColor : 0x8BC34A});
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
        this.isAutorotate = false;
        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;

        this.center = new Vertex(0, 11 * this.cy / 10, 0);
        this.cube = new Cube(this.center, 100);
        this.cube.x = 0;
        this.cube.y = 0;
        this.cube.z = 0;
        this.cube.rotateX = 0;
        this.cube.rotateY = 0;
        this.cube.rotateZ = 0;
        this.stage.addChild(this.cube);

        var tween = Be.to(this.cube, {x:this.cx, y:this.cy, rotateY:0.1, rotateZ:0.1}, 4, Linear.easeNone);
        this.initTween = Be.delay(tween, 2);
        this.initTween.play();
    }

    initializeGUI()
    {
        this.gui = new dat.GUI();
        this.config = {
            x:0,
            y:0,
            z:0,
            prevx:0,
            prevy:0,
            prevz:0,
        };
        this.config.autorotate = this.autorotate.bind(this);
        this.config.reset = this.reset.bind(this);
        this.gui.add(this.config, 'x').min(0).max(this.canvas.width).step(1).onChange((value) => {
            var dx = value - this.config.prevx;
            this.config.prevx = value;
            this.cube.setProperty('x', dx);
        });
        this.gui.add(this.config, 'y').min(0).max(this.canvas.height).step(1).onChange((value) => {
            var dy = value - this.config.prevy;
            this.config.prevy = value;
            this.cube.setProperty('y', dy);
        });
        this.gui.add(this.config, 'z').min(-300).max(300).step(1).onChange((value) => {
            var dz = value - this.config.prevz;
            this.config.prevz = value;
            this.cube.setProperty('z', dz);
        });
        this.gui.add(this.config, 'autorotate');
        this.gui.add(this.config, 'reset');
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
        this.cube.render();
    }

    resize()
    {

    }

    autorotate()
    {
        if (!this.autorotateTween) {
            var tween = Be.tween(this.cube,
                {x:this.cx, y:this.cy, rotateX:0.02, rotateY:0.03, rotateZ:0.05},
                {x:this.cube.x, y:this.cube.y, rotateX:0, rotateY:0, rotateZ:0},
                10, Linear.easeNone);

            var reverse = Be.reverse(tween);
            this.autorotateTween = Be.serial(tween, reverse);
            this.autorotateTween.stopOnComplete = false;
        }
        if (this.isAutorotate === false) {
            this.autorotateTween.play();
        }
        else {
            this.autorotateTween.stop();
        }
        this.isAutorotate = !this.isAutorotate;
    }

    reset()
    {
        this.cube.reset();
    }

    onmousedown(event)
    {
        if (this.initTween) {
            this.initTween.stop();
        }
        if (this.autorotateTween) {
            this.autorotateTween.stop();
        }
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
        this.canvas.addEventListener('mousemove', this.mousemoveListener);
    }

    onmousemove(event)
    {
        this.cube.rotateY = (event.clientX - this.prevmousex) * Math.PI / 360;
        this.cube.rotateX = (event.clientY - this.prevmousey) * Math.PI / 360;
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
    }

    onmousewheel(event)
    {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.cube.rotateZ = delta * Math.PI / 360;
        this.prevwheel = delta;
    }

    onmouseup(event)
    {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
    }
}

class Vertex
{
    constructor(x, y, z)
    {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
    }
}

class Vertex2D
{
    constructor(x, y)
    {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }
}

class Edge
{
    constructor(vertex0, vertex1)
    {
        this.vertex0 = vertex0;
        this.vertex1 = vertex1;
    }
}

class Cube extends PIXI.Graphics
{
    constructor()
    {
        super();
        this.initialize();
    }

    initialize()
    {
        var vertex0 = new Vertex(-100, -100, -100);
        var vertex1 = new Vertex(-100, -100,  100);
        var vertex2 = new Vertex(-100,  100, -100);
        var vertex3 = new Vertex(-100,  100,  100);
        var vertex4 = new Vertex(100, -100, -100);
        var vertex5 = new Vertex(100, -100,  100);
        var vertex6 = new Vertex(100,  100, -100);
        var vertex7 = new Vertex(100,  100,  100);

        var edge0  = new Edge(vertex0, vertex1);
        var edge1  = new Edge(vertex1, vertex3);
        var edge2  = new Edge(vertex3, vertex2);
        var edge3  = new Edge(vertex2, vertex0);
        var edge4  = new Edge(vertex4, vertex5);
        var edge5  = new Edge(vertex5, vertex7);
        var edge6  = new Edge(vertex7, vertex6);
        var edge7  = new Edge(vertex6, vertex4);
        var edge8  = new Edge(vertex0, vertex4);
        var edge9  = new Edge(vertex1, vertex5);
        var edge10 = new Edge(vertex2, vertex6);
        var edge11 = new Edge(vertex3, vertex7);

        this.vertices = [vertex0, vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7];
        this.edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11];
    }

    reset()
    {
        this.initialize();
    }

    render()
    {
        var edges = this.edges;
        var vertices = this.vertices;

        this.clear();
        this.lineStyle(1, 0x16a085);

        var edge, v0, v1;
        for (var i = 0; i < edges.length; i++) {
            edge = edges[i];
            v0 = edges[i].vertex0;
            v1 = edges[i].vertex1;
            this.moveTo(v0.x, v0.y);
            this.lineTo(v1.x, v1.y);
        }

        this.beginFill(0x16a085);

        for (var j = 0; j < vertices.length; j++) {
            var vertex = vertices[j];
            this.drawCircle(vertex.x, vertex.y);
        }

        // draw center
        this.drawCircle(0, 0, 5);
        this.endFill();
    }

    setProperty(propertyName, value)
    {
        var n = this.vertices.length;

        for (var i = 0; i < n; i++) {
            var vertex = this.vertices[i];
            vertex[propertyName] += value;
        }
    }

    set rotateX(theta)
    {
        this._rotateX = theta;
        var vertices = this.vertices;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var n = 0; n < vertices.length; n++) {
            var vertex = vertices[n];
            var y = vertex.y;
            var z = vertex.z;
            vertex.y = y * cosTheta - z * sinTheta;
            vertex.z = z * cosTheta + y * sinTheta;
        }
    }

    get rotateX()
    {
        return this._rotateX;
    }

    set rotateY(theta)
    {
        this._rotateY = theta;
        var vertices = this.vertices;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var n = 0; n < vertices.length; n++) {
            var vertex = vertices[n];
            var x = vertex.x;
            var z = vertex.z;
            vertex.x = x * cosTheta - z * sinTheta;
            vertex.z = z * cosTheta + x * sinTheta;
        }
    }

    get rotateY()
    {
        return this._rotateY;
    }

    set rotateZ(theta)
    {
        this._rotateZ = theta;
        var vertices = this.vertices;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var n = 0; n < vertices.length; n++) {
            var vertex = vertices[n];
            var x = vertex.x;
            var y = vertex.y;
            vertex.x = x * cosTheta - y * sinTheta;
            vertex.y = y * cosTheta + x * sinTheta;
        }
    }

    get rotateZ()
    {
        return this._rotateZ;
    }
}