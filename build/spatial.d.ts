declare module Spatial {
    interface IRanged {
        distanceTo(v: Vector): number;
        intensityAt(v: Vector): number;
        closestVector(v: Vector): Vector;
    }
}
declare module Spatial {
    interface ISerializable {
        toObj(): any;
        toStr(): string;
    }
}
declare module Spatial {
    interface IEquality<T> {
        equal(a: T, b: T): boolean;
    }
}
declare module Spatial {
    class Ramp implements ISerializable, IEquality<Ramp> {
        type: string;
        valueStart: number;
        valueEnd: number;
        rangeStart: number;
        rangeEnd: number;
        private valueChange;
        private duration;
        constructor(type?: string, valueStart?: number, valueEnd?: number, rangeStart?: number, rangeEnd?: number);
        valueAt: (range: number) => number;
        equal: (b: Ramp) => boolean;
        toObj: () => any;
        toStr: () => string;
        static fromObj: (obj: any) => Ramp;
        static fromStr: (str: string) => Ramp;
        static ValueAt: (ramp: Ramp, range: number) => number;
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
        values: Float32Array;
        dimension: number;
        protected _ramp: Ramp;
        ramp: Ramp;
        constructor(valueSet: Array<number>, r?: Ramp | string);
        clone: () => Vector;
        readableStr: () => string;
        toObj: () => any;
        toStr: () => string;
        static fromObj: (obj: any) => Vector;
        static fromStr: (str: string) => Vector;
        equal: (v: Vector) => boolean;
        distanceTo: (v: Vector) => number;
        intensityAt: (v: Vector) => number;
        closestVector: (v: Vector) => Vector;
        static DistanceTo: (v1: Vector, v2: Vector) => number;
        static Clone: (v1: Vector) => Vector;
        static Add: (v1: Vector, v2: Vector) => Vector;
        static Subtract: (v1: Vector, v2: Vector) => Vector;
        static Scale: (v1: Vector, factor: number) => Vector;
        static Negate: (v1: Vector) => Vector;
        static Equal: (v1: Vector, v2: Vector) => boolean;
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
        length: number;
        dimension: number;
        protected _ramp: Ramp;
        Ramp: Ramp;
        constructor(_base: Vector, _tip: Vector, r?: Ramp | string);
        distanceTo: (v: Vector) => number;
        intensityAt: (v: Vector) => number;
        closestVector: (v: Vector) => Vector;
        private closestFraction;
        restoreBase: (v: Vector) => Vector;
        push: (v: Vector) => Segment;
        scale: (factor: number) => Segment;
        equal: (s: Segment) => boolean;
        static Equal: (s: Segment, s2: Segment) => boolean;
        static Scale: (s: Segment, factor: number) => Segment;
        static Push: (s: Segment, v: Vector) => Segment;
        static DistanceTo: (s: Segment, v: Vector) => number;
        toObj: () => any;
        toStr: () => string;
        private static DimensionCheck;
        static fromObj: (obj: any) => Segment;
        static fromStr: (str: string) => Segment;
    }
}
declare module Spatial {
    class Segment2 extends Segment {
        Base: Vector2;
        Tip: Vector2;
        constructor(base: Vector2, tip: Vector2);
        push: (v: Vector2) => Segment2;
        static Push: (s: Segment2, v: Vector2) => Segment2;
    }
}
declare module Spatial {
    class Segment3 extends Segment {
        Base: Vector3;
        Tip: Vector3;
        constructor(base: Vector3, tip: Vector3);
        push: (v: Vector3) => Segment3;
        static Push: (s: Segment3, v: Vector3) => Segment3;
    }
}
declare module Spatial {
    class Segment4 extends Segment {
        Base: Vector4;
        Tip: Vector4;
        constructor(base: Vector4, tip: Vector4);
        push: (v: Vector4) => Segment4;
        static Push: (s: Segment4, v: Vector4) => Segment4;
    }
}
declare module Spatial {
    class SegmentSet implements IRanged {
        private segments;
        private _dimension;
        dimension: number;
        constructor(segments: Array<Segment>);
        distanceTo: (v: Vector) => number;
        intensityAt: (v: Vector) => number;
        closestVector: (v: Vector) => Vector;
        protected closestVectorDistanceIntensity: (v: Vector) => [Vector, number, number];
    }
}
declare module Spatial {
    class Vector2 extends Vector {
        x: number;
        y: number;
        constructor(_x: number, _y: number, _ramp?: string | Ramp);
        static fromObj: (obj: any) => Vector2;
        static fromStr: (str: string) => Vector2;
        static build: (values: number[]) => Vector2;
    }
}
declare module Spatial {
    class Vector3 extends Vector {
        x: number;
        y: number;
        z: number;
        constructor(_x: number, _y: number, _z: number, _ramp?: string | Ramp);
        static fromObj: (obj: any) => Vector3;
        static fromStr: (str: string) => Vector3;
        static build: (values: number[]) => Vector3;
    }
}
declare module Spatial {
    class Vector4 extends Vector {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(_x: number, _y: number, _z: number, _w: number, _ramp?: string | Ramp);
        static fromObj: (obj: any) => Vector4;
        static fromStr: (str: string) => Vector4;
        static build: (values: number[]) => Vector4;
    }
}
