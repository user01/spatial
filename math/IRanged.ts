/// <reference path="./vector.ts" />

module Interfaces {
  export interface IRanged {
    distanceTo(v:Vectors.Vector):number;
    intensityAt(v:Vectors.Vector):number;
    closestVector(v:Vectors.Vector):Vectors.Vector;
  }
}
