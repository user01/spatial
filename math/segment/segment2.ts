
/// <reference path="../references.ts" />

module Spatial {

  export class Segment2 extends Segment {
    public get Base():Vector2 {
      return <Vector2>this._base;
    }
    public get Tip():Vector2 {
      return <Vector2>this._tip;
    }

    constructor(base:Vector2,tip:Vector2,r:Ramp|string=null){
      super(base,tip,r);
    }
    public push = (v:Vector2):Segment2 => {
      return Segment2.Push(this,v);
    }
    public static Push = (s:Segment2,v:Vector2):Segment2 => {
      return <Segment2>Segment.Push(s,v);
    }
  }

}
