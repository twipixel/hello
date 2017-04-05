import Vector3D from '../geom/Vector3D';


export default class Camera
{
    constructor()
    {
        /**
         * 카메라 위치
         * @type {Vector3D}
         */
        this.position = new Vector3D(0, 0, 20);

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
    }
}