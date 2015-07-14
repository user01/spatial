!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(5)},function(t,e){var n=function(){function t(e,n,r,i,o){var u=this;void 0===e&&(e=t.defaultEasingFunction),void 0===n&&(n=1),void 0===r&&(r=0),void 0===i&&(i=0),void 0===o&&(o=10),this._type=e,this._valueStart=n,this._valueEnd=r,this._rangeStart=i,this._rangeEnd=o,this.ValueAt=function(e){return t.ValueAtStatic(u,e)},this.Equal=function(e){return t.Equal(u,e)},this.SetType=function(e){return t.AlterValue(u,0,e)},this.SetValueStart=function(e){return t.AlterValue(u,1,e)},this.SetValueEnd=function(e){return t.AlterValue(u,2,e)},this.SetRangeStart=function(e){return t.AlterValue(u,3,e)},this.SetRangeEnd=function(e){return t.AlterValue(u,4,e)},this.ToArray=function(){return[u.Type,u.ValueStart,u.ValueEnd,u.RangeStart,u.RangeEnd]},this.ToObj=function(){return{vs:u._valueStart,ve:u._valueEnd,rs:u._rangeStart,re:u._rangeEnd,t:u._type}},this.ToStr=function(){return JSON.stringify(u.ToObj())},this.Clone=function(){return t.CloneRamp(u)},this._rangeStart>this._rangeEnd&&(this._rangeEnd=this._rangeStart),t.EasingFunctions[this._type]||(this._type=t.defaultEasingFunction)}return Object.defineProperty(t.prototype,"Type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ValueStart",{get:function(){return this._valueStart},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ValueEnd",{get:function(){return this._valueEnd},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"RangeStart",{get:function(){return this._rangeStart},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"RangeEnd",{get:function(){return this._rangeEnd},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Duration",{get:function(){return this._rangeEnd-this._rangeStart},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ValueChange",{get:function(){return this._valueEnd-this._valueStart},enumerable:!0,configurable:!0}),t.defaultEasingFunction="easeOutQuad",t.FromArray=function(e){return new t(e[0],e[1],e[2],e[3],e[4])},t.AlterValue=function(e,n,r){var i=e.ToArray();return i[n]=r,t.FromArray(i)},t.FromObj=function(e){return new t(e.t,e.vs,e.ve,e.rs,e.re)},t.FromStr=function(e){return t.FromObj(JSON.parse(e))},t.CloneRamp=function(e){return t.FromObj(e.ToObj())},t.ValueAtStatic=function(e,n){if(n>=e.RangeEnd)return e.ValueEnd;if(n<=e.RangeStart)return e.ValueStart;var r=((n-e.RangeStart)/e.Duration,n-e._rangeStart);return t.Ease(e._type,r,e.ValueStart,e.ValueChange,e.Duration)},t.Equal=function(t,e){if(t._type!=e._type)return!1;var n=t._valueStart-e._valueStart+(t._valueEnd-e._valueEnd)+(t._rangeStart-e._rangeStart)+(t._rangeEnd-e._rangeEnd);return Math.abs(n)<.02},t.Build=function(e){return void 0===e&&(e=null),null==e?new t:"string"==typeof e?0==e.indexOf("{")?t.FromStr(e):new t(e):e},t.Mix=function(t,e,n,r){void 0===n&&(n=.5),void 0===r&&(r=0),n=Math.min(1,Math.max(0,n));var i=t.ValueAt(r),o=e.ValueAt(r),u=i*(1-n)+o*n;return u},t.Ease=function(e,n,r,i,o){void 0===e&&(e="easeOutQuad"),void 0===n&&(n=0),void 0===r&&(r=0),void 0===i&&(i=0),void 0===o&&(o=0),t.EasingFunctions.hasOwnProperty(e)||(e="easeOutQuad");var u=t.EasingFunctions[e](n,r,i,o);return isNaN(u)?r:u},t.EasingFunctions={linear:function(t,e,n,r){return n*(t/=r)+e},easeInQuad:function(t,e,n,r){return n*(t/=r)*t+e},easeOutQuad:function(t,e,n,r){return-n*(t/=r)*(t-2)+e},easeInOutQuad:function(t,e,n,r){return(t/=r/2)<1?n/2*t*t+e:-n/2*(--t*(t-2)-1)+e},easeInCubic:function(t,e,n,r){return n*(t/=r)*t*t+e},easeOutCubic:function(t,e,n,r){return n*((t=t/r-1)*t*t+1)+e},easeInOutCubic:function(t,e,n,r){return(t/=r/2)<1?n/2*t*t*t+e:n/2*((t-=2)*t*t+2)+e},easeInQuart:function(t,e,n,r){return n*(t/=r)*t*t*t+e},easeOutQuart:function(t,e,n,r){return-n*((t=t/r-1)*t*t*t-1)+e},easeInOutQuart:function(t,e,n,r){return(t/=r/2)<1?n/2*t*t*t*t+e:-n/2*((t-=2)*t*t*t-2)+e},easeInQuint:function(t,e,n,r){return n*(t/=r)*t*t*t*t+e},easeOutQuint:function(t,e,n,r){return n*((t=t/r-1)*t*t*t*t+1)+e},easeInOutQuint:function(t,e,n,r){return(t/=r/2)<1?n/2*t*t*t*t*t+e:n/2*((t-=2)*t*t*t*t+2)+e},easeInSine:function(t,e,n,r){return-n*Math.cos(t/r*(Math.PI/2))+n+e},easeOutSine:function(t,e,n,r){return n*Math.sin(t/r*(Math.PI/2))+e},easeInOutSine:function(t,e,n,r){return-n/2*(Math.cos(Math.PI*t/r)-1)+e},easeInExpo:function(t,e,n,r){return 0==t?e:n*Math.pow(2,10*(t/r-1))+e},easeOutExpo:function(t,e,n,r){return t==r?e+n:n*(-Math.pow(2,-10*t/r)+1)+e},easeInOutExpo:function(t,e,n,r){return 0==t?e:t==r?e+n:(t/=r/2)<1?n/2*Math.pow(2,10*(t-1))+e:n/2*(-Math.pow(2,-10*--t)+2)+e},easeInCirc:function(t,e,n,r){return-n*(Math.sqrt(1-(t/=r)*t)-1)+e},easeOutCirc:function(t,e,n,r){return n*Math.sqrt(1-(t=t/r-1)*t)+e},easeInOutCirc:function(t,e,n,r){return(t/=r/2)<1?-n/2*(Math.sqrt(1-t*t)-1)+e:n/2*(Math.sqrt(1-(t-=2)*t)+1)+e},easeInElastic:function(t,e,n,r){var i=1.70158,o=0,u=n;if(0==t)return e;if(1==(t/=r))return e+n;if(o||(o=.3*r),u<Math.abs(n)){u=n;var i=o/4}else var i=o/(2*Math.PI)*Math.asin(n/u);return-(u*Math.pow(2,10*(t-=1))*Math.sin(2*(t*r-i)*Math.PI/o))+e},easeOutElastic:function(t,e,n,r){var i=1.70158,o=0,u=n;if(0==t)return e;if(1==(t/=r))return e+n;if(o||(o=.3*r),u<Math.abs(n)){u=n;var i=o/4}else var i=o/(2*Math.PI)*Math.asin(n/u);return u*Math.pow(2,-10*t)*Math.sin(2*(t*r-i)*Math.PI/o)+n+e},easeInOutElastic:function(t,e,n,r){var i=1.70158,o=0,u=n;if(0==t)return e;if(2==(t/=r/2))return e+n;if(o||(o=.3*r*1.5),u<Math.abs(n)){u=n;var i=o/4}else var i=o/(2*Math.PI)*Math.asin(n/u);return 1>t?-.5*u*Math.pow(2,10*(t-=1))*Math.sin(2*(t*r-i)*Math.PI/o)+e:u*Math.pow(2,-10*(t-=1))*Math.sin(2*(t*r-i)*Math.PI/o)*.5+n+e},easeInBack:function(t,e,n,r,i){return void 0==i&&(i=1.70158),n*(t/=r)*t*((i+1)*t-i)+e},easeOutBack:function(t,e,n,r,i){return void 0==i&&(i=1.70158),n*((t=t/r-1)*t*((i+1)*t+i)+1)+e},easeInOutBack:function(t,e,n,r,i){return void 0==i&&(i=1.70158),(t/=r/2)<1?n/2*t*t*(((i*=1.525)+1)*t-i)+e:n/2*((t-=2)*t*(((i*=1.525)+1)*t+i)+2)+e},easeOutBounce:function(t,e,n,r){return(t/=r)<1/2.75?7.5625*n*t*t+e:2/2.75>t?n*(7.5625*(t-=1.5/2.75)*t+.75)+e:2.5/2.75>t?n*(7.5625*(t-=2.25/2.75)*t+.9375)+e:n*(7.5625*(t-=2.625/2.75)*t+.984375)+e}},t}();t.exports=n},function(t,e,n){var r,i=this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);n.prototype=e.prototype,t.prototype=new n},o=n(1);!function(t){var e=function(){function t(e,n){var r=this;if(void 0===n&&(n=null),this.Clone=function(){return t.CloneStatic(r)},this.readableStr=function(){for(var t="V"+r.Dimension+"[",e=0;e<r._values.length;e++)t+=r._values[e]+",";return t+"]"},this.ToStr=function(){return JSON.stringify(r.ToObj())},this.IntensityAt=function(t){return r.Ramp.ValueAt(r.DistanceTo(t))},this.ClosestVector=function(t){return r.Clone()},e.length<1||e.length>4)throw"Dimension Mismatch";this._ramp=o.Build(n),this._values=new Float32Array(e)}return Object.defineProperty(t.prototype,"Values",{get:function(){return this._values},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Dimension",{get:function(){return this._values.length},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Ramp",{get:function(){return this._ramp},enumerable:!0,configurable:!0}),t.prototype.ToObj=function(){return{t:this.Dimension,v:this._values,r:this.Ramp.ToObj()}},t.prototype.Equal=function(e){return t.EqualStatic(this,e)},t.prototype.DistanceTo=function(e){return t.DistanceToStatic(this,e)},t.FromObj=function(e){switch(e.t){case 2:return n.FromObj(e);case 3:return r.FromObj(e);case 4:return u.FromObj(e)}return new t(e.v,o.FromObj(e.r))},t.FromStr=function(e){return t.FromObj(JSON.parse(e))},t.DistanceToStatic=function(e,n){t.DimensionCheck(e,n);for(var r=0,i=0;i<e.Dimension;i++)r+=(e.Values[i]-n.Values[i])*(e.Values[i]-n.Values[i]);return Math.sqrt(r)},t.CloneStatic=function(e){return t.FromObj(e.ToObj())},t.Add=function(e,n){t.DimensionCheck(e,n);for(var r=new Array,i=0;i<e.Dimension;i++)r.push(e.Values[i]+n.Values[i]);return new t(r,e.Ramp.ToStr())},t.Subtract=function(e,n){return t.Add(e,t.Negate(n))},t.Scale=function(e,n){for(var r=new Array,i=0;i<e.Dimension;i++)r.push(e.Values[i]*n);return new t(r,e.Ramp.ToStr())},t.Negate=function(e){return t.Scale(e,-1)},t.EqualStatic=function(t,e){if(t.Dimension!=e.Dimension)return!1;if(!t.Ramp.Equal(e.Ramp))return!1;for(var n=0;n<t.Dimension;n++)if(Math.abs(t.Values[n]-e.Values[n])>.05)return!1;return!0},t.Dot=function(e,n){t.DimensionCheck(e,n);for(var r=0,i=0;i<e.Dimension;i++)r+=e.Values[i]*n.Values[i];return r},t.DimensionCheck=function(t,e){if(t.Dimension!=e.Dimension)throw"Dimension Mismatch";return!0},t.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)},t}();t.VectorBase=e;var n=function(t){function e(e,n,r){void 0===r&&(r=null),t.call(this,[e,n],r)}return i(e,t),Object.defineProperty(e.prototype,"x",{get:function(){return this._values[0]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"y",{get:function(){return this._values[1]},enumerable:!0,configurable:!0}),e.FromObj=function(t){return new e(t.v[0],t.v[1],o.FromObj(t.r))},e.FromStr=function(t){return e.FromObj(JSON.parse(t))},e.Build=function(t){if(2!=t.length)throw"Dimension Mismatch";return new e(t[0],t[1])},e}(e);t.Vector2=n;var r=function(t){function e(n,r,i,o){var u=this;void 0===o&&(o=null),t.call(this,[n,r,i],o),this.Cross=function(t){return e.CrossStatic(u,t)}}return i(e,t),Object.defineProperty(e.prototype,"x",{get:function(){return this._values[0]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"y",{get:function(){return this._values[1]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"z",{get:function(){return this._values[2]},enumerable:!0,configurable:!0}),e.CrossStatic=function(t,n){var r=t.y*n.z-t.z*n.y,i=t.z*n.x-t.x*n.z,o=t.x*n.y-t.y*n.x;return new e(r,i,o,t.Ramp.Clone())},e.Cast=function(t){if(3!=t.Values.length)throw"Dimension Mismatch";return new e(t.Values[0],t.Values[1],t.Values[2],t.Ramp)},e.FromObj=function(t){return new e(t.v[0],t.v[1],t.v[2],o.FromObj(t.r))},e.FromStr=function(t){return e.FromObj(JSON.parse(t))},e.Build=function(t){if(3!=t.length)throw"Dimension Mismatch";return new e(t[0],t[1],t[2])},e}(e);t.Vector3=r;var u=function(t){function e(e,n,r,i,o){void 0===o&&(o=null),t.call(this,[e,n,r,i],o)}return i(e,t),Object.defineProperty(e.prototype,"x",{get:function(){return this._values[0]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"y",{get:function(){return this._values[1]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"z",{get:function(){return this._values[2]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"w",{get:function(){return this._values[3]},enumerable:!0,configurable:!0}),e.FromObj=function(t){return new e(t.v[0],t.v[1],t.v[2],t.v[3],o.FromObj(t.r))},e.FromStr=function(t){return e.FromObj(JSON.parse(t))},e.Build=function(t){if(4!=t.length)throw"Dimension Mismatch";return new e(t[0],t[1],t[2],t[3])},e}(e);t.Vector4=u}(r||(r={})),t.exports=r},function(t,e,n){var r,i=this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);n.prototype=e.prototype,t.prototype=new n},o=n(2),u=n(1);!function(t){var e=function(){function t(e,n,r){var i=this;if(void 0===r&&(r=null),this._base=e,this._tip=n,this.DistanceTo=function(e){return t.DistanceToStatic(i,e)},this.IntensityAt=function(t){var e=i.closestFraction(t);e=i.Ramp.ValueAt(e);var n=i.DistanceTo(t),r=u.Mix(i.Base.Ramp,i.Tip.Ramp,e,n);return r},this.ClosestVector=function(t){var e=i.closestFraction(t),n=i.Scale(e);return n.Tip.Clone()},this.closestFraction=function(e){t.DimensionCheck(i,e);var n=i.Length;if(.001>n)return 0;var r=o.VectorBase.Subtract(e,i.Base),u=o.VectorBase.Dot(r,i.TipWithoutBase)/(n*n);return Math.max(0,Math.min(1,u))},this.RestoreBase=function(t){return o.VectorBase.Add(i.Base,t)},this.Push=function(e){return t.Push(i,e)},this.Scale=function(e){return t.Scale(i,e)},this.Equal=function(e){return t.EqualStatic(i,e)},this.ToObj=function(){return{t:i.Dimension,b:i.Base.ToObj(),e:i.Tip.ToObj(),r:i.Ramp.ToObj()}},this.ToStr=function(){return JSON.stringify(i.ToObj())},!this._base||!this._tip||this._base.Dimension!=this._tip.Dimension)throw"Dimension Mismatch";var a=u.Build(r);this._ramp=new u(a.Type,0,1,0,1)}return Object.defineProperty(t.prototype,"Base",{get:function(){return this._base},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Tip",{get:function(){return this._tip},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"TipWithoutBase",{get:function(){return o.VectorBase.Subtract(this._tip,this._base)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Length",{get:function(){return this._base.DistanceTo(this._tip)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Dimension",{get:function(){return this._tip.Dimension},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"Ramp",{get:function(){return this._ramp},enumerable:!0,configurable:!0}),t.EqualStatic=function(t,e){return t.Tip.Equal(e.Tip)&&t.Base.Equal(e.Base)&&t.Ramp.Equal(e.Ramp)?!0:!1},t.Scale=function(e,n){var r=e.RestoreBase(o.VectorBase.Scale(e.TipWithoutBase,n));return new t(e.Base.Clone(),r)},t.Push=function(e,n){if(e.Dimension!=n.Dimension)throw"Dimension Mismatch";return new t(o.VectorBase.Add(e.Base,n),o.VectorBase.Add(e.Tip,n))},t.DistanceToStatic=function(e,n){t.DimensionCheck(e,n);var r=e.ClosestVector(n);return r.DistanceTo(n)},t.DimensionCheck=function(t,e){if(t.Dimension!=e.Dimension)throw"Dimension Mismatch";return!0},t.FromObj=function(e){switch(e.t){case 2:return new n(o.Vector2.FromObj(e.b),o.Vector2.FromObj(e.e),u.FromObj(e.r));case 3:return new r(o.Vector3.FromObj(e.b),o.Vector3.FromObj(e.e),u.FromObj(e.r));case 4:return new a(o.Vector4.FromObj(e.b),o.Vector4.FromObj(e.e),u.FromObj(e.r))}return new t(o.VectorBase.FromObj(e.b),o.VectorBase.FromObj(e.e),u.FromObj(e.r))},t.FromStr=function(e){return t.FromObj(JSON.parse(e))},t}();t.SegmentBase=e;var n=function(t){function n(e,r,i){var o=this;void 0===i&&(i=null),t.call(this,e,r,i),this.Push=function(t){return n.Push(o,t)}}return i(n,t),Object.defineProperty(n.prototype,"Base",{get:function(){return this._base},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"Tip",{get:function(){return this._tip},enumerable:!0,configurable:!0}),n.Push=function(t,n){return e.Push(t,n)},n}(e);t.Segment2=n;var r=function(t){function n(e,r,i){var o=this;void 0===i&&(i=null),t.call(this,e,r,i),this.Push=function(t){return n.Push(o,t)}}return i(n,t),Object.defineProperty(n.prototype,"Base",{get:function(){return this._base},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"Tip",{get:function(){return this._tip},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"TipWithoutBase",{get:function(){return o.VectorBase.Subtract(this._tip,this._base)},enumerable:!0,configurable:!0}),n.Push=function(t,n){return e.Push(t,n)},n.Cross=function(t,e){var r=o.Vector3.Cast(t.TipWithoutBase.Clone()),i=o.Vector3.Cast(e.TipWithoutBase.Clone()),u=r.Cross(i),a=o.Vector3.Cast(t.RestoreBase(u));return new n(o.Vector3.Cast(t.Base),a)},n}(e);t.Segment3=r;var a=function(t){function n(e,r,i){var o=this;void 0===i&&(i=null),t.call(this,e,r,i),this.Push=function(t){return n.Push(o,t)}}return i(n,t),Object.defineProperty(n.prototype,"Base",{get:function(){return this._base},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"Tip",{get:function(){return this._tip},enumerable:!0,configurable:!0}),n.Push=function(t,n){return e.Push(t,n)},n}(e);t.Segment4=a;var s=function(){function t(e){var n=this;if(this.segments=e,this._dimension=0,this.DistanceTo=function(t){return n.closestVectorDistance(t)[1]},this.IntensityAt=function(t){return n.closestVectorIntensity(t)[1]},this.ClosestVector=function(t){return n.closestVectorDistance(t)[0]},this.Clone=function(){return t.CloneStatic(n)},this.Equal=function(e){return t.EqualStatic(n,e)},this.ToObj=function(){return{s:n.segments.map(function(t){return t.ToObj()})}},this.ToStr=function(){return JSON.stringify(n.ToObj())},this.closestVectorDistance=function(t){for(var e=null,r=Number.MAX_VALUE,i=0;i<n.segments.length;i++){var o=n.segments[i].ClosestVector(t),u=n.segments[i].DistanceTo(t);(null==e||r>u)&&(e=o,r=u)}return[e,r]},this.closestVectorIntensity=function(t){for(var e=null,r=Number.MIN_VALUE,i=0;i<n.segments.length;i++){var o=n.segments[i].ClosestVector(t),u=n.segments[i].IntensityAt(t);(null==e||u>r)&&(e=o,r=u)}return[e,r]},void 0===e||e.length<1)throw"Dimension Mismatch";this._dimension=e[0].Dimension;for(var r=0;r<this.segments.length;r++)if(e[r].Dimension!=this._dimension)throw"Dimension Mismatch"}return Object.defineProperty(t.prototype,"Dimension",{get:function(){return this._dimension},enumerable:!0,configurable:!0}),t.FromObj=function(n){var r=n.s.map(function(t){return e.FromObj(t)});return new t(r)},t.FromStr=function(e){return t.FromObj(JSON.parse(e))},t.CloneStatic=function(e){return t.FromObj(e.ToObj())},t.EqualStatic=function(t,e){if(t.segments.length!=e.segments.length)return!1;for(var n=0;n<t.segments.length;n++)if(!t.segments[n].Equal(e.segments[n]))return!1;return!0},t.Merge=function(e,n){if(e.Dimension!=n.Dimension)throw"Dimension Mismatch";return new t(e.segments.concat(n.segments))},t}();t.SegmentSet=s}(r||(r={})),t.exports=r},,function(t,e,n){var r=n(1),i=n(2),o=n(3);t.exports={Ramp:r,Vector:i,Segment:o}}]);