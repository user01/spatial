/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/should.d.ts" />
/// <reference path="../math/references.ts" />
"use strict";
var should = require('should');
var Ramp = require('../math/ramp');
var Vector = require('../math/vector');
describe('Vector', function () {
    describe('Vector2', function () {
        it('Init', function () {
            var v2 = new Vector.Vector2(5, 10);
            v2.x.should.be.exactly(5);
            v2.y.should.be.exactly(10);
        });
        it('Serial', function () {
            var v2 = new Vector.Vector2(5, 10);
            var str = v2.ToStr();
            var v2Clone = Vector.Vector2.FromStr(str);
            v2.Equal(v2Clone).should.be.true;
        });
        it('Clone', function () {
            var v2 = new Vector.Vector2(5, 10);
            var v2Clone = v2.Clone();
            v2.Equal(v2Clone).should.be.true;
        });
        it('Init Error', function () {
            (function () {
                Vector.Vector2.Build([7]);
            }).should.throw();
        });
        it('Equals', function () {
            var v2 = new Vector.Vector2(5, 10);
            var v2A = new Vector.Vector2(5, 10);
            Vector.Vector2.EqualStatic(v2, v2A).should.be.exactly(true);
            v2.Equal(v2A).should.be.exactly(true);
            var v2 = new Vector.Vector2(5, 11);
            var v2A = new Vector.Vector2(5, 10);
            Vector.Vector2.EqualStatic(v2, v2A).should.be.exactly(false);
            v2.Equal(v2A).should.be.exactly(false);
        });
        describe('Distance', function () {
            it('Simple static', function () {
                var v2A = new Vector.Vector2(0, 0);
                var v2B = new Vector.Vector2(10, 0);
                var distance = Vector.Vector2.DistanceToStatic(v2A, v2B);
                distance.should.be.exactly(10);
            });
            it('Simple', function () {
                var v2A = new Vector.Vector2(0, 0);
                var v2B = new Vector.Vector2(10, 0);
                var distance = v2A.DistanceTo(v2B);
                distance.should.be.exactly(10);
            });
            it('Complex', function () {
                var v2A = new Vector.Vector2(-10, -10);
                var v2B = new Vector.Vector2(10, 10);
                var distance = v2A.DistanceTo(v2B);
                distance.should.be.approximately(28.28, 0.05);
            });
        });
        describe('Intensity', function () {
            it('Simple', function () {
                var ramp = new Ramp.Ramp('linear', 10, 0, 10, 110);
                var v2A = new Vector.Vector2(0, 0, new Ramp.Factor(Ramp.Decay.PermanentDecay(), new Ramp.Falloff([ramp])));
                var v2B = new Vector.Vector2(0, 0);
                var intensity = v2A.IntensityAtDistance(v2B);
                intensity.should.be.exactly(10);
                v2B = new Vector.Vector2(0, 10);
                intensity = v2A.IntensityAtDistance(v2B);
                intensity.should.be.exactly(10);
                v2B = new Vector.Vector2(0, 60);
                intensity = v2A.IntensityAtDistance(v2B);
                intensity.should.be.exactly(5);
                v2B = new Vector.Vector2(0, 110);
                intensity = v2A.IntensityAtDistance(v2B);
                intensity.should.be.exactly(0);
                v2B = new Vector.Vector2(-500, 110);
                intensity = v2A.IntensityAtDistance(v2B);
                intensity.should.be.exactly(0);
            });
        });
    });
    describe('Vector3', function () {
        it('Init', function () {
            var v3 = new Vector.Vector3(5, 10, 90);
            v3.x.should.be.exactly(5);
            v3.y.should.be.exactly(10);
            v3.z.should.be.exactly(90);
        });
        it('Init Error', function () {
            (function () {
                Vector.Vector3.Build([7]);
            }).should.throw();
        });
        describe('Distance', function () {
            it('Simple static', function () {
                var v3A = new Vector.Vector3(0, 0, 0);
                var v3B = new Vector.Vector3(10, 0, 0);
                var distance = Vector.Vector3.DistanceToStatic(v3A, v3B);
                distance.should.be.exactly(10);
            });
            it('Simple', function () {
                var v3A = new Vector.Vector3(0, 0, 0);
                var v3B = new Vector.Vector3(10, 0, 0);
                var distance = v3A.DistanceTo(v3B);
                distance.should.be.exactly(10);
            });
            it('Complex', function () {
                var v3A = new Vector.Vector3(-10, -10, -10);
                var v3B = new Vector.Vector3(10, 10, 10);
                var distance = v3A.DistanceTo(v3B);
                distance.should.be.approximately(34.64, 0.05);
            });
        });
        describe('Cross', function () {
            it('Simple static', function () {
                var v3A = new Vector.Vector3(4, 4, 4);
                var v3B = new Vector.Vector3(-3, -3, -3);
                var v3Crossed = new Vector.Vector3(0, 0, 0);
                var cross = Vector.Vector3.CrossStatic(v3A, v3B);
                cross.Equal(v3Crossed).should.be.true;
            });
            it('Simple', function () {
                var v3A = new Vector.Vector3(1 / 4, -1 / 2, 1);
                var v3B = new Vector.Vector3(1 / 3, 1, -2 / 3);
                var v3Crossed = new Vector.Vector3(-2 / 3, 1 / 2, 5 / 12);
                var cross = v3A.Cross(v3B);
                cross.Equal(v3Crossed).should.be.true;
            });
        });
    });
    describe('Vector4', function () {
        it('Init', function () {
            var v3 = new Vector.Vector4(5, 10, 90, 8);
            v3.x.should.be.exactly(5);
            v3.y.should.be.exactly(10);
            v3.z.should.be.exactly(90);
            v3.w.should.be.exactly(8);
        });
        it('Init Error', function () {
            (function () {
                Vector.Vector4.Build([7]);
            }).should.throw();
        });
        describe('Distance', function () {
            it('Simple static', function () {
                var v4A = new Vector.Vector4(0, 0, 0, 0);
                var v4B = new Vector.Vector4(0, 0, 0, 10);
                var distance = Vector.Vector4.DistanceToStatic(v4A, v4B);
                distance.should.be.exactly(10);
            });
            it('Simple', function () {
                var v4A = new Vector.Vector4(0, 0, 0, 0);
                var v4B = new Vector.Vector4(0, 0, 0, 10);
                var distance = v4A.DistanceTo(v4B);
                distance.should.be.exactly(10);
            });
            it('Complex', function () {
                var v4A = new Vector.Vector4(-10, -10, -10, -10);
                var v4B = new Vector.Vector4(10, 10, 10, 10);
                var distance = v4A.DistanceTo(v4B);
                distance.should.be.approximately(40, 0.05);
            });
        });
    });
});
//# sourceMappingURL=vector-test.js.map