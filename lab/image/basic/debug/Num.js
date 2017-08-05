export default class Num extends PIXI.Graphics
{
    /**
     *
     * @param text {String}
     * @param style {PIXI.TextStyle}
     */
    constructor(text, style = null, backgroundColor = 0xFFFFFF)
    {
        super();

        style = (style) ? style : {};
        Object.assign(style, { align: 'center'});

        var text = new PIXI.Text(text, style);
        this.addChild(text);

        var w = text.width;
        var h = text.height;
        var size = Math.max(w, h);
        var hw = w / 2;
        var hh = h / 2;
        var hs = size / 2;

        text.x = -hw;
        text.y = -hh;

        this.beginFill(backgroundColor);
        this.drawRect(-hs, -hs, size, size);
        this.endFill();
    }
}