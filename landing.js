import { sb, getLang, setLang, t, applyI18n, fmtViews, esc, snack } from '/common.js';

let lang = getLang();
let cur = lang === 'ko' ? 'krw' : 'usd';
let per = 'month';

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
    } else {
      if (per === 'month') { p.textContent = '$' + usd; s.textContent = t('price.perMonth', lang); }
      else { p.textContent = '$' + ((usd * 10) / 12).toFixed(2); s.textContent = t('price.perYear', lang, { x: '$' + usd * 10 }); }
    }
  }
}

function renderFaq() {
  const box = document.getElementById('faq');
  const chev = '<svg class="chev" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  box.innerHTML = [1, 2, 3, 4, 5].map((i) => `<details><summary>${esc(t('faq.q' + i, lang))}${chev}</summary><p>${esc(t('faq.a' + i, lang))}</p></details>`).join('');
}

// ---- 대시보드 데모 (실제 /app 대시보드와 같은 카드·막대 모양, 예시 데이터) ----
const W = [0.55, 0.42, 0.33, 0.27, 0.24, 0.25, 0.32, 0.45, 0.58, 0.66, 0.7, 0.74, 0.8, 0.78, 0.76, 0.8, 0.86, 0.94, 1.0, 1.08, 1.18, 1.25, 1.15, 0.85];
const raw48 = Array.from({ length: 48 }, (_, i) => W[(8 + i) % 24] * (i >= 33 ? 1.4 : 1) * (1 + i * 0.004));
const k48 = 128 / raw48.reduce((a, b) => a + b, 0);
const V48 = raw48.map((v) => v * k48); // 만 회 단위
const CUR = [38, 41, 39, 44, 42, 40, 47, 45, 48, 44, 50, 53, 49, 51, 57, 54, 56, 52, 60, 55, 58, 63, 59, 62, 68, 66, 73, 71];
const PREV = [33, 35, 34, 36, 38, 35, 37, 39, 36, 40, 41, 38, 42, 40, 43, 41, 44, 42, 45, 43, 46, 44, 47, 45, 48, 46, 49, 47];
const IC = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>', up: '<path d="M7 17L17 7M9 7h8v8"/>',
  warn: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  picks: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>'
};
const svg = (p, n = 18) => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const AV = ['linear-gradient(135deg,#f59e0b,#ec4899)', 'linear-gradient(135deg,#22c55e,#0ea5e9)', 'linear-gradient(135deg,#8b5cf6,#f472b6)'];
const TH = ['linear-gradient(160deg,#c4b5fd,#7c3aed)', 'linear-gradient(160deg,#fde68a,#f97316)', 'linear-gradient(160deg,#a5f3fc,#0891b2)', 'linear-gradient(160deg,#fbcfe8,#db2777)', 'linear-gradient(160deg,#bbf7d0,#16a34a)'];
const fmtMan = (man) => fmtViews(man, lang, false);
const num = (n) => Math.round(n).toLocaleString(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US');

function hourLabel(i) {
  const day = 3 + Math.floor((8 + i) / 24);
  const h = (8 + i) % 24;
  if (lang === 'en') return `Oct ${day}, ${h}:00`;
  if (lang === 'ja') return `10月${day}日 ${h}時`;
  return `10월 ${day}일 ${h}시`;
}
function dayLabel(i) {
  const d = new Date(2026, 8, 5 + i);
  if (lang === 'en') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (lang === 'ja') return `${d.getMonth() + 1}月${d.getDate()}日`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
function bars(id, vals, h) {
  const max = Math.max(...vals);
  return `<div class="dk-chart" id="${id}"><div class="dk-bars" style="height:${h}px" role="img" aria-label="${esc(id === 'dm48' ? t('dash.live', lang) : t('dash.daily', lang))}">${vals.map((v, i) => `<div class="c" data-i="${i}"><i class="dk-rise" style="height:${Math.max(3, (v / max) * 100).toFixed(1)}%;animation-delay:${Math.min(i, 60) * 9}ms"></i></div>`).join('')}</div><div class="dk-tip" hidden></div></div>`;
}
function bindTips(root, id, vals, tipFn) {
  const box = root.querySelector('#' + id);
  if (!box) return;
  const tip = box.querySelector('.dk-tip');
  const max = Math.max(...vals);
  box.querySelectorAll('.c').forEach((c) => {
    c.addEventListener('pointerenter', () => {
      const i = Number(c.dataset.i);
      tip.textContent = tipFn(i);
      tip.hidden = false;
      const cx = Math.min(Math.max(c.offsetLeft + c.offsetWidth / 2, 80), box.clientWidth - 80);
      tip.style.left = cx + 'px';
      tip.style.top = Math.max(-10, c.offsetTop + c.offsetHeight * (1 - vals[i] / max) - tip.offsetHeight - 8) + 'px';
      c.classList.add('on');
    });
    c.addEventListener('pointerleave', () => { tip.hidden = true; c.classList.remove('on'); });
  });
}
function nextRun() {
  const d = new Date();
  d.setMinutes(5, 0, 0);
  if (d <= new Date()) d.setHours(d.getHours() + 1);
  return d.toLocaleTimeString(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderDemo() {
  const box = document.getElementById('demoBody');
  if (!box) return;
  const L = (k, v) => esc(t(k, lang, v));
  const unit = t('dash.views', lang);
  const curSum = CUR.reduce((a, b) => a + b, 0), prevSum = PREV.reduce((a, b) => a + b, 0);
  const tile = (ic, tone, label, big, small) => `<div class="dk-bi"><span class="ic ${tone}">${svg(ic)}</span><span class="tx"><b>${label}</b><strong>${big}</strong><span>${small}</span></span></div>`;
  const rank = [['ch.1', 'dash.mine', 'dash.c1', 82, 3210], ['ch.2', 'dash.ref', 'dash.c2', 32, 1040], ['ch.3', 'dash.mine', 'dash.c3', 14, 380]];
  const tops = [['top.1', 'ch.1', 46, 9], ['top.2', 'ch.2', 18, 14], ['top.3', 'ch.1', 15, 20], ['top.4', 'ch.3', 9, 31], ['top.5', 'ch.2', 7, 40]];
  box.innerHTML = `
  <section class="dk-card full">
    <div class="dk-ch"><h3 style="display:flex;align-items:center;gap:10px;font-size:18px">${svg(IC.sun, 20)}${L('dash.brTitle')}</h3><span class="dk-live"><i></i>${L('dash.brSub')}</span></div>
    <div class="dk-brief">
      ${tile(IC.chart, '', L('dash.br1'), esc(fmtMan(128)) + esc(unit), L('dash.br1s'))}
      ${tile(IC.up, 'good', L('dash.br2'), L('dash.br2v'), L('dash.br2s'))}
      ${tile(IC.warn, 'warn', L('dash.br3'), L('dash.br3v'), L('dash.br3s'))}
      ${tile(IC.picks, 'good', L('dash.br4'), L('dash.br4v'), L('dash.br4s'))}
    </div>
  </section>
  <div class="dk-row">
    <section class="dk-card f2">
      <div class="dk-ch"><span class="dk-live"><i></i>${L('dash.live')}</span><span class="dk-sub">${L('dash.sched')}</span></div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:10px">
        <div><div class="dk-big">${esc(fmtMan(128))}<span style="font-size:20px;font-weight:800">${esc(unit)}</span></div><div class="dk-sub"><span class="dk-up" style="font-weight:700">${L('dash.liveSub')}</span></div></div>
        <div style="text-align:right"><div class="dk-sub">${L('dash.last1h')}</div><div class="dk-mid">${esc(fmtMan(V48[46]))}</div></div>
      </div>
      ${bars('dm48', V48, 160)}
      <div class="dk-axis"><span>${L('dash.ago48')}</span><span>${L('dash.ago24')}</span><span>${L('dash.now')}</span></div>
    </section>
    <section class="dk-card f1">
      <div class="dk-ch"><h3>${L('dash.rank')}</h3><span class="dk-sub">${L('dash.rankSince')}</span></div>
      <ul class="dk-list">${rank.map(([ck, rk, ct, v, d], i) => `<li class="dk-li"><span class="dk-rank">${i + 1}</span><span class="dk-av" style="background:${AV[i]}"></span><span class="dk-ttl"><b>${L(ck)}</b><small>${L(rk)} · ${L(ct)}</small></span><span class="dk-num">${esc(fmtMan(v))}<small>+${esc(num(d))}</small></span></li>`).join('')}</ul>
      <span class="dk-sub" style="margin-top:auto">${L('dash.rankNote')}</span>
    </section>
  </div>
  <div class="dk-row">
    <section class="dk-card f2">
      <div class="dk-ch"><h3>${L('dash.daily')}</h3><span class="dk-mid" style="font-size:22px">${esc(fmtMan(curSum))}${esc(unit)}</span></div>
      <div class="dk-sub" style="margin-top:-8px"><span class="dk-up" style="font-weight:700">${L('dash.dailyUp', { p: Math.round(((curSum - prevSum) / prevSum) * 100) })}</span></div>
      ${bars('dmd', CUR, 140)}
      <div class="dk-axis"><span>${esc(dayLabel(0))}</span><span>${esc(dayLabel(14))}</span><span>${esc(dayLabel(27))}</span></div>
      <span class="dk-sub">${L('dash.confirmed')}</span>
    </section>
    <section class="dk-card f1">
      <div class="dk-ch"><h3>${L('dash.tops')}</h3><span class="dk-sub">${L('dash.seeAll')}</span></div>
      <ul class="dk-list">${tops.map(([tk, ck, v, h], i) => `<li class="dk-li"><span class="dk-av sq" style="background:${TH[i]}"></span><span class="dk-ttl"><b>${L(tk)}</b><small>${L(ck)} · ${L('dash.hAgo', { n: h })}</small></span><span class="dk-num">${esc(fmtMan(v))}</span></li>`).join('')}</ul>
    </section>
  </div>
  <div class="dk-kpis">
    <div class="dk-kpi"><span>${L('dash.k1')}</span><b>3</b><small>${L('dash.k1s')}</small></div>
    <div class="dk-kpi"><span>${L('dash.k2')}</span><b>150</b><small>${L('dash.k2s')}</small></div>
    <div class="dk-kpi"><span>${L('dash.k3')}</span><b>3</b><small>${L('dash.k3s')}</small></div>
    <div class="dk-kpi"><span>${L('dash.k4')}</span><b>${esc(nextRun())}</b><small>${L('dash.k4s')}</small></div>
  </div>`;
  bindTips(box, 'dm48', V48, (i) => `${hourLabel(i)}\n${fmtMan(V48[i])}${unit}`);
  bindTips(box, 'dmd', CUR, (i) => `${dayLabel(i)}\n${fmtMan(CUR[i])}${unit}`);
}

function renderAll() {
  applyI18n(document, lang);
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderPrices();
  renderFaq();
  renderDemo();
}

document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  setLang(lang);
  cur = lang === 'ko' ? 'krw' : 'usd';
  renderAll();
}));
document.querySelectorAll('[data-cur]').forEach((b) => b.addEventListener('click', () => { cur = b.dataset.cur; renderPrices(); }));
document.querySelectorAll('[data-per]').forEach((b) => b.addEventListener('click', () => { per = b.dataset.per; renderPrices(); }));

// 자석 버튼
const mag = document.getElementById('magnet');
if (mag && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  mag.style.transition = 'transform .18s ease-out, box-shadow .25s ease';
  mag.addEventListener('mousemove', (e) => {
    const r = mag.getBoundingClientRect();
    mag.style.transform = `translate(${Math.round((e.clientX - r.left - r.width / 2) * 0.18)}px, ${Math.round((e.clientY - r.top - r.height / 2) * 0.3)}px)`;
  });
  mag.addEventListener('mouseleave', () => { mag.style.transform = ''; });
}

renderAll();

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
