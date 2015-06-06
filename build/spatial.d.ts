/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/lib.d.ts" />
declare module Spatial {
    interface IRanged {
        DistanceTo(v: Vector): number;
        IntensityAt(v: Vector): number;
        ClosestVector(v: Vector): Vector;
    }
}
declare module Spatial {
    interface ISerializable {
        ToObj(): any;
        ToStr(): string;
    }
}
declare module Spatial {
    interface IEquality<T> {
        Equal(a: T, b: T): boolean;
    }
}
declare module Spatial {
    class Ramp implements ISerializable, IEquality<Ramp> {
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
        constructor(_type?: string, _valueStart?: number, _valueEnd?: number, _rangeStart?: number, _rangeEnd?: number);
        private validateSelf;
        ValueAt: (location: number) => number;
        Equal: (b: Ramp) => boolean;
        ToObj: () => any;
        ToStr: () => string;
        Clone: () => Ramp;
        static FromObj: (obj: any) => Ramp;
        static FromStr: (str: string) => Ramp;
        static CloneRamp: (r: Ramp) => Ramp;
        static ValueAtStatic: (ramp: Ramp, location: number) => number;
        static Equal: (r1: Ramp, r2: Ramp) => boolean;
        static Build: (r?: string | Ramp) => Ramp;
        static Mix: (r1: Ramp, r2: Ramp, fraction?: number, range?: number) => number;
        static Ease: (func?: string, currentTime?: number, beginingValue?: number, changeInValue?: number, duration?: number) => number;
        private static EasingFunctions;
    }
}
declare module Spatial {
    class Vector implements IRanged, ISerializable, IEquality<Vector> {
        protected _values: Float32Array;
        Values: Float32Array;
        Dimension: number;
        protected _ramp: Ramp;
        Ramp: Ramp;
        constructor(valueSet: Array<number>, r?: Ramp | string);
        Clone: () => Vector;
        readableStr: () => string;
        ToObj: () => any;
        ToStr: () => string;
        static FromObj: (obj: any) => Vector;
        static FromStr: (str: string) => Vector;
        Equal: (v: Vector) => boolean;
        DistanceTo: (v: Vector) => number;
        IntensityAt: (v: Vector) => number;
        ClosestVector: (v: Vector) => Vector;
        static DistanceToStatic: (v1: Vector, v2: Vector) => number;
        static CloneStatic: (v1: Vector) => Vector;
        static Add: (v1: Vector, v2: Vector) => Vector;
        static Subtract: (v1: Vector, v2: Vector) => Vector;
        static Scale: (v1: Vector, factor: number) => Vector;
        static Negate: (v1: Vector) => Vector;
        static EqualStatic: (v1: Vector, v2: Vector) => boolean;
        static Dot: (v1: Vector, v2: Vector) => number;
        private static DimensionCheck;
        protected static isArray: (arg: any) => boolean;
    }
}
declare module Spatial {
    class Segment implements ISerializable, IRanged, IEquality<Segment> {
        protected _base: Vector;
        protected _tip: Vector;
        Base: Vector;
        Tip: Vector;
        TipWithoutBase: Vector;
        Length: number;
        Dimension: number;
        protected _ramp: Ramp;
        Ramp: Ramp;
        constructor(_base: Vector, _tip: Vector, r?: Ramp | string);
        DistanceTo: (v: Vector) => number;
        IntensityAt: (v: Vector) => number;
        ClosestVector: (v: Vector) => Vector;
        private closestFraction;
        RestoreBase: (v: Vector) => Vector;
        Push: (v: Vector) => Segment;
        Scale: (factor: number) => Segment;
        Equal: (s: Segment) => boolean;
        static EqualStatic: (s: Segment, s2: Segment) => boolean;
        static Scale: (s: Segment, factor: number) => Segment;
        static Push: (s: Segment, v: Vector) => Segment;
        static DistanceToStatic: (s: Segment, v: Vector) => number;
        ToObj: () => any;
        ToStr: () => string;
        private static DimensionCheck;
        static FromObj: (obj: any) => Segment;
        static FromStr: (str: string) => Segment;
    }
}
declare module Spatial {
    class Segment2 extends Segment {
        Base: Vector2;
        Tip: Vector2;
        constructor(base: Vector2, tip: Vector2, r?: Ramp | string);
        Push: (v: Vector2) => Segment2;
        static Push: (s: Segment2, v: Vector2) => Segment2;
    }
}
declare module Spatial {
    class Segment3 extends Segment {
        Base: Vector3;
        Tip: Vector3;
        TipWithoutBase: Vector;
        constructor(base: Vector3, tip: Vector3, r?: Ramp | string);
        Push: (v: Vector3) => Segment3;
        static Push: (s: Segment3, v: Vector3) => Segment3;
        static Cross: (sA: Segment3, sB: Segment3) => Segment3;
    }
}
declare module Spatial {
    class Segment4 extends Segment {
        Base: Vector4;
        Tip: Vector4;
        constructor(base: Vector4, tip: Vector4, r?: Ramp | string);
        Push: (v: Vector4) => Segment4;
        static Push: (s: Segment4, v: Vector4) => Segment4;
    }
}
declare module Spatial {
    class SegmentSet implements IRanged, IEquality<SegmentSet>, ISerializable {
        private segments;
        private _dimension;
        Dimension: number;
        constructor(segments: Array<Segment>);
        DistanceTo: (v: Vector) => number;
        IntensityAt: (v: Vector) => number;
        ClosestVector: (v: Vector) => Vector;
        Clone: () => SegmentSet;
        Equal: (ss: SegmentSet) => boolean;
        ToObj: () => any;
        ToStr: () => string;
        static FromObj: (obj: any) => SegmentSet;
        static FromStr: (str: string) => SegmentSet;
        static CloneStatic: (ss: SegmentSet) => SegmentSet;
        static EqualStatic: (ssA: SegmentSet, ssB: SegmentSet) => boolean;
        static Merge: (ssA: SegmentSet, ssB: SegmentSet) => SegmentSet;
        protected closestVectorDistanceIntensity: (v: Vector) => [Vector, number, number];
    }
}
declare module Spatial {
    class Vector2 extends Vector {
        x: number;
        y: number;
        constructor(_x: number, _y: number, _ramp?: string | Ramp);
        static FromObj: (obj: any) => Vector2;
        static FromStr: (str: string) => Vector2;
        static Build: (values: number[]) => Vector2;
    }
}
declare module Spatial {
    class Vector3 extends Vector {
        x: number;
        y: number;
        z: number;
        constructor(_x: number, _y: number, _z: number, _ramp?: string | Ramp);
        Cross: (vOther: Vector3) => Vector3;
        static CrossStatic: (vA: Vector3, vB: Vector3) => Vector3;
        static Cast: (v: Vector) => Vector3;
        static FromObj: (obj: any) => Vector3;
        static FromStr: (str: string) => Vector3;
        static Build: (values: number[]) => Vector3;
    }
}
declare module Spatial {
    class Vector4 extends Vector {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(_x: number, _y: number, _z: number, _w: number, _ramp?: string | Ramp);
        static FromObj: (obj: any) => Vector4;
        static FromStr: (str: string) => Vector4;
        static Build: (values: number[]) => Vector4;
    }
}
