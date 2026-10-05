// Homepage discovery uses one public snapshot. It never invents a time series.
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const COPY = {
  ko: {
    over: '내 채널, 한 화면', heading: '내가 관리하는 여러 채널을, 한눈에',
    lead: '채널마다 들어가지 않아도, 최근 48시간의 시간별 조회수 흐름을 함께 확인하세요.',
    collected: '수집 시각', unknownDate: '수집 시각 미확인', unknown: '미확인',
    chart: '영상별 누적 조회수', chartNote: '수집 시점의 누적 조회수 상위 영상 · 막대를 눌러 재생',
    count: '등록 영상', total: '확인된 누적 조회수 합계', best: '최고 누적 조회수',
    metricNote: '조회수는 영상별 누적 수치입니다. 미확인 값은 합계에서 제외합니다.',
    search: '소재·영상 제목 검색', searchPlaceholder: '관심 있는 소재를 검색해보세요',
    all: '전체', companyFilter: '회사', shorts: '쇼츠', long: '롱폼', video: '영상', topics: '소재', formats: '영상 유형',
    foreign: '해외', japan: '일본', regions: '채널 지역', constellation: '관리 채널과 레퍼런스를, 하나로', collectedChannels: '공개 레퍼런스 채널', channelEmpty: '아직 표시할 채널 정보가 없습니다.',
    connectionExample: '채널 연결 구조 예시 · 가상 아이콘 포함', managedChannel: '운영 채널', virtualChannel: '가상 채널', sum: '합산', byChannel: '채널별', now: '지금', ago24: '24시간 전', ago30: '30분 전', rtUnavailable: '48시간 조회수 데이터가 아직 없습니다.',
    sort: '정렬', byViews: '조회수순', byLatest: '최신순', byFeatured: '채널별 보기',
    results: '{n}개 영상', showing: '{n}개 중 {shown}개 표시',
    loading: '공개 영상 데이터를 불러오는 중입니다.',
    failed: '영상 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.',
    empty: '아직 수집된 영상이 없습니다.', noMatch: '이 조건에 맞는 영상이 없습니다.',
    noViews: '누적 조회수가 확인된 영상이 아직 없습니다.',
    play: '“{title}” 재생', views: '조회수', likes: '좋아요', published: '게시일',
    reference: '공개 영상 레퍼런스 · CNOL 이용 후기와 무관',
    company: '회사 채널 한눈에', subscribers: '구독자', channelViews: '누적 조회수', videos: '영상',
    channelCount: '회사 채널', sampleViews: '수집 영상 누적 조회수',
    publicSnapshot: '공개 데이터 대시보드', compare: '공개 영상 조회수',
    titleReferences: '실제 영상 제목', topicReferences: '조회수로 보는 영상 소재', source: 'YouTube 공개 영상',
    studio: '관리하는 여러 채널의 48시간', operatedChannels: '관리 채널', hours48: '최근 48시간 조회수', combinedHours48: '전체 채널 48시간 조회수',
    minutes60: '최근 60분 조회수', captured: '확인 시각', studioNote: '운영 데이터 미리보기 · 표시된 확인 시각 기준',
    ago48: '48시간 전', ago60: '60분 전', capturePoint: '확인 시점', interval: '구간'
  },
  en: {
    over: 'Your channels, one view', heading: 'Every channel you manage, in one view',
    lead: 'See hourly views across your channels over the last 48 hours, without opening each channel separately.',
    collected: 'Collected', unknownDate: 'Collection time unverified', unknown: 'Unverified',
    chart: 'Cumulative views by video', chartNote: 'Top cumulative views at collection time · Select a bar to play',
    count: 'Collected videos', total: 'Sum of verified cumulative views', best: 'Highest cumulative views',
    metricNote: 'Views are cumulative for each video. Unverified values are excluded from the sum.',
    search: 'Search topics or video titles', searchPlaceholder: 'Search for a topic you want to explore',
    all: 'All', companyFilter: 'Company', shorts: 'Shorts', long: 'Long-form', video: 'Video', topics: 'Topics', formats: 'Video type',
    foreign: 'International', japan: 'Japan', regions: 'Channel region', constellation: 'Managed channels and references, together', collectedChannels: 'Public reference channels', channelEmpty: 'No channel information is available yet.',
    connectionExample: 'Channel connection illustration · Includes virtual icons', managedChannel: 'Managed channel', virtualChannel: 'Virtual channel', sum: 'Combined', byChannel: 'By channel', now: 'Now', ago24: '24 hours earlier', ago30: '30 minutes earlier', rtUnavailable: 'No 48-hour view data is available yet.',
    sort: 'Sort', byViews: 'Most viewed', byLatest: 'Newest', byFeatured: 'Across channels',
    results: '{n} videos', showing: 'Showing {shown} of {n}',
    loading: 'Loading public video data.', failed: 'Video data could not be loaded. Please check again later.',
    empty: 'No videos have been collected yet.', noMatch: 'No videos match these filters.',
    noViews: 'No videos have verified cumulative view counts yet.',
    play: 'Play “{title}”', views: 'Views', likes: 'Likes', published: 'Published',
    reference: 'Public video references · Not CNOL testimonials',
    company: 'Company channels at a glance', subscribers: 'Subscribers', channelViews: 'Cumulative views', videos: 'Videos',
    channelCount: 'Company channels', sampleViews: 'Collected videos’ cumulative views',
    publicSnapshot: 'Public data dashboard', compare: 'Public video views',
    titleReferences: 'Actual video titles', topicReferences: 'Video topics by view count', source: 'Public YouTube videos',
    studio: '48 hours across the channels you manage', operatedChannels: 'Managed channels', hours48: 'Views in the last 48 hours', combinedHours48: '48-hour views across all channels',
    minutes60: 'Views in the last 60 minutes', captured: 'Captured', studioNote: 'Channel operations preview · As of the displayed capture time',
    ago48: '48 hours earlier', ago60: '60 minutes earlier', capturePoint: 'Capture time', interval: 'Interval'
  },
  ja: {
    over: '自分のチャンネルを、ひとつの画面に', heading: '管理する複数のチャンネルを、一目で',
    lead: 'チャンネルごとに開かず、過去48時間の時間別再生数をまとめて確認できます。',
    collected: '収集日時', unknownDate: '収集日時は未確認', unknown: '未確認',
    chart: '動画別の累計再生数', chartNote: '収集時点の累計再生数上位 · 棒を押すと再生',
    count: '収集動画', total: '確認できた累計再生数の合計', best: '最多の累計再生数',
    metricNote: '再生数は動画ごとの累計値です。未確認の値は合計に含みません。',
    search: 'ネタ・動画タイトルを検索', searchPlaceholder: '気になるネタを検索してください',
    all: 'すべて', companyFilter: '会社', shorts: 'ショート', long: '長尺動画', video: '動画', topics: 'ネタ', formats: '動画タイプ',
    foreign: '海外', japan: '日本', regions: 'チャンネルの地域', constellation: '管理チャンネルとリファレンスを、ひとつに', collectedChannels: '公開リファレンスチャンネル', channelEmpty: '表示できるチャンネル情報はまだありません。',
    connectionExample: 'チャンネル接続のイメージ · 仮想アイコンを含みます', managedChannel: '運営チャンネル', virtualChannel: '仮想チャンネル', sum: '合計', byChannel: 'チャンネル別', now: '現在', ago24: '24時間前', ago30: '30分前', rtUnavailable: '48時間の再生数データはまだありません。',
    sort: '並び順', byViews: '再生数順', byLatest: '新着順', byFeatured: 'チャンネル別',
    results: '{n}本の動画', showing: '{n}本中{shown}本を表示',
    loading: '公開動画のデータを読み込んでいます。',
    failed: '動画データを読み込めませんでした。しばらくしてから再度ご確認ください。',
    empty: 'まだ動画が収集されていません。', noMatch: '条件に合う動画がありません。',
    noViews: '累計再生数を確認できた動画がまだありません。',
    play: '「{title}」を再生', views: '再生数', likes: '高評価', published: '公開日',
    reference: '公開動画リファレンス · CNOLの利用者レビューではありません',
    company: '会社のチャンネル一覧', subscribers: '登録者', channelViews: '累計再生数', videos: '動画',
    channelCount: '会社チャンネル', sampleViews: '収集動画の累計再生数',
    publicSnapshot: '公開データダッシュボード', compare: '公開動画の再生数',
    titleReferences: '実際の動画タイトル', topicReferences: '再生数から見る動画のネタ', source: 'YouTube公開動画',
    studio: '管理する複数のチャンネルの48時間', operatedChannels: '管理チャンネル', hours48: '過去48時間の再生数', combinedHours48: '全チャンネルの48時間再生数',
    minutes60: '過去60分の再生数', captured: '確認日時', studioNote: '運営データのプレビュー · 表示された確認日時の時点',
    ago48: '48時間前', ago60: '60分前', capturePoint: '確認時点', interval: '区間'
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

function text(value, limit = 300) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function count(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return null;
  const result = new Date(value);
  return Number.isFinite(result.getTime()) ? result : null;
}

function thumbnail(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, location.origin);
    if (url.origin === location.origin && url.pathname.startsWith('/')) return url.href;
    if (url.protocol === 'https:' && /^(?:i\d?\.ytimg\.com|yt3\.ggpht\.com|yt3\.googleusercontent\.com)$/.test(url.hostname)) return url.href;
  } catch { /* Untrusted or malformed URLs are not rendered. */ }
  return '';
}

function normalizeVideos(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  return input.slice(0, 1000).flatMap((item) => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !VIDEO_ID.test(item.id)
      || seen.has(item.id) || !['shorts', 'long', 'video'].includes(item.format)) return [];
    seen.add(item.id);
    const topics = Array.isArray(item.topics) ? item.topics : typeof item.topic === 'string' ? [item.topic] : [];
    return [{
      id: item.id, title: text(item.title) || 'YouTube', format: item.format,
      views: count(item.views), likes: count(item.likes), publishedAt: date(item.publishedAt),
      thumbnail: thumbnail(item.thumbnail), channelName: text(item.channelName, 200),
      channelId: text(item.channelId, 40), company: item.company === true,
      region: ['global', 'jp', 'kr'].includes(item.region) ? item.region : null,
      topics: [...new Set(topics.map((value) => text(value, 40)).filter(Boolean))].slice(0, 8)
    }];
  });
}

function normalizeChannels(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 100).flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const name = text(item.name || item.title || item.channelName, 200);
    if (!name) return [];
    return [{ id: text(item.id, 40), name, subscribers: count(item.subscriberCount), views: count(item.viewCount),
      videos: count(item.videoCount), thumbnail: thumbnail(item.thumbnail),
      region: ['global', 'jp', 'kr'].includes(item.region) ? item.region : null, company: item.company === true }];
  });
}

function referenceChannels(data) {
  const channels = normalizeChannels(data?.channels);
  const byId = new Map(channels.filter((channel) => channel.id).map((channel) => [channel.id, channel]));
  for (const video of normalizeVideos(data?.videos)) {
    if (video.channelId && video.channelName && !byId.has(video.channelId)) byId.set(video.channelId, {
      id: video.channelId, name: video.channelName, thumbnail: '', region: video.region, company: video.company
    });
  }
  return [...byId.values()];
}

function videoRegions(videos, channels) {
  const regions = new Map(channels.map((channel) => [channel.id, channel.region]));
  return videos.map((video) => ({ ...video, region: video.region || regions.get(video.channelId) || null }));
}

function inRegion(item, selected) {
  return selected === 'all' || selected === 'foreign' && item.region === 'global' || selected === 'jp' && item.region === 'jp';
}

function balancedVideos(videos, featuredIds = []) {
  const byId = new Map(videos.map((video) => [video.id, video]));
  const chosen = [...new Set(featuredIds)].map((id) => byId.get(id)).filter(Boolean);
  const used = new Set(chosen.map((video) => video.id));
  const groups = new Map();
  const newest = [...videos].sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  for (const video of newest) {
    if (used.has(video.id)) continue;
    const key = video.channelId || video.channelName || video.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(video);
  }
  while ([...groups.values()].some((group) => group.length)) {
    for (const group of groups.values()) if (group.length) chosen.push(group.shift());
  }
  return chosen;
}

function constellation(data, selected = 'all', onChange) {
  const lang = language(); const c = (key) => COPY[lang][key] || key;
  const wrap = node('div', 'hd-constellation');
  const header = node('div', 'hd-constellation-head');
  header.append(node('h3', '', c('constellation')));
  header.append(node('span', 'hd-connection-caption', c('connectionExample'))); wrap.append(header);
  const connected = normalizeChannels(data?.connectionChannels);
  const actual = (connected.length ? connected : referenceChannels(data).filter((channel) => !channel.company && ['global', 'jp'].includes(channel.region))).slice(0, 18);
  const portraits = [0, 1, 3, 4, 8];
  const marks = [
    { mark: 'BOLT', color: '#ffc928', style: 'bolt' }, { mark: '星', color: '#f44355', style: 'star' },
    { mark: '♫', color: '#ff762d', style: 'music' }, { mark: 'GAME', color: '#16a36a', style: 'game' },
    { mark: 'FILM', color: '#6954dd', style: 'film' }, { mark: '波', color: '#167fea', style: 'wave' },
    { mark: '▶', color: '#dd4389', style: 'play' }
  ];
  const pattern = ['portrait', 'mark', 'mark', 'portrait', 'mark', 'portrait', 'mark', 'mark', 'portrait', 'mark', 'portrait', 'mark'];
  let portraitIndex = 0; let markIndex = 0;
  const virtual = Array.from({ length: Math.max(0, 30 - actual.length) }, (_, index) => {
    const isPortrait = pattern[index] === 'portrait';
    const appearance = isPortrait ? { portrait: true, spriteIndex: portraits[portraitIndex++] }
      : { ...marks[markIndex++ % marks.length], portrait: false };
    return { id: `virtual-${index + 1}`, name: `${c('virtualChannel')} ${String(index + 1).padStart(2, '0')}`,
      thumbnail: '', virtual: true, ...appearance };
  });
  const chosen = actual.slice(0, 8);
  const remaining = actual.slice(8);
  for (let index = 0; index < Math.max(remaining.length, virtual.length); index++) {
    if (virtual[index]) chosen.push(virtual[index]);
    if (remaining[index]) chosen.push(remaining[index]);
  }
  const stage = node('div', 'hd-constellation-stage is-row');
  const scroll = node('div', 'hd-logo-scroll');
  const strip = node('div', 'hd-logo-strip');
  strip.style.setProperty('--hd-logo-count', String(chosen.length));
  scroll.append(strip); stage.append(scroll);
  const swatches = ['#8b5cf6','#0ea5e9','#ec4899','#10b981','#f59e0b','#6366f1','#14b8a6','#ef4444','#a855f7','#3b82f6'];
  const ns = 'http://www.w3.org/2000/svg';
  const lines = document.createElementNS(ns, 'svg');
  lines.classList.add('hd-constellation-lines');
  lines.setAttribute('viewBox', '0 0 1200 145'); lines.setAttribute('preserveAspectRatio', 'none');
  lines.setAttribute('aria-hidden', 'true'); lines.setAttribute('focusable', 'false');
  stage.append(lines);
  for (const [index, channel] of chosen.entries()) {
    const x = (index + .5) / chosen.length * 1200;
    const active = true;
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', `M ${x} 0 C ${x} 50, 600 55, 600 136`);
    path.setAttribute('class', `hd-constellation-path${active ? ' is-active' : ' is-muted'}`);
    path.style.setProperty('--hd-delay', `${index * -.55}s`); lines.append(path);
    const item = node('div', `hd-constellation-node is-row is-active${channel.virtual ? ` is-virtual ${channel.portrait ? 'is-portrait' : `is-mark is-${channel.style}`}` : ''}`);
    item.style.setProperty('--hd-delay', `${index * -.55}s`);
    item.style.setProperty('--hd-avatar-color', channel.color || swatches[index % swatches.length]);
    if (channel.portrait) item.style.setProperty('--hd-avatar-position', `${channel.spriteIndex % 6 * 20}% ${Math.floor(channel.spriteIndex / 6) * 25}%`);
    item.dataset.virtual = String(!!channel.virtual);
    item.title = channel.name;
    item.setAttribute('role', 'img'); item.setAttribute('aria-label', channel.name);
    const floating = node('div', 'hd-constellation-floating');
    const avatar = node('span', 'hd-constellation-avatar', channel.virtual ? channel.mark || '' : Array.from(channel.name).slice(0, 2).join(''));
    if (channel.thumbnail) {
      const image = node('img'); image.src = channel.thumbnail; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
      image.addEventListener('error', () => image.remove(), { once: true }); avatar.append(image);
    }
    const label = node('span', 'hd-constellation-name', channel.name); label.title = channel.name;
    floating.append(avatar, label); item.append(floating); strip.append(item);
  }
  const hub = node('div', 'hd-constellation-hub');
  hub.append(node('span', 'hd-constellation-hub-dot'), node('span', '', c('combinedHours48')));
  stage.append(hub); wrap.append(stage);
  return wrap;
}

function normalizeRealtime(input) {
  if (!input || typeof input !== 'object') return null;
  const capturedAt = date(input.capturedAt);
  const channelCount = count(input.channelCount);
  const views48 = count(input.views48); const views60 = count(input.views60);
  const bars48 = Array.isArray(input.bars48) ? input.bars48.map(count) : [];
  const bars60 = Array.isArray(input.bars60) ? input.bars60.map(count) : [];
  if (!capturedAt || channelCount === null || channelCount < 1 || views48 === null || views60 === null
    || bars48.length !== 48 || bars60.length !== 60 || bars48.includes(null) || bars60.includes(null)
    || bars48.reduce((sum, value) => sum + value, 0) !== views48
    || bars60.reduce((sum, value) => sum + value, 0) !== views60) return null;
  const channels = (Array.isArray(input.channels) ? input.channels : []).slice(0, 200).flatMap((channel, index) => {
    if (!channel || typeof channel !== 'object') return [];
    const hourly48 = Array.isArray(channel.hourly48) ? channel.hourly48.map(count) : [];
    const total48 = count(channel.total48);
    if (hourly48.length !== 48 || hourly48.includes(null) || total48 === null || hourly48.reduce((sum, value) => sum + value, 0) !== total48) return [];
    const minutes = Array.isArray(channel.minuteBars60) ? channel.minuteBars60.map(count) : [];
    const minute60 = count(channel.minute60);
    const minuteBars60 = minutes.length === 60 && !minutes.includes(null) && minute60 !== null
      && minutes.reduce((sum, value) => sum + value, 0) === minute60 ? minutes : [];
    return [{ id: text(channel.id, 60) || String(index + 1),
      name: text(channel.displayName || channel.name, 200) || `${COPY[language()].managedChannel} ${String(index + 1).padStart(2, '0')}`,
      hourly48, total48, minuteBars60, minute60 }];
  });
  return { capturedAt, channelCount, views48, views60, bars48, bars60, channels, source: text(input.source, 150) };
}

function studioSnapshot(input, compact = false) {
  const data = normalizeRealtime(input);
  if (!data) return null;
  const lang = language(); const c = (key) => COPY[lang][key] || key;
  const locale = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }[lang];
  const number = (value) => new Intl.NumberFormat(locale).format(value);
  const panel = node('section', `hd-studio-snapshot${compact ? ' is-compact' : ''}`);
  panel.setAttribute('aria-label', c('studio'));
  const head = node('div', 'hd-studio-head');
  head.append(node('h3', '', c('studio')), node('span', 'hd-studio-source', data.source || 'YouTube Studio'));
  const stamp = node('time', 'hd-studio-stamp', `${c('captured')} ${new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(data.capturedAt)} KST`);
  stamp.dateTime = data.capturedAt.toISOString();
  const metrics = node('div', 'hd-studio-metrics');
  for (const [key, value] of [['operatedChannels', data.channelCount], ['combinedHours48', data.views48], ['minutes60', data.views60]]) {
    const metric = node('div');
    metric.classList.toggle('is-combined', key === 'combinedHours48');
    metric.append(node('span', '', c(key)), node('strong', '', number(value)));
    metrics.append(metric);
  }
  const charts = node('div', 'hd-studio-charts');
  function chart(key, bars, ago, middle) {
    const figure = node('figure', 'hd-studio-chart');
    figure.classList.toggle('is-combined', key === 'combinedHours48');
    figure.append(node('figcaption', '', c(key)));
    const series = node('div', 'hd-studio-series');
    series.style.setProperty('--hd-series-count', String(bars.length));
    const max = Math.max(...bars);
    for (const [index, value] of bars.entries()) {
      const bar = node('span', 'hd-studio-bar');
      bar.classList.toggle('is-zero', value === 0);
      bar.style.height = `${max ? value / max * 100 : 0}%`;
      bar.title = `${c('interval')} ${index + 1} · ${c('views')} ${number(value)}`;
      bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', bar.title);
      series.append(bar);
    }
    const axis = node('div', 'hd-studio-axis');
    axis.append(node('span', '', c(ago)), node('span', '', c(middle)), node('span', '', c('now')));
    figure.append(series, axis); return figure;
  }
  const modes = node('div', 'hd-studio-modes'); modes.setAttribute('role', 'group'); modes.setAttribute('aria-label', c('studio'));
  let selected = 'sum';
  const buttons = [];
  for (const mode of data.channels.length ? ['sum', 'channels'] : ['sum']) {
    const button = node('button', 'hd-chip', mode === 'sum' ? c('sum') : `${c('byChannel')} · ${number(data.channels.length)}`);
    button.type = 'button'; button.dataset.snapshotMode = mode;
    button.addEventListener('click', () => { selected = mode; render(); });
    modes.append(button); buttons.push(button);
  }
  function render() {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.snapshotMode === selected));
    charts.replaceChildren(); charts.classList.toggle('is-channel-view', selected === 'channels');
    if (selected === 'sum') {
      charts.append(chart('combinedHours48', data.bars48, 'ago48', 'ago24'), chart('minutes60', data.bars60, 'ago60', 'ago30'));
    } else {
      for (const channel of data.channels) {
        const card = node('article', 'hd-channel-snapshot');
        card.append(node('h4', '', channel.name), node('strong', 'hd-channel-total', `${c('hours48')} ${number(channel.total48)}`),
          chart('hours48', channel.hourly48, 'ago48', 'ago24'));
        if (channel.minute60 !== null) card.append(node('p', 'hd-channel-minute', `${c('minutes60')} ${number(channel.minute60)}`));
        charts.append(card);
      }
    }
  }
  render();
  panel.append(head, stamp, modes, metrics, charts, node('p', 'hd-studio-note', c('studioNote')));
  return panel;
}

// All illustration panels share the same public snapshot as the discovery wall.
function hydrateMiniPanels(data, status = 'ready', region = 'all', onRegionChange) {
  const lang = language();
  const c = (key) => COPY[lang][key] || key;
  const locale = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }[lang];
  const number = (value) => value === null ? c('unknown') : new Intl.NumberFormat(locale).format(value);
  const publicChannels = referenceChannels(data);
  const videos = videoRegions(normalizeVideos(data?.videos), publicChannels).filter((video) => inRegion(video, region));
  const channels = [];
  const ranked = [...videos].sort((a, b) => (b.views ?? -1) - (a.views ?? -1));
  const known = ranked.filter((video) => video.views !== null);
  const featured = Array.isArray(data?.featuredIds) ? data.featuredIds : [];
  const byId = new Map(videos.map((video) => [video.id, video]));
  const selected = [...new Set(featured)].map((id) => byId.get(id)).filter(Boolean);
  const balanced = balancedVideos(videos, featured);
  const shorts = [...selected.filter((video) => video.format === 'shorts'), ...ranked.filter((video) => video.format === 'shorts' && !featured.includes(video.id))];
  const collected = date(data?.collectedAt);

  function button(video, className) {
    const el = node('button', `creator-video ${className}`);
    el.type = 'button';
    el.dataset.video = video.id; el.dataset.format = video.format;
    el.dataset.title = video.title; el.dataset.channel = video.channelName;
    el.setAttribute('aria-label', COPY[lang].play.replace('{title}', video.title));
    return el;
  }

  function image(source, className) {
    const el = node('img', className);
    el.src = source; el.alt = ''; el.loading = 'lazy'; el.decoding = 'async';
    el.addEventListener('error', () => el.remove(), { once: true });
    return el;
  }

  function thumbnailRow(items, compactCards = false, limit = 3, wall = false) {
    const row = node('div', `hd-mini-thumbs${compactCards ? ' is-compact' : ''}${wall ? ' is-wall' : ''}`);
    for (const video of items.slice(0, limit)) {
      const card = button(video, 'hd-mini-video');
      card.classList.toggle('is-long', video.format !== 'shorts');
      if (video.thumbnail) card.append(image(video.thumbnail, 'hd-mini-thumb'));
      const detail = node('span', 'hd-mini-video-detail');
      detail.append(node('b', '', video.title), node('small', '', `${c('views')} ${number(video.views)}`));
      card.append(node('span', 'hd-mini-play', '▶'), detail);
      row.append(card);
    }
    return row;
  }

  function horizontalBars(items) {
    const list = node('div', 'hd-mini-bars');
    const confirmed = items.filter((video) => video.views !== null);
    const max = confirmed.length ? Math.max(...confirmed.map((video) => video.views)) : 0;
    if (!confirmed.length) { list.append(node('p', 'hd-mini-empty', c('noViews'))); return list; }
    for (const video of confirmed) {
      const row = button(video, 'hd-mini-bar');
      const top = node('span', 'hd-mini-bar-top');
      top.append(node('span', '', video.title), node('b', '', number(video.views)));
      const track = node('span', 'hd-mini-bar-track');
      const fill = node('span', 'hd-mini-bar-fill');
      fill.style.width = `${max ? video.views / max * 100 : 0}%`;
      track.setAttribute('aria-hidden', 'true'); track.append(fill);
      row.append(top, track); list.append(row);
    }
    return list;
  }

  function channelTiles(items, hero = false) {
    const row = node('div', `hd-mini-channels${hero ? ' is-hero' : ''}`);
    for (const channel of items) {
      const tile = node('div', 'hd-mini-channel');
      if (channel.thumbnail) tile.append(image(channel.thumbnail, 'hd-mini-avatar'));
      const detail = node('span', 'hd-mini-channel-detail');
      detail.append(node('b', '', channel.name));
      if (hero) {
        const sample = videos.filter((video) => video.company && (channel.id
          ? video.channelId === channel.id : video.channelName === channel.name));
        const confirmed = sample.filter((video) => video.views !== null);
        const sum = confirmed.length ? confirmed.reduce((total, video) => total + video.views, 0) : null;
        detail.append(node('small', '', `${c('sampleViews')} ${number(sum)}`));
      }
      tile.append(detail); row.append(tile);
    }
    return row;
  }

  function topicList(items) {
    const list = node('div', 'hd-mini-list');
    for (const [index, video] of items.slice(0, 4).entries()) {
      const row = button(video, 'hd-mini-list-video');
      row.append(node('span', 'hd-mini-rank', String(index + 1).padStart(2, '0')));
      if (video.thumbnail) row.append(image(video.thumbnail, 'hd-mini-list-thumb'));
      const detail = node('span', 'hd-mini-list-detail');
      detail.append(node('b', '', video.title), node('small', '', `${c('views')} ${number(video.views)}`));
      row.append(detail); list.append(row);
    }
    return list;
  }

  for (const panel of document.querySelectorAll('[data-live-panel]')) {
    panel.classList.add('hd-live-panel');
    panel.replaceChildren();
    const type = panel.dataset.livePanel;
    panel.classList.toggle('hd-hero-dashboard', type === 'hero');
    panel.classList.toggle('hd-multi-dashboard', type === 'multi');
    panel.classList.toggle('hd-showcase-dashboard', type === 'showcase');
    const realtime = normalizeRealtime(data?.realtime);
    if (status !== 'ready' || !videos.length && !(type === 'multi' && realtime)) {
      panel.append(node('p', 'hd-mini-empty', c(status === 'loading' ? 'loading' : status === 'failed' ? 'failed' : 'empty')));
      continue;
    }
    const title = type === 'multi' ? c('studio') : ['predict', 'case-predict', 'overview'].includes(type) ? c('compare')
      : type === 'hero' ? c('publicSnapshot') : ['title', 'case-title'].includes(type) ? c('titleReferences')
      : type === 'topic' ? c('topicReferences') : c('source');
    const head = node('div', 'hd-mini-head');
    head.append(node('b', '', title), node('span', 'hd-mini-source', 'YouTube'));
    panel.append(head);
    if (type === 'multi') {
      panel.append(constellation(data, region, onRegionChange));
      const aggregate = node('div', 'hd-constellation-aggregate');
      aggregate.append(studioSnapshot(data?.realtime) || node('p', 'hd-chart-empty', c('rtUnavailable'))); panel.append(aggregate);
      if (channels.length) {
        panel.append(node('h4', 'hd-mini-section-title', `${c('company')} · ${number(channels.length)}`));
        panel.append(channelTiles(channels.slice(0, 9)));
      }
      const wallVideos = balanced;
      if (wallVideos.length) {
        panel.append(node('h4', 'hd-mini-section-title', c('chart')));
        const wall = thumbnailRow(wallVideos, false, 12, true);
        panel.append(wall);
      }
    } else if (type === 'showcase') {
      panel.append(thumbnailRow(balanced, false, 24, true));
    } else if (type === 'hero') {
      const studio = null;
      if (studio) panel.append(studio);
      else {
        const metricRow = node('div', 'hd-mini-metrics');
        const sum = known.length ? known.reduce((total, video) => total + video.views, 0) : null;
        const values = channels.length ? [['channelCount', channels.length], ['count', videos.length], ['total', sum]]
          : [['count', videos.length], ['total', sum], ['best', known[0]?.views ?? null]];
        for (const [key, value] of values) {
          const metric = node('div');
          metric.append(node('span', '', c(key)), node('strong', '', number(value)));
          metricRow.append(metric);
        }
        panel.append(metricRow);
      }
      if (channels.length) panel.append(channelTiles(channels.slice(0, 9), true));
      if (!studio) {
        const chart = node('div', 'hd-mini-hero-chart');
        chart.append(node('b', 'hd-mini-chart-caption', c('compare')), horizontalBars(known.slice(0, 4)));
        panel.append(chart);
      }
    } else if (type === 'refs') {
      if (channels.length) panel.append(channelTiles(channels.slice(0, 6)));
      panel.append(thumbnailRow(shorts.length ? shorts : ranked, true));
    } else if (type === 'topic') {
      panel.append(topicList(ranked));
    } else if (type === 'predict') {
      panel.append(thumbnailRow(known.slice(0, 2), true), horizontalBars(known.slice(0, 2)));
    } else if (type === 'overview') {
      panel.append(horizontalBars(known.slice(0, 5)));
    } else if (type === 'case-predict') {
      panel.append(horizontalBars(known.slice(0, 3)));
    } else if (type === 'title') {
      panel.append(topicList(ranked.slice(0, 3)));
    } else {
      panel.append(thumbnailRow(type === 'case-refs' ? (shorts.length ? shorts : ranked) : ranked, true));
    }
    const foot = node('div', 'hd-mini-foot');
    const panelCollected = type === 'multi' && realtime ? realtime.capturedAt : collected;
    const dateLabel = panelCollected ? new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(panelCollected) + ' KST' : c('unknownDate');
    foot.append(node('span', '', dateLabel), node('span', '', c(type === 'multi' ? 'studioNote' : 'chart')));
    panel.append(foot);
  }
}

function initialize(section) {
  if (section.querySelector('[data-home-discovery]')) return;
  section.classList.add('home-discovery', 'md-sec');
  section.setAttribute('aria-labelledby', 'discovery-heading');
  const wrap = node('div', 'md-wrap');
  wrap.dataset.homeDiscovery = '';
  const state = { videos: [], channels: [], collectedAt: null, snapshot: null, featuredIds: [], status: 'loading',
    query: '', format: 'all', region: 'all', topic: '', sort: 'featured' };
  let lang = language();
  let debounce;
  const c = (key, values) => {
    let result = COPY[lang][key] || key;
    if (values) for (const [key, value] of Object.entries(values)) result = result.replace(`{${key}}`, value);
    return result;
  };
  const locale = () => ({ ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }[lang]);
  const number = (value) => value === null ? c('unknown') : new Intl.NumberFormat(locale()).format(value);
  const compact = (value) => new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const day = (value) => value ? new Intl.DateTimeFormat(locale(), { timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric' }).format(value) : c('unknown');

  const head = node('header', 'md-head hd-heading');
  const over = node('p', 'over');
  const heading = node('h2', 'md-h2');
  heading.id = 'discovery-heading';
  const lead = node('p', 'lead');
  const collection = node('p', 'hd-collected');
  head.append(over, heading, lead, collection);
  const channels = node('div', 'hd-companies');
  const studio = node('div', 'hd-studio-container');
  const graph = node('div', 'hd-constellation-container');
  const panel = node('div', 'hd-panel');
  const metrics = node('div', 'hd-metrics');
  const metricsNote = node('p', 'hd-metric-note');
  const figure = node('figure', 'hd-chart');
  const chartTitle = node('h3', 'hd-chart-title');
  chartTitle.id = 'discovery-chart-title';
  figure.setAttribute('aria-labelledby', chartTitle.id);
  const chartBody = node('div', 'hd-chart-body');
  const chartNote = node('figcaption', 'hd-chart-note');
  figure.append(chartTitle, chartBody, chartNote);
  panel.append(metrics, metricsNote, figure);

  const toolbar = node('div', 'hd-toolbar');
  const searchLabel = node('label', 'hd-search');
  const searchText = node('span', 'hd-sr-only');
  const searchIcon = node('span', 'hd-search-icon', '⌕');
  searchIcon.setAttribute('aria-hidden', 'true');
  const input = node('input', 'hd-search-input');
  input.type = 'search'; input.maxLength = 150; input.autocomplete = 'off';
  searchLabel.append(searchText, searchIcon, input);
  const formatGroup = node('div', 'hd-filters');
  formatGroup.setAttribute('role', 'group');
  const formats = ['all', 'shorts', 'long', 'video'].map((format) => {
    const button = node('button', 'hd-chip');
    button.type = 'button'; button.dataset.formatFilter = format;
    button.addEventListener('click', () => { state.format = format; renderContent(); });
    formatGroup.append(button);
    return button;
  });
  const sortLabel = node('label', 'hd-sort');
  const sortText = node('span');
  const select = node('select', 'hd-sort-select');
  const byFeatured = node('option'); byFeatured.value = 'featured';
  const byViews = node('option'); byViews.value = 'views';
  const byLatest = node('option'); byLatest.value = 'latest';
  select.append(byFeatured, byViews, byLatest); sortLabel.append(sortText, select);
  toolbar.append(searchLabel, formatGroup, sortLabel);
  const topicGroup = node('div', 'hd-topics');
  topicGroup.setAttribute('role', 'group');
  const resultLine = node('div', 'hd-result-line');
  const resultCount = node('p', 'hd-result-count');
  resultCount.setAttribute('aria-live', 'polite'); resultCount.setAttribute('aria-atomic', 'true');
  const reference = node('p', 'hd-reference');
  resultLine.append(resultCount, reference);
  const grid = node('div', 'hd-grid');
  const status = node('p', 'hd-status');
  status.setAttribute('role', 'status');
  wrap.append(head, graph, studio, channels, panel, toolbar, topicGroup, resultLine, grid, status);
  section.append(wrap);

  function videoButton(video, className) {
    const button = node('button', `creator-video ${className}`);
    button.type = 'button';
    button.dataset.video = video.id; button.dataset.format = video.format;
    button.dataset.title = video.title; button.dataset.channel = video.channelName;
    button.setAttribute('aria-label', c('play', { title: video.title }));
    return button;
  }

  function renderChannels() {
    channels.replaceChildren();
    channels.hidden = !state.channels.length;
    if (!state.channels.length) return;
    channels.append(node('h3', 'hd-company-heading', c('company')));
    const row = node('div', 'hd-company-row');
    for (const channel of state.channels) {
      const card = node('article', 'hd-company-card');
      if (channel.thumbnail) {
        const image = node('img', 'hd-company-image');
        image.src = channel.thumbnail; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
        image.addEventListener('error', () => image.remove(), { once: true });
        card.append(image);
      }
      const detail = node('div', 'hd-company-detail');
      detail.append(node('b', '', channel.name));
      const facts = [['subscribers', channel.subscribers], ['channelViews', channel.views], ['videos', channel.videos]]
        .filter(([, value]) => value !== null).map(([key, value]) => `${c(key)} ${number(value)}`);
      detail.append(node('small', '', facts.length ? facts.join(' · ') : 'YouTube'));
      card.append(detail); row.append(card);
    }
    channels.append(row);
  }

  function viewSort(a, b) {
    if (a.views === null && b.views !== null) return 1;
    if (b.views === null && a.views !== null) return -1;
    return (b.views ?? 0) - (a.views ?? 0) || (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
  }

  function filtered() {
    const query = state.query.trim().toLocaleLowerCase(locale());
    return state.videos.filter((video) => (state.format === 'all' || state.format === 'company' && video.company || video.format === state.format)
      && inRegion(video, state.region)
      && (!state.topic || video.topics.includes(state.topic))
      && (!query || `${video.title} ${video.topics.join(' ')}`.toLocaleLowerCase(locale()).includes(query)))
      .sort(state.sort === 'featured'
        ? (a, b) => {
          const aIndex = state.featuredIds.indexOf(a.id); const bIndex = state.featuredIds.indexOf(b.id);
          return (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex) || viewSort(a, b);
        } : state.sort === 'latest'
        ? (a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0) || viewSort(a, b)
        : viewSort);
  }

  function renderMetrics(videos) {
    metrics.replaceChildren();
    const known = videos.filter((video) => video.views !== null);
    const sum = known.length ? known.reduce((total, video) => total + video.views, 0) : null;
    const max = known.length ? Math.max(...known.map((video) => video.views)) : null;
    for (const [label, value] of [['count', videos.length], ['total', sum], ['best', max]]) {
      const metric = node('div', 'hd-metric');
      metric.append(node('span', '', c(label)), node('strong', '', number(value)));
      metrics.append(metric);
    }
  }

  function renderChart(videos) {
    chartBody.replaceChildren();
    const ranked = videos.filter((video) => video.views !== null).sort(viewSort).slice(0, 12);
    if (!ranked.length) { chartBody.append(node('p', 'hd-chart-empty', c('noViews'))); return; }
    const max = Math.max(...ranked.map((video) => video.views));
    const plot = node('div', 'hd-plot');
    const axis = node('div', 'hd-y-axis');
    axis.setAttribute('aria-hidden', 'true');
    for (const value of [max, Math.round(max / 2), 0]) axis.append(node('span', '', compact(value)));
    const bars = node('ol', 'hd-bars');
    bars.style.setProperty('--hd-columns', String(ranked.length));
    for (const [index, video] of ranked.entries()) {
      const item = node('li', 'hd-bar-item');
      const button = videoButton(video, 'hd-bar-button');
      button.title = `${video.title}\n${c('views')} ${number(video.views)}`;
      button.setAttribute('aria-label', `${c('play', { title: video.title })} · ${c('views')} ${number(video.views)}`);
      const track = node('span', 'hd-bar-track');
      track.setAttribute('aria-hidden', 'true');
      const fill = node('span', 'hd-bar-fill');
      track.style.setProperty('--hd-height', `${max ? Math.max(0, video.views / max * 100) : 0}%`);
      const value = node('span', 'hd-bar-value', compact(video.views));
      track.append(fill, value);
      const label = node('span', 'hd-bar-label', String(index + 1).padStart(2, '0'));
      label.setAttribute('aria-hidden', 'true');
      button.append(track, label); item.append(button); bars.append(item);
    }
    plot.append(axis, bars); chartBody.append(plot);
  }

  function renderGrid(videos) {
    grid.replaceChildren();
    for (const video of videos.slice(0, 24)) {
      const card = node('article', 'hd-video-card');
      const button = videoButton(video, 'hd-video-media');
      button.classList.toggle('is-long', video.format !== 'shorts');
      const fallback = node('span', 'hd-thumb-fallback', 'YouTube');
      fallback.setAttribute('aria-hidden', 'true'); button.append(fallback);
      if (video.thumbnail) {
        const image = node('img', 'hd-video-image');
        image.src = video.thumbnail; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
        image.width = 480; image.height = 360;
        image.addEventListener('error', () => image.remove(), { once: true });
        button.append(image);
      }
      const badge = node('span', 'hd-video-format', c(video.format));
      badge.setAttribute('aria-hidden', 'true');
      const play = node('span', 'creator-play hd-play', '▶');
      play.setAttribute('aria-hidden', 'true');
      button.append(badge, play);
      const title = node('h3', 'hd-video-title', video.title);
      title.title = video.title;
      const values = node('p', 'hd-video-values', `${c('views')} ${number(video.views)}`);
      if (video.likes !== null) values.title = `${c('likes')} ${number(video.likes)}`;
      const source = node('p', 'hd-video-source');
      source.append(node('span', 'hd-youtube-label', 'YouTube'), node('span', 'hd-video-date', day(video.publishedAt)));
      card.append(button, title, values, source); grid.append(card);
    }
  }

  function renderTopics() {
    topicGroup.replaceChildren();
    const topics = [...new Set(state.videos.flatMap((video) => video.topics))].slice(0, 6);
    topicGroup.hidden = !topics.length;
    if (!topics.length) return;
    topicGroup.append(node('span', 'hd-topic-label', c('topics')));
    for (const topic of ['', ...topics]) {
      const button = node('button', 'hd-chip hd-topic-chip', topic || c('all'));
      button.type = 'button'; button.setAttribute('aria-pressed', String(state.topic === topic));
      button.addEventListener('click', () => { state.topic = topic; renderTopics(); renderContent(); });
      topicGroup.append(button);
    }
  }

  function renderContent() {
    const ready = state.status === 'ready';
    panel.hidden = !ready;
    toolbar.hidden = !ready || !state.videos.length;
    resultLine.hidden = !ready || !state.videos.length;
    topicGroup.hidden = !ready || !state.videos.some((video) => video.topics.length);
    for (const button of formats) {
      button.hidden = button.dataset.formatFilter !== 'all' && !state.videos.some((video) => video.format === button.dataset.formatFilter);
      button.setAttribute('aria-pressed', String(button.dataset.formatFilter === state.format));
    }
    if (!ready) { status.hidden = false; status.textContent = c(state.status === 'loading' ? 'loading' : 'failed'); grid.replaceChildren(); return; }
    const videos = filtered();
    panel.replaceChildren();
    panel.append(studioSnapshot(state.snapshot?.realtime) || node('p', 'hd-chart-empty', c('rtUnavailable')));
    renderGrid(videos);
    resultCount.textContent = videos.length > 24
      ? c('showing', { n: number(videos.length), shown: number(24) }) : c('results', { n: number(videos.length) });
    status.hidden = videos.length > 0;
    status.textContent = c(state.videos.length ? 'noMatch' : 'empty');
  }

  function changeRegion(region) {
    state.region = ['all', 'foreign', 'jp'].includes(region) ? region : 'all';
    renderContent(); renderGraph();
    hydrateMiniPanels(state.snapshot, state.status, state.region, changeRegion);
  }

  function renderGraph() {
    graph.replaceChildren(); graph.hidden = state.status !== 'ready';
    if (state.status === 'ready') graph.append(constellation(state.snapshot, state.region, changeRegion));
  }

  function renderLabels() {
    lang = language();
    over.textContent = c('over'); heading.textContent = c('heading'); lead.textContent = c('lead');
    collection.replaceChildren();
    const displayTime = normalizeRealtime(state.snapshot?.realtime)?.capturedAt || state.collectedAt;
    if (displayTime) {
      const stamp = node('time', '', new Intl.DateTimeFormat(locale(), {
        timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(displayTime) + ' KST');
      stamp.dateTime = displayTime.toISOString();
      collection.append(node('span', '', c('collected')), stamp);
    } else collection.textContent = c('unknownDate');
    metricsNote.textContent = c('metricNote'); chartTitle.textContent = c('chart'); chartNote.textContent = c('chartNote');
    searchText.textContent = c('search'); input.placeholder = c('searchPlaceholder');
    formatGroup.setAttribute('aria-label', c('formats')); topicGroup.setAttribute('aria-label', c('topics'));
    for (const button of formats) button.textContent = c(button.dataset.formatFilter === 'company' ? 'companyFilter' : button.dataset.formatFilter);
    sortText.textContent = c('sort'); byFeatured.textContent = c('byFeatured'); byViews.textContent = c('byViews'); byLatest.textContent = c('byLatest');
    reference.textContent = c('reference');
    studio.replaceChildren();
    studio.hidden = true;
    renderGraph();
    renderChannels(); renderTopics(); renderContent();
    hydrateMiniPanels(state.snapshot, state.status, state.region, changeRegion);
  }

  input.addEventListener('input', () => {
    state.query = input.value; clearTimeout(debounce);
    debounce = setTimeout(renderContent, 100);
  });
  select.addEventListener('change', () => { state.sort = ['latest', 'views', 'featured'].includes(select.value) ? select.value : 'views'; renderContent(); });
  new MutationObserver(renderLabels).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  renderLabels();

  // One request for a static, dated snapshot; no background polling or browser collection.
  fetch('/home-data.json', { credentials: 'omit', cache: 'no-store' })
    .then((response) => { if (!response.ok) throw new Error('Snapshot unavailable'); return response.json(); })
    .then((data) => {
      if (!data || typeof data !== 'object' || !Array.isArray(data.videos)) throw new Error('Invalid snapshot');
      state.videos = videoRegions(normalizeVideos(data.videos), referenceChannels(data)); state.channels = [];
      state.snapshot = data;
      const featuredIds = Array.isArray(data.featuredIds) ? data.featuredIds.filter((id) => typeof id === 'string' && VIDEO_ID.test(id)).slice(0, 1000) : [];
      state.featuredIds = balancedVideos(state.videos, featuredIds).map((video) => video.id);
      state.collectedAt = date(data.collectedAt); state.status = 'ready';
      renderLabels();
    })
    .catch(() => { state.status = 'failed'; renderLabels(); });
}

const discovery = document.getElementById('discovery');
if (discovery) initialize(discovery);
