import 'babel-polyfill';
import App from './App';
import KeyCode from '../../../src/consts/KeyCode';


(function () {
  window.onload = function () {
    new Main();
  }
}());

class Main {
  constructor() {
    this.init();
    this.addEvent();
  }

  init() {
    window.app = this.app = new App();
    window.parent.onresize();
  }

  addEvent() {
    window.addEventListener('keyup', this.onkeyup.bind(this));
    window.addEventListener('keydown', this.onkeydown.bind(this));
  }

  /**
   *
   * @param func {Function}
   * @param params
   * @returns {intervalFunc}
   */
  getIntervalFunction(theArg, func, ...params) {
    function intervalFunc() {
      func.apply(theArg, params);
      clearTimeout(this.keyIntervalId);
      this.keyIntervalId = setTimeout(intervalFunc.bind(this), 200);
    }

    return intervalFunc.bind(this);
  }

  clearInterFunction() {
    clearTimeout(this.keyIntervalId);
  }

  onkeydown(event) {
    const MOVEMENT = 10;

    switch (event.keyCode) {
      case KeyCode.UP:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'y', -MOVEMENT)();
        break;
      case KeyCode.DOWN:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'y', MOVEMENT)();
        break;
      case KeyCode.LEFT:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'x', -MOVEMENT)();
        break;
      case KeyCode.RIGHT:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'x', MOVEMENT)();
        break;
      case KeyCode.PAGE_UP:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'z', MOVEMENT)();
        break;
      case KeyCode.PAGE_DOWN:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'z', -MOVEMENT)();
        break;
      case KeyCode.NUMBER_1:
        this.app.cullingState = 1;
        break;
      case KeyCode.NUMBER_2:
        this.app.cullingState = 2;
        break;
      case KeyCode.NUMBER_3:
        this.app.cullingState = 3;
        break;
      case KeyCode.NUMBER_4:
        this.app.cullingState = 4;
        break;
      case KeyCode.NUMBER_5:
        this.app.cullingState = 5;
        break;
      case KeyCode.NUMBER_6:
        this.app.cullingState = 6;
        break;
      case KeyCode.NUMBER_7:
        this.app.cullingState = 7;
        break;
      case KeyCode.NUMBER_8:
        this.app.cullingState = 8;
        break;
      case KeyCode.NUMBER_9:
        this.app.cullingState = 9;
        break;
      case KeyCode.NUMBER_0:
        this.app.cullingState = 0;
        this.app.reset();
        break;
      case KeyCode.NUMPAD_ADD:
        this.app.zoomIn();
        break;
      case KeyCode.NUMPAD_SUBTRACT:
        this.app.zoomOut();
        break;
      case KeyCode.NUMPAD_ENTER:
        this.app.zoomOut();
        break;
      case KeyCode.BACKSPACE:
        console.clear();
        window.count = 0;
        break;
    }

    /*
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'y', -MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'y', MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'x', -MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'x', MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', -MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', -MOVEMENT)();
    this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', MOVEMENT)();
    */
  }

  onkeyup(event) {
    switch (event.keyCode) {
      case KeyCode.ESCAPE:
        console.clear();
        break;

      case KeyCode.SPACE:
        if (this.app.gui.closed) {
          this.app.gui.open();
        } else {
          this.app.gui.close();
        }
        break;

      case KeyCode.C:
        this.app.isConsoleData = true;
        break;

      case KeyCode.UP:
      case KeyCode.DOWN:
      case KeyCode.LEFT:
      case KeyCode.RIGHT:
      case KeyCode.PAGE_UP:
      case KeyCode.PAGE_DOWN:
      case KeyCode.NUMBER_4:
      case KeyCode.NUMBER_6:
      case KeyCode.NUMBER_8:
      case KeyCode.NUMBER_2:
      case KeyCode.NUMBER_7:
      case KeyCode.NUMBER_1:
      case KeyCode.NUMBER_9:
      case KeyCode.NUMBER_3:
      case KeyCode.NUMPAD_ADD:
      case KeyCode.NUMPAD_SUBTRACT:
        this.clearInterFunction();
        break;

      case KeyCode.BACKSPACE:
        break;
    }
  };
}
