import Face from './../geom/Face';
import Vector3D from './../geom/Vector3D';


export default class CoordinateBox
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
        console.log('CoordinateBox(', x, y, z, ')');

        var grids = this.grids = [];
        var faces = this.faces = [];
        var vertices = this.vertices = [];

        var alpha = 0.3;
        var cx = 0, cy = 0, cz = 0;
        var hx = x / 2, hy = y / 2, hz = z / 2;

        var v = this.vertices = [
            new Vector3D(-x, -y, -z),   // 0 (좌상단) -> 반시계
            new Vector3D(-x, -y, z),    // 1
            new Vector3D(x, -y, z),     // 2
            new Vector3D(x, -y, -z),    // 3
            new Vector3D(-x, y, -z),    // 4 (좌하단) -> 반시계
            new Vector3D(-x, y, z),     // 5
            new Vector3D(x, y, z),      // 6
            new Vector3D(x, y, -z),      // 7

            new Vector3D(-x, y, -hz),  // 8 (1)
            new Vector3D(-x, -y, -hz),   // 9 (2)
            new Vector3D(x, -y, -hz),    // 10 (3)
            new Vector3D(-x, y, -cz),  // 11 (4)
            new Vector3D(-x, -y, -cz),   // 12 (5)
            new Vector3D(x, -y, -cz),    // 13 (6)
            new Vector3D(-x, y, hz),   // 14 (7)
            new Vector3D(-x, -y, hz),    // 15 (8)
            new Vector3D(x, -y, hz),     // 16 (9)

            new Vector3D(-x, hy, -z),   // 17 (10)
            new Vector3D(-x, hy, z),  // 18 (11)
            new Vector3D(x, hy, z),   // 19 (12)
            new Vector3D(-x, cy, -z),    // 20 (13)
            new Vector3D(-x, cy, z),   // 21 (14)
            new Vector3D(x, cy, z),    // 22 (15)
            new Vector3D(-x, -hy, -z),    // 23 (16)
            new Vector3D(-x, -hy, z),   // 24 (17)
            new Vector3D(x, -hy, z),    // 25 (18)

            new Vector3D(-hx, y, z),  // 26 (19)
            new Vector3D(-hx, -y, z),   // 27 (20)
            new Vector3D(-hx, -y, -z),    // 28 (21)
            new Vector3D(cx, y, z),   // 29 (22)
            new Vector3D(cx, -y, z),    // 30 (23)
            new Vector3D(cx, -y, -z),     // 31 (24)
            new Vector3D(hx, y, z),   // 32 (25)
            new Vector3D(hx, -y, z),    // 33 (26)
            new Vector3D(hx, -y, -z)      // 34 (27)
        ];

        this.faces = [
            new Face(0, 0, 1, 0x19B5FE, alpha),
            new Face(1, 1, 2, 0x19B5FE, alpha),
            new Face(2, 2, 3, 0x19B5FE, alpha),
            new Face(3, 3, 0, 0x19B5FE, alpha),
            new Face(4, 4, 5, 0x19B5FE, alpha),
            new Face(5, 5, 6, 0x19B5FE, alpha),
            new Face(6, 6, 7, 0x19B5FE, alpha),
            new Face(7, 7, 4, 0x19B5FE, alpha),
            new Face(0, 0, 4, 0x19B5FE, alpha),
            new Face(1, 1, 5, 0x19B5FE, alpha),
            new Face(2, 2, 6, 0x19B5FE, alpha),
            new Face(3, 3, 7, 0x19B5FE, alpha),

            new Face(8, 8, 9, 0xC5EFF7, alpha),
            new Face(9, 9, 10, 0xC5EFF7, alpha),
            new Face(11, 11, 12, 0xC5EFF7, alpha),
            new Face(12, 12, 13, 0xC5EFF7, alpha),
            new Face(14, 14, 15, 0xC5EFF7, alpha),
            new Face(15, 15, 16, 0xC5EFF7, alpha),
            new Face(17, 17, 18, 0xC5EFF7, alpha),
            new Face(18, 18, 19, 0xC5EFF7, alpha),
            new Face(20, 20, 21, 0xC5EFF7, alpha),
            new Face(21, 21, 22, 0xC5EFF7, alpha),
            new Face(23, 23, 24, 0xC5EFF7, alpha),
            new Face(24, 24, 25, 0xC5EFF7, alpha),
            new Face(26, 26, 27, 0xC5EFF7, alpha),
            new Face(27, 27, 28, 0xC5EFF7, alpha),
            new Face(29, 29, 30, 0xC5EFF7, alpha),
            new Face(30, 30, 31, 0xC5EFF7, alpha),
            new Face(32, 32, 33, 0xC5EFF7, alpha),
            new Face(33, 33, 34, 0xC5EFF7, alpha)
        ];
    }
}