/* ═══════════════════════════════════════════════════════════════
   design.js — «Fizika Laboratoriya Jadvali» uçun vizual qatlam
   Faqat körinişni özgartiradi. Hisob-kitobga tegmaydi.
   Bu fayl yö'q bö'lsa yoki xato bersa ham dastur töliq işlayveradi.
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch  = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || ('ontouchstart' in window);
const safe = (fn,name)=>{ try{ fn(); }catch(e){ console.warn('design.js ['+(name||'')+']:',e); } };
const $ = (s,r)=>(r||document).querySelector(s);

/* ── 1. USLUBLAR ───────────────────────────────────────────── */
const ATOM_SVG = (id)=>`
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="nuc${id}" cx="40%" cy="35%"><stop offset="0" stop-color="#fff7c2"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#d97706"/></radialGradient>
    <radialGradient id="glow${id}"><stop offset="0" stop-color="#fbbf24" stop-opacity=".55"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
    <linearGradient id="orb${id}" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity=".15"/><stop offset=".5" stop-color="#7dd3fc" stop-opacity=".95"/><stop offset="1" stop-color="#22d3ee" stop-opacity=".15"/></linearGradient>
  </defs>
  <circle cx="110" cy="110" r="34" fill="url(#glow${id})"><animate attributeName="r" values="30;40;30" dur="2.6s" repeatCount="indefinite"/></circle>
  <g fill="none" stroke="url(#orb${id})" stroke-width="1.6">
    <ellipse cx="110" cy="110" rx="98" ry="34"/>
    <ellipse cx="110" cy="110" rx="98" ry="34" transform="rotate(60 110 110)"/>
    <ellipse cx="110" cy="110" rx="98" ry="34" transform="rotate(120 110 110)"/>
  </g>
  <g class="e">
    <g><circle r="5.5" fill="#67e8f9"><animateMotion dur="3.2s" repeatCount="indefinite" path="M208 110 A98 34 0 1 1 12 110 A98 34 0 1 1 208 110"/></circle></g>
    <g transform="rotate(60 110 110)"><circle r="5.5" fill="#a5f3fc"><animateMotion dur="4.4s" repeatCount="indefinite" begin="-1.2s" path="M208 110 A98 34 0 1 1 12 110 A98 34 0 1 1 208 110"/></circle></g>
    <g transform="rotate(120 110 110)"><circle r="5.5" fill="#38bdf8"><animateMotion dur="5.6s" repeatCount="indefinite" begin="-2.6s" path="M208 110 A98 34 0 1 1 12 110 A98 34 0 1 1 208 110"/></circle></g>
    <g><circle r="3.6" fill="#fde68a"><animateMotion dur="3.2s" repeatCount="indefinite" begin="-1.6s" path="M208 110 A98 34 0 1 1 12 110 A98 34 0 1 1 208 110"/></circle></g>
    <g transform="rotate(120 110 110)"><circle r="3.6" fill="#fde68a"><animateMotion dur="5.6s" repeatCount="indefinite" begin="-0.4s" path="M208 110 A98 34 0 1 1 12 110 A98 34 0 1 1 208 110"/></circle></g>
  </g>
  <g>
    <circle cx="110" cy="110" r="15" fill="url(#nuc${id})"><animate attributeName="r" values="14;16.5;14" dur="2.6s" repeatCount="indefinite"/></circle>
    <circle cx="105" cy="106" r="5" fill="#ef4444" opacity=".9"/><circle cx="116" cy="108" r="5" fill="#60a5fa" opacity=".9"/><circle cx="110" cy="116" r="5" fill="#ef4444" opacity=".9"/>
  </g>
</svg>`;

const CSS = `
#fxCanvas{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
#fxSpot{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(460px circle at var(--mx,50%) var(--my,30%),rgba(34,211,238,.13),transparent 62%)}
.app-shell{position:relative;z-index:1}
.card{background:rgba(255,255,255,.9)}
.card:hover{box-shadow:0 22px 46px -22px rgba(37,99,235,.5),0 2px 6px rgba(11,26,58,.06)}
.topbar::before{display:none}
.topbar .logo{animation:logoPulse 3.2s ease-in-out infinite}
@keyframes logoPulse{0%,100%{box-shadow:0 0 0 2px rgba(34,211,238,.7),0 0 20px rgba(34,211,238,.4)}50%{box-shadow:0 0 0 4px rgba(34,211,238,.35),0 0 34px rgba(34,211,238,.75)}}
#scrollBar{position:fixed;left:0;top:0;height:3px;width:0;z-index:400;background:linear-gradient(90deg,#22d3ee,#2563eb,#fbbf24);box-shadow:0 0 10px rgba(34,211,238,.8);pointer-events:none}
.btn{position:relative;overflow:hidden}
.btn .rip{position:absolute;border-radius:50%;background:rgba(255,255,255,.55);transform:scale(0);animation:rip .6s ease-out forwards;pointer-events:none}
@keyframes rip{to{transform:scale(1);opacity:0}}
.btn:active{transform:scale(.98)}
*{scrollbar-width:thin;scrollbar-color:#9db6e6 transparent}
::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-thumb{background:linear-gradient(#7aa5ff,#22d3ee);border-radius:99px}

/* HERO */
.hero{position:relative;overflow:hidden;border-radius:22px;padding:26px 30px 44px;color:#fff;display:flex;align-items:center;gap:20px;min-height:230px;
  background:radial-gradient(700px 300px at 85% 10%,rgba(34,211,238,.28),transparent 60%),radial-gradient(500px 260px at 0% 100%,rgba(251,191,36,.16),transparent 60%),linear-gradient(120deg,#050d22 0%,#0a1f55 55%,#123a96 100%);
  box-shadow:0 30px 60px -28px rgba(5,13,34,.85),inset 0 0 0 1px rgba(125,190,255,.25);transition:min-height .4s ease,padding .4s ease}
.hero::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(125,190,255,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(125,190,255,.10) 1px,transparent 1px);background-size:28px 28px;
  -webkit-mask-image:radial-gradient(ellipse at 70% 40%,#000,transparent 75%);mask-image:radial-gradient(ellipse at 70% 40%,#000,transparent 75%);pointer-events:none}
.hero-left{position:relative;flex:1;min-width:0;z-index:2}
.hero-kicker{display:inline-flex;align-items:center;gap:8px;font:700 11px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:2.4px;color:#7dd3fc;margin-bottom:10px}
.hero-kicker i{width:8px;height:8px;border-radius:50%;background:#22d3ee;box-shadow:0 0 0 0 rgba(34,211,238,.7);animation:ping 1.8s infinite}
@keyframes ping{70%{box-shadow:0 0 0 10px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}
.hero-title{font:700 clamp(26px,4.2vw,44px)/1.1 'Space Grotesk','IBM Plex Sans',sans-serif;letter-spacing:.3px}
.hero-title b{background:linear-gradient(90deg,#67e8f9,#fde68a,#67e8f9);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shine 6s linear infinite}
@keyframes shine{to{background-position:200% 0}}
.hero-sub{margin-top:8px;color:#b9cdf5;font-size:14.5px;max-width:560px}
.hero-formula{margin-top:14px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;min-height:34px}
.hero-formula .eq{font:700 22px/1 'JetBrains Mono',ui-monospace,monospace;color:#fde68a;text-shadow:0 0 16px rgba(251,191,36,.55)}
.hero-formula .eq::after{content:"▌";margin-left:2px;color:#22d3ee;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.hero-formula small{color:#93b4ea;font-size:12.5px}
.hero-stats{margin-top:16px;display:flex;gap:10px;flex-wrap:wrap}
.hs{min-width:92px;padding:9px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(125,190,255,.28);backdrop-filter:blur(4px)}
.hs b{display:block;font:700 22px/1.1 'JetBrains Mono',ui-monospace,monospace;color:#fff}
.hs span{font-size:11.5px;color:#9fbcf0;letter-spacing:.3px}
.hero-atom{position:relative;z-index:2;width:230px;height:230px;flex:none;filter:drop-shadow(0 0 18px rgba(34,211,238,.55))}
.hero-atom svg{width:100%;height:100%}
.hero-wave{position:absolute;left:0;bottom:0;width:100%;height:42px;pointer-events:none;opacity:.9}
.hero-wave div{position:absolute;left:0;bottom:0;width:200%;height:100%;background-repeat:repeat-x;background-size:50% 100%}
.hero-wave .w1{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 42' preserveAspectRatio='none'%3E%3Cpath d='M0 21 C50 0 100 0 150 21 S250 42 300 21 S350 0 400 21 V42 H0Z' fill='%2322d3ee' fill-opacity='.22'/%3E%3C/svg%3E");animation:wave 9s linear infinite}
.hero-wave .w2{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 42' preserveAspectRatio='none'%3E%3Cpath d='M0 26 C60 6 120 6 180 26 S300 46 360 26 S390 14 400 26 V42 H0Z' fill='%23fbbf24' fill-opacity='.16'/%3E%3C/svg%3E");animation:wave 14s linear infinite reverse}
@keyframes wave{to{transform:translateX(-50%)}}
.hero-x{position:absolute;right:14px;top:12px;z-index:3;width:30px;height:30px;border-radius:50%;border:1px solid rgba(125,190,255,.4);background:rgba(255,255,255,.08);color:#cfe0ff;cursor:pointer;font-size:14px;transition:.3s}
.hero-x:hover{background:rgba(34,211,238,.25)}
.hero.min{min-height:0;padding:14px 30px}
.hero.min .hero-sub,.hero.min .hero-formula,.hero.min .hero-stats,.hero.min .hero-atom,.hero.min .hero-wave,.hero.min .hero-kicker{display:none}
.hero.min .hero-title{font-size:20px}.hero.min .hero-x{transform:rotate(180deg)}
@media(max-width:820px){.hero{padding:20px 18px 40px}.hero-atom{position:absolute;right:-30px;top:-10px;width:150px;height:150px;opacity:.5}.hero-formula .eq{font-size:17px}}

/* SPLASH */
#splash{position:fixed;inset:0;z-index:100000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;cursor:pointer;
  background:radial-gradient(800px 500px at 50% 40%,#12307a,#050d22 70%);animation:splashOut .7s ease 1.9s forwards;transition:opacity .6s,visibility .6s}
#splash.off{opacity:0;visibility:hidden;pointer-events:none}
@keyframes splashOut{to{opacity:0;visibility:hidden;pointer-events:none}}
#splash .sp-atom{width:190px;height:190px;filter:drop-shadow(0 0 22px rgba(34,211,238,.7))}
#splash .sp-title{font:700 clamp(22px,5vw,34px)/1 'Space Grotesk','IBM Plex Sans',sans-serif;color:#fff;letter-spacing:1px;animation:spUp .8s ease both .2s}
#splash .sp-sub{font:600 11px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:3px;color:#7dd3fc;animation:spUp .8s ease both .45s}
#splash .sp-bar{width:210px;height:3px;border-radius:9px;background:rgba(255,255,255,.14);overflow:hidden}
#splash .sp-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#22d3ee,#fbbf24);animation:spBar 1.6s ease forwards .15s}
@keyframes spUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes spBar{to{width:100%}}
@media(prefers-reduced-motion:reduce){.hero *,.hero,#splash,.topbar .logo{animation:none!important}}
`;

/* ── 2. HERO ───────────────────────────────────────────────── */
const TXT = {
  uz:{sub:'Ölçovdan formulagaça, xatolikdan grafikgaça — hammasi bir joyda.',stats:['jadval','ustun','qiymat','grafik'],hide:'Yig\'iş / yoyiş'},
  ru:{sub:'От измерений до формул, от погрешностей до графиков — всё в одном месте.',stats:['таблиц','столбцов','значений','графиков'],hide:'Свернуть / развернуть'},
  en:{sub:'From measurements to formulas, from errors to graphs — all in one place.',stats:['tables','columns','values','charts'],hide:'Collapse / expand'}
};
const TITLE = {uz:['Fizika','Laboratoriya','Jadvali'],ru:['Физика','Лаборатория','Таблица'],en:['Physics','Laboratory','Table']};
const EQ = [
  ['E = mc²',{uz:'massa va energiya ekvivalenti',ru:'эквивалентность массы и энергии',en:'mass–energy equivalence'}],
  ['F = ma',{uz:'Nyutonning ikkinçi qonuni',ru:'второй закон Ньютона',en:"Newton's second law"}],
  ['λ = h / p',{uz:'de Broyl töłqin uzunligi',ru:'длина волны де Бройля',en:'de Broglie wavelength'}],
  ['ΔxΔp ≥ ħ/2',{uz:'Heyzenberg noaniqlik prinsipi',ru:'принцип неопределённости',en:'uncertainty principle'}],
  ['∇·E = ρ/ε₀',{uz:'Gauss qonuni',ru:'закон Гаусса',en:"Gauss's law"}],
  ['S = k ln W',{uz:'Boltsman entropiyasi',ru:'энтропия Больцмана',en:'Boltzmann entropy'}],
  ['pV = nRT',{uz:'ideal gaz tenglamasi',ru:'уравнение идеального газа',en:'ideal gas law'}],
  ['iħ ∂ψ/∂t = Ĥψ',{uz:'Şredinger tenglamasi',ru:'уравнение Шрёдингера',en:'Schrödinger equation'}]
];
let heroEl=null;
function curLang(){ try{ return (typeof lang!=='undefined' && TXT[lang]) ? lang : 'uz'; }catch(e){ return 'uz'; } }
function buildHero(){
  const main=$('.main-panel'); if(!main) return;
  const h=document.createElement('section'); h.className='hero'; h.id='hero';
  h.innerHTML=`<div class="hero-left">
      <div class="hero-kicker"><i></i>SCIENTIFIC LAB SUITE</div>
      <div class="hero-title"><span id="hT1"></span> <b id="hT2"></b> <span id="hT3"></span></div>
      <div class="hero-sub" id="hSub"></div>
      <div class="hero-formula"><span class="eq" id="hEq"></span><small id="hEqN"></small></div>
      <div class="hero-stats">${['tables','cols','vals','charts'].map(k=>`<div class="hs"><b data-k="${k}">0</b><span></span></div>`).join('')}</div>
    </div>
    <div class="hero-atom">${ATOM_SVG('h')}</div>
    <div class="hero-wave"><div class="w1"></div><div class="w2"></div></div>
    <button class="hero-x" type="button" id="heroX">▾</button>`;
  main.insertBefore(h,main.firstChild); heroEl=h;
  try{ if(localStorage.getItem('fizHeroMin')==='1') h.classList.add('min'); }catch(e){}
  $('#heroX').addEventListener('click',()=>{ h.classList.toggle('min'); try{ localStorage.setItem('fizHeroMin',h.classList.contains('min')?'1':'0'); }catch(e){} });
  applyLang();
  // formulalar almaşib turadi (yozilib çiqadi)
  let ei=0, timer=null;
  const typeEq=()=>{
    const [eq,nm]=EQ[ei%EQ.length]; ei++; const el=$('#hEq'), nel=$('#hEqN'); if(!el) return;
    nel.textContent=''; let i=0; clearInterval(timer);
    if(reduce){ el.textContent=eq; nel.textContent=nm[curLang()]; return; }
    timer=setInterval(()=>{ el.textContent=eq.slice(0,++i); if(i>=eq.length){ clearInterval(timer); nel.textContent=nm[curLang()]; } },70);
  };
  typeEq(); setInterval(()=>{ if(!document.hidden && !h.classList.contains('min')) typeEq(); },5200);
  document.addEventListener('click',e=>{ if(e.target.closest && e.target.closest('.lang-btn')) setTimeout(()=>{ applyLang(); },80); });
  updateStats(true); setInterval(()=>updateStats(false),1200);
}
function applyLang(){
  if(!heroEl) return; const L=curLang(), T=TXT[L], ti=TITLE[L];
  $('#hT1').textContent=ti[0]; $('#hT2').textContent=ti[1]; $('#hT3').textContent=ti[2]; $('#hSub').textContent=T.sub;
  heroEl.querySelectorAll('.hs span').forEach((s,i)=>s.textContent=T.stats[i]); $('#heroX').title=T.hide;
}
const shown={};
function countTo(el,to){
  const from=shown[el.dataset.k]||0; shown[el.dataset.k]=to; if(from===to) return;
  if(reduce){ el.textContent=to; return; }
  const t0=performance.now(), d=600;
  (function step(t){ const p=Math.min(1,(t-t0)/d), e=1-Math.pow(1-p,3); el.textContent=Math.round(from+(to-from)*e); if(p<1) requestAnimationFrame(step); })(t0);
}
function updateStats(first){
  if(!heroEl || (heroEl.classList.contains('min') && !first)) return;
  let tb=0,cl=0,vl=0,ch=0;
  try{ tb=tables.length; cl=allCols().length; ch=charts.length;
    tables.forEach((T,i)=>{ const cd=(i===curTab?cellData:T.cellData)||{}; Object.keys(cd).forEach(k=>{ (cd[k]||[]).forEach(v=>{ if(v!==''&&v!==undefined&&v!==null) vl++; }); }); }); }catch(e){}
  const v={tables:tb,cols:cl,vals:vl,charts:ch};
  heroEl.querySelectorAll('.hs b').forEach(b=>countTo(b,v[b.dataset.k]));
}

/* ── 3. ORQA FON: zarralar maydoni ─────────────────────────── */
function bgFx(){
  if(reduce) return;
  const cv=document.createElement('canvas'); cv.id='fxCanvas'; document.body.insertBefore(cv,document.body.firstChild);
  const ctx=cv.getContext('2d'); if(!ctx) return;
  let W=0,H=0; const dpr=Math.min(window.devicePixelRatio||1,1.5), N=touch?26:58, P=[], mouse={x:-9999,y:-9999};
  const size=()=>{ W=innerWidth; H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
  size(); addEventListener('resize',size,{passive:true});
  for(let i=0;i<N;i++) P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1.2+Math.random()*1.8,ph:Math.random()*6.28,hot:Math.random()<.12});
  if(!touch) addEventListener('mousemove',e=>{ mouse.x=e.clientX; mouse.y=e.clientY; },{passive:true});
  let last=0, run=true;
  document.addEventListener('visibilitychange',()=>{ run=!document.hidden; if(run) requestAnimationFrame(frame); });
  function frame(t){
    if(!run) return; requestAnimationFrame(frame);
    if(t-last<33) return; last=t;
    ctx.clearRect(0,0,W,H);
    for(const p of P){ p.x+=p.vx; p.y+=p.vy; p.ph+=.03; if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10; if(p.y<-10)p.y=H+10; if(p.y>H+10)p.y=-10; }
    for(let i=0;i<N;i++){ const a=P[i];
      for(let j=i+1;j<N;j++){ const b=P[j], dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy;
        if(d2<14400){ ctx.strokeStyle='rgba(37,99,235,'+(0.16*(1-d2/14400)).toFixed(3)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } }
      const mx=a.x-mouse.x, my=a.y-mouse.y, md=mx*mx+my*my;
      if(md<28000){ ctx.strokeStyle='rgba(34,211,238,'+(0.32*(1-md/28000)).toFixed(3)+')'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke(); }
    }
    for(const p of P){
      if(p.hot){ const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,12); g.addColorStop(0,'rgba(251,191,36,.75)'); g.addColorStop(1,'rgba(251,191,36,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,12,0,6.283); ctx.fill(); }
      ctx.fillStyle=p.hot?'rgba(217,119,6,.9)':'rgba(37,99,235,'+(0.35+0.2*Math.sin(p.ph)).toFixed(2)+')';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283); ctx.fill();
    }
  }
  requestAnimationFrame(frame);
}

/* ── 4. KİÇİK EFFEKTLAR ────────────────────────────────────── */
function spotlight(){
  if(touch||reduce) return; const s=document.createElement('div'); s.id='fxSpot'; document.body.insertBefore(s,document.body.firstChild);
  let raf=0,x=0,y=0; addEventListener('mousemove',e=>{ x=e.clientX; y=e.clientY; if(!raf) raf=requestAnimationFrame(()=>{ raf=0; s.style.setProperty('--mx',x+'px'); s.style.setProperty('--my',y+'px'); }); },{passive:true});
}
function scrollBar(){
  const b=document.createElement('div'); b.id='scrollBar'; document.body.appendChild(b); let raf=0;
  const upd=()=>{ raf=0; const h=document.documentElement; const m=h.scrollHeight-h.clientHeight; b.style.width=(m>0?(h.scrollTop/m*100):0)+'%'; };
  addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(upd); },{passive:true}); upd();
}
function ripple(){
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest && e.target.closest('.btn'); if(!b||b.disabled) return;
    const r=b.getBoundingClientRect(), d=Math.max(r.width,r.height)*2, s=document.createElement('span'); s.className='rip';
    s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px'; b.appendChild(s); setTimeout(()=>s.remove(),650);
  },{passive:true});
}
function splash(){
  try{ if(sessionStorage.getItem('fizSplash')==='1') return; sessionStorage.setItem('fizSplash','1'); }catch(e){}
  const s=document.createElement('div'); s.id='splash';
  s.innerHTML='<div class="sp-atom">'+ATOM_SVG('s')+'</div><div class="sp-title">Fizika Laboratoriya</div><div class="sp-sub">TURKISTAN SCIENCE</div><div class="sp-bar"><i></i></div>';
  document.body.appendChild(s);
  const off=()=>{ s.classList.add('off'); setTimeout(()=>s.remove(),700); };
  s.addEventListener('click',off); setTimeout(off,1700);
}

/* ── 5. ISHGA TÜŞIRIŞ ──────────────────────────────────────── */
function start(){
  safe(()=>{ const st=document.createElement('style'); st.id='designCss'; st.textContent=CSS; document.head.appendChild(st); },'css');
  safe(splash,'splash'); safe(buildHero,'hero'); safe(bgFx,'bg'); safe(spotlight,'spot'); safe(scrollBar,'scroll'); safe(ripple,'ripple');
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
