/// <reference path="references.d.ts" />
import IRanged from './interfaces/iranged';
import ISerializable from './interfaces/iserializable';
import IEquality from './interfaces/iequality';
import * as Vector from './vector';
import * as Ramp from './ramp';
export declare class SegmentBase implements ISerializable, IRanged, IEquality<SegmentBase> {
    protected _base: Vector.VectorBase;
    protected _tip: Vector.VectorBase;
    protected _falloff: Ramp.Falloff;
    Base: Vector.VectorBase;
    Tip: Vector.VectorBase;
    TipWithoutBase: Vector.VectorBase;
    Length: number;
    Dimension: number;
    FalloffMix: Ramp.Falloff;
    /** Longest duration for changes in decays */
    Duration: moment.Duration;
    constructor(_base: Vector.VectorBase, _tip: Vector.VectorBase, _falloff: Ramp.Falloff);
    ReadableStr: () => string;
    DistanceTo: (v: Vector.VectorBase) => number;
    /** Intensity from segment, only via distance
     * Uses segment falloff to mix between base and tip intensity
     */
    IntensityAtDistance(v: Vector.VectorBase): number;
    /** Intensity from segment, via distance and time difference */
    IntensityAtDistanceAndTime(v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number;
    /** Intensity from segment, via distance and duration */
    IntensityAtDistanceAndDuration(v: Vector.VectorBase, d: moment.Duration): number;
    /** Computes the fraction between base/tip using the Falloff Mix */
    private fractionBetweenBaseAndTip(v);
    ClosestVector: (v: Vector.VectorBase) => Vector.VectorBase;
    private closestFraction;
    RestoreBase: (v: Vector.VectorBase) => Vector.VectorBase;
    Push: (v: Vector.VectorBase) => SegmentBase;
    Scale: (factor: number) => SegmentBase;
    Equal: (s: SegmentBase) => boolean;
    /** Returns the value if 0<x<1, otherwise bind to the low, high */
    static ForceToRange(low: number, high: number, value: number): number;
    /** Mix the Intensity of the base and tip, based on fraction */
    static MixIntensity(baseIntensity: number, tipIntensity: number, fraction: number): number;
    static EqualStatic: (s: SegmentBase, s2: SegmentBase) => boolean;
    static Scale: (s: SegmentBase, factor: number) => SegmentBase;
    static Push: (s: SegmentBase, v: Vector.VectorBase) => SegmentBase;
    static DistanceToStatic: (s: SegmentBase, v: Vector.VectorBase) => number;
    ToObj: () => any;
    ToStr: () => string;
    private static DimensionCheck;
    static FromObj: (obj: any) => SegmentBase;
    static FromStr: (str: string) => SegmentBase;
}
export declare class Segment2 extends SegmentBase {
    Base: Vector.Vector2;
    Tip: Vector.Vector2;
    constructor(base: Vector.Vector2, tip: Vector.Vector2, falloff?: Ramp.Falloff);
    Push: (v: Vector.Vector2) => Segment2;
    static Push: (s: Segment2, v: Vector.Vector2) => Segment2;
}
export declare class Segment3 extends SegmentBase {
    Base: Vector.Vector3;
    Tip: Vector.Vector3;
    TipWithoutBase: Vector.VectorBase;
    constructor(base: Vector.Vector3, tip: Vector.Vector3, falloff?: Ramp.Falloff);
    Push: (v: Vector.Vector3) => Segment3;
    static Push: (s: Segment3, v: Vector.Vector3) => Segment3;
    static Cross: (sA: Segment3, sB: Segment3) => Segment3;
}
export declare class Segment4 extends SegmentBase {
    Base: Vector.Vector4;
    Tip: Vector.Vector4;
    constructor(base: Vector.Vector4, tip: Vector.Vector4, falloff?: Ramp.Falloff);
    Push: (v: Vector.Vector4) => Segment4;
    static Push: (s: Segment4, v: Vector.Vector4) => Segment4;
}
export declare class SegmentSet implements IRanged, IEquality<SegmentSet>, ISerializable {
    private segments;
    private _dimension;
    Dimension: number;
    /** Longest duration for changes in segmentsets */
    Duration: moment.Duration;
    /** Current segment sets */
    Segments: Array<SegmentBase>;
    constructor(segments: Array<SegmentBase>);
    DistanceTo: (v: Vector.VectorBase) => number;
    readableStr: () => string;
    /** Intensity from segment, only via distance
     * Uses segment falloff to mix between base and tip intensity
     */
    IntensityAtDistance(v: Vector.VectorBase): number;
    /** Intensity from segment, via distance and time difference */
    IntensityAtDistanceAndTime(v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number;
    /** Intensity from segment, via distance and duration */
    IntensityAtDistanceAndDuration(v: Vector.VectorBase, d: moment.Duration): number;
    ClosestVector: (v: Vector.VectorBase) => Vector.VectorBase;
    Clone: () => SegmentSet;
    Equal: (ss: SegmentSet) => boolean;
    ToObj: () => any;
    ToStr: () => string;
    static FromObj: (obj: any) => SegmentSet;
    static FromStr: (str: string) => SegmentSet;
    static CloneStatic: (ss: SegmentSet) => SegmentSet;
    static EqualStatic: (ssA: SegmentSet, ssB: SegmentSet) => boolean;
    static Merge: (ssA: SegmentSet, ssB: SegmentSet) => SegmentSet;
    protected closestVectorDistance: (v: Vector.VectorBase) => [Vector.VectorBase, number];
    protected closestVectorIntensityAtDistance: (v: Vector.VectorBase) => [Vector.VectorBase, number];
    protected closestVectorIntensityAtDistanceAndTime: (v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment) => [Vector.VectorBase, number];
    protected closestVectorIntensityAtDistanceAndDuration: (v: Vector.VectorBase, d: moment.Duration) => [Vector.VectorBase, number];
    /**  */
    private computeClosestVectorByCallback;
}
export default Segment2;
