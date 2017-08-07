import Ticker from './vendor/pixi/src/core/ticker/Ticker';


var EventEmitter = require('eventemitter3');


export default class App
{
    constructor()
    {
        this.initialize();
        this.initializeGUI();
    }


    initialize()
    {
        console.log('App.initialize()');


        // this.testEventEmitter();
        this.testTicker();
    }


    testEventEmitter()
    {
        const event = new EventEmitter();

        const test0 = this.test0.bind(this);
        const test1 = this.test1.bind(this);
        const test2 = this.test2.bind(this);
        const test3 = this.test3.bind(this);

        event.on('test', test0);
        event.on('test', test1);
        event.on('test', test2);
        event.on('test', test3);

        // event.off('test', test2);
        // event.off('test', test0);
        // event.off('test', test1);
        // event.off('test', test3);

        event.removeAllListeners('test');

        event.emit('test');
    }


    testTicker()
    {
        var ticker = new Ticker();
        ticker.start();
        console.log('ticker', ticker);

        const test0 = this.test0.bind(this);
        const test1 = this.test1.bind(this);
        const test2 = this.test2.bind(this);
        const test3 = this.test3.bind(this);

        ticker.add(test0);
        ticker.add(test1);
        //ticker.add(test2);
        //ticker.add(test3);

    }


    test0()
    {
        //console.log('test0');
    }


    test1()
    {
        //console.log('test1');
    }


    test2()
    {
        //console.log('test2');
    }


    test3()
    {
        //console.log('test3');
    }

    initializeGUI()
    {
        this.gui = new dat.GUI();
        this.config = {
            x:0,
            y:0,
            z:0,
            prevx:0,
            prevy:0,
            prevz:0,
        };
        /*this.config.autorotate = this.autorotate.bind(this);
        this.config.reset = this.reset.bind(this);
        this.gui.add(this.config, 'x').min(0).max(this.canvas.width).step(1).onChange((value) => {
            var dx = value - this.config.prevx;
            this.config.prevx = value;
            this.cube.setProperty('x', dx);
        });
        this.gui.add(this.config, 'y').min(0).max(this.canvas.height).step(1).onChange((value) => {
            var dy = value - this.config.prevy;
            this.config.prevy = value;
            this.cube.setProperty('y', dy);
        });
        this.gui.add(this.config, 'z').min(-300).max(300).step(1).onChange((value) => {
            var dz = value - this.config.prevz;
            this.config.prevz = value;
            this.cube.setProperty('z', dz);
        });
        this.gui.add(this.config, 'autorotate');
        this.gui.add(this.config, 'reset');*/
    }

}