
/// <reference path="../references.ts" />

module Spatial {


  export class Segment3 extends Segment {
    public get Base():Vector3 {
      return <Vector3>this._base;
    }
    public get Tip():Vector3 {
      return <Vector3>this._tip;
    }
    public get TipWithoutBase():Vector {
      return Vector.Subtract(this._tip,this._base);
    }

    constructor(base:Vector3,tip:Vector3,r:Ramp|string=null){
      super(base,tip,r);
    }
    public push = (v:Vector3):Segment3 => {
      return Segment3.Push(this,v);
    }
    public static Push = (s:Segment3,v:Vector3):Segment3 => {
      return <Segment3>Segment.Push(s,v);
    }
    public static Cross = (sA:Segment3,sB:Segment3):Segment3 => {
      var aTip = Vector3.Cast(sA.TipWithoutBase.clone());
      var bTip = Vector3.Cast(sB.TipWithoutBase.clone());
      var cross = aTip.cross(bTip);
      var newTip = Vector3.Cast(sA.restoreBase(cross));
      return new Segment3(Vector3.Cast(sA.Base),newTip);
    }
  }


}
