(()=>{"use strict";var e={753:function(e,t,n){var r,o=n("704"),a=n("195"),i=n("902");let l=(e,t,n)=>{let[,r]=(0,i.useState)({}),o=(0,i.useRef)({data:e,deps:n||[],ready:!1,_loading:{},lastRender:0,lastRenderCount:0,delayedRender:!1,delayedRenderTimeout:null,overRenderTimeout:null}).current;if((0,i.useEffect)(()=>{o.ready=!0,t&&t({init:!0,setDelayedRender(e){o.delayedRender=e}})},[]),!1===o.ready)o._loading={},o.data.render=()=>{if(o.ready){if(o.delayedRender){Date.now()-o.lastRender>100?(o.lastRender=Date.now(),r({})):(clearTimeout(o.delayedRenderTimeout),o.delayedRenderTimeout=setTimeout(o.data.render,50));return}if(Date.now()-o.lastRender<500?o.lastRenderCount++:o.lastRenderCount=0,o.lastRender=Date.now(),o.lastRenderCount>1e3){clearTimeout(o.overRenderTimeout),o.overRenderTimeout=setTimeout(()=>{o.lastRenderCount=0,o.lastRender=Date.now(),r({})},1e3),console.error(`local.render executed ${o.lastRenderCount} times in less than 300ms`);return}r({})}};else if(o.deps.length>0&&n){for(let[e,r]of Object.entries(n))if(o.deps[e]!==r){o.deps[e]=r,t&&setTimeout(()=>{t({init:!1,setDelayedRender(e){o.delayedRender=e}})});break}}return o.data},s=window,c=e=>{let{children:t,className:n,show:r,backdrop:a,note:c,alt:u,pointer:d}=e,p=l({icon:(0,o.jsx)("div",{className:"px-4 py-1",children:"Loading..."}),value:.111,ival:null},()=>{});(0,i.useEffect)(()=>(p.ival=setInterval(()=>{p.value+=.1333,p.value>=1.3&&(p.value=0),p.render()},200),s.loadingIcon&&(p.icon=(0,o.jsx)("img",{alt:"loading",src:s.loadingIcon,className:css`
            width: 42px;
            height: 42px;
          `}),p.render()),()=>{clearInterval(p.ival)}),[]);let f=s.ContentLoading;return(0,o.jsxs)(o.Fragment,{children:[!1!==a&&(0,o.jsx)("div",{className:cx("flex items-center z-40 bg-white pointer-events-none","w-full h-full fixed transition-all duration-1000",void 0!==r?r?"opacity-50":"opacity-0":"opacity-50"),onContextMenuCapture:e=>{e.preventDefault()}}),t?(0,o.jsx)("div",{onContextMenuCapture:e=>{e.preventDefault()},className:cx("flex flex-1 items-center justify-center z-40 transition-all",n||(!1!==a?"w-full h-full fixed":""),void 0!==r?r?"":"hidden":""),children:(0,o.jsx)("div",{className:"flex items-center justify-center flex-col space-y-3 bg-white p-4 rounded-lg select-none",children:(0,o.jsx)("div",{className:"text-sm",children:t})})}):(0,o.jsx)("div",{className:cx("flex flex-1 items-center justify-center z-40  transition-all",!0!==d&&"pointer-events-none",n||(!1!==a?"w-full h-full fixed":""),void 0!==r?r?"":"hidden":""),children:f?(0,o.jsx)(f,{alt:u,note:c}):(0,o.jsxs)("div",{className:cx("w-1/6 flex flex-col items-center justify-center",css`
                  min-width: 30px;
                  .pr-outer {
                    background: rgba(0, 0, 0, 0.1) !important;
                  }
                `),children:[(0,o.jsx)("div",{className:"text-[10px] text-slate-400 whitespace-nowrap",children:c}),(0,o.jsx)("div",{className:"pr-outer w-full h-[3px] flex items-stretch rounded-sm overflow-hidden",children:(0,o.jsx)("div",{className:cx("bg-blue-800 transition-all duration-200 rounded-sm w-full",css`
                      transform: translate(${-100+200*p.value}%);
                    `)})}),u]})})]})};var u=n("927");let d=window,p={root:null,url(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=t.map(e=>Array.isArray(e)?e.join(""):e).join(""),o=this.root.toString();return(o.endsWith("/")&&(o=o.substring(0,o.length-1)),r.startsWith("/"))?o+r:o+"/"+r},get pathname(){let e=location.pathname.substring(p.root.pathname.length);if(!e.startsWith("/"))return`/${e}`;return e}},f=()=>{if(!p.root){let e=new URL(location.href);d._prasi.basepath&&(e.pathname=d._prasi.basepath),p.root=new URL(`${e.protocol}//${e.host}${e.pathname}`),p.root.pathname.endsWith("/")&&(p.root.pathname=p.root.pathname.substring(0,p.root.length-1))}},h={route:null,promise:null},m=()=>h.promise?h.promise:(h.promise=new Promise(async e=>{h.route&&e(h.route);let t=await fetch(p.url`_prasi/route`);!t.headers.get("content-encoding")&&fetch(p.url`_prasi/compress/only-gz`),h.route=await t.json(),e(h.route)}),h.promise),g=async()=>{let e=(0,u.p7)(),t=[],n={id:"",name:"",domain:"",responsive:"all",api_url:""},r={id:"",root:null};try{let o=await m();if(o&&o.site&&o.urls)for(let a of(n=o.site,r=o.layout,o.urls))e.insert(a.url,a),t.push(a)}catch(e){}return{router:e,pages:t,site:n,layout:r}};var y=n("275"),v=n("886");let w={ctx:{},render(){}},x=(0,i.createContext)(w),b=e=>{let{children:t}=e,[n,r]=(0,i.useState)({});return(0,o.jsx)(x.Provider,{value:{...w,render(){r({})}},children:t})},j=(e,t,n,r)=>new Proxy({},{get:(o,a,i)=>function(){for(var o=arguments.length,i=Array(o),l=0;l<o;l++)i[l]=arguments[l];e.mounted&&r({ref:t,state:n,update(e){e(n)}})[a].bind(j(e,t,n,r))(...i)}}),R=window;var _=n("904");BigInt.prototype.toJSON=function(){return"BigInt::"+this.toString()};let S="undefined"!=typeof window?window:null,C=void 0!==n.g?n.g:void 0,$=async(e,t,n,r)=>{let o={...n},a=null,i=!1,l=null,s=[];if(Array.isArray(t))for(let e of t)e instanceof File&&(s.push(e),i=!0),"function"==typeof e&&(l=e);else t instanceof File&&(i=!0,s.push(t));if(i){let e=new FormData;for(let t of s)e.append(t.name,t);a=e,delete o["content-type"],o.enctype="multipart/form-data;"}else a=JSON.stringify(t),o["content-type"]="aplication/json";let c=new URL(e);if(null!==S){let e=new URL(location.href),n="";if(n=c.host===e.host||C&&"function"==typeof C.server_hook?c.toString():`${e.protocol}//${e.host}/_proxy/${encodeURIComponent(c.toString())}`){if(l)return(await (0,_.Z)({method:t?"post":void 0,url:n,data:a,onUploadProgress:l})).data;{let e=await fetch(n,t?{method:"POST",body:a,headers:o}:void 0),i=await e.text();if(!1===r)return i;try{return JSON.parse(i,O)}catch(e){return i}}}}let u=await fetch(c,t?{method:"POST",body:a,headers:o}:void 0),d=await u.text();try{return JSON.parse(d,O)}catch(e){return d}},O=(e,t)=>"string"==typeof t&&t.startsWith("BigInt::")?BigInt(t.substring(8)):t,N=e=>{let t=new URL(e);if(null!==S){let e=new URL(location.href),n="";return n=t.host===e.host||C&&"function"==typeof C.server_hook?t.toString():`${e.protocol}//${e.host}/_proxy/${encodeURIComponent(t.toString())}`}return t};var P=n("72"),T=n.n(P);let k=async(e,t)=>{let n=T()(e,"/");await new Promise(e=>{let r=document,o=r.createElement("script");o.onload=async()=>{e()},!localStorage.getItem("api-ts-"+n)&&localStorage.setItem("api-ts-"+n,Date.now().toString());let a=new URL(n),i=new URL(location.href);i.search="",i.hash="",a.hash="";let l="";a.host!==i.host&&(l="&remote=1"),i.pathname="";let s=T()(i.toString(),"/");t?o.src=`${s}/_prasi/load.js?url=${n}&v3&dev=1${l}`:o.src=`${s}/_prasi/load.js?url=${n}&v3${l}`,o.onerror=()=>{e()},document.querySelector(`script[src="${o.src}"]`)?e():r.body.appendChild(o)})},L={},A=e=>{!R.prasiApi&&(R.prasiApi={});try{let t=new URL(e),n=`${t.protocol}//${t.host}`;return!R.prasiApi[n]&&!L[n]&&(L[n]=k(n,location.hostname.includes("prasi"))),new Proxy({},{get:(e,t)=>{if("_url"===t)return(e,t)=>{let r=new URL(n);r.pathname=e.split("/").filter(e=>e).join("/");let o=new URL(location.href),a="";return a=r.host===o.host||!1===t?r.toString():`${o.protocol}//${o.host}/_proxy/${encodeURIComponent(r.toString())}`};let r=e=>function(){for(var t=arguments.length,r=Array(t),o=0;o<t;o++)r[o]=arguments[o];return new Promise(async(t,o)=>{try{let a=R.prasiApi[n];if(!a&&L&&"object"==typeof L[n]&&(await L[n],a=R.prasiApi[n]),a){if(0===Object.keys(a).length){let o=`${n}/${e}`,a=await E(o,r);t(a);return}if("_raw"===e){let e=r[0],o=`${n}${e}`,a=await E(o,r.slice(1));t(a);return}if(!a.apiEntry&&(a.apiEntry={}),a.apiEntry&&!a.apiEntry[e]){o(`API ${e.toString()} not found, existing API: 
   - ${Object.keys(a.apiEntry||{}).join("\n   - ")}`);return}let i=a.apiEntry[e].url,l=a.apiEntry[e].args;if(i&&l){if(r.length>0&&l.length>0)for(let[e,t]of Object.entries(r)){let n=l[parseInt(e)];if(!(l&&l.includes(n))||!t||"string"==typeof t||"number"==typeof t)i=(i=i.replace(`:${n}?`,t+"")).replace(`:${n}`,t+"")}let e=`${n}${i}`,o=await E(e,r);t(o)}else console.error(`API Not Found: ${e.toString()}`)}else o("Failed to load API [Proxy]: "+n)}catch(e){o(e)}})};return"then"===t?new Proxy({},{get:(e,t)=>r(t)}):r(t)}})}catch(e){return null}},E=async(e,t)=>await $(e,t,{"content-type":"application/json"});var U=n("675"),F=n.n(U),I=n("14"),D=n("226"),W=n("839");let B={tables:{},columns:{},rels:{}},J={},M=e=>(!J[e]&&z({table:"check",action:"check"},e).then(t=>{t&&"encrypted"===t.mode?J[e]="msgpack":J[e]="json"}),new Proxy({},{get:(t,n)=>"_batch"===n?{update:async t=>z({name:"",action:"batch_update",table:"",params:{batch:t}},e),upsert:async t=>z({name:"",action:"batch_upsert",table:"",params:{arg:t}},e)}:"_schema"===n?{tables:async()=>(!B.tables[e]&&(B.tables[e]=z({name:"",action:"schema_tables",table:"",params:[]},e)),await B.tables[e]),columns:async t=>(!B.columns[e+"_"+t]&&(B.columns[e+"_"+t]=z({name:"",action:"schema_columns",table:t,params:[]},e)),await B.columns[e+"_"+t]),rels:async t=>(!B.rels[e+"_"+t]&&(B.rels[e+"_"+t]=z({name:"",action:"schema_rels",table:t,params:[]},e)),await B.rels[e+"_"+t])}:n.startsWith("$")?function(){for(var t=arguments.length,r=Array(t),o=0;o<t;o++)r[o]=arguments[o];let a=W.ZP.gzip(JSON.stringify(r));return z({name:"",action:"query",table:n,params:btoa(a.reduce((e,t)=>e+String.fromCharCode(t),""))},e)}:new Proxy({},{get:(t,r)=>async function(){for(var t=arguments.length,o=Array(t),a=0;a<t;a++)o[a]=arguments[a];return"query"===n&&(n=r,r="query"),await z({name:"",action:r,table:n,params:o},e)}})})),q={},z=async(e,t)=>{let n=new URL(t);n.pathname="/_dbs";let r=e||{};r.table&&(n.pathname+=`/${r.table}`);let o=n.toString();"undefined"!=typeof localStorage&&localStorage.mlsid&&(r.mlsid=localStorage.mlsid);let a=F()({...r,dburl:t}),i=!1;"undefined"!=typeof location&&n.hostname!==location.hostname&&window.isEditor&&["prasi.avolut.com","localhost:4550","127.0.0.1:4550"].includes(location.host)&&(i=!0);let l=async()=>{let e=r,n=null;if("msgpack"===J[t]){e=(0,W.iv)((0,D.P2)(r),{});let t=await fetch(N(o),{method:"POST",body:e});n=await t.json()}else n=await $(o,e,{"content-type":"application/json"},!1);try{if("string"==typeof n)return JSON.parse(n)}catch(e){}return n};if(i){let e=await (0,I.U2)(`editor-db-cache-${a}`);return e?!q[a]&&(l().then(e=>{(0,I.t8)(`editor-db-cache-${a}`,e)}),q[a]=!0):(e=await l(),q[a]=!0,(0,I.t8)(`editor-db-cache-${a}`,e)),e}return await l()},V=async e=>{let t={};for(let n of(await (await fetch(p.url`_prasi/pages`,{method:"POST",body:JSON.stringify({ids:e})})).json()))t[n.id]=n.root;return t};let X=(r={name:"prod-store",ref:{router:null,api:null,db:null,pages:[]},state:{pathname:location.pathname,page:null,site:{id:"",name:"",domain:"",responsive:"all",api_url:""},layout:{id:"",root:null},status:{router:"init",responsive:"desktop"}},action:e=>{let{state:t,update:n,ref:r}=e;return{initRouter(){"init"===t.status.router&&(t.status.router="loading",g().then(e=>{let{router:t,pages:o,site:a,layout:i}=e;n(e=>{e.site=a,e.layout=i,r.router=t,r.pages=o,a.api_url&&(r.api=A(a.api_url),r.db=M(a.api_url)),e.status.router="ready"})}))},loadPage(e){var r;(null===(r=t.page)||void 0===r?void 0:r.id)!==e.id&&(t.page=e),!e.root&&!e.loading&&(e.loading=!0,V([e.id]).then(t=>{n(n=>{let r=t[e.id];r&&n.page&&(n.page.root=r,delete n.page.loading)})}))}}}},e=>{let t=(0,i.useRef)({mounted:!0}),n=(0,i.useContext)(x).ctx;!n[r.name]&&r.state&&(n[r.name]={state:(0,y.sj)(r.state),ref:r.ref||{}});let o=(0,v.R)(n[r.name].state),a=n[r.name].ref,l=e({ref:a,state:o,action:j(t.current,a,n[r.name].state,r.action)});if(l.update=e=>{e(n[r.name].state)},r.effect)for(let e of r.effect({state:n[r.name].state}))(0,i.useEffect)(()=>(t.current.mounted=!0,e.effect({action:j(t.current,a,n[r.name].state,r.action),state:o,update(e){e(n[r.name].state)}}),()=>{t.current.mounted=!1,e.cleanup&&e.cleanup()}),e.deps);return(0,i.useEffect)(()=>(t.current.mounted=!0,()=>{t.current.mounted=!1}),Object.values(l)),{...l}}),Z=()=>w.ctx["prod-store"],H=(0,i.memo)(()=>{let{router:e,pages:t,page:n,loadPage:r,update:a,pathname:i}=X(e=>{let{ref:t,state:n,action:r}=e;return{pathname:n.pathname,router:t.router,pages:t.pages,loadPage:r.loadPage,page:n.page}}),l=null==e?void 0:e.lookup(p.pathname),s=null==t?void 0:t.find(e=>e.id===(null==l?void 0:l.id));if(s)return s.id!==(null==n?void 0:n.id)?(r(s),(0,o.jsx)(o.Fragment,{})):(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)("div",{onClick:()=>{navigate("/moasfm")},children:[i,"MOmoko"]})});return(a(e=>{e.page=null}),d.ContentNotFound)?(0,o.jsx)(d.ContentNotFound,{}):(0,o.jsxs)(o.Fragment,{children:["NOT FOUND ",i]})}),K=()=>4===location.hostname.split(".").length||"prasi.app"===location.hostname||"prasi.avolut.com"===location.hostname||location.hostname.includes("ngrok")||"localhost"===location.hostname||"127.0.0.1"===location.hostname||"10.0.2.2"===location.hostname,Q=()=>{let{status:e,init:t,responsive:n,page:r}=X(e=>{let{state:t,action:n}=e;return{status:t.status.router,responsive:t.status.responsive,page:t.page,init:n.initRouter}});return"init"===e&&t(),(0,o.jsx)(o.Fragment,{children:"ready"!==e||r&&!r.root?(0,o.jsx)(c,{}):(0,o.jsx)("div",{className:"relative flex flex-1 items-center justify-center",children:(0,o.jsx)("div",{className:cx("absolute flex flex-col items-stretch flex-1 bg-white main-content-preview","mobile"===n?css`
                    @media (min-width: 1280px) {
                      border-left: 1px solid #ccc;
                      border-right: 1px solid #ccc;
                      width: 375px;
                      top: 0px;
                      overflow-x: hidden;
                      overflow-y: auto;
                      bottom: 0px;
                    }
                    @media (max-width: 1279px) {
                      left: 0px;
                      right: 0px;
                      top: 0px;
                      bottom: 0px;
                      overflow-y: auto;
                    }
                  `:"inset-0 overflow-auto",css`
                contain: content;
              `),children:(0,o.jsx)(H,{})})})})};var G=n("931");n("189");let Y=(e,t)=>new Promise(async n=>{if("function"==typeof e){let r=null;if(t&&(r=setTimeout(n,t)),await e()){clearTimeout(r),n();return}let o=setInterval(async()=>{await e()&&(r&&clearTimeout(r),clearInterval(o),n())},10)}else"number"==typeof e&&setTimeout(()=>{n()},e)}),ee=async function(){let e=!(arguments.length>0)||void 0===arguments[0]||arguments[0],t="object"==typeof window?window:globalThis;e&&await Y(()=>t.__SRV_URL__),t.prasiContext={global:{},render(){}};let n=window.location,r=0===n.protocol.indexOf("http")?n.hostname:"localhost",o="https:"!=n.protocol||/localhost|127.0.0.1|0.0.0.0/.test(r)?"http":"https";if(t.__SRV_URL__){t.serverurl=t.__SRV_URL__;let e=new URL(t.serverurl);("localhost"===e.hostname||"127.0.0.1"===e.hostname)&&(e.hostname=n.hostname,e.pathname="/"===e.pathname?"":e.pathname,t.serverurl=e.toString(),t.serverurl.endsWith("/")&&(t.serverurl=t.serverurl.substring(0,t.serverurl.length-1)))}let a=n.port;t.baseurl=o+"://"+r+(a?":"+a:"")+"/",!t.basepath&&(t.basepath="/"),t.css=G.iv,t.extractCss=G.QV,t.pathname=n.pathname,t.cx=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];let r=[];return t.filter(e=>{if(e)return!!("string"==typeof e&&e.trim())||!0;return!1}).forEach(e=>{if(Array.isArray(e))for(let t of e)"string"==typeof t&&t.trim()&&r.push(t.trim());else r.push(e.trim())}),r.join(" ")},t.navigate=e=>{let n=e;if("function"==typeof t.navigateOverride&&!(n=t.navigateOverride(e)))return null;history.pushState({prevUrl:window.location.href},"",n),t.pathname=e,t.prasiContext&&t.prasiContext.render&&t.prasiContext.render()},"object"==typeof window&&window.addEventListener("popstate",()=>{let e=navigator.serviceWorker.controller;if(e&&e.postMessage({type:"add-cache",url:n.href}),t.prasiContext.popState){t.prasiContext.popState();return}if(t.preventPopRender){t.preventPopRender=!1;return}t.prasiContext&&t.prasiContext.render&&(t.pathname=n.pathname,t.prasiContext.render())})};var et=n("350"),en=n("572");let er=()=>{let e="object"==typeof window?window:globalThis;e.React=i,e.ReactDOM=et,e.JSXRuntime=o,e.JSXDevRuntime=en,e.Fragment=i.Fragment};(async()=>{n.e("53").then(n.bind(n,623));let e=document.getElementById("root");if(f(),e){await ee(!1);let t={root:(0,a.createRoot)(e)};er();try{let e="/_prasi/code/internal.js",t=e;if(location.pathname.startsWith("/prod")){let n=location.pathname.split("/");t=`/prod/${n[2]}${e}`}let n=!1;try{let e=Function(`return import("${t}")`);n=await e()}catch(e){console.error(e)}"object"==typeof n&&(n.Loading&&(d.ContentLoading=n.Loading),n.NotFound&&(d.ContentNotFound=n.NotFound))}catch(e){}d.navigateOverride=e=>{if(e&&e.startsWith("/")&&K()&&location.pathname.startsWith("/prod")&&!e.startsWith("/prod")){let t=location.pathname.split("/");e=`/prod/${t[2]}${e}`}return console.log(e),e},d.prasiContext.render=()=>{Z().state.pathname=location.pathname},t.root.render((0,o.jsx)(i.StrictMode,{children:(0,o.jsx)(b,{children:(0,o.jsx)(Q,{})})})),document.body.classList.contains("opacity-0")&&document.body.classList.remove("opacity-0")}})()}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}n.m=e,n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce(function(t,r){return n.f[r](e,t),t},[]))},n.u=function(e){return"static/js/async/"+e+".edf28883.js"},n.miniCssF=function(e){return"static/css/async/"+e+".1895fb22.css"},n.h=function(){return"f3b2a35cad8c18b5"},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},(()=>{var e={};n.l=function(t,r,o,a){if(e[t]){e[t].push(r);return}if(void 0!==o){for(var i,l,s=document.getElementsByTagName("script"),c=0;c<s.length;c++){var u=s[c];if(u.getAttribute("src")==t){i=u;break}}}!i&&(l=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,n.nc&&i.setAttribute("nonce",n.nc),i.src=t),e[t]=[r];var d=function(n,r){i.onerror=i.onload=null,clearTimeout(p);var o=e[t];if(delete e[t],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach(function(e){return e(r)}),n)return n(r)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=d.bind(null,i.onerror),i.onload=d.bind(null,i.onload),l&&document.head.appendChild(i)}})(),n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e=[];n.O=function(t,r,o,a){if(r){a=a||0;for(var i=e.length;i>0&&e[i-1][2]>a;i--)e[i]=e[i-1];e[i]=[r,o,a];return}for(var l=1/0,i=0;i<e.length;i++){for(var r=e[i][0],o=e[i][1],a=e[i][2],s=!0,c=0;c<r.length;c++)(!1&a||l>=a)&&Object.keys(n.O).every(function(e){return n.O[e](r[c])})?r.splice(c--,1):(s=!1,a<l&&(l=a));if(s){e.splice(i--,1);var u=o();void 0!==u&&(t=u)}}return t}})(),n.p="/nova/",n.rv=function(){return"1.0.5"},(()=>{if("undefined"!=typeof document){var e=function(e,t,r,o,a){var i=document.createElement("link");return i.rel="stylesheet",i.type="text/css",n.nc&&(i.nonce=n.nc),i.onerror=i.onload=function(n){if(i.onerror=i.onload=null,"load"===n.type)o();else{var r=n&&("load"===n.type?"missing":n.type),l=n&&n.target&&n.target.href||t,s=Error("Loading CSS chunk "+e+" failed.\\n("+l+")");s.code="CSS_CHUNK_LOAD_FAILED",s.type=r,s.request=l,i.parentNode&&i.parentNode.removeChild(i),a(s)}},i.href=t,r?r.parentNode.insertBefore(i,r.nextSibling):document.head.appendChild(i),i},t=function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=n[r],a=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(a===e||a===t))return o}for(var i=document.getElementsByTagName("style"),r=0;r<i.length;r++){var o=i[r],a=o.getAttribute("data-href");if(a===e||a===t)return o}},r={980:0};n.f.miniCss=function(o,a){if(r[o])a.push(r[o]);else if(0!==r[o]&&({53:1})[o]){var i;a.push(r[o]=(i=o,new Promise(function(r,o){var a=n.miniCssF(i),l=n.p+a;if(t(a,l))return r();e(i,l,null,r,o)})).then(function(){r[o]=0},function(e){throw delete r[o],e}))}}}})(),(()=>{var e={980:0};n.f.j=function(t,r){var o=n.o(e,t)?e[t]:void 0;if(0!==o){if(o)r.push(o[2]);else{var a=new Promise(function(n,r){o=e[t]=[n,r]});r.push(o[2]=a);var i=n.p+n.u(t),l=Error();n.l(i,function(r){if(n.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var a=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;l.message="Loading chunk "+t+" failed.\n("+a+": "+i+")",l.name="ChunkLoadError",l.type=a,l.request=i,o[1](l)}},"chunk-"+t,t)}}},n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o=r[0],a=r[1],i=r[2],l,s,c=0;if(o.some(function(t){return 0!==e[t]})){for(l in a)n.o(a,l)&&(n.m[l]=a[l]);if(i)var u=i(n)}for(t&&t(r);c<o.length;c++)s=o[c],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(u)},r=self.webpackChunk=self.webpackChunk||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),n.ruid="bundler=rspack@1.0.5";var r=n.O(void 0,["72","361","584"],function(){return n("753")});r=n.O(r)})();
//# sourceMappingURL=index.7a08a5b5.js.map