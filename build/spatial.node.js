/// <reference path='references.ts'/>
/// <reference path='references.ts'/>
var Spatial;
(function (Spatial) {
    var Ramp = (function () {
        function Ramp(type, valueStart, valueEnd, rangeStart, rangeEnd) {
            var _this = this;
            if (type === void 0) { type = 'easeOutQuad'; }
            if (valueStart === void 0) { valueStart = 1; }
            if (valueEnd === void 0) { valueEnd = 0; }
            if (rangeStart === void 0) { rangeStart = 0; }
            if (rangeEnd === void 0) { rangeEnd = 10; }
            this.type = type;
            this.valueStart = valueStart;
            this.valueEnd = valueEnd;
            this.rangeStart = rangeStart;
            this.rangeEnd = rangeEnd;
            this.valueChange = 0;
            this.duration = 0;
            this.valueAt = function (range) {
                return Ramp.ValueAt(_this, range);
            };
            this.equal = function (b) {
                return Ramp.Equal(_this, b);
            };
            this.toObj = function () {
                return {
                    vs: _this.valueStart,
                    ve: _this.valueEnd,
                    rs: _this.rangeStart,
                    re: _this.rangeEnd,
                    t: _this.type
                };
            };
            this.toStr = function () {
                return JSON.stringify(_this.toObj());
            };
            this.rangeStart = Math.abs(this.rangeStart);
            this.rangeEnd = Math.abs(this.rangeEnd);
            if (this.rangeStart > this.rangeEnd)
                this.rangeEnd = this.rangeStart;
            this.duration = Math.abs(this.rangeEnd - this.rangeStart);
            this.valueChange = this.valueEnd - this.valueStart;
        }
        Ramp.fromObj = function (obj) {
            return new Ramp(obj.t, obj.vs, obj.ve, obj.rs, obj.re);
        };
        Ramp.fromStr = function (str) {
            return Ramp.fromObj(JSON.parse(str));
        };
        Ramp.ValueAt = function (ramp, range) {
            range = Math.abs(range);
            if (range >= ramp.rangeEnd)
                return ramp.valueEnd;
            if (range <= ramp.rangeStart)
                return ramp.valueStart;
            var fractionComplete = (range - ramp.rangeStart) / (ramp.rangeEnd - ramp.rangeStart);
            //fractionComplete = Math.max(Math.min(1,fractionComplete),0);
            var currentTime = (range - ramp.rangeStart);
            return Ramp.Ease(ramp.type, currentTime, ramp.valueStart, ramp.valueChange, ramp.duration);
            //return valueRange * Ramp.Ease(ramp.type,fractionComplete) + ramp.valueStart;
        };
        Ramp.Equal = function (r1, r2) {
            if (r1.type != r2.type)
                return false;
            var delta = (r1.valueStart - r2.valueStart) + (r1.valueEnd - r2.valueEnd) + (r1.rangeStart - r2.rangeStart) + (r1.rangeEnd - r2.rangeEnd);
            return Math.abs(delta) < 0.02;
        };
        Ramp.Build = function (r) {
            if (r === void 0) { r = null; }
            if (r == null) {
                return new Ramp(); //default values
            }
            else if (typeof r == 'string') {
                return Ramp.fromStr(r);
            }
            return r;
        };
        Ramp.Mix = function (r1, r2, fraction, range) {
            if (fraction === void 0) { fraction = 0.5; }
            if (range === void 0) { range = 0; }
            fraction = Math.min(1, Math.max(0, fraction));
            var c1 = r1.valueAt(range);
            var c2 = r2.valueAt(range);
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
    })();
    Spatial.Ramp = Ramp;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Vector = (function () {
        function Vector(valueSet, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            this.clone = function () {
                return Vector.Clone(_this);
            };
            this.readableStr = function () {
                var str = 'V' + _this.dimension + '[';
                for (var i = 0; i < _this._values.length; i++)
                    str += _this._values[i] + ',';
                return str + ']';
            };
            this.toObj = function () {
                return {
                    t: 'v' + _this.dimension,
                    v: _this._values,
                    r: _this.ramp.toStr()
                };
            };
            this.toStr = function () {
                return JSON.stringify(_this.toObj());
            };
            this.equal = function (v) {
                return Vector.Equal(_this, v);
            };
            this.distanceTo = function (v) {
                return Vector.DistanceTo(_this, v);
            };
            this.intensityAt = function (v) {
                return _this.ramp.valueAt(_this.distanceTo(v));
            };
            this.closestVector = function (v) {
                return _this.clone();
            };
            if (valueSet.length < 1 || valueSet.length > 4) {
                throw new RangeException();
            }
            this._ramp = Spatial.Ramp.Build(r);
            this._values = new Float32Array(valueSet);
        }
        Object.defineProperty(Vector.prototype, "values", {
            get: function () {
                return this._values;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "dimension", {
            get: function () {
                return this._values.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "ramp", {
            get: function () {
                return this._ramp;
            },
            enumerable: true,
            configurable: true
        });
        Vector.fromObj = function (obj) {
            return new Vector(obj.v);
        };
        Vector.fromStr = function (str) {
            return Vector.fromObj(JSON.parse(str));
        };
        Vector.DistanceTo = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var total = 0;
            for (var i = 0; i < v1.dimension; i++)
                total += (v1.values[i] - v2.values[i]) * (v1.values[i] - v2.values[i]);
            return Math.sqrt(total);
        };
        Vector.Clone = function (v1) {
            return Vector.fromObj(v1.toObj());
        };
        Vector.Add = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var values = new Array();
            for (var i = 0; i < v1.dimension; i++)
                values.push(v1.values[i] + v2.values[i]);
            return new Vector(values, v1.ramp.toStr());
        };
        Vector.Subtract = function (v1, v2) {
            return Vector.Add(v1, Vector.Negate(v2));
        };
        Vector.Scale = function (v1, factor) {
            var values = new Array();
            for (var i = 0; i < v1.dimension; i++)
                values.push(v1.values[i] * factor);
            return new Vector(values, v1.ramp.toStr());
        };
        Vector.Negate = function (v1) {
            return Vector.Scale(v1, -1);
        };
        Vector.Equal = function (v1, v2) {
            if (v1.dimension != v2.dimension)
                return false;
            if (!v1.ramp.equal(v2.ramp))
                return false;
            for (var i = 0; i < v1.dimension; i++)
                //if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
                if (Math.abs(v1.values[i] - v2.values[i]) > 0.05)
                    return false;
            return true;
        };
        Vector.Dot = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var result = 0;
            for (var i = 0; i < v1.dimension; i++)
                result += v1.values[i] * v2.values[i];
            return result;
        };
        Vector.DimensionCheck = function (v1, v2) {
            if (v1.dimension != v2.dimension)
                throw new RangeException();
            return true;
        };
        Vector.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
        return Vector;
    })();
    Spatial.Vector = Vector;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Segment = (function () {
        function Segment(_base, _tip, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            this._base = _base;
            this._tip = _tip;
            this.distanceTo = function (v) {
                return Segment.DistanceTo(_this, v);
            };
            this.intensityAt = function (v) {
                var fraction = _this.closestFraction(v);
                fraction = _this.Ramp.valueAt(fraction);
                var range = _this.distanceTo(v);
                var intensity = Spatial.Ramp.Mix(_this.Base.ramp, _this.Tip.ramp, fraction, range);
                return intensity;
            };
            this.closestVector = function (v) {
                var t = _this.closestFraction(v);
                var newSegment = _this.scale(t);
                return newSegment.Tip.clone();
            };
            this.closestFraction = function (v) {
                Segment.DimensionCheck(_this, v);
                var length = _this.length;
                if (length < 0.001)
                    return 0;
                var vWithoutBase = Spatial.Vector.Subtract(v, _this.Base);
                var t = Spatial.Vector.Dot(vWithoutBase, _this.TipWithoutBase) / (length * length);
                return Math.max(0, Math.min(1, t));
            };
            this.restoreBase = function (v) {
                return Spatial.Vector.Add(_this.Base, v);
            };
            this.push = function (v) {
                return Segment.Push(_this, v);
            };
            this.scale = function (factor) {
                return Segment.Scale(_this, factor);
            };
            this.equal = function (s) {
                return Segment.Equal(_this, s);
            };
            this.toObj = function () {
                return {
                    t: 's' + _this.dimension,
                    b: _this.Base.toObj(),
                    e: _this.Tip.toObj(),
                    r: _this.Ramp.toObj()
                };
            };
            this.toStr = function () {
                return JSON.stringify(_this.toObj());
            };
            if (!this._base || !this._tip || (this._base.dimension != this._tip.dimension)) {
                throw new RangeException();
            }
            var tempRamp = Spatial.Ramp.Build(r);
            //force the new ramp to conform to the 0,1 0,1 to handle
            // scaling along segment and fraction to give to each end
            this._ramp = new Spatial.Ramp(tempRamp.type, 0, 1, 0, 1);
        }
        Object.defineProperty(Segment.prototype, "Base", {
            get: function () {
                return this._base;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "Tip", {
            get: function () {
                return this._tip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "TipWithoutBase", {
            get: function () {
                return Spatial.Vector.Subtract(this._tip, this._base);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "length", {
            get: function () {
                return this._base.distanceTo(this._tip);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "dimension", {
            get: function () {
                return this._tip.dimension;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "Ramp", {
            get: function () {
                return this._ramp;
            },
            enumerable: true,
            configurable: true
        });
        Segment.Equal = function (s, s2) {
            if (!s.Tip.equal(s2.Tip))
                return false;
            if (!s.Base.equal(s2.Base))
                return false;
            if (!s.Ramp.equal(s2.Ramp))
                return false;
            return true;
        };
        Segment.Scale = function (s, factor) {
            var newTip = s.restoreBase(Spatial.Vector.Scale(s.TipWithoutBase, factor));
            return new Segment(s.Base.clone(), newTip);
        };
        Segment.Push = function (s, v) {
            if (s.dimension != v.dimension)
                throw new RangeException();
            return new Segment(Spatial.Vector.Add(s.Base, v), Spatial.Vector.Add(s.Tip, v));
        };
        Segment.DistanceTo = function (s, v) {
            Segment.DimensionCheck(s, v);
            var vOnSegment = s.closestVector(v);
            return vOnSegment.distanceTo(v);
        };
        Segment.DimensionCheck = function (s, v) {
            if (s.dimension != v.dimension)
                throw new RangeException();
            return true;
        };
        Segment.fromObj = function (obj) {
            return new Segment(Spatial.Vector.fromObj(obj.b), Spatial.Vector.fromObj(obj.e), Spatial.Ramp.fromObj(obj.r));
        };
        Segment.fromStr = function (str) {
            return Segment.fromObj(JSON.parse(str));
        };
        return Segment;
    })();
    Spatial.Segment = Segment;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Spatial;
(function (Spatial) {
    var Segment2 = (function (_super) {
        __extends(Segment2, _super);
        function Segment2(base, tip) {
            var _this = this;
            _super.call(this, base, tip);
            this.push = function (v) {
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
            return Spatial.Segment.Push(s, v);
        };
        return Segment2;
    })(Spatial.Segment);
    Spatial.Segment2 = Segment2;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Segment3 = (function (_super) {
        __extends(Segment3, _super);
        function Segment3(base, tip) {
            var _this = this;
            _super.call(this, base, tip);
            this.push = function (v) {
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
        Segment3.Push = function (s, v) {
            return Spatial.Segment.Push(s, v);
        };
        return Segment3;
    })(Spatial.Segment);
    Spatial.Segment3 = Segment3;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Segment4 = (function (_super) {
        __extends(Segment4, _super);
        function Segment4(base, tip) {
            var _this = this;
            _super.call(this, base, tip);
            this.push = function (v) {
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
            return Spatial.Segment.Push(s, v);
        };
        return Segment4;
    })(Spatial.Segment);
    Spatial.Segment4 = Segment4;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var SegmentSet = (function () {
        function SegmentSet(segments) {
            var _this = this;
            this.segments = segments;
            this._dimension = 0;
            this.distanceTo = function (v) {
                return _this.closestVectorDistanceIntensity(v)[1];
            };
            this.intensityAt = function (v) {
                return _this.closestVectorDistanceIntensity(v)[2];
            };
            this.closestVector = function (v) {
                return _this.closestVectorDistanceIntensity(v)[0];
            };
            this.closestVectorDistanceIntensity = function (v) {
                var closestVectorFound = null;
                var closestDistance = Number.MAX_VALUE;
                var closestIntensity = 0;
                for (var i = 0; i < _this.segments.length; i++) {
                    var computedVector = _this.segments[i].closestVector(v);
                    var computedDistance = _this.segments[i].distanceTo(v);
                    if (closestVectorFound == null || computedDistance < closestDistance) {
                        closestVectorFound = computedVector;
                        closestDistance = computedDistance;
                        closestIntensity = _this.segments[i].intensityAt(computedVector);
                    }
                }
                return [closestVectorFound, closestDistance, closestIntensity];
            };
            if ((segments === void 0) || segments.length < 1)
                throw new RangeException();
            this._dimension = segments[0].dimension;
            for (var i = 0; i < this.segments.length; i++) {
                if (segments[i].dimension != this._dimension) {
                    throw new RangeException();
                }
            }
        }
        Object.defineProperty(SegmentSet.prototype, "dimension", {
            get: function () {
                return this._dimension;
            },
            enumerable: true,
            configurable: true
        });
        return SegmentSet;
    })();
    Spatial.SegmentSet = SegmentSet;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        function Vector2(_x, _y, _ramp) {
            if (_ramp === void 0) { _ramp = null; }
            _super.call(this, [_x, _y], _ramp);
        }
        Object.defineProperty(Vector2.prototype, "x", {
            get: function () {
                return this._values[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            get: function () {
                return this._values[1];
            },
            enumerable: true,
            configurable: true
        });
        Vector2.fromObj = function (obj) {
            return new Vector2(obj.v[0], obj.v[1]);
        };
        Vector2.fromStr = function (str) {
            return Vector2.fromObj(JSON.parse(str));
        };
        Vector2.build = function (values) {
            if (values.length != 2)
                throw new RangeException();
            return new Vector2(values[0], values[1]);
        };
        return Vector2;
    })(Spatial.Vector);
    Spatial.Vector2 = Vector2;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Vector3 = (function (_super) {
        __extends(Vector3, _super);
        function Vector3(_x, _y, _z, _ramp) {
            if (_ramp === void 0) { _ramp = null; }
            _super.call(this, [_x, _y, _z], _ramp);
        }
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this._values[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this._values[1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this._values[2];
            },
            enumerable: true,
            configurable: true
        });
        Vector3.fromObj = function (obj) {
            return new Vector3(obj.v[0], obj.v[1], obj.v[2]);
        };
        Vector3.fromStr = function (str) {
            return Vector3.fromObj(JSON.parse(str));
        };
        Vector3.build = function (values) {
            if (values.length != 3)
                throw new RangeException();
            return new Vector3(values[0], values[1], values[2]);
        };
        return Vector3;
    })(Spatial.Vector);
    Spatial.Vector3 = Vector3;
})(Spatial || (Spatial = {}));
/// <reference path="references.ts" />
var Spatial;
(function (Spatial) {
    var Vector4 = (function (_super) {
        __extends(Vector4, _super);
        function Vector4(_x, _y, _z, _w, _ramp) {
            if (_ramp === void 0) { _ramp = null; }
            _super.call(this, [_x, _y, _z, _w], _ramp);
        }
        Object.defineProperty(Vector4.prototype, "x", {
            get: function () {
                return this._values[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "y", {
            get: function () {
                return this._values[1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "z", {
            get: function () {
                return this._values[2];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "w", {
            get: function () {
                return this._values[3];
            },
            enumerable: true,
            configurable: true
        });
        Vector4.fromObj = function (obj) {
            return new Vector4(obj.v[0], obj.v[1], obj.v[2], obj.v[3]);
        };
        Vector4.fromStr = function (str) {
            return Vector4.fromObj(JSON.parse(str));
        };
        Vector4.build = function (values) {
            if (values.length != 4)
                throw new RangeException();
            return new Vector4(values[0], values[1], values[2], values[3]);
        };
        return Vector4;
    })(Spatial.Vector);
    Spatial.Vector4 = Vector4;
})(Spatial || (Spatial = {}));
/// <reference path="./IRanged.ts" />
/// <reference path="./ISerializable.ts" />
/// <reference path="./IEquality.ts" />
/// <reference path="./ramp.ts" />
/// <reference path="./vector.ts" />
/// <reference path="./segment.ts" />
/// <reference path="./segment2.ts" />
/// <reference path="./segment3.ts" />
/// <reference path="./segment4.ts" />
/// <reference path="./segmentSet.ts" />
/// <reference path="./vector2.ts" />
/// <reference path="./vector3.ts" />
/// <reference path="./vector4.ts" />
/// <reference path="references.ts" />
/*Spatial.Utility.exportCommonjs({
  Spatial:Spatial
});*/
module.exports = Spatial;
//# sourceMappingURL=spatial.node.js.map