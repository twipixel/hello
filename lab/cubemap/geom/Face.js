export default class Face
{
    /**
     * Vertex 의 인덱스 넣습니다.
     * @param v0
     * @param v1
     * @param v2
     */
    constructor(v0 = 0, v1 = 0, v2 = 0, color = 0xFFFFFF, alpha = 1, img = null)
    {
        this._v0 = this.A = v0;
        this._v1 = this.B = v1;
        this._v2 = this.C = v2;
        this.color = color;
        this.alpha = alpha;
        this.img = img;
    }

    set v0(value)
    {
        this._v0 = this.A = value;
    }

    get v0()
    {
        return this._v0;
    }

    set v1(value)
    {
        this._v1 = this.B = value;
    }

    get v1()
    {
        return this._v1;
    }

    set v2(value)
    {
        this._v2 = this.C = value;
    }

    get v2()
    {
        return this._v2;
    }

    clone()
    {
        return new Face(this.v0, this.v1, this.v2, this.color, this.alpha, this.img);
    }
}
