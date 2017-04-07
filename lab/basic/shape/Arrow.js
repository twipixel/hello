import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Arrow
{
    constructor(from = new Vector3Dx(0, 0, 0), to = new Vector3D(0, 0, 0))
    {
        this.vertices = [
            from,
            to
        ];

        this.faces = [
            new Face(0, 1, 0)
        ];
    }
}