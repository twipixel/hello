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
    switch (event.keyCode) {
      case KeyCode.UP:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'y', -1)();
        break;
      case KeyCode.DOWN:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'y', 1)();
        break;
      case KeyCode.LEFT:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'x', -1)();
        break;
      case KeyCode.RIGHT:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'x', 1)();
        break;
      case KeyCode.PAGE_UP:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'z', 1)();
        break;
      case KeyCode.PAGE_DOWN:
        this.getIntervalFunction(this.app, this.app.moveCamera, 'z', -1)();
        break;
      case KeyCode.NUMBER_4:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'y', -0.01)();
        break;
      case KeyCode.NUMBER_6:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'y', 0.01)();
        break;
      case KeyCode.NUMBER_8:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'x', -0.01)();
        break;
      case KeyCode.NUMBER_2:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'x', 0.01)();
        break;
      case KeyCode.NUMBER_7:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', -0.01)();
        break;
      case KeyCode.NUMBER_1:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', 0.01)();
        break;
      case KeyCode.NUMBER_9:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', -0.01)();
        break;
      case KeyCode.NUMBER_3:
        this.getIntervalFunction(this.app, this.app.rotateWorld, 'z', 0.01)();
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
      case KeyCode.NUMBER_0:
        this.app.reset();
        break;
      case KeyCode.W:
        break;
      case KeyCode.S:
        break;
      case KeyCode.A:
        break;
      case KeyCode.D:
        break;
    }
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
      case KeyCode.W:
      case KeyCode.S:
      case KeyCode.A:
      case KeyCode.D:
        this.clearInterFunction();
        break;

      case KeyCode.BACKSPACE:
        break;
    }
  };
}
