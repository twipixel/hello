"use strict";

// ###### Vec3 #####################################################################

/// Object to represent a 3D vector
function Vec3( x, y, z ) {
    this.set( x, y, z );
}

Vec3.prototype.set = function( x, y, z ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
}

Vec3.prototype.rotateX = function( phi ) {
    var newY = this.y*Math.cos(phi) - this.z*Math.sin(phi);
    this.z = this.y*Math.sin(phi) + this.z*Math.cos(phi);
    this.y = newY;
    return this;
}

Vec3.prototype.rotateY = function( theta ) {
    var newX =  this.x*Math.cos(theta) + this.z*Math.sin(theta);
    this.z = -this.x*Math.sin(theta) + this.z*Math.cos(theta);
    this.x = newX;
    return this;
}

Vec3.prototype.rotateZ = function( psi ) {
    var newX = this.x*Math.cos(psi) - this.y*Math.sin(psi);
    this.y = this.x*Math.sin(psi) + this.y*Math.cos(psi);
    this.x = newX;
    return this;
}

// ###### Sphere pixel look-up #####################################################

var vec = new Vec3(); // A cached Vec3 instance we'll use repeatedly in 'drawSphere'

/// Given x,y coordinates in [-1,1], and an arbitrary amount of temporal progression,
/// this function fills an array of [r,g,b,a] values required to render the specified
/// region of the sphere in 2D space.
function drawSphere( x, y, time, rgba/*out*/ )
{
    var xx=x*x , yy=y*y;

    // Return a transparent pixel if we're outside of the sphere.
    if( xx + yy > 1 ) {
        rgba[0]=rgba[1]=rgba[2]=rgba[3]=0;
        return;
    }

    // Set our cached Vec3 to the x,y,z of the pixel on the visible hemi-sphere, and rotate it.
    vec.set( x, y, Math.sqrt( 1 - xx - yy ) )
        .rotateZ( time/2 )
        .rotateX( time )
        .rotateY( time*2 );

    // Get spherical coordinate angles from the rotated cartesian values.
    var phi   = Math.atan2( vec.x, vec.y ) + Math.PI;     // 0 < phi < 2pi
    var theta = Math.atan2( vec.z,   1   ) + Math.PI / 4; // 0 < theta < pi/2

    // Transform the angles in to texture coordinates in [0,255].
    var u = Math.floor( 256 *   phi / Math.PI / 2 );
    var v = Math.floor( 256 * theta / Math.PI * 2 );

    // Look up the texture coordinates in a colored XOR texture.
    rgba[0] = u ^ v;
    rgba[1] = 2*Math.abs( 128 - (u ^ v) );
    rgba[2] = 255-(u ^ v);
    rgba[3] = 255;

    // Compute the pixel's distance from the center of the lighting glare.
    var ldx = x + 0.5;
    var ldy = y + 0.5;
    var ld = Math.sqrt( ldx*ldx + ldy*ldy ) + 0.4; // Constant added here for anti-glare effect. 0 = glare, 1 = no glare.
    ld *= ld;

    // Divide all colors by the squared distance from the glare center, and we're done.
    rgba[0] /= ld;
    rgba[1] /= ld;
    rgba[2] /= ld;
    return;
}

// ###### Update and render loop ###################################################

var ctx = document.getElementById('out').getContext("2d");
var time = 0;

setInterval(function()
    {
        time += 0.05;

        var idata = ctx.getImageData( 0, 0, 256, 256 );

        var i = 0, pixel = [0,0,0,0];
        for( var x = 0 ; x < 256 ; ++x ) {
            for( var y = 0 ; y < 256 ; ++y )
            {
                drawSphere( (x-128)/128, (y-128)/128, time, pixel );

                idata.data[i++]=( pixel[0] );
                idata.data[i++]=( pixel[1] );
                idata.data[i++]=( pixel[2] );
                idata.data[i++]=( pixel[3] );
            }
        }

        ctx.putImageData( idata, 0, 0 );
    },
    30 );