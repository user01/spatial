/// <reference path="references.ts" />

import Ramp = require('./ramp');
import Vector = require("./vector");
import Segment = require("./segment");

(<any>window).Spatial = {
  Ramp: Ramp,
  Vector: Vector,
  Segment: Segment
};