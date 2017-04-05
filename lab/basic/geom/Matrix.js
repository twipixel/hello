import Vector3D from './Vector3D';


export default class Matrix
{
    /**
     * 4x4 행렬
     */
    constructor()
    {
        this.m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    /**
     * 왼손 좌표계 뷰 행렬로 반환 (카메라 객체를 넘겨도 될 것 같다)
     * @param camPosition 카메라의 위치
     * @param camTarget 카메라의 주시점
     * @param upVector 월드의 윗쪽
     * @returns {Matrix}
     */
    static lookAtLH(camPosition, camTarget, upVector)
    {
        let result = new Matrix();
        let zAxis = (camTarget.subtract(camPosition)).normalize();
        let xAxis = (Vector3D.cross(upVector, zAxis)).normalize();
        let yAxis = (Vector3D.cross(zAxis, xAxis)).normalize();
        let px = -Vector3D.dot(xAxis, camPosition);
        let py = -Vector3D.dot(yAxis, camPosition);
        let pz = -Vector3D.dot(zAxis, camPosition);
        result.m[0] = xAxis.x, result.m[1] = yAxis.x, result.m[2] = zAxis.x, result.m[3] = 0;
        result.m[4] = xAxis.y, result.m[5] = yAxis.y, result.m[6] = zAxis.y, result.m[7] = 0;
        result.m[8] = xAxis.z, result.m[9] = yAxis.z, result.m[10] = zAxis.z, result.m[11] = 0;
        result.m[12] = px;
        result.m[13] = py;
        result.m[14] = pz;
        result.m[15] = 1;
        return result;
    }

    /**
     * 투영 변환 설정
     * @param fov {Radians} Field Of View
     * @param aspect {number} 가로 세로 비율 (폭 / 높이)
     * @param znear 카메라에 가까운 뷰면의 클리핑 z (0 에서 1사이의 값, UV 맵)
     * @param zfar 카마라에서 먼 뷰면의 z (0 에서 1사이의 값, UV 맵)
     * @returns {Matrix}
     */
    static perspectiveFovLH(fov, aspect, znear, zfar)
    {
        let result = new Matrix();
        let tan = 1 / (Math.tan(fov * 0.5));
        result.m[0] = tan / aspect;
        result.m[5] = tan;
        result.m[10] = -zfar / (znear - zfar);
        result.m[11] = 1;
        result.m[14] = (znear * zfar) / (znear - zfar);
        result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[12] = result.m[13] = result.m[15] = 0;
        return result;
    }

    /**
     * 이동 변환
     * @param x
     * @param y
     * @param z
     * @returns {Matrix}
     */
    static translation(x, y, z)
    {
        let result = new Matrix();
        result.m[0] = result.m[5] = result.m[10] = result.m[15] = 1;
        result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[11] = 0;
        result.m[12] = x;
        result.m[13] = y;
        result.m[14] = z;
        return result;
    }

    /**
     * Yaw, Pitch, Roll
     * @param yaw
     * @param pitch
     * @param roll
     * @returns {Matrix}
     */
    static rotationYPR(yaw, pitch, roll)
    {
        return Matrix.rotateZ(roll).multiply(Matrix.rotateX(pitch)).multiply(Matrix.rotateY(yaw));
    }

    /**
     * X축 회전
     * @param theta
     * @returns {Matrix}
     */
    static rotateX(theta)
    {
        let result = new Matrix();
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        result.m[5] = result.m[10] = cos;
        result.m[9] = -sin;
        result.m[0] = result.m[15] = 1;
        result.m[6] = sin;
        result.m[1] = result.m[2] = result.m[3] = result.m[4] = result.m[7] = result.m[8] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
        return result;
    }

    /**
     * Y축 회전
     * @param theta
     * @returns {Matrix}
     */
    static rotateY(theta)
    {
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

    /**
     * Z축 회전
     * @param theta
     * @returns {Matrix}
     */
    static rotateZ(theta)
    {
        let result = new Matrix();
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        result.m[0] = result.m[5] = cos;
        result.m[4] = -sin;
        result.m[1] = sin;
        result.m[2] = result.m[3] = result.m[6] = result.m[7] = result.m[8] = result.m[9] = result.m[11] = result.m[12] = result.m[13] = result.m[14] = 0;
        result.m[10] = result.m[15] = 1;
        return result;
    }

    /**
     * 곱
     * @param other
     * @returns {Matrix}
     */
    multiply(other)
    {
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
    }
}