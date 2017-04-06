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
            { A:0, B:1, C:0 }
        ];
    }
}