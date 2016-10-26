// [ts-npm-lint] disabled triple slash reference to 'references.d.ts'
import * as Ramp from './ramp';
import IRanged from './interfaces/iranged';
import ISerializable from './interfaces/iserializable';
import IEquality from './interfaces/iequality';
export declare class VectorBase implements IRanged, ISerializable, IEquality<VectorBase> {
    protected _values: Array<number>;
    private _factor;
    readonly Values: Array<number>;
    readonly Dimension: number;
    /** How the value responds over time and distance from the vector */
    readonly Factor: Ramp.Factor;
    constructor(_values: Array<number>, _factor?: Ramp.Factor);
    Clone: () => VectorBase;
    readableStr: () => string;
    ToObj(): any;
    ToStr: () => string;
    static FromObj: (obj: any) => VectorBase;
    static FromStr: (str: string) => VectorBase;
    Equal(v: VectorBase): boolean;
    DistanceTo(v: VectorBase): number;
    IntensityAtDistance: (v: VectorBase) => number;
    /** Intensity against time */
    IntensityAtTime: (originTime: moment.Moment, currentTime: moment.Moment) => number;
    /** Intensity based on duration */
    IntensityAtDuration: (d: moment.Duration) => number;
    /** Intensity based on distance and time */
    IntensityAtDistanceAndTime: (v: VectorBase, originTime: moment.Moment, currentTime: moment.Moment) => number;
    /** Intensity based on distance and duration */
    IntensityAtDistanceAndDuration: (v: VectorBase, d: moment.Duration) => number;
    ClosestVector: (v: VectorBase) => VectorBase;
    static DistanceToStatic: (v1: VectorBase, v2: VectorBase) => number;
    static CloneStatic: (v1: VectorBase) => VectorBase;
    static Add: (v1: VectorBase, v2: VectorBase) => VectorBase;
    static Subtract: (v1: VectorBase, v2: VectorBase) => VectorBase;
    static Scale: (v1: VectorBase, factor: number) => VectorBase;
    static Negate: (v1: VectorBase) => VectorBase;
    static EqualStatic: (v1: VectorBase, v2: VectorBase) => boolean;
    static Dot: (v1: VectorBase, v2: VectorBase) => number;
    private static DimensionCheck;
    protected static isArray: (arg: any) => boolean;
}
export declare class Vector2 extends VectorBase {
    readonly x: number;
    readonly y: number;
    constructor(_x: number, _y: number, factor?: Ramp.Factor);
    static FromObj: (obj: any) => Vector2;
    static FromStr: (str: string) => Vector2;
    static Build: (values: number[]) => Vector2;
}
export declare class Vector3 extends VectorBase {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    constructor(_x: number, _y: number, _z: number, factor?: Ramp.Factor);
    Cross: (vOther: Vector3) => Vector3;
    static CrossStatic: (vA: Vector3, vB: Vector3) => Vector3;
    static Cast: (v: VectorBase) => Vector3;
    static FromObj: (obj: any) => Vector3;
    static FromStr: (str: string) => Vector3;
    static Build: (values: number[]) => Vector3;
}
export declare class Vector4 extends VectorBase {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly w: number;
    constructor(_x: number, _y: number, _z: number, _w: number, factor?: Ramp.Factor);
    static FromObj: (obj: any) => Vector4;
    static FromStr: (str: string) => Vector4;
    static Build: (values: number[]) => Vector4;
}
export default Vector2;
