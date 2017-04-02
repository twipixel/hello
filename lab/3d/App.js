export default class App
{
    constructor()
    {
        this.app = new PIXI.Application(800, 600, {backgroundColor : 0x8BC34A});
        document.body.appendChild(this.app.view);

        this.canvas = this.app.renderer.view;
        this.stage = this.app.stage;

        this.initialize();
        this.initializeGUI();
    }

    initialize()
    {

    }

    initializeGUI()
    {
        this.gui = new dat.GUI();
    }

    resize()
    {

    }
}