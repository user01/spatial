
/// <reference path="references.ts" />


module Spatial {

  export class Vector implements IRanged, ISerializable, IEquality<Vector> {
    protected _values:Float32Array;

    public get values():Float32Array {
      return this._values;
    }
    public get dimension():number {
      return this._values.length;
    }
    protected _ramp:Ramp;
    public get ramp():Ramp {
      return this._ramp;
    }

    constructor(valueSet:Array<number>,r:Ramp|string=null){
      if (valueSet.length < 1 || valueSet.length > 4){
        throw new RangeException();
      }
      this._ramp = Ramp.Build(r);
      this._values = new Float32Array(valueSet);
    }

    public clone = ():Vector => {
      return Vector.Clone(this);
    }

    public readableStr = ():string => {
      var str = 'V' + this.dimension + '[';
      for (var i=0;i<this._values.length;i++)
        str += this._values[i] + ',';
      return str + ']';
    }

    public toObj = ():any => {
      return {
        t:'v' + this.dimension,
        v:this._values,
        r:this.ramp.toStr()
      };
    }

    public toStr = ():string => {
      return JSON.stringify(this.toObj());
    }

    public static fromObj = (obj:any):Vector => {
      return new Vector(obj.v);
    }

    public static fromStr = (str:string):Vector => {
      return Vector.fromObj(JSON.parse(str));
    }

    public equal = (v:Vector):boolean => {
      return Vector.Equal(this,v);
    }

    public distanceTo = (v:Vector):number => {
      return Vector.DistanceTo(this,v);
    };
    public intensityAt = (v:Vector):number => {
      return this.ramp.valueAt(this.distanceTo(v));
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
      return Vector.fromObj(v1.toObj());
    }

    public static Add = (v1:Vector,v2:Vector):Vector => {
      Vector.DimensionCheck(v1,v2);
      var values:Array<number> = new Array<number>();
      for (var i=0;i<v1.dimension;i++)
        values.push(v1.values[i] + v2.values[i]);
      return new Vector(values,v1.ramp.toStr());
    }

    public static Subtract = (v1:Vector,v2:Vector):Vector => {
      return Vector.Add(v1,Vector.Negate(v2));
    }

    public static Scale = (v1:Vector,factor:number):Vector => {
      var values:Array<number> = new Array<number>();
      for (var i=0;i<v1.dimension;i++)
        values.push(v1.values[i] * factor);
      return new Vector(values,v1.ramp.toStr());
    }

    public static Negate = (v1:Vector):Vector => {
      return Vector.Scale(v1,-1);
    }

    public static Equal = (v1:Vector,v2:Vector):boolean => {
      if (v1.dimension != v2.dimension) return false;
      if (!v1.ramp.equal(v2.ramp)) return false;
      for (var i=0;i<v1.dimension;i++)
        //if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
        if (Math.abs(v1.values[i] - v2.values[i]) > 0.05)
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



}
