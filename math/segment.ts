
/// <reference path="./references.ts" />

import IRanged = require('./interfaces/IRanged');
import ISerializable = require('./interfaces/ISerializable');
import IEquality = require('./interfaces/IEquality');

import Vector = require('./vector');
import Ramp = require('./ramp');


module Segment {
  export class SegmentBase implements ISerializable, IRanged, IEquality<SegmentBase> {

    public get Base(): Vector.VectorBase {
      return this._base;
    }
    public get Tip(): Vector.VectorBase {
      return this._tip;
    }
    public get TipWithoutBase(): Vector.VectorBase {
      return Vector.VectorBase.Subtract(this._tip, this._base);
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

    constructor(protected _base: Vector.VectorBase,
      protected _tip: Vector.VectorBase,
      r: Ramp|string = null) {
      if (!this._base || !this._tip ||
        (this._base.Dimension != this._tip.Dimension)) {
        throw 'Dimension Mismatch';
      }
      var tempRamp = Ramp.Build(r);
      //force the new ramp to conform to the 0,1 0,1 to handle
      // scaling along segment and fraction to give to each end
      this._ramp = new Ramp(tempRamp.Type, 0, 1, 0, 1);
    }


    public DistanceTo = (v: Vector.VectorBase): number => {
      return SegmentBase.DistanceToStatic(this, v);
    };
    public IntensityAt = (v: Vector.VectorBase): number => {
      var fraction = this.closestFraction(v);
      fraction = this.Ramp.ValueAt(fraction);
      var range = this.DistanceTo(v);
      var intensity = Ramp.Mix(this.Base.Ramp, this.Tip.Ramp, fraction, range);
      return intensity;
    };
    public ClosestVector = (v: Vector.VectorBase): Vector.VectorBase => {
      var t = this.closestFraction(v);
      var newSegment = this.Scale(t);
      return newSegment.Tip.Clone();
    };
    private closestFraction = (v: Vector.VectorBase): number => {
      SegmentBase.DimensionCheck(this, v);
      var length = this.Length;
      if (length < 0.001) return 0;

      var vWithoutBase = Vector.VectorBase.Subtract(v, this.Base);
      var t = Vector.VectorBase.Dot(vWithoutBase, this.TipWithoutBase) / (length * length);
      return Math.max(0, Math.min(1, t));
    }
    public RestoreBase = (v: Vector.VectorBase): Vector.VectorBase => {
      return Vector.VectorBase.Add(this.Base, v);
    }
    public Push = (v: Vector.VectorBase): SegmentBase => {
      return SegmentBase.Push(this, v);
    }
    public Scale = (factor: number): SegmentBase => {
      return SegmentBase.Scale(this, factor);
    }
    public Equal = (s: SegmentBase): boolean => {
      return SegmentBase.EqualStatic(this, s);
    }

    public static EqualStatic = (s: SegmentBase, s2: SegmentBase): boolean => {
      if (!s.Tip.Equal(s2.Tip)) return false;
      if (!s.Base.Equal(s2.Base)) return false;
      if (!s.Ramp.Equal(s2.Ramp)) return false;
      return true;
    }
    public static Scale = (s: SegmentBase, factor: number): SegmentBase => {
      var newTip = s.RestoreBase(
        Vector.VectorBase.Scale(s.TipWithoutBase, factor))
      return new SegmentBase(s.Base.Clone(), newTip);
    }
    public static Push = (s: SegmentBase, v: Vector.VectorBase): SegmentBase => {
      if (s.Dimension != v.Dimension) throw 'Dimension Mismatch';
      return new SegmentBase(Vector.VectorBase.Add(s.Base, v), Vector.VectorBase.Add(s.Tip, v));
    }
    public static DistanceToStatic = (s: SegmentBase, v: Vector.VectorBase): number => {
      SegmentBase.DimensionCheck(s, v);
      var vOnSegment = s.ClosestVector(v);
      return vOnSegment.DistanceTo(v);
    }

    public ToObj = (): any => {
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


    private static DimensionCheck = (s: SegmentBase, v: Vector.VectorBase): boolean => {
      if (s.Dimension != v.Dimension)
        throw 'Dimension Mismatch';
      return true;
    }


    public static FromObj = (obj: any): SegmentBase => {
      switch (obj.t) {
        case 2:
          return new Segment2(Vector.Vector2.FromObj(obj.b),
            Vector.Vector2.FromObj(obj.e),
            Ramp.FromObj(obj.r));
        case 3:
          return new Segment3(Vector.Vector3.FromObj(obj.b),
            Vector.Vector3.FromObj(obj.e),
            Ramp.FromObj(obj.r));
        case 4:
          return new Segment4(Vector.Vector4.FromObj(obj.b),
            Vector.Vector4.FromObj(obj.e),
            Ramp.FromObj(obj.r));
      }

      //default untyped
      return new SegmentBase(Vector.VectorBase.FromObj(obj.b),
        Vector.VectorBase.FromObj(obj.e),
        Ramp.FromObj(obj.r));
    }
    public static FromStr = (str: string): SegmentBase => {
      return SegmentBase.FromObj(JSON.parse(str));
    }
  }


  export class Segment2 extends SegmentBase {
    public get Base(): Vector.Vector2 {
      return <Vector.Vector2>this._base;
    }
    public get Tip(): Vector.Vector2 {
      return <Vector.Vector2>this._tip;
    }

    constructor(base: Vector.Vector2, tip: Vector.Vector2, r: Ramp|string = null) {
      super(base, tip, r);
    }
    public Push = (v: Vector.Vector2): Segment2 => {
      return Segment2.Push(this, v);
    }
    public static Push = (s: Segment2, v: Vector.Vector2): Segment2 => {
      return <Segment2>SegmentBase.Push(s, v);
    }
  }

  export class Segment3 extends SegmentBase {
    public get Base(): Vector.Vector3 {
      return <Vector.Vector3>this._base;
    }
    public get Tip(): Vector.Vector3 {
      return <Vector.Vector3>this._tip;
    }
    public get TipWithoutBase(): Vector.VectorBase {
      return Vector.VectorBase.Subtract(this._tip, this._base);
    }

    constructor(base: Vector.Vector3, tip: Vector.Vector3, r: Ramp|string = null) {
      super(base, tip, r);
    }
    public Push = (v: Vector.Vector3): Segment3 => {
      return Segment3.Push(this, v);
    }
    public static Push = (s: Segment3, v: Vector.Vector3): Segment3 => {
      return <Segment3>SegmentBase.Push(s, v);
    }
    public static Cross = (sA: Segment3, sB: Segment3): Segment3 => {
      var aTip = Vector.Vector3.Cast(sA.TipWithoutBase.Clone());
      var bTip = Vector.Vector3.Cast(sB.TipWithoutBase.Clone());
      var cross = aTip.Cross(bTip);
      var newTip = Vector.Vector3.Cast(sA.RestoreBase(cross));
      return new Segment3(Vector.Vector3.Cast(sA.Base), newTip);
    }
  }




  export class Segment4 extends SegmentBase {
    public get Base(): Vector.Vector4 {
      return <Vector.Vector4>this._base;
    }
    public get Tip(): Vector.Vector4 {
      return <Vector.Vector4>this._tip;
    }
    constructor(base: Vector.Vector4, tip: Vector.Vector4, r: Ramp|string = null) {
      super(base, tip, r);
    }
    public Push = (v: Vector.Vector4): Segment4 => {
      return Segment4.Push(this, v);
    }
    public static Push = (s: Segment4, v: Vector.Vector4): Segment4 => {
      return <Segment4>SegmentBase.Push(s, v);
    }
  }




  export class SegmentSet implements
    IRanged, IEquality<SegmentSet>, ISerializable {

    private _dimension: number = 0;
    public get Dimension(): number {
      return this._dimension;
    }

    constructor(private segments: Array<SegmentBase>) {
      if ((segments === void 0) || segments.length < 1)
        throw 'Dimension Mismatch';
      this._dimension = segments[0].Dimension;

      // Ensure all dimensions match
      for (var i = 0; i < this.segments.length; i++) {
        if (segments[i].Dimension != this._dimension) {
          throw 'Dimension Mismatch';
        }
      }
    }

    public DistanceTo = (v: Vector.VectorBase): number => {
      return this.closestVectorDistance(v)[1];
    }
    public IntensityAt = (v: Vector.VectorBase): number => {
      return this.closestVectorIntensity(v)[1];
    }
    public ClosestVector = (v: Vector.VectorBase): Vector.VectorBase => {
      return this.closestVectorDistance(v)[0];
    }

    public Clone = (): SegmentSet => {
      return SegmentSet.CloneStatic(this);
    }
    public Equal = (ss: SegmentSet): boolean => {
      return SegmentSet.EqualStatic(this, ss);
    }
    public ToObj = (): any => {
      return {
        s: this.segments.map((s: SegmentBase): any=> { return s.ToObj(); })
      };
    }
    public ToStr = (): string => {
      return JSON.stringify(this.ToObj());
    }

    public static FromObj = (obj: any): SegmentSet => {
      var segs = obj.s.map((s: any): SegmentBase=> {
        return SegmentBase.FromObj(s);
      });
      return new SegmentSet(segs);
    }

    public static FromStr = (str: string): SegmentSet => {
      return SegmentSet.FromObj(JSON.parse(str));
    }

    public static CloneStatic = (ss: SegmentSet): SegmentSet => {
      return SegmentSet.FromObj(ss.ToObj());
    }

    public static EqualStatic = (ssA: SegmentSet, ssB: SegmentSet): boolean => {
      if (ssA.segments.length != ssB.segments.length) return false;
      for (var i = 0; i < ssA.segments.length; i++) {
        if (!ssA.segments[i].Equal(ssB.segments[i])) return false;
      }
      return true;
    }

    public static Merge = (ssA: SegmentSet, ssB: SegmentSet): SegmentSet => {
      if (ssA.Dimension != ssB.Dimension) throw 'Dimension Mismatch';
      return new SegmentSet(ssA.segments.concat(ssB.segments));
    }

    protected closestVectorDistance = (v: Vector.VectorBase): [Vector.VectorBase, number]=> {
      var closestVectorFound = null;
      var closestDistance = Number.MAX_VALUE;

      for (var i = 0; i < this.segments.length; i++) {
        var computedVector = this.segments[i].ClosestVector(v);
        var computedDistance = this.segments[i].DistanceTo(v);
        if (closestVectorFound == null || computedDistance < closestDistance) {
          closestVectorFound = computedVector;
          closestDistance = computedDistance;
        }
      }
      return [closestVectorFound, closestDistance];
    }
    protected closestVectorIntensity = (v: Vector.VectorBase): [Vector.VectorBase, number]=> {
      var bestVectorFound = null;
      var highestIntensity = Number.MIN_VALUE;

      for (var i = 0; i < this.segments.length; i++) {
        var highestVector = this.segments[i].ClosestVector(v);
        var computedIntensity = this.segments[i].IntensityAt(v);
        if (bestVectorFound == null || computedIntensity > highestIntensity) {
          bestVectorFound = highestVector;
          highestIntensity = computedIntensity;
        }
      }
      return [bestVectorFound, highestIntensity];
    }
  }

}

export = Segment;
