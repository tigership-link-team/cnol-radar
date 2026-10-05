// CNOL RADAR 소개 페이지 데이터
// · 48시간 카드: 에이치알컴퍼니가 운영하는 채널의 YouTube 스튜디오 실제 수치 (home-data.json · 확인 시각 표시)
// · 공개 영상 둘러보기: YouTube Data API로 하루 한 번 새로 받은 값 (Supabase radar_public · 누구나 읽기만)
//   긁어 온 데이터는 쓰지 않아요. 수치를 지어내지 않아요.
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const SB_URL = 'https://gbgcoxjnjlrzbwclevul.supabase.co';
const SB_KEY = 'sb_publishable_u1HixC_2hyoQi9Sd_mnaWQ_0nHSrQ8b'; // 공개용 키 — 공개 영상 표만 읽을 수 있어요
const calm = matchMedia('(prefers-reduced-motion: reduce)');

const COPY = {
  ko: {
    collected: '수집 시각', unknown: '미확인',
    search: '소재·영상 제목 검색', searchPlaceholder: '관심 있는 소재를 검색해 보세요',
    all: '전체', shorts: '쇼츠', long: '롱폼', video: '영상', formats: '영상 유형', regions: '채널 지역',
    foreign: '해외', japan: '일본', korea: '한국',
    sort: '정렬', byViews: '조회수순', byLatest: '최신순', byFeatured: '채널별 보기',
    results: '{n}개 영상', showing: '{n}개 중 {shown}개 표시',
    loading: '공개 영상 데이터를 불러오는 중이에요.', failed: '영상 데이터를 불러오지 못했어요. 잠시 뒤 다시 확인해 주세요.',
    empty: '아직 표시할 영상이 없어요.', noMatch: '이 조건에 맞는 영상이 없어요.',
    play: '“{title}” 재생', views: '조회수', likes: '좋아요',
    reference: '공개 영상 레퍼런스 · CNOL 이용 후기와 무관',
    apiSource: 'YouTube Data API로 매일 새로 받은 공개 데이터',
    constellation: '관리 채널과 레퍼런스를, 하나로', connectionExample: '채널 연결 구조 예시 · 가상 아이콘 포함',
    virtualChannel: '가상 채널', combinedHours48: '전체 채널 48시간 조회수',
    studio: '관리하는 여러 채널의 48시간', operatedChannels: '관리 채널', minutes60: '최근 60분 조회수', hours48: '최근 48시간 조회수',
    captured: '확인 시각', studioNote: '에이치알컴퍼니가 직접 운영하는 채널의 YouTube 스튜디오 수치예요 · 표시된 확인 시각 기준',
    sum: '합산', byChannel: '채널별', now: '지금', ago24: '24시간 전', ago30: '30분 전', ago48: '48시간 전', ago60: '60분 전', interval: '구간',
    rtUnavailable: '48시간 조회수 데이터가 아직 없어요.', channelsUnit: '{n}개 채널', more: '채널 {n}개 더 보기', less: '접기'
  },
  en: {
    collected: 'Collected', unknown: 'Unverified',
    search: 'Search topics or video titles', searchPlaceholder: 'Search for a topic you want to explore',
    all: 'All', shorts: 'Shorts', long: 'Long-form', video: 'Video', formats: 'Video type', regions: 'Channel region',
    foreign: 'Global', japan: 'Japan', korea: 'Korea',
    sort: 'Sort', byViews: 'Most viewed', byLatest: 'Newest', byFeatured: 'Across channels',
    results: '{n} videos', showing: 'Showing {shown} of {n}',
    loading: 'Loading public video data.', failed: 'Video data could not be loaded. Please check again later.',
    empty: 'No videos to show yet.', noMatch: 'No videos match these filters.',
    play: 'Play “{title}”', views: 'Views', likes: 'Likes',
    reference: 'Public video references · Not CNOL testimonials',
    apiSource: 'Public data refreshed daily via the YouTube Data API',
    constellation: 'Managed channels and references, together', connectionExample: 'Channel connection illustration · Includes virtual icons',
    virtualChannel: 'Virtual channel', combinedHours48: '48-hour views across all channels',
    studio: '48 hours across the channels you manage', operatedChannels: 'Managed channels', minutes60: 'Views in the last 60 minutes', hours48: 'Views in the last 48 hours',
    captured: 'Captured', studioNote: 'YouTube Studio figures from channels HR Company operates · As of the capture time shown',
    sum: 'Combined', byChannel: 'By channel', now: 'Now', ago24: '24 hours ago', ago30: '30 minutes ago', ago48: '48 hours ago', ago60: '60 minutes ago', interval: 'Interval',
    rtUnavailable: 'No 48-hour view data is available yet.', channelsUnit: '{n} channels', more: 'Show {n} more channels', less: 'Show less'
  },
  ja: {
    collected: '収集日時', unknown: '未確認',
    search: 'ネタ・動画タイトルを検索', searchPlaceholder: '気になるネタを検索してください',
    all: 'すべて', shorts: 'ショート', long: '長尺動画', video: '動画', formats: '動画タイプ', regions: 'チャンネルの地域',
    foreign: '海外', japan: '日本', korea: '韓国',
    sort: '並び順', byViews: '再生数順', byLatest: '新着順', byFeatured: 'チャンネル別',
    results: '{n}本の動画', showing: '{n}本中{shown}本を表示',
    loading: '公開動画のデータを読み込んでいます。', failed: '動画データを読み込めませんでした。しばらくしてから再度ご確認ください。',
    empty: '表示できる動画はまだありません。', noMatch: '条件に合う動画がありません。',
    play: '「{title}」を再生', views: '再生数', likes: '高評価',
    reference: '公開動画リファレンス · CNOLの利用者レビューではありません',
    apiSource: 'YouTube Data APIで毎日更新している公開データ',
    constellation: '管理チャンネルとリファレンスを、ひとつに', connectionExample: 'チャンネル接続のイメージ · 仮想アイコンを含みます',
    virtualChannel: '仮想チャンネル', combinedHours48: '全チャンネルの48時間再生数',
    studio: '管理する複数のチャンネルの48時間', operatedChannels: '管理チャンネル', minutes60: '過去60分の再生数', hours48: '過去48時間の再生数',
    captured: '確認日時', studioNote: 'HR Companyが運営するチャンネルのYouTube Studioの数値です · 表示された確認日時の時点',
    sum: '合計', byChannel: 'チャンネル別', now: '現在', ago24: '24時間前', ago30: '30分前', ago48: '48時間前', ago60: '60分前', interval: '区間',
    rtUnavailable: '48時間の再生数データはまだありません。', channelsUnit: '{n}チャンネル', more: 'さらに{n}チャンネル', less: '閉じる'
  }
};

function node(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) el.textContent = content;
  return el;
}
function language() {
  const lang = document.documentElement.lang.toLowerCase().split('-')[0];
  return Object.hasOwn(COPY, lang) ? lang : 'ko';
}
const c = (key, values) => {
  let s = COPY[language()][key] ?? COPY.ko[key] ?? key;
  if (values) for (const [k, v] of Object.entries(values)) s = s.split(`{${k}}`).join(v);
  return s;
};
const locale = () => ({ ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }[language()]);
const number = (v) => (v === null || v === undefined ? c('unknown') : new Intl.NumberFormat(locale()).format(v));
function text(value, limit = 300) { return typeof value === 'string' ? value.trim().slice(0, limit) : ''; }
function count(value) { const n = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value; return Number.isSafeInteger(n) && n >= 0 ? n : null; }
function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}
function thumbnail(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, location.origin);
    if (url.origin === location.origin && url.pathname.startsWith('/')) return url.href;
    if (url.protocol === 'https:' && /^(?:i\d?\.ytimg\.com|yt3\.ggpht\.com|yt3\.googleusercontent\.com)$/.test(url.hostname)) return url.href;
  } catch { /* 믿을 수 없는 주소는 쓰지 않아요 */ }
  return '';
}
// 채널 국가가 비어 있으면 제목 글자로 지역을 짐작해요 (가나 → 일본, 한글 → 한국)
function guessRegion(region, ...texts) {
  if (region === 'jp' || region === 'kr') return region;
  const s = texts.join(' ');
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(s)) return 'jp';
  if (/[\p{Script=Hangul}]/u.test(s)) return 'kr';
  return 'global';
}
function normalizeVideos(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  const byChannelTitles = new Map();
  for (const v of input) if (v && typeof v.channelId === 'string') byChannelTitles.set(v.channelId, `${byChannelTitles.get(v.channelId) || ''} ${v.title || ''}`);
  return input.slice(0, 500).flatMap((v) => {
    if (!v || typeof v !== 'object' || typeof v.id !== 'string' || !VIDEO_ID.test(v.id) || seen.has(v.id)) return [];
    if (!['shorts', 'long', 'video'].includes(v.format)) return [];
    seen.add(v.id);
    return [{
      id: v.id, title: text(v.title) || 'YouTube', format: v.format, views: count(v.views), likes: count(v.likes),
      publishedAt: date(v.publishedAt), thumbnail: thumbnail(v.thumbnail), channelName: text(v.channelName, 200), channelId: text(v.channelId, 40),
      region: guessRegion(v.region, v.channelName || '', byChannelTitles.get(v.channelId) || '')
    }];
  });
}
// 채널마다 돌아가며 섞어요 (한 채널 영상만 몰리지 않게)
function balanced(videos) {
  const groups = new Map();
  for (const v of [...videos].sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))) {
    const k = v.channelId || v.channelName || v.id;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(v);
  }
  const out = [];
  while ([...groups.values()].some((g) => g.length)) for (const g of groups.values()) if (g.length) out.push(g.shift());
  return out;
}

// ---------- 48시간 (운영 채널 실제 스냅샷) ----------
function normalizeRealtime(input) {
  if (!input || typeof input !== 'object') return null;
  const capturedAt = date(input.capturedAt);
  const channelCount = count(input.channelCount);
  const views48 = count(input.views48); const views60 = count(input.views60);
  const bars48 = Array.isArray(input.bars48) ? input.bars48.map(count) : [];
  const bars60 = Array.isArray(input.bars60) ? input.bars60.map(count) : [];
  if (!capturedAt || channelCount === null || channelCount < 1 || views48 === null || views60 === null
    || bars48.length !== 48 || bars60.length !== 60 || bars48.includes(null) || bars60.includes(null)
    || bars48.reduce((s, v) => s + v, 0) !== views48 || bars60.reduce((s, v) => s + v, 0) !== views60) return null;
  const channels = (Array.isArray(input.channels) ? input.channels : []).slice(0, 200).flatMap((ch, i) => {
    if (!ch || typeof ch !== 'object') return [];
    const hourly48 = Array.isArray(ch.hourly48) ? ch.hourly48.map(count) : [];
    const total48 = count(ch.total48);
    if (hourly48.length !== 48 || hourly48.includes(null) || total48 === null || hourly48.reduce((s, v) => s + v, 0) !== total48) return [];
    return [{ id: text(ch.id, 60) || String(i + 1), name: text(ch.displayName || ch.name, 200) || `CHANNEL ${String(i + 1).padStart(2, '0')}`,
      named: !/^CHANNEL\s\d+$/i.test(text(ch.displayName || ch.name, 200)), thumbnail: thumbnail(ch.thumbnail), hourly48, total48, minute60: count(ch.minute60) }];
  });
  return { capturedAt, channelCount, views48, views60, bars48, bars60, channels, source: text(input.source, 150) || 'YouTube Studio' };
}

// 큰 숫자를 0부터 차오르게 (움직임을 줄이는 설정이면 바로)
function countUp(el, value) {
  el.setAttribute('aria-label', number(value));
  if (calm.matches || !('IntersectionObserver' in window)) { el.textContent = number(value); return; }
  el.textContent = number(0);
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    const t0 = performance.now(), dur = 1300;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = number(Math.round(value * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.4 });
  io.observe(el);
}

function bars(values, ago, middle, caption, cls = '') {
  const fig = node('figure', 'hd-studio-chart ' + cls);
  if (caption) fig.append(node('figcaption', '', caption));
  const series = node('div', 'hd-studio-series');
  series.style.setProperty('--hd-series-count', String(values.length));
  const max = Math.max(1, ...values);
  values.forEach((v, i) => {
    const b = node('span', 'hd-studio-bar');
    b.classList.toggle('is-zero', v === 0);
    b.style.height = `${(v / max) * 100}%`;
    b.title = `${c('interval')} ${i + 1} · ${c('views')} ${number(v)}`;
    series.append(b);
  });
  series.setAttribute('role', 'img');
  series.setAttribute('aria-label', `${caption || ''} ${c('views')} ${number(values.reduce((s, v) => s + v, 0))}`);
  const axis = node('div', 'hd-studio-axis');
  axis.append(node('span', '', c(ago)), node('span', '', c(middle)), node('span', '', c('now')));
  fig.append(series, axis);
  return fig;
}

function stamp(data) {
  const t = node('time', 'hd-studio-stamp', `${c('captured')} ${new Intl.DateTimeFormat(locale(), {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(data.capturedAt)} KST`);
  t.dateTime = data.capturedAt.toISOString();
  return t;
}

// 유튜브 스튜디오 '실시간' 카드처럼: 48시간 합계를 아주 크게
function studioSnapshot(data, { compact = false } = {}) {
  const panel = node('section', `hd-studio-snapshot v10${compact ? ' is-compact' : ''}`);
  panel.setAttribute('aria-label', c('studio'));
  const head = node('div', 'hd-studio-head');
  head.append(node('h3', '', c('studio')), node('span', 'hd-studio-source', data.source));
  const hero = node('div', 'hd-studio-hero');
  const lbl = node('span', 'lbl');
  lbl.append(node('i'), document.createTextNode(c('combinedHours48')));
  const big = node('strong', 'big');
  countUp(big, data.views48);
  const side = node('div', 'side');
  const s1 = node('span', '', c('operatedChannels')); s1.append(node('b', '', number(data.channelCount)));
  const s2 = node('span', '', c('minutes60')); s2.append(node('b', '', number(data.views60)));
  side.append(s1, s2);
  hero.append(lbl, big, side);
  if (compact) {
    panel.append(hero, bars(data.bars48, 'ago48', 'ago24', '', 'is-mini'));
    return panel;
  }
  const charts = node('div', 'hd-studio-charts');
  const modes = node('div', 'hd-studio-modes');
  modes.setAttribute('role', 'group');
  modes.setAttribute('aria-label', c('studio'));
  let mode = 'sum', showAll = false;
  const named = data.channels;
  const btns = (named.length ? ['sum', 'channels'] : ['sum']).map((m) => {
    const b = node('button', 'hd-chip', m === 'sum' ? c('sum') : `${c('byChannel')} · ${number(named.length)}`);
    b.type = 'button';
    b.addEventListener('click', () => { mode = m; draw(); });
    b.dataset.mode = m;
    modes.append(b);
    return b;
  });
  function draw() {
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    charts.replaceChildren();
    charts.classList.toggle('is-channel-view', mode === 'channels');
    if (mode === 'sum') {
      charts.append(bars(data.bars48, 'ago48', 'ago24', c('combinedHours48'), 'is-combined'), bars(data.bars60, 'ago60', 'ago30', c('minutes60')));
      return;
    }
    const list = showAll ? named : named.slice(0, 9);
    for (const ch of list) {
      const card = node('article', 'hd-channel-snapshot');
      const h = node('h4');
      if (ch.thumbnail) { const im = node('img', 'hd-ch-av'); im.src = ch.thumbnail; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; im.addEventListener('error', () => im.remove(), { once: true }); h.append(im); }
      h.append(document.createTextNode(ch.name));
      card.append(h, node('strong', 'hd-channel-total', number(ch.total48)), bars(ch.hourly48, 'ago48', 'ago24', c('hours48')));
      charts.append(card);
    }
    if (named.length > 9) {
      const more = node('button', 'hd-chip hd-more', showAll ? c('less') : c('more', { n: number(named.length - 9) }));
      more.type = 'button';
      more.addEventListener('click', () => { showAll = !showAll; draw(); });
      charts.append(more);
    }
  }
  draw();
  panel.append(head, stamp(data), hero, modes, charts, node('p', 'hd-studio-note', c('studioNote')));
  return panel;
}

// 채널들이 하나의 대시보드로 모이는 그림 — 회사 채널(허락받은 3곳)과 가상 아이콘만 써요
function constellation(data) {
  const wrap = node('div', 'hd-constellation');
  const head = node('div', 'hd-constellation-head');
  head.append(node('h3', '', c('constellation')), node('span', 'hd-connection-caption', c('connectionExample')));
  wrap.append(head);
  const real = data.channels.filter((ch) => ch.named).slice(0, 6).map((ch) => ({ id: ch.id, name: ch.name, thumbnail: ch.thumbnail }));
  const marks = [
    { mark: 'BOLT', color: '#ffc928', style: 'bolt' }, { mark: '星', color: '#f44355', style: 'star' }, { mark: '♫', color: '#ff762d', style: 'music' },
    { mark: 'GAME', color: '#16a36a', style: 'game' }, { mark: 'FILM', color: '#6954dd', style: 'film' }, { mark: '波', color: '#167fea', style: 'wave' },
    { mark: '▶', color: '#dd4389', style: 'play' }
  ];
  const faces = [0, 1, 3, 5, 8, 10, 12, 14, 17, 21, 23, 25, 28];
  const total = 30;
  const virtual = Array.from({ length: Math.max(0, total - real.length) }, (_, i) => (i % 5 === 1 || i % 5 === 3)
    ? { id: `m${i}`, name: `${c('virtualChannel')} ${String(i + 1).padStart(2, '0')}`, virtual: true, ...marks[i % marks.length] }
    : { id: `p${i}`, name: `${c('virtualChannel')} ${String(i + 1).padStart(2, '0')}`, virtual: true, portrait: faces[i % faces.length] });
  // 실제 채널은 가운데 근처에 흩어 놓아요
  const chosen = [...virtual];
  real.forEach((ch, k) => chosen.splice(Math.min(chosen.length, 6 + k * 7), 0, ch));
  const stage = node('div', 'hd-constellation-stage is-row');
  const scroll = node('div', 'hd-logo-scroll');
  const strip = node('div', 'hd-logo-strip');
  strip.style.setProperty('--hd-logo-count', String(chosen.length));
  scroll.append(strip); stage.append(scroll);
  const ns = 'http://www.w3.org/2000/svg';
  const lines = document.createElementNS(ns, 'svg');
  lines.classList.add('hd-constellation-lines');
  lines.setAttribute('viewBox', '0 0 1200 145'); lines.setAttribute('preserveAspectRatio', 'none');
  lines.setAttribute('aria-hidden', 'true'); lines.setAttribute('focusable', 'false');
  stage.append(lines);
  const swatches = ['#8b5cf6', '#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#14b8a6', '#ef4444', '#a855f7', '#3b82f6'];
  chosen.forEach((ch, i) => {
    const x = ((i + 0.5) / chosen.length) * 1200;
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', `M ${x} 0 C ${x} 50, 600 55, 600 136`);
    path.setAttribute('class', 'hd-constellation-path is-active');
    path.style.setProperty('--hd-delay', `${i * -0.55}s`);
    lines.append(path);
    const item = node('div', `hd-constellation-node is-row is-active${ch.virtual ? ` is-virtual ${ch.portrait !== undefined ? 'is-portrait' : `is-mark is-${ch.style}`}` : ' is-real'}`);
    item.style.setProperty('--hd-delay', `${i * -0.55}s`);
    item.style.setProperty('--hd-avatar-color', ch.color || swatches[i % swatches.length]);
    if (ch.portrait !== undefined) item.style.setProperty('--hd-avatar-position', `${(ch.portrait % 6) * 20}% ${Math.floor(ch.portrait / 6) * 25}%`);
    item.title = ch.name;
    item.setAttribute('role', 'img');
    item.setAttribute('aria-label', ch.name);
    const floating = node('div', 'hd-constellation-floating');
    const avatar = node('span', 'hd-constellation-avatar', ch.virtual ? ch.mark || '' : Array.from(ch.name).slice(0, 2).join(''));
    if (ch.thumbnail) {
      const im = node('img'); im.src = ch.thumbnail; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
      im.addEventListener('error', () => im.remove(), { once: true });
      avatar.append(im);
    }
    const label = node('span', 'hd-constellation-name', ch.name);
    floating.append(avatar, label); item.append(floating); strip.append(item);
  });
  const hub = node('div', 'hd-constellation-hub');
  hub.append(node('span', 'hd-constellation-hub-dot'), node('span', '', c('combinedHours48')));
  stage.append(hub);
  wrap.append(stage);
  return wrap;
}

// ---------- 공개 영상 둘러보기 (한 곳에만) ----------
function wall(section) {
  const wrap = section.querySelector('[data-wall]');
  if (!wrap) return null;
  const st = { videos: [], status: 'loading', query: '', format: 'all', region: 'all', sort: 'featured', collectedAt: null };
  const toolbar = node('div', 'hd-toolbar');
  const label = node('label', 'hd-search');
  const sr = node('span', 'hd-sr-only');
  const icon = node('span', 'hd-search-icon', '⌕'); icon.setAttribute('aria-hidden', 'true');
  const input = node('input', 'hd-search-input');
  input.type = 'search'; input.maxLength = 150; input.autocomplete = 'off';
  label.append(sr, icon, input);
  const formats = node('div', 'hd-filters'); formats.setAttribute('role', 'group');
  const regions = node('div', 'hd-filters hd-region-filters'); regions.setAttribute('role', 'group');
  const sortL = node('label', 'hd-sort');
  const sortT = node('span');
  const select = node('select', 'hd-sort-select');
  for (const v of ['featured', 'views', 'latest']) { const o = node('option'); o.value = v; select.append(o); }
  sortL.append(sortT, select);
  toolbar.append(label, formats, regions, sortL);
  const line = node('div', 'hd-result-line');
  const resultCount = node('p', 'hd-result-count');
  resultCount.setAttribute('aria-live', 'polite');
  const ref = node('p', 'hd-reference');
  line.append(resultCount, ref);
  const grid = node('div', 'hd-grid');
  const status = node('p', 'hd-status'); status.setAttribute('role', 'status');
  wrap.append(toolbar, line, grid, status);
  let deb;
  input.addEventListener('input', () => { st.query = input.value; clearTimeout(deb); deb = setTimeout(draw, 120); });
  select.addEventListener('change', () => { st.sort = select.value; draw(); });

  function chips(box, list, key) {
    box.replaceChildren();
    for (const [value, labelKey] of list) {
      const b = node('button', 'hd-chip', c(labelKey));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(st[key] === value));
      b.addEventListener('click', () => { st[key] = value; draw(); });
      box.append(b);
    }
  }
  function filtered() {
    const q = st.query.trim().toLocaleLowerCase(locale());
    const by = (a, b) => (b.views ?? -1) - (a.views ?? -1);
    let list = st.videos.filter((v) => (st.format === 'all' || v.format === st.format) && (st.region === 'all' || v.region === st.region)
      && (!q || `${v.title} ${v.channelName}`.toLocaleLowerCase(locale()).includes(q)));
    if (st.sort === 'views') list = list.sort(by);
    else if (st.sort === 'latest') list = list.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
    else list = balanced(list);
    return list;
  }
  function card(v) {
    const art = node('article', 'hd-video-card');
    const btn = node('button', `creator-video hd-video-media${v.format !== 'shorts' ? ' is-long' : ''}`);
    btn.type = 'button';
    btn.dataset.video = v.id; btn.dataset.format = v.format; btn.dataset.title = v.title; btn.dataset.channel = v.channelName;
    btn.setAttribute('aria-label', c('play', { title: v.title }));
    const fb = node('span', 'hd-thumb-fallback', 'YouTube'); fb.setAttribute('aria-hidden', 'true');
    btn.append(fb);
    if (v.thumbnail) {
      const im = node('img', 'hd-video-image'); im.src = v.thumbnail; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; im.width = 480; im.height = 360;
      im.addEventListener('error', () => im.remove(), { once: true });
      btn.append(im);
    }
    const badge = node('span', 'hd-video-format', c(v.format)); badge.setAttribute('aria-hidden', 'true');
    const play = node('span', 'creator-play hd-play', '▶'); play.setAttribute('aria-hidden', 'true');
    btn.append(badge, play);
    const title = node('h3', 'hd-video-title', v.title); title.title = v.title;
    const vals = node('p', 'hd-video-values', `${c('views')} ${number(v.views)}`);
    const src = node('p', 'hd-video-source');
    src.append(node('span', 'hd-youtube-label', v.channelName || 'YouTube'),
      node('span', 'hd-video-date', v.publishedAt ? new Intl.DateTimeFormat(locale(), { timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric' }).format(v.publishedAt) : ''));
    art.append(btn, title, vals, src);
    return art;
  }
  function draw() {
    sr.textContent = c('search'); input.placeholder = c('searchPlaceholder');
    formats.setAttribute('aria-label', c('formats')); regions.setAttribute('aria-label', c('regions'));
    sortT.textContent = c('sort');
    select.querySelectorAll('option').forEach((o) => { o.textContent = c({ featured: 'byFeatured', views: 'byViews', latest: 'byLatest' }[o.value]); });
    select.value = st.sort;
    const has = (k, v) => st.videos.some((x) => x[k] === v);
    chips(formats, [['all', 'all'], ...[['shorts', 'shorts'], ['long', 'long']].filter(([v]) => has('format', v))], 'format');
    chips(regions, [['all', 'all'], ...[['global', 'foreign'], ['jp', 'japan'], ['kr', 'korea']].filter(([v]) => has('region', v))], 'region');
    const ready = st.status === 'ready' && st.videos.length;
    toolbar.hidden = !ready; line.hidden = !ready;
    ref.textContent = `${c('reference')} · ${c('apiSource')}${st.collectedAt ? ` · ${c('collected')} ${new Intl.DateTimeFormat(locale(), { timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(st.collectedAt)} KST` : ''}`;
    if (!ready) {
      grid.replaceChildren();
      status.hidden = false;
      status.textContent = c(st.status === 'loading' ? 'loading' : st.status === 'failed' ? 'failed' : 'empty');
      return;
    }
    const list = filtered();
    grid.replaceChildren(...list.slice(0, 24).map(card));
    resultCount.textContent = list.length > 24 ? c('showing', { n: number(list.length), shown: number(24) }) : c('results', { n: number(list.length) });
    status.hidden = list.length > 0;
    status.textContent = c('noMatch');
  }
  draw();
  return {
    set(videos, collectedAt, status) { st.videos = videos; st.collectedAt = collectedAt; st.status = status; draw(); },
    redraw: draw
  };
}

// ---------- 붙이기 ----------
const state = { realtime: null, wall: null };
function renderPanels() {
  const rt = state.realtime;
  document.querySelectorAll('[data-live-panel="multi"]').forEach((panel) => {
    panel.classList.add('hd-live-panel', 'hd-multi-dashboard');
    panel.replaceChildren();
    if (!rt) { panel.append(node('p', 'hd-chart-empty', c('rtUnavailable'))); return; }
    panel.append(constellation(rt));
    const agg = node('div', 'hd-constellation-aggregate');
    agg.append(studioSnapshot(rt));
    panel.append(agg);
  });
  document.querySelectorAll('[data-live-panel="hero48"]').forEach((panel) => {
    panel.classList.add('hd-live-panel', 'hd-hero-dashboard');
    panel.replaceChildren();
    if (rt) panel.append(studioSnapshot(rt, { compact: true }));
  });
}
const demo = document.getElementById('demo');
if (demo) state.wall = wall(demo);
renderPanels();
new MutationObserver(() => { renderPanels(); state.wall?.redraw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

// 48시간 스냅샷 (정적 파일 하나 · 다시 묻지 않아요)
fetch('/home-data.json', { credentials: 'omit' })
  .then((r) => (r.ok ? r.json() : null))
  .then((d) => { state.realtime = normalizeRealtime(d?.realtime); renderPanels(); })
  .catch(() => renderPanels());

// 공개 영상 (공식 API로 하루 한 번 새로 받은 값)
fetch(`${SB_URL}/rest/v1/radar_public?key=eq.showcase&select=value`, { headers: { apikey: SB_KEY }, credentials: 'omit' })
  .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
  .then((rows) => {
    const v = rows?.[0]?.value;
    const videos = normalizeVideos(v?.videos);
    state.wall?.set(videos, date(v?.collectedAt), videos.length ? 'ready' : 'empty');
  })
  .catch(() => state.wall?.set([], null, 'failed'));
