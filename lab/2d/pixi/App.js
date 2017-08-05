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