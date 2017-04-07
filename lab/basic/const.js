import Vector3D from 'geom/Vector3D';


const X = 0.525731112119133606;
const Z = 0.85065080835203993;

// initial 12 vertices
const vertices = [
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
const faces = [
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

const indices = [
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

export class Icosahedron
{
    static get vertices()
    {
        return vertices;
    }

    static get faces()
    {
        return faces;
    }

    static get indices()
    {
        return indices;
    }
}