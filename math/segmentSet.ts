
/// <reference path="references.ts" />


module Spatial {

  export class SegmentSet implements IRanged {

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
