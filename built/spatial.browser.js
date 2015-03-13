/*/// <reference path="./vector.ts" />

module Spatial {
  export interface IRanged {
    distanceTo(v:Vector):number;
    intensityAt(v:Vector):number;
    closestVector(v:Vector):Vector;
  }
}*/
/*module Spatial {
  export interface ISerializable {
    toObj():any;
    toStr():string;
  }
}*/
/*module Spatial {
  export interface IEquality<T> {
    equal(a:T,b:T):boolean;
  }
}*/
/// <reference path="references.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Spatial;
(function (Spatial) {
    //export class Vector implements IRanged, ISerializable, IEquality<Vector> {
    var Vector = (function () {
        function Vector(valueSet) {
            var _this = this;
            this.clone = function () {
                return Vector.Clone(_this);
            };
            this.toObj = function () {
                return {
                    t: 'v' + _this.dimension,
                    v: _this._values
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
                return 0;
            };
            this.closestVector = function (v) {
                return _this.clone();
            };
            if (valueSet.length < 1 || valueSet.length > 4) {
                throw new RangeException();
            }
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
            return new Vector(Array.prototype.slice.call(v1.values));
        };
        Vector.Add = function (v1, v2) {
            Vector.DimensionCheck(v1, v2);
            var values = new Array();
            for (var i = 0; i < v1.dimension; i++)
                values.push(v1.values[i] + v2.values[i]);
            return new Vector(values);
        };
        Vector.Subtract = function (v1, v2) {
            return Vector.Add(v1, Vector.Negate(v2));
        };
        Vector.Scale = function (v1, factor) {
            var values = new Array();
            for (var i = 0; i < v1.dimension; i++)
                values.push(v1.values[i] * factor);
            return new Vector(values);
        };
        Vector.Negate = function (v1) {
            return Vector.Scale(v1, -1);
        };
        Vector.Equal = function (v1, v2) {
            if (v1.dimension != v2.dimension)
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
    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        function Vector2(_x, _y) {
            _super.call(this, [_x, _y]);
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
    })(Vector);
    Spatial.Vector2 = Vector2;
    var Vector3 = (function (_super) {
        __extends(Vector3, _super);
        function Vector3(_x, _y, _z) {
            _super.call(this, [_x, _y, _z]);
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
    })(Vector);
    Spatial.Vector3 = Vector3;
    var Vector4 = (function (_super) {
        __extends(Vector4, _super);
        function Vector4(_x, _y, _z, _w) {
            _super.call(this, [_x, _y, _z, _w]);
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
    })(Vector);
    Spatial.Vector4 = Vector4;
})(Spatial || (Spatial = {}));
/// <reference path="./IRanged.ts" />
/// <reference path="./ISerializable.ts" />
/// <reference path="./IEquality.ts" />
/// <reference path="./vector.ts" />
