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
@media(prefers-reduced-motion:reduce){#splash,.topbar .logo{animation:none!important}}

/* ═══ YUMSHOQ · ILHOMLANTIRUVCHI KARTALAR (köz çarçatmaydi) ═══ */
body{background-color:#e8edf9;background-image:radial-gradient(1000px 520px at 92% -10%,rgba(124,58,237,.10),transparent 62%),radial-gradient(900px 480px at -10% 22%,rgba(34,211,238,.13),transparent 60%),radial-gradient(800px 500px at 62% 112%,rgba(251,191,36,.11),transparent 60%),linear-gradient(rgba(37,99,235,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.045) 1px,transparent 1px);background-size:auto,auto,auto,32px 32px,32px 32px}

/* rang mavzulari: har bir band özining rangida */
.card{--c1:#2563eb;--c2:#38bdf8;--c1r:37,99,235;--c2r:56,189,248;--t1:#f3f7ff;--t2:#e8f0ff;--ink:#1e3a8a}
.main-panel>section.card:nth-of-type(1){--c1:#0d9488;--c2:#2dd4bf;--c1r:13,148,136;--c2r:45,212,191;--t1:#f1fbf9;--t2:#e3f6f3;--ink:#0f5f59}
.main-panel>section.card:nth-of-type(2){--c1:#2563eb;--c2:#38bdf8;--c1r:37,99,235;--c2r:56,189,248;--t1:#f3f7ff;--t2:#e6efff;--ink:#1e3a8a}
.main-panel>section.card:nth-of-type(3){--c1:#4f46e5;--c2:#818cf8;--c1r:79,70,229;--c2r:129,140,248;--t1:#f4f4ff;--t2:#e9eaff;--ink:#312e81}
.main-panel>section.card:nth-of-type(4){--c1:#7c3aed;--c2:#c084fc;--c1r:124,58,237;--c2r:192,132,252;--t1:#f8f3ff;--t2:#efe6ff;--ink:#4c1d95}
.main-panel>section.card:nth-of-type(5){--c1:#d97706;--c2:#fbbf24;--c1r:217,119,6;--c2r:251,191,36;--t1:#fffaee;--t2:#fff1d3;--ink:#78350f}
.chart-card{--c1:#059669;--c2:#34d399;--c1r:5,150,105;--c2r:52,211,153;--t1:#f0fcf5;--t2:#e0f6ea;--ink:#065f46}
.sidebar .card:nth-child(1){--c1:#e11d48;--c2:#fb7185;--c1r:225,29,72;--c2r:251,113,133;--t1:#fff4f6;--t2:#ffe7ec;--ink:#9f1239}
.sidebar .card:nth-child(2){--c1:#d97706;--c2:#fbbf24;--c1r:217,119,6;--c2r:251,191,36;--t1:#fffaee;--t2:#fff1d3;--ink:#78350f}
.sidebar .card:nth-child(3){--c1:#059669;--c2:#34d399;--c1r:5,150,105;--c2r:52,211,153;--t1:#f0fcf5;--t2:#e0f6ea;--ink:#065f46}
.sidebar .card:nth-child(4){--c1:#64748b;--c2:#94a3b8;--c1r:100,116,139;--c2r:148,163,184;--t1:#f5f7fb;--t2:#e9edf5;--ink:#334155}

.card{border:1px solid rgba(var(--c1r),.22);border-radius:18px;
  background:radial-gradient(300px 180px at 100% 0%,rgba(var(--c2r),.24),transparent 70%),radial-gradient(240px 140px at 0% 100%,rgba(var(--c1r),.08),transparent 70%),linear-gradient(165deg,var(--t1),var(--t2));
  box-shadow:0 18px 38px -24px rgba(var(--c1r),.6),0 2px 6px rgba(15,23,42,.05);
  animation:cardRise .55s ease backwards;transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease}
.card:hover{transform:translateY(-3px);border-color:rgba(var(--c1r),.45);box-shadow:0 26px 48px -22px rgba(var(--c1r),.7),0 0 0 4px rgba(var(--c2r),.14)}
.card::before{height:4px;border-radius:18px 18px 0 0;background:linear-gradient(90deg,var(--c1),var(--c2),#fbbf24,var(--c2),var(--c1));background-size:200% 100%;animation:stripeFlow 8s linear infinite}
@keyframes stripeFlow{to{background-position:200% 0}}
/* burçakdagi nuqtalar to'ri: ilmiy ruh, lekin matnga xalal bermaydi */
.card::after{content:"";position:absolute;left:0;bottom:0;width:190px;height:120px;pointer-events:none;border-radius:0 0 0 18px;
  background:radial-gradient(rgba(var(--c1r),.22) 1.3px,transparent 1.7px) 0 0/14px 14px;
  -webkit-mask-image:radial-gradient(130px 90px at 0% 100%,#000,transparent 75%);mask-image:radial-gradient(130px 90px at 0% 100%,#000,transparent 75%);opacity:.7}
.main-panel>section.card:nth-of-type(2){animation-delay:.05s}
.main-panel>section.card:nth-of-type(3){animation-delay:.1s}
.main-panel>section.card:nth-of-type(4){animation-delay:.15s}
.main-panel>section.card:nth-of-type(5){animation-delay:.2s}
.sidebar .card:nth-child(2){animation-delay:.08s}.sidebar .card:nth-child(3){animation-delay:.16s}.sidebar .card:nth-child(4){animation-delay:.24s}

.card h2{gap:11px;align-items:center;font-size:16.5px;color:var(--ink)}
.card h2 .ico{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:34px;padding:0 7px;border-radius:11px;font-size:17px;font-weight:800;color:#fff;flex-shrink:0;
  background:linear-gradient(135deg,var(--c1),var(--c2));box-shadow:0 8px 16px -8px rgba(var(--c1r),.95),inset 0 1px 0 rgba(255,255,255,.45);transition:transform .3s ease}
.card:hover h2 .ico{transform:rotate(-8deg) scale(1.1)}
.card .desc{color:#55657f}

/* kiritish maydonlari: sof oppoq emas, yumşoq */
input[type=text],input[type=number],select,textarea{background:rgba(255,255,255,.74);border-color:rgba(var(--c1r,37,99,235),.24)}
input[type=text]:focus,input[type=number]:focus,select:focus,textarea:focus{background:#fff;border-color:var(--c2,#22d3ee);box-shadow:0 0 0 3px rgba(var(--c2r,34,211,238),.3)}
.opt-row,.fitem,.varhint,.help-panel,.greek-pal,.stat-result-box,.legend-set,.chart-wrap{background:rgba(255,255,255,.5);border-color:rgba(var(--c1r,37,99,235),.18)}
.help-panel .ex,.help-panel code,.stat-item,.stat-formula,.legend-set .opt-row,.gkey{background:rgba(255,255,255,.72)}
.fitem{border-left:3px solid var(--c1,#2563eb)}
.fpreview{background:linear-gradient(135deg,rgba(var(--c2r,56,189,248),.14),rgba(255,255,255,.5));border:1px dashed rgba(var(--c1r,37,99,235),.4)}
.fit-stat{background:rgba(255,255,255,.6)}
.fit-eq{background:linear-gradient(135deg,rgba(var(--c1r,5,150,105),.12),rgba(var(--c2r,52,211,153),.18));color:var(--ink,#065f46)}
.chart-wrap{background:linear-gradient(160deg,rgba(255,255,255,.55),rgba(var(--c2r,52,211,153),.14))}
.fit-canvas{box-shadow:0 10px 26px -14px rgba(var(--c1r,5,150,105),.55)}

/* tugmalar: jonli, lekin yumşoq gradientlar */
.btn{transition:transform .18s ease,box-shadow .2s ease,filter .2s ease}
.btn:hover{transform:translateY(-2px)}
.btn-green{background:linear-gradient(135deg,#059669,#10b981 60%,#2dd4bf);box-shadow:0 8px 18px -8px rgba(5,150,105,.75)}
.btn-green:hover{background:linear-gradient(135deg,#047857,#059669 60%,#14b8a6);box-shadow:0 12px 22px -8px rgba(5,150,105,.85)}
.btn-violet{background:linear-gradient(135deg,#6d28d9,#8b5cf6 60%,#c084fc);box-shadow:0 8px 18px -8px rgba(124,58,237,.75)}
.btn-violet:hover{background:linear-gradient(135deg,#5b21b6,#7c3aed 60%,#a855f7);box-shadow:0 12px 22px -8px rgba(124,58,237,.85)}
.btn-teal{background:linear-gradient(135deg,#0f766e,#14b8a6 60%,#22d3ee);box-shadow:0 8px 18px -8px rgba(13,148,136,.75)}
.btn-teal:hover{background:linear-gradient(135deg,#115e59,#0d9488 60%,#06b6d4);box-shadow:0 12px 22px -8px rgba(13,148,136,.85)}
.btn-outline{background:rgba(255,255,255,.6)}
.btn-outline:hover{background:linear-gradient(135deg,var(--accent),#0ea5e9)}
.btn-ghost{background:rgba(255,255,255,.65);border-color:rgba(var(--c1r,37,99,235),.25)}
.btn-ghost:hover{background:rgba(255,255,255,.95);border-color:var(--c1,#2563eb)}
.btn-danger{background:rgba(255,241,242,.8)}
.sw .sw-track{background:rgba(255,255,255,.7)}
.sw input:checked ~ .sw-track{background:linear-gradient(135deg,var(--c1,#2563eb),var(--c2,#22d3ee));border-color:transparent}
.tabbtn{background:rgba(255,255,255,.7)}
.tabbtn:hover{transform:translateY(-1px)}

/* jadval: köz toliqtirmaydigan yumşoq tuslar */
.table-wrap{background:rgba(255,255,255,.5);border:1px solid rgba(79,70,229,.28);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 14px 30px -20px rgba(79,70,229,.55)}
.table-wrap table thead th{background:linear-gradient(180deg,#e3e8ff,#d2dbff)!important;border-color:#bfc9f3!important;color:#312e81}
table.lab thead th.rowhead-col,table.lab thead th.rowname-col,table.lab td.rowhead{background:#dde3f8!important}
table.lab tbody tr:nth-child(even) td{background-image:linear-gradient(rgba(79,70,229,.065),rgba(79,70,229,.065))}
table.lab tbody td.rowname,table.lab tbody tr:nth-child(even) td.rowname{background:#e9edfb}
.table-wrap tbody tr:hover td{background-color:#e4ecff;background-image:none}
table.lab tbody tr:hover td.formula-cell{background-color:#e9deff}
table.lab tbody tr:hover td.abserr-cell{background-color:#ffecc4}
table.lab tbody tr:hover td.relerr-cell{background-color:#d6f6e2}
table.lab tbody tr:hover td.rowavg-cell{background-color:#d3f3ef}
table.lab tbody td input:focus{background:rgba(var(--c2r,56,189,248),.22)}

/* yon panel va oynalar */
.sidebar{background:linear-gradient(180deg,#e4eafa,#dce5f7);border-left:1px solid rgba(79,70,229,.18)}
.guide-box{background:linear-gradient(180deg,#f5f8ff,#ebf1fd)}
.guide-head{background:linear-gradient(90deg,rgba(var(--c2r,56,189,248),.18),transparent)}
.guide-toc{background:rgba(255,255,255,.4)}
.guide-chip{background:rgba(255,255,255,.75)}
.gex{background:rgba(255,255,255,.6)}
.dlg{background:linear-gradient(180deg,#f8faff,#edf3ff)}

/* muvaffaqiyat uçqunlari */
.spk{position:fixed;width:7px;height:7px;border-radius:50%;pointer-events:none;z-index:9999;box-shadow:0 0 8px currentColor;animation:spk .9s ease-out forwards}
@keyframes spk{from{transform:translate(0,0) scale(1);opacity:1}to{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0}}
@media(prefers-reduced-motion:reduce){.card,.card::before{animation:none!important}.card:hover,.btn:hover{transform:none}}
`;

/* ── 2. KARTA IKONKALARI VA UÇQUNLAR ───────────────────────── */
function iconBadges(root){
  (root||document).querySelectorAll('.card h2').forEach(h=>{
    if(h.querySelector(':scope > .ico')) return;
    const n=h.firstChild;
    if(n && n.nodeType===3 && n.textContent.trim()){
      const s=document.createElement('span'); s.className='ico'; s.textContent=n.textContent.trim(); h.replaceChild(s,n);
    }
  });
}
function badges(){
  iconBadges();
  const host=$('#chartsHost');
  if(host) new MutationObserver(()=>iconBadges(host)).observe(host,{childList:true});
}
function sparkles(){
  if(reduce) return;
  const cols=['#22d3ee','#fbbf24','#a78bfa','#34d399','#fb7185'];
  const burst=(el)=>{
    const r=el.getBoundingClientRect(), x0=r.left+Math.min(r.width/2,60), y0=r.top+r.height/2;
    for(let i=0;i<12;i++){
      const p=document.createElement('i'), a=Math.random()*6.283, d=26+Math.random()*48, c=cols[i%cols.length];
      p.className='spk';
      p.style.cssText='left:'+x0+'px;top:'+y0+'px;background:'+c+';color:'+c+';--dx:'+(Math.cos(a)*d).toFixed(1)+'px;--dy:'+(Math.sin(a)*d-14).toFixed(1)+'px';
      document.body.appendChild(p); setTimeout(()=>p.remove(),950);
    }
  };
  new MutationObserver(ms=>{
    for(const m of ms){
      const el=m.target;
      if(!el.classList || !el.classList.contains('msg') || !el.classList.contains('ok') || !el.classList.contains('show')) continue;
      if((m.oldValue||'').split(' ').indexOf('show')===-1) burst(el);
    }
  }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class'],attributeOldValue:true});
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
  safe(splash,'splash'); safe(badges,'badges'); safe(sparkles,'sparkles'); safe(bgFx,'bg'); safe(spotlight,'spot'); safe(scrollBar,'scroll'); safe(ripple,'ripple');
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
