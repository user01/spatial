/// <reference path='./references.ts'/>
"use strict";
var moment = require('moment');
/**
 * How to handle factor values at distance and time
 */
var Factor = (function () {
    function Factor(_decay, _falloff) {
        var _this = this;
        this._decay = _decay;
        this._falloff = _falloff;
        /** Product of all Decay values at given time, ignores Falloff
         */
        this.IntensityAtTime = function (originTime, currentTime) {
            return _this.Decay.ValueAt(originTime, currentTime);
        };
        /** Value vs the duration of the Decay, ignores Falloff */
        this.IntensityAtDuration = function (duration) {
            return _this.Decay.ValueAfterDuration(duration);
        };
        /** Value vs distance with Falloff, ignoring Decay */
        this.IntensityAtDistance = function (distance) {
            return _this.Falloff.ValueAt(distance);
        };
        /** Value vs distance with Falloff and vs time Decay */
        this.IntensityAtDistanceAndTime = function (distance, originTime, currentTime) {
            return _this.Decay.ValueAt(originTime, currentTime) * _this.Falloff.ValueAt(distance);
        };
        /** Value vs distance with Falloff and vs time Decay */
        this.IntensityAtDistanceAndDuration = function (distance, duration) {
            return _this.Decay.ValueAfterDuration(duration) * _this.Falloff.ValueAt(distance);
        };
        this.ToObj = function () {
            return {
                d: _this.Decay.ToObj(),
                f: _this.Falloff.ToObj()
            };
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        this.Clone = function () {
            return Factor.CloneStatic(_this);
        };
        this.Equal = function (other) {
            return Factor.EqualStatic(_this, other);
        };
    }
    Object.defineProperty(Factor.prototype, "Decay", {
        get: function () { return this._decay; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Factor.prototype, "Falloff", {
        get: function () { return this._falloff; },
        enumerable: true,
        configurable: true
    });
    Factor.FromObj = function (obj) {
        return new Factor(Decay.FromObj(obj.d), Falloff.FromObj(obj.f));
    };
    Factor.FromStr = function (str) {
        return Factor.FromObj(JSON.parse(str));
    };
    Factor.CloneStatic = function (factor) {
        return new Factor(factor.Decay.Clone(), factor.Falloff.Clone());
    };
    Factor.EqualStatic = function (f1, f2) {
        if (!f1.Decay.Equal(f1.Decay))
            return false;
        return f1.Falloff.Equal(f2.Falloff);
    };
    Factor.PermanentFactor = function (value) {
        if (value === void 0) { value = 1; }
        return new Factor(Decay.PermanentDecay(), Falloff.PermanentFalloff(value));
    };
    return Factor;
}());
exports.Factor = Factor;
/** Decay allow combinations of response functions over a duration
 * Note the Set computes the range start and end by the minimum start
 * and maximum end of supplied ramps, but all durations are valid inputs
 * Assuming no falloff is supplied, the value defaults to 1
 */
var Decay = (function () {
    function Decay(_duration, _falloff) {
        var _this = this;
        this._duration = _duration;
        this._falloff = _falloff;
        this._durationMinutes = 0;
        this.ReadableStr = function () {
            return 'D ' + _this.Duration.humanize() + ' ' + _this.Falloff.ReadableStr();
        };
        /** Product of all Ramp values at given time
         * No ramps default to factor of 1
         */
        this.ValueAt = function (originTime, currentTime) {
            var minutesDifference = currentTime.diff(originTime, 'minutes');
            return _this.valueAtMinutes(minutesDifference);
        };
        /** Value vs the duration of the Decay */
        this.ValueAfterDuration = function (duration) {
            var minutesDuration = duration.asMinutes();
            return _this.valueAtMinutes(minutesDuration);
        };
        this.ToObj = function () {
            return {
                d: _this._duration.asSeconds(),
                f: _this.Falloff.ToObj()
            };
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        this.Clone = function () {
            return Decay.CloneState(_this);
        };
        this.Equal = function (other) {
            return Decay.EqualStatic(_this, other);
        };
        this._durationMinutes = this._duration.asMinutes();
    }
    Object.defineProperty(Decay.prototype, "Duration", {
        get: function () { return this._duration; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Decay.prototype, "Falloff", {
        get: function () { return this._falloff; },
        enumerable: true,
        configurable: true
    });
    /** Compute factor based on minute numbers */
    Decay.prototype.valueAtMinutes = function (minutesDifference) {
        var fractionOfRangeConsumedByTime = Math.abs(minutesDifference) / this._durationMinutes;
        // includes 0, so will always base off the 0, not the start
        var fractionOfRange = fractionOfRangeConsumedByTime * this.Falloff.RangeEnd;
        var factor = this.Falloff.ValueAt(fractionOfRange);
        return factor;
    };
    Decay.FromObj = function (obj) {
        return new Decay(moment.duration(obj.d, 'seconds'), Falloff.FromObj(obj.f));
    };
    Decay.FromStr = function (str) {
        return Decay.FromObj(JSON.parse(str));
    };
    Decay.CloneState = function (other) {
        return new Decay(other.Duration, other.Falloff.Clone());
    };
    Decay.EqualStatic = function (dt1, dt2) {
        if (Math.abs(dt1.Duration.asSeconds() - dt2.Duration.asSeconds()) > 0.001)
            return false;
        return dt1.Falloff.Equal(dt2.Falloff);
    };
    Decay.PermanentDecay = function () {
        return new Decay(moment.duration(5, 'minutes'), Falloff.PermanentFalloff());
    };
    return Decay;
}());
exports.Decay = Decay;
/** Falloff allow combinations of response functions over distance
 * Note the Set computes the range start and end by the minimum start
 * and maximum end of supplied ramps, but all numbers are valid inputs
 * Assuming no ramps are supplied, the value defaults to 1
 */
var Falloff = (function () {
    function Falloff(_ramps) {
        var _this = this;
        if (_ramps === void 0) { _ramps = []; }
        this._ramps = _ramps;
        this.rangeStart = 0;
        this.rangeEnd = 0;
        this.ReadableStr = function () {
            return '{' + _this.Ramps.map(function (r) { return r.ReadableStr(); }) + '}';
        };
        /** Product of all Ramp values at given time
         * Outside of all ramps, the factor defaults to the closest edge
         * No ramps default to factor of 1
         */
        this.ValueAt = function (location) {
            //Beyond the ramp, force to the closest edge
            location = (location < _this.RangeStart) ? _this.RangeStart : location;
            location = (location > _this.RangeEnd) ? _this.RangeEnd : location;
            var validRamps = _this._ramps.filter(function (ramp) {
                return (location >= ramp.RangeStart && location <= ramp.RangeEnd);
            });
            var factor = validRamps.reduce(function (accum, ramp) {
                return accum * ramp.ValueAt(location);
            }, 1);
            return factor;
        };
        this.ToObj = function () {
            return {
                r: _this._ramps.map(function (ramp) { return ramp.ToObj(); })
            };
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        this.Clone = function () {
            return Falloff.CloneStatic(_this);
        };
        this.Equal = function (other) {
            return Falloff.EqualStatic(_this, other);
        };
        this.rangeEnd = this.rangeEndCompute();
        this.rangeStart = this.rangeStartCompute();
    }
    Object.defineProperty(Falloff.prototype, "Ramps", {
        get: function () { return this._ramps; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Falloff.prototype, "RangeStart", {
        /** Earliest Start Value in ramps */
        get: function () { return this.rangeStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Falloff.prototype, "RangeEnd", {
        /** Latest End Value in ramps */
        get: function () { return this.rangeEnd; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Falloff.prototype, "Range", {
        /** Length of combined ramps */
        get: function () { return this.rangeEnd - this.rangeStart; },
        enumerable: true,
        configurable: true
    });
    Falloff.prototype.rangeStartCompute = function () {
        if (this.Ramps.length < 1)
            return 0;
        var rangeStarts = this.Ramps.map(function (r) { return r.RangeStart; });
        var rangeStart = rangeStarts.reduce(function (previous, current) {
            return Math.min(previous, current);
        }, Number.MAX_VALUE);
        return rangeStart;
    };
    Falloff.prototype.rangeEndCompute = function () {
        if (this.Ramps.length < 1)
            return 0;
        var rangeEnds = this.Ramps.map(function (r) { return r.RangeEnd; });
        var rangeEnd = rangeEnds.reduce(function (previous, current) {
            return Math.max(previous, current);
        }, Number.MIN_VALUE);
        return rangeEnd;
    };
    Falloff.FromObj = function (obj) {
        var ramps = obj.r ? obj.r.map(Ramp.FromObj) : [];
        return new Falloff(ramps);
    };
    Falloff.FromStr = function (str) {
        return Falloff.FromObj(JSON.parse(str));
    };
    Falloff.CloneStatic = function (other) {
        return new Falloff(other.Ramps.map(Ramp.CloneRamp));
    };
    Falloff.EqualStatic = function (dt1, dt2) {
        if (dt1.Ramps.length != dt2.Ramps.length)
            return false;
        for (var i = 0; i < dt1.Ramps.length; i++) {
            if (!Ramp.Equal(dt1.Ramps[i], dt2.Ramps[i]))
                return false;
        }
        return true;
    };
    Falloff.StandardRampSetRamps = function () {
        return [new Ramp('easeInQuad', 1, 0, 0, 1)];
    };
    Falloff.StandardRampSet = function () {
        return new Falloff(Falloff.StandardRampSetRamps());
    };
    Falloff.PermanentFalloff = function (value) {
        if (value === void 0) { value = 1; }
        return new Falloff([new Ramp('linear', value, value)]);
    };
    /** Simple linear fall from 1 to 0 */
    Falloff.LinearFalloff = function () {
        return new Falloff([new Ramp('linear', 1, 0, 0, 1)]);
    };
    return Falloff;
}());
exports.Falloff = Falloff;
var Ramp = (function () {
    function Ramp(_type, _valueStart, _valueEnd, _rangeStart, _rangeEnd) {
        var _this = this;
        if (_type === void 0) { _type = Ramp.defaultEasingFunction; }
        if (_valueStart === void 0) { _valueStart = 1; }
        if (_valueEnd === void 0) { _valueEnd = 0; }
        if (_rangeStart === void 0) { _rangeStart = 0; }
        if (_rangeEnd === void 0) { _rangeEnd = 1; }
        this._type = _type;
        this._valueStart = _valueStart;
        this._valueEnd = _valueEnd;
        this._rangeStart = _rangeStart;
        this._rangeEnd = _rangeEnd;
        this.ReadableStr = function () {
            return 'R:' + _this.Type + ' From ' + _this.ValueStart + '-' +
                _this.ValueEnd + ' over ' + _this.RangeStart + '-' + _this.RangeEnd;
        };
        this.ValueAt = function (location) {
            return Ramp.ValueAtStatic(_this, location);
        };
        this.Equal = function (b) {
            return Ramp.Equal(_this, b);
        };
        this.SetType = function (type) {
            return Ramp.AlterValue(_this, 0, type);
        };
        this.SetValueStart = function (value) {
            return Ramp.AlterValue(_this, 1, value);
        };
        this.SetValueEnd = function (value) {
            return Ramp.AlterValue(_this, 2, value);
        };
        this.SetRangeStart = function (value) {
            return Ramp.AlterValue(_this, 3, value);
        };
        this.SetRangeEnd = function (value) {
            return Ramp.AlterValue(_this, 4, value);
        };
        this.ToArray = function () {
            return [_this.Type, _this.ValueStart, _this.ValueEnd, _this.RangeStart, _this.RangeEnd];
        };
        this.ToObj = function () {
            return {
                vs: _this._valueStart,
                ve: _this._valueEnd,
                rs: _this._rangeStart,
                re: _this._rangeEnd,
                t: _this._type
            };
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        this.Clone = function () {
            return Ramp.CloneRamp(_this);
        };
        if (this._rangeStart > this._rangeEnd)
            this._rangeEnd = this._rangeStart;
        //check if type really exists. otherwise, fall back to easeOut
        if (!Ramp.EasingFunctions[this._type]) {
            this._type = Ramp.defaultEasingFunction;
        }
    }
    Object.defineProperty(Ramp.prototype, "Type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ramp.prototype, "ValueStart", {
        get: function () { return this._valueStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ramp.prototype, "ValueEnd", {
        get: function () { return this._valueEnd; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ramp.prototype, "RangeStart", {
        get: function () { return this._rangeStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ramp.prototype, "RangeEnd", {
        get: function () { return this._rangeEnd; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ramp.prototype, "Duration", {
        get: function () { return this._rangeEnd - this._rangeStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ramp.prototype, "ValueChange", {
        get: function () { return this._valueEnd - this._valueStart; },
        enumerable: true,
        configurable: true
    });
    Ramp.defaultEasingFunction = 'easeOutQuad';
    Ramp.FromArray = function (arr) {
        return new Ramp(arr[0], arr[1], arr[2], arr[3], arr[4]);
    };
    Ramp.AlterValue = function (ramp, index, value) {
        var arr = ramp.ToArray();
        arr[index] = value;
        return Ramp.FromArray(arr);
    };
    Ramp.FromObj = function (obj) {
        return new Ramp(obj.t, obj.vs, obj.ve, obj.rs, obj.re);
    };
    Ramp.FromStr = function (str) {
        return Ramp.FromObj(JSON.parse(str));
    };
    Ramp.CloneRamp = function (r) {
        return Ramp.FromArray(r.ToArray());
    };
    Ramp.ValueAtStatic = function (ramp, location) {
        if (location >= ramp.RangeEnd)
            return ramp.ValueEnd;
        if (location <= ramp.RangeStart)
            return ramp.ValueStart;
        var currentTime = (location - ramp._rangeStart);
        return Ramp.Ease(ramp._type, currentTime, ramp.ValueStart, ramp.ValueChange, ramp.Duration);
    };
    Ramp.Equal = function (r1, r2) {
        if (r1._type != r2._type)
            return false;
        var delta = (r1._valueStart - r2._valueStart) +
            (r1._valueEnd - r2._valueEnd) +
            (r1._rangeStart - r2._rangeStart) +
            (r1._rangeEnd - r2._rangeEnd);
        return Math.abs(delta) < 0.02;
    };
    Ramp.Mix = function (r1, r2, fraction, range) {
        if (fraction === void 0) { fraction = 0.5; }
        if (range === void 0) { range = 0; }
        fraction = Math.min(1, Math.max(0, fraction));
        var c1 = r1.ValueAt(range);
        var c2 = r2.ValueAt(range);
        var sum = c1 * (1 - fraction) + c2 * fraction;
        return sum;
    };
    Ramp.Ease = function (func, currentTime, beginingValue, changeInValue, duration) {
        if (func === void 0) { func = 'easeOutQuad'; }
        if (currentTime === void 0) { currentTime = 0; }
        if (beginingValue === void 0) { beginingValue = 0; }
        if (changeInValue === void 0) { changeInValue = 0; }
        if (duration === void 0) { duration = 0; }
        if (!Ramp.EasingFunctions.hasOwnProperty(func)) {
            func = 'easeOutQuad';
        }
        var result = Ramp.EasingFunctions[func](currentTime, beginingValue, changeInValue, duration);
        return isNaN(result) ? beginingValue : result;
    };
    /* ============================================================
     * Open source under the BSD License.
     *
     * These functions are adapted from
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     *
     * Copyright © 2008 George McGinley Smith
     * All rights reserved.
     * https://raw.github.com/danro/jquery-easing/master/LICENSE
     * t: current time, b: begInnIng value, c: change In value, d: duration
     * ======================================================== */
    Ramp.EasingFunctions = {
        linear: function (t, b, c, d) {
            return c * (t /= d) + b;
        },
        easeInQuad: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if (t == 0)
                return b;
            if (t == d)
                return b + c;
            if ((t /= d / 2) < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0)
                return b;
            if ((t /= d / 2) == 2)
                return b + c;
            if (!p)
                p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1)
                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            if ((t /= d / 2) < 1)
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeOutBounce: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            }
            else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    };
    return Ramp;
}());
exports.Ramp = Ramp;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ramp;
//# sourceMappingURL=ramp.js.map