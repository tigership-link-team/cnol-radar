// CNOL RADAR v11 — 대시보드 고도화
// · 속도: 지금 조회수 ÷ 같은 채널 영상이 올린 뒤 같은 시간에 보통 받은 조회수 (DB: radar_pace_of · radar_feed · radar_curve_set)
// · 지금 뜨는 중 · 채널 비교 · 채널 '조회수 크는 모양' · 소재 보드(끌어 옮기기 · 올릴 날 · 올린 영상 성과)
// · 설정(최근 7일 할당량 · 자동 수집 상태 · 브라우저 알림 · 단축키) · 어디서나 찾기(⌘K / Ctrl+K / '/') · G 다음 글자 단축키
// app.js가 mountPlus(ctx)로 공용 함수를 넘겨줘요 (순환 import 없이). 문구(PT)는 app.js가 T에 합쳐요.
import { TT } from '/agent-i18n.js';

let C = null;
export function mountPlus(ctx) { C = ctx; }
const e = (s) => C.esc(s);
const t = (k, v) => C.t(k, v);
const enc = encodeURIComponent;
const BOLT = '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>';
const SEARCH = '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>';
const PEN = '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>';
const LINK = '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>';
const fx = (x) => (x >= 10 ? String(Math.round(x)) : Number(x).toFixed(1));
const num = (x) => (x == null || x === '' || !Number.isFinite(Number(x)) ? null : Number(x));
function qs() { const h = location.hash || ''; const i = h.indexOf('?'); return new URLSearchParams(i >= 0 ? h.slice(i + 1) : ''); }
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (er) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (er) { /* 저장 못 해도 화면은 그대로 */ } }
};
const kstHour = (iso) => new Date(Date.parse(iso) + 9 * 3600e3).getUTCHours();
const hourTxt = (h) => (h == null ? '–' : new Date(Date.UTC(2020, 0, 1, h)).toLocaleTimeString(C.loc(), { hour: 'numeric', timeZone: 'UTC' }));
const ageLab = (a) => (a >= 48 && a % 24 === 0 ? t('pAgeD', { n: a / 24 }) : t('pAgeH', { n: a }));

// ---------- 문구 (한·영·일) ----------
export const PT = {
  ko: {
    tab_radar: '지금 뜨는 중', radar: '지금 뜨는 중', tab_compare: '채널 비교', compare: '채널 비교',
    radarSub: '새 영상을 같은 채널 영상이 올린 뒤 같은 시간에 보통 받은 조회수와 비교해요. 터지기 시작한 영상을 몇 시간 만에 잡아요. 매시간 새로 봐요.',
    paceX: '같은 시간 대비 {x}배', paceTip: '올린 뒤 같은 시간에 같은 채널 영상이 보통 받은 조회수와 비교한 값이에요 (CNOL RADAR 계산)', cPace: '속도', sort_pace: '속도 (같은 시간 대비)',
    sxPace: '같은 시간 대비', ytBandCh: '같은 채널 평소 (가운데 50%)', pAgeH: '{n}시간', pAgeD: '{n}일',
    rdWin: '기간', rdH: '{n}시간', rdSortL: '정렬', rdSortPace: '속도순', rdSortGain: '시간당 조회수순', rdSortNew: '최신순',
    rdKNew: '새 영상', rdKNewSub: '지난 {n}시간', rdKFast: '평소보다 빠름', rdKFastSub: '같은 시간 대비 1.5배 이상', rdKHot: '막 터지는 중', rdKHotSub: '같은 시간 대비 3배 이상',
    rdNow: '지금 {v}', rdUsual: '같은 시간 평소 {v}', rdGain: '시간당 +{v}', rdMyVer: '내 버전 제목',
    rdWait: '속도는 채널마다 사흘 넘게 지난 영상이 3개 이상 쌓이면 계산돼요. 그전에는 시간당 조회수로 보여 드려요.',
    rdEmpty: '이 시간 안에 올라온 새 영상이 없어요. 기간을 늘려 보세요.', rdNoCh: '아직 지켜보는 채널이 없어요.', rdAdd: '채널 넣으러 가기',
    rdFoot: '속도 = 지금 조회수 ÷ 같은 채널 영상이 같은 시간에 보통 받은 조회수 (사흘~30일 전에 올린 영상들의 가운데 값). CNOL RADAR가 계산한 값이에요.',
    sparkAria: '조회수 곡선 · 지금 {v}회 · 같은 시간 평소 {u}회',
    r_msg: '막 뜨기 시작한 영상이 {n}개 있어요. 같은 채널 평소보다 빨리 크고 있어요.', r_go: '지금 뜨는 중 전체 보기',
    cmpSub: '채널을 2~4개 골라 나란히 봐요. 지금 고른 형식(쇼츠/롱폼) · 최근 30일 기준이에요.', cmpAdd: '+ 채널 더하기', cmpFull: '4개까지 비교할 수 있어요', cmpRm: '{c} 빼기',
    cmpMine: '내 채널', cmpRefs: '레퍼런스', cmpNeed: '비교할 채널을 2개 이상 골라 주세요.', cmpTable: '숫자로 비교', cmpTableSub: '{k} · 최근 30일', cmpBest: '가장 좋음',
    cmpSubs: '구독자', cmpV48: '48시간 조회수', cmpUp: '30일 업로드', cmpUpV: '{n}개 · 주 {w}개', cmpMed: '평소 조회수', cmpHit: '터진 비율 (평소의 2배+)', cmpFirst: '첫 24시간 평소 조회수',
    cmpFront: '첫날 몰림 (72시간 중)', cmpLike: '좋아요 비율', cmpDur: '보통 길이', cmpHour: '자주 올리는 시간', cmpBestHour: '잘 되는 시간',
    cmpCurve: '조회수 크는 모양 (평소)', cmpCurveSub: '사흘~30일 전에 올린 영상 · 올린 뒤 시간별 가운데 값과 가운데 50%', cmpCurveNone: '곡선을 그릴 기록이 아직 모자라요 (사흘 지난 영상 3개부터).',
    cmpMedian: '가운데 값', cmpTop: '최근 30일 잘된 영상', cmpKw: '자주 터지는 키워드', cmpShared: '여러 채널에서 함께 터지는 소재', cmpSharedNone: '겹치는 소재가 아직 없어요.',
    cmpThis: '비교에 넣기', cmpGo: '고른 채널 비교 ({n})', cmpPick: '비교할 채널로 고르기',
    curveText: '보통 첫 24시간에 {a}회, 72시간에 {b}회 — 사흘 조회수의 {p}%가 첫날에 나와요.', curveText24: '보통 첫 24시간에 {a}회가 나와요.', chCurve: '조회수 크는 모양',
    cChange: '48시간 변화', cHit: '터진 비율', cState: '상태', stErr: '수집 오류', stIdle: '{d}일째 업로드 없음', stBr: '터진 영상 {n}', stUp: '상승 {p}%', stDown: '하락 {p}%', stOk: '보통', stNew: '모으는 중',
    sortBy: '{c} 기준으로 정렬',
    bdTitle: '소재 보드', bdSub: '담은 소재를 단계별로 옮기고, 올릴 날을 정하고, 올린 영상과 이어서 성과까지 봐요. 카드를 끌어서 옮길 수 있어요.',
    bdAddPh: '새 소재를 적어 주세요', bdAddDue: '올릴 날', bdAdd: '추가', bdEdit: '고치기', bdSave: '저장', bdCancel: '취소', bdNotePh: '메모 (대본 메모, 촬영 준비 등)',
    bdDueToday: '오늘 올려요', bdDueIn: 'D-{n}', bdOver: '{n}일 지남', bdNoDue: '날짜 없음', bdFrom: '참고 영상', bdLink: '올린 영상 잇기', bdLinkPh: '유튜브 링크나 영상 ID', bdLinkPick: '내 채널 최근 영상에서 고르기',
    bdLinkGo: '잇기', bdUnlink: '연결 끊기', bdLinked: '올린 영상', bdResult: '{v}회 · 평소의 {x}배', bdResultV: '{v}회', bdResultWait: '내 채널 영상이면 매시간 성과를 보여 드려요.',
    bdWeek: '이번 주 올릴 소재', bdDone: '올린 소재', bdAvg: '올린 소재 평균', bdAvgV: '평소의 {x}배', bdMoved: '‘{s}’로 옮겼어요', bdLinkedOk: '올린 영상을 이었어요', bdEmpty: '여기로 끌어다 놓아요',
    bdDel: '지우기', bdDelSure: '한 번 더 누르면 지워요', bdStage: '단계',
    qChart: '최근 7일 할당량', qChartSub: '날짜는 태평양 시간 기준 (한국 오후 4~5시에 새로 차요) · 점선은 하루 한도', qLimit: '하루 한도', qDayTip: '{d}\n{u}포인트 · 검색 {s}번',
    runHealth: '자동 수집 상태', runHealthTxt: '지난 24시간 자동 수집 {ok}/{n}번 성공', runAvg: '한 번에 평균 {s}초', runLastFail: '마지막 실패: {at} · {e}', runNoFail: '최근 실패가 없어요',
    ntTitle: '브라우저 알림', ntSub: '대시보드를 열어 둔 동안(다른 탭에 있어도) 새 급상승 · 하락 · 사라진 영상 알림을 컴퓨터 알림으로 띄워요.',
    ntOn: '알림 켜기', ntOff: '알림 끄기', ntOnState: '켜져 있어요 · 4분마다 확인해요', ntOffState: '꺼져 있어요', ntDenied: '브라우저에서 알림이 막혀 있어요. 주소창 왼쪽 자물쇠 → 알림 → 허용으로 바꿔 주세요.',
    ntNo: '이 브라우저는 페이지 알림을 지원하지 않아요.', ntTest: '시험 알림', ntTestBody: '알림이 이렇게 떠요. 새 급상승 영상이 생기면 알려 드릴게요.',
    kbTitle: '단축키', kbFind: '어디서나 찾기', kbGo: '화면 이동: G 다음 글자', kbList: 'H 에이전트 · O 한눈에 · R 지금 뜨는 중 · K 영상 랭킹 · F 맞춤 레퍼런스 · C 채널 목록 · M 채널 비교 · P 추천 소재 · W 소재 파도 · I 소재 보드 · T 도구 · A 알림 · S 설정',
    pfFind: '찾기', pfPh: '채널 · 영상 · 화면 · 도구를 찾거나, 소재를 적어 보세요', pfPages: '화면', pfTools: '도구', pfChans: '채널', pfVids: '영상', pfCmds: '바로 하기',
    pfTopic: '“{q}” 소재 검색', pfTitleQ: '“{q}”로 제목 만들기', pfPred: '“{q}” 몇 배 나올지 예측', pfRefresh: '지금 새로고침', pfKind: '쇼츠/롱폼 바꾸기 (지금: {k})', pfLang: '언어 바꾸기: {l}',
    pfNone: '찾는 게 없어요', pfHint: '↑↓ 고르기 · Enter 열기 · Esc 닫기', pfKeys: 'G 다음 H·O·R·C·M·I·T·S로 바로 이동',
    hsTitle: '최근 쓴 도구', hsClear: '기록 지우기',
    c_radar: '지금 뜨는 영상을 보여 드릴게요', c_cmp: '채널을 나란히 비교해 볼게요', c_ch: '‘{k}’ 채널을 열게요', c_board: '소재 보드를 열게요', c_quota: '할당량을 보여 드릴게요',
    c_v48: '지난 48시간 조회수는 {v}회예요 (채널 {n}개 합산).',
    alBreakEarly: '{ch} · {title} — 올린 지 {h}시간, 같은 시간 평소의 {x}배 ({v}회)',
    derived: '48시간 조회수 · 평소 대비 · 같은 시간 대비 속도 · 점수 · 예측은 CNOL RADAR가 YouTube 공개 데이터로 계산한 값이에요. YouTube가 제공하는 지표가 아니에요.'
  },
  en: {
    tab_radar: 'Rising now', radar: 'Rising now', tab_compare: 'Compare', compare: 'Compare channels',
    radarSub: 'New uploads compared with the views the same channel’s videos usually have at the same age — catch breakouts within hours. Checked every hour.',
    paceX: '{x}× usual pace', paceTip: 'Compared with the views this channel’s videos usually have at the same age (calculated by CNOL RADAR)', cPace: 'Pace', sort_pace: 'Pace (vs same age)',
    sxPace: 'Pace vs same age', ytBandCh: 'Channel usual (middle 50%)', pAgeH: '{n}h', pAgeD: '{n}d',
    rdWin: 'Window', rdH: '{n}h', rdSortL: 'Sort', rdSortPace: 'By pace', rdSortGain: 'Views per hour', rdSortNew: 'Newest',
    rdKNew: 'New videos', rdKNewSub: 'Last {n}h', rdKFast: 'Faster than usual', rdKFastSub: '1.5×+ usual pace', rdKHot: 'Breaking out', rdKHotSub: '3×+ usual pace',
    rdNow: 'Now {v}', rdUsual: 'Usual at this age {v}', rdGain: '+{v}/h', rdMyVer: 'My version',
    rdWait: 'Pace appears once a channel has 3+ videos older than 3 days. Until then you see views per hour.',
    rdEmpty: 'No new uploads in this window. Try a longer range.', rdNoCh: 'You are not watching any channels yet.', rdAdd: 'Add channels',
    rdFoot: 'Pace = views now ÷ the views this channel’s videos usually have at the same age (median of videos posted 3–30 days ago). Calculated by CNOL RADAR.',
    sparkAria: 'View curve · now {v} · usual at this age {u}',
    r_msg: '{n} videos just started taking off — faster than usual for their channels.', r_go: 'See everything rising now',
    cmpSub: 'Pick 2–4 channels and see them side by side. Uses the selected format (Shorts/long-form) and the last 30 days.', cmpAdd: '+ Add a channel', cmpFull: 'Up to 4 channels', cmpRm: 'Remove {c}',
    cmpMine: 'My channels', cmpRefs: 'References', cmpNeed: 'Pick at least 2 channels to compare.', cmpTable: 'By the numbers', cmpTableSub: '{k} · last 30 days', cmpBest: 'Best',
    cmpSubs: 'Subscribers', cmpV48: '48h views', cmpUp: 'Uploads in 30 days', cmpUpV: '{n} · {w}/week', cmpMed: 'Usual views', cmpHit: 'Hit rate (2×+ usual)', cmpFirst: 'Usual views in first 24h',
    cmpFront: 'Day-one share (of 72h)', cmpLike: 'Like rate', cmpDur: 'Typical length', cmpHour: 'Usual upload time', cmpBestHour: 'Best time',
    cmpCurve: 'How views grow (usual)', cmpCurveSub: 'Videos posted 3–30 days ago · median and middle 50% by hours since upload', cmpCurveNone: 'Not enough history yet (needs 3 videos older than 3 days).',
    cmpMedian: 'Median', cmpTop: 'Best videos · 30 days', cmpKw: 'Keywords that break out', cmpShared: 'Topics breaking out on several channels', cmpSharedNone: 'No shared topics yet.',
    cmpThis: 'Add to compare', cmpGo: 'Compare selected ({n})', cmpPick: 'Select for comparison',
    curveText: 'Usually {a} views in the first 24h and {b} by 72h — {p}% of three-day views come on day one.', curveText24: 'Usually {a} views in the first 24h.', chCurve: 'How views grow',
    cChange: '48h change', cHit: 'Hit rate', cState: 'Status', stErr: 'Collect error', stIdle: 'No upload in {d} days', stBr: '{n} breakouts', stUp: 'Up {p}%', stDown: 'Down {p}%', stOk: 'Steady', stNew: 'Collecting',
    sortBy: 'Sort by {c}',
    bdTitle: 'Idea board', bdSub: 'Move saved ideas stage by stage, set a publish date, and link the video you posted to see how it did. Drag cards to move them.',
    bdAddPh: 'Write a new idea', bdAddDue: 'Publish date', bdAdd: 'Add', bdEdit: 'Edit', bdSave: 'Save', bdCancel: 'Cancel', bdNotePh: 'Notes (script, shoot prep…)',
    bdDueToday: 'Due today', bdDueIn: 'D-{n}', bdOver: '{n}d overdue', bdNoDue: 'No date', bdFrom: 'Reference', bdLink: 'Link posted video', bdLinkPh: 'YouTube link or video ID', bdLinkPick: 'Pick from my recent videos',
    bdLinkGo: 'Link', bdUnlink: 'Unlink', bdLinked: 'Posted video', bdResult: '{v} views · {x}× usual', bdResultV: '{v} views', bdResultWait: 'Videos from your own channel show results every hour.',
    bdWeek: 'Due this week', bdDone: 'Posted', bdAvg: 'Posted ideas average', bdAvgV: '{x}× usual', bdMoved: 'Moved to “{s}”', bdLinkedOk: 'Video linked', bdEmpty: 'Drop cards here',
    bdDel: 'Delete', bdDelSure: 'Press again to delete', bdStage: 'Stage',
    qChart: 'Quota · last 7 days', qChartSub: 'Days in Pacific time (refills at midnight PT) · dashed line = daily limit', qLimit: 'Daily limit', qDayTip: '{d}\n{u} points · {s} searches',
    runHealth: 'Auto collection', runHealthTxt: '{ok}/{n} automatic runs succeeded in the last 24h', runAvg: '{s}s per run on average', runLastFail: 'Last failure: {at} · {e}', runNoFail: 'No recent failures',
    ntTitle: 'Browser notifications', ntSub: 'While the dashboard is open (even in another tab), new breakouts, drops and removed videos pop up as desktop notifications.',
    ntOn: 'Turn on', ntOff: 'Turn off', ntOnState: 'On · checks every 4 minutes', ntOffState: 'Off', ntDenied: 'Notifications are blocked in this browser. Click the lock icon in the address bar → Notifications → Allow.',
    ntNo: 'This browser does not support page notifications.', ntTest: 'Test', ntTestBody: 'This is how alerts look. We will tell you when something breaks out.',
    kbTitle: 'Keyboard shortcuts', kbFind: 'Find anything', kbGo: 'Jump: G then a letter', kbList: 'H Agent · O At a glance · R Rising now · K Video ranking · F References · C Channels · M Compare · P Picks · W Topic waves · I Idea board · T Tools · A Alerts · S Settings',
    pfFind: 'Find', pfPh: 'Find channels, videos, pages, tools — or type a topic', pfPages: 'Pages', pfTools: 'Tools', pfChans: 'Channels', pfVids: 'Videos', pfCmds: 'Actions',
    pfTopic: 'Search topic “{q}”', pfTitleQ: 'Make titles for “{q}”', pfPred: 'Forecast “{q}”', pfRefresh: 'Refresh now', pfKind: 'Switch Shorts/long-form (now: {k})', pfLang: 'Language: {l}',
    pfNone: 'Nothing found', pfHint: '↑↓ to choose · Enter to open · Esc to close', pfKeys: 'G then H·O·R·C·M·I·T·S jumps straight there',
    hsTitle: 'Recent tools', hsClear: 'Clear history',
    c_radar: 'Here’s what’s rising now', c_cmp: 'Let’s compare those channels', c_ch: 'Opening “{k}”', c_board: 'Opening your idea board', c_quota: 'Here’s today’s quota',
    c_v48: 'The last 48 hours brought {v} views (across {n} channels).',
    alBreakEarly: '{ch} · {title} — {h}h after upload, {x}× the usual views at this age ({v})',
    derived: '48-hour views, “vs usual”, pace vs same age, scores and predictions are calculated by CNOL RADAR from public YouTube data. They are not metrics provided by YouTube.'
  },
  ja: {
    tab_radar: '急上昇中', radar: '急上昇中', tab_compare: 'チャンネル比較', compare: 'チャンネル比較',
    radarSub: '新しい動画を、同じチャンネルの動画が投稿後の同じ時間に普段得る再生数と比べます。伸び始めた動画を数時間で見つけます。毎時チェック。',
    paceX: '同じ時間比 {x}倍', paceTip: '投稿後の同じ時間に、同じチャンネルの動画が普段得る再生数と比べた値です（CNOL RADARが計算）', cPace: 'スピード', sort_pace: 'スピード（同じ時間比）',
    sxPace: '同じ時間比', ytBandCh: 'チャンネルの普段（中央50%）', pAgeH: '{n}時間', pAgeD: '{n}日',
    rdWin: '期間', rdH: '{n}時間', rdSortL: '並べ替え', rdSortPace: 'スピード順', rdSortGain: '1時間あたり再生数順', rdSortNew: '新しい順',
    rdKNew: '新しい動画', rdKNewSub: '直近{n}時間', rdKFast: '普段より速い', rdKFastSub: '同じ時間比1.5倍以上', rdKHot: '急上昇', rdKHotSub: '同じ時間比3倍以上',
    rdNow: '現在 {v}', rdUsual: '同じ時間の普段 {v}', rdGain: '1時間 +{v}', rdMyVer: '自分版タイトル',
    rdWait: 'スピードは、チャンネルごとに3日以上たった動画が3本たまると計算されます。それまでは1時間あたりの再生数を表示します。',
    rdEmpty: 'この期間に新しい動画はありません。期間を延ばしてみてください。', rdNoCh: 'まだ見ているチャンネルがありません。', rdAdd: 'チャンネルを追加',
    rdFoot: 'スピード = 現在の再生数 ÷ 同じチャンネルの動画が同じ時間に普段得る再生数（3〜30日前の動画の中央値）。CNOL RADARが計算した値です。',
    sparkAria: '再生数の曲線・現在{v}回・同じ時間の普段{u}回',
    r_msg: '伸び始めた動画が{n}本あります。チャンネルの普段より速く伸びています。', r_go: '急上昇中をすべて見る',
    cmpSub: 'チャンネルを2〜4つ選んで並べて見ます。選んだ形式（ショート/長尺）・直近30日が基準です。', cmpAdd: '+ チャンネルを追加', cmpFull: '4つまで比較できます', cmpRm: '{c}を外す',
    cmpMine: 'マイチャンネル', cmpRefs: 'リファレンス', cmpNeed: '比較するチャンネルを2つ以上選んでください。', cmpTable: '数字で比較', cmpTableSub: '{k}・直近30日', cmpBest: '最も良い',
    cmpSubs: '登録者', cmpV48: '48時間の再生数', cmpUp: '30日の投稿', cmpUpV: '{n}本・週{w}本', cmpMed: '普段の再生数', cmpHit: 'ヒット率（普段の2倍以上）', cmpFirst: '最初の24時間の普段の再生数',
    cmpFront: '初日の集中度（72時間中）', cmpLike: '高評価率', cmpDur: '普段の長さ', cmpHour: 'よく投稿する時間', cmpBestHour: '伸びやすい時間',
    cmpCurve: '再生数の伸び方（普段）', cmpCurveSub: '3〜30日前の動画・投稿後の時間ごとの中央値と中央50%', cmpCurveNone: '曲線を描く記録がまだ足りません（3日たった動画3本から）。',
    cmpMedian: '中央値', cmpTop: '直近30日の伸びた動画', cmpKw: 'よく伸びるキーワード', cmpShared: '複数のチャンネルで一緒に伸びているネタ', cmpSharedNone: '重なるネタはまだありません。',
    cmpThis: '比較に追加', cmpGo: '選んだチャンネルを比較（{n}）', cmpPick: '比較用に選ぶ',
    curveText: '普段は最初の24時間で{a}回、72時間で{b}回 — 3日間の再生数の{p}%が初日に集まります。', curveText24: '普段は最初の24時間で{a}回です。', chCurve: '再生数の伸び方',
    cChange: '48時間の変化', cHit: 'ヒット率', cState: '状態', stErr: '収集エラー', stIdle: '{d}日投稿なし', stBr: '急上昇 {n}本', stUp: '上昇 {p}%', stDown: '下降 {p}%', stOk: '通常', stNew: '収集中',
    sortBy: '{c}で並べ替え',
    bdTitle: 'ネタボード', bdSub: '保存したネタを段階ごとに動かし、投稿日を決め、投稿した動画をつないで成果まで見ます。カードはドラッグで動かせます。',
    bdAddPh: '新しいネタを書く', bdAddDue: '投稿日', bdAdd: '追加', bdEdit: '編集', bdSave: '保存', bdCancel: 'キャンセル', bdNotePh: 'メモ（台本・撮影準備など）',
    bdDueToday: '今日投稿', bdDueIn: 'D-{n}', bdOver: '{n}日超過', bdNoDue: '日付なし', bdFrom: '参考動画', bdLink: '投稿した動画をつなぐ', bdLinkPh: 'YouTubeリンクまたは動画ID', bdLinkPick: 'マイチャンネルの最近の動画から選ぶ',
    bdLinkGo: 'つなぐ', bdUnlink: '解除', bdLinked: '投稿した動画', bdResult: '{v}回・普段の{x}倍', bdResultV: '{v}回', bdResultWait: 'マイチャンネルの動画なら毎時成果を表示します。',
    bdWeek: '今週投稿するネタ', bdDone: '投稿済み', bdAvg: '投稿したネタの平均', bdAvgV: '普段の{x}倍', bdMoved: '「{s}」に移動しました', bdLinkedOk: '動画をつなぎました', bdEmpty: 'ここにドラッグ',
    bdDel: '削除', bdDelSure: 'もう一度押すと削除', bdStage: '段階',
    qChart: '直近7日のクォータ', qChartSub: '日付は太平洋時間（日本時間の午後4〜5時にリセット）・点線は1日の上限', qLimit: '1日の上限', qDayTip: '{d}\n{u}ポイント・検索{s}回',
    runHealth: '自動収集の状態', runHealthTxt: '直近24時間の自動収集 {ok}/{n}回成功', runAvg: '1回あたり平均{s}秒', runLastFail: '最後の失敗：{at}・{e}', runNoFail: '最近の失敗はありません',
    ntTitle: 'ブラウザ通知', ntSub: 'ダッシュボードを開いている間（別のタブでも）、新しい急上昇・下降・消えた動画の通知をデスクトップ通知で表示します。',
    ntOn: '通知をオン', ntOff: '通知をオフ', ntOnState: 'オン・4分ごとに確認', ntOffState: 'オフ', ntDenied: 'このブラウザで通知がブロックされています。アドレスバー左の鍵 → 通知 → 許可にしてください。',
    ntNo: 'このブラウザはページ通知に対応していません。', ntTest: 'テスト通知', ntTestBody: '通知はこのように表示されます。急上昇があればお知らせします。',
    kbTitle: 'ショートカット', kbFind: 'どこでも検索', kbGo: '画面移動：Gの次に文字', kbList: 'H エージェント・O ひと目で・R 急上昇中・K 動画ランキング・F リファレンス・C チャンネル一覧・M 比較・P おすすめ・W ネタの波・I ネタボード・T ツール・A 通知・S 設定',
    pfFind: '検索', pfPh: 'チャンネル・動画・画面・ツールを検索、またはネタを入力', pfPages: '画面', pfTools: 'ツール', pfChans: 'チャンネル', pfVids: '動画', pfCmds: 'すぐ実行',
    pfTopic: '「{q}」のネタを検索', pfTitleQ: '「{q}」でタイトルを作る', pfPred: '「{q}」を予測', pfRefresh: '今すぐ更新', pfKind: 'ショート/長尺を切り替え（現在：{k}）', pfLang: '言語：{l}',
    pfNone: '見つかりません', pfHint: '↑↓ 選択・Enter 開く・Esc 閉じる', pfKeys: 'Gの次にH・O・R・C・M・I・T・Sですぐ移動',
    hsTitle: '最近使ったツール', hsClear: '履歴を消す',
    c_radar: '急上昇中の動画をお見せします', c_cmp: 'チャンネルを並べて比較します', c_ch: '「{k}」を開きます', c_board: 'ネタボードを開きます', c_quota: 'クォータをお見せします',
    c_v48: '直近48時間の再生数は{v}回です（{n}チャンネル合計）。',
    alBreakEarly: '{ch}・{title} — 投稿から{h}時間、同じ時間の普段の{x}倍（{v}回）',
    derived: '48時間の再生数・いつもとの比較・同じ時間比スピード・スコア・予測は、CNOL RADARがYouTubeの公開データから計算した値です。YouTubeが提供する指標ではありません。'
  }
};

// ---------- 속도 조각 ----------
export const paceVal = (x) => (x && x.pace != null && Number.isFinite(Number(x.pace)) ? Number(x.pace) : null);
export function paceTag(x, min = null) {
  const p = paceVal(x);
  if (p == null || (min != null && p < min)) return '';
  const cls = p >= 3 ? 'red' : p >= 1.5 ? 'amber' : 'gray';
  return `<span class="dk-tag pace ${cls}" title="${e(t('paceTip'))}">${C.svg(BOLT, 12)}${e(t('paceX', { x: fx(p) }))}</span>`;
}
// 피드 영상을 영상 창(data-short)에서 쓸 수 있게 기억해요 (이미 있는 정보는 지우지 않고 합쳐요)
export function rememberFeed(list) {
  return (list || []).map((x) => {
    const y = Object.assign({}, C.SHORTS.get(x.id) || {}, x, { status: 'live' });
    C.SHORTS.set(x.id, y);
    return y;
  });
}
// 작은 성장선: 파란 선 = 이 영상, 회색 띠 = 같은 채널 평소(가운데 50%), 점선 = 평소 가운데 값
function bandAt(band, a, k) {
  if (!band.length) return null;
  if (a <= band[0][0]) return band[0][0] > 0 ? (band[0][k] * a) / band[0][0] : band[0][k];
  for (let i = 1; i < band.length; i++) {
    if (a <= band[i][0]) {
      const [a0] = band[i - 1], [a1] = band[i];
      return band[i - 1][k] + ((band[i][k] - band[i - 1][k]) * (a - a0)) / Math.max(1e-9, a1 - a0);
    }
  }
  return band[band.length - 1][k];
}
export function spark(x, w = 140, h = 44) {
  let pts = (x.pts || []).map((p) => [num(p[0]), num(p[1])]).filter((p) => p[0] != null && p[1] != null).sort((a, b) => a[0] - b[0]);
  if (!pts.length) return '';
  if (pts[0][0] > 0 && pts[0][0] <= 6) pts = [[0, 0], ...pts];
  if (pts.length < 2) return '';
  const band = (x.band || []).map((b) => [num(b[0]), num(b[1]), num(b[2]), num(b[3])]).filter((b) => b.every((y) => y != null)).sort((a, b) => a[0] - b[0]);
  const amax = Math.max(pts[pts.length - 1][0], 1);
  const bx = band.length ? [...new Set([0, ...band.map((b) => b[0]).filter((a) => a < amax), amax])].sort((p, q) => p - q) : [];
  const ymax = Math.max(1, ...pts.map((p) => p[1]), ...bx.map((a) => bandAt(band, a, 3) || 0)) * 1.08;
  const X = (a) => ((a / amax) * (w - 6) + 3).toFixed(1);
  const Y = (y) => (h - 3 - (y / ymax) * (h - 6)).toFixed(1);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0])} ${Y(p[1])}`).join('');
  let area = '', mid = '';
  if (bx.length >= 2) {
    area = `<path class="sp-band" d="M${bx.map((a) => `${X(a)} ${Y(bandAt(band, a, 3))}`).join('L')}L${[...bx].reverse().map((a) => `${X(a)} ${Y(bandAt(band, a, 1))}`).join('L')}Z"/>`;
    mid = `<path class="sp-mid" d="M${bx.map((a) => `${X(a)} ${Y(bandAt(band, a, 2))}`).join('L')}"/>`;
  }
  const last = pts[pts.length - 1];
  const lab = t('sparkAria', { v: C.fmtFull(last[1]), u: x.exp != null ? C.fmtFull(x.exp) : '–' });
  return `<svg class="rd-spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${e(lab)}">${area}${mid}<path class="sp-ln" d="${line}"/><circle class="sp-dot" cx="${X(last[0])}" cy="${Y(last[1])}" r="2.8"/></svg>`;
}
// 에이전트 첫 화면용 짧은 목록
export function risingMini(list) {
  return `<div class="rd-mini">${list.map((x) => `<a class="rd-mrow" href="${C.ytShort(x.id)}" target="_blank" rel="noopener" data-short="${e(x.id)}">
    <span class="rd-th sm${x.kind === 'long' ? ' wide' : ''}" style="background-image:url('${C.cssUrl(C.vthumb(x.thumb))}')" aria-hidden="true"></span>
    <span class="rd-mb"><b>${e(x.title)}</b><small>${e(x.channel_title)} · ${e(C.ageTxt(x.age_h))} · ${e(C.fmtN(x.views))}</small><span class="rd-tags">${paceTag(x)}</span></span>
    ${spark(x, 104, 36)}</a>`).join('')}</div>`;
}

// ---------- 지금 뜨는 중 ----------
function rowHtml(x, i) {
  const inBoard = C.S.board.has(x.id);
  const href = C.ytShort(x.id);
  const exp = num(x.exp);
  const gain = num(x.gain) ?? null;
  return `<li class="rd-row dk-fade">
    <span class="rd-n" aria-hidden="true">${i + 1}</span>
    <a class="rd-th${x.kind === 'long' ? ' wide' : ''}" href="${href}" target="_blank" rel="noopener" data-short="${e(x.id)}" style="background-image:url('${C.cssUrl(C.vthumb(x.thumb))}')" aria-label="${e(x.title)}"><span class="v">${e(C.fmtN(x.views))}</span></a>
    <div class="rd-b">
      <a class="rd-t" href="${href}" target="_blank" rel="noopener" data-short="${e(x.id)}">${e(x.title)}</a>
      <span class="rd-m">${x.role === 'mine' ? `<span class="dk-tag teal">${e(t('mine'))}</span>` : ''}<a href="#ch/${e(x.channel_id)}">${e(x.channel_title)}</a><span aria-hidden="true">·</span><span>${e(C.agoTxt(x.published_at))}</span></span>
      <div class="rd-tags">${paceTag(x)}${paceVal(x) == null ? C.ratioTag(x.ratio) : ''}${gain != null && gain > 0 ? `<span class="dk-tag gray">${e(t('rdGain', { v: C.fmtN(gain) }))}</span>` : ''}</div>
    </div>
    <div class="rd-sp">${spark(x)}<small>${e(t('rdNow', { v: C.fmtN(x.views) }))}${exp != null ? `<br>${e(t('rdUsual', { v: C.fmtN(exp) }))}` : ''}</small></div>
    <div class="rd-act"><button type="button" class="dk-mini" data-board="${e(x.id)}" ${inBoard ? 'disabled' : ''}>${e(t(inBoard ? 'inBoard' : 'toBoard'))}</button><a class="dk-mini" href="#tool/title?v=${enc(x.id)}">${e(t('rdMyVer'))}</a></div>
  </li>`;
}
export async function vRadar(v, r, alive) {
  const S = C.S;
  if (![6, 24, 72].includes(S.rdH)) S.rdH = 24;
  if (!['all', 'reference', 'mine'].includes(S.rdRole)) S.rdRole = 'all';
  if (!['pace', 'new', 'gain'].includes(S.rdSort)) S.rdSort = 'pace';
  C.loading(v, t('radar'), e(t('radarSub')));
  const [raw, chans] = await Promise.all([
    C.rpc('radar_feed', { p_hours: S.rdH, p_role: S.rdRole === 'all' ? null : S.rdRole, p_kind: S.kind }),
    C.getChans()
  ]);
  if (!alive()) return;
  const list = rememberFeed(raw || []);
  const gainOf = (x) => num(x.gain) ?? num(x.vph) ?? 0;
  const sorters = {
    pace: (a, b) => (paceVal(b) ?? -1) - (paceVal(a) ?? -1) || gainOf(b) - gainOf(a),
    new: (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at),
    gain: (a, b) => gainOf(b) - gainOf(a)
  };
  const rows = [...list].sort(sorters[S.rdSort]).slice(0, 60);
  const nFast = list.filter((x) => (paceVal(x) ?? 0) >= 1.5).length;
  const nHot = list.filter((x) => (paceVal(x) ?? 0) >= 3).length;
  const anyPace = list.some((x) => paceVal(x) != null);
  const seg = (k, val, lab, cur) => `<button type="button" data-${k}="${val}" aria-pressed="${String(cur === val)}">${e(lab)}</button>`;
  const kpi = (lab, val, sub, cls = '') => `<div class="rd-k ${cls}"><span>${e(lab)}</span><b>${e(val)}</b><small>${e(sub)}</small></div>`;
  const body = !(chans || []).length ? `<div class="dk-empty">${e(t('rdNoCh'))}<br><a class="dk-btn" style="margin-top:12px" href="#refs">${e(t('rdAdd'))}</a></div>`
    : !rows.length ? `<div class="dk-empty">${e(t('rdEmpty'))}</div>`
      : `<ol class="rd-list">${rows.map((x, i) => rowHtml(x, i)).join('')}</ol>`;
  v.innerHTML = C.head(t('radar'), e(t('radarSub'))) + `
  <section class="dk-card full dk-fade">
    <div class="rd-bar">
      <div class="dk-seg" role="group" aria-label="${e(t('rdWin'))}">${[6, 24, 72].map((h) => seg('rh', h, t('rdH', { n: h }), S.rdH)).join('')}</div>
      <div class="dk-seg" role="group" aria-label="${e(t('cRole'))}">${seg('rr', 'all', t('all'), S.rdRole)}${seg('rr', 'reference', t('reference'), S.rdRole)}${seg('rr', 'mine', t('mine'), S.rdRole)}</div>
      <div class="dk-seg" role="group" aria-label="${e(t('rdSortL'))}">${seg('rs', 'pace', t('rdSortPace'), S.rdSort)}${seg('rs', 'gain', t('rdSortGain'), S.rdSort)}${seg('rs', 'new', t('rdSortNew'), S.rdSort)}</div>
    </div>
    <div class="rd-kpis">${kpi(t('rdKNew'), C.fmtFull(list.length), t('rdKNewSub', { n: S.rdH }))}${kpi(t('rdKFast'), C.fmtFull(nFast), t('rdKFastSub'), nFast ? 'warm' : '')}${kpi(t('rdKHot'), C.fmtFull(nHot), t('rdKHotSub'), nHot ? 'hot' : '')}</div>
    ${list.length && !anyPace ? `<div class="dk-banner info">${e(t('rdWait'))}</div>` : ''}
    ${body}
    <p class="rd-foot">${e(t('rdFoot'))}</p>
  </section>`;
  v.querySelectorAll('[data-rh]').forEach((b) => b.addEventListener('click', () => { S.rdH = Number(b.dataset.rh); C.render(); }));
  v.querySelectorAll('[data-rr]').forEach((b) => b.addEventListener('click', () => { S.rdRole = b.dataset.rr; C.render(); }));
  v.querySelectorAll('[data-rs]').forEach((b) => b.addEventListener('click', () => { S.rdSort = b.dataset.rs; C.render(); }));
  C.bindBoardButtons(v, rows);
}

// ---------- 곡선 (채널 평소) ----------
function curveRows(raw) {
  return (raw || []).map((r) => [num(r[0]), num(r[1]), num(r[2]), num(r[3]), num(r[4])]).filter((r) => r[0] != null && r[2] != null).sort((a, b) => a[0] - b[0]);
}
function curveLine(id, rows, h = 150) {
  return C.ytLine(id, {
    xs: rows.map((r) => ageLab(r[0])),
    series: [{ key: 'p50', label: t('cmpMedian'), color: C.YT_LINE, vals: rows.map((r) => r[2]) }],
    bands: { lo: rows.map((r) => r[1]), hi: rows.map((r) => r[3]), label: t('ytBandCh') },
    h, aria: t('cmpCurve'), ticks: C.xTicks(rows.length, Math.min(5, rows.length)),
    tipTitle: (i) => ageLab(rows[i][0])
  });
}
function curveText(rows) {
  const at = (a) => rows.find((r) => r[0] === a);
  const a24 = at(24), a72 = at(72);
  if (a24 && a72 && a72[2] > 0) return t('curveText', { a: C.fmtN(a24[2]), b: C.fmtN(a72[2]), p: Math.round((a24[2] / a72[2]) * 100) });
  if (a24) return t('curveText24', { a: C.fmtN(a24[2]) });
  return '';
}
// 채널 상세: '조회수 크는 모양' 카드
export function chCurveCard(raw) {
  const rows = curveRows(raw);
  if (rows.length < 2) return { html: `<section class="dk-card full dk-fade"><div class="dk-ch"><h2>${e(t('chCurve'))}</h2><span class="dk-sub">${e(t('cmpCurveSub'))}</span></div><div class="dk-empty">${e(t('cmpCurveNone'))}</div></section>`, bind() {} };
  const L = curveLine('chCv', rows, 170);
  const txt = curveText(rows);
  return { html: `<section class="dk-card full dk-fade"><div class="dk-ch"><h2>${e(t('chCurve'))}</h2><span class="dk-sub">${e(t('cmpCurveSub'))}</span></div>${L.html}${txt ? `<p class="dk-why">${e(txt)}</p>` : ''}</section>`, bind: (v) => L.bind(v) };
}

// ---------- 채널 비교 ----------
function topKw(list, n = 8) {
  const score = new Map();
  for (const s of list) {
    const w = Math.min(Number(s.ratio) || 0, 10);
    if (w < 1) continue;
    for (const k of new Set(C.tokens(s.title))) score.set(k, (score.get(k) || 0) + w);
  }
  return [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map((x) => x[0]);
}
function colStats(c, list, rows, long) {
  const durs = list.map((s) => num(s.dur)).filter((x) => x != null && x > 0);
  const likes = list.filter((s) => (s.views || 0) >= 100).map((s) => ((s.likes || 0) / s.views) * 100);
  const cnt = new Map(), rat = new Map();
  for (const s of list) {
    if (!s.published_at) continue;
    const h = kstHour(s.published_at);
    cnt.set(h, (cnt.get(h) || 0) + 1);
    if (s.ratio != null) { if (!rat.has(h)) rat.set(h, []); rat.get(h).push(Number(s.ratio)); }
  }
  const modeHour = cnt.size ? [...cnt.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0] : null;
  const best = [...rat.entries()].filter(([, a]) => a.length >= 2).map(([h, a]) => [h, C.median(a)]).sort((a, b) => b[1] - a[1])[0];
  const a24 = rows.find((r) => r[0] === 24), a72 = rows.find((r) => r[0] === 72);
  return {
    subs: c.subs_hidden ? null : num(c.subs), v48: num(c.v48), up: list.length, upw: list.length / (30 / 7),
    med: num(long ? c.median_long : c.median), hit: num(long ? c.hit_long : c.hit),
    first24: a24 ? a24[2] : null, front: a24 && a72 && a72[2] > 0 ? a24[2] / a72[2] : null,
    like: likes.length ? C.median(likes) : null, dur: durs.length ? C.median(durs) : null,
    modeHour, bestHour: best ? best[0] : null, kws: topKw(list, 12)
  };
}
function defaultPick(chans) {
  const mine = chans.filter((c) => c.role === 'mine').slice(0, 1);
  const refs = chans.filter((c) => c.role === 'reference').sort((a, b) => (b.v48 || 0) - (a.v48 || 0)).slice(0, mine.length ? 2 : 3);
  return [...mine, ...refs].map((c) => c.id);
}
export async function vCompare(v, r, alive) {
  C.loading(v, t('compare'), e(t('cmpSub')));
  const chans = await C.getChans();
  if (!alive()) return;
  const has = (id) => chans.some((c) => c.id === id);
  let ids = (qs().get('ids') || '').split(',').filter(has);
  if (!ids.length) ids = (C.S.cmpIds || []).filter(has);
  if (!ids.length) ids = defaultPick(chans);
  ids = [...new Set(ids)].slice(0, 4);
  C.S.cmpIds = ids;
  const long = C.S.kind === 'long';
  const [lists, curves] = await Promise.all([
    Promise.all(ids.map((id) => C.vids({ p_days: 30, p_channel: id, p_role: null, p_limit: 400 }).catch(() => []))),
    ids.length ? C.rpc('radar_curve_set', { p_ids: ids, p_kind: C.S.kind }).catch(() => ({})) : {}
  ]);
  if (!alive()) return;
  const cols = ids.map((id, i) => {
    const c = chans.find((x) => x.id === id);
    const list = C.remember(lists[i] || []).filter((s) => s.status === 'live');
    const rows = curveRows((curves || {})[id]);
    return { c, list, rows, st: colStats(c, list, rows, long) };
  });
  // 고르기
  const opts = (role) => chans.filter((c) => c.role === role && !ids.includes(c.id)).map((c) => `<option value="${e(c.id)}">${e(c.title)}</option>`).join('');
  const picker = `<section class="dk-card full dk-fade cmp-pick">
    <div class="cmp-sel">${cols.map(({ c }) => `<span class="cmp-chip">${C.avatar(c.thumb)}<a href="#ch/${e(c.id)}">${e(c.title)}</a>${c.role === 'mine' ? `<span class="dk-tag teal">${e(t('mine'))}</span>` : ''}<button type="button" data-cmprm="${e(c.id)}" aria-label="${e(t('cmpRm', { c: c.title }))}">${C.svg(C.IC.x, 14)}</button></span>`).join('')}</div>
    <label class="sr" for="cmpAdd">${e(t('cmpAdd'))}</label>
    <select class="dk-select" id="cmpAdd" ${ids.length >= 4 ? 'disabled' : ''}><option value="">${e(ids.length >= 4 ? t('cmpFull') : t('cmpAdd'))}</option>${opts('mine') ? `<optgroup label="${e(t('cmpMine'))}">${opts('mine')}</optgroup>` : ''}${opts('reference') ? `<optgroup label="${e(t('cmpRefs'))}">${opts('reference')}</optgroup>` : ''}</select>
  </section>`;
  // 숫자 표 (높을수록 좋은 줄만 '가장 좋음' 표시)
  const ROWS = [
    ['cmpSubs', (s) => s.subs, (x) => C.fmtN(x), 0],
    ['cmpV48', (s) => s.v48, (x) => C.fmtN(x), 1],
    ['cmpUp', (s) => s.up, (x, s) => t('cmpUpV', { n: C.fmtFull(x), w: s.upw.toFixed(1) }), 1],
    ['cmpMed', (s) => s.med, (x) => C.fmtN(x), 1],
    ['cmpHit', (s) => s.hit, (x) => Math.round(x * 100) + '%', 1],
    ['cmpFirst', (s) => s.first24, (x) => C.fmtN(x), 1],
    ['cmpFront', (s) => s.front, (x) => Math.round(x * 100) + '%', 0],
    ['cmpLike', (s) => s.like, (x) => x.toFixed(1) + '%', 1],
    ['cmpDur', (s) => s.dur, (x) => C.durTxt(x), 0],
    ['cmpHour', (s) => s.modeHour, (x) => hourTxt(x), 0],
    ['cmpBestHour', (s) => s.bestHour, (x) => hourTxt(x), 0]
  ];
  const table = cols.length ? `<section class="dk-card full dk-fade">
    <div class="dk-ch"><h2>${e(t('cmpTable'))}</h2><span class="dk-sub">${e(t('cmpTableSub', { k: t(long ? 'kindLong' : 'kindShort') }))}</span></div>
    <div class="dk-tablewrap"><table class="dk-t cmp-t"><thead><tr><th scope="col"><span class="sr">${e(t('cmpTable'))}</span></th>${cols.map(({ c }) => `<th scope="col" class="r"><a href="#ch/${e(c.id)}">${C.avatar(c.thumb)}<span>${e(c.title)}</span></a></th>`).join('')}</tr></thead><tbody>
    ${ROWS.map(([k, get, fmt, better]) => {
      const vals = cols.map(({ st }) => get(st));
      const ok = vals.filter((x) => x != null);
      const top = better && ok.length >= 2 ? Math.max(...ok) : null;
      return `<tr><th scope="row">${e(t(k))}</th>${cols.map(({ st }, i) => {
        const x = vals[i];
        const isTop = top != null && x === top;
        return `<td class="r dk-num${isTop ? ' best' : ''}">${x == null ? '–' : e(fmt(x, st))}${isTop ? `<span class="sr"> (${e(t('cmpBest'))})</span>` : ''}</td>`;
      }).join('')}</tr>`;
    }).join('')}
    </tbody></table></div>
    ${(() => {
      const seen = new Map();
      cols.forEach(({ st }, i) => st.kws.forEach((k) => { if (!seen.has(k)) seen.set(k, new Set()); seen.get(k).add(i); }));
      const shared = [...seen.entries()].filter(([, s]) => s.size >= 2).sort((a, b) => b[1].size - a[1].size).slice(0, 10).map(([k]) => k);
      return `<div class="cmp-shared"><b>${e(t('cmpShared'))}</b>${shared.length ? shared.map((k) => `<a class="dk-tag" href="#tool/topic?q=${enc(k)}">#${e(k)}</a>`).join('') : `<span class="dk-sub">${e(t('cmpSharedNone'))}</span>`}</div>`;
    })()}
  </section>` : '';
  // 채널마다: 곡선 · 잘된 영상 · 키워드
  const charts = [];
  const cards = cols.map(({ c, list, rows, st }, i) => {
    const top3 = [...list].filter((s) => s.ratio != null && (s.age_h || 0) >= 24).sort((a, b) => b.ratio - a.ratio).slice(0, 3);
    let curve = `<div class="dk-empty sm">${e(t('cmpCurveNone'))}</div>`;
    if (rows.length >= 2) { const L = curveLine('cmpCv' + i, rows, 130); charts.push(L); curve = L.html + (curveText(rows) ? `<p class="dk-why sm">${e(curveText(rows))}</p>` : ''); }
    return `<section class="dk-card dk-fade cmp-card">
      <div class="cmp-hd">${C.avatar(c.thumb)}<a href="#ch/${e(c.id)}"><b>${e(c.title)}</b></a></div>
      <h3>${e(t('cmpCurve'))}</h3>${curve}
      <h3>${e(t('cmpTop'))}</h3>${top3.length ? `<ul class="cmp-top">${top3.map((s) => `<li><a href="${C.ytShort(s.id)}" target="_blank" rel="noopener" data-short="${e(s.id)}"><span class="rd-th sm${s.kind === 'long' ? ' wide' : ''}" style="background-image:url('${C.cssUrl(C.vthumb(s.thumb))}')" aria-hidden="true"></span><span class="t">${e(s.title)}</span></a>${C.ratioTag(s.ratio)}</li>`).join('')}</ul>` : `<div class="dk-empty sm">${e(t('noShorts'))}</div>`}
      <h3>${e(t('cmpKw'))}</h3><div class="dk-chips">${st.kws.slice(0, 8).map((k) => `<a class="dk-tag gray" href="#tool/topic?q=${enc(k)}">#${e(k)}</a>`).join('') || '<span class="dk-sub">–</span>'}</div>
    </section>`;
  });
  v.innerHTML = C.head(t('compare'), e(t('cmpSub'))) + picker + (ids.length < 2 ? `<div class="dk-banner info dk-fade">${e(t('cmpNeed'))}</div>` : '') + table + (cards.length ? `<div class="cmp-grid">${cards.join('')}</div>` : '');
  charts.forEach((L) => L.bind(v));
  const go = (next) => { C.S.cmpIds = next; location.hash = '#compare?ids=' + next.join(','); };
  v.querySelectorAll('[data-cmprm]').forEach((b) => b.addEventListener('click', () => go(ids.filter((x) => x !== b.dataset.cmprm))));
  v.querySelector('#cmpAdd')?.addEventListener('change', (ev) => { if (ev.target.value) go([...ids, ev.target.value].slice(0, 4)); });
}

// ---------- 채널 목록: 상태 · 정렬 ----------
export function chanState(c, kindLong) {
  if (c.error) return { k: 'err', cls: 'red', txt: t('stErr') };
  const last = c.last_upload ? (Date.now() - Date.parse(c.last_upload)) / 864e5 : null;
  const idleAt = c.role === 'mine' ? 3 : 14;
  if (last != null && last >= idleAt) return { k: 'idle', cls: 'amber', txt: t('stIdle', { d: Math.floor(last) }) };
  if ((c.br72 || 0) > 0) return { k: 'br', cls: 'red', txt: t('stBr', { n: c.br72 }) };
  const ch = chanChange(c);
  if (ch != null && ch >= 30) return { k: 'up', cls: 'teal', txt: t('stUp', { p: ch }) };
  if (ch != null && ch <= -30) return { k: 'down', cls: 'amber', txt: t('stDown', { p: -ch }) };
  if (!c.last_collected_at || ((kindLong ? c.longs : c.shorts) || 0) === 0) return { k: 'new', cls: 'gray', txt: t('stNew') };
  return { k: 'ok', cls: 'gray', txt: t('stOk') };
}
export function chanChange(c) {
  const a = num(c.v48), b = num(c.v48_prev);
  if (a == null || b == null || b < 1000) return null;
  return Math.round(((a - b) / b) * 100);
}

// ---------- 소재 보드 ----------
const STAGES = ['idea', 'script', 'production', 'uploaded'];
const todayKst = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
function dueBadge(d, stage) {
  if (!d) return '';
  const diff = Math.round((Date.parse(d + 'T00:00:00Z') - Date.parse(todayKst() + 'T00:00:00Z')) / 864e5);
  const label = new Date(d + 'T12:00:00Z').toLocaleDateString(C.loc(), { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' });
  if (stage === 'uploaded') return `<span class="dk-tag gray">${C.svg(C.IC.cal, 12)}${e(label)}</span>`;
  const cls = diff < 0 ? 'red' : diff === 0 ? 'amber' : diff <= 3 ? 'amber' : 'gray';
  const tx = diff < 0 ? t('bdOver', { n: -diff }) : diff === 0 ? t('bdDueToday') : t('bdDueIn', { n: diff });
  return `<span class="dk-tag ${cls}">${C.svg(C.IC.cal, 12)}${e(label)} · ${e(tx)}</span>`;
}
export async function vBoard(v, r, alive) {
  C.loading(v, t('bdTitle'), e(t('bdSub')));
  const [res, mine] = await Promise.all([
    C.sb.from('radar_ideas').select('*').order('created_at', { ascending: false }).limit(300),
    C.rpc('radar_videos_list', { p_days: 90, p_channel: null, p_role: 'mine', p_limit: 600, p_kind: 'all' }).catch(() => [])
  ]);
  if (res.error) throw new Error(res.error.message);
  const ideas = res.data || [];
  const vidIds = [...new Set(ideas.flatMap((i) => [i.source_video_id, i.result_video_id]).filter(Boolean))];
  let known = [];
  if (vidIds.length) {
    const kr = await C.sb.from('radar_videos').select('id,channel_id,title,thumbnail_url,view_count,is_short,published_at').in('id', vidIds.slice(0, 300));
    known = kr.data || [];
  }
  if (!alive()) return;
  C.remember(mine);
  for (const i of ideas) if (i.source_video_id) C.S.board.add(i.source_video_id);
  const mineById = new Map((mine || []).map((x) => [x.id, x]));
  const knownById = new Map(known.map((x) => [x.id, x]));
  const recentMine = [...(mine || [])].sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)).slice(0, 30);
  // 요약
  const today = todayKst();
  const in7 = new Date(Date.parse(today + 'T00:00:00Z') + 7 * 864e5).toISOString().slice(0, 10);
  const week = ideas.filter((i) => i.stage !== 'uploaded' && i.due_on && i.due_on <= in7).length;
  const done = ideas.filter((i) => i.stage === 'uploaded');
  const rs = done.map((i) => mineById.get(i.result_video_id)).filter((x) => x && x.ratio != null).map((x) => Number(x.ratio));
  const avg = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null;
  const vidMini = (id, cls = '') => {
    const m = mineById.get(id) || C.SHORTS.get(id);
    const k = knownById.get(id);
    const title = m?.title || k?.title || id;
    const thumb = m?.thumb || k?.thumbnail_url || `https://i.ytimg.com/vi/${enc(id)}/mqdefault.jpg`;
    const kindLong = m ? m.kind === 'long' : k ? k.is_short === false : false;
    const url = (kindLong ? 'https://www.youtube.com/watch?v=' : 'https://www.youtube.com/shorts/') + enc(id);
    return `<a class="bd-vid ${cls}" href="${url}" target="_blank" rel="noopener" ${C.SHORTS.has(id) ? `data-short="${e(id)}"` : ''}><span class="rd-th sm${kindLong ? ' wide' : ''}" style="background-image:url('${C.cssUrl(C.vthumb(thumb))}')" aria-hidden="true"></span><span class="t">${e(title)}</span></a>`;
  };
  const result = (i) => {
    if (!i.result_video_id) return '';
    const m = mineById.get(i.result_video_id);
    const k = knownById.get(i.result_video_id);
    const views = m?.views ?? k?.view_count ?? null;
    const stat = m && m.ratio != null ? t('bdResult', { v: C.fmtN(views), x: fx(Number(m.ratio)) }) : views != null ? t('bdResultV', { v: C.fmtN(views) }) : t('bdResultWait');
    return `<div class="bd-res"><small>${e(t('bdLinked'))}</small>${vidMini(i.result_video_id)}<span class="bd-stat">${e(stat)}${m ? paceTag(m, 1.5) : ''}</span></div>`;
  };
  const card = (i) => `<article class="bd-card" draggable="true" data-id="${i.id}">
    <div class="bd-top"><b class="bd-t">${e(i.title)}</b><button type="button" class="bd-ic" data-ed="${i.id}" aria-label="${e(t('bdEdit'))}" title="${e(t('bdEdit'))}">${C.svg(PEN, 15)}</button></div>
    ${i.note ? `<p class="bd-note">${e(i.note)}</p>` : ''}
    ${i.due_on ? `<div class="bd-meta">${dueBadge(i.due_on, i.stage)}</div>` : ''}
    ${i.source_video_id ? `<div class="bd-src"><small>${e(t('bdFrom'))}</small>${vidMini(i.source_video_id)}</div>` : ''}
    ${result(i)}
    <div class="bd-act">
      <label class="sr" for="mv${i.id}">${e(t('bdStage'))}</label>
      <select class="dk-select bd-sel" id="mv${i.id}" data-mv="${i.id}">${STAGES.map((x) => `<option value="${x}" ${x === i.stage ? 'selected' : ''}>${e(t('st_' + x))}</option>`).join('')}</select>
      <button type="button" class="dk-mini" data-lk="${i.id}">${C.svg(LINK, 13)}${e(t('bdLink'))}</button>
      <button type="button" class="dk-mini danger" data-del="${i.id}">${e(t('bdDel'))}</button>
    </div>
    <form class="bd-form" data-edf="${i.id}" hidden novalidate>
      <label class="sr" for="et${i.id}">${e(t('bdAddPh'))}</label><input class="dk-input" id="et${i.id}" name="title" maxlength="200" value="${e(i.title)}">
      <label class="sr" for="en${i.id}">${e(t('bdNotePh'))}</label><textarea class="dk-textarea" id="en${i.id}" name="note" rows="3" maxlength="2000" placeholder="${e(t('bdNotePh'))}">${e(i.note || '')}</textarea>
      <label class="bd-due">${e(t('bdAddDue'))}<input class="dk-input" type="date" name="due" value="${e(i.due_on || '')}"></label>
      <div class="bd-fa"><button class="dk-btn sm" type="submit">${e(t('bdSave'))}</button><button class="dk-btn sm line" type="button" data-x>${e(t('bdCancel'))}</button></div>
    </form>
    <form class="bd-form" data-lkf="${i.id}" hidden novalidate>
      ${recentMine.length ? `<label class="sr" for="lp${i.id}">${e(t('bdLinkPick'))}</label><select class="dk-select" id="lp${i.id}" name="pick"><option value="">${e(t('bdLinkPick'))}</option>${recentMine.map((x) => `<option value="${e(x.id)}" ${x.id === i.result_video_id ? 'selected' : ''}>${e(String(x.title).slice(0, 60))} · ${e(C.agoTxt(x.published_at))}</option>`).join('')}</select>` : ''}
      <label class="sr" for="lu${i.id}">${e(t('bdLinkPh'))}</label><input class="dk-input" id="lu${i.id}" name="url" placeholder="${e(t('bdLinkPh'))}" autocomplete="off" spellcheck="false">
      <div class="bd-fa"><button class="dk-btn sm" type="submit">${e(t('bdLinkGo'))}</button>${i.result_video_id ? `<button class="dk-btn sm line" type="button" data-unlink>${e(t('bdUnlink'))}</button>` : ''}<button class="dk-btn sm line" type="button" data-x>${e(t('bdCancel'))}</button></div>
    </form>
  </article>`;
  const kpi = (lab, val) => `<div class="rd-k"><span>${e(lab)}</span><b>${e(val)}</b></div>`;
  v.innerHTML = C.head(t('bdTitle'), e(t('bdSub'))) + `
  <form class="dk-card full dk-fade bd-add" id="ideaForm" novalidate>
    <label class="sr" for="ideaT">${e(t('bdAddPh'))}</label><input class="dk-input" id="ideaT" maxlength="200" placeholder="${e(t('bdAddPh'))}">
    <label class="bd-due">${e(t('bdAddDue'))}<input class="dk-input" type="date" id="ideaD"></label>
    <button class="dk-btn" type="submit">${e(t('bdAdd'))}</button>
  </form>
  <div class="rd-kpis bd-kpis dk-fade">${STAGES.map((s) => kpi(t('st_' + s), C.fmtFull(ideas.filter((i) => i.stage === s).length))).join('')}${kpi(t('bdWeek'), C.fmtFull(week))}${kpi(t('bdAvg'), avg != null ? t('bdAvgV', { x: fx(avg) }) : '–')}</div>
  <div class="dk-kanban bd-board dk-fade">${STAGES.map((st) => {
    const items = ideas.filter((i) => i.stage === st).sort((a, b) => (a.due_on || '9999') .localeCompare(b.due_on || '9999') || Date.parse(b.created_at) - Date.parse(a.created_at));
    return `<div class="dk-col bd-col" data-stage="${st}"><h3>${e(t('st_' + st))} · ${items.length}</h3>${items.map(card).join('')}<div class="bd-drop">${e(t('bdEmpty'))}</div></div>`;
  }).join('')}</div>`;
  const reload = () => C.render();
  const move = async (id, stage) => {
    const out = await C.act({ action: 'idea', op: 'move', id: Number(id), stage });
    if (!out.ok) { C.snack(C.errText(out.error)); return false; }
    C.snack(t('bdMoved', { s: t('st_' + stage) }));
    return true;
  };
  v.querySelector('#ideaForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const title = v.querySelector('#ideaT').value.trim();
    if (!title) { v.querySelector('#ideaT').focus(); return; }
    const due = v.querySelector('#ideaD').value;
    const out = await C.act({ action: 'idea', op: 'add', title });
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    if (due && out.id) await C.act({ action: 'idea', op: 'edit', id: out.id, due_on: due });
    reload();
  });
  v.querySelectorAll('[data-mv]').forEach((s) => s.addEventListener('change', async () => { if (await move(s.dataset.mv, s.value)) reload(); }));
  v.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
    if (b.dataset.armed !== '1') {
      b.dataset.armed = '1';
      b.textContent = t('bdDelSure');
      setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = t('bdDel'); } }, 4000);
      return;
    }
    const out = await C.act({ action: 'idea', op: 'delete', id: Number(b.dataset.del) });
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    reload();
  }));
  const toggle = (sel, id) => {
    const f = v.querySelector(`[${sel}="${id}"]`);
    if (!f) return;
    v.querySelectorAll('.bd-form').forEach((x) => { if (x !== f) x.hidden = true; });
    f.hidden = !f.hidden;
    if (!f.hidden) f.querySelector('input,select,textarea')?.focus();
  };
  v.querySelectorAll('[data-ed]').forEach((b) => b.addEventListener('click', () => toggle('data-edf', b.dataset.ed)));
  v.querySelectorAll('[data-lk]').forEach((b) => b.addEventListener('click', () => toggle('data-lkf', b.dataset.lk)));
  v.querySelectorAll('.bd-form [data-x]').forEach((b) => b.addEventListener('click', () => { b.closest('form').hidden = true; }));
  v.querySelectorAll('[data-edf]').forEach((f) => f.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const title = f.elements.title.value.trim();
    if (!title) { f.elements.title.focus(); return; }
    const out = await C.act({ action: 'idea', op: 'edit', id: Number(f.dataset.edf), title, note: f.elements.note.value, due_on: f.elements.due.value || null });
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    reload();
  }));
  v.querySelectorAll('[data-lkf]').forEach((f) => {
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const val = (f.elements.url.value || '').trim() || (f.elements.pick ? f.elements.pick.value : '');
      if (!val) { f.elements.url.focus(); return; }
      const out = await C.act({ action: 'idea', op: 'link', id: Number(f.dataset.lkf), video_id: val });
      if (!out.ok) { C.snack(C.errText(out.error)); return; }
      C.snack(t('bdLinkedOk'));
      reload();
    });
    f.querySelector('[data-unlink]')?.addEventListener('click', async () => {
      const out = await C.act({ action: 'idea', op: 'link', id: Number(f.dataset.lkf), video_id: '' });
      if (!out.ok) { C.snack(C.errText(out.error)); return; }
      reload();
    });
  });
  // 끌어서 옮기기 (선택 상자로도 옮길 수 있어요)
  let dragId = null;
  v.querySelectorAll('.bd-card').forEach((c) => {
    c.addEventListener('dragstart', (ev) => { dragId = c.dataset.id; c.classList.add('drag'); try { ev.dataTransfer.setData('text/plain', dragId); ev.dataTransfer.effectAllowed = 'move'; } catch (er) { /* 무시 */ } });
    c.addEventListener('dragend', () => { c.classList.remove('drag'); v.querySelectorAll('.bd-col').forEach((x) => x.classList.remove('over')); });
  });
  v.querySelectorAll('.bd-col').forEach((col) => {
    col.addEventListener('dragover', (ev) => { if (!dragId) return; ev.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', (ev) => { if (!col.contains(ev.relatedTarget)) col.classList.remove('over'); });
    col.addEventListener('drop', async (ev) => {
      ev.preventDefault();
      col.classList.remove('over');
      const id = dragId; dragId = null;
      const card = id && v.querySelector(`.bd-card[data-id="${id}"]`);
      if (!card || card.closest('.bd-col') === col) return;
      col.insertBefore(card, col.querySelector('.bd-drop'));
      if (await move(id, col.dataset.stage)) reload(); else reload();
    });
  });
}

// ---------- 설정: 최근 7일 할당량 · 자동 수집 상태 · 브라우저 알림 · 단축키 ----------
export async function statusExtra(st) {
  const since = new Date(Date.now() - 8 * 864e5).toISOString();
  const { data } = await C.sb.from('radar_runs').select('kind,started_at,finished_at,ok,error,units,searches').gte('started_at', since).order('started_at', { ascending: true }).limit(3000);
  const runs = data || [];
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' });
  const today = fmt.format(new Date());
  const days = [];
  for (let i = 8; i >= 0; i--) { const d = fmt.format(new Date(Date.now() - i * 864e5)); if (!days.includes(d) && d <= today) days.push(d); }
  if (!days.includes(today)) days.push(today);
  while (days.length > 7) days.shift();
  const by = new Map(days.map((d) => [d, { u: 0, s: 0 }]));
  for (const x of runs) { const d = fmt.format(new Date(x.started_at)); if (by.has(d)) { by.get(d).u += x.units || 0; by.get(d).s += x.searches || 0; } }
  const dl = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString(C.loc(), { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' });
  const vals = days.map((d) => ({ v: by.get(d).u, s: by.get(d).s, d, cur: d === today }));
  const bars = C.barsHtml('qbar', vals, t('qChart'), 140, { v: st.budget || 9000, label: t('qLimit') });
  const ref = runs.filter((x) => x.kind === 'refresh' && Date.parse(x.started_at) > Date.now() - 24 * 3600e3 && x.finished_at);
  const okN = ref.filter((x) => x.ok).length;
  const secs = ref.map((x) => (Date.parse(x.finished_at) - Date.parse(x.started_at)) / 1000).filter((x) => x >= 0);
  const avgS = secs.length ? Math.round(secs.reduce((a, b) => a + b, 0) / secs.length) : null;
  const fail = [...runs].reverse().find((x) => x.ok === false);
  const html = `<div class="dk-row">
    <section class="dk-card f2 dk-fade"><div class="dk-ch"><h2>${e(t('qChart'))}</h2><span class="dk-sub">${e(t('qChartSub'))}</span></div>
      ${bars}<div class="q-axis" style="grid-template-columns:repeat(${days.length},1fr)">${days.map((d) => `<span>${e(dl(d))}</span>`).join('')}</div></section>
    <section class="dk-card f1 dk-fade"><h2>${e(t('runHealth'))}</h2>
      <div class="dk-big" style="font-size:34px">${ref.length ? `${okN}<small style="font-size:18px;color:var(--pv-muted)"> / ${ref.length}</small>` : '–'}</div>
      <p class="dk-sub" style="margin:0">${e(ref.length ? t('runHealthTxt', { ok: okN, n: ref.length }) : '–')}${avgS != null ? ' · ' + e(t('runAvg', { s: avgS })) : ''}</p>
      <p class="dk-sub" style="margin:0">${fail ? e(t('runLastFail', { at: C.agoTxt(fail.started_at), e: C.errText(fail.error || '') })) : e(t('runNoFail'))}</p>
    </section>
  </div>
  <div class="dk-row">
    <section class="dk-card f1 dk-fade" id="ntCard">${ntCardHtml()}</section>
    <section class="dk-card f1 dk-fade"><h2>${e(t('kbTitle'))}</h2>
      <ul class="kb-list"><li><kbd>${/Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd> <kbd>/</kbd><span>${e(t('kbFind'))}</span></li><li><kbd>G</kbd><span>${e(t('kbGo'))}</span></li></ul>
      <p class="dk-sub" style="margin:0;line-height:1.7">${e(t('kbList'))}</p>
    </section>
  </div>`;
  return {
    html,
    bind(v) {
      C.bindBars(v, 'qbar', vals, (x) => t('qDayTip', { d: dl(x.d), u: C.fmtFull(x.v), s: C.fmtFull(x.s) }));
      bindNt(v);
    }
  };
}
function ntCardHtml() {
  const st = notifyState();
  const on = notifyOn();
  const stTxt = st === 'none' ? t('ntNo') : st === 'denied' ? t('ntDenied') : on ? t('ntOnState') : t('ntOffState');
  return `<h2>${e(t('ntTitle'))}</h2><p class="dk-sub" style="margin:0">${e(t('ntSub'))}</p>
    <div class="dk-banner ${on ? 'good' : st === 'denied' ? 'warn' : 'info'}">${e(stTxt)}</div>
    ${st === 'none' || st === 'denied' ? '' : `<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="dk-btn${on ? ' line' : ''}" id="ntBtn">${e(on ? t('ntOff') : t('ntOn'))}</button>${on ? `<button type="button" class="dk-btn line" id="ntTest">${e(t('ntTest'))}</button>` : ''}</div>`}`;
}
function bindNt(v) {
  const card = v.querySelector('#ntCard');
  if (!card) return;
  card.querySelector('#ntBtn')?.addEventListener('click', async () => {
    if (notifyOn()) store.set('radar.notify', '0');
    else {
      if (Notification.permission === 'default') { try { await Notification.requestPermission(); } catch (er) { /* 무시 */ } }
      if (Notification.permission === 'granted') store.set('radar.notify', '1');
    }
    startNotify();
    card.innerHTML = ntCardHtml();
    bindNt(v);
  });
  card.querySelector('#ntTest')?.addEventListener('click', () => {
    try { new Notification('CNOL RADAR', { body: t('ntTestBody'), icon: '/icon-192.png', tag: 'radar-test' }); } catch (er) { C.snack(t('ntNo')); }
  });
}

// ---------- 브라우저 알림 (대시보드를 열어 둔 동안) ----------
let ntTimer = null;
let ntLast = null;
export function notifyState() { return 'Notification' in window ? Notification.permission : 'none'; }
export function notifyOn() { return store.get('radar.notify') === '1' && notifyState() === 'granted'; }
async function pollAlerts(first) {
  const { data } = await C.sb.from('radar_alerts').select('id,kind,severity,data,video_id,channel_id,created_at')
    .in('kind', ['breakout', 'drop', 'surge', 'missing', 'gap']).order('id', { ascending: false }).limit(12);
  const list = data || [];
  const max = list.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0);
  if (first || ntLast == null) {
    ntLast = Math.max(max, Number(store.get('radar.notifyLast')) || 0);
    store.set('radar.notifyLast', String(ntLast));
    return;
  }
  const fresh = list.filter((a) => Number(a.id) > ntLast).reverse().slice(-3);
  if (!fresh.length) return;
  ntLast = Math.max(ntLast, max);
  store.set('radar.notifyLast', String(ntLast));
  for (const a of fresh) {
    const p = C.alertParts(a);
    try {
      const n = new Notification(p.title, { body: p.body, tag: 'radar-' + a.id, icon: '/icon-192.png' });
      n.onclick = () => { window.focus(); location.hash = a.kind === 'breakout' ? '#radar' : '#alerts'; n.close(); };
    } catch (er) { /* 일부 휴대폰 브라우저는 페이지에서 바로 못 띄워요 */ }
  }
  C.updateUnread?.();
}
export function startNotify() {
  clearInterval(ntTimer);
  ntTimer = null;
  if (!notifyOn()) return;
  pollAlerts(true).catch(() => {});
  ntTimer = setInterval(() => { pollAlerts(false).catch(() => {}); }, 4 * 60e3);
}

// ---------- 도구 기록 (이 브라우저에만) ----------
const HK = 'radar.toolHist';
export function histAdd(tool, q) {
  q = String(q || '').trim().slice(0, 120);
  if (!q) return;
  try {
    const a = JSON.parse(store.get(HK) || '[]').filter((x) => !(x.tool === tool && x.q === q));
    a.unshift({ tool, q, at: Date.now() });
    store.set(HK, JSON.stringify(a.slice(0, 12)));
  } catch (er) { store.set(HK, '[]'); }
}
export function histHtml() {
  let a = [];
  try { a = JSON.parse(store.get(HK) || '[]'); } catch (er) { a = []; }
  if (!a.length) return '';
  const tl = TT[C.lang] || TT.ko;
  const href = (x) => '#tool/' + x.tool + (x.tool === 'predict' ? '?t=' : x.tool === 'comments' ? '?v=' : '?q=') + enc(x.q);
  return `<section class="tl-sec dk-fade"><div class="dk-ch"><h2>${e(t('hsTitle'))}</h2><button type="button" class="dk-mini" id="hsClear">${e(t('hsClear'))}</button></div>
    <div class="hs-list">${a.map((x) => `<a class="hs-item" href="${e(href(x))}"><span class="k">${e(tl['t_' + x.tool] || x.tool)}</span><b>${e(x.q)}</b><small>${e(C.agoTxt(new Date(x.at).toISOString()))}</small></a>`).join('')}</div></section>`;
}
export function bindHist(v) { v.querySelector('#hsClear')?.addEventListener('click', () => { store.set(HK, '[]'); v.querySelector('#hsClear').closest('section').remove(); }); }

// ---------- 어디서나 찾기 (⌘K · Ctrl+K · /) · G 다음 글자 ----------
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const cho = (s) => [...String(s)].map((ch) => { const c = ch.charCodeAt(0) - 0xac00; return c >= 0 && c < 11172 ? CHO[Math.floor(c / 588)] : ch; }).join('');
function match(text, q) {
  const s = String(text || '').toLowerCase();
  if (!q) return 1;
  if (s.startsWith(q)) return 4;
  if (s.includes(' ' + q)) return 3;
  if (s.includes(q)) return 2;
  if (/^[ㄱ-ㅎ]+$/.test(q) && cho(s).includes(q)) return 1.5;
  return 0;
}
const GO = { h: 'home', o: 'overview', r: 'radar', k: 'ranking', f: 'refs', c: 'channels', m: 'compare', p: 'picks', w: 'wave', i: 'ideas', t: 'tools', a: 'alerts', s: 'status' };
const PAGES = ['home', 'overview', 'radar', 'ranking', 'refs', 'channels', 'compare', 'picks', 'try', 'wave', 'ideas', 'tools', 'alerts', 'status'];
const TOOLS = [['topic', 'search'], ['predict', 'target'], ['title', 'wand'], ['thumb', 'image'], ['comments', 'chat'], ['dna', 'dna']];
const PIC = { home: 'agent', overview: 'overview', radar: 'up', ranking: 'ranking', refs: 'channels', channels: 'channels', compare: 'compare', picks: 'picks', try: 'try', wave: 'insights', ideas: 'ideas', tools: 'tools', alerts: 'alerts', status: 'status' };
let pf = null;
let pfItems = [];
let pfSel = 0;
let gWait = false;
function pfBuild() {
  if (pf) return pf;
  pf = document.createElement('div');
  pf.className = 'pf';
  pf.id = 'pf';
  pf.hidden = true;
  pf.setAttribute('role', 'dialog');
  pf.setAttribute('aria-modal', 'true');
  pf.innerHTML = `<div class="pf-box"><div class="pf-in">${C.svg(SEARCH, 18)}<input id="pfIn" type="text" role="combobox" aria-expanded="true" aria-controls="pfList" aria-autocomplete="list" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div><div class="pf-list" id="pfList" role="listbox"></div><div class="pf-ft"><span id="pfHint"></span><span id="pfKeys"></span></div></div>`;
  document.body.appendChild(pf);
  pf.addEventListener('mousedown', (ev) => { if (ev.target === pf) pfClose(); });
  const inp = pf.querySelector('#pfIn');
  inp.addEventListener('input', () => { pfSel = 0; pfRender(); });
  inp.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); pfMove(1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); pfMove(-1); }
    else if (ev.key === 'Enter') { ev.preventDefault(); pfRun(pfItems[pfSel]); }
    else if (ev.key === 'Escape') { ev.preventDefault(); pfClose(); }
    else if (ev.key === 'Tab') { ev.preventDefault(); pfMove(ev.shiftKey ? -1 : 1); }
  });
  pf.querySelector('#pfList').addEventListener('click', (ev) => {
    const o = ev.target.closest('[data-i]');
    if (o) pfRun(pfItems[Number(o.dataset.i)]);
  });
  pf.querySelector('#pfList').addEventListener('mousemove', (ev) => {
    const o = ev.target.closest('[data-i]');
    if (o && Number(o.dataset.i) !== pfSel) { pfSel = Number(o.dataset.i); pfMark(); }
  });
  return pf;
}
function pfCollect(q) {
  const out = [];
  const tl = TT[C.lang] || TT.ko;
  const add = (g, label, sub, icon, run, sc) => out.push({ g, label, sub, icon, run, sc });
  for (const k of PAGES) { const sc = match(t('tab_' + k) + ' ' + t(k), q); if (sc) add('pfPages', t('tab_' + k) !== 'tab_' + k ? t('tab_' + k) : t(k), '', PIC[k], () => { location.hash = '#' + k; }, sc + 0.5); }
  for (const [k, icn] of TOOLS) { const sc = match(tl['t_' + k], q); if (sc) add('pfTools', tl['t_' + k], tl['td_' + k] || '', icn, () => { location.hash = '#tool/' + k; }, sc + 0.4); }
  for (const c of C.S.chans || []) {
    const sc = Math.max(match(c.title, q), match(c.handle, q), match(c.category, q) * 0.6);
    if (q ? sc : out.filter((x) => x.g === 'pfChans').length < 5) add('pfChans', c.title, `${c.handle || ''} · ${t(c.role === 'mine' ? 'mine' : 'reference')}`, 'channels', () => { location.hash = '#ch/' + c.id; }, (sc || 1) + 0.3 + (c.role === 'mine' ? 0.2 : 0));
  }
  if (q) {
    const vs = [];
    for (const x of C.SHORTS.values()) { const sc = Math.max(match(x.title, q), match(x.channel_title, q) * 0.5); if (sc) vs.push([sc + Math.min(Number(x.ratio) || 0, 10) / 50, x]); }
    vs.sort((a, b) => b[0] - a[0]).slice(0, 6).forEach(([sc, x]) => add('pfVids', x.title, `${x.channel_title || ''} · ${C.fmtN(x.views)}`, 'yt', () => C.openShort(x.id), sc));
    const raw = pf.querySelector('#pfIn').value.trim();
    add('pfCmds', t('pfTopic', { q: raw }), '', 'search', () => { location.hash = '#tool/topic?q=' + enc(raw); }, 0.9);
    add('pfCmds', t('pfTitleQ', { q: raw }), '', 'wand', () => { location.hash = '#tool/title?q=' + enc(raw); }, 0.8);
    add('pfCmds', t('pfPred', { q: raw }), '', 'target', () => { location.hash = '#tool/predict?t=' + enc(raw); }, 0.7);
  }
  const cmds = [
    [t('pfRefresh'), 'refresh', () => document.getElementById('refreshAll')?.click()],
    [t('pfKind', { k: t(C.S.kind === 'long' ? 'kindLong' : 'kindShort') }), 'compare', () => document.querySelector(`#kindSeg [data-kind="${C.S.kind === 'long' ? 'short' : 'long'}"]`)?.click()],
    ...['ko', 'en', 'ja'].filter((l) => l !== C.lang).map((l) => [t('pfLang', { l: { ko: '한국어', en: 'English', ja: '日本語' }[l] }), 'globe', () => document.querySelector(`[data-lang="${l}"]`)?.click()])
  ];
  for (const [label, icon, run] of cmds) { const sc = match(label, q); if (sc) add('pfCmds', label, '', icon, run, q ? sc : 0.2); }
  const order = ['pfPages', 'pfTools', 'pfChans', 'pfVids', 'pfCmds'];
  if (!q) return out.sort((a, b) => order.indexOf(a.g) - order.indexOf(b.g));
  // 무리별 최고 점수 순으로 무리를 놓고, 무리 안에서는 점수 순
  const best = new Map();
  for (const x of out) best.set(x.g, Math.max(best.get(x.g) || 0, x.sc));
  return out.sort((a, b) => (best.get(b.g) - best.get(a.g)) || (order.indexOf(a.g) - order.indexOf(b.g)) || (b.sc - a.sc)).slice(0, 40);
}
const PIC2 = { search: SEARCH, target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>', wand: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>', image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>', chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', dna: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/>' };
function pfRender() {
  const q = pf.querySelector('#pfIn').value.trim().toLowerCase();
  pfItems = pfCollect(q);
  if (pfSel >= pfItems.length) pfSel = Math.max(0, pfItems.length - 1);
  let g = '';
  pf.querySelector('#pfList').innerHTML = pfItems.length ? pfItems.map((x, i) => {
    const hd = x.g !== g ? `<div class="pf-g" role="presentation">${e(t(x.g))}</div>` : '';
    g = x.g;
    return `${hd}<div class="pf-o" role="option" id="pfo${i}" data-i="${i}" aria-selected="${String(i === pfSel)}">${C.svg(C.IC[x.icon] || PIC2[x.icon] || SEARCH, 17)}<span class="l"><b>${e(x.label)}</b>${x.sub ? `<small>${e(x.sub)}</small>` : ''}</span><kbd>↵</kbd></div>`;
  }).join('') : `<div class="pf-none">${e(t('pfNone'))}</div>`;
  pfMark();
}
function pfMark() {
  pf.querySelectorAll('.pf-o').forEach((o) => o.setAttribute('aria-selected', String(Number(o.dataset.i) === pfSel)));
  const cur = pf.querySelector('#pfo' + pfSel);
  pf.querySelector('#pfIn').setAttribute('aria-activedescendant', cur ? cur.id : '');
  cur?.scrollIntoView({ block: 'nearest' });
}
function pfMove(d) { if (!pfItems.length) return; pfSel = (pfSel + d + pfItems.length) % pfItems.length; pfMark(); }
function pfRun(x) { if (!x) return; pfClose(); setTimeout(() => x.run(), 10); }
let pfPrev = null;
export function pfOpen(q = '') {
  pfBuild();
  pfPrev = document.activeElement;
  const inp = pf.querySelector('#pfIn');
  inp.placeholder = t('pfPh');
  inp.setAttribute('aria-label', t('pfFind'));
  pf.setAttribute('aria-label', t('pfFind'));
  pf.querySelector('#pfHint').textContent = t('pfHint');
  pf.querySelector('#pfKeys').textContent = t('pfKeys');
  inp.value = q;
  pfSel = 0;
  pf.hidden = false;
  document.body.classList.add('pf-on');
  pfRender();
  setTimeout(() => inp.focus(), 0);
  if (!C.S.chans) C.getChans().then(() => { if (!pf.hidden) pfRender(); }).catch(() => {});
}
export function pfClose() {
  if (!pf || pf.hidden) return;
  pf.hidden = true;
  document.body.classList.remove('pf-on');
  if (pfPrev && pfPrev.isConnected && pfPrev.focus) pfPrev.focus();
}
export function mountKeys() {
  const btn = document.getElementById('findBtn');
  if (btn) btn.addEventListener('click', () => pfOpen());
  document.addEventListener('keydown', (ev) => {
    const el = ev.target;
    const typing = el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
    if ((ev.metaKey || ev.ctrlKey) && !ev.altKey && (ev.key === 'k' || ev.key === 'K')) { ev.preventDefault(); if (pf && !pf.hidden) pfClose(); else pfOpen(); return; }
    if (typing || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (document.querySelector('.dk-modal.on')) return;
    if (ev.key === '/') { ev.preventDefault(); pfOpen(); return; }
    if (gWait) {
      gWait = false;
      const to = GO[String(ev.key).toLowerCase()];
      if (to) { ev.preventDefault(); location.hash = '#' + to; }
      return;
    }
    if (ev.key === 'g' || ev.key === 'G') { gWait = true; setTimeout(() => { gWait = false; }, 1500); }
  });
}
export function findLabel() {
  const btn = document.getElementById('findBtn');
  if (!btn) return;
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  btn.innerHTML = `${C.svg(SEARCH, 16)}<span>${e(t('pfFind'))}</span><kbd>${mac ? '⌘' : 'Ctrl'} K</kbd>`;
  btn.setAttribute('aria-label', t('pfFind') + ' (' + (mac ? '⌘' : 'Ctrl') + '+K)');
}
