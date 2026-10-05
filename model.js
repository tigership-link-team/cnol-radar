// CNOL RADAR — 내 채널 맞춤 '소재 모델'
// 화면과 상관없는 계산만 모았어요: 소재 DNA · 비슷한 영상 찾기 · 소재 예측 · 제목 점검 · 태그 · 제목 아이디어 · 소재 파도
// 입력은 radar_videos_list 한 줄 모양 ({id, title, tags, views, ratio, age_h, dur, kind, role, channel_id, status, …})

export const STOPW = new Set(['shorts', 'short', '쇼츠', '숏츠', 'youtube', 'youtubeshorts', 'the', 'and', 'for', 'you', 'with', 'this', 'that', 'what', 'how', 'why', 'are', 'was',
  'from', 'your', 'have', 'just', '진짜', '이거', '그냥', '너무', '정말', '이건', '저는', '오늘', 'ショート', 'です', 'ます', 'viral', 'fyp', 'funny', 'vlog', 'shortvideo', 'shortsvideo',
  '사람', '사람들', '여자', '남자', '이유', '우리', '내가', '나는', '이렇게', '이런', '그런', '저런', '모든', '결국', '근데', '그래서', '하루', '시간', '생각', '순간', '세상', '인생',
  '처음', '마지막', '무조건', '절대', '대박', '미친', '충격', '결과', '정체', '반응', '실제', '최근', '요즘', '지금', '이제', '이게', '평생', '이것', '그것', '여러분', '사실',
  '영상', '채널', '구독', '좋아요', '알림', '공식', 'official', 'trending', 'subscribe', '추천', '브이로그', '일상', 'people', 'things', 'thing', 'when', 'who', 'will', 'can',
  'get', 'got', 'out', 'all', 'one', 'every', 'new', 'best', 'top', 'tried', 'try', 'made', 'make', '今日', '最近', '本当', '日常', '動画', 'チャンネル',
  '맛있게', '쉽게', '빠르게', '제대로', '완전', '같이', '많이', '진짜로', '정말로', '이렇게', '역대급', '레전드', '꿀팁', '최고', '가장', '제일', '더', '안']);
// 한국어 제목에서 조사를 떼고(고양이가 → 고양이), 동사 꼴(먹어봤더니, 보면, 맛있는)은 빼요
const JOSA = /(에서|으로|까지|부터|한테|에게|이랑|처럼|보다|을|를|은|는|가|의|에|도|로|와|과|랑|만)$/;
const VERBY = /(봄|봤|봤다|봤더니|더니|했다|하는|하기|한다|해요|어요|아요|네요|니다|하면|보면|ㄷㄷ|ㅋㅋ|ㅎㅎ)$/;
const STEM = /(있|없|는|던|겠|했|되|된|싶)$/;
export function tokens(title) {
  const s = String(title || '').toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/[#@]/g, ' ');
  const out = [];
  // 일본어는 띄어쓰기가 없어서 가타카나·한자 덩어리를 단어로 써요
  for (const m of s.matchAll(/[\p{Script=Katakana}ー]{2,12}|[\p{Script=Han}]{2,6}/gu)) out.push(m[0]);
  for (let w of s.replace(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+/gu, ' ').split(/[^\p{L}\p{N}]+/u)) {
    if (/^[가-힣]{3,}$/.test(w) && JOSA.test(w)) w = w.replace(JOSA, '');
    if (w.length < 2 || w.length > 20 || STOPW.has(w) || /^\d/.test(w) || VERBY.test(w) || (/^[가-힣]+$/.test(w) && (STEM.test(w) || /^(있|없)/.test(w)))) continue;
    out.push(w);
  }
  return [...new Set(out)];
}
export const tagToks = (tags) => (Array.isArray(tags) ? tags : []).map((x) => String(x).toLowerCase().replace(/^#/, '').trim())
  .filter((x) => x.length >= 2 && x.length <= 20 && !STOPW.has(x));
export const keyToks = (v) => [...new Set([...tokens(v.title), ...tagToks(v.tags)])];

// 제목 패턴 (숫자 · 질문 · 비교 · 해봤더니 · 반전 · 방법 · 리뷰 · 순위)
export const FMT = [
  ['number', /\d/],
  ['question', /[?？]|왜|어떻게|진짜|뭐가|무엇|\bhow\b|\bwhy\b|\bwhat\b|なぜ|どう|本当/i],
  ['compare', /\bvs\.?\b|비교|차이|대결|比較|対決/i],
  ['challenge', /해\s?봤|해봄|실험|도전|챌린지|테스트|검증|\btried\b|challenge|\btest|やってみた|検証|挑戦/i],
  ['twist', /반전|결말|충격|레전드|소름|ㄷㄷ|ㅋㅋ|wait for it|plot twist|まさか|衝撃/i],
  ['howto', /방법|꿀팁|팁|하는\s?법|레시피|만들기|how to|\btips?\b|recipe|hack|方法|レシピ|裏技/i],
  ['review', /리뷰|후기|언박싱|먹방|review|unboxing|レビュー|開封/i],
  ['list', /top\s?\d|\bbest\b|순위|랭킹|티어|ランキング/i]
];
export const formatsOf = (title) => FMT.filter(([, re]) => re.test(title || '')).map(([k]) => k).slice(0, 3);

export const median = (a) => { if (!a.length) return null; const x = [...a].sort((p, q) => p - q); const m = x.length >> 1; return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2; };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const live = (list) => (list || []).filter((v) => v && v.status !== 'missing');
// 가중 분위수 (값·무게 쌍)
function wq(pairs, q) {
  const s = [...pairs].sort((a, b) => a[0] - b[0]);
  const tot = s.reduce((a, x) => a + x[1], 0);
  if (!tot) return null;
  let acc = 0;
  for (const [v, w] of s) { acc += w; if (acc >= q * tot) return v; }
  return s[s.length - 1][0];
}

// ---------- 1) 내 채널 소재 DNA ----------
// 잘 된 영상일수록 무겁게 세서 '내 채널이 잘하는 소재·포맷·길이'를 뽑아요
export function dnaOf(mine, refs = []) {
  const vids = live(mine);
  if (!vids.length) return null;
  const old = vids.filter((v) => (v.age_h || 0) >= 72);
  const basis = old.length >= 5 ? old : vids;
  const base = median(basis.map((v) => Number(v.views) || 0)) || 0;
  const r = (v) => (v.ratio != null ? Number(v.ratio) : base ? (Number(v.views) || 0) / base : 1);
  const score = new Map(), docs = new Map(), rs = new Map();
  for (const v of vids) {
    const w = 0.6 + Math.log2(1 + clamp(r(v), 0.3, 6));
    const tk = tokens(v.title), tg = tagToks(v.tags);
    for (const t of new Set([...tk, ...tg])) {
      score.set(t, (score.get(t) || 0) + w * (tg.includes(t) && !tk.includes(t) ? 1.1 : 1));
      docs.set(t, (docs.get(t) || 0) + 1);
      if (!rs.has(t)) rs.set(t, []);
      rs.get(t).push(r(v));
    }
  }
  const minDocs = vids.length >= 8 ? 2 : 1;
  const ranked = [...score.entries()].filter(([k]) => (docs.get(k) || 0) >= minDocs).sort((a, b) => b[1] - a[1]);
  const tot = ranked.slice(0, 40).reduce((a, x) => a + x[1], 0) || 1;
  const kws = ranked.slice(0, 12).map(([k, w]) => ({ k, w: w / tot, n: docs.get(k) || 0, x: median(rs.get(k)) || 1 }));
  const fmts = FMT.map(([k]) => {
    const xs = vids.filter((v) => formatsOf(v.title).includes(k)).map(r);
    return { k, n: xs.length, x: median(xs) };
  }).filter((f) => f.n >= 2).sort((a, b) => (b.x || 0) - (a.x || 0));
  const durs = vids.map((v) => Number(v.dur) || 0).filter(Boolean);
  const hits = basis.filter((v) => r(v) >= 2).length;
  const eng = median(vids.filter((v) => (v.views || 0) >= 100).map((v) => ((Number(v.likes) || 0) + (Number(v.comments) || 0) * 2) / Math.max(Number(v.views) || 1, 1))) || 0;
  const refVids = live(refs).filter((v) => v.role !== 'mine');
  const refBases = new Map();
  for (const v of refVids) if (v.base != null) refBases.set(v.channel_id, Number(v.base));
  const refBase = median([...refBases.values()]);
  const refEng = median(refVids.filter((v) => (v.views || 0) >= 100).map((v) => ((Number(v.likes) || 0) + (Number(v.comments) || 0) * 2) / Math.max(Number(v.views) || 1, 1)));
  return {
    n: vids.length, base, kws, fmts, durMed: median(durs),
    hit: basis.length ? hits / basis.length : 0,
    pace: vids.filter((v) => (v.age_h || 1e9) <= 28 * 24).length / 4,
    eng, refEng, refBase, gap: refBase ? base / refBase : null,
    top: [...vids].sort((a, b) => r(b) - r(a)).slice(0, 3),
    words: new Map(ranked.slice(0, 40).map(([k, w]) => [k, w / tot]))
  };
}

// ---------- 2) 비슷한 영상 (제목·태그 겹침, 흔한 단어는 가볍게) ----------
export function idfOf(pool) {
  const df = new Map();
  for (const v of pool) for (const t of keyToks(v)) df.set(t, (df.get(t) || 0) + 1);
  const N = pool.length || 1;
  return (t) => Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;
}
export function similar(title, pool, opt = {}) {
  const k = opt.k || 10;
  const idf = opt.idf || idfOf(pool);
  const q = new Set([...tokens(title), ...(opt.extra || [])]);
  if (!q.size) return [];
  const qf = formatsOf(title);
  const qn = Math.sqrt([...q].reduce((a, t) => a + idf(t) ** 2, 0));
  const out = [];
  for (const v of pool) {
    if (opt.skip && opt.skip.has(v.id)) continue;
    const toks = keyToks(v);
    let dot = 0, vn = 0;
    for (const t of toks) { const w = idf(t); vn += w * w; if (q.has(t)) dot += w * w; }
    if (!dot) continue;
    let sim = dot / (qn * Math.sqrt(vn || 1));
    const vf = formatsOf(v.title);
    if (qf.length && vf.some((f) => qf.includes(f))) sim += 0.08;
    out.push({ v, sim: Math.min(1, sim) });
  }
  return out.sort((a, b) => b.sim - a.sim).slice(0, k);
}

// ---------- 3) 소재 예측: 이 제목이면 내 채널에서 평소의 몇 배쯤? ----------
// 비슷한 레퍼런스 영상들이 '그 채널 평소 대비' 몇 배 나왔는지를 비슷한 정도로 가중해서 모아요.
// 표본이 적으면 1배 쪽으로 당겨서 과장하지 않아요.
export function predict(title, pool, dna, opt = {}) {
  const cand = live(pool).filter((v) => v.ratio != null && (v.age_h || 0) >= 24);
  const nb = similar(title, cand, { k: opt.k || 12, idf: opt.idf }).filter((x) => x.sim >= 0.12);
  if (nb.length < 2) return { conf: 'none', n: nb.length, nb };
  const pairs = nb.map((x) => [Math.log(clamp(Number(x.v.ratio), 0.05, 50)), x.sim]);
  const W = pairs.reduce((a, p) => a + p[1], 0);
  const mu = pairs.reduce((a, p) => a + p[0] * p[1], 0) / W;
  const shrink = W / (W + 1.2);
  let adj = 0;
  // 내 채널에서 이 포맷이 평소보다 잘 됐으면 조금 더 얹어요
  const why = [];
  const fm = formatsOf(title);
  if (dna && dna.fmts) {
    const f = dna.fmts.find((x) => fm.includes(x.k) && x.n >= 3 && x.x);
    if (f) { adj += clamp(Math.log(f.x), -0.4, 0.4) * 0.5; why.push({ k: 'fmt', f: f.k, x: f.x }); }
  }
  if (dna && dna.words) {
    const hit = tokens(title).filter((t) => dna.words.has(t));
    if (hit.length) { adj += Math.min(0.25, hit.length * 0.08); why.push({ k: 'dna', w: hit.slice(0, 3) }); }
  }
  const lm = mu * shrink + adj;
  const lo = (wq(pairs, 0.25) ?? mu) * shrink + adj, hi = (wq(pairs, 0.75) ?? mu) * shrink + adj;
  const mult = Math.exp(lm), mLo = Math.exp(Math.min(lo, lm - 0.15)), mHi = Math.exp(Math.max(hi, lm + 0.15));
  const meanSim = W / nb.length;
  const conf = nb.length >= 6 && meanSim >= 0.3 ? 'hi' : nb.length >= 3 ? 'mid' : 'lo';
  const base = dna && dna.base ? dna.base : null;
  return {
    conf, n: nb.length, mult, lo: mLo, hi: mHi, why, nb: nb.slice(0, 5),
    views: base ? { lo: Math.round(base * mLo), mid: Math.round(base * mult), hi: Math.round(base * mHi), base } : null
  };
}

// ---------- 4) 제목 점검 ----------
const EMOJI = /\p{Extended_Pictographic}/gu;
export function titleCheck(title, kind, dna, hot = []) {
  const s = String(title || '').trim();
  const len = [...s].length;
  const [a, b] = kind === 'long' ? [20, 60] : [8, 40];
  const toks = tokens(s);
  const dnaW = dna && dna.words ? [...dna.words.keys()].slice(0, 15) : [];
  const kwHit = toks.find((t) => dnaW.includes(t) || hot.includes(t)) || null;
  const firstK = kwHit ? s.toLowerCase().indexOf(kwHit) : -1;
  const fm = formatsOf(s);
  const emo = (s.match(EMOJI) || []).length;
  let dup = null;
  if (dna && dna.top) {
    for (const v of dna.top) {
      const o = new Set(tokens(v.title));
      const inter = toks.filter((t) => o.has(t)).length;
      if (toks.length && inter / Math.max(toks.length, o.size) >= 0.7) dup = v.title;
    }
  }
  const checks = [
    { k: 'len', ok: len >= a && len <= b, v: len, a, b, w: 20 },
    { k: 'kw', ok: !!kwHit, v: kwHit, w: 22 },
    { k: 'front', ok: firstK >= 0 && firstK <= 14, v: firstK, w: 10 },
    { k: 'hook', ok: fm.some((f) => ['question', 'twist', 'challenge', 'compare', 'list'].includes(f)), v: fm, w: 20 },
    { k: 'num', ok: /\d/.test(s), w: 10 },
    { k: 'emoji', ok: emo <= 2, v: emo, w: 6 },
    { k: 'dup', ok: !dup, v: dup, w: 12 }
  ];
  const score = Math.round(checks.reduce((acc, c) => acc + (c.ok ? c.w : 0), 0));
  return { score, checks, len, fm };
}

// ---------- 5) 태그 · 해시태그 (비슷한 터진 영상이 쓴 것 위주) ----------
export function tagsFor(title, pool, dna, opt = {}) {
  const nb = similar(title, live(pool), { k: 20, idf: opt.idf });
  const sc = new Map(), show = new Map();
  const add = (raw, w) => {
    const t = String(raw || '').trim().replace(/^#/, '');
    const key = t.toLowerCase();
    if (key.length < 2 || key.length > 30 || STOPW.has(key)) return;
    sc.set(key, (sc.get(key) || 0) + w);
    if (!show.has(key)) show.set(key, t);
  };
  for (const { v, sim } of nb) {
    const w = sim * (0.5 + Math.log2(1 + clamp(Number(v.ratio) || 1, 0.2, 20)));
    for (const tg of v.tags || []) add(tg, w);
  }
  for (const t of tokens(title)) add(t, 1.2);
  if (dna && dna.kws) for (const x of dna.kws.slice(0, 6)) add(x.k, 0.5);
  const ranked = [...sc.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => show.get(k));
  const tags = [];
  let chars = 0;
  for (const t of ranked) {
    if (chars + t.length + 1 > 450 || tags.length >= 20) break;
    tags.push(t);
    chars += t.length + 1;
  }
  const hashtags = ranked.filter((t) => !/\s/.test(t)).slice(0, 3).map((t) => '#' + t);
  return { tags, hashtags, chars, from: nb.length };
}

// ---------- 6) 제목 아이디어: 레퍼런스에서 잘 된 패턴 × 내 소재 ----------
const TPL = {
  ko: {
    number: ['{k} 3가지만 알면 끝', '{k} 딱 1분 정리'],
    question: ['{k}, 진짜 될까?', '왜 다들 {k} 할까?'],
    compare: ['{k} vs {k2} 뭐가 더 나을까?', '비싼 {k} vs 싼 {k}'],
    challenge: ['{k} 직접 해봤더니', '{k} 일주일 해본 결과'],
    twist: ['{k} 하다가 생긴 반전', '{k} 마지막이 레전드'],
    howto: ['{k} 제대로 하는 법', '{k} 이렇게 하면 쉬워요'],
    review: ['{k} 솔직 후기', '{k} 직접 써 본 리뷰'],
    list: ['{k} 순위 TOP 5', '{k} 티어 정리해 봄']
  },
  en: {
    number: ['3 {k} tips that actually work', '{k} in 60 seconds'],
    question: ['Does {k} really work?', 'Why is everyone doing {k}?'],
    compare: ['{k} vs {k2}: which is better?', 'Cheap {k} vs expensive {k}'],
    challenge: ['I tried {k} so you don’t have to', 'I did {k} for a week'],
    twist: ['{k} went completely wrong', 'Wait for the {k} ending'],
    howto: ['How to do {k} the right way', 'The easiest {k} hack'],
    review: ['Honest {k} review', '{k}: worth it?'],
    list: ['Top 5 {k}', '{k} tier list']
  },
  ja: {
    number: ['{k}のコツ3つ', '1分でわかる{k}'],
    question: ['{k}って本当に効く？', 'なぜみんな{k}するの？'],
    compare: ['{k} vs {k2} どっちがいい？', '高い{k}と安い{k}'],
    challenge: ['{k}やってみた', '{k}を1週間やってみた結果'],
    twist: ['{k}でまさかの展開', '{k}の結末が衝撃'],
    howto: ['{k}の正しいやり方', 'かんたん{k}の裏技'],
    review: ['{k}正直レビュー', '{k}使ってみた'],
    list: ['{k}ランキングTOP5', '{k}ティア表']
  }
};
export function fmtStats(pool) {
  const vids = live(pool).filter((v) => v.ratio != null && (v.age_h || 0) >= 24);
  return FMT.map(([k]) => {
    const xs = vids.filter((v) => formatsOf(v.title).includes(k)).map((v) => Number(v.ratio));
    return { k, n: xs.length, x: median(xs) };
  }).filter((f) => f.n >= 3 && f.x != null).sort((a, b) => b.x - a.x);
}
export function titleIdeas(seed, pool, dna, lang = 'ko', opt = {}) {
  const k = String(seed || '').trim();
  if (!k) return [];
  const st = opt.stats || fmtStats(pool);
  const rel = (opt.related || []).filter((x) => x && x !== k);
  const k2 = rel[0] || '';
  const T = TPL[lang] || TPL.ko;
  const order = [...st, ...FMT.map(([f]) => ({ k: f, n: 0, x: null }))].filter((f, i, a) => a.findIndex((y) => y.k === f.k) === i);
  const out = [];
  for (const f of order) {
    for (const tp of (T[f.k] || []).filter((x) => k2 || !x.includes('{k2}')).slice(0, f.n ? 2 : 1)) {
      let title = tp.replaceAll('{k}', k).replaceAll('{k2}', k2);
      if (lang === 'en') title = title.charAt(0).toUpperCase() + title.slice(1);
      if (!out.some((o) => o.title === title)) out.push({ title, fmt: f.k, x: f.x, n: f.n });
    }
    if (out.length >= (opt.max || 8)) break;
  }
  return out;
}

// ---------- 7) 소재 파도: 여러 레퍼런스에서 같은 소재가 동시에 뜰 때 ----------
export function waves(list, opt = {}) {
  const vids = live(list).filter((v) => v.role !== 'mine' && v.ratio != null);
  const win = (opt.hours || 72);
  const recent = vids.filter((v) => (v.age_h || 1e9) <= win);
  const prior = vids.filter((v) => (v.age_h || 0) > win && (v.age_h || 0) <= 21 * 24);
  const pc = new Map();
  for (const v of prior) for (const t of keyToks(v)) pc.set(t, (pc.get(t) || 0) + 1);
  const m = new Map();
  for (const v of recent) {
    if (Number(v.ratio) < (opt.minX || 1.3)) continue;
    for (const t of keyToks(v)) {
      const o = m.get(t) || { k: t, chans: new Set(), vids: [] };
      o.chans.add(v.channel_id);
      o.vids.push(v);
      m.set(t, o);
    }
  }
  const nCh = new Set(vids.map((v) => v.channel_id)).size;
  const need = nCh >= 8 ? 3 : 2;
  const out = [];
  for (const o of m.values()) {
    if (o.chans.size < need) continue;
    const x = median(o.vids.map((v) => Number(v.ratio))) || 1;
    const before = pc.get(o.k) || 0;
    const fresh = 1 / (1 + before / Math.max(o.vids.length, 1));
    out.push({ k: o.k, chans: o.chans.size, n: o.vids.length, x, fresh, isNew: before === 0, score: o.chans.size * Math.log2(1 + x) * (0.5 + fresh),
      vids: o.vids.sort((a, b) => b.ratio - a.ratio).slice(0, 4) });
  }
  // 같은 영상들로만 이뤄진 겹치는 파도(예: '라면'·'신라면')는 하나만 남겨요
  out.sort((a, b) => b.score - a.score);
  const keep = [];
  for (const w of out) {
    const ids = new Set(w.vids.map((v) => v.id));
    if (keep.some((k) => k.vids.every((v) => ids.has(v.id)) && w.vids.every((v) => k.vids.some((u) => u.id === v.id)))) continue;
    keep.push(w);
    if (keep.length >= (opt.max || 8)) break;
  }
  return keep;
}

// ---------- 8) 구조는 그대로, 소재만 내 것으로 (벤치마킹 제목) ----------
// 터진 레퍼런스 제목의 첫 소재 단어를 내 채널 핵심 소재로 바꿔요. 이미 내 소재면 null
export function swapTopic(title, kw) {
  const t0 = String(title || '');
  const k = String(kw || '').trim();
  const toks = tokens(t0);
  if (!toks.length || !k || toks.includes(k.toLowerCase())) return null;
  const first = toks.find((x) => t0.toLowerCase().includes(x));
  if (!first) return null;
  const i = t0.toLowerCase().indexOf(first);
  const out = (t0.slice(0, i) + k + t0.slice(i + first.length)).replace(/#\S+/g, '').replace(/\s{2,}/g, ' ').trim();
  return out && out !== t0 ? out : null;
}
