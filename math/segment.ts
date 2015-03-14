
/// <reference path="references.ts" />
//var vectors = require('./vector');

module Spatial {
  export class Segment implements ISerializable, IRanged {

    public get Base():Vector {
      return this._base;
    }
    public get Tip():Vector {
      return this._tip;
    }
    public get length():number {
      return this._base.distanceTo(this._tip);
    }
    public get dimension():number {
      return this._tip.dimension;
    }

    constructor(protected _base:Vector, protected _tip:Vector){
      if (this._base.dimension != this._tip.dimension){
        throw new RangeException();
      }
    }


    public distanceTo = (v:Vector):number => {
      return Segment.DistanceTo(this,v);
    };
    public intensityAt = (v:Vector):number => {
      return 0;
    };
    public closestVector = (v:Vector):Vector => {
      return null;
    };
    public push = (v:Vector):Segment => {
      return Segment.Push(this,v);
    }


    public static Push = (s:Segment,v:Vector):Segment => {
      if (s.dimension != v.dimension) throw new RangeException();
      return new Segment(Vector.Add(s.Base,v),Vector.Add(s.Tip,v));
    }
    public static DistanceTo = (s:Segment, v:Vector):number => {
      Segment.DimensionCheck(s,v);
      return 0;
    }

    public toObj = ():any => {
      return {
        t:'s' + this.dimension,
        b:this.Base.toObj(),
        e:this.Tip.toObj()
      };
    }
    public toStr = ():string => {
      return JSON.stringify(this.toObj());
    }


    private static DimensionCheck = (s:Segment,v:Vector):boolean => {
      if (s.dimension != v.dimension)
        throw new RangeException();
      return true;
    }


    public static fromObj = (obj:any):Segment => {
      return new Segment(Vector.fromObj(obj.b),Vector.fromObj(obj.e));
    }
    public static fromStr = (str:string):Segment => {
      return Segment.fromObj(JSON.parse(str));
    }
  }

  export class Segment2 extends Segment {
    public get Base():Vector2 {
      return <Vector2>this._base;
    }
    public get Tip():Vector2 {
      return <Vector2>this._tip;
    }

    constructor(base:Vector2,tip:Vector2){
      super(base,tip);
    }
    public push = (v:Vector2):Segment2 => {
      return Segment2.Push(this,v);
    }
    public static Push = (s:Segment2,v:Vector2):Segment2 => {
      return <Segment2>Segment.Push(s,v);
    }
  }


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


  export class Segment4 extends Segment {
    public get Base():Vector4 {
      return <Vector4>this._base;
    }
    public get Tip():Vector4 {
      return <Vector4>this._tip;
    }
    constructor(base:Vector4,tip:Vector4){
      super(base,tip);
    }
    public push = (v:Vector4):Segment4 => {
      return Segment4.Push(this,v);
    }
    public static Push = (s:Segment4,v:Vector4):Segment4 => {
      return <Segment4>Segment.Push(s,v);
    }
  }

}
