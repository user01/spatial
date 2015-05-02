
/// <reference path="../references.ts" />


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

    public cross = (vOther:Vector3):Vector3 => {
      return Vector3.Cross(this,vOther);
    }

    public static Cross = (vA:Vector3,vB:Vector3):Vector3 => {
      var x = vA.y * vB.z - vA.z * vB.y;
      var y = vA.z * vB.x - vA.x * vB.z;
      var z = vA.x * vB.y - vA.y * vB.x;
      return new Vector3(x,y,z,vA.ramp.clone());
    }
    public static Cast =(v:Vector):Vector3 => {
      if (v.values.length != 3) throw new RangeException();
      return new Vector3(v.values[0],v.values[1],v.values[2],v.ramp);
    }

    public static fromObj = (obj:any):Vector3 => {
      return new Vector3(obj.v[0],obj.v[1],obj.v[2],Ramp.fromObj(obj.r));
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
