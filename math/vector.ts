/// <reference path="../typings/node.d.ts" />

module Spatial {
  export class Vector {
    private values:Float32Array;

    public get dimension():number {
      return this._dimension;
    }

    constructor(private _dimension:number=2){
      this._dimension =
        (this._dimension > 4 || this._dimension < 1) ? 2 :
          parseInt(<any>this._dimension);
      this.values = new Float32Array(this._dimension);
    }

  }

  export class Vector2 extends Vector {
  }

  export class Vector3 extends Vector {
  }

  export class Vector4 extends Vector {
  }
}

if (typeof exports != 'undefined') {
  exports.Vector2 = Spatial.Vector2;
  exports.Vector3 = Spatial.Vector3;
  exports.Vector4 = Spatial.Vector4;
}
