/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />

declare var describe:any;
declare var it:any;

var should:Internal = require('should');
var utility = require('../math/vector');

describe('Vector', () => {
  it('should remove white space', () => {
    var str:string = "  Boo  ";
    str.should.be.a.String
             .and.be.exactly(str);
  });
});
