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
    }

    initialize()
    {
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

        var tween = Be.to(this.cube, {x:this.cx, y:this.cy, rotateY:0.1, rotateZ:0.1}, 8, Linear.easeNone);
        var delay = Be.delay(tween, 2);
        delay.play();
    }

    initializeGUI()
    {
        this.gui = new dat.GUI();
    }

    tick(ms)
    {
        this.render(ms);
        requestAnimationFrame(this.tick.bind(this));
    }

    render(ms)
    {
        this.cube.render();
    }

    resize()
    {

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

    render()
    {
        var edges = this.edges;
        var vertices = this.vertices;

        this.clear();
        this.lineStyle(1, 0xFF3300);

        var edge, v0, v1;

        for (var i = 0; i < edges.length; i++) {
            edge = edges[i];
            v0 = edges[i].vertex0;
            v1 = edges[i].vertex1;
            this.moveTo(v0.x, v0.y);
            this.lineTo(v1.x, v1.y);
        }

        this.beginFill(0xFF3300, 0.5);

        for (var j = 0; j < vertices.length; j++) {
            var vertex = vertices[j];
            this.drawCircle(vertex.x, vertex.y, 8);
        }

        this.endFill();
    }

    set rotateX(theta)
    {
        console.log('rotateX(', theta, ')');
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