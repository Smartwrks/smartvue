!function(){"use strict";function e(e){if(e)return Array.isArray(e)?e:String(e).split(",").map(e=>e.trim()).filter(Boolean)}function t(e){if(e)try{return JSON.parse(e)}catch{return}}let r=document.currentScript,a={queryParam:r&&r.dataset.queryParam||"query",storageKey:r&&r.dataset.storageKey||"",autoSubmit:"true"===(r&&r.dataset.autoSubmit)};function n(){document.querySelectorAll(".smart-askai").forEach(e=>{e.style.setProperty("--surface-color",function e(t){let r=t;for(;r;){let a=getComputedStyle(r).backgroundColor;if(a&&"transparent"!==a&&"rgba(0, 0, 0, 0)"!==a)return a;r=r.parentElement}return getComputedStyle(document.body).backgroundColor||"#fff"}(e))})}function i(){document.querySelectorAll(".smart-askai").forEach(e=>{e.style.setProperty("--blur-height","none"),e.style.setProperty("max-height","none")}),document.querySelectorAll(".smart-show-more")[0].style.display="none"}!function e(t){let r=document.createElement("link");r.rel="stylesheet",r.href=t,document.head.appendChild(r)}("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css");let o=`
    .smart-askai{
        --clip: 200px;
        --blur-height: 215px;
        --fade-depth: 56px;
    }

    .smart-askai{
        display:grid;
        grid-template-columns:2fr 1fr;
        gap:20px;
        position:relative;
        padding-bottom:var(--blur-height);
        max-height:calc(var(--clip));
        overflow:hidden;
        transition:max-height 250ms ease;
    }

    .smart-askai::after{
        content:"";
        position:absolute;
        inset-inline:0;
        bottom:0;
        height:var(--blur-height);
        pointer-events:none;
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
        mask-image:linear-gradient(to top, black, transparent);
        -webkit-mask-image:linear-gradient(to top, black, transparent);
        background:var(--surface-color, inherit);
    }
    .smart-grid-item{
        margin-bottom:20px;
        background-color: #e5edff;
        border-radius: 10px;
        font-size: 16px;
        padding: 10px;
    }

    .hidden-loading {
  display: none !important;
}

#loadingSpinner {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top */
  text-align: center;
  display:grid;
  place-items:center;
}

.spinner {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #004579;
  border-right-color: #004579;
  animation: spin 1s linear infinite;
  display:inline-block;
}

.spinner::before,
.spinner::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 4px solid transparent;
  inset: 6px;
}

.spinner::before {
  border-top-color: #004579;
  border-left-color: #004579;
  animation: spin 2s linear infinite reverse;
}

.spinner::after {
  border-bottom-color: #1aa79c;
  animation: spin 3s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0turn);
	}
	100% {
		transform: rotate(1turn);
	}
}
    
    .initial-state{opacity:0;transform:translateY(20px)}
    .final-state{opacity:1;transform:translateY(0);transition:opacity 0.5s ease-out, transform 0.5s ease-out;}
  `;function s(){if(document.querySelector("#askai-widget-styles"))return;let e=document.createElement("style");e.id="askai-widget-styles",e.textContent=o,document.head.appendChild(e)}function l(e){let t={queryParam:e.dataset.queryParam||a.queryParam,storageKey:e.dataset.storageKey||a.storageKey,autoSubmit:"true"===(e.dataset.autoSubmit||(a.autoSubmit?"true":"false")),inputSelector:e.dataset.inputSelector||a.inputSelector,buttonSelector:e.dataset.buttonSelector||a.buttonSelector,formSelector:e.dataset.formSelector||a.formSelector,outputSelector:e.dataset.outputSelector||a.outputSelector,buttonText:e.dataset.buttonText||a.buttonText,preventDefault:"true"===(e.dataset.preventDefault||(a.preventDefault?"true":"false")),apiKey:e.dataset.apiKey||a.apiKey};async function r(e){let r={query:e,format:"html",conversationId:t.conversationId,apiKey:t.apiKey},a=await fetch("https://api.ai12z.net/bot/askai",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r.apiKey}`},body:JSON.stringify(r)}),n=await a.json().catch(()=>({}));if(!a.ok)throw Error(n&&(n.error||n.message)||a.statusText||"Request failed");let i="";i="string"==typeof n?n:n.answer?n.answer:n.content?n.content:n.output?n.output:n.result?n.result:JSON.stringify(n,null,2);var o=n.context;return{answer:n.answer,itemOne:o[0].metadata,itemTwo:o[2].metadata,itemThree:o[4].metadata}}t.shadow&&e.attachShadow({mode:"open"});let o=!!(t.inputSelector||t.formSelector||t.buttonSelector);if(o){s();let l=t.inputSelector?document.querySelector(t.inputSelector):null,d=t.buttonSelector?document.querySelector(t.buttonSelector):null,c=t.formSelector?document.querySelector(t.formSelector):null,u=t.outputSelector?document.querySelector(t.outputSelector):null;u||((u=document.createElement("div")).className="askai-output",e.appendChild(u));let p=document.createElement("div");async function m(){let t=l?String(l.value||"").trim():"";var o=document.querySelectorAll(".smart-askai"),s=document.querySelectorAll(".smart-show-more"),d=document.querySelectorAll(".smart-header");if(o.forEach(e=>{e.remove()}),s.forEach(e=>{e.remove()}),d.forEach(e=>{e.remove()}),!t){p.textContent="Please enter a query.";return}p.classList.remove("hidden-loading");try{let c=await r(t);if("html"===(e.dataset.render||a.render))u.appendChild(text);else{var m=document.createElement("div");m.classList.add("smart-askai"),m.classList.add("initial-state");var f=document.createElement("div");f.classList.add("smart-header"),f.innerHTML='<h4><img style="width:30px;" src="/dist/conmed/images/stars-icon.png"/>AI Overview</h4>';var h=document.createElement("div"),y=document.createElement("div"),g=document.createElement("h5");g.textContent="Related Content",y.appendChild(g),y.classList.add("smart-grid-container"),requestAnimationFrame(n),h.innerHTML=c.answer,h.querySelectorAll("li").forEach(e=>{e.querySelectorAll("p").forEach(e=>{let t=document.createElement("span");t.innerHTML=e.innerHTML,e.replaceWith(t)})});var v=document.createElement("div");v.classList.add("smart-grid-row");var b=document.createElement("div");b.classList.add("smart-grid-item");var S=document.createElement("div");S.classList.add("smart-grid-item");var $=document.createElement("div");$.classList.add("smart-grid-item"),b.innerHTML=c.itemOne.description+" <a target='_blank' href='"+c.itemOne.url+"'></a>",S.innerHTML=c.itemTwo.description+" <a target='_blank' href='"+c.itemTwo.url+"'>Go</a>",$.innerHTML=c.itemThree.description+" <a target='_blank' href='"+c.itemThree.url+"'>Go</a>",v.appendChild(b),v.appendChild(S),v.appendChild($),y.appendChild(v),m.appendChild(h),m.appendChild(y),u.prepend(m),u.prepend(f);var k=document.createElement("button");k.classList.add("smart-show-more"),k.innerText="Show More",k.addEventListener("click",i),m.after(k),setTimeout(()=>{m.classList.remove("initial-state"),m.classList.add("final-state")},0)}p.classList.add("hidden-loading")}catch(x){p.textContent="Error: "+(x&&x.message?x.message:String(x))}}p.id="loadingSpinner",p.className="hidden-loading",p.innerHTML='<span>Generating...</span><div class="spinner"></div>',u.prepend(p),c&&c.addEventListener("submit",function(e){let r=l?String(l.value||"").trim():"";if(!t.preventDefault&&t.storageKey&&r)try{sessionStorage.setItem(t.storageKey,r)}catch{}t.preventDefault&&(e.preventDefault(),m())}),d&&d.addEventListener("click",function(e){let r=l?String(l.value||"").trim():"";if(!t.preventDefault&&t.storageKey&&r)try{sessionStorage.setItem(t.storageKey,r)}catch{}t.preventDefault&&(e.preventDefault(),m())});let f=function(){try{return new URLSearchParams(location.search).get(t.queryParam)}catch{return null}}(),h=t.storageKey?function(){try{return sessionStorage.getItem(t.storageKey)}catch{return null}}():null,y=f||h||"";if(l&&y&&(l.value=y),h&&t.storageKey)try{sessionStorage.removeItem(t.storageKey)}catch{}t.autoSubmit&&(y||l&&l.value.trim())&&m();return}async function g(){let e=input.value.trim();if(!e){status.textContent="Please enter a question.";return}btn.disabled=!0,status.textContent="Thinking…";try{let t=await r(e);output.innerHTML=t,status.textContent=""}catch(a){status.textContent="Error: "+(a&&a.message?a.message:String(a))}finally{btn.disabled=!1}}btn.addEventListener("click",g),input.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&"Enter"===e.key&&(e.preventDefault(),g())})}function d(){s();Array.from(document.querySelectorAll("[data-askai]")).forEach(l)}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",d):d()}();