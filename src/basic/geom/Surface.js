import Vertex from '../../../lab/rotate/geom/Vertex';
import {constants, X, Y, Z} from '../../../lab/rotate/const';


export default class Surface extends PIXI.Graphics {
    constructor()
    {
        super();
        this.vertices = [];
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

    /*
     Creates a list of (x, y, z) points (in 3 x 1 vector format) representing the surface.
     */
    generate()
    {
        var i = 0;

        for (var x = constants.xMin; x <= constants.xMax; x += constants.xDelta) {
            for (var y = constants.yMin; y <= constants.yMax; y += constants.yDelta) {
                this.vertices[i] = new Vertex(x, y, this.equation(x, y)); // Store a surface point (in vector format) into the list of surface points.
                ++i;
            }
        }
    }

    color()
    {
        var z; // The z-coordinate for a given surface point (x, y, z).

        this.zMin = this.zMax = this.vertices[0].z; // A starting value. Note that zMin and zMax are custom properties that could possibly be useful if this code is extended later.
        for (var i = 0; i < this.vertices.length; i++) {
            z = this.vertices[i].z;
            if (z < this.zMin) {
                this.zMin = z;
            }
            if (z > this.zMax) {
                this.zMax = z;
            }
        }

        var zDelta = Math.abs(this.zMax - this.zMin) / constants.colorMap.length;

        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].color = constants.colorMap[Math.floor((this.vertices[i].z - this.zMin) / zDelta)];
        }
    }

    sortByZIndex(A, B)
    {
        return A.z - B.z; // Determines if point A is behind, in front of, or at the same level as point B (with respect to the z-axis).
    }

    draw()
    {
        this.clear();
        this.vertices = this.vertices.sort(this.sortByZIndex); // Sort the set of points based on relative z-axis position. If the points are visibly small, you can sort of get away with removing this step.

        for (var i = 0; i < this.vertices.length; i++) {
            this.beginFill(this.vertices[i].color);
            this.drawRect(this.vertices[i].x * constants.surfaceScale, this.vertices[i].y * constants.surfaceScale, constants.pointWidth, constants.pointWidth);
        }
        this.endFill();
    }

    /*
     Assumes that R is a 3 x 3 matrix and that this.points (i.e., P) is a 3 x n matrix. This method performs P = R * P.
     */
    multi(R)
    {
        var Vx = 0, Vy = 0, Vz = 0; // Variables to hold temporary results.
        var V = this.vertices; // P is a pointer to the set of surface points (i.e., the set of 3 x 1 vectors).
        var sum; // The sum for each row/column matrix product.

        for (var i = 0; i < V.length; i++) // For all 3 x 1 vectors in the point list.
        {
            Vx = V[i].x, Vy = V[i].y, Vz = V[i].z;
            for (var Rrow = 0; Rrow < 3; Rrow++) // For each row in the R matrix.
            {
                sum = (R[Rrow][X] * Vx) + (R[Rrow][Y] * Vy) + (R[Rrow][Z] * Vz);

                if (Rrow === 0) {
                    V[i].x = sum;
                }
                else if (Rrow === 1) {
                    V[i].y = sum;
                }
                else {
                    V[i].z = sum;
                }
            }
        }
    }

    erase()
    {
        this.clear();
    }

    /*
     Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
     */
    xRotate(degree)
    {
        var radians = Math.toRadians(degree);
        var Rx = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

        Rx[0][0] = 1;
        Rx[0][1] = 0; // Redundant but helps with clarity.
        Rx[0][2] = 0;
        Rx[1][0] = 0;
        Rx[1][1] = Math.cos(radians);
        Rx[1][2] = -Math.sin(radians);
        Rx[2][0] = 0;
        Rx[2][1] = Math.sin(radians);
        Rx[2][2] = Math.cos(radians);

        this.multi(Rx); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }

    /*
     Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
     */
    yRotate(degree)
    {
        var radians = Math.toRadians(degree);
        var Ry = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

        Ry[0][0] = Math.cos(radians);
        Ry[0][1] = 0; // Redundant but helps with clarity.
        Ry[0][2] = Math.sin(radians);
        Ry[1][0] = 0;
        Ry[1][1] = 1;
        Ry[1][2] = 0;
        Ry[2][0] = -Math.sin(radians);
        Ry[2][1] = 0;
        Ry[2][2] = Math.cos(radians);

        this.multi(Ry); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }

    /*
     Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
     */
    zRotate(degree)
    {
        var radians = Math.toRadians(degree);
        var Rz = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

        Rz[0][0] = Math.cos(radians);
        Rz[0][1] = -Math.sin(radians);
        Rz[0][2] = 0; // Redundant but helps with clarity.
        Rz[1][0] = Math.sin(radians);
        Rz[1][1] = Math.cos(radians);
        Rz[1][2] = 0;
        Rz[2][0] = 0;
        Rz[2][1] = 0;
        Rz[2][2] = 1;

        this.multi(Rz); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }
}