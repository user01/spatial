
/// <reference path="./references.ts" />

import * as Ramp from './ramp';

import IRanged from './interfaces/iranged';
import ISerializable from './interfaces/iserializable';
import IEquality from './interfaces/iequality';


export class VectorBase implements IRanged, ISerializable, IEquality<VectorBase> {

  public get Values(): Array<number> { return this._values; }
  public get Dimension(): number { return this._values.length; }
  /** How the value responds over time and distance from the vector */
  public get Factor(): Ramp.Factor { return this._factor; }

  constructor(protected _values: Array<number>,
    private _factor: Ramp.Factor = Ramp.Factor.PermanentFactor()
  ) {
    if (this._values.length < 1 || this._values.length > 4) {
      throw 'Dimension Mismatch';
    }
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
      f: this.Factor.ToObj()
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
    return new VectorBase(obj.v, Ramp.Factor.FromObj(obj.f));
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
  public IntensityAtDistance = (v: VectorBase): number => {
    return this.Factor.IntensityAtDistance(this.DistanceTo(v));
  };
  /** Intensity against time */
  public IntensityAtTime = (originTime: moment.Moment, currentTime: moment.Moment): number => {
    return this.Factor.IntensityAtTime(originTime, currentTime);
  }
  /** Intensity based on duration */
  public IntensityAtDuration = (d: moment.Duration): number => {
    return this.Factor.IntensityAtDuration(d);
  }
  /** Intensity based on distance and time */
  public IntensityAtDistanceAndTime = (v: VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number => {
    return this.Factor.IntensityAtDistanceAndTime(this.DistanceTo(v), originTime, currentTime);
  }
  /** Intensity based on distance and duration */
  public IntensityAtDistanceAndDuration = (v: VectorBase, d: moment.Duration): number => {
    return this.Factor.IntensityAtDistanceAndDuration(this.DistanceTo(v), d);
  }

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
    switch (v1.Dimension) {
      case 2:
        return new Vector2(v1.Values[0], v1.Values[1], v1.Factor.Clone());
      case 3:
        return new Vector3(v1.Values[0], v1.Values[1], v1.Values[2], v1.Factor.Clone());
      case 4:
        return new Vector4(v1.Values[0], v1.Values[1], v1.Values[2], v1.Values[3], v1.Factor.Clone());
      default:
        throw 'Invalid Vector to Clone';
    }
  }

  public static Add = (v1: VectorBase, v2: VectorBase): VectorBase => {
    VectorBase.DimensionCheck(v1, v2);
    var values: Array<number> = new Array<number>();
    for (var i = 0; i < v1.Dimension; i++)
      values.push(v1.Values[i] + v2.Values[i]);
    return new VectorBase(values, v1.Factor);
  }

  public static Subtract = (v1: VectorBase, v2: VectorBase): VectorBase => {
    VectorBase.DimensionCheck(v1, v2);
    var values: Array<number> = new Array<number>();
    for (var i = 0; i < v1.Dimension; i++)
      values.push(v1.Values[i] - v2.Values[i]);
    return new VectorBase(values, v1.Factor);
  }

  public static Scale = (v1: VectorBase, factor: number): VectorBase => {
    var values: Array<number> = new Array<number>();
    for (var i = 0; i < v1.Dimension; i++)
      values.push(v1.Values[i] * factor);
    return new VectorBase(values, v1.Factor);
  }

  public static Negate = (v1: VectorBase): VectorBase => {
    return VectorBase.Scale(v1, -1);
  }

  public static EqualStatic = (v1: VectorBase, v2: VectorBase): boolean => {
    if (v1.Dimension != v2.Dimension) return false;
    if (!v1.Factor.Equal(v2.Factor)) return false;
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

  constructor(_x: number, _y: number, factor: Ramp.Factor = Ramp.Factor.PermanentFactor()) {
    super([_x, _y], factor);
  }

  public static FromObj = (obj: any): Vector2 => {
    return new Vector2(obj.v[0], obj.v[1], Ramp.Factor.FromObj(obj.f));
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

  constructor(_x: number, _y: number, _z: number, factor: Ramp.Factor = Ramp.Factor.PermanentFactor()) {
    super([_x, _y, _z], factor);
  }

  public Cross = (vOther: Vector3): Vector3 => {
    return Vector3.CrossStatic(this, vOther);
  }

  public static CrossStatic = (vA: Vector3, vB: Vector3): Vector3 => {
    var x = vA.y * vB.z - vA.z * vB.y;
    var y = vA.z * vB.x - vA.x * vB.z;
    var z = vA.x * vB.y - vA.y * vB.x;
    return new Vector3(x, y, z, vA.Factor);
  }
  public static Cast = (v: VectorBase): Vector3 => {
    if (v.Values.length != 3) throw 'Dimension Mismatch';
    return new Vector3(v.Values[0], v.Values[1], v.Values[2], v.Factor);
  }

  public static FromObj = (obj: any): Vector3 => {
    return new Vector3(obj.v[0], obj.v[1], obj.v[2], Ramp.Factor.FromObj(obj.f));
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

  constructor(_x: number, _y: number, _z: number, _w: number, factor: Ramp.Factor = Ramp.Factor.PermanentFactor()) {
    super([_x, _y, _z, _w], factor);
  }

  public static FromObj = (obj: any): Vector4 => {
    return new Vector4(obj.v[0], obj.v[1], obj.v[2], obj.v[3], Ramp.Factor.FromObj(obj.f));
  }
  public static FromStr = (str: string): Vector4 => {
    return Vector4.FromObj(JSON.parse(str));
  }
  public static Build = (values: Array<number>): Vector4 => {
    if (values.length != 4) throw 'Dimension Mismatch';
    return new Vector4(values[0], values[1], values[2], values[3]);
  }
}



export default Vector2;