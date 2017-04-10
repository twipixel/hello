import Vector3D from './Vector3D';


export default class Mesh
{
    constructor(shape)
    {
        this.faces = shape.faces;
        this.vertices = shape.vertices;
        this.rotation = new Vector3D(0, 0, 0);
        this.position = new Vector3D(0, 0, 0);
        this.velocity = new Vector3D(0, 0, 0);
        this.acceleration = new Vector3D(0, 0, 0);
    }
}