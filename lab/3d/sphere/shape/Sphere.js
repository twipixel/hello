import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class Sphere
{
    constructor(radius = 50, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    {
        this.name = 'Sphere';
        this.useCulling = true;

        widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
        heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

        phiStart = phiStart !== undefined ? phiStart : 0;
        phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

        thetaStart = thetaStart !== undefined ? thetaStart : 0;
        thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.phiStart = phiStart;
        this.phiLength = phiLength;
        this.thetaStart = thetaStart;
        this.thetaLength = thetaLength;

        var thetaEnd = thetaStart + thetaLength;

        var ix, iy;

        var index = 0;
        var grid = [];

        var vertex = new Vector3D();
        var normal = new Vector3D();


        var img = document.getElementById('source');
        var vertices = this.vertices = [];
        var indices = this.indices = [];
        var normals = [];
        var uvs = [];
        var faces = this.faces = [];

        // generate vertices, normals and uvs

        for ( iy = 0; iy <= heightSegments; iy ++ ) {

            var verticesRow = [];

            var v = iy / heightSegments;

            for ( ix = 0; ix <= widthSegments; ix ++ ) {

                var u = ix / widthSegments;

                // vertex

                vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
                vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
                vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );


                var vector = new Vector3D(vertex.x, vertex.y, vertex.z, u, v);
                vertices.push(vector);

                // normal
                //normal.set( vertex.x, vertex.y, vertex.z ).normalize();
                //normals.push( normal.x, normal.y, normal.z );

                // uv
                //uvs.push( u, v );
                verticesRow.push( index ++ );
            }

            grid.push( verticesRow );

        }

        // indices

        for ( iy = 0; iy < heightSegments; iy ++ ) {

            for ( ix = 0; ix < widthSegments; ix ++ ) {

                var a = grid[ iy ][ ix + 1 ];
                var b = grid[ iy ][ ix ];
                var c = grid[ iy + 1 ][ ix ];
                var d = grid[ iy + 1 ][ ix + 1 ];

                if ( iy !== 0 || thetaStart > 0 ) {
                    indices.push( a, b, d );
                    faces.push(new Face(a, b, d, 0x2196F3, 1, img));
                }

                if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) {
                    indices.push( b, c, d );
                    faces.push(new Face(b, c, d, 0x2196F3, 1, img));
                }

            }

        }
    }

    clone()
    {
        var clone = new Sphere(this.radius, this.widthSegments, this.heightSegments, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength);
        clone.name = this.name;
        clone.useCulling = this.useCulling;
        return clone;
    }
}