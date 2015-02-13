/// <reference path="../typings/node.d.ts" />
/// <reference path="./vector.ts" />

module Spatial {
  export class Segement {
    
    public get length():number {
      return this._base.distanceTo(this._tip);
    }
    
    constructor(protected _base:Vector, protected _tip:Vector){
      if (this._base.dimension != this._tip.dimension){
        throw new RangeException();
      }
    }
  }

  export class Segment2 extends Segement {
    public get Base():Vector2 {
      return <Vector2>this._base;
    }
    public get Tip():Vector2 {
      return <Vector2>this._tip;
    }
    
    constructor(base:Vector2,tip:Vector2){
      super(base,tip);
    }
  }
  export class Segment3 extends Segement {
    constructor(base:Vector3,tip:Vector3){
      super(base,tip);
    }
  }
  export class Segment4 extends Segement {
    constructor(base:Vector4,tip:Vector4){
      super(base,tip);
    }
  }

}

if (typeof exports != 'undefined') {
  exports.Segment2 = Spatial.Segment2;
  exports.Segment3 = Spatial.Segment3;
  exports.Segment4 = Spatial.Segment4;
}
