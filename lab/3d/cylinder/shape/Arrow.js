import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Arrow
{
    constructor(axis = 'x', from = new Vector3D(), to = new Vector3D(), arrowSize = 1)
    {
        var arrowSize = arrowSize;

        this.to = to;
        this.from = from;

        var faceAlpha = 0.3;
        var faceColor = (axis == 'x') ? 0xE91E63 : (axis === 'y') ? 0x8BC34A : 0x03A9F4;

        this.vertices = [
            from,
            to
        ];

        this.faces = [
            new Face(0, 1, 0, faceColor, faceAlpha)
        ];


        if (axis === 'x') {
            this.vertices.push(new Vector3D(to.x - arrowSize, to.y + arrowSize, to.z));
            this.vertices.push(new Vector3D(to.x - arrowSize, to.y - arrowSize, to.z));
            this.vertices.push(new Vector3D(to.x - arrowSize, to.y, to.z + arrowSize));
            this.vertices.push(new Vector3D(to.x - arrowSize, to.y, to.z - arrowSize));
            this.faces.push(new Face(1, 2, 3, faceColor, faceAlpha));
            this.faces.push(new Face(1, 4, 5, faceColor, faceAlpha));
        }
        else if (axis === 'y') {
            this.vertices.push(new Vector3D(to.x - arrowSize, to.y - arrowSize, to.z));
            this.vertices.push(new Vector3D(to.x + arrowSize, to.y - arrowSize, to.z));
            this.vertices.push(new Vector3D(to.x, to.y - arrowSize, to.z - arrowSize));
            this.vertices.push(new Vector3D(to.x, to.y - arrowSize, to.z + arrowSize));
            this.faces.push(new Face(1, 2, 3, faceColor, faceAlpha));
            this.faces.push(new Face(1, 4, 5, faceColor, faceAlpha));
        }
        else {
            this.vertices.push(new Vector3D(to.x - arrowSize, to.y, to.z - arrowSize));
            this.vertices.push(new Vector3D(to.x + arrowSize, to.y, to.z - arrowSize));
            this.vertices.push(new Vector3D(to.x, to.y - arrowSize, to.z - arrowSize));
            this.vertices.push(new Vector3D(to.x, to.y + arrowSize, to.z - arrowSize));
            this.faces.push(new Face(1, 2, 3, faceColor, faceAlpha));
            this.faces.push(new Face(1, 4, 5, faceColor, faceAlpha));
        }
    }
}