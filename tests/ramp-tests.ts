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
  describe('Ease', () => {
    var Ease = ramp.Ease;
    it('Default', () => {
      var result = Ease();
      result.should.be.a.Number.and.be.approximately(0,tolerance);
    });
  });
});
