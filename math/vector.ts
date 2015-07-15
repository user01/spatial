
/// <reference path="./references.ts" />

import Ramp = require('./ramp');

import IRanged = require('./interfaces/IRanged');
import ISerializable = require('./interfaces/ISerializable');
import IEquality = require('./interfaces/IEquality');


module Vector {
  export class VectorBase implements IRanged, ISerializable, IEquality<VectorBase> {
    protected _values: Float32Array;

    public get Values(): Float32Array {
      return this._values;
    }
    public get Dimension(): number {
      return this._values.length;
    }
    protected _ramp: Ramp;
    public get Ramp(): Ramp {
      return this._ramp;
    }

    constructor(valueSet: Array<number>, r: Ramp|string = null) {
      if (valueSet.length < 1 || valueSet.length > 4) {
        throw 'Dimension Mismatch';
      }
      this._ramp = Ramp.Build(r);
      this._values = new Float32Array(valueSet);
    }

    public Clone = (): VectorBase => {
      return VectorBase.CloneStatic(this);
    }

    public readableStr = (): string => {
      var str = 'V' + this.Dimension + '[';
      for (var i = 0; i < this._values.length; i++)
        str += this._values[i] + ',';
      return str + ']';
    }

    public ToObj(): any {
      return {
        t: this.Dimension,
        v: this._values,
        r: this.Ramp.ToObj()
      };
    }

    public ToStr = (): string => {
      return JSON.stringify(this.ToObj());
    }

    public static FromObj = (obj: any): VectorBase => {
      switch (obj.t) {
        case 2:
          return Vector2.FromObj(obj);
        case 3:
          return Vector3.FromObj(obj);
        case 4:
          return Vector4.FromObj(obj);
      }
      return new VectorBase(obj.v, Ramp.FromObj(obj.r));
    }

    public static FromStr = (str: string): VectorBase => {
      return VectorBase.FromObj(JSON.parse(str));
    }

    public Equal(v: VectorBase): boolean {
      return VectorBase.EqualStatic(this, v);
    }

    public DistanceTo(v: VectorBase): number {
      return VectorBase.DistanceToStatic(this, v);
    }
    public IntensityAt = (v: VectorBase): number => {
      return this.Ramp.ValueAt(this.DistanceTo(v));
    };
    public ClosestVector = (v: VectorBase): VectorBase => {
      return this.Clone();
    };

    public static DistanceToStatic = (v1: VectorBase, v2: VectorBase): number => {
      VectorBase.DimensionCheck(v1, v2);
      var total = 0;
      for (var i = 0; i < v1.Dimension; i++)
        total += (v1.Values[i] - v2.Values[i]) * (v1.Values[i] - v2.Values[i]);
      return Math.sqrt(total);
    }

    public static CloneStatic = (v1: VectorBase): VectorBase => {
      return VectorBase.FromObj(v1.ToObj());
    }

    public static Add = (v1: VectorBase, v2: VectorBase): VectorBase => {
      VectorBase.DimensionCheck(v1, v2);
      var values: Array<number> = new Array<number>();
      for (var i = 0; i < v1.Dimension; i++)
        values.push(v1.Values[i] + v2.Values[i]);
      return new VectorBase(values, v1.Ramp.ToStr());
    }

    public static Subtract = (v1: VectorBase, v2: VectorBase): VectorBase => {
      return VectorBase.Add(v1, VectorBase.Negate(v2));
    }

    public static Scale = (v1: VectorBase, factor: number): VectorBase => {
      var values: Array<number> = new Array<number>();
      for (var i = 0; i < v1.Dimension; i++)
        values.push(v1.Values[i] * factor);
      return new VectorBase(values, v1.Ramp.ToStr());
    }

    public static Negate = (v1: VectorBase): VectorBase => {
      return VectorBase.Scale(v1, -1);
    }

    public static EqualStatic = (v1: VectorBase, v2: VectorBase): boolean => {
      if (v1.Dimension != v2.Dimension) return false;
      if (!v1.Ramp.Equal(v2.Ramp)) return false;
      for (var i = 0; i < v1.Dimension; i++)
        //if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
        if (Math.abs(v1.Values[i] - v2.Values[i]) > 0.05)
          return false;
      return true;
    }

    public static Dot = (v1: VectorBase, v2: VectorBase): number => {
      VectorBase.DimensionCheck(v1, v2);
      var result: number = 0;
      for (var i = 0; i < v1.Dimension; i++)
        result += v1.Values[i] * v2.Values[i];
      return result;
    }


    private static DimensionCheck = (v1: VectorBase, v2: VectorBase): boolean => {
      if (v1.Dimension != v2.Dimension)
        throw 'Dimension Mismatch';
      return true;
    }

    protected static isArray = (arg) => {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  export class Vector2 extends VectorBase {
    public get x(): number {
      return this._values[0];
    }
    public get y(): number {
      return this._values[1];
    }

    constructor(_x: number, _y: number, _ramp: string|Ramp = null) {
      super([_x, _y], _ramp);
    }

    public static FromObj = (obj: any): Vector2 => {
      return new Vector2(obj.v[0], obj.v[1], Ramp.FromObj(obj.r));
    }
    public static FromStr = (str: string): Vector2 => {
      return Vector2.FromObj(JSON.parse(str));
    }
    public static Build = (values: Array<number>): Vector2 => {
      if (values.length != 2) throw 'Dimension Mismatch';
      return new Vector2(values[0], values[1]);
    }
  }


  export class Vector3 extends VectorBase {
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
    public static Cast = (v: VectorBase): Vector3 => {
      if (v.Values.length != 3) throw 'Dimension Mismatch';
      return new Vector3(v.Values[0], v.Values[1], v.Values[2], v.Ramp);
    }

    public static FromObj = (obj: any): Vector3 => {
      return new Vector3(obj.v[0], obj.v[1], obj.v[2], Ramp.FromObj(obj.r));
    }
    public static FromStr = (str: string): Vector3 => {
      return Vector3.FromObj(JSON.parse(str));
    }
    public static Build = (values: Array<number>): Vector3 => {
      if (values.length != 3) throw 'Dimension Mismatch';
      return new Vector3(values[0], values[1], values[2]);
    }
  }


  export class Vector4 extends VectorBase {

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
      if (values.length != 4) throw 'Dimension Mismatch';
      return new Vector4(values[0], values[1], values[2], values[3]);
    }
  }

}


export = Vector;