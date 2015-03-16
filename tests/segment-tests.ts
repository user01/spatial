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
var Vector3 = spatial.Vector3;
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

  it('Distance 2', () => {
    var s:Spatial.Segment2 = new segment2(
        new Vector2(0,10),
        new Vector2(10,10)
      );

    var tester = new Vector2(5,10);
    var dist = s.distanceTo(tester);
    dist.should.be.a.Number.and.be.approximately(0,tolerance);

    tester = new Vector2(5,10);
    dist = s.distanceTo(tester);
    dist.should.be.a.Number.and.be.approximately(0,tolerance);

    tester = new Vector2(5,8);
    dist = s.distanceTo(tester);
    dist.should.be.a.Number.and.be.approximately(2,tolerance);
  });

  describe('Closest Vector', () => {
    it('Simple', () => {
      var s:Spatial.Segment2 = new segment2(
          new Vector2(0,10),
          new Vector2(10,10)
        );

      var tester = new Vector2(5,10);
      var result = s.closestVector(tester);
      result.equal(tester).should.be.true;
    });
    it('Off', () => {
      var s:Spatial.Segment2 = new segment2(
          new Vector2(0,10),
          new Vector2(10,10)
        );

      var tester = new Vector2(5,12);
      var hand = new Vector2(5,10);
      var result = s.closestVector(tester);
      result.equal(hand).should.be.true;
    });
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

  describe('SegmentSets', () => {
    it('Init', () => {
      var ss:Spatial.SegmentSet = new spatial.SegmentSet([
        new spatial.Segment2(new Vector2(0,0),
                              new Vector2(10,0))
        ]);
    });
    it('Clone', () => {
      var ss:Spatial.SegmentSet = new spatial.SegmentSet([
        new spatial.Segment2(new Vector2(0,0),
                              new Vector2(10,0))
        ]);
      var c = ss.clone();
      c.equal(ss).should.be.true;
    });
    it('Merge', () => {
      var ssA:Spatial.SegmentSet = new spatial.SegmentSet([
        new spatial.Segment2(new Vector2(0,0),
                              new Vector2(10,0))
        ]);
      var ssB:Spatial.SegmentSet = new spatial.SegmentSet([
        new spatial.Segment2(new Vector2(40,40),
                              new Vector2(410,40)),
        new spatial.Segment2(new Vector2(60,60),
                              new Vector2(310,10))
        ]);
      var merged:Spatial.SegmentSet = new spatial.SegmentSet([
        new spatial.Segment2(new Vector2(0,0),
                              new Vector2(10,0)),
        new spatial.Segment2(new Vector2(40,40),
                              new Vector2(410,40)),
        new spatial.Segment2(new Vector2(60,60),
                              new Vector2(310,10))
        ]);

      var result = spatial.SegmentSet.Merge(ssA,ssB);
      merged.equal(result).should.be.true;
    });

    it('Init Error', () => {
        (() => {
          new spatial.SegmentSet()
        }).should.throw();
        (() => {
          var ss:Spatial.SegmentSet = new spatial.SegmentSet([
            new spatial.Segment2(new Vector2(0,0),
                                  new Vector2(10,0)),
            new spatial.Segment3(new Vector3(0,0,0),
                                  new Vector3(10,0,10))
            ]);
        }).should.throw();
    });
    it('Closest', () => {
      var s2:Spatial.Vector2 = new spatial.Segment2(new Vector2(0,0),
                                                    new Vector2(10,0));
      var ss:Spatial.SegmentSet = new spatial.SegmentSet([s2]);
      var v = new Vector2(5,5);

      ss.closestVector(v).equal(s2.closestVector(v)).should.be.true;

    });
    it('Closest Complex', () => {
      var s2:Spatial.Vector2 = new spatial.Segment2(new Vector2(0,0),
                                                    new Vector2(10,0));
      var s2B:Spatial.Vector2 = new spatial.Segment2(new Vector2(0,10),
                                                    new Vector2(10,10));
      var ss:Spatial.SegmentSet = new spatial.SegmentSet([s2,s2B]);
      var v = new Vector2(2,15);

      var ssV = ss.closestVector(v);
      var sBV = s2B.closestVector(v);

      //console.log(ssV.readableStr(),sBV.readableStr());

      ssV.equal(sBV).should.be.true;

    });

  });
});
