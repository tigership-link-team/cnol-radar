import { sb, getLang, setLang, t, applyI18n, fmtViews, esc, snack } from '/common.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- 등장 효과 (가장 먼저 — 아래 코드에 문제가 생겨도 내용은 보이게) ----
(function reveal() {
  const els = [...document.querySelectorAll('.rv-in')];
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => {
    for (const e of ents) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
})();

// 머리 막대: 내리면 유리처럼
const topBar = document.getElementById('top');
const onScroll = () => topBar && topBar.classList.toggle('scrolled', window.scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 기능 카드: 마우스를 따라 은은한 빛
document.querySelectorAll('.lp-card').forEach((c) => c.addEventListener('pointermove', (e) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
  c.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
}));

let lang = getLang();
let cur = lang === 'ko' ? 'krw' : 'usd';
let per = 'month';
const L = (k, v) => esc(t(k, lang, v));
const loc = () => (lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US');

// ---- 요금 ----
const PRICES = { free: [0, 0], solo: [19000, 15], plus: [29000, 25], team: [39000, 35], agency: [99000, 79] };
function renderPrices() {
  document.querySelectorAll('[data-cur]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
  document.querySelectorAll('[data-per]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.per === per)));
  for (const [id, [krw, usd]] of Object.entries(PRICES)) {
    const p = document.querySelector(`[data-price="${id}"]`);
    const s = document.querySelector(`[data-sub="${id}"]`);
    if (!p || !s) continue;
    if ((cur === 'krw' && krw === 0) || (cur === 'usd' && usd === 0)) {
      p.textContent = cur === 'krw' ? '0원' : '$0';
      s.textContent = t('price.noCard', lang);
      continue;
    }
    if (cur === 'krw') {
      const won = (n) => n.toLocaleString('ko-KR') + '원';
      if (per === 'month') { p.textContent = won(krw); s.textContent = t('price.perMonth', lang); }
      else { p.textContent = won(Math.round((krw * 10) / 12)); s.textContent = t('price.perYear', lang, { x: won(krw * 10) }); }
    } else if (per === 'month') { p.textContent = '$' + usd; s.textContent = t('price.perMonth', lang); }
    else { p.textContent = '$' + ((usd * 10) / 12).toFixed(2); s.textContent = t('price.perYear', lang, { x: '$' + usd * 10 }); }
  }
}

function renderFaq() {
  const box = document.getElementById('faq');
  if (!box) return;
  const chev = '<svg class="chev" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  box.innerHTML = [1, 2, 3, 4, 5].map((i) => `<details><summary>${L('faq.q' + i)}${chev}</summary><p>${L('faq.a' + i)}</p></details>`).join('');
}

// ---- 예시 데이터: 채널 5개 (내 채널 2 · 레퍼런스 3) ----
// 색은 채널에 붙어요(추가한 순서) — 흰 카드는 c, 어두운 바탕은 같은 색상의 d
const CH = [
  { k: 'ch.1', role: 'dash.mine', cat: 'dash.c1', c: '#2a78d6', d: '#3987e5' },
  { k: 'ch.2', role: 'dash.ref', cat: 'dash.c2', c: '#eb6834', d: '#d95926' },
  { k: 'ch.3', role: 'dash.mine', cat: 'dash.c3', c: '#1baf7a', d: '#199e70' },
  { k: 'rf.2', role: 'dash.ref', cat: 'dash.c3', c: '#eda100', d: '#c98500' },
  { k: 'rf.3', role: 'dash.ref', cat: 'dash.c4', c: '#e87ba4', d: '#d55181' }
];
const DAYW = [0.55, 0.42, 0.33, 0.27, 0.24, 0.25, 0.32, 0.45, 0.58, 0.66, 0.7, 0.74, 0.8, 0.78, 0.76, 0.8, 0.86, 0.94, 1.0, 1.08, 1.18, 1.25, 1.15, 0.85];
const sig = (x) => 1 / (1 + Math.exp(-x));
const HMULT = [
  (i) => 0.5 * (1 + 0.002 * i), // 꿀템연구소: 꾸준히
  (i) => 0.17 * (1 + 2.4 * sig((i - 31) / 2.4)), // 자취요리 1분: 17시간 전부터 터짐
  (i) => 0.2 * (1 - 0.007 * i), // 냥집사 일기: 업로드 공백으로 줄어듦
  (i) => 0.21 * (1 + 0.09 * Math.sin(i / 6)),
  (i) => 0.11 * (1 + 0.12 * Math.cos(i / 5))
];
const H_RAW = Array.from({ length: 48 }, (_, i) => HMULT.map((f) => DAYW[(8 + i) % 24] * f(i)));
const H_K = 128 / H_RAW.flat().reduce((a, b) => a + b, 0);
const H = H_RAW.map((row) => row.map((v) => v * H_K)); // 시간 × 채널 (만 회) · 합계 128만
const CUR = [38, 41, 39, 44, 42, 40, 47, 45, 48, 44, 50, 53, 49, 51, 57, 54, 56, 52, 60, 55, 58, 63, 59, 62, 68, 66, 73, 71];
const PREV = [33, 35, 34, 36, 38, 35, 37, 39, 36, 40, 41, 38, 42, 40, 43, 41, 44, 42, 45, 43, 46, 44, 47, 45, 48, 46, 49, 47];
const D = CUR.map((v, d) => {
  const sh = [0.4, 0.15 + 0.13 * sig((d - 22) / 2), 0.16 - 0.002 * d, 0.17, 0.11];
  const s = sh.reduce((a, b) => a + b, 0);
  return sh.map((x) => (v * x) / s);
});
const rowSum = (row) => row.reduce((a, b) => a + b, 0);
const colTot = (M) => CH.map((_, k) => M.reduce((a, row) => a + row[k], 0));
const T48 = colTot(H), TD = colTot(D);

const IC = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>', up: '<path d="M7 17L17 7M9 7h8v8"/>',
  warn: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  picks: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  todo: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>'
};
const svg = (p, n = 18) => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const TH = ['linear-gradient(160deg,#c4b5fd,#7c3aed)', 'linear-gradient(160deg,#fde68a,#f97316)', 'linear-gradient(160deg,#a5f3fc,#0891b2)', 'linear-gradient(160deg,#fbcfe8,#db2777)', 'linear-gradient(160deg,#bbf7d0,#16a34a)'];
const fmtMan = (man) => fmtViews(man, lang, false);
const num = (n) => Math.round(n).toLocaleString(loc());
const full = (man) => num(Math.round((man * 1e4) / 10) * 10);

function hourLabel(i) {
  const day = 3 + Math.floor((8 + i) / 24);
  const h = (8 + i) % 24;
  if (lang === 'en') return `Oct ${day}, ${h}:00`;
  if (lang === 'ja') return `10月${day}日 ${h}時`;
  return `10월 ${day}일 ${h}시`;
}
function dayLabel(i) {
  const d = new Date(2026, 8, 7 + i);
  if (lang === 'en') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (lang === 'ja') return `${d.getMonth() + 1}月${d.getDate()}日`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
const hourTxt = (h) => (lang === 'ko' ? `${h}시` : lang === 'ja' ? `${h}時` : `${h % 12 || 12}${h < 12 ? 'a' : 'p'}`);
function nextRun() {
  const d = new Date();
  d.setMinutes(5, 0, 0);
  if (d <= new Date()) d.setHours(d.getHours() + 1);
  return d.toLocaleTimeString(loc(), { hour: 'numeric', minute: '2-digit' });
}

// ---- 차트 (대시보드와 같은 모양: 채널별로 쌓은 막대 · 합산 막대 · 범례 · 툴팁) ----
function stackChart(id, M, h, aria) {
  const sums = M.map(rowSum);
  const max = Math.max(...sums);
  return `<div class="dk-chart" id="${id}"><div class="dk-bars stack" style="height:${h}px" role="img" aria-label="${esc(aria)}">${M.map((row, i) => {
    const segs = row.map((v, k) => ({ v, k })).filter((x) => x.v > 0);
    const avail = Math.max(h * (sums[i] / max) - 2 * (segs.length - 1), segs.length);
    return `<div class="c dk-rise" data-i="${i}" style="animation-delay:${Math.min(i, 60) * 9}ms">${segs.map((x) => `<i data-s="${x.k}" style="height:${Math.max(1, (x.v / sums[i]) * avail).toFixed(1)}px;background:${CH[x.k].c}"></i>`).join('')}</div>`;
  }).join('')}</div><div class="dk-tip" role="status"></div></div>`;
}
function sumChart(id, M, h, aria) {
  const sums = M.map(rowSum);
  const max = Math.max(...sums);
  return `<div class="dk-chart" id="${id}"><div class="dk-bars" style="height:${h}px" role="img" aria-label="${esc(aria)}">${sums.map((v, i) => `<div class="c" data-i="${i}"><i class="dk-rise" style="height:${Math.max(3, (v / max) * 100).toFixed(1)}%;animation-delay:${Math.min(i, 60) * 9}ms"></i></div>`).join('')}</div><div class="dk-tip" role="status"></div></div>`;
}
function legendHtml(id, totals) {
  const all = rowSum(totals) || 1;
  return `<div class="dk-legend" role="list" data-lg="${id}">${CH.map((c, k) => `<span class="lg" role="listitem" tabindex="0" data-s="${k}"><i style="background:${c.c}"></i><span>${L(c.k)}</span><b>${esc(fmtMan(totals[k]))}</b><em>${Math.round((totals[k] / all) * 100)}%</em></span>`).join('')}</div>`;
}
// 툴팁: 이름은 textContent로만 넣어요
function fillTip(tip, content) {
  tip.textContent = '';
  if (typeof content === 'string') { tip.textContent = content; return; }
  const tt = document.createElement('div');
  tt.className = 'tt';
  tt.textContent = content.title;
  tip.appendChild(tt);
  for (const r of content.rows) {
    const row = document.createElement('div');
    row.className = 'row';
    const k = document.createElement('i');
    k.style.background = r.color;
    const b = document.createElement('b');
    b.textContent = r.value;
    const sp = document.createElement('span');
    sp.textContent = r.label;
    row.append(k, b, sp);
    tip.appendChild(row);
  }
}
function placeTip(box, tip, c, topPx) {
  const w = box.clientWidth;
  const half = Math.min(110, tip.offsetWidth / 2 + 4);
  tip.style.left = Math.min(Math.max(c.offsetLeft + c.offsetWidth / 2, half), w - half) + 'px';
  tip.style.top = Math.max(-14, topPx - tip.offsetHeight - 10) + 'px';
}
function bindChart(root, id, M, labelFn, stacked) {
  const box = root.querySelector('#' + id);
  if (!box) return;
  const tip = box.querySelector('.dk-tip');
  const sums = M.map(rowSum);
  const max = Math.max(...sums);
  const unit = t('dash.views', lang);
  box.querySelectorAll('.c').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      const i = Number(el.dataset.i);
      if (stacked) {
        const rows = M[i].map((v, k) => ({ v, k })).sort((a, b) => b.v - a.v).map((x) => ({ color: CH[x.k].c, value: full(x.v), label: t(CH[x.k].k, lang) }));
        fillTip(tip, { title: `${labelFn(i)} · ${full(sums[i])}${unit}`, rows });
      } else fillTip(tip, `${labelFn(i)}\n${full(sums[i])}${unit}`);
      tip.classList.add('on');
      placeTip(box, tip, el, el.offsetTop + el.offsetHeight * (1 - sums[i] / max));
      el.classList.add('on');
    });
    el.addEventListener('pointerleave', () => { tip.classList.remove('on'); el.classList.remove('on'); });
  });
}
// 범례에 올리면 그 채널 조각만 또렷하게
function bindLegend(root, id) {
  const bars = root.querySelector('#' + id + ' .dk-bars');
  const lg = root.querySelector(`[data-lg="${id}"]`);
  if (!bars || !lg) return;
  const items = [...lg.querySelectorAll('.lg')];
  const segs = [...bars.querySelectorAll('i[data-s]')];
  const set = (k) => {
    bars.classList.toggle('hl', k != null);
    for (const i of segs) i.classList.toggle('hs', i.dataset.s === k);
    for (const x of items) x.classList.toggle('dim', k != null && x.dataset.s !== k);
  };
  for (const x of items) {
    x.addEventListener('pointerenter', () => set(x.dataset.s));
    x.addEventListener('pointerleave', () => set(null));
    x.addEventListener('focus', () => set(x.dataset.s));
    x.addEventListener('blur', () => set(null));
  }
}

// ---- 대시보드 데모 (실제 /app 대시보드와 같은 카드 · 예시 데이터) ----
let demoStack = 'ch';
const demoDone = new Set();
const TOPS = [['top.2', 1, 21, 14], ['top.1', 0, 17, 20], ['top.3', 0, 9.4, 31], ['top.4', 3, 8.1, 26], ['top.5', 4, 4.6, 40]];
const PICKS = [
  { tk: 'top.2', ci: 1, h: 14, views: 27, fit: 93, x: '6.2', fmt: 'dash.fmtHow', why: 'bt.m.w1', th: TH[1], hot: 'red' },
  { tk: 'top.4', ci: 3, h: 26, views: 12, fit: 81, x: '4.2', fmt: 'dash.fmtQ', why: 'bt.m.w2', th: TH[3], hot: 'red' },
  { tk: 'top.5', ci: 4, h: 40, views: 6.3, fit: 58, x: '3.1', fmt: 'dash.fmtNum', why: 'dash.w3', th: TH[4], hot: 'red' }
];
const FEED = [
  { ic: IC.up, sev: 'good', tt: 'bt.m.n1', bd: 'bt.m.n1s', h: 2, unread: true },
  { ic: IC.warn, sev: 'warn', tt: 'bt.m.n2', bd: 'bt.m.n2s', h: 5, unread: true },
  { ic: IC.sun, sev: 'info', tt: 'bt.m.n3', bd: 'bt.m.n3s', h: 9, unread: false }
];

function renderDemoCharts(box) {
  const stacked = demoStack === 'ch';
  box.querySelectorAll('[data-dstack]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dstack === demoStack)));
  const w48 = box.querySelector('#dm48w'), wd = box.querySelector('#dmdw');
  w48.innerHTML = (stacked ? stackChart('dm48', H, 170, t('dash.live2', lang)) : sumChart('dm48', H, 170, t('dash.live2', lang)))
    + `<div class="dk-axis"><span>${L('dash.ago48')}</span><span>${L('dash.ago24')}</span><span>${L('dash.now')}</span></div>`
    + (stacked ? legendHtml('dm48', T48) : '');
  wd.innerHTML = (stacked ? stackChart('dmd', D, 150, t('dash.daily2', lang)) : sumChart('dmd', D, 150, t('dash.daily2', lang)))
    + `<div class="dk-axis"><span>${esc(dayLabel(0))}</span><span>${esc(dayLabel(14))}</span><span>${esc(dayLabel(27))}</span></div>`
    + (stacked ? legendHtml('dmd', TD) : '');
  bindChart(box, 'dm48', H, hourLabel, stacked);
  bindChart(box, 'dmd', D, dayLabel, stacked);
  if (stacked) { bindLegend(box, 'dm48'); bindLegend(box, 'dmd'); }
}

function renderDemo() {
  const box = document.getElementById('demoBody');
  if (!box) return;
  const unit = t('dash.views', lang);
  const curSum = rowSum(CUR), prevSum = rowSum(PREV);
  const tile = (ic, tone, label, big, small) => `<div class="dk-bi"><span class="ic ${tone}">${svg(ic)}</span><span class="tx"><b>${label}</b><strong>${big}</strong><span>${small}</span></span></div>`;
  const order = CH.map((_, k) => k).sort((a, b) => T48[b] - T48[a]);
  const seg = `<div class="dk-seg" role="group" aria-label="${L('dash.byCh')}"><button type="button" data-dstack="ch" aria-pressed="true">${L('dash.byCh')}</button><button type="button" data-dstack="sum" aria-pressed="false">${L('dash.sum')}</button></div>`;
  box.innerHTML = `
  <section class="dk-card full">
    <div class="dk-ch"><h3 style="display:flex;align-items:center;gap:10px;font-size:18px">${svg(IC.sun, 20)}${L('dash.brTitle')}</h3><span class="dk-live"><i></i>${L('dash.brSub')}</span></div>
    <div class="dk-brief">
      ${tile(IC.chart, '', L('dash.br1'), esc(fmtMan(128)) + esc(unit), L('dash.br1s'))}
      ${tile(IC.up, 'good', L('dash.br2'), L('dash.br2v'), L('dash.br2s'))}
      ${tile(IC.warn, 'warn', L('dash.br3'), L('dash.br3v'), L('dash.br3s'))}
      ${tile(IC.picks, 'good', L('dash.br4'), L('dash.br4v'), L('dash.br4s'))}
    </div>
    <div class="dk-ch td-h" style="margin-top:4px"><h3 style="display:flex;align-items:center;gap:8px">${svg(IC.todo, 18)}${L('dash.tdTitle')}</h3><span class="dk-sub">${L('dash.tdSub')}</span></div>
    <ul class="dk-todo">${['dash.td1', 'dash.td2', 'dash.td3'].map((k, i) => `<li class="${demoDone.has(i) ? 'done' : ''}"><input type="checkbox" data-dtodo="${i}" ${demoDone.has(i) ? 'checked' : ''} aria-label="${L(k)}"><span>${L(k)}</span><a href="/app">${L('dash.tdGo')} →</a></li>`).join('')}</ul>
  </section>
  <div class="dk-row">
    <section class="dk-card f2">
      <div class="dk-ch"><span class="dk-live"><i></i>${L('dash.live2')}</span>${seg}</div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:10px">
        <div><div class="dk-big">${esc(fmtMan(rowSum(T48)))}<span style="font-size:20px;font-weight:800">${esc(unit)}</span></div><div class="dk-sub"><span class="dk-up" style="font-weight:700">${L('dash.liveSub')}</span></div></div>
        <div style="text-align:right"><div class="dk-sub">${L('dash.last1h')}</div><div class="dk-mid">${esc(fmtMan(rowSum(H[46])))}</div></div>
      </div>
      <div id="dm48w" style="display:flex;flex-direction:column;gap:10px"></div>
    </section>
    <section class="dk-card f1">
      <div class="dk-ch"><h3>${L('dash.rank')}</h3><span class="dk-sub">${L('dash.rankSince')}</span></div>
      <ul class="dk-list">${order.map((k, r) => `<li class="dk-li"><span class="dk-rank">${r + 1}</span><span class="dk-av" style="background:${CH[k].c}"></span><span class="dk-ttl"><b>${L(CH[k].k)}</b><small>${L(CH[k].role)} · ${L(CH[k].cat)}</small></span><span class="dk-num">${esc(fmtMan(T48[k]))}<small>+${esc(full(H[47][k]))}</small></span></li>`).join('')}</ul>
      <span class="dk-sub" style="margin-top:auto">${L('dash.rankNote')}</span>
    </section>
  </div>
  <div class="dk-row">
    <section class="dk-card f2">
      <div class="dk-ch"><h3>${L('dash.daily2')}</h3><span class="dk-mid" style="font-size:22px">${esc(fmtMan(curSum))}${esc(unit)}</span></div>
      <div class="dk-sub" style="margin-top:-8px"><span class="dk-up" style="font-weight:700">${L('dash.dailyUp', { p: Math.round(((curSum - prevSum) / prevSum) * 100) })}</span></div>
      <div id="dmdw" style="display:flex;flex-direction:column;gap:10px"></div>
      <span class="dk-sub">${L('dash.confirmed')}</span>
    </section>
    <section class="dk-card f1">
      <div class="dk-ch"><h3>${L('dash.tops')}</h3><span class="dk-sub">${L('dash.seeAll')}</span></div>
      <ul class="dk-list">${TOPS.map(([tk, ci, v, h], i) => `<li class="dk-li"><span class="dk-av sq" style="background:${TH[i]}"></span><span class="dk-ttl"><b>${L(tk)}</b><small>${L(CH[ci].k)} · ${L('dash.hAgo', { n: h })}</small></span><span class="dk-num">${esc(fmtMan(v))}</span></li>`).join('')}</ul>
    </section>
  </div>
  <div class="dk-row">
    <section class="dk-card f2">
      <div class="dk-ch"><h3>${L('dash.k3')}</h3><span class="dk-sub">${L('dash.seeAll')}</span></div>
      <p class="dk-sub" style="margin:-6px 0 0">${L('dash.pkSub')}</p>
      <div class="dk-grid compact">${PICKS.map((p) => `<article class="dk-pick"><span class="dk-thumb" style="background-image:${p.th}"><span class="v">${esc(fmtMan(p.views))}</span></span><div class="body"><span class="t">${L(p.tk)}</span><span class="m">${L(CH[p.ci].k)} · ${L('dash.hAgo', { n: p.h })}</span><div class="tags"><span class="dk-fit">${L('dash.fit', { n: p.fit })}</span><span class="dk-tag ${p.hot}">${L('dash.ratio', { x: p.x })}</span><span class="dk-tag gray">${L(p.fmt)}</span></div><p class="dk-why"><b>${L('dash.fitWhy')}</b> · ${L(p.why)}</p></div></article>`).join('')}</div>
    </section>
    <section class="dk-card f1">
      <div class="dk-ch"><h3>${L('dash.m5')}</h3><span class="dk-sub">${L('dash.seeAll')}</span></div>
      <div style="display:flex;flex-direction:column;gap:10px">${FEED.map((f) => `<div class="dk-alert${f.unread ? ' unread' : ''}"><span class="ic ${f.sev}">${svg(f.ic)}</span><div class="tx"><b>${L(f.tt)}</b><span>${L(f.bd)}</span><small>${L('dash.agoH', { n: f.h })}</small></div></div>`).join('')}</div>
    </section>
  </div>
  <div class="dk-kpis">
    <div class="dk-kpi"><span>${L('dash.k1')}</span><b>5</b><small>${L('dash.k1s2')}</small></div>
    <div class="dk-kpi"><span>${L('dash.k2')}</span><b>250</b><small>${L('dash.k2s')}</small></div>
    <div class="dk-kpi"><span>${L('dash.k3')}</span><b>3</b><small>${L('dash.k3s')}</small></div>
    <div class="dk-kpi"><span>${L('dash.k4')}</span><b>${esc(nextRun())}</b><small>${L('dash.k4s')}</small></div>
  </div>`;
  renderDemoCharts(box);
  box.querySelectorAll('[data-dstack]').forEach((b) => b.addEventListener('click', () => {
    if (demoStack === b.dataset.dstack) return;
    demoStack = b.dataset.dstack;
    renderDemoCharts(box);
  }));
  box.querySelectorAll('[data-dtodo]').forEach((cb) => cb.addEventListener('change', () => {
    const i = Number(cb.dataset.dtodo);
    if (cb.checked) demoDone.add(i); else demoDone.delete(i);
    cb.closest('li').classList.toggle('done', cb.checked);
  }));
}

// ---- 채널 여러 개: 채널 → 레이더 → 모든 채널 합산 48시간 ----
const BIN3 = Array.from({ length: 16 }, (_, b) => CH.map((_, k) => H[b * 3][k] + H[b * 3 + 1][k] + H[b * 3 + 2][k]));
function spark(vals, color) {
  const w = 46, h = 20, max = Math.max(...vals), min = Math.min(...vals);
  const pts = vals.map((v, i) => `${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - 2 - ((v - min) / (max - min || 1)) * (h - 4)).toFixed(1)}`);
  return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="M${pts.join('L')}" stroke="${color}"/></svg>`;
}
function stackCols(M, h, colorKey, gap = 2, delay = 0) {
  const sums = M.map(rowSum);
  const max = Math.max(...sums);
  return M.map((row, i) => {
    const avail = Math.max(h * (sums[i] / max) - gap * (row.length - 1), row.length);
    return `<span${delay ? ` style="transition-delay:${i * delay}ms,0ms"` : ''}>${row.map((v, k) => `<i data-s="${k}" style="height:${Math.max(1, (v / sums[i]) * avail).toFixed(1)}px;background:${CH[k][colorKey]}"></i>`).join('')}</span>`;
  }).join('');
}
function drawWires() {
  const wires = document.getElementById('flowWires');
  const gap = document.getElementById('flowGap');
  if (!wires || !gap) return;
  const w = wires.parentElement.clientWidth, h = wires.parentElement.clientHeight;
  if (!w || !h) return; // 작은 화면에서는 숨겨요
  const cy = h / 2;
  wires.setAttribute('viewBox', `0 0 ${w} ${h}`);
  wires.innerHTML = CH.map((c, k) => {
    const y = 26 + k * 66;
    const d = `M0 ${y} C${(w * 0.55).toFixed(1)} ${y} ${(w * 0.45).toFixed(1)} ${cy} ${w} ${cy}`;
    return `<path class="wire" data-s="${k}" d="${d}" stroke="${c.d}"/>${reduce ? '' : `<circle r="3.5" fill="${c.d}"><animateMotion dur="2.6s" begin="${(k * 0.45).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`}`;
  }).join('');
  const gw = gap.parentElement.clientWidth, gh = gap.parentElement.clientHeight || 24;
  gap.setAttribute('viewBox', `0 0 ${gw} ${gh}`);
  const gd = `M0 ${gh / 2}H${gw}`;
  gap.innerHTML = `<path class="wire" d="${gd}" stroke="#a78bfa"/>${reduce ? '' : `<circle r="4" fill="#c4b5fd"><animateMotion dur="1.6s" repeatCount="indefinite" path="${gd}"/></circle>`}`;
}
function renderFlow() {
  const chs = document.getElementById('flowChs');
  if (!chs) return;
  chs.innerHTML = CH.map((c, k) => `<div class="lp-ch" data-s="${k}"><i style="background:${c.d}"></i><span class="nm"><b>${L(c.k)}</b><small>${L(c.role)} · ${L(c.cat)}</small></span>${spark(BIN3.map((row) => row[k]), c.d)}</div>`).join('');
  const stk = document.getElementById('flowStk');
  if (stk) stk.innerHTML = stackCols(H, 132, 'c', 2, 14);
  const lg = document.getElementById('flowLg');
  const all = rowSum(T48);
  if (lg) lg.innerHTML = CH.map((c, k) => `<span data-s="${k}"><i style="background:${c.c}"></i>${L(c.k)} <em>${Math.round((T48[k] / all) * 100)}%</em></span>`).join('');
  drawWires();
}
function bindFlow() {
  const flow = document.getElementById('flow');
  if (!flow) return;
  let on = null;
  const set = (k) => {
    if (k === on) return;
    on = k;
    flow.classList.toggle('hl', k != null);
    flow.querySelectorAll('[data-s]').forEach((el) => el.classList.toggle('hs', el.dataset.s === k));
  };
  flow.addEventListener('pointerover', (e) => { const el = e.target.closest('.lp-ch[data-s], .lg [data-s]'); set(el ? el.dataset.s : null); });
  flow.addEventListener('pointerleave', () => set(null));
  if ('ResizeObserver' in window) { let raf = 0; new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawWires); }).observe(flow); }
}

// ---- 히어로 떠 있는 카드: 모든 채널 합산 48시간 (3시간 단위) ----
function renderHeroBars() {
  const el = document.getElementById('heroBars');
  if (el) el.innerHTML = stackCols(BIN3, 34, 'd', 1);
}

// ---- 기능 카드 그림: 시간대별 평소 대비 · 채널 비교 ----
const HR = [0.72, 0.6, 0.52, 0.47, 0.45, 0.5, 0.62, 0.78, 0.9, 0.96, 1.0, 1.04, 1.12, 1.02, 0.96, 1.0, 1.12, 1.32, 1.68, 2.1, 1.86, 1.5, 1.18, 0.9];
function renderAlgo() {
  const el = document.getElementById('btAlgo');
  if (!el) return;
  const W = 300, top = 22, base = 118, bw = 10, gap = (W - 24 * bw) / 23, max = 2.3;
  const y = (v) => base - (v / max) * (base - top);
  const best = HR.indexOf(Math.max(...HR));
  const x = (i) => i * (bw + gap);
  const bar = (i) => {
    const x0 = x(i), y0 = y(HR[i]), r = 3;
    return `<path class="b" style="transition-delay:${i * 28}ms,0ms" d="M${x0.toFixed(1)} ${base}V${(y0 + r).toFixed(1)}Q${x0.toFixed(1)} ${y0.toFixed(1)} ${(x0 + r).toFixed(1)} ${y0.toFixed(1)}H${(x0 + bw - r).toFixed(1)}Q${(x0 + bw).toFixed(1)} ${y0.toFixed(1)} ${(x0 + bw).toFixed(1)} ${(y0 + r).toFixed(1)}V${base}Z" fill="${HR[i] >= 1.6 ? 'url(#agr)' : 'rgba(196,181,253,.34)'}"/>`;
  };
  el.innerHTML = `<svg class="algo" viewBox="0 0 ${W} 136" aria-hidden="true"><defs><linearGradient id="agr" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#67e8f9"/></linearGradient></defs>
    ${HR.map((_, i) => bar(i)).join('')}
    <line x1="0" x2="${W}" y1="${y(1).toFixed(1)}" y2="${y(1).toFixed(1)}" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <text x="0" y="${(y(1) - 6).toFixed(1)}">${L('bt.m.usual')} 1×</text>
    <text class="tag" x="${(x(best) + bw / 2).toFixed(1)}" y="${(y(HR[best]) - 7).toFixed(1)}" text-anchor="middle">${HR[best].toFixed(1)}×</text>
    <line x1="0" x2="${W}" y1="${base}" y2="${base}" stroke="rgba(255,255,255,.18)"/>
    ${[0, 6, 12, 18].map((h) => `<text x="${(x(h) + (h ? bw / 2 : 0)).toFixed(1)}" y="${base + 14}" text-anchor="${h ? 'middle' : 'start'}">${esc(hourTxt(h))}</text>`).join('')}
  </svg>`;
}
function renderCmp() {
  const el = document.getElementById('btCmp');
  if (!el) return;
  const G = [
    { h: 'bt.m.wk', max: 7, rows: [[0, 4.5, '4.5'], [1, 7, '7.0'], [3, 3, '3.0']] },
    { h: 'bt.m.hit', max: 32, rows: [[0, 18, '18%'], [1, 32, '32%'], [3, 12, '12%']] }
  ];
  el.innerHTML = G.map((g) => `<div class="g"><h5>${L(g.h)}</h5>${g.rows.map(([k, v, s], j) => `<div class="r"><small>${L(CH[k].k)}</small><span><i style="width:${((v / g.max) * 100).toFixed(1)}%;background:${CH[k].d};transition-delay:${j * 120}ms"></i></span><b>${s}</b></div>`).join('')}</div>`).join('');
}

function renderAll() {
  applyI18n(document, lang);
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderPrices();
  renderFaq();
  renderDemo();
  renderFlow();
  renderHeroBars();
  renderAlgo();
  renderCmp();
}

document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  if (lang === b.dataset.lang) return;
  lang = b.dataset.lang;
  setLang(lang);
  cur = lang === 'ko' ? 'krw' : 'usd';
  renderAll();
}));
document.querySelectorAll('[data-cur]').forEach((b) => b.addEventListener('click', () => { cur = b.dataset.cur; renderPrices(); }));
document.querySelectorAll('[data-per]').forEach((b) => b.addEventListener('click', () => { per = b.dataset.per; renderPrices(); }));

renderAll();
bindFlow();

// 질문 남기기 → inquiries (누구나 보낼 수 있고, 관리자만 읽어요)
const askForm = document.getElementById('askForm');
if (askForm) {
  askForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('askEmail').value.trim();
    const message = document.getElementById('askMsg').value.trim();
    if (!email || !message) return;
    const btn = askForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    const { error } = await sb.from('inquiries').insert({ email, message, language: lang });
    btn.disabled = false;
    if (error) { snack(t('ask.fail', lang)); return; }
    askForm.reset();
    const ok = document.getElementById('askOk');
    ok.textContent = t('ask.ok', lang);
    ok.hidden = false;
  });
}
