import{i as e,n as t,r as n,t as r}from"./tur.DSXxwb_o.js";import{t as i}from"./yol.BAvy2Wqf.js";import{r as a,t as o}from"./ball.plI2Uukm.js";import{a as s,n as c,s as l,t as u}from"./band.ABZHYRB7.js";import{a as d,t as f}from"./yollar.B5zkMRzz.js";function p(){let e=globalThis.crypto;return e?.randomUUID?e.randomUUID():`u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}function m(e,t,n=p()){return{v:1,id:n,testId:e.testId,schemaVersion:1,startedAt:new Date(t).toISOString(),deadline:s(t,e.durationMinutes),answers:{},flags:[]}}function h(e,t){return l(e.deadline,t)}function g(e,t,n){let r=o(t,e.answers);return{urinish:{id:e.id,testId:e.testId,schemaVersion:e.schemaVersion,startedAt:e.startedAt,finishedAt:new Date(Math.min(n,e.deadline)).toISOString(),answers:e.answers,raw:r.raw,band:c(r.raw),perTypeStats:r.perTypeStats,syncedAt:null},baho:r}}function _(e){let t=a(e);return t&&t.ulush<.6?{...n[t.type],zaifTur:t.type}:{...n.yangi,zaifTur:null}}var v=(e,t=16)=>`<svg aria-hidden="true" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,y={togri:v(`<path d="M5 12l5 5L20 7"/>`),xato:v(`<path d="M6 6l12 12M18 6L6 18"/>`),bosh:v(`<path d="M5 12h14"/>`),ok:v(`<path d="M6 9l6 6 6-6"/>`,18),ong:v(`<path d="M9 6l6 6-6 6"/>`,20),yop:v(`<path d="M6 6l12 12M18 6L6 18"/>`,20)};function b(e){let t=new Date(e.finishedAt).getTime()-new Date(e.startedAt).getTime();return Number.isFinite(t)?Math.max(1,Math.round(t/6e4)):0}function x(e){return e.togri?`<span class="rn-holat togri">${y.togri}${t.holatTogri}</span>`:e.berilgan?`<span class="rn-holat xato">${y.xato}${t.holatXato}</span>`:`<span class="rn-holat bosh">${y.bosh}${t.holatBosh}</span>`}function S(n,i){let a=n.berilgan&&n.sizning?`<span lang="en">${r(n.sizning)}</span>`:t.javobsiz;return`<li data-togri="${n.togri?`1`:`0`}"><details>
<summary><span class="savol-raqam">${n.number}</span>${x(n)}<span class="rn-tur">${r(e[n.type])}</span><span class="rn-ok">${y.ok}</span></summary>
<div class="rn-tana">
<p class="rn-prompt" lang="en">${r(n.prompt)}</p>
<dl>
<div><dt>${t.sizning}</dt><dd>${a}</dd></div>
<div><dt>${t.togriJavob}</dt><dd><span lang="en">${r(n.togriJavob)}</span></dd></div>
<div><dt>${t.tushuntirish}</dt><dd><span lang="${i}">${r(n.explanation)}</span></dd></div>
<div><dt>${t.dalil} (${r(t.paragraf(n.evidence.paragraph))})</dt><dd><blockquote lang="en">${r(n.evidence.quote)}</blockquote><button type="button" class="t-tugma t-tugma--ikkinchi" data-kor="${n.number}">${t.matndaKor}</button></dd></div>
</dl>
</div>
</details></li>`}function C(n,i){let o=[],s=a(n.perTypeStats),c=s?n.perTypeStats[s.type]:void 0;return s&&c&&s.ulush<1&&o.push(t.tahlilZaif(e[s.type],c.togri,c.jami)),s&&s.ulush>=1?o.push(t.tahlilXatoYoq):s&&s.ulush>=.6&&o.push(t.tahlilYaxshi),i&&(i.javobsiz>0&&o.push(t.tahlilJavobsiz(i.javobsiz)),i.passageStat.length>1&&i.passageStat.forEach((e,n)=>o.push(t.tahlilPassage(n+1,e.togri,e.jami)))),`<ul class="rn-tahlil">${o.map(e=>`<li>${r(e)}</li>`).join(``)}</ul>`}function w(n,a){let{urinish:s,test:c}=a,l=c?o(c,s.answers):null,p=Object.values(s.perTypeStats).reduce((e,t)=>e+(t?.jami??0),0)||(l?.jami??0),m=u(s.band,t.bandPast),h=b(s),g=_(s.perTypeStats),v=i(f.boshlash),x=[a.avto?t.avtoYakun:``,a.saqlanmagan?t.natijaSaqlanmadi:``,c?``:a.testHolat===`xato`?t.testXato:t.testTopilmadi].filter(Boolean),w=d.filter(e=>(s.perTypeStats[e]?.jami??0)>0).map(n=>{let i=s.perTypeStats[n],a=Math.round(i.togri/i.jami*100);return`<li><span class="nom">${r(e[n])}</span><span class="son">${r(t.ulush(i.togri,i.jami))} · ${a}%</span><span class="rn-chiziq" aria-hidden="true"><span style="--ulush:${a}%"></span></span></li>`}).join(``);if(n.innerHTML=`
<section aria-labelledby="rn-xulosa-h">
<h2 id="rn-xulosa-h" class="ekranda-yoq">${t.natijaSarlavha}</h2>
${c?`<p class="rn-test" lang="en">${r(c.title)}</p>`:``}
${x.map(e=>`<p class="rn-xabar">${r(e)}</p>`).join(``)}
<dl class="rn-raqamlar">
<div><dt>${t.xomBall}</dt><dd>${s.raw}<small> / ${p}</small></dd></div>
<div><dt>${t.taxminiyBand}</dt><dd${s.band===null?` class="kichik"`:``}>${r(m)}</dd></div>
<div><dt>${t.sarflangan}</dt><dd class="kichik">${r(t.daqiqa(h))}</dd></div>
</dl>
<p class="rn-izoh">${r(t.bandIzoh)}</p>
</section>
<section aria-labelledby="rn-tur-h"><h2 id="rn-tur-h">${t.turlar}</h2><ul class="rn-turlar">${w}</ul></section>
<section aria-labelledby="rn-tahlil-h"><h2 id="rn-tahlil-h">${t.tahlil}</h2>${C(s,l)}</section>
<section aria-labelledby="rn-qadam-h"><h2 id="rn-qadam-h">${t.keyingiQadam}</h2>
<a class="rn-qadam" href="${r(i(g.manzil))}"><strong>${r(g.sarlavha)}</strong><span>${r(g.izoh)}</span>${y.ong}</a>
${g.zaifTur?`<div class="rn-amal"><a class="t-tugma t-tugma--ikkinchi" href="${r(v)}">${t.yangiTest}</a></div>`:``}
</section>
${l?`<section aria-labelledby="rn-savol-h"><h2 id="rn-savol-h">${t.savollar}</h2>
<div class="rn-filtr" role="group" aria-label="${r(t.filtr)}"><button type="button" data-filtr="hammasi" aria-pressed="true">${t.filtrHammasi}</button><button type="button" data-filtr="xato" aria-pressed="false">${t.filtrXato}</button></div>
<ol class="rn-savollar">${l.qatorlar.map(e=>S(e,c?.explanationLang??`en`)).join(``)}</ol>
<p class="rn-bosh-xabar" data-xato-yoq hidden>${t.xatoQolmadi}</p>
</section>
<dialog class="rt-dialog rn-matn" aria-labelledby="rn-matn-h">
<div class="rn-matn-bosh"><h2 id="rn-matn-h" lang="en"></h2><button type="button" class="rn-matn-yop" aria-label="${r(t.yopish)}">${y.yop}</button></div>
<div class="rn-matn-ichi"></div>
</dialog>`:``}`,!l||!c)return;let T=n.querySelector(`.rn-savollar`),E=n.querySelector(`[data-xato-yoq]`),D=[...n.querySelectorAll(`[data-filtr]`)];D.forEach(e=>e.addEventListener(`click`,()=>{let t=e.dataset.filtr===`xato`;D.forEach(t=>t.setAttribute(`aria-pressed`,String(t===e)));let n=0;T.querySelectorAll(`:scope > li`).forEach(e=>{e.hidden=t&&e.dataset.togri===`1`,e.hidden||(n+=1)}),T.hidden=n===0,E.hidden=n!==0}));let O=n.querySelector(`.rn-matn`),k=O.querySelector(`#rn-matn-h`),A=O.querySelector(`.rn-matn-ichi`),j=null,M=()=>{O.open&&O.close(),j?.focus(),j=null};O.querySelector(`.rn-matn-yop`).addEventListener(`click`,M),O.addEventListener(`click`,e=>{e.target===O&&M()}),T.addEventListener(`click`,e=>{let t=e.target.closest(`[data-kor]`);if(!t)return;let n=l.qatorlar.find(e=>String(e.number)===t.dataset.kor),i=n?c.passages[n.passageTartib]:void 0;if(!n||!i)return;k.textContent=i.title,A.innerHTML=i.paragraphs.map(e=>{let t=r(e.text),i=e.label===n.evidence.paragraph?e.text.indexOf(n.evidence.quote):-1;return i>=0&&(t=`${r(e.text.slice(0,i))}<mark tabindex="-1">${r(n.evidence.quote)}</mark>${r(e.text.slice(i+n.evidence.quote.length))}`),`<p class="rt-par" lang="en"><b class="rt-par-harf">${r(e.label)}</b><span>${t}</span></p>`}).join(``),j=t,O.showModal();let a=A.querySelector(`mark`);a&&(a.focus({preventScroll:!0}),a.scrollIntoView({block:`center`}))})}export{p as a,g as i,h as n,m as o,_ as r,w as t};