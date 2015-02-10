/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />


declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var spatial = require('../math/vector');

describe('Vector', () => {
  it('Init', () => {
    var v2 = new spatial.Vector2(0,0);
  });
  it('Init Error', () => {
      (() => new spatial.Vector2([])).should.throw();
  });
});
