
/// <reference path="../references.ts" />


module Spatial {

  export class Vector implements IRanged, ISerializable, IEquality<Vector> {
    protected _values:Float32Array;

    public get Values():Float32Array {
      return this._values;
    }
    public get Dimension():number {
      return this._values.length;
    }
    protected _ramp:Ramp;
    public get Ramp():Ramp {
      return this._ramp;
    }

    constructor(valueSet:Array<number>,r:Ramp|string=null){
      if (valueSet.length < 1 || valueSet.length > 4){
        throw new RangeException();
      }
      this._ramp = Ramp.Build(r);
      this._values = new Float32Array(valueSet);
    }

    public Clone = ():Vector => {
      return Vector.CloneStatic(this);
    }

    public readableStr = ():string => {
      var str = 'V' + this.Dimension + '[';
      for (var i=0;i<this._values.length;i++)
        str += this._values[i] + ',';
      return str + ']';
    }

    public ToObj():any {
      return {
        t:this.Dimension,
        v:this._values,
        r:this.Ramp.ToObj()
      };
    }

    public ToStr = ():string => {
      return JSON.stringify(this.ToObj());
    }

    public static FromObj = (obj:any):Vector => {
      switch (obj.t) {
        case 2:
          return Vector2.FromObj(obj);
        case 3:
          return Vector3.FromObj(obj);
        case 4:
          return Vector4.FromObj(obj);
      }
      return new Vector(obj.v,Ramp.FromObj(obj.r));
    }

    public static FromStr = (str:string):Vector => {
      return Vector.FromObj(JSON.parse(str));
    }

    public Equal(v:Vector):boolean {
      return Vector.EqualStatic(this,v);
    }

    public DistanceTo = (v:Vector):number => {
      return Vector.DistanceToStatic(this,v);
    };
    public IntensityAt = (v:Vector):number => {
      return this.Ramp.ValueAt(this.DistanceTo(v));
    };
    public ClosestVector = (v:Vector):Vector => {
      return this.Clone();
    };

    public static DistanceToStatic = (v1:Vector,v2:Vector):number => {
      Vector.DimensionCheck(v1,v2);
      var total = 0;
      for (var i=0;i<v1.Dimension;i++)
        total += (v1.Values[i] - v2.Values[i]) * (v1.Values[i] - v2.Values[i]);
      return Math.sqrt(total);
    }

    public static CloneStatic = (v1:Vector):Vector => {
      return Vector.FromObj(v1.ToObj());
    }

    public static Add = (v1:Vector,v2:Vector):Vector => {
      Vector.DimensionCheck(v1,v2);
      var values:Array<number> = new Array<number>();
      for (var i=0;i<v1.Dimension;i++)
        values.push(v1.Values[i] + v2.Values[i]);
      return new Vector(values,v1.Ramp.ToStr());
    }

    public static Subtract = (v1:Vector,v2:Vector):Vector => {
      return Vector.Add(v1,Vector.Negate(v2));
    }

    public static Scale = (v1:Vector,factor:number):Vector => {
      var values:Array<number> = new Array<number>();
      for (var i=0;i<v1.Dimension;i++)
        values.push(v1.Values[i] * factor);
      return new Vector(values,v1.Ramp.ToStr());
    }

    public static Negate = (v1:Vector):Vector => {
      return Vector.Scale(v1,-1);
    }

    public static EqualStatic = (v1:Vector,v2:Vector):boolean => {
      if (v1.Dimension != v2.Dimension) return false;
      if (!v1.Ramp.Equal(v2.Ramp)) return false;
      for (var i=0;i<v1.Dimension;i++)
        //if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
        if (Math.abs(v1.Values[i] - v2.Values[i]) > 0.05)
          return false;
      return true;
    }

    public static Dot = (v1:Vector,v2:Vector):number => {
      Vector.DimensionCheck(v1,v2);
      var result:number = 0;
      for (var i=0;i<v1.Dimension;i++)
        result += v1.Values[i] * v2.Values[i];
      return result;
    }


    private static DimensionCheck = (v1:Vector,v2:Vector):boolean => {
      if (v1.Dimension != v2.Dimension)
        throw new RangeException();
      return true;
    }

    protected static isArray = (arg) => {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }



}
