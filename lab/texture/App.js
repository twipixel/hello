import Index from './geom/Index';
import UVData from './geom/UVData';
import Vector3D from './geom/Vector3D';
import GraphicsTrianglePath from './geom/GraphicsTrianglePath';


export default class App {
    constructor() {
        this.app = new PIXI.Application(800, 600, {backgroundColor: 0x191919}, true);
        document.body.appendChild(this.app.view);

        //this.app.renderer.roundPixels = true;
        window.canvas = this.canvas = this.app.renderer.view;
        window.ctx = this.canvas.getContext('2d');
        window.stage = this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.addEvent();
    }

    initialize() {
        var graphics = this.graphics = this.g = new PIXI.Graphics();
        graphics.x = this.cx;
        graphics.y = this.cy;
        this.stage.addChild(graphics);

        var blocksize = this.blocksize = 28;

        var image = this.image = document.getElementById('source');
        //document.body.appendChild(image);

        var canvas = this.canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        //canvas.style.borderWidth = 'thin';
        canvas.style.borderStyle = 'solid';
        canvas.style.borderColor = '#BDC3C7';
        document.body.appendChild(canvas);
        canvas.width = image.width;
        canvas.height = image.height;

        var sourceCanvas = this.sourceCanvas = document.createElement('canvas');
        //sourceCanvas.style.position = 'absolute';
        //sourceCanvas.style.borderWidth = 'thin';
        sourceCanvas.style.borderStyle = 'solid';
        sourceCanvas.style.borderColor = '#6C7A89';
        document.body.appendChild(sourceCanvas);
        sourceCanvas.width = image.width;
        sourceCanvas.height = image.height;

        var context = this.context = this.canvas.getContext('2d');
        var sourceContext = this.sourceContext = this.sourceCanvas.getContext('2d');

        //void ctx.drawImage(image, dx, dy);
        //void ctx.drawImage(image, dx, dy, dWidth, dHeight);
        //void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        //sourceContext.drawImage(image, 0, 0);
        //sourceContext.drawImage(image, 0, 0, blocksize, blocksize);
        //sourceContext.drawImage(image, blocksize, blocksize, blocksize, blocksize, 0, 0, blocksize, blocksize);

        context.drawImage(image, 0, 0);


        this.createRectangle();
    }

    createRectangle() {

    }


    rotatePlane() {
        /*var ticker = getTimer() / 400;
        z2 = z3 = -(z1 = z4 = 100 * Math.sin(ticker));
        x2 = x3 = -(x1 = x4 = 100 * Math.cos(ticker));

        t1 = focalLength / (focalLength + z1);
        t2 = focalLength / (focalLength + z2);
        t3 = focalLength / (focalLength + z3);
        t4 = focalLength / (focalLength + z4);

        var vertices = [];
        vertices.push(x1 * t1, y1 * t1, x2 * t2, y2 * t2, x3 * t3, y3 * t3, x4 * t4, y4 * t4);

        var uvtData = [];
        uvtData.push(0, 0, t1, 1, 0, t2, 1, 1, t3, 0, 1, t4);

        // draw
        container.graphics.clear();
        container.graphics.beginBitmapFill(bitmapData);
        container.graphics.drawTriangles(vertices, indices, uvtData);*/
    }


    initializeGUI() {
        this.config = {};
        this.gui = new dat.GUI();
    }

    addEvent() {
        this.prevwheel = 0;
        this.stage.interactive = true;
        this.mousemoveListener = this.onmousemove.bind(this);
        this.canvas.addEventListener('mousedown', this.onmousedown.bind(this));
        this.canvas.addEventListener('mouseup', this.onmouseup.bind(this));
        this.canvas.addEventListener('mouseout', this.onmouseup.bind(this));
        this.canvas.addEventListener('mousewheel', this.onmousewheel.bind(this));
    }

    resize() {
    }

    onmousedown(event) {
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
        this.canvas.addEventListener('mousemove', this.mousemoveListener);
    }

    onmousemove(event) {
        var dx = event.clientY - this.prevmousey;
        var dy = event.clientX - this.prevmousex;
        //this.rotateWorld('x', Math.toRadians(dx));
        //this.rotateWorld('y', Math.toRadians(dy));
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
    }

    onmousewheel(event) {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //this.moveCamera('z', delta);
        this.prevwheel = delta;
    }

    onmouseup(event) {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
    }

    get cx() {
        return this.canvas.width / 2;
    }

    get cy() {
        return this.canvas.height / 2;
    }
}