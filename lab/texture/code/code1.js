// jsgl.js
// Author: tu@tulrich.com (Thatcher Ulrich)
//
// Simple immediate-mode 3D graphics API in pure Javascript.  Uses
// canvas2d for rasterization.
//
// matrix & vector math & V8 tricks stolen from Dean McNamee's Soft3d.js
//
// WARNING: I reordered/renumbered his matrix elements to match OpenGL
// conventions.
//
// Also, if it helps understand the code: in my mind, vectors are
// column vectors, and a transform is "Mx" where M is the matrix and x
// is the vector.

jsgl = (function() {

    // ------------------------------------------------------------
    function newVec() {
        return {x: 0, y: 0, z: 0};
    }

    function vectorDupe(a) {
        return {x: a.x, y: a.y, z: a.z};
    }

    function vectorCopyTo(a, b) {
        b.x = a.x;
        b.y = a.y;
        b.z = a.z;
    }

    function crossProduct(a, b) {
        // a1b2 - a2b1, a2b0 - a0b2, a0b1 - a1b0
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        };
    }

    function dotProduct(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    function vectorAdd(a, b) {
        return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
    }

    function vectorSub(a, b) {
        return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
    }

    function vectorScale(v, s) {
        return {x: v.x * s, y: v.y * s, z: v.z * s};
    }

    function vectorNormalize(v) {
        var l2 = dotProduct(v, v);
        if (l2 <= 0) {
            // Punt.
            return {x:1, y:0, z:0};
        }
        var scale = 1 / Math.sqrt(l2);
        return {x: v.x * scale, y: v.y * scale, z: v.z * scale};
    }

    function vectorLength(v) {
        var l2 = dotProduct(v, v);
        return Math.sqrt(l2);
    }

    function vectorDistance(a, b) {
        var dx = (a.x - b.x);
        var dy = (a.y - b.y);
        var dz = (a.z - b.z);
        var l2 =  dx * dx + dy * dy + dz * dz;
        return Math.sqrt(l2);
    }

    // ------------------------------------------------------------

    // NOTE(tulrich): the element numbering is based on OpenGL/DX
    // conventions, where memory is laid out like:
    //
    // [ x[0]   x[4]   x[8]   x[12] ]
    // [ x[1]   x[5]   x[9]   x[13] ]
    // [ x[2]   x[6]   x[10]  x[14] ]
    // [ x[3]   x[7]   x[11]  x[15] ]
    //
    // The translate part is in x[12], x[13], x[14].  We don't
    // actually store the bottom row, so elements 3, 7, 11, and 15
    // don't exist!

    // This represents an affine 3x4 matrix.  This was originally just done with
    // object literals, but there is a 10 property limit for map sharing in v8.
    // Since we have 12 properties, and don't generally construct matrices in
    // critical loops, using a constructor function makes sure the map is shared.
    function AffineMatrix(e0, e4, e8, e12, e1, e5, e9, e13, e2, e6, e10, e14) {
        this.e0  = e0;
        this.e4  = e4;
        this.e8  = e8;
        this.e12 = e12;
        this.e1  = e1;
        this.e5  = e5;
        this.e9  = e9;
        this.e13 = e13;
        this.e2  = e2;
        this.e6  = e6;
        this.e10 = e10;
        this.e14  = e14;
    };

    function setAffineMatrix(out, e0, e4, e8, e12, e1, e5, e9, e13, e2, e6, e10, e14) {
        out.e0  = e0;
        out.e4  = e4;
        out.e8  = e8;
        out.e12 = e12;
        out.e1  = e1;
        out.e5  = e5;
        out.e9  = e9;
        out.e13 = e13;
        out.e2  = e2;
        out.e6  = e6;
        out.e10 = e10;
        out.e14  = e14;
    }

    function copyAffineMatrix(dest, src) {
        dest.e0  = src.e0;
        dest.e4  = src.e4;
        dest.e8  = src.e8;
        dest.e12 = src.e12;
        dest.e1  = src.e1;
        dest.e5  = src.e5;
        dest.e9  = src.e9;
        dest.e13 = src.e13;
        dest.e2  = src.e2;
        dest.e6  = src.e6;
        dest.e10 = src.e10;
        dest.e14 = src.e14;
    }

    // Apply the affine 3x4 matrix transform to point |p|.  |p| should
    // be a 3 element array, and |t| should be a 16 element array...
    // Technically transformations should be a 4x4 matrix for
    // homogeneous coordinates, but we're not currently using the
    // extra abilities so we can keep things cheaper by avoiding the
    // extra row of calculations.
    function transformPoint(t, p) {
        return {
            x: t.e0 * p.x + t.e4 * p.y + t.e8  * p.z + t.e12,
            y: t.e1 * p.x + t.e5 * p.y + t.e9  * p.z + t.e13,
            z: t.e2 * p.x + t.e6 * p.y + t.e10 * p.z + t.e14
        };
    }
    // As above, but puts result in given output object.
    function transformPointTo(t, p, out) {
        out.x = t.e0 * p.x + t.e4 * p.y + t.e8  * p.z + t.e12;
        out.y = t.e1 * p.x + t.e5 * p.y + t.e9  * p.z + t.e13;
        out.z = t.e2 * p.x + t.e6 * p.y + t.e10 * p.z + t.e14;
    }

    function applyRotation(t, p) {
        return {
            x: t.e0 * p.x + t.e4 * p.y + t.e8  * p.z,
            y: t.e1 * p.x + t.e5 * p.y + t.e9  * p.z,
            z: t.e2 * p.x + t.e6 * p.y + t.e10 * p.z
        };
    }

    function applyInverseRotation(t, p) {
        return {
            x: t.e0 * p.x + t.e1 * p.y + t.e2  * p.z,
            y: t.e4 * p.x + t.e5 * p.y + t.e6  * p.z,
            z: t.e8 * p.x + t.e9 * p.y + t.e10 * p.z
        };
    }

    // This is an unrolled matrix multiplication of a x b.  It is really a 4x4
    // multiplication, but with 3x4 matrix inputs and a 3x4 matrix output.  The
    // last row is implied to be [0, 0, 0, 1].
    function multiplyAffine(a, b) {
        // Avoid repeated property lookups by making access into the local frame.
        var a0 = a.e0, a1 = a.e1, a2 = a.e2, a4 = a.e4, a5 = a.e5, a6 = a.e6;
        var a8 = a.e8, a9 = a.e9, a10 = a.e10, a12 = a.e12, a13 = a.e13, a14 = a.e14;
        var b0 = b.e0, b1 = b.e1, b2 = b.e2, b4 = b.e4, b5 = b.e5, b6 = b.e6;
        var b8 = b.e8, b9 = b.e9, b10 = b.e10, b12 = b.e12, b13 = b.e13, b14 = b.e14;

        return new AffineMatrix(
            a0 * b0  + a4 * b1  + a8 * b2,
            a0 * b4  + a4 * b5  + a8 * b6,
            a0 * b8  + a4 * b9  + a8 * b10,
            a0 * b12 + a4 * b13 + a8 * b14 + a12,

            a1 * b0  + a5 * b1  + a9 * b2,
            a1 * b4  + a5 * b5  + a9 * b6,
            a1 * b8  + a5 * b9  + a9 * b10,
            a1 * b12 + a5 * b13 + a9 * b14 + a13,

            a2 * b0  + a6 * b1  + a10 * b2,
            a2 * b4  + a6 * b5  + a10 * b6,
            a2 * b8  + a6 * b9  + a10 * b10,
            a2 * b12 + a6 * b13 + a10 * b14 + a14
        );
    }
    // As above, but writing results to the given output matrix.
    function multiplyAffineTo(a, b, out) {
        // Avoid repeated property lookups by making access into the local frame.
        var a0 = a.e0, a1 = a.e1, a2 = a.e2, a4 = a.e4, a5 = a.e5, a6 = a.e6;
        var a8 = a.e8, a9 = a.e9, a10 = a.e10, a12 = a.e12, a13 = a.e13, a14 = a.e14;
        var b0 = b.e0, b1 = b.e1, b2 = b.e2, b4 = b.e4, b5 = b.e5, b6 = b.e6;
        var b8 = b.e8, b9 = b.e9, b10 = b.e10, b12 = b.e12, b13 = b.e13, b14 = b.e14;

        out.e0 = a0 * b0  + a4 * b1  + a8 * b2;
        out.e4 = a0 * b4  + a4 * b5  + a8 * b6;
        out.e8 = a0 * b8  + a4 * b9  + a8 * b10;
        out.e12 = a0 * b12 + a4 * b13 + a8 * b14 + a12;
        out.e1 = a1 * b0  + a5 * b1  + a9 * b2;
        out.e5 = a1 * b4  + a5 * b5  + a9 * b6;
        out.e9 = a1 * b8  + a5 * b9  + a9 * b10;
        out.e13 = a1 * b12 + a5 * b13 + a9 * b14 + a13;
        out.e2 = a2 * b0  + a6 * b1  + a10 * b2;
        out.e6 = a2 * b4  + a6 * b5  + a10 * b6;
        out.e10 = a2 * b8  + a6 * b9  + a10 * b10;
        out.e14 = a2 * b12 + a6 * b13 + a10 * b14 + a14;
    }

    function makeIdentityAffine() {
        return new AffineMatrix(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        );
    }

    function makeRotateAxisAngle(axis, angle) {
        var c = Math.cos(angle); var s = Math.sin(angle); var C = 1-c;
        var xs = axis.x * s;   var ys = axis.y * s;   var zs = axis.z * s;
        var xC = axis.x * C;   var yC = axis.y * C;   var zC = axis.z * C;
        var xyC = axis.x * yC; var yzC = axis.y * zC; var zxC = axis.z * xC;
        return new AffineMatrix(
            axis.x * xC + c,        xyC - zs,          zxC + ys, 0,
            xyC + zs,        axis.y * yC + c,          yzC - xs, 0,
            zxC - ys,               yzC + xs,   axis.z * zC + c, 0);
    }

    // http://en.wikipedia.org/wiki/Rotation_matrix
    function makeRotateAffineX(theta) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        return new AffineMatrix(
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0
        );
    }
    function makeRotateAffineXTo(theta, out) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        setAffineMatrix(out,
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0
        );
    }

    function makeRotateAffineY(theta) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        return new AffineMatrix(
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0
        );
    }
    function makeRotateAffineYTo(theta, out) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        setAffineMatrix(out,
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0);
    }

    function makeRotateAffineZ(theta) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        return new AffineMatrix(
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0
        );
    }
    function makeRotateAffineZTo(theta, out) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        setAffineMatrix(out,
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0);
    }

    function makeTranslateAffine(dx, dy, dz) {
        return new AffineMatrix(
            1, 0, 0, dx,
            0, 1, 0, dy,
            0, 0, 1, dz
        );
    }

    function makeScaleAffine(sx, sy, sz) {
        return new AffineMatrix(
            sx,  0,  0, 0,
            0, sy,  0, 0,
            0,  0, sz, 0
        );
    }

//     // Return the transpose of the inverse done via the classical adjoint.
//     // This skips division by the determinant, so transformations by the
//     // resulting transform will have to be renormalized.
//     function transAdjoint(a) {
//       var a0 = a.e0, a1 = a.e1, a2 = a.e2, a4 = a.e4, a5 = a.e5;
//       var a6 = a.e6, a8 = a.e8, a9 = a.e9, a10 = a.e10;
//       return new AffineMatrix(
//         a10 * a5 - a6 * a9,
//         a6 * a8 - a4 * a10,
//         a4 * a9 - a8 * a5,
//         0,
//         a2 * a9 - a10 * a1,
//         a10 * a0 - a2 * a8,
//         a8 * a1 - a0 * a9,
//         0,
//         a6 * a1 - a2 * a5,
//         a4 * a2 - a6 * a0,
//         a0 * a5 - a4 * a1,
//         0
//       );
//     }

    // Return the inverse of the rotation part of matrix a, assuming
    // that a is normalized.  This is just the transpose of the 3x3
    // rotation part.
    function invertNormalizedRotation(a) {
        return new AffineMatrix(
            a.e0, a.e1, a.e2, 0,
            a.e4, a.e5, a.e6, 0,
            a.e8, a.e9, a.e10, 0);
    }

    // Return the inverse of the given affine matrix, assuming that
    // the rotation part is normalized, by exploiting
    // transpose==inverse for rotation matrix.
    function invertNormalized(a) {
        var m = invertNormalizedRotation(a);
        var trans_prime = transformPoint(m, {x:a.e12, y:a.e13, z:a.e14});
        m.e12 = -trans_prime.x;
        m.e13 = -trans_prime.y;
        m.e14 = -trans_prime.z;
        return m;
    }

    function orthonormalizeRotation(a) {
        var new_x = vectorNormalize({x:a.e0, y:a.e1, z:a.e2});
        var new_z = vectorNormalize(crossProduct(new_x, {x:a.e4, y:a.e5, z:a.e6}));
        var new_y = crossProduct(new_z, new_x);
        a.e0 = new_x.x;
        a.e1 = new_x.y;
        a.e2 = new_x.z;
        a.e4 = new_y.x;
        a.e5 = new_y.y;
        a.e6 = new_y.z;
        a.e8 = new_z.x;
        a.e9 = new_z.y;
        a.e10 = new_z.z;
    }

    // Maps 0,0,0 to pos, maps x-axis to dir, maps y-axis to
    // up.  maps z-axis to the right.
    function makeOrientationAffine(pos, dir, up) {
        var right = crossProduct(dir, up);
        return new AffineMatrix(
            dir.x, up.x, right.x, pos.x,
            dir.y, up.y, right.y, pos.y,
            dir.z, up.z, right.z, pos.z
        );
    }

    // Maps object dir (i.e. x) to -z, object right (i.e. z) to x,
    // object up (i.e. y) to y, object pos to (0,0,0).
    //
    // I.e. conventional OpenGL "Eye" coordinates.
    //
    // You would normally use this like:
    //
    //   var object_mat = jsgl.makeOrientationAffine(obj_pos, obj_dir, obj_up);
    //   var camera_mat = jsgl.makeOrientationAffine(cam_pos, cam_dir, cam_up);
    //   var view_mat = jsgl.makeViewFromOrientation(camera_mat);
    //   var proj_mat = jsgl.makeWindowProjection(win_width, win_height, fov);
    //
    //   // To draw object:
    //   context.setTransform(jsgl.multiplyAffine(proj_mat,
    //       jsgl.multiplyAffine(view_mat, object_mat));
    //   context.drawTris(verts, trilist);
    function makeViewFromOrientation(orient) {
        // Swap x & z axes, negate z axis (even number of swaps
        // maintains right-handedness).
        var m = new AffineMatrix(
            orient.e8,  orient.e4, -orient.e0, orient.e12,
            orient.e9,  orient.e5, -orient.e1, orient.e13,
            orient.e10, orient.e6, -orient.e2, orient.e14);
        return invertNormalized(m);
    }

    // Maps "Eye" coordinates into (preprojection) window coordinates.
    // Window coords:
    //    wz > 0  --> in front of eye, not clipped
    //    wz <= 0 --> behind eye; clipped
    //    [wx/wz,wy/wz] == [0,0] (at upper-left)
    //    [wx/wz,wy/wz] == [win_width,win_height] (at lower-right)
    //
    // (This is simplified, and different from OpenGL.)
    function makeWindowProjection(win_width, win_height, fov_x_radians) {
        var half_width = win_width / 2;
        var half_height = win_height / 2;
        var tan_half = Math.tan(fov_x_radians / 2);
        var scale = half_width / tan_half;
        return new AffineMatrix(
            scale, -0, -scale, 0,
            0, -scale, -half_height / tan_half, 0,
            0,      0, -1, 0);
    }

    function projectPoint(p) {
        if (p.z <= 0) {
            return {x: 0, y: 0, z: p.z};
        } else {
            return {x: p.x / p.z, y: p.y / p.z, z: p.z};
        }
    }
    function projectPointTo(p, out) {
        out.z = p.z;
        if (p.z <= 0) {
            out.x = 0;
            out.y = 0;
        } else {
            out.x = p.x / p.z;
            out.y = p.y / p.z;
        }
    }

    // ------------------------------------------------------------

    var drawTriangle = function(ctx, im, x0, y0, x1, y1, x2, y2,
                                sx0, sy0, sx1, sy1, sx2, sy2) {
        ctx.save();

        // Clip the output to the on-screen triangle boundaries.
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        //ctx.stroke();//xxxxxxx for wireframe
        ctx.clip();

        /*
         ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

         The context matrix is:

         [ m11 m21 dx ]
         [ m12 m22 dy ]
         [  0   0   1 ]

         Coords are column vectors with a 1 in the z coord, so the transform is:
         x_out = m11 * x + m21 * y + dx;
         y_out = m12 * x + m22 * y + dy;

         From Maxima, these are the transform values that map the source
         coords to the dest coords:

         sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
         [m11 = - -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
         m12 = -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
         m21 = -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
         m22 = - -----------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
         dx = ----------------------------------------------------------------------,
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

         sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
         dy = ----------------------------------------------------------------------]
         sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
         */

        // TODO: eliminate common subexpressions.
        var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
        if (denom == 0) {
            return;
        }
        var m11 = - (sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
        var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
        var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
        var m22 = - (sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
        var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
        var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

        ctx.transform(m11, m12, m21, m22, dx, dy);

        // Draw the whole image.  Transform and clip will map it onto the
        // correct output triangle.
        //
        // TODO: figure out if drawImage goes faster if we specify the rectangle that
        // bounds the source coords.
        ctx.drawImage(im, 0, 0);
        ctx.restore();
    };

    var Context = function(canvas_ctx) {
        var me = this;
        me.canvas_ctx_ = canvas_ctx;
        me.transform_ = makeIdentityAffine();
        me.texture_ = null;

        // Mesh temporaries.
        me.tempverts_ = [];
        me.temp_vert0_ = {x:0, y:0, z:0, u:0, v:0};
    };

    Context.prototype.setTransform = function(mat) {
        copyAffineMatrix(this.transform_, mat);
    }

    Context.prototype.setTexture = function(tex) {
        this.texture_ = tex;
    }

    Context.prototype.expandTempVerts = function(size) {
        var temps = this.tempverts_;
        var expand = size - temps.length;
        for (var i = 0; i < expand; i++) {
            temps.push({x:0, y:0, z:0, u:0, v:0});
        }
    }

    Context.prototype.drawTris = function(verts, trilist) {
        this.expandTempVerts(verts.length);
        var temps = this.tempverts_;
        var tx = this.transform_;
        var tempv0 = this.temp_vert0_;
        var n = verts.length;
        for (var i = 0; i < n; i++) {
            transformPointTo(tx, verts[i], tempv0);
            projectPointTo(tempv0, temps[i]);
            temps[i].u = verts[i].u;
            temps[i].v = verts[i].v;
        }

        var ctx = this.canvas_ctx_;
        var tex = this.texture_;
        var p0;
        var p1;
        var p2;
        n = trilist.length - 2;
        for (i = 0; i < n; i += 3) {
            p0 = temps[trilist[i]];
            p1 = temps[trilist[i + 1]];
            p2 = temps[trilist[i + 2]];

            if (p0.z <= 0 || p1.z <= 0 && p2.z <= 0) {
                // Crosses zero plane; cull it.
                // TODO: clip?
                continue;
            }

            var signed_area = (p1.x - p0.x) * (p2.y - p0.y) -
                (p1.y - p0.y) * (p2.x - p0.x);
            if (signed_area > 0) {
                // Backfacing.
                continue;
            }

            drawTriangle(ctx, tex,
                p0.x, p0.y, p1.x, p1.y, p2.x, p2.y,
                p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);
        }
    }

    return {
        newVec: newVec,
        vectorDupe: vectorDupe,
        vectorCopyTo: vectorCopyTo,
        crossProduct: crossProduct,
        dotProduct: dotProduct,
        vectorAdd: vectorAdd,
        vectorSub: vectorSub,
        vectorScale: vectorScale,
        vectorNormalize: vectorNormalize,
        vectorLength: vectorLength,
        vectorDistance: vectorDistance,
        AffineMatrix: AffineMatrix,
        copyAffineMatrix: copyAffineMatrix,
        transformPoint: transformPoint,
        transformPointTo: transformPointTo,
        applyRotation: applyRotation,
        applyInverseRotation: applyInverseRotation,
        multiplyAffine: multiplyAffine,
        multiplyAffineTo: multiplyAffineTo,
        makeIdentityAffine: makeIdentityAffine,
        makeRotateAxisAngle: makeRotateAxisAngle,
        makeRotateAffineX: makeRotateAffineX,
        makeRotateAffineXTo: makeRotateAffineXTo,
        makeRotateAffineY: makeRotateAffineY,
        makeRotateAffineYTo: makeRotateAffineYTo,
        makeRotateAffineZ: makeRotateAffineZ,
        makeRotateAffineZTo: makeRotateAffineZTo,
        makeTranslateAffine: makeTranslateAffine,
        makeScaleAffine: makeScaleAffine,
        invertNormalizedRotation: invertNormalizedRotation,
        invertNormalized: invertNormalized,
        orthonormalizeRotation: orthonormalizeRotation,
        makeOrientationAffine: makeOrientationAffine,
        makeViewFromOrientation: makeViewFromOrientation,
        makeWindowProjection: makeWindowProjection,
        projectPoint: projectPoint,
        projectPointTo: projectPointTo,

        Context: Context,

        drawTriangle: drawTriangle
    };
})();



// By Thatcher Ulrich http://tulrich.com 2009
//
// This source code has been donated to the Public Domain.  Do
// whatever you want with it.  Use at your own risk.

var images = [];
var dl = null;
var canvas_elem = null;
var c3d = null;
var temp_mat0 = null;
var temp_mat1 = null;
var object_mat = null;
var camera_mat = null;
var proj_mat = null;
var timer_id = null;
var options = {
    draw_backfaces: true,
    whiteout_alpha: 1,
    wireframe: false,
    subdivide_factor: 10.0,
    nonadaptive_depth: 0
};
var mouse_x = 0;
var mouse_y = 0;
var mouse_grab_point = null;
var mouse_is_down = false;
var horizontal_fov_radians = Math.PI / 2;
var object_omega = {x: 2.6, y: 2.6, z: 0};
var target_distance = 2;
var zoom_in_pressed = false;
var zoom_out_pressed = false;
var last_spin_time = 0;
var draw_wireframe = false;

function getTime() {
    return (new Date()).getTime();
}

var MIN_Z = 0.05;

// Return the point between two points, also bisect the texture coords.
function bisect(p0, p1) {
    var p = {x: (p0.x + p1.x) / 2,
        y: (p0.y + p1.y) / 2,
        z: (p0.z + p1.z) / 2,
        u: (p0.u + p1.u) / 2,
        v: (p0.v + p1.v) / 2};
    return p;
}

// for debugging
function drawPerspectiveTriUnclippedSubX(c3d, v0, tv0, v1, tv1, v2, tv2) {
    var ctx = c3d.canvas_ctx_;
    ctx.beginPath();
    ctx.moveTo(tv0.x, tv0.y);
    ctx.lineTo(tv1.x, tv1.y);
    ctx.lineTo(tv2.x, tv2.y);
    ctx.lineTo(tv0.x, tv0.y);
    ctx.stroke();
}

function drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v2, tv2, depth_count) {
    var edgelen01 =
        Math.abs(tv0.x - tv1.x) +
        Math.abs(tv0.y - tv1.y);
    var edgelen12 =
        Math.abs(tv1.x - tv2.x) +
        Math.abs(tv1.y - tv2.y);
    var edgelen20 =
        Math.abs(tv2.x - tv0.x) +
        Math.abs(tv2.y - tv0.y);
    var zdepth01 =
        Math.abs(v0.z - v1.z);
    var zdepth12 =
        Math.abs(v1.z - v2.z);
    var zdepth20 =
        Math.abs(v2.z - v0.z);

    var subdiv = ((edgelen01 * zdepth01 > options.subdivide_factor) ? 1 : 0) +
        ((edgelen12 * zdepth12 > options.subdivide_factor) ? 2 : 0) +
        ((edgelen20 * zdepth20 > options.subdivide_factor) ? 4 : 0);

    if (depth_count) {
        depth_count--;
        if (depth_count == 0) {
            subdiv = 0;
        } else {
            subdiv = 7;
        }
    }

    if (subdiv == 0) {
        if (draw_wireframe) {
            var ctx = c3d.canvas_ctx_;
            ctx.beginPath();
            ctx.moveTo(tv0.x, tv0.y);
            ctx.lineTo(tv1.x, tv1.y);
            ctx.lineTo(tv2.x, tv2.y);
            ctx.lineTo(tv0.x, tv0.y);
            ctx.stroke();
        } else {
            jsgl.drawTriangle(c3d.canvas_ctx_, images[0],
                tv0.x, tv0.y,
                tv1.x, tv1.y,
                tv2.x, tv2.y,
                v0.u, v0.v,
                v1.u, v1.v,
                v2.u, v2.v);
        }
        return;
    }

    // Need to subdivide.  This code could be more optimal, but I'm
    // trying to keep it reasonably short.
    var v01 = bisect(v0, v1);
    var tv01 = jsgl.projectPoint(v01);
    var v12 = bisect(v1, v2);
    var tv12 = jsgl.projectPoint(v12);
    var v20 = bisect(v2, v0);
    var tv20 = jsgl.projectPoint(v20);

    switch (subdiv) {
        case 1:
            // split along v01-v2
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v2, tv2);
            drawPerspectiveTriUnclippedSub(c3d, v01, tv01, v1, tv1, v2, tv2);
            break;
        case 2:
            // split along v0-v12
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v12, tv12);
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v12, tv12, v2, tv2);
            break;
        case 3:
            // split along v01-v12
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v12, tv12);
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v12, tv12, v2, tv2);
            drawPerspectiveTriUnclippedSub(c3d, v01, tv01, v1, tv1, v12, tv12);
            break;
        case 4:
            // split along v1-v20
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v20, tv20);
            drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v2, tv2, v20, tv20);
            break;
        case 5:
            // split along v01-v20
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v20, tv20);
            drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v2, tv2, v01, tv01);
            drawPerspectiveTriUnclippedSub(c3d, v2, tv2, v20, tv20, v01, tv01);
            break;
        case 6:
            // split along v12-v20
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v20, tv20);
            drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v12, tv12, v20, tv20);
            drawPerspectiveTriUnclippedSub(c3d, v12, tv12, v2, tv2, v20, tv20);
            break;
        default:
        case 7:
            drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v01, tv01, v20, tv20, depth_count);
            drawPerspectiveTriUnclippedSub(c3d, v1, tv1, v12, tv12, v01, tv01, depth_count);
            drawPerspectiveTriUnclippedSub(c3d, v2, tv2, v20, tv20, v12, tv12, depth_count);
            drawPerspectiveTriUnclippedSub(c3d, v01, tv01, v12, tv12, v20, tv20, depth_count);
            break;
    }
    return;
}

function drawPerspectiveTriUnclipped(c3d, v0, v1, v2, depth_count) {
    var tv0 = jsgl.projectPoint(v0);
    var tv1 = jsgl.projectPoint(v1);
    var tv2 = jsgl.projectPoint(v2);
    drawPerspectiveTriUnclippedSub(c3d, v0, tv0, v1, tv1, v2, tv2, depth_count);
}

// Given an edge that crosses the z==MIN_Z plane, return the
// intersection of the edge with z==MIN_Z.
function clip_line(v0, v1) {
    var f = (MIN_Z - v0.z) / (v1.z - v0.z);
    return {x: v0.x + (v1.x - v0.x) * f,
        y: v0.y + (v1.y - v0.y) * f,
        z: v0.z + (v1.z - v0.z) * f,
        u: v0.u + (v1.u - v0.u) * f,
        v: v0.v + (v1.v - v0.v) * f
    };
}

// Draw a perspective-corrected textured triangle, subdividing as
// necessary for clipping and texture mapping.
function drawPerspectiveTriConventionalClipping(c3d, v0, v1, v2) {
    var clip = ((v0.z < MIN_Z) ? 1 : 0) +
        ((v1.z < MIN_Z) ? 2 : 0) +
        ((v2.z < MIN_Z) ? 4 : 0);
    if (clip == 7) {
        // All verts are behind the near plane; don't draw.
        return;
    }

    if (clip != 0) {
        var v01, v12, v20;
        switch (clip) {
            case 1:
                v01 = clip_line(v0, v1);
                v20 = clip_line(v0, v2);
                drawPerspectiveTriUnclipped(c3d, v01, v1, v2);
                drawPerspectiveTriUnclipped(c3d, v01, v2, v20);
                break;
            case 2:
                v01 = clip_line(v1, v0);
                v12 = clip_line(v1, v2);
                drawPerspectiveTriUnclipped(c3d, v0, v01, v12);
                drawPerspectiveTriUnclipped(c3d, v0, v12, v2);
                break;
            case 3:
                v12 = clip_line(v1, v2);
                v20 = clip_line(v0, v2);
                drawPerspectiveTriUnclipped(c3d, v2, v20, v12);
                break;
            case 4:
                v12 = clip_line(v2, v1);
                v20 = clip_line(v2, v0);
                drawPerspectiveTriUnclipped(c3d, v0, v1, v12);
                drawPerspectiveTriUnclipped(c3d, v0, v12, v20);
                break;
            case 5:
                v01 = clip_line(v0, v1);
                v12 = clip_line(v2, v1);
                drawPerspectiveTriUnclipped(c3d, v1, v12, v01);
                break;
            case 6:
                v01 = clip_line(v0, v1);
                v20 = clip_line(v0, v2);
                drawPerspectiveTriUnclipped(c3d, v0, v01, v20);
                break;
        }
        return;
    }

    // No verts need clipping.
    drawPerspectiveTriUnclipped(c3d, v0, v1, v2);
}

// Draw a perspective-corrected textured triangle, subdividing as
// necessary for clipping and texture mapping.
//
// Unconventional clipping -- recursively subdivide, and drop whole tris on
// the wrong side of z clip plane.
function drawPerspectiveTri(c3d, v0, v1, v2, depth_count) {
    var clip = ((v0.z < MIN_Z) ? 1 : 0) +
        ((v1.z < MIN_Z) ? 2 : 0) +
        ((v2.z < MIN_Z) ? 4 : 0);
    if (clip == 0) {
        // No verts need clipping.
        drawPerspectiveTriUnclipped(c3d, v0, v1, v2, depth_count);
        return;
    }
    if (clip == 7) {
        // All verts are behind the near plane; don't draw.
        return;
    }

    var min_z2 = MIN_Z * 1.1;
    var clip2 = ((v0.z < min_z2) ? 1 : 0) +
        ((v1.z < min_z2) ? 2 : 0) +
        ((v2.z < min_z2) ? 4 : 0);
    if (clip2 == 7) {
        // All verts are behind the guard band, don't recurse.
        return;
    }

    var v01 = bisect(v0, v1);
    var v12 = bisect(v1, v2);
    var v20 = bisect(v2, v0);

    if (depth_count) {
        depth_count--;
    }

    if (1) {//xxxxxx
        drawPerspectiveTri(c3d, v0, v01, v20, depth_count);
        drawPerspectiveTri(c3d, v01, v1, v12, depth_count);
        drawPerspectiveTri(c3d, v12, v2, v20, depth_count);
        drawPerspectiveTri(c3d, v01, v12, v20, depth_count);
        return;
    }

    switch (clip) {
        case 1:
            drawPerspectiveTri(c3d, v01, v1, v2);
            drawPerspectiveTri(c3d, v01, v2, v20);
            drawPerspectiveTri(c3d, v0, v01, v20);
            break;
        case 2:
            drawPerspectiveTri(c3d, v0, v01, v12);
            drawPerspectiveTri(c3d, v0, v12, v2);
            drawPerspectiveTri(c3d, v1, v12, v01);
            break;
        case 3:
            drawPerspectiveTri(c3d, v2, v20, v12);
            drawPerspectiveTri(c3d, v0, v1, v12);
            drawPerspectiveTri(c3d, v0, v12, v20);
            break;
        case 4:
            drawPerspectiveTri(c3d, v0, v1, v12);
            drawPerspectiveTri(c3d, v0, v12, v20);
            drawPerspectiveTri(c3d, v12, v2, v20);
            break;
        case 5:
            drawPerspectiveTri(c3d, v1, v12, v01);
            drawPerspectiveTri(c3d, v0, v01, v12);
            drawPerspectiveTri(c3d, v0, v12, v2);
            break;
        case 6:
            drawPerspectiveTri(c3d, v0, v01, v20);
            drawPerspectiveTri(c3d, v01, v1, v2);
            drawPerspectiveTri(c3d, v01, v2, v20);
            break;
    }
}

function draw() {
    // Clear with white.
    var ctx = c3d.canvas_ctx_;

    ctx.globalAlpha = options.whiteout_alpha;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas_elem.width, canvas_elem.height);
    ctx.globalAlpha = 1;

    var view_mat = jsgl.makeViewFromOrientation(camera_mat);

    // Update transform.
    jsgl.multiplyAffineTo(proj_mat, view_mat, temp_mat0);
    jsgl.multiplyAffineTo(temp_mat0, object_mat, temp_mat1);
    c3d.setTransform(temp_mat1);

    // Draw.
    var im_width = images[0].width;
    var im_height = images[0].height;
    var verts = [
        {x:-1, y:-1, z: 0, u:0, v:0},
        {x: 1, y:-1, z: 0, u:im_width, v:0},
        {x: 1, y: 1, z: 0, u:im_width, v:im_height},
        {x:-1, y: 1, z: 0, u:0, v:im_height}
    ];
    var tverts = [];
    for (var i = 0; i < verts.length; i++) {
        tverts.push(jsgl.transformPoint(c3d.transform_, verts[i]));
        tverts[i].u = verts[i].u;
        tverts[i].v = verts[i].v;
    }

    drawPerspectiveTri(c3d, tverts[0], tverts[1], tverts[2], options.nonadaptive_depth);
    drawPerspectiveTri(c3d, tverts[0], tverts[2], tverts[3], options.nonadaptive_depth);

    if (options.wireframe) {
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, canvas_elem.width, canvas_elem.height);
        draw_wireframe = true;
        ctx.globalAlpha = 1;
        drawPerspectiveTri(c3d, tverts[0], tverts[1], tverts[2], options.nonadaptive_depth);
        drawPerspectiveTri(c3d, tverts[0], tverts[2], tverts[3], options.nonadaptive_depth);
        draw_wireframe = false;
    }
}

function rotateObject(scaled_axis) {
    var angle =
        Math.asin(Math.sqrt(jsgl.dotProduct(scaled_axis, scaled_axis)));
    if (angle > Math.PI / 8) {
        angle = Math.PI / 8;
    }

    var axis = jsgl.vectorNormalize(scaled_axis);
    var mat = jsgl.makeRotateAxisAngle(axis, angle);
    object_mat = jsgl.multiplyAffine(mat, object_mat);
    jsgl.orthonormalizeRotation(object_mat);
}

function spin() {
    var t_now = getTime();
    var dt = t_now - last_spin_time;
    last_spin_time = t_now;
    if (dt > 100) {
        dt = 100;
    }
    if (dt < 1) {
        dt = 1;
    }

    // Zoom.
    if (zoom_in_pressed) {
        target_distance -= 2.0 * dt / 1000;
    }
    if (zoom_out_pressed) {
        target_distance += 2.0 * dt / 1000;
    }
    if (target_distance < 0) {
        target_distance = 0;
    }

    camera_mat.e14 = 0.2 + target_distance;

    if (mouse_is_down) {
        var new_grab_point = screenToSpherePt(mouse_x, mouse_y);
        if (mouse_grab_point == null && new_grab_point != null) {
            mouse_grab_point = jsgl.applyInverseRotation(object_mat, new_grab_point);
        }
        if (mouse_grab_point && new_grab_point) {
            var orig_grab_point = jsgl.applyRotation(object_mat, mouse_grab_point);
            // Rotate the object, to map old grab point onto new grab point.
            var axis = jsgl.crossProduct(orig_grab_point, new_grab_point);
            axis = jsgl.vectorScale(axis, 0.95);
            rotateObject(axis);

            object_omega = jsgl.vectorScale(axis, 1000 / dt);
        }
    } else {
        mouse_grab_point = null;

        object_omega = jsgl.vectorScale(object_omega, 0.95);
        if (jsgl.dotProduct(object_omega, object_omega) < 0.000000001 &&
            zoom_in_pressed == false &&
            zoom_out_pressed == false) {
            object_omega = {x: 0, y: 0, z: 0};
            stop_spinning();
            draw();
            return;
        }

        var axis = jsgl.vectorScale(object_omega, dt / 1000);
        rotateObject(axis);
    }

    draw();
}

// Return the first exterior hit or closest point between the unit
// sphere and the ray starting at p and going in the r direction.
function rayVsUnitSphereClosestPoint(p, r) {
    var p_len2 = jsgl.dotProduct(p, p);
    if (p_len2 < 1) {
        // Ray is inside sphere, no exterior hit.
        return null;
    }

    var along_ray = -jsgl.dotProduct(p, r);
    if (along_ray < 0) {
        // Behind ray start-point.
        return null;
    }

    var perp = jsgl.vectorAdd(p, jsgl.vectorScale(r, along_ray));
    var perp_len2 = jsgl.dotProduct(perp, perp);
    if (perp_len2 >= 0.999999) {
        // Return the closest point.
        return jsgl.vectorNormalize(perp);
    }

    // Compute intersection.
    var e = Math.sqrt(1 - jsgl.dotProduct(perp, perp));
    var hit = jsgl.vectorAdd(p, jsgl.vectorScale(r, (along_ray - e)));
    return jsgl.vectorNormalize(hit);
}

function screenToSpherePt(x, y) {
    var p = {x: camera_mat.e12, y: camera_mat.e13, z: camera_mat.e14 + 1};
    // camera dir
    var r = {x: camera_mat.e0, y: camera_mat.e1, z: camera_mat.e2 };
    var up = {x: camera_mat.e4, y: camera_mat.e5, z: camera_mat.e6 };
    var right = {x: camera_mat.e8, y: camera_mat.e9, z: camera_mat.e10 };
    var tan_half = Math.tan(horizontal_fov_radians / 2);
    r = jsgl.vectorAdd(r, jsgl.vectorScale(right, x * tan_half));
    r = jsgl.vectorAdd(r, jsgl.vectorScale(up, y * tan_half));
    r = jsgl.vectorNormalize(r);

    return rayVsUnitSphereClosestPoint(p, r);
}

function rememberMousePos(e) {
    var width = canvas_elem.width;
    var height = canvas_elem.height;
    mouse_x = ((e.clientX - canvas_elem.offsetLeft) / width) * 2 - 1;
    mouse_y = -(((e.clientY - canvas_elem.offsetTop) - height / 2) / (width / 2));
}

function mousedown(e) {
    mouse_is_down = true;
    rememberMousePos(e);
    start_spinning();
}

var mev;
function mousemove(e) {
    mev = e;
    rememberMousePos(e);
    if (mouse_is_down) {
        start_spinning();
    }
}

function mouseup(e) {
    mouse_is_down = false;
}

function keydown(event) {
    if (!event) {
        event = window.event;
    }
    // a == 65
    // w == 87
    // z == 90
    // up == 38
    // down == 40
    // PgUp == 33
    // PgDn == 34
    if (event.keyCode == 65) {  // a
        zoom_in_pressed = true;
        start_spinning();
    } else if (event.keyCode == 90) {  // z
        zoom_out_pressed = true;
        start_spinning();
    } else if (event.keyCode == 87) {  // w
        options.wireframe = !options.wireframe;
        start_spinning();
    }
}

function keyup(event) {
    if (!event) {
        event = window.event;
    }
    if (event.keyCode == 65) {  // a
        zoom_in_pressed = false;
    } else if (event.keyCode == 90) {  // z
        zoom_out_pressed = false;
    }
}

function start_spinning() {
    if (timer_id === null) {
        timer_id = setInterval(spin, 15);
    }
}

function stop_spinning() {
    if (timer_id !== null) {
        clearInterval(timer_id);
        timer_id = null;
    }
}

function init() {
    canvas_elem = document.getElementById('canvas');
    canvas_elem.addEventListener('mousedown', mousedown, false);
    canvas_elem.addEventListener('mousemove', mousemove, false);
    canvas_elem.addEventListener('mouseup', mouseup, false);
    canvas_elem.addEventListener('mouseout', mouseup, false);

    var ctx = canvas_elem.getContext('2d');

    c3d = new jsgl.Context(ctx);

    temp_mat0 = jsgl.makeIdentityAffine();
    temp_mat1 = jsgl.makeIdentityAffine();
    temp_mat2 = jsgl.makeIdentityAffine();
    proj_mat = jsgl.makeWindowProjection(
        canvas_elem.width, canvas_elem.height, horizontal_fov_radians);
    object_mat = jsgl.makeOrientationAffine(
        {x:0, y:0, z:0}, {x:1, y:0, z:0}, {x:0, y:1, z:0});
    camera_mat = jsgl.makeOrientationAffine(
        {x:0, y:0, z: 0.2 + target_distance}, {x:0, y:0, z:-1}, {x:0, y:1, z:0});

    var texdim = images[0].width;

    document.getElementById('cb_blur').addEventListener('change', function(e) {
        options.whiteout_alpha = this.checked ? 0.3 : 1;
    }, false);

    document.getElementById('sb_subdiv_factor').addEventListener('change',
        function(e) {
            options.subdivide_factor = document.getElementById('sb_subdiv_factor').value;
            start_spinning();
        }, false);

    document.getElementById('cb_wireframe').addEventListener('change', function(e) {
        options.wireframe = this.checked ? true : false;
        draw();
    }, false);

    document.getElementById('sb_nonadaptive_depth').addEventListener('change',
        function(e) {
            options.nonadaptive_depth = parseInt(document.getElementById('sb_nonadaptive_depth').value);
            start_spinning();
        }, false);

    start_spinning();
}

var loaded_count = 0;
function image_loaded() {
    loaded_count++;
    if (loaded_count == 1) {
        init();
    }
}

// Awesome cubemaps: http://www.humus.name/index.php?page=Textures&&start=32

window.addEventListener('load', function() {
    images.push(new Image());
    images[0].onload = image_loaded;
    images[0].src = 'https://pbs.twimg.com/media/BxXhdmSCAAAuVq-.jpg';
}, false);

(function() {with (this[2]) {with (this[1]) {with (this[0]) {return function(event) {return keyup(event);
};}}}})