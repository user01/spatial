
/// <reference path="../references.ts" />


module Spatial {



  export class Vector4 extends Vector {

    public get x(): number {
      return this._values[0];
    }
    public get y(): number {
      return this._values[1];
    }
    public get z(): number {
      return this._values[2];
    }
    public get w(): number {
      return this._values[3];
    }

    constructor(_x: number, _y: number, _z: number, _w: number, _ramp: string|Ramp = null) {
      super([_x, _y, _z, _w], _ramp);
    }

    public static FromObj = (obj: any): Vector4 => {
      return new Vector4(obj.v[0], obj.v[1], obj.v[2], obj.v[3], Ramp.FromObj(obj.r));
    }
    public static FromStr = (str: string): Vector4 => {
      return Vector4.FromObj(JSON.parse(str));
    }
    public static Build = (values: Array<number>): Vector4 => {
      if (values.length != 4) throw new RangeException();
      return new Vector4(values[0], values[1], values[2], values[3]);
    }
  }

}
