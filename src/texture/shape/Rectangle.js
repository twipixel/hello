import Face from '../../basic/geom/Face';
import Vector3D from '../../basic/geom/Vector3D';


export default class Rectangle
{
    constructor(width = 10, height = 10)
    {
        var v = this.vertices = [
            new Vector3D(-width, -height, 0),
            new Vector3D(-width, height, 0),
            new Vector3D(width, height, 0),
            new Vector3D(width, -height, 0)
        ];

        this.faces = this.indices = [
            new Face(0, 1, 2, 0xA2DED0),
            new Face(0, 2, 3, 0xA2DED0)
        ];
    }
}