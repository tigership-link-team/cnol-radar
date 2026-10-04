// CNOL RADAR 대시보드 — 실험 모드 (로그인 없이 열린 공용 공간)
// 읽기: Supabase RPC(공개 읽기 전용) · 수집·편집: Edge Function `radar` (유튜브 키는 서버에만)
import { sb, getLang, setLang, esc } from '/common.js';

const LANGS = ['ko', 'en', 'ja'];
let lang = getLang();

const T = {
  ko: {
    home: '대시보드', picks: '소재 추천', ranking: '쇼츠 랭킹', alerts: '에이전트 알림', collect: '채널 수집', channels: '채널 목록',
    ideas: '소재 보드', partners: '음원·광고 연결', status: '설정·상태', landing: '소개 페이지',
    secRadar: '레이더', secCollect: '수집', secWork: '작업', brandSub: '크놀레이더 · 실험 모드',
    testNote: '<b>실험 모드</b> · 로그인 없이 열린 공용 공간이에요. 로그인을 붙이면 사람마다 따로 보여요.',
    refreshAll: '지금 새로고침', refreshing: '새로고침 중…', refreshed: '새로고침 완료 · 채널 {n}개', refreshSkip: '방금 수집했어요. 10분 뒤에 다시 할 수 있어요.',
    loading: '불러오는 중이에요…', loadFail: '불러오지 못했어요. 잠시 후 다시 해주세요.', saved: '저장했어요', added: '소재 보드에 담았어요',
    viewOnYt: '유튜브에서 보기', toBoard: '소재 보드에 담기', inBoard: '담았어요', chOpen: '채널 보기',
    mine: '내 채널', reference: '레퍼런스', all: '전체', unread: '안 읽음', markAll: '모두 읽음', read: '읽음', seeAll: '모두 보기',
    remove: '삭제', removeConfirm: '정말 지울까요?', removed: '채널을 지웠어요', refresh: '새로고침',
    unitViews: '회', justNow: '방금', minAgo: '{n}분 전', hAgo: '{n}시간 전', dAgo: '{n}일 전', hShort: '{n}시간', dShort: '{n}일',
    homeSub: '수집 중인 채널 {n}개 · 마지막 수집 {t} · 매시 5분 자동 수집', homeSubNone: '채널 링크만 넣으면 바로 수집을 시작해요',
    live48: '실시간 · 지난 48시간', last1h: '지난 1시간', vsPrev: '직전 48시간보다 {p}% {dir}', more: '늘었어요', less: '줄었어요',
    coverage: '수집 시작 후 {h}시간치예요 · 4일이 차면 직전 48시간과 비교해요', ago48: '48시간 전', ago24: '24시간 전', now: '지금', preCollect: '수집 전',
    rank48: '채널 순위 · 48시간', sinceLast: '직전 수집 대비', ownMetric: '48시간 수치는 공개 조회수를 매시간 재서 만든 자체 지표예요.',
    daily28: '일별 조회수 · 지난 28일', dailyNote: '채널 총조회수의 하루 차이로 계산해요 · 수집한 날부터 쌓여요', prev28: '직전 28일보다 {p}% {dir}',
    tops48: '잘된 쇼츠 · 48시간', todayPicks: '오늘의 추천 소재', todayPicksSub: '레퍼런스에서 평소보다 크게 터진 쇼츠예요',
    agentFeed: '에이전트 알림', noAlerts: '아직 알림이 없어요. 매시간 확인하고 생기면 바로 여기에 떠요.',
    kChannels: '수집 채널', kChannelsSub: '내 채널 {m} · 레퍼런스 {r}', kShorts: '추적 중인 쇼츠', kShortsSub: '채널마다 최근 50개',
    kUnits: '오늘 쓴 API 포인트', kUnitsSub: '하루 {b}까지', kNext: '다음 자동 수집', kNextSub: '매시 5분 · 오전 8:30 브리핑',
    obTitle: '채널 링크를 넣으면 바로 수집을 시작해요', obSub: '유튜브 채널 주소, @핸들, 쇼츠 링크를 한 줄에 하나씩 넣어 주세요. 내 채널을 먼저 넣고, 참고하고 싶은 레퍼런스 채널을 넣으면 맞춤 추천이 바로 잡혀요.',
    addTitle: '채널 추가', addLabel: '채널 주소 · @핸들 · 쇼츠 링크 (한 줄에 하나, 최대 30개)', roleQ: '어떤 채널인가요?', catLabel: '분류 (선택)', catPh: '예: 요리, 반려동물, 게임',
    collectBtn: '수집하기', collecting: '수집 중이에요… 채널당 몇 초 걸려요', resOk: '쇼츠 {n}개 수집', resExisted: '이미 있던 채널 · 새로 고쳤어요',
    platNote: '유튜브는 지금 바로 돼요 · 틱톡·인스타그램은 공식 API 연결 후 열려요',
    mineNote: '내 채널도 지금은 공개 데이터로 봐요. 구글 로그인 연결이 열리면 시청 지속률·트래픽 소스까지 붙어요.',
    collectSub: '최근 쇼츠 50개와 조회수를 바로 모으고, 그 뒤로는 매시간 자동으로 다시 재요.',
    discTitle: '추천 채널 찾기', discSub: '키워드로 최근 7일 동안 크게 터진 쇼츠를 찾아, 아직 수집하지 않은 채널을 골라 드려요. 작은 채널이 크게 터진 경우를 위로 올려요.',
    discKw: '키워드 (쉼표로 최대 3개 · 비우면 자동)', discBtn: '찾기', discCost: '키워드 1개에 100포인트를 써요', discSuggest: '추천 키워드',
    discEmpty: '아직 찾은 채널이 없어요. 키워드를 넣고 찾아보세요.', discFound: '{n}개 채널을 찾았어요', viaSearch: '‘{k}’ 최근 7일 쇼츠 상위', viaFeatured: '{f} 채널이 소개한 채널',
    addRef: '레퍼런스로 추가', hide: '숨기기', subs: '구독자 {n}', hiddenSubs: '구독자 비공개', sample: '대표 쇼츠',
    channelsSub: '역할(내 채널/레퍼런스)과 분류를 바꿀 수 있어요. 줄을 누르면 채널 분석이 열려요.', search: '검색',
    cChannel: '채널', cRole: '역할', cCat: '분류', cSubs: '구독자', cShorts: '쇼츠', cN7: '7일 업로드', cMedian: '평소 조회수', c48: '48시간', cLast: '마지막 수집',
    noChannels: '아직 수집한 채널이 없어요.', goCollect: '채널 수집하러 가기', roleSwitched: '역할을 바꿨어요',
    chBack: '채널 목록', chOpenYt: '유튜브 채널 열기', chShorts: '수집한 쇼츠', chUsual: '평소 조회수(중앙값) {v}', chAlerts: '이 채널 알림', chHourly: '이 채널 48시간', chDaily: '이 채널 일별 조회수', chNotFound: '채널을 찾지 못했어요.',
    ratio: '평소의 {x}배', sortNew: '최신순', sortRatio: '평소 대비', sortViews: '조회수',
    picksSub: '평소보다 크게 터진 쇼츠를 골라 왜 떴는지와 내 채널에 적용할 점을 정리했어요. 에이전트가 매시간 다시 골라요.',
    scopeAll: '전체', scopeMine: '내 분야', scopeOther: '다른 분야', p2: '48시간', p7: '7일', p30: '30일', kwTitle: '요즘 터지는 키워드', kwFind: '이 키워드로 채널 찾기',
    whyTitle: '왜 떴나', applyTitle: '내 채널이라면', whyLine: '올린 지 {h} 만에 {v}회 · 채널 평소의 {x}배 · 시간당 {vph}회',
    picksEmpty: '아직 고를 쇼츠가 없어요. 레퍼런스 채널을 더 넣으면 바로 골라 드려요.', noMyCat: '내 채널에 분류를 넣으면 ‘내 분야’로 골라볼 수 있어요.',
    fmt_number: '숫자형', fmt_question: '질문형', fmt_compare: '비교형', fmt_challenge: '실험·도전형', fmt_twist: '반전형', fmt_howto: '정보·꿀팁형', fmt_review: '리뷰형', fmt_list: '순위형',
    tip_number: '숫자(가격·개수·시간)를 제목 앞과 첫 화면에 크게 넣어 보세요.', tip_question: '첫 1초에 질문을 던지고 답은 마지막 3초에 보여주세요.',
    tip_compare: '두 개를 한 화면에 나란히 — 결과부터 보여주고 이유는 뒤에.', tip_challenge: '결과 장면을 먼저 보여주고 과정을 빠르게 되감아 보세요.',
    tip_twist: '마지막 2초 반전을 위해 앞부분은 평범하게 끌고 가세요.', tip_howto: '준비물 → 결과 → 과정 순서로, 자막은 한 줄 짧게.',
    tip_review: '첫 장면에 결론(살까/말까)을 박고 근거 3개로 끝내세요.', tip_list: '1위는 마지막에, 순위는 화면 구석에 계속 띄워 두세요.',
    tip_default: '같은 소재를 내 채널 톤으로 — 첫 2초에 가장 센 장면을 두세요.',
    rankingSub: '수집 중인 채널의 쇼츠를 한 줄로 세웠어요. 48시간 조회수는 매시간 잰 공개 조회수 차이예요.',
    sort_v48: '48시간 조회수', sort_ratio: '평소 대비', sort_vph: '시간당 조회수', sort_views: '전체 조회수', sort_new: '최신순',
    cTitle: '쇼츠', cAge: '올린 지', cViews: '조회수', cVph: '시간당', cRatio: '평소 대비', noShorts: '조건에 맞는 쇼츠가 없어요.',
    alertsSub: '에이전트가 매시간 확인해요 — 레퍼런스 터짐, 내 채널 업로드 공백, 영상 사라짐(비공개·삭제), 연령 제한, 지역 차단, 48시간 급상승·급락, 그리고 매일 오전 8:30 브리핑.',
    alBreakMine: '내 쇼츠가 터지고 있어요', alBreakRef: '레퍼런스 쇼츠가 터졌어요', alBreakBody: '{ch} · “{title}” — 올린 지 {h}시간 만에 {v}회, 평소의 {x}배',
    alGap: '업로드 공백', alGapBody: '{ch} 채널이 {d}일째 쇼츠를 안 올렸어요. 오늘 하나 올려 흐름을 이어 가세요.',
    alMissing: '영상이 사라졌어요', alMissingBody: '{ch} · “{title}” — 비공개로 바뀌었거나 삭제됐어요.',
    alAge: '연령 제한이 걸렸어요', alAgeBody: '{ch} · “{title}” — 연령 제한 영상은 쇼츠 피드 노출이 크게 줄어요.',
    alRegion: '지역 차단이 있어요', alRegionBody: '{ch} · “{title}” — {n}개 나라에서 막혀 있어요{kr}.', alRegionKr: ' (한국 포함)',
    alSurge: '48시간 급상승', alDrop: '48시간 급락', alTrendBody: '{ch} — 직전 48시간 {p}회 → 지난 48시간 {c}회 ({pct}%)',
    alBrief: '오늘의 브리핑', alBriefBody: '지난 48시간 {v}회 · 터진 레퍼런스 {n}건{picks}', alBriefPicks: ' · 추천 소재: {p}',
    ideasSub: '추천에서 담은 소재와 직접 적은 아이디어를 단계별로 옮겨 가며 관리해요.', ideaPh: '새 소재를 적어 주세요', ideaAdd: '추가',
    st_idea: '아이디어', st_script: '대본', st_production: '제작', st_uploaded: '업로드', ideaEmpty: '비어 있어요', stage: '단계', del: '지우기',
    partnersSub: '크놀뮤직 음원, 크놀AD 광고, PPL을 채널에 맞춰 연결해 드려요. 실제로 채널을 운영하는 팀이 직접 연결해요.',
    p1t: '음원 협업 · CNOL Music', p1d: '내 채널 무드에 맞는 음원을 쓰고, 맞춤 음원 협업까지 이어 드려요.',
    p2t: '광고 캠페인 · CNOL AD', p2d: '채널 성과와 분야에 맞는 광고 캠페인을 제안받아요.',
    p3t: 'PPL', p3d: '소재와 어울리는 브랜드 PPL을 연결하고 진행까지 도와 드려요.', soon: '로그인을 붙이면 여기서 바로 신청돼요',
    statusSub: '수집 엔진 상태와 오늘 쓴 유튜브 API 포인트를 보여줘요.',
    keyOk: '유튜브 API 키가 연결돼 있어요', keyNo: '유튜브 API 키가 아직 없어요 — Supabase Edge Functions → Secrets에 YOUTUBE_API_KEY를 넣어 주세요.',
    unitsTitle: '오늘 쓴 API 포인트', unitsHelp: '채널 하나 새로고침에 2~3포인트, 추천 채널 찾기는 키워드당 100포인트를 써요. 유튜브 하루 1만 포인트 중 9천까지만 쓰도록 막아 뒀어요.',
    runsTitle: '최근 수집 기록', run_add: '채널 추가', run_refresh: '새로고침', run_discover: '추천 채널 찾기', run_daily: '아침 브리핑', runOk: '성공', runFail: '실패',
    schedTitle: '자동 일정', sched1: '매시 5분 — 전체 채널 새로고침 · 이슈 확인', sched2: '매일 오전 8:30 — 오늘의 브리핑 · 추천 채널 자동 발굴',
    policyTitle: '데이터 원칙', policy1: '공개 데이터만 유튜브 공식 API로 모아요. 영상 파일은 내려받지 않아요.',
    policy2: '48시간 수치는 매시간 잰 공개 조회수로 만든 자체 지표예요. 유튜브 스튜디오 수치와 다를 수 있어요.',
    policy3: '정식 출시 전에는 유튜브 API 정책 심사(파생 지표·장기 보관)를 받아야 해요.',
    testTitle: '실험 모드', test1: '지금은 로그인 없이 누구나 같은 공간을 봐요. 로그인을 붙이면 사람마다 따로 보이고, 내 채널은 그 채널의 구글 계정으로 연결해요.',
    err_NOT_FOUND: '채널을 찾지 못했어요. 주소나 @핸들을 확인해 주세요.', err_BAD_LINK: '유튜브 채널·영상 링크가 아니에요.',
    err_PLATFORM: '틱톡·인스타그램은 공식 API 연결 후 수집돼요. 지금은 유튜브만 돼요.', err_FULL: '실험 모드는 채널 100개까지예요.',
    err_NO_KEY: '유튜브 API 키가 아직 없어요. 설정·상태를 확인해 주세요.', err_BAD_KEY: '유튜브 API 키가 올바르지 않아요.',
    err_API_OFF: '구글 클라우드에서 YouTube Data API가 꺼져 있어요.', err_QUOTA: '오늘 유튜브 API 사용량을 다 썼어요. 내일 다시 열려요.',
    err_QUOTA_BUDGET: '오늘 쓸 수 있는 API 포인트가 부족해요. 내일 다시 해주세요.', err_COOLDOWN: '방금 찾았어요. 몇 분 뒤에 다시 해주세요.',
    err_NO_KEYWORDS: '찾을 키워드를 넣어 주세요.', err_EMPTY: '링크를 넣어 주세요.', err_default: '처리하지 못했어요 ({e})'
  },
  en: {
    home: 'Dashboard', picks: 'Idea picks', ranking: 'Shorts ranking', alerts: 'Agent alerts', collect: 'Collect channels', channels: 'Channels',
    ideas: 'Idea board', partners: 'Music & ads', status: 'Settings & status', landing: 'About CNOL RADAR',
    secRadar: 'Radar', secCollect: 'Collection', secWork: 'Workspace', brandSub: 'Test mode',
    testNote: '<b>Test mode</b> · a shared space open without sign-in. Once sign-in is added, everyone gets their own view.',
    refreshAll: 'Refresh now', refreshing: 'Refreshing…', refreshed: 'Refreshed · {n} channels', refreshSkip: 'Just collected. You can refresh again in 10 minutes.',
    loading: 'Loading…', loadFail: "Couldn't load. Please try again shortly.", saved: 'Saved', added: 'Added to the idea board',
    viewOnYt: 'Watch on YouTube', toBoard: 'Add to board', inBoard: 'Added', chOpen: 'Open channel',
    mine: 'My channel', reference: 'Reference', all: 'All', unread: 'Unread', markAll: 'Mark all read', read: 'Mark read', seeAll: 'See all',
    remove: 'Remove', removeConfirm: 'Remove for sure?', removed: 'Channel removed', refresh: 'Refresh',
    unitViews: ' views', justNow: 'just now', minAgo: '{n}m ago', hAgo: '{n}h ago', dAgo: '{n}d ago', hShort: '{n}h', dShort: '{n}d',
    homeSub: 'Tracking {n} channels · last collected {t} · auto-collects hourly at :05', homeSubNone: 'Paste a channel link and collection starts right away',
    live48: 'Live · last 48 hours', last1h: 'Last hour', vsPrev: '{p}% {dir} than the previous 48 hours', more: 'more', less: 'less',
    coverage: '{h} hours of data so far · comparison opens after 4 days', ago48: '48h ago', ago24: '24h ago', now: 'Now', preCollect: 'Before tracking',
    rank48: 'Channel ranking · 48h', sinceLast: 'since last collection', ownMetric: '48-hour figures are our own metric from hourly public view counts.',
    daily28: 'Daily views · last 28 days', dailyNote: 'From daily changes in channel total views · fills in from the day tracking starts', prev28: '{p}% {dir} than the previous 28 days',
    tops48: 'Top Shorts · 48h', todayPicks: "Today's idea picks", todayPicksSub: 'Reference Shorts that broke out above their usual',
    agentFeed: 'Agent alerts', noAlerts: 'No alerts yet. The agent checks every hour and posts here.',
    kChannels: 'Channels tracked', kChannelsSub: 'Mine {m} · References {r}', kShorts: 'Shorts tracked', kShortsSub: 'Latest 50 per channel',
    kUnits: 'API points used today', kUnitsSub: 'up to {b} a day', kNext: 'Next auto-collect', kNextSub: 'Hourly at :05 · 8:30 AM briefing',
    obTitle: 'Paste channel links to start collecting', obSub: 'Add YouTube channel URLs, @handles or Shorts links — one per line. Add your own channel first, then references you want to learn from, and picks tune themselves.',
    addTitle: 'Add channels', addLabel: 'Channel URL · @handle · Shorts link (one per line, up to 30)', roleQ: 'This is…', catLabel: 'Category (optional)', catPh: 'e.g. cooking, pets, gaming',
    collectBtn: 'Collect', collecting: 'Collecting… a few seconds per channel', resOk: '{n} Shorts collected', resExisted: 'already tracked · refreshed',
    platNote: 'YouTube works now · TikTok and Instagram open after official API access',
    mineNote: 'Your own channel uses public data for now. Once Google sign-in opens, retention and traffic sources join in.',
    collectSub: 'We collect the latest 50 Shorts and their views right away, then re-measure every hour automatically.',
    discTitle: 'Find reference channels', discSub: "Search Shorts that broke out in the last 7 days and pick channels you don't track yet. Small channels with big hits rank higher.",
    discKw: 'Keywords (up to 3, comma-separated · leave empty for auto)', discBtn: 'Find', discCost: 'Each keyword uses 100 points', discSuggest: 'Suggested',
    discEmpty: 'No channels found yet. Enter a keyword and search.', discFound: 'Found {n} channels', viaSearch: 'Top “{k}” Shorts, last 7 days', viaFeatured: 'Featured by {f}',
    addRef: 'Add as reference', hide: 'Hide', subs: '{n} subscribers', hiddenSubs: 'Subscribers hidden', sample: 'Top Short',
    channelsSub: 'Switch roles (mine/reference) and categories. Click a row to open channel analytics.', search: 'Search',
    cChannel: 'Channel', cRole: 'Role', cCat: 'Category', cSubs: 'Subscribers', cShorts: 'Shorts', cN7: 'Uploads 7d', cMedian: 'Usual views', c48: '48h', cLast: 'Last collected',
    noChannels: 'No channels yet.', goCollect: 'Go collect channels', roleSwitched: 'Role updated',
    chBack: 'Channels', chOpenYt: 'Open on YouTube', chShorts: 'Collected Shorts', chUsual: 'Usual views (median) {v}', chAlerts: 'Alerts for this channel', chHourly: 'This channel · 48h', chDaily: 'This channel · daily views', chNotFound: 'Channel not found.',
    ratio: '{x}× usual', sortNew: 'Newest', sortRatio: 'vs usual', sortViews: 'Views',
    picksSub: 'Shorts that broke out well above their usual, with why they worked and how to apply it. The agent re-picks every hour.',
    scopeAll: 'All', scopeMine: 'My niche', scopeOther: 'Other niches', p2: '48h', p7: '7 days', p30: '30 days', kwTitle: 'Breakout keywords', kwFind: 'Find channels for this keyword',
    whyTitle: 'Why it worked', applyTitle: 'For your channel', whyLine: '{v} views in {h} · {x}× the channel’s usual · {vph}/hr',
    picksEmpty: 'Nothing to pick yet. Add more reference channels and picks appear right away.', noMyCat: 'Give your channel a category to filter by your niche.',
    fmt_number: 'Numbers', fmt_question: 'Question', fmt_compare: 'Comparison', fmt_challenge: 'Experiment', fmt_twist: 'Twist', fmt_howto: 'How-to', fmt_review: 'Review', fmt_list: 'Ranking',
    tip_number: 'Put a number (price, count, time) up front in the title and first frame.', tip_question: 'Ask the question in the first second; reveal the answer in the last three.',
    tip_compare: 'Side by side in one frame — show the result first, the reason after.', tip_challenge: 'Show the result first, then fast-rewind through the process.',
    tip_twist: 'Keep the start ordinary so the last-two-second twist lands.', tip_howto: 'Supplies → result → steps, with short one-line captions.',
    tip_review: 'Lead with the verdict (buy or skip) and close with three reasons.', tip_list: 'Save #1 for last and keep the rank on screen.',
    tip_default: 'Same idea in your channel’s voice — open with the strongest shot in the first two seconds.',
    rankingSub: 'All Shorts from tracked channels in one list. 48-hour views come from hourly public view counts.',
    sort_v48: '48h views', sort_ratio: 'vs usual', sort_vph: 'Views per hour', sort_views: 'Total views', sort_new: 'Newest',
    cTitle: 'Short', cAge: 'Age', cViews: 'Views', cVph: 'Per hour', cRatio: 'vs usual', noShorts: 'No Shorts match.',
    alertsSub: 'The agent checks every hour — reference breakouts, your upload gaps, disappeared videos (private/deleted), age restrictions, region blocks, 48-hour surges and drops, plus a daily 8:30 AM briefing.',
    alBreakMine: 'Your Short is breaking out', alBreakRef: 'A reference Short broke out', alBreakBody: '{ch} · “{title}” — {v} views in {h}h, {x}× usual',
    alGap: 'Upload gap', alGapBody: "{ch} hasn't posted a Short for {d} days. Post one today to keep momentum.",
    alMissing: 'A video disappeared', alMissingBody: '{ch} · “{title}” — made private or deleted.',
    alAge: 'Age restriction applied', alAgeBody: '{ch} · “{title}” — age-restricted videos get far less Shorts feed reach.',
    alRegion: 'Region block found', alRegionBody: '{ch} · “{title}” — blocked in {n} countries{kr}.', alRegionKr: ' (including Korea)',
    alSurge: '48-hour surge', alDrop: '48-hour drop', alTrendBody: '{ch} — previous 48h {p} → last 48h {c} ({pct}%)',
    alBrief: "Today's briefing", alBriefBody: 'Last 48h {v} views · {n} reference breakouts{picks}', alBriefPicks: ' · Picks: {p}',
    ideasSub: 'Ideas saved from picks and your own notes, moved stage by stage.', ideaPh: 'Write a new idea', ideaAdd: 'Add',
    st_idea: 'Idea', st_script: 'Script', st_production: 'Production', st_uploaded: 'Uploaded', ideaEmpty: 'Empty', stage: 'Stage', del: 'Delete',
    partnersSub: 'We match CNOL Music tracks, CNOL AD campaigns and PPL to your channel — connected by a team that runs channels itself.',
    p1t: 'Music collab · CNOL Music', p1d: 'Use tracks that fit your channel’s mood, up to custom music collaborations.',
    p2t: 'Ad campaigns · CNOL AD', p2d: 'Get campaign offers that fit your niche and performance.',
    p3t: 'PPL', p3d: 'Brand placements that fit your ideas, with help through delivery.', soon: 'Requests open here once sign-in is added',
    statusSub: 'Collector health and YouTube API points used today.',
    keyOk: 'YouTube API key connected', keyNo: 'No YouTube API key yet — add YOUTUBE_API_KEY in Supabase Edge Functions → Secrets.',
    unitsTitle: 'API points used today', unitsHelp: 'Refreshing a channel costs 2–3 points; finding channels costs 100 per keyword. We cap use at 9,000 of YouTube’s 10,000 daily points.',
    runsTitle: 'Recent runs', run_add: 'Add channels', run_refresh: 'Refresh', run_discover: 'Find channels', run_daily: 'Morning briefing', runOk: 'OK', runFail: 'Failed',
    schedTitle: 'Schedule', sched1: 'Hourly at :05 — refresh all channels · check issues', sched2: 'Daily 8:30 AM KST — briefing · auto-discover channels',
    policyTitle: 'Data principles', policy1: 'Only public data via the official YouTube API. We never download video files.',
    policy2: '48-hour figures are our own metric from hourly public view counts and may differ from YouTube Studio.',
    policy3: 'Before public launch, a YouTube API compliance audit is required (derived metrics, long-term storage).',
    testTitle: 'Test mode', test1: 'Right now everyone sees the same space without sign-in. With sign-in, each person gets their own view and connects their channel with its Google account.',
    err_NOT_FOUND: 'Channel not found. Check the URL or @handle.', err_BAD_LINK: 'Not a YouTube channel or video link.',
    err_PLATFORM: 'TikTok and Instagram open after official API access. YouTube only for now.', err_FULL: 'Test mode allows up to 100 channels.',
    err_NO_KEY: 'No YouTube API key yet. Check Settings & status.', err_BAD_KEY: 'The YouTube API key is invalid.',
    err_API_OFF: 'YouTube Data API is disabled in Google Cloud.', err_QUOTA: "Today's YouTube API quota is used up. It resets tomorrow.",
    err_QUOTA_BUDGET: 'Not enough API points left today. Try again tomorrow.', err_COOLDOWN: 'Just searched. Try again in a few minutes.',
    err_NO_KEYWORDS: 'Enter keywords to search.', err_EMPTY: 'Paste at least one link.', err_default: "Couldn't do that ({e})"
  },
  ja: {
    home: 'ダッシュボード', picks: 'ネタ提案', ranking: 'ショートランキング', alerts: 'エージェント通知', collect: 'チャンネル収集', channels: 'チャンネル一覧',
    ideas: 'ネタボード', partners: '音源・広告', status: '設定・状態', landing: '紹介ページ',
    secRadar: 'レーダー', secCollect: '収集', secWork: '作業', brandSub: 'テストモード',
    testNote: '<b>テストモード</b>・ログインなしで開いた共用スペースです。ログインを付けると人ごとに分かれて表示されます。',
    refreshAll: '今すぐ更新', refreshing: '更新中…', refreshed: '更新完了・{n}チャンネル', refreshSkip: '収集したばかりです。10分後に再度更新できます。',
    loading: '読み込み中…', loadFail: '読み込めませんでした。しばらくしてからお試しください。', saved: '保存しました', added: 'ネタボードに追加しました',
    viewOnYt: 'YouTubeで見る', toBoard: 'ボードに追加', inBoard: '追加済み', chOpen: 'チャンネルを見る',
    mine: 'マイチャンネル', reference: 'リファレンス', all: 'すべて', unread: '未読', markAll: 'すべて既読', read: '既読', seeAll: 'すべて見る',
    remove: '削除', removeConfirm: '本当に削除しますか？', removed: 'チャンネルを削除しました', refresh: '更新',
    unitViews: '回', justNow: 'たった今', minAgo: '{n}分前', hAgo: '{n}時間前', dAgo: '{n}日前', hShort: '{n}時間', dShort: '{n}日',
    homeSub: '収集中のチャンネル {n}件・最終収集 {t}・毎時5分に自動収集', homeSubNone: 'チャンネルのリンクを入れるとすぐ収集が始まります',
    live48: 'リアルタイム・直近48時間', last1h: '直近1時間', vsPrev: '直前48時間より{p}%{dir}', more: '増えました', less: '減りました',
    coverage: '収集開始から{h}時間分です・4日たまると直前48時間と比較できます', ago48: '48時間前', ago24: '24時間前', now: '今', preCollect: '収集前',
    rank48: 'チャンネル順位・48時間', sinceLast: '直前の収集比', ownMetric: '48時間の数値は公開再生数を毎時計測した独自指標です。',
    daily28: '日別再生数・直近28日', dailyNote: 'チャンネル総再生数の日次差分で計算・収集した日からたまります', prev28: '直前28日より{p}%{dir}',
    tops48: '伸びたショート・48時間', todayPicks: '今日のおすすめネタ', todayPicksSub: 'リファレンスで普段より大きく伸びたショートです',
    agentFeed: 'エージェント通知', noAlerts: 'まだ通知はありません。毎時確認し、あればここに表示します。',
    kChannels: '収集チャンネル', kChannelsSub: 'マイ {m}・リファレンス {r}', kShorts: '追跡中のショート', kShortsSub: 'チャンネルごとに最新50本',
    kUnits: '今日使ったAPIポイント', kUnitsSub: '1日{b}まで', kNext: '次の自動収集', kNextSub: '毎時5分・午前8:30ブリーフィング',
    obTitle: 'チャンネルのリンクを入れるとすぐ収集が始まります', obSub: 'YouTubeチャンネルURL、@ハンドル、ショートのリンクを1行に1つずつ入れてください。まず自分のチャンネル、次に参考にしたいリファレンスを入れると、すぐにパーソナライズされた提案が始まります。',
    addTitle: 'チャンネル追加', addLabel: 'チャンネルURL・@ハンドル・ショートのリンク（1行に1つ、最大30件）', roleQ: 'どのチャンネル？', catLabel: '分類（任意）', catPh: '例：料理、ペット、ゲーム',
    collectBtn: '収集する', collecting: '収集中…1チャンネル数秒かかります', resOk: 'ショート{n}本を収集', resExisted: '登録済み・更新しました',
    platNote: 'YouTubeは今すぐ使えます・TikTokとInstagramは公式API連携後に対応します',
    mineNote: 'マイチャンネルも今は公開データで表示します。Googleログイン連携が始まると視聴維持率・トラフィックソースも加わります。',
    collectSub: '最新ショート50本と再生数をすぐ集め、その後は毎時自動で計測します。',
    discTitle: 'おすすめチャンネルを探す', discSub: 'キーワードで直近7日に大きく伸びたショートを探し、まだ収集していないチャンネルを選びます。小さなチャンネルの大ヒットを上位にします。',
    discKw: 'キーワード（カンマで最大3つ・空欄なら自動）', discBtn: '探す', discCost: 'キーワード1つで100ポイント使います', discSuggest: 'おすすめキーワード',
    discEmpty: 'まだ見つかったチャンネルはありません。キーワードを入れて探してください。', discFound: '{n}件のチャンネルが見つかりました', viaSearch: '「{k}」直近7日のショート上位', viaFeatured: '{f}が紹介しているチャンネル',
    addRef: 'リファレンスに追加', hide: '非表示', subs: '登録者{n}', hiddenSubs: '登録者非公開', sample: '代表ショート',
    channelsSub: '役割（マイ/リファレンス）と分類を変更できます。行を押すとチャンネル分析が開きます。', search: '検索',
    cChannel: 'チャンネル', cRole: '役割', cCat: '分類', cSubs: '登録者', cShorts: 'ショート', cN7: '7日の投稿', cMedian: '普段の再生数', c48: '48時間', cLast: '最終収集',
    noChannels: 'まだ収集したチャンネルはありません。', goCollect: 'チャンネルを収集する', roleSwitched: '役割を変更しました',
    chBack: 'チャンネル一覧', chOpenYt: 'YouTubeで開く', chShorts: '収集したショート', chUsual: '普段の再生数（中央値）{v}', chAlerts: 'このチャンネルの通知', chHourly: 'このチャンネル・48時間', chDaily: 'このチャンネル・日別再生数', chNotFound: 'チャンネルが見つかりません。',
    ratio: '普段の{x}倍', sortNew: '新しい順', sortRatio: '普段比', sortViews: '再生数',
    picksSub: '普段より大きく伸びたショートを選び、なぜ伸びたか・自分のチャンネルへの活かし方をまとめました。エージェントが毎時選び直します。',
    scopeAll: 'すべて', scopeMine: '自分の分野', scopeOther: '他の分野', p2: '48時間', p7: '7日', p30: '30日', kwTitle: '伸びているキーワード', kwFind: 'このキーワードでチャンネルを探す',
    whyTitle: 'なぜ伸びた', applyTitle: '自分のチャンネルなら', whyLine: '投稿{h}で{v}回・チャンネルの普段の{x}倍・時速{vph}回',
    picksEmpty: 'まだ選べるショートがありません。リファレンスを追加するとすぐ選びます。', noMyCat: 'マイチャンネルに分類を入れると「自分の分野」で絞り込めます。',
    fmt_number: '数字型', fmt_question: '質問型', fmt_compare: '比較型', fmt_challenge: '検証・挑戦型', fmt_twist: 'どんでん返し型', fmt_howto: 'ハウツー型', fmt_review: 'レビュー型', fmt_list: 'ランキング型',
    tip_number: '数字（価格・個数・時間）をタイトルの頭と最初の画面に大きく入れましょう。', tip_question: '最初の1秒で問いかけ、答えは最後の3秒で。',
    tip_compare: '2つを1画面に並べて、結果を先に、理由は後に。', tip_challenge: '結果を先に見せ、過程を早戻しで。',
    tip_twist: '最後2秒のどんでん返しのため、前半は普通に進めましょう。', tip_howto: '材料→結果→手順の順で、字幕は短く1行で。',
    tip_review: '最初に結論（買う/買わない）、最後に理由3つ。', tip_list: '1位は最後に、順位は画面の隅に出し続けましょう。',
    tip_default: '同じネタを自分のチャンネルらしく — 最初の2秒に一番強い場面を。',
    rankingSub: '収集中チャンネルのショートを一列に並べました。48時間再生数は毎時計測した公開再生数の差分です。',
    sort_v48: '48時間再生数', sort_ratio: '普段比', sort_vph: '時速', sort_views: '総再生数', sort_new: '新しい順',
    cTitle: 'ショート', cAge: '投稿から', cViews: '再生数', cVph: '時速', cRatio: '普段比', noShorts: '条件に合うショートがありません。',
    alertsSub: 'エージェントが毎時確認します — リファレンスのヒット、マイチャンネルの投稿空白、動画の非公開・削除、年齢制限、地域ブロック、48時間の急上昇・急落、そして毎日午前8:30のブリーフィング。',
    alBreakMine: 'あなたのショートが伸びています', alBreakRef: 'リファレンスのショートが伸びました', alBreakBody: '{ch}・「{title}」— 投稿{h}時間で{v}回、普段の{x}倍',
    alGap: '投稿の空白', alGapBody: '{ch}が{d}日間ショートを投稿していません。今日1本投稿して流れをつなぎましょう。',
    alMissing: '動画が見えなくなりました', alMissingBody: '{ch}・「{title}」— 非公開になったか削除されました。',
    alAge: '年齢制限がかかりました', alAgeBody: '{ch}・「{title}」— 年齢制限の動画はショートフィードでの露出が大きく減ります。',
    alRegion: '地域ブロックがあります', alRegionBody: '{ch}・「{title}」— {n}か国でブロックされています{kr}。', alRegionKr: '（韓国を含む）',
    alSurge: '48時間の急上昇', alDrop: '48時間の急落', alTrendBody: '{ch} — 直前48時間 {p}回 → 直近48時間 {c}回（{pct}%）',
    alBrief: '今日のブリーフィング', alBriefBody: '直近48時間 {v}回・リファレンスのヒット {n}件{picks}', alBriefPicks: '・おすすめ：{p}',
    ideasSub: '提案から追加したネタと自分のアイデアを、段階ごとに動かして管理します。', ideaPh: '新しいネタを書く', ideaAdd: '追加',
    st_idea: 'アイデア', st_script: '台本', st_production: '制作', st_uploaded: '投稿済み', ideaEmpty: '空です', stage: '段階', del: '削除',
    partnersSub: 'CNOL Musicの音源、CNOL ADの広告、PPLをチャンネルに合わせてつなぎます。実際にチャンネルを運営するチームが直接つなぎます。',
    p1t: '音源コラボ・CNOL Music', p1d: 'チャンネルの雰囲気に合う音源から、オーダーメイドの音源コラボまで。',
    p2t: '広告キャンペーン・CNOL AD', p2d: '分野と成果に合う広告キャンペーンの提案を受けられます。',
    p3t: 'PPL', p3d: 'ネタに合うブランドPPLをつなぎ、進行までお手伝いします。', soon: 'ログインを付けるとここから申し込めます',
    statusSub: '収集エンジンの状態と今日使ったYouTube APIポイントを表示します。',
    keyOk: 'YouTube APIキーが接続されています', keyNo: 'YouTube APIキーがまだありません — Supabase Edge Functions → Secrets に YOUTUBE_API_KEY を入れてください。',
    unitsTitle: '今日使ったAPIポイント', unitsHelp: 'チャンネル1件の更新で2〜3ポイント、チャンネル探しはキーワード1つで100ポイント使います。YouTubeの1日1万ポイントのうち9千までに制限しています。',
    runsTitle: '最近の収集履歴', run_add: 'チャンネル追加', run_refresh: '更新', run_discover: 'チャンネル探し', run_daily: '朝のブリーフィング', runOk: '成功', runFail: '失敗',
    schedTitle: '自動スケジュール', sched1: '毎時5分 — 全チャンネル更新・問題チェック', sched2: '毎日午前8:30（韓国時間）— ブリーフィング・おすすめチャンネル自動発掘',
    policyTitle: 'データの原則', policy1: '公開データのみYouTube公式APIで集めます。動画ファイルはダウンロードしません。',
    policy2: '48時間の数値は毎時計測した公開再生数による独自指標です。YouTube Studioの数値と異なる場合があります。',
    policy3: '正式公開前にYouTube APIのポリシー審査（派生指標・長期保存）を受ける必要があります。',
    testTitle: 'テストモード', test1: '今はログインなしで全員が同じスペースを見ます。ログインを付けると人ごとに分かれ、マイチャンネルはそのチャンネルのGoogleアカウントで連携します。',
    err_NOT_FOUND: 'チャンネルが見つかりません。URLか@ハンドルを確認してください。', err_BAD_LINK: 'YouTubeのチャンネル・動画のリンクではありません。',
    err_PLATFORM: 'TikTokとInstagramは公式API連携後に収集できます。今はYouTubeのみです。', err_FULL: 'テストモードは100チャンネルまでです。',
    err_NO_KEY: 'YouTube APIキーがまだありません。設定・状態を確認してください。', err_BAD_KEY: 'YouTube APIキーが正しくありません。',
    err_API_OFF: 'Google CloudでYouTube Data APIがオフになっています。', err_QUOTA: '今日のYouTube API使用量を使い切りました。明日また使えます。',
    err_QUOTA_BUDGET: '今日使えるAPIポイントが足りません。明日お試しください。', err_COOLDOWN: '探したばかりです。数分後にお試しください。',
    err_NO_KEYWORDS: 'キーワードを入れてください。', err_EMPTY: 'リンクを入れてください。', err_default: '処理できませんでした（{e}）'
  }
};

// 알고리즘 분석 · 에이전트 브리핑 문구
Object.assign(T.ko, {
  insights: '알고리즘 분석',
  insSub: '수집한 쇼츠를 올린 시간·요일·길이·제목 유형·월별로 나눠, 어떤 조건에서 평소보다 잘 됐는지 보여줘요. 채널마다 평소 조회수(중앙값) 대비 배수로 비교해서 채널 크기가 달라도 공정해요.',
  insAllCh: '전체 채널', insFew: '분석하려면 쇼츠가 10개 이상 필요해요. 채널을 더 수집해 보세요.',
  insN: '분석한 쇼츠', insNSub: '채널 {c}개 · 올린 지 3일 지난 쇼츠 기준', insNSubAll: '채널 {c}개 · 최근 쇼츠 포함',
  insHit: '터진 비율', insHitSub: '평소의 2배 이상 · {n}개', insDur: '보통 길이', insDurSub: '중앙값', insFreq: '주간 업로드', insFreqSub: '최근 4주 평균 · 채널 {c}개 합계',
  insAgent: '에이전트 요약', insAgentSub: '수집한 데이터로 찾은 패턴이에요. 표본이 쌓일수록 정확해져요.',
  insHour: '올린 시간대별 · 평소 대비', insHourSub: '한국 시간 기준 · 빗금은 쇼츠 3개 미만', insDay: '요일별 · 평소 대비', insDurT: '길이별 · 평소 대비', insFmt: '제목 유형별 · 평소 대비',
  insMonth: '월별 성과 · 올린 달 기준', insMonthSub: '그 달에 올린 쇼츠의 조회수 합계예요 · 막대에 마우스를 올리면 개수와 중앙값이 보여요',
  insUsual: '평소', insLow: '표본 부족', insTipN: '쇼츠 {n}개', insTipMed: '중앙값 {v}', insX: '{x}배',
  insL_hour: '{h}에 올린 쇼츠가 평소의 {x}배로 가장 잘 됐어요 · {n}개', insL_day: '{d} 업로드가 평소의 {x}배로 가장 좋아요',
  insL_dur: '{b} 길이가 평소의 {x}배로 가장 잘 돼요 · {n}개', insL_fmt: '{f} 제목이 평소의 {x}배 — 가장 잘 먹히는 유형이에요',
  insL_short: '터진 쇼츠의 {p}%가 30초 이하예요', insL_freq: '최근 4주 동안 주 {w}개씩 올렸어요 · 채널 {c}개', insL_none: '아직 뚜렷한 패턴이 없어요. 쇼츠가 더 쌓이면 다시 찾아볼게요.',
  dur0: '15초 이하', dur1: '16–30초', dur2: '31–45초', dur3: '46–60초', dur4: '61–90초', dur5: '91초 이상', fmt_none: '기타',
  chAlgo: '이 채널 알고리즘', chMonth: '월별 성과 · 올린 달 기준',
  brTitle: '에이전트 브리핑', brSub: '지금 기준 · 매시간 다시 정리해요', br48: '48시간 흐름', brBreak: '터진 레퍼런스 · 24시간', brIssue: '내 채널 이슈', brIdea: '오늘 만들 소재',
  brBreakNone: '아직 없어요 · 레퍼런스를 더 넣으면 잘 잡혀요', brIssueNone: '문제 없어요', brIssueOk: '업로드 공백·영상 사라짐·연령 제한·지역 차단을 매시간 확인해요', brIssueNoMine: '내 채널을 넣으면 이슈를 지켜봐요', brIdeaNone: '레퍼런스를 넣으면 골라 드려요', brCount: '{n}건',
  add: '담기', refreshSkip: '방금 수집했어요. 잠시 뒤에 다시 할 수 있어요.', brandSub: '실험 모드'
});
Object.assign(T.en, {
  insights: 'Algorithm insights',
  insSub: "Collected Shorts split by upload hour, weekday, length, title type and month — showing what beat the usual. Each Short is compared with its own channel's usual views (median), so channel size doesn't skew it.",
  insAllCh: 'All channels', insFew: 'Insights need at least 10 Shorts. Collect more channels.',
  insN: 'Shorts analyzed', insNSub: '{c} channels · Shorts older than 3 days', insNSubAll: '{c} channels · includes recent Shorts',
  insHit: 'Breakout rate', insHitSub: '2× usual or more · {n}', insDur: 'Typical length', insDurSub: 'median', insFreq: 'Uploads per week', insFreqSub: 'last 4 weeks · {c} channels combined',
  insAgent: 'Agent summary', insAgentSub: 'Patterns found in your collected data. More Shorts, sharper answers.',
  insHour: 'By upload hour · vs usual', insHourSub: 'Korea time · hatched = fewer than 3 Shorts', insDay: 'By weekday · vs usual', insDurT: 'By length · vs usual', insFmt: 'By title type · vs usual',
  insMonth: 'Monthly · by upload month', insMonthSub: 'Total views of Shorts uploaded that month · hover a bar for count and median',
  insUsual: 'usual', insLow: 'Too few', insTipN: '{n} Shorts', insTipMed: 'median {v}', insX: '{x}×',
  insL_hour: 'Shorts posted at {h} did best — {x}× usual · {n} Shorts', insL_day: '{d} uploads do best — {x}× usual',
  insL_dur: '{b} works best — {x}× usual · {n} Shorts', insL_fmt: '{f} titles hit {x}× usual — your strongest type',
  insL_short: '{p}% of breakouts are 30 seconds or shorter', insL_freq: '{w} uploads a week over the last 4 weeks · {c} channels', insL_none: 'No clear pattern yet. The agent will look again as Shorts pile up.',
  dur0: '≤15s', dur1: '16–30s', dur2: '31–45s', dur3: '46–60s', dur4: '61–90s', dur5: '91s+', fmt_none: 'Other',
  chAlgo: "This channel's algorithm", chMonth: 'Monthly · by upload month',
  brTitle: 'Agent briefing', brSub: 'As of now · refreshed hourly', br48: '48-hour trend', brBreak: 'Reference breakouts · 24h', brIssue: 'My channel issues', brIdea: 'Make today',
  brBreakNone: 'None yet · more references catch more', brIssueNone: 'All clear', brIssueOk: 'Upload gaps, removed videos, age limits and region blocks — checked hourly', brIssueNoMine: 'Add your channel to watch for issues', brIdeaNone: 'Add references to get picks', brCount: '{n}',
  add: 'Add', refreshSkip: 'Just collected. Try again in a moment.', brandSub: 'Test mode'
});
Object.assign(T.ja, {
  insights: 'アルゴリズム分析',
  insSub: '収集したショートを投稿時間・曜日・長さ・タイトル型・月別に分け、どんな条件で普段より伸びたかを表示します。チャンネルごとの普段の再生数（中央値）比で比べるので、規模が違っても公平です。',
  insAllCh: 'すべてのチャンネル', insFew: '分析にはショートが10本以上必要です。チャンネルをもっと収集してください。',
  insN: '分析したショート', insNSub: '{c}チャンネル・投稿から3日以上のショート', insNSubAll: '{c}チャンネル・最近のショートを含む',
  insHit: 'ヒット率', insHitSub: '普段の2倍以上・{n}本', insDur: '標準的な長さ', insDurSub: '中央値', insFreq: '週の投稿数', insFreqSub: '直近4週の平均・{c}チャンネル合計',
  insAgent: 'エージェントのまとめ', insAgentSub: '収集データから見つけたパターンです。本数が増えるほど正確になります。',
  insHour: '投稿時間帯別・普段比', insHourSub: '韓国時間・斜線は3本未満', insDay: '曜日別・普段比', insDurT: '長さ別・普段比', insFmt: 'タイトル型別・普段比',
  insMonth: '月別の成果・投稿月基準', insMonthSub: 'その月に投稿したショートの再生数合計・棒にカーソルを合わせると本数と中央値',
  insUsual: '普段', insLow: '本数不足', insTipN: 'ショート{n}本', insTipMed: '中央値 {v}', insX: '{x}倍',
  insL_hour: '{h}に投稿したショートが普段の{x}倍で最も伸びました・{n}本', insL_day: '{d}の投稿が普段の{x}倍で最も好調です',
  insL_dur: '{b}が普段の{x}倍で最も伸びます・{n}本', insL_fmt: '{f}のタイトルが普段の{x}倍 — 最も効くタイプです',
  insL_short: 'ヒットしたショートの{p}%が30秒以下です', insL_freq: '直近4週は週{w}本ペースで投稿・{c}チャンネル', insL_none: 'まだはっきりしたパターンはありません。ショートがたまったら再度探します。',
  dur0: '15秒以下', dur1: '16–30秒', dur2: '31–45秒', dur3: '46–60秒', dur4: '61–90秒', dur5: '91秒以上', fmt_none: 'その他',
  chAlgo: 'このチャンネルのアルゴリズム', chMonth: '月別の成果・投稿月基準',
  brTitle: 'エージェントのブリーフィング', brSub: '現時点・毎時まとめ直します', br48: '48時間の動き', brBreak: 'リファレンスのヒット・24時間', brIssue: 'マイチャンネルの問題', brIdea: '今日作るネタ',
  brBreakNone: 'まだありません・リファレンスを増やすと見つかります', brIssueNone: '問題なし', brIssueOk: '投稿の空白・動画の削除・年齢制限・地域ブロックを毎時確認しています', brIssueNoMine: 'マイチャンネルを入れると問題を見守ります', brIdeaNone: 'リファレンスを入れると選びます', brCount: '{n}件',
  add: '追加', refreshSkip: '収集したばかりです。少し待ってからお試しください。', brandSub: 'テストモード'
});

const t = (k, v) => {
  let s = (T[lang] && T[lang][k]) ?? T.ko[k] ?? k;
  if (v) for (const x of Object.keys(v)) s = s.split('{' + x + '}').join(v[x]);
  return s;
};
const loc = () => (lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US');

// ---------- 숫자 · 시간 ----------
function fmtN(n) {
  if (n == null || Number.isNaN(Number(n))) return '–';
  n = Number(n);
  const a = Math.abs(n);
  const trim = (x) => x.replace(/\.0$/, '');
  if (lang === 'en') {
    if (a >= 1e9) return trim((n / 1e9).toFixed(a >= 1e10 ? 0 : 1)) + 'B';
    if (a >= 1e6) return trim((n / 1e6).toFixed(a >= 1e7 ? 0 : 1)) + 'M';
    if (a >= 1e4) return Math.round(n / 1e3) + 'K';
    if (a >= 1e3) return trim((n / 1e3).toFixed(1)) + 'K';
    return String(Math.round(n));
  }
  const man = lang === 'ja' ? '万' : '만', eok = lang === 'ja' ? '億' : '억';
  if (a >= 1e8) return trim((n / 1e8).toFixed(a >= 1e9 ? 0 : 1)) + eok;
  if (a >= 1e4) return trim((n / 1e4).toFixed(a >= 1e5 ? 0 : 1)) + man;
  return Math.round(n).toLocaleString(loc());
}
const fmtFull = (n) => (n == null ? '–' : Number(n).toLocaleString(loc()));
const pct = (a, b) => (b ? Math.round(((a - b) / b) * 100) : null);
function agoTxt(iso) {
  if (!iso) return '–';
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (s < 60) return t('justNow');
  if (s < 3600) return t('minAgo', { n: Math.round(s / 60) });
  if (s < 172800) return t('hAgo', { n: Math.round(s / 3600) });
  return t('dAgo', { n: Math.round(s / 86400) });
}
const ageTxt = (h) => (h < 48 ? t('hShort', { n: Math.max(1, Math.round(h)) }) : t('dShort', { n: Math.round(h / 24) }));
const hourLabel = (iso) => new Date(iso).toLocaleString(loc(), { month: 'short', day: 'numeric', hour: 'numeric', timeZone: 'Asia/Seoul' });
const dayLabel = (d) => new Date(d + 'T12:00:00+09:00').toLocaleDateString(loc(), { month: 'short', day: 'numeric', timeZone: 'Asia/Seoul' });

// ---------- 분야 ----------
const TOPIC = {
  'Food': ['요리·음식', 'Food', '料理・グルメ'], 'Lifestyle (sociology)': ['라이프스타일', 'Lifestyle', 'ライフスタイル'], 'Entertainment': ['엔터테인먼트', 'Entertainment', 'エンタメ'],
  'Humour': ['유머', 'Humor', 'ユーモア'], 'Music': ['음악', 'Music', '音楽'], 'Pop music': ['팝', 'Pop', 'ポップ'], 'Video game culture': ['게임', 'Gaming', 'ゲーム'],
  'Sport': ['스포츠', 'Sports', 'スポーツ'], 'Association football': ['축구', 'Soccer', 'サッカー'], 'Fashion': ['패션', 'Fashion', 'ファッション'],
  'Physical attractiveness': ['뷰티', 'Beauty', '美容'], 'Health': ['건강', 'Health', '健康'], 'Technology': ['테크', 'Tech', 'テック'],
  'Knowledge': ['지식', 'Knowledge', '知識'], 'Tourism': ['여행', 'Travel', '旅行'], 'Vehicle': ['자동차', 'Cars', '車'], 'Pet': ['반려동물', 'Pets', 'ペット'],
  'Film': ['영화', 'Film', '映画'], 'Television program': ['TV', 'TV', 'テレビ'], 'Hobby': ['취미', 'Hobby', '趣味'], 'Physical fitness': ['운동', 'Fitness', 'フィットネス'],
  'Society': ['사회', 'Society', '社会'], 'Politics': ['정치', 'Politics', '政治'], 'Animals': ['동물', 'Animals', '動物'], 'Hip hop music': ['힙합', 'Hip hop', 'ヒップホップ'],
  'Electronic music': ['일렉트로닉', 'Electronic', 'エレクトロ'], 'Business': ['비즈니스', 'Business', 'ビジネス'], 'Religion': ['종교', 'Religion', '宗教'], 'Military': ['밀리터리', 'Military', 'ミリタリー']
};
const topicLabel = (tp) => (TOPIC[tp] ? TOPIC[tp][LANGS.indexOf(lang)] : tp);
const catOf = (c) => c.category || (Array.isArray(c.topics) && c.topics[0] ? topicLabel(c.topics[0]) : '');

// ---------- 소재 분석 (제목 패턴 · 키워드) ----------
const FMT = [
  ['number', /\d/],
  ['question', /[?？]|왜|어떻게|진짜|뭐가|무엇|\bhow\b|\bwhy\b|\bwhat\b|なぜ|どう|本当/i],
  ['compare', /\bvs\.?\b|비교|차이|대결|比較|対決/i],
  ['challenge', /해\s?봤|해봄|실험|도전|챌린지|테스트|검증|\btried\b|challenge|\btest|やってみた|検証|挑戦/i],
  ['twist', /반전|결말|충격|레전드|소름|ㄷㄷ|ㅋㅋ|wait for it|plot twist|まさか|衝撃/i],
  ['howto', /방법|꿀팁|팁|하는\s?법|레시피|만들기|how to|\btips?\b|recipe|hack|方法|レシピ|裏技/i],
  ['review', /리뷰|후기|언박싱|먹방|review|unboxing|レビュー|開封/i],
  ['list', /top\s?\d|\bbest\b|순위|랭킹|티어|ランキング/i]
];
const formatsOf = (title) => FMT.filter(([, re]) => re.test(title || '')).map(([k]) => k).slice(0, 3);
const STOPW = new Set(['shorts', 'short', '쇼츠', '숏츠', 'youtube', 'youtubeshorts', 'the', 'and', 'for', 'you', 'with', 'this', 'that', 'what', 'how', 'why', 'are', 'was',
  'from', 'your', 'have', 'just', '진짜', '이거', '그냥', '너무', '정말', '이건', '저는', '오늘', 'ショート', 'です', 'ます', 'viral', 'fyp', 'funny', 'vlog', 'shortvideo', 'shortsvideo']);
// 한국어 제목에서 조사를 떼고(고양이가 → 고양이), 동사 꼴(먹어봤더니, 보면)은 빼요
const JOSA = /(에서|으로|까지|부터|한테|에게|이랑|처럼|보다|을|를|은|는|가|의|에|도|로|와|과|랑|만)$/;
const VERBY = /(봄|봤|봤다|봤더니|더니|했다|하는|하기|한다|해요|어요|아요|네요|니다|하면|보면|ㄷㄷ|ㅋㅋ|ㅎㅎ)$/;
function tokens(title) {
  return String(title || '').toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#@]/g, ' ')
    .split(/[\s[\]()「」『』【】"'“”‘’.,!?！？~·|/\\:;…\-+=*&^%$<>{}]+/)
    .map((w) => w.trim())
    .map((w) => (/^[가-힣]{3,}$/.test(w) && JOSA.test(w) ? w.replace(JOSA, '') : w))
    .filter((w) => w.length >= 2 && w.length <= 20 && !STOPW.has(w) && !/^\d+$/.test(w) && !VERBY.test(w));
}
function trendKeywords(list) {
  const score = new Map();
  for (const s of list) {
    if (!(s.ratio >= 2)) continue;
    const w = Math.min(s.ratio, 10);
    const tagToks = (s.tags || []).map((x) => String(x).toLowerCase().trim()).filter((x) => x.length >= 2 && x.length <= 20 && !STOPW.has(x));
    for (const tok of new Set([...tokens(s.title), ...tagToks])) score.set(tok, (score.get(tok) || 0) + w);
  }
  return [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map((x) => x[0]);
}

// ---------- 서버 ----------
async function rpc(fn, args) {
  const { data, error } = await sb.rpc(fn, args || {});
  if (error) throw new Error(error.message);
  return data;
}
async function act(body) {
  try {
    const { data, error } = await sb.functions.invoke('radar', { body });
    if (error) {
      let msg = error.message;
      try { const j = await error.context?.json?.(); if (j?.error) msg = j.error; } catch (e) { /* 무시 */ }
      return { ok: false, error: msg };
    }
    return data || { ok: false, error: 'EMPTY_RESPONSE' };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}
const errText = (code) => (T.ko['err_' + code] ? t('err_' + code) : t('err_default', { e: code }));

// ---------- 상태 ----------
const S = { unread: 0, chans: null, chansAt: 0, period: 7, scope: 'all', kw: '', rankSort: 'v48', rankDays: 7, rankRole: 'all', rankQ: '', chQ: '', chRole: 'all', alertF: 'all', addRole: null, prefKw: '', chSort: 'new', insRole: 'all', insCh: '', board: new Set() };

async function getChans(force) {
  if (!force && S.chans && Date.now() - S.chansAt < 60e3) return S.chans;
  S.chans = await rpc('radar_channel_list');
  S.chansAt = Date.now();
  return S.chans;
}
function myCats() {
  const set = new Set();
  for (const c of S.chans || []) if (c.role === 'mine') { const k = catOf(c); if (k) set.add(k); }
  return set;
}

// ---------- 아이콘 · 조각 ----------
const IC = {
  home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  picks: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  ranking: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  alerts: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  collect: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  channels: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  ideas: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
  partners: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  status: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  landing: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  insights: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
  yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',
  up: '<path d="M7 17L17 7M9 7h8v8"/>', warn: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  gone: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  down: '<path d="M7 7l10 10M17 9v8H9"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
const svg = (p, s = 19) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const avatar = (url, sq) => (url ? `<img class="dk-av${sq ? ' sq' : ''}" src="${esc(url)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="dk-av${sq ? ' sq' : ''}"></span>`);
const ratioTag = (x) => (x == null ? '' : `<span class="dk-tag ${x >= 3 ? 'red' : x >= 1.5 ? 'amber' : 'gray'}">${esc(t('ratio', { x: Number(x).toFixed(1) }))}</span>`);
const head = (title, sub, actions = '') => `<div class="dk-head dk-fade"><div><h1>${esc(title)}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${actions}</div>`;
const loadingCard = () => `<div class="dk-card"><div class="dk-empty"><span class="dk-spin"></span> ${esc(t('loading'))}</div></div>`;
const ytShort = (id) => `https://www.youtube.com/shorts/${encodeURIComponent(id)}`;
// 쇼츠 썸네일은 가로 틀 안에 세로 화면이 가운데 있어요 → 큰 해상도(hq)로 바꿔 9:16로 가운데만 보여줘요
const vthumb = (u) => (u ? String(u).replace(/\/(mq|sd)?default\.jpg$/, '/hqdefault.jpg') : '');
const cssUrl = (u) => (/^https:\/\//.test(u || '') ? String(u).replace(/["'()\\\s<>]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')) : '');

let snackTimer = null;
function snack(msg) {
  const el = document.getElementById('snack');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => el.classList.remove('show'), 3400);
}

// 막대 차트 (마우스를 올리면 값) — pre: 수집 전(빗금), low: 표본 부족(낮은 빗금), hot: 강조, ref: 기준선
const barH = (x, max) => (x.pre ? 100 : x.low ? 12 : x.v ? Math.max(3, (x.v / max) * 100) : 0);
const barMax = (vals, ref) => Math.max(ref ? ref.v * 1.15 : 1, ...vals.map((x) => (x.low ? 0 : x.v || 0)));
function barsHtml(id, vals, aria, h = 170, ref = null) {
  const max = barMax(vals, ref);
  return `<div class="dk-chart" id="${id}"><div class="dk-bars" style="height:${h}px" role="img" aria-label="${esc(aria)}">${vals.map((x, i) => {
    const cls = x.pre || x.low ? ' pre' : x.v ? (x.hot ? ' hot' : '') : ' z';
    return `<div class="c" data-i="${i}"><i class="dk-rise${cls}" style="height:${barH(x, max)}%;animation-delay:${Math.min(i, 60) * 9}ms"></i></div>`;
  }).join('')}${ref ? `<span class="ref" style="bottom:${((ref.v / max) * 100).toFixed(1)}%"><em>${esc(ref.label)}</em></span>` : ''}</div><div class="dk-tip" hidden></div></div>`;
}
function bindBars(root, id, vals, tipFn, ref = null) {
  const box = root.querySelector('#' + id);
  if (!box) return;
  const tip = box.querySelector('.dk-tip');
  const max = barMax(vals, ref);
  box.querySelectorAll('.c').forEach((c) => {
    c.addEventListener('pointerenter', () => {
      const i = Number(c.dataset.i), x = vals[i];
      tip.textContent = tipFn(x, i);
      tip.hidden = false;
      const w = box.clientWidth;
      const cx = Math.min(Math.max(c.offsetLeft + c.offsetWidth / 2, 80), w - 80);
      const barTop = c.offsetTop + c.offsetHeight * (1 - barH(x, max) / 100);
      tip.style.left = cx + 'px';
      tip.style.top = Math.max(-10, barTop - tip.offsetHeight - 8) + 'px';
      c.classList.add('on');
    });
    c.addEventListener('pointerleave', () => { tip.hidden = true; c.classList.remove('on'); });
  });
}
// 가로 막대 (값을 옆에 바로 적어요 · 점선 = 평소 1배)
function hbarsHtml(rows) {
  const max = Math.max(1.25, ...rows.filter((r) => !r.low).map((r) => r.v || 0)) * 1.05;
  return `<div class="dk-hbars">${rows.map((r) => `<div class="dk-hb${r.low ? ' low' : ''}"><span class="l">${esc(r.label)}</span><span class="track"><i class="${r.hot ? 'hot' : ''}" style="width:${r.low ? 6 : Math.max(2, ((r.v || 0) / max) * 100).toFixed(1)}%"></i><span class="one" style="left:${((1 / max) * 100).toFixed(1)}%" title="${esc(t('insUsual'))}"></span></span><span class="v">${r.low ? esc(t('insLow')) : esc(t('insX', { x: (r.v || 0).toFixed(1) }))}<small>${esc(t('insTipN', { n: r.n }))}</small></span></div>`).join('')}</div>`;
}

// ---------- 틀 ----------
const NAV = [
  { k: 'home' },
  { sec: 'secRadar' }, { k: 'picks' }, { k: 'insights' }, { k: 'ranking' }, { k: 'alerts', badge: true },
  { sec: 'secCollect' }, { k: 'collect' }, { k: 'channels' },
  { sec: 'secWork' }, { k: 'ideas' }, { k: 'partners' },
  { div: true }, { k: 'status' }, { k: 'landing', href: '/' }
];
const ROUTES = ['home', 'picks', 'insights', 'ranking', 'alerts', 'collect', 'channels', 'ideas', 'partners', 'status'];
function route() {
  let h = (location.hash || '#home').slice(1);
  try { h = decodeURIComponent(h); } catch (e) { /* 그대로 */ }
  if (h.startsWith('ch/')) return { name: 'ch', id: h.slice(3) };
  return { name: ROUTES.includes(h) ? h : 'home' };
}
function renderNav() {
  const cur = route().name;
  document.getElementById('nav').innerHTML = NAV.map((n) => {
    if (n.sec) return `<p class="dk-sec">${esc(t(n.sec))}</p>`;
    if (n.div) return '<span class="dk-div" aria-hidden="true"></span>';
    const on = cur === n.k || (n.k === 'channels' && cur === 'ch');
    const badge = n.badge && S.unread ? `<span class="n">${S.unread > 99 ? '99+' : S.unread}</span>` : '';
    return `<a class="dk-nav" href="${n.href || '#' + n.k}" ${on ? 'aria-current="page"' : ''}>${svg(IC[n.k])}${esc(t(n.k))}${badge}</a>`;
  }).join('');
  const bn = document.getElementById('bellN');
  bn.hidden = !S.unread;
  bn.textContent = S.unread > 99 ? '99+' : String(S.unread || '');
  document.getElementById('bell').setAttribute('aria-label', t('alerts'));
}
function renderChrome() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-a]').forEach((el) => { el.textContent = t(el.dataset.a); });
  document.getElementById('testNote').innerHTML = t('testNote');
  document.getElementById('refreshAll').innerHTML = `${svg(IC.refresh, 16)}<span>${esc(t('refreshAll'))}</span>`;
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderNav();
}
async function updateUnread() {
  const { count } = await sb.from('radar_alerts').select('id', { count: 'exact', head: true }).is('read_at', null);
  S.unread = count || 0;
  renderNav();
}

let seq = 0;
async function render() {
  const my = ++seq;
  const alive = () => my === seq;
  renderChrome();
  const r = route();
  const v = document.getElementById('view');
  const views = { home: vHome, picks: vPicks, insights: vInsights, ranking: vRanking, alerts: vAlerts, collect: vCollect, channels: vChannels, ch: vChannel, ideas: vIdeas, partners: vPartners, status: vStatus };
  document.title = t(r.name === 'ch' ? 'channels' : r.name) + ' · CNOL RADAR';
  try {
    await views[r.name](v, r, alive);
  } catch (e) {
    console.error(e);
    if (alive()) v.innerHTML = head(t(r.name === 'ch' ? 'channels' : r.name), '') + `<div class="dk-card"><div class="dk-empty">${esc(t('loadFail'))}<br><small>${esc(e.message || String(e))}</small></div></div>`;
  }
  updateUnread().catch(() => {});
}

// ---------- 채널 추가 폼 (대시보드 첫 화면 · 채널 수집에서 같이 씀) ----------
function addFormHtml(first) {
  const cats = [...new Set((S.chans || []).map((c) => c.category).filter(Boolean))];
  const role = S.addRole || (first || !(S.chans || []).some((c) => c.role === 'mine') ? 'mine' : 'reference');
  S.addRole = role;
  return `<form class="dk-card ${first ? 'full' : 'f2'} dk-fade" id="addForm" novalidate>
    <div class="dk-ch"><h2>${esc(first ? t('obTitle') : t('addTitle'))}</h2></div>
    <p class="dk-sub" style="margin:-6px 0 0">${esc(first ? t('obSub') : t('collectSub'))}</p>
    <div class="dk-field"><label for="addIn">${esc(t('addLabel'))}</label>
      <textarea class="dk-textarea" id="addIn" spellcheck="false" placeholder="https://www.youtube.com/@channel&#10;@handle&#10;https://www.youtube.com/shorts/…"></textarea></div>
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end">
      <div class="dk-field"><span style="font-size:13px;font-weight:700;color:#334155">${esc(t('roleQ'))}</span>
        <div class="dk-seg" role="group" aria-label="${esc(t('roleQ'))}"><button type="button" data-role="mine" aria-pressed="${role === 'mine'}">${esc(t('mine'))}</button><button type="button" data-role="reference" aria-pressed="${role === 'reference'}">${esc(t('reference'))}</button></div></div>
      <div class="dk-field" style="flex:1 1 200px"><label for="addCat">${esc(t('catLabel'))}</label>
        <input class="dk-input" id="addCat" list="catList" maxlength="30" placeholder="${esc(t('catPh'))}"><datalist id="catList">${cats.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></div>
      <button class="dk-btn" type="submit" id="addBtn">${svg(IC.collect, 17)}${esc(t('collectBtn'))}</button>
    </div>
    <p class="dk-sub" style="margin:0">${esc(t('platNote'))}</p>
    <p class="dk-sub" style="margin:0" id="mineNote" ${role === 'mine' ? '' : 'hidden'}>${esc(t('mineNote'))}</p>
    <ul class="dk-list" id="addRes" aria-live="polite"></ul>
  </form>`;
}
function bindAddForm(root, onDone) {
  const form = root.querySelector('#addForm');
  if (!form) return;
  form.querySelectorAll('[data-role]').forEach((b) => b.addEventListener('click', () => {
    S.addRole = b.dataset.role;
    form.querySelectorAll('[data-role]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    form.querySelector('#mineNote').hidden = S.addRole !== 'mine';
  }));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = form.querySelector('#addIn').value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    const res = form.querySelector('#addRes');
    if (!inputs.length) { res.innerHTML = `<li class="dk-banner warn">${esc(t('err_EMPTY'))}</li>`; return; }
    const btn = form.querySelector('#addBtn');
    btn.disabled = true;
    res.innerHTML = `<li class="dk-banner info"><span class="dk-spin"></span> ${esc(t('collecting'))}</li>`;
    const out = await act({ action: 'add', inputs, role: S.addRole, category: form.querySelector('#addCat').value });
    btn.disabled = false;
    if (!out.ok) { res.innerHTML = `<li class="dk-banner bad">${esc(errText(out.error))}</li>`; return; }
    res.innerHTML = out.results.map((r) => (r.ok
      ? `<li class="dk-li">${avatar(r.thumb)}<span class="dk-ttl"><b>${esc(r.title)}</b><small>${esc(t('resOk', { n: r.shorts ?? 0 }))}${r.existed ? ' · ' + esc(t('resExisted')) : ''}</small></span><a class="dk-btn sm line" href="#ch/${esc(r.channel_id)}">${esc(t('chOpen'))}</a></li>`
      : `<li class="dk-li"><span class="dk-tag red">!</span><span class="dk-ttl"><b>${esc(r.input)}</b><small>${esc(errText(r.error))}</small></span></li>`)).join('');
    if (out.results.some((r) => r.ok)) {
      form.querySelector('#addIn').value = '';
      await getChans(true);
      if (onDone) onDone(out);
    }
  });
}

// ---------- 쇼츠 카드 ----------
function whyOf(s) {
  return t('whyLine', { h: ageTxt(s.age_h), v: fmtN(s.views), x: s.ratio != null ? Number(s.ratio).toFixed(1) : '–', vph: fmtN(s.vph) });
}
function pickCard(s) {
  const f = formatsOf(s.title);
  const inBoard = S.board.has(s.id);
  return `<article class="dk-pick dk-fade">
    <a class="dk-thumb" href="${ytShort(s.id)}" target="_blank" rel="noopener" style="background-image:url('${cssUrl(vthumb(s.thumb))}')" aria-label="${esc(t('viewOnYt'))}: ${esc(s.title)}"><span class="v">${esc(fmtN(s.views))}</span></a>
    <div class="body">
      <p class="t">${esc(s.title)}</p>
      <span class="m">${esc(s.channel_title)} · ${esc(ageTxt(s.age_h))}</span>
      <div class="tags">${ratioTag(s.ratio)}${f.map((k) => `<span class="dk-tag gray">${esc(t('fmt_' + k))}</span>`).join('')}</div>
      <p class="dk-why"><b>${esc(t('whyTitle'))}</b> · ${esc(whyOf(s))}</p>
      <p class="dk-why"><b>${esc(t('applyTitle'))}</b> · ${esc(t('tip_' + (f[0] || 'default')))}</p>
      <div class="acts"><button type="button" class="dk-btn sm" data-board="${esc(s.id)}" ${inBoard ? 'disabled' : ''}>${esc(t(inBoard ? 'inBoard' : 'toBoard'))}</button><a class="dk-btn sm line" href="#ch/${esc(s.channel_id)}">${esc(t('chOpen'))}</a></div>
    </div></article>`;
}
function tileHtml(s) {
  const inBoard = S.board.has(s.id);
  return `<div class="dk-tile dk-fade">
    <a class="dk-thumb" href="${ytShort(s.id)}" target="_blank" rel="noopener" style="background-image:url('${cssUrl(vthumb(s.thumb))}')" aria-label="${esc(t('viewOnYt'))}: ${esc(s.title)}"><span class="b">${ratioTag(s.ratio)}</span><span class="v">${esc(fmtN(s.views))}</span></a>
    <a class="t" href="${ytShort(s.id)}" target="_blank" rel="noopener">${esc(s.title)}</a>
    <div class="m"><span>${esc(ageTxt(s.age_h))}</span>${s.v48 > 0 ? `<span>48h +${esc(fmtN(s.v48))}</span>` : ''}<button type="button" class="dk-mini" data-board="${esc(s.id)}" ${inBoard ? 'disabled' : ''}>${esc(t(inBoard ? 'inBoard' : 'add'))}</button></div>
  </div>`;
}
function bindBoardButtons(root, list) {
  root.querySelectorAll('[data-board]').forEach((b) => b.addEventListener('click', async () => {
    const s = list.find((x) => x.id === b.dataset.board);
    if (!s) return;
    b.disabled = true;
    const out = await act({ action: 'idea', op: 'add', title: String(s.title || '').slice(0, 200), source_video_id: s.id, note: `${s.channel_title} · ${whyOf(s)}` });
    if (!out.ok) { b.disabled = false; snack(errText(out.error)); return; }
    S.board.add(s.id);
    b.textContent = t('inBoard');
    snack(t('added'));
  }));
}
function pickList(list, scope) {
  const cats = myCats();
  let arr = list.filter((s) => s.status === 'live' && s.ratio != null && s.ratio >= 1.5 && (s.views || 0) >= 3000);
  const refs = arr.filter((s) => s.role === 'reference');
  if (refs.length >= 3) arr = refs;
  if (scope === 'mine') arr = arr.filter((s) => cats.has(catOf(s)));
  if (scope === 'other') arr = arr.filter((s) => !cats.has(catOf(s)));
  return arr.sort((a, b) => (b.ratio - a.ratio) || (b.vph - a.vph));
}

// ---------- 대시보드 ----------
async function vHome(v, r, alive) {
  v.innerHTML = head(t('home'), esc(t('loading'))) + loadingCard();
  const [ov, sh, al] = await Promise.all([
    rpc('radar_overview'),
    rpc('radar_shorts', { p_days: 7, p_channel: null, p_role: null, p_limit: 600 }),
    sb.from('radar_alerts').select('*').order('created_at', { ascending: false }).limit(60),
    getChans()
  ]);
  if (!alive()) return;
  S.unread = ov.unread || 0;
  renderNav();
  if (!ov.channels.total) {
    v.innerHTML = head(t('home'), esc(t('homeSubNone'))) + `<div class="dk-row">${addFormHtml(true)}</div>`;
    bindAddForm(v, () => render());
    return;
  }
  const sub = esc(t('homeSub', { n: fmtFull(ov.channels.total), t: ov.last_at ? agoTxt(ov.last_at) : '–' }));
  const firstH = ov.first_at ? Date.parse(ov.first_at) : null;
  const hv = ov.hourly.map((x) => ({ v: x.v, h: x.h, pre: !x.v && (!firstH || Date.parse(x.h) + 3600e3 <= firstH) }));
  const covH = firstH ? Math.floor((Date.now() - firstH) / 3600e3) : 0;
  let change;
  if (covH >= 96 && ov.prev48 > 0) {
    const p = pct(ov.views48, ov.prev48);
    change = `<span class="${p >= 0 ? 'dk-up' : 'dk-down'}" style="font-weight:700">${esc(t('vsPrev', { p: Math.abs(p), dir: t(p >= 0 ? 'more' : 'less') }))}</span>`;
  } else change = esc(t('coverage', { h: Math.min(covH, 48) }));
  const last1h = ov.hourly.length >= 2 ? ov.hourly[ov.hourly.length - 2].v : 0;

  const rank = (ov.ranking || []).slice(0, 6);
  const days = ov.daily || [];
  const cur = days.slice(-28), prev = days.slice(0, Math.max(0, days.length - 28));
  const curSum = cur.reduce((a, d) => a + d.v, 0), prevSum = prev.reduce((a, d) => a + d.v, 0);
  const prevDays = prev.filter((d) => d.n > 0).length;
  const dv = cur.map((d) => ({ v: d.v, d: d.d, pre: d.n === 0 }));
  let dchange = esc(t('dailyNote'));
  if (prevDays >= 21 && prevSum > 0) {
    const p = pct(curSum, prevSum);
    dchange = `<span class="${p >= 0 ? 'dk-up' : 'dk-down'}" style="font-weight:700">${esc(t('prev28', { p: Math.abs(p), dir: t(p >= 0 ? 'more' : 'less') }))}</span>`;
  }
  const tops = sh.filter((s) => s.v48 > 0).sort((a, b) => b.v48 - a.v48).slice(0, 5);
  const topsList = tops.length ? tops : sh.filter((s) => s.age_h <= 48).sort((a, b) => b.views - a.views).slice(0, 5);
  const picks = pickList(sh, 'all').slice(0, 3);
  const allAlerts = al.data || [];
  const alerts = allAlerts.slice(0, 5);
  const nextRun = (() => { const d = new Date(); d.setMinutes(5, 0, 0); if (d <= new Date()) d.setHours(d.getHours() + 1); return d.toLocaleTimeString(loc(), { hour: 'numeric', minute: '2-digit' }); })();

  v.innerHTML = head(t('home'), sub, `<a class="dk-hbtn" href="#collect">${svg(IC.collect, 17)}${esc(t('addTitle'))}</a>`) + briefHtml(ov, allAlerts, picks, covH) + `
  <div class="dk-row">
    <section class="dk-card f2 dk-fade">
      <div class="dk-ch"><span class="dk-live"><i></i>${esc(t('live48'))}</span><span class="dk-sub">${esc(t('kNextSub'))}</span></div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:10px">
        <div><div class="dk-big">${esc(fmtN(ov.views48))}<span style="font-size:20px;font-weight:800">${esc(t('unitViews'))}</span></div><div class="dk-sub">${change}</div></div>
        <div style="text-align:right"><div class="dk-sub">${esc(t('last1h'))}</div><div class="dk-mid">${esc(fmtN(last1h))}</div></div>
      </div>
      ${barsHtml('b48', hv, t('live48'))}
      <div class="dk-axis"><span>${esc(t('ago48'))}</span><span>${esc(t('ago24'))}</span><span>${esc(t('now'))}</span></div>
    </section>
    <section class="dk-card f1 dk-fade">
      <div class="dk-ch"><h2>${esc(t('rank48'))}</h2><span class="dk-sub">${esc(t('sinceLast'))}</span></div>
      <ul class="dk-list">${rank.map((c, i) => `<li><a class="dk-li" href="#ch/${esc(c.id)}"><span class="dk-rank">${i + 1}</span>${avatar(c.thumb)}<span class="dk-ttl"><b>${esc(c.title)}</b><small>${esc(t(c.role === 'mine' ? 'mine' : 'reference'))}${c.category ? ' · ' + esc(c.category) : ''}</small></span><span class="dk-num">${esc(fmtN(c.v48))}<small>+${esc(fmtFull(c.last_delta))}</small></span></a></li>`).join('')}</ul>
      <span class="dk-sub" style="margin-top:auto">${esc(t('ownMetric'))}</span>
    </section>
  </div>
  <div class="dk-row">
    <section class="dk-card f2 dk-fade">
      <div class="dk-ch"><h2>${esc(t('daily28'))}</h2><span class="dk-mid" style="font-size:22px">${esc(fmtN(curSum))}${esc(t('unitViews'))}</span></div>
      <div class="dk-sub" style="margin-top:-8px">${dchange}</div>
      ${barsHtml('bd', dv, t('daily28'), 150)}
      <div class="dk-axis"><span>${esc(cur[0] ? dayLabel(cur[0].d) : '')}</span><span>${esc(cur[14] ? dayLabel(cur[14].d) : '')}</span><span>${esc(cur.length ? dayLabel(cur[cur.length - 1].d) : '')}</span></div>
    </section>
    <section class="dk-card f1 dk-fade">
      <div class="dk-ch"><h2>${esc(t('tops48'))}</h2><a class="dk-sub" href="#ranking">${esc(t('seeAll'))}</a></div>
      <ul class="dk-list">${topsList.length ? topsList.map((s) => `<li><a class="dk-li" href="${ytShort(s.id)}" target="_blank" rel="noopener">${avatar(s.thumb, true)}<span class="dk-ttl"><b>${esc(s.title)}</b><small>${esc(s.channel_title)} · ${esc(ageTxt(s.age_h))}</small></span><span class="dk-num">${esc(fmtN(s.v48 || s.views))}</span></a></li>`).join('') : `<li class="dk-empty">${esc(t('noShorts'))}</li>`}</ul>
    </section>
  </div>
  <div class="dk-row">
    <section class="dk-card f2 dk-fade">
      <div class="dk-ch"><h2>${esc(t('todayPicks'))}</h2><a class="dk-sub" href="#picks">${esc(t('seeAll'))}</a></div>
      <p class="dk-sub" style="margin:-6px 0 0">${esc(t('todayPicksSub'))}</p>
      ${picks.length ? `<div class="dk-grid compact">${picks.map(pickCard).join('')}</div>` : `<div class="dk-empty">${esc(t('picksEmpty'))}</div>`}
    </section>
    <section class="dk-card f1 dk-fade">
      <div class="dk-ch"><h2>${esc(t('agentFeed'))}</h2><a class="dk-sub" href="#alerts">${esc(t('seeAll'))}</a></div>
      <div style="display:flex;flex-direction:column;gap:10px">${alerts.length ? alerts.map(alertHtml).join('') : `<div class="dk-empty">${esc(t('noAlerts'))}</div>`}</div>
    </section>
  </div>
  <div class="dk-kpis dk-fade">
    <div class="dk-kpi"><span>${esc(t('kChannels'))}</span><b>${esc(fmtFull(ov.channels.total))}</b><small>${esc(t('kChannelsSub', { m: ov.channels.mine, r: ov.channels.reference }))}</small></div>
    <div class="dk-kpi"><span>${esc(t('kShorts'))}</span><b>${esc(fmtFull(ov.shorts))}</b><small>${esc(t('kShortsSub'))}</small></div>
    <div class="dk-kpi"><span>${esc(t('kUnits'))}</span><b>${esc(fmtFull(ov.units_today))}</b><small>${esc(t('kUnitsSub', { b: fmtFull(9000) }))}</small></div>
    <div class="dk-kpi"><span>${esc(t('kNext'))}</span><b>${esc(nextRun)}</b><small>${esc(t('kNextSub'))}</small></div>
  </div>`;
  bindBars(v, 'b48', hv, (x) => `${hourLabel(x.h)}\n${x.pre ? t('preCollect') : fmtFull(x.v) + t('unitViews')}`);
  bindBars(v, 'bd', dv, (x) => `${dayLabel(x.d)}\n${x.pre ? t('preCollect') : fmtFull(x.v) + t('unitViews')}`);
  bindBoardButtons(v, picks);
  bindAlertButtons(v);
}

// ---------- 알고리즘 분석 (수집한 쇼츠로 계산) ----------
const KST = 9 * 3600e3;
const kstOf = (iso) => { const d = new Date(Date.parse(iso) + KST); return { h: d.getUTCHours(), wd: d.getUTCDay(), ym: d.toISOString().slice(0, 7) }; };
const median = (a) => { if (!a.length) return null; const x = [...a].sort((p, q) => p - q); const m = x.length >> 1; return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2; };
const DUR = [[0, 15], [16, 30], [31, 45], [46, 60], [61, 90], [91, 1e9]];
const MIN_N = 3;
const hourName = (h) => new Date(Date.UTC(2020, 0, 1, h) - KST).toLocaleTimeString(loc(), { hour: 'numeric', timeZone: 'Asia/Seoul' });
const dayName = (wd, style = 'long') => new Date(Date.UTC(2020, 0, 5 + wd)).toLocaleDateString(loc(), { weekday: style, timeZone: 'UTC' });
const monthName = (ym) => new Date(ym + '-15T00:00:00Z').toLocaleDateString(loc(), { year: '2-digit', month: 'short', timeZone: 'UTC' });
function analyze(list) {
  const live = list.filter((s) => s.status === 'live' && s.ratio != null && s.published_at);
  const mature = live.filter((s) => s.age_h >= 72);
  const base = mature.length >= 20 ? mature : live; // 막 올라온 쇼츠는 아직 조회수가 크는 중이라 빼고 봐요
  const group = (keyOf, keys) => keys.map((k) => { const xs = base.filter((s) => keyOf(s) === k).map((s) => Number(s.ratio)); return { k, n: xs.length, v: median(xs) }; });
  const hours = group((s) => kstOf(s.published_at).h, [...Array(24).keys()]);
  const days = group((s) => kstOf(s.published_at).wd, [1, 2, 3, 4, 5, 6, 0]);
  const durs = group((s) => DUR.findIndex(([a, b]) => (s.dur || 0) >= a && (s.dur || 0) <= b), DUR.map((_, i) => i));
  const fmts = [...FMT.map(([k]) => k), 'none'].map((k) => {
    const xs = base.filter((s) => { const f = formatsOf(s.title); return k === 'none' ? !f.length : f.includes(k); }).map((s) => Number(s.ratio));
    return { k, n: xs.length, v: median(xs) };
  });
  const mm = new Map();
  for (const s of live) {
    const ym = kstOf(s.published_at).ym;
    const o = mm.get(ym) || { ym, n: 0, sum: 0, views: [] };
    o.n++; o.sum += Number(s.views || 0); o.views.push(Number(s.views || 0));
    mm.set(ym, o);
  }
  // 이번 달부터 거꾸로 최소 6개월(최대 12개월)을 빈 달까지 채워서 보여줘요
  const months = [];
  if (mm.size) {
    const first = [...mm.keys()].sort()[0];
    let [y, m] = kstOf(new Date().toISOString()).ym.split('-').map(Number);
    for (let i = 0; i < 12; i++) {
      const ym = `${y}-${String(m).padStart(2, '0')}`;
      const o = mm.get(ym);
      months.unshift(o ? { ym, n: o.n, v: o.sum, med: median(o.views) } : { ym, n: 0, v: 0, med: null });
      if (i >= 5 && ym <= first) break;
      m -= 1; if (!m) { m = 12; y -= 1; }
    }
  }
  const hits = base.filter((s) => s.ratio >= 2);
  return {
    n: live.length, used: base.length, matured: base === mature && mature.length > 0, hours, days, durs, fmts, months,
    hits: hits.length, hitRate: base.length ? hits.length / base.length : 0,
    shortHit: hits.length ? hits.filter((s) => (s.dur || 0) <= 30).length / hits.length : null,
    durMed: median(live.map((s) => s.dur || 0).filter(Boolean)),
    perWeek: live.filter((s) => s.age_h <= 28 * 24).length / 4,
    chans: new Set(live.map((s) => s.channel_id)).size
  };
}
const bestOf = (rows) => rows.filter((r) => r.n >= MIN_N && r.v != null).sort((a, b) => b.v - a.v)[0] || null;
function insightLines(a) {
  const out = [];
  const x1 = (v) => v.toFixed(1);
  const bh = bestOf(a.hours); if (bh && bh.v >= 1.05) out.push({ ic: IC.clock, tone: 'good', tx: t('insL_hour', { h: hourName(bh.k), x: x1(bh.v), n: bh.n }) });
  const bf = bestOf(a.fmts.filter((r) => r.k !== 'none')); if (bf && bf.v >= 1.05) out.push({ ic: IC.picks, tone: 'good', tx: t('insL_fmt', { f: t('fmt_' + bf.k), x: x1(bf.v) }) });
  const bd = bestOf(a.durs); if (bd && bd.v >= 1.05) out.push({ ic: IC.timer, tone: '', tx: t('insL_dur', { b: t('dur' + bd.k), x: x1(bd.v), n: bd.n }) });
  const bw = bestOf(a.days); if (bw && bw.v >= 1.05) out.push({ ic: IC.cal, tone: '', tx: t('insL_day', { d: dayName(bw.k), x: x1(bw.v) }) });
  if (a.shortHit != null && a.hits >= 3) out.push({ ic: IC.up, tone: '', tx: t('insL_short', { p: Math.round(a.shortHit * 100) }) });
  if (!out.length) out.push({ ic: IC.insights, tone: '', tx: t('insL_none') });
  out.push({ ic: IC.ideas, tone: '', tx: t('insL_freq', { w: String(Math.round(a.perWeek * 10) / 10), c: a.chans }) });
  return out;
}
const insListHtml = (a) => `<ul class="dk-ins">${insightLines(a).map((l) => `<li><span class="ic ${l.tone}">${svg(l.ic, 18)}</span><span>${esc(l.tx)}</span></li>`).join('')}</ul>`;
function hoursChart(id, a, h = 170) {
  const best = bestOf(a.hours);
  const vals = a.hours.map((r) => ({ v: r.v || 0, n: r.n, k: r.k, low: r.n < MIN_N, hot: best && r.k === best.k }));
  return { html: barsHtml(id, vals, t('insHour'), h, { v: 1, label: t('insUsual') }) + `<div class="dk-axis"><span>${esc(hourName(0))}</span><span>${esc(hourName(6))}</span><span>${esc(hourName(12))}</span><span>${esc(hourName(18))}</span><span>${esc(hourName(23))}</span></div>`, vals };
}
const ratioTip = (label, x) => `${label} · ${t('insTipN', { n: x.n })}\n${x.low ? t('insLow') : t('ratio', { x: (x.v || 0).toFixed(1) })}`;
function monthsChart(id, a, h = 150) {
  const vals = a.months.map((m) => ({ v: m.v, n: m.n, med: m.med, ym: m.ym }));
  return { html: barsHtml(id, vals, t('insMonth'), h) + `<div class="dk-axis">${vals.length ? `<span>${esc(monthName(vals[0].ym))}</span>${vals.length > 2 ? `<span>${esc(monthName(vals[Math.floor(vals.length / 2)].ym))}</span>` : ''}<span>${esc(monthName(vals[vals.length - 1].ym))}</span>` : ''}</div>`, vals };
}
const monthTip = (x) => (x.n ? `${monthName(x.ym)} · ${t('insTipN', { n: x.n })}\n${fmtFull(x.v)}${t('unitViews')} · ${t('insTipMed', { v: fmtN(x.med) })}` : `${monthName(x.ym)} · ${t('insTipN', { n: 0 })}`);

async function vInsights(v, r, alive) {
  v.innerHTML = head(t('insights'), esc(t('insSub'))) + loadingCard();
  const [list, chans] = await Promise.all([
    rpc('radar_shorts', { p_days: 400, p_channel: S.insCh || null, p_role: S.insRole === 'all' ? null : S.insRole, p_limit: 1000 }),
    getChans()
  ]);
  if (!alive()) return;
  const a = analyze(list);
  const seg = (val, lab) => `<button type="button" data-irole="${val}" aria-pressed="${String(S.insRole === val)}">${esc(lab)}</button>`;
  const controls = `<section class="dk-card full dk-fade"><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
    <div class="dk-seg" role="group">${seg('all', t('all'))}${seg('mine', t('mine'))}${seg('reference', t('reference'))}</div>
    <label class="sr" for="insCh">${esc(t('cChannel'))}</label>
    <select class="dk-select" id="insCh" style="min-height:40px;flex:1 1 220px;max-width:420px;min-width:0;width:100%"><option value="">${esc(t('insAllCh'))}</option>${(chans || []).filter((c) => S.insRole === 'all' || c.role === S.insRole).map((c) => `<option value="${esc(c.id)}" ${S.insCh === c.id ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select>
  </div></section>`;
  const bind = () => {
    v.querySelectorAll('[data-irole]').forEach((b) => b.addEventListener('click', () => { S.insRole = b.dataset.irole; S.insCh = ''; render(); }));
    v.querySelector('#insCh').addEventListener('change', (e) => { S.insCh = e.target.value; render(); });
  };
  if (a.n < 10) {
    v.innerHTML = head(t('insights'), esc(t('insSub'))) + controls + `<section class="dk-card full"><div class="dk-empty">${esc(t('insFew'))}<br><a class="dk-btn" style="margin-top:12px" href="#collect">${esc(t('goCollect'))}</a></div></section>`;
    bind();
    return;
  }
  const hc = hoursChart('ih', a);
  const dvals = a.days.map((r) => ({ v: r.v || 0, n: r.n, k: r.k, low: r.n < MIN_N, hot: bestOf(a.days)?.k === r.k }));
  const bd = bestOf(a.durs), bf = bestOf(a.fmts);
  const durRows = a.durs.map((r) => ({ label: t('dur' + r.k), v: r.v, n: r.n, low: r.n < MIN_N, hot: bd && bd.k === r.k }));
  const fmtRows = a.fmts.filter((r) => r.n > 0).sort((p, q) => (q.n >= MIN_N) - (p.n >= MIN_N) || (q.v || 0) - (p.v || 0))
    .map((r) => ({ label: t('fmt_' + r.k), v: r.v, n: r.n, low: r.n < MIN_N, hot: bf && bf.k === r.k }));
  const mc = monthsChart('im', a);
  v.innerHTML = head(t('insights'), esc(t('insSub'))) + controls + `
  <div class="dk-kpis dk-fade">
    <div class="dk-kpi"><span>${esc(t('insN'))}</span><b>${esc(fmtFull(a.used))}</b><small>${esc(t(a.matured ? 'insNSub' : 'insNSubAll', { c: a.chans }))}</small></div>
    <div class="dk-kpi"><span>${esc(t('insHit'))}</span><b>${Math.round(a.hitRate * 100)}%</b><small>${esc(t('insHitSub', { n: a.hits }))}</small></div>
    <div class="dk-kpi"><span>${esc(t('insDur'))}</span><b>${a.durMed != null ? Math.round(a.durMed) + (lang === 'en' ? 's' : lang === 'ja' ? '秒' : '초') : '–'}</b><small>${esc(t('insDurSub'))}</small></div>
    <div class="dk-kpi"><span>${esc(t('insFreq'))}</span><b>${esc(String(Math.round(a.perWeek * 10) / 10))}</b><small>${esc(t('insFreqSub', { c: a.chans }))}</small></div>
  </div>
  <div class="dk-row">
    <section class="dk-card f1 dk-fade"><div class="dk-ch"><h2>${esc(t('insAgent'))}</h2></div><p class="dk-sub" style="margin:-6px 0 0">${esc(t('insAgentSub'))}</p>${insListHtml(a)}</section>
    <section class="dk-card f2 dk-fade"><div class="dk-ch"><h2>${esc(t('insHour'))}</h2><span class="dk-sub">${esc(t('insHourSub'))}</span></div>${hc.html}</section>
  </div>
  <div class="dk-row">
    <section class="dk-card f1 dk-fade"><h2>${esc(t('insDay'))}</h2>${barsHtml('iw', dvals, t('insDay'), 150, { v: 1, label: t('insUsual') })}<div class="dk-axis">${dvals.map((x) => `<span>${esc(dayName(x.k, 'short'))}</span>`).join('')}</div></section>
    <section class="dk-card f1 dk-fade"><h2>${esc(t('insDurT'))}</h2>${hbarsHtml(durRows)}</section>
    <section class="dk-card f1 dk-fade"><h2>${esc(t('insFmt'))}</h2>${hbarsHtml(fmtRows)}</section>
  </div>
  <section class="dk-card full dk-fade"><div class="dk-ch"><h2>${esc(t('insMonth'))}</h2><span class="dk-sub">${esc(t('insMonthSub'))}</span></div>${mc.html}</section>`;
  bindBars(v, 'ih', hc.vals, (x) => ratioTip(hourName(x.k), x), { v: 1 });
  bindBars(v, 'iw', dvals, (x) => ratioTip(dayName(x.k), x), { v: 1 });
  bindBars(v, 'im', mc.vals, monthTip);
  bind();
}

// 에이전트 브리핑: 48시간 흐름 · 터진 레퍼런스 · 내 채널 이슈 · 오늘 만들 소재
function briefHtml(ov, alerts, picks, covH) {
  const now = Date.now();
  const within = (a, h) => now - Date.parse(a.created_at) <= h * 3600e3;
  const breaks = alerts.filter((a) => a.kind === 'breakout' && a.data?.role !== 'mine' && within(a, 24));
  const issue = (a) => ['gap', 'age', 'region', 'drop'].includes(a.kind) || (a.kind === 'missing' && a.data?.role === 'mine');
  const issues = alerts.filter((a) => issue(a) && !a.read_at && within(a, 72));
  let flow;
  if (covH >= 96 && ov.prev48 > 0) { const p = pct(ov.views48, ov.prev48); flow = t('vsPrev', { p: Math.abs(p), dir: t(p >= 0 ? 'more' : 'less') }); } else flow = t('coverage', { h: Math.min(covH, 48) });
  const b0 = breaks[0]?.data, i0 = issues[0] ? alertParts(issues[0]) : null, p0 = picks[0];
  const tile = (href, ic, tone, label, big, small) => `<a class="dk-bi" href="${href}"><span class="ic ${tone}">${svg(ic, 18)}</span><span class="tx"><b>${esc(label)}</b><strong>${esc(big)}</strong><span>${esc(small)}</span></span></a>`;
  return `<section class="dk-card full dk-fade">
    <div class="dk-ch"><h2 style="display:flex;align-items:center;gap:10px">${svg(IC.sun, 20)}${esc(t('brTitle'))}</h2><span class="dk-live"><i></i>${esc(t('brSub'))}</span></div>
    <div class="dk-brief">
      ${tile('#home', IC.insights, '', t('br48'), fmtN(ov.views48) + t('unitViews'), flow)}
      ${tile('#alerts', IC.up, breaks.length ? 'good' : '', t('brBreak'), breaks.length ? t('brCount', { n: breaks.length }) : '0', b0 ? `${b0.channel} · “${b0.title}” · ${t('ratio', { x: b0.ratio })}` : t('brBreakNone'))}
      ${tile('#alerts', issues.length ? IC.warn : IC.lock, issues.length ? 'warn' : 'good', t('brIssue'), issues.length ? t('brCount', { n: issues.length }) : t('brIssueNone'), i0 ? `${i0.title} · ${i0.body}` : (ov.channels.mine ? t('brIssueOk') : t('brIssueNoMine')))}
      ${tile('#picks', IC.picks, p0 ? 'good' : '', t('brIdea'), p0 ? t('ratio', { x: Number(p0.ratio).toFixed(1) }) : '–', p0 ? `“${p0.title}” · ${formatsOf(p0.title).map((k) => t('fmt_' + k)).join(' · ') || p0.channel_title}` : t('brIdeaNone'))}
    </div>
  </section>`;
}

// ---------- 소재 추천 ----------
async function vPicks(v, r, alive) {
  v.innerHTML = head(t('picks'), esc(t('picksSub'))) + loadingCard();
  const [list] = await Promise.all([rpc('radar_shorts', { p_days: S.period, p_channel: null, p_role: null, p_limit: 1000 }), getChans()]);
  if (!alive()) return;
  const cats = myCats();
  const kws = trendKeywords(list);
  let picks = pickList(list, S.scope);
  if (S.kw) picks = picks.filter((s) => (s.title || '').toLowerCase().includes(S.kw) || (s.tags || []).some((x) => String(x).toLowerCase().includes(S.kw)));
  const seg = (k, val, lab) => `<button type="button" data-${k}="${val}" aria-pressed="${String((k === 'period' ? S.period : S.scope) === val)}">${esc(lab)}</button>`;
  v.innerHTML = head(t('picks'), esc(t('picksSub'))) + `
  <section class="dk-card full dk-fade">
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
      <div class="dk-seg" role="group">${seg('period', 2, t('p2'))}${seg('period', 7, t('p7'))}${seg('period', 30, t('p30'))}</div>
      <div class="dk-seg" role="group">${seg('scope', 'all', t('scopeAll'))}${seg('scope', 'mine', t('scopeMine'))}${seg('scope', 'other', t('scopeOther'))}</div>
    </div>
    ${!cats.size && S.scope !== 'all' ? `<div class="dk-banner info">${esc(t('noMyCat'))}</div>` : ''}
    ${kws.length ? `<div class="dk-ch"><h3>${esc(t('kwTitle'))}</h3>${S.kw ? `<a class="dk-sub" href="#collect" id="kwFind">${esc(t('kwFind'))}</a>` : ''}</div>
    <div class="dk-chips">${kws.map((k) => `<button type="button" class="dk-chip" data-kw="${esc(k)}" aria-pressed="${String(S.kw === k)}">#${esc(k)}</button>`).join('')}</div>` : ''}
  </section>
  ${picks.length ? `<div class="dk-grid">${picks.slice(0, 60).map(pickCard).join('')}</div>` : `<section class="dk-card full"><div class="dk-empty">${esc(t('picksEmpty'))}<br><a class="dk-btn" style="margin-top:12px" href="#collect">${esc(t('goCollect'))}</a></div></section>`}`;
  v.querySelectorAll('[data-period]').forEach((b) => b.addEventListener('click', () => { S.period = Number(b.dataset.period); render(); }));
  v.querySelectorAll('[data-scope]').forEach((b) => b.addEventListener('click', () => { S.scope = b.dataset.scope; render(); }));
  v.querySelectorAll('[data-kw]').forEach((b) => b.addEventListener('click', () => { S.kw = S.kw === b.dataset.kw ? '' : b.dataset.kw; render(); }));
  const kf = v.querySelector('#kwFind');
  if (kf) kf.addEventListener('click', () => { S.prefKw = S.kw; });
  bindBoardButtons(v, picks);
}

// ---------- 쇼츠 랭킹 ----------
async function vRanking(v, r, alive) {
  v.innerHTML = head(t('ranking'), esc(t('rankingSub'))) + loadingCard();
  const list = await rpc('radar_shorts', { p_days: S.rankDays, p_channel: null, p_role: S.rankRole === 'all' ? null : S.rankRole, p_limit: 1000 });
  if (!alive()) return;
  const q = S.rankQ.trim().toLowerCase();
  const key = { v48: (s) => s.v48 || 0, ratio: (s) => s.ratio || 0, vph: (s) => s.vph || 0, views: (s) => s.views || 0, new: (s) => Date.parse(s.published_at) || 0 }[S.rankSort];
  const rows = list.filter((s) => s.status === 'live' && (!q || (s.title || '').toLowerCase().includes(q) || (s.channel_title || '').toLowerCase().includes(q)))
    .sort((a, b) => key(b) - key(a)).slice(0, 200);
  const seg = (k, val, lab, cur) => `<button type="button" data-${k}="${val}" aria-pressed="${String(cur === val)}">${esc(lab)}</button>`;
  v.innerHTML = head(t('ranking'), esc(t('rankingSub'))) + `
  <section class="dk-card full dk-fade">
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      <div class="dk-seg" role="group">${seg('days', 2, t('p2'), S.rankDays)}${seg('days', 7, t('p7'), S.rankDays)}${seg('days', 30, t('p30'), S.rankDays)}</div>
      <div class="dk-seg" role="group">${seg('role', 'all', t('all'), S.rankRole)}${seg('role', 'mine', t('mine'), S.rankRole)}${seg('role', 'reference', t('reference'), S.rankRole)}</div>
      <label class="sr" for="rSort">${esc(t('sort_v48'))}</label>
      <select class="dk-select" id="rSort" style="min-height:40px">${['v48', 'ratio', 'vph', 'views', 'new'].map((k) => `<option value="${k}" ${S.rankSort === k ? 'selected' : ''}>${esc(t('sort_' + k))}</option>`).join('')}</select>
      <label class="sr" for="rQ">${esc(t('search'))}</label>
      <input class="dk-input" id="rQ" type="search" placeholder="${esc(t('search'))}" value="${esc(S.rankQ)}" style="min-height:40px;flex:1 1 200px">
    </div>
    ${rows.length ? `<div class="dk-tablewrap"><table class="dk-t"><thead><tr><th>#</th><th>${esc(t('cTitle'))}</th><th>${esc(t('cChannel'))}</th><th class="r">${esc(t('cAge'))}</th><th class="r">${esc(t('cViews'))}</th><th class="r">${esc(t('c48'))}</th><th class="r">${esc(t('cVph'))}</th><th class="r">${esc(t('cRatio'))}</th></tr></thead><tbody>
    ${rows.map((s, i) => `<tr><td class="dk-rank">${i + 1}</td>
      <td><a href="${ytShort(s.id)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit;min-width:240px">${avatar(s.thumb, true)}<span style="font-weight:700;line-height:1.4">${esc(s.title)}</span></a></td>
      <td><a href="#ch/${esc(s.channel_id)}" style="color:#475569;font-size:13px;white-space:nowrap">${esc(s.channel_title)}</a></td>
      <td class="r" style="white-space:nowrap">${esc(ageTxt(s.age_h))}</td><td class="r dk-num">${esc(fmtN(s.views))}</td><td class="r dk-num">${esc(fmtN(s.v48))}</td><td class="r dk-num">${esc(fmtN(s.vph))}</td><td class="r">${ratioTag(s.ratio)}</td></tr>`).join('')}
    </tbody></table></div>` : `<div class="dk-empty">${esc(t('noShorts'))}</div>`}
  </section>`;
  v.querySelectorAll('[data-days]').forEach((b) => b.addEventListener('click', () => { S.rankDays = Number(b.dataset.days); render(); }));
  v.querySelectorAll('[data-role]').forEach((b) => b.addEventListener('click', () => { S.rankRole = b.dataset.role; render(); }));
  v.querySelector('#rSort').addEventListener('change', (e) => { S.rankSort = e.target.value; render(); });
  let timer = null;
  v.querySelector('#rQ').addEventListener('input', (e) => {
    S.rankQ = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => render().then(() => { const el = document.getElementById('rQ'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }), 350);
  });
}

// ---------- 알림 ----------
function alertParts(a) {
  const d = a.data || {};
  switch (a.kind) {
    case 'breakout': return { ic: IC.up, title: t(d.role === 'mine' ? 'alBreakMine' : 'alBreakRef'), body: t('alBreakBody', { ch: d.channel, title: d.title, h: d.hours, v: fmtN(d.views), x: d.ratio }) };
    case 'gap': return { ic: IC.warn, title: t('alGap'), body: t('alGapBody', { ch: d.channel, d: d.days }) };
    case 'missing': return { ic: IC.gone, title: t('alMissing'), body: t('alMissingBody', { ch: d.channel, title: d.title }) };
    case 'age': return { ic: IC.lock, title: t('alAge'), body: t('alAgeBody', { ch: d.channel, title: d.title }) };
    case 'region': return { ic: IC.globe, title: t('alRegion'), body: t('alRegionBody', { ch: d.channel, title: d.title, n: d.count, kr: d.kr ? t('alRegionKr') : '' }) };
    case 'surge': case 'drop': return { ic: a.kind === 'surge' ? IC.up : IC.down, title: t(a.kind === 'surge' ? 'alSurge' : 'alDrop'), body: t('alTrendBody', { ch: d.channel, p: fmtN(d.prev), c: fmtN(d.cur), pct: (d.pct > 0 ? '+' : '') + d.pct }) };
    case 'briefing': {
      const picks = (d.picks || []).map((p) => p.title).slice(0, 3).join(' / ');
      return { ic: IC.sun, title: t('alBrief'), body: t('alBriefBody', { v: fmtN(d.views48), n: d.breakouts || 0, picks: picks ? t('alBriefPicks', { p: picks }) : '' }) };
    }
    default: return { ic: IC.alerts, title: a.kind, body: '' };
  }
}
function alertHtml(a) {
  const p = alertParts(a);
  const link = a.video_id ? ytShort(a.video_id) : a.channel_id ? '#ch/' + a.channel_id : null;
  return `<div class="dk-alert ${a.read_at ? '' : 'unread'}"><span class="ic ${esc(a.severity)}">${svg(p.ic, 18)}</span>
    <div class="tx"><b>${esc(p.title)}</b><span>${esc(p.body)}</span><small>${esc(agoTxt(a.created_at))}${link ? ` · <a href="${esc(link)}" ${a.video_id ? 'target="_blank" rel="noopener"' : ''}>${esc(a.video_id ? t('viewOnYt') : t('chOpen'))}</a>` : ''}</small></div>
    ${a.read_at ? '' : `<button type="button" class="dk-btn sm line" data-read="${esc(String(a.id))}">${esc(t('read'))}</button>`}</div>`;
}
function bindAlertButtons(root) {
  root.querySelectorAll('[data-read]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const out = await act({ action: 'alerts_read', ids: [Number(b.dataset.read)] });
    if (!out.ok) { b.disabled = false; snack(errText(out.error)); return; }
    b.closest('.dk-alert').classList.remove('unread');
    b.remove();
    updateUnread().catch(() => {});
  }));
}
async function vAlerts(v, r, alive) {
  v.innerHTML = head(t('alerts'), esc(t('alertsSub'))) + loadingCard();
  const { data, error } = await sb.from('radar_alerts').select('*, radar_channels(role)').order('created_at', { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  if (!alive()) return;
  const f = S.alertF;
  const list = (data || []).filter((a) => f === 'all' || (f === 'unread' && !a.read_at) || (f === 'mine' && a.radar_channels?.role === 'mine') || (f === 'reference' && a.radar_channels?.role === 'reference'));
  const chip = (k, lab) => `<button type="button" class="dk-chip" data-f="${k}" aria-pressed="${String(f === k)}">${esc(lab)}</button>`;
  v.innerHTML = head(t('alerts'), esc(t('alertsSub')), `<button type="button" class="dk-hbtn" id="readAll">${esc(t('markAll'))}</button>`) + `
  <section class="dk-card full dk-fade">
    <div class="dk-chips">${chip('all', t('all'))}${chip('unread', t('unread'))}${chip('mine', t('mine'))}${chip('reference', t('reference'))}</div>
    <div style="display:flex;flex-direction:column;gap:10px">${list.length ? list.map(alertHtml).join('') : `<div class="dk-empty">${esc(t('noAlerts'))}</div>`}</div>
  </section>`;
  v.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { S.alertF = b.dataset.f; render(); }));
  v.querySelector('#readAll').addEventListener('click', async () => {
    const out = await act({ action: 'alerts_read' });
    if (!out.ok) { snack(errText(out.error)); return; }
    render();
  });
  bindAlertButtons(v);
}

// ---------- 채널 수집 + 추천 채널 찾기 ----------
async function vCollect(v, r, alive) {
  v.innerHTML = head(t('collect'), esc(t('collectSub'))) + loadingCard();
  const [, disc, sh] = await Promise.all([
    getChans(),
    sb.from('radar_discoveries').select('*').eq('status', 'new').order('score', { ascending: false }).limit(60),
    rpc('radar_shorts', { p_days: 14, p_channel: null, p_role: null, p_limit: 600 })
  ]);
  if (!alive()) return;
  const cats = [...new Set((S.chans || []).map((c) => c.category).filter(Boolean))];
  const sugg = [...new Set([...cats, ...trendKeywords(sh)])].slice(0, 10);
  const kwVal = S.prefKw || '';
  S.prefKw = '';
  v.innerHTML = head(t('collect'), esc(t('collectSub'))) + `
  <div class="dk-row">${addFormHtml(false)}
    <section class="dk-card f1 dk-fade">
      <h2>${esc(t('discTitle'))}</h2>
      <p class="dk-sub" style="margin:-6px 0 0">${esc(t('discSub'))}</p>
      <form id="discForm" class="dk-field" novalidate>
        <label for="discKw">${esc(t('discKw'))}</label>
        <div style="display:flex;gap:8px"><input class="dk-input" id="discKw" style="flex:1 1 auto;min-width:0" maxlength="120" value="${esc(kwVal)}"><button class="dk-btn" type="submit" id="discBtn">${esc(t('discBtn'))}</button></div>
      </form>
      ${sugg.length ? `<div class="dk-sub">${esc(t('discSuggest'))}</div><div class="dk-chips">${sugg.map((k) => `<button type="button" class="dk-chip" data-sk="${esc(k)}">${esc(k)}</button>`).join('')}</div>` : ''}
      <span class="dk-sub">${esc(t('discCost'))}</span>
      <div id="discMsg" aria-live="polite"></div>
    </section>
  </div>
  <section class="dk-card full dk-fade" id="discList">${discListHtml(disc.data || [])}</section>`;
  bindAddForm(v, () => { S.chansAt = 0; });
  v.querySelectorAll('[data-sk]').forEach((b) => b.addEventListener('click', () => {
    const inp = v.querySelector('#discKw');
    const curKw = inp.value.split(',').map((s) => s.trim()).filter(Boolean);
    if (!curKw.includes(b.dataset.sk) && curKw.length < 3) curKw.push(b.dataset.sk);
    inp.value = curKw.join(', ');
  }));
  v.querySelector('#discForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = v.querySelector('#discBtn'), msg = v.querySelector('#discMsg');
    btn.disabled = true;
    msg.innerHTML = `<div class="dk-banner info"><span class="dk-spin"></span> ${esc(t('loading'))}</div>`;
    const out = await act({ action: 'discover', keywords: v.querySelector('#discKw').value, lang });
    btn.disabled = false;
    if (!out.ok) { msg.innerHTML = `<div class="dk-banner bad">${esc(errText(out.error))}</div>`; return; }
    msg.innerHTML = `<div class="dk-banner good">${esc(t('discFound', { n: (out.items || []).length }))} · ${esc((out.keywords || []).join(', '))}</div>`;
    const { data } = await sb.from('radar_discoveries').select('*').eq('status', 'new').order('score', { ascending: false }).limit(60);
    v.querySelector('#discList').innerHTML = discListHtml(data || []);
    bindDisc(v);
  });
  bindDisc(v);
}
function discListHtml(list) {
  if (!list.length) return `<h2>${esc(t('discTitle'))}</h2><div class="dk-empty">${esc(t('discEmpty'))}</div>`;
  return `<h2>${esc(t('discTitle'))} · ${list.length}</h2><div class="dk-tablewrap"><table class="dk-t"><thead><tr><th>${esc(t('cChannel'))}</th><th>${esc(t('sample'))}</th><th class="r">${esc(t('cViews'))}</th><th></th></tr></thead><tbody>
  ${list.map((d) => `<tr>
    <td><a href="https://www.youtube.com/channel/${esc(d.channel_id)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit;min-width:220px">${avatar(d.thumbnail_url)}<span class="dk-ttl"><b>${esc(d.title)}</b><small>${esc(d.subscriber_count == null ? t('hiddenSubs') : t('subs', { n: fmtN(d.subscriber_count) }))} · ${esc(d.via === 'featured' ? t('viaFeatured', { f: d.from_channel || '' }) : t('viaSearch', { k: d.keyword || '' }))}</small></span></a></td>
    <td>${d.sample_video_id ? `<a href="${ytShort(d.sample_video_id)}" target="_blank" rel="noopener" style="color:#334155;font-size:13.5px;line-height:1.5">${esc(d.sample_title || '')}</a><br><small style="color:#94a3b8">${esc(d.sample_published_at ? agoTxt(d.sample_published_at) : '')}</small>` : '–'}</td>
    <td class="r dk-num">${esc(d.sample_views != null ? fmtN(d.sample_views) : '–')}</td>
    <td class="r" style="white-space:nowrap"><button type="button" class="dk-btn sm" data-dadd="${esc(d.channel_id)}">${esc(t('addRef'))}</button> <button type="button" class="dk-btn sm line" data-dhide="${esc(d.channel_id)}">${esc(t('hide'))}</button></td></tr>`).join('')}
  </tbody></table></div>`;
}
function bindDisc(root) {
  root.querySelectorAll('[data-dadd]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    b.innerHTML = '<span class="dk-spin"></span>';
    const out = await act({ action: 'discovery', op: 'add', channel_id: b.dataset.dadd });
    const r0 = (out.results || [])[0];
    if (!out.ok || (r0 && !r0.ok)) { b.disabled = false; b.textContent = t('addRef'); snack(errText(out.ok ? r0.error : out.error)); return; }
    snack(`${r0?.title || ''} · ${t('resOk', { n: r0?.shorts ?? 0 })}`);
    b.closest('tr').remove();
    S.chansAt = 0;
  }));
  root.querySelectorAll('[data-dhide]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const out = await act({ action: 'discovery', op: 'dismiss', channel_id: b.dataset.dhide });
    if (!out.ok) { b.disabled = false; snack(errText(out.error)); return; }
    b.closest('tr').remove();
  }));
}

// ---------- 채널 목록 ----------
async function vChannels(v, r, alive) {
  v.innerHTML = head(t('channels'), esc(t('channelsSub'))) + loadingCard();
  const list = await getChans(true);
  if (!alive()) return;
  const q = S.chQ.trim().toLowerCase();
  const rows = list.filter((c) => (S.chRole === 'all' || c.role === S.chRole) && (!q || (c.title || '').toLowerCase().includes(q) || (c.handle || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q)));
  const cats = [...new Set(list.map((c) => c.category).filter(Boolean))];
  const seg = (val, lab) => `<button type="button" data-crole="${val}" aria-pressed="${String(S.chRole === val)}">${esc(lab)}</button>`;
  v.innerHTML = head(t('channels'), esc(t('channelsSub')), `<a class="dk-hbtn" href="#collect">${svg(IC.collect, 17)}${esc(t('addTitle'))}</a>`) + `
  <section class="dk-card full dk-fade">
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      <div class="dk-seg" role="group">${seg('all', t('all') + ' ' + list.length)}${seg('mine', t('mine'))}${seg('reference', t('reference'))}</div>
      <label class="sr" for="cQ">${esc(t('search'))}</label><input class="dk-input" id="cQ" type="search" placeholder="${esc(t('search'))}" value="${esc(S.chQ)}" style="min-height:40px;flex:1 1 220px">
    </div>
    <datalist id="catList2">${cats.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
    ${rows.length ? `<div class="dk-tablewrap"><table class="dk-t"><thead><tr><th>${esc(t('cChannel'))}</th><th>${esc(t('cRole'))}</th><th>${esc(t('cCat'))}</th><th class="r">${esc(t('cSubs'))}</th><th class="r">${esc(t('cShorts'))}</th><th class="r">${esc(t('cN7'))}</th><th class="r">${esc(t('cMedian'))}</th><th class="r">${esc(t('c48'))}</th><th class="r">${esc(t('cLast'))}</th><th></th></tr></thead><tbody>
    ${rows.map((c) => `<tr class="click" data-go="${esc(c.id)}">
      <td><span style="display:flex;align-items:center;gap:10px;min-width:200px">${avatar(c.thumb)}<span class="dk-ttl"><b>${esc(c.title)}</b><small>${esc(c.handle || '')}${c.error ? ` · <span style="color:#b91c1c">${esc(c.error)}</span>` : ''}</small></span></span></td>
      <td><button type="button" class="dk-chip" data-swap="${esc(c.id)}" data-cur="${esc(c.role)}" style="min-height:30px;padding:0 10px">${esc(t(c.role === 'mine' ? 'mine' : 'reference'))}</button></td>
      <td><input class="dk-input" data-cat="${esc(c.id)}" list="catList2" maxlength="30" value="${esc(c.category || '')}" placeholder="${esc(c.topics && c.topics[0] ? topicLabel(c.topics[0]) : '–')}" aria-label="${esc(t('cCat'))}" style="min-height:34px;width:130px;font-size:13px;padding:0 10px"></td>
      <td class="r dk-num">${esc(c.subs_hidden ? '–' : fmtN(c.subs))}</td><td class="r dk-num">${esc(fmtFull(c.shorts))}</td><td class="r dk-num">${esc(fmtFull(c.n7))}</td>
      <td class="r dk-num">${esc(fmtN(c.median))}</td><td class="r dk-num">${esc(fmtN(c.v48))}</td><td class="r" style="white-space:nowrap;font-size:13px;color:#64748b">${esc(agoTxt(c.last_collected_at))}</td>
      <td class="r" style="white-space:nowrap"><button type="button" class="dk-btn sm line" data-rf="${esc(c.id)}" title="${esc(t('refresh'))}" aria-label="${esc(t('refresh'))}">${svg(IC.refresh, 15)}</button> <button type="button" class="dk-btn sm danger" data-rm="${esc(c.id)}">${esc(t('remove'))}</button></td></tr>`).join('')}
    </tbody></table></div>` : `<div class="dk-empty">${esc(t('noChannels'))}<br><a class="dk-btn" style="margin-top:12px" href="#collect">${esc(t('goCollect'))}</a></div>`}
  </section>`;
  v.querySelectorAll('[data-crole]').forEach((b) => b.addEventListener('click', () => { S.chRole = b.dataset.crole; render(); }));
  let timer = null;
  v.querySelector('#cQ').addEventListener('input', (e) => {
    S.chQ = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => render().then(() => { const el = document.getElementById('cQ'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }), 350);
  });
  v.querySelectorAll('tr[data-go]').forEach((tr) => tr.addEventListener('click', (e) => {
    if (e.target.closest('button,input,a')) return;
    location.hash = '#ch/' + tr.dataset.go;
  }));
  v.querySelectorAll('[data-swap]').forEach((b) => b.addEventListener('click', async () => {
    const next = b.dataset.cur === 'mine' ? 'reference' : 'mine';
    b.disabled = true;
    const out = await act({ action: 'set', channel_id: b.dataset.swap, role: next });
    b.disabled = false;
    if (!out.ok) { snack(errText(out.error)); return; }
    b.dataset.cur = next;
    b.textContent = t(next === 'mine' ? 'mine' : 'reference');
    S.chansAt = 0;
    snack(t('roleSwitched'));
  }));
  v.querySelectorAll('[data-cat]').forEach((inp) => inp.addEventListener('change', async () => {
    const out = await act({ action: 'set', channel_id: inp.dataset.cat, category: inp.value });
    if (!out.ok) { snack(errText(out.error)); return; }
    S.chansAt = 0;
    snack(t('saved'));
  }));
  v.querySelectorAll('[data-rf]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    b.innerHTML = '<span class="dk-spin"></span>';
    const out = await act({ action: 'refresh', channel_id: b.dataset.rf });
    if (!out.ok) snack(errText(out.error)); else snack(out.skipped ? t('refreshSkip') : t('refreshed', { n: 1 }));
    render();
  }));
  v.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', async () => {
    if (b.dataset.armed !== '1') {
      b.dataset.armed = '1';
      b.textContent = t('removeConfirm');
      setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = t('remove'); } }, 4000);
      return;
    }
    b.disabled = true;
    const out = await act({ action: 'remove', channel_id: b.dataset.rm });
    if (!out.ok) { b.disabled = false; snack(errText(out.error)); return; }
    snack(t('removed'));
    S.chansAt = 0;
    render();
  }));
}

// ---------- 채널 상세 ----------
async function vChannel(v, r, alive) {
  v.innerHTML = head(t('channels'), '') + loadingCard();
  const id = r.id;
  const [d, shorts] = await Promise.all([rpc('radar_channel', { p_id: id }), rpc('radar_shorts', { p_days: 400, p_channel: id, p_role: null, p_limit: 400 })]);
  if (!alive()) return;
  const c = d?.channel;
  if (!c) { v.innerHTML = head(t('channels'), '') + `<div class="dk-card"><div class="dk-empty">${esc(t('chNotFound'))}<br><a class="dk-btn" style="margin-top:12px" href="#channels">${esc(t('chBack'))}</a></div></div>`; return; }
  const firstH = (d.hourly || []).find((x) => x.v > 0);
  const hv = (d.hourly || []).map((x) => ({ v: x.v, h: x.h, pre: !x.v && (!firstH || Date.parse(x.h) < Date.parse(firstH.h)) }));
  const dd = (d.daily || []).slice(-28).map((x) => ({ v: x.v, d: x.d, pre: x.n === 0 }));
  const sum48 = hv.reduce((a, x) => a + (x.v || 0), 0);
  const live = shorts.filter((s) => s.status === 'live');
  const usual = live.length ? live[0].base : null;
  const sorter = { new: (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at), ratio: (a, b) => (b.ratio || 0) - (a.ratio || 0), views: (a, b) => (b.views || 0) - (a.views || 0) }[S.chSort];
  const sorted = [...live].sort(sorter).slice(0, 36);
  const an = analyze(shorts);
  const mc = monthsChart('cbm', an, 150);
  const seg = (val, lab) => `<button type="button" data-csort="${val}" aria-pressed="${String(S.chSort === val)}">${esc(lab)}</button>`;
  v.innerHTML = `<div class="dk-head dk-fade"><div style="display:flex;align-items:center;gap:16px">${c.thumbnail_url ? `<img src="${esc(c.thumbnail_url)}" alt="" width="72" height="72" style="border-radius:50%;border:3px solid rgba(255,255,255,.7)" referrerpolicy="no-referrer">` : ''}<div><h1>${esc(c.title)}</h1><p>${esc(c.handle || '')} · ${esc(t(c.role === 'mine' ? 'mine' : 'reference'))}${catOf(c) ? ' · ' + esc(catOf(c)) : ''} · ${esc(c.subscribers_hidden ? t('hiddenSubs') : t('subs', { n: fmtN(c.subscriber_count) }))}</p></div></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="dk-hbtn ghost" href="#channels">← ${esc(t('chBack'))}</a><a class="dk-hbtn ghost" href="https://www.youtube.com/channel/${esc(c.id)}" target="_blank" rel="noopener">${svg(IC.yt, 17)}${esc(t('chOpenYt'))}</a><button type="button" class="dk-hbtn" id="chRf">${svg(IC.refresh, 17)}${esc(t('refresh'))}</button></div></div>
  <div class="dk-row">
    <section class="dk-card f2 dk-fade"><div class="dk-ch"><span class="dk-live"><i></i>${esc(t('chHourly'))}</span><span class="dk-mid">${esc(fmtN(sum48))}${esc(t('unitViews'))}</span></div>
      ${barsHtml('cb48', hv, t('chHourly'), 150)}<div class="dk-axis"><span>${esc(t('ago48'))}</span><span>${esc(t('ago24'))}</span><span>${esc(t('now'))}</span></div></section>
    <section class="dk-card f1 dk-fade"><div class="dk-ch"><h2>${esc(t('chDaily'))}</h2></div>${barsHtml('cbd', dd, t('chDaily'), 150)}<span class="dk-sub">${esc(t('dailyNote'))}</span></section>
  </div>
  <div class="dk-row">
    <section class="dk-card f1 dk-fade"><div class="dk-ch"><h2>${esc(t('chAlgo'))}</h2><a class="dk-sub" href="#insights" id="toIns">${esc(t('insights'))} →</a></div>${an.n >= 5 ? insListHtml(an) : `<div class="dk-empty">${esc(t('insFew'))}</div>`}</section>
    <section class="dk-card f2 dk-fade"><div class="dk-ch"><h2>${esc(t('chMonth'))}</h2><span class="dk-sub">${esc(t('insMonthSub'))}</span></div>${mc.vals.length ? mc.html : `<div class="dk-empty">${esc(t('noShorts'))}</div>`}</section>
  </div>
  <section class="dk-card full dk-fade">
    <div class="dk-ch"><h2>${esc(t('chShorts'))}</h2><span class="dk-sub">${usual != null ? esc(t('chUsual', { v: fmtN(usual) })) : ''}</span></div>
    <div class="dk-seg" role="group" style="align-self:flex-start">${seg('new', t('sortNew'))}${seg('ratio', t('sortRatio'))}${seg('views', t('sortViews'))}</div>
    ${sorted.length ? `<div class="dk-shelf">${sorted.map(tileHtml).join('')}</div>` : `<div class="dk-empty">${esc(t('noShorts'))}</div>`}
  </section>
  <section class="dk-card full dk-fade"><h2>${esc(t('chAlerts'))}</h2><div style="display:flex;flex-direction:column;gap:10px">${(d.alerts || []).length ? d.alerts.map(alertHtml).join('') : `<div class="dk-empty">${esc(t('noAlerts'))}</div>`}</div></section>`;
  bindBars(v, 'cb48', hv, (x) => `${hourLabel(x.h)}\n${x.pre ? t('preCollect') : fmtFull(x.v) + t('unitViews')}`);
  bindBars(v, 'cbd', dd, (x) => `${dayLabel(x.d)}\n${x.pre ? t('preCollect') : fmtFull(x.v) + t('unitViews')}`);
  bindBars(v, 'cbm', mc.vals, monthTip);
  const toIns = v.querySelector('#toIns');
  if (toIns) toIns.addEventListener('click', () => { S.insRole = 'all'; S.insCh = c.id; });
  v.querySelectorAll('[data-csort]').forEach((b) => b.addEventListener('click', () => { S.chSort = b.dataset.csort; render(); }));
  v.querySelector('#chRf').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    b.disabled = true;
    const out = await act({ action: 'refresh', channel_id: c.id });
    if (!out.ok) snack(errText(out.error)); else snack(out.skipped ? t('refreshSkip') : t('refreshed', { n: 1 }));
    render();
  });
  bindBoardButtons(v, sorted);
  bindAlertButtons(v);
}

// ---------- 소재 보드 ----------
const STAGES = ['idea', 'script', 'production', 'uploaded'];
async function vIdeas(v, r, alive) {
  v.innerHTML = head(t('ideas'), esc(t('ideasSub'))) + loadingCard();
  const { data, error } = await sb.from('radar_ideas').select('*').order('created_at', { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  if (!alive()) return;
  const ideas = data || [];
  for (const i of ideas) if (i.source_video_id) S.board.add(i.source_video_id);
  v.innerHTML = head(t('ideas'), esc(t('ideasSub'))) + `
  <form class="dk-card full dk-fade" id="ideaForm" novalidate style="flex-direction:row;flex-wrap:wrap;align-items:center;gap:10px">
    <label class="sr" for="ideaT">${esc(t('ideaPh'))}</label><input class="dk-input" id="ideaT" maxlength="200" placeholder="${esc(t('ideaPh'))}" style="flex:1 1 260px">
    <button class="dk-btn" type="submit">${esc(t('ideaAdd'))}</button>
  </form>
  <div class="dk-kanban dk-fade">${STAGES.map((st) => {
    const items = ideas.filter((i) => i.stage === st);
    return `<div class="dk-col"><h3>${esc(t('st_' + st))} · ${items.length}</h3>${items.length ? items.map((i) => `<div class="dk-kc">
      <b style="font-size:14.5px;line-height:1.45">${esc(i.title)}</b>${i.note ? `<span style="font-size:12.5px;color:#64748b;line-height:1.5">${esc(i.note)}</span>` : ''}
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        <label class="sr" for="mv${i.id}">${esc(t('stage'))}</label>
        <select class="dk-select" id="mv${i.id}" data-mv="${i.id}" style="min-height:34px;font-size:13px;padding:0 8px">${STAGES.map((x) => `<option value="${x}" ${x === i.stage ? 'selected' : ''}>${esc(t('st_' + x))}</option>`).join('')}</select>
        ${i.source_video_id ? `<a class="dk-btn sm line" href="${ytShort(i.source_video_id)}" target="_blank" rel="noopener" aria-label="${esc(t('viewOnYt'))}">${svg(IC.yt, 15)}</a>` : ''}
        <button type="button" class="dk-btn sm danger" data-del="${i.id}">${esc(t('del'))}</button>
      </div></div>`).join('') : `<span style="font-size:13px;color:rgba(255,255,255,.8)">${esc(t('ideaEmpty'))}</span>`}</div>`;
  }).join('')}</div>`;
  v.querySelector('#ideaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = v.querySelector('#ideaT').value.trim();
    if (!title) return;
    const out = await act({ action: 'idea', op: 'add', title });
    if (!out.ok) { snack(errText(out.error)); return; }
    render();
  });
  v.querySelectorAll('[data-mv]').forEach((s) => s.addEventListener('change', async () => {
    const out = await act({ action: 'idea', op: 'move', id: Number(s.dataset.mv), stage: s.value });
    if (!out.ok) { snack(errText(out.error)); return; }
    render();
  }));
  v.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
    if (b.dataset.armed !== '1') {
      b.dataset.armed = '1';
      b.textContent = t('removeConfirm');
      setTimeout(() => { if (b.isConnected) { b.dataset.armed = ''; b.textContent = t('del'); } }, 4000);
      return;
    }
    const out = await act({ action: 'idea', op: 'delete', id: Number(b.dataset.del) });
    if (!out.ok) { snack(errText(out.error)); return; }
    render();
  }));
}

// ---------- 음원·광고 ----------
async function vPartners(v) {
  const card = (title, desc, color) => `<section class="dk-card f1 dk-fade"><span style="width:44px;height:44px;border-radius:14px;background:${color};display:flex;align-items:center;justify-content:center;color:#fff">${svg(IC.partners, 22)}</span><h2>${esc(title)}</h2><p class="dk-sub" style="margin:0;font-size:14.5px">${esc(desc)}</p><button type="button" class="dk-btn line" disabled>${esc(t('soon'))}</button></section>`;
  v.innerHTML = head(t('partners'), esc(t('partnersSub'))) + `<div class="dk-row">${card(t('p1t'), t('p1d'), '#7c3aed')}${card(t('p2t'), t('p2d'), '#2563eb')}${card(t('p3t'), t('p3d'), '#db2777')}</div>`;
}

// ---------- 설정 · 상태 ----------
async function vStatus(v, r, alive) {
  v.innerHTML = head(t('status'), esc(t('statusSub'))) + loadingCard();
  const st = await act({ action: 'status' });
  if (!alive()) return;
  if (!st.ok) throw new Error(st.error || 'status');
  const pctUsed = Math.min(100, Math.round((st.units_today / st.budget) * 100));
  v.innerHTML = head(t('status'), esc(t('statusSub'))) + `
  <div class="dk-row">
    <section class="dk-card f1 dk-fade">
      <div class="dk-banner ${st.key ? 'good' : 'warn'}">${esc(st.key ? t('keyOk') : t('keyNo'))}</div>
      <h2>${esc(t('unitsTitle'))}</h2>
      <div class="dk-big">${esc(fmtFull(st.units_today))}<span style="font-size:16px;color:#64748b;font-weight:700"> / ${esc(fmtFull(st.budget))}</span></div>
      <div style="height:12px;border-radius:6px;background:#ede9fe;overflow:hidden" role="img" aria-label="${pctUsed}%"><div style="height:100%;width:${pctUsed}%;background:#7c3aed;border-radius:6px"></div></div>
      <p class="dk-sub" style="margin:0">${esc(t('unitsHelp'))}</p>
      <p class="dk-sub" style="margin:0">${esc(t('kChannels'))}: <b>${esc(fmtFull(st.channels))}</b> / ${esc(fmtFull(st.max_channels))}</p>
    </section>
    <section class="dk-card f1 dk-fade">
      <h2>${esc(t('schedTitle'))}</h2><ul style="margin:0;padding-left:18px;line-height:1.9;font-size:14.5px"><li>${esc(t('sched1'))}</li><li>${esc(t('sched2'))}</li></ul>
      <h2>${esc(t('policyTitle'))}</h2><ul style="margin:0;padding-left:18px;line-height:1.8;font-size:14px;color:#334155"><li>${esc(t('policy1'))}</li><li>${esc(t('policy2'))}</li><li>${esc(t('policy3'))}</li></ul>
      <h2>${esc(t('testTitle'))}</h2><p class="dk-sub" style="margin:0;font-size:14px">${esc(t('test1'))}</p>
    </section>
  </div>
  <section class="dk-card full dk-fade"><h2>${esc(t('runsTitle'))}</h2>
    ${(st.runs || []).length ? `<div class="dk-tablewrap"><table class="dk-t"><tbody>${st.runs.map((x) => `<tr><td style="white-space:nowrap">${esc(agoTxt(x.started_at))}</td><td>${esc(t('run_' + x.kind))}</td><td>${x.ok === false ? `<span class="dk-tag red">${esc(t('runFail'))}</span> <small style="color:#b91c1c">${esc(errText(x.error || ''))}</small>` : x.ok ? `<span class="dk-tag teal">${esc(t('runOk'))}</span>` : '<span class="dk-spin"></span>'}</td><td class="r dk-num">${x.channels != null ? esc(fmtFull(x.channels)) + ' ch' : ''}</td><td class="r dk-num">${esc(fmtFull(x.units))} pt</td></tr>`).join('')}</tbody></table></div>` : '<div class="dk-empty">–</div>'}
  </section>`;
}

// ---------- 시작 ----------
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  setLang(lang);
  render();
}));
document.getElementById('refreshAll').addEventListener('click', async (e) => {
  const b = e.currentTarget;
  b.disabled = true;
  b.innerHTML = `<span class="dk-spin"></span><span>${esc(t('refreshing'))}</span>`;
  const out = await act({ action: 'refresh', all: true });
  b.disabled = false;
  if (!out.ok) snack(errText(out.error));
  else snack(out.skipped ? t('refreshSkip') : t('refreshed', { n: out.channels || 0 }));
  S.chansAt = 0;
  render();
});
window.addEventListener('hashchange', () => { render(); document.getElementById('main').scrollTo({ top: 0 }); });
// 보고 있는 화면이면 5분마다 새로 불러와요 (매시 5분 자동 수집 반영)
setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  if (['home', 'ranking', 'alerts'].includes(route().name)) render();
}, 5 * 60e3);
render();
