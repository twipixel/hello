import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Octahedron
{
    /**
     * 8면체
     */
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
            new Face(0, 2, 4, 0xA2DED0),
            new Face(0, 4, 3, 0xA2DED0),
            new Face(0, 3, 5, 0xA2DED0),
            new Face(0, 5, 2, 0xA2DED0),
            new Face(1, 2, 5, 0xA2DED0),
            new Face(1, 5, 3, 0xA2DED0),
            new Face(1, 3, 4, 0xA2DED0),
            new Face(1, 4, 2, 0xA2DED0)
        ];
    }

    render()
    {

    }
}