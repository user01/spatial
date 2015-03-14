/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var spatial = require('../spatial.node');
var tolerance = 0.05;

//var vector2:Spatial.Vector2 = spatial.Vector2;
var ramp = spatial.Ramp;


describe('Ramp', () => {
  it('Construct', () => {
    var r1:Spatial.Ramp = new ramp();
    r1.type.should.be.a.String.and.be.exactly('easeOutQuad');
    //true.should.be.exactly(false);
  });
  describe('Basic', () => {
    it('Linear', () => {
      var r:Spatial.Ramp = new spatial.Ramp('linear',-1,1,0,10);

      r.valueAt(0).should.be.approximately(-1,tolerance);
      r.valueAt(10).should.be.approximately(1,tolerance);
      r.valueAt(5).should.be.approximately(0,tolerance);
    });
    it('Serial', () => {
      var r:Spatial.Ramp = new spatial.Ramp('linear',-1,1,0,10);

      var str = r.toStr();
      var rClone = spatial.Ramp.fromStr(str);
      r.equal(rClone).should.be.true;
    });
    it('Standard', () => {
      var r:Spatial.Ramp = new spatial.Ramp('easeOutQuad',-1,1,5,15);

      r.valueAt(0).should.be.approximately(-1,tolerance);
      r.valueAt(3).should.be.approximately(-1,tolerance);
      r.valueAt(5).should.be.approximately(-1,tolerance);
      r.valueAt(15).should.be.approximately(1,tolerance);
      r.valueAt(25).should.be.approximately(1,tolerance);

      r.valueAt(10).should.be.approximately(0.5,tolerance);
      r.valueAt(8).should.be.approximately(0.02,tolerance);
      r.valueAt(12).should.be.approximately(0.81,tolerance);
    });
  });
  describe('Ease', () => {
    var Ease = ramp.Ease;
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
