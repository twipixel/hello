import Vector3D from '../geom/Vector3D';


export default class SphereOctahedron {
    constructor() {
        var X = 0.525731112119133606;
        var Z = 0.85065080835203993;

        // initial 12 vertices
        this.vertices = [
            new Vector3D(-X, 0.0, Z),
            new Vector3D(X, 0.0, Z),
            new Vector3D(-X, 0.0, -Z),
            new Vector3D(X, 0.0, -Z),
            new Vector3D(0.0, Z, X),
            new Vector3D(0.0, Z, -X),
            new Vector3D(0.0, -Z, X),
            new Vector3D(0.0, -Z, -X),
            new Vector3D(Z, X, 0.0),
            new Vector3D(-Z, X, 0.0),
            new Vector3D(Z, -X, 0.0),
            new Vector3D(-Z, -X, 0.0)
        ];

        // 20 faces
        this.faces = [
            {A: 0, B: 4, C: 1},
            {A: 0, B: 9, C: 4},
            {A: 9, B: 5, C: 4},
            {A: 4, B: 5, C: 8},
            {A: 4, B: 8, C: 1},
            {A: 8, B: 10, C: 1},
            {A: 8, B: 3, C: 10},
            {A: 5, B: 3, C: 8},
            {A: 5, B: 2, C: 3},
            {A: 2, B: 7, C: 3},
            {A: 7, B: 10, C: 3},
            {A: 7, B: 6, C: 10},
            {A: 7, B: 11, C: 6},
            {A: 11, B: 0, C: 6},
            {A: 0, B: 1, C: 6},
            {A: 6, B: 1, C: 10},
            {A: 9, B: 0, C: 11},
            {A: 9, B: 11, C: 2},
            {A: 9, B: 2, C: 5},
            {A: 7, B: 2, C: 11}
        ];

        this.indices = [
            [0, 4, 1],
            [0, 9, 4],
            [9, 5, 4],
            [4, 5, 8],
            [4, 8, 1],
            [8, 10, 1],
            [8, 3, 10],
            [5, 3, 8],
            [5, 2, 3],
            [2, 7, 3],
            [7, 10, 3],
            [7, 6, 10],
            [7, 11, 6],
            [11, 0, 6],
            [0, 1, 6],
            [6, 1, 10],
            [9, 0, 11],
            [9, 11, 2],
            [9, 2, 5],
            [7, 2, 11]
        ];
    }

    subdivide() {

        /*var faces = [];
        var n = this.faces.length;

        for (var i = 0; i < n; i++) {

            faces = faces.concat();
            var v0 = this.vertices[f.A];
            var v1 = this.vertices[f.B];
            var v2 = this.vertices[f.C];
            var v3 = normalize(0.5 * (v0 + v1));
            var v4 = normalize(0.5 * (v1 + v2));
            var v5 = normalize(0.5 * (v2 + v0));
            output_mesh.add_face(v0, v3, v5)
            output_mesh.add_face(v3, v1, v4)
            output_mesh.add_face(v5, v2, v5)
            output_mesh.add_face(v3, v4, v5)
        }*/
    }
}


Triangle.prototype.subdivide = function () {
    var newTriangles = [];
    for (var i = 0; i < triangles.length; i++) {
        newTriangles = newTriangles.concat(triangles[i].subdivide());
    }
    triangles = newTriangles;


    var v12 = new Vector3(0, 0, 0);
    var v23 = new Vector3(0, 0, 0);
    var v31 = new Vector3(0, 0, 0);

    var prop = ["x", "y", "z"]

    for (var i = 0; i < 3; i++) {
        var p = prop[i];
        v12[p] = this.pos1[p] + this.pos2[p];
        v23[p] = this.pos2[p] + this.pos3[p];
        v31[p] = this.pos3[p] + this.pos1[p];
    }

    v12.normalize().multiply(this.scale);
    v23.normalize().multiply(this.scale);
    v31.normalize().multiply(this.scale);

    return [
        new Triangle(this.pos1, v12, v31, this.scale),
        new Triangle(this.pos2, v23, v12, this.scale),
        new Triangle(this.pos3, v31, v23, this.scale),
        new Triangle(v12, v23, v31, this.scale)
    ];
};
