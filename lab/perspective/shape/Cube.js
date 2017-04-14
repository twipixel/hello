import Face from './../geom/Face';
import RealFace from './../geom/RealFace';
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
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        var grids = this.grids = [];
        var faces = this.faces = [];
        var vertices = this.vertices = [];


        var v0 = new Vector3D(-x, -y, -z);  // 0 (좌상단) -> 반시계
        var v1 = new Vector3D(x, -y, z);    // 1
        var v2 = new Vector3D(x, -y, z);    // 2
        var v3 = new Vector3D(x, -y, -z);   // 3
        var v4 = new Vector3D(-x, y, -z);   // 4 (좌하단) -> 반시계
        var v5 = new Vector3D(-x, y, z);    // 5
        var v6 = new Vector3D(x, y, z);     // 6
        var v7 = new Vector3D(x, y, -z);    // 7



        // top-top: 0, 2, 3
        var tt0 = v0.clone();
        var tt1 = v2.clone();
        var tt2 = v3.clone();

        // top-bottom: 0, 1, 2
        var tb0 = v0.clone();
        var tb1 = v1.clone();
        var tb2 = v2.clone();

        // left-top: 0, 1, 4
        var lt0 = v0.clone();
        var lt1 = v1.clone();
        var lt2 = v4.clone();

        // left-bottom: 1, 5, 4
        var lb0 = v1.clone();
        var lb1 = v5.clone();
        var lb2 = v4.clone();

        // front-top: 1, 6, 2
        var ft0 = v1.clone();
        var ft1 = v6.clone();
        var ft2 = v2.clone();

        // front-bottom: 1, 5, 6
        var fb0 = v1.clone();
        var fb1 = v5.clone();
        var fb6 = v6.clone();

        // right-top: 2, 7, 3
        // right-bttom: 2, 6, 7

        // backward-top: 0, 7, 3
        // backward-bttom: 0, 4, 7

        // bottom-top: 4, 6, 7
        // bottom-bottom: 4, 5, 6



        tt0.u = 0;
        tt0.v = 0;
        tt1.u = 1;
        tt1.v = 1;
        tt2.u = 1;
        tt2.v = 0;




        var v = this.vertices = [
            new Vector3D(-x, -y, -z),   // 0 (좌상단) -> 반시계
            new Vector3D(-x, -y, z),    // 1
            new Vector3D(x, -y, z),     // 2
            new Vector3D(x, -y, -z),    // 3
            new Vector3D(-x, y, -z),    // 4 (좌하단) -> 반시계
            new Vector3D(-x, y, z),     // 5
            new Vector3D(x, y, z),      // 6
            new Vector3D(x, y, -z),     // 7
        ];

        // 라인 드로윙을 위한 좌표
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

        // 실제 faces
        this.realfaces = [
            new Face(0, 0, 0, 0xA2DED0),         // top-top
            new Face(0, 0, 0, 0xA2DED0),         // top-bottom
            new Face(0, 0, 0, 0xA2DED0),         // left-top
            new Face(0, 0, 0, 0xA2DED0),         // left-bottom
            new Face(0, 0, 0, 0xA2DED0),         // front-top
            new Face(0, 0, 0, 0xA2DED0),         // front-bottom
            new Face(0, 0, 0, 0xA2DED0),         // right-top
            new Face(0, 0, 0, 0xA2DED0),         // right-bottom
            new Face(0, 0, 0, 0xA2DED0),         // backward-top
            new Face(0, 0, 0, 0xA2DED0),         // backward-bottom
            new Face(0, 0, 0, 0xA2DED0),         // bottom-top
            new Face(0, 0, 0, 0xA2DED0)          // bottom-bottom
        ];
    }

    clone()
    {
        return new Cube(this.x, this.y, this.z, this.color);
    }
}