export default class App {
  constructor() {
    this.app = new PIXI.Application(800, 600, {backgroundColor: 0x191919}, true);
    document.body.appendChild(this.app.view);

    //this.app.renderer.roundPixels = true;
    this.canvas = this.app.renderer.view;
    this.stage = this.app.stage;

    this.initialize();
    this.initializeGUI();
    this.addEvent();
  }

  initialize() {
  }

  initializeGUI() {
    this.settings = {};
    this.gui = new dat.GUI();
  }

  addEvent() {
    this.stage.interactive = true;
    this.prevwheel = 0;
    this.mousemoveListener = this.onMouseMove.bind(this);
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseout', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mousewheel', this.onMouseWheel.bind(this));
  }

  resize() {
  }

  onMouseDown(event) {
    this.prevmousex = event.clientX;
    this.prevmousey = event.clientY;
    this.canvas.addEventListener('mousemove', this.mousemoveListener);
  }

  onMouseMove(event) {
  }

  onMouseWheel(event) {
  }

  onMouseUp(event) {
  }
}