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
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        var right = document.getElementById('sky-right');
        var left = document.getElementById('sky-left');
        var top = document.getElementById('sky-top');
        var bottom = document.getElementById('sky-bottom');
        var front = document.getElementById('sky-front');
        var back = document.getElementById('sky-back');

        var v0 = new Vector3D(-x, -y, -z);      // 0 (좌상단) -> 반시계
        var v1 = new Vector3D(-x, -y, z);       // 1
        var v2 = new Vector3D(x, -y, z);        // 2
        var v3 = new Vector3D(x, -y, -z);       // 3
        var v4 = new Vector3D(-x, y, -z);       // 4 (좌하단) -> 반시계
        var v5 = new Vector3D(-x, y, z);        // 5
        var v6 = new Vector3D(x, y, z);         // 6
        var v7 = new Vector3D(x, y, -z);        // 7

        // Cube Map 순서 Right, Left, Top, Bottom, Front, Back

        // right-top: 2, 7, 3
        var rt0 = this.rt0 = v2.clone();
        var rt1 = this.rt1 = v7.clone();
        var rt2 = this.rt2 = v3.clone();

        // right-bttom: 2, 6, 7
        var rb0 = this.rb0 = v2.clone();
        var rb1 = this.rb1 = v6.clone();
        var rb2 = this.rb2 = v7.clone();

        // left-top: 1, 4, 0
        var lt0 = this.lt0 = v1.clone();
        var lt1 = this.lt1 = v4.clone();
        var lt2 = this.lt2 = v0.clone();

        // left-bottom: 1, 5, 4
        var lb0 = this.lb0 = v1.clone();
        var lb1 = this.lb1 = v5.clone();
        var lb2 = this.lb2 = v4.clone();

        // top-top: 4, 6, 7
        var tt0 = this.tt0 = v4.clone();
        var tt1 = this.tt1 = v6.clone();
        var tt2 = this.tt2 = v7.clone();

        // top-bottom: 4, 5, 6
        var tb0 = this.tb0 = v4.clone();
        var tb1 = this.tb1 = v5.clone();
        var tb2 = this.tb2 = v6.clone();

        // bottom-top: 2, 0, 1
        var bt0 = this.bt0 = v2.clone();
        var bt1 = this.bt1 = v0.clone();
        var bt2 = this.bt2 = v1.clone();

        // bottom-bottom: 2, 3, 0
        var bb0 = this.bb0 = v2.clone();
        var bb1 = this.bb1 = v3.clone();
        var bb2 = this.bb2 = v0.clone();

        // front-top: 0, 7, 3
        var ft0 = this.ft0 = v0.clone();
        var ft1 = this.ft1 = v7.clone();
        var ft2 = this.ft2 = v3.clone();

        // front-bottom: 0, 4, 7
        var fb0 = this.fb0 = v0.clone();
        var fb1 = this.fb1 = v4.clone();
        var fb2 = this.fb2 = v7.clone();

        // backward-top: 1, 6, 2
        var et0 = this.et0 = v1.clone();
        var et1 = this.et1 = v6.clone();
        var et2 = this.et2 = v2.clone();

        // backward-bttom: 1, 5, 6
        var eb0 = this.eb0 = v1.clone();
        var eb1 = this.eb1 = v5.clone();
        var eb2 = this.eb2 = v6.clone();

        // Cube Map 순서 Right, Left, Top, Bottom, Front, Back
        var u = 512;
        var v = 512;

        // right-top: 2, 7, 3
        rt0.u = u;
        rt0.v = v;
        rt1.u = 0;
        rt1.v = 0;
        rt2.u = 0;
        rt2.v = v;

        // right-bttom: 2, 6, 7
        rb0.u = u;
        rb0.v = v;
        rb1.u = u;
        rb1.v = 0;
        rb2.u = 0;
        rb2.v = 0;

        // left-top: 1, 4, 0
        lt0.u = 0;
        lt0.v = v;
        lt1.u = u;
        lt1.v = 0;
        lt2.u = u;
        lt2.v = v;

        // left-bottom: 1, 5, 4
        lb0.u = 0;
        lb0.v = v;
        lb1.u = 0;
        lb1.v = 0;
        lb2.u = u;
        lb2.v = 0;

        // top-top: 0, 2, 3
        tt0.u = 0;
        tt0.v = v;
        tt1.u = u;
        tt1.v = 0;
        tt2.u = u;
        tt2.v = v;

        // top-bottom: 0, 1, 2
        tb0.u = 0;
        tb0.v = v;
        tb1.u = 0;
        tb1.v = 0;
        tb2.u = u;
        tb2.v = 0;

        // bottom-top: 2, 0, 1
        bt0.u = u;
        bt0.v = v;
        bt1.u = 0;
        bt1.v = 0;
        bt2.u = 0;
        bt2.v = v;

        // bottom-bottom: 2, 3, 0
        bb0.u = u;
        bb0.v = v;
        bb1.u = u;
        bb1.v = 0;
        bb2.u = 0;
        bb2.v = 0;

        // front-top: 1, 6, 2
        ft0.u = 0;
        ft0.v = v;
        ft1.u = u;
        ft1.v = 0;
        ft2.u = u;
        ft2.v = v;

        // front-bottom: 1, 5, 6
        fb0.u = 0;
        fb0.v = v;
        fb1.u = 0;
        fb1.v = 0;
        fb2.u = u;
        fb2.v = 0;

        // backward-top: 0, 7, 3
        et0.u = u;
        et0.v = v;
        et1.u = 0;
        et1.v = 0;
        et2.u = 0;
        et2.v = v;

        // backward-bttom: 0, 4, 7
        eb0.u = u;
        eb0.v = v;
        eb1.u = u;
        eb1.v = 0;
        eb2.u = 0;
        eb2.v = 0;

        this.vertices = [
            rt0, rt1, rt2, rb0, rb1, rb2, // 0, 1, 2, 3, 4, 5
            lt0, lt1, lt2, lb0, lb1, lb2, // 6, 7, 8, 9, 10, 11
            tt0, tt1, tt2, tb0, tb1, tb2, // 12, 13, 14, 15, 16, 17
            bt0, bt1, bt2, bb0, bb1, bb2, // 18, 19, 20, 21, 22, 23
            ft0, ft1, ft2, fb0, fb1, fb2, // 24, 25, 26, 27, 28, 29
            et0, et1, et2, eb0, eb1, eb2 // 30, 31, 32, 33, 34, 35
        ];

        this.faces = [
            new Face(0, 1, 2, 0xA2DED0, 1, right),
            new Face(3, 4, 5, 0xA2DED0, 1, right),

            new Face(6, 7, 8, 0xA2DED0, 1, left),
            new Face(9, 10, 11, 0xA2DED0, 1, left),

            new Face(12, 13, 14, 0xA2DED0, 1, top),
            new Face(15, 16, 17, 0xA2DED0, 1, top),

            new Face(18, 19, 20, 0xA2DED0, 1, bottom),
            new Face(21, 22, 23, 0xA2DED0, 1, bottom),

            new Face(24, 25, 26, 0xA2DED0, 1, front),
            new Face(27, 28, 29, 0xA2DED0, 1, front),

            new Face(30, 31, 32, 0xA2DED0, 1, back),
            new Face(33, 34, 35, 0xA2DED0, 1, back)
        ];

        // 실제 face
        /*this.realFaces = [
            new Face(0, 1, 2, 0xA2DED0, 1, right),
            new Face(3, 4, 5, 0xA2DED0, 1, right),

            new Face(6, 7, 8, 0xA2DED0, 1, left),
            new Face(9, 10, 11, 0xA2DED0, 1, left),

            new Face(12, 13, 14, 0xA2DED0, 1, top),
            new Face(15, 16, 17, 0xA2DED0, 1, top),

            new Face(18, 19, 20, 0xA2DED0, 1, bottom),
            new Face(21, 22, 23, 0xA2DED0, 1, bottom),

            new Face(24, 25, 26, 0xA2DED0, 1, front),
            new Face(27, 28, 29, 0xA2DED0, 1, front),

            new Face(30, 31, 32, 0xA2DED0, 1, back),
            new Face(33, 34, 35, 0xA2DED0, 1, back)
        ];*/
    }

    clone()
    {
        return new Cube(this.x, this.y, this.z, this.color);
    }
}