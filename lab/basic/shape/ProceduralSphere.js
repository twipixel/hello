import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';
import Icosaherdron from './Icosahedron';


export default class ProceduralSphere
{
    /**
     *
     * @param horizontal {int} latitude
     * @param vertical {int} longitude
     */
    constructor(horizontal = 4, vertical = 4)
    {
        this.horizontal = horizontal;
        this.vertical = vertical;

        for (var i = 0; i < horizontal; i++) {
            for (var j = 0; j < vertical; j++) {

            }
        }
    }
}
