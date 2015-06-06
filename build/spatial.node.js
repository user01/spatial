/// <reference path='../references.ts'/>
/// <reference path='../references.ts'/>
var Spatial;
(function (Spatial) {
    var Ramp = (function () {
        function Ramp(_type, _valueStart, _valueEnd, _rangeStart, _rangeEnd) {
            var _this = this;
            if (_type === void 0) { _type = 'easeOutQuad'; }
            if (_valueStart === void 0) { _valueStart = 1; }
            if (_valueEnd === void 0) { _valueEnd = 0; }
            if (_rangeStart === void 0) { _rangeStart = 0; }
            if (_rangeEnd === void 0) { _rangeEnd = 10; }
            this._type = _type;
            this._valueStart = _valueStart;
            this._valueEnd = _valueEnd;
            this._rangeStart = _rangeStart;
            this._rangeEnd = _rangeEnd;
            this.validateSelf = function () {
                if (_this._rangeStart > _this._rangeEnd)
                    _this._rangeEnd = _this._rangeStart;
            };
            this.ValueAt = function (location) {
                return Ramp.ValueAtStatic(_this, location);
            };
            this.Equal = function (b) {
                return Ramp.Equal(_this, b);
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
            this.validateSelf();
        }
        Object.defineProperty(Ramp.prototype, "Type", {
            get: function () { return this._type; },
            set: function (newType) {
                this._type = newType;
                this.validateSelf();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ramp.prototype, "ValueStart", {
            get: function () { return this._valueStart; },
            set: function (newValue) {
                this._valueStart = newValue;
                this.validateSelf();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ramp.prototype, "ValueEnd", {
            get: function () { return this._valueEnd; },
            set: function (newValue) {
                this._valueEnd = newValue;
                this.validateSelf();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ramp.prototype, "RangeStart", {
            get: function () { return this._rangeStart; },
            set: function (newValue) {
                this._rangeStart = newValue;
                this.validateSelf();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ramp.prototype, "RangeEnd", {
            get: function () { return this._rangeEnd; },
            set: function (newValue) {
                this._rangeEnd = newValue;
                this.validateSelf();
            },
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
        Ramp.FromObj = function (obj) {
            return new Ramp(obj.t, obj.vs, obj.ve, obj.rs, obj.re);
        };
        Ramp.FromStr = function (str) {
            return Ramp.FromObj(JSON.parse(str));
        };
        Ramp.CloneRamp = function (r) {
            return Ramp.FromObj(r.ToObj());
        };
        Ramp.ValueAtStatic = function (ramp, location) {
            if (location >= ramp.RangeEnd)
                return ramp.ValueEnd;
            if (location <= ramp.RangeStart)
                return ramp.ValueStart;
            var fractionComplete = (location - ramp.RangeStart) / ramp.Duration;
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
        Ramp.Build = function (r) {
            if (r === void 0) { r = null; }
            if (r == null) {
                return new Ramp(); //default values
            }
            else if (typeof r == 'string') {
                return Ramp.FromStr(r);
            }
            return r;
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
    })();
    Spatial.Ramp = Ramp;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
var Spatial;
(function (Spatial) {
    var Vector = (function () {
        function Vector(valueSet, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            this.Clone = function () {
                return Vector.CloneStatic(_this);
            };
            this.readableStr = function () {
                var str = 'V' + _this.Dimension + '[';
                for (var i = 0; i < _this._values.length; i++)
                    str += _this._values[i] + ',';
                return str + ']';
            };
            this.ToObj = function () {
                return {
                    t: _this.Dimension,
                    v: _this._values,
                    r: _this.Ramp.ToObj()
                };
            };
            this.ToStr = function () {
                return JSON.stringify(_this.ToObj());
            };
            this.Equal = function (v) {
                return Vector.EqualStatic(_this, v);
            };
            this.DistanceTo = function (v) {
                return Vector.DistanceToStatic(_this, v);
            };
            this.IntensityAt = function (v) {
                return _this.Ramp.ValueAt(_this.DistanceTo(v));
            };
            this.ClosestVector = function (v) {
                return _this.Clone();
            };
            if (valueSet.length < 1 || valueSet.length > 4) {
                throw new RangeException();
            }
            this._ramp = Spatial.Ramp.Build(r);
            this._values = new Float32Array(valueSet);
        }
        Object.defineProperty(Vector.prototype, "Values", {
            get: function () {
                return this._values;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "Dimension", {
            get: function () {
                return this._values.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "Ramp", {
            get: function () {
                return this._ramp;
            },
            enumerable: true,
            configurable: true
        });
        Vector.FromObj = function (obj) {
            switch (obj.t) {
                case 2:
                    return Spatial.Vector2.FromObj(obj);
                case 3:
                    return Spatial.Vector3.FromObj(obj);
                case 4:
                    return Spatial.Vector4.FromObj(obj);
            }
            return new Vector(obj.v, Spatial.Ramp.FromObj(obj.r));
        };
        Vector.FromStr = function (str) {
            return Vector.FromObj(JSON.parse(str));
        };
        Vector.DistanceToStatic = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var total = 0;
            for (var i = 0; i < v1.Dimension; i++)
                total += (v1.Values[i] - v2.Values[i]) * (v1.Values[i] - v2.Values[i]);
            return Math.sqrt(total);
        };
        Vector.CloneStatic = function (v1) {
            return Vector.FromObj(v1.ToObj());
        };
        Vector.Add = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var values = new Array();
            for (var i = 0; i < v1.Dimension; i++)
                values.push(v1.Values[i] + v2.Values[i]);
            return new Vector(values, v1.Ramp.ToStr());
        };
        Vector.Subtract = function (v1, v2) {
            return Vector.Add(v1, Vector.Negate(v2));
        };
        Vector.Scale = function (v1, factor) {
            var values = new Array();
            for (var i = 0; i < v1.Dimension; i++)
                values.push(v1.Values[i] * factor);
            return new Vector(values, v1.Ramp.ToStr());
        };
        Vector.Negate = function (v1) {
            return Vector.Scale(v1, -1);
        };
        Vector.EqualStatic = function (v1, v2) {
            if (v1.Dimension != v2.Dimension)
                return false;
            if (!v1.Ramp.Equal(v2.Ramp))
                return false;
            for (var i = 0; i < v1.Dimension; i++)
                //if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
                if (Math.abs(v1.Values[i] - v2.Values[i]) > 0.05)
                    return false;
            return true;
        };
        Vector.Dot = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var result = 0;
            for (var i = 0; i < v1.Dimension; i++)
                result += v1.Values[i] * v2.Values[i];
            return result;
        };
        Vector.DimensionCheck = function (v1, v2) {
            if (v1.Dimension != v2.Dimension)
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
/// <reference path="../references.ts" />
var Spatial;
(function (Spatial) {
    var Segment = (function () {
        function Segment(_base, _tip, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            this._base = _base;
            this._tip = _tip;
            this.DistanceTo = function (v) {
                return Segment.DistanceToStatic(_this, v);
            };
            this.IntensityAt = function (v) {
                var fraction = _this.closestFraction(v);
                fraction = _this.Ramp.ValueAt(fraction);
                var range = _this.DistanceTo(v);
                var intensity = Spatial.Ramp.Mix(_this.Base.Ramp, _this.Tip.Ramp, fraction, range);
                return intensity;
            };
            this.ClosestVector = function (v) {
                var t = _this.closestFraction(v);
                var newSegment = _this.Scale(t);
                return newSegment.Tip.Clone();
            };
            this.closestFraction = function (v) {
                Segment.DimensionCheck(_this, v);
                var length = _this.Length;
                if (length < 0.001)
                    return 0;
                var vWithoutBase = Spatial.Vector.Subtract(v, _this.Base);
                var t = Spatial.Vector.Dot(vWithoutBase, _this.TipWithoutBase) / (length * length);
                return Math.max(0, Math.min(1, t));
            };
            this.RestoreBase = function (v) {
                return Spatial.Vector.Add(_this.Base, v);
            };
            this.Push = function (v) {
                return Segment.Push(_this, v);
            };
            this.Scale = function (factor) {
                return Segment.Scale(_this, factor);
            };
            this.Equal = function (s) {
                return Segment.EqualStatic(_this, s);
            };
            this.ToObj = function () {
                return {
                    t: _this.Dimension,
                    b: _this.Base.ToObj(),
                    e: _this.Tip.ToObj(),
                    r: _this.Ramp.ToObj()
                };
            };
            this.ToStr = function () {
                return JSON.stringify(_this.ToObj());
            };
            if (!this._base || !this._tip ||
                (this._base.Dimension != this._tip.Dimension)) {
                throw new RangeException();
            }
            var tempRamp = Spatial.Ramp.Build(r);
            //force the new ramp to conform to the 0,1 0,1 to handle
            // scaling along segment and fraction to give to each end
            this._ramp = new Spatial.Ramp(tempRamp.Type, 0, 1, 0, 1);
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
        Object.defineProperty(Segment.prototype, "Length", {
            get: function () {
                return this._base.DistanceTo(this._tip);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "Dimension", {
            get: function () {
                return this._tip.Dimension;
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
        Segment.EqualStatic = function (s, s2) {
            if (!s.Tip.Equal(s2.Tip))
                return false;
            if (!s.Base.Equal(s2.Base))
                return false;
            if (!s.Ramp.Equal(s2.Ramp))
                return false;
            return true;
        };
        Segment.Scale = function (s, factor) {
            var newTip = s.RestoreBase(Spatial.Vector.Scale(s.TipWithoutBase, factor));
            return new Segment(s.Base.Clone(), newTip);
        };
        Segment.Push = function (s, v) {
            if (s.Dimension != v.Dimension)
                throw new RangeException();
            return new Segment(Spatial.Vector.Add(s.Base, v), Spatial.Vector.Add(s.Tip, v));
        };
        Segment.DistanceToStatic = function (s, v) {
            Segment.DimensionCheck(s, v);
            var vOnSegment = s.ClosestVector(v);
            return vOnSegment.DistanceTo(v);
        };
        Segment.DimensionCheck = function (s, v) {
            if (s.Dimension != v.Dimension)
                throw new RangeException();
            return true;
        };
        Segment.FromObj = function (obj) {
            switch (obj.t) {
                case 2:
                    return new Spatial.Segment2(Spatial.Vector2.FromObj(obj.b), Spatial.Vector2.FromObj(obj.e), Spatial.Ramp.FromObj(obj.r));
                case 3:
                    return new Spatial.Segment3(Spatial.Vector3.FromObj(obj.b), Spatial.Vector3.FromObj(obj.e), Spatial.Ramp.FromObj(obj.r));
                case 4:
                    return new Spatial.Segment4(Spatial.Vector4.FromObj(obj.b), Spatial.Vector4.FromObj(obj.e), Spatial.Ramp.FromObj(obj.r));
            }
            //default untyped
            return new Segment(Spatial.Vector.FromObj(obj.b), Spatial.Vector.FromObj(obj.e), Spatial.Ramp.FromObj(obj.r));
        };
        Segment.FromStr = function (str) {
            return Segment.FromObj(JSON.parse(str));
        };
        return Segment;
    })();
    Spatial.Segment = Segment;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
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
        function Segment2(base, tip, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            _super.call(this, base, tip, r);
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
            return Spatial.Segment.Push(s, v);
        };
        return Segment2;
    })(Spatial.Segment);
    Spatial.Segment2 = Segment2;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
var Spatial;
(function (Spatial) {
    var Segment3 = (function (_super) {
        __extends(Segment3, _super);
        function Segment3(base, tip, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            _super.call(this, base, tip, r);
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
                return Spatial.Vector.Subtract(this._tip, this._base);
            },
            enumerable: true,
            configurable: true
        });
        Segment3.Push = function (s, v) {
            return Spatial.Segment.Push(s, v);
        };
        Segment3.Cross = function (sA, sB) {
            var aTip = Spatial.Vector3.Cast(sA.TipWithoutBase.Clone());
            var bTip = Spatial.Vector3.Cast(sB.TipWithoutBase.Clone());
            var cross = aTip.Cross(bTip);
            var newTip = Spatial.Vector3.Cast(sA.RestoreBase(cross));
            return new Segment3(Spatial.Vector3.Cast(sA.Base), newTip);
        };
        return Segment3;
    })(Spatial.Segment);
    Spatial.Segment3 = Segment3;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
var Spatial;
(function (Spatial) {
    var Segment4 = (function (_super) {
        __extends(Segment4, _super);
        function Segment4(base, tip, r) {
            var _this = this;
            if (r === void 0) { r = null; }
            _super.call(this, base, tip, r);
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
            return Spatial.Segment.Push(s, v);
        };
        return Segment4;
    })(Spatial.Segment);
    Spatial.Segment4 = Segment4;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
var Spatial;
(function (Spatial) {
    var SegmentSet = (function () {
        function SegmentSet(segments) {
            var _this = this;
            this.segments = segments;
            this._dimension = 0;
            this.DistanceTo = function (v) {
                return _this.closestVectorDistanceIntensity(v)[1];
            };
            this.IntensityAt = function (v) {
                return _this.closestVectorDistanceIntensity(v)[2];
            };
            this.ClosestVector = function (v) {
                return _this.closestVectorDistanceIntensity(v)[0];
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
            this.closestVectorDistanceIntensity = function (v) {
                var closestVectorFound = null;
                var closestDistance = Number.MAX_VALUE;
                var closestIntensity = 0;
                for (var i = 0; i < _this.segments.length; i++) {
                    var computedVector = _this.segments[i].ClosestVector(v);
                    var computedDistance = _this.segments[i].DistanceTo(v);
                    if (closestVectorFound == null || computedDistance < closestDistance) {
                        closestVectorFound = computedVector;
                        closestDistance = computedDistance;
                        closestIntensity = _this.segments[i].IntensityAt(computedVector);
                    }
                }
                return [closestVectorFound, closestDistance, closestIntensity];
            };
            if ((segments === void 0) || segments.length < 1)
                throw new RangeException();
            this._dimension = segments[0].Dimension;
            // Ensure all dimensions match
            for (var i = 0; i < this.segments.length; i++) {
                if (segments[i].Dimension != this._dimension) {
                    throw new RangeException();
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
        SegmentSet.FromObj = function (obj) {
            var segs = obj.s.map(function (s) {
                return Spatial.Segment.FromObj(s);
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
                throw new RangeException();
            return new SegmentSet(ssA.segments.concat(ssB.segments));
        };
        return SegmentSet;
    })();
    Spatial.SegmentSet = SegmentSet;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
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
        Vector2.FromObj = function (obj) {
            return new Vector2(obj.v[0], obj.v[1], Spatial.Ramp.FromObj(obj.r));
        };
        Vector2.FromStr = function (str) {
            return Vector2.FromObj(JSON.parse(str));
        };
        Vector2.Build = function (values) {
            if (values.length != 2)
                throw new RangeException();
            return new Vector2(values[0], values[1]);
        };
        return Vector2;
    })(Spatial.Vector);
    Spatial.Vector2 = Vector2;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
var Spatial;
(function (Spatial) {
    var Vector3 = (function (_super) {
        __extends(Vector3, _super);
        function Vector3(_x, _y, _z, _ramp) {
            var _this = this;
            if (_ramp === void 0) { _ramp = null; }
            _super.call(this, [_x, _y, _z], _ramp);
            this.Cross = function (vOther) {
                return Vector3.CrossStatic(_this, vOther);
            };
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
        Vector3.CrossStatic = function (vA, vB) {
            var x = vA.y * vB.z - vA.z * vB.y;
            var y = vA.z * vB.x - vA.x * vB.z;
            var z = vA.x * vB.y - vA.y * vB.x;
            return new Vector3(x, y, z, vA.Ramp.Clone());
        };
        Vector3.Cast = function (v) {
            if (v.Values.length != 3)
                throw new RangeException();
            return new Vector3(v.Values[0], v.Values[1], v.Values[2], v.Ramp);
        };
        Vector3.FromObj = function (obj) {
            return new Vector3(obj.v[0], obj.v[1], obj.v[2], Spatial.Ramp.FromObj(obj.r));
        };
        Vector3.FromStr = function (str) {
            return Vector3.FromObj(JSON.parse(str));
        };
        Vector3.Build = function (values) {
            if (values.length != 3)
                throw new RangeException();
            return new Vector3(values[0], values[1], values[2]);
        };
        return Vector3;
    })(Spatial.Vector);
    Spatial.Vector3 = Vector3;
})(Spatial || (Spatial = {}));
/// <reference path="../references.ts" />
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
        Vector4.FromObj = function (obj) {
            return new Vector4(obj.v[0], obj.v[1], obj.v[2], obj.v[3], Spatial.Ramp.FromObj(obj.r));
        };
        Vector4.FromStr = function (str) {
            return Vector4.FromObj(JSON.parse(str));
        };
        Vector4.Build = function (values) {
            if (values.length != 4)
                throw new RangeException();
            return new Vector4(values[0], values[1], values[2], values[3]);
        };
        return Vector4;
    })(Spatial.Vector);
    Spatial.Vector4 = Vector4;
})(Spatial || (Spatial = {}));
/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/lib.d.ts" />
/// <reference path="./interfaces/IRanged.ts" />
/// <reference path="./interfaces/ISerializable.ts" />
/// <reference path="./interfaces/IEquality.ts" />
/// <reference path="./ramp/ramp.ts" />
/// <reference path="./vector/vector.ts" />
/// <reference path="./segment/segment.ts" />
/// <reference path="./segment/segment2.ts" />
/// <reference path="./segment/segment3.ts" />
/// <reference path="./segment/segment4.ts" />
/// <reference path="./segment/segmentSet.ts" />
/// <reference path="./vector/vector2.ts" />
/// <reference path="./vector/vector3.ts" />
/// <reference path="./vector/vector4.ts" />
/// <reference path="references.ts" />
module.exports = Spatial;
//# sourceMappingURL=spatial.node.js.map