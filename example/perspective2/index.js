var image  = new Image(),
    width  = 0,
    height = 0,
    angle  = 0,
    start  = Date.now();

var anim = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas  = document.getElementsByTagName('canvas')[0],
    context = canvas.getContext("2d");

image.onload = function() {
    width  = image.width;
    height = image.height;

    animate();
}

function animate() {
    var hScale = 1,
        vScale = 1,
        hSkew  = 0,
        vSkew  = 0,
        hMove  = 0,
        vMove  = 140,

        split  = height / 2;

    var cos = Math.cos((Date.now() - start) / 1000);
    var sin = Math.sin((Date.now() - start) / 1000)

    angle  = cos * 0.5;
    hScale = 1 - (1 - Math.abs(sin)) * 0.5;

    context.setTransform(1, 0, 0, 1, 0, 0);
    //context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(255, 255, 255, .2)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    console.log('split', split, 'angle:', angle, hScale, vSkew, hSkew, vScale);

    for (var i = 0; i <= split; ++i) {
        vSkew = i / split * (angle * 0.666666);

        context.setTransform(
            hScale,
            vSkew, hSkew,
            vScale,
            hMove, vMove);
        context.drawImage(image,
            0, split - i, width, 2,
            0, split - i, width, 2);

        context.setTransform(
            hScale,
            -vSkew, hSkew,
            vScale,
            hMove, vMove);
        context.drawImage(image,
            0, split + i, width, 2,
            0, split + i, width, 2);
    }



    anim(animate);
};
image.src = "http://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Tulip_with_variegated_colors.jpg/360px-Tulip_with_variegated_colors.jpg";
