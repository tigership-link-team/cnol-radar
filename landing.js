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
const PRICES = { free: [0, 0], solo: [19000, 15], plus: [29000, 25], team: [39000, 35], agency: [99000, 79] };
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
  collect: [['link', 'c1'], ['clock', 'c2'], ['search', 'c3'], ['gone', 'c4'], ['globe', 'c5'], ['shield', 'c6']],
  analyze: [['bars', 'a1'], ['line', 'a2'], ['brain', 'a3'], ['curve', 'a4'], ['trophy', 'a5'], ['cal', 'a6']],
  ideas: [['spark', 'i1'], ['target', 'i2'], ['flask', 'i3'], ['board', 'i4'], ['hash', 'i5'], ['again', 'i6']],
  agent: [['sun', 'g1'], ['bell', 'g2'], ['up', 'g3'], ['learn', 'g4'], ['search', 'g5'], ['multi', 'g6']]
};
let tab = 'collect';
const svg = (p, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
function renderTools(animate) {
  const g = document.getElementById('toolGrid');
  if (!g) return;
  g.classList.remove('cascade');
  g.innerHTML = TOOLS[tab].map(([ic, k], i) => `<div class="tool" style="--i:${i}"><span class="ic">${svg(P[ic])}</span><div><b>${esc(t('v7.tl.' + k + 'n'))}</b><span>${esc(t('v7.tl.' + k + 'd'))}</span></div></div>`).join('');
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
  box.innerHTML = [1, 2, 3, 4, 5, 6].map((n) => `<div class="qa${open.has(String(n)) ? ' open' : ''}" data-q="${n}"><button type="button" aria-expanded="${open.has(String(n))}" aria-controls="qa${n}">${esc(t('v7.faq.q' + n))}<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><div class="a" id="qa${n}" role="region"><div><p>${esc(t('v7.faq.a' + n))}</p></div></div></div>`).join('');
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
}
apply();
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  try { localStorage.setItem(KEY, lang); } catch (e) { /* 무시 */ }
  apply();
}));
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
