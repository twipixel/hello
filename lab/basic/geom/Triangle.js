import Matrix from './Matrix';
import Vector3D from './Vector3D';


export default class Triangle
{
    /**
     *
     * @param pos1 {Vector3D} Vertex1
     * @param pos2 {Vector3D} Vertex2
     * @param pos3 {Vector3D} Vertex3
     * @param scale
     */
    constructor(pos1, pos2, pos3, scale)
    {
        this.pos1 = pos1.normalize().multiply(scale);
        this.pos2 = pos2.normalize().multiply(scale);
        this.pos3 = pos3.normalize().multiply(scale);
        this.scale = scale;

        var v1 = this.pos1.clone().subtract(this.pos2);
        var v2 = this.pos3.clone().subtract(this.pos2);

        this.avg = this.pos1.clone().add(this.pos2).add(this.pos3).divide(3);

        this.normal = Vector3D.cross(v2, v1);
        this.normal.normalize();
    }

    rotate (x, y, z)
    {
        var rotX = Matrix.rotateX(x);
        var rotY = Matrix.rotateY(y);
        var rotZ = Matrix.rotateZ(z);

        var rot = rotZ.multiply(rotY).multiply(rotX);
        this.pos1 = rot.multiplyVector(this.pos1);
        this.pos2 = rot.multiplyVector(this.pos2);
        this.pos3 = rot.multiplyVector(this.pos3);

        this.avg = this.pos1.clone().add(this.pos2).add(this.pos3).divide(3);

        var v1 = this.pos1.clone().subtract(this.pos2);
        var v2 = this.pos3.clone().subtract(this.pos2);

        this.normal = Vector3D.cross(v2, v1);
        this.normal.normalize();
    }

    subdivide ()
    {
        var v12 = new Vector3D(0, 0, 0);
        var v23 = new Vector3D(0, 0, 0);
        var v31 = new Vector3D(0, 0, 0);

        var prop = ["x", "y", "z"]

        for (var i = 0; i < 3; i++) {
            var p = prop[i];
            v12[p] = this.pos1[p] + this.pos2[p];
            v23[p] = this.pos2[p] + this.pos3[p];
            v31[p] = this.pos3[p] + this.pos1[p];
        }

        v12.normalize().multiply(this.scale);
        v23.normalize().multiply(this.scale);
        v31.normalize().multiply(this.scale);

        return [
            new Triangle(this.pos1, v12, v31, this.scale),
            new Triangle(this.pos2, v23, v12, this.scale),
            new Triangle(this.pos3, v31, v23, this.scale),
            new Triangle(v12, v23, v31, this.scale)
        ];
    }
}