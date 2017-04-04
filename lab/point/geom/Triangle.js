import Num from './Num';
import Edge from './Edge';
import Vertex from './Vertex';
import {constants, X, Y, Z} from '../const';


export default class Triangle extends PIXI.Graphics
{
    constructor(size = 10)
    {
        super();

        this._z = 0;
        this.size = size;
        this.halfSize = this.size / 2;

        this.fontSize = 9;
        this.halfFontSize = this.fontSize / 2;

        this.vertices = [];
        this.vertexSize = 4;
        this.vertexHalfSize = this.vertexSize / 2;

        this.isShowNum = false;
    }

    /**
     * 8개 꼭지점 생성
     */
    generate()
    {
        var h = this.halfSize;

        var v = this.vertices = [
            new Vertex(0, -h, this.z),
            new Vertex(-h, h, this.z),
            new Vertex(h, h, this.z)
        ];

        this.edges = [
            new Edge(v[0], v[1]),
            new Edge(v[1], v[2]),
            new Edge(v[2], v[0])
        ];

        var textStyle = new PIXI.TextStyle({
            fontSize: this.fontSize, fill: 0x19B5FE
        });

        this.nums = [];
        for(var i = 0; i < this.edges.length; i++) {
            var num = new Num(i, textStyle);
            num.visible = this.isShowNum;
            this.nums.push(num);
            this.addChild(num);
        }
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
        if(!this.isShowNum) {
            this.vertices = this.vertices.sort(this.sortByZIndex);
            for (var i = 0; i < this.vertices.length; i++) {
                this.beginFill(0xC5EFF7);
                this.drawRect(this.vertices[i].x, this.vertices[i].y, this.vertexSize, this.vertexSize);
            }
        }

        var h = this.vertexHalfSize;
        var halfFontSize = this.halfFontSize;

        this.lineStyle(1, 0x52B3D9);
        for (var j = 0; j < this.edges.length; j++) {
            var num = this.nums[j];
            var edge = this.edges[j];
            this.moveTo(edge.point0.x + h, edge.point0.y + h);
            this.lineTo(edge.point1.x + h, edge.point1.y + h);

            if(this.isShowNum) {
                num.x = edge.point0.x + h;
                num.y = edge.point0.y + h;
            }
            num.visible = this.isShowNum;
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