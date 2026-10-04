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

// ---- 대시보드 데모 ----
const W = [0.55, 0.42, 0.33, 0.27, 0.24, 0.25, 0.32, 0.45, 0.58, 0.66, 0.7, 0.74, 0.8, 0.78, 0.76, 0.8, 0.86, 0.94, 1.0, 1.08, 1.18, 1.25, 1.15, 0.85];
const raw48 = Array.from({ length: 48 }, (_, i) => W[(8 + i) % 24] * (i >= 33 ? 1.4 : 1) * (1 + i * 0.004));
const k48 = 128 / raw48.reduce((a, b) => a + b, 0);
const V48 = raw48.map((v) => v * k48);
const CUR = [38, 41, 39, 44, 42, 40, 47, 45, 48, 44, 50, 53, 49, 51, 57, 54, 56, 52, 60, 55, 58, 63, 59, 62, 68, 66, 73, 71];
const PREV = [33, 35, 34, 36, 38, 35, 37, 39, 36, 40, 41, 38, 42, 40, 43, 41, 44, 42, 45, 43, 46, 44, 47, 45, 48, 46, 49, 47];

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

function renderRealtime(hover = null) {
  const bars = document.getElementById('rtBars');
  const max = Math.max(...V48);
  if (!bars.childElementCount) {
    V48.forEach((v, i) => {
      const s = document.createElement('span');
      s.className = 'rise';
      s.style.height = Math.max(4, Math.round((v / max) * 160)) + 'px';
      s.addEventListener('mouseenter', () => renderRealtime(i));
      bars.appendChild(s);
    });
    bars.addEventListener('mouseleave', () => renderRealtime(null));
  }
  bars.classList.toggle('dim', hover !== null);
  [...bars.children].forEach((s, i) => s.classList.toggle('hot', i === hover));
  document.getElementById('rtHead').textContent = hover === null ? fmtViews(128, lang) : fmtViews(V48[hover], lang);
  document.getElementById('rtSub').textContent = hover === null ? t('dash.liveSub', lang) : t('dash.hourOf', lang, { h: hourLabel(hover) });
  document.getElementById('rtLast').textContent = fmtViews(V48[47], lang, false);
}

function renderRank() {
  const rows = [['ch.1', 82, '+3,210'], ['ch.2', 32, '+1,040'], ['ch.3', 14, '+380']];
  document.getElementById('rank').innerHTML = rows.map(([k, v, d], i) => `
    <div class="stack" style="gap:6px">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="width:24px;height:24px;border-radius:12px;background:var(--primary-tint);color:var(--primary-dark);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex:none">${i + 1}</span>
        <span style="font-size:14px;font-weight:500;flex:1 1 auto;min-width:0">${esc(t(k, lang))}</span>
        <b class="num" style="font-size:14px">${esc(fmtViews(v, lang, false))}</b>
        <span class="num" style="font-size:12px;font-weight:700;color:var(--up)">${d}</span>
      </div>
      <span style="display:block;height:8px;border-radius:4px;background:#F3F1F6"><span class="grow" style="display:block;height:8px;border-radius:4px;background:var(--primary);width:${Math.round((v / 82) * 100)}%"></span></span>
    </div>`).join('');
}

function renderLine(hover = null) {
  const X = (i) => 44 + (i / 27) * 586;
  const Y = (v) => 180 - (v / 80) * 160;
  const pts = (a) => a.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const curSum = CUR.reduce((a, b) => a + b, 0);
  const prevSum = PREV.reduce((a, b) => a + b, 0);
  const pct = Math.round(((curSum - prevSum) / prevSum) * 100);
  document.getElementById('lnHead').textContent = `${fmtViews(curSum, lang)} ▲ ${pct}%`;
  const wrap = document.getElementById('lnWrap');
  const tip = hover === null ? '' : `
    <line x1="${X(hover)}" y1="20" x2="${X(hover)}" y2="180" stroke="#1D1B20" stroke-dasharray="2 3"/>
    <circle cx="${X(hover)}" cy="${Y(CUR[hover])}" r="5" fill="#6200EE" stroke="#fff" stroke-width="2"/>
    <circle cx="${X(hover)}" cy="${Y(PREV[hover])}" r="5" fill="#8E8A96" stroke="#fff" stroke-width="2"/>`;
  const zones = CUR.map((_, i) => `<rect data-i="${i}" x="${(X(i) - 586 / 54).toFixed(1)}" y="10" width="${(586 / 27).toFixed(1)}" height="176" fill="transparent"/>`).join('');
  wrap.innerHTML = `
    <svg viewBox="0 0 640 220" width="100%" role="img" aria-label="${esc(t('dash.daily', lang))}" style="display:block;overflow:visible">
      <line x1="44" y1="20" x2="630" y2="20" stroke="#EEECF1"/><line x1="44" y1="100" x2="630" y2="100" stroke="#EEECF1"/><line x1="44" y1="180" x2="630" y2="180" stroke="#CFCAD8"/>
      <text x="36" y="24" text-anchor="end" font-size="11" fill="#5F5B66">${esc(fmtViews(80, lang, false))}</text>
      <text x="36" y="104" text-anchor="end" font-size="11" fill="#5F5B66">${esc(fmtViews(40, lang, false))}</text>
      <text x="36" y="184" text-anchor="end" font-size="11" fill="#5F5B66">0</text>
      <text x="44" y="204" font-size="11" fill="#5F5B66">${esc(dayLabel(0))}</text>
      <text x="337" y="204" text-anchor="middle" font-size="11" fill="#5F5B66">${esc(dayLabel(14))}</text>
      <text x="630" y="204" text-anchor="end" font-size="11" fill="#5F5B66">${esc(dayLabel(27))}</text>
      <polygon points="44,180 ${pts(CUR)} 630,180" fill="#EDE7F6"/>
      <polyline points="${pts(PREV)}" fill="none" stroke="#8E8A96" stroke-width="2" stroke-dasharray="5 4" stroke-linejoin="round"/>
      <polyline points="${pts(CUR)}" fill="none" stroke="#6200EE" stroke-width="2" stroke-linejoin="round"/>
      ${tip}${zones}
    </svg>
    ${hover === null ? '' : `<div class="tip" style="top:-10px;left:${(X(hover) / 640) * 100}%">${esc(dayLabel(hover))}\n${esc(t('dash.cur', lang))} ${esc(fmtViews(CUR[hover], lang, false))} · ${esc(t('dash.prev', lang))} ${esc(fmtViews(PREV[hover], lang, false))}</div>`}`;
  wrap.querySelectorAll('rect[data-i]').forEach((r) => r.addEventListener('mouseenter', () => renderLine(Number(r.dataset.i))));
  wrap.onmouseleave = () => renderLine(null);
}

function renderTops() {
  const rows = [['top.1', 'ch.1', 46, 82, '#EDE7F6'], ['top.2', 'ch.2', 18, 76, '#FFF3E0'], ['top.3', 'ch.1', 15, 71, '#E0F7FA'], ['top.4', 'ch.3', 9, 64, '#E8F5E9'], ['top.5', 'ch.2', 7, 61, '#FCE4EC']];
  document.getElementById('tops').innerHTML = rows.map(([tk, ck, v, r, tone]) => `
    <div style="display:grid;grid-template-columns:30px minmax(0,1fr) 64px;gap:10px;align-items:center;padding:6px 0;border-top:1px solid #F0EEF3">
      <span style="width:30px;height:52px;border-radius:4px;background:${tone}"></span>
      <span class="stack" style="gap:4px;min-width:0"><span style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t(tk, lang))}</span><span style="font-size:12px;color:var(--ink-2)">${esc(t(ck, lang))} · ${esc(fmtViews(v, lang, false))}</span></span>
      <span class="stack" style="gap:4px;align-items:flex-end"><b class="num" style="font-size:13px">${r}%</b><span style="display:block;width:64px;height:6px;border-radius:3px;background:#F3F1F6"><span style="display:block;height:6px;border-radius:3px;background:var(--primary);width:${r}%"></span></span></span>
    </div>`).join('');
}

function renderAll() {
  applyI18n(document, lang);
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderPrices();
  renderFaq();
  renderRealtime();
  renderRank();
  renderLine();
  renderTops();
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
