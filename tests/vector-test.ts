/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var vector = require('../math/vector');

describe('Vector', () => {
describe('Vector2', () => {
  it('Init', () => {
    var v2 = new vector.Vector2(5,10);
    v2.x.should.be.exactly(5);
    v2.y.should.be.exactly(10);
  });
  it('Init Error', () => {
      (() => {
        new vector.Vector2.build(7);
      }).should.throw();
      (() => {
        new vector.Vector2.build([7]);
      }).should.throw();
  });
  it('Equals', () => {
    var v2 = new vector.Vector2(5,10);
    var v2A = new vector.Vector2(5,10);
    vector.Vector2.Equal(v2,v2A).should.be.exactly(true);
    v2.equal(v2A).should.be.exactly(true);
    var v2 = new vector.Vector2(5,11);
    var v2A = new vector.Vector2(5,10);
    vector.Vector2.Equal(v2,v2A).should.be.exactly(false);
    v2.equal(v2A).should.be.exactly(false);
  });
  describe('Distance', () => {
    it('Simple static', () => {
      var v2A = new vector.Vector2(0,0);
      var v2B = new vector.Vector2(10,0);
      var distance = vector.Vector2.DistanceTo(v2A,v2B);
      distance.should.be.exactly(10);
    });
    it('Simple', () => {
      var v2A = new vector.Vector2(0,0);
      var v2B = new vector.Vector2(10,0);
      var distance = v2A.distanceTo(v2B);
      distance.should.be.exactly(10);
    });
    it('Complex', () => {
      var v2A = new vector.Vector2(-10,-10);
      var v2B = new vector.Vector2(10,10);
      var distance = v2A.distanceTo(v2B);
      distance.should.be.approximately(28.28,0.05);
    });
  });
});

describe('Vector3', () => {
  it('Init', () => {
    var v3 = new vector.Vector3(5,10,90);
    v3.x.should.be.exactly(5);
    v3.y.should.be.exactly(10);
    v3.z.should.be.exactly(90);
  });
  it('Init Error', () => {
      (() => {
        new vector.Vector3.build(7);
      }).should.throw();
      (() => {
        new vector.Vector3.build([7]);
      }).should.throw();
  });
  describe('Distance', () => {
    it('Simple static', () => {
      var v3A = new vector.Vector3(0,0,0);
      var v3B = new vector.Vector3(10,0,0);
      var distance = vector.Vector3.DistanceTo(v3A,v3B);
      distance.should.be.exactly(10);
    });
    it('Simple', () => {
      var v3A = new vector.Vector3(0,0,0);
      var v3B = new vector.Vector3(10,0,0);
      var distance = v3A.distanceTo(v3B);
      distance.should.be.exactly(10);
    });
    it('Complex', () => {
      var v3A = new vector.Vector3(-10,-10,-10);
      var v3B = new vector.Vector3(10,10,10);
      var distance = v3A.distanceTo(v3B);
      distance.should.be.approximately(34.64,0.05);
    });
  });


});

describe('Vector4', () => {
  it('Init', () => {
    var v3 = new vector.Vector4(5,10,90,8);
    v3.x.should.be.exactly(5);
    v3.y.should.be.exactly(10);
    v3.z.should.be.exactly(90);
    v3.w.should.be.exactly(8);
  });
  it('Init Error', () => {
      (() => {
        new vector.Vector4.build(7);
      }).should.throw();
      (() => {
        new vector.Vector4.build([7]);
      }).should.throw();
  });
  describe('Distance', () => {
    it('Simple static', () => {
      var v4A = new vector.Vector4(0,0,0,0);
      var v4B = new vector.Vector4(0,0,0,10);
      var distance = vector.Vector4.DistanceTo(v4A,v4B);
      distance.should.be.exactly(10);
    });
    it('Simple', () => {
      var v4A = new vector.Vector4(0,0,0,0);
      var v4B = new vector.Vector4(0,0,0,10);
      var distance = v4A.distanceTo(v4B);
      distance.should.be.exactly(10);
    });
    it('Complex', () => {
      var v4A = new vector.Vector4(-10,-10,-10,-10);
      var v4B = new vector.Vector4(10,10,10,10);
      var distance = v4A.distanceTo(v4B);
      distance.should.be.approximately(40,0.05);
    });
  });

});


});
