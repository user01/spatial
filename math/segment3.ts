
/// <reference path="references.ts" />

module Spatial {


  export class Segment3 extends Segment {
    public get Base():Vector3 {
      return <Vector3>this._base;
    }
    public get Tip():Vector3 {
      return <Vector3>this._tip;
    }

    constructor(base:Vector3,tip:Vector3){
      super(base,tip);
    }
    public push = (v:Vector3):Segment3 => {
      return Segment3.Push(this,v);
    }
    public static Push = (s:Segment3,v:Vector3):Segment3 => {
      return <Segment3>Segment.Push(s,v);
    }
  }


}
