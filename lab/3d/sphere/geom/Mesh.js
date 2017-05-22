import Vector3D from './Vector3D';


export default class Mesh
{
    constructor(shape)
    {
        this.shape = shape;
        this.faces = shape.faces;
        this.vertices = shape.vertices;
        this.rotation = new Vector3D(0, 0, 0);
        this.position = new Vector3D(0, 0, 0);
        this.velocity = new Vector3D(0, 0, 0);
        this.acceleration = new Vector3D(0, 0, 0);
    }

    clone()
    {
        var cloneShape = this.shape.clone();
        var cloneMesh = new Mesh(cloneShape);
        cloneMesh.rotation = this.rotation.clone();
        cloneMesh.position = this.position.clone();
        cloneMesh.velocity = this.velocity.clone();
        cloneMesh.acceleration = this.acceleration.clone();

        // debug code
        cloneMesh.name = this.shape.name;
        cloneMesh.useCulling = this.shape.useCulling;
        return cloneMesh;
    }
}