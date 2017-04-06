var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = 400;
cx = cw / 2;
var ch = canvas.height = 400;
cy = ch / 2;
ctx.fillStyle = "#6ab150";
ctx.strokeStyle = "#fff";
ctx.lineWidth = 0.2;
var rad = Math.PI / 180;

var fl = 300;
var points = [];
var triangles = [];

var m = {
    x: 100,
    y: 100
}

function Light(x, y, z, brightness) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.brightness = brightness;

    this.setBrightness = function(b) {
        this.brightness = Math.min(Math.max(b, 0), 1);
    }
}



function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.fl = 250;
    // vanishing point
    this.vpX = 0;
    this.vpY = 0;
    this.cX = 0;
    this.cY = 0;
    this.cZ = 0;

    this.setVanishingPoint = function(vpX, vpY) {
        this.vpX = vpX;
        this.vpY = vpY;
    };

    this.setCenter = function(cX, cY, cZ) {
        this.cX = cX;
        this.cY = cY;
        this.cZ = cZ;
    };

    this.rotateX = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var y1 = this.y * cos - this.z * sin;
        var z1 = this.z * cos + this.y * sin;
        this.y = y1;
        this.z = z1;
    }

    this.rotateY = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x1 = this.x * cos - this.z * sin;
        var z1 = this.z * cos + this.x * sin;
        this.x = x1;
        this.z = z1;
    }


    this.getScreenX = function() {
        var scale = this.fl / (this.fl + this.z + this.cZ);
        return this.vpX + (this.cX + this.x) * scale;
    }

    this.getScreenY = function() {
        var scale = this.fl / (this.fl + this.z + this.cZ);
        return this.vpY + (this.cY + this.y) * scale;
    };

    this.update = function(ax, ay) {
        this.rotateX(ax);
        this.rotateY(ay);
    }

}

function Triangle(a, b, c, color) {
    this.pointA = a;
    this.pointB = b;
    this.pointC = c;
    this.light = {
        x: -100,
        y: -100,
        z: -100,
        brightness: 2.5
    }

    this.getAdjustedColor = function() {

        var red = color.r;
        var green = color.g;
        var blue = color.b;
        var lightFactor = this.getLightFactor();

        red = red * lightFactor <= 255 ? ~~(red * lightFactor) : 255;
        green = green * lightFactor <= 255 ? ~~(green * lightFactor) : 255;
        blue = blue * lightFactor <= 255 ? ~~(blue * lightFactor) : 255;
        return "rgb(" + red + "," + green + "," + blue + ")";
    };

    this.draw = function() {
        //ctx.save();
        ctx.fillStyle = this.getAdjustedColor();
        ctx.beginPath();
        ctx.moveTo(this.pointA.getScreenX(), this.pointA.getScreenY());
        ctx.lineTo(this.pointB.getScreenX(), this.pointB.getScreenY());
        ctx.lineTo(this.pointC.getScreenX(), this.pointC.getScreenY());
        ctx.closePath();
        ctx.fill();
        //ctx.restore();

        ctx.stroke();
    }

    this.getDepth = function() {
        return Math.min(this.pointA.z, this.pointB.z, this.pointC.z);
    };

    /*this.isBackFace = function() {
     var cax = this.pointC.getScreenX() - this.pointA.getScreenX();
     var cay = this.pointC.getScreenY() - this.pointA.getScreenY();
     var bcx = this.pointB.getScreenX() - this.pointC.getScreenX();
     var bcy = this.pointB.getScreenY() - this.pointC.getScreenY();
     return cax * bcy > cay * bcx;
     }*/

    this.getLightFactor = function() {
        var ab = {
            x: this.pointA.x - this.pointB.x,
            y: this.pointA.y - this.pointB.y,
            z: this.pointA.z - this.pointB.z
        };
        var bc = {
            x: this.pointB.x - this.pointC.x,
            y: this.pointB.y - this.pointC.y,
            z: this.pointB.z - this.pointC.z
        };
        var norm = {
            x: (ab.y * bc.z) - (ab.z * bc.y),
            y: -((ab.x * bc.z) - (ab.z * bc.x)),
            z: (ab.x * bc.y) - (ab.y * bc.x)
        };

        var dotProd = norm.x * this.light.x +
            norm.y * this.light.y +
            norm.z * this.light.z;

        var normMag = Math.sqrt(norm.x * norm.x +
            norm.y * norm.y +
            norm.z * norm.z);

        var lightMag = Math.sqrt(this.light.x * this.light.x +
            this.light.y * this.light.y +
            this.light.z * this.light.z);

        return (Math.acos(dotProd / (normMag * lightMag)) / Math.PI) * this.light.brightness;
    };

}

function depth(a, b) {
    return (b.getDepth() - a.getDepth());
}

/////////////////////////////////////////////////////

function drawSphere(total, r) {
    /*
     // theta =  0 - PI
     // phi   =  0 - 2PI
     x = r * Math.sin( theta ) * Math.cos( phi )
     y = r * Math.sin( theta ) * Math.sin( phi )
     z = r * Math.cos( theta )
     */

    //var total = 16;
    //var r = 10;
    for (var i = 0; i < total + 1; i++) {
        var phi = map(i, 0, total, 0, Math.PI);
        for (var j = 0; j < total + 1; j++) {
            var theta = map(j, 0, total, 0, 2 * Math.PI)
            var x = r * Math.sin(phi) * Math.cos(theta);
            var y = r * Math.sin(phi) * Math.sin(theta);
            var z = r * Math.cos(phi);
            var index = i + j * (total + 1);
            points[index] = new Point(x, y, z);
        }
    }

    for (var i = 0; i < total; i++) {
        for (var j = 0; j < total; j++) {

            var index1 = i + j * (total + 1);
            var v1 = points[index1];

            var index2 = i + 1 + j * (total + 1);
            var v2 = points[index2];

            var index3 = i + 1 + (j + 1) * (total + 1);
            var v3 = points[index3];

            var index4 = i + (j + 1) * (total + 1);
            var v4 = points[index4];

            //var hue = map(i,0, total,0,360);

            var ocolor = {
                r: Math.random() * 255,
                g: Math.random() * 255,
                b: index % 255
            }

            var t1 = new Triangle(points[index1], points[index3], points[index4], ocolor);
            triangles.push(t1);

            var t2 = new Triangle(points[index1], points[index2], points[index3], ocolor);
            triangles.push(t2);
        }
    }

}

drawSphere(20, 200);
/////////////////////////////////////////////////////

for (var i = 0; i < points.length; i++) {
    points[i].setVanishingPoint(cx, cy);
    points[i].setCenter(0, 0, 200)
}

function Draw() {
    requestId = window.requestAnimationFrame(Draw);
    ctx.clearRect(0, 0, cw, ch);
    var ay = (m.x - cx) * .0001;
    var ax = (m.y - cy) * .0001;

    for (var i = 0; i < points.length; i++) {
        points[i].update(ax, ay);
    }

    triangles.sort(depth)

    for (var i = 0; i < triangles.length; i++) {

        triangles[i].draw();

    }

}

requestId = window.requestAnimationFrame(Draw);

canvas.addEventListener('mousemove', function(evt) {
    m = oMousePos(canvas, evt);
}, false);

function oMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}

function map(n, a, b, _a, _b) {
    var d = b - a;
    var _d = _b - _a;
    var u = _d / d;
    return _a + n * u;
}