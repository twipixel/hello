'use strict';

//VECTORS
const Vector2D = function (x,y) {
    this.x = x || 0;
    this.y = y || 0;
};

const Vector3D = function(x,y,z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

Vector3D.prototype.subtract = function (v2) {
    this.x = this.x - v2.x;
    this.y = this.y - v2.y;
    this.z = this.z - v2.z;
    return new Vector3D(this.x, this.y, this.z);
};

Vector3D.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector3D.prototype.normalize = function() {
    let len = this.length();
    let ilen = 1/len;
    return new Vector3D(this.x*ilen, this.y*ilen, this.z*ilen);
};

Vector3D.Cross = function(v1, v2) {
    let x = v1.y * v2.z - v1.z * v2.y;
    let y = v1.z * v2.x - v1.x * v2.z;
    let z = v1.x * v2.y - v1.y * v2.x;
    return new Vector3D(x, y, z);
};

Vector3D.Dot = function(v1, v2) {
    return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
};

Vector3D.transformCoordinates = function(point, transform) {
    let x = point.x * transform.m[0] + point.y * transform.m[4] + point.z * transform.m[8] + transform.m[12];
    let y = point.x * transform.m[1] + point.y * transform.m[5] + point.z * transform.m[9] + transform.m[13];
    let z = point.x * transform.m[2] + point.y * transform.m[6] + point.z * transform.m[10] + transform.m[14];
    let w = point.x * transform.m[3] + point.y * transform.m[7] + point.z * transform.m[11] + transform.m[15];
    return new Vector3D(x/w, y/w, z/w);
};

//Matrix operations
const Matrix =function() {
    this.m = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
};

Matrix.prototype.multiply = function (other) {
    var result = new Matrix();
    result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
    result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
    result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
    result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];

    result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
    result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
    result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
    result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];

    result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
    result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
    result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
    result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];

    result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
    result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
    result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
    result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
    return result;
};

Matrix.LookAtLH = function(camPosition, camTarget, upVector) {
    let result = new Matrix();
    let zAxis = (camTarget.subtract(camPosition)).normalize();
    let xAxis = (Vector3D.Cross(upVector, zAxis)).normalize();
    let yAxis = (Vector3D.Cross(zAxis, xAxis)).normalize();
    let px = -Vector3D.Dot(xAxis, camPosition);
    let py = -Vector3D.Dot(yAxis, camPosition);
    let pz = -Vector3D.Dot(zAxis, camPosition);
    result.m[0] = xAxis.x, result.m[1] = yAxis.x, result.m[2] = zAxis.x, result.m[3] = 0;
    result.m[4] = xAxis.y, result.m[5] = yAxis.y, result.m[6] = zAxis.y, result.m[7] = 0;
    result.m[8] = xAxis.z, result.m[9] = yAxis.z, result.m[10] = zAxis.z, result.m[11] = 0;
    result.m[12] = px; result.m[13] = py; result.m[14] = pz; result.m[15] = 1;
    return result;
};

//left handed perspective matrix
Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
    let result = new Matrix();
    let tan = 1 / (Math.tan(fov * 0.5));
    result.m[0] = tan/aspect;
    result.m[5] = tan;
    result.m[10] = -zfar / (znear - zfar);
    result.m[11] = 1;
    result.m[14] = (znear * zfar) / (znear - zfar);
    result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[12] = result.m[13] = result.m[15] = 0;
    return result;
};

Matrix.Translation = function (x,y,z){
    let result = new Matrix();
    result.m[0] = result.m[5] = result.m[10] = result.m[15] = 1;
    result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[11] = 0;
    result.m[12] = x; result.m[13] = y; result.m[14] = z;
    return result;
};

Matrix.rotationYPR = function(yaw, pitch, roll) {
    return Matrix.rotateZ(roll).multiply(Matrix.rotateX(pitch)).multiply(Matrix.rotateY(yaw));
};

Matrix.rotateX = function(theta) {
    let result = new Matrix();
    let cos = Math.cos(theta);
    let sin = Math.sin(theta);
    result.m[5] = result.m[10] = cos;
    result.m[9] = -sin;
    result.m[0] = result.m[15] = 1;
    result.m[6] = sin;
    result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[7] = result.m[8] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
    return result;
};

Matrix.rotateY = function(theta) {
    let result = new Matrix();
    let cos = Math.cos(theta);
    let sin = Math.sin(theta);
    result.m[0] = result.m[10] = cos;
    result.m[2] = -sin;
    result.m[8] = sin;
    result.m[1] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[9] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
    result.m[5] = result.m[15] = 1;
    return result;
};

Matrix.rotateZ = function(theta) {
    let result = new Matrix();
    let cos = Math.cos(theta);
    let sin = Math.sin(theta);
    result.m[0] = result.m[5] = cos;
    result.m[4] = -sin;
    result.m[1] = sin;
    result.m[2] = result.m[3] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
    result.m[10] = result.m[15] = 1;
    return result;
};

//Triakis Icosahedron
const triakisIcosahedron = function() {
    let C0 = 5 * (7 + Math.sqrt(5)) / 44;
    let C1 = 5 * (3 + 2 * Math.sqrt(5)) / 22;
    let C2 = (5 + Math.sqrt(5)) / 4;
    let C3 = 5 * (13 + 5 * Math.sqrt(5)) / 44;
    let C4 = (5 + 3 * Math.sqrt(5)) / 4;

    this.vertices = [
        new Vector3D( C2, 0.0,  C4),
        new Vector3D( C2, 0.0, -C4),
        new Vector3D(-C2, 0.0,  C4),
        new Vector3D(-C2, 0.0, -C4),
        new Vector3D( C4,  C2, 0.0),
        new Vector3D( C4, -C2, 0.0),
        new Vector3D(-C4,  C2, 0.0),
        new Vector3D(-C4, -C2, 0.0),
        new Vector3D(0.0,  C4,  C2),
        new Vector3D(0.0,  C4, -C2),
        new Vector3D(0.0, -C4,  C2),
        new Vector3D(0.0, -C4, -C2),
        new Vector3D(0.0,  C0,  C3),
        new Vector3D(0.0,  C0, -C3),
        new Vector3D(0.0, -C0,  C3),
        new Vector3D(0.0, -C0, -C3),
        new Vector3D( C3, 0.0,  C0),
        new Vector3D( C3, 0.0, -C0),
        new Vector3D(-C3, 0.0,  C0),
        new Vector3D(-C3, 0.0, -C0),
        new Vector3D( C0,  C3, 0.0),
        new Vector3D( C0, -C3, 0.0),
        new Vector3D(-C0,  C3, 0.0),
        new Vector3D(-C0, -C3, 0.0),
        new Vector3D( C1,  C1,  C1),
        new Vector3D( C1,  C1, -C1),
        new Vector3D( C1, -C1,  C1),
        new Vector3D( C1, -C1, -C1),
        new Vector3D(-C1,  C1,  C1),
        new Vector3D(-C1,  C1, -C1),
        new Vector3D(-C1, -C1,  C1),
        new Vector3D(-C1, -C1, -C1),
    ];

    this.faces = [
        { A:12, B:0, C:8 },
        { A:12, B:8, C:2 },
        { A:13, B:1, C:3 },
        { A:13, B:3, C:9 },
        { A:12, B:2, C:0 },
        { A:13, B:9, C:1 },
        { A:14, B:0, C:2 },
        { A:14, B:10, C:0 },
        { A:14, B:2, C:10 },
        { A:15, B:11, C:3 },
        { A:15, B:3, C:1 },
        { A:15, B:1, C:11 },
        { A:16, B:0, C:5 },
        { A:16, B:5, C:4 },
        { A:16, B:4, C:0 },
        { A:17, B:4, C:5 },
        { A:17, B:1, C:4 },
        { A:18, B:2, C:6 },
        { A:18, B:6, C:7 },
        { A:17, B:5, C:1 },
        { A:18, B:7, C:2 },
        { A:19, B:3, C:7 },
        { A:19, B:7, C:6 },
        { A:20, B:4, C:9 },
        { A:19, B:6, C:3 },
        { A:20, B:9, C:8 },
        { A:20, B:8, C:4 },
        { A:21, B:5, C:10 },
        { A:21, B:11, C:5 },
        { A:22, B:8, C:9 },
        { A:21, B:10, C:11 },
        { A:22, B:6, C:8 },
        { A:22, B:9, C:6 },
        { A:23, B:7, C:11 },
        { A:23, B:10, C:7 },
        { A:23, B:11, C:10 },
        { A:24, B:4, C:8 },
        { A:24, B:0, C:4 },
        { A:25, B:1, C:9 },
        { A:25, B:9, C:4 },
        { A:24, B:8, C:0 },
        { A:25, B:4, C:1 },
        { A:26, B:10, C:5 },
        { A:26, B:0, C:10 },
        { A:27, B:1, C:5 },
        { A:26, B:5, C:0 },
        { A:27, B:11, C:1 },
        { A:27, B:5, C:11 },
        { A:28, B:8, C:6 },
        { A:28, B:2, C:8 },
        { A:29, B:3, C:6 },
        { A:29, B:9, C:3 },
        { A:28, B:6, C:2 },
        { A:29, B:6, C:9 },
        { A:30, B:2, C:7 },
        { A:30, B:10, C:2 },
        { A:31, B:3, C:11 },
        { A:31, B:7, C:3 },
        { A:31, B:11, C:7 },
        { A:30, B:7, C:10 },
    ];
};


const Octahedron = function() {
    let C0 = Math.sqrt(2) / 2;

    this.vertices = [
        new Vector3D(0.0, 0.0, C0),
        new Vector3D(0.0, 0.0, -C0),
        new Vector3D( C0, 0.0, 0.0),
        new Vector3D(-C0, 0.0, 0.0),
        new Vector3D(0.0, C0, 0.0),
        new Vector3D(0.0, -C0, 0.0),
    ];
    this.faces = [
        { A:0, B:2, C:4 },
        { A:0, B:4, C:3 },
        { A:0, B:3, C:5 },
        { A:0, B:5, C:2 },
        { A:1, B:2, C:5 },
        { A:1, B:5, C:3 },
        { A:1, B:3, C:4 },
        { A:1, B:4, C:2 },
    ];
};

// 3D Engine
let meshes = [], camera, device, mesh, mesh2, mesh3, mesh4, mesh5, avgZ = [];

const Mesh = function(shape) {
    this.vertices = shape.vertices;
    this.faces = shape.faces;
    this.rotation = new Vector3D(0,0,0);
    this.position = new Vector3D(0,0,0);
    this.velocity = new Vector3D(0,0,0);
    this.acceleration = new Vector3D(0,0,0);
};


const Camera = function() {
    // Set up initial positions of the camera, the target that the camera looks at, and up direction of the camera
    this.position = new Vector3D(0, 0, 20);
    this.target = new Vector3D(0, 0, 0);
    this.up = new Vector3D(0, 1, 0);
};

// 3D core - Takes 3D mesh coordinates and projects into 2D world
const Device = function() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
};

Device.prototype.Clear = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Device.prototype.Project = function(point, transformMatrix){
    // Apply transformation matrix to each coordinate in the vertices array
    let projected = Vector3D.transformCoordinates(point, transformMatrix);
    // Scale the points by canvas size
    let x = projected.x * this.canvas.width + this.canvas.width/2;
    let y = -projected.y * this.canvas.height + this.canvas.height/2;
    let z = point.z;
    return new Vector3D(x, y, z);
};

Device.prototype.drawPoint = function(vertex) {
    this.ctx.fillStyle = 'rgba(255,255,255,.7)';
    this.ctx.fillRect(vertex.x, vertex.y, 2, 2);
};

Device.prototype.drawTriangle = function(vertex1, vertex2, vertex3) {
    this.ctx.beginPath();

    this.ctx.strokeStyle = '#096';

    this.ctx.moveTo(vertex1.x, vertex1.y); // pick up "pen," reposition
    this.ctx.lineTo(vertex2.x, vertex2.y); // draw line from vertex1 to vertex2
    this.ctx.lineTo(vertex3.x, vertex3.y); // draw line from vertex2 to vertex3
    this.ctx.closePath(); // connect end to start
    this.ctx.stroke(); // outline the triangle
    // Fill Triangles
    // this.ctx.fillStyle = 'rgba(129, 212, 250, .3)';
    // this.ctx.fill();
}

Device.prototype.Render = function(camera, meshes) {
    let viewMatrix = Matrix.LookAtLH(camera.position, camera.target, camera.up);
    console.log('viewMatrix', viewMatrix.m);
    let projectionMatrix = Matrix.PerspectiveFovLH(0.78, this.canvas.width/this.canvas.height, .01, 1.0);
    console.log('projectionMatrix', projectionMatrix.m);
    // Loop through meshes
    for (let i = 0; i < meshes.length; i++) {
        let currentMesh = meshes[i];

        let rotationMatrix = Matrix.rotateX(currentMesh.rotation.x).multiply(Matrix.rotateY(currentMesh.rotation.y)).multiply(Matrix.rotateZ(currentMesh.rotation.z));
        console.log('rotationMatrix', rotationMatrix);

        let worldMatrix = rotationMatrix.multiply(Matrix.Translation(currentMesh.position.y, currentMesh.position.x, currentMesh.position.z));
        // Final matrix to be applied to each vertex
        let transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
        // Loop through faces in each mesh
        for(let i = 0; i < currentMesh.faces.length; i++) {
            let face = currentMesh.faces[i];
            // Create each triangular face using indexes from faces array
            let vertexA = currentMesh.vertices[face.A];
            let vertexB = currentMesh.vertices[face.B];
            let vertexC = currentMesh.vertices[face.C];

            // Project each vertex in the face by applying transformation matrix to all points
            let projectedVertexA = this.Project(vertexA, transformMatrix);
            let projectedVertexB = this.Project(vertexB, transformMatrix);
            let projectedVertexC = this.Project(vertexC, transformMatrix);

            // Draw Triangles
            this.drawTriangle(projectedVertexA, projectedVertexB, projectedVertexC);

        }
    }
};

// Initialize Program
function init() {
    camera = new Camera();
    device = new Device();
    let testShape = new triakisIcosahedron();
    let testShape2 = new Octahedron();
    let testShape3 = new Octahedron();
    let testShape4 = new Octahedron();
    let testShape5 = new Octahedron();
    mesh = new Mesh(testShape);
    mesh2 = new Mesh(testShape2);
    mesh3 = new Mesh(testShape3);
    mesh4 = new Mesh(testShape4);
    mesh5 = new Mesh(testShape5);
    mesh.position.x =1;
    mesh.position.z = -20;

    mesh2.position.x =5;
    mesh2.position.y = 10;
    mesh2.position.z = -20;

    mesh3.position.y = 4;
    mesh3.position.z =-10;

    mesh4.position.x =-2;
    mesh4.position.y =-2;
    mesh4.position.z =-2;

    mesh5.position.x =5;
    mesh5.position.y =5;
    mesh5.position.z =-10;

    meshes.push(mesh);
    meshes.push(mesh2);
    meshes.push(mesh3);
    meshes.push(mesh4);
    meshes.push(mesh5);
    requestAnimationFrame(drawingLoop);
}
init();

// Rendering loop handler
function drawingLoop() {
    device.Clear();
    // Change rotation angle each frame to create rotation
    mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;

    mesh2.rotation.y += 0.01;
    mesh3.rotation.y += 0.01;
    mesh4.rotation.y += 0.01;
    mesh5.rotation.y += 0.01;

    mesh2.rotation.z += 0.01;
    mesh3.rotation.x += 0.01;
    mesh4.rotation.z += 0.01;
    mesh5.rotation.x += 0.01;

    device.Render(camera, meshes);
    requestAnimationFrame(drawingLoop);
}