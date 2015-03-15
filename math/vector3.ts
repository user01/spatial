
/// <reference path="references.ts" />


module Spatial {



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

    constructor(_x:number,_y:number,_z:number,_ramp:string|Ramp=null){
      super([_x,_y,_z],_ramp);
    }

    public static fromObj = (obj:any):Vector3 => {
      return new Vector3(obj.v[0],obj.v[1],obj.v[2]);
    }
    public static fromStr = (str:string):Vector3 => {
      return Vector3.fromObj(JSON.parse(str));
    }
    public static build = (values:Array<number>):Vector3 => {
      if (values.length != 3) throw new RangeException();
      return new Vector3(values[0],values[1],values[2]);
    }
  }
}
