/// <reference path="../typings/node.d.ts" />
/// <reference path="./vector.ts" />

var vectors = require('./vector');

module Segments {
  export class Segment implements Interfaces.ISerializable {
    
    public get Base():Vectors.Vector {
      return this._base;
    }
    public get Tip():Vectors.Vector {
      return this._tip;
    }    
    public get length():number {
      return this._base.distanceTo(this._tip);
    }
    public get dimension():number {
      return this._tip.dimension;
    }

    
    constructor(protected _base:Vectors.Vector, protected _tip:Vectors.Vector){
      if (this._base.dimension != this._tip.dimension){
        throw new RangeException();
      }
    }
    
    public push = (v:Vectors.Vector):Segment => {
      return Segment.Push(this,v);
    }    
    public static Push = (s:Segment,v:Vectors.Vector):Segment => {
      if (s.dimension != v.dimension) throw new RangeException();
      return new Segment(vectors.Vector.Add(s.Base,v),vectors.Vector.Add(s.Tip,v));
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
    
    public static fromObj = (obj:any):Segment => {
      return new Segment(vectors.Vector.fromObj(obj.b),vectors.Vector.fromObj(obj.e));
    }
    public static fromStr = (str:string):Segment => {
      return Segment.fromObj(JSON.parse(str));
    }
  }

  export class Segment2 extends Segment {
    public get Base():Vectors.Vector2 {
      return <Vectors.Vector2>this._base;
    }
    public get Tip():Vectors.Vector2 {
      return <Vectors.Vector2>this._tip;
    }
    
    constructor(base:Vectors.Vector2,tip:Vectors.Vector2){
      super(base,tip);
    }
    public push = (v:Vectors.Vector2):Segment2 => {
      return Segment2.Push(this,v);
    }
    public static Push = (s:Segment2,v:Vectors.Vector2):Segment2 => {
      return <Segment2>Segment.Push(s,v);
    }
  }
  
  
  export class Segment3 extends Segment {
    public get Base():Vectors.Vector3 {
      return <Vectors.Vector3>this._base;
    }
    public get Tip():Vectors.Vector3 {
      return <Vectors.Vector3>this._tip;
    }
    
    constructor(base:Vectors.Vector3,tip:Vectors.Vector3){
      super(base,tip);
    }
    public push = (v:Vectors.Vector3):Segment3 => {
      return Segment3.Push(this,v);
    }
    public static Push = (s:Segment3,v:Vectors.Vector3):Segment3 => {
      return <Segment3>Segment.Push(s,v);
    }
  }
  
  
  export class Segment4 extends Segment {
    public get Base():Vectors.Vector4 {
      return <Vectors.Vector4>this._base;
    }
    public get Tip():Vectors.Vector4 {
      return <Vectors.Vector4>this._tip;
    }
    constructor(base:Vectors.Vector4,tip:Vectors.Vector4){
      super(base,tip);
    }
    public push = (v:Vectors.Vector4):Segment4 => {
      return Segment4.Push(this,v);
    }
    public static Push = (s:Segment4,v:Vectors.Vector4):Segment4 => {
      return <Segment4>Segment.Push(s,v);
    }
  }

}

module.exports = Segments;