import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Triangle
{
    constructor(size = 10)
    {
        var v = this.vertices = [
            new Vector3D(0, size, 0),
            new Vector3D(-size, -size, 0),
            new Vector3D(size, -size, 0)
        ];

        this.faces = [
            new Face(0, 0, 1, 0xA2DED0),
            new Face(1, 1, 2, 0xA2DED0),
            new Face(2, 2, 0, 0xA2DED0)
        ];

        var img = this.img = document.getElementById('uvTexture');
        var c = this.canvas = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        document.body.appendChild(c);
        this.canvas.id = 'triangle';
        var ctx = this.ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }

    render()
    {
        //var ctx = window.ctx;
        //var img = document.getElementById('uvTexture');
        //ctx.drawImage(img, 0, 0);
    }
}