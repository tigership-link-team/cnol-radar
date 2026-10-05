// Homepage discovery uses one public snapshot. It never invents a time series.
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const COPY = {
  ko: {
    over: '영상에서 찾는 다음 소재', heading: '지금, 어떤 영상을 참고할까요?',
    lead: '공개 영상의 누적 조회수를 비교하고, 다음 소재의 실마리를 찾아보세요.',
    collected: '수집 시각', unknownDate: '수집 시각 미확인', unknown: '미확인',
    chart: '영상별 누적 조회수', chartNote: '수집 시점의 누적 조회수 상위 영상 · 막대를 눌러 재생',
    count: '등록 영상', total: '확인된 누적 조회수 합계', best: '최고 누적 조회수',
    metricNote: '조회수는 영상별 누적 수치입니다. 미확인 값은 합계에서 제외합니다.',
    search: '소재·영상 제목 검색', searchPlaceholder: '관심 있는 소재를 검색해보세요',
    all: '전체', companyFilter: '회사', shorts: '쇼츠', long: '롱폼', topics: '소재', formats: '영상 유형',
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
    publicSnapshot: '공개 데이터 대시보드', compare: '누적 조회수 비교',
    titleReferences: '실제 영상 제목', topicReferences: '조회수로 보는 영상 소재', source: 'YouTube 공개 영상',
    studio: '회사 채널 운영 데이터', operatedChannels: '운영 채널', hours48: '최근 48시간 조회수',
    minutes60: '최근 60분 조회수', captured: '확인 시각', studioNote: '확인 시점의 회사 운영 데이터 스냅샷',
    ago48: '48시간 전', ago60: '60분 전', capturePoint: '확인 시점', interval: '구간'
  },
  en: {
    over: 'Find your next idea in videos', heading: 'Which video will inspire your next idea?',
    lead: 'Compare public videos’ cumulative views and find a starting point for your next topic.',
    collected: 'Collected', unknownDate: 'Collection time unverified', unknown: 'Unverified',
    chart: 'Cumulative views by video', chartNote: 'Top cumulative views at collection time · Select a bar to play',
    count: 'Collected videos', total: 'Sum of verified cumulative views', best: 'Highest cumulative views',
    metricNote: 'Views are cumulative for each video. Unverified values are excluded from the sum.',
    search: 'Search topics or video titles', searchPlaceholder: 'Search for a topic you want to explore',
    all: 'All', companyFilter: 'Company', shorts: 'Shorts', long: 'Long-form', topics: 'Topics', formats: 'Video type',
    sort: 'Sort', byViews: 'Most viewed', byLatest: 'Newest', byFeatured: 'Across channels',
    results: '{n} videos', showing: 'Showing {shown} of {n}',
    loading: 'Loading public video data.', failed: 'Video data could not be loaded. Please check again later.',
    empty: 'No videos have been collected yet.', noMatch: 'No videos match these filters.',
    noViews: 'No videos have verified cumulative view counts yet.',
    play: 'Play “{title}”', views: 'Views', likes: 'Likes', published: 'Published',
    reference: 'Public video references · Not CNOL testimonials',
    company: 'Company channels at a glance', subscribers: 'Subscribers', channelViews: 'Cumulative views', videos: 'Videos',
    channelCount: 'Company channels', sampleViews: 'Collected videos’ cumulative views',
    publicSnapshot: 'Public data dashboard', compare: 'Cumulative view comparison',
    titleReferences: 'Actual video titles', topicReferences: 'Video topics by view count', source: 'Public YouTube videos',
    studio: 'Company channel performance', operatedChannels: 'Managed channels', hours48: 'Views in the last 48 hours',
    minutes60: 'Views in the last 60 minutes', captured: 'Captured', studioNote: 'Company performance snapshot at capture time',
    ago48: '48 hours earlier', ago60: '60 minutes earlier', capturePoint: 'Capture time', interval: 'Interval'
  },
  ja: {
    over: '動画から次のネタを探す', heading: '今、どの動画を参考にしますか？',
    lead: '公開動画の累計再生数を比較し、次のネタの手がかりを探しましょう。',
    collected: '収集日時', unknownDate: '収集日時は未確認', unknown: '未確認',
    chart: '動画別の累計再生数', chartNote: '収集時点の累計再生数上位 · 棒を押すと再生',
    count: '収集動画', total: '確認できた累計再生数の合計', best: '最多の累計再生数',
    metricNote: '再生数は動画ごとの累計値です。未確認の値は合計に含みません。',
    search: 'ネタ・動画タイトルを検索', searchPlaceholder: '気になるネタを検索してください',
    all: 'すべて', companyFilter: '会社', shorts: 'ショート', long: '長尺動画', topics: 'ネタ', formats: '動画タイプ',
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
    publicSnapshot: '公開データダッシュボード', compare: '累計再生数の比較',
    titleReferences: '実際の動画タイトル', topicReferences: '再生数から見る動画のネタ', source: 'YouTube公開動画',
    studio: '会社チャンネルの運営データ', operatedChannels: '運営チャンネル', hours48: '過去48時間の再生数',
    minutes60: '過去60分の再生数', captured: '確認日時', studioNote: '確認時点の会社運営データのスナップショット',
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
      || seen.has(item.id) || !['shorts', 'long'].includes(item.format)) return [];
    seen.add(item.id);
    const topics = Array.isArray(item.topics) ? item.topics : typeof item.topic === 'string' ? [item.topic] : [];
    return [{
      id: item.id, title: text(item.title) || 'YouTube', format: item.format,
      views: count(item.views), likes: count(item.likes), publishedAt: date(item.publishedAt),
      thumbnail: thumbnail(item.thumbnail), channelName: text(item.channelName, 200),
      channelId: text(item.channelId, 40), company: item.company === true,
      topics: [...new Set(topics.map((value) => text(value, 40)).filter(Boolean))].slice(0, 8)
    }];
  });
}

function normalizeChannels(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 12).flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const name = text(item.name || item.title || item.channelName, 200);
    if (!name) return [];
    return [{ id: text(item.id, 40), name, subscribers: count(item.subscriberCount), views: count(item.viewCount),
      videos: count(item.videoCount), thumbnail: thumbnail(item.thumbnail) }];
  });
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
  return { capturedAt, channelCount, views48, views60, bars48, bars60, source: text(input.source, 150) };
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
  for (const [key, value] of [['operatedChannels', data.channelCount], ['hours48', data.views48], ['minutes60', data.views60]]) {
    const metric = node('div');
    metric.append(node('span', '', c(key)), node('strong', '', number(value)));
    metrics.append(metric);
  }
  const charts = node('div', 'hd-studio-charts');
  for (const [key, bars, ago] of [['hours48', data.bars48, 'ago48'], ['minutes60', data.bars60, 'ago60']]) {
    const figure = node('figure', 'hd-studio-chart');
    figure.append(node('figcaption', '', c(key)));
    const series = node('div', 'hd-studio-series');
    series.style.setProperty('--hd-series-count', String(bars.length));
    const max = Math.max(...bars);
    for (const [index, value] of bars.entries()) {
      const bar = node('span', 'hd-studio-bar');
      bar.style.height = `${max ? value / max * 100 : 0}%`;
      bar.title = `${c('interval')} ${index + 1} · ${c('views')} ${number(value)}`;
      bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', bar.title);
      series.append(bar);
    }
    const axis = node('div', 'hd-studio-axis');
    axis.append(node('span', '', c(ago)), node('span', '', c('capturePoint')));
    figure.append(series, axis); charts.append(figure);
  }
  panel.append(head, stamp, metrics, charts, node('p', 'hd-studio-note', c('studioNote')));
  return panel;
}

// All illustration panels share the same public snapshot as the discovery wall.
function hydrateMiniPanels(data, status = 'ready') {
  const lang = language();
  const c = (key) => COPY[lang][key] || key;
  const locale = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }[lang];
  const number = (value) => value === null ? c('unknown') : new Intl.NumberFormat(locale).format(value);
  const videos = normalizeVideos(data?.videos);
  const channels = normalizeChannels(data?.companyChannels);
  const ranked = [...videos].sort((a, b) => (b.views ?? -1) - (a.views ?? -1));
  const known = ranked.filter((video) => video.views !== null);
  const featured = Array.isArray(data?.featuredIds) ? data.featuredIds : [];
  const byId = new Map(videos.map((video) => [video.id, video]));
  const selected = [...new Set(featured)].map((id) => byId.get(id)).filter(Boolean);
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
      card.classList.toggle('is-long', video.format === 'long');
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
    if (status !== 'ready' || !videos.length) {
      panel.append(node('p', 'hd-mini-empty', c(status === 'loading' ? 'loading' : status === 'failed' ? 'failed' : 'empty')));
      continue;
    }
    const title = ['multi', 'overview'].includes(type) && normalizeRealtime(data?.realtime) ? c('studio')
      : ['predict', 'case-predict', 'overview'].includes(type) ? c('compare')
      : type === 'hero' ? c('publicSnapshot') : ['title', 'case-title'].includes(type) ? c('titleReferences')
      : type === 'topic' ? c('topicReferences') : c('source');
    const head = node('div', 'hd-mini-head');
    head.append(node('b', '', title), node('span', 'hd-mini-source', 'YouTube'));
    panel.append(head);
    if (type === 'multi') {
      const studio = studioSnapshot(data?.realtime);
      if (studio) panel.append(studio);
      else panel.append(horizontalBars(known.slice(0, 5)));
      if (channels.length) {
        panel.append(node('h4', 'hd-mini-section-title', `${c('company')} · ${number(channels.length)}`));
        panel.append(channelTiles(channels.slice(0, 9)));
      }
      const companyVideos = [...selected.filter((video) => video.company),
        ...ranked.filter((video) => video.company && !featured.includes(video.id))];
      if (companyVideos.length) {
        panel.append(node('h4', 'hd-mini-section-title', c('chart')));
        const wall = thumbnailRow(companyVideos, false, 9, true);
        wall.classList.add('is-company');
        panel.append(wall);
      }
    } else if (type === 'showcase') {
      const companyVideos = selected.filter((video) => video.company);
      const references = ranked.filter((video) => !video.company);
      const chosen = [...companyVideos.slice(0, 12), ...references.slice(0, 12)];
      const shown = new Set(chosen.map((video) => video.id));
      for (const video of ranked) {
        if (chosen.length >= 24) break;
        if (!shown.has(video.id)) { chosen.push(video); shown.add(video.id); }
      }
      panel.append(thumbnailRow(chosen, false, 24, true));
    } else if (type === 'hero') {
      const studio = studioSnapshot(data?.realtime, true);
      if (studio) panel.append(studio);
      else {
        const metricRow = node('div', 'hd-mini-metrics');
        const sum = known.length ? known.reduce((total, video) => total + video.views, 0) : null;
        for (const [key, value] of [['channelCount', channels.length], ['count', videos.length], ['total', sum]]) {
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
      const studio = studioSnapshot(data?.realtime, true);
      panel.append(studio || horizontalBars(known.slice(0, 5)));
    } else if (type === 'case-predict') {
      panel.append(horizontalBars(known.slice(0, 3)));
    } else if (type === 'title') {
      panel.append(topicList(ranked.slice(0, 3)));
    } else {
      panel.append(thumbnailRow(type === 'case-refs' ? (shorts.length ? shorts : ranked) : ranked, true));
    }
    const foot = node('div', 'hd-mini-foot');
    const panelCollected = ['hero', 'overview', 'multi'].includes(type) ? normalizeRealtime(data?.realtime)?.capturedAt || collected : collected;
    const dateLabel = panelCollected ? new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(panelCollected) + ' KST' : c('unknownDate');
    foot.append(node('span', '', dateLabel), node('span', '', c(['hero', 'overview', 'multi'].includes(type) && normalizeRealtime(data?.realtime) ? 'studioNote' : 'chart')));
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
    query: '', format: 'company', topic: '', sort: 'featured' };
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
  const formats = ['all', 'company', 'shorts', 'long'].map((format) => {
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
  wrap.append(head, studio, channels, panel, toolbar, topicGroup, resultLine, grid, status);
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
      button.classList.toggle('is-long', video.format === 'long');
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
    panel.hidden = !ready || !state.videos.length;
    toolbar.hidden = !ready || !state.videos.length;
    resultLine.hidden = !ready || !state.videos.length;
    topicGroup.hidden = !ready || !state.videos.some((video) => video.topics.length);
    for (const button of formats) button.setAttribute('aria-pressed', String(button.dataset.formatFilter === state.format));
    if (!ready) { status.hidden = false; status.textContent = c(state.status === 'loading' ? 'loading' : 'failed'); grid.replaceChildren(); return; }
    const videos = filtered();
    renderMetrics(videos); renderChart(videos); renderGrid(videos);
    resultCount.textContent = videos.length > 24
      ? c('showing', { n: number(videos.length), shown: number(24) }) : c('results', { n: number(videos.length) });
    status.hidden = videos.length > 0;
    status.textContent = c(state.videos.length ? 'noMatch' : 'empty');
  }

  function renderLabels() {
    lang = language();
    over.textContent = c('over'); heading.textContent = c('heading'); lead.textContent = c('lead');
    collection.replaceChildren();
    if (state.collectedAt) {
      const stamp = node('time', '', new Intl.DateTimeFormat(locale(), {
        timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(state.collectedAt) + ' KST');
      stamp.dateTime = state.collectedAt.toISOString();
      collection.append(node('span', '', c('collected')), stamp);
    } else collection.textContent = c('unknownDate');
    metricsNote.textContent = c('metricNote'); chartTitle.textContent = c('chart'); chartNote.textContent = c('chartNote');
    searchText.textContent = c('search'); input.placeholder = c('searchPlaceholder');
    formatGroup.setAttribute('aria-label', c('formats')); topicGroup.setAttribute('aria-label', c('topics'));
    for (const button of formats) button.textContent = c(button.dataset.formatFilter === 'company' ? 'companyFilter' : button.dataset.formatFilter);
    sortText.textContent = c('sort'); byFeatured.textContent = c('byFeatured'); byViews.textContent = c('byViews'); byLatest.textContent = c('byLatest');
    reference.textContent = c('reference');
    studio.replaceChildren();
    const studioPanel = studioSnapshot(state.snapshot?.realtime);
    studio.hidden = !studioPanel;
    if (studioPanel) studio.append(studioPanel);
    renderChannels(); renderTopics(); renderContent();
    hydrateMiniPanels(state.snapshot, state.status);
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
      state.videos = normalizeVideos(data.videos); state.channels = normalizeChannels(data.companyChannels);
      state.snapshot = data;
      state.featuredIds = Array.isArray(data.featuredIds) ? data.featuredIds.filter((id) => typeof id === 'string' && VIDEO_ID.test(id)).slice(0, 1000) : [];
      state.collectedAt = date(data.collectedAt); state.status = 'ready';
      if (!state.videos.some((video) => video.company)) state.format = state.videos.some((video) => video.format === 'shorts') ? 'shorts' : 'all';
      renderLabels();
    })
    .catch(() => { state.status = 'failed'; renderLabels(); });
}

const discovery = document.getElementById('discovery');
if (discovery) initialize(discovery);
