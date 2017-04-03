import Point from './Point';
import {constants, X, Y, Z} from '../const';


export default class Rectangle extends PIXI.Graphics
{
    constructor()
    {
        super();
        this.points = [];
    }

    /*
     Given the point (x, y), returns the associated z-coordinate based on the provided surface equation, of the form z = f(x, y).
     */
    equation(x, y)
    {
        // The distance d of the xy-point from the z-axis.
        var d = Math.sqrt(x * x + y * y);
        // Return the z-coordinate for the point (x, y, z).
        return 4 * (Math.sin(d) / d);
    }

    generate()
    {
        this.points = [
            new Point(-50, -50, -50),
            new Point(-50, -50, 50),
            new Point(50, -50, 50),
            new Point(50, -50, -50),
            new Point(-50, 50, -50),
            new Point(-50, 50, 50),
            new Point(50, 50, 50),
            new Point(50, 50, -50),
        ];
    }

    color()
    {

    }

    sortByZIndex(A, B)
    {
        return A.z - B.z; // Determines if point A is behind, in front of, or at the same level as point B (with respect to the z-axis).
    }

    draw()
    {
        this.clear();
        this.points = this.points.sort(this.sortByZIndex); // Sort the set of points based on relative z-axis position. If the points are visibly small, you can sort of get away with removing this step.

        for (var i = 0; i < this.points.length; i++) {
            this.beginFill(this.points[i].color);
            this.drawRect(this.points[i].x * constants.surfaceScale, this.points[i].y * constants.surfaceScale, constants.pointWidth, constants.pointWidth);
        }
        this.endFill();
    }

    /*
     Assumes that R is a 3 x 3 matrix and that this.points (i.e., P) is a 3 x n matrix. This method performs P = R * P.
     */
    multi(R)
    {
        var Px = 0, Py = 0, Pz = 0; // Variables to hold temporary results.
        var P = this.points; // P is a pointer to the set of surface points (i.e., the set of 3 x 1 vectors).
        var sum; // The sum for each row/column matrix product.

        for (var V = 0; V < P.length; V++) // For all 3 x 1 vectors in the point list.
        {
            Px = P[V].x, Py = P[V].y, Pz = P[V].z;
            for (var Rrow = 0; Rrow < 3; Rrow++) // For each row in the R matrix.
            {
                sum = (R[Rrow][X] * Px) + (R[Rrow][Y] * Py) + (R[Rrow][Z] * Pz);

                if (Rrow === 0) {
                    P[V].x = sum;
                }
                else if (Rrow === 1) {
                    P[V].y = sum;
                }
                else {
                    P[V].z = sum;
                }
            }
        }
    }

    erase()
    {
        this.clear();
    }

    /*
     * Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
     *      1    0     0
     * Rx = 0  cos0  -sin0
     *      0  sin0   cos0
     */
    xRotate(sign)
    {
        var Rx = mat3.create();
        Rx[4] = Math.cos(sign * constants.dTheta);
        Rx[5] = -Math.sin(sign * constants.dTheta);
        Rx[7] = Math.sin(sign * constants.dTheta);
        Rx[8] = Math.cos(sign * constants.dTheta);

        this.multi(Rx); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }

    /*
     * Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
     *      cos0   0   sin0
     * Ry =   0    1    0
     *     -sin0   0   cos0
     *
     */
    yRotate(sign)
    {
        var Ry = mat3.create();
        Ry[0] = Math.cos(sign * constants.dTheta);
        Ry[2] = Math.sin(sign * constants.dTheta);
        Ry[6] = -Math.sin(sign * constants.dTheta);
        Ry[8] = Math.cos(sign * constants.dTheta);

        this.multi(Ry); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }

    /*
     * Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
     *      cos0    -sin0    0
     * Rz = sin0     cos0    0
     *       0        0      1
     */
    zRotate(sign)
    {
        var Rz = mat3.create();
        Rz[0] = Math.cos(sign * constants.dTheta);
        Rz[1] = -Math.sin(sign * constants.dTheta);
        Rz[3] = Math.sin(sign * constants.dTheta);
        Rz[4] = Math.cos(sign * constants.dTheta);

        this.multi(Rz); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }
}