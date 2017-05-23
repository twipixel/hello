import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../../external/lib/animation';
import Camera from './core/Camera';
import DeviceWithWorld from './core/DeviceWithWorld';
import Matrix from './geom/Matrix';
import Mesh from './geom/Mesh';
import Vector3D from './geom/Vector3D';
import Cube from './shape/Cube';
import Arrow from './shape/Arrow';


export default class App
{
    constructor()
    {
        var w = 560;
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

        var size = 50;
        this.camera = new Camera();
        this.camera.position.z = -500;
        this.world = new Mesh({faces:[], vertices:[]});
        this.device = new DeviceWithWorld(this.canvas.width, this.canvas.height);
        this.stage.addChild(this.device);

        //this.createAxis(50);

        var shape = new Cube(size, size, size);
        var cube = this.cube = new Mesh(shape);
        this.meshes.push(cube);
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

            for (var j = 0; j < mesh.faces.length; j++) {
                var face = mesh.faces[j];
                this.device.drawTriangle(mesh.vertices[face.A], mesh.vertices[face.B], mesh.vertices[face.C], face.color, face.alpha);
            }
        }*/

        for (var i = 0; i < meshes.length; i++) {
            var mesh = meshes[i];
            var faces = mesh.faces;
            var vertices = mesh.vertices;

            for (var j = 0; j < faces.length; j++) {
                var face = faces[j];

                if (face.img) {
                    var A = vertices[face.A];
                    var B = vertices[face.B];
                    var C = vertices[face.C];

                    if (this.isFrontface(A, B, C) == !this.backfaceCulling){
                        this.drawTriangle(this.ctx, face.img, A.x, A.y, B.x, B.y, C.x, C.y, A.u, A.v, B.u, B.v, C.u, C.v);
                    }
                }
                else {
                    this.device.drawTriangle(mesh.vertices[face.A], mesh.vertices[face.B], mesh.vertices[face.C], face.color, face.alpha);
                }
            }
        }
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
        //console.log(ctx, im, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2);
        ctx.save();

        //ctx.globalAlpha = 0.8;
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

    moveCameraToCenter()
    {
        var tween = Be.to(this.camera.position, {x:0, y:0, z:0}, 1, Quad.easeOut).play();
    }

    initializeGUI()
    {
        this.config = {};
        this.backfaceCulling = true;
        this.gui = new dat.GUI();
        this.config.zoomIn = this.zoomIn.bind(this);
        this.config.zoomOut = this.zoomOut.bind(this);
        this.gui.add(this.config, 'zoomIn');
        this.gui.add(this.config, 'zoomOut');
        this.gui.add(this, 'backfaceCulling');
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
        Be.to(this.camera.position, {x:0, y:0, z:-150}, 1, Quad.easeOut).play();
    }

    zoomOut()
    {
        Be.to(this.camera.position, {x:0, y:0, z:-500}, 1, Quad.easeOut).play();
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
}