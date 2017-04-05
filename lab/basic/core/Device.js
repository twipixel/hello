import Matrix from '../geom/Matrix';
import Vector3D from '../geom/Vector3D';


export default class Device extends PIXI.Graphics {
    constructor(stageWidth = 800, stageHeight = 600)
    {
        super();
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
    }

    clear()
    {
        this.clear();
    }

    /**
     *
     * @param point
     * @param transformMatrix
     * @returns {Vector3D}
     */
    project(point, transformMatrix)
    {
        // Apply transformation matrix to each coordinate in the vertices array
        let projected = Vector3D.transformCoordinates(point, transformMatrix);
        // Scale the points by canvas size
        let x = projected.x * this.stageWidth + this.stageWidth / 2;
        let y = -projected.y * this.stageHeight + this.stageHeight / 2;
        let z = point.z;
        return new Vector3D(x, y, z);
    }

    drawPoint(vertex, color = 0xFFFFFF)
    {
        this.beginFill(color, 0.7);
        this.drawRect(vertex.x, vertex.y, 2, 2);
    }

    drawTriangle(vertex1, vertex2, vertex3)
    {
        this.lineStyle(1, 0xFF3300);
        this.moveTo(vertex1.x, vertex1.y); // pick up "pen," reposition
        this.lineTo(vertex2.x, vertex2.y); // draw line from vertex1 to vertex2
        this.lineTo(vertex3.x, vertex3.y); // draw line from vertex2 to vertex3
        this.closePath(); // connect end to start
        // Fill Triangles
        // this.ctx.fillStyle = 'rgba(129, 212, 250, .3)';
        // this.ctx.fill();
    }

    render(camera, meshes)
    {
        let viewMatrix = Matrix.lookAtLH(camera.position, camera.target, camera.up);
        console.log('viewMatrix', viewMatrix.m, camera.position, camera.target, camera.up);
        let projectionMatrix = Matrix.perspectiveFovLH(0.78, this.stageWidth / this.stageHeight, .01, 1.0);
        console.log('projectionMatrix', projectionMatrix.m);
        // Loop through meshes
        for (let i = 0; i < meshes.length; i++) {
            let currentMesh = meshes[i];

            let rotationMatrix = Matrix.rotateX(currentMesh.rotation.x).multiply(Matrix.rotateY(currentMesh.rotation.y)).multiply(Matrix.rotateZ(currentMesh.rotation.z));
            console.log('rotationMatrix', rotationMatrix);

            let worldMatrix = rotationMatrix.multiply(Matrix.translation(currentMesh.position.y, currentMesh.position.x, currentMesh.position.z));
            // Final matrix to be applied to each vertex
            let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
            // Loop through faces in each mesh
            for (let i = 0; i < currentMesh.faces.length; i++) {
                let face = currentMesh.faces[i];
                // Create each triangular face using indexes from faces array
                let vertexA = currentMesh.vertices[face.A];
                let vertexB = currentMesh.vertices[face.B];
                let vertexC = currentMesh.vertices[face.C];

                // Project each vertex in the face by applying transformation matrix to all points
                let projectedVertexA = this.project(vertexA, transformMatrix);
                let projectedVertexB = this.project(vertexB, transformMatrix);
                let projectedVertexC = this.project(vertexC, transformMatrix);

                // Draw Triangles
                this.drawTriangle(projectedVertexA, projectedVertexB, projectedVertexC);

            }
        }
    }
}