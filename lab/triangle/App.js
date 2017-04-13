import Face from './geom/Face';
import UVData from './geom/UVData';
import Matrix from './geom/Matrix';
import Vector3D from './geom/Vector3D';


export default class App {
    constructor() {
        //this.app = new PIXI.Application(800, 600, {backgroundColor: 0x191919}, true);
        //document.body.appendChild(this.app.view);
        //
        ////this.app.renderer.roundPixels = true;
        //window.canvas = this.canvas = this.app.renderer.view;
        //window.ctx = this.canvas.getContext('2d');
        //window.stage = this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.addEvent();
    }

    initialize() {

        if (this.stage) {
            var graphics = this.graphics = this.g = new PIXI.Graphics();
            graphics.x = this.cx;
            graphics.y = this.cy;
            this.stage.addChild(graphics);
        }

        var size = 380;
        var blocksize = this.blocksize = 28;

        var image = this.image = document.getElementById('source');
        //document.body.appendChild(image);

        var destinationCanvas = this.destinationCanvas = document.createElement('canvas');
        destinationCanvas.style.position = 'absolute';
        //destinationCanvas.style.borderWidth = 'thin';
        destinationCanvas.style.borderStyle = 'solid';
        destinationCanvas.style.borderColor = '#BDC3C7';
        document.body.appendChild(destinationCanvas);
        destinationCanvas.width = size;
        destinationCanvas.height = size;
        var destinationContext = this.destinationContext = destinationCanvas.getContext('2d');

        var sourceCanvas = this.sourceCanvas = document.createElement('canvas');
        sourceCanvas.style.position = 'absolute';
        sourceCanvas.style.left = (size + 20) + 'px';
        //sourceCanvas.style.borderWidth = 'thin';
        sourceCanvas.style.borderStyle = 'solid';
        sourceCanvas.style.borderColor = '#BDC3C7';
        document.body.appendChild(sourceCanvas);
        sourceCanvas.width = size;
        sourceCanvas.height = size;
        var sourceContext = this.sourceContext = sourceCanvas.getContext('2d');

        //void ctx.drawImage(image, dx, dy);
        //void ctx.drawImage(image, dx, dy, dWidth, dHeight);
        //void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        sourceContext.drawImage(image, 0, 0);
        //sourceContext.drawImage(image, 0, 0, blocksize, blocksize);
        //sourceContext.drawImage(image, blocksize, blocksize, blocksize, blocksize, 0, 0, blocksize, blocksize);

        //destinationContext.drawImage(image, 0, 0);

        //this.createTriangle();
        this.createImage();
    }

    createTriangle()
    {
        var blocksize = 28;

        var sourceImageData = this.sourceContext.getImageData(0, 0, this.sourceCanvas.width, this.sourceCanvas.height);
        var s0 = new Vector3D(0, 0, 0);
        var s1 = new Vector3D(0, blocksize, 0);
        var s2 = new Vector3D(blocksize, blocksize, 0);
        var sourceTriangle = new Face(s0, s1, s2);

        this.drawTriangle(this.sourceContext, sourceTriangle);

        var destinationImageData = this.destinationContext.getImageData(0, 0, this.destinationCanvas.width, this.destinationCanvas.height);
        var d0 = new Vector3D(0, 0, 0);
        var d1 = new Vector3D(0, blocksize * 4, 0);
        var d2 = new Vector3D(blocksize * 4, blocksize * 4, 0);
        var destinationTriangle = new Face(d0, d1, d2);

        this.mapTriangle(sourceImageData, sourceTriangle, destinationImageData, destinationTriangle);

        /*this.map_triangle(sourceImageData, [
            [sourceV0.x, sourceV0.y],
            [sourceV1.x, sourceV1.y],
            [sourceV2.x, sourceV2.y]
        ], destinationImageData, [
            [destinationV0.x, destinationV0.y],
            [destinationV1.x, destinationV1.y],
            [destinationV2.x, destinationV2.y]
        ]);*/

        this.destinationContext.putImageData(destinationImageData, 0, 0);
    }

    /**
     * Rectangle 을 생성하고 y 좌표로 회전한 후 회전된 점좌표로 표면 버텍스 좌표로 사용합니다.
     */
    createImage()
    {
        var w = this.sourceCanvas.width - 150;
        var h = this.sourceCanvas.height - 150;

        var position = new Vector3D(0, 0, 0);
        //var rotation = new Vector3D(0, 0, 0);
        var rotation = new Vector3D(Math.toRadians(0), Math.toRadians(80), 0);

        var rotationMatrix = Matrix.rotateX(rotation.x).multiply(Matrix.rotateY(rotation.y)).multiply(Matrix.rotateZ(rotation.z));
        var transformMatrix = Matrix.translation(position.x, position.y, position.z);


        // 사각형 생성
        var vertices = this.vertices = [
            new Vector3D(0, 0, 0),
            new Vector3D(0, h, 0),
            new Vector3D(w, h, 0),
            new Vector3D(w, 0, 0)
        ];

        this.faces = [
            new Face(0, 0, 1, 0xA2DED0),
            new Face(1, 1, 2, 0xA2DED0),
            new Face(2, 2, 3, 0xA2DED0),
            new Face(3, 3, 0, 0xA2DED0)
        ];

        for (var i = 0; i < vertices.length; i++) {
            var v = vertices[i];
            v = Vector3D.transformCoordinates(v, rotationMatrix);
            v = Vector3D.transformCoordinates(v, transformMatrix);
            vertices[i] = v;
        }

        //this.drawTriangle(this.destinationContext, new Face(vertices[0], vertices[1], vertices[2]));
        //this.drawTriangle(this.destinationContext, new Face(vertices[0], vertices[2], vertices[3]));

        var sourceImageData = this.sourceContext.getImageData(0, 0, w, h);
        var s0 = new Vector3D(0, 0, 0);
        var s1 = new Vector3D(0, h, 0);
        var s2 = new Vector3D(w, h, 0);
        var left = new Face(s0, s1, s2);

        var s3 = new Vector3D(0, 0, 0);
        var s4 = new Vector3D(w, h, 0);
        var s5 = new Vector3D(w, 0, 0);

        var right = new Face(s3, s4, s5);

        this.drawTriangle(this.sourceContext, left);
        this.drawTriangle(this.sourceContext, right);

        var destinationImageData = this.destinationContext.getImageData(0, 0, this.destinationCanvas.width, this.destinationCanvas.height);
        var d0 = new Vector3D(0, h / 3, 0);
        var d1 = new Vector3D(0, h, 0);
        var d2 = new Vector3D(w, h, 0);
        //var dleft = new Face(d0, d1, d2);
        var dleft = new Face(vertices[0], vertices[1], vertices[2]);
        this.mapTriangle(sourceImageData, left, destinationImageData, dleft);

        var d3 = new Vector3D(0, 0, 0);
        var d4 = new Vector3D(w, 0, 0);
        var d5 = new Vector3D(w, h, 0);
        //var dright = new Face(d3, d4, d5);
        var dright = new Face(vertices[0], vertices[2], vertices[3]);
        this.mapTriangle(sourceImageData, right, destinationImageData, dright);

        this.destinationContext.putImageData(destinationImageData, 0, 0);
        this.drawPoint(this.destinationContext, vertices);
        this.drawTriangle(this.destinationContext, new Face(vertices[0], vertices[1], vertices[2]));
        this.drawTriangle(this.destinationContext, new Face(vertices[0], vertices[2], vertices[3]));
    }

    drawPoint(ctx, points)
    {
        var size = 5;
        var half = size / 2;

        ctx.save();
        ctx.fillStyle = '#BF55EC';

        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            ctx.fillRect(p.x - half, p.y - half, size, size);
            //ctx.fillRect(p.x, p.y, size, size);
        }

        ctx.restore();
    }

    drawTriangle(ctx, triangle)
    {
        ctx.save();
        ctx.strokeStyle = '#BF55EC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(triangle.A.x, triangle.A.y);
        ctx.lineTo(triangle.B.x, triangle.B.y);
        ctx.lineTo(triangle.C.x, triangle.C.y);
        ctx.lineTo(triangle.A.x, triangle.A.y);
        ctx.stroke();
        ctx.restore();
    }

    mapTriangle(src_image_data, src_triangle, dst_image_data, dst_triangle)
    {
        const PIXEL_WIDTH = 4;

        var src_pixel_data = src_image_data.data;
        var dst_pixel_data = dst_image_data.data;

        for (var x = 0; x < dst_image_data.width; x++) {
            for (var y = 0; y < dst_image_data.height; y++) {
                var uv = this.cartesianToBarycentric(dst_triangle, new Vector3D(x, y));

                // Did I forget to mention this other lovely aspect of barycentric coords?
                var xy_in_triangle = (uv.u >= 0) && (uv.v >= 0) && (uv.u + uv.v <= 1);

                var dst_pixel_start = PIXEL_WIDTH * (x + y * dst_image_data.width);

                if (xy_in_triangle) {
                    var src_xy = this.barycentricToCartesian(src_triangle, uv);
                    var src_pixel_start = PIXEL_WIDTH * (Math.floor(src_xy.x) + Math.floor(src_xy.y) * src_image_data.width);

                    dst_pixel_data[dst_pixel_start] = src_pixel_data[src_pixel_start];
                    dst_pixel_data[dst_pixel_start + 1] = src_pixel_data[src_pixel_start + 1];
                    dst_pixel_data[dst_pixel_start + 2] = src_pixel_data[src_pixel_start + 2];
                    dst_pixel_data[dst_pixel_start + 3] = src_pixel_data[src_pixel_start + 3];
                } else {
                    //dst_pixel_data[dst_pixel_start] = 255;
                    //dst_pixel_data[dst_pixel_start + 1] = 255;
                    //dst_pixel_data[dst_pixel_start + 2] = 255;
                    //dst_pixel_data[dst_pixel_start + 3] = 255;
                }
            }
        }

        console.log('done');
    }

    cartesianToBarycentric(face, xy)
    {
        var a = face.A;
        var b = face.B;
        var c = face.C;

        var v0 = Vector3D.subtract(c, a);
        var v1 = Vector3D.subtract(b, a);
        var v2 = Vector3D.subtract(xy, a);

        // Compute dot products
        var dot00 = Vector3D.dot(v0, v0);
        var dot01 = Vector3D.dot(v0, v1);
        var dot02 = Vector3D.dot(v0, v2);
        var dot11 = Vector3D.dot(v1, v1);
        var dot12 = Vector3D.dot(v1, v2);

        // Compute barycentric coordinates
        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return new UVData(u, v);

    }

    barycentricToCartesian(face, uv)
    {
        var a = face.A;
        var ba = Vector3D.subtract(face.B, a);
        var ca = Vector3D.subtract(face.C, a);
        var k = Vector3D.multiply(uv.u, ca);
        var m = Vector3D.multiply(uv.v, ba);
        var b = Vector3D.add(k, m);
        return Vector3D.add(a, b);
    }

    map_triangle(src_image_data, src_triangle, dst_image_data, dst_triangle)
    {
        const PIXEL_WIDTH = 4;
        var src_pixel_data = src_image_data.data;
        var dst_pixel_data = dst_image_data.data;

        for (var x = 0; x < dst_image_data.width; x++) {
            for (var y = 0; y < dst_image_data.height; y++) {
                var uv = this.cartesian_to_barycentric(dst_triangle, [x, y]);

                // Did I forget to mention this other lovely aspect of barycentric coords?
                var xy_in_triangle = (uv[0] >= 0) && (uv[1] >= 0) && (uv[0] + uv[1] <= 1);

                var dst_pixel_start = PIXEL_WIDTH * (x + y * dst_image_data.width);

                if (xy_in_triangle) {
                    var src_xy = this.barycentric_to_cartesian(src_triangle, uv);
                    var src_pixel_start = PIXEL_WIDTH * (Math.floor(src_xy[0]) + Math.floor(src_xy[1]) * src_image_data.width);

                    dst_pixel_data[dst_pixel_start] = src_pixel_data[src_pixel_start];
                    dst_pixel_data[dst_pixel_start + 1] = src_pixel_data[src_pixel_start + 1];
                    dst_pixel_data[dst_pixel_start + 2] = src_pixel_data[src_pixel_start + 2];
                    dst_pixel_data[dst_pixel_start + 3] = src_pixel_data[src_pixel_start + 3];
                } else {
                    dst_pixel_data[dst_pixel_start] = 255;
                    dst_pixel_data[dst_pixel_start + 1] = 255;
                    dst_pixel_data[dst_pixel_start + 2] = 255;
                    dst_pixel_data[dst_pixel_start + 3] = 255;
                }
            }
        }

        console.log('done');
    }

    // Vector math
    add(v0, v1)
    {
        return [v0[0] + v1[0], v0[1] + v1[1]];
    }
    sub(v0, v1)
    {
        return [v0[0] - v1[0], v0[1] - v1[1]];
    }
    dot(v0, v1)
    {
        return v0[0] * v1[0] + v0[1] * v1[1];
    }
    mul(k, v)
    {
        return [k * v[0], k * v[1]];
    }
    p2v(p)
    {
        return [p.x, p.y];
    }
    v2p(v)
    {
        return {x: v[0], y: v[1]};
    }

    cartesian_to_barycentric(triangle, xy)
    {
        var a = triangle[0];
        var b = triangle[1];
        var c = triangle[2];

        var v0 = this.sub(c, a);
        var v1 = this.sub(b, a);
        var v2 = this.sub(xy, a);

        // Compute dot products
        var dot00 = this.dot(v0, v0)
        var dot01 = this.dot(v0, v1)
        var dot02 = this.dot(v0, v2)
        var dot11 = this.dot(v1, v1)
        var dot12 = this.dot(v1, v2)

        // Compute barycentric coordinates
        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom

        return [u, v];

    }

    barycentric_to_cartesian(triangle, uv)
    {
        var a = triangle[0];
        var ba = this.sub(triangle[1], a);
        var ca = this.sub(triangle[2], a);

        return this.add(a, this.add(this.mul(uv[0], ca),this.mul(uv[1], ba)));
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
        //this.rotateWorld('x', Math.toRadians(dx));
        //this.rotateWorld('y', Math.toRadians(dy));
        this.prevmousex = event.clientX;
        this.prevmousey = event.clientY;
    }

    onmousewheel(event)
    {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //this.moveCamera('z', delta);
        this.prevwheel = delta;
    }

    onmouseup(event) {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
    }

    /*get cx() {
        return this.canvas.width / 2;
    }

    get cy() {
        return this.canvas.height / 2;
    }*/
}