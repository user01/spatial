
/// <reference path="references.ts" />

module Spatial {
  export class Segment implements ISerializable, IRanged, IEquality<Segment> {

    public get Base():Vector {
      return this._base;
    }
    public get Tip():Vector {
      return this._tip;
    }
    public get TipWithoutBase():Vector {
      return Vector.Subtract(this._tip,this._base);
    }
    public get length():number {
      return this._base.distanceTo(this._tip);
    }
    public get dimension():number {
      return this._tip.dimension;
    }
    protected _ramp:Ramp;
    public get Ramp():Ramp {
      return this._ramp;
    }

    constructor(protected _base:Vector,
                protected _tip:Vector,
                r:Ramp|string=null){
      if (!this._base || !this._tip ||
          (this._base.dimension != this._tip.dimension)){
        throw new RangeException();
      }
      var tempRamp = Ramp.Build(r);
      //force the new ramp to conform to the 0,1 0,1 to handle
      // scaling along segment and fraction to give to each end
      this._ramp = new Ramp(tempRamp.type,0,1,0,1);
    }


    public distanceTo = (v:Vector):number => {
      return Segment.DistanceTo(this,v);
    };
    public intensityAt = (v:Vector):number => {
      var fraction = this.closestFraction(v);
      fraction = this.Ramp.valueAt(fraction);
      var range = this.distanceTo(v);
      var intensity = Ramp.Mix(this.Base.ramp,this.Tip.ramp,fraction,range);
      return intensity;
    };
    public closestVector = (v:Vector):Vector => {
      var t = this.closestFraction(v);
      var newSegment = this.scale(t);
      return newSegment.Tip.clone();
    };
    private closestFraction = (v:Vector):number => {
      Segment.DimensionCheck(this,v);
      var length = this.length;
      if (length < 0.001) return 0;

      var vWithoutBase = Vector.Subtract(v,this.Base);
      var t = Vector.Dot(vWithoutBase,this.TipWithoutBase) / (length * length);
      return Math.max(0,Math.min(1,t));
    }
    public restoreBase = (v:Vector):Vector => {
      return Vector.Add(this.Base,v);
    }
    public push = (v:Vector):Segment => {
      return Segment.Push(this,v);
    }
    public scale = (factor:number):Segment => {
      return Segment.Scale(this,factor);
    }
    public equal = (s:Segment):boolean => {
      return Segment.Equal(this,s);
    }

    public static Equal = (s:Segment,s2:Segment):boolean => {
      if (!s.Tip.equal(s2.Tip)) return false;
      if (!s.Base.equal(s2.Base)) return false;
      if (!s.Ramp.equal(s2.Ramp)) return false;
      return true;
    }
    public static Scale = (s:Segment,factor:number):Segment => {
      var newTip = s.restoreBase(
        Vector.Scale(s.TipWithoutBase,factor))
      return new Segment(s.Base.clone(),newTip);
    }
    public static Push = (s:Segment,v:Vector):Segment => {
      if (s.dimension != v.dimension) throw new RangeException();
      return new Segment(Vector.Add(s.Base,v),Vector.Add(s.Tip,v));
    }
    public static DistanceTo = (s:Segment, v:Vector):number => {
      Segment.DimensionCheck(s,v);
      var vOnSegment = s.closestVector(v);
      return vOnSegment.distanceTo(v);
    }

    public toObj = ():any => {
      return {
        t:'s' + this.dimension,
        b:this.Base.toObj(),
        e:this.Tip.toObj(),
        r:this.Ramp.toObj()
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
      return new Segment(Vector.fromObj(obj.b),
                          Vector.fromObj(obj.e),
                          Ramp.fromObj(obj.r));
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
