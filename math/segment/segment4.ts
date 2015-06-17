
/// <reference path="../references.ts" />

module Spatial {


  export class Segment4 extends Segment {
    public get Base(): Vector4 {
      return <Vector4>this._base;
    }
    public get Tip(): Vector4 {
      return <Vector4>this._tip;
    }
    constructor(base: Vector4, tip: Vector4, r: Ramp|string = null) {
      super(base, tip, r);
    }
    public Push = (v: Vector4): Segment4 => {
      return Segment4.Push(this, v);
    }
    public static Push = (s: Segment4, v: Vector4): Segment4 => {
      return <Segment4>Segment.Push(s, v);
    }
  }

}
