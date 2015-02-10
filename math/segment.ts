/// <reference path="../typings/node.d.ts" />

module Spatial {
  class Segement {
    constructor(private _dimension:number=2){
    }
  }

  export class Segment2 {
    constructor(){}
  }
  export class Segment3 {
    constructor(){}
  }
  export class Segment4 {
    constructor(){}
  }

}

if (typeof exports != 'undefined') {
  exports.Segment2 = Spatial.Segment2;
  exports.Segment3 = Spatial.Segment3;
  exports.Segment4 = Spatial.Segment4;
}
