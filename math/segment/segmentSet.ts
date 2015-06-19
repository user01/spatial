
/// <reference path="../references.ts" />


module Spatial {

  export class SegmentSet implements
          IRanged, IEquality<SegmentSet>, ISerializable {

    private _dimension:number=0;
    public get Dimension():number {
      return this._dimension;
    }

    constructor(private segments:Array<Segment>){
      if ((segments === void 0) || segments.length < 1)
        throw new RangeException();
      this._dimension = segments[0].Dimension;

      // Ensure all dimensions match
      for(var i=0; i < this.segments.length; i++){
        if (segments[i].Dimension != this._dimension){
          throw new RangeException();
        }
      }
    }

    public DistanceTo = (v:Vector):number => {
      return this.closestVectorDistance(v)[1];
    }
    public IntensityAt = (v:Vector):number => {
      return this.closestVectorIntensity(v)[1];
    }
    public ClosestVector = (v:Vector):Vector => {
      return this.closestVectorDistance(v)[0];
    }

    public Clone = ():SegmentSet => {
      return SegmentSet.CloneStatic(this);
    }
    public Equal = (ss:SegmentSet):boolean => {
      return SegmentSet.EqualStatic(this,ss);
    }
    public ToObj = ():any => {
      return {
        s:this.segments.map((s:Segment):any=>{ return s.ToObj(); })
      };
    }
    public ToStr = ():string => {
      return JSON.stringify(this.ToObj());
    }

    public static FromObj = (obj:any):SegmentSet => {
      var segs = obj.s.map((s:any):Segment=>{
          return Segment.FromObj(s);
        });
      return new SegmentSet(segs);
    }

    public static FromStr = (str:string):SegmentSet => {
      return SegmentSet.FromObj(JSON.parse(str));
    }

    public static CloneStatic = (ss:SegmentSet):SegmentSet => {
      return SegmentSet.FromObj(ss.ToObj());
    }

    public static EqualStatic = (ssA:SegmentSet,ssB:SegmentSet):boolean => {
      if (ssA.segments.length != ssB.segments.length) return false;
      for (var i=0;i<ssA.segments.length;i++){
        if (!ssA.segments[i].Equal(ssB.segments[i])) return false;
      }
      return true;
    }

    public static Merge = (ssA:SegmentSet,ssB:SegmentSet):SegmentSet => {
      if (ssA.Dimension != ssB.Dimension) throw new RangeException();
      return new SegmentSet(ssA.segments.concat(ssB.segments));
    }

    protected closestVectorDistance = (v:Vector):[Vector,number] => {
      var closestVectorFound = null;
      var closestDistance = Number.MAX_VALUE;

      for(var i=0; i < this.segments.length; i++){
        var computedVector = this.segments[i].ClosestVector(v);
        var computedDistance = this.segments[i].DistanceTo(v);
        if (closestVectorFound == null || computedDistance < closestDistance) {
          closestVectorFound = computedVector;
          closestDistance = computedDistance;
        }
      }
      return [closestVectorFound,closestDistance];
    }
    protected closestVectorIntensity = (v:Vector):[Vector,number] => {
      var bestVectorFound = null;
      var highestIntensity = Number.MIN_VALUE;

      for(var i=0; i < this.segments.length; i++){
        var highestVector = this.segments[i].ClosestVector(v);
        var computedIntensity = this.segments[i].IntensityAt(v);
        if (bestVectorFound == null || computedIntensity > highestIntensity) {
          bestVectorFound = highestVector;
          highestIntensity = computedIntensity;
        }
      }
      return [bestVectorFound,highestIntensity];
    }
  }

}
