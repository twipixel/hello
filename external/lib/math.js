Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;

Math.toRadians = function (degrees) {
    return degrees * Math.DEG_TO_RAD;
};

Math.toDegrees = function (radians) {
    return radians * Math.RAD_TO_DEG;
};