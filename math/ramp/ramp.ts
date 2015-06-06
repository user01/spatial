/// <reference path='../references.ts'/>


module Spatial {
  export class Ramp implements ISerializable, IEquality<Ramp> {

    public get Type(): string { return this._type; }
    public get ValueStart(): number { return this._valueStart; }
    public get ValueEnd(): number { return this._valueEnd; }
    public get RangeStart(): number { return this._rangeStart; }
    public get RangeEnd(): number { return this._rangeEnd; }

    public set Type(newType: string) {
      this._type = newType;
      this.validateSelf();
    }
    public set ValueStart(newValue: number) {
      this._valueStart = newValue;
      this.validateSelf();
    }
    public set ValueEnd(newValue: number) {
      this._valueEnd = newValue;
      this.validateSelf();
    }
    public set RangeStart(newValue: number) {
      this._rangeStart = newValue;
      this.validateSelf();
    }
    public set RangeEnd(newValue: number) {
      this._rangeEnd = newValue;
      this.validateSelf();
    }

    private valueChange: number = 0;
    private duration: number = 0;
    constructor(
      private _type: string = 'easeOutQuad',
      private _valueStart: number = 1,
      private _valueEnd: number = 0,
      private _rangeStart: number = 0,
      private _rangeEnd: number = 10
      ) {
      this.validateSelf();
    }

    private validateSelf = (): void => {
      this._rangeStart = Math.abs(this._rangeStart);
      this._rangeEnd = Math.abs(this._rangeEnd);
      if (this._rangeStart > this._rangeEnd) this._rangeEnd = this._rangeStart;
      this.duration = Math.abs(this._rangeEnd - this._rangeStart);
      this.valueChange = this._valueEnd - this._valueStart;
    }

    public ValueAt = (range: number): number => {
      return Ramp.ValueAt(this, range);
    }

    public Equal = (b: Ramp): boolean => {
      return Ramp.Equal(this, b);
    }

    public ToObj = (): any => {
      return {
        vs: this._valueStart,
        ve: this._valueEnd,
        rs: this._rangeStart,
        re: this._rangeEnd,
        t: this._type
      };
    }
    public ToStr = (): string => {
      return JSON.stringify(this.ToObj());
    }
    public Clone = (): Ramp => {
      return Ramp.CloneRamp(this);
    }

    public static FromObj = (obj: any): Ramp => {
      return new Ramp(obj.t, obj.vs, obj.ve, obj.rs, obj.re);
    }
    public static FromStr = (str: string): Ramp => {
      return Ramp.FromObj(JSON.parse(str));
    }

    public static CloneRamp = (r: Ramp): Ramp => {
      return Ramp.FromObj(r.ToObj());
    }

    public static ValueAt = (ramp: Ramp, range: number): number => {
      if (range >= ramp._rangeEnd) return ramp._valueEnd;
      if (range <= ramp._rangeStart) return ramp._valueStart;
      var fractionComplete = (range - ramp._rangeStart) /
        (ramp._rangeEnd - ramp._rangeStart);
      //fractionComplete = Math.max(Math.min(1,fractionComplete),0);
      var currentTime = (range - ramp._rangeStart);

      return Ramp.Ease(ramp._type,
        currentTime,
        ramp._valueStart,
        ramp.valueChange,
        ramp.duration);

      //return valueRange * Ramp.Ease(ramp.type,fractionComplete) + ramp.valueStart;
    }

    public static Equal = (r1: Ramp, r2: Ramp): boolean => {
      if (r1._type != r2._type) return false;
      var delta = (r1._valueStart - r2._valueStart) +
        (r1._valueEnd - r2._valueEnd) +
        (r1._rangeStart - r2._rangeStart) +
        (r1._rangeEnd - r2._rangeEnd);

      return Math.abs(delta) < 0.02;
    }

    public static Build = (r: Ramp|string = null): Ramp => {
      if (r == null) {
        return new Ramp();//default values
      } else if (typeof r == 'string') {
        return Ramp.FromStr(<string>r);
      }
      return <Ramp>r;
    }

    public static Mix = (r1: Ramp,
      r2: Ramp,
      fraction: number = 0.5,
      range: number = 0): number => {
      fraction = Math.min(1, Math.max(0, fraction));
      var c1 = r1.ValueAt(range);
      var c2 = r2.ValueAt(range);
      var sum = c1 * (1 - fraction) + c2 * fraction;
      return sum;
    }

    public static Ease = (func: string = 'easeOutQuad',
      currentTime: number = 0,
      beginingValue: number = 0,
      changeInValue: number = 0,
      duration: number = 0
      ): number => {
      if (!Ramp.EasingFunctions.hasOwnProperty(func)) {
        func = 'easeOutQuad';
      }

      var result = Ramp.EasingFunctions[func](currentTime,
        beginingValue,
        changeInValue,
        duration);
      return isNaN(result) ? beginingValue : result;
    }

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
    private static EasingFunctions =
    {
      linear: function(t, b, c, d) {
        return c * (t /= d) + b;
      },
      easeInQuad: function(t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      },
      easeInCubic: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function(t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function(t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOutExpo: function(t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInCirc: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function(t, b, c, d) {
        var s = 1.70158; var p = 0; var a = c;
        if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
        if (a < Math.abs(c)) { a = c; var s = p / 4; }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOutElastic: function(t, b, c, d) {
        var s = 1.70158; var p = 0; var a = c;
        if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
        if (a < Math.abs(c)) { a = c; var s = p / 4; }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function(t, b, c, d) {
        var s = 1.70158; var p = 0; var a = c;
        if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) { a = c; var s = p / 4; }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function(t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function(t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function(t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      },

      easeOutBounce: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      }
    }

  }

}
