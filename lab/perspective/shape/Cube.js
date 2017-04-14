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

        var v0 = new Vector3D(-x, -y, -z);      // 0 (좌상단) -> 반시계
        var v1 = new Vector3D(-x, -y, z);       // 1
        var v2 = new Vector3D(x, -y, z);        // 2
        var v3 = new Vector3D(x, -y, -z);       // 3
        var v4 = new Vector3D(-x, y, -z);       // 4 (좌하단) -> 반시계
        var v5 = new Vector3D(-x, y, z);        // 5
        var v6 = new Vector3D(x, y, z);         // 6
        var v7 = new Vector3D(x, y, -z);        // 7

        // top-top: 0, 2, 3
        var tt0 = this.tt0 = v0.clone();
        var tt1 = this.tt1 = v2.clone();
        var tt2 = this.tt2 = v3.clone();

        // top-bottom: 0, 1, 2
        var tb0 = this.tb0 = v0.clone();
        var tb1 = this.tb1 = v1.clone();
        var tb2 = this.tb2 = v2.clone();

        // left-top: 0, 1, 4
        var lt0 = this.lt0 = v0.clone();
        var lt1 = this.lt1 = v1.clone();
        var lt2 = this.lt2 = v4.clone();

        // left-bottom: 1, 5, 4
        var lb0 = this.lb0 = v1.clone();
        var lb1 = this.lb1 = v5.clone();
        var lb2 = this.lb2 = v4.clone();

        // front-top: 1, 6, 2
        var ft0 = this.ft0 = v1.clone();
        var ft1 = this.ft1 = v6.clone();
        var ft2 = this.ft2 = v2.clone();

        // front-bottom: 1, 5, 6
        var fb0 = this.fb0 = v1.clone();
        var fb1 = this.fb1 = v5.clone();
        var fb2 = this.fb2 = v6.clone();

        // right-top: 2, 7, 3
        var rt0 = this.rt0 = v2.clone();
        var rt1 = this.rt1 = v7.clone();
        var rt2 = this.rt2 = v3.clone();

        // right-bttom: 2, 6, 7
        var rb0 = this.rb0 = v2.clone();
        var rb1 = this.rb1 = v6.clone();
        var rb2 = this.rb2 = v7.clone();

        // backward-top: 0, 7, 3
        var et0 = this.et0 = v0.clone();
        var et1 = this.et1 = v7.clone();
        var et2 = this.et2 = v3.clone();

        // backward-bttom: 0, 4, 7
        var eb0 = this.eb0 = v0.clone();
        var eb1 = this.eb1 = v4.clone();
        var eb2 = this.eb2 = v7.clone();

        // bottom-top: 4, 6, 7
        var bt0 = this.bt0 = v4.clone();
        var bt1 = this.bt1 = v6.clone();
        var bt2 = this.bt2 = v7.clone();

        // bottom-bottom: 4, 5, 6
        var bb0 = this.bb0 = v4.clone();
        var bb1 = this.bb1 = v5.clone();
        var bb2 = this.bb2 = v6.clone();

        // top-top: 0, 2, 3
        tt0.u = 0;
        tt0.v = 0;
        tt1.u = 1;
        tt1.v = 1;
        tt2.u = 1;
        tt2.v = 0;

        // top-bottom: 0, 1, 2
        tb0.u = 0;
        tb0.v = 0;
        tb1.u = 0;
        tb1.v = 1;
        tb2.u = 1;
        tb2.v = 1;

        // left-top: 0, 1, 4
        lt0.u = 0;
        lt0.v = 0;
        lt1.u = 1;
        lt1.v = 0;
        lt2.u = 0;
        lt2.v = 1;

        // left-bottom: 1, 5, 4
        lb0.u = 0;
        lb0.v = 0;
        lb1.u = 1;
        lb1.v = 1;
        lb2.u = 0;
        lb2.v = 1;

        // front-top: 1, 6, 2
        ft0.u = 0;
        ft0.v = 0;
        ft1.u = 1;
        ft1.v = 1;
        ft2.u = 1;
        ft2.v = 0;

        // front-bottom: 1, 5, 6
        fb0.u = 0;
        fb0.v = 0;
        fb1.u = 0;
        fb1.v = 1;
        fb2.u = 1;
        fb2.v = 1;

        // right-top: 2, 7, 3
        rt0.u = 0;
        rt0.v = 0;
        rt1.u = 1;
        rt1.v = 1;
        rt2.u = 1;
        rt2.v = 0;

        // right-bttom: 2, 6, 7
        rb0.u = 0;
        rb0.v = 0;
        rb1.u = 0;
        rb1.v = 1;
        rb2.u = 1;
        rb2.v = 1;

        // backward-top: 0, 7, 3
        et0.u = 0;
        et0.v = 0;
        et1.u = 1;
        et1.v = 1;
        et2.u = 1;
        et2.v = 0;

        // backward-bttom: 0, 4, 7
        eb0.u = 0;
        eb0.v = 0;
        eb1.u = 0;
        eb1.v = 1;
        eb2.u = 1;
        eb2.v = 1;

        // bottom-top: 4, 6, 7
        bt0.u = 0;
        bt0.v = 0;
        bt1.u = 1;
        bt1.v = 1;
        bt2.u = 1;
        bt2.v = 0;

        // bottom-bottom: 4, 5, 6
        bb0.u = 0;
        bb0.v = 0;
        bb1.u = 0;
        bb1.v = 1;
        bb2.u = 1;
        bb2.v = 1;

        this.vertices = [
            tt0, tt1, tt2, tb0, tb1, tb2,
            lt0, lt1, lt2, lb0, lb1, lb2,
            ft0, ft1, ft2, fb0, fb1, fb2,
            rt0, rt1, rt2, rb0, rb1, rb2,
            et0, et1, et2, eb0, eb1, eb2,
            bt0, bt1, bt2, bb0, bb1, bb2
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
    }

    clone()
    {
        return new Cube(this.x, this.y, this.z, this.color);
    }

    /*clone()
    {
        var vertices = [];

        for (var i = 0; i < this.vertices; i++) {
            vertices[i] = this.vertices[i].clone();
        }

        var cube = new Cube(this.x, this.y, this.z, this.color);
        cube.vertices = vertices;
        return cube;
    }*/
}