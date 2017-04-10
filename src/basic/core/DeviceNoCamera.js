import Matrix from '../geom/Matrix';
import Vector3D from '../geom/Vector3D';


export default class Device extends PIXI.Graphics
{
    /**
     * World 객체
     * @param stageWidth
     * @param stageHeight
     */
    constructor(stageWidth = 800, stageHeight = 600)
    {
        console.log('Device(', stageWidth, stageHeight, ')');
        super();
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.hw = this.stageWidth / 2;
        this.hh = this.stageHeight / 2;
    }

    /**
     * Vertex 에 변환 메트릭스를 적용하여 반환합니다.
     * @param point
     * @param transformMatrix
     * @returns {Vector3D}
     */
    project(point, transformMatrix)
    {
        // vertices 들에게 최종 변환 메트릭스를 적용
        let projected = Vector3D.transformCoordinates(point, transformMatrix);

        // 캔버스 사이즈로 점의 크기를 조절
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

    drawTriangle(vertex1, vertex2, vertex3, color = 0xFFFFFF, alpha = 1)
    {
        this.lineStyle(1, color, alpha);
        this.moveTo(vertex1.x, vertex1.y);
        this.lineTo(vertex2.x, vertex2.y);
        this.lineTo(vertex3.x, vertex3.y);
        this.closePath();
    }

    render(world, camera, meshes)
    {
        this.clear();

        let cameraPosition = camera.position;

        /**
         * 카메라 rotation 테스트
         * @type {Vector3D}
         */
        /*let cameraRotationX = Matrix.rotateX(camera.rotation.x);
        let cameraRotationY = Matrix.rotateY(camera.rotation.y);
        let cameraRotationZ = Matrix.rotateZ(camera.rotation.z);
        let cameraRotation = cameraRotationX.multiply(cameraRotationY).multiply(cameraRotationZ);
        cameraPosition = Vector3D.transformCoordinates(cameraPosition, cameraRotation);*/

        // yaw, roll. pitch 테스트
        //let cameraRotation = Matrix.rotationYPR(camera.yaw, camera.pitch, camera.roll);
        //cameraPosition = Vector3D.transformCoordinates(cameraPosition, cameraRotation);

        let stageTransfromMatrix = Matrix.translation(world.position.x, world.position.y, world.position.z);
        let stageRotationMatrix = Matrix.rotateX(world.rotation.x).multiply(Matrix.rotateY(world.rotation.y)).multiply(Matrix.rotateZ(world.rotation.z));

        /**
         * 뷰 행렬
         * @type {Matrix}
         */
        let viewMatrix = Matrix.lookAtLH(cameraPosition, camera.target, camera.up);

        /**
         * 투영 행렬
         * @type {Matrix}
         */
        let projectionMatrix = Matrix.perspectiveFovLH(0.78, this.stageWidth / this.stageHeight, .01, 1.0);

        // 매쉬 렌더링
        for (let i = 0; i < meshes.length; i++) {
            let currentMesh = meshes[i];

            /**
             * 매쉬의 회전 행렬
             * @type {Matrix}
             */
            let rotationMatrix = stageRotationMatrix.multiply(Matrix.rotateX(currentMesh.rotation.x)).multiply(Matrix.rotateY(currentMesh.rotation.y)).multiply(Matrix.rotateZ(currentMesh.rotation.z));

            /**
             * 월드 좌표계
             * @type {Matrix}
             */
            let worldMatrix = rotationMatrix.multiply(Matrix.translation(currentMesh.position.x, currentMesh.position.y, currentMesh.position.z).multiply(stageTransfromMatrix));
            // Final matrix to be applied to each vertex

            /**
             * 최종 변형 메트릭스
             * @type {Matrix}
             */
            let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

            for (let i = 0; i < currentMesh.faces.length; i++) {
                let face = currentMesh.faces[i];

                // face 의 vertex 를 가져와서
                let vertexA = currentMesh.vertices[face.A];
                let vertexB = currentMesh.vertices[face.B];
                let vertexC = currentMesh.vertices[face.C];

                // 최종 변환을 하고
                let projectedVertexA = this.project(vertexA, transformMatrix);
                let projectedVertexB = this.project(vertexB, transformMatrix);
                let projectedVertexC = this.project(vertexC, transformMatrix);

                // face 그리기
                this.drawTriangle(projectedVertexA, projectedVertexB, projectedVertexC, face.color, face.alpha);
            }
        }
    }
}