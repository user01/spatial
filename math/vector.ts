/// <reference path="./IRanged.ts" />
/// <reference path="../typings/node.d.ts" />

var common = require('./common');

module Spatial {
  export class Vector implements IRanged {
    protected _values:Float32Array;

    public get values():Float32Array {
      return this._values;
    }


    public get dimension():number {
      return this._values.length;
    }


    constructor(valueSet:Array<number>){
      if (valueSet.length < 1 || valueSet.length > 4){
        throw new RangeException();
      }
      this._values = new Float32Array(valueSet);
    }

    public clone = ():Vector => {
      return Vector.Clone(this);
    }


    public distanceTo = (v:Vector):number => {
      return Vector.DistanceTo(this,v);
    };
    public intensityAt = (v:Vector):number => {
      return 0;
    };
    public closestVector = (v:Vector):Vector => {
      return this.clone();
    };

    public static DistanceTo = (v1:Vector,v2:Vector):number => {
      Vector.DimensionCheck(v1,v2);
      var total = 0;
      for (var i=0;i<v1.dimension;i++)
        total += (v1.values[i] - v2.values[i]) * (v1.values[i] - v2.values[i]);
      return Math.sqrt(total);
    }

    public static Clone = (v1:Vector):Vector => {
      return new Vector(Array.prototype.slice.call(v1.values));
    }

    public static Add = (v1:Vector,v2:Vector):Vector => {
      Vector.DimensionCheck(v1,v2);
      var values:Array<number> = new Array<number>();
      for (var i=0;i<v1.dimension;i++)
        values.push(v1.values[i] + v2.values[i]);
      return new Vector(values);
    }

    public static Subtract = (v1:Vector,v2:Vector):Vector => {
      return Vector.Add(v1,Vector.Negate(v2));
    }

    public static Scale = (v1:Vector,factor:number):Vector => {
      var values:Array<number> = new Array<number>();
      for (var i=0;i<v1.dimension;i++)
        values.push(v1.values[i] * factor);
      return new Vector(values);
    }

    public static Negate = (v1:Vector):Vector => {
      return Vector.Scale(v1,-1);
    }

    public static Equal = (v1:Vector,v2:Vector):boolean => {
      if (v1.dimension != v2.dimension) return false;
      for (var i=0;i<v1.dimension;i++)
        if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
          return false;
      return true;
    }

    public static Dot = (v1:Vector,v2:Vector):number => {
        Vector.DimensionCheck(v1,v2);
        var result:number = 0;
        for (var i=0;i<v1.dimension;i++)
          result += v1.values[i] * v2.values[i];
        return result;
    }


    private static DimensionCheck = (v1:Vector,v2:Vector):boolean => {
      if (v1.dimension != v2.dimension)
        throw new RangeException();
      return true;
    }

    protected static isArray = (arg) => {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  export class Vector2 extends Vector {
    public get x():number {
      return this._values[0];
    }
    public get y():number {
      return this._values[1];
    }

    constructor(_x:number,_y:number){
      super([_x,_y]);
    }

    public static build = (values:Array<number>):Vector2 => {
      if (values.length != 2) throw new RangeException();
      return new Vector2(values[0],values[1]);
    }
  }

  export class Vector3 extends Vector {
    public get x():number {
      return this._values[0];
    }
    public get y():number {
      return this._values[1];
    }
    public get z():number {
      return this._values[2];
    }

    constructor(_x:number,_y:number,_z:number){
      super([_x,_y,_z]);
    }

    public static build = (values:Array<number>):Vector3 => {
      if (values.length != 3) throw new RangeException();
      return new Vector3(values[0],values[1],values[2]);
    }
  }

  export class Vector4 extends Vector {

    public get x():number {
      return this._values[0];
    }
    public get y():number {
      return this._values[1];
    }
    public get z():number {
      return this._values[2];
    }
    public get w():number {
      return this._values[3];
    }

    constructor(_x:number,_y:number,_z:number,_w:number){
      super([_x,_y,_z,_w]);
    }

    public static build = (values:Array<number>):Vector4 => {
      if (values.length != 4) throw new RangeException();
      return new Vector4(values[0],values[1],values[2],values[3]);
    }
  }
}

if (typeof exports != 'undefined') {
  exports.Vector2 = Spatial.Vector2;
  exports.Vector3 = Spatial.Vector3;
  exports.Vector4 = Spatial.Vector4;
}
