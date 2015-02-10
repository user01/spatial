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
});

describe('Vector3', () => {


});

describe('Vector4', () => {
});


});
