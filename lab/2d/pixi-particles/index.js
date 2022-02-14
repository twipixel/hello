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

      case KeyCode.DOWN:
        break;

      case KeyCode.UP:
        break;

      case KeyCode.LEFT:
        break;

      case KeyCode.RIGHT:
        break;

      case KeyCode.BACKSPACE:
        break;
    }
  };
}
