/// <reference path="./IRanged.ts" />
/// <reference path="../typings/node.d.ts" />

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


    public distanceTo = (v:Vector):number => {
      return Vector.DistanceTo(this,v);
    };
    public intensityAt = (v:Vector):number => {
      return 0;
    };
    public closestVector = (v:Vector):Vector => {
      return null;
    };

    public static DistanceTo = (v1:Vector,v2:Vector):number => {
      Vector.DimensionCheck(v1,v2);
      var total = 0;
      for (var i=0;i<v1.dimension;i++)
        total += (v1.values[i] - v2.values[i]) * (v1.values[i] - v2.values[i]);
      return Math.sqrt(total);
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

    public distanceTo = (v1:Vector2):number => {
      return Vector2.DistanceTo(v1,this);
    }
    
    public static DistanceTo = (v1:Vector2,v2:Vector2):number => {
      return Vector.DistanceTo(v1,v2);
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
