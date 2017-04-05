import Vector3D from '../geom/Vector3D';


export default class Camera
{
    constructor()
    {
        this.position = new Vector3D(0, 0, 20);
        this.target = new Vector3D(0, 0, 0);
        this.up = new Vector3D(0, 1, 0);
    }
}