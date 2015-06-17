
/// <reference path="../references.ts" />

module Spatial {
  export class Segment implements ISerializable, IRanged, IEquality<Segment> {

    public get Base(): Vector {
      return this._base;
    }
    public get Tip(): Vector {
      return this._tip;
    }
    public get TipWithoutBase(): Vector {
      return Vector.Subtract(this._tip, this._base);
    }
    public get Length(): number {
      return this._base.DistanceTo(this._tip);
    }
    public get Dimension(): number {
      return this._tip.Dimension;
    }
    protected _ramp: Ramp;
    public get Ramp(): Ramp {
      return this._ramp;
    }

    constructor(protected _base: Vector,
      protected _tip: Vector,
      r: Ramp|string = null) {
      if (!this._base || !this._tip ||
        (this._base.Dimension != this._tip.Dimension)) {
        throw new RangeException();
      }
      var tempRamp = Ramp.Build(r);
      //force the new ramp to conform to the 0,1 0,1 to handle
      // scaling along segment and fraction to give to each end
      this._ramp = new Ramp(tempRamp.Type, 0, 1, 0, 1);
    }


    public DistanceTo = (v: Vector): number => {
      return Segment.DistanceToStatic(this, v);
    };
    public IntensityAt = (v: Vector): number => {
      var fraction = this.closestFraction(v);
      fraction = this.Ramp.ValueAt(fraction);
      var range = this.DistanceTo(v);
      var intensity = Ramp.Mix(this.Base.Ramp, this.Tip.Ramp, fraction, range);
      return intensity;
    };
    public ClosestVector = (v: Vector): Vector => {
      var t = this.closestFraction(v);
      var newSegment = this.Scale(t);
      return newSegment.Tip.Clone();
    };
    private closestFraction = (v: Vector): number => {
      Segment.DimensionCheck(this, v);
      var length = this.Length;
      if (length < 0.001) return 0;

      var vWithoutBase = Vector.Subtract(v, this.Base);
      var t = Vector.Dot(vWithoutBase, this.TipWithoutBase) / (length * length);
      return Math.max(0, Math.min(1, t));
    }
    public RestoreBase = (v: Vector): Vector => {
      return Vector.Add(this.Base, v);
    }
    public Push = (v: Vector): Segment => {
      return Segment.Push(this, v);
    }
    public Scale = (factor: number): Segment => {
      return Segment.Scale(this, factor);
    }
    public Equal(s: Segment): boolean {
      return Segment.EqualStatic(this, s);
    }

    public static EqualStatic = (s: Segment, s2: Segment): boolean => {
      if (!s.Tip.Equal(s2.Tip)) return false;
      if (!s.Base.Equal(s2.Base)) return false;
      if (!s.Ramp.Equal(s2.Ramp)) return false;
      return true;
    }
    public static Scale = (s: Segment, factor: number): Segment => {
      var newTip = s.RestoreBase(
        Vector.Scale(s.TipWithoutBase, factor))
      return new Segment(s.Base.Clone(), newTip);
    }
    public static Push = (s: Segment, v: Vector): Segment => {
      if (s.Dimension != v.Dimension) throw new RangeException();
      return new Segment(Vector.Add(s.Base, v), Vector.Add(s.Tip, v));
    }
    public static DistanceToStatic = (s: Segment, v: Vector): number => {
      Segment.DimensionCheck(s, v);
      var vOnSegment = s.ClosestVector(v);
      return vOnSegment.DistanceTo(v);
    }

    public ToObj(): any {
      return {
        t: this.Dimension,
        b: this.Base.ToObj(),
        e: this.Tip.ToObj(),
        r: this.Ramp.ToObj()
      };
    }
    public ToStr = (): string => {
      return JSON.stringify(this.ToObj());
    }


    private static DimensionCheck = (s: Segment, v: Vector): boolean => {
      if (s.Dimension != v.Dimension)
        throw new RangeException();
      return true;
    }


    public static FromObj = (obj: any): Segment => {
      switch (obj.t) {
        case 2:
          return new Segment2(Vector2.FromObj(obj.b),
            Vector2.FromObj(obj.e),
            Ramp.FromObj(obj.r));
        case 3:
          return new Segment3(Vector3.FromObj(obj.b),
            Vector3.FromObj(obj.e),
            Ramp.FromObj(obj.r));
        case 4:
          return new Segment4(Vector4.FromObj(obj.b),
            Vector4.FromObj(obj.e),
            Ramp.FromObj(obj.r));
      }

      //default untyped
      return new Segment(Vector.FromObj(obj.b),
        Vector.FromObj(obj.e),
        Ramp.FromObj(obj.r));
    }
    public static FromStr = (str: string): Segment => {
      return Segment.FromObj(JSON.parse(str));
    }
  }


}
