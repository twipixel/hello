import Vector3D from '../geom/Vector3D';


export default class Octahedron
{
    constructor()
    {
        let C0 = Math.sqrt(2) / 2;

        this.vertices = [
            new Vector3D(0.0, 0.0, C0),
            new Vector3D(0.0, 0.0, -C0),
            new Vector3D( C0, 0.0, 0.0),
            new Vector3D(-C0, 0.0, 0.0),
            new Vector3D(0.0, C0, 0.0),
            new Vector3D(0.0, -C0, 0.0),
        ];

        this.faces = [
            { A:0, B:2, C:4 },
            { A:0, B:4, C:3 },
            { A:0, B:3, C:5 },
            { A:0, B:5, C:2 },
            { A:1, B:2, C:5 },
            { A:1, B:5, C:3 },
            { A:1, B:3, C:4 },
            { A:1, B:4, C:2 },
        ];
    }
}