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

  it('Distance', () => {
    var s:Spatial.Segment2 = new segment2(
        new Vector2(0,0),
        new Vector2(10,0)
      );

    var tester = new Vector2(5,0);
    var dist = s.distanceTo(tester);
    dist.should.be.a.Number.and.be.approximately(0,tolerance);

    tester = new Vector2(5,1);
    dist = s.distanceTo(tester);
    dist.should.be.a.Number.and.be.approximately(1,tolerance);

    tester = new Vector2(15,5);
    dist = s.distanceTo(tester);
    dist.should.be.a.Number.and.be.approximately(7.071,tolerance);
  });

  describe('Intensity', () => {
    it('Basic', () => {
      var s:Spatial.Segment2 = new segment2(
          new Vector2(0,0),
          new Vector2(0,10)
        );

      var tester = new Vector2(0,0);
      var intensity = s.intensityAt(tester);
      intensity.should.be.a.Number.and.be.approximately(1,tolerance);

      tester = new Vector2(0,-2);
      intensity = s.intensityAt(tester);
      intensity.should.be.a.Number.and.be.approximately(0.64,tolerance);

      tester = new Vector2(0,-5);
      intensity = s.intensityAt(tester);
      intensity.should.be.a.Number.and.be.approximately(0.25,tolerance);

      tester = new Vector2(0,-7);
      intensity = s.intensityAt(tester);
      intensity.should.be.a.Number.and.be.approximately(0.09,tolerance);

      tester = new Vector2(0,-10);
      intensity = s.intensityAt(tester);
      intensity.should.be.a.Number.and.be.approximately(0,tolerance);

      tester = new Vector2(0,-100);
      intensity = s.intensityAt(tester);
      intensity.should.be.a.Number.and.be.approximately(0,tolerance);

    });
  });

  it('Serilization', () => {
    var s:Spatial.Segment2 = new segment2(
        new Vector2(0,0),
        new Vector2(10,0)
      );
    var str = s.toStr();
    var s2 = segment2.fromStr(str);
    s.equal(s2).should.be.true;
  });

});


});
