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

        var v0 = new Vector3D(-x, y, z);      // 0 (좌상단) -> 반시계
        var v1 = new Vector3D(-x, y, -z);     // 1
        var v2 = new Vector3D(x, y, -z);      // 2
        var v3 = new Vector3D(x, y, z);       // 3
        var v4 = new Vector3D(-x, -y, z);     // 4 (좌하단) -> 반시계
        var v5 = new Vector3D(-x, -y, -z);    // 5
        var v6 = new Vector3D(x, -y, -z);     // 6
        var v7 = new Vector3D(x, -y, z);      // 7

        // Cube Map 순서 Right, Left, Top, Bottom, Front, Back

        // right-top: 2, 7, 3
        var rt0 = this.rt0 = v2.clone();
        var rt1 = this.rt1 = v7.clone();
        var rt2 = this.rt2 = v3.clone();

        // right-bttom: 2, 6, 7
        var rb0 = this.rb0 = v2.clone();
        var rb1 = this.rb1 = v6.clone();
        var rb2 = this.rb2 = v7.clone();

        // left-top: 1, 0, 4
        var lt0 = this.lt0 = v1.clone();
        var lt1 = this.lt1 = v0.clone();
        var lt2 = this.lt2 = v4.clone();

        // left-bottom: 1, 4, 5
        var lb0 = this.lb0 = v1.clone();
        var lb1 = this.lb1 = v4.clone();
        var lb2 = this.lb2 = v5.clone();

        // top-top: 0, 2, 3
        var tt0 = this.tt0 = v0.clone();
        var tt1 = this.tt1 = v2.clone();
        var tt2 = this.tt2 = v3.clone();

        // top-bottom: 0, 1, 2
        var tb0 = this.tb0 = v0.clone();
        var tb1 = this.tb1 = v1.clone();
        var tb2 = this.tb2 = v2.clone();

        // bottom-top: 4, 7, 6
        var bt0 = this.bt0 = v4.clone();
        var bt1 = this.bt1 = v7.clone();
        var bt2 = this.bt2 = v6.clone();

        // bottom-bottom: 4, 6, 5
        var bb0 = this.bb0 = v4.clone();
        var bb1 = this.bb1 = v6.clone();
        var bb2 = this.bb2 = v5.clone();

        // front-top: 1, 6, 2
        var ft0 = this.ft0 = v1.clone();
        var ft1 = this.ft1 = v6.clone();
        var ft2 = this.ft2 = v2.clone();

        // front-bottom: 1, 5, 6
        var fb0 = this.fb0 = v1.clone();
        var fb1 = this.fb1 = v5.clone();
        var fb2 = this.fb2 = v6.clone();

        // backward-top: 0, 3, 7
        var et0 = this.et0 = v0.clone();
        var et1 = this.et1 = v3.clone();
        var et2 = this.et2 = v7.clone();

        // backward-bttom: 0, 7, 4
        var eb0 = this.eb0 = v0.clone();
        var eb1 = this.eb1 = v7.clone();
        var eb2 = this.eb2 = v4.clone();

        // Cube Map 순서 Right, Left, Top, Bottom, Front, Back
        var u = 2048;
        var v = 2048;

        // right-top: 2, 7, 3
        rt0.u = u;
        rt0.v = 0;
        rt1.u = 0;
        rt1.v = v;
        rt2.u = 0;
        rt2.v = 0;

        // right-bttom: 2, 6, 7
        rb0.u = u;
        rb0.v = 0;
        rb1.u = u;
        rb1.v = v;
        rb2.u = 0;
        rb2.v = v;

        // left-top: 1, 0, 4
        lt0.u = 0;
        lt0.v = 0;
        lt1.u = u;
        lt1.v = 0;
        lt2.u = u;
        lt2.v = v;

        // left-bottom: 1, 4, 5
        lb0.u = 0;
        lb0.v = 0;
        lb1.u = u;
        lb1.v = v;
        lb2.u = 0;
        lb2.v = v;

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

        // bottom-top: 4, 7, 6
        bt0.u = 0;
        bt0.v = 0;
        bt1.u = u;
        bt1.v = 0;
        bt2.u = u;
        bt2.v = v;

        // bottom-bottom: 4, 6, 5
        bb0.u = u;
        bb0.v = 0;
        bb1.u = 0;
        bb1.v = v;
        bb2.u = u;
        bb2.v = v;

        // front-top: 1, 6, 2
        ft0.u = u;
        ft0.v = 0;
        ft1.u = 0;
        ft1.v = v;
        ft2.u = 0;
        ft2.v = 0;

        // front-bottom: 1, 5, 6
        fb0.u = u;
        fb0.v = 0;
        fb1.u = u;
        fb1.v = v;
        fb2.u = 0;
        fb2.v = v;

        // backward-top: 0, 3, 7
        et0.u = 0;
        et0.v = 0;
        et1.u = u;
        et1.v = 0;
        et2.u = u;
        et2.v = v;

        // backward-bttom: 0, 7, 4
        eb0.u = 0;
        eb0.v = 0;
        eb1.u = u;
        eb1.v = v;
        eb2.u = 0;
        eb2.v = v;

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
    }

    clone()
    {
        return new Cube(this.x, this.y, this.z, this.color);
    }
}