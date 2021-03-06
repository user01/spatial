/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />


declare var describe: any;
declare var it: any;


var should: Internal = require('should');
var tolerance = 0.05;

import * as Ramp from '../math/ramp';
import * as Vector from '../math/vector';

import * as Segment from '../math/segment';

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


  describe('Segment3', () => {
    it('Closest Vector', () => {

      var vect1DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect1DecayFalloff),
        vect1Falloff);
      var vect1 = new Vector.Vector3(1, 1, 1, vect1Factor);

      var vect2DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect2Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 0, 0, 0, 1)]);
      var vect2Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect2DecayFalloff),
        vect2Falloff);
      var vect2 = new Vector.Vector3(0, 0, 0, vect2Factor);

      var s3 = new Segment.Segment3(
        vect1,
        vect2,
        new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)])
      );

      s3.ClosestVector(new Vector.Vector3(1, 1, 1)).readableStr().should.be.exactly('V3[1,1,1,]');
      s3.ClosestVector(new Vector.Vector3(10, 1, 1)).readableStr().should.be.exactly('V3[1,1,1,]');
      s3.ClosestVector(new Vector.Vector3(0, 0, 0)).readableStr().should.be.exactly('V3[0,0,0,]');
      s3.ClosestVector(new Vector.Vector3(-1, -1, -1)).readableStr().should.be.exactly('V3[0,0,0,]');
      s3.ClosestVector(new Vector.Vector3(-5321, -1, -1)).readableStr().should.be.exactly('V3[0,0,0,]');
    });

    it('Intensity', () => {

      var vect1DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect1DecayFalloff),
        vect1Falloff);
      var vect1 = new Vector.Vector3(1, 0, 0, vect1Factor);

      var vect2DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect2Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', -1, 1, 0, 2)]);
      var vect2Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect2DecayFalloff),
        vect2Falloff);
      var vect2 = new Vector.Vector3(0, 0, 0, vect2Factor);

      var s3 = new Segment.Segment3(
        vect1,
        vect2,
        new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)])
      );

      s3.ClosestVector(new Vector.Vector3(0, 0.5, 0)).readableStr().should.be.exactly('V3[0,0,0,]');
      s3.ClosestVector(new Vector.Vector3(0.5, 0.5, 0)).readableStr().should.be.exactly('V3[0.5,0,0,]');

      s3.IntensityAtDistance(new Vector.Vector3(0, 0, 0)).should.be.approximately(-1, tolerance);
      s3.IntensityAtDistance(new Vector.Vector3(0, 1, 0)).should.be.approximately(0, tolerance);
      s3.IntensityAtDistance(new Vector.Vector3(0, 2, 0)).should.be.approximately(1, tolerance);

    });
  });

  describe('Segment4', () => {
    it('Closest Vector', () => {

      var baseDecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var baseFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var baseFactor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), baseDecayFalloff),
        baseFalloff);
      var base = new Vector.Vector4(0, 0, 0, 0, baseFactor);

      var tipDecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var tipFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 0, 0, 0, 1)]);
      var tipFactor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), tipDecayFalloff),
        tipFalloff);
      var tip = new Vector.Vector4(1, 0, 0, 0, tipFactor);

      var s4 = new Segment.Segment4(
        base,
        tip,
        new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)])
      );

      should.ok(s4.ClosestVector(new Vector.Vector4(1, 0, 0, 0)).Equal(new Vector.Vector4(1, 0, 0, 0)), 'on tip');
      should.ok(s4.ClosestVector(new Vector.Vector4(0, 0, 0, 0)).Equal(new Vector.Vector4(0, 0, 0, 0)), 'on base');
      should.ok(s4.ClosestVector(new Vector.Vector4(0.5, 0, 0, 0)).Equal(new Vector.Vector4(0.5, 0, 0, 0)), 'on segment');
      should.ok(s4.ClosestVector(new Vector.Vector4(5, 0, 0, 0)).Equal(new Vector.Vector4(1, 0, 0, 0)), 'past tip');
      should.ok(s4.ClosestVector(new Vector.Vector4(-5, 0, 0, 0)).Equal(new Vector.Vector4(0, 0, 0, 0)), 'past base');

      var vectors = [
        new Vector.Vector4(0.5, 1, 0, 0),
        new Vector.Vector4(0.5, 1, 1, 0),
        new Vector.Vector4(0.5, 1, 1, 1),
        new Vector.Vector4(0.5, 0, 1, 1),
        new Vector.Vector4(0.5, 0, 0, 1),
        new Vector.Vector4(0.5, 0, 0, 100),
      ];

      vectors.forEach((v: Vector.Vector4) => {
        should.ok(s4.ClosestVector(v).Equal(new Vector.Vector4(0.5, 0, 0, 0)), 'on segment ' + v.readableStr());
      });

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

    it('Intensity 3d', () => {

      var vect1DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect1DecayFalloff),
        vect1Falloff);
      var base = new Vector.Vector3(1, 0, 0, vect1Factor);

      var vect2DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect2Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', -1, 1, 0, 2)]);
      var vect2Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect2DecayFalloff),
        vect2Falloff);
      var tip = new Vector.Vector3(0, 0, 0, vect2Factor);

      var s3 = new Segment.Segment3(
        base,
        tip,
        new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)])
      );

      var ss = new Segment.SegmentSet([s3]);

      ss.IntensityAtDistance(new Vector.Vector3(0, 0, 0)).should.be.approximately(-1, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 1, 0)).should.be.approximately(0, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 2, 0)).should.be.approximately(1, tolerance);

      ss.IntensityAtDistance(new Vector.Vector3(0, 0, 0)).should.be.approximately(-1, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0, 1)).should.be.approximately(0, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0, 2)).should.be.approximately(1, tolerance);

    });

    it('Intensity Advanced', () => {

      var vect1DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect1Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 0, 0, 2)]);
      var vect1Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect1DecayFalloff),
        vect1Falloff);
      var base = new Vector.Vector3(0, 0, 1, vect1Factor);

      var vect2DecayFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 1, 0, 1)]);
      var vect2Falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 0, 0, 0, 1)]);
      var vect2Factor = new Ramp.Factor(
        new Ramp.Decay(moment.duration(5, 'minutes'), vect2DecayFalloff),
        vect2Falloff);
      var tip = new Vector.Vector3(0, 0, -1, vect2Factor);

      var s2 = new Segment.Segment3(
        base,
        tip,
        new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
      );
      var ss: Segment.SegmentSet = new Segment.SegmentSet([s2]);

      var position1 = new Vector.Vector3(0, 0, 2);
      ss.DistanceTo(position1).should.be.approximately(1, tolerance);
      ss.IntensityAtDistance(position1).should.be.approximately(vect1Falloff.ValueAt(ss.DistanceTo(position1)), tolerance, 'intensity at distance vs actual at distance');

    });

    it('Intensity 3d - multiple - simple', () => {

      var permFalloff = Ramp.Falloff.PermanentFalloff(1);
      var permDecay = new Ramp.Decay(moment.duration(5, 'minutes'), permFalloff);
      var vectDistanceFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 0, 0, 1)]);
      var segmentAFactor = new Ramp.Factor(
        permDecay,
        vectDistanceFalloff);
      var baseA = new Vector.Vector3(1, 0, 0, segmentAFactor);
      var tipA = new Vector.Vector3(0, 0, 0, segmentAFactor);

      var sA = new Segment.Segment3(
        baseA,
        tipA,
        new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
      );

      var vectDistanceFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', -1, 0, 0, 1)]);
      var segmentBFactor = new Ramp.Factor(
        permDecay,
        vectDistanceFalloff);
      var baseB = new Vector.Vector3(1, 1, 0, segmentBFactor);
      var tipB = new Vector.Vector3(0, 1, 0, segmentBFactor);
      var sB = new Segment.Segment3(
        baseB,
        tipB,
        new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
      );

      var ss = new Segment.SegmentSet([sA, sB]);

      ss.IntensityAtDistance(new Vector.Vector3(0, 0, 0)).should.be.approximately(1, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.25, 0)).should.be.approximately((-0.25 + 0.75) / 2, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.5, 0)).should.be.approximately(0, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.75, 0)).should.be.approximately((-0.75 + 0.25) / 2, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 1, 0)).should.be.approximately(-1, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 2, 0)).should.be.approximately(0, tolerance);

    });

    it('Intensity 3d - multiple - complex', () => {

      var permFalloff = Ramp.Falloff.PermanentFalloff(1);
      var permDecay = new Ramp.Decay(moment.duration(5, 'minutes'), permFalloff);
      var vectDistanceFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', 1, 0, 0, 1)]);
      var segmentAFactor = new Ramp.Factor(
        permDecay,
        vectDistanceFalloff);
      var baseA = new Vector.Vector3(1, 0, 0, segmentAFactor);
      var tipA = new Vector.Vector3(0, 0, 0, segmentAFactor);

      var sA = new Segment.Segment3(
        baseA,
        tipA,
        new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
      );

      var vectDistanceFalloff = new Ramp.Falloff([new Ramp.Ramp('linear', -1, 0, 0, 1)]);
      var segmentBFactor = new Ramp.Factor(
        permDecay,
        vectDistanceFalloff);
      var baseB = new Vector.Vector3(1, 1.4, 0, segmentBFactor);
      var tipB = new Vector.Vector3(0, 1.4, 0, segmentBFactor);
      var sB = new Segment.Segment3(
        baseB,
        tipB,
        new Ramp.Falloff([new Ramp.Ramp('linear', 0, 1, 0, 1)])
      );

      var ss = new Segment.SegmentSet([sA, sB]);

      ss.IntensityAtDistance(new Vector.Vector3(0, 0, 0)).should.be.approximately(1, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.2, 0)).should.be.approximately(0.8, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.4, 0)).should.be.approximately(0.6, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.6, 0)).should.be.approximately((0.4 + -0.2) / 2, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 0.8, 0)).should.be.approximately((0.2 + -0.4) / 2, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 1, 0)).should.be.approximately(-0.6, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 1.2, 0)).should.be.approximately(-0.8, tolerance);
      ss.IntensityAtDistance(new Vector.Vector3(0, 1.4, 0)).should.be.approximately(-1, tolerance);

    });
  });
});
