import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Icosahedron {
    /**
     * 20면체
     * http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
     */
    constructor() {
        var alpha = 1;
        var color = 0xA2DED0;

        var positions = this.positions = this.vertices = [];
        var faces = this.faces = [];

        var t = 0.5 + Math.sqrt(5) / 2;

        positions.push(new Vector3D(-1, +t,  0));
        positions.push(new Vector3D(+1, +t,  0));
        positions.push(new Vector3D(-1, -t,  0));
        positions.push(new Vector3D(+1, -t,  0));

        positions.push(new Vector3D(0, -1, +t));
        positions.push(new Vector3D(0, +1, +t));
        positions.push(new Vector3D(0, -1, -t));
        positions.push(new Vector3D(0, +1, -t));

        positions.push(new Vector3D(+t,  0, -1));
        positions.push(new Vector3D(+t,  0, +1));
        positions.push(new Vector3D(-t,  0, -1));
        positions.push(new Vector3D(-t,  0, +1));

        faces.push(new Face(0, 11, 5, color, alpha));
        faces.push(new Face(0, 5, 1, color, alpha));
        faces.push(new Face(0, 1, 7, color, alpha));
        faces.push(new Face(0, 7, 10, color, alpha));
        faces.push(new Face(0, 10, 11, color, alpha));

        faces.push(new Face(1, 5, 9, color, alpha));
        faces.push(new Face(5, 11, 4, color, alpha));
        faces.push(new Face(11, 10, 2, color, alpha));
        faces.push(new Face(10, 7, 6, color, alpha));
        faces.push(new Face(7, 1, 8, color, alpha));

        faces.push(new Face(3, 9, 4, color, alpha));
        faces.push(new Face(3, 4, 2, color, alpha));
        faces.push(new Face(3, 2, 6, color, alpha));
        faces.push(new Face(3, 6, 8, color, alpha));
        faces.push(new Face(3, 8, 9, color, alpha));

        faces.push(new Face(4, 9, 5, color, alpha));
        faces.push(new Face(2, 4, 11, color, alpha));
        faces.push(new Face(6, 2, 10, color, alpha));
        faces.push(new Face(8, 6, 7, color, alpha));
        faces.push(new Face(9, 8, 1, color, alpha));
    }
}