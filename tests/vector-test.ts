/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var spatial = require('../spatial.node');

//var vector2:Spatial.Vector2 = spatial.Vector2;
var vector2 = spatial.Vector2;
var vector3 = spatial.Vector3;
var vector4 = spatial.Vector4;


describe('Vector', () => {
describe('Vector2', () => {
  it('Init', () => {
    var v2:Spatial.Vector2 = new vector2(5,10);
    v2.x.should.be.exactly(5);
    v2.y.should.be.exactly(10);
  });

  it('Serial', () => {
    var v2:Spatial.Vector2 = new vector2(5,10);
    var str = v2.toStr();
    var v2Clone = vector2.fromStr(str);
    v2.equal(v2Clone).should.be.true;
  });

  it('Clone', () => {
    var v2:Spatial.Vector2 = new vector2(5,10);
    var v2Clone = v2.clone();
    v2.equal(v2Clone).should.be.true;
  });


  it('Init Error', () => {
      (() => {
        new spatial.Vector2.build(7);
      }).should.throw();
      (() => {
        new spatial.Vector2.build([7]);
      }).should.throw();
  });
  it('Equals', () => {
    var v2 = new spatial.Vector2(5,10);
    var v2A = new spatial.Vector2(5,10);
    spatial.Vector2.Equal(v2,v2A).should.be.exactly(true);
    v2.equal(v2A).should.be.exactly(true);
    var v2 = new spatial.Vector2(5,11);
    var v2A = new spatial.Vector2(5,10);
    spatial.Vector2.Equal(v2,v2A).should.be.exactly(false);
    v2.equal(v2A).should.be.exactly(false);
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

  describe('Intensity', () => {
    it('Simple', () => {
      var ramp:Spatial.Ramp = new spatial.Ramp('linear',10,0,10,110);
      var v2A:Spatial.Vector2 = new spatial.Vector2(0,0,ramp);

      var v2B:Spatial.Vector2 = new spatial.Vector2(0,0);
      var intensity = v2A.intensityAt(v2B);
      intensity.should.be.exactly(10);

      v2B = new spatial.Vector2(0,10);
      intensity = v2A.intensityAt(v2B);
      intensity.should.be.exactly(10);

      v2B = new spatial.Vector2(0,60);
      intensity = v2A.intensityAt(v2B);
      intensity.should.be.exactly(5);

      v2B = new spatial.Vector2(0,110);
      intensity = v2A.intensityAt(v2B);
      intensity.should.be.exactly(0);

      v2B = new spatial.Vector2(-500,110);
      intensity = v2A.intensityAt(v2B);
      intensity.should.be.exactly(0);
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
  describe('Cross', () => {
    it('Simple static', () => {
      var v3A = new spatial.Vector3(4,4,4);
      var v3B = new spatial.Vector3(-3,-3,-3);
      var v3Crossed = new spatial.Vector3(0,0,0);
      var cross = spatial.Vector3.Cross(v3A,v3B);
      cross.equal(v3Crossed).should.be.true;
    });
    it('Simple', () => {
      var v3A = new spatial.Vector3(1/4,-1/2,1);
      var v3B = new spatial.Vector3(1/3,1,-2/3);
      var v3Crossed = new spatial.Vector3(-2/3,1/2,5/12);
      var cross = v3A.cross(v3B);
      cross.equal(v3Crossed).should.be.true;
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
