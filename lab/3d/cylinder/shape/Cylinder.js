import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Cylinder
{
    /**
     * @param radius 반지름
     * @param height 기둥 높이
     * @param longitude 세로줄 (경도)
     * @param latitude 가로줄 (위도)
     */
    constructor(radius, height, longitude, latitude)
    {
        this.radius = radius;
        this.height = height;
        this.longitude = longitude;
        this.latitude = latitude;

        var img = document.getElementById('source');
        var vertices = this.vertices = [];
        var indices = this.indices = [];
        var uvtData = this.uvtData = [];
        var faces = this.faces = [];

        for (var i = 0; i <= longitude; i++) {
            var theta = Math.PI * 2 * i / longitude; //z축에서 y축으로 잰각
            for (var j = 0; j <= latitude; j++) {
                var x = -height / 2 + j * height / latitude;
                var y = radius * Math.sin(theta);
                var z = radius * Math.cos(theta);
                var v = new Vector3D(x, y, z);
                vertices.push(v);				//하나의 Vertex 데이타
                v.u = i / longitude;
                v.v = j / latitude;
                uvtData.push(i / longitude, j / latitude, 1); //하나의 UVT 데이타 . Texture의 점과 Vectex를 일치시켜 Texture를 입히기 위한 데이타이다.
                if (j < latitude && i < longitude) {
                    var a = i * (latitude + 1) + j;
                    var b = (i + 1) * (latitude + 1) + j;
                    indices.push(a, a + 1, b, b + 1, b, a + 1); //삼각형의 index이다. culling방향 고려
                }
            }
        }

        //z축 sort를 위한 기반 제작
        for (var i = 0; i < indices.length; i += 3) {
            var i1 = indices[ i + 0 ];
            var i2 = indices[ i + 1 ];
            var i3 = indices[ i + 2 ];
            var z = Math.min( uvtData[i1 * 3 + 2], uvtData[i2 * 3 + 2], uvtData[i3 * 3 + 2]);
            var f = new Face(i1, i2, i3, 0x2196F3, 1, img);
            faces.push(f);
        }
    }

    clone()
    {
        return new Cylinder(this.radius, this.height, this.longitude, this.latitude);
    }
}