import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';
import Camera from './core/Camera';
import DeviceWithWorld from './core/DeviceWithWorld';
import Matrix from './geom/Matrix';
import Mesh from './geom/Mesh';
import Vector3D from './geom/Vector3D';
import Torus from './shape/Torus';
import Arrow from './shape/Arrow';


export default class App
{
    constructor()
    {
        window.count = 0;

        var w = 640;
        var h = 560;
        this.app = new PIXI.Application(w, h, {backgroundColor: 0x191919}, true);
        document.body.appendChild(this.app.view);

        this.ctx = this.app.view.getContext('2d');
        this.canvas = this.app.renderer.view;
        this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.addEvent();
        this.tick();
    }

    initialize()
    {
        this.meshes = [];
        this.camera = new Camera();
        this.camera.position.z = -500;
        this.world = new Mesh({faces:[], vertices:[]});
        this.device = new DeviceWithWorld(this.w, this.h);
        this.stage.addChild(this.device);

        this.createAxis(20);

        var shape = new Torus(50, 25, 12, 8);
        // var shape = new Torus(50, 25, 32, 24);
        var torus = this.torus = new Mesh(shape);
        this.meshes.push(torus);
    }

    createAxis(size = 50)
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
        this.meshes.push(xArrow);
        this.meshes.push(yArrow);
        this.meshes.push(zArrow);
    }

    render(ms)
    {
        this.camera.target = new Vector3D();
        //this.device.render(this.world, this.camera, this.meshes);

        this.device.clear();
        var meshes = this.device.projection(this.world, this.camera, this.meshes);

        /*for (var i = 0; i < meshes.length; i++) {
            var mesh = meshes[i];
            var faces = mesh.faces;
            var vertices = mesh.vertices;

            for (var j = 0; j < mesh.faces.length; j++) {
                var face = faces[j];
                var A = vertices[face.A];
                var B = vertices[face.B];
                var C = vertices[face.C];
                this.device.drawTriangle(A, B, C, face.color, 0.5);
                this.displayNormal(A, B, C);
            }
        }
        return;*/

        var u = this.img.width;
        var v = this.img.height;

        for (var i = 0; i < meshes.length; i++) {
            var sortFaces = [];
            var mesh = meshes[i];
            var faces = mesh.faces;
            var vertices = mesh.vertices;
            var uvtData = mesh.uvtData;

            if(faces[0].img) {
                for (var j = 0; j < faces.length; j++) {
                    var face = faces[j];
                    var A = vertices[face.A];
                    var B = vertices[face.B];
                    var C = vertices[face.C];

                    var e0 = new Vector3D(B.x - A.x, B.y - A.y, B.z - A.z);
                    var e1 = new Vector3D(C.x - A.x, C.y - A.y, C.z - A.z);
                    var n = Vector3D.cross(e0, e1);
                    var normalize = Vector3D.normalize(n);
                    var dotProduct = Vector3D.dot(this.camera.target, normalize);


                    // face.z = Math.min(A.z, B.z, C.z);

                    if (dotProduct > 0) {
                        sortFaces.push(face);
                    }

                    // sortFaces.push(face);

                    /*var center = new Vector3D();
                    center.x = (A.x + B.x + C.x) / 3;
                    center.y = (A.y + B.y + C.y) / 3;
                    center.z = (A.z + B.z + C.z) / 3;
                    var e0 = new Vector3D(B.x - A.x, B.y - A.y, B.z - A.z);
                    var e1 = new Vector3D(C.x - A.x, C.y - A.y, C.z - A.z);
                    var n = Vector3D.cross(e0, e1);
                    var normalize = Vector3D.normalize(n);
                    this.device.drawNormalVector(center, normalize, 0x90A4AE, 0.8);*/
                }

                // sortFaces.sort(this.sortByZIndex);
                // sortFaces.sort(this.sortByYIndex);
                sortFaces.sort(this.sortByDist);

                if (window.count++ < 200) {
                    console.log(sortFaces);
                }

                for (var k = 0; k < sortFaces.length; k++) {
                    var face = sortFaces[k];
                    var A = vertices[face.A];
                    var B = vertices[face.B];
                    var C = vertices[face.C];
                    this.drawTriangle(this.ctx, face.img, A.x, A.y, B.x, B.y, C.x, C.y, A.u * u, A.v * v, B.u * u, B.v * v, C.u * u, C.v * v);
                    // this.displayNormal(A, B, C);
                }
            }
            else {
                for (var j = 0; j < faces.length; j++) {
                    var face = faces[j];
                    var A = vertices[face.A];
                    var B = vertices[face.B];
                    var C = vertices[face.C];
                    this.device.drawTriangle(mesh.vertices[face.A], mesh.vertices[face.B], mesh.vertices[face.C], face.color, face.alpha);
                }
            }
        }

    }

    sortByDist(a, b)
    {
        return b.dist - a.dist;
    }

    sortByYIndex(a, b)
    {
        return b.y - a.y;
    }

    sortByZIndex(a, b)
    {
        return b.z - a.z;
    }

    displayNormal(A, B, C)
    {
        var center = new Vector3D();
        center.x = (A.x + B.x + C.x) / 3;
        center.y = (A.y + B.y + C.y) / 3;
        center.z = (A.z + B.z + C.z) / 3;

        var cb = new Vector3D(C.x - B.x, C.y - B.y, C.z - B.z);
        var ba = new Vector3D(B.x - A.x, B.y - A.y, B.z - A.z);
        var normalize = Vector3D.cross(cb, ba);
        normalize = normalize.normalize();
        this.device.drawNormalVector(center, normalize, 0x90A4AE, 0.8);
    }

    /**
     * back-face culling
     * https://www.kirupa.com/developer/actionscript/backface_culling.htm
     * 여기에서 사용하는 ^ (xor)와 or 의 차이점은 참,참 일때 참이 or, 참, 참 일때 거짓이 xor 입니다.
     * @param A
     * @param B
     * @param C
     * @returns {number}
     */
    isFrontface(A, B, C)
    {
        return ((B.y-A.y)/(B.x-A.x) - (C.y-A.y)/(C.x-A.x) < 0) ^ (A.x <= B.x == A.x > C.x);
    }

    drawTriangle(ctx, im, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2)
    {
        ctx.save();

        ctx.globalAlpha = 1;
        // Clip the output to the on-screen triangle boundaries.
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        //ctx.stroke();//xxxxxxx for wireframe
        ctx.clip();

        /*
         ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

         The context matrix is:

         [ m11 m21 dx ]
         [ m12 m22 dy ]
         [  0   0   1 ]

         Coords are column vectors with a 1 in the z coord, so the transform is:
         x_out = m11 * x + m21 * y + dx;
         y_out = m12 * x + m22 * y + dy;

         From Maxima, these are the transform values that map the source
         coords to the dest coords:

         sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
         [m11 = - -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
         m12 = -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
         m21 = -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
         m22 = - -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
         dx = ----------------------------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
         dy = ----------------------------------------------------------------------]
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
         */

        // TODO: eliminate common subexpressions.
        var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
        if (denom == 0) {
            return;
        }
        var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
        var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
        var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
        var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
        var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
        var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

        // console.log(m11, m12, m21, m22, dx, dy);
        ctx.transform(m11, m12, m21, m22, dx, dy);

        // Draw the whole image.  Transform and clip will map it onto the
        // correct output triangle.
        //
        // TODO: figure out if drawImage goes faster if we specify the rectangle that
        // bounds the source coords.
        ctx.drawImage(im, 0, 0);
        ctx.restore();
    }

    initializeGUI()
    {
        this.config = {};
        this.cutHalf = false;
        this.gui = new dat.GUI();
        this.gui.add(this, 'cutHalf');
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

    tick(ms)
    {
        this.render(ms);
        requestAnimationFrame(this.tick.bind(this));
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

    onmouseup(event) {
        this.canvas.removeEventListener('mousemove', this.mousemoveListener);
    }

    moveCamera(property, value)
    {
        this.camera.position[property] += value;
    }

    moveWorld(property, value)
    {
        this.world.position[property] += value;
    }

    rotateWorld(property, value)
    {
        this.world.rotation[property] += value;
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
    }

    get w()
    {
        return this.canvas.width;
    }

    get h()
    {
        return this.canvas.height;
    }

    get cx()
    {
        if (!this._cx) {
            this._cx = this.canvas.width / 2;
        }
        return this._cx;
    }

    get cy()
    {
        if (!this._cy) {
            this._cy = this.canvas.height / 2;
        }
        return this._cy;
    }

    get img()
    {
        return document.getElementById('source');
    }
}