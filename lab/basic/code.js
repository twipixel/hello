var Vector3D = function(x,y,z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

Vector3D.prototype = {

    set : function(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    // find the vector projection in the direction of v
    proj : function(v){ return new Vector3D(v.x - this.x, v.y - this.y, v.z - this.z) },

    // find the norm of this vector
    norm : function(){ return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z) },

    // return (a copy of) this vector as a unit vector
    normalize : function(){
        var n = this.norm();
        return new Vector3D( this.x / n, this.y / n, this.z / n )
    }
};


/**
 * A sphere of 'n' Hammersley points
 *
 * @link / http://www.cse.cuhk.edu.hk/~ttwong/papers/udpoint/udpoint.pdf
 *
 * The Hammersley point algorithm creates a spiral twisted around the sphere
 *
 * @param radius { Number } - sphere radius
 * @param position { Vector3D } - position of the sphere's center
 * @param n { Number } - the number of points to be generated
 */
var HammersleySphere = function( radius, position, n ){
    this.position = position;
    this.radius = radius;
    this.verts = [];

    // based on the algorithm in spherical coordinates (theta, phi) from
    // "Distributing many points on a sphere" by E.B. Saff and A.B.J. Kuijlaars,
    // Mathematical Intelligencer 19.1 (1997) 5--11.
    // retrieved from / http://www.math.niu.edu/~rusin/known-math/97/spherefaq
    for(var i = 0, phiLast = 0; i < n; i++ ){
        var h = -1 + 2 * ( i - 1 ) / ( n - 1 ),
            theta = Math.acos(h),
            phi = i == 1 ? 0 : ( phiLast + 3.6 / Math.sqrt( n * (1-h*h))) % ( 2 * Math.PI );

        phiLast = phi;

        // convert back to cartesian coordinates and scale from (-1,1) to (pos-radius,pos+radius)
        this.verts.push( new Vector3D(
            this.position.x + radius * Math.sin( phi ) * Math.sin( theta ),
            this.position.y + radius * Math.cos( theta ),
            this.position.z + radius * Math.cos( phi ) * Math.sin( theta )
        ))
    }

};

$(document).ready(function(){

    // create a UV map
    // http://en.wikipedia.org/wiki/UV_mapping

    function mapUV(phiC,phiS,newimg,data){

        for(var i=0;i<sphere.verts.length;i++){

            // find the unit vector from each vertex to the center of the sphere
            var d = sphere.verts[i].proj( sphere.position ).normalize();

            // rotate the point by phi radians along the z-axis
            d.set(
                d.x * phiC - phiS * d.y,
                d.x * phiS + phiC * d.y,
                d.z );

            // calculate u and v, and scale to the canvas size
            var	u = Math.round( ( 0.5 + ( Math.atan2( d.z, d.x ) / ( 2 * Math.PI ) ) ) * c.width ),
                v = Math.round( ( 0.5 - ( Math.asin( d.y ) / Math.PI ) ) * c.height );

            // find the coordinates in picture space
            var k = 4 * ( u + v * c.width ),
                j = 4 * ( Math.round( sphere.verts[i].x ) + Math.round( sphere.verts[i].y ) * c.width );

            if(sphere.verts[i].z <= 0) { // only draw points facing the camera
                newimg.data[j] = data.data[k]; // r
                newimg.data[j+1] = data.data[k+1]; // g
                newimg.data[j+2] = data.data[k+2]; // b
                newimg.data[j+3] = 255;  // a
            }
        }

        return newimg
    }

    var c = document.getElementById('graphics');
    var ctx = c.getContext('2d');

    c.width = 640;
    c.height = 480;

    var sphere = new HammersleySphere(150,new Vector3D(c.width/2,c.height/2,0), 280000 );
    var img = new Image;
    img.crossOrigin = 'Anonymous';

    img.onload = function(){

        // get the image data to an array and then clear the canvas
        ctx.drawImage(img,0,0,c.width,c.height);
        var data = ctx.getImageData(0,0,c.width,c.height);
        ctx.clearRect(0,0,c.width,c.height);

        // a new ImageData object
        var newimg = ctx.createImageData(c.width,c.height);

        //
        newimg = mapUV(1,0,newimg,data);
        ctx.putImageData(newimg,0,0,0,0,c.width,c.height);

        window.addEventListener('mousemove',function(e){

            // scale the mouse x & y to the interval (-1,1)
            // and optimize by precomputing cos/sin of theta and phi
            var ex =  ( e.x / window.innerWidth - 0.5 ) * 2,
                ey = - (e.y / window.innerHeight - 0.5 ) * 2,
                phi = -ey * 45 * Math.PI / 180,
                phiC = Math.cos( phi ),
                phiS = Math.sin( phi );

            newimg = mapUV(phiC,phiS,newimg,data);

            ctx.putImageData(newimg,0,0,0,0,c.width,c.height);

        },false);
    }

    img.src = "http://i.imgur.com/BGeblEv.jpg?1";

});
