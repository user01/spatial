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
        new spatial.Vector2.build(7);
      }).should.throw();
      (() => {
        new spatial.Vector2.build([7]);
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
  it('Init', () => {
    var v3 = new spatial.Vector3(5,10,90);
    v3.x.should.be.exactly(5);
    v3.y.should.be.exactly(10);
    v3.z.should.be.exactly(90);
  });
  it('Init Error', () => {
      (() => {
        new spatial.Vector3.build(7);
      }).should.throw();
      (() => {
        new spatial.Vector3.build([7]);
      }).should.throw();
  });
  describe('Distance', () => {
    it('Simple static', () => {
      var v3A = new spatial.Vector3(0,0,0);
      var v3B = new spatial.Vector3(10,0,0);
      var distance = spatial.Vector3.DistanceTo(v3A,v3B);
      distance.should.be.exactly(10);
    });
    it('Simple', () => {
      var v3A = new spatial.Vector3(0,0,0);
      var v3B = new spatial.Vector3(10,0,0);
      var distance = v3A.distanceTo(v3B);
      distance.should.be.exactly(10);
    });
    it('Complex', () => {
      var v3A = new spatial.Vector3(-10,-10,-10);
      var v3B = new spatial.Vector3(10,10,10);
      var distance = v3A.distanceTo(v3B);
      distance.should.be.approximately(34.64,0.05);
    });
  });


});

describe('Vector4', () => {
  it('Init', () => {
    var v3 = new spatial.Vector4(5,10,90,8);
    v3.x.should.be.exactly(5);
    v3.y.should.be.exactly(10);
    v3.z.should.be.exactly(90);
    v3.w.should.be.exactly(8);
  });
  it('Init Error', () => {
      (() => {
        new spatial.Vector4.build(7);
      }).should.throw();
      (() => {
        new spatial.Vector4.build([7]);
      }).should.throw();
  });
  describe('Distance', () => {
    it('Simple static', () => {
      var v4A = new spatial.Vector4(0,0,0,0);
      var v4B = new spatial.Vector4(0,0,0,10);
      var distance = spatial.Vector4.DistanceTo(v4A,v4B);
      distance.should.be.exactly(10);
    });
    it('Simple', () => {
      var v4A = new spatial.Vector4(0,0,0,0);
      var v4B = new spatial.Vector4(0,0,0,10);
      var distance = v4A.distanceTo(v4B);
      distance.should.be.exactly(10);
    });
    it('Complex', () => {
      var v4A = new spatial.Vector4(-10,-10,-10,-10);
      var v4B = new spatial.Vector4(10,10,10,10);
      var distance = v4A.distanceTo(v4B);
      distance.should.be.approximately(40,0.05);
    });
  });

});


});
