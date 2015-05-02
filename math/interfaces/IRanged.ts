/// <reference path='../references.ts'/>

module Spatial {
  export interface IRanged {
    distanceTo(v:Vector):number;
    intensityAt(v:Vector):number;
    closestVector(v:Vector):Vector;
  }
}