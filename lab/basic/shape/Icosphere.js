import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';
import Icosaherdron from './Icosahedron';


export default class Icosphere
{
    /**
     * Icosphere
     * https://github.com/hughsk/icosphere
     *
     * @param subdivisions {int}
     */
    constructor(subdivisions = 0)
    {
        var subdivisions = subdivisions;

        var icosaherdron = new Icosaherdron();
        this.faces = icosaherdron.faces;
        this.vertices = icosaherdron.vertices;

        var complex = {
            faces: icosaherdron.faces,
            vertices: icosaherdron.vertices
        };

        while (subdivisions-- > 0) {
            complex = this.subdivide(complex);
        }

        this.faces = complex.faces;
        this.vertices = complex.vertices;

        for (var i = 0; i < this.vertices.length; i++) {
            Vector3D.normalize(this.vertices[i]);
        }
    }

    subdivide(complex)
    {
        this.middleVertexCached = {};

        var faces = complex.faces;
        var vertices = complex.vertices;

        var l = 0;
        var newFaces = [];
        var newVertices = [];

        for (var i = 0; i < faces.length; i++) {
            var face = faces[i];
            var f0 = face.v0;
            var f1 = face.v1;
            var f2 = face.v2;
            var v0 = vertices[f0];
            var v1 = vertices[f1];
            var v2 = vertices[f2];

            var a = this.getMiddleVertex(v0, v1);
            var b = this.getMiddleVertex(v1, v2);
            var c = this.getMiddleVertex(v2, v0);

            var ai = newVertices.indexOf(a);
            if (ai === -1) ai = l++, newVertices.push(a);
            var bi = newVertices.indexOf(b);
            if (bi === -1) bi = l++, newVertices.push(b);
            var ci = newVertices.indexOf(c);
            if (ci === -1) ci = l++, newVertices.push(c);

            var v0i = newVertices.indexOf(v0);
            if (v0i === -1) v0i = l++, newVertices.push(v0);
            var v1i = newVertices.indexOf(v1);
            if (v1i === -1) v1i = l++, newVertices.push(v1);
            var v2i = newVertices.indexOf(v2);
            if (v2i === -1) v2i = l++, newVertices.push(v2);

            newFaces.push(new Face(v0i, ai, ci));
            newFaces.push(new Face(v1i, bi, ai));
            newFaces.push(new Face(v2i, ci, bi));
            newFaces.push(new Face(ai, bi, ci))
        }

        return {
            faces: newFaces,
            vertices: newVertices
        }
    }

    getMiddleVertex(vertexA, vertexB)
    {
        var vertex = this.middleVertex(vertexA, vertexB);
        var key = this.vertexToKey(vertex);
        var cachedVertex = this.middleVertexCached[key];
        if (cachedVertex) {
            return cachedVertex;
        } else {
            return this.middleVertexCached[key] = vertex;
        }
    }

    vertexToKey(vertex)
    {
        return vertex.x.toPrecision(6) + ','
            + vertex.y.toPrecision(6) + ','
            + vertex.z.toPrecision(6)
    }

    middleVertex(vertexA, vertexB)
    {
        return new Vector3D(
            (vertexA.x + vertexB.x) / 2,
            (vertexA.y + vertexB.y) / 2,
            (vertexA.z + vertexB.z) / 2
        )
    }
}
