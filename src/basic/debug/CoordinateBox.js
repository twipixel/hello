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
        var grids = this.grids = [];
        var faces = this.faces = [];
        var vertices = this.vertices = [];

        var step = 5;
        var startX = -x;
        var endX = x;
        var startY = -y;
        var endY = y;
        var startZ = -z;
        var endZ = z;
        var index = 0;

        for (var i = startX, xcount = 0; i <= endX; i += step, xcount++) {
            grids[xcount] = [];
            for (var j = startY, ycount = 0; j <= endY; j += step, ycount++) {
                grids[xcount][ycount] = [];
                for (var k = startZ, zcount = 0; k <= endZ; k += step, zcount++) {
                    if (!grids[xcount][ycount][zcount]) {
                        grids[xcount][ycount][zcount] = [];
                    }
                    var v = new Vector3D(i, j, k);
                    vertices.push(v);
                    grids[xcount][ycount][zcount] = {index:index, vertex:v};
                    index++;

                    console.log(i, j, k);
                }
            }
        }

        var x = grids.length;

        for (var i = 0; i < x; i++) {

            var y = grids[i].length;

            for (var j = 0; j < y; j++) {

                var z = grids[i][j].length;

                for (var k = 0; k < z; k++) {

                    var sx = grids[i][j][k];
                    var ex = grids[x - 1][j][k];
                    var face = new Face(sx.index, ex.index, sx.index);
                    faces.push(face);
                }
            }
        }
    }
}