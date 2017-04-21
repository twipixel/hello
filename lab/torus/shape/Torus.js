import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Torus
{
    /**
     * @param hRadius 수평 반지름 (도넛의 넖이)
     * @param vRadius 수직 반지름 (도넛의 높이)
     * @param longitude 세로줄 (경도)
     * @param latitude 가로줄 (위도)
     */
    constructor(hRadius, vRadius, longitude, latitude)
    {
        this.hRadius = hRadius;
        this.vRadius = vRadius;
        this.longitude = longitude;
        this.latitude = latitude;

        var img = document.getElementById('source');
        var vertices = this.vertices = [];
        var indices = this.indices = [];
        var uvtData = this.uvtData = [];
        var faces = this.faces = [];
        
        for (var i = 0; i <= longitude; i++) {
            var s1 = Math.PI * 2 * i / longitude;

            for (var j = 0; j <= latitude; j++) {
                var s2 = Math.PI * 2 * j / latitude;
                var r = Math.cos(s2) * vRadius + hRadius;
                var x = Math.cos(s1) * r;
                var y = Math.sin(s1) * r;
                var z = Math.sin(s2) * vRadius;
                var v = new Vector3D(x, y, z);
                vertices.push(v);
                v.u = i / longitude;
                v.v = j / longitude;
                uvtData.push(i / longitude, j / longitude, 1);

                if (j < latitude && i < longitude) {
                    var a =  i      * (latitude + 1) + j;
                    var b = (i + 1) * (latitude + 1) + j;
                    indices.push(b, a + 1, a, a + 1, b, b + 1);
                }
            }
        }

        //z축 sort를 위한 기반 제작
        for (var i = 0; i < indices.length; i += 3) {
            var i1 = indices[i + 0];
            var i2 = indices[i + 1];
            var i3 = indices[i + 2];
            var z = Math.min(uvtData[i1 * 3 + 2], uvtData[i2 * 3 + 2], uvtData[i3 * 3 + 2]);
            var f = new Face(i1, i2, i3, 0x2196F3, 1, img);
            faces.push(f);
        }
    }

    clone()
    {
        return new Torus(this.hRadius, this.vRadius, this.longitude, this.latitude);
    }
}