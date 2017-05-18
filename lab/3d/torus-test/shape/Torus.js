import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Torus
{
    constructor(radius = 100, tube = 40, radialSegments = 8, tubularSegments = 6, arc = Math.PI * 2)
    {
        this.radius = radius;
        this.tube = tube;
        this.radialSegments = radialSegments;
        this.tubularSegments = tubularSegments;
        this.arc = this.arc;

        var normal;
        var center = new Vector3D();
        var vertex = new Vector3D();

        var img = document.getElementById('source');
        var vertices = this.vertices = [];
        var faces = this.faces = [];

        var i, j, theta = Math.PI / 2;

        for ( j = 0; j <= radialSegments; j ++ ) {

            for ( i = 0; i <= tubularSegments; i ++ ) {

                var u = i / tubularSegments * arc;
                var v = j / radialSegments * Math.PI * 2;

                // vertex
                vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
                vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
                vertex.z = tube * Math.sin( v );


                // x축 90도 회전
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);
                var y = vertex.y;
                var z = vertex.z;
                vertex.y = y * cosTheta - z * sinTheta;
                vertex.z = z * cosTheta + y * sinTheta;



                var vector = new Vector3D(vertex.x, vertex.y, vertex.z, i / tubularSegments, j / radialSegments);
                vertices.push(vector);
            }
        }

        // generate indices

        for ( j = 1; j <= radialSegments; j ++ ) {

            for ( i = 1; i <= tubularSegments; i ++ ) {
                // indices
                var a = ( tubularSegments + 1 ) * j + i - 1;
                var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
                var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
                var d = ( tubularSegments + 1 ) * j + i;

                // faces
                var face1 = new Face(a, b, d, 0x2196F3, 1, img);
                var face2 = new Face(b, c, d, 0x2196F3, 1, img);
                face1.vertices = this.vertices;
                face2.vertices = this.vertices;
                faces.push(face1);
                faces.push(face2);
            }
        }
    }


    /*constructor(radius = 100, tube = 40, radialSegments = 8, tubularSegments = 6, arc = Math.PI * 2)
    {
        this.radius = radius;
        this.tube = tube;
        this.radialSegments = radialSegments;
        this.tubularSegments = tubularSegments;
        this.arc = this.arc;

        var normal;
        var center = new Vector3D();
        var vertex = new Vector3D();

        var img = document.getElementById('source');
        var vertices = this.vertices = [];
        var faces = this.faces = [];

        var i, j;

        for ( j = 0; j <= radialSegments; j ++ ) {

            for ( i = 0; i <= tubularSegments; i ++ ) {

                var u = i / tubularSegments * arc;
                var v = j / radialSegments * Math.PI * 2;

                // vertex
                vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
                vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
                vertex.z = tube * Math.sin( v );

                var vector = new Vector3D(vertex.x, vertex.y, vertex.z, i / tubularSegments, j / radialSegments);
                vertices.push(vector);

                // normal
                center.x = radius * Math.cos( u );
                center.y = radius * Math.sin( u );
                normal = new Vector3D(vertex.x - center.x, vertex.y - center.y, vertex.z - center.y);
                normal = normal.normalize();

                // 임시 테스트를 위해 추가
                vector.normal = normal;
            }
        }

        // generate indices

        for ( j = 1; j <= radialSegments; j ++ ) {

            for ( i = 1; i <= tubularSegments; i ++ ) {
                // indices
                var a = ( tubularSegments + 1 ) * j + i - 1;
                var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
                var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
                var d = ( tubularSegments + 1 ) * j + i;

                // faces
                var face1 = new Face(a, b, d, 0x2196F3, 1, img);
                var face2 = new Face(b, c, d, 0x2196F3, 1, img);
                face1.vertices = this.vertices;
                face2.vertices = this.vertices;
                faces.push(face1);
                faces.push(face2);
            }
        }
    }*/

    clone()
    {
        return new Torus(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
    }

    /**
     * @param hRadius 수평 반지름 (도넛의 넖이)
     * @param vRadius 수직 반지름 (도넛의 높이)
     * @param longitude 세로줄 (경도)
     * @param latitude 가로줄 (위도)
     */
    /*constructor(hRadius, vRadius, longitude, latitude)
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
            f.vertices = vertices;
            faces.push(f);
        }
    }

    clone()
    {
        return new Torus(this.hRadius, this.vRadius, this.longitude, this.latitude);
    }*/
}