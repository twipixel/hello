import { requestAnimationFrame } from './../../../external/lib/animation';


export default class App {
  constructor() {
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
    console.log('https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/');
  }

  render(ms) {

  }

  initializeGUI() {
    const gui = this.gui = new dat.GUI({autoPlace: false});
    const guiEl = gui.domElement;
    document.getElementById('content').appendChild(guiEl);
    const style = guiEl.style;
    style.position = 'absolute';
    style.top = 0;
    style.left = 0;
  }

  addEvent() {

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
    // this.rotateWorld('x', Math.toRadians(dx));
    // this.rotateWorld('y', Math.toRadians(dy));
    this.prevmousex = event.clientX;
    this.prevmousey = event.clientY;
  }

  onmousewheel(event) {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    // this.moveCamera('z', delta);
    this.prevwheel = delta;
  }

  onmouseup(event) {
    this.canvas.removeEventListener('mousemove', this.mousemoveListener);
  }

  moveCamera(property, value) {
    this.camera.position[property] += value;
  }

  moveWorld(property, value) {
    this.world.position[property] += value;
  }

  rotateWorld(property, value) {
    this.world.rotation[property] += value;
  }

  zoomIn() {
    Be.to(this.camera.position, {x: 0, y: 0, z: -50}, 1, Quad.easeOut).play();
  }

  zoomOut() {
    Be.to(this.camera.position, {x: 0, y: 0, z: -300}, 1, Quad.easeOut).play();
  }

  reset() {
    var wt = Be.to(this.world.position, {x: 0, y: 0, z: 0}, 1, Quad.easeOut);
    var wr = Be.to(this.world.rotation, {x: 0, y: 0, z: 0}, 1, Quad.easeOut);
    var ct = Be.to(this.camera.position, {x: 0, y: 0, z: -300}, 1, Quad.easeOut);

    Be.parallel(wt, wr, ct).play();

    //this.world.position = new Vector3D();
    //this.world.rotation = new Vector3D();
    //this.camera.position = new Vector3D(0, 0, -10);
  }
}