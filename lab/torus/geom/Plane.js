import Vector3D from './Vector3D';


export default class Plane
{
    constructor(vert0, vertU, vertV)
    {
        this.origin = vert0;
        this.vecU = undefined;
        this.vecV = undefined;
        this.normal = undefined;

        this.setPlane(vertU, vertV);
    }

    setPlane(v1, v2)
    {
        var origin = this.origin;
        this.vecU = new Vector3D(v1.x - origin.x, v1.y - origin.y, v1.z - origin.z);
        this.vecV = new Vector3D(v2.x - origin.x, v2.y - origin.y, v2.z - origin.z);
        this.normal = Vector3D.cross(this.vecV, this.vecU);
    }

    getIntersect(loc, vec)
    {
        var f1 = this.normal.x * (this.origin.x - loc.x) +
                this.normal.y * (this.origin.y - loc.y) +
                this.normal.z * (this.origin.z - loc.z);

        var f2 = this.normal.x * vec.x +
                this.normal.y * vec.y +
                this.normal.z * vec.z;

        return f1 / f2;
    }

    isFront(point)
    {
        var l = this.getIntersect(point, this.normal);
        if(l < 0) return true;
        return false;
    }
}