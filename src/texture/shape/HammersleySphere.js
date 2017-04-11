import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class HammersleySphere {
    /**
     *
     * @param radius
     * @param n
     */
    constructor(radius, n) {
        this.faces = [];
        this.vertices = [];

        var alpha = 0.5;
        var color = 0x87D37C;

        // based on the algorithm in spherical coordinates (theta, phi) from
        // "Distributing many points on a sphere" by E.B. Saff and A.B.J. Kuijlaars,
        // Mathematical Intelligencer 19.1 (1997) 5--11.
        // retrieved from / http://www.math.niu.edu/~rusin/known-math/97/spherefaq
        for (var i = 0, phiLast = 0; i < n; i++) {
            var h = -1 + 2 * ( i - 1 ) / ( n - 1 ),
                theta = Math.acos(h),
                phi = i == 1 ? 0 : ( phiLast + 3.6 / Math.sqrt(n * (1 - h * h))) % ( 2 * Math.PI );

            phiLast = phi;

            // convert back to cartesian coordinates and scale from (-1,1) to (pos-radius,pos+radius)
            this.vertices.push(new Vector3D(
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(theta),
                radius * Math.cos(phi) * Math.sin(theta)
            ));

            if (i != 0 && i % 3 == 0) {
                this.faces.push(new Face(i - 2, i - 1, i, color, alpha));
            }
        }
    }

    render()
    {

    }
}