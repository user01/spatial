/// <reference path='../references.ts'/>

module Spatial {
  export interface IRanged {
    DistanceTo(v: Vector): number;
    IntensityAt(v: Vector): number;
    ClosestVector(v: Vector): Vector;
  }
}
