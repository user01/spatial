/// <reference path="./references.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector = require('./vector');
var Ramp = require('./ramp');
var SegmentBase = (function () {
    function SegmentBase(_base, _tip, _falloff) {
        var _this = this;
        this._base = _base;
        this._tip = _tip;
        this._falloff = _falloff;
        this.ReadableStr = function () {
            return 'S' + _this.Dimension + ' ' + _this.Base.readableStr() + ' > ' + _this.Tip.readableStr() + ' ' + _this.FalloffMix.ReadableStr();
        };
        this.DistanceTo = function (v) {
            return SegmentBase.DistanceToStatic(_this, v);
        };
        this.ClosestVector = function (v) {
            var t = _this.closestFraction(v);
            var newSegment = _this.Scale(t);
            return newSegment.Tip.Clone();
        };
        this.closestFraction = function (v) {
            SegmentBase.DimensionCheck(_this, v);
            var length = _this.Length;
            if (length < 0.001)
                return 0;
            var vWithoutBase = Vector.VectorBase.Subtract(v, _this.Base);
            var t = Vector.VectorBase.Dot(vWithoutBase, _this.TipWithoutBase) / (length * length);
            return Math.max(0, Math.min(1, t));
        };
        this.RestoreBase = function (v) {
            return Vector.VectorBase.Add(_this.Base, v);
        };
        this.Push = function (v) {
            return SegmentBase.Push(_this, v);
        };
        this.Scale = function (factor) {
            return SegmentBase.Scale(_this, factor);
        };
        this.Equal = function (s) {
            return SegmentBase.EqualStatic(_this, s);
        };
        this.ToObj = function () {
            return {
                t: _this.Dimension,
                b: _this.Base.ToObj(),
                e: _this.Tip.ToObj(),
                f: _this.FalloffMix.ToObj()
            };
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        if (!this._base || !this._tip ||
            (this._base.Dimension != this._tip.Dimension)) {
            throw 'Dimension Mismatch';
        }
        //force the new ramp to conform to the 0,1 0,1 to handle
        // scaling along segment and fraction to give to each end
        // var ramps = f.Ramps.map((ramp: Ramp.Ramp): Ramp.Ramp=> {
        //   return new Ramp.Ramp(ramp.Type, ramp.ValueStart, ramp.ValueEnd, 0, 1);
        // });
        // this._falloff = new Ramp.Falloff(ramps);
    }
    Object.defineProperty(SegmentBase.prototype, "Base", {
        get: function () { return this._base; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentBase.prototype, "Tip", {
        get: function () { return this._tip; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentBase.prototype, "TipWithoutBase", {
        get: function () { return Vector.VectorBase.Subtract(this._tip, this._base); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentBase.prototype, "Length", {
        get: function () { return this._base.DistanceTo(this._tip); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentBase.prototype, "Dimension", {
        get: function () { return this._tip.Dimension; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentBase.prototype, "FalloffMix", {
        get: function () { return this._falloff; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentBase.prototype, "Duration", {
        /** Longest duration for changes in decays */
        get: function () {
            var baseDuration = this.Base.Factor.Decay.Duration;
            var tipDuration = this.Tip.Factor.Decay.Duration;
            return baseDuration.asMilliseconds() > tipDuration.asMilliseconds() ? baseDuration : tipDuration;
        },
        enumerable: true,
        configurable: true
    });
    /** Intensity from segment, only via distance
     * Uses segment falloff to mix between base and tip intensity
     */
    SegmentBase.prototype.IntensityAtDistance = function (v) {
        var fractionForIntensity = this.fractionBetweenBaseAndTip(v);
        var distanceToTarget = this.DistanceTo(v);
        var c1 = this.Base.Factor.IntensityAtDistance(distanceToTarget);
        var c2 = this.Tip.Factor.IntensityAtDistance(distanceToTarget);
        var intensity = SegmentBase.MixIntensity(c1, c2, fractionForIntensity);
        return intensity;
    };
    /** Intensity from segment, via distance and time difference */
    SegmentBase.prototype.IntensityAtDistanceAndTime = function (v, originTime, currentTime) {
        var fractionForIntensity = this.fractionBetweenBaseAndTip(v);
        var distanceToTarget = this.DistanceTo(v);
        var c1 = this.Base.Factor.IntensityAtDistanceAndTime(distanceToTarget, originTime, currentTime);
        var c2 = this.Tip.Factor.IntensityAtDistanceAndTime(distanceToTarget, originTime, currentTime);
        var intensity = SegmentBase.MixIntensity(c1, c2, fractionForIntensity);
        return intensity;
    };
    /** Intensity from segment, via distance and duration */
    SegmentBase.prototype.IntensityAtDistanceAndDuration = function (v, d) {
        var fractionForIntensity = this.fractionBetweenBaseAndTip(v);
        var distanceToTarget = this.DistanceTo(v);
        var c1 = this.Base.Factor.IntensityAtDistanceAndDuration(distanceToTarget, d);
        var c2 = this.Tip.Factor.IntensityAtDistanceAndDuration(distanceToTarget, d);
        var intensity = SegmentBase.MixIntensity(c1, c2, fractionForIntensity);
        return intensity;
    };
    /** Computes the fraction between base/tip using the Falloff Mix */
    SegmentBase.prototype.fractionBetweenBaseAndTip = function (v) {
        // compute the fraction of segment, vs base to tip
        var fraction = this.closestFraction(v);
        fraction = SegmentBase.ForceToRange(0, 1, fraction);
        // adjust the fraction to match the range of the Falloff
        var fractionPositionInFalloff = fraction * (this.FalloffMix.RangeEnd - this.FalloffMix.RangeStart) + this.FalloffMix.RangeStart;
        // compute transition between base to tip
        var fractionFromFalloff = this.FalloffMix.ValueAt(fractionPositionInFalloff);
        // bind new fraction between 0 and 1, which can mix from base to tip
        var fractionForIntensity = SegmentBase.ForceToRange(0, 1, fractionFromFalloff);
        return fractionForIntensity;
    };
    /** Returns the value if 0<x<1, otherwise bind to the low, high */
    SegmentBase.ForceToRange = function (low, high, value) {
        return Math.min(1, Math.max(0, value));
    };
    /** Mix the Intensity of the base and tip, based on fraction */
    SegmentBase.MixIntensity = function (baseIntensity, tipIntensity, fraction) {
        return baseIntensity * (1 - fraction) + tipIntensity * fraction;
    };
    SegmentBase.EqualStatic = function (s, s2) {
        if (!s.Tip.Equal(s2.Tip))
            return false;
        if (!s.Base.Equal(s2.Base))
            return false;
        if (!s.FalloffMix.Equal(s2.FalloffMix))
            return false;
        return true;
    };
    SegmentBase.Scale = function (s, factor) {
        var newTip = s.RestoreBase(Vector.VectorBase.Scale(s.TipWithoutBase, factor));
        return new SegmentBase(s.Base.Clone(), newTip, s.FalloffMix);
    };
    SegmentBase.Push = function (s, v) {
        if (s.Dimension != v.Dimension)
            throw 'Dimension Mismatch';
        return new SegmentBase(Vector.VectorBase.Add(s.Base, v), Vector.VectorBase.Add(s.Tip, v), s.FalloffMix);
    };
    SegmentBase.DistanceToStatic = function (s, v) {
        SegmentBase.DimensionCheck(s, v);
        var vOnSegment = s.ClosestVector(v);
        return vOnSegment.DistanceTo(v);
    };
    SegmentBase.DimensionCheck = function (s, v) {
        if (s.Dimension != v.Dimension)
            throw 'Dimension Mismatch';
        return true;
    };
    SegmentBase.FromObj = function (obj) {
        switch (obj.t) {
            case 2:
                return new Segment2(Vector.Vector2.FromObj(obj.b), Vector.Vector2.FromObj(obj.e), Ramp.Falloff.FromObj(obj.f));
            case 3:
                return new Segment3(Vector.Vector3.FromObj(obj.b), Vector.Vector3.FromObj(obj.e), Ramp.Falloff.FromObj(obj.f));
            case 4:
                return new Segment4(Vector.Vector4.FromObj(obj.b), Vector.Vector4.FromObj(obj.e), Ramp.Falloff.FromObj(obj.f));
        }
        //default untyped
        return new SegmentBase(Vector.VectorBase.FromObj(obj.b), Vector.VectorBase.FromObj(obj.e), Ramp.Falloff.FromObj(obj.f));
    };
    SegmentBase.FromStr = function (str) {
        return SegmentBase.FromObj(JSON.parse(str));
    };
    return SegmentBase;
}());
var Segment2 = (function (_super) {
    __extends(Segment2, _super);
    function Segment2(base, tip, falloff) {
        var _this = this;
        if (falloff === void 0) { falloff = Ramp.Falloff.LinearFalloff(); }
        _super.call(this, base, tip, falloff);
        this.Push = function (v) {
            return Segment2.Push(_this, v);
        };
    }
    Object.defineProperty(Segment2.prototype, "Base", {
        get: function () {
            return this._base;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Segment2.prototype, "Tip", {
        get: function () {
            return this._tip;
        },
        enumerable: true,
        configurable: true
    });
    Segment2.Push = function (s, v) {
        return SegmentBase.Push(s, v);
    };
    return Segment2;
}(SegmentBase));
exports.Segment2 = Segment2;
var Segment3 = (function (_super) {
    __extends(Segment3, _super);
    function Segment3(base, tip, falloff) {
        var _this = this;
        if (falloff === void 0) { falloff = Ramp.Falloff.LinearFalloff(); }
        _super.call(this, base, tip, falloff);
        this.Push = function (v) {
            return Segment3.Push(_this, v);
        };
    }
    Object.defineProperty(Segment3.prototype, "Base", {
        get: function () {
            return this._base;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Segment3.prototype, "Tip", {
        get: function () {
            return this._tip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Segment3.prototype, "TipWithoutBase", {
        get: function () {
            return Vector.VectorBase.Subtract(this._tip, this._base);
        },
        enumerable: true,
        configurable: true
    });
    Segment3.Push = function (s, v) {
        return SegmentBase.Push(s, v);
    };
    Segment3.Cross = function (sA, sB) {
        var aTip = Vector.Vector3.Cast(sA.TipWithoutBase.Clone());
        var bTip = Vector.Vector3.Cast(sB.TipWithoutBase.Clone());
        var cross = aTip.Cross(bTip);
        var newTip = Vector.Vector3.Cast(sA.RestoreBase(cross));
        return new Segment3(Vector.Vector3.Cast(sA.Base), newTip);
    };
    return Segment3;
}(SegmentBase));
exports.Segment3 = Segment3;
var Segment4 = (function (_super) {
    __extends(Segment4, _super);
    function Segment4(base, tip, falloff) {
        var _this = this;
        if (falloff === void 0) { falloff = Ramp.Falloff.LinearFalloff(); }
        _super.call(this, base, tip, falloff);
        this.Push = function (v) {
            return Segment4.Push(_this, v);
        };
    }
    Object.defineProperty(Segment4.prototype, "Base", {
        get: function () {
            return this._base;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Segment4.prototype, "Tip", {
        get: function () {
            return this._tip;
        },
        enumerable: true,
        configurable: true
    });
    Segment4.Push = function (s, v) {
        return SegmentBase.Push(s, v);
    };
    return Segment4;
}(SegmentBase));
exports.Segment4 = Segment4;
var SegmentSet = (function () {
    function SegmentSet(segments) {
        var _this = this;
        this.segments = segments;
        this._dimension = 0;
        this.DistanceTo = function (v) {
            return _this.closestVectorDistance(v)[1];
        };
        this.readableStr = function () {
            return 'SS' + _this.Dimension + ' ' + _this.Segments.map(function (s) { return s.ReadableStr; }).join(';');
        };
        this.ClosestVector = function (v) {
            return _this.closestVectorDistance(v)[0];
        };
        this.Clone = function () {
            return SegmentSet.CloneStatic(_this);
        };
        this.Equal = function (ss) {
            return SegmentSet.EqualStatic(_this, ss);
        };
        this.ToObj = function () {
            return {
                s: _this.segments.map(function (s) { return s.ToObj(); })
            };
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        this.closestVectorDistance = function (v) {
            var closestVectorFound = null;
            var closestDistance = Number.MAX_VALUE;
            for (var i = 0; i < _this.segments.length; i++) {
                var computedVector = _this.segments[i].ClosestVector(v);
                var computedDistance = _this.segments[i].DistanceTo(v);
                if (closestVectorFound == null || computedDistance < closestDistance) {
                    closestVectorFound = computedVector;
                    closestDistance = computedDistance;
                }
            }
            return [closestVectorFound, closestDistance];
        };
        this.closestVectorIntensityAtDistance = function (v) {
            return _this.computeClosestVectorByCallback(v, function (sb) {
                return sb.IntensityAtDistance(v);
            });
            ;
        };
        this.closestVectorIntensityAtDistanceAndTime = function (v, originTime, currentTime) {
            return _this.computeClosestVectorByCallback(v, function (sb) {
                return sb.IntensityAtDistanceAndTime(v, originTime, currentTime);
            });
            ;
        };
        this.closestVectorIntensityAtDistanceAndDuration = function (v, d) {
            return _this.computeClosestVectorByCallback(v, function (sb) {
                return sb.IntensityAtDistanceAndDuration(v, d);
            });
            ;
        };
        /**  */
        this.computeClosestVectorByCallback = function (v, cb) {
            var bestVectorFound = null;
            var highestIntensity = Number.MIN_VALUE;
            var nonZerosFound = 0;
            var runningTotal = 0;
            for (var i = 0; i < _this.segments.length; i++) {
                var highestVector = _this.segments[i].ClosestVector(v);
                var computedIntensity = cb(_this.segments[i]);
                if (Math.abs(computedIntensity) > 0.01) {
                    nonZerosFound++;
                    runningTotal += computedIntensity;
                }
                if (bestVectorFound == null || computedIntensity > highestIntensity) {
                    bestVectorFound = highestVector;
                    highestIntensity = computedIntensity;
                }
            }
            return [
                bestVectorFound,
                nonZerosFound < 1 ? 0 : runningTotal / nonZerosFound
            ];
        };
        if ((segments === void 0) || segments.length < 1)
            throw 'Dimension Mismatch';
        this._dimension = segments[0].Dimension;
        // Ensure all dimensions match
        for (var i = 0; i < this.segments.length; i++) {
            if (segments[i].Dimension != this._dimension) {
                throw 'Dimension Mismatch';
            }
        }
    }
    Object.defineProperty(SegmentSet.prototype, "Dimension", {
        get: function () {
            return this._dimension;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentSet.prototype, "Duration", {
        /** Longest duration for changes in segmentsets */
        get: function () {
            var durations = this.segments.map(function (segmentBase) {
                return segmentBase.Duration;
            });
            return durations.reduce(function (accumulateDuration, temporalDuration) {
                return accumulateDuration.asMilliseconds() > temporalDuration.asMilliseconds() ? accumulateDuration : temporalDuration;
            }, durations[0]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentSet.prototype, "Segments", {
        /** Current segment sets */
        get: function () {
            return this.segments;
        },
        enumerable: true,
        configurable: true
    });
    /** Intensity from segment, only via distance
     * Uses segment falloff to mix between base and tip intensity
     */
    SegmentSet.prototype.IntensityAtDistance = function (v) {
        return this.closestVectorIntensityAtDistance(v)[1];
    };
    /** Intensity from segment, via distance and time difference */
    SegmentSet.prototype.IntensityAtDistanceAndTime = function (v, originTime, currentTime) {
        return this.closestVectorIntensityAtDistanceAndTime(v, originTime, currentTime)[1];
    };
    /** Intensity from segment, via distance and duration */
    SegmentSet.prototype.IntensityAtDistanceAndDuration = function (v, d) {
        return this.closestVectorIntensityAtDistanceAndDuration(v, d)[1];
    };
    SegmentSet.FromObj = function (obj) {
        var segs = obj.s.map(function (s) {
            return SegmentBase.FromObj(s);
        });
        return new SegmentSet(segs);
    };
    SegmentSet.FromStr = function (str) {
        return SegmentSet.FromObj(JSON.parse(str));
    };
    SegmentSet.CloneStatic = function (ss) {
        return SegmentSet.FromObj(ss.ToObj());
    };
    SegmentSet.EqualStatic = function (ssA, ssB) {
        if (ssA.segments.length != ssB.segments.length)
            return false;
        for (var i = 0; i < ssA.segments.length; i++) {
            if (!ssA.segments[i].Equal(ssB.segments[i]))
                return false;
        }
        return true;
    };
    SegmentSet.Merge = function (ssA, ssB) {
        if (ssA.Dimension != ssB.Dimension)
            throw 'Dimension Mismatch';
        return new SegmentSet(ssA.segments.concat(ssB.segments));
    };
    return SegmentSet;
}());
exports.SegmentSet = SegmentSet;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Segment2;
//# sourceMappingURL=segment.js.map