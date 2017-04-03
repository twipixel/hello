import 'babel-polyfill';
import App from './App';
import KeyCode from '../../src/consts/KeyCode';


(function ()
{
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
        this.onResize();
    }

    init()
    {
        this.app = new App();
    }

    addEvent()
    {
        window.onresize = this.onResize.bind(this);
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onResize()
    {
        this.app.resize();
    }

    onKeyUp (e)
    {
        switch (e.keyCode) {
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

            case KeyCode.UP:
                this.app.surface.xRotate(-1);
                break;

            case KeyCode.DOWN:
                this.app.surface.xRotate(1);
                break;

            case KeyCode.LEFT:
                this.app.surface.yRotate(-1);
                break;

            case KeyCode.RIGHT:
                this.app.surface.yRotate(1);
                break;

            case KeyCode.BACKSPACE:
                break;
        }
    };
}
