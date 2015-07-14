/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe: any;
declare var it: any;

var should: Internal = require('should');
var tolerance = 0.05;



describe('Ramp', () => {
  it('Construct', () => {
    var r1: Spatial.Ramp = new Spatial.Ramp();
    r1.Type.should.be.a.String.and.be.exactly('easeOutQuad');
  });
  it('Clone', () => {
    var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
    var clone = r.Clone();
    r.Equal(clone).should.be.true;
  });
  it('Build', () => {
    var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
    var rA = Spatial.Ramp.Build(r);
    r.Equal(rA).should.be.true;
    var rB = Spatial.Ramp.Build();
    should.exist(rB);
    var rC = Spatial.Ramp.Build('linear');
    should.exist(rC);
  });
  it('Bad type', () => {
    var rC = Spatial.Ramp.Build('mittens');
    rC.Type.should.be.exactly('easeOutQuad');
  });
  describe('Setting new values', () => {

    it('Type', () => {
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
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
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
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
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
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
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
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
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);
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
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);

      r.ValueAt(0).should.be.approximately(-1, tolerance);
      r.ValueAt(10).should.be.approximately(1, tolerance);
      r.ValueAt(5).should.be.approximately(0, tolerance);
    });
    it('Serial', () => {
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, 0, 10);

      var str = r.ToStr();
      var rClone = Spatial.Ramp.FromStr(str);
      r.Equal(rClone).should.be.true;
    });
    it('Standard', () => {
      var r: Spatial.Ramp = new Spatial.Ramp('easeOutQuad', -1, 1, 5, 15);

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
      var r: Spatial.Ramp = new Spatial.Ramp('linear', -1, 1, -5, 15);

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
    var Mix = Spatial.Ramp.Mix;
    it('Simple', () => {
      var r1: Spatial.Ramp = new Spatial.Ramp('linear', 0, 1, 0, 10);
      var r2: Spatial.Ramp = new Spatial.Ramp('linear', 1, 2, 0, 10);

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
    var Ease = Spatial.Ramp.Ease;
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
});
