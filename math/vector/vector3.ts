
/// <reference path="../references.ts" />


module Spatial {



  export class Vector3 extends Vector {
    public get x(): number {
      return this._values[0];
    }
    public get y(): number {
      return this._values[1];
    }
    public get z(): number {
      return this._values[2];
    }

    constructor(_x: number, _y: number, _z: number, _ramp: string|Ramp = null) {
      super([_x, _y, _z], _ramp);
    }

    public Cross = (vOther: Vector3): Vector3 => {
      return Vector3.CrossStatic(this, vOther);
    }

    public static CrossStatic = (vA: Vector3, vB: Vector3): Vector3 => {
      var x = vA.y * vB.z - vA.z * vB.y;
      var y = vA.z * vB.x - vA.x * vB.z;
      var z = vA.x * vB.y - vA.y * vB.x;
      return new Vector3(x, y, z, vA.Ramp.Clone());
    }
    public static Cast = (v: Vector): Vector3 => {
      if (v.Values.length != 3) throw new RangeException();
      return new Vector3(v.Values[0], v.Values[1], v.Values[2], v.Ramp);
    }

    public static FromObj = (obj: any): Vector3 => {
      return new Vector3(obj.v[0], obj.v[1], obj.v[2], Ramp.FromObj(obj.r));
    }
    public static FromStr = (str: string): Vector3 => {
      return Vector3.FromObj(JSON.parse(str));
    }
    public static Build = (values: Array<number>): Vector3 => {
      if (values.length != 3) throw new RangeException();
      return new Vector3(values[0], values[1], values[2]);
    }
  }
}
