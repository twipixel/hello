export default class GraphicsTrianglePath
{
    /**
     *
     * @param vertices 정점좌표 배열
     * @param indices 정점좌표 별의 인덱스
     * @param uvtData 텍스처 매핑을 적용하는 데 사용되는 정규화된 좌표의 Vector
     */
    constructor(vertices, indices, uvtData)
    {
        this.vertices = vertices;
        this.indices = indices;
        this.uvtData = uvtData;
    }
}