import 'babel-polyfill';
import App from './App';
import KeyCode from '../../../src/consts/KeyCode';


(function () {
    window.onload = function () {
        var main = new Main();
    }
}());

class Main
{
    constructor()
    {
        this.init();
        this.addEvent();
        this.onresize();
    }

    init()
    {
        this.app = new App();
    }

    addEvent()
    {
        window.onresize = this.onresize.bind(this);
        window.addEventListener('keyup', this.onkeyup.bind(this));
    }

    onresize()
    {
        this.app.resize();
    }

    onkeyup(event)
    {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                console.clear();
                break;

            case KeyCode.SPACE:
                if (this.app.gui.closed) {
                    this.app.gui.open();
                }
                else {
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
