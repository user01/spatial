/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var spatial = require('../spatial.node');
var tolerance = 0.05;

var segment2 = spatial.Segment2;
var Vector2 = spatial.Vector2;
var Ramp = spatial.Ramp;

describe('Segment', () => {


describe('Segment2', () => {
  it('Init', () => {
    var s:Spatial.Segment2 = new segment2(
        new Vector2(0,0),
        new Vector2(1,2)
      );
    s = new segment2(
        new Vector2(0,0),
        new Vector2(1,2),
        new Ramp('linear')
      );
  });
  it('Init Error', () => {
      (() => {
        new spatial.Vector4.build(7);
      }).should.throw();
      (() => {
        new spatial.Vector4.build([7]);
      }).should.throw();
  });

});


});
