import {
    animation,
    requestAnimationFrame,
    cancelAnimationFrame,
    Easing
} from './../../external/lib/animation';

import Surface from './geom/Surface';
import Rectangle from './geom/Rectangle';


export default class App
{
    constructor()
    {
        this.app = new PIXI.Application(800, 600, {backgroundColor:0x000000});
        document.body.appendChild(this.app.view);

        this.canvas = this.app.renderer.view;
        this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
        this.tick();
        this.addEvent();
    }

    initialize()
    {
        this.surface = new Surface();
        this.surface.x = this.canvas.width / 2;
        this.surface.y = this.canvas.height / 2;
        this.surface.generate();
        this.surface.color();
        this.surface.xRotate(-1);
        this.stage.addChild(this.surface);
    }

    initializeGUI()
    {
        this.gui = new dat.GUI();
    }

    tick(ms)
    {
        this.render(ms);
        requestAnimationFrame(this.tick.bind(this));
    }

    addEvent()
    {

    }

    render(ms)
    {

    }

    resize()
    {

    }
}