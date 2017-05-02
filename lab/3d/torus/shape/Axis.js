import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Axis
{
    constructor(from = new Vector3Dx(0, 0, 0), to = new Vector3D(0, 0, 0))
    {
        this.to = to;
        this.from = from;

        var alpha = 0.3;
        var color = 0x8E44AD;

        this.vertices = [
            from,
            to
        ];

        this.faces = [
            new Face(0, 1, 0, color, alpha)
        ];
    }
}