import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class TriakisIcosahedron
{
    constructor()
    {
        let C0 = 5 * (7 + Math.sqrt(5)) / 44;
        let C1 = 5 * (3 + 2 * Math.sqrt(5)) / 22;
        let C2 = (5 + Math.sqrt(5)) / 4;
        let C3 = 5 * (13 + 5 * Math.sqrt(5)) / 44;
        let C4 = (5 + 3 * Math.sqrt(5)) / 4;

        this.vertices = [
            new Vector3D( C2, 0.0,  C4),
            new Vector3D( C2, 0.0, -C4),
            new Vector3D(-C2, 0.0,  C4),
            new Vector3D(-C2, 0.0, -C4),
            new Vector3D( C4,  C2, 0.0),
            new Vector3D( C4, -C2, 0.0),
            new Vector3D(-C4,  C2, 0.0),
            new Vector3D(-C4, -C2, 0.0),
            new Vector3D(0.0,  C4,  C2),
            new Vector3D(0.0,  C4, -C2),
            new Vector3D(0.0, -C4,  C2),
            new Vector3D(0.0, -C4, -C2),
            new Vector3D(0.0,  C0,  C3),
            new Vector3D(0.0,  C0, -C3),
            new Vector3D(0.0, -C0,  C3),
            new Vector3D(0.0, -C0, -C3),
            new Vector3D( C3, 0.0,  C0),
            new Vector3D( C3, 0.0, -C0),
            new Vector3D(-C3, 0.0,  C0),
            new Vector3D(-C3, 0.0, -C0),
            new Vector3D( C0,  C3, 0.0),
            new Vector3D( C0, -C3, 0.0),
            new Vector3D(-C0,  C3, 0.0),
            new Vector3D(-C0, -C3, 0.0),
            new Vector3D( C1,  C1,  C1),
            new Vector3D( C1,  C1, -C1),
            new Vector3D( C1, -C1,  C1),
            new Vector3D( C1, -C1, -C1),
            new Vector3D(-C1,  C1,  C1),
            new Vector3D(-C1,  C1, -C1),
            new Vector3D(-C1, -C1,  C1),
            new Vector3D(-C1, -C1, -C1),
        ];

        this.faces = [
            new Face(12, 0, 8),
            new Face(12, 8, 2),
            new Face(13, 1, 3),
            new Face(13, 3, 9),
            new Face(12, 2, 0),
            new Face(13, 9, 1),
            new Face(14, 0, 2),
            new Face(14, 10, 0),
            new Face(14, 2, 10),
            new Face(15, 11, 3),
            new Face(15, 3, 1),
            new Face(15, 1, 11),
            new Face(16, 0, 5),
            new Face(16, 5, 4),
            new Face(16, 4, 0),
            new Face(17, 4, 5),
            new Face(17, 1, 4),
            new Face(18, 2, 6),
            new Face(18, 6, 7),
            new Face(17, 5, 1),
            new Face(18, 7, 2),
            new Face(19, 3, 7),
            new Face(19, 7, 6),
            new Face(20, 4, 9),
            new Face(19, 6, 3),
            new Face(20, 9, 8),
            new Face(20, 8, 4),
            new Face(21, 5, 10),
            new Face(21, 11, 5),
            new Face(22, 8, 9),
            new Face(21, 10, 11),
            new Face(22, 6, 8),
            new Face(22, 9, 6),
            new Face(23, 7, 11),
            new Face(23, 10, 7),
            new Face(23, 11, 10),
            new Face(24, 4, 8),
            new Face(24, 0, 4),
            new Face(25, 1, 9),
            new Face(25, 9, 4),
            new Face(24, 8, 0),
            new Face(25, 4, 1),
            new Face(26, 10, 5),
            new Face(26, 0, 10),
            new Face(27, 1, 5),
            new Face(26, 5, 0),
            new Face(27, 11, 1),
            new Face(27, 5, 11),
            new Face(28, 8, 6),
            new Face(28, 2, 8),
            new Face(29, 3, 6),
            new Face(29, 9, 3),
            new Face(28, 6, 2),
            new Face(29, 6, 9),
            new Face(30, 2, 7),
            new Face(30, 10, 2),
            new Face(31, 3, 11),
            new Face(31, 7, 3),
            new Face(31, 11, 7),
            new Face(30, 7, 10),
        ];
    }

    render()
    {

    }
}