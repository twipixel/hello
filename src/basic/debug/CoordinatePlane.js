import Edge from '../geom/Edge';
import Vertex from '../../../lab/rotate/geom/Vertex';
import {constants, X, Y, Z} from '../../../lab/rotate/const';


export default class CoordinatePlane extends PIXI.Graphics
{
    constructor(width = 400, height = 400)
    {
        super();

        this.w = width;
        this.h = height;
        this.hw = width / 2;
        this.hh = height / 2;
        this.xMin = -this.hw;
        this.xMax = this.hw;
        this.zMin = -this.hh;
        this.zMax = this.hh;
        this.xDelta = 10;
        this.zDelta = 10;
        this.vertices = [];
        this.vertexSize = 1;
    }

    equation(x, y)
    {
        var d = Math.sqrt(x * x + y * y);
        return 4 * (Math.sin(d) / d);
    }

    /**
     * 8개 꼭지점 생성
     */
    generate()
    {
        var i = 0, col = 0, row = 0, w = 0, h = 0, n = 0, idx = 0, v = this.vertices;

        for (var x = this.xMin; x <= this.xMax; x += this.xDelta) {
            for (var z = this.zMin; z <= this.zMax; z += this.zDelta) {
                this.vertices[i] = new Vertex(x, 0, z);
                ++i;
                ++col;
            }
            ++row;
            h = col - 1;
            col = 0;
        }
        n = i - 1;
        w = row - 1;
        this.row = w;
        this.col = h;

        // x axis
        var x = this.row * this.col + this.col;
        this.moveTo(v[0].x, v[0].y);
        this.lineTo(v[x].x, v[x].y);

        // z axis
        var z = this.col;
        this.moveTo(v[0].x, v[0].y);
        this.lineTo(v[z].x, v[z].y);

        this.yVertex = new Vertex(v[0].x, v[0].y - this.h, v[0].z);
        var xAxis = new Edge(v[0], v[x]);
        var yAxis = new Edge(v[0], this.yVertex);
        var zAxis = new Edge(v[0], v[z]);

        var cxVertex0 = new Vertex(0, 0, this.zMin);
        var cxVertex1 = new Vertex(0, 0, this.zMax);
        var czVertex0 = new Vertex(this.xMin, 0, 0);
        var czVertex1 = new Vertex(this.xMax, 0, 0);
        var cxAxis = new Edge(cxVertex0, cxVertex1);
        var czAxis = new Edge(czVertex0, czVertex1);

        this.edges = [xAxis, yAxis, zAxis, cxAxis, czAxis];

        // yVertex 도 업데이트 시켜야합니다.
        this.vertices.push(this.yVertex);
        this.vertices.push(cxVertex0);
        this.vertices.push(cxVertex1);
        this.vertices.push(czVertex0);
        this.vertices.push(czVertex1);

        console.log(`(${n}) ${w} x ${h} Grid`);
        console.log(`x: ${this.xMin} -> ${this.xMax}, z; ${this.zMin} -> ${this.zMax}`);
    }

    color()
    {

    }

    sortByZIndex(A, B)
    {
        return A.z - B.z;
    }

    draw()
    {
        this.clear();
        var v = this.vertices = this.vertices.sort(this.sortByZIndex);
        var n = v.length;
        var size = this.vertexSize;
        var h = this.vertexSize / 2;
        for (var i = 0; i < n; i++) {
            this.beginFill(0xC5EFF7);
            this.drawRect(v[i].x, v[i].y, size, size);
        }

        n = this.edges.length;
        for (var i = 0; i < n; i++) {
            if (i == 0) {
                // x-axis
                this.lineStyle(1, 0x03A9F4);
            }
            else if (i == 1) {
                // y-axis
                this.lineStyle(1, 0xE91E63);
            }
            else if (i == 2) {
                // z-axis
                this.lineStyle(1, 0x8BC34A);
            }
            else {
                // cx, cz
                this.lineStyle(1, 0xE91E63);
            }

            var edge = this.edges[i];
            this.moveTo(edge.point0.x, edge.point0.y);
            this.lineTo(edge.point1.x, edge.point1.y);
        }
        this.endFill();
    }

    /**
     * 회전행렬과 좌표의 곱 (3x3Matrix x Point(x, y, z))
     * @param R {3x3 Matrix}
     */
    multi(R)
    {
        var Px = 0, Py = 0, Pz = 0, sum = 0, P = this.vertices;

        for (var V = 0; V < P.length; V++)
        {
            Px = P[V].x, Py = P[V].y, Pz = P[V].z;
            for (var Rrow = 0; Rrow < 3; Rrow++)
            {
                var rowIndex = 3 * Rrow;
                sum = (R[rowIndex + 0] * Px) + (R[rowIndex + 1] * Py) + (R[rowIndex + 2] * Pz);

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
    xRotate(degree)
    {
        var radians = Math.toRadians(degree);
        var Rx = mat3.create();
        Rx[4] = Math.cos(radians);
        Rx[5] = -Math.sin(radians);
        Rx[7] = Math.sin(radians);
        Rx[8] = Math.cos(radians);

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
    yRotate(degree)
    {
        var radians = Math.toRadians(degree);
        var Ry = mat3.create();
        Ry[0] = Math.cos(radians);
        Ry[2] = Math.sin(radians);
        Ry[6] = -Math.sin(radians);
        Ry[8] = Math.cos(radians);

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
    zRotate(degree)
    {
        var radians = Math.toRadians(degree);
        var Rz = mat3.create();
        Rz[0] = Math.cos(radians);
        Rz[1] = -Math.sin(radians);
        Rz[3] = Math.sin(radians);
        Rz[4] = Math.cos(radians);

        this.multi(Rz); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }

    set z(value)
    {
        this._z = value;
        var n = this.vertices.length;
        for (var i = 0; i < n; i++) {
            var v = this.vertices[i];
            v.z = value;
        }
    }

    get z()
    {
        return this._z;
    }
}