/// <reference path='../references.ts'/>

import Vector = require('../vector');

interface IRanged {
  DistanceTo(v: Vector.VectorBase): number;
  IntensityAt(v: Vector.VectorBase): number;
  ClosestVector(v: Vector.VectorBase): Vector.VectorBase;
}

export = IRanged;
