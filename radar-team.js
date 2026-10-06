// CNOL RADAR v12 — 팀 · 요금제 · 워크스페이스 · RADAR에게 묻기(AI 대화)
// · 팀 화면(#team): 워크스페이스 이름 · 요금제 사용량 · 팀원 역할 · 초대 링크 · 비밀번호 링크 · 요금제 신청 · 내 비밀번호
// · 사이드바 계정 칸: 워크스페이스 바꾸기 · 내 역할 · 관리자 콘솔
// · RADAR에게 묻기: 지켜보는 데이터로 바로 답하고(키 없이), 서버에 AI 키가 있으면 AI가 이 워크스페이스 데이터만 보고 답해요
// app.js가 mountTeam(ctx)로 공용 함수를 넘겨줘요. 문구(TM)는 app.js가 T에 합쳐요.
import { parseCmd } from '/agent.js';
import { TT } from '/agent-i18n.js';

let C = null;
export function mountTeam(ctx) { C = ctx; }
const e = (s) => C.esc(s);
const t = (k, v) => C.t(k, v);
const att = (k, v) => { let s = (TT[C.lang] || TT.ko)[k] ?? TT.ko[k] ?? k; if (v) for (const x of Object.keys(v)) s = s.split('{' + x + '}').join(v[x]); return s; };
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (er) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (er) { /* 저장 못 해도 화면은 그대로 */ } }
};
const PLANS = ['free', 'solo', 'plus', 'team', 'agency', 'enterprise'];
// 서버(radar_plan_limits)와 같은 한도 · 소개 페이지와 같은 가격
const LIMITS = {
  free: { mine: 1, refs: 10, seats: 1, searches: 3, ai: 20 }, solo: { mine: 1, refs: 30, seats: 1, searches: 8, ai: 60 },
  plus: { mine: 5, refs: 100, seats: 1, searches: 15, ai: 150 }, team: { mine: 10, refs: 200, seats: 3, searches: 25, ai: 300 },
  agency: { mine: 30, refs: 500, seats: 10, searches: 40, ai: 600 }, enterprise: { mine: 100, refs: 1000, seats: 50, searches: 95, ai: 2000 }
};
const PRICE = { free: [0, 0], solo: [19000, 15], plus: [39000, 29], team: [69000, 49], agency: [149000, 109] };
const ROLES = ['owner', 'editor', 'viewer'];
const IC = {
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  admin: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>'
};
const svg = (p, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(C.loc(), { year: 'numeric', month: 'short', day: 'numeric' }) : '–');
const fmtDay = (iso) => (iso ? new Date(iso).toLocaleDateString(C.loc(), { month: 'short', day: 'numeric' }) : '–');
const joinUrl = (code) => `${location.origin}/join#code=${code}`;
const planName = (p) => t('plan_' + p);
const roleName = (r) => t('role_' + r);
const money = (p) => (p === 'enterprise' ? t('priceCustom') : !PRICE[p] || !PRICE[p][0] ? t('priceFree') : C.lang === 'ko' ? '₩' + PRICE[p][0].toLocaleString('ko-KR') : '$' + PRICE[p][1]);

// ---------- 문구 (한·영·일) ----------
export const TM = {
  ko: {
    team: '팀 · 요금제', tab_team: '팀 · 요금제', teamSub: '함께 쓰는 사람, 역할, 요금제 한도를 한곳에서 관리해요.',
    wsCard: '우리 워크스페이스', wsName: '워크스페이스 이름', wsSave: '저장', wsSaved: '이름을 바꿨어요', myRole: '내 역할', wsMade: '만든 날', wsPlan: '요금제',
    role_owner: '대표', role_editor: '편집', role_viewer: '보기 전용', roleAdmin: '서비스 관리자',
    roleHelp_owner: '팀원 초대 · 역할 · 요금제까지 모두 관리해요', roleHelp_editor: '채널 · 소재 보드 · 찾기를 바꿀 수 있어요', roleHelp_viewer: '보기만 해요 · RADAR에게 묻기는 돼요',
    plan_free: '무료', plan_solo: '솔로', plan_plus: '플러스', plan_team: '팀', plan_agency: '에이전시', plan_enterprise: '엔터프라이즈',
    priceFree: '무료', priceCustom: '별도 협의', perMonth: '/월',
    useCard: '요금제 · 사용량', uMine: '내 채널', uRefs: '레퍼런스 채널', uSeats: '팀 자리', uSearch: '오늘 유튜브 검색', uAi: '오늘 AI 질문',
    uReset: '검색 · AI 질문 횟수는 매일 오후 4~5시(한국 시간)에 다시 채워져요.', uFull: '한도에 거의 닿았어요',
    plansCard: '요금제별 한도', plansSub: '지금 요금제는 진하게 표시했어요. 결제 연결 전이라, 신청하면 관리자가 확인하고 바로 바꿔 드려요.',
    pRow_price: '월 요금', pRow_mine: '내 채널', pRow_refs: '레퍼런스 채널', pRow_seats: '팀 자리', pRow_searches: '하루 유튜브 검색', pRow_ai: '하루 AI 질문', now: '지금',
    reqTitle: '요금제 바꾸기 신청', reqPlan: '바꿀 요금제', reqNote: '메모 (선택) · 예: 팀원 2명이 더 들어와요', reqBtn: '신청하기', reqSent: '신청했어요. 관리자가 확인하고 바꿔 드려요.',
    reqPending: '검토 중이에요 · {p} · {d} 신청', reqDone: '{p} 요금제로 바뀌었어요 · {d}', reqDeclined: '{p} 신청은 보류됐어요 · {d}', reqOwner: '요금제 신청은 대표만 할 수 있어요.',
    membersCard: '팀원', mSeats: '{a}/{b}명', mSince: '{d}부터', you: '나', mRoleAria: '{n}님의 역할', roleSaved: '역할을 바꿨어요',
    mRemove: '내보내기', mRemoveQ: '{n}님을 이 워크스페이스에서 내보낼까요? 계정은 남고, 이 워크스페이스 데이터만 못 보게 돼요.', mRemoved: '내보냈어요',
    mReset: '비밀번호 링크', mResetMade: '{n}님의 비밀번호 다시 정하기 링크예요. 하루 동안 한 번 쓸 수 있어요.',
    inviteCard: '팀원 초대', inviteSub: '링크를 만들어 카톡 · 슬랙 · 메일로 보내 주세요. 받은 사람이 아이디와 비밀번호를 직접 정해서 바로 들어와요.',
    iRole: '역할', iNote: '메모 · 누구에게 보내는지 (선택)', iNotePh: '예: 편집자 민수', iBtn: '초대 링크 만들기', iMade: '초대 링크를 만들었어요. 7일 동안 한 번 쓸 수 있어요.',
    iOpen: '아직 안 쓴 링크', iNone: '아직 만든 링크가 없어요', iExp: '{d}까지', iRevoke: '취소', iRevoked: '링크를 취소했어요', iKindReset: '비밀번호 다시 정하기',
    copy: '복사', copied: '복사했어요', copyFail: '복사하지 못했어요. 링크를 길게 눌러 복사해 주세요.',
    seatFullH: '팀 자리가 다 찼어요 ({a}/{b}명)', seatFullP: '{p} 요금제는 {b}명까지 쓸 수 있어요. 팀 요금제부터 더 초대할 수 있어요.', seatGo: '요금제 보기',
    ownerOnlyNote: '팀원 초대와 역할 바꾸기는 대표만 할 수 있어요.',
    leaveTitle: '워크스페이스 나가기', leaveBtn: '이 워크스페이스에서 나가기', leaveQ: '나가면 이 워크스페이스 데이터를 더 볼 수 없어요. 나갈까요?', left: '나갔어요',
    wsLabel: '워크스페이스', wsSwitchAria: '워크스페이스 바꾸기', wsSwitched: '‘{n}’ 워크스페이스로 바꿨어요', toAdmin: '관리자 콘솔',
    viewerPill: '보기 전용', viewerTip: '보기 전용 권한이에요. 바꾸는 작업은 대표에게 편집 권한을 받아야 해요.',
    noWsH: '아직 들어간 워크스페이스가 없어요', noWsP: '대표에게 받은 초대 링크를 열면 바로 들어갈 수 있어요. 처음이라면 소개 페이지에서 사용 신청을 남겨 주세요.', toLanding: '사용 신청하러 가기',
    err_VIEWER: '보기 전용 권한이라 바꿀 수 없어요. 대표에게 편집 권한을 받아 주세요.', err_OWNER_ONLY: '대표만 할 수 있어요.', err_NO_WORKSPACE: '들어간 워크스페이스가 없어요.',
    err_PLAN_LIMIT: '요금제 한도를 다 썼어요. 설정 › 팀 · 요금제에서 늘릴 수 있어요.', err_PLAN_SEARCH: '오늘 요금제 검색 횟수를 다 썼어요. 내일 다시 채워져요.',
    err_PLAN_AI: '오늘 AI 질문 횟수를 다 썼어요. 내일 다시 채워져요.', err_SEAT_FULL: '팀 자리가 다 찼어요. 요금제를 올리면 더 초대할 수 있어요.',
    err_TOO_MANY: '안 쓴 초대 링크가 너무 많아요. 몇 개 취소한 뒤에 만들어 주세요.', err_LAST_OWNER: '대표가 한 명은 있어야 해요. 다른 팀원을 대표로 바꾼 뒤에 해 주세요.',
    err_OWNER_RESET: '대표 계정의 비밀번호 링크는 서비스 관리자만 만들 수 있어요.', err_OTHER_WS: '다른 워크스페이스에도 있는 계정이라 서비스 관리자만 비밀번호 링크를 만들 수 있어요.',
    err_SELF: '내 비밀번호는 설정 › 상태의 ‘비밀번호 바꾸기’에서 바꿔 주세요.', run_ask: 'AI 질문', err_BAD_PLAN: '요금제를 골라 주세요.', err_SAME_PLAN: '지금 쓰는 요금제예요.', err_BAD_ROLE: '역할을 골라 주세요.',
    err_NO_AI: 'AI 연결 전이에요.', err_AI_BUSY: 'AI가 잠시 바빠요. 조금 뒤에 다시 물어봐 주세요.', err_AI_KEY: 'AI 키를 확인해야 해요 (관리자).', err_AI_FAIL: 'AI 답을 받지 못했어요.',
    err_AI_TIMEOUT: 'AI 답이 늦어지고 있어요. 다시 물어봐 주세요.', err_IDEA_FULL: '소재 보드가 가득 찼어요 (1,000개).', err_JOIN_FAIL: '들어가지 못했어요. 링크를 다시 받아 주세요.',
    chatFab: 'RADAR에게 묻기', chatTitle: 'RADAR에게 묻기', chatModeAi: 'AI가 이 워크스페이스 데이터로 답해요', chatModeData: '지켜보는 데이터로 바로 답해요',
    chatPh: '예: 지금 뜨는 영상 알려줘 · 내 채널 어때?', chatSend: '보내기', chatClose: '닫기', chatClear: '대화 지우기',
    chatHi: '안녕하세요! 지켜보는 채널 데이터로 바로 답해 드려요. 채널 링크를 넣으면 레퍼런스로 넣을 수도 있어요.',
    chatThinking: '살펴보는 중이에요…', chatNote: '답은 공개 데이터와 RADAR 추정치(평소의 몇 배 · 속도)를 바탕으로 해요.', chatUsed: '오늘 AI 질문 {a}/{b}',
    chatUnknown: '이 질문은 아직 데이터로 바로 답하기 어려워요. 이렇게 물어봐 주세요.', chatAskAi: 'AI에게 더 자세히 묻기', chatNoAi: 'AI 키를 넣으면 무엇이든 자유롭게 답해요 (관리자 설정).',
    chatGo: '열기', chatAddBtn: '레퍼런스로 넣기', chatYt: '유튜브에서 보기',
    ex1: '지금 뜨는 영상 알려줘', ex2: '지난 48시간 조회수는?', ex3: '내 채널 어때?', ex4: '이번 주 제일 잘 된 영상', ex5: '오늘 뭐 찍을까?', ex6: '요금제 한도 알려줘',
    aRising: '지금 같은 나이 영상보다 빨리 크고 있는 영상이에요.', aRisingNone: '지금은 평소보다 확 튀는 영상이 없어요. 매시간 다시 살펴볼게요.',
    aItemPace: '평소의 {x}배 · {v}회', aV48: '지난 48시간 지켜보는 채널 {n}곳 조회수는 {v}회예요.', aV48Cmp: '직전 48시간보다 {p}% {dir}.', more: '늘었어요', less: '줄었어요',
    aMineNone: '아직 내 채널이 없어요. 채널 › 레퍼런스에서 내 채널을 먼저 넣어 주세요.', aMine: '{c} · 48시간 {v}회 · 최근 7일 업로드 {n}개 · 평소 {m}회',
    aTop: '최근 7일 지켜보는 채널에서 평소보다 크게 터진 영상이에요.', aTopNone: '최근 7일에 평소보다 크게 터진 영상이 아직 없어요.', aItemX: '평소의 {x}배 · {v}회',
    aPicks: '레퍼런스에서 최근 3일 크게 터진 소재예요. 구조는 그대로, 소재만 내 것으로 바꿔 보세요.', aPicksNone: '최근 3일엔 크게 터진 레퍼런스 영상이 없어요. 소재 추천 화면에서 더 넓게 볼 수 있어요.',
    aPlan: '{p} 요금제예요 · 내 채널 {a}/{b} · 레퍼런스 {c}/{d} · 팀 {e}/{f}명 · 오늘 검색 {g}/{h}', aTeam: '팀원 {n}명이에요 · {list}',
    aBoard: '소재 보드 · 아이디어 {a} · 대본 {b} · 제작 {c} · 업로드 {d}', aBoardNone: '소재 보드가 비어 있어요. 소재 추천에서 마음에 드는 걸 담아 보세요.',
    aQuota: '오늘 서비스 전체 유튜브 포인트 {u}/{b} · 검색 {s}/{sb}회를 썼어요.', aCh: '{c} · 구독자 {s} · 48시간 {v}회 · 최근 7일 업로드 {n}개',
    aHelp: '이런 걸 바로 답해요.', aGo: '이 화면에서 할 수 있어요.', aAddQ: '이 채널을 레퍼런스로 넣을까요? 넣으면 바로 영상과 조회수를 모아요.'
  },
  en: {
    team: 'Team & plan', tab_team: 'Team & plan', teamSub: 'Manage who works with you, their roles and your plan limits in one place.',
    wsCard: 'Our workspace', wsName: 'Workspace name', wsSave: 'Save', wsSaved: 'Name updated', myRole: 'My role', wsMade: 'Created', wsPlan: 'Plan',
    role_owner: 'Owner', role_editor: 'Editor', role_viewer: 'Viewer', roleAdmin: 'Service admin',
    roleHelp_owner: 'Manages invites, roles and the plan', roleHelp_editor: 'Can change channels, the idea board and searches', roleHelp_viewer: 'View only · can still ask RADAR',
    plan_free: 'Free', plan_solo: 'Solo', plan_plus: 'Plus', plan_team: 'Team', plan_agency: 'Agency', plan_enterprise: 'Enterprise',
    priceFree: 'Free', priceCustom: 'Custom', perMonth: '/mo',
    useCard: 'Plan & usage', uMine: 'My channels', uRefs: 'Reference channels', uSeats: 'Team seats', uSearch: 'YouTube searches today', uAi: 'AI questions today',
    uReset: 'Search and AI counts refill every day around midnight Pacific time.', uFull: 'Almost at the limit',
    plansCard: 'Limits by plan', plansSub: 'Your current plan is highlighted. Payments aren’t connected yet, so send a request and the admin switches it for you.',
    pRow_price: 'Monthly price', pRow_mine: 'My channels', pRow_refs: 'Reference channels', pRow_seats: 'Team seats', pRow_searches: 'YouTube searches / day', pRow_ai: 'AI questions / day', now: 'Current',
    reqTitle: 'Request a plan change', reqPlan: 'New plan', reqNote: 'Note (optional) · e.g. two more teammates are joining', reqBtn: 'Send request', reqSent: 'Request sent. The admin will review and switch your plan.',
    reqPending: 'Under review · {p} · requested {d}', reqDone: 'Switched to {p} · {d}', reqDeclined: 'Request for {p} was put on hold · {d}', reqOwner: 'Only the owner can request a plan change.',
    membersCard: 'Members', mSeats: '{a}/{b} seats', mSince: 'since {d}', you: 'You', mRoleAria: 'Role for {n}', roleSaved: 'Role updated',
    mRemove: 'Remove', mRemoveQ: 'Remove {n} from this workspace? Their account stays; they just lose access to this workspace.', mRemoved: 'Removed',
    mReset: 'Password link', mResetMade: 'Password reset link for {n}. It works once within one day.',
    inviteCard: 'Invite teammates', inviteSub: 'Create a link and send it by chat or email. The person picks their own ID and password and joins right away.',
    iRole: 'Role', iNote: 'Note · who it’s for (optional)', iNotePh: 'e.g. Editor Minsu', iBtn: 'Create invite link', iMade: 'Invite link created. It works once within 7 days.',
    iOpen: 'Unused links', iNone: 'No links yet', iExp: 'until {d}', iRevoke: 'Cancel', iRevoked: 'Link cancelled', iKindReset: 'Password reset',
    copy: 'Copy', copied: 'Copied', copyFail: 'Couldn’t copy. Press and hold the link to copy it.',
    seatFullH: 'All seats are taken ({a}/{b})', seatFullP: 'The {p} plan includes {b} seat(s). Team plans and up can invite more people.', seatGo: 'See plans',
    ownerOnlyNote: 'Only the owner can invite people and change roles.',
    leaveTitle: 'Leave workspace', leaveBtn: 'Leave this workspace', leaveQ: 'You’ll lose access to this workspace’s data. Leave?', left: 'You left the workspace',
    wsLabel: 'Workspace', wsSwitchAria: 'Switch workspace', wsSwitched: 'Switched to {n}', toAdmin: 'Admin console',
    viewerPill: 'View only', viewerTip: 'You have view-only access. Ask the owner for editor access to make changes.',
    noWsH: 'You’re not in a workspace yet', noWsP: 'Open the invite link from your workspace owner to join. New here? Leave a request on the main page.', toLanding: 'Request access',
    err_VIEWER: 'You have view-only access. Ask the owner for editor access.', err_OWNER_ONLY: 'Only the owner can do this.', err_NO_WORKSPACE: 'You’re not in a workspace.',
    err_PLAN_LIMIT: 'You’ve reached your plan limit. Raise it in Settings › Team & plan.', err_PLAN_SEARCH: 'Today’s searches for your plan are used up. They refill tomorrow.',
    err_PLAN_AI: 'Today’s AI questions are used up. They refill tomorrow.', err_SEAT_FULL: 'All seats are taken. Upgrade to invite more people.',
    err_TOO_MANY: 'Too many unused invite links. Cancel a few first.', err_LAST_OWNER: 'A workspace needs at least one owner. Make someone else owner first.',
    err_OWNER_RESET: 'Only the service admin can create password links for owners.', err_OTHER_WS: 'This account is in another workspace too, so only the service admin can create its password link.',
    err_SELF: 'Change your own password under Settings › Status › Password.', run_ask: 'AI question', err_BAD_PLAN: 'Pick a plan.', err_SAME_PLAN: 'That’s your current plan.', err_BAD_ROLE: 'Pick a role.',
    err_NO_AI: 'AI isn’t connected yet.', err_AI_BUSY: 'The AI is busy. Please ask again in a moment.', err_AI_KEY: 'The AI key needs checking (admin).', err_AI_FAIL: 'Couldn’t get an AI answer.',
    err_AI_TIMEOUT: 'The AI is taking too long. Please ask again.', err_IDEA_FULL: 'The idea board is full (1,000 items).', err_JOIN_FAIL: 'Couldn’t join. Please get a new link.',
    chatFab: 'Ask RADAR', chatTitle: 'Ask RADAR', chatModeAi: 'AI answers from this workspace’s data', chatModeData: 'Answers straight from your tracked data',
    chatPh: 'e.g. What’s rising right now? · How is my channel doing?', chatSend: 'Send', chatClose: 'Close', chatClear: 'Clear chat',
    chatHi: 'Hi! I answer straight from the channels you track. Paste a channel link and I can add it as a reference too.',
    chatThinking: 'Looking into it…', chatNote: 'Answers use public data and RADAR estimates (× usual, pace).', chatUsed: 'AI questions today {a}/{b}',
    chatUnknown: 'I can’t answer that from your data yet. Try asking like this.', chatAskAi: 'Ask the AI for more detail', chatNoAi: 'Add an AI key and I can answer anything (admin setting).',
    chatGo: 'Open', chatAddBtn: 'Add as reference', chatYt: 'Watch on YouTube',
    ex1: 'What’s rising right now?', ex2: 'Views in the last 48 hours?', ex3: 'How is my channel doing?', ex4: 'Best videos this week', ex5: 'What should I make today?', ex6: 'Show my plan limits',
    aRising: 'These are growing faster than usual for their age.', aRisingNone: 'Nothing is spiking above normal right now. I’ll keep checking every hour.',
    aItemPace: '{x}× usual · {v} views', aV48: 'Your {n} tracked channels got {v} views in the last 48 hours.', aV48Cmp: '{p}% {dir} than the 48 hours before.', more: 'more', less: 'fewer',
    aMineNone: 'You haven’t added your own channel yet. Add it under Channels › References first.', aMine: '{c} · {v} views in 48h · {n} uploads in 7 days · usually {m}',
    aTop: 'These broke out far above usual on your tracked channels in the last 7 days.', aTopNone: 'Nothing broke out far above usual in the last 7 days yet.', aItemX: '{x}× usual · {v} views',
    aPicks: 'Topics that broke out on your references in the last 3 days. Keep the structure, swap in your own topic.', aPicksNone: 'No reference videos broke out in the last 3 days. The Ideas screen shows a wider view.',
    aPlan: '{p} plan · my channels {a}/{b} · references {c}/{d} · team {e}/{f} · searches today {g}/{h}', aTeam: '{n} members · {list}',
    aBoard: 'Idea board · ideas {a} · script {b} · production {c} · uploaded {d}', aBoardNone: 'The idea board is empty. Save ideas you like from the Ideas screen.',
    aQuota: 'Service-wide today: {u}/{b} YouTube points and {s}/{sb} searches used.', aCh: '{c} · {s} subscribers · {v} views in 48h · {n} uploads in 7 days',
    aHelp: 'Here’s what I can answer right away.', aGo: 'You can do this on this screen.', aAddQ: 'Add this channel as a reference? I’ll start collecting its videos and views right away.'
  },
  ja: {
    team: 'チーム・プラン', tab_team: 'チーム・プラン', teamSub: '一緒に使う人、役割、プランの上限をまとめて管理します。',
    wsCard: 'ワークスペース', wsName: 'ワークスペース名', wsSave: '保存', wsSaved: '名前を変更しました', myRole: '自分の役割', wsMade: '作成日', wsPlan: 'プラン',
    role_owner: 'オーナー', role_editor: '編集', role_viewer: '閲覧のみ', roleAdmin: 'サービス管理者',
    roleHelp_owner: '招待・役割・プランまですべて管理します', roleHelp_editor: 'チャンネル・ネタボード・検索を変更できます', roleHelp_viewer: '閲覧のみ・RADARへの質問はできます',
    plan_free: '無料', plan_solo: 'ソロ', plan_plus: 'プラス', plan_team: 'チーム', plan_agency: 'エージェンシー', plan_enterprise: 'エンタープライズ',
    priceFree: '無料', priceCustom: '個別相談', perMonth: '/月',
    useCard: 'プラン・使用量', uMine: '自分のチャンネル', uRefs: 'リファレンス', uSeats: 'チームの席', uSearch: '今日のYouTube検索', uAi: '今日のAI質問',
    uReset: '検索・AI質問の回数は毎日（日本時間 16〜17時ごろ）補充されます。', uFull: '上限に近づいています',
    plansCard: 'プラン別の上限', plansSub: '今のプランを強調しています。決済連携の前なので、申請すると管理者が確認してすぐ切り替えます。',
    pRow_price: '月額', pRow_mine: '自分のチャンネル', pRow_refs: 'リファレンス', pRow_seats: 'チームの席', pRow_searches: '1日のYouTube検索', pRow_ai: '1日のAI質問', now: '現在',
    reqTitle: 'プラン変更の申請', reqPlan: '変更先のプラン', reqNote: 'メモ（任意）・例：メンバーが2人増えます', reqBtn: '申請する', reqSent: '申請しました。管理者が確認して切り替えます。',
    reqPending: '確認中・{p}・{d}申請', reqDone: '{p}プランに変わりました・{d}', reqDeclined: '{p}の申請は保留になりました・{d}', reqOwner: 'プランの申請はオーナーのみできます。',
    membersCard: 'メンバー', mSeats: '{a}/{b}人', mSince: '{d}から', you: '自分', mRoleAria: '{n}さんの役割', roleSaved: '役割を変更しました',
    mRemove: '外す', mRemoveQ: '{n}さんをこのワークスペースから外しますか？アカウントは残り、このワークスペースのデータだけ見られなくなります。', mRemoved: '外しました',
    mReset: 'パスワードリンク', mResetMade: '{n}さんのパスワード再設定リンクです。1日以内に1回だけ使えます。',
    inviteCard: 'メンバーを招待', inviteSub: 'リンクを作ってチャットやメールで送ってください。受け取った人がIDとパスワードを決めてすぐ参加できます。',
    iRole: '役割', iNote: 'メモ・誰に送るか（任意）', iNotePh: '例：編集担当のミンス', iBtn: '招待リンクを作成', iMade: '招待リンクを作成しました。7日以内に1回だけ使えます。',
    iOpen: '未使用のリンク', iNone: 'まだリンクはありません', iExp: '{d}まで', iRevoke: '取り消す', iRevoked: 'リンクを取り消しました', iKindReset: 'パスワード再設定',
    copy: 'コピー', copied: 'コピーしました', copyFail: 'コピーできませんでした。リンクを長押ししてコピーしてください。',
    seatFullH: '席が埋まっています（{a}/{b}人）', seatFullP: '{p}プランは{b}人までです。チームプラン以上でさらに招待できます。', seatGo: 'プランを見る',
    ownerOnlyNote: 'メンバーの招待と役割の変更はオーナーのみできます。',
    leaveTitle: 'ワークスペースを抜ける', leaveBtn: 'このワークスペースを抜ける', leaveQ: '抜けるとこのワークスペースのデータは見られなくなります。抜けますか？', left: '抜けました',
    wsLabel: 'ワークスペース', wsSwitchAria: 'ワークスペースを切り替え', wsSwitched: '{n}に切り替えました', toAdmin: '管理コンソール',
    viewerPill: '閲覧のみ', viewerTip: '閲覧のみの権限です。変更するにはオーナーに編集権限をもらってください。',
    noWsH: 'まだ参加しているワークスペースがありません', noWsP: 'オーナーから届いた招待リンクを開くとすぐ参加できます。初めての方は紹介ページから利用申請してください。', toLanding: '利用申請へ',
    err_VIEWER: '閲覧のみの権限なので変更できません。オーナーに編集権限をもらってください。', err_OWNER_ONLY: 'オーナーのみできます。', err_NO_WORKSPACE: '参加しているワークスペースがありません。',
    err_PLAN_LIMIT: 'プランの上限に達しました。設定 › チーム・プランで増やせます。', err_PLAN_SEARCH: '今日のプランの検索回数を使い切りました。明日また補充されます。',
    err_PLAN_AI: '今日のAI質問回数を使い切りました。明日また補充されます。', err_SEAT_FULL: '席が埋まっています。プランを上げるとさらに招待できます。',
    err_TOO_MANY: '未使用の招待リンクが多すぎます。いくつか取り消してください。', err_LAST_OWNER: 'オーナーが1人は必要です。他のメンバーをオーナーにしてから行ってください。',
    err_OWNER_RESET: 'オーナーのパスワードリンクはサービス管理者のみ作成できます。', err_OTHER_WS: '他のワークスペースにもいるアカウントなので、サービス管理者のみパスワードリンクを作成できます。',
    err_SELF: '自分のパスワードは 設定 › 状態 の「パスワード変更」で変えてください。', run_ask: 'AI質問', err_BAD_PLAN: 'プランを選んでください。', err_SAME_PLAN: '今のプランです。', err_BAD_ROLE: '役割を選んでください。',
    err_NO_AI: 'AIはまだ接続されていません。', err_AI_BUSY: 'AIが混み合っています。少し後にもう一度聞いてください。', err_AI_KEY: 'AIキーの確認が必要です（管理者）。', err_AI_FAIL: 'AIの回答を受け取れませんでした。',
    err_AI_TIMEOUT: 'AIの回答が遅れています。もう一度聞いてください。', err_IDEA_FULL: 'ネタボードがいっぱいです（1,000件）。', err_JOIN_FAIL: '参加できませんでした。新しいリンクをもらってください。',
    chatFab: 'RADARに聞く', chatTitle: 'RADARに聞く', chatModeAi: 'AIがこのワークスペースのデータで答えます', chatModeData: '追跡中のデータですぐ答えます',
    chatPh: '例：今伸びている動画は？・自分のチャンネルはどう？', chatSend: '送信', chatClose: '閉じる', chatClear: '会話を消す',
    chatHi: 'こんにちは！追跡中のチャンネルのデータですぐ答えます。チャンネルのリンクを入れるとリファレンスに追加もできます。',
    chatThinking: '確認しています…', chatNote: '回答は公開データとRADARの推定値（いつもの何倍・速度）にもとづきます。', chatUsed: '今日のAI質問 {a}/{b}',
    chatUnknown: 'その質問にはまだデータですぐ答えられません。こんなふうに聞いてみてください。', chatAskAi: 'AIにもっと詳しく聞く', chatNoAi: 'AIキーを入れると何でも自由に答えます（管理者設定）。',
    chatGo: '開く', chatAddBtn: 'リファレンスに追加', chatYt: 'YouTubeで見る',
    ex1: '今伸びている動画は？', ex2: '直近48時間の再生数は？', ex3: '自分のチャンネルはどう？', ex4: '今週いちばん伸びた動画', ex5: '今日は何を撮ろう？', ex6: 'プランの上限を教えて',
    aRising: '同じ経過時間の動画より速く伸びている動画です。', aRisingNone: '今はいつもより大きく伸びている動画はありません。毎時また確認します。',
    aItemPace: 'いつもの{x}倍・{v}回', aV48: '追跡中の{n}チャンネルの直近48時間の再生数は{v}回です。', aV48Cmp: 'その前の48時間より{p}%{dir}。', more: '増えました', less: '減りました',
    aMineNone: 'まだ自分のチャンネルがありません。チャンネル › リファレンスで先に追加してください。', aMine: '{c}・48時間 {v}回・直近7日の投稿 {n}本・いつもは{m}回',
    aTop: '直近7日、追跡中のチャンネルでいつもより大きく伸びた動画です。', aTopNone: '直近7日はまだ大きく伸びた動画がありません。', aItemX: 'いつもの{x}倍・{v}回',
    aPicks: '直近3日でリファレンスが大きく伸びたネタです。構成はそのまま、ネタだけ自分のものに変えてみましょう。', aPicksNone: '直近3日は大きく伸びたリファレンス動画がありません。ネタのおすすめ画面で広く見られます。',
    aPlan: '{p}プラン・自分のチャンネル {a}/{b}・リファレンス {c}/{d}・チーム {e}/{f}人・今日の検索 {g}/{h}', aTeam: 'メンバー{n}人・{list}',
    aBoard: 'ネタボード・アイデア {a}・台本 {b}・制作 {c}・投稿 {d}', aBoardNone: 'ネタボードは空です。ネタのおすすめから気になるものを入れてみましょう。',
    aQuota: '今日のサービス全体：YouTubeポイント {u}/{b}・検索 {s}/{sb}回を使いました。', aCh: '{c}・登録者 {s}・48時間 {v}回・直近7日の投稿 {n}本',
    aHelp: 'こんなことにすぐ答えます。', aGo: 'この画面でできます。', aAddQ: 'このチャンネルをリファレンスに追加しますか？追加するとすぐ動画と再生数を集めます。'
  }
};

// ---------- 사이드바 계정 칸 · 워크스페이스 바꾸기 ----------
const EYE = '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
export function acctHtml() {
  const S = C.S;
  if (!S.user) return '';
  if (S.user.guest) { // 둘러보기(로그인 없이): 워크스페이스 이름 + 로그인 버튼
    const w = S.ws || {};
    return `<div class="tm-wsw"><span>${e(t('wsLabel'))}</span><b title="${e(w.name || '')}">${e(w.name || '')}</b><small>${e(planName(w.plan || 'free'))}</small></div>`
      + `<span class="who"><span class="dk-av sq me" aria-hidden="true">${svg(EYE, 16)}</span><span class="txt"><b>${e(t('guestName'))}</b><small>${e(t('guestPill'))}</small></span></span>`
      + `<a class="dk-out" href="/login?next=%2Fapp">${svg('<path d="M10 17l5-5-5-5M15 12H3M14 3h6v18h-6"/>', 16)}<span>${e(t('guestLogin'))}</span></a>`;
  }
  const ws = S.ws;
  const list = (S.me && S.me.workspaces) || [];
  const wsCtl = !ws ? '' : list.length > 1
    ? `<label class="tm-wsw"><span>${e(t('wsLabel'))}</span><select id="wsSel" class="tm-wssel" aria-label="${e(t('wsSwitchAria'))}">${list.map((w) => `<option value="${e(w.id)}" ${w.id === ws.id ? 'selected' : ''}>${e(w.name)} · ${e(planName(w.plan))}</option>`).join('')}</select></label>`
    : `<div class="tm-wsw"><span>${e(t('wsLabel'))}</span><b title="${e(ws.name)}">${e(ws.name)}</b><small>${e(planName(ws.plan))}</small></div>`;
  const nm = S.user.name || S.user.id;
  const role = S.user.admin ? t('roleAdmin') : ws ? roleName(ws.role) : '';
  return `${wsCtl}<span class="who"><span class="dk-av sq me" aria-hidden="true">${e(String(nm || '?').slice(0, 1).toUpperCase())}</span><span class="txt"><b>${e(nm)}</b><small>${e(S.user.id)}${role ? ' · ' + e(role) : ''}</small></span></span>`
    + (S.user.admin ? `<a class="dk-out" href="/admin">${svg(IC.admin, 16)}<span>${e(t('toAdmin'))}</span></a>` : '')
    + `<button type="button" class="dk-out" data-logout>${svg('<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>', 16)}<span>${e(t('logout'))}</span></button>`;
}
export function bindAcct() {
  document.addEventListener('change', async (ev) => {
    const sel = ev.target.closest && ev.target.closest('#wsSel');
    if (!sel) return;
    const id = sel.value;
    const w = ((C.S.me && C.S.me.workspaces) || []).find((x) => x.id === id);
    if (!w || (C.S.ws && C.S.ws.id === id)) return;
    sel.disabled = true;
    try {
      const ok = await C.rpc('radar_use_ws', { p_ws: id });
      if (!ok) throw new Error('NO_WORKSPACE');
      store.set('radar.wsSwitched', w.name);
      history.replaceState(null, '', location.pathname + '#home'); // 화면을 그리지 않고 주소만 바꿔요
      location.reload(); // 워크스페이스마다 데이터가 달라서 깨끗하게 새로 불러와요
    } catch (er) {
      sel.disabled = false;
      sel.value = C.S.ws.id;
      C.snack(C.errText(er.message || 'NO_WORKSPACE'));
    }
  });
  const sw = store.get('radar.wsSwitched');
  if (sw) { store.set('radar.wsSwitched', ''); setTimeout(() => C.snack(t('wsSwitched', { n: sw })), 400); }
}
export function topPill() {
  if (C.S.user?.guest) return `<span class="tm-pill guest" title="${e(t('guestTip'))}">${svg(EYE, 15)}${e(t('guestPill'))}</span>`;
  const ws = C.S.ws;
  if (!ws || ws.role !== 'viewer' || C.S.user?.admin) return '';
  return `<span class="tm-pill" title="${e(t('viewerTip'))}">${svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 15)}${e(t('viewerPill'))}</span>`;
}

// ---------- 팀 · 요금제 화면 ----------
function meter(label, a, b) {
  const pct = b ? Math.min(100, Math.round((a / b) * 100)) : 0;
  const hot = b && a / b >= 0.9;
  return `<div class="dk-meter tm-m"><div class="lb"><span>${e(label)}</span><span><b>${C.fmtFull(a)}</b> <small>/ ${C.fmtFull(b)}</small></span></div><div class="bar" role="progressbar" aria-label="${e(label)}" aria-valuemin="0" aria-valuemax="${b}" aria-valuenow="${a}"><i class="${hot ? 'hot' : ''}" style="width:${Math.max(pct, a ? 2 : 0)}%"></i></div>${hot ? `<small class="tm-warn">${e(t('uFull'))}</small>` : ''}</div>`;
}
function linkBox(url, id) {
  return `<div class="tm-link" id="${id}"><input class="dk-input" readonly value="${e(url)}" aria-label="URL"><button type="button" class="dk-btn" data-copy="${e(url)}">${svg(IC.copy, 16)}<span>${e(t('copy'))}</span></button></div>`;
}
async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); C.snack(t('copied')); return true; } catch (er) { /* 아래로 */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    C.snack(t(ok ? 'copied' : 'copyFail'));
    return ok;
  } catch (er) { C.snack(t('copyFail')); return false; }
}

export async function vTeam(v, r, alive) {
  C.loading(v, t('team'), e(t('teamSub')));
  const tm = await C.rpc('radar_team');
  if (!alive()) return;
  if (!tm) { v.innerHTML = C.head(t('team'), e(t('teamSub'))) + `<div class="dk-card"><div class="dk-empty">${e(t('noWsH'))}</div></div>`; return; }
  const S = C.S;
  const ws = tm.workspace;
  const lim = ws.limits || LIMITS[ws.plan] || LIMITS.free;
  const owner = tm.role === 'owner';
  const members = tm.members || [];
  const owners = members.filter((m) => m.role === 'owner').length;
  const seats = Number(tm.seats) || members.length;
  const seatFull = seats >= (lim.seats || 1);
  const today = tm.today || { searches: 0, asks: 0 };
  const req = (tm.requests || [])[0];
  const reqLine = req ? t(req.status === 'pending' ? 'reqPending' : req.status === 'done' ? 'reqDone' : 'reqDeclined', { p: planName(req.plan), d: fmtDay(req.created_at) }) : '';
  const me = members.find((m) => m.me);
  const canLeave = me && !(me.role === 'owner' && owners <= 1);
  const invites = tm.invites || [];
  const otherPlans = PLANS.filter((p) => p !== ws.plan);

  const wsCard = `<section class="dk-card f1 dk-fade tm-ws">
    <h2>${e(t('wsCard'))}</h2>
    ${owner ? `<form class="tm-rename" id="wsRename" novalidate><label class="sr" for="wsNameIn">${e(t('wsName'))}</label><input class="dk-input" id="wsNameIn" maxlength="60" value="${e(ws.name)}" autocomplete="off"><button class="dk-btn sm" type="submit">${e(t('wsSave'))}</button></form>` : `<b class="tm-wsname">${e(ws.name)}</b>`}
    <dl class="tm-dl">
      <dt>${e(t('wsPlan'))}</dt><dd><span class="dk-tag">${e(planName(ws.plan))}</span></dd>
      <dt>${e(t('myRole'))}</dt><dd><b>${e(roleName(tm.role))}</b>${S.user.admin ? ` <span class="dk-tag gray">${e(t('roleAdmin'))}</span>` : ''}<small>${e(t('roleHelp_' + tm.role))}</small></dd>
      <dt>${e(t('wsMade'))}</dt><dd>${e(fmtDate(ws.created_at))}</dd>
    </dl>
    ${canLeave && !owner ? `<button type="button" class="dk-btn sm line tm-leave" id="leaveWs">${e(t('leaveBtn'))}</button>` : ''}
  </section>`;

  const useCard = `<section class="dk-card f2 dk-fade tm-use" id="useCard">
    <h2>${e(t('useCard'))} <span class="dk-tag">${e(planName(ws.plan))}</span></h2>
    <div class="tm-meters">
      ${meter(t('uMine'), Number(tm.usage?.mine) || 0, lim.mine)}
      ${meter(t('uRefs'), Number(tm.usage?.refs) || 0, lim.refs)}
      ${meter(t('uSeats'), seats, lim.seats)}
      ${meter(t('uSearch'), Number(today.searches) || 0, lim.searches)}
      ${meter(t('uAi'), Number(today.asks) || 0, lim.ai)}
    </div>
    <p class="dk-sub" style="margin:0">${e(t('uReset'))}</p>
  </section>`;

  const memRow = (m) => {
    const nm = m.name || m.login || '–';
    const lastOwner = m.role === 'owner' && owners <= 1;
    const roleCell = owner && !lastOwner
      ? `<select class="dk-select sm tm-role" data-role-of="${e(m.user_id)}" aria-label="${e(t('mRoleAria', { n: nm }))}">${ROLES.map((x) => `<option value="${x}" ${x === m.role ? 'selected' : ''}>${e(roleName(x))}</option>`).join('')}</select>`
      : `<span class="dk-tag ${m.role === 'viewer' ? 'gray' : m.role === 'owner' ? '' : 'teal'}">${e(roleName(m.role))}</span>`;
    const acts = owner && !m.me
      ? `<span class="tm-acts">${m.role !== 'owner' || S.user.admin ? `<button type="button" class="dk-btn sm line" data-reset="${e(m.user_id)}" data-name="${e(nm)}">${svg(IC.key, 15)}<span>${e(t('mReset'))}</span></button>` : ''}${!lastOwner ? `<button type="button" class="dk-btn sm danger" data-rm="${e(m.user_id)}" data-name="${e(nm)}">${e(t('mRemove'))}</button>` : ''}</span>`
      : '';
    return `<tr><td><span class="tm-who"><span class="dk-av sq" aria-hidden="true">${e(String(nm).slice(0, 1).toUpperCase())}</span><span><b>${e(nm)}</b>${m.me ? ` <span class="dk-tag gray">${e(t('you'))}</span>` : ''}<small>${e(m.login || '')}</small></span></span></td><td>${roleCell}</td><td class="tm-since">${e(t('mSince', { d: fmtDay(m.since) }))}</td>${owner ? `<td class="r">${acts}</td>` : ''}</tr>`;
  };
  const memCard = `<section class="dk-card full dk-fade">
    <div class="tm-h"><h2>${svg(IC.users, 19)} ${e(t('membersCard'))}</h2><span class="dk-tag ${seatFull ? 'amber' : 'gray'}">${e(t('mSeats', { a: seats, b: lim.seats }))}</span></div>
    <div class="dk-tablewrap"><table class="dk-t tm-mt"><tbody>${members.map(memRow).join('')}</tbody></table></div>
    <div id="resetBox"></div>
    ${!owner ? `<p class="dk-sub" style="margin:0">${e(t('ownerOnlyNote'))}</p>` : ''}
  </section>`;

  const invRow = (i) => `<li><span class="tm-ik">${i.kind === 'reset' ? `<span class="dk-tag amber">${e(t('iKindReset'))}</span>${i.target_name ? ' ' + e(i.target_name) : ''}` : `<span class="dk-tag ${i.role === 'viewer' ? 'gray' : ''}">${e(roleName(i.role))}</span>${i.note ? ` <span class="tm-note">${e(i.note)}</span>` : ''}`}</span><span class="tm-exp">${e(t('iExp', { d: fmtDay(i.expires_at) }))}</span><span class="tm-acts"><button type="button" class="dk-btn sm line" data-copy="${e(joinUrl(i.code))}">${svg(IC.copy, 15)}<span>${e(t('copy'))}</span></button><button type="button" class="dk-btn sm line" data-revoke="${e(i.code)}">${e(t('iRevoke'))}</button></span></li>`;
  const invCard = owner ? `<section class="dk-card full dk-fade" id="inviteCard">
    <div class="tm-h"><h2>${svg(IC.link, 19)} ${e(t('inviteCard'))}</h2></div>
    <p class="dk-sub" style="margin:0">${e(t('inviteSub'))}</p>
    ${seatFull ? `<div class="tm-full"><b>${e(t('seatFullH', { a: seats, b: lim.seats }))}</b><span>${e(t('seatFullP', { p: planName(ws.plan), b: lim.seats }))}</span><a class="dk-btn sm line" href="#team" data-jump="plansCard">${e(t('seatGo'))}</a></div>` : `
    <form class="tm-inv" id="invForm" novalidate>
      <div class="dk-field"><label for="invRole">${e(t('iRole'))}</label><select class="dk-select" id="invRole">${['editor', 'viewer', 'owner'].map((x) => `<option value="${x}">${e(roleName(x))}</option>`).join('')}</select></div>
      <div class="dk-field grow"><label for="invNote">${e(t('iNote'))}</label><input class="dk-input" id="invNote" maxlength="200" placeholder="${e(t('iNotePh'))}" autocomplete="off"></div>
      <button class="dk-btn" type="submit" id="invBtn">${svg(IC.link, 16)}<span>${e(t('iBtn'))}</span></button>
    </form>`}
    <div id="invOut"></div>
    <h3 class="tm-h3">${e(t('iOpen'))}</h3>
    ${invites.length ? `<ul class="tm-invs">${invites.map(invRow).join('')}</ul>` : `<div class="dk-empty" style="padding:16px">${e(t('iNone'))}</div>`}
  </section>` : '';

  const rows = ['price', 'mine', 'refs', 'seats', 'searches', 'ai'];
  const cell = (p, k) => (k === 'price' ? `${e(money(p))}${PRICE[p] && PRICE[p][0] ? `<small>${e(t('perMonth'))}</small>` : ''}` : C.fmtFull(LIMITS[p][k]));
  const plansCard = `<section class="dk-card full dk-fade" id="plansCard">
    <h2>${e(t('plansCard'))}</h2>
    <p class="dk-sub" style="margin:0">${e(t('plansSub'))}</p>
    <div class="dk-tablewrap"><table class="dk-t tm-pt"><thead><tr><th scope="col"></th>${PLANS.map((p) => `<th scope="col" class="r ${p === ws.plan ? 'cur' : ''}">${e(planName(p))}${p === ws.plan ? `<small>${e(t('now'))}</small>` : ''}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((k) => `<tr><th scope="row">${e(t('pRow_' + k))}</th>${PLANS.map((p) => `<td class="r ${p === ws.plan ? 'cur' : ''}">${cell(p, k)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    ${reqLine ? `<p class="tm-req ${req.status}">${e(reqLine)}</p>` : ''}
    ${owner ? `<form class="tm-inv" id="reqForm" novalidate>
      <div class="dk-field"><label for="reqPlan">${e(t('reqPlan'))}</label><select class="dk-select" id="reqPlan">${otherPlans.map((p) => `<option value="${p}" ${p === (PLANS[PLANS.indexOf(ws.plan) + 1] || 'enterprise') ? 'selected' : ''}>${e(planName(p))}</option>`).join('')}</select></div>
      <div class="dk-field grow"><label for="reqNote">${e(t('reqNote'))}</label><input class="dk-input" id="reqNote" maxlength="1000" autocomplete="off"></div>
      <button class="dk-btn" type="submit">${e(t('reqBtn'))}</button>
    </form>` : `<p class="dk-sub" style="margin:0">${e(t('reqOwner'))}</p>`}
  </section>`;


  v.innerHTML = C.head(t('team'), e(t('teamSub'))) + `<div class="dk-row">${wsCard}${useCard}</div>${memCard}${invCard}${plansCard}`;
  bindTeam(v, tm);
}

function bindTeam(v, tm) {
  const busy = (b, on) => { if (b) { b.disabled = on; b.classList.toggle('is-busy', on); } };
  v.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => copyText(b.dataset.copy)));
  v.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); document.getElementById(a.dataset.jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  v.querySelector('#wsRename')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = v.querySelector('#wsNameIn').value.trim();
    if (!name || name === tm.workspace.name) return;
    const b = ev.target.querySelector('button');
    busy(b, true);
    const out = await C.act({ action: 'ws_rename', name });
    busy(b, false);
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    C.snack(t('wsSaved'));
    const w = (C.S.me?.workspaces || []).find((x) => x.id === tm.workspace.id);
    if (w) w.name = out.name || name;
    if (C.S.ws) C.S.ws.name = out.name || name;
    C.render();
  });
  v.querySelector('#leaveWs')?.addEventListener('click', async (ev) => {
    if (!confirm(t('leaveQ'))) return;
    busy(ev.currentTarget, true);
    const out = await C.act({ action: 'leave' });
    if (!out.ok) { busy(ev.currentTarget, false); C.snack(C.errText(out.error)); return; }
    C.snack(t('left'));
    setTimeout(() => { history.replaceState(null, '', location.pathname + '#home'); location.reload(); }, 600);
  });
  v.querySelectorAll('[data-role-of]').forEach((sel) => sel.addEventListener('change', async () => {
    const prev = (tm.members || []).find((m) => m.user_id === sel.dataset.roleOf)?.role;
    sel.disabled = true;
    const out = await C.act({ action: 'member_role', user_id: sel.dataset.roleOf, role: sel.value });
    sel.disabled = false;
    if (!out.ok) { if (prev) sel.value = prev; C.snack(C.errText(out.error)); return; }
    C.snack(t('roleSaved'));
    C.render();
  }));
  v.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm(t('mRemoveQ', { n: b.dataset.name }))) return;
    busy(b, true);
    const out = await C.act({ action: 'member_remove', user_id: b.dataset.rm });
    if (!out.ok) { busy(b, false); C.snack(C.errText(out.error)); return; }
    C.snack(t('mRemoved'));
    C.render();
  }));
  v.querySelectorAll('[data-reset]').forEach((b) => b.addEventListener('click', async () => {
    busy(b, true);
    const out = await C.act({ action: 'member_reset', user_id: b.dataset.reset });
    busy(b, false);
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    const box = v.querySelector('#resetBox');
    box.innerHTML = `<div class="tm-made"><p>${e(t('mResetMade', { n: b.dataset.name }))}</p>${linkBox(joinUrl(out.code), 'resetLink')}</div>`;
    box.querySelector('[data-copy]').addEventListener('click', (ev) => copyText(ev.currentTarget.dataset.copy));
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
  v.querySelector('#invForm')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const b = v.querySelector('#invBtn');
    busy(b, true);
    const out = await C.act({ action: 'invite_create', role: v.querySelector('#invRole').value, note: v.querySelector('#invNote').value.trim() });
    busy(b, false);
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    v.querySelector('#invNote').value = '';
    const box = v.querySelector('#invOut');
    box.innerHTML = `<div class="tm-made"><p>${e(t('iMade'))}</p>${linkBox(joinUrl(out.code), 'newLink')}</div>`;
    box.querySelector('[data-copy]').addEventListener('click', (e2) => copyText(e2.currentTarget.dataset.copy));
    copyText(joinUrl(out.code));
    // 목록도 새로 (만든 링크가 바로 보이게)
    const tm2 = await C.rpc('radar_team').catch(() => null);
    if (tm2 && v.isConnected) {
      const ul = v.querySelector('.tm-invs') || v.querySelector('#inviteCard .dk-empty');
      if (ul) {
        const html = (tm2.invites || []).length ? `<ul class="tm-invs">${tm2.invites.map((i) => `<li><span class="tm-ik">${i.kind === 'reset' ? `<span class="dk-tag amber">${e(t('iKindReset'))}</span>${i.target_name ? ' ' + e(i.target_name) : ''}` : `<span class="dk-tag ${i.role === 'viewer' ? 'gray' : ''}">${e(roleName(i.role))}</span>${i.note ? ` <span class="tm-note">${e(i.note)}</span>` : ''}`}</span><span class="tm-exp">${e(t('iExp', { d: fmtDay(i.expires_at) }))}</span><span class="tm-acts"><button type="button" class="dk-btn sm line" data-copy="${e(joinUrl(i.code))}">${svg(IC.copy, 15)}<span>${e(t('copy'))}</span></button><button type="button" class="dk-btn sm line" data-revoke="${e(i.code)}">${e(t('iRevoke'))}</button></span></li>`).join('')}</ul>` : '';
        if (html) { ul.outerHTML = html; bindInvList(v); }
      }
    }
  });
  bindInvList(v);
  v.querySelector('#reqForm')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const b = ev.target.querySelector('button');
    busy(b, true);
    const out = await C.act({ action: 'plan_request', plan: v.querySelector('#reqPlan').value, note: v.querySelector('#reqNote').value.trim() });
    busy(b, false);
    if (!out.ok) { C.snack(C.errText(out.error)); return; }
    C.snack(t('reqSent'));
    C.render();
  });
}
function bindInvList(v) {
  v.querySelectorAll('.tm-invs [data-copy]').forEach((b) => { if (!b.dataset.bound) { b.dataset.bound = '1'; b.addEventListener('click', () => copyText(b.dataset.copy)); } });
  v.querySelectorAll('[data-revoke]').forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    b.addEventListener('click', async () => {
      b.disabled = true;
      const out = await C.act({ action: 'invite_revoke', code: b.dataset.revoke });
      if (!out.ok) { b.disabled = false; C.snack(C.errText(out.error)); return; }
      C.snack(t('iRevoked'));
      b.closest('li')?.remove();
    });
  });
}

// ---------- RADAR에게 묻기 (AI 대화 창) ----------
const CH = { open: false, log: [], busy: false, ai: null, aiAt: 0, used: null, limit: null };
const EXS = ['ex1', 'ex2', 'ex3', 'ex4', 'ex5', 'ex6'];
function loadLog() { try { const x = JSON.parse(store.get('radar.chat') || '[]'); if (Array.isArray(x)) CH.log = x.slice(-30); } catch (er) { CH.log = []; } }
function saveLog() { store.set('radar.chat', JSON.stringify(CH.log.slice(-30))); }

export function mountChat() {
  if (document.getElementById('rcFab')) return;
  loadLog();
  const fab = document.createElement('button');
  fab.type = 'button'; fab.id = 'rcFab'; fab.className = 'rc-fab';
  fab.setAttribute('aria-controls', 'rcPanel'); fab.setAttribute('aria-expanded', 'false');
  const panel = document.createElement('aside');
  panel.id = 'rcPanel'; panel.className = 'rc-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', 'rcTitle');
  document.body.append(fab, panel);
  fab.addEventListener('click', () => (CH.open ? closeChat() : openChat()));
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && CH.open) closeChat(); });
  paintFab();
}
function paintFab() {
  const fab = document.getElementById('rcFab');
  if (!fab) return;
  fab.innerHTML = `${svg(IC.chat, 20)}<span>${e(t('chatFab'))}</span>`;
  fab.setAttribute('aria-label', t('chatFab')); fab.title = t('chatFab');
}
export function chatLang() { paintFab(); if (CH.open) paintPanel(); }
async function aiState() {
  if (CH.ai != null && Date.now() - CH.aiAt < 5 * 60e3) return CH.ai;
  const st = await C.act({ action: 'status' });
  CH.ai = !!(st.ok && st.ai);
  CH.aiAt = Date.now();
  if (st.ok && st.ws) { CH.used = st.ws.usage?.asks ?? null; CH.limit = st.ws.limits?.ai ?? null; }
  return CH.ai;
}
export async function openChat(prefill) {
  CH.open = true;
  const panel = document.getElementById('rcPanel');
  const fab = document.getElementById('rcFab');
  panel.hidden = false;
  fab.setAttribute('aria-expanded', 'true');
  fab.classList.add('on');
  requestAnimationFrame(() => panel.classList.add('on'));
  paintPanel();
  aiState().then(() => { if (CH.open) paintHead(); }).catch(() => {});
  const inp = panel.querySelector('#rcIn');
  if (prefill) { inp.value = prefill; send(prefill); } else setTimeout(() => inp.focus(), 60);
}
function closeChat() {
  CH.open = false;
  const panel = document.getElementById('rcPanel');
  const fab = document.getElementById('rcFab');
  panel.classList.remove('on');
  fab.setAttribute('aria-expanded', 'false');
  fab.classList.remove('on');
  setTimeout(() => { if (!CH.open) panel.hidden = true; }, 260);
  fab.focus();
}
function paintHead() {
  const m = document.getElementById('rcMode');
  if (!m) return;
  m.textContent = CH.ai ? t('chatModeAi') : t('chatModeData');
  m.classList.toggle('ai', !!CH.ai);
  const u = document.getElementById('rcUsed');
  if (u) u.textContent = CH.ai && CH.limit ? t('chatUsed', { a: CH.used ?? 0, b: CH.limit }) : '';
}
function paintPanel() {
  const panel = document.getElementById('rcPanel');
  panel.innerHTML = `<header class="rc-h"><span class="ag-av sm"><img src="/logo-96.png" alt="" width="18" height="16"></span><div class="rc-ht"><b id="rcTitle">${e(t('chatTitle'))}</b><small id="rcMode">${e(t('chatModeData'))}</small></div>
    <button type="button" class="rc-ic" id="rcClear" title="${e(t('chatClear'))}" aria-label="${e(t('chatClear'))}">${svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', 17)}</button>
    <button type="button" class="rc-ic" id="rcX" aria-label="${e(t('chatClose'))}">${svg(IC.x, 18)}</button></header>
    <div class="rc-log" id="rcLog" aria-live="polite"></div>
    <div class="rc-ex" id="rcEx">${EXS.map((k) => `<button type="button" class="dk-chip" data-ex="${e(t(k))}">${e(t(k))}</button>`).join('')}</div>
    <form class="rc-form" id="rcForm" novalidate><label class="sr" for="rcIn">${e(t('chatPh'))}</label><textarea id="rcIn" rows="1" maxlength="800" placeholder="${e(t('chatPh'))}"></textarea><button class="dk-btn" type="submit" id="rcSend" aria-label="${e(t('chatSend'))}">${svg(IC.send, 17)}</button></form>
    <p class="rc-note"><span>${e(t('chatNote'))}</span><span id="rcUsed"></span></p>`;
  paintLog();
  paintHead();
  panel.querySelector('#rcX').addEventListener('click', closeChat);
  panel.querySelector('#rcClear').addEventListener('click', () => { CH.log = []; saveLog(); paintLog(); });
  panel.querySelectorAll('[data-ex]').forEach((b) => b.addEventListener('click', () => send(b.dataset.ex)));
  const inp = panel.querySelector('#rcIn');
  inp.addEventListener('input', () => { inp.style.height = 'auto'; inp.style.height = Math.min(inp.scrollHeight, 120) + 'px'; });
  inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); panel.querySelector('#rcForm').requestSubmit(); } });
  panel.querySelector('#rcForm').addEventListener('submit', (ev) => { ev.preventDefault(); send(inp.value); });
}
function msgHtml(m, i) {
  if (m.role === 'user') return `<div class="rc-m me"><p>${e(m.text)}</p></div>`;
  const items = (m.items || []).map((x) => `<li>${x.href ? `<a href="${e(x.href)}" ${/^https?:/.test(x.href) ? 'target="_blank" rel="noopener"' : ''}>${e(x.t)}</a>` : `<b>${e(x.t)}</b>`}${x.s ? `<small>${e(x.s)}</small>` : ''}</li>`).join('');
  const btns = (m.btns || []).map((b, j) => `<button type="button" class="dk-btn sm ${b.primary ? '' : 'line'}" data-mb="${i}:${j}">${e(b.label)}</button>`).join('');
  const lines = String(m.text || '').split('\n').map((ln) => (/^\s*[-•·]\s+/.test(ln) ? `<span class="li">${e(ln.replace(/^\s*[-•·]\s+/, ''))}</span>` : ln.trim() ? `<span class="ln">${e(ln)}</span>` : '<span class="gap"></span>')).join('');
  return `<div class="rc-m bot${m.err ? ' err' : ''}${m.ai ? ' ai' : ''}"><p>${lines}</p>${items ? `<ul>${items}</ul>` : ''}${btns ? `<div class="rc-btns">${btns}</div>` : ''}${m.ai ? `<small class="rc-ai">${svg(IC.spark, 13)} AI</small>` : ''}</div>`;
}
function paintLog() {
  const box = document.getElementById('rcLog');
  if (!box) return;
  const list = CH.log.length ? CH.log : [{ role: 'bot', text: t('chatHi') }];
  box.innerHTML = list.map(msgHtml).join('') + (CH.busy ? `<div class="rc-m bot typing"><p><span class="dk-spin"></span> ${e(t('chatThinking'))}</p></div>` : '');
  box.querySelectorAll('[data-mb]').forEach((b) => b.addEventListener('click', () => {
    const [i, j] = b.dataset.mb.split(':').map(Number);
    const btn = (list[i].btns || [])[j];
    if (btn) runBtn(btn, b);
  }));
  box.scrollTop = box.scrollHeight;
}
async function runBtn(btn, el) {
  if (btn.to) { if (btn.to.startsWith('/')) { location.href = btn.to; return; } location.hash = btn.to; if (window.matchMedia('(max-width: 720px)').matches) closeChat(); return; }
  if (btn.add) {
    el.disabled = true;
    const out = await C.act({ action: 'add', inputs: [btn.add], role: 'reference' });
    const r0 = (out.results || [])[0];
    push({ role: 'bot', text: out.ok && r0?.ok ? att('a_added', { n: 1, v: C.fmtFull((r0.shorts || 0) + (r0.longs || 0)) }) : C.errText(out.ok ? r0?.error || 'NOT_FOUND' : out.error), err: !(out.ok && r0?.ok) });
    if (out.ok && r0?.ok) { C.S.chansAt = 0; }
    return;
  }
  if (btn.ask) { send(btn.ask); return; }
  if (btn.ai) { await askAi(btn.ai, true); }
}
function push(m) { CH.log.push(m); CH.log = CH.log.slice(-30); saveLog(); paintLog(); }

async function send(raw) {
  const q = String(raw || '').trim().slice(0, 800);
  if (!q || CH.busy) return;
  const inp = document.getElementById('rcIn');
  if (inp) { inp.value = ''; inp.style.height = 'auto'; }
  push({ role: 'user', text: q });
  CH.busy = true; paintLog();
  let ans = null;
  try { ans = await localAnswer(q); } catch (er) { ans = null; }
  const ai = await aiState().catch(() => false);
  CH.busy = false;
  if (ans) {
    if (ai && ans.data) ans.btns = [...(ans.btns || []), { label: t('chatAskAi'), ai: q }];
    push({ role: 'bot', ...ans });
    return;
  }
  if (ai) { await askAi(q); return; }
  // AI가 없으면: 할 수 있는 화면으로 안내
  const c = parseCmd(q, C.S.chans || []);
  if (c && c.to) { push({ role: 'bot', text: att(c.say, { k: c.k || '' }).replace(/\s*→\s*$/, ''), btns: [{ label: t('chatGo'), to: c.to, primary: true }] }); return; }
  push({ role: 'bot', text: t('chatUnknown') + '\n' + t('chatNoAi'), btns: EXS.slice(0, 3).map((k) => ({ label: t(k), ai: null, ask: t(k) })) });
}
async function askAi(q, fromBtn) {
  CH.busy = true; paintLog();
  const history = CH.log.filter((m) => m.role === 'user' || m.ai || !m.err).slice(-9, fromBtn ? undefined : -1)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', text: String(m.text || '').slice(0, 1500) }));
  const out = await C.act({ action: 'ask', q, lang: C.lang, history });
  CH.busy = false;
  if (out.ok) {
    if (out.used != null) CH.used = out.used;
    if (out.limit != null) CH.limit = out.limit;
    paintHead();
    push({ role: 'bot', text: out.text, ai: true });
    return;
  }
  if (out.error === 'NO_AI') { CH.ai = false; paintHead(); }
  const fallback = await localAnswer(q).catch(() => null);
  push(fallback ? { role: 'bot', ...fallback, text: C.errText(out.error) + '\n' + fallback.text } : { role: 'bot', text: C.errText(out.error), err: true });
}

// 데이터로 바로 답하기 (AI 없이도 돼요)
const RX = {
  help: /^(도움|도와|help|사용법|뭘?\s?할\s?수|무엇을\s?할|ヘルプ|使い方|何ができ)/i,
  rising: /지금\s?뜨|뜨는\s?(영상|중|거)|급상승|터지는|막\s?터|rising|taking off|breaking out|急上昇|伸びて(る|い)/i,
  v48: /48\s?(시간|h|時間)|이틀/i,
  mine: /내\s?채널|우리\s?채널|my channel|our channel|自分のチャンネル|うちのチャンネル/i,
  top: /제일\s?잘|가장\s?잘|잘\s?된|잘된|터진|best|top video|biggest|一番|いちばん|伸びた/i,
  picks: /뭐\s?(찍|만들|올리)|무슨\s?소재|소재\s?추천|아이디어\s?(줘|좀)|what should i (make|film|post)|ideas? for|何を(撮|作)|ネタ(を|の)?(おすすめ|教えて)/i,
  plan: /요금제|한도|플랜|plan|limit|プラン|上限/i,
  team: /팀원|멤버|누가\s?(있|들어)|members?|team ?mates?|メンバー/i,
  board: /소재\s?보드|아이디어\s?보드|보드|idea board|board|ネタボード/i,
  quota: /할당량|쿼터|포인트|quota|クォータ/i,
  push: /(알림|푸시|노티).{0,6}(켜|받|설정|오게|와|보내)|폰으로|휴대폰|핸드폰|푸시|push notif|notifications?|turn on alerts|通知(を|の)?(オン|受け|設定|届)|プッシュ/i,
  report: /리포트|보고서|주간\s?보고|월간\s?보고|pdf|weekly report|report|レポート|報告書/i
};
const fx = (x) => (x >= 10 ? String(Math.round(x)) : Number(x).toFixed(1));
const ytUrl = (id, kind) => (kind === 'long' ? 'https://www.youtube.com/watch?v=' + id : 'https://www.youtube.com/shorts/' + id);
async function localAnswer(q) {
  const S = C.S;
  const chans = await C.getChans().catch(() => S.chans || []);
  if (RX.help.test(q)) return { text: t('aHelp'), btns: EXS.map((k) => ({ label: t(k), ai: null, ask: t(k) })) };
  const cmd = parseCmd(q, chans);
  if (cmd && cmd.add) return { text: t('aAddQ'), btns: [{ label: t('chatAddBtn'), add: cmd.add, primary: true }] };
  if (RX.push.test(q) && S.user?.guest) return { text: t('aGuest'), btns: [{ label: t('guestLogin'), to: '/login?next=%2Fapp', primary: true }] };
  if (RX.push.test(q)) return { text: (C.push?.pushOn() ? t('aPushOn') + ' ' : '') + t('aPush'), btns: [{ label: t('chatGo'), to: '#notify', primary: true }] };
  if (RX.report.test(q)) return { text: t('aReport'), btns: [{ label: t('chatGo'), to: '#report', primary: true }] };
  if (RX.rising.test(q)) {
    const feed = await C.rpc('radar_feed', { p_hours: 48, p_role: null, p_kind: S.kind }).catch(() => []);
    const top = (feed || []).filter((x) => x.pace != null && x.pace >= 1.5).sort((a, b) => b.pace - a.pace).slice(0, 4);
    if (!top.length) return { text: t('aRisingNone'), btns: [{ label: t('chatGo'), to: '#radar' }], data: 1 };
    return { text: t('aRising'), items: top.map((x) => ({ t: x.title, s: `${x.channel_title} · ${t('aItemPace', { x: fx(x.pace), v: C.fmtN(x.views) })}`, href: ytUrl(x.id, x.kind) })), btns: [{ label: t('chatGo'), to: '#radar', primary: true }], data: 1 };
  }
  if (RX.v48.test(q)) {
    const ov = await C.rpc('radar_overview');
    const v = Number(ov?.views48) || 0, p = Number(ov?.prev48) || 0;
    let text = t('aV48', { n: C.fmtFull(ov?.channels?.total || 0), v: C.fmtFull(v) });
    if (p > 0) { const pct = Math.round(((v - p) / p) * 100); text += ' ' + t('aV48Cmp', { p: Math.abs(pct), dir: t(pct >= 0 ? 'more' : 'less') }); }
    return { text, btns: [{ label: t('chatGo'), to: '#overview' }], data: 1 };
  }
  if (RX.mine.test(q)) {
    const mine = chans.filter((c) => c.role === 'mine');
    if (!mine.length) return { text: t('aMineNone'), btns: [{ label: t('chatGo'), to: '#refs', primary: true }] };
    const long = S.kind === 'long';
    return { text: mine.map((c) => t('aMine', { c: c.title, v: C.fmtN(c.v48 || 0), n: (long ? c.n7_long : c.n7) ?? 0, m: C.fmtN((long ? c.median_long : c.median) || 0) })).join('\n'),
      btns: mine.slice(0, 2).map((c, i) => ({ label: c.title, to: '#ch/' + c.id, primary: !i })), data: 1 };
  }
  if (RX.picks.test(q)) {
    const list = await C.vids({ p_days: 3, p_channel: null, p_role: 'reference', p_limit: 300 }).catch(() => []);
    const top = (list || []).filter((x) => x.ratio != null && x.ratio >= 2).sort((a, b) => b.ratio - a.ratio).slice(0, 3);
    if (!top.length) return { text: t('aPicksNone'), btns: [{ label: t('chatGo'), to: '#picks', primary: true }], data: 1 };
    return { text: t('aPicks'), items: top.map((x) => ({ t: x.title, s: `${x.channel_title} · ${t('aItemX', { x: fx(x.ratio), v: C.fmtN(x.views) })}`, href: ytUrl(x.id, x.kind) })), btns: [{ label: t('chatGo'), to: '#picks', primary: true }], data: 1 };
  }
  if (RX.top.test(q)) {
    const list = await C.vids({ p_days: 7, p_channel: null, p_role: null, p_limit: 300 }).catch(() => []);
    const top = (list || []).filter((x) => x.ratio != null && x.ratio >= 1.5).sort((a, b) => b.ratio - a.ratio).slice(0, 4);
    if (!top.length) return { text: t('aTopNone'), btns: [{ label: t('chatGo'), to: '#ranking' }], data: 1 };
    return { text: t('aTop'), items: top.map((x) => ({ t: x.title, s: `${x.channel_title} · ${t('aItemX', { x: fx(x.ratio), v: C.fmtN(x.views) })}`, href: ytUrl(x.id, x.kind) })), btns: [{ label: t('chatGo'), to: '#ranking', primary: true }], data: 1 };
  }
  if ((RX.plan.test(q) || RX.team.test(q)) && S.user?.guest) return { text: t('aGuest'), btns: [{ label: t('guestLogin'), to: '/login?next=%2Fapp', primary: true }] };
  if (RX.plan.test(q) || RX.team.test(q)) {
    const tm = await C.rpc('radar_team');
    if (!tm) return null;
    const lim = tm.workspace.limits || {};
    if (RX.team.test(q) && !RX.plan.test(q)) {
      const ms = tm.members || [];
      return { text: t('aTeam', { n: ms.length, list: ms.map((m) => `${m.name || m.login} (${roleName(m.role)})`).join(', ') }), btns: [{ label: t('chatGo'), to: '#team', primary: true }] };
    }
    return { text: t('aPlan', { p: planName(tm.workspace.plan), a: tm.usage?.mine || 0, b: lim.mine, c: tm.usage?.refs || 0, d: lim.refs, e: tm.seats || 0, f: lim.seats, g: tm.today?.searches || 0, h: lim.searches }), btns: [{ label: t('chatGo'), to: '#team', primary: true }] };
  }
  if (RX.board.test(q)) {
    const { data } = await C.sb.from('radar_ideas').select('stage').eq('workspace_id', S.ws.id).limit(1000);
    const n = (k) => (data || []).filter((x) => x.stage === k).length;
    if (!(data || []).length) return { text: t('aBoardNone'), btns: [{ label: t('chatGo'), to: '#picks', primary: true }] };
    return { text: t('aBoard', { a: n('idea'), b: n('script'), c: n('production'), d: n('uploaded') }), btns: [{ label: t('chatGo'), to: '#ideas', primary: true }] };
  }
  if (RX.quota.test(q)) {
    const st = await C.act({ action: 'status' });
    if (!st.ok) return null;
    return { text: t('aQuota', { u: C.fmtFull(st.units_today), b: C.fmtFull(st.budget), s: st.searches_today, sb: st.search_budget }), btns: [{ label: t('chatGo'), to: '#status' }] };
  }
  // 채널 이름이 들어 있으면 그 채널 요약
  const low = q.toLowerCase();
  const named = chans.filter((c) => c.title && c.title.length >= 3 && low.includes(c.title.toLowerCase())).slice(0, 2);
  if (named.length === 1 && !(cmd && /compare/.test(cmd.to || ''))) {
    const c = named[0];
    return { text: t('aCh', { c: c.title, s: c.subs == null ? '–' : C.fmtN(c.subs), v: C.fmtN(c.v48 || 0), n: c.n7 ?? 0 }), btns: [{ label: t('chatGo'), to: '#ch/' + c.id, primary: true }], data: 1 };
  }
  return null;
}
