// CNOL RADAR 소개 페이지 — 언어 · 요금 · 그림 · Material 리플 · 마이크로 트랜지션 (Supabase는 불러오지 않아요)
import { DICT } from './i18n.js';

const LANGS = ['ko', 'en', 'ja'];
const KEY = 'radar.lang'; // 대시보드와 같은 키
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(pointer: coarse)').matches;

function getLang() {
  let l = null;
  try { l = localStorage.getItem(KEY); } catch (e) { /* 저장소를 못 쓰는 환경 */ }
  if (!LANGS.includes(l)) {
    const n = (navigator.language || 'ko').slice(0, 2).toLowerCase();
    l = LANGS.includes(n) ? n : 'ko';
  }
  return l;
}
let lang = getLang();
const t = (k, vars) => {
  let s = (DICT[lang] && DICT[lang][k]) ?? DICT.ko[k] ?? k;
  if (vars) for (const x of Object.keys(vars)) s = s.split('{' + x + '}').join(vars[x]);
  return s;
};
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- 요금 (한국어는 원화, 영어·일본어는 달러) ----------
// 출시 예정 가격 (부가세 포함 · 연간 결제는 2개월 무료) — 관리자 콘솔(admin.js PRICE)과 같아요
const PRICES = { free: [0, 0], solo: [19000, 15], plus: [39000, 29], team: [69000, 49], agency: [149000, 109] };
const money = (id) => (lang === 'ko' ? '₩' + PRICES[id][0].toLocaleString('ko-KR') : '$' + PRICES[id][1]);

// ---------- 전체 도구 ----------
const P = {
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.4 4.5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.42-1.41"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  gone: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  bars: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  line: '<path d="M3 17l6-6 4 4 8-8"/><path d="M3 21h18"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 3 5 3 3 0 0 0 5 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-3 5 3 3 0 0 1-5 1"/>',
  curve: '<path d="M3 20c4-1 6-4 8-8s4-7 10-8"/><path d="M3 20h18"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  spark: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  flask: '<path d="M9 3h6M10 3v6.5L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.5V3"/><path d="M7.3 15h9.4"/>',
  board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
  again: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  up: '<path d="M7 17L17 7M9 7h8v8"/>',
  learn: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  multi: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
};
const TOOLS = {
  find: [['target', 'f1'], ['search', 'f2'], ['chat', 'f3'], ['wave', 'f4'], ['up', 'f5'], ['link', 'f6']],
  make: [['brain', 'm1'], ['duel', 'm2'], ['spark', 'm3'], ['hash', 'm4'], ['board', 'm5'], ['flask', 'm6']],
  watch: [['bars', 'w1'], ['bell', 'w2'], ['trophy', 'w3'], ['curve', 'w4'], ['gone', 'w5'], ['multi', 'w6']],
  agent: [['sun', 'g1'], ['board', 'g2'], ['chat', 'g3'], ['learn', 'g4'], ['dna', 'g5'], ['again', 'g6']]
};
Object.assign(P, {
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  wave: '<path d="M2 12c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"/><path d="M2 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"/>',
  duel: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M9.5 6.5L14 2h3v3l-4.5 4.5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  dna: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/><path d="M8.5 7h7M8.5 17h7M10 12h4"/>'
});
let tab = 'find';
const svg = (p, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
function renderTools(animate) {
  const g = document.getElementById('toolGrid');
  if (!g) return;
  const d = document.getElementById('toolDesc');
  if (d) d.textContent = t('v8.tools.d.' + tab);
  document.querySelectorAll('#toolTabs [data-tab]').forEach((b) => { b.textContent = `${t('v8.tools.' + { find: 'f', make: 'm', watch: 'w', agent: 'g' }[b.dataset.tab])} ${TOOLS[b.dataset.tab].length}`; });
  g.classList.remove('cascade');
  g.innerHTML = TOOLS[tab].map(([ic, k], i) => `<div class="tool" style="--i:${i}"><span class="ic">${svg(P[ic])}</span><div><b>${esc(t('v8.tl.' + k + 'n'))}</b><span>${esc(t('v8.tl.' + k + 'd'))}</span></div></div>`).join('');
  if (animate && !calm) { void g.offsetWidth; g.classList.add('cascade'); }
}
function moveInd() {
  const box = document.getElementById('toolTabs');
  if (!box) return;
  const on = box.querySelector('[aria-selected="true"]');
  const ind = box.querySelector('.ind');
  ind.style.width = on.offsetWidth + 'px';
  ind.style.transform = `translateX(${on.offsetLeft}px)`;
}

// ---------- 자주 묻는 질문 ----------
function renderFaq() {
  const box = document.getElementById('faqList');
  if (!box) return;
  const open = new Set([...box.querySelectorAll('.qa.open')].map((x) => x.dataset.q));
  box.innerHTML = [9, 1, 2, 10, 3, 4, 5, 6, 7, 8].map((n) => `<div class="qa${open.has(String(n)) ? ' open' : ''}" data-q="${n}"><button type="button" aria-expanded="${open.has(String(n))}" aria-controls="qa${n}">${esc(t('v7.faq.q' + n))}<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><div class="a" id="qa${n}" role="region"><div><p>${esc(t('v7.faq.a' + n))}</p></div></div></div>`).join('');
}
document.getElementById('faqList')?.addEventListener('click', (e) => {
  const b = e.target.closest('.qa button');
  if (!b) return;
  const qa = b.closest('.qa');
  const on = !qa.classList.contains('open');
  qa.classList.toggle('open', on);
  b.setAttribute('aria-expanded', String(on));
});

// ---------- 큰 제목: 단어마다 차례로 ----------
let h1Done = false;
function splitH1() {
  const h = document.getElementById('h1');
  if (!h) return;
  let i = 0;
  for (const line of h.children) {
    line.innerHTML = line.textContent.split(/\s+/).filter(Boolean).map((w) => `<span class="w" style="--i:${i++}">${esc(w)}</span>`).join(' ');
  }
  if (!h1Done && !calm) { h.classList.add('go'); h1Done = true; }
}

// ---------- 언어 적용 ----------
function apply() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => el.setAttribute('alt', t(el.dataset.i18nAlt)));
  // 실제 대시보드 화면 — 언어마다 그 언어로 찍은 화면
  // 폰에서는 작은 WebP(800px), 큰 화면에서는 1600px — 예전 JPG보다 3~5배 가벼워요 (v14)
  document.querySelectorAll('img[data-shot]').forEach((img) => { const b = `/img/${img.dataset.shot}-${lang}`; const refs = img.dataset.shot === 'app-refs'; const visual = b + (refs ? '-visual-v2.jpg' : '-visual-v3.jpg'); if (img.getAttribute('src') !== visual) { img.setAttribute('srcset', `${visual} ${refs ? 1425 : 1280}w`); img.setAttribute('src', visual); } });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.querySelectorAll('[data-price]').forEach((el) => {
    const id = el.dataset.price;
    el.textContent = money(id);
    if (id !== 'free') {
      const s = document.createElement('small');
      s.textContent = t('v6.pl.per');
      el.appendChild(s);
    }
  });
  const note = document.getElementById('priceNote');
  if (note) note.textContent = t('v6.pr.note', { solo: money('solo'), agency: money('agency') });
  document.title = t('v6.meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('v6.meta.desc'));
  splitH1();
  renderTools(false);
  renderFaq();
  if (typeof drawOv === 'function' && document.getElementById('ovPlot')?.childElementCount) drawOv();
  requestAnimationFrame(moveInd);
  if (typeof renderMulti === 'function' && document.getElementById('mtTiles')?.childElementCount) renderMulti();
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => el.setAttribute('placeholder', t(el.dataset.i18nPh)));
  if (typeof toolsLabel === 'function') toolsLabel();
}
apply();
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  try { localStorage.setItem(KEY, lang); } catch (e) { /* 무시 */ }
  apply();
}));
// 전체 도구 24개: '이게 다 돼요' 안에서 펼쳐요 (같은 내용을 두 번 보여 주지 않게)
const toolsBtn = document.getElementById('toolsToggle');
const toolsBox = document.getElementById('tools');
function toolsLabel() {
  const btn = document.getElementById('toolsToggle'); // apply()가 먼저 불러도 되게 여기서 찾아요
  if (!btn) return;
  const on = btn.getAttribute('aria-expanded') === 'true';
  const b = btn.querySelector('.tx b');
  if (b) b.textContent = t(on ? 'v10.tools.less' : 'v9.cap.all');
}
toolsBtn?.addEventListener('click', () => {
  const on = toolsBtn.getAttribute('aria-expanded') !== 'true';
  toolsBtn.setAttribute('aria-expanded', String(on));
  toolsBox.hidden = !on;
  toolsLabel();
  if (on) { renderTools(true); requestAnimationFrame(moveInd); toolsBox.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'nearest' }); }
});
document.getElementById('toolTabs')?.addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]');
  if (!b || b.dataset.tab === tab) return;
  tab = b.dataset.tab;
  document.querySelectorAll('#toolTabs [data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  moveInd();
  renderTools(true);
});
addEventListener('resize', moveInd);

// ---------- 그림 ----------
// 유튜브 스튜디오 '실시간' 막대: 48칸 · 한 색 · 마우스를 올리면 그 시간 조회수
const RT_TOTAL = 1284310;
const RT = (() => {
  const raw = [];
  for (let i = 0; i < 48; i++) {
    const day = Math.sin(((i + 6) / 24) * Math.PI * 2) * 0.5 + 0.5;
    const lift = i >= 34 ? 1 + (i - 34) * 0.08 : 1;
    raw.push((0.35 + day * 0.65) * lift * (0.88 + ((i * 7) % 11) / 40));
  }
  const sum = raw.reduce((a, v) => a + v, 0);
  return raw.map((v) => Math.round((v / sum) * RT_TOTAL));
})();
const fmtNum = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US');
function rtBars(el) {
  if (!el) return;
  const max = Math.max(...RT);
  el.innerHTML = RT.map((v, i) => `<i style="--i:${i};height:${((v / max) * 100).toFixed(1)}%"></i>`).join('') + '<span class="lp-tip" role="status"></span>';
  if (touch) return;
  const tip = el.querySelector('.lp-tip');
  el.querySelectorAll('i').forEach((b, i) => {
    b.addEventListener('pointerenter', () => {
      const ago = 47 - i;
      tip.innerHTML = `<b>${esc(ago ? t('v7.tip.hago', { h: ago }) : t('v7.tip.now'))}</b><span>${esc(t('v7.tip.views', { n: fmtNum(RT[i]) }))}</span>`;
      tip.style.left = Math.min(Math.max(b.offsetLeft + b.offsetWidth / 2, 70), el.clientWidth - 70) + 'px';
      tip.style.top = (el.clientHeight - b.offsetHeight) + 'px';
      tip.classList.add('on');
      b.classList.add('on');
    });
    b.addEventListener('pointerleave', () => { tip.classList.remove('on'); b.classList.remove('on'); });
  });
}
rtBars(document.getElementById('heroBars'));
rtBars(document.getElementById('demoBars'));

// 유튜브 스튜디오 '개요' 선 차트: 28일 · 오른쪽 눈금 · 회색 평소 범위 · 세로선 + 점 + 흰 툴팁
const OV_TOTAL = 4120553;
const OV = (() => {
  const raw = [];
  for (let i = 0; i < 28; i++) raw.push(1 + Math.sin((i / 7) * Math.PI * 2 + 0.6) * 0.17 + (i / 27) * 0.42 + ((i * 5) % 7) / 60);
  const sum = raw.reduce((a, v) => a + v, 0);
  return raw.map((v) => Math.round((v / sum) * OV_TOTAL));
})();
const OV_BAND = [112000, 141000];
const OV_MAX = 200000;
const ovDay = (i) => new Date(Date.UTC(2026, 8, 8 + i, 3));
const loc = () => (lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US');
function drawOv() {
  const box = document.getElementById('ovPlot');
  if (!box) return;
  const W = 100, H = 100;
  const x = (i) => (i / 27) * W, y = (v) => H - (v / OV_MAX) * H;
  const grid = [0, 50000, 100000, 150000, 200000];
  const yl = (v) => (v === 0 ? '0' : lang === 'en' ? v / 1000 + 'K' : v / 10000 + (lang === 'ja' ? '万' : '만'));
  const d = OV.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
  const xd = (i) => ovDay(i).toLocaleDateString(loc(), { month: 'short', day: 'numeric', timeZone: 'UTC' });
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    ${grid.map((g) => `<line class="g${g === 0 ? ' z' : ''}" x1="0" x2="${W}" y1="${y(g)}" y2="${y(g)}"/>`).join('')}
    <rect class="band" x="0" y="${y(OV_BAND[1])}" width="${W}" height="${y(OV_BAND[0]) - y(OV_BAND[1])}"/>
    <path class="ln" pathLength="1" d="${d}"/></svg>
    ${grid.map((g) => `<span class="yl" style="top:${y(g)}%">${esc(yl(g))}</span>`).join('')}
    <span class="xl first" style="left:0">${esc(xd(0))}</span><span class="xl" style="left:50%">${esc(xd(13))}</span><span class="xl last" style="left:100%">${esc(xd(27))}</span>
    <i class="cross"></i><i class="dot"></i><span class="lp-tip" role="status"></span>`;
  if (touch) return;
  const cross = box.querySelector('.cross'), dot = box.querySelector('.dot'), tip = box.querySelector('.lp-tip');
  box.onpointermove = (e) => {
    const r = box.getBoundingClientRect();
    const i = Math.max(0, Math.min(27, Math.round(((e.clientX - r.left) / r.width) * 27)));
    const px = (i / 27) * r.width, py = (y(OV[i]) / 100) * r.height;
    cross.style.left = px + 'px';
    dot.style.left = px + 'px'; dot.style.top = py + 'px';
    tip.innerHTML = `<b>${esc(ovDay(i).toLocaleDateString(loc(), { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' }))}</b><span>${esc(t('v7.tip.views', { n: fmtNum(OV[i]) }))}</span>`;
    tip.style.left = Math.min(Math.max(px, 70), r.width - 70) + 'px';
    tip.style.top = py + 'px';
    box.classList.add('on'); tip.classList.add('on');
  };
  box.onpointerleave = () => { box.classList.remove('on'); tip.classList.remove('on'); };
}
const hrs = document.getElementById('fHrs');
if (hrs) {
  const v = [5, 4, 3, 3, 2, 2, 3, 5, 7, 8, 9, 10, 12, 11, 10, 11, 13, 15, 18, 26, 17, 14, 10, 7];
  hrs.innerHTML = v.map((x, h) => `<i class="${h === 19 ? 'hot' : ''}" style="--i:${h};height:${((x / 26) * 100).toFixed(1)}%"></i>`).join('');
}

// ---------- 화면에 들어올 때: 나타나기 · 막대 자라기 · 숫자 세기 ----------
function countUp(el) {
  const to = Number(el.dataset.count);
  if (calm || !to) { el.textContent = String(to); return; }
  const t0 = performance.now(), dur = 1100;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  el.textContent = '0';
  requestAnimationFrame(step);
}
const io = new IntersectionObserver((ents) => {
  for (const en of ents) {
    if (!en.isIntersecting) continue;
    const el = en.target;
    if (el.classList.contains('rv')) el.classList.add('in');
    if (el.matches('.stk, .hrs, .rt-bars') && !calm) el.classList.add('grow');
    if (el.id === 'ovPlot') { drawOv(); if (!calm) el.querySelector('.ln')?.classList.add('draw'); }
    if (el.dataset.count) countUp(el);
    io.unobserve(el);
  }
}, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.rv, .stk, .hrs, .rt-bars, #ovPlot, [data-count]').forEach((el) => { if (!el.closest('.scene')) io.observe(el); });

// ---------- Material 리플 ----------
document.addEventListener('pointerdown', (e) => {
  const host = e.target.closest('.md-btn, .md-tabs button, .qa button, .md-fab');
  if (!host || calm) return;
  const r = host.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2.2;
  const s = document.createElement('span');
  s.className = 'rp';
  s.style.width = s.style.height = size + 'px';
  s.style.left = (e.clientX - r.left - size / 2) + 'px';
  s.style.top = (e.clientY - r.top - size / 2) + 'px';
  host.appendChild(s);
  setTimeout(() => s.remove(), 650);
});

// ---------- 카드 기울이기 · 자석 버튼 (마우스일 때만) ----------
if (!calm && !touch) {
  document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .15s ease-out, box-shadow .35s';
      el.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .7s cubic-bezier(.05,.7,.1,1), box-shadow .35s';
      el.style.transform = '';
    });
  });
  document.querySelectorAll('.mag').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(dx * 0.12).toFixed(1)}px, ${(dy * 0.22).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// ---------- 위 막대 그림자 · 진행 막대 · 떠 있는 버튼 ----------
const bar = document.getElementById('bar');
const prog = document.getElementById('prog');
const fab = document.getElementById('fab');
const hero = document.querySelector('.md-hero');
const end = document.querySelector('.md-end');
let endVisible = false;
if (end) new IntersectionObserver(([en]) => { endVisible = en.isIntersecting; onScroll(); }, { threshold: 0.1 }).observe(end);
function onScroll() {
  const y = scrollY;
  bar?.classList.toggle('up', y > 4);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (prog) prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  if (fab && hero) fab.classList.toggle('show', y > hero.offsetTop + hero.offsetHeight - 80 && !endVisible);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- 60초 둘러보기: 장면 4개를 차례로 (화면에 보일 때만 움직여요) ----------
const player = document.getElementById('player');
if (player) {
  const scenes = [...player.querySelectorAll('.scene')];
  const steps = [...player.querySelectorAll('[data-step]')];
  const pp = document.getElementById('pp');
  const DUR = [4600, 3600, 3600, 3800];
  let cur = 0, timer = null, paused = calm, seen = false;
  const show = (i) => {
    cur = (i + scenes.length) % scenes.length;
    scenes.forEach((sc, k) => {
      sc.classList.remove('on');
      if (k === cur) { void sc.offsetWidth; sc.classList.add('on'); }
    });
    steps.forEach((b, k) => {
      b.classList.toggle('done', k < cur);
      if (k === cur) { b.setAttribute('aria-current', 'true'); b.style.setProperty('--dur', DUR[k] + 'ms'); const bar = b.querySelector('b'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      else b.removeAttribute('aria-current');
    });
    clearTimeout(timer);
    if (!paused && seen) timer = setTimeout(() => show(cur + 1), DUR[cur]);
  };
  const setPaused = (p) => {
    paused = p;
    player.classList.toggle('paused', p);
    pp.setAttribute('aria-pressed', String(p));
    if (p) clearTimeout(timer); else show(cur);
  };
  steps.forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.step))));
  pp.addEventListener('click', () => setPaused(!paused));
  new IntersectionObserver(([en]) => {
    seen = en.isIntersecting;
    if (seen && !paused) show(cur); else clearTimeout(timer);
  }, { threshold: 0.35 }).observe(player);
  if (calm) { player.classList.add('paused'); pp.setAttribute('aria-pressed', 'true'); }
}

// ---------- v9: 이게 다 돼요 아이콘 · 눌러서 바로 그 설명으로 ----------
Object.assign(P, {
  quote: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/>',
  play: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><path d="M17.5 14v7M14 17.5h7"/>'
});
document.querySelectorAll('[data-ic]').forEach((el) => { if (P[el.dataset.ic]) el.innerHTML = svg(P[el.dataset.ic], 21); });
const flash = (el) => { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 2000); };
document.querySelectorAll('.cap[href^="#"]').forEach((a) => a.addEventListener('click', () => {
  const el = document.querySelector(a.getAttribute('href'));
  if (el) setTimeout(() => flash(el), calm ? 0 : 520);
}));

// ---------- v9: 채널 12개 · 48시간 — 유튜브 스튜디오 '실시간' 카드처럼 ----------
// 색: 검증된 순서 그대로 7색(채널에 붙어요, 순위가 아니라) · 8번째 채널부터는 '그 외'로 묶어요
const MT_COL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7'];
const MT_OTHER = '#b5b0c6';
const MT_TOTAL = 1284310;
const MT = (() => {
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const W = [1.0, 1.2, 0.92, 0.78, 0.7, 0.62, 0.55, 0.42, 0.36, 0.3, 0.24, 0.18];
  const kstNow = (new Date().getUTCHours() + 9) % 24;
  const raw = W.map((w, c) => Array.from({ length: 48 }, (_, i) => {
    const h = (kstNow - 47 + i + 96) % 24; // 그 칸의 한국 시각
    const day = 0.22 + 0.78 * Math.pow(0.5 - 0.5 * Math.cos(((h - 6 + 24) % 24) / 24 * Math.PI * 2), 0.85) + 0.18 * Math.exp(-Math.pow(h - 21, 2) / 6);
    const boom = c === 1 && i >= 36 ? 1 + (i - 35) * 0.24 : 1; // 한 채널은 최근 12시간 급상승
    return w * day * boom * (0.84 + rnd() * 0.32);
  }));
  const sum = raw.flat().reduce((a, v) => a + v, 0);
  const vals = raw.map((a) => a.map((v) => Math.round((v / sum) * MT_TOTAL)));
  const tot = vals.map((a) => a.reduce((p, q) => p + q, 0));
  const hours = Array.from({ length: 48 }, (_, i) => vals.reduce((p, a) => p + a[i], 0));
  const usual = vals.map((a) => a.slice(0, 36).reduce((p, q) => p + q, 0) / 36);
  const recent = vals.map((a) => a.slice(-6).reduce((p, q) => p + q, 0) / 6);
  return { vals, tot, hours, x: recent.map((r, c) => r / Math.max(1, usual[c])) };
})();
let mtMode = 'sum';
const mtName = (c) => t('v9.ch.' + (c + 1));
const mtRank = () => [...MT.tot.keys()].sort((a, b) => MT.tot[b] - MT.tot[a]);
const mtKey = (c) => (c < 7 ? String(c) : 'o');
const mtColor = (c) => (c < 7 ? MT_COL[c] : MT_OTHER);
const mtAv = (c) => `<span class="yt-av" style="--av:${c < 7 ? MT_COL[c] : '#909090'}" aria-hidden="true">${esc(Array.from(mtName(c).replace(/^[^·・]*[·・]\s*/, ''))[0] || '?')}</span>`;
const mtAgo = (i) => (i === 47 ? t('v7.tip.now') : t('v7.tip.hago', { h: 47 - i }));
function mtParts(i) {
  const p = [...Array(7).keys()].map((c) => ({ k: String(c), c, v: MT.vals[c][i], color: MT_COL[c], label: mtName(c) }));
  p.push({ k: 'o', c: -1, v: [7, 8, 9, 10, 11].reduce((a, c) => a + MT.vals[c][i], 0), color: MT_OTHER, label: t('v9.mt.others', { n: 5 }) });
  return p;
}
function mtSpark(a) {
  const W = 120, H = 44, n = a.length, max = Math.max(1, ...a);
  const pts = a.map((v, i) => [(i / (n - 1)) * W, H - 3 - (v / max) * (H - 8)]);
  const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="ar" d="${d}L${W} ${H}L0 ${H}Z"/><path class="ln" d="${d}"/></svg><i class="dot" style="top:${((pts[n - 1][1] / H) * 100).toFixed(1)}%"></i>`;
}
function mtHighlight(k) {
  const plot = document.getElementById('mtPlot');
  const lg = document.getElementById('mtLegend');
  if (!plot) return;
  const on = k != null && mtMode === 'ch';
  plot.classList.toggle('hl', on);
  plot.querySelectorAll('[data-s]').forEach((s) => s.classList.toggle('hs', on && s.dataset.s === k));
  if (lg) { lg.classList.toggle('dim', on); lg.querySelectorAll('.lg').forEach((x) => x.classList.toggle('on', on && x.dataset.s === k)); }
}
function drawMulti(animate) {
  const plot = document.getElementById('mtPlot');
  if (!plot) return;
  const H = plot.clientHeight || 160;
  const max = Math.max(...MT.hours);
  plot.className = 'mt-plot ' + mtMode;
  plot.innerHTML = MT.hours.map((v, i) => {
    const h = Math.max(2, (v / max) * (H - 6));
    let inner;
    if (mtMode === 'sum') inner = `<i style="height:${h.toFixed(1)}px"></i>`;
    else {
      const parts = mtParts(i).filter((p) => p.v > 0);
      const avail = Math.max(h - 2 * (parts.length - 1), parts.length);
      inner = parts.map((p) => `<i data-s="${p.k}" style="height:${Math.max(1, (p.v / v) * avail).toFixed(1)}px;background:${p.color}"></i>`).join('');
    }
    return `<div class="c" data-i="${i}" style="--i:${i}">${inner}</div>`;
  }).join('') + '<span class="lp-tip" role="status"></span>';
  if (animate && !calm) { void plot.offsetWidth; plot.classList.add('grow'); }
  plot.setAttribute('aria-label', t('v9.mt.aria', { n: fmtNum(MT_TOTAL), c: mtName(mtRank()[0]) }));
  const tip = plot.querySelector('.lp-tip');
  const showTip = (el) => {
    const i = Number(el.dataset.i);
    let html = `<b>${esc(mtAgo(i))}</b><span>${esc(t('v7.tip.views', { n: fmtNum(MT.hours[i]) }))}</span>`;
    if (mtMode === 'ch') html += mtParts(i).sort((a, b) => b.v - a.v).slice(0, 5).map((p) => `<div class="rw"><i style="background:${p.color}"></i><b>${esc(fmtNum(p.v))}</b><span>${esc(p.label)}</span></div>`).join('');
    tip.innerHTML = html;
    tip.classList.add('on');
    const hb = el.firstElementChild ? el.getBoundingClientRect().bottom - Math.min(...[...el.children].map((x) => x.getBoundingClientRect().top)) : 0;
    tip.style.left = Math.min(Math.max(el.offsetLeft + el.offsetWidth / 2, tip.offsetWidth / 2 + 4), plot.clientWidth - tip.offsetWidth / 2 - 4) + 'px';
    tip.style.top = Math.max(-8, plot.clientHeight - hb) + 'px';
    plot.querySelectorAll('.c.on').forEach((x) => x.classList.remove('on'));
    el.classList.add('on');
  };
  plot.querySelectorAll('.c').forEach((el) => {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') showTip(el); });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') { tip.classList.remove('on'); el.classList.remove('on'); } });
    el.addEventListener('click', () => showTip(el));
  });
  // 채널별일 때만 범례 (색 + 이름 + 비중) — 범례에 올리면 그 채널만 또렷하게
  const lg = document.getElementById('mtLegend');
  if (lg) {
    lg.hidden = mtMode !== 'ch';
    if (mtMode === 'ch') {
      const sums = {};
      for (let i = 0; i < 48; i++) for (const p of mtParts(i)) sums[p.k] = (sums[p.k] || 0) + p.v;
      lg.innerHTML = mtParts(0).map((p) => `<span class="lg" tabindex="0" data-s="${p.k}"><i style="background:${p.color}"></i><span>${esc(p.label)}</span><em>${Math.round((sums[p.k] / MT_TOTAL) * 100)}%</em></span>`).join('');
      lg.querySelectorAll('.lg').forEach((x) => {
        x.addEventListener('pointerenter', () => mtHighlight(x.dataset.s));
        x.addEventListener('pointerleave', () => mtHighlight(null));
        x.addEventListener('focus', () => mtHighlight(x.dataset.s));
        x.addEventListener('blur', () => mtHighlight(null));
      });
    }
  }
}
function renderMulti() {
  if (!document.getElementById('mtPlot')) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('mtSumN', t('v9.mt.sumN', { n: 12 }));
  set('mtTotal', fmtNum(MT_TOTAL));
  set('mtDelta', t('v9.mt.delta', { p: 23 }));
  set('mtHour', fmtNum(MT.hours[47]));
  document.querySelectorAll('#mtMode [data-mt]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mt === mtMode)));
  const rank = mtRank();
  const mine = (c) => (c === 0 ? `<span class="yt-mine">${esc(t('v9.mt.mine'))}</span>` : '');
  const top = rank.filter((c) => c < 7); // 색이 있는 7개 채널 (차트 범례와 같은 묶음)
  const rest = rank.filter((c) => c >= 7);
  const restSum = rest.reduce((a, c) => a + MT.tot[c], 0);
  const list = document.getElementById('mtTop');
  if (list) {
    list.innerHTML = top.map((c) => `<li data-c="${c}">${mtAv(c)}<span class="n">${esc(mtName(c))}</span>${mine(c)}<b>${esc(fmtNum(MT.tot[c]))}</b></li>`).join('')
      + `<li class="more"><span class="yt-av" style="--av:#c6c6c6" aria-hidden="true">+${rest.length}</span><span class="n">${esc(t('v9.mt.others', { n: rest.length }))}</span><b>${esc(fmtNum(restSum))}</b></li>`;
  }
  const tiles = document.getElementById('mtTiles');
  if (tiles) {
    tiles.innerHTML = rank.map((c) => {
      const share = Math.round((MT.tot[c] / MT_TOTAL) * 100);
      const hot = MT.x[c] >= 1.8 ? `<span class="hot"><i aria-hidden="true">↑</i>${esc(t('v9.mt.hot', { x: MT.x[c].toFixed(1) }))}</span>` : `<span class="hot" style="visibility:hidden"><i></i>-</span>`;
      return `<div class="yt-card mt-tile" data-c="${c}"><div class="tp">${mtAv(c)}<span class="n">${esc(mtName(c))}</span>${mine(c)}</div><div class="nb"><b>${esc(fmtNum(MT.tot[c]))}</b><small>${esc(t('v9.mt.share', { p: share < 1 ? '<1' : share }))}</small></div>${hot}<div class="mt-sp">${mtSpark(MT.vals[c])}</div></div>`;
    }).join('');
  }
  // 채널 카드·인기 채널에 올리면 그 채널을 차트에서 또렷하게 (채널별일 때)
  document.querySelectorAll('#mtTiles [data-c], #mtTop [data-c]').forEach((el) => {
    el.addEventListener('pointerenter', () => mtHighlight(mtKey(Number(el.dataset.c))));
    el.addEventListener('pointerleave', () => mtHighlight(null));
  });
  const tb = document.querySelector('#mtTable tbody');
  if (tb) tb.innerHTML = rank.map((c) => `<tr><th scope="row">${esc(mtName(c))}</th><td>${esc(fmtNum(MT.tot[c]))}</td><td>${Math.round((MT.tot[c] / MT_TOTAL) * 100)}%</td></tr>`).join('');
  drawMulti(false);
}
document.getElementById('mtMode')?.addEventListener('click', (e) => {
  const b = e.target.closest('[data-mt]');
  if (!b || b.dataset.mt === mtMode) return;
  mtMode = b.dataset.mt;
  document.querySelectorAll('#mtMode [data-mt]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  drawMulti(true);
});
renderMulti();
{
  const mp = document.getElementById('mtPlot');
  if (mp) new IntersectionObserver(([en], ob) => { if (en.isIntersecting) { drawMulti(true); ob.disconnect(); } }, { threshold: 0.3 }).observe(mp);
  let rw = 0;
  addEventListener('resize', () => { clearTimeout(rw); rw = setTimeout(() => drawMulti(false), 150); });
}

// ---------- v9: 사용 신청 (이메일만 · 가입이 열리면 알려 드려요) ----------
const SB_URL = 'https://gbgcoxjnjlrzbwclevul.supabase.co';
const SB_KEY = 'sb_publishable_u1HixC_2hyoQi9Sd_mnaWQ_0nHSrQ8b'; // 공개용 키 — 행 단위 보안(RLS)으로 '넣기'만 돼요
document.getElementById('wlForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const inp = f.querySelector('#wlMail');
  const btn = f.querySelector('#wlBtn');
  const msg = document.getElementById('wlMsg');
  const say = (k, cls, vars) => { msg.className = 'wl-msg ' + cls; msg.textContent = t(k, vars); };
  const email = inp.value.trim();
  if (f.querySelector('#wlHp').value) { say('v9.wl.ok', 'ok', { e: email }); return; } // 자동 입력 봇
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) { say('v9.wl.bad', 'err'); inp.focus(); return; }
  btn.disabled = true;
  try {
    const r = await fetch(SB_URL + '/rest/v1/inquiries', {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email, language: lang, message: '[사용 신청] 소개 페이지' })
    });
    if (!r.ok) throw new Error(String(r.status));
    say('v9.wl.ok', 'ok', { e: email });
    inp.value = '';
    inp.disabled = true;
  } catch (er) {
    btn.disabled = false;
    say('v9.wl.fail', 'err');
  }
});
