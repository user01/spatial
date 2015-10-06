/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />


declare var describe: any;
declare var it: any;


var should: Internal = require('should');
var tolerance = 0.05;

import Ramp = require('../math/ramp');
import Vector = require('../math/vector');

import Segment = require('../math/segment');

import moment = require('moment');

describe('Segment', () => {


  describe('Segment.Segment2', () => {
    it('Init', () => {
      var s: Segment.Segment2 = new Segment.Segment2(
        new Vector.Vector2(0, 0),
        new Vector.Vector2(1, 2)
        );
      s = new Segment.Segment2(
        new Vector.Vector2(0, 0),
        new Vector.Vector2(1, 2),
        new Ramp.Falloff([new Ramp.Ramp('linear')])
        );
    });
    it('Init Error', () => {
      (() => {
        Vector.Vector4.Build([7]);
      }).should.throw();
    });

    it('Distance', () => {
      var s: Segment.Segment2 = new Segment.Segment2(
        new Vector.Vector2(0, 0),
        new Vector.Vector2(10, 0)
        );

      var tester = new Vector.Vector2(5, 0);
      var dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(0, tolerance);

      tester = new Vector.Vector2(5, 1);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(1, tolerance);

      tester = new Vector.Vector2(15, 5);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(7.071, tolerance);

    });

    it('Distance 2', () => {
      var s: Segment.Segment2 = new Segment.Segment2(
        new Vector.Vector2(0, 10),
        new Vector.Vector2(10, 10)
        );

      var tester = new Vector.Vector2(5, 10);
      var dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(0, tolerance);

      tester = new Vector.Vector2(5, 10);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(0, tolerance);

      tester = new Vector.Vector2(5, 8);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(2, tolerance);
    });

    describe('Closest Vector', () => {
      it('Simple', () => {
        var s: Segment.Segment2 = new Segment.Segment2(
          new Vector.Vector2(0, 10),
          new Vector.Vector2(10, 10)
          );

        var tester = new Vector.Vector2(5, 10);
        var result = s.ClosestVector(tester);
        result.Equal(tester).should.be.true;
      });
      it('Off', () => {
        var s: Segment.Segment2 = new Segment.Segment2(
          new Vector.Vector2(0, 10),
          new Vector.Vector2(10, 10)
          );

        var tester = new Vector.Vector2(5, 12);
        var hand = new Vector.Vector2(5, 10);
        var result = s.ClosestVector(tester);
        result.Equal(hand).should.be.true;
      });
    });

    describe('Intensity', () => {
      it('Permanent', () => {
        var s: Segment.Segment2 = new Segment.Segment2(
          new Vector.Vector2(0, 0),
          new Vector.Vector2(0, 10)
          );

        // this should always be 1, since the default factor is permenant
        var tester = new Vector.Vector2(0, 0);
        var intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

        tester = new Vector.Vector2(0, -2);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

        tester = new Vector.Vector2(0, -5);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

        tester = new Vector.Vector2(0, -7);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

        tester = new Vector.Vector2(0, -10);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

        tester = new Vector.Vector2(0, -100);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

      });
      it('Linear', () => {
        var factor1 = new Ramp.Factor(Ramp.Decay.PermanentDecay(), new Ramp.Falloff([
          new Ramp.Ramp('linear', 5, 0, 0, 2)
        ]));
        var factor2 = new Ramp.Factor(Ramp.Decay.PermanentDecay(), new Ramp.Falloff([
          new Ramp.Ramp('linear', 0, 6, 0, 2)
        ]));
        var s: Segment.Segment2 = new Segment.Segment2(
          new Vector.Vector2(0, 0, factor1),
          new Vector.Vector2(0, 10, factor2),
          new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
          );

        // this should always be 1, since the default factor is permenant
        var tester = new Vector.Vector2(0, 0);
        var intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(5, tolerance);

        // before base
        tester = new Vector.Vector2(0, -2);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(0, tolerance);

        tester = new Vector.Vector2(0, -20);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(0, tolerance);

        tester = new Vector.Vector2(0, -1);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(2.5, tolerance);

        // Beyond tip point
        tester = new Vector.Vector2(0, 10);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(0, tolerance);

        tester = new Vector.Vector2(0, 12);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(6, tolerance);

        tester = new Vector.Vector2(0, 16);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(6, tolerance);

        tester = new Vector.Vector2(0, 11);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(3, tolerance);

        // center
        tester = new Vector.Vector2(0, 5);
        intensity = s.IntensityAtDistance(tester);
        intensity.should.be.a.Number.and.be.approximately(2.5, tolerance);


      });
    });

    it('Serilization', () => {
      var s: Segment.Segment2 = new Segment.Segment2(
        new Vector.Vector2(0, 0),
        new Vector.Vector2(10, 0)
        );
      var str = s.ToStr();
      var s2 = Segment.Segment2.FromStr(str);
      s.Equal(s2).should.be.true;
    });

  });

  describe('Segment.SegmentSets', () => {
    it('Init', () => {
      var ss: Segment.SegmentSet = new Segment.SegmentSet([
        new Segment.Segment2(new Vector.Vector2(0, 0),
          new Vector.Vector2(10, 0))
      ]);
    });
    it('Clone', () => {
      var ss: Segment.SegmentSet = new Segment.SegmentSet([
        new Segment.Segment2(new Vector.Vector2(0, 0),
          new Vector.Vector2(10, 0))
      ]);
      var c = ss.Clone();
      c.Equal(ss).should.be.true;
    });
    it('Merge', () => {
      var ssA: Segment.SegmentSet = new Segment.SegmentSet([
        new Segment.Segment2(new Vector.Vector2(0, 0),
          new Vector.Vector2(10, 0))
      ]);
      var ssB: Segment.SegmentSet = new Segment.SegmentSet([
        new Segment.Segment2(new Vector.Vector2(40, 40),
          new Vector.Vector2(410, 40)),
        new Segment.Segment2(new Vector.Vector2(60, 60),
          new Vector.Vector2(310, 10))
      ]);
      var merged: Segment.SegmentSet = new Segment.SegmentSet([
        new Segment.Segment2(new Vector.Vector2(0, 0),
          new Vector.Vector2(10, 0)),
        new Segment.Segment2(new Vector.Vector2(40, 40),
          new Vector.Vector2(410, 40)),
        new Segment.Segment2(new Vector.Vector2(60, 60),
          new Vector.Vector2(310, 10))
      ]);

      var result = Segment.SegmentSet.Merge(ssA, ssB);
      merged.Equal(result).should.be.true;
    });

    it('Init Error', () => {
      (() => {
        var ss: Segment.SegmentSet = new Segment.SegmentSet([
          new Segment.Segment2(new Vector.Vector2(0, 0),
            new Vector.Vector2(10, 0)),
          new Segment.Segment3(new Vector.Vector3(0, 0, 0),
            new Vector.Vector3(10, 0, 10))
        ]);
      }).should.throw();
    });
    it('Closest', () => {
      var s2: Segment.Segment2 = new Segment.Segment2(new Vector.Vector2(0, 0),
        new Vector.Vector2(10, 0));
      var ss: Segment.SegmentSet = new Segment.SegmentSet([s2]);
      var v = new Vector.Vector2(5, 5);

      ss.ClosestVector(v).Equal(s2.ClosestVector(v)).should.be.true;

    });
    it('Closest Complex', () => {
      var s2: Segment.Segment2 = new Segment.Segment2(new Vector.Vector2(0, 0),
        new Vector.Vector2(10, 0));
      var s2B: Segment.Segment2 = new Segment.Segment2(new Vector.Vector2(0, 10),
        new Vector.Vector2(10, 10));
      var ss: Segment.SegmentSet = new Segment.SegmentSet([s2, s2B]);
      var v = new Vector.Vector2(2, 15);

      var ssV = ss.ClosestVector(v);
      var sBV = s2B.ClosestVector(v);

      //console.log(ssV.readableStr(),sBV.readableStr());

      ssV.Equal(sBV).should.be.true;

    });

    it('Duration', () => {
      var ramp1 = new Ramp.Ramp('linear', 1, 2, 0, 1);
      var duration1 = moment.duration(5, 'hours');
      var duration2 = moment.duration(15, 'days');
      var factor1 = new Ramp.Factor(new Ramp.Decay(duration1, new Ramp.Falloff([ramp1])), new Ramp.Falloff([ramp1]));
      var factor2 = new Ramp.Factor(new Ramp.Decay(duration2, new Ramp.Falloff([ramp1])), new Ramp.Falloff([ramp1]));
      var s2: Segment.Segment2 = new Segment.Segment2(new Vector.Vector2(0, 0, factor1),
        new Vector.Vector2(10, 0, factor1));
      var s2B: Segment.Segment2 = new Segment.Segment2(new Vector.Vector2(0, 10, factor1),
        new Vector.Vector2(10, 10, factor2));
      var ss: Segment.SegmentSet = new Segment.SegmentSet([s2, s2B]);

      var duration = ss.Duration;
      duration.asMilliseconds().should.be.exactly(duration2.asMilliseconds());
    });

    it('Intensity Simple', () => {
      var ramp1 = new Ramp.Ramp('linear', 1, 2, 0, 1);
      var ramp2 = new Ramp.Ramp('linear', -1, -2, 0, 1);
      var s2: Segment.Segment2 = new Segment.Segment2(
        new Vector.Vector2(0, 0, new Ramp.Factor(Ramp.Decay.PermanentDecay(), new Ramp.Falloff([ramp1]))),
        new Vector.Vector2(10, 0, new Ramp.Factor(Ramp.Decay.PermanentDecay(), new Ramp.Falloff([ramp2]))),
        new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
        );
      var ss: Segment.SegmentSet = new Segment.SegmentSet([s2]);

      var v = new Vector.Vector2(-1, 0);
      ss.DistanceTo(v).should.be.approximately(1, tolerance);
      var rampValue = ramp1.ValueAt(1);
      rampValue.should.be.approximately(2, tolerance, 'ramp1');
      ss.IntensityAtDistance(v).should.be.approximately(2, tolerance, 'int at distance 1');

      var v = new Vector.Vector2(-0.5, 0);
      ss.IntensityAtDistance(v).should.be.approximately(1.5, tolerance, 'int at distance 2');

      var v = new Vector.Vector2(0, 0.5);
      ss.IntensityAtDistance(v).should.be.approximately(1.5, tolerance, 'int at distance 3');

      var v = new Vector.Vector2(10, 0.5);
      ss.IntensityAtDistance(v).should.be.approximately(-1.5, tolerance, 'int at distance 4');

      var v = new Vector.Vector2(10.5, 0);
      ss.IntensityAtDistance(v).should.be.approximately(-1.5, tolerance, 'int at distance 5');

      var v = new Vector.Vector2(5, 0);
      ss.IntensityAtDistance(v).should.be.approximately(0, tolerance, 'int at distance 5');

    });

  });
});
