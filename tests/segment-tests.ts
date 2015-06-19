/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe: any;
declare var it: any;

var should: Internal = require('should');
var tolerance = 0.05;


describe('Segment', () => {


  describe('Segment2', () => {
    it('Init', () => {
      var s: Spatial.Segment2 = new Spatial.Segment2(
        new Spatial.Vector2(0, 0),
        new Spatial.Vector2(1, 2)
        );
      s = new Spatial.Segment2(
        new Spatial.Vector2(0, 0),
        new Spatial.Vector2(1, 2),
        new Spatial.Ramp('linear')
        );
    });
    it('Init Error', () => {
      (() => {
        Spatial.Vector4.Build([7]);
      }).should.throw();
    });

    it('Distance', () => {
      var s: Spatial.Segment2 = new Spatial.Segment2(
        new Spatial.Vector2(0, 0),
        new Spatial.Vector2(10, 0)
        );

      var tester = new Spatial.Vector2(5, 0);
      var dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(0, tolerance);

      tester = new Spatial.Vector2(5, 1);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(1, tolerance);

      tester = new Spatial.Vector2(15, 5);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(7.071, tolerance);

    });

    it('Distance 2', () => {
      var s: Spatial.Segment2 = new Spatial.Segment2(
        new Spatial.Vector2(0, 10),
        new Spatial.Vector2(10, 10)
        );

      var tester = new Spatial.Vector2(5, 10);
      var dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(0, tolerance);

      tester = new Spatial.Vector2(5, 10);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(0, tolerance);

      tester = new Spatial.Vector2(5, 8);
      dist = s.DistanceTo(tester);
      dist.should.be.a.Number.and.be.approximately(2, tolerance);
    });

    describe('Closest Vector', () => {
      it('Simple', () => {
        var s: Spatial.Segment2 = new Spatial.Segment2(
          new Spatial.Vector2(0, 10),
          new Spatial.Vector2(10, 10)
          );

        var tester = new Spatial.Vector2(5, 10);
        var result = s.ClosestVector(tester);
        result.Equal(tester).should.be.true;
      });
      it('Off', () => {
        var s: Spatial.Segment2 = new Spatial.Segment2(
          new Spatial.Vector2(0, 10),
          new Spatial.Vector2(10, 10)
          );

        var tester = new Spatial.Vector2(5, 12);
        var hand = new Spatial.Vector2(5, 10);
        var result = s.ClosestVector(tester);
        result.Equal(hand).should.be.true;
      });
    });

    describe('Intensity', () => {
      it('Basic', () => {
        var s: Spatial.Segment2 = new Spatial.Segment2(
          new Spatial.Vector2(0, 0),
          new Spatial.Vector2(0, 10)
          );

        var tester = new Spatial.Vector2(0, 0);
        var intensity = s.IntensityAt(tester);
        intensity.should.be.a.Number.and.be.approximately(1, tolerance);

        tester = new Spatial.Vector2(0, -2);
        intensity = s.IntensityAt(tester);
        intensity.should.be.a.Number.and.be.approximately(0.64, tolerance);

        tester = new Spatial.Vector2(0, -5);
        intensity = s.IntensityAt(tester);
        intensity.should.be.a.Number.and.be.approximately(0.25, tolerance);

        tester = new Spatial.Vector2(0, -7);
        intensity = s.IntensityAt(tester);
        intensity.should.be.a.Number.and.be.approximately(0.09, tolerance);

        tester = new Spatial.Vector2(0, -10);
        intensity = s.IntensityAt(tester);
        intensity.should.be.a.Number.and.be.approximately(0, tolerance);

        tester = new Spatial.Vector2(0, -100);
        intensity = s.IntensityAt(tester);
        intensity.should.be.a.Number.and.be.approximately(0, tolerance);

      });
    });

    it('Serilization', () => {
      var s: Spatial.Segment2 = new Spatial.Segment2(
        new Spatial.Vector2(0, 0),
        new Spatial.Vector2(10, 0)
        );
      var str = s.ToStr();
      var s2 = Spatial.Segment2.FromStr(str);
      s.Equal(s2).should.be.true;
    });

  });

  describe('SegmentSets', () => {
    it('Init', () => {
      var ss: Spatial.SegmentSet = new Spatial.SegmentSet([
        new Spatial.Segment2(new Spatial.Vector2(0, 0),
          new Spatial.Vector2(10, 0))
      ]);
    });
    it('Clone', () => {
      var ss: Spatial.SegmentSet = new Spatial.SegmentSet([
        new Spatial.Segment2(new Spatial.Vector2(0, 0),
          new Spatial.Vector2(10, 0))
      ]);
      var c = ss.Clone();
      c.Equal(ss).should.be.true;
    });
    it('Merge', () => {
      var ssA: Spatial.SegmentSet = new Spatial.SegmentSet([
        new Spatial.Segment2(new Spatial.Vector2(0, 0),
          new Spatial.Vector2(10, 0))
      ]);
      var ssB: Spatial.SegmentSet = new Spatial.SegmentSet([
        new Spatial.Segment2(new Spatial.Vector2(40, 40),
          new Spatial.Vector2(410, 40)),
        new Spatial.Segment2(new Spatial.Vector2(60, 60),
          new Spatial.Vector2(310, 10))
      ]);
      var merged: Spatial.SegmentSet = new Spatial.SegmentSet([
        new Spatial.Segment2(new Spatial.Vector2(0, 0),
          new Spatial.Vector2(10, 0)),
        new Spatial.Segment2(new Spatial.Vector2(40, 40),
          new Spatial.Vector2(410, 40)),
        new Spatial.Segment2(new Spatial.Vector2(60, 60),
          new Spatial.Vector2(310, 10))
      ]);

      var result = Spatial.SegmentSet.Merge(ssA, ssB);
      merged.Equal(result).should.be.true;
    });

    it('Init Error', () => {
      (() => {
        var ss: Spatial.SegmentSet = new Spatial.SegmentSet([
          new Spatial.Segment2(new Spatial.Vector2(0, 0),
            new Spatial.Vector2(10, 0)),
          new Spatial.Segment3(new Spatial.Vector3(0, 0, 0),
            new Spatial.Vector3(10, 0, 10))
        ]);
      }).should.throw();
    });
    it('Closest', () => {
      var s2: Spatial.Segment2 = new Spatial.Segment2(new Spatial.Vector2(0, 0),
        new Spatial.Vector2(10, 0));
      var ss: Spatial.SegmentSet = new Spatial.SegmentSet([s2]);
      var v = new Spatial.Vector2(5, 5);

      ss.ClosestVector(v).Equal(s2.ClosestVector(v)).should.be.true;

    });
    it('Closest Complex', () => {
      var s2: Spatial.Segment2 = new Spatial.Segment2(new Spatial.Vector2(0, 0),
        new Spatial.Vector2(10, 0));
      var s2B: Spatial.Segment2 = new Spatial.Segment2(new Spatial.Vector2(0, 10),
        new Spatial.Vector2(10, 10));
      var ss: Spatial.SegmentSet = new Spatial.SegmentSet([s2, s2B]);
      var v = new Spatial.Vector2(2, 15);

      var ssV = ss.ClosestVector(v);
      var sBV = s2B.ClosestVector(v);

      //console.log(ssV.readableStr(),sBV.readableStr());

      ssV.Equal(sBV).should.be.true;

    });

    it('Intensity Simple', () => {
      var ramp1 = new Spatial.Ramp('linear', 1, 2, 0, 1);
      var s2: Spatial.Segment2 = new Spatial.Segment2(
        new Spatial.Vector2(0, 0, ramp1),
        new Spatial.Vector2(10, 0, new Spatial.Ramp('linear', -1, -2, 0, 1)),
        new Spatial.Ramp('linear')
        );
      var ss: Spatial.SegmentSet = new Spatial.SegmentSet([s2]);


      var v = new Spatial.Vector2(-1, 0);
      ss.DistanceTo(v).should.be.approximately(1, tolerance);
      var rampValue = ramp1.ValueAt(1);
      rampValue.should.be.approximately(2, tolerance);
      ss.IntensityAt(v).should.be.approximately(2, tolerance);

      var v = new Spatial.Vector2(-0.5, 0);
      ss.IntensityAt(v).should.be.approximately(1.5, tolerance);

      var v = new Spatial.Vector2(0, 0.5);
      ss.IntensityAt(v).should.be.approximately(1.5, tolerance);

      var v = new Spatial.Vector2(10, 0.5);
      ss.IntensityAt(v).should.be.approximately(-1.5, tolerance);

      var v = new Spatial.Vector2(10.5, 0);
      ss.IntensityAt(v).should.be.approximately(-1.5, tolerance);


    });

  });
});
