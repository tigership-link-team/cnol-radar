// CNOL RADAR v15 — 머티리얼 모션 + Amicro 마이크로 트랜지션 (바닐라 JS로 옮겼어요)
// · Amicro — MIT License · © 2026 Syed Subhan Uddin · https://github.com/Subhan-code/Amicro--Micro-transitions-
//   원본 React/motion 컴포넌트의 스프링 값(stiffness · damping · mass)과 움직임 수치를 그대로 옮겼어요.
//   (버튼: hover 1.02 · tap 0.96 · 아이콘 600/25 · 회전 400/25 · 자석 ×0.35 / 카드: ARC 30°·70px 180/20/0.8 · 커버플로 32px·38° 200/25)
// · 머티리얼: 리플(물결) · 위 막대 그림자 · 스크롤 진행 막대 · 등장(fade-up) · 제목 글자 올라오기
// · '동작 줄이기'를 켠 기기에서는 움직이지 않아요. 마우스 전용 효과(자석 · 기울기)는 터치 기기에서 꺼요.

const mq = (q) => (typeof matchMedia === 'function' ? matchMedia(q) : { matches: false, addEventListener() {} });
const RM = mq('(prefers-reduced-motion: reduce)');
const FINE = mq('(hover: hover) and (pointer: fine)');
export const calm = () => RM.matches;
export const fine = () => FINE.matches;

// ---------- 스프링 → CSS 곡선 (스프링 물리를 그대로 재서 linear()로) ----------
// linear()를 모르는 브라우저(옛 사파리 등)는 비슷한 cubic-bezier로 바꿔요 — 모양은 같고 튕김만 조금 덜해요
const LIN_OK = typeof CSS !== 'undefined' && !!CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)');
export function springCurve(k, c, m = 1) {
  let x = 0, v = 0, t = 0, end = 0, over = 0;
  const pts = [0];
  const dt = 1 / 600;
  for (let i = 1; i <= 1800; i++) { // 최대 3초
    const a = (-k * (x - 1) - c * v) / m;
    v += a * dt; x += v * dt; t += dt;
    if (x > over) over = x;
    if (i % 10 === 0) { // 1/60초마다 한 점
      pts.push(x);
      if (Math.abs(x - 1) < 0.0015 && Math.abs(v) < 0.02) { end = t; break; }
    }
  }
  pts[pts.length - 1] = 1;
  const dur = Math.max(120, Math.round((end || 3) * 1000));
  const css = LIN_OK ? 'linear(' + pts.map((y) => String(+y.toFixed(4))).join(', ') + ')' : over > 1.04 ? 'cubic-bezier(.34,1.45,.64,1)' : 'cubic-bezier(.22,1,.36,1)';
  return { dur, css };
}
// Amicro에서 쓰는 스프링들 (이름 → [stiffness, damping, mass])
export const SPRINGS = {
  icon: [600, 25, 1], // 아이콘 바꾸기 (slide-arrow · sparkle · morph · ring)
  rot: [400, 25, 1], // 아이콘 돌리기 (rotate · text-reveal)
  btn: [550, 30, 1], // 버튼 크기 (motion 기본 scale 스프링)
  xy: [500, 25, 1], // 움직이기 (motion 기본 x · y 스프링)
  card: [180, 20, 0.8], // 카드 펼치기 (ARC · linear spread)
  casc: [200, 22, 0.9], // 계단식 펼치기
  flow: [200, 25, 1], // 커버플로
  pop: [600, 15, 1], // 빨간 점 톡 (ring)
  blur: [350, 20, 1], // 초점 흐리기 괄호
  ring: [400, 20, 1] // 퍼지는 고리
};
function setCurves() {
  const r = document.documentElement;
  for (const [n, [k, c, m]] of Object.entries(SPRINGS)) {
    const s = springCurve(k, c, m);
    r.style.setProperty('--sp-' + n, s.css);
    r.style.setProperty('--sp-' + n + '-d', s.dur + 'ms');
  }
}

// ---------- 손으로 따라가는 스프링 (자석 · 기울기) — requestAnimationFrame 한 개로 ----------
const ST = new WeakMap();
const live = new Set();
const KEYS = ['x', 'y', 'scale', 'rotate', 'rx', 'ry'];
let raf = 0;
let t0 = 0;
function stOf(el) {
  let s = ST.get(el);
  if (!s) {
    s = { el, c: { x: 0, y: 0, scale: 1, rotate: 0, rx: 0, ry: 0 }, v: { x: 0, y: 0, scale: 0, rotate: 0, rx: 0, ry: 0 }, to: { x: 0, y: 0, scale: 1, rotate: 0, rx: 0, ry: 0 }, f: {}, lift: 0 };
    ST.set(el, s);
  }
  return s;
}
function paint(s) {
  const c = s.c;
  const still = !c.x && !c.y && c.scale === 1 && !c.rotate && !c.rx && !c.ry;
  if (still) { s.el.style.transform = ''; s.el.style.willChange = ''; return; }
  s.el.style.willChange = 'transform';
  s.el.style.transform = (c.rx || c.ry ? 'perspective(900px) ' : '') + `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px)`
    + (c.rotate ? ` rotate(${c.rotate.toFixed(2)}deg)` : '') + (c.rx ? ` rotateX(${c.rx.toFixed(2)}deg)` : '') + (c.ry ? ` rotateY(${c.ry.toFixed(2)}deg)` : '')
    + (c.scale !== 1 ? ` scale(${c.scale.toFixed(4)})` : '');
}
function tick(now) {
  raf = 0;
  const dt = Math.min(0.05, Math.max(0, (now - t0) / 1000));
  t0 = now;
  for (const s of live) {
    if (!s.el.isConnected) { live.delete(s); continue; }
    let busy = false;
    for (const k of KEYS) {
      const f = s.f[k];
      if (!f) continue;
      let x = s.c[k], v = s.v[k];
      const to = s.to[k];
      for (let left = dt; left > 1e-6;) { // 작게 나눠 계산해요 (뻣뻣한 스프링도 튀지 않게)
        const h = Math.min(left, 1 / 240);
        const a = (-f[0] * (x - to) - f[1] * v) / (f[2] || 1);
        v += a * h; x += v * h; left -= h;
      }
      const eps = k === 'scale' ? 0.0004 : 0.02;
      if (Math.abs(x - to) < eps && Math.abs(v) < eps * 10) { x = to; v = 0; } else busy = true;
      s.c[k] = x; s.v[k] = v;
    }
    paint(s);
    if (!busy) live.delete(s);
  }
  if (live.size) { raf = requestAnimationFrame(tick); }
}
export function spring(el, to, f) {
  if (!el) return;
  const s = stOf(el);
  for (const k of Object.keys(to)) {
    if (!(k in s.c)) continue;
    s.to[k] = to[k];
    s.f[k] = f || (k === 'scale' ? SPRINGS.btn : SPRINGS.xy);
  }
  if (calm()) { Object.assign(s.c, s.to); for (const k of KEYS) s.v[k] = 0; paint(s); return; }
  live.add(s);
  if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(tick); }
}

// ---------- 자석 버튼 (Amicro magnetic: 가운데에서 떨어진 만큼 × 0.35) + 누를 때 0.96 ----------
const MAG = '.rc-fab,.md-efab,[data-mi~="magnetic"]';
function bindMagnetic() {
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || calm()) return;
    const b = e.target.closest && e.target.closest(MAG);
    if (!b || b.disabled) return;
    const r = b.getBoundingClientRect();
    spring(b, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 });
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const b = e.target.closest && e.target.closest(MAG);
    if (!b || (e.relatedTarget && b.contains(e.relatedTarget))) return;
    spring(b, { x: 0, y: 0, scale: 1 });
  }, { passive: true });
  document.addEventListener('pointerdown', (e) => { const b = e.target.closest && e.target.closest(MAG); if (b && !b.disabled) spring(b, { scale: 0.96 }); }, { passive: true });
  const up = (e) => { const b = e.target.closest && e.target.closest(MAG); if (b) spring(b, { scale: 1 }); };
  document.addEventListener('pointerup', up, { passive: true });
  document.addEventListener('pointercancel', up, { passive: true });
}

// ---------- 카드 기울이기 (마우스 위치를 따라 살짝 · 놓으면 스프링으로 제자리) ----------
const TILT = '[data-tilt]';
const TILT_F = [260, 24, 1];
function bindTilt() {
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || calm()) return;
    const el = e.target.closest && e.target.closest(TILT);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    const amt = Number(el.dataset.tilt) || 6;
    spring(el, { rx: -py * amt, ry: px * amt * 1.2, y: -2 }, TILT_F);
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const el = e.target.closest && e.target.closest(TILT);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    spring(el, { rx: 0, ry: 0, y: 0 }, TILT_F);
  }, { passive: true });
}

// ---------- 머티리얼 리플 (누른 자리에서 퍼지는 물결 · 12%) ----------
const RIPPLE = '.dk-btn,.dk-hbtn,.dk-nav,.dk-chip,.dk-tabs a,.dk-mini,.dk-out,.tl-card,.md-efab,.rc-fab,.dk-bell,.md-icon,.md-search,.dk-find,.dk-kind button,.dk-lang button,.dk-seg button,.bn-i,.pf-o,.fd-tab,.fd-r,.fd-tool,.ro-card .ro-go,.dk-li,.hs-item,.th-s,[data-ripple]';
function ripple(host, x, y) {
  if (calm()) return;
  let box = host.querySelector(':scope > md-rpl');
  if (!box) {
    box = document.createElement('md-rpl');
    box.setAttribute('aria-hidden', 'true');
    host.appendChild(box);
  }
  const r = host.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const fx = x == null ? r.left + r.width / 2 : x, fy = y == null ? r.top + r.height / 2 : y;
  const size = Math.hypot(Math.max(fx - r.left, r.right - fx), Math.max(fy - r.top, r.bottom - fy)) * 2;
  const w = document.createElement('md-wave');
  w.style.cssText = `width:${size}px;height:${size}px;left:${(fx - r.left - size / 2).toFixed(1)}px;top:${(fy - r.top - size / 2).toFixed(1)}px`;
  box.appendChild(w);
  const grow = w.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'cubic-bezier(.2,0,0,1)', fill: 'forwards' });
  let gone = false;
  const done = () => {
    if (gone) return;
    gone = true;
    const fade = () => { const a = w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'linear', fill: 'forwards' }); a.onfinish = () => w.remove(); };
    if (grow.playState === 'finished') fade(); else grow.onfinish = fade;
  };
  host.addEventListener('pointerup', done, { once: true });
  host.addEventListener('pointercancel', done, { once: true });
  host.addEventListener('pointerleave', done, { once: true });
  setTimeout(done, 900); // 손을 안 떼도 남지 않게
}
function bindRipple() {
  document.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const h = e.target.closest && e.target.closest(RIPPLE);
    if (!h || h.disabled || h.getAttribute('aria-disabled') === 'true') return;
    ripple(h, e.clientX, e.clientY);
  }, { passive: true });
  // 키보드(Enter · Space)로 눌러도 가운데에서 물결
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const h = e.target.closest && e.target.closest(RIPPLE);
    if (h && e.target === h && !h.disabled) { ripple(h); setTimeout(() => h.querySelectorAll(':scope > md-rpl > md-wave').forEach((w) => w.remove()), 650); }
  });
}

// ---------- 위 막대: 스크롤하면 그림자 · 진행 막대 (Amicro use-scroll-progress) ----------
function bindScroll() {
  const main = document.getElementById('main');
  const top = document.getElementById('top') || document.querySelector('.dk-top');
  if (!main || !top) return;
  let q = 0;
  // PC는 본문(#main)이, 휴대폰은 문서 전체가 스크롤돼요 — 지금 스크롤되는 쪽을 봐요
  const scroller = () => (getComputedStyle(main).overflowY === 'visible' ? (document.scrollingElement || document.documentElement) : main);
  const upd = () => {
    q = 0;
    const sc = scroller();
    const y = sc.scrollTop;
    const max = sc.scrollHeight - sc.clientHeight;
    top.classList.toggle('up', y > 4);
    top.style.setProperty('--prog', max > 8 ? Math.min(1, Math.max(0, y / max)).toFixed(4) : '0');
  };
  const kick = () => { if (!q) q = requestAnimationFrame(upd); };
  main.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick, { passive: true });
  if (typeof ResizeObserver === 'function') new ResizeObserver(kick).observe(main);
  upd();
}

// ---------- 화면 들어올 때: 카드는 차례로 아래에서 위로 (fade-up) · 제목은 글자 덩어리가 올라와요 ----------
export function enter(view, same) {
  if (!view) return;
  if (same || calm()) return;
  let i = 0;
  view.querySelectorAll('.dk-fade').forEach((el) => {
    if (el.parentElement && el.parentElement.closest('.dk-fade')) return; // 안쪽 것은 바깥 것과 같이 움직여요
    el.style.animationDelay = Math.min(i, 9) * 45 + 'ms';
    i++;
  });
  const h = view.querySelector('.dk-head h1');
  if (h && !h.dataset.tr && h.childElementCount === 0) textReveal(h);
}
export function textReveal(h) {
  const txt = h.textContent;
  if (!txt || txt.length > 60) return;
  h.dataset.tr = '1';
  const parts = txt.split(/(\s+)/);
  let n = 0;
  h.textContent = '';
  for (const p of parts) {
    if (/^\s+$/.test(p)) { h.appendChild(document.createTextNode(p)); continue; }
    if (!p) continue;
    const o = document.createElement('span');
    o.className = 'tr-w';
    const i = document.createElement('span');
    i.textContent = p;
    i.style.animationDelay = n * 55 + 'ms';
    o.appendChild(i);
    h.appendChild(o);
    n++;
  }
}

// ---------- 아이콘 바꾸기: 복사 → 체크 (Amicro morph: scale .5→1 · 600/25) ----------
const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
export function done(btn) {
  if (!btn || !btn.isConnected) return;
  const ic = btn.querySelector('svg');
  if (!ic) return;
  if (!btn._mo) btn._mo = ic.outerHTML;
  clearTimeout(btn._moT);
  ic.outerHTML = CHECK.replace('<svg ', '<svg class="mi-in" ');
  btn.classList.add('mi-done');
  btn._moT = setTimeout(() => {
    if (!btn.isConnected) return;
    const cur = btn.querySelector('svg');
    if (cur && btn._mo) cur.outerHTML = btn._mo.replace('<svg ', '<svg class="mi-in" ');
    btn.classList.remove('mi-done');
  }, 1600);
}

// ---------- 카드 펼치기 (Amicro Card Spreads: ARC 5 · Linear Spread · Cascade Stagger) ----------
// 겹쳐 놓은 카드 5장이 마우스를 올리거나(키보드로 들어오면) 부채꼴로 펴져요. 터치 기기에서는 처음부터 펴 둬요.
const FAN = {
  arc(d, w) { const g = 70 * (w / 128); return { r: d * (30 / 2), x: d * (g / 2), y: Math.abs(d) === 2 ? 10 : Math.abs(d) === 1 ? -2 : -10, s: d === 0 ? 1.05 : 1, z: 3 - Math.abs(d), sp: 'card' }; },
  linear(d, w) { const g = 90 * (w / 128); return { r: 0, x: d * (g / 2), y: 0, s: d === 0 ? 1.05 : 1, z: 3 - Math.abs(d), sp: 'card' }; },
  cascade(d) { return { r: d * 6, x: d * 14, y: d * -28 - 14, s: d === 0 ? 1.05 : 0.98, z: 5 - Math.abs(d), sp: 'casc' }; }
};
const FAN_REST = { cascade: (d) => ({ r: 0, x: 0, y: d * 2, s: 1, z: 5 - Math.abs(d) }) };
function fanSet(box, open) {
  const kind = box.dataset.fan || 'arc';
  const cards = [...box.querySelectorAll(':scope > .mo-card')];
  const mid = (cards.length - 1) / 2;
  const w = cards[0] ? cards[0].offsetWidth || 128 : 128;
  const sp = FAN[kind](0, w).sp;
  box.classList.toggle('open', open);
  cards.forEach((c, i) => {
    const d = i - mid;
    const p = open ? FAN[kind](d, w) : (FAN_REST[kind] ? FAN_REST[kind](d) : { r: 0, x: 0, y: 0, s: 1, z: 3 - Math.abs(d) });
    c.style.zIndex = String(Math.round(10 + p.z * 2));
    c.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.r.toFixed(2)}deg) scale(${p.s})`;
    c.style.transitionTimingFunction = `var(--sp-${sp})`;
    c.style.transitionDuration = `var(--sp-${sp}-d)`;
  });
}
export function fan(box) {
  if (!box || box._fan) return;
  box._fan = true;
  const always = !fine() || calm();
  fanSet(box, always);
  if (always) return;
  box.addEventListener('pointerenter', () => fanSet(box, true));
  box.addEventListener('pointerleave', () => { if (!box.contains(document.activeElement)) fanSet(box, false); });
  box.addEventListener('focusin', () => fanSet(box, true));
  box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget) && !box.matches(':hover')) fanSet(box, false); });
}

// ---------- 커버플로 (Amicro CardCoverFlow: 한 칸 32px · 기울기 38° · 가운데 1.1배 · 200/25) ----------
export function flow(box, onPick) {
  if (!box || box._flow) return;
  box._flow = true;
  const stage = box.querySelector('.mo-flow-stage');
  const cards = [...box.querySelectorAll('.mo-fc')];
  const dots = [...box.querySelectorAll('.mo-dot')];
  const cap = box.querySelector('.mo-flow-cap');
  const st0 = box.dataset.start;
  let at = Math.min(st0 != null && st0 !== '' && Number.isFinite(Number(st0)) ? Number(st0) : Math.floor((cards.length - 1) / 2), cards.length - 1);
  const step = () => (cards[0] ? (cards[0].offsetWidth || 80) * (32 / 80) : 32); // 원본은 80px 카드에 32px
  const set = (i, focus) => {
    at = Math.max(0, Math.min(cards.length - 1, i));
    const s = step();
    cards.forEach((c, k) => {
      const off = k - at, abs = Math.abs(off), act = off === 0;
      c.style.transform = `translateX(${(off * s * 1.6).toFixed(1)}px) translateZ(${act ? 50 : -abs * 50}px) rotateY(${act ? 0 : off < 0 ? 38 : -38}deg) scale(${act ? 1.1 : (1 - abs * 0.08).toFixed(3)})`;
      c.style.opacity = abs > 2 ? '0' : String(1 - abs * 0.25);
      c.style.zIndex = String(100 - abs);
      c.style.pointerEvents = abs > 2 ? 'none' : '';
      c.setAttribute('aria-current', act ? 'true' : 'false');
      c.tabIndex = act ? 0 : -1;
    });
    dots.forEach((d, k) => d.setAttribute('aria-pressed', String(k === at)));
    if (cap) {
      const c = cards[at];
      cap.classList.remove('in');
      void cap.offsetWidth;
      cap.innerHTML = c ? c.dataset.cap || '' : '';
      cap.classList.add('in');
    }
    if (focus && cards[at]) cards[at].focus({ preventScroll: true });
  };
  box.querySelector('.mo-prev')?.addEventListener('click', () => set(at - 1));
  box.querySelector('.mo-next')?.addEventListener('click', () => set(at + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => set(k)));
  cards.forEach((c, k) => c.addEventListener('click', (e) => {
    if (k !== at) { e.preventDefault(); set(k); return; }
    if (onPick) onPick(c, e);
  }));
  stage?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); set(at - 1, true); }
    if (e.key === 'ArrowRight') { e.preventDefault(); set(at + 1, true); }
  });
  // 밀어서 넘기기 (터치 · 펜)
  let sx = null;
  stage?.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sx = e.clientX; }, { passive: true });
  stage?.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) set(at + (dx < 0 ? 1 : -1)); }, { passive: true });
  set(at);
}

// ---------- 초점 흐리기 (Amicro FocusBlur: 하나에 올리면 나머지는 흐리게 4px · 0.4) ----------
export function focusBlur(box) {
  if (!box || box._fb || !fine()) return;
  box._fb = true;
  box.addEventListener('pointerover', (e) => { const it = e.target.closest('[data-fb]'); if (it && box.contains(it)) { box.classList.add('fb-on'); box.querySelectorAll('[data-fb]').forEach((x) => x.classList.toggle('fb-hot', x === it)); } });
  box.addEventListener('pointerleave', () => { box.classList.remove('fb-on'); box.querySelectorAll('.fb-hot').forEach((x) => x.classList.remove('fb-hot')); });
}

// ---------- 시작 ----------
let started = false;
export function startMotion() {
  if (started) return;
  started = true;
  setCurves();
  document.documentElement.classList.add('mo');
  bindRipple();
  bindMagnetic();
  bindTilt();
  bindScroll();
  RM.addEventListener?.('change', () => document.documentElement.classList.toggle('mo-calm', calm()));
  document.documentElement.classList.toggle('mo-calm', calm());
}
