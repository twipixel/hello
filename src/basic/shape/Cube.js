import Face from './../geom/Face';
import Vector3D from './../geom/Vector3D';


export default class Cube
{
    /**
     *
     * @param x {uint} 표시할 x축 눈금 길이
     * @param y {uint} 표시할 y축 눈금 길이
     * @param z {uint} 표시할 z축 눈금 길이
     * @param color {Number} 표면 색상
     */
    constructor(x = 50, y = 50, z = 50, color = 0xF2F2F2)
    {
        var grids = this.grids = [];
        var faces = this.faces = [];
        var vertices = this.vertices = [];

        var v = this.vertices = [
            new Vector3D(-x, -y, -z),   // 0 (좌상단) -> 반시계
            new Vector3D(-x, -y, z),    // 1
            new Vector3D(x, -y, z),     // 2
            new Vector3D(x, -y, -z),    // 3
            new Vector3D(-x, y, -z),    // 4 (좌하단) -> 반시계
            new Vector3D(-x, y, z),     // 5
            new Vector3D(x, y, z),      // 6
            new Vector3D(x, y, -z),      // 7
        ];

        this.faces = [
            new Face(0, 0, 1, 0xA2DED0),
            new Face(1, 1, 2, 0xA2DED0),
            new Face(2, 2, 3, 0xA2DED0),
            new Face(3, 3, 0, 0xA2DED0),
            new Face(4, 4, 5, 0xA2DED0),
            new Face(5, 5, 6, 0xA2DED0),
            new Face(6, 6, 7, 0xA2DED0),
            new Face(7, 7, 4, 0xA2DED0),
            new Face(0, 0, 4, 0xA2DED0),
            new Face(1, 1, 5, 0xA2DED0),
            new Face(2, 2, 6, 0xA2DED0),
            new Face(3, 3, 7, 0xA2DED0)
        ];
    }
}