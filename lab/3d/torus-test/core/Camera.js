import Vector3D from '../geom/Vector3D';


export default class Camera
{
    constructor(x = 0, y = 0, z = 0)
    {
        /**
         * 카메라 위치
         * @type {Vector3D}
         */
        this.position = new Vector3D(x, y, z);

        /**
         * 카메라 주시점
         * @type {Vector3D}
         */
        this.target = new Vector3D(0, 0, 0);

        /**
         * 월드의 윗쪽
         * @type {Vector3D}
         */
        this.up = new Vector3D(0, 1, 0);

        /**
         * 카메라 회전 추가 테스트
         * @type {Vector3D}
         */
        this.rotation = new Vector3D(0, 0, 0);

        // this._yaw = 0;
        // this._roll = 0;
        // this._pitch = 0;
    }

    /*set rotationX(degrees)
    {
        this.rotation.x = Math.toRadians(degrees);
    }

    get rotationX()
    {
        return Math.toDegrees(this.rotation.x);
    }

    set rotationY(degrees)
    {
        this.rotation.y = Math.toRadians(degrees);
    }

    get rotationY()
    {
        return Math.toDegrees(this.rotation.y);
    }

    set rotationZ(degrees)
    {
        this.rotation.z = Math.toRadians(degrees);
    }

    get rotationZ()
    {
        return Math.toDegrees(this.rotation.z);
    }

    set yaw(degrees)
    {
        this._yaw = Math.toRadians(degrees);
    }

    get yaw()
    {
        return Math.toDegrees(this._yaw);
    }

    set roll(degrees)
    {
        this._roll = Math.toRadians(degrees);
    }

    get roll()
    {
        return Math.toDegrees(this._roll);
    }

    set pitch(degrees)
    {
        this._pitch = Math.toRadians(degrees);
    }

    get pitch()
    {
        return Math.toDegrees(this._pitch);
    }*/
}