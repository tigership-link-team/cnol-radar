// CNOL RADAR v15 — 찾기 화면 (#find): 찾는 일을 대시보드 한 화면에 다 풀어 놨어요
// · 입력하는 대로: 지켜보는 채널 · 영상 · 소재 보드 · 화면/도구에서 바로 찾아요 (서버에 안 물어봐요)
// · Enter(유튜브 전체에서 찾기): 소재 검색 — 수요 · 경쟁 · 기회 점수 + 요즘 터진 영상 · 채널 (같은 키워드는 서버가 12시간 저장)
// · 영입 후보(스카우트): 작게 시작해 크게 터진 채널 — MCN · 대행사의 크리에이터 영입 · 협업 후보 (같은 검색 결과로 계산)
// · 유튜브 링크를 넣으면: 채널 → 지켜보기 · 크리에이터로 추가 / 영상 → 댓글 속 소재 · 제목 버전
// · 처음 화면: 최근 찾은 것 · 추천 키워드 · 지금 뜨는 영상(Amicro 카드 펼치기) · 찾기 도구 모음
// app.js가 mountFind(ctx)로 공용 함수를 넘겨줘요. 문구(TR)는 app.js가 T에 합쳐요.
import * as MO from '/md-motion.js?v=15';
import { TT } from '/agent-i18n.js?v=15';
import { topicView, topicFetch, topicCached, bindTopicOut, suggestKws, VID_IN, CH_IN } from '/agent.js?v=15';

let C = null;
export function mountFind(ctx) { C = ctx; }
const e = (s) => C.esc(s);
const t = (k, v) => C.t(k, v);
const tt = (k) => (TT[C.lang] || TT.ko)[k] ?? TT.ko[k] ?? k;
const enc = encodeURIComponent;
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (er) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (er) { /* 저장 못 해도 화면은 그대로 */ } }
};

export const TR = {
  ko: {
    g_findG: '찾기', tab_find: '찾기', find: '찾기', fabFind: '찾기',
    fdLead: '지켜보는 채널 · 영상 · 소재 보드부터 유튜브 전체, 영입 후보까지 한곳에서 찾아요.',
    fdLabel: '찾을 말', fdPh: '키워드 · 채널 이름 · 유튜브 링크', fdGo: '유튜브 전체에서 찾기', fdGoScout: '영입 후보 찾기', fdClear: '지우기',
    fdScope: '찾을 곳', fdTabAll: '전체', fdTabYt: '유튜브 전체', fdTabScout: '영입 후보',
    fdHintAll: '입력하는 대로 지켜보는 채널 · 영상 · 소재 보드 · 화면에서 바로 찾아요. Enter를 누르면 유튜브 전체에서 찾아요.',
    fdHintYt: '유튜브 전체에서 소재의 수요 · 경쟁 · 기회를 재요. 같은 키워드는 12시간 동안 저장해 둬서 다시 찾아도 검색 횟수가 줄지 않아요.',
    fdHintScout: '키워드로 검색된 영상 중 구독자보다 조회수가 훨씬 큰 채널을 골라요. MCN · 대행사의 영입 · 협업 후보 찾기에 좋아요.',
    fdRecent: '최근 찾은 것', fdRecentClear: '기록 지우기', fdSuggest: '추천 키워드', fdSuggestSub: '내 채널 소재 DNA · 지금 도는 소재 파도',
    fdTrend: '지금 뜨는 영상', fdTrendSub: '지켜보는 채널에서 평소보다 크게 뜨는 영상 5개', fdTrendAll: '지금 뜨는 중 전체',
    fdTrendNone: '아직 크게 뜨는 영상이 없어요. 채널을 더 지켜보면 여기에 보여 드려요.', fdTrendX: '평소의 {x}배', fdOpenVid: '분석 열기',
    fdTools: '찾기 도구', fdToolsSub: '필요한 찾기를 골라 바로 시작하세요',
    t2_scout: '영입 후보 찾기', td2_scout: '키워드로 작게 시작해 크게 터진 채널을 찾아요 (MCN 영입 · 협업)',
    t2_radar: '지금 뜨는 중', td2_radar: '같은 시간대 평소보다 빨리 크는 영상만 모아요',
    t2_compare: '채널 비교', td2_compare: '채널 2~4개를 숫자 · 잘 된 영상으로 나란히',
    fdOpen: '열기',
    fdGChans: '지켜보는 채널', fdGVids: '영상', fdGIdeas: '소재 보드', fdGPages: '화면 · 도구', fdNone: '여기에는 없어요',
    fdCta: '지켜보는 것 중에서 찾은 결과예요. 유튜브 전체나 영입 후보에서도 찾아볼까요?', fdCtaYt: '유튜브 전체에서 ‘{q}’', fdCtaScout: '‘{q}’ 영입 후보',
    fdUrlCh: '유튜브 채널 링크예요', fdUrlVid: '유튜브 영상 링크예요', fdWatch: '레퍼런스로 지켜보기', fdMine: '내 크리에이터로 추가', fdOpenYt: 'YouTube에서 열기',
    fdCm: '댓글 속 소재 찾기', fdVer: '제목 · 태그 버전 만들기', fdTracked: '이미 지켜보는 영상이에요', fdAnalyze: '분석 보기',
    fdAdding: '추가하는 중…', fdAddedRef: '레퍼런스로 지켜봐요 · 영상 {v}개를 모았어요', fdAddedMine: '내 크리에이터로 넣었어요 · 영상 {v}개를 모았어요',
    fdSearching: '유튜브에서 찾는 중이에요…', fdNeedQ: '찾을 키워드를 넣어 주세요.', fdTry: '이렇게 찾아보세요',
    scTitle: '영입 후보', scSub: '‘{q}’ 검색 결과 상위 영상 중 구독자보다 조회수가 훨씬 큰 채널 · 최근 120일',
    scSubs: '구독자 규모', scAll: '전체', sc1: '1만 미만', sc2: '1만~10만', sc3: '10만~100만', sc4: '100만 이상',
    scX: '구독자 대비', scXv: '×{x}', scBest: '가장 크게 터진 영상', scVid: '조회수 {v} · {d}일 전', scVidH: '조회수 {v} · 오늘',
    scWatch: '지켜보기', scWatching: '지켜보는 중', scOpen: 'YouTube 채널', scSubsN: '구독자 {n}', scSubsHidden: '구독자 비공개', scInTop: '검색 상위 {n}개',
    scNone: '이 조건에서는 영입 후보가 안 보여요. 구독자 규모를 넓히거나 다른 키워드로 찾아보세요.',
    scNote: '구독자 대비(×)는 영상 조회수를 채널 구독자 수로 나눈 값으로, CNOL RADAR가 계산했어요. YouTube 지표가 아니에요. 검색 결과 상위 50개 영상 기준이에요.',
    scFlow: '터진 영상 넘겨 보기', scPrev: '이전', scNext: '다음', scDot: '{n}번째 보기', scCount: '{n}개 채널'
  },
  en: {
    g_findG: 'Find', tab_find: 'Find', find: 'Find', fabFind: 'Find',
    fdLead: 'Search everything in one place — channels, videos and ideas you track, all of YouTube, and creators worth signing.',
    fdLabel: 'Search for', fdPh: 'Keyword · channel name · YouTube link', fdGo: 'Search all of YouTube', fdGoScout: 'Find creators', fdClear: 'Clear',
    fdScope: 'Where to search', fdTabAll: 'Everything', fdTabYt: 'All of YouTube', fdTabScout: 'Creator scouting',
    fdHintAll: 'Results from your channels, videos, idea board and pages appear as you type. Press Enter to search all of YouTube.',
    fdHintYt: 'Measures demand, competition and opportunity across YouTube. The same keyword is cached for 12 hours, so searching again does not use up your searches.',
    fdHintScout: 'Picks channels whose videos got far more views than they have subscribers. Great for MCNs and agencies looking for creators to sign or partner with.',
    fdRecent: 'Recent searches', fdRecentClear: 'Clear history', fdSuggest: 'Suggested keywords', fdSuggestSub: 'Your channel’s topic DNA · topic waves right now',
    fdTrend: 'Rising now', fdTrendSub: '5 videos beating their usual on channels you watch', fdTrendAll: 'All rising videos',
    fdTrendNone: 'Nothing is breaking out yet. Watch more channels and we will show them here.', fdTrendX: '{x}× usual', fdOpenVid: 'Open analysis',
    fdTools: 'Search tools', fdToolsSub: 'Pick what you need and start right away',
    t2_scout: 'Creator scouting', td2_scout: 'Find small channels that broke out for a keyword (MCN signing · partnerships)',
    t2_radar: 'Rising now', td2_radar: 'Only videos growing faster than usual at the same age',
    t2_compare: 'Compare channels', td2_compare: 'Put 2–4 channels side by side by numbers and best videos',
    fdOpen: 'Open',
    fdGChans: 'Channels you watch', fdGVids: 'Videos', fdGIdeas: 'Idea board', fdGPages: 'Pages · tools', fdNone: 'Nothing here',
    fdCta: 'These come from what you already track. Search all of YouTube or scout creators too?', fdCtaYt: '“{q}” on all of YouTube', fdCtaScout: 'Scout creators for “{q}”',
    fdUrlCh: 'This is a YouTube channel link', fdUrlVid: 'This is a YouTube video link', fdWatch: 'Watch as reference', fdMine: 'Add as my creator', fdOpenYt: 'Open on YouTube',
    fdCm: 'Find ideas in comments', fdVer: 'Make title · tag versions', fdTracked: 'You already track this video', fdAnalyze: 'See analysis',
    fdAdding: 'Adding…', fdAddedRef: 'Now watching as a reference · collected {v} videos', fdAddedMine: 'Added as your creator · collected {v} videos',
    fdSearching: 'Searching YouTube…', fdNeedQ: 'Type a keyword to search.', fdTry: 'Try these',
    scTitle: 'Creator scouting', scSub: 'Channels in the top results for “{q}” whose videos far out-viewed their subscribers · last 120 days',
    scSubs: 'Channel size', scAll: 'All', sc1: 'Under 10K', sc2: '10K–100K', sc3: '100K–1M', sc4: '1M+',
    scX: 'vs subscribers', scXv: '×{x}', scBest: 'Biggest breakout', scVid: '{v} views · {d} days ago', scVidH: '{v} views · today',
    scWatch: 'Watch', scWatching: 'Watching', scOpen: 'YouTube channel', scSubsN: '{n} subscribers', scSubsHidden: 'Subscribers hidden', scInTop: '{n} in top results',
    scNone: 'No candidates under these filters. Widen the channel size or try another keyword.',
    scNote: '“vs subscribers” (×) is video views divided by the channel’s subscribers, calculated by CNOL RADAR. It is not a YouTube metric. Based on the top 50 search results.',
    scFlow: 'Browse breakout videos', scPrev: 'Previous', scNext: 'Next', scDot: 'Show #{n}', scCount: '{n} channels'
  },
  ja: {
    g_findG: '検索', tab_find: '検索', find: '検索', fabFind: '検索',
    fdLead: '見ているチャンネル・動画・ネタボードから、YouTube全体、スカウト候補まで1か所で探せます。',
    fdLabel: '検索ワード', fdPh: 'キーワード・チャンネル名・YouTubeリンク', fdGo: 'YouTube全体で探す', fdGoScout: 'スカウト候補を探す', fdClear: 'クリア',
    fdScope: '探す場所', fdTabAll: 'すべて', fdTabYt: 'YouTube全体', fdTabScout: 'スカウト候補',
    fdHintAll: '入力するとすぐに、見ているチャンネル・動画・ネタボード・画面から探します。Enterを押すとYouTube全体で探します。',
    fdHintYt: 'YouTube全体でネタの需要・競合・チャンスを測ります。同じキーワードは12時間保存するので、もう一度探しても回数は減りません。',
    fdHintScout: '登録者数よりはるかに多く再生された動画があるチャンネルを選びます。MCN・代理店のスカウトやコラボ候補探しに。',
    fdRecent: '最近の検索', fdRecentClear: '履歴を消す', fdSuggest: 'おすすめキーワード', fdSuggestSub: '自分のチャンネルのネタDNA・今のネタの波',
    fdTrend: '今伸びている動画', fdTrendSub: '見ているチャンネルで普段より伸びている5本', fdTrendAll: '急上昇をすべて見る',
    fdTrendNone: 'まだ大きく伸びている動画はありません。チャンネルを増やすとここに表示します。', fdTrendX: '普段の{x}倍', fdOpenVid: '分析を開く',
    fdTools: '検索ツール', fdToolsSub: '必要な探し方を選んですぐ始めましょう',
    t2_scout: 'スカウト候補', td2_scout: 'キーワードで、小さく始めて大きく伸びたチャンネルを探します（MCNスカウト・コラボ）',
    t2_radar: '今伸びている', td2_radar: '同じ経過時間の普段より速く伸びている動画だけ',
    t2_compare: 'チャンネル比較', td2_compare: '2〜4チャンネルを数字と伸びた動画で並べて',
    fdOpen: '開く',
    fdGChans: '見ているチャンネル', fdGVids: '動画', fdGIdeas: 'ネタボード', fdGPages: '画面・ツール', fdNone: 'ここにはありません',
    fdCta: '見ているものから探した結果です。YouTube全体やスカウト候補も探しますか？', fdCtaYt: 'YouTube全体で「{q}」', fdCtaScout: '「{q}」のスカウト候補',
    fdUrlCh: 'YouTubeチャンネルのリンクです', fdUrlVid: 'YouTube動画のリンクです', fdWatch: '参考チャンネルとして見る', fdMine: '自分のクリエイターに追加', fdOpenYt: 'YouTubeで開く',
    fdCm: 'コメントからネタを探す', fdVer: 'タイトル・タグ案を作る', fdTracked: 'すでに見ている動画です', fdAnalyze: '分析を見る',
    fdAdding: '追加しています…', fdAddedRef: '参考チャンネルとして見ています・動画{v}本を集めました', fdAddedMine: '自分のクリエイターに追加しました・動画{v}本を集めました',
    fdSearching: 'YouTubeで探しています…', fdNeedQ: '探すキーワードを入れてください。', fdTry: 'こんなふうに探してみましょう',
    scTitle: 'スカウト候補', scSub: '「{q}」の検索上位で、登録者数よりはるかに多く再生されたチャンネル・直近120日',
    scSubs: 'チャンネル規模', scAll: 'すべて', sc1: '1万未満', sc2: '1万〜10万', sc3: '10万〜100万', sc4: '100万以上',
    scX: '登録者比', scXv: '×{x}', scBest: '一番伸びた動画', scVid: '再生数{v}・{d}日前', scVidH: '再生数{v}・今日',
    scWatch: '見る', scWatching: '見ています', scOpen: 'YouTubeチャンネル', scSubsN: '登録者{n}', scSubsHidden: '登録者非公開', scInTop: '検索上位{n}本',
    scNone: 'この条件ではスカウト候補が見つかりません。規模を広げるか、別のキーワードで探してみましょう。',
    scNote: '登録者比（×）は動画の再生数をチャンネル登録者数で割った値で、CNOL RADARが計算しています。YouTubeの指標ではありません。検索上位50本の動画が基準です。',
    scFlow: '伸びた動画をめくって見る', scPrev: '前へ', scNext: '次へ', scDot: '{n}番目を見る', scCount: '{n}チャンネル'
  }
};

// ---------- 아이콘 ----------
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  wave: '<path d="M2 12c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"/><path d="M2 18c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 5 4"/>',
  up: '<path d="M7 17L17 7M9 7h8v8"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  compare: '<path d="M8 4v16M16 4v16M4 8h8M12 16h8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  ideas: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
  page: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  scout: '<circle cx="10" cy="10" r="6"/><path d="M20 20l-5.6-5.6"/><path d="M10 7.5l.8 1.7 1.8.3-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.3z"/>',
  chev: '<path d="M15 6l-6 6 6 6"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>'
};
const ic = (k, s = 18) => C.svg(P[k] || C.IC[k] || '', s);
const arrowSa = () => `<span class="mi-sa b" aria-hidden="true">${ic('arrow', 16)}</span>`;

// ---------- 상태 ----------
const F = { q: '', tab: 'all', sc: 'all', ideas: null, ideasAt: 0, sugg: null, suggAt: 0 };
const HK = 'radar.findHist';
const hist = () => { try { const a = JSON.parse(ls.get(HK) || '[]'); return Array.isArray(a) ? a.filter((x) => typeof x === 'string').slice(0, 12) : []; } catch (er) { return []; } };
function histAdd(q) {
  q = String(q || '').trim().slice(0, 80);
  if (!q || isUrl(q)) return;
  ls.set(HK, JSON.stringify([q, ...hist().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 12)));
}
function query() { const h = location.hash || ''; const i = h.indexOf('?'); return new URLSearchParams(i >= 0 ? h.slice(i + 1) : ''); }
// 주소만 조용히 바꿔요 (다시 그리지 않게 hashchange 없이)
function setUrl() {
  const p = new URLSearchParams();
  if (F.q) p.set('q', F.q);
  if (F.tab !== 'all') p.set('tab', F.tab);
  const h = '#find' + (p.toString() ? '?' + p.toString() : '');
  if (location.hash !== h) { try { history.replaceState(history.state, '', h); } catch (er) { /* 그대로 */ } }
}
const isVid = (s) => VID_IN.test(s);
const isCh = (s) => !isVid(s) && (CH_IN.test(' ' + s + ' ') || /^UC[\w-]{22}$/.test(s.trim()));
const isUrl = (s) => isVid(s) || isCh(s);

// ---------- 글자 맞추기 (초성도) ----------
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const cho = (s) => [...String(s)].map((ch) => { const c = ch.charCodeAt(0) - 0xac00; return c >= 0 && c < 11172 ? CHO[Math.floor(c / 588)] : ch; }).join('');
function score(text, q) {
  const s = String(text || '').toLowerCase();
  if (!q || !s) return 0;
  if (s === q) return 5;
  if (s.startsWith(q)) return 4;
  if (s.includes(' ' + q)) return 3;
  if (s.includes(q)) return 2;
  if (/^[ㄱ-ㅎ]+$/.test(q) && cho(s).includes(q)) return 1.5;
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((w) => s.includes(w))) return 1.2;
  return 0;
}
// 찾은 부분에 형광펜 (글자는 모두 이스케이프)
function mark(text, q) {
  const s = String(text || '');
  const i = q ? s.toLowerCase().indexOf(q) : -1;
  if (i < 0) return e(s);
  return e(s.slice(0, i)) + '<mark>' + e(s.slice(i, i + q.length)) + '</mark>' + e(s.slice(i + q.length));
}

// ---------- 데이터 ----------
async function ideasNow() {
  if (F.ideas && Date.now() - F.ideasAt < 60e3) return F.ideas;
  try {
    const { data, error } = await C.sb.from('radar_ideas').select('id,title,stage,note,due_on').eq('workspace_id', C.S.ws.id).order('created_at', { ascending: false }).limit(300);
    if (error) throw error;
    F.ideas = data || [];
  } catch (er) { F.ideas = F.ideas || []; }
  F.ideasAt = Date.now();
  return F.ideas;
}
async function suggNow() {
  if (F.sugg && Date.now() - F.suggAt < 180e3 && F.sugg.kind === C.S.kind) return F.sugg;
  try { F.sugg = { ...(await suggestKws(10)), kind: C.S.kind }; } catch (er) { F.sugg = { pool: [], kws: [], dna: [], waves: [], kind: C.S.kind }; }
  F.suggAt = Date.now();
  return F.sugg;
}

// ---------- 화면 조각 ----------
function heroHtml() {
  const tab = (k, icn, lab) => `<button type="button" role="tab" class="fd-tab" id="fdTab_${k}" data-tab="${k}" aria-selected="${String(F.tab === k)}" aria-controls="fdOut" tabindex="${F.tab === k ? 0 : -1}">${ic(icn, 17)}<span>${e(t(lab))}</span></button>`;
  const goLab = F.tab === 'scout' ? t('fdGoScout') : t('fdGo');
  return `<section class="fd-hero dk-fade">
    <form class="fd-form" id="fdForm" role="search" novalidate>
      <label class="sr" for="fdIn">${e(t('fdLabel'))}</label>
      <span class="fd-lead" aria-hidden="true">${ic('search', 22)}</span>
      <input id="fdIn" class="fd-in" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="200" placeholder="${e(t('fdPh'))}" value="${e(F.q)}">
      <button type="button" class="md-icon fd-clear" id="fdClear" aria-label="${e(t('fdClear'))}"${F.q ? '' : ' hidden'}>${ic('x', 20)}</button>
      <button type="submit" class="dk-btn fd-go mi-glare" id="fdGo" data-mi="slide"><span class="mi-sa a" aria-hidden="true">${ic(F.tab === 'scout' ? 'scout' : 'globe', 17)}</span><span id="fdGoL">${e(goLab)}</span>${arrowSa()}</button>
    </form>
    <div class="fd-scope" role="tablist" aria-label="${e(t('fdScope'))}">${tab('all', 'layers', 'fdTabAll')}${tab('yt', 'globe', 'fdTabYt')}${tab('scout', 'scout', 'fdTabScout')}</div>
    <p class="fd-hint" id="fdHint">${e(t(F.tab === 'yt' ? 'fdHintYt' : F.tab === 'scout' ? 'fdHintScout' : 'fdHintAll'))}</p>
  </section>`;
}
const chipBtn = (k, attr = '') => `<button type="button" class="dk-chip" data-fq="${e(k)}" data-fb ${attr}>${e(k)}</button>`;
function chipsHtml(sg) {
  const h = hist();
  const kws = (sg && sg.kws) || [];
  if (!h.length && !kws.length) return '';
  return `<section class="fd-sec dk-fade">
    ${h.length ? `<div class="fd-sec"><h2 class="fd-h">${ic('clock', 18)}${e(t('fdRecent'))}<button type="button" class="dk-mini" id="fdHistClear" style="margin-left:auto">${e(t('fdRecentClear'))}</button></h2><div class="fd-chips" id="fdHist">${h.map((k) => chipBtn(k)).join('')}</div></div>` : ''}
    ${kws.length ? `<div class="fd-sec"><h2 class="fd-h">${ic('star', 18)}${e(t('fdSuggest'))} <small>${e(t('fdSuggestSub'))}</small></h2><div class="fd-chips" id="fdSugg">${kws.map((k) => chipBtn('#' + k, `data-k="${e(k)}"`)).join('')}</div></div>` : ''}
  </section>`;
}
// 지금 뜨는 영상 5개 — Amicro ARC(5) 카드 펼치기: 1등이 가운데, 양옆으로 2 · 3등 …
function trendPick(pool) {
  const live = (pool || []).filter((x) => x && x.status !== 'gone' && x.ratio != null);
  const pace = (x) => (x.pace != null && Number.isFinite(Number(x.pace)) ? Number(x.pace) : null);
  let list = live.filter((x) => (Number(x.age_h) || 1e9) <= 96).sort((a, b) => ((pace(b) ?? b.ratio) - (pace(a) ?? a.ratio)) || ((b.vph || 0) - (a.vph || 0)));
  if (list.length < 5) list = [...list, ...live.filter((x) => !list.includes(x)).sort((a, b) => b.ratio - a.ratio)];
  return list.slice(0, 5);
}
function trendHtml(pool) {
  const top = trendPick(pool);
  if (top.length < 3) return `<article class="dk-card fd-trend dk-fade"><h2 class="fd-h">${ic('up', 18)}${e(t('fdTrend'))}</h2><div class="dk-empty">${e(t('fdTrendNone'))}</div></article>`;
  const order = top.length === 5 ? [3, 1, 0, 2, 4] : top.length === 4 ? [3, 1, 0, 2] : [1, 0, 2];
  const x0 = top[0];
  const xr = (x) => (x.ratio != null ? t('fdTrendX', { x: Number(x.ratio) >= 10 ? Math.round(x.ratio) : Number(x.ratio).toFixed(1) }) : '');
  return `<article class="dk-card fd-trend dk-fade">
    <div class="dk-ch"><h2 class="fd-h">${ic('up', 18)}${e(t('fdTrend'))}</h2><a class="dk-btn sm ghost" href="#radar" data-mi="slide">${e(t('fdTrendAll'))}${arrowSa()}</a></div>
    <span class="dk-sub">${e(t('fdTrendSub'))}</span>
    <div class="mo-fan" data-fan="arc" id="fdFan" style="--fan-w:${x0.kind === 'long' ? 176 : 124}px;--fan-h:${x0.kind === 'long' ? 99 : 220}px">${order.map((i) => {
      const x = top[i];
      return `<a class="mo-card" href="${e(C.ytShort(x.id))}" target="_blank" rel="noopener" data-short="${e(x.id)}" style="background-image:url('${C.cssUrl(C.vthumb(x.thumb))}')" aria-label="${e(t('fdOpenVid'))}: ${e(x.title)}"><span class="v"><span>${e(C.fmtN(x.views))}</span><span>${e(xr(x))}</span></span></a>`;
    }).join('')}</div>
    <p class="tt">${e(x0.title)}</p>
    <div class="mm"><span class="dk-tag gray">${e(x0.channel_title || '')}</span>${x0.ratio != null ? `<span class="dk-tag red">${e(xr(x0))}</span>` : ''}<span class="dk-tag">${e(C.ageTxt(x0.age_h))}</span></div>
  </article>`;
}
function toolsHtml() {
  const T2 = (k) => t('t2_' + k), D2 = (k) => t('td2_' + k);
  const items = [
    { k: 'yt', ic: 'globe', b: tt('t_topic'), p: tt('td_topic'), tab: 'yt', c: '' },
    { k: 'scout', ic: 'scout', b: T2('scout'), p: D2('scout'), tab: 'scout', c: 't2' },
    { k: 'refs', ic: 'plus', b: tt('t_refs'), p: tt('td_refs'), href: '#refs', c: 't3' },
    { k: 'comments', ic: 'chat', b: tt('t_comments'), p: tt('td_comments'), href: '#tool/comments', c: '' },
    { k: 'wave', ic: 'wave', b: tt('t_wave'), p: tt('td_wave'), href: '#wave', c: 't2' },
    { k: 'radar', ic: 'up', b: T2('radar'), p: D2('radar'), href: '#radar', c: 't3' },
    { k: 'ranking', ic: 'trophy', b: tt('t_ranking'), p: tt('td_ranking'), href: '#ranking', c: '' },
    { k: 'compare', ic: 'compare', b: T2('compare'), p: D2('compare'), href: '#compare', c: 't2' },
    { k: 'predict', ic: 'target', b: tt('t_predict'), p: tt('td_predict'), href: '#tool/predict', c: 't3' }
  ];
  const inner = (x) => `<span class="ic" aria-hidden="true">${ic(x.ic, 20)}</span><b>${e(x.b)}</b><p>${e(x.p)}</p><span class="go">${e(t('fdOpen'))}${arrowSa()}</span>`;
  return `<section class="fd-sec dk-fade"><div class="dk-ch"><h2 class="fd-h">${ic('layers', 18)}${e(t('fdTools'))}</h2><span class="dk-sub">${e(t('fdToolsSub'))}</span></div>
    <div class="fd-tools">${items.map((x) => x.tab ? `<button type="button" class="fd-tool ${x.c}" data-totab="${x.tab}" data-tilt="5" data-mi="slide">${inner(x)}</button>` : `<a class="fd-tool ${x.c}" href="${x.href}" data-tilt="5" data-mi="slide">${inner(x)}</a>`).join('')}</div></section>`;
}
function homeHtml(sg) {
  return chipsHtml(sg) + `<div class="fd-row">${trendHtml(sg.pool)}<div class="fd-sec">${toolsHtml()}</div></div>`;
}

// 입력하는 대로: 지켜보는 채널 · 영상 · 소재 보드 · 화면/도구
function localHtml(q, chans, pool, ideas) {
  const ql = q.toLowerCase();
  const ch = (chans || []).map((c) => [Math.max(score(c.title, ql), score(c.handle, ql), score(c.category, ql) * 0.6), c]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0] || (a[1].role === 'mine' ? -1 : 1)).slice(0, 6).map(([, c]) => c);
  const seen = new Set();
  const vids = [];
  for (const x of [...(pool || []), ...C.SHORTS.values()]) {
    if (!x || seen.has(x.id)) continue;
    seen.add(x.id);
    const s = Math.max(score(x.title, ql), score(x.channel_title, ql) * 0.5);
    if (s > 0) vids.push([s + Math.min(Number(x.ratio) || 0, 10) / 50, x]);
  }
  vids.sort((a, b) => b[0] - a[0]);
  const vs = vids.slice(0, 6).map(([, x]) => x);
  const ids = (ideas || []).map((i) => [Math.max(score(i.title, ql), score(i.note, ql) * 0.6), i]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, 6).map(([, i]) => i);
  const pages = C.plus.pagesFor(ql).slice(0, 6);
  const group = (title, icn, rows) => `<article class="dk-card fd-grp dk-fade"><h2 class="fd-h">${ic(icn, 18)}${e(title)} <small>${rows.length || ''}</small></h2>${rows.length ? `<ul class="fd-list">${rows.join('')}</ul>` : `<p class="fd-none">${e(t('fdNone'))}</p>`}</article>`;
  const chRows = ch.map((c) => `<li><a class="fd-r" href="#ch/${e(c.id)}">${C.avatar(c.thumb)}<span class="tx"><b>${mark(c.title, ql)}</b><small>${e(c.handle || '')} · ${e(t(c.role === 'mine' ? 'mine' : 'reference'))}${c.subs_hidden ? '' : ' · ' + e(C.fmtN(c.subs))}</small></span></a></li>`);
  const vRows = vs.map((x) => `<li><button type="button" class="fd-r" data-short="${e(x.id)}"><span class="th${x.kind === 'long' ? ' wide' : ''}" style="background-image:url('${C.cssUrl(C.vthumb(x.thumb))}')"></span><span class="tx"><b>${mark(x.title, ql)}</b><small>${e(x.channel_title || '')} · ${e(C.fmtN(x.views))}</small></span><span class="end">${C.ratioTag(x.ratio)}</span></button></li>`);
  const iRows = ids.map((i) => `<li><a class="fd-r" href="#ideas"><span class="ic" aria-hidden="true">${ic('ideas', 18)}</span><span class="tx"><b>${mark(i.title, ql)}</b><small>${e(t('st_' + (['idea', 'script', 'production', 'uploaded'].includes(i.stage) ? i.stage : 'idea')))}${i.due_on ? ' · ' + e(i.due_on) : ''}</small></span></a></li>`);
  const pRows = pages.map((x) => `<li><a class="fd-r" href="${e(x.href)}"><span class="ic" aria-hidden="true">${C.svg(x.icon, 18)}</span><span class="tx"><b>${mark(x.label, ql)}</b>${x.sub ? `<small>${e(x.sub)}</small>` : ''}</span></a></li>`);
  return `<div class="fd-res">${group(t('fdGChans'), 'user', chRows)}${group(t('fdGVids'), 'yt', vRows)}${group(t('fdGIdeas'), 'ideas', iRows)}${group(t('fdGPages'), 'page', pRows)}</div>
    <div class="fd-cta dk-fade"><p>${e(t('fdCta'))}</p><button type="button" class="dk-btn" data-totab="yt" data-mi="slide"><span class="mi-sa a" aria-hidden="true">${ic('globe', 16)}</span><span>${e(t('fdCtaYt', { q }))}</span>${arrowSa()}</button><button type="button" class="dk-btn line" data-totab="scout">${ic('scout', 16)}<span>${e(t('fdCtaScout', { q }))}</span></button></div>`;
}

// 유튜브 링크: 채널 → 지켜보기 · 크리에이터로 추가 / 영상 → 댓글 속 소재 · 제목 버전
function urlHtml(q) {
  const vm = q.match(VID_IN);
  const viewer = C.S.ws && C.S.ws.role === 'viewer' && !C.S.user?.admin;
  if (vm) {
    const id = vm[1];
    const known = C.SHORTS.get(id);
    return `<section class="fd-url dk-fade"><span class="ic" aria-hidden="true">${ic('yt', 24)}</span><span class="tx"><b>${e(t('fdUrlVid'))}</b><small>${e(q)}</small>${known ? `<small>${e(t('fdTracked'))} · ${e(known.title || '')}</small>` : ''}</span>
      <div class="acts">${known ? `<button type="button" class="dk-btn" data-short="${e(id)}">${e(t('fdAnalyze'))}</button>` : ''}<a class="dk-btn${known ? ' line' : ''}" href="#tool/comments?v=${enc(id)}">${ic('chat', 16)}<span>${e(t('fdCm'))}</span></a><a class="dk-btn line" href="#tool/title?v=${enc(id)}">${C.svg('<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>', 16)}<span>${e(t('fdVer'))}</span></a><a class="dk-btn ghost" href="https://www.youtube.com/watch?v=${enc(id)}" target="_blank" rel="noopener">${e(t('fdOpenYt'))}</a></div></section>`;
  }
  const s = q.trim();
  const href = /^https?:\/\//i.test(s) ? s : /^@/.test(s) ? 'https://www.youtube.com/' + s : /^UC[\w-]{22}$/.test(s) ? 'https://www.youtube.com/channel/' + s : 'https://' + s.replace(/^\/+/, '');
  const safe = /^https:\/\/(www\.|m\.)?youtube\.com\//i.test(href) ? href : null;
  return `<section class="fd-url dk-fade"><span class="ic" aria-hidden="true">${ic('user', 24)}</span><span class="tx"><b>${e(t('fdUrlCh'))}</b><small>${e(s)}</small></span>
    <div class="acts">${viewer ? '' : `<button type="button" class="dk-btn" data-add="reference" data-mi="pulse">${ic('plus', 16)}<span>${e(t('fdWatch'))}</span></button><button type="button" class="dk-btn line" data-add="mine">${ic('user', 16)}<span>${e(t('fdMine'))}</span></button>`}${safe ? `<a class="dk-btn ghost" href="${e(safe)}" target="_blank" rel="noopener">${e(t('fdOpenYt'))}</a>` : ''}</div>
    <div id="fdAddMsg" aria-live="polite" style="flex-basis:100%"></div></section>`;
}

// ---------- 영입 후보 (스카우트): 같은 소재 검색 결과로 계산 ----------
const SC_RANGE = { all: [0, Infinity], s1: [0, 1e4], s2: [1e4, 1e5], s3: [1e5, 1e6], s4: [1e6, Infinity] };
export function scoutList(d, range = 'all') {
  const tracked = new Set((C.S.chans || []).map((c) => c.id));
  const by = new Map();
  for (const x of (d && d.rows) || []) {
    if (!x || !x.ch) continue;
    let c = by.get(x.ch);
    if (!c) { c = { id: x.ch, title: x.chTitle, thumb: x.chThumb, subs: x.subs, n: 0, best: null }; by.set(x.ch, c); }
    c.n++;
    const bx = c.best ? Number(c.best.x) : -1;
    if (!c.best || (Number(x.x) || -1) > bx || ((Number(x.x) || -1) === bx && (x.views || 0) > (c.best.views || 0))) c.best = x;
  }
  const [lo, hi] = SC_RANGE[range] || SC_RANGE.all;
  return [...by.values()]
    .filter((c) => c.subs != null && c.best && c.best.x != null && Number(c.best.x) >= 1.5 && (Number(c.best.ageD) || 0) <= 120 && c.subs >= lo && c.subs < hi)
    .map((c) => ({ ...c, tracked: tracked.has(c.id) }))
    .sort((a, b) => (Number(b.best.x) - Number(a.best.x)) || ((b.best.views || 0) - (a.best.views || 0)));
}
const xTxt = (x) => { const n = Number(x); return n >= 100 ? Math.round(n).toLocaleString(C.loc()) : n >= 10 ? String(Math.round(n)) : n.toFixed(1); };
const vThumb = (id, long) => `https://i.ytimg.com/vi/${enc(id)}/${long ? 'mqdefault' : 'hqdefault'}.jpg`;
function scoutHtml(d) {
  const long = d.kind === 'long';
  const all = scoutList(d, 'all');
  const list = scoutList(d, F.sc).slice(0, 12);
  const seg = ['all', 's1', 's2', 's3', 's4'].map((k) => `<button type="button" class="dk-chip" data-sc="${k}" aria-pressed="${String(F.sc === k)}">${e(t(k === 'all' ? 'scAll' : 'sc' + k.slice(1)))}</button>`).join('');
  const flowN = list.slice(0, 7);
  const vidTxt = (x) => (Number(x.ageD) < 1 ? t('scVidH', { v: C.fmtN(x.views) }) : t('scVid', { v: C.fmtN(x.views), d: Math.round(Number(x.ageD)) }));
  const flow = flowN.length >= 3 ? `<div class="mo-flow" id="scFlow" data-start="0" role="group" aria-label="${e(t('scFlow'))}" style="--flow-w:${long ? 220 : 128}px">
      <div class="mo-flow-stage" tabindex="0" aria-label="${e(t('scFlow'))}">${flowN.map((c) => `<a class="mo-fc${long ? ' wide' : ''}" href="${e((long ? 'https://www.youtube.com/watch?v=' : 'https://www.youtube.com/shorts/') + enc(c.best.id))}" target="_blank" rel="noopener" style="background-image:url('${C.cssUrl(vThumb(c.best.id, long))}')" aria-label="${e(c.title)} · ${e(c.best.title)}" data-cap="${e(`<b>${e(c.best.title)}</b><small>${e(c.title)} · ${e(t('scX'))} ×${e(xTxt(c.best.x))} · ${e(vidTxt(c.best))}</small>`)}"><span class="v">×${e(xTxt(c.best.x))}</span></a>`).join('')}</div>
      <div class="mo-flow-cap" aria-live="polite"></div>
      <div class="mo-ctl"><button type="button" class="md-icon mo-prev" aria-label="${e(t('scPrev'))}">${ic('chev', 18)}</button><span class="mo-dots">${flowN.map((_, i) => `<button type="button" class="mo-dot" aria-label="${e(t('scDot', { n: i + 1 }))}"></button>`).join('')}</span><button type="button" class="md-icon mo-next" aria-label="${e(t('scNext'))}">${ic('chevR', 18)}</button></div>
    </div>` : '';
  const viewer = C.S.ws && C.S.ws.role === 'viewer' && !C.S.user?.admin;
  const card = (c) => `<article class="sc-card dk-fade" data-tilt="4">
    <div class="sc-top">${C.avatar(c.thumb)}<span class="sc-nm"><b>${e(c.title)}</b><small>${e(c.subs == null ? t('scSubsHidden') : t('scSubsN', { n: C.fmtN(c.subs) }))} · ${e(t('scInTop', { n: c.n }))}</small></span><span class="sc-x" title="${e(t('scNote'))}"><b>×${e(xTxt(c.best.x))}</b><small>${e(t('scX'))}</small></span></div>
    <a class="sc-v" href="${e((long ? 'https://www.youtube.com/watch?v=' : 'https://www.youtube.com/shorts/') + enc(c.best.id))}" target="_blank" rel="noopener"><span class="th${long ? ' wide' : ''}" style="background-image:url('${C.cssUrl(vThumb(c.best.id, long))}')"></span><span><b>${e(c.best.title)}</b><small>${e(t('scBest'))} · ${e(vidTxt(c.best))}</small></span></a>
    <div class="sc-acts">${c.tracked ? `<span class="dk-tag gray">${e(t('scWatching'))}</span>` : viewer ? '' : `<button type="button" class="dk-btn sm" data-scw="${e(c.id)}" data-mi="pulse">${ic('plus', 15)}<span>${e(t('scWatch'))}</span></button>`}<a class="dk-btn sm line" href="https://www.youtube.com/channel/${enc(c.id)}" target="_blank" rel="noopener">${e(t('scOpen'))}</a></div>
  </article>`;
  return `<section class="fd-sec dk-fade"><div class="dk-ch"><h2 class="fd-h">${ic('scout', 18)}${e(t('scTitle'))} <small>${e(t('scCount', { n: all.length }))}</small></h2></div>
    <span class="dk-sub">${e(t('scSub', { q: d.q }))}</span>
    <div class="sc-bar"><span class="dk-sub" style="font-weight:700">${e(t('scSubs'))}</span><div class="dk-chips" role="group" aria-label="${e(t('scSubs'))}">${seg}</div></div>
    ${flow}
    ${list.length ? `<div class="sc-grid">${list.map(card).join('')}</div>` : `<div class="dk-empty">${e(t('scNone'))}</div>`}
    <p class="sc-note">${e(t('scNote'))}</p></section>`;
}

// ---------- 그리기 ----------
let seq = 0;
async function paint(v, alive) {
  const my = ++seq;
  const ok = () => my === seq && alive() && v.isConnected;
  const out = v.querySelector('#fdOut');
  if (!out) return;
  const q = F.q.trim();
  out.setAttribute('aria-labelledby', 'fdTab_' + F.tab);
  // 링크면 어느 탭이든 링크 카드
  if (q && isUrl(q)) { out.innerHTML = urlHtml(q); bindOut(v, out); return; }
  if (F.tab === 'all') {
    if (!q) {
      if (!F.sugg) out.innerHTML = `<div class="dk-row" aria-busy="true"><div class="dk-card f1"><div class="dk-sk" style="height:18px;width:40%"></div><div class="dk-sk" style="height:180px"></div></div><div class="dk-card f2"><div class="dk-sk" style="height:18px;width:30%"></div><div class="dk-sk" style="height:180px"></div></div></div>`;
      const sg = await suggNow();
      if (!ok()) return;
      out.innerHTML = homeHtml(sg);
      bindOut(v, out);
      return;
    }
    const [chans, sg, ideas] = await Promise.all([C.getChans().catch(() => []), suggNow(), ideasNow()]);
    if (!ok() || F.q.trim() !== q) return;
    out.innerHTML = localHtml(q, chans, sg.pool, ideas);
    bindOut(v, out);
    return;
  }
  // 유튜브 전체 · 영입 후보: 같은 소재 검색을 써요
  if (!q) {
    const sg = await suggNow();
    if (!ok()) return;
    out.innerHTML = `<div class="dk-empty dk-fade">${e(t('fdNeedQ'))}</div>${sg.kws.length ? `<section class="fd-sec dk-fade"><h2 class="fd-h">${ic('star', 18)}${e(t('fdTry'))}</h2><div class="fd-chips" id="fdSugg">${sg.kws.map((k) => chipBtn('#' + k, `data-k="${e(k)}"`)).join('')}</div></section>` : ''}`;
    bindOut(v, out);
    return;
  }
  let d = topicCached(q);
  if (!d) {
    out.innerHTML = `<div class="dk-banner info dk-fade"><span class="dk-spin"></span> ${e(t('fdSearching'))}</div>`;
    d = await topicFetch(q);
    if (!ok() || F.q.trim() !== q) return;
  }
  if (!d.ok) { out.innerHTML = `<div class="dk-banner bad">${e(C.errText(d.error))}</div>`; return; }
  histAdd(q);
  if (F.tab === 'yt') {
    out.innerHTML = `<section class="dk-card full dk-fade"><div class="dk-ch"><h2 class="fd-h">${ic('globe', 18)}${e(tt('t_topic'))} · ‘${e(d.q)}’</h2></div>${topicView(d)}</section>`;
    bindTopicOut(out, d, (k) => { F.q = k; syncInput(v); setUrl(); paint(v, alive); });
  } else {
    out.innerHTML = scoutHtml(d);
  }
  bindOut(v, out, d);
}
function syncInput(v) {
  const inp = v.querySelector('#fdIn');
  if (inp && inp.value !== F.q) inp.value = F.q;
  const cl = v.querySelector('#fdClear');
  if (cl) cl.hidden = !F.q;
}
function setTab(v, tab, alive) {
  F.tab = tab;
  v.querySelectorAll('.fd-tab').forEach((b) => { const on = b.dataset.tab === tab; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
  const hint = v.querySelector('#fdHint');
  if (hint) hint.textContent = t(tab === 'yt' ? 'fdHintYt' : tab === 'scout' ? 'fdHintScout' : 'fdHintAll');
  const gl = v.querySelector('#fdGoL');
  if (gl) gl.textContent = tab === 'scout' ? t('fdGoScout') : t('fdGo');
  const ga = v.querySelector('#fdGo .mi-sa.a');
  if (ga) ga.innerHTML = ic(tab === 'scout' ? 'scout' : 'globe', 17);
  setUrl();
  paint(v, alive);
}

// 결과 안의 버튼들
function bindOut(v, out, d) {
  const alive = v._alive || (() => true);
  out.querySelectorAll('[data-fq]').forEach((b) => b.addEventListener('click', () => {
    F.q = b.dataset.k || b.dataset.fq;
    syncInput(v);
    if (F.tab === 'all' && b.dataset.k) { setTab(v, 'yt', alive); return; } // 추천 키워드는 바로 유튜브 전체에서
    setUrl(); paint(v, alive);
  }));
  out.querySelector('#fdHistClear')?.addEventListener('click', () => { ls.set(HK, '[]'); out.querySelector('#fdHistClear')?.closest('.fd-sec')?.remove(); });
  out.querySelectorAll('[data-totab]').forEach((b) => b.addEventListener('click', () => {
    setTab(v, b.dataset.totab, alive);
    v.querySelector('#fdIn')?.focus();
  }));
  out.querySelectorAll('[data-short]').forEach((b) => b.addEventListener('click', (ev) => {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    ev.preventDefault();
    C.openShort(b.dataset.short);
  }));
  const fanBox = out.querySelector('#fdFan');
  if (fanBox) MO.fan(fanBox);
  const flowBox = out.querySelector('#scFlow');
  if (flowBox) MO.flow(flowBox);
  const sg = out.querySelector('#fdSugg');
  if (sg) MO.focusBlur(sg);
  // 링크 카드: 채널 넣기
  out.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', async () => {
    const role = b.dataset.add === 'mine' ? 'mine' : 'reference';
    const msg = out.querySelector('#fdAddMsg');
    out.querySelectorAll('[data-add]').forEach((x) => { x.disabled = true; });
    if (msg) msg.innerHTML = `<div class="dk-banner info"><span class="dk-spin"></span> ${e(t('fdAdding'))}</div>`;
    const o = await C.act({ action: 'add', inputs: [F.q.trim()], role });
    const r0 = (o.results || [])[0];
    if (!o.ok || !r0 || !r0.ok) {
      out.querySelectorAll('[data-add]').forEach((x) => { x.disabled = false; });
      if (msg) msg.innerHTML = `<div class="dk-banner bad">${e(C.errText(o.ok ? (r0 && r0.error) || 'NOT_FOUND' : o.error))}</div>`;
      return;
    }
    const n = (r0.shorts || 0) + (r0.longs || 0);
    if (msg) msg.innerHTML = `<div class="dk-banner good">${e(t(role === 'mine' ? 'fdAddedMine' : 'fdAddedRef', { v: C.fmtFull(n) }))} · <a href="#ch/${e(r0.channel_id)}">${e(r0.title || '')} →</a></div>`;
    C.S.chansAt = 0; C.S.profAt = 0;
    MO.done(b);
  }));
  // 영입 후보: 구독자 규모 · 지켜보기
  out.querySelectorAll('[data-sc]').forEach((b) => b.addEventListener('click', () => {
    F.sc = b.dataset.sc;
    if (d) { out.innerHTML = scoutHtml(d); bindOut(v, out, d); }
  }));
  out.querySelectorAll('[data-scw]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const lab = b.querySelector('span');
    const o = await C.act({ action: 'add', inputs: [b.dataset.scw], role: 'reference', source: 'discover' });
    const r0 = (o.results || [])[0];
    if (!o.ok || !r0 || !r0.ok) { b.disabled = false; C.snack(C.errText(o.ok ? (r0 && r0.error) || 'NOT_FOUND' : o.error)); return; }
    C.S.chansAt = 0;
    b.outerHTML = `<span class="dk-tag gray">${e(t('scWatching'))}</span>`;
    C.snack(t('fdAddedRef', { v: C.fmtFull((r0.shorts || 0) + (r0.longs || 0)) }));
    if (lab) lab.textContent = '';
  }));
}

export async function vFind(v, r, alive) {
  const qs = query();
  if (!C.S.same || !v.querySelector('#fdIn')) {
    F.q = (qs.get('q') || F.q || '').slice(0, 200);
    const tb = qs.get('tab');
    F.tab = ['all', 'yt', 'scout'].includes(tb) ? tb : (qs.has('q') ? 'all' : F.tab || 'all');
  }
  v._alive = alive;
  v.innerHTML = C.head(t('find'), e(t('fdLead'))) + heroHtml() + `<div id="fdOut" role="tabpanel" aria-live="polite" style="display:flex;flex-direction:column;gap:20px"></div>`;
  const inp = v.querySelector('#fdIn');
  let timer = 0;
  inp.addEventListener('input', () => {
    F.q = inp.value.slice(0, 200);
    v.querySelector('#fdClear').hidden = !F.q;
    clearTimeout(timer);
    timer = setTimeout(() => { setUrl(); if (F.tab === 'all' || isUrl(F.q.trim()) || !F.q.trim()) paint(v, alive); }, 140);
  });
  inp.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && inp.value) { ev.preventDefault(); ev.stopPropagation(); inp.value = ''; F.q = ''; syncInput(v); setUrl(); paint(v, alive); } });
  v.querySelector('#fdClear').addEventListener('click', () => { F.q = ''; syncInput(v); setUrl(); paint(v, alive); inp.focus(); });
  v.querySelector('#fdForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    F.q = inp.value.trim().slice(0, 200);
    if (!F.q) { inp.focus(); return; }
    if (isUrl(F.q)) { setUrl(); paint(v, alive); return; }
    histAdd(F.q);
    if (F.tab === 'all') { setTab(v, 'yt', alive); return; }
    setUrl(); paint(v, alive);
  });
  const tabs = [...v.querySelectorAll('.fd-tab')];
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => { if (b.dataset.tab !== F.tab) setTab(v, b.dataset.tab, alive); });
    b.addEventListener('keydown', (ev) => {
      const k = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
      if (!k) return;
      ev.preventDefault();
      const nx = tabs[(i + k + tabs.length) % tabs.length];
      nx.focus(); setTab(v, nx.dataset.tab, alive);
    });
  });
  // 처음 열면 입력칸에 바로 (휴대폰은 키보드가 가리지 않게 빼요)
  if (!C.S.same && matchMedia('(pointer: fine)').matches) setTimeout(() => { if (document.activeElement === document.body || document.activeElement === document.getElementById('main')) inp.focus({ preventScroll: true }); }, 60);
  await paint(v, alive);
}
