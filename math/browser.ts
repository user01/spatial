/// <reference path="references.ts" />

import Ramp = require('./ramp/ramp');
import Vector = require("./vector/vector");
import Segment = require("./segment/segment");

(<any>window).Spatial = {
  Ramp: Ramp,
  Vector: Vector,
  Segment: Segment
};