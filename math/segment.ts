
/// <reference path="./references.ts" />

import IRanged = require('./interfaces/IRanged');
import ISerializable = require('./interfaces/ISerializable');
import IEquality = require('./interfaces/IEquality');

import Vector = require('./vector');
import Ramp = require('./ramp');


module Segment {
  export class SegmentBase implements ISerializable, IRanged, IEquality<SegmentBase> {

    public get Base(): Vector.VectorBase { return this._base; }
    public get Tip(): Vector.VectorBase { return this._tip; }
    public get TipWithoutBase(): Vector.VectorBase { return Vector.VectorBase.Subtract(this._tip, this._base); }
    public get Length(): number { return this._base.DistanceTo(this._tip); }
    public get Dimension(): number { return this._tip.Dimension; }
    public get FalloffMix(): Ramp.Falloff { return this._falloff; }

    /** Longest duration for changes in decays */
    public get Duration(): moment.Duration {
      var baseDuration = this.Base.Factor.Decay.Duration;
      var tipDuration = this.Tip.Factor.Decay.Duration;
      return baseDuration.asMilliseconds() > tipDuration.asMilliseconds() ? baseDuration : tipDuration;
    }

    constructor(protected _base: Vector.VectorBase,
      protected _tip: Vector.VectorBase,
      protected _falloff: Ramp.Falloff) {
      if (!this._base || !this._tip ||
        (this._base.Dimension != this._tip.Dimension)) {
        throw 'Dimension Mismatch';
      }
      //force the new ramp to conform to the 0,1 0,1 to handle
      // scaling along segment and fraction to give to each end
      // var ramps = f.Ramps.map((ramp: Ramp.Ramp): Ramp.Ramp=> {
      //   return new Ramp.Ramp(ramp.Type, ramp.ValueStart, ramp.ValueEnd, 0, 1);
      // });
      // this._falloff = new Ramp.Falloff(ramps);
    }


    public DistanceTo = (v: Vector.VectorBase): number => {
      return SegmentBase.DistanceToStatic(this, v);
    }

    /** Intensity from segment, only via distance
     * Uses segment falloff to mix between base and tip intensity
     */
    public IntensityAtDistance(v: Vector.VectorBase): number {
      var fractionForIntensity = this.fractionBetweenBaseAndTip(v);

      var distanceToTarget = this.DistanceTo(v);
      var c1 = this.Base.Factor.IntensityAtDistance(distanceToTarget);
      var c2 = this.Tip.Factor.IntensityAtDistance(distanceToTarget);
      var intensity = SegmentBase.MixIntensity(c1, c2, fractionForIntensity);

      return intensity;
    }

    /** Intensity from segment, via distance and time difference */
    public IntensityAtDistanceAndTime(v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number {
      var fractionForIntensity = this.fractionBetweenBaseAndTip(v);

      var distanceToTarget = this.DistanceTo(v);
      var c1 = this.Base.Factor.IntensityAtDistanceAndTime(distanceToTarget, originTime, currentTime);
      var c2 = this.Tip.Factor.IntensityAtDistanceAndTime(distanceToTarget, originTime, currentTime);
      var intensity = SegmentBase.MixIntensity(c1, c2, fractionForIntensity);

      return intensity;
    }

    /** Intensity from segment, via distance and duration */
    public IntensityAtDistanceAndDuration(v: Vector.VectorBase, d: moment.Duration): number {
      var fractionForIntensity = this.fractionBetweenBaseAndTip(v);

      var distanceToTarget = this.DistanceTo(v);
      var c1 = this.Base.Factor.IntensityAtDistanceAndDuration(distanceToTarget, d);
      var c2 = this.Tip.Factor.IntensityAtDistanceAndDuration(distanceToTarget, d);
      var intensity = SegmentBase.MixIntensity(c1, c2, fractionForIntensity);

      return intensity;
    }

    /** Computes the fraction between base/tip using the Falloff Mix */
    private fractionBetweenBaseAndTip(v: Vector.VectorBase): number {
      // compute the fraction of segment, vs base to tip
      var fraction = this.closestFraction(v);
      fraction = SegmentBase.ForceToRange(0, 1, fraction);

      // adjust the fraction to match the range of the Falloff
      var fractionPositionInFalloff = fraction * (this.FalloffMix.RangeEnd - this.FalloffMix.RangeStart) + this.FalloffMix.RangeStart;

      // compute transition between base to tip
      var fractionFromFalloff = this.FalloffMix.ValueAt(fractionPositionInFalloff);
      // bind new fraction between 0 and 1, which can mix from base to tip
      var fractionForIntensity = SegmentBase.ForceToRange(0, 1, fractionFromFalloff);

      return fractionForIntensity;
    }

    public ClosestVector = (v: Vector.VectorBase): Vector.VectorBase => {
      var t = this.closestFraction(v);
      var newSegment = this.Scale(t);
      return newSegment.Tip.Clone();
    }
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

    /** Returns the value if 0<x<1, otherwise bind to the low, high */
    public static ForceToRange(low: number, high: number, value: number): number {
      return Math.min(1, Math.max(0, value));
    }

    /** Mix the Intensity of the base and tip, based on fraction */
    public static MixIntensity(baseIntensity: number, tipIntensity: number, fraction: number): number {
      return baseIntensity * (1 - fraction) + tipIntensity * fraction;
    }

    public static EqualStatic = (s: SegmentBase, s2: SegmentBase): boolean => {
      if (!s.Tip.Equal(s2.Tip)) return false;
      if (!s.Base.Equal(s2.Base)) return false;
      if (!s.FalloffMix.Equal(s2.FalloffMix)) return false;
      return true;
    }
    public static Scale = (s: SegmentBase, factor: number): SegmentBase => {
      var newTip = s.RestoreBase(
        Vector.VectorBase.Scale(s.TipWithoutBase, factor))
      return new SegmentBase(s.Base.Clone(), newTip, s.FalloffMix);
    }
    public static Push = (s: SegmentBase, v: Vector.VectorBase): SegmentBase => {
      if (s.Dimension != v.Dimension) throw 'Dimension Mismatch';
      return new SegmentBase(Vector.VectorBase.Add(s.Base, v), Vector.VectorBase.Add(s.Tip, v), s.FalloffMix);
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
        f: this.FalloffMix.ToObj()
      }
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
            Ramp.Falloff.FromObj(obj.f));
        case 3:
          return new Segment3(Vector.Vector3.FromObj(obj.b),
            Vector.Vector3.FromObj(obj.e),
            Ramp.Falloff.FromObj(obj.f));
        case 4:
          return new Segment4(Vector.Vector4.FromObj(obj.b),
            Vector.Vector4.FromObj(obj.e),
            Ramp.Falloff.FromObj(obj.f));
      }

      //default untyped
      return new SegmentBase(Vector.VectorBase.FromObj(obj.b),
        Vector.VectorBase.FromObj(obj.e),
        Ramp.Falloff.FromObj(obj.f));
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

    constructor(base: Vector.Vector2, tip: Vector.Vector2, falloff: Ramp.Falloff = Ramp.Falloff.LinearFalloff()) {
      super(base, tip, falloff);
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

    constructor(base: Vector.Vector3, tip: Vector.Vector3, falloff: Ramp.Falloff = Ramp.Falloff.LinearFalloff()) {
      super(base, tip, falloff);
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
    constructor(base: Vector.Vector4, tip: Vector.Vector4, falloff: Ramp.Falloff = Ramp.Falloff.LinearFalloff()) {
      super(base, tip, falloff);
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


    /** Longest duration for changes in segmentsets */
    public get Duration(): moment.Duration {
      var durations = this.segments.map((segmentBase: SegmentBase): moment.Duration => {
        return segmentBase.Duration;
      });

      return durations.reduce((accumulateDuration: moment.Duration, temporalDuration: moment.Duration): moment.Duration => {
        return accumulateDuration.asMilliseconds() > temporalDuration.asMilliseconds() ? accumulateDuration : temporalDuration;
      }, durations[0]);
    }

    /** Current segment sets */
    public get Segments(): Array<SegmentBase> {
      return this.segments;
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





    /** Intensity from segment, only via distance
     * Uses segment falloff to mix between base and tip intensity
     */
    public IntensityAtDistance(v: Vector.VectorBase): number {
      return this.closestVectorIntensityAtDistance(v)[1];
    }

    /** Intensity from segment, via distance and time difference */
    public IntensityAtDistanceAndTime(v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number {
      return this.closestVectorIntensityAtDistanceAndTime(v, originTime, currentTime)[1];
    }

    /** Intensity from segment, via distance and duration */
    public IntensityAtDistanceAndDuration(v: Vector.VectorBase, d: moment.Duration): number {
      return this.closestVectorIntensityAtDistanceAndDuration(v, d)[1];
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
      }
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
    protected closestVectorIntensityAtDistance = (v: Vector.VectorBase): [Vector.VectorBase, number]=> {
      return this.computeClosestVectorByCallback(v, (sb: SegmentBase): number=> {
        return sb.IntensityAtDistance(v);
      });;
    }

    protected closestVectorIntensityAtDistanceAndTime = (v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): [Vector.VectorBase, number]=> {
      return this.computeClosestVectorByCallback(v, (sb: SegmentBase): number=> {
        return sb.IntensityAtDistanceAndTime(v, originTime, currentTime);
      });;
    }

    protected closestVectorIntensityAtDistanceAndDuration = (v: Vector.VectorBase, d: moment.Duration): [Vector.VectorBase, number]=> {
      return this.computeClosestVectorByCallback(v, (sb: SegmentBase): number=> {
        return sb.IntensityAtDistanceAndDuration(v, d);
      });;
    }


    /**  */
    private computeClosestVectorByCallback = (v: Vector.VectorBase, cb: (sb: SegmentBase) => number): [Vector.VectorBase, number]=> {
      var bestVectorFound = null;
      var highestIntensity = Number.MIN_VALUE;
      var nonZerosFound = 0;
      var runningTotal = 0;

      for (var i = 0; i < this.segments.length; i++) {
        var highestVector = this.segments[i].ClosestVector(v);
        var computedIntensity = cb(this.segments[i]);
        if (Math.abs(computedIntensity) > 0.01) {
          nonZerosFound++;
          runningTotal += computedIntensity;
        }

        if (bestVectorFound == null || computedIntensity > highestIntensity) {
          bestVectorFound = highestVector;
          highestIntensity = computedIntensity;
        }
      }
      return [
        bestVectorFound,
        nonZerosFound < 1 ? 0 : runningTotal / nonZerosFound
      ];
    }

  }

}

export = Segment;
