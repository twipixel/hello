import Face from '../geom/Face';
import Vector3D from '../geom/Vector3D';


export default class ProceduralSphere
{
    /**
     * UV Sphere
     * http://codepen.io/mcdorli/pen/NAByWV
     * @param latitudeCount {int} horizontal (위도) 좌우로 그려진 선
     * @param longitude {int} vertical (경도) 상하로 그려진 선
     */
    constructor(radius = 1, latitudeCount = 12, longitudeCount = 12)
    {
        var faces = this.faces = [];
        var vertices = this.vertices = [];

        var alpha = 0.5;
        var color = 0x87D37C;

        for (var y = 0; y < longitudeCount; y++) {
            for (var x = 0; x < latitudeCount; x++) {
                var angleX = 2 * Math.PI / latitudeCount * x;
                var angleY = 2 * Math.PI / longitudeCount * y;
                var xx = radius * Math.sin(angleY) * Math.cos(angleX);
                var yy = radius * Math.sin(angleY) * Math.sin(angleX);
                var zz = radius * Math.cos(angleY);
                vertices.push(new Vector3D(xx, yy, zz));
            }
        }

        // Create the quads between the vertices
        for (var x = 0; x < latitudeCount; x++) {
            for (var y = 0; y < longitudeCount; y++) {
                var l = x;                         // left
                var r = (x + 1) % latitudeCount;   // right
                var t = y;                         // top
                var b = (y + 1) % longitudeCount;  // bottom
                faces.push(
                    new Face(
                        l + b * latitudeCount,
                        r + b * latitudeCount,
                        l + t * latitudeCount,
                        color, alpha
                    )
                );
            }
        }
    }
}
