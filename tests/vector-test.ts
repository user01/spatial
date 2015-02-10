/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var spatial = require('../math/vector');

describe('Vector', () => {
describe('Vector2', () => {
  it('Init', () => {
    var v2 = new spatial.Vector2(5,10);
    v2.x.should.be.exactly(5);
    v2.y.should.be.exactly(10);
  });
  it('Init Error', () => {
      (() => {
        new spatial.build(7);
      }).should.throw();
      (() => {
        new spatial.build([7]);
      }).should.throw();
  });
  describe('Distance', () => {
    it('Simple static', () => {
      var v2A = new spatial.Vector2(0,0);
      var v2B = new spatial.Vector2(10,0);
      var distance = spatial.Vector2.DistanceTo(v2A,v2B);
      distance.should.be.exactly(10);
    });
    it('Simple', () => {
      var v2A = new spatial.Vector2(0,0);
      var v2B = new spatial.Vector2(10,0);
      var distance = v2A.distanceTo(v2B);
      distance.should.be.exactly(10);
    });
    it('Complex', () => {
      var v2A = new spatial.Vector2(-10,-10);
      var v2B = new spatial.Vector2(10,10);
      var distance = v2A.distanceTo(v2B);
      distance.should.be.approximately(28.28,0.05);
    });
  });
});

describe('Vector3', () => {


});

describe('Vector4', () => {
});


});
