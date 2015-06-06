/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var tolerance = 0.05;



describe('Ramp', () => {
  it('Construct', () => {
    var r1:Spatial.Ramp = new Spatial.Ramp();
    r1.type.should.be.a.String.and.be.exactly('easeOutQuad');
    //true.should.be.exactly(false);
  });
  it('Clone', () => {
    var r:Spatial.Ramp = new Spatial.Ramp('linear',-1,1,0,10);
    var clone = r.Clone();
    r.Equal(clone).should.be.true;
    //true.should.be.exactly(false);
  });
  describe('Basic', () => {
    it('Linear', () => {
      var r:Spatial.Ramp = new Spatial.Ramp('linear',-1,1,0,10);

      r.ValueAt(0).should.be.approximately(-1,tolerance);
      r.ValueAt(10).should.be.approximately(1,tolerance);
      r.ValueAt(5).should.be.approximately(0,tolerance);
    });
    it('Serial', () => {
      var r:Spatial.Ramp = new Spatial.Ramp('linear',-1,1,0,10);

      var str = r.ToStr();
      var rClone = Spatial.Ramp.FromStr(str);
      r.Equal(rClone).should.be.true;
    });
    it('Standard', () => {
      var r:Spatial.Ramp = new Spatial.Ramp('easeOutQuad',-1,1,5,15);

      r.ValueAt(0).should.be.approximately(-1,tolerance);
      r.ValueAt(3).should.be.approximately(-1,tolerance);
      r.ValueAt(5).should.be.approximately(-1,tolerance);
      r.ValueAt(15).should.be.approximately(1,tolerance);
      r.ValueAt(25).should.be.approximately(1,tolerance);

      r.ValueAt(10).should.be.approximately(0.5,tolerance);
      r.ValueAt(8).should.be.approximately(0.02,tolerance);
      r.ValueAt(12).should.be.approximately(0.81,tolerance);
    });
  });
  describe('Mix', () => {
    var Mix = Spatial.Ramp.Mix;
    it('Simple', () => {
      var r1:Spatial.Ramp = new Spatial.Ramp('linear',0,1,0,10);
      var r2:Spatial.Ramp = new Spatial.Ramp('linear',1,2,0,10);

      //r1,r2,fraction 0-1,range
      var mix = Mix(r1,r2,0,0);
      mix.should.be.a.Number.and.be.approximately(0,tolerance);
      mix = Mix(r1,r2,0,10);
      mix.should.be.a.Number.and.be.approximately(1,tolerance);

      mix = Mix(r1,r2,1,0);
      mix.should.be.a.Number.and.be.approximately(1,tolerance);
      mix = Mix(r1,r2,1,10);
      mix.should.be.a.Number.and.be.approximately(2,tolerance);

      mix = Mix(r1,r2,0.5,0);
      mix.should.be.a.Number.and.be.approximately(0.5,tolerance);
      mix = Mix(r1,r2,0.5,10);
      mix.should.be.a.Number.and.be.approximately(0.5 * 1 + 0.5 * 2,tolerance);
      mix = Mix(r1,r2,0.5,105);
      mix.should.be.a.Number.and.be.approximately(0.5 * 1 + 0.5 * 2,tolerance);

    });
  });
  describe('Ease', () => {
    var Ease = Spatial.Ramp.Ease;
    it('Default', () => {
      var result = Ease();
      result.should.be.a.Number.and.be.approximately(0,tolerance);

      result = Ease('easeOutQuad',0,0,10,10);
      result.should.be.a.Number.and.be.approximately(0,tolerance);

      result = Ease('easeOutQuad',10,0,5,10);
      result.should.be.a.Number.and.be.approximately(5,tolerance);

      result = Ease('easeOutQuad',5,0,5,10);
      result.should.be.a.Number.and.be.approximately(3.75,tolerance);

    });
    it('Linear', () => {
      var result = Ease('linear',0,-10,20,10);
      result.should.be.a.Number.and.be.approximately(-10,tolerance);
      result = Ease('linear',5,-10,20,10);
      result.should.be.a.Number.and.be.approximately(0,tolerance);
      result = Ease('linear',5,10,-20,10);
      result.should.be.a.Number.and.be.approximately(0,tolerance);
      result = Ease('linear',7.5,10,-20,10);
      result.should.be.a.Number.and.be.approximately(-5,tolerance);
    });
  });
});
