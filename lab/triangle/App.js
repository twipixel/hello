import Face from './geom/Face';
import UVData from './geom/UVData';
import Matrix from './geom/Matrix';
import Vector3D from './geom/Vector3D';


export default class App {
    constructor() {
        //this.app = new PIXI.Application(800, 600, {backgroundColor: 0x191919}, true);
        //document.body.appendChild(this.app.view);

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

        var image = this.image = document.getElementById('source');
        //document.body.appendChild(image);

        var blocksize = 28;
        var size = image.width;

        var destinationCanvas = this.destinationCanvas = document.createElement('canvas');
        destinationCanvas.style.position = 'absolute';
        destinationCanvas.style.top = 30 + 'px';
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
        sourceCanvas.style.top = 30 + 'px';
        //sourceCanvas.style.borderWidth = 'thin';
        sourceCanvas.style.borderStyle = 'solid';
        sourceCanvas.style.borderColor = '#BDC3C7';
        document.body.appendChild(sourceCanvas);
        sourceCanvas.width = size;
        sourceCanvas.height = size;
        var sourceContext = this.sourceContext = sourceCanvas.getContext('2d');

        sourceContext.drawImage(image, 0, 0);
        //sourceContext.drawImage(image, 0, 0, blocksize, blocksize);
        //sourceContext.drawImage(image, blocksize, blocksize, blocksize, blocksize, 0, 0, blocksize, blocksize);

        //destinationContext.drawImage(image, 0, 0);

         //this.createTriangle();
        this.createImage();
        //this.createCube();
    }

    createTriangle()
    {
        this.clear();

        var blocksize = 28;
        var w = this.w, h = this.h;

        var vertices = this.vertices = [
            new Vector3D(0, 0, 0),
            new Vector3D(0, h, 0),
            new Vector3D(w, h, 0),
            new Vector3D(w, 0, 0)
        ];

        var sourceImageData = this.sourceContext.getImageData(0, 0, w, h);
        var s0 = new Vector3D(0, 0, 0);
        var s1 = new Vector3D(0, h, 0);
        var s2 = new Vector3D(w, h, 0);
        var s3 = new Vector3D(w, 0, 0);
        var sourceTop = new Face(s0, s2, s3);
        var sourceBottom = new Face(s0, s1, s2);
        this.drawTriangle(this.sourceContext, sourceTop);
        this.drawTriangle(this.sourceContext, sourceBottom);

        var destinationImageData = this.destinationContext.getImageData(0, 0, w, h);
        var d0 = new Vector3D(0, 0, 0);
        var d1 = new Vector3D(0, blocksize * 8, 0);
        var d2 = new Vector3D(blocksize * 8, blocksize * 8, 0);
        var d3 = new Vector3D(blocksize * 8, 0, 0);
        var destinationTop = new Face(d0, d2, d3);
        var destinationBottom = new Face(d0, d1, d2);

        this.map_triangle(sourceImageData, [
            [sourceTop.A.x, sourceTop.A.y],
            [sourceTop.B.x, sourceTop.B.y],
            [sourceTop.C.x, sourceTop.C.y]
        ], destinationImageData, [
            [destinationTop.A.x, destinationTop.A.y],
            [destinationTop.B.x, destinationTop.B.y],
            [destinationTop.C.x, destinationTop.C.y]
        ]);

        /*this.map_triangle(sourceImageData, [
            [sourceBottom.A.x, sourceBottom.A.y],
            [sourceBottom.B.x, sourceBottom.B.y],
            [sourceBottom.C.x, sourceBottom.C.y]
        ], destinationImageData, [
            [destinationBottom.A.x, destinationBottom.A.y],
            [destinationBottom.B.x, destinationBottom.B.y],
            [destinationBottom.C.x, destinationBottom.C.y]
        ]);*/

        this.destinationContext.putImageData(destinationImageData, 0, 0);
    }

    /**
     * Rectangle 을 생성하고 y 좌표로 회전한 후 회전된 점좌표로 표면 버텍스 좌표로 사용합니다.
     */
    createImage()
    {
        this.clear();

        var size = 300;
        var halfSize = size / 2;
        var w = this.w, h = this.h;

        var position = new Vector3D(this.cx - halfSize, this.cy - halfSize, 0);
        var rotatex = Math.toRadians(20);
        var rotatey = Math.toRadians(20);
        var rotatez = Math.toRadians(0);
        var rotation = new Vector3D(rotatex, rotatey, rotatez);

        var rotationMatrix = Matrix.rotateX(rotation.x).multiply(Matrix.rotateY(rotation.y)).multiply(Matrix.rotateZ(rotation.z));
        var transformMatrix = Matrix.translation(position.x, position.y, position.z);

        // 사각형 생성 (반시계)
        var vertices = this.vertices = [
            new Vector3D(0, 0, 0),
            new Vector3D(0, size, 0),
            new Vector3D(size, size, 0),
            new Vector3D(size, 0, 0)
        ];

        var faces = this.faces = [
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

        this.drawPoint(this.destinationContext, vertices);

        for (var i = 0; i < faces.length; i++) {
            this.drawFace(this.destinationContext, faces[i], this.vertices);
        }

        var sourceImageData = this.sourceContext.getImageData(0, 0, w, h);
        var s0 = new Vector3D(0, 0, 0);
        var s1 = new Vector3D(0, h, 0);
        var s2 = new Vector3D(w, h, 0);
        var s3 = new Vector3D(w, 0, 0);
        var sourceTop = new Face(s0, s2, s3);
        var sourceBottom = new Face(s0, s1, s2);
        this.drawTriangle(this.sourceContext, sourceTop);
        this.drawTriangle(this.sourceContext, sourceBottom);

        var destinationImageData = this.destinationContext.getImageData(0, 0, w, h);
        var destinationTop = new Face(vertices[0], vertices[2], vertices[3]);
        var destinationBottom = new Face(vertices[0], vertices[1], vertices[2]);

        this.map_triangle(sourceImageData, [
            [sourceTop.A.x, sourceTop.A.y],
            [sourceTop.B.x, sourceTop.B.y],
            [sourceTop.C.x, sourceTop.C.y]
        ], destinationImageData, [
            [destinationTop.A.x, destinationTop.A.y],
            [destinationTop.B.x, destinationTop.B.y],
            [destinationTop.C.x, destinationTop.C.y]
        ]);

        this.map_triangle(sourceImageData, [
            [sourceBottom.A.x, sourceBottom.A.y],
            [sourceBottom.B.x, sourceBottom.B.y],
            [sourceBottom.C.x, sourceBottom.C.y]
        ], destinationImageData, [
            [destinationBottom.A.x, destinationBottom.A.y],
            [destinationBottom.B.x, destinationBottom.B.y],
            [destinationBottom.C.x, destinationBottom.C.y]
        ]);

        this.destinationContext.putImageData(destinationImageData, 0, 0);
    }

    createCube()
    {
        this.clear();

        var size = 300;
        var halfSize = size / 2;
        var w = this.w, h = this.h;

        var position = new Vector3D(this.cx - halfSize, this.cy - halfSize, 0);
        var rotatex = Math.toRadians(20);
        var rotatey = Math.toRadians(20);
        var rotatez = Math.toRadians(0);
        var rotation = new Vector3D(rotatex, rotatey, rotatez);

        var rotationMatrix = Matrix.rotateX(rotation.x).multiply(Matrix.rotateY(rotation.y)).multiply(Matrix.rotateZ(rotation.z));
        var transformMatrix = Matrix.translation(position.x, position.y, position.z);

        var vertices = this.vertices = [
            new Vector3D(0, 0, 0),              // 0 (좌상단) -> 반시계
            new Vector3D(0, 0, size),           // 1
            new Vector3D(size, 0, size),        // 2
            new Vector3D(size, 0, 0),           // 3
            new Vector3D(0, size, 0),           // 4 (좌하단) -> 반시계
            new Vector3D(0, size, size),        // 5
            new Vector3D(size, size, size),     // 6
            new Vector3D(size, size, 0)         // 7
        ];

        var faces = this.faces = [
            new Face(0, 0, 1, 0xA2DED0),
            new Face(1, 1, 2, 0xA2DED0),
            new Face(2, 2, 3, 0xA2DED0),
            new Face(3, 3, 0, 0xA2DED0),
            new Face(4, 4, 5, 0xA2DED0),
            new Face(5, 5, 6, 0xA2DED0),
            new Face(6, 6, 7, 0xA2DED0),
            new Face(7, 7, 4, 0xA2DED0),
            new Face(0, 0, 4, 0xA2DED0),
            new Face(1, 1, 5, 0xA2DED0),
            new Face(2, 2, 6, 0xA2DED0),
            new Face(3, 3, 7, 0xA2DED0)
        ];

        for (var i = 0; i < vertices.length; i++) {
            var v = vertices[i];
            v = Vector3D.transformCoordinates(v, rotationMatrix);
            v = Vector3D.transformCoordinates(v, transformMatrix);
            vertices[i] = v;
        }

        this.drawPoint(this.destinationContext, vertices);

        for (var i = 0; i < faces.length; i++) {
            this.drawFace(this.destinationContext, faces[i], this.vertices);
        }

        var sourceImageData = this.sourceContext.getImageData(0, 0, w, h);
        var s0 = new Vector3D(0, 0, 0);
        var s1 = new Vector3D(0, h, 0);
        var s2 = new Vector3D(w, h, 0);
        var s3 = new Vector3D(w, 0, 0);
        var sourceTop = new Face(s0, s2, s3);
        var sourceBottom = new Face(s0, s1, s2);
        this.drawTriangle(this.sourceContext, sourceTop);
        this.drawTriangle(this.sourceContext, sourceBottom);

        var destinationImageData = this.destinationContext.getImageData(0, 0, w, h);
        var toptop = new Face(vertices[0], vertices[2], vertices[3]);
        var topbot = new Face(vertices[0], vertices[1], vertices[2]);
        /*var fronttop = new Face(vertices[1], vertices[6], vertices[2]);
        var frontbot = new Face(vertices[1], vertices[5], vertices[6]);*/
        var fronttop = new Face(vertices[0], vertices[7], vertices[3]);
        var frontbot = new Face(vertices[0], vertices[4], vertices[7]);
        var righttop = new Face(vertices[2], vertices[7], vertices[3]);
        var rightbot = new Face(vertices[2], vertices[6], vertices[7]);

        this.map_triangle(sourceImageData, [
            [sourceTop.A.x, sourceTop.A.y],
            [sourceTop.B.x, sourceTop.B.y],
            [sourceTop.C.x, sourceTop.C.y]
        ], destinationImageData, [
            [toptop.A.x, toptop.A.y],
            [toptop.B.x, toptop.B.y],
            [toptop.C.x, toptop.C.y]
        ]);

        this.map_triangle(sourceImageData, [
            [sourceBottom.A.x, sourceBottom.A.y],
            [sourceBottom.B.x, sourceBottom.B.y],
            [sourceBottom.C.x, sourceBottom.C.y]
        ], destinationImageData, [
            [topbot.A.x, topbot.A.y],
            [topbot.B.x, topbot.B.y],
            [topbot.C.x, topbot.C.y]
        ]);

        this.map_triangle(sourceImageData, [
            [sourceTop.A.x, sourceTop.A.y],
            [sourceTop.B.x, sourceTop.B.y],
            [sourceTop.C.x, sourceTop.C.y]
        ], destinationImageData, [
            [fronttop.A.x, fronttop.A.y],
            [fronttop.B.x, fronttop.B.y],
            [fronttop.C.x, fronttop.C.y]
        ]);

        this.map_triangle(sourceImageData, [
            [sourceBottom.A.x, sourceBottom.A.y],
            [sourceBottom.B.x, sourceBottom.B.y],
            [sourceBottom.C.x, sourceBottom.C.y]
        ], destinationImageData, [
            [frontbot.A.x, frontbot.A.y],
            [frontbot.B.x, frontbot.B.y],
            [frontbot.C.x, frontbot.C.y]
        ]);

        this.map_triangle(sourceImageData, [
            [sourceTop.A.x, sourceTop.A.y],
            [sourceTop.B.x, sourceTop.B.y],
            [sourceTop.C.x, sourceTop.C.y]
        ], destinationImageData, [
            [righttop.A.x, righttop.A.y],
            [righttop.B.x, righttop.B.y],
            [righttop.C.x, righttop.C.y]
        ]);

        this.map_triangle(sourceImageData, [
            [sourceBottom.A.x, sourceBottom.A.y],
            [sourceBottom.B.x, sourceBottom.B.y],
            [sourceBottom.C.x, sourceBottom.C.y]
        ], destinationImageData, [
            [rightbot.A.x, rightbot.A.y],
            [rightbot.B.x, rightbot.B.y],
            [rightbot.C.x, rightbot.C.y]
        ]);


        this.destinationContext.putImageData(destinationImageData, 0, 0);
    }

    clear()
    {
        /*if (this.sourceCanvas) {
            this.sourceCanvas.width = this.w;
            this.sourceCanvas.height = this.h;
        }*/

        if (this.destinationCanvas) {
            this.destinationCanvas.width = this.w;
            this.destinationCanvas.height = this.h;
        }
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
        var a = triangle.A;
        var b = triangle.B;
        var c = triangle.C;

        ctx.save();
        ctx.strokeStyle = '#BF55EC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(a.x, a.y);

        console.log(triangle.A, triangle.B, triangle.C);
        ctx.stroke();
        ctx.restore();
    }

    drawFace(ctx, face, vertices)
    {
        var a = vertices[face.A];
        var b = vertices[face.B];
        var c = vertices[face.C];
        console.log('face', a, b, c);
        ctx.save();
        ctx.strokeStyle = '#BF55EC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * 과정 설명
     *
     * 1-2 단계 목적지 삼각형의 위치 파악
     * 3-4 목적지 삼각형에 소스 삼각형의 색상 값을 가져와서 채웁니다.
     *
     * 1. 그리고자 하는 목적지 픽셀을 모두 돌면서 픽셀을 uv 좌표로 변환합니다.
     * 2. 해당 좌표가 삼각형 안에 포함되는지 체크합니다.
     * 3. 삼각형안에 좌표가 포함되었으면 소스의 삼각형의 픽셀 좌표를 구해서옵니다.
     * 4. 소스 픽셀 정보를 목적지 픽셀로 변경합니다.
     *
     * @param src_image_data
     * @param src_triangle
     * @param dst_image_data
     * @param dst_triangle
     */
    map_triangle(src_image_data, src_triangle, dst_image_data, dst_triangle)
    {
        const PIXEL_WIDTH = 4;
        var src_pixel_data = src_image_data.data;
        var dst_pixel_data = dst_image_data.data;

        for (var x = 0; x < dst_image_data.width; x++) {
            for (var y = 0; y < dst_image_data.height; y++) {
                // 직교 좌표계 -> UV 좌표 (무게 중심 좌표)
                var uv = this.cartesian_to_barycentric(dst_triangle, [x, y]);

                // Did I forget to mention this other lovely aspect of barycentric coords?
                var xy_in_triangle = (uv[0] >= 0) && (uv[1] >= 0) && (uv[0] + uv[1] <= 1);

                if (xy_in_triangle) {
                    var dst_pixel_start = PIXEL_WIDTH * (x + y * dst_image_data.width);

                    // UV 좌표 -> 직교 좌표
                    var src_xy = this.barycentric_to_cartesian(src_triangle, uv);
                    var src_pixel_start = PIXEL_WIDTH * (Math.floor(src_xy[0]) + Math.floor(src_xy[1]) * src_image_data.width);

                    dst_pixel_data[dst_pixel_start] = src_pixel_data[src_pixel_start];
                    dst_pixel_data[dst_pixel_start + 1] = src_pixel_data[src_pixel_start + 1];
                    dst_pixel_data[dst_pixel_start + 2] = src_pixel_data[src_pixel_start + 2];
                    dst_pixel_data[dst_pixel_start + 3] = src_pixel_data[src_pixel_start + 3];
                } else {
                    // dst_pixel_data[dst_pixel_start] = 255;
                    // dst_pixel_data[dst_pixel_start + 1] = 255;
                    // dst_pixel_data[dst_pixel_start + 2] = 255;
                    // dst_pixel_data[dst_pixel_start + 3] = 255;
                }
            }
        }
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

    /**
     * 직교 좌표계 -> UV 좌표 (무게 중심 좌표)
     * @param triangle
     * @param xy
     * @returns {*[]}
     */
    cartesian_to_barycentric(triangle, xy)
    {
        var a = triangle[0];
        var b = triangle[1];
        var c = triangle[2];

        var v0 = this.sub(c, a);
        var v1 = this.sub(b, a);
        var v2 = this.sub(xy, a);

        // Compute dot products
        var dot00 = this.dot(v0, v0);
        var dot01 = this.dot(v0, v1);
        var dot02 = this.dot(v0, v2);
        var dot11 = this.dot(v1, v1);
        var dot12 = this.dot(v1, v2);

        // Compute barycentric coordinates
        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return [u, v];

    }

    /**
     * UV 좌표 (무게 중심 좌표) -> 직교 좌표
     * @param triangle
     * @param uv
     * @returns {*}
     */
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

        this.config.createTriangle = this.createTriangle.bind(this);
        this.config.createImage = this.createImage.bind(this);
        this.config.createCube = this.createCube.bind(this);

        this.gui.add(this.config, 'createTriangle');
        this.gui.add(this.config, 'createImage');
        this.gui.add(this.config, 'createCube');
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

    get w()
    {
        if (this.image) {
            return this.image.width;
        }
        return 0;
    }

    get h()
    {
        if (this.image) {
            return this.image.height;
        }
        return 0;
    }

    get cx()
    {
        return this.w / 2;
    }

    get cy()
    {
        return this.h / 2;
    }
}