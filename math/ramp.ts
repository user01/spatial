/// <reference path='references.ts'/>


module Spatial {
  export class Ramp {

    private valueChange:number=0;
    private duration:number=0;
    constructor(public type:string='easeOutQuad',
                public valueStart:number=1,
                valueEnd:number=0,
                public rangeStart:number=0,
                public rangeEnd:number=0
                ){
      if (this.rangeStart > this.rangeEnd) this.rangeEnd = this.rangeStart;
      this.duration = this.rangeStart - this.rangeEnd;
      this.valueChange = valueEnd - this.valueStart;
    }

    public valueAt = (range:number):number => {
      return Ramp.ValueAt(this,range);
    }

    public static ValueAt = (ramp:Ramp,range:number):number => {
      range = Math.abs(range);
      if (range >= ramp.rangeEnd) return ramp.rangeEnd;
      if (range <= ramp.rangeStart) return ramp.rangeStart;
      var fractionComplete = (range - ramp.rangeStart) /
                              (ramp.rangeEnd - ramp.rangeStart);
      //fractionComplete = Math.max(Math.min(1,fractionComplete),0);
      var currentTime = (range - ramp.rangeStart);

      return Ramp.Ease(ramp.type,
                        currentTime,
                        ramp.valueStart,
                        ramp.valueChange,
                        ramp.duration);

      //return valueRange * Ramp.Ease(ramp.type,fractionComplete) + ramp.valueStart;
    }


    private static Ease = (func:string='linear',
                            currentTime:number=0,
                            beginingValue:number=0,
                            changeInValue:number=0,
                            duration:number=0
                            ):number => {
      if (!Ramp.EasingFunctions.hasOwnProperty(func)){
        func = 'easeOutQuad';
      }

      return Ramp.EasingFunctions[func](currentTime,
                                        beginingValue,
                                        changeInValue,
                                        duration);
    }

    /* ============================================================
     * These functions are adapted from this
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Open source under the BSD License.
     *
     * Copyright © 2008 George McGinley Smith
     * All rights reserved.
     * https://raw.github.com/danro/jquery-easing/master/LICENSE
     * t: current time, b: begInnIng value, c: change In value, d: duration
     * ======================================================== */
    private static EasingFunctions =
    {
      linear: function (t, b, c, d) {
        return c*(t/=d) + b;
      },
      easeInQuad: function (t, b, c, d) {
        return c*(t/=d)*t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
      },
      easeInCubic: function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
      },
      easeOutCubic: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
      },
      easeInQuart: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
      },
      easeOutQuart: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
      },
      easeInOutQuart: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
      },
      easeInQuint: function (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
      },
      easeOutQuint: function (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
      },
      easeInOutQuint: function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
      },
      easeInSine: function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
      },
      easeOutSine: function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
      },
      easeInOutSine: function (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
      },
      easeInExpo: function (t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
      },
      easeOutExpo: function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
      },
      easeInOutExpo: function (t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInCirc: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
      },
      easeOutCirc: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
      },
      easeInOutCirc: function (t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
      },
      easeInElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      },
      easeOutElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
      },
      easeInOutElastic: function (t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
      },
      easeInBack: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
      },
      easeOutBack: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
      },
      easeInOutBack: function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
      },

      easeOutBounce: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
          return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
          return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
          return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
          return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
      }
    }

  }

}
