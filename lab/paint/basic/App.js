export default class App {
  constructor() {
    const {width, height} = window.parent.getContentSize();
    this.pixi = new PIXI.Application(width, height, {
      resizeTo: window.parent.getParent(),
      backgroundColor: 0x191919
    }, true);
    document.getElementById('content').appendChild(this.pixi.view);

    //this.pixi.renderer.roundPixels = true;
    this.canvas = this.pixi.renderer.view;
    this.stage = this.pixi.stage;

    this.initialize();
    this.initializeGUI();
    this.addEvent();
  }

  initialize() {
  }

  initializeGUI() {
    // const gui = this.gui = new dat.GUI({autoPlace: false});
    // const guiEl = gui.domElement;
    // document.getElementById('content').appendChild(guiEl);
    // const style = guiEl.style;
    // style.position = 'absolute';
    // style.top = 0;
    // style.left = 0;
    // const settings = {};
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