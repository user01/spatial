
/// <reference path="references.ts" />


module Spatial {

  export class SegmentSet implements
          IRanged, IEquality<SegmentSet>, ISerializable {

    private _dimension:number=0;
    public get dimension():number {
      return this._dimension;
    }

    constructor(private segments:Array<Segment>){
      if ((segments === void 0) || segments.length < 1)
        throw new RangeException();
      this._dimension = segments[0].dimension;

      // Ensure all dimensions match
      for(var i=0; i < this.segments.length; i++){
        if (segments[i].dimension != this._dimension){
          throw new RangeException();
        }
      }
    }

    public distanceTo = (v:Vector):number => {
      return this.closestVectorDistanceIntensity(v)[1];
    }
    public intensityAt = (v:Vector):number => {
      return this.closestVectorDistanceIntensity(v)[2];
    }
    public closestVector = (v:Vector):Vector => {
      return this.closestVectorDistanceIntensity(v)[0];
    }

    public clone = ():SegmentSet => {
      return SegmentSet.Clone(this);
    }
    public equal = (ss:SegmentSet):boolean => {
      return SegmentSet.Equal(this,ss);
    }
    public toObj = ():any => {
      return {
        s:this.segments.map((s:Segment):any=>{ return s.toObj(); })
      };
    }
    public toStr = ():string => {
      return JSON.stringify(this.toObj());
    }

    public static fromObj = (obj:any):SegmentSet => {
      var segs = obj.s.map((s:any):Segment=>{
          return Segment.fromObj(s);
        });
      return new SegmentSet(segs);
    }

    public static fromStr = (str:string):SegmentSet => {
      return SegmentSet.fromObj(JSON.parse(str));
    }

    public static Clone = (ss:SegmentSet):SegmentSet => {
      return SegmentSet.fromObj(ss.toObj());
    }

    public static Equal = (ssA:SegmentSet,ssB:SegmentSet):boolean => {
      if (ssA.segments.length != ssB.segments.length) return false;
      for (var i=0;i<ssA.segments.length;i++){
        if (!ssA.segments[i].equal(ssB.segments[i])) return false;
      }
      return true;
    }

    public static Merge = (ssA:SegmentSet,ssB:SegmentSet):SegmentSet => {
      if (ssA.dimension != ssB.dimension) throw new RangeException();
      return new SegmentSet(ssA.segments.concat(ssB.segments));
    }

    protected closestVectorDistanceIntensity = (v:Vector):[Vector,number,number] => {
      var closestVectorFound = null;
      var closestDistance = Number.MAX_VALUE;
      var closestIntensity = 0;

      for(var i=0; i < this.segments.length; i++){
        var computedVector = this.segments[i].closestVector(v);
        var computedDistance = this.segments[i].distanceTo(v);
        if (closestVectorFound == null || computedDistance < closestDistance) {
          closestVectorFound = computedVector;
          closestDistance = computedDistance;
          closestIntensity = this.segments[i].intensityAt(computedVector);
        }
      }
      return [closestVectorFound,closestDistance,closestIntensity];
    }
  }

}
