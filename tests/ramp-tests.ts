/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe: any;
declare var it: any;

var should: Internal = require('should');
var tolerance = 0.05;

import moment = require('moment');

import Ramp = require('../math/ramp');

describe('Ramp.Ramp', () => {
  it('Construct', () => {
    var r1: Ramp.Ramp = new Ramp.Ramp();
    r1.Type.should.be.a.String.and.be.exactly('easeOutQuad');
  });
  it('Clone', () => {
    var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);
    var clone = r.Clone();
    r.Equal(clone).should.be.true;
  });
  describe('Setting new values', () => {

    it('Type', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);
      var rT = r.SetType('easeOutQuad');
      r.Type.should.be.exactly('linear');
      rT.Type.should.be.exactly('easeOutQuad');
      r.ValueStart.should.be.exactly(-1);
      rT.ValueStart.should.be.exactly(-1);
      r.ValueEnd.should.be.exactly(1);
      rT.ValueEnd.should.be.exactly(1);
      r.RangeStart.should.be.exactly(0);
      rT.RangeStart.should.be.exactly(0);
      r.RangeEnd.should.be.exactly(10);
      rT.RangeEnd.should.be.exactly(10);
    });
    it('ValueStart', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);
      var rT = r.SetValueStart(-2);
      r.Type.should.be.exactly('linear');
      rT.Type.should.be.exactly('linear');
      r.ValueStart.should.be.exactly(-1);
      rT.ValueStart.should.be.exactly(-2);
      r.ValueEnd.should.be.exactly(1);
      rT.ValueEnd.should.be.exactly(1);
      r.RangeStart.should.be.exactly(0);
      rT.RangeStart.should.be.exactly(0);
      r.RangeEnd.should.be.exactly(10);
      rT.RangeEnd.should.be.exactly(10);
    });
    it('ValueEnd', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);
      var rT = r.SetValueEnd(2);
      r.Type.should.be.exactly('linear');
      rT.Type.should.be.exactly('linear');
      r.ValueStart.should.be.exactly(-1);
      rT.ValueStart.should.be.exactly(-1);
      r.ValueEnd.should.be.exactly(1);
      rT.ValueEnd.should.be.exactly(2);
      r.RangeStart.should.be.exactly(0);
      rT.RangeStart.should.be.exactly(0);
      r.RangeEnd.should.be.exactly(10);
      rT.RangeEnd.should.be.exactly(10);
    });

    it('RangeStart', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);
      var rT = r.SetRangeStart(5);
      r.Type.should.be.exactly('linear');
      rT.Type.should.be.exactly('linear');
      r.ValueStart.should.be.exactly(-1);
      rT.ValueStart.should.be.exactly(-1);
      r.ValueEnd.should.be.exactly(1);
      rT.ValueEnd.should.be.exactly(1);
      r.RangeStart.should.be.exactly(0);
      rT.RangeStart.should.be.exactly(5);
      r.RangeEnd.should.be.exactly(10);
      rT.RangeEnd.should.be.exactly(10);
    });

    it('RangeEnd', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);
      var rT = r.SetRangeEnd(20);
      r.Type.should.be.exactly('linear');
      rT.Type.should.be.exactly('linear');
      r.ValueStart.should.be.exactly(-1);
      rT.ValueStart.should.be.exactly(-1);
      r.ValueEnd.should.be.exactly(1);
      rT.ValueEnd.should.be.exactly(1);
      r.RangeStart.should.be.exactly(0);
      rT.RangeStart.should.be.exactly(0);
      r.RangeEnd.should.be.exactly(10);
      rT.RangeEnd.should.be.exactly(20);
    });
  });
  describe('Basic', () => {
    it('Linear', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);

      r.ValueAt(0).should.be.approximately(-1, tolerance);
      r.ValueAt(10).should.be.approximately(1, tolerance);
      r.ValueAt(5).should.be.approximately(0, tolerance);
    });
    it('Serial', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, 0, 10);

      var str = r.ToStr();
      var rClone = Ramp.Ramp.FromStr(str);
      r.Equal(rClone).should.be.true;
    });
    it('Standard', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('easeOutQuad', -1, 1, 5, 15);

      r.ValueAt(0).should.be.approximately(-1, tolerance);
      r.ValueAt(3).should.be.approximately(-1, tolerance);
      r.ValueAt(5).should.be.approximately(-1, tolerance);
      r.ValueAt(15).should.be.approximately(1, tolerance);
      r.ValueAt(25).should.be.approximately(1, tolerance);

      r.ValueAt(10).should.be.approximately(0.5, tolerance);
      r.ValueAt(8).should.be.approximately(0.02, tolerance);
      r.ValueAt(12).should.be.approximately(0.81, tolerance);
    });
    it('Value at Negatives', () => {
      var r: Ramp.Ramp = new Ramp.Ramp('linear', -1, 1, -5, 15);

      r.ValueAt(-50).should.be.approximately(-1, tolerance);
      r.ValueAt(-5).should.be.approximately(-1, tolerance);
      r.ValueAt(15).should.be.approximately(1, tolerance);
      r.ValueAt(25).should.be.approximately(1, tolerance);

      r.ValueAt(-3).should.be.approximately(-0.8, tolerance);
      r.ValueAt(0).should.be.approximately(-0.5, tolerance);
      r.ValueAt(10).should.be.approximately(0.5, tolerance);
      r.ValueAt(15).should.be.approximately(1, tolerance);
    });
  });
  describe('Mix', () => {
    var Mix = Ramp.Ramp.Mix;
    it('Simple', () => {
      var r1: Ramp.Ramp = new Ramp.Ramp('linear', 0, 1, 0, 10);
      var r2: Ramp.Ramp = new Ramp.Ramp('linear', 1, 2, 0, 10);

      //r1,r2,fraction 0-1,range
      var mix = Mix(r1, r2, 0, 0);
      mix.should.be.a.Number.and.be.approximately(0, tolerance);
      mix = Mix(r1, r2, 0, 10);
      mix.should.be.a.Number.and.be.approximately(1, tolerance);

      mix = Mix(r1, r2, 1, 0);
      mix.should.be.a.Number.and.be.approximately(1, tolerance);
      mix = Mix(r1, r2, 1, 10);
      mix.should.be.a.Number.and.be.approximately(2, tolerance);

      mix = Mix(r1, r2, 0.5, 0);
      mix.should.be.a.Number.and.be.approximately(0.5, tolerance);
      mix = Mix(r1, r2, 0.5, 10);
      mix.should.be.a.Number.and.be.approximately(0.5 * 1 + 0.5 * 2, tolerance);
      mix = Mix(r1, r2, 0.5, 105);
      mix.should.be.a.Number.and.be.approximately(0.5 * 1 + 0.5 * 2, tolerance);

    });
  });
  describe('Ease', () => {
    var Ease = Ramp.Ramp.Ease;
    it('Default', () => {
      var result = Ease();
      result.should.be.a.Number.and.be.approximately(0, tolerance);

      result = Ease('easeOutQuad', 0, 0, 10, 10);
      result.should.be.a.Number.and.be.approximately(0, tolerance);

      result = Ease('easeOutQuad', 10, 0, 5, 10);
      result.should.be.a.Number.and.be.approximately(5, tolerance);

      result = Ease('easeOutQuad', 5, 0, 5, 10);
      result.should.be.a.Number.and.be.approximately(3.75, tolerance);

    });
    it('Linear', () => {
      var result = Ease('linear', 0, -10, 20, 10);
      result.should.be.a.Number.and.be.approximately(-10, tolerance);
      result = Ease('linear', 5, -10, 20, 10);
      result.should.be.a.Number.and.be.approximately(0, tolerance);
      result = Ease('linear', 5, 10, -20, 10);
      result.should.be.a.Number.and.be.approximately(0, tolerance);
      result = Ease('linear', 7.5, 10, -20, 10);
      result.should.be.a.Number.and.be.approximately(-5, tolerance);
    });
  });
  describe('Falloff', () => {
    it('Init', () => {
      var falloff = new Ramp.Falloff([]);
      falloff.Ramps.should.have.lengthOf(0);

      falloff.ValueAt(0).should.be.approximately(1, tolerance, '0');
      falloff.ValueAt(1).should.be.approximately(1, tolerance, '1');
      falloff.ValueAt(2).should.be.approximately(1, tolerance);
      falloff.ValueAt(190).should.be.approximately(1, tolerance);
    });
    it('Basic', () => {
      var falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 4, 0, 0, 2)]);
      falloff.Ramps.should.have.lengthOf(1);

      falloff.ValueAt(0).should.be.approximately(4, tolerance, '0');
      falloff.ValueAt(1).should.be.approximately(2, tolerance, '1');
      falloff.ValueAt(2).should.be.approximately(0, tolerance);
      falloff.ValueAt(190).should.be.approximately(0, tolerance);
    });
    it('Multiple', () => {
      var falloff = new Ramp.Falloff([
        new Ramp.Ramp('linear', 4, 0, 10, 20),
        new Ramp.Ramp('linear', 50, 10, 15, 25)
      ]);
      falloff.Ramps.should.have.lengthOf(2);

      falloff.ValueAt(0).should.be.approximately(4, tolerance, '0');
      falloff.ValueAt(5).should.be.approximately(4, tolerance, '1');
      falloff.ValueAt(10).should.be.approximately(4, tolerance);
      falloff.ValueAt(15).should.be.approximately(2 * 50, tolerance);
      falloff.ValueAt(20).should.be.approximately(0 * 30, tolerance);
      falloff.ValueAt(25).should.be.approximately(10, tolerance);
      falloff.ValueAt(225).should.be.approximately(10, tolerance);
    });
  });
  describe('Decay', () => {
    it('Init', () => {
      var decay = new Ramp.Decay(moment.duration(2, 'hours'),
        new Ramp.Falloff([new Ramp.Ramp('linear', 4, 0, 0, 2)]));
      decay.Falloff.Ramps.should.have.lengthOf(1);
    });
    it('Basic', () => {
      var decay = new Ramp.Decay(moment.duration(2, 'hours'),
        new Ramp.Falloff([new Ramp.Ramp('linear', 4, 0, 0, 2)]));

      var originDate: moment.Moment = moment("2015-08-04T00:00:00.000Z");
      var currentDate: moment.Moment = moment("2015-08-04T00:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(4, tolerance);

      originDate = moment("2015-08-04T00:00:00.000Z");
      currentDate = moment("2015-08-04T01:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(2, tolerance);

      originDate = moment("2015-08-04T00:00:00.000Z");
      currentDate = moment("2015-08-04T02:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(0, tolerance);

      originDate = moment("2015-08-04T00:00:00.000Z");
      currentDate = moment("2015-08-04T05:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(0, tolerance);


      originDate = moment("2015-08-04T00:00:00.000Z");
      currentDate = moment("2015-08-03T23:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(2, tolerance, '-1');

      originDate = moment("2015-08-04T00:00:00.000Z");
      currentDate = moment("2015-08-03T22:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(0, tolerance, '-2');

      originDate = moment("2015-08-04T00:00:00.000Z");
      currentDate = moment("2015-08-01T22:00:00.000Z");
      decay.ValueAt(originDate, currentDate).should.be.approximately(0, tolerance, '-many');

    });
  });
  describe('Factor', () => {
    it('Init', () => {
      var decay = new Ramp.Decay(moment.duration(2, 'hours'),
        new Ramp.Falloff([new Ramp.Ramp('linear', 4, 0, 0, 2)]));
      var falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 10, 2, 0, 4)]);
      var factor = new Ramp.Factor(decay, falloff);
      factor.Falloff.Ramps.should.have.lengthOf(1);

    });
    it('Basic', () => {
      var decay = new Ramp.Decay(moment.duration(2, 'hours'),
        new Ramp.Falloff([new Ramp.Ramp('linear', 4, 0, 0, 2)]));
      var falloff = new Ramp.Falloff([new Ramp.Ramp('linear', 10, 2, 0, 4)]);
      var factor = new Ramp.Factor(decay, falloff);

      factor.IntensityAtDistance(1).should.be.approximately(falloff.ValueAt(1), tolerance);
      factor.IntensityAtDistance(20).should.be.approximately(falloff.ValueAt(20), tolerance);
      factor.IntensityAtDistance(-51).should.be.approximately(falloff.ValueAt(-51), tolerance);
      factor.IntensityAtDistance(0).should.be.approximately(falloff.ValueAt(0), tolerance);
      factor.IntensityAtDistance(9032465.346).should.be.approximately(falloff.ValueAt(9032465.346), tolerance);


      var duration = moment.duration(1, 'hours');
      factor.IntensityAtDuration(duration).should.be.approximately(decay.ValueAfterDuration(duration), tolerance);
      duration = moment.duration(2, 'hours');
      factor.IntensityAtDuration(duration).should.be.approximately(decay.ValueAfterDuration(duration), tolerance);
      duration = moment.duration(200, 'hours');
      factor.IntensityAtDuration(duration).should.be.approximately(decay.ValueAfterDuration(duration), tolerance);
      duration = moment.duration(24, 'hours');
      factor.IntensityAtDuration(duration).should.be.approximately(decay.ValueAfterDuration(duration), tolerance);

      var distance = 1;
      duration = moment.duration(2, 'hours');
      factor.IntensityAtDistanceAndDuration(distance, duration)
        .should.be.approximately(
          falloff.ValueAt(distance) * decay.ValueAfterDuration(duration), tolerance);


      distance = 51;
      duration = moment.duration(0.2, 'hours');
      factor.IntensityAtDistanceAndDuration(distance, duration)
        .should.be.approximately(
          falloff.ValueAt(distance) * decay.ValueAfterDuration(duration), tolerance);

    });
  });
});
