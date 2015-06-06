
/// <reference path="../references.ts" />


module Spatial {

  export class Vector2 extends Vector {
    public get x():number {
      return this._values[0];
    }
    public get y():number {
      return this._values[1];
    }

    constructor(_x:number,_y:number,_ramp:string|Ramp=null){
      super([_x,_y],_ramp);
    }

    public static FromObj = (obj:any):Vector2 => {
      return new Vector2(obj.v[0],obj.v[1],Ramp.FromObj(obj.r));
    }
    public static FromStr = (str:string):Vector2 => {
      return Vector2.FromObj(JSON.parse(str));
    }
    public static Build = (values:Array<number>):Vector2 => {
      if (values.length != 2) throw new RangeException();
      return new Vector2(values[0],values[1]);
    }
  }
}
