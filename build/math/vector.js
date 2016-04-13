/// <reference path="./references.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Ramp = require('./ramp');
var VectorBase = (function () {
    function VectorBase(_values, _factor) {
        var _this = this;
        if (_factor === void 0) { _factor = Ramp.Factor.PermanentFactor(); }
        this._values = _values;
        this._factor = _factor;
        this.Clone = function () {
            return VectorBase.CloneStatic(_this);
        };
        this.readableStr = function () {
            var str = 'V' + _this.Dimension + '[';
            for (var i = 0; i < _this._values.length; i++)
                str += _this._values[i] + ',';
            return str + ']';
        };
        this.ToStr = function () {
            return JSON.stringify(_this.ToObj());
        };
        this.IntensityAtDistance = function (v) {
            return _this.Factor.IntensityAtDistance(_this.DistanceTo(v));
        };
        /** Intensity against time */
        this.IntensityAtTime = function (originTime, currentTime) {
            return _this.Factor.IntensityAtTime(originTime, currentTime);
        };
        /** Intensity based on duration */
        this.IntensityAtDuration = function (d) {
            return _this.Factor.IntensityAtDuration(d);
        };
        /** Intensity based on distance and time */
        this.IntensityAtDistanceAndTime = function (v, originTime, currentTime) {
            return _this.Factor.IntensityAtDistanceAndTime(_this.DistanceTo(v), originTime, currentTime);
        };
        /** Intensity based on distance and duration */
        this.IntensityAtDistanceAndDuration = function (v, d) {
            return _this.Factor.IntensityAtDistanceAndDuration(_this.DistanceTo(v), d);
        };
        this.ClosestVector = function (v) {
            return _this.Clone();
        };
        if (this._values.length < 1 || this._values.length > 4) {
            throw 'Dimension Mismatch';
        }
    }
    Object.defineProperty(VectorBase.prototype, "Values", {
        get: function () { return this._values; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorBase.prototype, "Dimension", {
        get: function () { return this._values.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorBase.prototype, "Factor", {
        /** How the value responds over time and distance from the vector */
        get: function () { return this._factor; },
        enumerable: true,
        configurable: true
    });
    VectorBase.prototype.ToObj = function () {
        return {
            t: this.Dimension,
            v: this._values,
            f: this.Factor.ToObj()
        };
    };
    VectorBase.prototype.Equal = function (v) {
        return VectorBase.EqualStatic(this, v);
    };
    VectorBase.prototype.DistanceTo = function (v) {
        return VectorBase.DistanceToStatic(this, v);
    };
    VectorBase.FromObj = function (obj) {
        switch (obj.t) {
            case 2:
                return Vector2.FromObj(obj);
            case 3:
                return Vector3.FromObj(obj);
            case 4:
                return Vector4.FromObj(obj);
        }
        return new VectorBase(obj.v, Ramp.Factor.FromObj(obj.f));
    };
    VectorBase.FromStr = function (str) {
        return VectorBase.FromObj(JSON.parse(str));
    };
    VectorBase.DistanceToStatic = function (v1, v2) {
        VectorBase.DimensionCheck(v1, v2);
        var total = 0;
        for (var i = 0; i < v1.Dimension; i++)
            total += (v1.Values[i] - v2.Values[i]) * (v1.Values[i] - v2.Values[i]);
        return Math.sqrt(total);
    };
    VectorBase.CloneStatic = function (v1) {
        return VectorBase.FromObj(v1.ToObj());
    };
    VectorBase.Add = function (v1, v2) {
        VectorBase.DimensionCheck(v1, v2);
        var values = new Array();
        for (var i = 0; i < v1.Dimension; i++)
            values.push(v1.Values[i] + v2.Values[i]);
        return new VectorBase(values, v1.Factor);
    };
    VectorBase.Subtract = function (v1, v2) {
        return VectorBase.Add(v1, VectorBase.Negate(v2));
    };
    VectorBase.Scale = function (v1, factor) {
        var values = new Array();
        for (var i = 0; i < v1.Dimension; i++)
            values.push(v1.Values[i] * factor);
        return new VectorBase(values, v1.Factor);
    };
    VectorBase.Negate = function (v1) {
        return VectorBase.Scale(v1, -1);
    };
    VectorBase.EqualStatic = function (v1, v2) {
        if (v1.Dimension != v2.Dimension)
            return false;
        if (!v1.Factor.Equal(v2.Factor))
            return false;
        for (var i = 0; i < v1.Dimension; i++)
            //if (Math.abs(v1.values[i] - v2.values[i]) > common.MARGIN_OF_ERROR)
            if (Math.abs(v1.Values[i] - v2.Values[i]) > 0.05)
                return false;
        return true;
    };
    VectorBase.Dot = function (v1, v2) {
        VectorBase.DimensionCheck(v1, v2);
        var result = 0;
        for (var i = 0; i < v1.Dimension; i++)
            result += v1.Values[i] * v2.Values[i];
        return result;
    };
    VectorBase.DimensionCheck = function (v1, v2) {
        if (v1.Dimension != v2.Dimension)
            throw 'Dimension Mismatch';
        return true;
    };
    VectorBase.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    return VectorBase;
}());
exports.VectorBase = VectorBase;
var Vector2 = (function (_super) {
    __extends(Vector2, _super);
    function Vector2(_x, _y, factor) {
        if (factor === void 0) { factor = Ramp.Factor.PermanentFactor(); }
        _super.call(this, [_x, _y], factor);
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
        return new Vector2(obj.v[0], obj.v[1], Ramp.Factor.FromObj(obj.f));
    };
    Vector2.FromStr = function (str) {
        return Vector2.FromObj(JSON.parse(str));
    };
    Vector2.Build = function (values) {
        if (values.length != 2)
            throw 'Dimension Mismatch';
        return new Vector2(values[0], values[1]);
    };
    return Vector2;
}(VectorBase));
exports.Vector2 = Vector2;
var Vector3 = (function (_super) {
    __extends(Vector3, _super);
    function Vector3(_x, _y, _z, factor) {
        var _this = this;
        if (factor === void 0) { factor = Ramp.Factor.PermanentFactor(); }
        _super.call(this, [_x, _y, _z], factor);
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
        return new Vector3(x, y, z, vA.Factor);
    };
    Vector3.Cast = function (v) {
        if (v.Values.length != 3)
            throw 'Dimension Mismatch';
        return new Vector3(v.Values[0], v.Values[1], v.Values[2], v.Factor);
    };
    Vector3.FromObj = function (obj) {
        return new Vector3(obj.v[0], obj.v[1], obj.v[2], Ramp.Factor.FromObj(obj.f));
    };
    Vector3.FromStr = function (str) {
        return Vector3.FromObj(JSON.parse(str));
    };
    Vector3.Build = function (values) {
        if (values.length != 3)
            throw 'Dimension Mismatch';
        return new Vector3(values[0], values[1], values[2]);
    };
    return Vector3;
}(VectorBase));
exports.Vector3 = Vector3;
var Vector4 = (function (_super) {
    __extends(Vector4, _super);
    function Vector4(_x, _y, _z, _w, factor) {
        if (factor === void 0) { factor = Ramp.Factor.PermanentFactor(); }
        _super.call(this, [_x, _y, _z, _w], factor);
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
        return new Vector4(obj.v[0], obj.v[1], obj.v[2], obj.v[3], Ramp.Factor.FromObj(obj.f));
    };
    Vector4.FromStr = function (str) {
        return Vector4.FromObj(JSON.parse(str));
    };
    Vector4.Build = function (values) {
        if (values.length != 4)
            throw 'Dimension Mismatch';
        return new Vector4(values[0], values[1], values[2], values[3]);
    };
    return Vector4;
}(VectorBase));
exports.Vector4 = Vector4;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Vector2;
//# sourceMappingURL=vector.js.map