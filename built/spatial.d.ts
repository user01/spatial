declare module Spatial {
    class Vector {
        protected _values: Float32Array;
        values: Float32Array;
        dimension: number;
        constructor(valueSet: Array<number>);
        clone: () => Vector;
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
    class Vector2 extends Vector {
        x: number;
        y: number;
        constructor(_x: number, _y: number);
        static fromObj: (obj: any) => Vector2;
        static fromStr: (str: string) => Vector2;
        static build: (values: number[]) => Vector2;
    }
    class Vector3 extends Vector {
        x: number;
        y: number;
        z: number;
        constructor(_x: number, _y: number, _z: number);
        static fromObj: (obj: any) => Vector3;
        static fromStr: (str: string) => Vector3;
        static build: (values: number[]) => Vector3;
    }
    class Vector4 extends Vector {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(_x: number, _y: number, _z: number, _w: number);
        static fromObj: (obj: any) => Vector4;
        static fromStr: (str: string) => Vector4;
        static build: (values: number[]) => Vector4;
    }
}
