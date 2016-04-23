// [ts-npm-lint] disabled triple slash reference to 'references.d.ts'
import ISerializable from './interfaces/iserializable';
import IEquality from './interfaces/iequality';
/**
 * How to handle factor values at distance and time
 */
export declare class Factor implements ISerializable, IEquality<Factor> {
    private _decay;
    private _falloff;
    Decay: Decay;
    Falloff: Falloff;
    constructor(_decay: Decay, _falloff: Falloff);
    /** Product of all Decay values at given time, ignores Falloff
     */
    IntensityAtTime: (originTime: moment.Moment, currentTime: moment.Moment) => number;
    /** Value vs the duration of the Decay, ignores Falloff */
    IntensityAtDuration: (duration: moment.Duration) => number;
    /** Value vs distance with Falloff, ignoring Decay */
    IntensityAtDistance: (distance: number) => number;
    /** Value vs distance with Falloff and vs time Decay */
    IntensityAtDistanceAndTime: (distance: number, originTime: moment.Moment, currentTime: moment.Moment) => number;
    /** Value vs distance with Falloff and vs time Decay */
    IntensityAtDistanceAndDuration: (distance: number, duration: moment.Duration) => number;
    ToObj: () => any;
    ToStr: () => string;
    static FromObj: (obj: any) => Factor;
    static FromStr: (str: string) => Factor;
    Clone: () => Factor;
    static CloneStatic: (factor: Factor) => Factor;
    Equal: (other: Factor) => boolean;
    static EqualStatic: (f1: Factor, f2: Factor) => boolean;
    static PermanentFactor: (value?: number) => Factor;
}
/** Decay allow combinations of response functions over a duration
 * Note the Set computes the range start and end by the minimum start
 * and maximum end of supplied ramps, but all durations are valid inputs
 * Assuming no falloff is supplied, the value defaults to 1
 */
export declare class Decay implements ISerializable, IEquality<Decay> {
    private _duration;
    private _falloff;
    Duration: moment.Duration;
    Falloff: Falloff;
    private _durationMinutes;
    constructor(_duration: moment.Duration, _falloff: Falloff);
    ReadableStr: () => string;
    /** Product of all Ramp values at given time
     * No ramps default to factor of 1
     */
    ValueAt: (originTime: moment.Moment, currentTime: moment.Moment) => number;
    /** Value vs the duration of the Decay */
    ValueAfterDuration: (duration: moment.Duration) => number;
    /** Compute factor based on minute numbers */
    private valueAtMinutes(minutesDifference);
    ToObj: () => any;
    ToStr: () => string;
    static FromObj: (obj: any) => Decay;
    static FromStr: (str: string) => Decay;
    Clone: () => Decay;
    static CloneState: (other: Decay) => Decay;
    Equal: (other: Decay) => boolean;
    static EqualStatic: (dt1: Decay, dt2: Decay) => boolean;
    static PermanentDecay: () => Decay;
}
/** Falloff allow combinations of response functions over distance
 * Note the Set computes the range start and end by the minimum start
 * and maximum end of supplied ramps, but all numbers are valid inputs
 * Assuming no ramps are supplied, the value defaults to 1
 */
export declare class Falloff implements ISerializable, IEquality<Falloff> {
    private _ramps;
    Ramps: Array<Ramp>;
    /** Earliest Start Value in ramps */
    RangeStart: number;
    private rangeStart;
    /** Latest End Value in ramps */
    RangeEnd: number;
    private rangeEnd;
    /** Length of combined ramps */
    Range: number;
    constructor(_ramps?: Array<Ramp>);
    ReadableStr: () => string;
    private rangeStartCompute();
    private rangeEndCompute();
    /** Product of all Ramp values at given time
     * Outside of all ramps, the factor defaults to the closest edge
     * No ramps default to factor of 1
     */
    ValueAt: (location: number) => number;
    ToObj: () => any;
    ToStr: () => string;
    static FromObj: (obj: any) => Falloff;
    static FromStr: (str: string) => Falloff;
    Clone: () => Falloff;
    static CloneStatic: (other: Falloff) => Falloff;
    Equal: (other: Falloff) => boolean;
    static EqualStatic: (dt1: Falloff, dt2: Falloff) => boolean;
    static StandardRampSetRamps: () => Ramp[];
    static StandardRampSet: () => Falloff;
    static PermanentFalloff: (value?: number) => Falloff;
    /** Simple linear fall from 1 to 0 */
    static LinearFalloff: () => Falloff;
}
export declare class Ramp implements ISerializable, IEquality<Ramp> {
    private _type;
    private _valueStart;
    private _valueEnd;
    private _rangeStart;
    private _rangeEnd;
    Type: string;
    ValueStart: number;
    ValueEnd: number;
    RangeStart: number;
    RangeEnd: number;
    Duration: number;
    ValueChange: number;
    private static defaultEasingFunction;
    constructor(_type?: string, _valueStart?: number, _valueEnd?: number, _rangeStart?: number, _rangeEnd?: number);
    ReadableStr: () => string;
    ValueAt: (location: number) => number;
    Equal: (b: Ramp) => boolean;
    SetType: (type: string) => Ramp;
    SetValueStart: (value: number) => Ramp;
    SetValueEnd: (value: number) => Ramp;
    SetRangeStart: (value: number) => Ramp;
    SetRangeEnd: (value: number) => Ramp;
    ToArray: () => [string, number, number, number, number];
    static FromArray: (arr: [string, number, number, number, number]) => Ramp;
    static AlterValue: (ramp: Ramp, index: number, value: any) => Ramp;
    ToObj: () => any;
    ToStr: () => string;
    static FromObj: (obj: any) => Ramp;
    static FromStr: (str: string) => Ramp;
    Clone: () => Ramp;
    static CloneRamp: (r: Ramp) => Ramp;
    static ValueAtStatic: (ramp: Ramp, location: number) => number;
    static Equal: (r1: Ramp, r2: Ramp) => boolean;
    static Mix: (r1: Ramp, r2: Ramp, fraction?: number, range?: number) => number;
    static Ease: (func?: string, currentTime?: number, beginingValue?: number, changeInValue?: number, duration?: number) => number;
    private static EasingFunctions;
}
export default Ramp;
