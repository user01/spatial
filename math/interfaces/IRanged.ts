/// <reference path='../references.ts'/>

import Vector = require('../vector');

interface IRanged {
  DistanceTo(v: Vector.VectorBase): number;
  IntensityAtDistance(v: Vector.VectorBase): number;
  IntensityAtDistanceAndTime(v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number;
  IntensityAtDistanceAndDuration(v: Vector.VectorBase, d: moment.Duration): number;
  ClosestVector(v: Vector.VectorBase): Vector.VectorBase;
}

export = IRanged;
