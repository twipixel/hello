export default class Vector3D
{
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 벡터 곱
     * @param v1
     * @param v2
     * @returns {Vector3D}
     */
    static cross(v1, v2)
    {
        let x = v1.y * v2.z - v1.z * v2.y;
        let y = v1.z * v2.x - v1.x * v2.z;
        let z = v1.x * v2.y - v1.y * v2.x;
        return new Vector3D(x, y, z);
    }

    /**
     * dot product 내적
     * @param v1
     * @param v2
     * @returns {number}
     */
    static dot(v1, v2)
    {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
    }

    /**
     * 변환된 좌표 반환
     * @param point {Vector3D} 버텍스
     * @param transform {Matrix} 최종 변환 메트릭스
     * @returns {Vector3D}
     */
    static transformCoordinates(point, transform)
    {
        let x = point.x * transform.m[0] + point.y * transform.m[4] + point.z * transform.m[8] + transform.m[12];
        let y = point.x * transform.m[1] + point.y * transform.m[5] + point.z * transform.m[9] + transform.m[13];
        let z = point.x * transform.m[2] + point.y * transform.m[6] + point.z * transform.m[10] + transform.m[14];
        let w = point.x * transform.m[3] + point.y * transform.m[7] + point.z * transform.m[11] + transform.m[15];
        return new Vector3D(x / w, y / w, z / w);
    }

    mag()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * 거리
     * @param v
     * @returns {number}
     */
    distance(v)
    {
        return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y) + (this.z - v.z) * (this.z - v.z));
    }

    /**
     * 더하기
     * @param v
     * @returns {Vector3D}
     */
    add(v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    /**
     * 빼기
     * @param v2
     * @returns {Vector3D}
     */
    subtract(v2)
    {
        this.x = this.x - v2.x;
        this.y = this.y - v2.y;
        this.z = this.z - v2.z;
        return new Vector3D(this.x, this.y, this.z);
    }

    multiply(n)
    {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    divide(n)
    {
        if (n != 0) {
            this.multiply(1 / n);
        }
        return this;
    }

    /**
     * 벡터의 길이
     * @returns {number}
     */
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * 방향은 그대로 유지되는 길이가 1인 벡터를 반환합니다. (단위벡터)
     * @returns {Vector3D}
     */
    normalize()
    {
        let len = this.length();
        let ilen = 1 / len;
        return new Vector3D(this.x * ilen, this.y * ilen, this.z * ilen);
    }

    static normalize(vec)
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

    clone ()
    {
        return new Vector3(this.x, this.y, this.z);
    }
}