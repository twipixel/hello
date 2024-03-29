import { requestAnimationFrame } from './../../../external/lib/animation';
import Camera from './core/Camera';
import DeviceWithWorld from './core/DeviceWithWorld';
import Mesh from './geom/Mesh';
import Vector3D from './geom/Vector3D';
import Torus from './shape/Torus';
import Arrow from './shape/Arrow';
import Plane from './geom/Plane';


export default class App {
  constructor() {
    window.count = 0;

    const {width, height} = window.parent.getContentSize();
    this.pixi = new PIXI.Application(width, height, {
      resizeTo: window.parent.getParent(),
      backgroundColor: 0x191919
    }, true);
    document.getElementById('content').appendChild(this.pixi.view);

    this.ctx = this.pixi.view.getContext('2d');
    this.canvas = this.pixi.renderer.view;
    this.stage = this.pixi.stage;

    this.initialize();
    this.initializeGUI();
    this.addEvent();
    this.tick();
  }

  get w() {
    return this.canvas.width;
  }

  get h() {
    return this.canvas.height;
  }

  get cx() {
    if (!this._cx) {
      this._cx = this.canvas.width / 2;
    }
    return this._cx;
  }

  get cy() {
    if (!this._cy) {
      this._cy = this.canvas.height / 2;
    }
    return this._cy;
  }

  get img() {
    return document.getElementById('source');
  }

  initialize() {
    this.sort = 'distance';
    this.cullingState = 0;
    this.isConsoleData = false;

    this.sortByX = this.sortByProperty.bind(this, 'x', false);
    this.sortByY = this.sortByProperty.bind(this, 'y', false);
    this.sortByZ = this.sortByProperty.bind(this, 'z', false);

    this.renderCount = 0;
    this.renderIndex = 0;
    this.renderSize = 100;

    this.zNear = new Plane(new Vector3D(0, 0, 0),
      new Vector3D(1, 0, 0),
      new Vector3D(0, -1, 0));

    this.zFar = new Plane(new Vector3D(0, 0, 3000),
      new Vector3D(1, 0, 3000),
      new Vector3D(0, -1, 3000));

    this.meshes = [];
    this.camera = new Camera();
    this.camera.position.z = -500;
    this.world = new Mesh({faces: [], vertices: []});
    this.device = new DeviceWithWorld(this.w, this.h);
    this.stage.addChild(this.device);

    this.createAxis(20);

    //var shape = new Torus(30, 20, 24, 20);
    var shape = new Torus(70, 20, 24, 20);
    var torus = this.torus = this.target = new Mesh(shape);
    this.meshes.push(torus);
  }

  createAxis(size = 50) {
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

  render(ms) {
    this.device.clear();

    //if (this.renderCount++ % 10 !== 0) return;
    this.camera.target = new Vector3D();
    //this.device.render(this.world, this.camera, this.meshes);
    //return;


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
    var focus = this.camera.target;

    for (var i = 0; i < meshes.length; i++) {
      var sortFaces = [];
      var mesh = meshes[i];
      var faces = mesh.faces;
      var vertices = mesh.vertices;
      var uvtData = mesh.uvtData;

      if (faces[0].img) {
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

          if (dotProduct > 0) {
            sortFaces.push(face);
          }

          /*var pl0 = this.zNear.isFront(A);
          var pl1 = this.zNear.isFront(B);
          var pl2 = this.zNear.isFront(C);

          //console.log(pl0, pl1, pl2);
          if (pl0 && pl1 && pl2) {
              sortFaces.push(face);
          }*/

          //sortFaces.push(face);
        }


        switch (this.sort) {
          case 'x':
            sortFaces.sort(this.sortByX);
            break;

          case 'y':
            sortFaces.sort(this.sortByY);
            break;

          case 'z':
            sortFaces.sort(this.sortByZ);
            break;

          case 'depth':
            sortFaces.sort(this.sortByDepth);
            break;

          case 'distance':
            sortFaces.sort(this.sortByDistance.bind(this));
            break;
        }
        2

        var num = 10 / 100 * (sortFaces.length - 1);

        var cullingFaces;

        if (this.cullingState && this.cullingState != 0) {
          var startIndex = parseInt(this.cullingState * (num - 1));
          cullingFaces = sortFaces.slice(startIndex, startIndex + num);

          if (this.isConsoleData == true) {
            this.isConsoleData = false;
            //this.logSortFaces(mesh, sortFaces, vertices, startIndex, startIndex + num);
            this.logSortFaces(mesh, sortFaces, vertices, 0, sortFaces.length - 1);
          }

          sortFaces.splice(startIndex, num);
        }

        for (var k = 0; k < sortFaces.length; k++) {
          var face = sortFaces[k];
          var A = vertices[face.A];
          var B = vertices[face.B];
          var C = vertices[face.C];
          this.drawTriangle(this.ctx, face.img, A.x, A.y, B.x, B.y, C.x, C.y, A.u * u, A.v * v, B.u * u, B.v * v, C.u * u, C.v * v);
          //this.displayY(A, B, C);
          // this.displayNormal(A, B, C);
        }

        /*var length = this.renderIndex + this.renderSize;

        for (var k = this.renderIndex; k < length; k++) {
            if (++this.renderIndex >= sortFaces.length) {
                this.renderIndex = 0;
            }

            var face = sortFaces[this.renderIndex];
            var A = vertices[face.A];
            var B = vertices[face.B];
            var C = vertices[face.C];
            this.drawTriangle(this.ctx, face.img, A.x, A.y, B.x, B.y, C.x, C.y, A.u * u, A.v * v, B.u * u, B.v * v, C.u * u, C.v * v);
            // this.displayNormal(A, B, C);
        }*/

        if (window.count++ < 1) {
          console.log('renderIndex:', this.renderIndex);
        }
      } else {
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

  logSortFaces(mesh, faces, vertices, startIndex, endIndex, property = '') {
    for (var i = startIndex; i < endIndex; i++) {
      var face = faces[i];
      var A = vertices[face.A];
      var B = vertices[face.B];
      var C = vertices[face.C];

      if (property === '') {
        console.log(
          i,
          ', A[', parseInt(A.x), parseInt(A.y), parseInt(A.z), ']',
          ', B[', parseInt(B.x), parseInt(B.y), parseInt(B.z), ']',
          ', C[', parseInt(C.x), parseInt(C.y), parseInt(C.z), ']'
        );
      } else {
        console.log(i, ', A:', parseInt(A[property]), ', B:', parseInt(A[property]), ', C:', parseInt(A[property]), ', SUM:', parseInt(A[property] + B[property] + C[property]));
      }
    }

    console.log('mesh[', mesh.position.x, mesh.position.y, mesh.position.z, ']');
  }

  sortByProperty(property, sortNumeric, face0, face1) {
    var v = face0.vertices;
    var v0 = v[face0.v0];
    var v1 = v[face0.v1];
    var v2 = v[face0.v2];
    var dA = v0[property] + v1[property] + v2[property];

    var v = face1.vertices;
    v0 = v[face1.v0];
    v1 = v[face1.v1];
    v2 = v[face1.v2];
    var dB = v0[property] + v1[property] + v2[property];

    if (sortNumeric === true) {
      return dA - dB
    }

    return dB - dA;
  }

  sortByDepth(face0, face1) {
    var v = face0.vertices;
    var v0 = v[face0.v0];
    var v1 = v[face0.v1];
    var v2 = v[face0.v2];
    var dA = (v0.z + v1.z + v2.z) / 3;

    var v = face1.vertices;
    v0 = v[face1.v0];
    v1 = v[face1.v1];
    v2 = v[face1.v2];
    var dB = (v0.z + v1.z + v2.z) / 3;

    return dB - dA; // back to front
  }

  sortByDistance(face0, face1) {
    var a = this.getDistanceCameraBetweenVertex(face0);
    face0.distance = a;
    var b = this.getDistanceCameraBetweenVertex(face1);
    face1.distance = b;
    return a - b;
  }

  getDistanceCameraBetweenVertex(face) {
    var x0 = this.camera.position.x;
    var y0 = this.camera.position.y;
    var z0 = this.camera.position.z;

    var vertices = face.vertices;
    var vertex = vertices[face.v0];
    var x1 = vertex.x;
    var y1 = vertex.y;
    var z1 = vertex.z;

    var dx = x0 - x1;
    var dy = y0 - y1;
    var dz = z0 - z1;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  displayNormal(A, B, C) {
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

  displayY(A, B, C) {
    var center = new Vector3D();
    center.x = (A.x + B.x + C.x) / 3;
    center.y = (A.y + B.y + C.y) / 3;
    center.z = (A.z + B.z + C.z) / 3;

    this.device.drawTextY(center, parseInt(A.y));
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
  isFrontface(A, B, C) {
    return ((B.y - A.y) / (B.x - A.x) - (C.y - A.y) / (C.x - A.x) < 0) ^ (A.x <= B.x == A.x > C.x);
  }

  drawTriangle(ctx, im, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2) {
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

  initializeGUI() {
    const gui = this.gui = new dat.GUI({autoPlace: false});
    const guiEl = gui.domElement;
    document.getElementById('content').appendChild(guiEl);
    const style = guiEl.style;
    style.position = 'absolute';
    style.top = 0;
    style.left = 0;
    this.gui.add(this, 'sort', ['none', 'x', 'y', 'z', 'depth', 'distance']);
  }

  addEvent() {
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

  tick(ms) {
    this.render(ms);
    requestAnimationFrame(this.tick.bind(this));
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
    this.rotateWorld('x', Math.toRadians(dx));
    this.rotateWorld('y', Math.toRadians(dy));
    this.prevmousex = event.clientX;
    this.prevmousey = event.clientY;
  }

  onmousewheel(event) {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    this.moveCamera('z', delta);
    this.prevwheel = delta;
  }

  onmouseup(event) {
    this.canvas.removeEventListener('mousemove', this.mousemoveListener);
  }

  moveCamera(property, value) {
    this.camera.position[property] += value;
  }

  moveWorld(property, value) {
    //this.world.position[property] += value;
    this.target.position[property] += value;
  }

  rotateWorld(property, value) {
    //this.world.rotation[property] += value;
    this.target.rotation[property] += value;
  }

  zoomIn() {
    Be.to(this.camera.position, {x: 0, y: 0, z: -50}, 1, Quad.easeOut).play();
  }

  zoomOut() {
    Be.to(this.camera.position, {x: 0, y: 0, z: -300}, 1, Quad.easeOut).play();
  }

  reset() {
    //var wt = Be.to(this.world.position, {x:0, y:0, z:0}, 1, Quad.easeOut);
    //var wr = Be.to(this.world.rotation, {x:0, y:0, z:0}, 1, Quad.easeOut);
    var wt = Be.to(this.target.position, {x: 0, y: 0, z: 0}, 1, Quad.easeOut);
    var wr = Be.to(this.target.rotation, {x: 0, y: 0, z: 0}, 1, Quad.easeOut);
    var ct = Be.to(this.camera.position, {x: 0, y: 0, z: -300}, 1, Quad.easeOut);

    Be.parallel(wt, wr, ct).play();

    //this.world.position = new Vector3D();
    //this.world.rotation = new Vector3D();
    //this.camera.position = new Vector3D(0, 0, -10);
  }
}