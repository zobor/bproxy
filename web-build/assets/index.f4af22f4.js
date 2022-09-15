import{r as P,m as se,n as p,o as ue,s as A,F as le}from"./index.c58bfb13.js";import{r as ae,a as ce,i as fe,b as de,C as _t,c as xt,_,P as he,d as ge,e as Ce,o as pe,W as me,f as we,m as Ct,B as Q,R as st,g as ut,h as lt,T as Ee,j as St,u as at,F as H,k as Ot}from"./index.cfc2a9d8.js";import{b as ye,z as Be,A as be,B as ve,h as Fe,C as Ae,D as Pe,E as Ne,F as Te,G as Ie,H as Se,I as De,x as Me}from"./bridge.8d86a4bb.js";var pt={exports:{}},tt={},W={},Dt;function Re(){if(Dt)return W;Dt=1,Object.defineProperty(W,"__esModule",{value:!0});var e={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M723 620.5C666.8 571.6 593.4 542 513 542s-153.8 29.6-210.1 78.6a8.1 8.1 0 00-.8 11.2l36 42.9c2.9 3.4 8 3.8 11.4.9C393.1 637.2 450.3 614 513 614s119.9 23.2 163.5 61.5c3.4 2.9 8.5 2.5 11.4-.9l36-42.9c2.8-3.3 2.4-8.3-.9-11.2zm117.4-140.1C751.7 406.5 637.6 362 513 362s-238.7 44.5-327.5 118.4a8.05 8.05 0 00-1 11.3l36 42.9c2.8 3.4 7.9 3.8 11.2 1C308 472.2 406.1 434 513 434s205 38.2 281.2 101.6c3.4 2.8 8.4 2.4 11.2-1l36-42.9c2.8-3.4 2.4-8.5-1-11.3zm116.7-139C835.7 241.8 680.3 182 511 182c-168.2 0-322.6 59-443.7 157.4a8 8 0 00-1.1 11.4l36 42.9c2.8 3.3 7.8 3.8 11.1 1.1C222 306.7 360.3 254 511 254c151.8 0 291 53.5 400 142.7 3.4 2.8 8.4 2.3 11.2-1.1l36-42.9c2.9-3.4 2.4-8.5-1.1-11.3zM448 778a64 64 0 10128 0 64 64 0 10-128 0z"}}]},name:"wifi",theme:"outlined"};return W.default=e,W}var Le=fe.exports,Bt=de.exports;Object.defineProperty(tt,"__esModule",{value:!0});tt.default=void 0;var Mt=Bt(ae()),Ut=Le(P.exports),ke=Bt(Re()),_e=Bt(ce()),zt=function(t,i){return Ut.createElement(_e.default,(0,Mt.default)((0,Mt.default)({},t),{},{ref:i,icon:ke.default}))};zt.displayName="WifiOutlined";var xe=Ut.forwardRef(zt);tt.default=xe;(function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(tt);function n(r){return r&&r.__esModule?r:{default:r}}var o=i;t.default=o,e.exports=o})(pt,pt.exports);const Oe=se(pt.exports);var Ue=globalThis&&globalThis.__rest||function(e,t){var i={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(i[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(i[n[o]]=e[n[o]]);return i},ze=function(t){var i,n=t.prefixCls,o=t.className,r=t.checked,s=t.onChange,u=t.onClick,l=Ue(t,["prefixCls","className","checked","onChange","onClick"]),a=P.exports.useContext(_t),c=a.getPrefixCls,y=function(w){s==null||s(!r),u==null||u(w)},d=c("tag",n),f=xt(d,(i={},_(i,"".concat(d,"-checkable"),!0),_(i,"".concat(d,"-checkable-checked"),r),i),o);return p("span",{...l,className:f,onClick:y})};const $e=ze;var He=globalThis&&globalThis.__rest||function(e,t){var i={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(i[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(i[n[o]]=e[n[o]]);return i},je=new RegExp("^(".concat(he.join("|"),")(-inverse)?$")),Ve=new RegExp("^(".concat(ge.join("|"),")$")),qe=function(t,i){var n,o=t.prefixCls,r=t.className,s=t.style,u=t.children,l=t.icon,a=t.color,c=t.onClose,y=t.closeIcon,d=t.closable,f=d===void 0?!1:d,h=He(t,["prefixCls","className","style","children","icon","color","onClose","closeIcon","closable"]),w=P.exports.useContext(_t),F=w.getPrefixCls,m=w.direction,E=P.exports.useState(!0),g=Ce(E,2),C=g[0],B=g[1];P.exports.useEffect(function(){"visible"in h&&B(h.visible)},[h.visible]);var b=function(){return a?je.test(a)||Ve.test(a):!1},v=ue({backgroundColor:a&&!b()?a:void 0},s),T=b(),N=F("tag",o),S=xt(N,(n={},_(n,"".concat(N,"-").concat(a),T),_(n,"".concat(N,"-has-color"),a&&!T),_(n,"".concat(N,"-hidden"),!C),_(n,"".concat(N,"-rtl"),m==="rtl"),n),r),R=function(it){it.stopPropagation(),c==null||c(it),!it.defaultPrevented&&("visible"in h||B(!1))},$=function(){return f?y?p("span",{className:"".concat(N,"-close-icon"),onClick:R,children:y}):p(we,{className:"".concat(N,"-close-icon"),onClick:R}):null},D="onClick"in h||u&&u.type==="a",re=pe(h,["visible"]),Nt=l||null,ie=Nt?A(le,{children:[Nt,p("span",{children:u})]}):u,Tt=A("span",{...re,ref:i,className:S,style:v,children:[ie,$()]});return D?p(me,{children:Tt}):Tt},$t=P.exports.forwardRef(qe);$t.CheckableTag=$e;const j=$t;function Ke(){ye().then(e=>{e==="app"?Be():window.open("/web/LogViewer")})}const Je=`
const config = {
  // \u4EE3\u7406\u670D\u52A1\u5668\u7AEF\u53E3\u53F7
  port: 8888,

  // \u5F00\u542Fhttps\u4EE3\u7406\u767D\u540D\u5355\uFF0C\u4E0D\u5728\u767D\u540D\u5355\u5185\u7684\u4E0D\u80FD\u6293\u5305\u770B\u8BF7\u6C42\u8BE6\u60C5
  // https = true, \u6293\u53D6\u5168\u90E8\u7684 https \u8BF7\u6C42
  https: [
    'v.qq.com:443'
  ],

  // \u7981\u6B62\u7F13\u5B58
  disableCache: true,

  // \u4EE3\u7406\u89C4\u5219\u5217\u8868
  rules: [
    // \u5C06\u7EBF\u4E0A\u6D41\u91CF\u8F6C\u5411\u672C\u5730 devServer
    {
      url: 'https://www.google.com/index.html',
      target: 'http://localhost:3000/',
    },

    // \u6587\u4EF6\u540D\u901A\u914D https://www.google.com/abc --> http://localhost:3000/abc
    {
      url: 'https://www.google.com/*',
      target: 'http://localhost:3000/',
    },

    // \u6587\u4EF6\u8DEF\u5F84\u901A\u914D https://www.google.com/a/b/c --> http://localhost:3000/a/b/c
    {
      url: 'https://www.google.com/**',
      target: 'http://localhost:3000/',
    },

    // \u53BB\u6389 url hash
    {
      // expample: https://sta-op.douyucdn.cn/front-publish/shark-apm-master/shark-apm.2fe1c95.js
      url: 'https://sta-op.douyucdn.cn/front-publish/shark-apm-master/*',
      target: 'http://localhost:3000/',
      rewrite: (path) => path.replace(/.w{7}.js/, '.js'),
    },

    // \u5C06\u6D41\u91CF\u8F6C\u5411\u6307\u5B9A IP (\u914D\u7F6EHOST)
    {
      url: 'https://www.google.com',
      target: '127.0.0.1',
    }

    // \u6DFB\u52A0\u8DE8\u57DF\u5934
    {
      url: 'https://www.google.com/**',
      responseHeaders: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
      },
    },

    // \u7EBF\u4E0A\u6D41\u91CF\u6307\u5411\u672C\u5730\u6587\u4EF6
    // https://www.google.com/a/b/c.html --> /path/to/a/b/c.html
    {
      url: 'https://www.google.com/**',
      target: '/path/to/',
    },

    // \u90E8\u5206\u8BF7\u6C42\u8D70\u7B2C\u4E09\u65B9\u4EE3\u7406\uFF0C\u6BD4\u5982google
    {
      url: "(google|stackoverflow|github).",
      proxy: "http://127.0.0.1:4780",
    },

    // \u4F7F\u7528 chrome-dev-tools \u8FDC\u7A0B\u8C03\u8BD5
    {
      url: 'm.v.qq.com/tvp/',
      debug: true
    },

    // \u4F7F\u7528 vconsole \u8FDC\u7A0B\u8C03\u8BD5
    {
      url: 'm.v.qq.com/tvp/',
      debug: 'vconsole'
    },

    // \u6A21\u62DF\u5F31\u7F51
    {
      url: 'm.v.qq.com/tvp',
      delay: 2000,
    },

    // \u6A21\u62DF\u9519\u8BEF
    {
      url: 'm.v.qq.com/tvp',
      target: 502,
    },
  ],
};

module.exports = config;
`;const We=e=>{const[t,i]=P.exports.useState(""),n=()=>Ae().then(s=>{i(s)});P.exports.useEffect(()=>{n(),be(n)},[]);const o=P.exports.useCallback(()=>{ve(t).then(s=>{s&&e.onCancel&&(Ct.success("\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539\u6210\u529F"),setTimeout(()=>e.onCancel(),300))})},[t]),r=({target:s})=>{i(s.value)};return P.exports.useEffect(()=>{const s=u=>{if((u.metaKey||u.ctrlKey)&&u.keyCode===83)return o(),u.preventDefault(),u.stopPropagation(),!1};return document.body.addEventListener("keydown",s),Fe(),()=>{document.body.removeEventListener("keydown",s)}},[o]),A("div",{className:"dialog-logs",children:[A("div",{className:"config-wrap",children:[p("div",{className:"left",children:p("textarea",{className:"scrollbar-style",value:t,onInput:r})}),A("div",{className:"right",children:[p("h2",{children:"\u914D\u7F6E\u6587\u4EF6\u793A\u4F8B\uFF1A"}),p("code",{children:p("pre",{className:"prettyprint lang-js",children:Je})})]})]}),p(Q,{className:"save-btn",onClick:o,type:"primary",shape:"round",children:"\u4FDD\u5B58"})]})};var K={},Ye=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},Ht={},I={};let bt;const Ge=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];I.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};I.getSymbolTotalCodewords=function(t){return Ge[t]};I.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t};I.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');bt=t};I.isKanjiModeEnabled=function(){return typeof bt<"u"};I.toSJIS=function(t){return bt(t)};var et={};(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+i)}}e.isValid=function(n){return n&&typeof n.bit<"u"&&n.bit>=0&&n.bit<4},e.from=function(n,o){if(e.isValid(n))return n;try{return t(n)}catch{return o}}})(et);function jt(){this.buffer=[],this.length=0}jt.prototype={get:function(e){const t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)===1},put:function(e,t){for(let i=0;i<t;i++)this.putBit((e>>>t-i-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var Qe=jt;function J(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}J.prototype.set=function(e,t,i,n){const o=e*this.size+t;this.data[o]=i,n&&(this.reservedBit[o]=!0)};J.prototype.get=function(e,t){return this.data[e*this.size+t]};J.prototype.xor=function(e,t,i){this.data[e*this.size+t]^=i};J.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]};var Xe=J,Vt={};(function(e){const t=I.getSymbolSize;e.getRowColCoords=function(n){if(n===1)return[];const o=Math.floor(n/7)+2,r=t(n),s=r===145?26:Math.ceil((r-13)/(2*o-2))*2,u=[r-7];for(let l=1;l<o-1;l++)u[l]=u[l-1]-s;return u.push(6),u.reverse()},e.getPositions=function(n){const o=[],r=e.getRowColCoords(n),s=r.length;for(let u=0;u<s;u++)for(let l=0;l<s;l++)u===0&&l===0||u===0&&l===s-1||u===s-1&&l===0||o.push([r[u],r[l]]);return o}})(Vt);var qt={};const Ze=I.getSymbolSize,Rt=7;qt.getPositions=function(t){const i=Ze(t);return[[0,0],[i-Rt,0],[0,i-Rt]]};var Kt={};(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},e.from=function(o){return e.isValid(o)?parseInt(o,10):void 0},e.getPenaltyN1=function(o){const r=o.size;let s=0,u=0,l=0,a=null,c=null;for(let y=0;y<r;y++){u=l=0,a=c=null;for(let d=0;d<r;d++){let f=o.get(y,d);f===a?u++:(u>=5&&(s+=t.N1+(u-5)),a=f,u=1),f=o.get(d,y),f===c?l++:(l>=5&&(s+=t.N1+(l-5)),c=f,l=1)}u>=5&&(s+=t.N1+(u-5)),l>=5&&(s+=t.N1+(l-5))}return s},e.getPenaltyN2=function(o){const r=o.size;let s=0;for(let u=0;u<r-1;u++)for(let l=0;l<r-1;l++){const a=o.get(u,l)+o.get(u,l+1)+o.get(u+1,l)+o.get(u+1,l+1);(a===4||a===0)&&s++}return s*t.N2},e.getPenaltyN3=function(o){const r=o.size;let s=0,u=0,l=0;for(let a=0;a<r;a++){u=l=0;for(let c=0;c<r;c++)u=u<<1&2047|o.get(a,c),c>=10&&(u===1488||u===93)&&s++,l=l<<1&2047|o.get(c,a),c>=10&&(l===1488||l===93)&&s++}return s*t.N3},e.getPenaltyN4=function(o){let r=0;const s=o.data.length;for(let l=0;l<s;l++)r+=o.data[l];return Math.abs(Math.ceil(r*100/s/5)-10)*t.N4};function i(n,o,r){switch(n){case e.Patterns.PATTERN000:return(o+r)%2===0;case e.Patterns.PATTERN001:return o%2===0;case e.Patterns.PATTERN010:return r%3===0;case e.Patterns.PATTERN011:return(o+r)%3===0;case e.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(r/3))%2===0;case e.Patterns.PATTERN101:return o*r%2+o*r%3===0;case e.Patterns.PATTERN110:return(o*r%2+o*r%3)%2===0;case e.Patterns.PATTERN111:return(o*r%3+(o+r)%2)%2===0;default:throw new Error("bad maskPattern:"+n)}}e.applyMask=function(o,r){const s=r.size;for(let u=0;u<s;u++)for(let l=0;l<s;l++)r.isReserved(l,u)||r.xor(l,u,i(o,l,u))},e.getBestMask=function(o,r){const s=Object.keys(e.Patterns).length;let u=0,l=1/0;for(let a=0;a<s;a++){r(a),e.applyMask(a,o);const c=e.getPenaltyN1(o)+e.getPenaltyN2(o)+e.getPenaltyN3(o)+e.getPenaltyN4(o);e.applyMask(a,o),c<l&&(l=c,u=a)}return u}})(Kt);var nt={};const L=et,Y=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],G=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];nt.getBlocksCount=function(t,i){switch(i){case L.L:return Y[(t-1)*4+0];case L.M:return Y[(t-1)*4+1];case L.Q:return Y[(t-1)*4+2];case L.H:return Y[(t-1)*4+3];default:return}};nt.getTotalCodewordsCount=function(t,i){switch(i){case L.L:return G[(t-1)*4+0];case L.M:return G[(t-1)*4+1];case L.Q:return G[(t-1)*4+2];case L.H:return G[(t-1)*4+3];default:return}};var Jt={},ot={};const V=new Uint8Array(512),X=new Uint8Array(256);(function(){let t=1;for(let i=0;i<255;i++)V[i]=t,X[t]=i,t<<=1,t&256&&(t^=285);for(let i=255;i<512;i++)V[i]=V[i-255]})();ot.log=function(t){if(t<1)throw new Error("log("+t+")");return X[t]};ot.exp=function(t){return V[t]};ot.mul=function(t,i){return t===0||i===0?0:V[X[t]+X[i]]};(function(e){const t=ot;e.mul=function(n,o){const r=new Uint8Array(n.length+o.length-1);for(let s=0;s<n.length;s++)for(let u=0;u<o.length;u++)r[s+u]^=t.mul(n[s],o[u]);return r},e.mod=function(n,o){let r=new Uint8Array(n);for(;r.length-o.length>=0;){const s=r[0];for(let l=0;l<o.length;l++)r[l]^=t.mul(o[l],s);let u=0;for(;u<r.length&&r[u]===0;)u++;r=r.slice(u)}return r},e.generateECPolynomial=function(n){let o=new Uint8Array([1]);for(let r=0;r<n;r++)o=e.mul(o,new Uint8Array([1,t.exp(r)]));return o}})(Jt);const Wt=Jt;function vt(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}vt.prototype.initialize=function(t){this.degree=t,this.genPoly=Wt.generateECPolynomial(this.degree)};vt.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const i=new Uint8Array(t.length+this.degree);i.set(t);const n=Wt.mod(i,this.genPoly),o=this.degree-n.length;if(o>0){const r=new Uint8Array(this.degree);return r.set(n,o),r}return n};var tn=vt,Yt={},k={},Ft={};Ft.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var M={};const Gt="[0-9]+",en="[A-Z $%*+\\-./:]+";let q="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";q=q.replace(/u/g,"\\u");const nn="(?:(?![A-Z0-9 $%*+\\-./:]|"+q+`)(?:.|[\r
]))+`;M.KANJI=new RegExp(q,"g");M.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");M.BYTE=new RegExp(nn,"g");M.NUMERIC=new RegExp(Gt,"g");M.ALPHANUMERIC=new RegExp(en,"g");const on=new RegExp("^"+q+"$"),rn=new RegExp("^"+Gt+"$"),sn=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");M.testKanji=function(t){return on.test(t)};M.testNumeric=function(t){return rn.test(t)};M.testAlphanumeric=function(t){return sn.test(t)};(function(e){const t=Ft,i=M;e.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(r,s){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?r.ccBits[0]:s<27?r.ccBits[1]:r.ccBits[2]},e.getBestModeForData=function(r){return i.testNumeric(r)?e.NUMERIC:i.testAlphanumeric(r)?e.ALPHANUMERIC:i.testKanji(r)?e.KANJI:e.BYTE},e.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},e.isValid=function(r){return r&&r.bit&&r.ccBits};function n(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+o)}}e.from=function(r,s){if(e.isValid(r))return r;try{return n(r)}catch{return s}}})(k);(function(e){const t=I,i=nt,n=et,o=k,r=Ft,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,u=t.getBCHDigit(s);function l(d,f,h){for(let w=1;w<=40;w++)if(f<=e.getCapacity(w,h,d))return w}function a(d,f){return o.getCharCountIndicator(d,f)+4}function c(d,f){let h=0;return d.forEach(function(w){h+=a(w.mode,f)+w.getBitsLength()}),h}function y(d,f){for(let h=1;h<=40;h++)if(c(d,h)<=e.getCapacity(h,f,o.MIXED))return h}e.from=function(f,h){return r.isValid(f)?parseInt(f,10):h},e.getCapacity=function(f,h,w){if(!r.isValid(f))throw new Error("Invalid QR Code version");typeof w>"u"&&(w=o.BYTE);const F=t.getSymbolTotalCodewords(f),m=i.getTotalCodewordsCount(f,h),E=(F-m)*8;if(w===o.MIXED)return E;const g=E-a(w,f);switch(w){case o.NUMERIC:return Math.floor(g/10*3);case o.ALPHANUMERIC:return Math.floor(g/11*2);case o.KANJI:return Math.floor(g/13);case o.BYTE:default:return Math.floor(g/8)}},e.getBestVersionForData=function(f,h){let w;const F=n.from(h,n.M);if(Array.isArray(f)){if(f.length>1)return y(f,F);if(f.length===0)return 1;w=f[0]}else w=f;return l(w.mode,w.getLength(),F)},e.getEncodedBits=function(f){if(!r.isValid(f)||f<7)throw new Error("Invalid QR Code version");let h=f<<12;for(;t.getBCHDigit(h)-u>=0;)h^=s<<t.getBCHDigit(h)-u;return f<<12|h}})(Yt);var Qt={};const mt=I,Xt=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,un=1<<14|1<<12|1<<10|1<<4|1<<1,Lt=mt.getBCHDigit(Xt);Qt.getEncodedBits=function(t,i){const n=t.bit<<3|i;let o=n<<10;for(;mt.getBCHDigit(o)-Lt>=0;)o^=Xt<<mt.getBCHDigit(o)-Lt;return(n<<10|o)^un};var Zt={};const ln=k;function x(e){this.mode=ln.NUMERIC,this.data=e.toString()}x.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};x.prototype.getLength=function(){return this.data.length};x.prototype.getBitsLength=function(){return x.getBitsLength(this.data.length)};x.prototype.write=function(t){let i,n,o;for(i=0;i+3<=this.data.length;i+=3)n=this.data.substr(i,3),o=parseInt(n,10),t.put(o,10);const r=this.data.length-i;r>0&&(n=this.data.substr(i),o=parseInt(n,10),t.put(o,r*3+1))};var an=x;const cn=k,ct=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function O(e){this.mode=cn.ALPHANUMERIC,this.data=e}O.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};O.prototype.getLength=function(){return this.data.length};O.prototype.getBitsLength=function(){return O.getBitsLength(this.data.length)};O.prototype.write=function(t){let i;for(i=0;i+2<=this.data.length;i+=2){let n=ct.indexOf(this.data[i])*45;n+=ct.indexOf(this.data[i+1]),t.put(n,11)}this.data.length%2&&t.put(ct.indexOf(this.data[i]),6)};var fn=O,dn=function(t){for(var i=[],n=t.length,o=0;o<n;o++){var r=t.charCodeAt(o);if(r>=55296&&r<=56319&&n>o+1){var s=t.charCodeAt(o+1);s>=56320&&s<=57343&&(r=(r-55296)*1024+s-56320+65536,o+=1)}if(r<128){i.push(r);continue}if(r<2048){i.push(r>>6|192),i.push(r&63|128);continue}if(r<55296||r>=57344&&r<65536){i.push(r>>12|224),i.push(r>>6&63|128),i.push(r&63|128);continue}if(r>=65536&&r<=1114111){i.push(r>>18|240),i.push(r>>12&63|128),i.push(r>>6&63|128),i.push(r&63|128);continue}i.push(239,191,189)}return new Uint8Array(i).buffer};const hn=dn,gn=k;function U(e){this.mode=gn.BYTE,typeof e=="string"&&(e=hn(e)),this.data=new Uint8Array(e)}U.getBitsLength=function(t){return t*8};U.prototype.getLength=function(){return this.data.length};U.prototype.getBitsLength=function(){return U.getBitsLength(this.data.length)};U.prototype.write=function(e){for(let t=0,i=this.data.length;t<i;t++)e.put(this.data[t],8)};var Cn=U;const pn=k,mn=I;function z(e){this.mode=pn.KANJI,this.data=e}z.getBitsLength=function(t){return t*13};z.prototype.getLength=function(){return this.data.length};z.prototype.getBitsLength=function(){return z.getBitsLength(this.data.length)};z.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let i=mn.toSJIS(this.data[t]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);i=(i>>>8&255)*192+(i&255),e.put(i,13)}};var wn=z,te={exports:{}};(function(e){var t={single_source_shortest_paths:function(i,n,o){var r={},s={};s[n]=0;var u=t.PriorityQueue.make();u.push(n,0);for(var l,a,c,y,d,f,h,w,F;!u.empty();){l=u.pop(),a=l.value,y=l.cost,d=i[a]||{};for(c in d)d.hasOwnProperty(c)&&(f=d[c],h=y+f,w=s[c],F=typeof s[c]>"u",(F||w>h)&&(s[c]=h,u.push(c,h),r[c]=a))}if(typeof o<"u"&&typeof s[o]>"u"){var m=["Could not find a path from ",n," to ",o,"."].join("");throw new Error(m)}return r},extract_shortest_path_from_predecessor_list:function(i,n){for(var o=[],r=n;r;)o.push(r),i[r],r=i[r];return o.reverse(),o},find_path:function(i,n,o){var r=t.single_source_shortest_paths(i,n,o);return t.extract_shortest_path_from_predecessor_list(r,o)},PriorityQueue:{make:function(i){var n=t.PriorityQueue,o={},r;i=i||{};for(r in n)n.hasOwnProperty(r)&&(o[r]=n[r]);return o.queue=[],o.sorter=i.sorter||n.default_sorter,o},default_sorter:function(i,n){return i.cost-n.cost},push:function(i,n){var o={value:i,cost:n};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(te);(function(e){const t=k,i=an,n=fn,o=Cn,r=wn,s=M,u=I,l=te.exports;function a(m){return unescape(encodeURIComponent(m)).length}function c(m,E,g){const C=[];let B;for(;(B=m.exec(g))!==null;)C.push({data:B[0],index:B.index,mode:E,length:B[0].length});return C}function y(m){const E=c(s.NUMERIC,t.NUMERIC,m),g=c(s.ALPHANUMERIC,t.ALPHANUMERIC,m);let C,B;return u.isKanjiModeEnabled()?(C=c(s.BYTE,t.BYTE,m),B=c(s.KANJI,t.KANJI,m)):(C=c(s.BYTE_KANJI,t.BYTE,m),B=[]),E.concat(g,C,B).sort(function(v,T){return v.index-T.index}).map(function(v){return{data:v.data,mode:v.mode,length:v.length}})}function d(m,E){switch(E){case t.NUMERIC:return i.getBitsLength(m);case t.ALPHANUMERIC:return n.getBitsLength(m);case t.KANJI:return r.getBitsLength(m);case t.BYTE:return o.getBitsLength(m)}}function f(m){return m.reduce(function(E,g){const C=E.length-1>=0?E[E.length-1]:null;return C&&C.mode===g.mode?(E[E.length-1].data+=g.data,E):(E.push(g),E)},[])}function h(m){const E=[];for(let g=0;g<m.length;g++){const C=m[g];switch(C.mode){case t.NUMERIC:E.push([C,{data:C.data,mode:t.ALPHANUMERIC,length:C.length},{data:C.data,mode:t.BYTE,length:C.length}]);break;case t.ALPHANUMERIC:E.push([C,{data:C.data,mode:t.BYTE,length:C.length}]);break;case t.KANJI:E.push([C,{data:C.data,mode:t.BYTE,length:a(C.data)}]);break;case t.BYTE:E.push([{data:C.data,mode:t.BYTE,length:a(C.data)}])}}return E}function w(m,E){const g={},C={start:{}};let B=["start"];for(let b=0;b<m.length;b++){const v=m[b],T=[];for(let N=0;N<v.length;N++){const S=v[N],R=""+b+N;T.push(R),g[R]={node:S,lastCount:0},C[R]={};for(let $=0;$<B.length;$++){const D=B[$];g[D]&&g[D].node.mode===S.mode?(C[D][R]=d(g[D].lastCount+S.length,S.mode)-d(g[D].lastCount,S.mode),g[D].lastCount+=S.length):(g[D]&&(g[D].lastCount=S.length),C[D][R]=d(S.length,S.mode)+4+t.getCharCountIndicator(S.mode,E))}}B=T}for(let b=0;b<B.length;b++)C[B[b]].end=0;return{map:C,table:g}}function F(m,E){let g;const C=t.getBestModeForData(m);if(g=t.from(E,C),g!==t.BYTE&&g.bit<C.bit)throw new Error('"'+m+'" cannot be encoded with mode '+t.toString(g)+`.
 Suggested mode is: `+t.toString(C));switch(g===t.KANJI&&!u.isKanjiModeEnabled()&&(g=t.BYTE),g){case t.NUMERIC:return new i(m);case t.ALPHANUMERIC:return new n(m);case t.KANJI:return new r(m);case t.BYTE:return new o(m)}}e.fromArray=function(E){return E.reduce(function(g,C){return typeof C=="string"?g.push(F(C,null)):C.data&&g.push(F(C.data,C.mode)),g},[])},e.fromString=function(E,g){const C=y(E,u.isKanjiModeEnabled()),B=h(C),b=w(B,g),v=l.find_path(b.map,"start","end"),T=[];for(let N=1;N<v.length-1;N++)T.push(b.table[v[N]].node);return e.fromArray(f(T))},e.rawSplit=function(E){return e.fromArray(y(E,u.isKanjiModeEnabled()))}})(Zt);const rt=I,ft=et,En=Qe,yn=Xe,Bn=Vt,bn=qt,wt=Kt,Et=nt,vn=tn,Z=Yt,Fn=Qt,An=k,dt=Zt;function Pn(e,t){const i=e.size,n=bn.getPositions(t);for(let o=0;o<n.length;o++){const r=n[o][0],s=n[o][1];for(let u=-1;u<=7;u++)if(!(r+u<=-1||i<=r+u))for(let l=-1;l<=7;l++)s+l<=-1||i<=s+l||(u>=0&&u<=6&&(l===0||l===6)||l>=0&&l<=6&&(u===0||u===6)||u>=2&&u<=4&&l>=2&&l<=4?e.set(r+u,s+l,!0,!0):e.set(r+u,s+l,!1,!0))}}function Nn(e){const t=e.size;for(let i=8;i<t-8;i++){const n=i%2===0;e.set(i,6,n,!0),e.set(6,i,n,!0)}}function Tn(e,t){const i=Bn.getPositions(t);for(let n=0;n<i.length;n++){const o=i[n][0],r=i[n][1];for(let s=-2;s<=2;s++)for(let u=-2;u<=2;u++)s===-2||s===2||u===-2||u===2||s===0&&u===0?e.set(o+s,r+u,!0,!0):e.set(o+s,r+u,!1,!0)}}function In(e,t){const i=e.size,n=Z.getEncodedBits(t);let o,r,s;for(let u=0;u<18;u++)o=Math.floor(u/3),r=u%3+i-8-3,s=(n>>u&1)===1,e.set(o,r,s,!0),e.set(r,o,s,!0)}function ht(e,t,i){const n=e.size,o=Fn.getEncodedBits(t,i);let r,s;for(r=0;r<15;r++)s=(o>>r&1)===1,r<6?e.set(r,8,s,!0):r<8?e.set(r+1,8,s,!0):e.set(n-15+r,8,s,!0),r<8?e.set(8,n-r-1,s,!0):r<9?e.set(8,15-r-1+1,s,!0):e.set(8,15-r-1,s,!0);e.set(n-8,8,1,!0)}function Sn(e,t){const i=e.size;let n=-1,o=i-1,r=7,s=0;for(let u=i-1;u>0;u-=2)for(u===6&&u--;;){for(let l=0;l<2;l++)if(!e.isReserved(o,u-l)){let a=!1;s<t.length&&(a=(t[s]>>>r&1)===1),e.set(o,u-l,a),r--,r===-1&&(s++,r=7)}if(o+=n,o<0||i<=o){o-=n,n=-n;break}}}function Dn(e,t,i){const n=new En;i.forEach(function(l){n.put(l.mode.bit,4),n.put(l.getLength(),An.getCharCountIndicator(l.mode,e)),l.write(n)});const o=rt.getSymbolTotalCodewords(e),r=Et.getTotalCodewordsCount(e,t),s=(o-r)*8;for(n.getLengthInBits()+4<=s&&n.put(0,4);n.getLengthInBits()%8!==0;)n.putBit(0);const u=(s-n.getLengthInBits())/8;for(let l=0;l<u;l++)n.put(l%2?17:236,8);return Mn(n,e,t)}function Mn(e,t,i){const n=rt.getSymbolTotalCodewords(t),o=Et.getTotalCodewordsCount(t,i),r=n-o,s=Et.getBlocksCount(t,i),u=n%s,l=s-u,a=Math.floor(n/s),c=Math.floor(r/s),y=c+1,d=a-c,f=new vn(d);let h=0;const w=new Array(s),F=new Array(s);let m=0;const E=new Uint8Array(e.buffer);for(let v=0;v<s;v++){const T=v<l?c:y;w[v]=E.slice(h,h+T),F[v]=f.encode(w[v]),h+=T,m=Math.max(m,T)}const g=new Uint8Array(n);let C=0,B,b;for(B=0;B<m;B++)for(b=0;b<s;b++)B<w[b].length&&(g[C++]=w[b][B]);for(B=0;B<d;B++)for(b=0;b<s;b++)g[C++]=F[b][B];return g}function Rn(e,t,i,n){let o;if(Array.isArray(e))o=dt.fromArray(e);else if(typeof e=="string"){let a=t;if(!a){const c=dt.rawSplit(e);a=Z.getBestVersionForData(c,i)}o=dt.fromString(e,a||40)}else throw new Error("Invalid data");const r=Z.getBestVersionForData(o,i);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=r;else if(t<r)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+r+`.
`);const s=Dn(t,i,o),u=rt.getSymbolSize(t),l=new yn(u);return Pn(l,t),Nn(l),Tn(l,t),ht(l,i,0),t>=7&&In(l,t),Sn(l,s),isNaN(n)&&(n=wt.getBestMask(l,ht.bind(null,l,i))),wt.applyMask(n,l),ht(l,i,n),{modules:l,version:t,errorCorrectionLevel:i,maskPattern:n,segments:o}}Ht.create=function(t,i){if(typeof t>"u"||t==="")throw new Error("No input text");let n=ft.M,o,r;return typeof i<"u"&&(n=ft.from(i.errorCorrectionLevel,ft.M),o=Z.from(i.version),r=wt.from(i.maskPattern),i.toSJISFunc&&rt.setToSJISFunction(i.toSJISFunc)),Rn(t,o,n,r)};var ee={},At={};(function(e){function t(i){if(typeof i=="number"&&(i=i.toString()),typeof i!="string")throw new Error("Color should be defined as hex string");let n=i.slice().replace("#","").split("");if(n.length<3||n.length===5||n.length>8)throw new Error("Invalid hex color: "+i);(n.length===3||n.length===4)&&(n=Array.prototype.concat.apply([],n.map(function(r){return[r,r]}))),n.length===6&&n.push("F","F");const o=parseInt(n.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+n.slice(0,6).join("")}}e.getOptions=function(n){n||(n={}),n.color||(n.color={});const o=typeof n.margin>"u"||n.margin===null||n.margin<0?4:n.margin,r=n.width&&n.width>=21?n.width:void 0,s=n.scale||4;return{width:r,scale:r?4:s,margin:o,color:{dark:t(n.color.dark||"#000000ff"),light:t(n.color.light||"#ffffffff")},type:n.type,rendererOpts:n.rendererOpts||{}}},e.getScale=function(n,o){return o.width&&o.width>=n+o.margin*2?o.width/(n+o.margin*2):o.scale},e.getImageWidth=function(n,o){const r=e.getScale(n,o);return Math.floor((n+o.margin*2)*r)},e.qrToImageData=function(n,o,r){const s=o.modules.size,u=o.modules.data,l=e.getScale(s,r),a=Math.floor((s+r.margin*2)*l),c=r.margin*l,y=[r.color.light,r.color.dark];for(let d=0;d<a;d++)for(let f=0;f<a;f++){let h=(d*a+f)*4,w=r.color.light;if(d>=c&&f>=c&&d<a-c&&f<a-c){const F=Math.floor((d-c)/l),m=Math.floor((f-c)/l);w=y[u[F*s+m]?1:0]}n[h++]=w.r,n[h++]=w.g,n[h++]=w.b,n[h]=w.a}}})(At);(function(e){const t=At;function i(o,r,s){o.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=s,r.width=s,r.style.height=s+"px",r.style.width=s+"px"}function n(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(r,s,u){let l=u,a=s;typeof l>"u"&&(!s||!s.getContext)&&(l=s,s=void 0),s||(a=n()),l=t.getOptions(l);const c=t.getImageWidth(r.modules.size,l),y=a.getContext("2d"),d=y.createImageData(c,c);return t.qrToImageData(d.data,r,l),i(y,a,c),y.putImageData(d,0,0),a},e.renderToDataURL=function(r,s,u){let l=u;typeof l>"u"&&(!s||!s.getContext)&&(l=s,s=void 0),l||(l={});const a=e.render(r,s,l),c=l.type||"image/png",y=l.rendererOpts||{};return a.toDataURL(c,y.quality)}})(ee);var ne={};const Ln=At;function kt(e,t){const i=e.a/255,n=t+'="'+e.hex+'"';return i<1?n+" "+t+'-opacity="'+i.toFixed(2).slice(1)+'"':n}function gt(e,t,i){let n=e+t;return typeof i<"u"&&(n+=" "+i),n}function kn(e,t,i){let n="",o=0,r=!1,s=0;for(let u=0;u<e.length;u++){const l=Math.floor(u%t),a=Math.floor(u/t);!l&&!r&&(r=!0),e[u]?(s++,u>0&&l>0&&e[u-1]||(n+=r?gt("M",l+i,.5+a+i):gt("m",o,0),o=0,r=!1),l+1<t&&e[u+1]||(n+=gt("h",s),s=0)):o++}return n}ne.render=function(t,i,n){const o=Ln.getOptions(i),r=t.modules.size,s=t.modules.data,u=r+o.margin*2,l=o.color.light.a?"<path "+kt(o.color.light,"fill")+' d="M0 0h'+u+"v"+u+'H0z"/>':"",a="<path "+kt(o.color.dark,"stroke")+' d="'+kn(s,r,o.margin)+'"/>',c='viewBox="0 0 '+u+" "+u+'"',y=o.width?'width="'+o.width+'" height="'+o.width+'" ':"",d='<svg xmlns="http://www.w3.org/2000/svg" '+y+c+' shape-rendering="crispEdges">'+l+a+`</svg>
`;return typeof n=="function"&&n(null,d),d};const _n=Ye,yt=Ht,oe=ee,xn=ne;function Pt(e,t,i,n,o){const r=[].slice.call(arguments,1),s=r.length,u=typeof r[s-1]=="function";if(!u&&!_n())throw new Error("Callback required as last argument");if(u){if(s<2)throw new Error("Too few arguments provided");s===2?(o=i,i=t,t=n=void 0):s===3&&(t.getContext&&typeof o>"u"?(o=n,n=void 0):(o=n,n=i,i=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(i=t,t=n=void 0):s===2&&!t.getContext&&(n=i,i=t,t=void 0),new Promise(function(l,a){try{const c=yt.create(i,n);l(e(c,t,n))}catch(c){a(c)}})}try{const l=yt.create(i,n);o(null,e(l,t,n))}catch(l){o(l)}}K.create=yt.create;K.toCanvas=Pt.bind(null,oe.render);K.toDataURL=Pt.bind(null,oe.renderToDataURL);K.toString=Pt.bind(null,function(e,t,i){return xn.render(e,i)});const On=()=>{const e=P.exports.useRef(null),[t,i]=P.exports.useState(""),[n,o]=P.exports.useState(""),[r,s]=P.exports.useState(""),u=a=>K.toCanvas(e.current,a,{width:200}),l=()=>{Te().then(a=>{typeof a=="string"?o(a):(a==null?void 0:a.code)===0?Ct.success((a==null?void 0:a.msg)||"\u5B89\u88C5\u8BC1\u4E66\u6210\u529F"):Ct.error((a==null?void 0:a.msg)||"\u5B89\u88C5\u8BC1\u4E66\u5931\u8D25")})};return P.exports.useEffect(()=>{Pe().then(a=>{Ne().then(c=>{const y=Array.isArray(c)?c:[],[d]=y.filter(f=>f!=="127.0.0.1");if(d){const f=`http://${d}:${a}/install`,h=A("span",{children:["http://",p("b",{onClick:w=>St(w,d),style:{color:"red",cursor:"pointer"},children:d}),":",a,"/install"]});u(f),i(f),s(h)}else{const f=`http://127.0.0.1:${a||8888}/install`;u(f),i(f)}})})},[]),A("div",{className:"install-modal",children:[A(st,{gutter:16,children:[p(ut,{span:8,children:A(lt,{title:"Windows\u7535\u8111\u7AEF\u4E0B\u8F7D\u8BC1\u4E66",bordered:!1,children:[r?p("div",{className:"url",children:r}):null,t?p("div",{children:p(Q,{type:"primary",onClick:l,shape:"round",children:"\u4E00\u952E\u5B89\u88C5"})}):null]})}),p(ut,{span:8,children:A(lt,{title:"\u624B\u673A\u7AEF\u5B89\u88C5\u8BC1\u4E66",bordered:!1,children:[p("div",{className:"tip-text",children:"\u8BF7\u4FDD\u6301\u624B\u673A\u8DDF\u7535\u8111\u5728\u4E00\u4E2A\u5C40\u57DF\u7F51\u5185"}),p("canvas",{ref:e})]})}),p(ut,{span:8,children:A(lt,{title:"MacOS\u7AEF\u5B89\u88C5\u8BC1\u4E66",bordered:!1,children:[n?A("div",{children:[p("div",{className:"tip-text",children:"\u590D\u5236\u5982\u4E0B\u547D\u4EE4\u5230 Terminal \u6267\u884C\uFF0C\u5373\u53EF\u5B8C\u6210\u8BC1\u4E66\u5B89\u88C5"}),p(Ee,{title:"\u70B9\u51FB\u590D\u5236\u6307\u4EE4",children:p("code",{onClick:a=>St(a,n),children:p("pre",{children:n})})})]}):null,n?null:p(Q,{type:"primary",onClick:l,shape:"round",children:"MacOS\u5B89\u88C5\u8BC1\u4E66"})]})})]}),p(st,{children:p("div",{style:{height:1,borderTop:"1px solid #444",width:"100%"}})}),p(st,{children:A("div",{className:"install-helper",children:[p(Q,{type:"text",onClick:()=>window.open(t),style:{marginRight:20},children:"\u70B9\u51FB\u4E0B\u8F7D\u8BC1\u4E66"}),p("a",{href:"https://www.yuque.com/zobor/bo4kgc/txy5nz",target:"_blank",children:"\u5B89\u88C5\u5931\u8D25\uFF1F\u624B\u52A8\u5B89\u88C5\u8BC1\u4E66\u6307\u5F15"})]})})]})};const Un=e=>p(Ot,{title:"\u7F16\u8F91\u914D\u7F6E\u6587\u4EF6",width:window.innerWidth*.8,centered:!0,...e,children:p(We,{onCancel:e.onCancel})}),zn=e=>p(Ot,{title:"\u5B89\u88C5 HTTPS \u8BC1\u4E66",width:800,centered:!0,...e,children:p(On,{})}),$n={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},qn=()=>{const[e,t]=P.exports.useState(""),{state:i,toggle:n}=at(!1),{state:o,toggle:r}=at(!1);at(!1);const[s,u]=P.exports.useState(""),l=()=>{Me().then(c=>{u(c)})},a=()=>{Ke()};return P.exports.useEffect(()=>{Ie().then(c=>t(c)),l()},[]),A("div",{className:"dialog-settings",children:[A(H,{name:"time_related_controls",...$n,children:[p(H.Item,{label:"\u7248\u672C\u53F7",children:p("div",{children:p(j,{style:{cursor:"pointer"},onClick:Se,color:"volcano",children:e})})}),p(H.Item,{label:"\u7F16\u8F91\u914D\u7F6E",children:A("div",{children:[s,p(j,{style:{cursor:"pointer",marginLeft:5},onClick:n,color:"volcano",children:"\u7F16\u8F91"})]})}),p(H.Item,{label:"\u529F\u80FD\u5F00\u5173",children:A(j,{style:{cursor:"pointer"},onClick:r,color:"#f50",children:[p(Oe,{}),"\u5B89\u88C5\u8BC1\u4E66"]})}),A(H.Item,{label:"\u529F\u80FD\u5F00\u5173",children:[p(j,{style:{cursor:"pointer"},onClick:a,color:"#f50",children:"\u67E5\u770B\u65E5\u5FD7"}),p(j,{style:{cursor:"pointer"},onClick:De,color:"#f50",children:"\u6E05\u7A7A\u65E5\u5FD7"})]})]}),p(Un,{onCancel:n,visible:i}),p(zn,{onCancel:r,visible:o})]})};export{qn as default};