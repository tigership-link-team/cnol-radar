// CNOL RADAR — 1인 맞춤 에이전트 화면
// 에이전트 보고(첫 화면) · 내 채널로 시작하기 · 맞춤 레퍼런스 · 도구(소재 검색·예측·제목/태그·썸네일·댓글 속 소재·채널 모델) · 소재 파도
// app.js가 mountAgent(ctx)로 공용 함수를 넘겨줘요 (순환 import 없이)
import * as M from '/model.js';
import { TT } from '/agent-i18n.js';

let C = null;
const A = { pool: null, poolKey: '', poolAt: 0, topic: null, cm: null, thumbUrl: null };
export function mountAgent(ctx) { C = ctx; }

// ---------- 공용 ----------
const L = () => C.lang;
function tt(k, v) {
  const d = TT[L()] || TT.ko;
  let s = d[k] ?? TT.ko[k];
  if (s == null) return C.t(k, v);
  if (v) for (const [a, b] of Object.entries(v)) s = s.replaceAll('{' + a + '}', String(b));
  return s;
}
const e = (s) => C.esc(s);
const DISCOVERY_UI = {
  ko: { failed: '추천 채널을 불러오지 못했어요. 다시 시도해 주세요.', retry: '다시 불러오기', retrying: '불러오는 중이에요…' },
  en: { failed: 'Recommended channels could not be loaded. Please try again.', retry: 'Try again', retrying: 'Loading…' },
  ja: { failed: 'おすすめチャンネルを読み込めませんでした。もう一度お試しください。', retry: '再読み込み', retrying: '読み込み中です…' }
};
const discoveryRead = (query) => Promise.resolve(query).catch((error) => ({ data: null, error }));
function discoveryFailureHtml() {
  const copy = DISCOVERY_UI[L()] || DISCOVERY_UI.ko;
  return `<div class="dk-banner warn" role="alert"><p style="margin:0 0 10px">${e(copy.failed)}</p><button type="button" class="dk-btn sm line" data-discovery-retry>${e(copy.retry)}</button></div>`;
}
function bindDiscoveryRetry(v) {
  v.querySelectorAll('[data-discovery-retry]').forEach((button) => button.addEventListener('click', () => {
    button.disabled = true;
    button.textContent = (DISCOVERY_UI[L()] || DISCOVERY_UI.ko).retrying;
    // A render re-reads the recommendation cache; it does not collect or discover channels.
    C.render();
  }));
}
const AIC = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  wand: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  dna: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/><path d="M8.5 7h7M8.5 17h7M10 12h4"/>',
  wave: '<path d="M2 12c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"/><path d="M2 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  ab: '<rect x="3" y="5" width="8" height="14" rx="2"/><rect x="13" y="5" width="8" height="14" rx="2"/><path d="M6 13l1.5-4 1.5 4M6.5 12h2M16 9h2a1.5 1.5 0 0 1 0 3h-2v-3zM16 12h2.3a1.5 1.5 0 0 1 0 3H16z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  reply: '<path d="M9 14L4 9l5-5"/><path d="M20 20v-4a7 7 0 0 0-7-7H4"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
const ic = (k, s) => C.svg(AIC[k] || C.IC[k] || '', s);
const watchUrl = (id, kind) => (kind === 'short' ? 'https://www.youtube.com/shorts/' : 'https://www.youtube.com/watch?v=') + encodeURIComponent(id);
const thumbOf = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
const fmtX = (x) => (x == null ? '–' : (x >= 10 ? Math.round(x) : Number(x).toFixed(1)));
const pctTxt = (x) => Math.round((x || 0) * 100) + '%';
const kindNow = () => C.S.kind || 'short';
function chip(k, attrs = '') { return `<button type="button" class="dk-chip" ${attrs}>${e(k)}</button>`; }
async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); C.snack(tt('a_copied')); }
  catch (er) { C.snack(tt('a_copyFail')); }
}
function query() {
  const h = location.hash || '';
  const i = h.indexOf('?');
  return new URLSearchParams(i >= 0 ? h.slice(i + 1) : '');
}
function toolHead(title, sub) {
  return `<div class="dk-head dk-fade"><div><a class="ag-crumb" href="#tools">${ic('reply', 15)}${e(tt('a_tools'))}</a><h1>${e(title)}</h1></div></div>${sub ? `<p class="dk-lead dk-fade">${e(sub)}</p>` : ''}`;
}
function errBox(code) { return `<div class="dk-banner bad">${e(C.errText(code))}</div>`; }
const spinBox = (txt) => `<div class="dk-banner info"><span class="dk-spin"></span> ${e(txt)}</div>`;

// 레퍼런스 영상 모음 (지금 고른 쇼츠/롱폼) — 3분 동안은 다시 안 불러요
async function loadPool(days = 30) {
  const key = kindNow() + '/' + days;
  if (A.pool && A.poolKey === key && Date.now() - A.poolAt < 180e3) return A.pool;
  const [list] = await Promise.all([C.vids({ p_days: days, p_channel: null, p_role: null, p_limit: 1000 }), C.getChans()]);
  C.remember(list);
  A.pool = list; A.poolKey = key; A.poolAt = Date.now();
  return list;
}
export function dropPool() { A.pool = null; }
async function loadDna(pool) {
  await C.getProfile();
  const mine = C.S.profList || [];
  return mine.length ? M.dnaOf(mine, (pool || []).filter((v) => v.role === 'reference')) : null;
}
const mineChan = () => (C.S.chans || []).find((c) => c.role === 'mine') || null;

// ---------- 맞춤 레퍼런스 카드 (내 채널로 시작하기 · 레퍼런스 화면에서 같이 써요) ----------
function matchCard(d, checked) {
  const m = d.match || {};
  const v0 = (m.vids || [])[0] || (d.sample_video_id ? { id: d.sample_video_id, title: d.sample_title, views: d.sample_views } : null);
  const subs = d.subscriber_count == null ? tt('a_subsHidden') : tt('a_subs', { n: C.fmtN(d.subscriber_count) });
  const sx = m.subsX != null ? ' · ' + tt('a_subsX', { x: fmtX(m.subsX) }) : '';
  const why = [...new Set([...(m.common || []), ...(m.kws || [])])].slice(0, 3);
  const kind = m.kind || kindNow();
  return `<label class="mt-card dk-fade" data-id="${e(d.channel_id)}">
    <input type="checkbox" class="mt-ck" value="${e(d.channel_id)}" ${checked ? 'checked' : ''} aria-label="${e(d.title)}">
    <div class="mt-top">${C.avatar(d.thumbnail_url)}<span class="mt-name"><b>${e(d.title)}</b><small>${e(subs + sx)}</small></span>${m.fit != null ? `<span class="mt-fit" title="${e(tt('a_fitTip'))}">${e(tt('a_fitN', { n: m.fit }))}</span>` : ''}</div>
    ${v0 ? `<a class="mt-vid${kind === 'long' ? '' : ' sh'}" href="${watchUrl(v0.id, kind)}" target="_blank" rel="noopener" style="background-image:url('${C.cssUrl(thumbOf(v0.id))}')"><span>${e(C.fmtN(v0.views))}</span></a><div class="mt-vt">${e(v0.title || '')}</div>` : ''}
    <div class="mt-why">${m.featured ? `<span class="dk-tag teal">${e(tt('a_featured'))}</span>` : ''}${why.map((w) => `<span class="dk-tag">#${e(w)}</span>`).join('')}${m.x != null && m.x >= 2 ? `<span class="dk-tag red">${e(tt('a_brk', { x: fmtX(m.x) }))}</span>` : ''}</div>
    <button type="button" class="mt-hide" data-hide="${e(d.channel_id)}" aria-label="${e(tt('a_hide'))}" title="${e(tt('a_hide'))}">${C.svg(C.IC.x, 14)}</button>
  </label>`;
}
function matchGridHtml(items, preN = 8) {
  if (!items.length) return `<div class="dk-empty">${e(tt('a_noMatch'))}</div>`;
  return `<div class="mt-grid">${items.map((d, i) => matchCard(d, i < preN)).join('')}</div>
  <div class="mt-bar"><span id="mtN"></span><button type="button" class="dk-btn line sm" id="mtAll">${e(tt('a_selAll'))}</button><button type="button" class="dk-btn" id="mtAdd">${ic('plus', 17)}<span>${e(tt('a_watchSel'))}</span></button></div>`;
}
function bindMatchGrid(root, onAdded) {
  const upd = () => {
    const n = root.querySelectorAll('.mt-ck:checked').length;
    const el = root.querySelector('#mtN');
    if (el) el.textContent = tt('a_selN', { n });
    const b = root.querySelector('#mtAdd');
    if (b) b.disabled = !n;
  };
  root.querySelectorAll('.mt-ck').forEach((c) => c.addEventListener('change', upd));
  root.querySelector('#mtAll')?.addEventListener('click', () => {
    const cks = [...root.querySelectorAll('.mt-ck')];
    const all = cks.every((c) => c.checked);
    cks.forEach((c) => { c.checked = !all; });
    upd();
  });
  root.querySelectorAll('[data-hide]').forEach((b) => b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const card = b.closest('.mt-card');
    card.classList.add('gone');
    setTimeout(() => { card.remove(); upd(); }, 220);
    const out = await C.act({ action: 'discovery', op: 'dismiss', channel_id: b.dataset.hide });
    if (!out.ok) C.snack(C.errText(out.error));
  }));
  root.querySelector('#mtAdd')?.addEventListener('click', async (ev) => {
    const b = ev.currentTarget;
    const ids = [...root.querySelectorAll('.mt-ck:checked')].map((c) => c.value).slice(0, 30);
    if (!ids.length) return;
    b.disabled = true;
    b.innerHTML = `<span class="dk-spin"></span><span>${e(tt('a_adding', { n: ids.length }))}</span>`;
    const out = await C.act({ action: 'add', inputs: ids, role: 'reference', source: 'discover' });
    if (!out.ok) { b.disabled = false; b.innerHTML = `${ic('plus', 17)}<span>${e(tt('a_watchSel'))}</span>`; C.snack(C.errText(out.error)); return; }
    const ok = (out.results || []).filter((x) => x.ok);
    C.snack(tt('a_added', { n: ok.length, v: C.fmtFull(ok.reduce((a, x) => a + (x.shorts || 0) + (x.longs || 0), 0)) }));
    C.S.chansAt = 0; C.S.profAt = 0; dropPool();
    if (onAdded) onAdded(out);
  });
  upd();
}

// ---------- 첫 화면: 내 채널로 시작하기 ----------
function onboardHtml(hasRefs) {
  return `<section class="ob dk-fade">
    <div class="ob-hd">${C.agAv()}<div><b>${e(tt('a_agentName'))}</b><small>${e(tt('a_obHello'))}</small></div></div>
    <h2>${e(tt('a_obTitle'))}</h2>
    <p class="ob-sub">${e(tt('a_obSub'))}</p>
    <form class="ob-form" id="obForm" novalidate>
      <label class="sr" for="obIn">${e(tt('a_obLabel'))}</label>
      <input class="dk-input" id="obIn" autocomplete="off" spellcheck="false" placeholder="${e(tt('a_obPh'))}">
      <button class="dk-btn" type="submit" id="obBtn">${ic('bolt', 17)}<span>${e(tt('a_obBtn'))}</span></button>
    </form>
    <ol class="ob-steps"><li class="on" data-st="1">${e(tt('a_ob1'))}</li><li data-st="2">${e(tt('a_ob2'))}</li><li data-st="3">${e(tt('a_ob3'))}</li></ol>
    <div class="ob-log" id="obLog" aria-live="polite"></div>
    <p class="ob-alt">${hasRefs ? '' : `<a href="#refs">${e(tt('a_obSkip'))} →</a>`}</p>
  </section>
  <section class="dk-card full" id="obRes" hidden></section>`;
}
function bindOnboard(v) {
  const form = v.querySelector('#obForm');
  if (!form) return;
  const log = v.querySelector('#obLog');
  const step = (n) => v.querySelectorAll('.ob-steps li').forEach((li) => li.classList.toggle('on', Number(li.dataset.st) <= n));
  const line = (html, cls = '') => { const d = document.createElement('div'); d.className = 'ob-line ' + cls; d.innerHTML = html; log.appendChild(d); return d; };
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const raw = v.querySelector('#obIn').value.trim();
    if (!raw) { v.querySelector('#obIn').focus(); return; }
    const btn = v.querySelector('#obBtn');
    btn.disabled = true;
    log.innerHTML = '';
    let l1 = line(`<span class="dk-spin"></span> ${e(tt('a_obReading'))}`);
    const out = await C.act({ action: 'add', inputs: [raw], role: 'mine' });
    const r0 = (out.results || [])[0];
    if (!out.ok || !r0 || !r0.ok) { l1.className = 'ob-line bad'; l1.textContent = C.errText(out.ok ? r0?.error || 'NOT_FOUND' : out.error); btn.disabled = false; return; }
    l1.className = 'ob-line good';
    l1.innerHTML = `${ic('check', 16)} ${e(tt('a_obRead', { c: r0.title, s: C.fmtFull(r0.shorts || 0), l: C.fmtFull(r0.longs || 0) }))}`;
    C.S.chansAt = 0; C.S.profAt = 0; dropPool();
    step(2);
    const l2 = line(`<span class="dk-spin"></span> ${e(tt('a_obMatching'))}`);
    const mt = await C.act({ action: 'match', channel_id: r0.channel_id, lang: L(), kind: (r0.longs || 0) > (r0.shorts || 0) * 1.5 ? 'long' : undefined });
    btn.disabled = false;
    if (!mt.ok) { l2.className = 'ob-line bad'; l2.innerHTML = `${e(C.errText(mt.error))} · <a href="#refs">${e(tt('a_obLater'))}</a>`; return; }
    l2.className = 'ob-line good';
    l2.innerHTML = `${ic('check', 16)} ${e(tt('a_obDna'))} ${(mt.keywords || []).map((k) => `<span class="dk-tag">#${e(k)}</span>`).join(' ')} → ${e(tt('a_obFound', { n: (mt.items || []).length }))}`;
    step(3);
    const res = v.querySelector('#obRes');
    res.hidden = false;
    res.innerHTML = `<div class="dk-ch"><h2>${e(tt('a_obPick'))}</h2><span class="dk-sub">${e(tt('a_obPickSub'))}</span></div>${matchGridHtml(mt.items || [])}`;
    bindMatchGrid(res, () => { location.hash = '#home'; C.render(); });
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


// ---------- 에이전트에게 시키기 (말로 시키면 맞는 도구로 데려가요) ----------
const enc = encodeURIComponent;
const VID_IN = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const CH_IN = /(youtube\.com\/(?:@[^\s/?]+|channel\/UC[\w-]{22}|c\/[^\s/?]+)|(?:^|\s)@[\w.\-]{3,30}(?:\s|$))/;
const FILLER = /^(소재|소재로|어때|어때요|어떨까|어떨까요|해볼까|해볼까요|분석|분석해|분석해줘|찾아줘|알려줘|검색|검색해줘|좀|해줘|요즘|how|about|is|ideas?|for|search|find|について|どう|どう？|ネタ|は|を)$/i;
export function parseCmd(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const v = s.match(VID_IN);
  if (v) return /댓글|comment|コメント/i.test(s) ? { to: '#tool/comments?v=' + v[1], say: 'c_cm' } : { to: '#tool/title?v=' + v[1], say: 'c_ver' };
  const ch = s.match(CH_IN);
  if (ch) return { add: ch[1].trim(), say: 'c_add' };
  const q = s.match(/[‘'"“「『](.+?)[’'"”」』]/);
  if (q && /예측|몇\s?배|어때|대결|forecast|predict|vs|予測|どう/i.test(s)) return { to: '#tool/predict?t=' + enc(q[1]), say: 'c_pred' };
  if (/레퍼런스|비슷한\s?채널|채널\s?(더\s?)?찾|reference|similar channel|リファレンス|似たチャンネル/i.test(s)) return { to: '#refs', say: 'c_refs' };
  if (/댓글|comment|コメント/i.test(s)) return { to: '#tool/comments', say: 'c_cm' };
  if (/파도|요즘\s?뜨|트렌드|trend|wave|波|流行/i.test(s)) return { to: '#wave', say: 'c_wave' };
  if (/썸네일|thumbnail|サムネ/i.test(s)) return { to: '#tool/thumb', say: 'c_thumb' };
  if (/모델|dna|내\s?채널\s?분석|my channel|チャンネル分析/i.test(s)) return { to: '#tool/dna', say: 'c_dna' };
  const words = s.replace(/[?？!！.。,、]/g, ' ').split(/\s+/).map((w) => (w.length >= 3 ? w.replace(/(으로|로|은|는|을|를|에서)$/, '') : w)).filter((w) => w && !FILLER.test(w));
  if (/제목|태그|title|tag|タイトル|タグ/i.test(s)) {
    const k = words.filter((w) => !/^(제목|태그|만들어줘|만들어|짜줘|title|titles|tags?|タイトル|タグ|作って)$/i.test(w)).join(' ');
    return { to: '#tool/title' + (k ? '?q=' + enc(k) : ''), say: 'c_title', k };
  }
  if (q) return { to: '#tool/predict?t=' + enc(q[1]), say: 'c_pred' };
  const k = words.join(' ').trim();
  return k ? { to: '#tool/topic?q=' + enc(k), say: 'c_topic', k } : null;
}
function cmdHtml() {
  return `<form class="ag-ask dk-fade" id="askForm" novalidate>${C.agAv(true)}<input class="dk-input" id="askIn" autocomplete="off" placeholder="${e(tt('c_ph'))}" aria-label="${e(tt('c_label'))}"><button class="dk-btn" id="askBtn">${e(tt('c_go'))}</button>
    <div class="ag-ask-ex">${['c_ex1', 'c_ex2', 'c_ex3', 'c_ex4'].map((k) => `<button type="button" class="dk-chip" data-ex="${e(tt(k))}">${e(tt(k))}</button>`).join('')}</div><div class="ag-ask-say" id="askSay" aria-live="polite"></div></form>`;
}
function bindCmd(v) {
  const form = v.querySelector('#askForm');
  if (!form) return;
  const say = v.querySelector('#askSay');
  const go = async (txt) => {
    const c = parseCmd(txt);
    if (!c) { say.textContent = tt('c_unknown'); return; }
    if (c.add) {
      say.innerHTML = `<span class="dk-spin"></span> ${e(tt('c_add'))}`;
      const out = await C.act({ action: 'add', inputs: [c.add], role: 'reference' });
      const r0 = (out.results || [])[0];
      say.textContent = out.ok && r0?.ok ? tt('a_added', { n: 1, v: C.fmtFull((r0.shorts || 0) + (r0.longs || 0)) }) : C.errText(out.ok ? r0?.error || 'NOT_FOUND' : out.error);
      if (out.ok && r0?.ok) { C.S.chansAt = 0; dropPool(); }
      return;
    }
    say.textContent = tt(c.say, { k: c.k || '' });
    setTimeout(() => { location.hash = c.to; }, 420);
  };
  form.addEventListener('submit', (ev) => { ev.preventDefault(); go(v.querySelector('#askIn').value); });
  form.querySelectorAll('[data-ex]').forEach((b) => b.addEventListener('click', () => { v.querySelector('#askIn').value = b.dataset.ex; go(b.dataset.ex); }));
}

// ---------- 이번 주 소재 3개 (터진 레퍼런스 · 소재 파도 · 내 핵심 소재 → 예측 높은 순) ----------
function weekPlan(pool, dna, prof) {
  const refs = pool.filter((x) => x.role === 'reference');
  if (refs.length < 10) return [];
  const idf = M.idfOf(refs);
  const stats = M.fmtStats(refs);
  const cands = [];
  for (const s of C.pickList(refs.filter((x) => (x.age_h || 0) <= 7 * 24), 'all', prof).slice(0, 6)) {
    const own = M.tokens(s.title);
    const myK = dna ? (dna.kws.find((x) => !own.includes(x.k)) || {}).k : null;
    const swapped = myK && !own.some((t) => dna.words.has(t)) ? M.swapTopic(s.title, myK) : null;
    const k = swapped ? myK : own[0];
    const idea = swapped ? { title: swapped } : k && M.titleIdeas(k, refs, dna, L(), { stats, max: 2 })[0];
    if (idea) cands.push({ title: idea.title, k: k + ':' + s.id, src: 'ref', s });
  }
  for (const w of M.waves(pool, { max: 4 })) {
    const idea = M.titleIdeas(w.k, refs, dna, L(), { stats, max: 2 })[1] || M.titleIdeas(w.k, refs, dna, L(), { stats, max: 2 })[0];
    if (idea) cands.push({ title: idea.title, k: w.k, src: 'wave', w });
  }
  if (dna) for (const x of dna.kws.slice(0, 3)) {
    const idea = M.titleIdeas(x.k, refs, dna, L(), { stats, max: 3 })[2];
    if (idea) cands.push({ title: idea.title, k: x.k, src: 'dna' });
  }
  const W = { hi: 1, mid: 0.85, lo: 0.7, none: 0 };
  const scored = cands.map((c) => ({ ...c, p: M.predict(c.title, refs, dna, { idf, k: 10 }) })).map((c) => ({ ...c, sc: c.p.conf === 'none' ? 0.5 : c.p.mult * W[c.p.conf] }));
  const seen = new Set(), out = [];
  for (const c of scored.sort((a, b) => b.sc - a.sc)) {
    const base = String(c.k).split(':')[0];
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(c);
    if (out.length >= 3) break;
  }
  return out;
}
function planHtml(plan) {
  return `<ol class="pl">${plan.map((c, i) => `<li class="pl-row"><span class="pl-n">${i + 1}</span><span class="pl-b"><b>${e(c.title)}</b><small>${e(c.src === 'ref' ? tt('p_fromRef', { t: c.s.title, c: c.s.channel_title }) : c.src === 'wave' ? tt('p_fromWave', { k: c.k, n: c.w.chans }) : tt('p_fromDna', { k: c.k }))}</small></span>
    ${c.p.conf !== 'none' ? `<span class="dk-tag">${e(tt('a_predX', { x: fmtX(c.p.mult) }))}</span>` : ''}<span class="pl-act"><button type="button" class="dk-mini" data-pl="${i}">${e(C.t('toBoard'))}</button><a class="dk-mini" href="#tool/predict?t=${enc(c.title)}" aria-label="${e(tt('t_predict'))}">${ic('target', 13)}</a></span></li>`).join('')}</ol>
    <button type="button" class="dk-btn sm" id="plAll">${ic('plus', 15)}<span>${e(tt('p_all'))}</span></button>`;
}
function bindPlan(v, plan) {
  const add = async (c) => {
    const o = await C.act({ action: 'idea', op: 'add', title: c.title.slice(0, 200), source_video_id: c.src === 'ref' ? c.s.id : null, note: c.src === 'ref' ? tt('p_fromRef', { t: c.s.title, c: c.s.channel_title }) : c.src === 'wave' ? tt('p_fromWave', { k: c.k, n: c.w.chans }) : tt('p_fromDna', { k: c.k }) });
    return o.ok;
  };
  v.querySelectorAll('[data-pl]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    if (await add(plan[Number(b.dataset.pl)])) { b.textContent = C.t('inBoard'); C.snack(C.t('added')); } else b.disabled = false;
  }));
  v.querySelector('#plAll')?.addEventListener('click', async (ev) => {
    const b = ev.currentTarget;
    b.disabled = true;
    let n = 0;
    for (const c of plan) if (await add(c)) n++;
    v.querySelectorAll('[data-pl]').forEach((x) => { x.disabled = true; x.textContent = C.t('inBoard'); });
    C.snack(tt('p_added', { n }));
  });
}

// ---------- 에이전트 보고 (첫 화면) ----------
function bigPick(s, fit) {
  const inBoard = C.S.board.has(s.id);
  return `<article class="bp dk-fade">
    <a class="bp-th${s.kind === 'long' ? ' wide' : ''}" href="${C.ytShort(s.id)}" target="_blank" rel="noopener" data-short="${e(s.id)}" style="background-image:url('${C.cssUrl(C.vthumb(s.thumb))}')" aria-label="${e(s.title)}"><span class="v">${e(C.fmtN(s.views))}</span></a>
    <div class="bp-b">
      <a class="bp-t" href="${C.ytShort(s.id)}" target="_blank" rel="noopener" data-short="${e(s.id)}">${e(s.title)}</a>
      <span class="bp-m">${e(s.channel_title)} · ${e(C.ageTxt(s.age_h))}</span>
      <div class="bp-tags">${C.ratioTag(s.ratio)}${fit ? `<span class="dk-fit${fit.score < 50 ? ' low' : ''}">${e(C.t('fit', { n: fit.score }))}</span>` : ''}</div>
      <div class="bp-act"><button type="button" class="dk-btn sm" data-board="${e(s.id)}" ${inBoard ? 'disabled' : ''}>${e(C.t(inBoard ? 'inBoard' : 'toBoard'))}</button><a class="dk-btn sm line" href="#tool/title?v=${encodeURIComponent(s.id)}">${ic('wand', 15)}${e(tt('a_myVer'))}</a><a class="dk-btn sm line" href="#tool/comments?v=${encodeURIComponent(s.id)}">${ic('chat', 15)}${e(tt('a_cmt'))}</a></div>
    </div>
  </article>`;
}
export async function vHome(v, r, alive) {
  C.loading(v, C.t('home'), '');
  const since = new Date(Date.now() - 36 * 3600e3).toISOString();
  const [ov, , al, nd] = await Promise.all([C.rpc('radar_overview'), C.getChans(), C.sb.from('radar_alerts').select('*').order('created_at', { ascending: false }).limit(40),
    discoveryRead(C.sb.from('radar_discoveries').select('channel_id,title,thumbnail_url,found_at,match').eq('status', 'new').in('via', ['match', 'featured']).gte('found_at', since).order('score', { ascending: false }).limit(6))]);
  if (!alive()) return;
  C.S.unread = ov.unread || 0;
  C.renderNav();
  const total = ov.channels.total;
  const mine = mineChan();
  const nRef = ov.channels.reference ?? Math.max(total - 1, 0);
  const hd = `<section class="ag-hd dk-fade">${C.agAv()}<div class="who"><b>${e(tt('a_agentName'))}</b><small><i></i>${e(total ? (mine ? tt('a_agentFor', { c: mine.title, n: C.fmtFull(nRef) }) : C.t('agentLive', { n: C.fmtFull(total) })) : C.t('agentIdle'))}</small></div><span class="nx">${C.svg(C.IC.clock, 15)}${e(C.t('agentNext', { t: C.nextRunTxt() }))}</span></section>`;
  // 내 채널이 없으면 → 내 채널로 시작하기
  if (!mine) {
    v.innerHTML = C.head(C.t('home'), '') + hd + (total ? `<div class="dk-banner info">${e(tt('a_noMineYet'))}</div>` : '') + onboardHtml(total > 0);
    bindOnboard(v);
    return;
  }
  const pool = await loadPool(21);
  const prof = await C.getProfile().catch(() => null);
  if (!alive()) return;
  const refs = pool.filter((x) => x.role === 'reference');
  const now0 = Date.now();
  const firstH = ov.first_at ? Date.parse(ov.first_at) : null;
  const hv = ov.hourly.map((x) => ({ v: x.v, h: x.h, pre: !x.v && (!firstH || Date.parse(x.h) + 3600e3 <= firstH) }));
  const msgs = [];
  // 1) 요약 + 48시간 — 유튜브 스튜디오 '실시간' 카드처럼: 한 색 막대 + 인기 채널
  const topCh = (ov.ranking || []).filter((c) => c.v48 > 0).slice(0, 3);
  const rtTop = topCh.length >= 2 ? `<div class="ag-rt-top"><p>${e(C.t('rtTopCh'))}</p>${topCh.map((c) => `<a class="r" href="#ch/${e(c.id)}">${C.avatar(c.thumb)}<span class="n">${e(c.title)}</span><b>${e(C.fmtFull(c.v48))}</b></a>`).join('')}</div>` : '';
  msgs.push(C.agMsg(`${C.greet()}${L() === 'ja' ? '' : ' '}${tt('a_sum', { r: C.fmtFull(nRef), n: C.fmtFull(refs.length), v: C.fmtFull(ov.views48) })}`,
    `<div class="ag-card yt-rtc"><div class="ag-48h"><div><div class="rt-t">${e(C.t('rtTitle'))} <span class="rt-live"><i></i>${e(C.t('rtLive'))}</span></div><div class="dk-sub">${e(C.t('chCount', { n: total }))} · ${e(C.t('rtSum'))}</div></div><a class="ag-link" href="#overview">${e(C.t('toOverview'))} →</a></div><div><div class="dk-sub" style="font-weight:600">${e(C.t('ytRtViews'))}</div><div class="dk-mid">${e(C.fmtFull(ov.views48))}</div></div>${C.barsHtml('agb', hv, C.t('live48all'), 72)}<div class="dk-axis"><span>${e(C.t('ago48'))}</span><span>${e(C.t('now'))}</span></div>${rtTop}</div>`));
  // 2) 오늘의 소재 — 큰 썸네일로
  const picks = C.pickList(refs.filter((x) => (x.age_h || 0) <= 7 * 24), 'all', prof).slice(0, 3);
  if (picks.length) msgs.push(C.agMsg(tt('a_hotMsg'), `<div class="bp-list">${picks.map((s) => bigPick(s, s._fit)).join('')}</div><a class="ag-link" href="#picks">${e(C.t('toPicks'))} →</a>`));
  else msgs.push(C.agMsg(C.t('msgHotNone')));
  // 2.5) 이번 주 소재 3개
  const dna = await loadDna(pool);
  if (!alive()) return;
  const plan = weekPlan(pool, dna, prof);
  if (plan.length) msgs.push(C.agMsg(tt('p_msg', { n: plan.length }), planHtml(plan)));
  // 3) 이거 해볼래? (소재만)
  const hidden = C.tryHidden();
  const tryList = C.trySuggest(C.S.profList || [], refs, prof).filter((x) => !hidden.has(x.id)).slice(0, 1);
  if (tryList.length) msgs.push(C.agMsg(C.t('msgTry'), `<div class="ty-grid home">${tryList.map((sg, i) => C.tyCardHtml(sg, i, 'th', '')).join('')}</div><a class="ag-link" href="#try">${e(C.t('toTry'))} →</a>`));
  // 4) 소재 파도
  const wv = M.waves(pool, { max: 4 });
  if (wv.length) msgs.push(C.agMsg(tt('a_waveMsg', { k: wv[0].k, n: wv[0].chans }), `<div class="wv-mini">${wv.map((w) => `<a class="wv-chip" href="#tool/topic?q=${encodeURIComponent(w.k)}"><b>#${e(w.k)}</b><span>${e(tt('a_waveMeta', { c: w.chans, x: fmtX(w.x) }))}</span>${w.isNew ? `<em>${e(tt('a_new'))}</em>` : ''}</a>`).join('')}</div><a class="ag-link" href="#wave">${e(tt('a_toWave'))} →</a>`));
  // 4.5) 밤사이 새로 찾은 레퍼런스 · 오래 쉬는 레퍼런스 정리
  if (nd.error) msgs.push(discoveryFailureHtml());
  const fresh = (nd.data || []).filter((d) => !(C.S.chans || []).some((c) => c.id === d.channel_id));
  if (fresh.length) msgs.push(C.agMsg(tt('n_msg', { n: fresh.length }), `<div class="nd-row">${fresh.slice(0, 5).map((d) => `<span class="nd">${C.avatar(d.thumbnail_url)}<b>${e(d.title)}</b>${d.match?.fit != null ? `<em>${e(tt('a_fitN', { n: d.match.fit }))}</em>` : ''}</span>`).join('')}</div><a class="ag-link" href="#refs">${e(tt('n_go'))} →</a>`));
  const idle = (C.S.chans || []).filter((c) => c.role === 'reference' && ((c.last_upload && now0 - Date.parse(c.last_upload) > 30 * 864e5) || c.error));
  if (idle.length) msgs.push(C.agMsg(tt('i_msg', { n: idle.length }), `<div class="nd-row">${idle.slice(0, 5).map((c) => `<a class="nd" href="#ch/${e(c.id)}">${C.avatar(c.thumb)}<b>${e(c.title)}</b><em>${e(c.error ? tt('i_err') : tt('i_days', { d: Math.floor((now0 - Date.parse(c.last_upload)) / 864e5) }))}</em></a>`).join('')}</div><a class="ag-link" href="#refs">${e(tt('i_go'))} →</a>`));
  // 5) 이슈 (있을 때만)
  const now = Date.now();
  const issue = (a) => ['gap', 'age', 'region', 'drop'].includes(a.kind) || (a.kind === 'missing' && a.data?.role === 'mine');
  const issues = (al.data || []).filter((a) => issue(a) && !a.read_at && now - Date.parse(a.created_at) <= 72 * 3600e3);
  if (issues.length) msgs.push(C.agMsg(C.t('msgIssue', { n: issues.length }), `<div class="ag-alerts">${issues.slice(0, 3).map(C.alertHtml).join('')}</div><a class="ag-link" href="#alerts">${e(C.t('toAlerts'))} →</a>`));
  const quick = `<nav class="ag-quick dk-fade" aria-label="${e(tt('a_tools'))}">
    <a href="#refs">${ic('plus', 16)}${e(tt('a_qRefs'))}</a><a href="#tool/topic">${ic('search', 16)}${e(tt('t_topic'))}</a><a href="#tool/predict">${ic('target', 16)}${e(tt('t_predict'))}</a><a href="#tool/comments">${ic('chat', 16)}${e(tt('t_comments'))}</a><a href="#tools">${ic('layers', 16)}${e(tt('a_allTools'))}</a></nav>`;
  v.innerHTML = C.head(C.t('home'), '') + hd + cmdHtml() + `<div class="ag-feed">${msgs.join('')}</div>` + quick;
  bindDiscoveryRetry(v);
  bindCmd(v);
  bindPlan(v, plan);
  C.bindBars(v, 'agb', hv, (x) => `${C.hourLabel(x.h)}\n${x.pre ? C.t('preCollect') : C.fmtFull(x.v) + C.t('unitViews')}`);
  C.bindTry(v, tryList, '', () => C.render());
  C.bindBoardButtons(v, picks);
  C.bindAlertButtons(v);
}

// ---------- 레퍼런스: 내 채널 · 맞춤 레퍼런스 · 링크로 넣기 ----------
function myChanCard(mc, dna) {
  if (!mc) return `<section class="dk-card f1 my-ch dk-fade"><div class="dk-ch"><h2>${e(tt('a_myCh'))}</h2></div>
    <p class="dk-sub" style="margin:0">${e(tt('a_myChNone'))}</p>
    <form class="ob-form sm" id="mineForm" novalidate><input class="dk-input" id="mineIn" autocomplete="off" spellcheck="false" placeholder="${e(tt('a_obPh'))}"><button class="dk-btn" id="mineBtn">${e(tt('a_obBtn'))}</button></form>
    <div id="mineMsg" aria-live="polite"></div></section>`;
  const kws = dna ? dna.kws.slice(0, 8) : [];
  return `<section class="dk-card f1 my-ch dk-fade">
    <div class="my-top">${C.avatar(mc.thumb || mc.thumbnail_url)}<span class="txt"><b>${e(mc.title)}</b><small>${e((mc.subs ?? mc.subscriber_count) == null ? tt('a_subsHidden') : tt('a_subs', { n: C.fmtN(mc.subs ?? mc.subscriber_count) }))}</small></span><a class="dk-btn sm line" href="#ch/${e(mc.id)}">${e(tt('a_open'))}</a></div>
    <div class="dk-sub" style="font-weight:700">${e(tt('a_dnaTitle'))}</div>
    <div class="dk-chips">${kws.length ? kws.map((k) => `<span class="dna-chip" style="--w:${Math.min(1, k.w * 6).toFixed(2)}">#${e(k.k)}<em>${e(tt('a_xShort', { x: fmtX(k.x) }))}</em></span>`).join('') : `<span class="dk-sub">${e(tt('a_dnaWait'))}</span>`}</div>
    ${dna ? `<div class="my-stats"><div><span>${e(tt('a_base'))}</span><b>${e(C.fmtN(dna.base))}</b></div><div><span>${e(tt('a_hit'))}</span><b>${e(pctTxt(dna.hit))}</b></div><div><span>${e(tt('a_gap'))}</span><b>${e(dna.gap ? tt('a_xShort', { x: fmtX(dna.gap) }) : '–')}</b></div></div>` : ''}
    <a class="ag-link" href="#tool/dna">${e(tt('a_toDna'))} →</a>
  </section>`;
}
function addLinkCard() {
  return `<form class="dk-card f1 dk-fade" id="addForm2" novalidate>
    <div class="dk-ch"><h2>${e(tt('a_addLink'))}</h2></div>
    <p class="dk-sub" style="margin:-6px 0 0">${e(tt('a_addLinkSub'))}</p>
    <textarea class="dk-textarea" id="addIn2" spellcheck="false" placeholder="https://www.youtube.com/@channel&#10;@handle"></textarea>
    <button class="dk-btn" type="submit" id="addBtn2">${ic('plus', 17)}<span>${e(tt('a_addBtn'))}</span></button>
    <div id="addMsg2" aria-live="polite"></div>
  </form>`;
}
export async function vRefs(v, r, alive) {
  C.loading(v, tt('tab_refs'), '');
  const chans = await C.getChans();
  const mc = (chans || []).find((c) => c.role === 'mine') || null;
  const [pool, disc] = await Promise.all([loadPool(30), discoveryRead(C.sb.from('radar_discoveries').select('*').eq('status', 'new').in('via', ['match', 'featured']).order('score', { ascending: false }).limit(60))]);
  const dna = mc ? await loadDna(pool) : null;
  if (!alive()) return;
  const items = (disc.data || []).filter((d) => !(chans || []).some((c) => c.id === d.channel_id))
    .sort((a, b) => ((b.match && b.match.fit) || 0) - ((a.match && a.match.fit) || 0));
  const kws = A.kwEdit || (items[0]?.match?.kws?.length ? [...new Set(items.flatMap((d) => d.match?.kws || []))].slice(0, 3) : (dna ? dna.kws.slice(0, 3).map((k) => k.k) : []));
  A.kwEdit = kws;
  v.innerHTML = C.head(tt('tab_refs'), e(tt('a_refsLead'))) + `
  <div class="dk-row">${myChanCard(mc, dna)}${addLinkCard()}</div>
  <section class="dk-card full dk-fade" id="mtBox">
    <div class="dk-ch"><h2>${e(tt('a_mtTitle'))}${items.length ? ' · ' + items.length : ''}</h2><span class="dk-sub">${e(mc ? tt('a_mtSub', { c: mc.title }) : tt('a_mtSubNone'))}</span></div>
    <div class="kw-ed" id="kwEd">${kws.map((k, i) => `<span class="kw">#${e(k)}<button type="button" data-kx="${i}" aria-label="${e(tt('a_remove'))}">${C.svg(C.IC.x, 12)}</button></span>`).join('')}
      <input class="dk-input sm" id="kwIn" maxlength="30" placeholder="${e(tt('a_kwPh'))}" ${kws.length >= 3 ? 'disabled' : ''}>
      <button type="button" class="dk-btn" id="mtRun" ${mc ? '' : 'disabled'}>${ic('search', 16)}<span>${e(items.length ? tt('a_mtAgain') : tt('a_mtRun'))}</span></button></div>
    <span class="dk-sub">${e(tt('a_mtCost'))}</span>
    <div id="mtMsg" aria-live="polite"></div>
    <div id="mtList">${disc.error ? discoveryFailureHtml() : mc ? matchGridHtml(items, 0) : `<div class="dk-empty">${e(tt('a_mtNeedMine'))}</div>`}</div>
  </section>`;
  bindDiscoveryRetry(v);
  const reload = () => { A.kwEdit = null; C.render(); };
  bindMatchGrid(v.querySelector('#mtList'), reload);
  // 키워드 고치기
  v.querySelectorAll('[data-kx]').forEach((b) => b.addEventListener('click', () => { A.kwEdit = kws.filter((_, i) => i !== Number(b.dataset.kx)); C.render(); }));
  v.querySelector('#kwIn')?.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    const k = ev.currentTarget.value.trim().replace(/^#/, '');
    if (k && !kws.includes(k) && kws.length < 3) { A.kwEdit = [...kws, k]; C.render(); }
  });
  v.querySelector('#mtRun')?.addEventListener('click', async (ev) => {
    const b = ev.currentTarget, msg = v.querySelector('#mtMsg');
    const typed = v.querySelector('#kwIn')?.value.trim().replace(/^#/, '');
    const list = [...kws, ...(typed && !kws.includes(typed) ? [typed] : [])].slice(0, 3);
    b.disabled = true;
    msg.innerHTML = spinBox(tt('a_obMatching'));
    const out = await C.act({ action: 'match', keywords: list, lang: L(), kind: kindNow() });
    b.disabled = false;
    if (!out.ok) { msg.innerHTML = errBox(out.error); return; }
    A.kwEdit = out.keywords || list;
    msg.innerHTML = `<div class="dk-banner good">${e(tt('a_obFound', { n: (out.items || []).length }))} · ${(out.keywords || []).map((k) => '#' + e(k)).join(' ')}</div>`;
    const box = v.querySelector('#mtList');
    box.innerHTML = matchGridHtml(out.items || [], 0);
    bindMatchGrid(box, reload);
  });
  // 내 채널 넣기 (없을 때)
  v.querySelector('#mineForm')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const raw = v.querySelector('#mineIn').value.trim();
    if (!raw) return;
    const b = v.querySelector('#mineBtn'), msg = v.querySelector('#mineMsg');
    b.disabled = true;
    msg.innerHTML = spinBox(tt('a_obReading'));
    const out = await C.act({ action: 'add', inputs: [raw], role: 'mine' });
    const r0 = (out.results || [])[0];
    if (!out.ok || !r0?.ok) { b.disabled = false; msg.innerHTML = errBox(out.ok ? r0?.error || 'NOT_FOUND' : out.error); return; }
    msg.innerHTML = spinBox(tt('a_obMatching'));
    C.S.chansAt = 0; C.S.profAt = 0; dropPool();
    const mt = await C.act({ action: 'match', channel_id: r0.channel_id, lang: L() });
    if (!mt.ok) C.snack(C.errText(mt.error));
    A.kwEdit = null;
    C.render();
  });
  // 링크로 직접 넣기
  v.querySelector('#addForm2')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const inputs = v.querySelector('#addIn2').value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    const msg = v.querySelector('#addMsg2');
    if (!inputs.length) { msg.innerHTML = `<div class="dk-banner warn">${e(C.t('err_EMPTY'))}</div>`; return; }
    const b = v.querySelector('#addBtn2');
    b.disabled = true;
    msg.innerHTML = spinBox(C.t('collecting'));
    const out = await C.act({ action: 'add', inputs, role: 'reference' });
    b.disabled = false;
    if (!out.ok) { msg.innerHTML = errBox(out.error); return; }
    const ok = (out.results || []).filter((x) => x.ok), bad = (out.results || []).filter((x) => !x.ok);
    msg.innerHTML = `${ok.length ? `<div class="dk-banner good">${e(tt('a_added', { n: ok.length, v: C.fmtFull(ok.reduce((a, x) => a + (x.shorts || 0) + (x.longs || 0), 0)) }))}</div>` : ''}${bad.map((x) => `<div class="dk-banner bad">${e(x.input)} · ${e(C.errText(x.error))}</div>`).join('')}`;
    if (ok.length) { v.querySelector('#addIn2').value = ''; C.S.chansAt = 0; dropPool(); }
  });
}

// ---------- 소재 파도 ----------
export async function vWave(v, r, alive) {
  C.loading(v, C.t('tab_wave'), e(tt('a_waveLead')));
  const pool = await loadPool(21);
  if (!alive()) return;
  const wv = M.waves(pool, { max: 10 });
  const body = wv.length ? `<div class="wv-grid">${wv.map((w) => `<article class="wv dk-fade">
      <div class="wv-hd"><b>#${e(w.k)}</b>${w.isNew ? `<em>${e(tt('a_new'))}</em>` : ''}<span>${e(tt('a_waveMeta2', { c: w.chans, n: w.n, x: fmtX(w.x) }))}</span></div>
      <div class="wv-th">${w.vids.map((s) => `<a class="dk-thumb${s.kind === 'long' ? ' wide' : ''}" href="${C.ytShort(s.id)}" target="_blank" rel="noopener" data-short="${e(s.id)}" style="background-image:url('${C.cssUrl(C.vthumb(s.thumb))}')" title="${e(s.title)} · ${e(s.channel_title)}"><span class="v">${e(tt('a_xShort', { x: fmtX(s.ratio) }))}</span></a>`).join('')}</div>
      <div class="wv-act"><a class="dk-btn sm" href="#tool/title?q=${encodeURIComponent(w.k)}">${ic('wand', 15)}${e(tt('a_makeTitle'))}</a><a class="dk-btn sm line" href="#tool/topic?q=${encodeURIComponent(w.k)}">${ic('search', 15)}${e(tt('t_topic'))}</a></div>
    </article>`).join('')}</div>` : `<div class="dk-empty">${e(tt('a_waveNone'))}</div>`;
  v.innerHTML = C.head(C.t('tab_wave'), e(tt('a_waveLead'))) + `<section class="dk-card full dk-fade">${body}</section>`;
}

// ---------- 도구 모음 ----------
const TOOLS = [
  { g: 'find', items: [['topic', 'search'], ['comments', 'chat'], ['wave', 'wave', '#wave'], ['refs', 'plus', '#refs']] },
  { g: 'make', items: [['predict', 'target'], ['title', 'wand']] },
  { g: 'ana', items: [['dna', 'dna'], ['overview', 'insights', '#overview'], ['insights', 'bolt', '#insights'], ['ranking', 'ranking', '#ranking']] },
  { g: 'soon', items: [['ab', 'ab'], ['bulk', 'layers'], ['reply', 'reply'], ['ret', 'eye']] }
];
export async function vTools(v) {
  v.innerHTML = C.head(tt('a_tools'), e(tt('a_toolsLead'))) + TOOLS.map((grp) => `<section class="tl-sec dk-fade"><h2>${e(tt('tg_' + grp.g))}</h2><div class="tl-grid">${grp.items.map(([k, icn, href]) => grp.g === 'soon'
    ? `<div class="tl-card soon"><span class="tl-ic">${ic(icn, 20)}</span><b>${e(tt('t_' + k))}</b><p>${e(tt('td_' + k))}</p><span class="tl-lock">${C.svg(C.IC.lock, 13)}${e(tt('a_soon'))}</span></div>`
    : `<a class="tl-card" href="${href || '#tool/' + k}"><span class="tl-ic">${ic(icn, 20)}</span><b>${e(tt('t_' + k))}</b><p>${e(tt('td_' + k))}</p></a>`).join('')}</div></section>`).join('');
}
export async function vTool(v, r, alive) {
  const fn = { topic: tTopic, predict: tPredict, title: tTitle, thumb: tThumb, comments: tComments, dna: tDna }[r.id];
  if (!fn) { location.hash = '#tools'; return; }
  document.title = tt('t_' + r.id) + ' · CNOL RADAR';
  return fn(v, r, alive);
}

// --- 소재 검색 ---
const gauge = (n, label, tone) => `<div class="tp-g ${tone || ''}"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" class="bg"/><circle cx="18" cy="18" r="15.5" class="fg" style="stroke-dasharray:${(Math.max(0, Math.min(100, n)) * 0.974).toFixed(1)} 100"/></svg><b>${n}</b><span>${e(label)}</span></div>`;
function topicHtml(d) {
  const sc = d.scores || {};
  const oppTone = sc.opp >= 60 ? 'good' : sc.opp >= 40 ? 'mid' : 'bad';
  const kind = d.kind || kindNow();
  const mine = (d.mine || [])[0];
  const vidCard = (x, small) => `<article class="tp-v dk-fade"><a class="tp-th${kind === 'long' ? '' : ' sh'}" href="${watchUrl(x.id, kind)}" target="_blank" rel="noopener" style="background-image:url('${C.cssUrl(thumbOf(x.id))}')"><span>${e(C.fmtN(x.views))}</span></a>
    <div class="tp-b"><a class="tp-t" href="${watchUrl(x.id, kind)}" target="_blank" rel="noopener">${e(x.title)}</a><span class="tp-m">${e(x.chTitle)} · ${e(x.subs == null ? tt('a_subsHidden') : tt('a_subs', { n: C.fmtN(x.subs) }))}</span>
    <div class="tp-tags"><span class="dk-tag gray">${e(tt('a_perDay', { n: C.fmtN(x.vpd) }))}</span>${x.x != null && x.x >= 2 ? `<span class="dk-tag ${small ? 'red' : 'amber'}">${e(tt('a_brk', { x: fmtX(x.x) }))}</span>` : ''}<button type="button" class="dk-mini" data-vb="${e(x.id)}">${e(C.t('toBoard'))}</button></div></div></article>`;
  return `<div class="tp-score dk-fade">${gauge(sc.opp || 0, tt('a_opp'), oppTone)}
      <div class="tp-kpis"><div><span>${e(tt('a_demand'))}</span><b>${e(tt('a_perDay', { n: C.fmtN(d.demand) }))}</b><small>${e(tt('a_demandSub'))}</small></div>
      <div><span>${e(tt('a_comp'))}</span><b>${e(tt('a_subs', { n: C.fmtN(d.comp) }))}</b><small>${e(tt('a_compSub', { p: d.big }))}</small></div>
      <div><span>${e(tt('a_fresh'))}</span><b>${e(d.fresh + '%')}</b><small>${e(tt('a_freshSub'))}</small></div>
      <div><span>${e(tt('a_small'))}</span><b>${e(String(d.small))}</b><small>${e(tt('a_smallSub'))}</small></div></div>
      <p class="tp-verdict ${oppTone}">${e(tt('a_verdict_' + oppTone))}${mine ? ' ' + e(tt('a_myRank', { n: mine.rank })) : ''}</p></div>
    ${(d.related || []).length ? `<div class="tp-rel"><span class="dk-sub" style="font-weight:700">${e(tt('a_related'))}</span><div class="dk-chips">${d.related.map((x) => chip('#' + x.k, `data-q="${e(x.k)}"`)).join('')}</div></div>` : ''}
    ${(d.smallWins || []).length ? `<h3 class="tp-h">${e(tt('a_smallWins'))}</h3><div class="tp-grid">${d.smallWins.slice(0, 6).map((x) => vidCard(x, true)).join('')}</div>` : ''}
    <h3 class="tp-h">${e(tt('a_hotNow'))}</h3><div class="tp-grid">${(d.hot || []).slice(0, 9).map((x) => vidCard(x)).join('') || `<div class="dk-empty">${e(tt('a_none'))}</div>`}</div>
    <h3 class="tp-h">${e(tt('a_topicChans'))}</h3><div class="tp-chs">${(d.channels || []).slice(0, 10).map((c) => `<div class="tp-ch">${C.avatar(c.thumb)}<span class="txt"><b>${e(c.title)}</b><small>${e(c.subs == null ? tt('a_subsHidden') : tt('a_subs', { n: C.fmtN(c.subs) }))} · ${e(tt('a_inTop', { n: c.n }))}</small></span>${c.tracked ? `<span class="dk-tag gray">${e(tt('a_watching'))}</span>` : `<button type="button" class="dk-btn sm" data-watch="${e(c.id)}">${e(tt('a_watch'))}</button>`}</div>`).join('')}</div>
    <p class="dk-sub">${e(tt('a_topicFoot', { n: d.n }))}${d.cached ? ' · ' + e(tt('a_cached')) : ''}</p>`;
}
async function tTopic(v, r, alive) {
  const q0 = query().get('q') || (A.topic && A.topic.q) || '';
  const pool = await loadPool(21);
  const dna = await loadDna(pool);
  if (!alive()) return;
  const sugg = [...new Set([...(dna ? dna.kws.slice(0, 5).map((k) => k.k) : []), ...M.waves(pool, { max: 4 }).map((w) => w.k)])].slice(0, 8);
  v.innerHTML = toolHead(tt('t_topic'), tt('tl_topic')) + `<section class="dk-card full dk-fade">
    <form class="tp-form" id="tpForm" novalidate><input class="dk-input" id="tpIn" maxlength="60" value="${e(q0)}" placeholder="${e(tt('a_topicPh'))}"><button class="dk-btn" id="tpBtn">${ic('search', 17)}<span>${e(tt('a_search'))}</span></button></form>
    ${sugg.length ? `<div class="dk-chips">${sugg.map((k) => chip('#' + k, `data-q="${e(k)}"`)).join('')}</div>` : ''}
    <div id="tpOut" aria-live="polite">${A.topic && A.topic.q === q0 && A.topic.kind === kindNow() ? topicHtml(A.topic) : `<div class="dk-empty">${e(tt('a_topicEmpty'))}</div>`}</div></section>`;
  const out = v.querySelector('#tpOut');
  const run = async (q) => {
    if (!q) return;
    v.querySelector('#tpIn').value = q;
    out.innerHTML = spinBox(tt('a_searching'));
    const d = await C.act({ action: 'topic', q, lang: L(), kind: kindNow() });
    if (!d.ok) { out.innerHTML = errBox(d.error); return; }
    A.topic = d;
    out.innerHTML = topicHtml(d);
    bindTopic();
  };
  const bindTopic = () => {
    out.querySelectorAll('[data-watch]').forEach((b) => b.addEventListener('click', async () => {
      b.disabled = true;
      b.innerHTML = '<span class="dk-spin"></span>';
      const o = await C.act({ action: 'add', inputs: [b.dataset.watch], role: 'reference', source: 'discover' });
      if (!o.ok || !(o.results || [])[0]?.ok) { b.disabled = false; b.textContent = tt('a_watch'); C.snack(C.errText(o.ok ? o.results?.[0]?.error : o.error)); return; }
      b.outerHTML = `<span class="dk-tag gray">${e(tt('a_watching'))}</span>`;
      C.snack(tt('a_added', { n: 1, v: C.fmtFull((o.results[0].shorts || 0) + (o.results[0].longs || 0)) }));
      C.S.chansAt = 0; dropPool();
    }));
    out.querySelectorAll('[data-vb]').forEach((b) => b.addEventListener('click', async () => {
      const x = [...(A.topic.hot || []), ...(A.topic.smallWins || [])].find((y) => y.id === b.dataset.vb);
      if (!x) return;
      b.disabled = true;
      const o = await C.act({ action: 'idea', op: 'add', title: String(x.title).slice(0, 200), source_video_id: x.id, note: `${x.chTitle} · ${tt('t_topic')}: ${A.topic.q}` });
      if (!o.ok) { b.disabled = false; C.snack(C.errText(o.error)); return; }
      b.textContent = C.t('inBoard');
      C.snack(C.t('added'));
    }));
    out.querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => run(b.dataset.q)));
  };
  v.querySelectorAll('.dk-chips [data-q]').forEach((b) => b.addEventListener('click', () => run(b.dataset.q)));
  v.querySelector('#tpForm').addEventListener('submit', (ev) => { ev.preventDefault(); run(v.querySelector('#tpIn').value.trim()); });
  if (A.topic && A.topic.q === q0 && A.topic.kind === kindNow()) bindTopic();
  else if (query().get('q')) run(q0);
}

// --- 소재 예측 · 제목 대결 ---
function predCard(title, p, best) {
  if (p.conf === 'none') return `<article class="pr dk-fade"><b class="pr-t">${e(title)}</b><p class="dk-sub">${e(tt('a_predNone'))}</p></article>`;
  const confTxt = tt('a_conf_' + p.conf);
  return `<article class="pr dk-fade${best ? ' best' : ''}">
    ${best ? `<span class="pr-best">${e(tt('a_best'))}</span>` : ''}
    <b class="pr-t">${e(title)}</b>
    <div class="pr-x"><b>${e(tt('a_xBig', { x: fmtX(p.mult) }))}</b><span>${e(tt('a_range', { a: fmtX(p.lo), b: fmtX(p.hi) }))}</span><span class="pr-c ${p.conf}">${e(confTxt)}</span></div>
    ${p.views ? `<div class="pr-v">${e(tt('a_expViews', { a: C.fmtN(p.views.lo), m: C.fmtN(p.views.mid), b: C.fmtN(p.views.hi) }))}</div>` : `<div class="dk-sub">${e(tt('a_noBase'))}</div>`}
    <ul class="pr-why"><li>${e(tt('a_whyNb', { n: p.n }))}</li>${p.why.map((w) => `<li>${e(w.k === 'fmt' ? tt('a_whyFmt', { f: C.t('fmt_' + w.f), x: fmtX(w.x) }) : tt('a_whyDna', { w: w.w.map((x) => '#' + x).join(' ') }))}</li>`).join('')}</ul>
    <div class="pr-nb">${p.nb.slice(0, 4).map((x) => `<a class="dk-thumb${x.v.kind === 'long' ? ' wide' : ''}" href="${C.ytShort(x.v.id)}" target="_blank" rel="noopener" data-short="${e(x.v.id)}" style="background-image:url('${C.cssUrl(C.vthumb(x.v.thumb))}')" title="${e(x.v.title)}"><span class="v">${e(tt('a_xShort', { x: fmtX(x.v.ratio) }))}</span></a>`).join('')}</div>
  </article>`;
}
async function tPredict(v, r, alive) {
  const pool = await loadPool(60);
  const dna = await loadDna(pool);
  if (!alive()) return;
  const refs = pool.filter((x) => x.role === 'reference');
  const idf = M.idfOf(refs);
  const pre = query().get('t') || '';
  v.innerHTML = toolHead(tt('t_predict'), tt('tl_predict')) + `<section class="dk-card full dk-fade">
    <form id="prForm" class="pr-form" novalidate><textarea class="dk-textarea" id="prIn" rows="3" placeholder="${e(tt('a_predPh'))}">${e(pre)}</textarea>
    <button class="dk-btn" id="prBtn">${ic('target', 17)}<span>${e(tt('a_predBtn'))}</span></button></form>
    <p class="dk-sub">${e(dna ? tt('a_predBasis', { n: C.fmtFull(refs.length), b: C.fmtN(dna.base) }) : tt('a_predBasis0', { n: C.fmtFull(refs.length) }))}</p>
    <div id="prOut" aria-live="polite"></div></section>`;
  const run = () => {
    const lines = v.querySelector('#prIn').value.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 4);
    if (!lines.length) return;
    const res = lines.map((tl) => ({ tl, p: M.predict(tl, refs, dna, { idf }) }));
    const ok = res.filter((x) => x.p.conf !== 'none');
    const top = ok.length > 1 ? ok.reduce((a, b) => (b.p.mult > a.p.mult ? b : a)) : null;
    const duel = ok.length > 1 ? `<div class="pr-duel">${ok.map((x) => `<div class="row${x === top ? ' on' : ''}"><span>${e(x.tl)}</span><i style="width:${Math.min(100, (x.p.mult / top.p.mult) * 100).toFixed(1)}%"></i><b>${e(tt('a_xShort', { x: fmtX(x.p.mult) }))}</b></div>`).join('')}</div>` : '';
    v.querySelector('#prOut').innerHTML = duel + `<div class="pr-grid">${res.map((x) => predCard(x.tl, x.p, x === top)).join('')}</div><p class="dk-sub">${e(tt('a_predNote'))}</p>`;
  };
  v.querySelector('#prForm').addEventListener('submit', (ev) => { ev.preventDefault(); run(); });
  if (pre) run();
}

// --- 제목 · 태그 도우미 ---
async function tTitle(v, r, alive) {
  const pool = await loadPool(60);
  const dna = await loadDna(pool);
  if (!alive()) return;
  const refs = pool.filter((x) => x.role === 'reference');
  const idf = M.idfOf(refs);
  const stats = M.fmtStats(refs);
  const qp = query();
  let seed = qp.get('q') || '', src = null;
  if (qp.get('v')) {
    src = C.SHORTS.get(qp.get('v')) || pool.find((x) => x.id === qp.get('v')) || null;
    if (src) seed = M.tokens(src.title)[0] || M.keyToks(src)[0] || '';
  }
  const hot = M.waves(pool, { max: 6 }).map((w) => w.k);
  v.innerHTML = toolHead(tt('t_title'), tt('tl_title')) + `<section class="dk-card full dk-fade">
    ${src ? `<div class="ti-src">${C.avatar(src.thumb, true)}<span class="txt"><small>${e(tt('a_fromVid'))}</small><b>${e(src.title)}</b></span>${C.ratioTag(src.ratio)}</div>` : ''}
    <form class="tp-form" id="tiForm" novalidate><input class="dk-input" id="tiIn" maxlength="80" value="${e(seed)}" placeholder="${e(tt('a_titlePh'))}"><button class="dk-btn">${ic('wand', 17)}<span>${e(tt('a_make'))}</span></button></form>
    <div id="tiOut" aria-live="polite"></div></section>`;
  const run = () => {
    const s = v.querySelector('#tiIn').value.trim();
    if (!s) return;
    const isTitle = M.tokens(s).length >= 3 || s.length > 18;
    const kwSeed = isTitle ? M.tokens(s).slice(0, 2).join(' ') : s;
    const rel = M.similar(s, refs, { k: 12, idf }).flatMap((x) => M.keyToks(x.v)).filter((k) => !kwSeed.includes(k));
    const ideas = M.titleIdeas(kwSeed, refs, dna, L(), { stats, related: [...new Set(rel)].slice(0, 3), max: 8 })
      .map((x) => ({ ...x, p: M.predict(x.title, refs, dna, { idf, k: 10 }) }));
    const chk = M.titleCheck(isTitle ? s : (ideas[0]?.title || s), kindNow(), dna, hot);
    const tg = M.tagsFor(isTitle ? s : ideas[0]?.title || s, refs, dna, { idf });
    const swaps = src && dna ? dna.kws.slice(0, 5).map((k) => M.swapTopic(src.title, k.k)).filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3)
      .map((title) => ({ title, p: M.predict(title, refs, dna, { idf, k: 10 }) })) : [];
    v.querySelector('#tiOut').innerHTML = (swaps.length ? `<h3 class="tp-h">${e(tt('a_swapTitle'))}</h3>
      <div class="ti-list">${swaps.map((x) => `<div class="ti-row swap"><span class="ti-t">${e(x.title)}</span>${x.p.conf !== 'none' ? `<span class="dk-tag">${e(tt('a_predX', { x: fmtX(x.p.mult) }))}</span>` : ''}<button type="button" class="dk-mini" data-cp="${e(x.title)}">${ic('copy', 13)}</button><a class="dk-mini" href="#tool/predict?t=${encodeURIComponent(x.title)}">${ic('target', 13)}</a></div>`).join('')}</div>` : '') + `
      <h3 class="tp-h">${e(tt('a_ideas'))}</h3>
      <div class="ti-list">${ideas.map((x) => `<div class="ti-row"><span class="ti-t">${e(x.title)}</span><span class="dk-tag gray">${e(C.t('fmt_' + x.fmt))}</span>${x.x ? `<span class="dk-tag ${x.x >= 1.5 ? 'amber' : 'gray'}">${e(tt('a_fmtX', { x: fmtX(x.x) }))}</span>` : ''}${x.p.conf !== 'none' ? `<span class="dk-tag">${e(tt('a_predX', { x: fmtX(x.p.mult) }))}</span>` : ''}<button type="button" class="dk-mini" data-cp="${e(x.title)}">${ic('copy', 13)}</button><a class="dk-mini" href="#tool/predict?t=${encodeURIComponent(x.title)}">${ic('target', 13)}</a></div>`).join('') || `<div class="dk-empty">${e(tt('a_none'))}</div>`}</div>
      <div class="dk-row" style="margin-top:6px">
        <section class="ti-box f1"><h3 class="tp-h">${e(tt('a_check', { s: chk.score }))}</h3><p class="dk-sub" style="margin:0 0 6px">“${e(isTitle ? s : ideas[0]?.title || s)}”</p>
          <ul class="ti-chk">${chk.checks.map((c) => `<li class="${c.ok ? 'ok' : 'no'}">${c.ok ? ic('check', 15) : C.svg(C.IC.x, 15)}<span>${e(tt('ck_' + c.k + (c.ok ? '1' : '0'), { n: c.v ?? '', a: c.a ?? '', b: c.b ?? '' }))}</span></li>`).join('')}</ul></section>
        <section class="ti-box f1"><h3 class="tp-h">${e(tt('a_tags'))}<button type="button" class="dk-mini" data-cp="${e(tg.tags.join(', '))}">${ic('copy', 13)} ${e(tt('a_copyAll'))}</button></h3>
          <div class="dk-chips">${tg.tags.map((x) => `<span class="dk-tag gray">${e(x)}</span>`).join('')}</div>
          <h3 class="tp-h" style="margin-top:12px">${e(tt('a_hashtags'))}<button type="button" class="dk-mini" data-cp="${e(tg.hashtags.join(' '))}">${ic('copy', 13)}</button></h3>
          <div class="dk-chips">${tg.hashtags.map((x) => `<span class="dk-tag">${e(x)}</span>`).join('')}</div>
          <p class="dk-sub">${e(tt('a_tagsFrom', { n: tg.from }))}</p></section>
      </div>`;
    v.querySelectorAll('[data-cp]').forEach((b) => b.addEventListener('click', () => copyText(b.dataset.cp)));
  };
  v.querySelector('#tiForm').addEventListener('submit', (ev) => { ev.preventDefault(); run(); });
  if (seed) run();
}

// --- 썸네일 비교 ---
function imgStats(img) {
  const cv = document.createElement('canvas');
  const w = 96, h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * 96));
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data;
  let sum = 0, sum2 = 0, sat = 0, edges = 0;
  const lum = new Float32Array(w * h);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const r = d[i], gg = d[i + 1], b = d[i + 2];
    const l = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
    lum[p] = l; sum += l; sum2 += l * l;
    const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    sat += mx ? (mx - mn) / mx : 0;
  }
  for (let y = 1; y < h; y++) for (let x = 1; x < w; x++) { const p = y * w + x; if (Math.abs(lum[p] - lum[p - 1]) + Math.abs(lum[p] - lum[p - w]) > 60) edges++; }
  const n = w * h, mean = sum / n;
  return { bright: Math.round((mean / 255) * 100), contrast: Math.round((Math.sqrt(Math.max(sum2 / n - mean * mean, 0)) / 128) * 100), sat: Math.round((sat / n) * 100), detail: Math.round((edges / n) * 100) };
}
async function tThumb(v, r, alive) {
  const pool = await loadPool(30);
  if (!alive()) return;
  const sc = A.thumbScope || 'mine';
  const dna = await loadDna(pool);
  const refs = pool.filter((x) => x.role === 'reference' && x.ratio != null);
  const words = dna ? new Set(dna.kws.map((k) => k.k)) : null;
  let list = refs;
  if (sc === 'mine' && words) { const f = refs.filter((x) => M.keyToks(x).some((k) => words.has(k))); if (f.length >= 6) list = f; }
  const top = [...list].sort((a, b) => b.ratio - a.ratio).slice(0, 12);
  const long = kindNow() === 'long';
  v.innerHTML = toolHead(tt('t_thumb'), tt('tl_thumb')) + `
  <section class="dk-card full dk-fade">
    <div class="dk-ch"><h2>${e(tt('a_myThumb'))}</h2><span class="dk-sub">${e(tt('a_myThumbSub'))}</span></div>
    <div class="th-up"><label class="dk-btn" for="thFile">${ic('image', 17)}<span>${e(tt('a_pickImg'))}</span></label><input type="file" id="thFile" accept="image/*" hidden><input class="dk-input" id="thTitle" maxlength="100" placeholder="${e(tt('a_thTitlePh'))}"></div>
    <div id="thStats"></div>
    <div class="th-feed ${long ? 'long' : 'short'}" id="thFeed"></div>
  </section>
  <section class="dk-card full dk-fade">
    <div class="dk-ch"><h2>${e(tt('a_topThumbs'))}</h2><div class="dk-seg" role="group"><button type="button" data-sc="mine" aria-pressed="${sc === 'mine'}">${e(tt('a_scMine'))}</button><button type="button" data-sc="all" aria-pressed="${sc === 'all'}">${e(tt('a_scAll'))}</button></div></div>
    <div class="th-grid ${long ? 'long' : 'short'}">${top.map((s) => `<a class="th-it" href="${C.ytShort(s.id)}" target="_blank" rel="noopener" data-short="${e(s.id)}"><span class="im" style="background-image:url('${C.cssUrl(C.vthumb(s.thumb))}')"><em>${e(tt('a_xShort', { x: fmtX(s.ratio) }))}</em></span><b>${e(s.title)}</b><small>${e(s.channel_title)} · ${e(C.fmtN(s.views))}</small></a>`).join('') || `<div class="dk-empty">${e(tt('a_none'))}</div>`}</div>
  </section>`;
  v.querySelectorAll('[data-sc]').forEach((b) => b.addEventListener('click', () => { A.thumbScope = b.dataset.sc; C.render(); }));
  const feed = v.querySelector('#thFeed');
  const draw = () => {
    const mineT = v.querySelector('#thTitle').value.trim() || tt('a_thMine');
    const others = top.slice(0, long ? 7 : 5);
    const cards = others.map((s) => ({ img: C.vthumb(s.thumb), t: s.title, c: s.channel_title, mine: false }));
    if (A.thumbUrl) cards.splice(Math.min(2, cards.length), 0, { img: A.thumbUrl, t: mineT, c: mineChan()?.title || tt('a_myCh'), mine: true });
    feed.innerHTML = cards.map((x) => `<div class="fd${x.mine ? ' me' : ''}"><span class="im" style="background-image:url('${x.mine ? x.img : C.cssUrl(x.img)}')"></span><b>${e(x.t)}</b><small>${e(x.c)}</small></div>`).join('');
  };
  v.querySelector('#thFile').addEventListener('change', (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f || !/^image\//.test(f.type)) return;
    const rd = new FileReader();
    rd.onload = () => {
      A.thumbUrl = String(rd.result);
      const img = new Image();
      img.onload = () => {
        const st = imgStats(img);
        const tag = (n, lo, hi) => (n < lo ? 'lo' : n > hi ? 'hi' : 'ok');
        const rows = [['bright', st.bright, 35, 80], ['contrast', st.contrast, 35, 95], ['sat', st.sat, 30, 85], ['detail', st.detail, 4, 22]];
        v.querySelector('#thStats').innerHTML = `<div class="th-stats">${rows.map(([k, n, lo, hi]) => `<div class="${tag(n, lo, hi)}"><span>${e(tt('th_' + k))}</span><b>${n}</b><small>${e(tt('th_' + k + '_' + tag(n, lo, hi)))}</small></div>`).join('')}</div>`;
        draw();
      };
      img.src = A.thumbUrl;
    };
    rd.readAsDataURL(f);
  });
  v.querySelector('#thTitle').addEventListener('input', () => { if (A.thumbUrl) draw(); });
  if (A.thumbUrl) draw();
}

// --- 댓글 속 소재 ---
function cmtHtml(items, pool) {
  return items.map((it) => {
    const s = pool.find((x) => x.id === it.id) || C.SHORTS.get(it.id);
    const head = `<div class="cm-hd">${s ? C.avatar(s.thumb, true) : ''}<span class="txt"><b>${e(s ? s.title : it.id)}</b><small>${e(s ? s.channel_title : '')}${it.n ? ' · ' + tt('a_cmN', { n: it.n }) : ''}</small></span></div>`;
    if (it.off) return `<article class="cm dk-fade">${head}<p class="dk-sub">${e(tt('a_cmOff'))}</p></article>`;
    const words = (it.words || []).filter((w) => !/^(있|없|했|먹을|하는)/.test(w.k)).slice(0, 10);
    return `<article class="cm dk-fade">${head}
      ${it.requests && it.requests.length ? `<ul class="cm-req">${it.requests.slice(0, 6).map((q, i) => `<li><span>${e(q.text)}</span><em>♥ ${e(C.fmtN(q.likes))}</em><button type="button" class="dk-mini" data-cb="${e(it.id)}" data-ci="${i}">${e(C.t('toBoard'))}</button></li>`).join('')}</ul>` : `<p class="dk-sub">${e(tt('a_cmNoReq'))}</p>`}
      ${words.length ? `<div class="dk-chips">${words.map((w) => `<a class="dk-chip" href="#tool/topic?q=${encodeURIComponent(w.k)}">#${e(w.k)}</a>`).join('')}</div>` : ''}
    </article>`;
  }).join('');
}
async function tComments(v, r, alive) {
  const pool = await loadPool(14);
  if (!alive()) return;
  const vp = query().get('v');
  const refs = pool.filter((x) => x.role === 'reference' && x.ratio != null && (x.comments || 0) >= 5);
  const top = [...refs].sort((a, b) => b.ratio - a.ratio).slice(0, 5);
  v.innerHTML = toolHead(tt('t_comments'), tt('tl_comments')) + `<section class="dk-card full dk-fade">
    <form class="tp-form" id="cmForm" novalidate><input class="dk-input" id="cmIn" value="${e(vp || '')}" placeholder="${e(tt('a_cmPh'))}"><button class="dk-btn">${ic('chat', 17)}<span>${e(tt('a_cmRead'))}</span></button></form>
    ${top.length ? `<button type="button" class="dk-btn line" id="cmTop">${ic('bolt', 16)}<span>${e(tt('a_cmTop', { n: top.length }))}</span></button>` : ''}
    <div id="cmOut" aria-live="polite">${A.cm ? cmtHtml(A.cm, pool) : `<div class="dk-empty">${e(tt('a_cmEmpty'))}</div>`}</div></section>`;
  const out = v.querySelector('#cmOut');
  const run = async (ids) => {
    out.innerHTML = spinBox(tt('a_cmReading'));
    const d = await C.act({ action: 'comments', ids });
    if (!d.ok) { out.innerHTML = errBox(d.error); return; }
    A.cm = d.items || [];
    out.innerHTML = cmtHtml(A.cm, pool);
    bind();
  };
  const bind = () => out.querySelectorAll('[data-cb]').forEach((b) => b.addEventListener('click', async () => {
    const it = (A.cm || []).find((x) => x.id === b.dataset.cb);
    const q = it && it.requests[Number(b.dataset.ci)];
    if (!q) return;
    b.disabled = true;
    const s = pool.find((x) => x.id === it.id);
    const o = await C.act({ action: 'idea', op: 'add', title: q.text.slice(0, 120), source_video_id: it.id, note: `${tt('t_comments')} · ♥${q.likes}${s ? ' · ' + s.title : ''}` });
    if (!o.ok) { b.disabled = false; C.snack(C.errText(o.error)); return; }
    b.textContent = C.t('inBoard');
    C.snack(C.t('added'));
  }));
  const idOf = (raw) => { const m = String(raw || '').match(/(?:v=|shorts\/|youtu\.be\/|^)([A-Za-z0-9_-]{11})(?:[?&#]|$)/); return m ? m[1] : null; };
  v.querySelector('#cmForm').addEventListener('submit', (ev) => { ev.preventDefault(); const id = idOf(v.querySelector('#cmIn').value.trim()); if (id) run([id]); else C.snack(C.errText('BAD_LINK')); });
  v.querySelector('#cmTop')?.addEventListener('click', () => run(top.map((x) => x.id)));
  if (A.cm) bind();
  else if (vp && idOf(vp)) run([idOf(vp)]);
}

// --- 내 채널 모델 ---
async function tDna(v, r, alive) {
  const pool = await loadPool(60);
  const dna = await loadDna(pool);
  if (!alive()) return;
  const mc = mineChan();
  if (!dna || !mc) { v.innerHTML = toolHead(tt('t_dna'), tt('tl_dna')) + `<section class="dk-card full"><div class="dk-empty">${e(tt('a_mtNeedMine'))} <a href="#refs">${e(tt('a_qRefs'))} →</a></div></section>`; return; }
  const Ls = C.learnStore();
  const kinds = Object.entries(Ls.kinds || {}).sort((a, b) => (b[1].do - b[1].skip) - (a[1].do - a[1].skip));
  const maxW = Math.max(...dna.kws.map((k) => k.w), 0.01);
  const fmtMax = Math.max(...dna.fmts.map((f) => f.x || 0), 1);
  v.innerHTML = toolHead(tt('t_dna'), tt('tl_dna')) + `
  <div class="dk-row">
    <section class="dk-card f1 dk-fade"><div class="my-top">${C.avatar(mc.thumb || mc.thumbnail_url)}<span class="txt"><b>${e(mc.title)}</b><small>${e(tt('a_dnaFrom', { n: dna.n }))}</small></span></div>
      <div class="my-stats"><div><span>${e(tt('a_base'))}</span><b>${e(C.fmtN(dna.base))}</b></div><div><span>${e(tt('a_hit'))}</span><b>${e(pctTxt(dna.hit))}</b></div>
      <div><span>${e(tt('a_pace'))}</span><b>${e(tt('a_perWeek', { n: fmtX(dna.pace) }))}</b></div><div><span>${e(tt('a_eng'))}</span><b>${e((dna.eng * 100).toFixed(1) + '%')}</b>${dna.refEng ? `<small>${e(tt('a_vsRef', { n: (dna.refEng * 100).toFixed(1) + '%' }))}</small>` : ''}</div>
      <div><span>${e(tt('a_gap'))}</span><b>${e(dna.gap ? tt('a_xShort', { x: fmtX(dna.gap) }) : '–')}</b></div><div><span>${e(tt('a_dur'))}</span><b>${e(C.durTxt(dna.durMed))}</b></div></div></section>
    <section class="dk-card f2 dk-fade"><div class="dk-ch"><h2>${e(tt('a_dnaKw'))}</h2><span class="dk-sub">${e(tt('a_dnaKwSub'))}</span></div>
      <div class="dna-bars">${dna.kws.map((k) => `<div class="row"><span>#${e(k.k)}</span><i style="width:${((k.w / maxW) * 100).toFixed(1)}%"></i><b>${e(tt('a_xShort', { x: fmtX(k.x) }))}</b><a class="dk-mini" href="#tool/topic?q=${encodeURIComponent(k.k)}">${ic('search', 13)}</a></div>`).join('')}</div></section>
  </div>
  <div class="dk-row">
    <section class="dk-card f1 dk-fade"><div class="dk-ch"><h2>${e(tt('a_dnaFmt'))}</h2></div>
      ${dna.fmts.length ? `<div class="dna-bars">${dna.fmts.map((f) => `<div class="row"><span>${e(C.t('fmt_' + f.k))}</span><i class="${(f.x || 0) >= 1 ? 'up' : 'dn'}" style="width:${(((f.x || 0) / fmtMax) * 100).toFixed(1)}%"></i><b>${e(tt('a_xShort', { x: fmtX(f.x) }))}</b><small>${e(tt('a_nVid', { n: f.n }))}</small></div>`).join('')}</div>` : `<div class="dk-empty">${e(tt('a_dnaWait'))}</div>`}</section>
    <section class="dk-card f1 dk-fade"><div class="dk-ch"><h2>${e(tt('a_learned'))}</h2></div>
      ${kinds.length ? `<ul class="dk-list">${kinds.slice(0, 6).map(([k, x]) => `<li class="dk-li"><span class="dk-ttl"><b>${e(C.t('k_' + k))}</b><small>${e(tt('a_learnRow', { d: x.do, s: x.skip }))}</small></span></li>`).join('')}</ul>` : `<div class="dk-empty">${e(C.t('msgLearn0'))}</div>`}</section>
    <section class="dk-card f1 dk-fade"><div class="dk-ch"><h2>${e(tt('a_myTop'))}</h2></div>
      <ul class="dk-list">${dna.top.map((s) => `<li><a class="dk-li" href="${C.ytShort(s.id)}" target="_blank" rel="noopener" data-short="${e(s.id)}">${C.avatar(s.thumb, true)}<span class="dk-ttl"><b>${e(s.title)}</b><small>${e(C.fmtN(s.views))}</small></span>${C.ratioTag(s.ratio)}</a></li>`).join('')}</ul></section>
  </div>`;
}
