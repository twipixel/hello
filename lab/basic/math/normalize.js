export function normalize(vec)
{
    var mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

    // avoid dividing by zero
    if (mag === 0) {
        return Array.apply(null, new Array(vec.length)).map(Number.prototype.valueOf, 0)
    }

    vec.x /= mag;
    vec.y /= mag;
    vec.z /= mag;

    return vec;
}