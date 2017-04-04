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
        window.addEventListener('keydown', this.onkeydown.bind(this));
    }

    onresize()
    {
        this.app.resize();
    }

    /**
     *
     * @param func {Function}
     * @param params
     * @returns {intervalFunc}
     */
    getIntervalFunction (theArg, func, ...params)
    {
        function intervalFunc() {
            func.apply(theArg, params);
            clearTimeout(this.keyIntervalId);
            this.keyIntervalId = setTimeout(intervalFunc.bind(this), 200);
        }
        return intervalFunc.bind(this);
    }

    clearInterFunction()
    {
        clearTimeout(this.keyIntervalId);
    }

    onkeydown (event)
    {
        switch (event.keyCode) {
            case KeyCode.UP:
                this.getIntervalFunction(this.app, this.app.rotate, 'x', -1)();
                break;

            case KeyCode.DOWN:
                this.getIntervalFunction(this.app, this.app.rotate, 'x', 1)();
                break;

            case KeyCode.LEFT:
                this.getIntervalFunction(this.app, this.app.rotate, 'y', -1)();
                break;

            case KeyCode.RIGHT:
                this.getIntervalFunction(this.app, this.app.rotate, 'y', 1)();
                break;

            case KeyCode.PAGE_UP:
                this.getIntervalFunction(this.app, this.app.rotate, 'z', 1)();
                break;

            case KeyCode.PAGE_DOWN:
                this.getIntervalFunction(this.app, this.app.rotate, 'z', -1)();
                break;
        }
    }

    onkeyup (event)
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

            case KeyCode.UP:
            case KeyCode.DOWN:
            case KeyCode.LEFT:
            case KeyCode.RIGHT:
            case KeyCode.PAGE_UP:
            case KeyCode.PAGE_DOWN:
                this.clearInterFunction();
                break;

            case KeyCode.BACKSPACE:
                break;
        }
    };
}
