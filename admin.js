// CNOL RADAR — 관리자 콘솔 (개요 · 워크스페이스 · 회원 · 협업 요청 · 문의 · 운영 준비)
// 화면은 누구나 열 수 있지만, 데이터는 Supabase RLS와 is_admin() 검사로 관리자에게만 내려와요.
// v12: 워크스페이스(회사)마다 요금제 · 팀원 · 초대 링크 — 사용 신청(문의) → 워크스페이스 만들고 대표 초대 링크 보내기
import { sb, SUPABASE_URL, SUPABASE_KEY, getLang, esc, snack, requireSession, emailToId } from '/common.js';

const D = {
  ko: {
    badge: '관리자 콘솔', overview: '개요', members: '회원', requests: '협업 요청', inquiries: '문의',
    toApp: '크리에이터 화면', logout: '로그아웃', loading: '불러오는 중이에요…', loadFail: '불러오지 못했어요. 새로고침해 주세요.',
    denyH: '관리자만 볼 수 있는 화면이에요', denyP: '관리자 권한이 있는 계정으로 로그인해 주세요.', back: '레이더 홈으로',
    kMembers: '전체 회원', kPaid: '유료 회원', k7d: '최근 7일 가입', kCh: '연결된 채널', kPending: '대기 중인 협업 요청', kInq: '받은 문의',
    mrr: '예상 월 매출', mrrNote: '요금제별 정가로 계산한 추정치예요. 결제를 연동하면 실제 결제 금액으로 바뀌어요. 엔터프라이즈는 별도 계약이라 빠져 있어요.',
    signups: '최근 30일 가입', sum: '합계 {n}명', today: '오늘', tipDay: '{d}\n가입 {n}명',
    chartAria: '최근 30일 가입 막대 차트. 합계 {n}명, 가장 많은 날은 {d} {m}명이에요.',
    byProvider: '가입 경로', byLanguage: '회원 언어', byPlan: '요금제별 회원', recent: '최근 가입', seeAll: '회원 전체 보기', none: '아직 없어요',
    search: '이메일이나 이름으로 찾기', allPlans: '모든 요금제', shown: '{n}명',
    colMember: '회원', colVia: '가입 경로', colLang: '언어', colPlan: '요금제', colCh: '연결 채널', colRole: '역할', colJoined: '가입일',
    planChange: '{name}님의 요금제', planSaved: '요금제를 바꿨어요', saveFail: '저장하지 못했어요. 다시 해주세요.',
    role_admin: '관리자', role_member: '회원', filter: '상태로 거르기',
    all: '전체', st_pending: '대기', st_reviewing: '검토 중', st_accepted: '수락', st_declined: '거절',
    kind_music: '음원 협업', kind_ad: '광고', kind_ppl: 'PPL', statusChange: '요청 상태', statusSaved: '상태를 바꿨어요', noMsg: '남긴 메시지가 없어요',
    open: '미처리', done: '처리 완료', markDone: '처리 완료로 표시', reply: '메일로 답장', replySubj: 'CNOL RADAR 문의 답변', doneSaved: '처리 상태를 바꿨어요',
    workspaces: '워크스페이스', wsNewH: '새 워크스페이스 · 대표 초대 링크', wsNewP: '사용 신청한 분의 회사(채널) 이름으로 워크스페이스를 만들고 대표 초대 링크를 보내 주세요. 받은 분이 아이디와 비밀번호를 직접 정해요.',
    wsNameL: '워크스페이스 이름', wsPlanL: '요금제', wsNoteL: '메모 · 보낼 사람 이메일 (선택)', wsCreate: '만들고 링크 받기', wsCreated: '워크스페이스를 만들었어요. 대표 초대 링크예요 (14일 · 한 번).',
    copy: '복사', copied: '복사했어요', copyFail: '복사하지 못했어요. 길게 눌러 복사해 주세요.', mailIt: '메일로 보내기', mailSubj: 'CNOL RADAR 초대 링크',
    mailBody: '안녕하세요, CNOL RADAR예요.\n\n아래 링크를 열고 아이디와 비밀번호를 정하면 바로 시작할 수 있어요.\n{url}\n\n링크는 14일 동안 한 번만 쓸 수 있어요.',
    reqH: '요금제 바꾸기 신청', reqNone: '기다리는 신청이 없어요', reqApprove: '{p} 요금제로 바꾸기', reqDecline: '보류', reqDone2: '요금제를 바꿨어요', reqDeclined: '보류했어요', cur2: '지금 {p}',
    wsListH: '전체 워크스페이스', colWs: '워크스페이스', colMembers: '팀원', colUse: '사용량', colInv: '초대 링크', colMade: '만든 날', colWsOf: '워크스페이스',
    ownerLink: '대표 링크 만들기', ownerLinkMade: '{n} 대표 초대 링크예요 (14일 · 한 번).', invOpen: '안 쓴 링크 {n}', noMembers: '아직 아무도 없어요',
    uMine: '내 채널', uRefs: '레퍼런스', wsrole_owner: '대표', wsrole_editor: '편집', wsrole_viewer: '보기',
    inqMake: '워크스페이스 만들고 초대 링크', inqMade: '초대 링크를 만들었어요. 문의는 처리 완료로 바꿨어요.', fnFail: '처리하지 못했어요 ({e})', kWs: '워크스페이스', kPaidWs: '유료 워크스페이스',
    mrrNote2: '워크스페이스 요금제별 정가로 계산한 추정치예요. 결제를 연결하면 실제 결제 금액으로 바뀌어요. 엔터프라이즈는 별도 계약이라 빠져 있어요.', byWsPlan: '요금제별 워크스페이스'
  },
  en: {
    badge: 'Admin console', overview: 'Overview', members: 'Members', requests: 'Partner requests', inquiries: 'Inquiries',
    toApp: 'Creator view', logout: 'Log out', loading: 'Loading…', loadFail: "Couldn't load. Please refresh.",
    denyH: 'This page is for admins only', denyP: 'Please sign in with an admin account.', back: 'Back to radar home',
    kMembers: 'Members', kPaid: 'Paying members', k7d: 'Sign-ups, last 7 days', kCh: 'Connected channels', kPending: 'Pending partner requests', kInq: 'Inquiries',
    mrr: 'Estimated MRR', mrrNote: 'Estimated from list prices per plan. It switches to actual billed amounts once payments are connected. Enterprise is contracted separately and excluded.',
    signups: 'Sign-ups, last 30 days', sum: '{n} total', today: 'Today', tipDay: '{d}\n{n} sign-ups',
    chartAria: 'Bar chart of sign-ups over the last 30 days. {n} in total; the busiest day was {d} with {m}.',
    byProvider: 'Sign-up method', byLanguage: 'Member language', byPlan: 'Members by plan', recent: 'Latest sign-ups', seeAll: 'See all members', none: 'Nothing yet',
    search: 'Search by email or name', allPlans: 'All plans', shown: '{n} members',
    colMember: 'Member', colVia: 'Signed up with', colLang: 'Language', colPlan: 'Plan', colCh: 'Channels', colRole: 'Role', colJoined: 'Joined',
    planChange: "{name}'s plan", planSaved: 'Plan updated', saveFail: "Couldn't save. Please try again.",
    role_admin: 'Admin', role_member: 'Member', filter: 'Filter by status',
    all: 'All', st_pending: 'Pending', st_reviewing: 'Reviewing', st_accepted: 'Accepted', st_declined: 'Declined',
    kind_music: 'Music collab', kind_ad: 'Ad', kind_ppl: 'PPL', statusChange: 'Request status', statusSaved: 'Status updated', noMsg: 'No message',
    open: 'Open', done: 'Handled', markDone: 'Mark as handled', reply: 'Reply by email', replySubj: 'Re: your CNOL RADAR question', doneSaved: 'Updated',
    workspaces: 'Workspaces', wsNewH: 'New workspace & owner invite link', wsNewP: 'Create a workspace named after the applicant’s company or channel and send them the owner invite link. They pick their own ID and password.',
    wsNameL: 'Workspace name', wsPlanL: 'Plan', wsNoteL: 'Note · recipient email (optional)', wsCreate: 'Create and get link', wsCreated: 'Workspace created. Here’s the owner invite link (14 days, one use).',
    copy: 'Copy', copied: 'Copied', copyFail: 'Couldn’t copy. Press and hold to copy.', mailIt: 'Send by email', mailSubj: 'Your CNOL RADAR invite link',
    mailBody: 'Hi, this is CNOL RADAR.\n\nOpen the link below, pick an ID and password, and you can start right away.\n{url}\n\nThe link works once within 14 days.',
    reqH: 'Plan change requests', reqNone: 'No pending requests', reqApprove: 'Switch to {p}', reqDecline: 'Hold', reqDone2: 'Plan switched', reqDeclined: 'Put on hold', cur2: 'Now {p}',
    wsListH: 'All workspaces', colWs: 'Workspace', colMembers: 'Members', colUse: 'Usage', colInv: 'Invite links', colMade: 'Created', colWsOf: 'Workspaces',
    ownerLink: 'Create owner link', ownerLinkMade: 'Owner invite link for {n} (14 days, one use).', invOpen: '{n} unused', noMembers: 'No one yet',
    uMine: 'Mine', uRefs: 'Refs', wsrole_owner: 'Owner', wsrole_editor: 'Editor', wsrole_viewer: 'Viewer',
    inqMake: 'Create workspace & invite link', inqMade: 'Invite link created. The inquiry is marked as handled.', fnFail: 'Couldn’t do that ({e})', kWs: 'Workspaces', kPaidWs: 'Paid workspaces',
    mrrNote2: 'Estimated from list prices of each workspace’s plan. It switches to billed amounts once payments are connected. Enterprise is contracted separately and excluded.', byWsPlan: 'Workspaces by plan'
  },
  ja: {
    badge: '管理コンソール', overview: '概要', members: '会員', requests: 'コラボ依頼', inquiries: 'お問い合わせ',
    toApp: 'クリエイター画面', logout: 'ログアウト', loading: '読み込み中です…', loadFail: '読み込めませんでした。再読み込みしてください。',
    denyH: '管理者専用の画面です', denyP: '管理者権限のあるアカウントでログインしてください。', back: 'レーダーホームへ',
    kMembers: '会員数', kPaid: '有料会員', k7d: '直近7日の登録', kCh: '連携チャンネル', kPending: '未対応のコラボ依頼', kInq: 'お問い合わせ',
    mrr: '推定月間売上', mrrNote: 'プラン別の定価で計算した推定値です。決済を連携すると実際の請求額に切り替わります。エンタープライズは個別契約のため含みません。',
    signups: '直近30日の登録', sum: '合計 {n}人', today: '今日', tipDay: '{d}\n登録 {n}人',
    chartAria: '直近30日の登録数の棒グラフ。合計{n}人、最も多い日は{d}の{m}人です。',
    byProvider: '登録方法', byLanguage: '会員の言語', byPlan: 'プラン別会員', recent: '最近の登録', seeAll: '会員一覧へ', none: 'まだありません',
    search: 'メールまたは名前で検索', allPlans: 'すべてのプラン', shown: '{n}人',
    colMember: '会員', colVia: '登録方法', colLang: '言語', colPlan: 'プラン', colCh: '連携チャンネル', colRole: '役割', colJoined: '登録日',
    planChange: '{name}さんのプラン', planSaved: 'プランを変更しました', saveFail: '保存できませんでした。もう一度お試しください。',
    role_admin: '管理者', role_member: '会員', filter: '状態で絞り込む',
    all: 'すべて', st_pending: '未対応', st_reviewing: '確認中', st_accepted: '承認', st_declined: '見送り',
    kind_music: '音源コラボ', kind_ad: '広告', kind_ppl: 'PPL', statusChange: '依頼の状態', statusSaved: '状態を変更しました', noMsg: 'メッセージはありません',
    open: '未対応', done: '対応済み', markDone: '対応済みにする', reply: 'メールで返信', replySubj: 'CNOL RADAR お問い合わせへの回答', doneSaved: '対応状況を変更しました',
    workspaces: 'ワークスペース', wsNewH: '新しいワークスペースとオーナー招待リンク', wsNewP: '申請した方の会社（チャンネル）名でワークスペースを作り、オーナー招待リンクを送ってください。受け取った方がIDとパスワードを決めます。',
    wsNameL: 'ワークスペース名', wsPlanL: 'プラン', wsNoteL: 'メモ・送り先メール（任意）', wsCreate: '作成してリンクを取得', wsCreated: 'ワークスペースを作成しました。オーナー招待リンクです（14日・1回）。',
    copy: 'コピー', copied: 'コピーしました', copyFail: 'コピーできませんでした。長押ししてコピーしてください。', mailIt: 'メールで送る', mailSubj: 'CNOL RADAR 招待リンク',
    mailBody: 'こんにちは、CNOL RADARです。\n\n下のリンクを開いてIDとパスワードを決めると、すぐに始められます。\n{url}\n\nリンクは14日以内に1回だけ使えます。',
    reqH: 'プラン変更の申請', reqNone: '待機中の申請はありません', reqApprove: '{p}に変更', reqDecline: '保留', reqDone2: 'プランを変更しました', reqDeclined: '保留にしました', cur2: '現在 {p}',
    wsListH: 'すべてのワークスペース', colWs: 'ワークスペース', colMembers: 'メンバー', colUse: '使用量', colInv: '招待リンク', colMade: '作成日', colWsOf: 'ワークスペース',
    ownerLink: 'オーナーリンク作成', ownerLinkMade: '{n}のオーナー招待リンクです（14日・1回）。', invOpen: '未使用 {n}', noMembers: 'まだ誰もいません',
    uMine: '自分', uRefs: 'リファレンス', wsrole_owner: 'オーナー', wsrole_editor: '編集', wsrole_viewer: '閲覧',
    inqMake: 'ワークスペースと招待リンクを作成', inqMade: '招待リンクを作成しました。お問い合わせは対応済みにしました。', fnFail: '処理できませんでした（{e}）', kWs: 'ワークスペース', kPaidWs: '有料ワークスペース',
    mrrNote2: 'ワークスペースのプラン別定価で計算した推定値です。決済を連携すると実際の請求額に切り替わります。エンタープライズは個別契約のため含みません。', byWsPlan: 'プラン別ワークスペース'
  }
};

const OPERATIONS = {
  ko: {
    operations: '운영 준비', intro: '현재 설정과 공개 데이터의 수집 상태를 확인해요.',
    auth: '회원 가입 · 로그인', service: '서비스', state: '현재 상태', enabled: '활성 설정', disabled: '비활성 설정',
    pending: '연결 준비', unknown: '확인하지 못했어요', retry: '상태 다시 확인', failed: '일부 상태를 불러오지 못했어요.',
    publicData: '공개 데이터 수집 현황', channels: '수집 채널', shorts: '수집 쇼츠', longs: '수집 롱폼',
    first: '수집 시작', last: '마지막 수집', observed: '확인된 관측 기간', minutes: '{n}분',
    coverage: '첫 수집부터 마지막 수집까지의 기간이에요. 48시간에 못 미치면 전체 48시간의 실측 자료가 아니에요.',
    external: '음원 · 광고 · 외부 플랫폼', deferred: 'MCP 연결 준비 · 자동 연결 보류',
    externalNote: '외부 계정 인증과 자동 연결은 보류 상태예요.',
    authNote: '로그인 제공자의 설정 상태예요. 로그인 완료나 YouTube 채널 권한 연결을 의미하지 않아요.'
  },
  en: {
    operations: 'Launch readiness', intro: 'Check current settings and public-data collection status.',
    auth: 'Sign-up & sign-in', service: 'Service', state: 'Current status', enabled: 'Enabled in settings', disabled: 'Disabled in settings',
    pending: 'Connection pending', unknown: 'Could not verify', retry: 'Check status again', failed: 'Some status information could not be loaded.',
    publicData: 'Public-data collection', channels: 'Tracked channels', shorts: 'Collected Shorts', longs: 'Collected long videos',
    first: 'Collection started', last: 'Last collected', observed: 'Observed coverage', minutes: '{n} minutes',
    coverage: 'This span runs from the first to the last collection. A span shorter than 48 hours is not a complete 48-hour observation period.',
    external: 'Music, ads & external platforms', deferred: 'MCP connection pending · Automatic connection on hold',
    externalNote: 'External account authorization and automatic linking remain on hold.',
    authNote: 'These are provider settings. They do not confirm a completed sign-in or authorized YouTube channel connection.'
  },
  ja: {
    operations: '運用準備', intro: '現在の設定と公開データの収集状況を確認します。',
    auth: '会員登録・ログイン', service: 'サービス', state: '現在の状態', enabled: '設定で有効', disabled: '設定で無効',
    pending: '連携準備中', unknown: '確認できませんでした', retry: '状態を再確認', failed: '一部の状態を読み込めませんでした。',
    publicData: '公開データの収集状況', channels: '収集チャンネル', shorts: '収集ショート', longs: '収集長尺動画',
    first: '収集開始', last: '最終収集', observed: '確認できた観測期間', minutes: '{n}分',
    coverage: '最初の収集から最終収集までの期間です。48時間未満の場合、48時間全体の実測データではありません。',
    external: '音源・広告・外部プラットフォーム', deferred: 'MCP連携準備中・自動連携は保留',
    externalNote: '外部アカウントの認証と自動連携は保留中です。',
    authNote: 'ログインプロバイダーの設定状況です。ログイン完了やYouTubeチャンネル権限の連携を意味しません。'
  }
};
for (const language of Object.keys(OPERATIONS)) D[language].operations = OPERATIONS[language].operations;

const PLAN = { free: { ko: '무료', en: 'Free', ja: '無料' }, solo: { ko: '솔로', en: 'Solo', ja: 'ソロ' }, plus: { ko: '플러스', en: 'Plus', ja: 'プラス' }, team: { ko: '팀', en: 'Team', ja: 'チーム' }, agency: { ko: '에이전시', en: 'Agency', ja: 'エージェンシー' }, enterprise: { ko: '엔터프라이즈', en: 'Enterprise', ja: 'エンタープライズ' } };
const PROVIDER = { kakao: { ko: '카카오', en: 'Kakao', ja: 'カカオ' }, google: { ko: 'Google', en: 'Google', ja: 'Google' }, naver: { ko: '네이버', en: 'Naver', ja: 'NAVER' }, email: { ko: '이메일', en: 'Email', ja: 'メール' } };
const LANG_NAME = { ko: { ko: '한국어', en: 'Korean', ja: '韓国語' }, en: { ko: '영어', en: 'English', ja: '英語' }, ja: { ko: '일본어', en: 'Japanese', ja: '日本語' } };
const PRICE = { free: 0, solo: 19000, plus: 39000, team: 69000, agency: 149000, enterprise: 0 }; // 출시 예정 가격 (소개 페이지 landing.js PRICES와 같아요)
const STATUSES = ['pending', 'reviewing', 'accepted', 'declined'];
const ROUTES = ['overview', 'workspaces', 'members', 'requests', 'inquiries', 'operations'];

const I = {
  overview: '<path d="M5 20V11M12 20V5M19 20v-6M3 20h18"/>',
  workspaces: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>',
  members: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  requests: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  inquiries: '<path d="M4 5h16v11H8l-4 4z"/>',
  operations: '<path d="M9 3h6l1 3 3 1v6l-3 1-1 3H9l-1-3-3-1V7l3-1z"/><path d="M9 10l2 2 4-4"/>',
  app: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12l6-6"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>'
};
const svg = (p, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

let lang = getLang();
let user = null;
let me = null;
const st = { q: '', plan: 'all', req: 'pending', inq: 'open' };
const cache = { members: null, chCount: {}, requests: null, inquiries: null, ws: null };

const tx = (k, vars) => {
  let s = (D[lang] && D[lang][k]) ?? D.ko[k] ?? k;
  if (vars) for (const v of Object.keys(vars)) s = s.replace('{' + v + '}', vars[v]);
  return s;
};
const lbl = (map, k) => (map[k] ? map[k][lang] || map[k].ko : (k || '—'));
const locale = () => (lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US');
const fmtNum = (n) => Number(n || 0).toLocaleString(locale());
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(locale(), { year: 'numeric', month: 'short', day: 'numeric' }) : '—');
const dayLabel = (key) => new Date(key + 'T00:00:00Z').toLocaleDateString(locale(), { month: 'short', day: 'numeric', timeZone: 'UTC' });
const won = (n) => (lang === 'ko' ? fmtNum(n) + '원' : '₩' + fmtNum(n));
const loading = () => `<div class="empty" role="status">${esc(tx('loading'))}</div>`;
const failBox = () => `<div class="empty" role="alert">${esc(tx('loadFail'))}</div>`;
const safeEmail = (e) => /^[^\s@?&#<>"']+@[^\s@?&#<>"']+\.[^\s@?&#<>"']+$/.test(e || '');

// 서버(Edge Function radar) — 워크스페이스 · 요금제 · 초대 링크는 서버만 바꿀 수 있어요
async function fn(body) {
  try {
    const { data, error } = await sb.functions.invoke('radar', { body });
    if (!error) return data || { ok: false, error: 'EMPTY' };
    let code = error.message;
    try { const j = await error.context?.json?.(); if (j?.error) code = j.error; } catch (e) { /* 그대로 */ }
    return { ok: false, error: code };
  } catch (e) { return { ok: false, error: e.message || String(e) }; }
}
const PLAN_KEYS = Object.keys(PLAN);
const planOpts = (cur) => PLAN_KEYS.map((p) => `<option value="${p}" ${p === cur ? 'selected' : ''}>${esc(lbl(PLAN, p))}</option>`).join('');
function linkBlock(url, msg, mailTo) {
  const body = tx('mailBody').replace('{url}', url);
  return `<div class="ws-made fu"><p>${esc(msg)}</p><div class="ws-link"><input class="input" readonly value="${esc(url)}" aria-label="URL"><button type="button" class="btn sm rip" data-copy="${esc(url)}">${esc(tx('copy'))}</button>${safeEmail(mailTo) ? `<a class="btn sm outline" href="mailto:${esc(mailTo)}?subject=${encodeURIComponent(tx('mailSubj'))}&body=${encodeURIComponent(body)}">${esc(tx('mailIt'))}</a>` : ''}</div></div>`;
}
async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); snack(tx('copied')); } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove();
      snack(tx(ok ? 'copied' : 'copyFail'));
    } catch (er) { snack(tx('copyFail')); }
  }
}
function bindCopy(root) { root.querySelectorAll('[data-copy]').forEach((b) => { if (b.dataset.cb) return; b.dataset.cb = '1'; b.addEventListener('click', () => copyText(b.dataset.copy)); }); }
const fnErr = (e) => tx('fnFail', { e: e || '?' });

function chip(label, on, attrs) {
  return `<button type="button" class="chip rip" aria-pressed="${on}" ${attrs}>${on ? '✓ ' : ''}${esc(label)}</button>`;
}

// ---------- 틀 ----------
function currentRoute() {
  const h = (location.hash || '#overview').slice(1);
  return ROUTES.includes(h) ? h : 'overview';
}

function renderChrome(allowed = true) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = tx(el.dataset.t); });
  document.getElementById('who').textContent = (me && me.display_name) || (user && emailToId(user.email || '')) || '';
  const cur = currentRoute();
  let html = allowed ? ROUTES.map((k) => `<a href="#${k}" ${k === cur ? 'aria-current="page"' : ''}>${svg(I[k])}${esc(tx(k))}</a>`).join('') : '';
  html += `<span class="div" aria-hidden="true"></span><a href="/app">${svg(I.app)}${esc(tx('toApp'))}</a><a href="#logout" id="logoutLink">${svg(I.logout)}${esc(tx('logout'))}</a>`;
  const nav = document.getElementById('nav');
  nav.innerHTML = html;
  document.getElementById('logoutLink').addEventListener('click', async (e) => {
    e.preventDefault();
    await sb.auth.signOut();
    location.replace('/');
  });
}

function setTitle(text) {
  document.getElementById('title').textContent = text;
  document.title = text + ' · CNOL RADAR';
}

function route() {
  renderChrome(true);
  const r = currentRoute();
  setTitle(tx(r));
  const v = document.getElementById('view');
  ({ overview: viewOverview, workspaces: viewWorkspaces, members: viewMembers, requests: viewRequests, inquiries: viewInquiries, operations: viewOperations })[r](v);
  v.focus({ preventScroll: true });
}

// ---------- 개요 ----------
function last30(rows) {
  const map = {};
  (rows || []).forEach((r) => { map[String(r.d).slice(0, 10)] = Number(r.c) || 0; });
  const out = [];
  for (let i = 29; i >= 0; i--) {
    const key = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    out.push({ key, c: map[key] || 0 });
  }
  return out;
}

function hbars(obj, map) {
  const entries = Object.entries(obj || {}).map(([k, c]) => [k, Number(c) || 0]).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return `<p style="margin:0;color:var(--ink-2);font-size:14px">${esc(tx('none'))}</p>`;
  const max = Math.max(1, ...entries.map((e) => e[1]));
  return entries.map(([k, c], i) => `<div class="hbar"><span style="font-size:14px">${esc(lbl(map, k))}</span><span class="track"><span class="fill grow" style="width:${(c / max) * 100}%;animation-delay:${i * 60}ms"></span></span><b class="num" style="font-size:14px;text-align:right">${fmtNum(c)}</b></div>`).join('');
}

async function viewOverview(v) {
  v.innerHTML = loading();
  const [statsRes, recentRes, wsRes] = await Promise.all([
    sb.rpc('admin_stats'),
    sb.from('profiles').select('id,email,display_name,signup_provider,language,plan,created_at').order('created_at', { ascending: false }).limit(6),
    fn({ action: 'ws_list' })
  ]);
  if (currentRoute() !== 'overview') return;
  const s = statsRes.data;
  if (statsRes.error || !s) { v.innerHTML = failBox(); return; }
  if (wsRes.ok) cache.ws = wsRes;
  // v12: 요금제는 워크스페이스(회사)마다 — 예상 매출 · 요금제 분포도 워크스페이스 기준
  const wsl = (cache.ws && cache.ws.workspaces) || [];
  const byWsPlan = {};
  wsl.forEach((w) => { byWsPlan[w.plan] = (byWsPlan[w.plan] || 0) + 1; });
  const mrr = wsl.reduce((sum, w) => sum + (PRICE[w.plan] || 0), 0);
  const days = last30(s.signups_30d);
  const max = Math.max(1, ...days.map((d) => d.c));
  const total = days.reduce((a, d) => a + d.c, 0);
  const peak = days.reduce((p, d) => (d.c > p.c ? d : p), days[days.length - 1]);
  const kpis = [['kMembers', s.members], ['kWs', wsl.length], ['kPaidWs', wsl.filter((w) => PRICE[w.plan] > 0).length], ['k7d', s.signups_7d], ['kPending', s.pending_requests], ['kInq', s.inquiries]];
  const recent = recentRes.data || [];

  v.innerHTML = `
    <div class="kpis">${kpis.map(([k, n], i) => `<div class="kpi fu" style="animation-delay:${i * 50}ms"><span>${esc(tx(k))}</span><b class="num">${fmtNum(n)}</b></div>`).join('')}</div>
    <section class="card stack fu" style="gap:6px;background:var(--navy);border-color:var(--navy);color:#fff">
      <span style="font-size:14px;color:#c8d0dc">${esc(tx('mrr'))}</span>
      <b class="num" style="font-size:34px;font-weight:900;letter-spacing:-.5px">${esc(won(mrr))}</b>
      <span style="font-size:13px;line-height:1.6;color:#c8d0dc">${esc(tx('mrrNote2'))}</span>
    </section>
    <section class="card stack fu" style="gap:16px">
      <div class="panel-h"><h2>${esc(tx('signups'))}</h2><span class="num" style="font-size:14px;color:var(--ink-2)">${esc(tx('sum', { n: fmtNum(total) }))}</span></div>
      <div class="chart" id="sg" role="img" aria-label="${esc(tx('chartAria', { n: fmtNum(total), d: dayLabel(peak.key), m: fmtNum(peak.c) }))}">
        <div class="cols">${days.map((d, i) => `<div class="c" data-i="${i}"><i class="rise${d.c ? '' : ' z'}" style="height:${d.c ? Math.max(4, (d.c / max) * 100) : 0}%;animation-delay:${i * 14}ms"></i></div>`).join('')}</div>
        <div class="axis"><span>${esc(dayLabel(days[0].key))}</span><span>${esc(dayLabel(days[15].key))}</span><span>${esc(tx('today'))}</span></div>
        <div class="tip" id="sgTip" hidden></div>
      </div>
    </section>
    <div class="grid-auto" style="grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))">
      <section class="card stack fu" style="gap:12px"><h2 style="margin:0;font-size:18px">${esc(tx('byProvider'))}</h2>${hbars(s.by_provider, PROVIDER)}</section>
      <section class="card stack fu" style="gap:12px"><h2 style="margin:0;font-size:18px">${esc(tx('byLanguage'))}</h2>${hbars(s.by_language, LANG_NAME)}</section>
      <section class="card stack fu" style="gap:12px"><h2 style="margin:0;font-size:18px">${esc(tx('byWsPlan'))}</h2>${hbars(byWsPlan, PLAN)}</section>
    </div>
    <section class="card stack fu" style="gap:8px;padding:20px 0 8px">
      <div class="panel-h" style="padding:0 20px"><h2>${esc(tx('recent'))}</h2><a href="#members" style="font-size:14px;font-weight:700">${esc(tx('seeAll'))}</a></div>
      ${recent.length ? `<div class="scroll-x"><table class="data"><thead><tr><th>${esc(tx('colMember'))}</th><th>${esc(tx('colVia'))}</th><th>${esc(tx('colLang'))}</th><th>${esc(tx('colJoined'))}</th></tr></thead><tbody>${recent.map((m) => `<tr><td><div class="who"><b>${esc(m.display_name || '—')}</b><small>${esc(emailToId(m.email || ''))}</small></div></td><td>${esc(lbl(PROVIDER, m.signup_provider || 'email'))}</td><td>${esc(lbl(LANG_NAME, m.language))}</td><td class="num">${esc(fmtDate(m.created_at))}</td></tr>`).join('')}</tbody></table></div>` : `<p style="margin:0;padding:8px 20px 16px;color:var(--ink-2)">${esc(tx('none'))}</p>`}
    </section>`;

  // 막대 위에 올리면 날짜와 가입 수
  const box = v.querySelector('#sg');
  const tip = v.querySelector('#sgTip');
  box.querySelectorAll('.c').forEach((col) => {
    col.addEventListener('pointerenter', () => {
      const d = days[Number(col.dataset.i)];
      tip.textContent = tx('tipDay', { d: dayLabel(d.key), n: fmtNum(d.c) });
      tip.hidden = false;
      const w = box.clientWidth;
      const x = Math.min(Math.max(col.offsetLeft + col.offsetWidth / 2, 56), w - 56);
      const barTop = col.offsetTop + col.offsetHeight * (1 - (d.c ? Math.max(4, (d.c / max) * 100) : 0) / 100);
      tip.style.left = x + 'px';
      tip.style.top = Math.max(0, barTop - tip.offsetHeight - 8) + 'px';
      col.classList.add('on');
    });
    col.addEventListener('pointerleave', () => { tip.hidden = true; col.classList.remove('on'); });
  });
}

// ---------- 워크스페이스 (v12): 새 워크스페이스 · 대표 초대 링크 · 요금제 신청 · 전체 목록 ----------
async function viewWorkspaces(v) {
  v.innerHTML = loading();
  const out = await fn({ action: 'ws_list' });
  if (currentRoute() !== 'workspaces') return;
  if (!out.ok) { v.innerHTML = `<div class="empty" role="alert">${esc(fnErr(out.error))}</div>`; return; }
  cache.ws = out;
  drawWorkspaces(v);
}
function drawWorkspaces(v) {
  const d = cache.ws;
  const pending = (d.requests || []).filter((r) => r.status === 'pending');
  const wsRole = (r) => tx('wsrole_' + r);
  v.innerHTML = `
    <section class="card stack fu">
      <h2 style="margin:0">${esc(tx('wsNewH'))}</h2>
      <p style="margin:0;color:var(--ink-2);font-size:14px">${esc(tx('wsNewP'))}</p>
      <form class="ws-form" id="wsNew" novalidate>
        <label class="grow">${esc(tx('wsNameL'))}<input class="input" name="name" maxlength="60" autocomplete="off" required></label>
        <label>${esc(tx('wsPlanL'))}<select class="select" name="plan">${planOpts('free')}</select></label>
        <label class="grow">${esc(tx('wsNoteL'))}<input class="input" name="note" maxlength="200" placeholder="name@example.com" autocomplete="off"></label>
        <button class="btn rip" type="submit">${esc(tx('wsCreate'))}</button>
      </form>
      <div id="wsNewOut"></div>
    </section>
    <section class="card stack fu">
      <div class="panel-h"><h2>${esc(tx('reqH'))}</h2><span class="tag ${pending.length ? 'amber' : 'gray'} num">${fmtNum(pending.length)}</span></div>
      ${pending.length ? `<div class="scroll-x"><table class="data"><tbody>${pending.map((r) => `<tr>
        <td><div class="who"><b>${esc(r.workspace)}</b><small>${esc(tx('cur2', { p: lbl(PLAN, r.current) }))} → <b>${esc(lbl(PLAN, r.plan))}</b></small></div></td>
        <td style="max-width:360px">${esc(r.note || '')}</td>
        <td><small style="color:var(--muted)">${esc((r.by && (r.by.name || r.by.id)) || '—')} · ${esc(fmtDate(r.created_at))}</small></td>
        <td><div class="ws-row-act"><button type="button" class="btn sm green rip" data-approve="${esc(String(r.id))}" data-ws="${esc(r.workspace_id)}" data-plan="${esc(r.plan)}">${esc(tx('reqApprove', { p: lbl(PLAN, r.plan) }))}</button><button type="button" class="btn sm outline" data-decline="${esc(String(r.id))}">${esc(tx('reqDecline'))}</button></div></td>
      </tr>`).join('')}</tbody></table></div>` : `<div class="empty">${esc(tx('reqNone'))}</div>`}
    </section>
    <section class="card stack fu" style="padding:18px 0 6px">
      <div class="panel-h" style="padding:0 22px"><h2>${esc(tx('wsListH'))}</h2><span class="num" style="color:var(--muted);font-size:13px">${fmtNum((d.workspaces || []).length)}</span></div>
      <div class="scroll-x"><table class="data"><thead><tr><th>${esc(tx('colWs'))}</th><th>${esc(tx('colPlan'))}</th><th>${esc(tx('colMembers'))}</th><th>${esc(tx('colUse'))}</th><th>${esc(tx('colInv'))}</th><th>${esc(tx('colMade'))}</th></tr></thead><tbody>
      ${(d.workspaces || []).map((w) => `<tr>
        <td><b>${esc(w.name)}</b></td>
        <td><select class="select sm" data-plan-ws="${esc(w.id)}" data-cur="${esc(w.plan)}" aria-label="${esc(tx('wsPlanL'))} · ${esc(w.name)}">${planOpts(w.plan)}</select></td>
        <td><div class="ws-mem">${w.members.length ? w.members.map((m) => `<span class="tag ${m.role === 'owner' ? '' : 'gray'}" title="${esc(m.id || '')}">${esc(m.name || m.id || '—')} · ${esc(wsRole(m.role))}</span>`).join('') : `<span style="color:var(--muted);font-size:13px">${esc(tx('noMembers'))}</span>`}</div></td>
        <td class="ws-use">${esc(tx('uMine'))} <b>${fmtNum(w.mine)}</b>/${fmtNum(w.limits.mine)} · ${esc(tx('uRefs'))} <b>${fmtNum(w.refs)}</b>/${fmtNum(w.limits.refs)}</td>
        <td><div class="ws-row-act" style="justify-content:flex-start"><span class="tag gray">${esc(tx('invOpen', { n: fmtNum((w.invites || []).filter((i) => i.kind === 'join').length) }))}</span><button type="button" class="btn sm outline" data-owner-link="${esc(w.id)}" data-name="${esc(w.name)}">${esc(tx('ownerLink'))}</button></div><div data-link-out="${esc(w.id)}"></div></td>
        <td class="num">${esc(fmtDate(w.created_at))}</td>
      </tr>`).join('')}
      </tbody></table></div>
    </section>`;
  const f = v.querySelector('#wsNew');
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = f.elements.name.value.trim();
    if (!name) { f.elements.name.focus(); return; }
    const b = f.querySelector('button');
    b.disabled = true;
    const note = f.elements.note.value.trim();
    const out = await fn({ action: 'ws_create', name, plan: f.elements.plan.value, note });
    b.disabled = false;
    if (!out.ok) { snack(fnErr(out.error)); return; }
    f.reset();
    const keep = linkBlock(out.url, tx('wsCreated'), note);
    const fresh = await fn({ action: 'ws_list' });
    if (fresh.ok) cache.ws = fresh;
    if (currentRoute() !== 'workspaces') return;
    drawWorkspaces(v);
    v.querySelector('#wsNewOut').innerHTML = keep;
    bindCopy(v);
    copyText(out.url);
  });
  v.querySelectorAll('[data-approve]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const out = await fn({ action: 'ws_plan', ws: b.dataset.ws, plan: b.dataset.plan, request_id: Number(b.dataset.approve) });
    if (!out.ok) { b.disabled = false; snack(fnErr(out.error)); return; }
    snack(tx('reqDone2'));
    viewWorkspaces(v);
  }));
  v.querySelectorAll('[data-decline]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const out = await fn({ action: 'request_set', id: Number(b.dataset.decline), status: 'declined' });
    if (!out.ok) { b.disabled = false; snack(fnErr(out.error)); return; }
    snack(tx('reqDeclined'));
    viewWorkspaces(v);
  }));
  v.querySelectorAll('select[data-plan-ws]').forEach((sel) => sel.addEventListener('change', async () => {
    sel.disabled = true;
    const out = await fn({ action: 'ws_plan', ws: sel.dataset.planWs, plan: sel.value });
    sel.disabled = false;
    if (!out.ok) { sel.value = sel.dataset.cur; snack(fnErr(out.error)); return; }
    sel.dataset.cur = sel.value;
    const w = (cache.ws.workspaces || []).find((x) => x.id === sel.dataset.planWs);
    if (w) w.plan = sel.value;
    snack(tx('planSaved'));
  }));
  v.querySelectorAll('[data-owner-link]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const out = await fn({ action: 'ws_invite', ws: b.dataset.ownerLink, role: 'owner' });
    b.disabled = false;
    if (!out.ok) { snack(fnErr(out.error)); return; }
    const box = v.querySelector(`[data-link-out="${b.dataset.ownerLink}"]`);
    box.innerHTML = linkBlock(out.url, tx('ownerLinkMade', { n: b.dataset.name }), '');
    bindCopy(box);
    copyText(out.url);
  }));
  bindCopy(v);
}

// ---------- 회원 ----------
async function viewMembers(v) {
  v.innerHTML = loading();
  const [mRes, cRes, wsRes] = await Promise.all([
    sb.from('profiles').select('id,email,display_name,language,plan,role,signup_provider,created_at').order('created_at', { ascending: false }).limit(1000),
    sb.from('channels').select('owner_id,status'),
    fn({ action: 'ws_list' })
  ]);
  if (currentRoute() !== 'members') return;
  if (mRes.error) { v.innerHTML = failBox(); return; }
  if (wsRes.ok) cache.ws = wsRes;
  cache.memWs = {};
  ((cache.ws && cache.ws.workspaces) || []).forEach((w) => w.members.forEach((m) => { (cache.memWs[m.user_id] = cache.memWs[m.user_id] || []).push({ name: w.name, role: m.role }); }));
  cache.members = mRes.data || [];
  cache.chCount = {};
  (cRes.data || []).forEach((c) => { if (c.status === 'connected') cache.chCount[c.owner_id] = (cache.chCount[c.owner_id] || 0) + 1; });

  v.innerHTML = `
    <div class="toolbar">
      <label class="sr" for="mq">${esc(tx('search'))}</label>
      <input class="input" id="mq" type="search" placeholder="${esc(tx('search'))}" value="${esc(st.q)}">
      <span id="mCount" class="num" role="status" style="font-size:14px;color:var(--ink-2)"></span>
    </div>
    <section class="card fu" style="padding:8px 0" id="mt"></section>`;
  document.getElementById('mq').addEventListener('input', (e) => { st.q = e.target.value; drawMembers(); });
  drawMembers();
}

function drawMembers() {
  const q = st.q.trim().toLowerCase();
  const rows = (cache.members || []).filter((m) => !q || (m.email || '').toLowerCase().includes(q) || (m.display_name || '').toLowerCase().includes(q));
  document.getElementById('mCount').textContent = tx('shown', { n: fmtNum(rows.length) });
  const box = document.getElementById('mt');
  if (!rows.length) { box.innerHTML = `<div class="empty">${esc(tx('none'))}</div>`; return; }
  box.innerHTML = `<div class="scroll-x"><table class="data"><thead><tr><th>${esc(tx('colMember'))}</th><th>${esc(tx('colVia'))}</th><th>${esc(tx('colLang'))}</th><th>${esc(tx('colWsOf'))}</th><th>${esc(tx('colRole'))}</th><th>${esc(tx('colJoined'))}</th></tr></thead><tbody>${rows.map((m) => `
    <tr>
      <td><div class="who"><b>${esc(m.display_name || '—')}</b><small>${esc(emailToId(m.email || ''))}</small></div></td>
      <td>${esc(lbl(PROVIDER, m.signup_provider || 'email'))}</td>
      <td>${esc(lbl(LANG_NAME, m.language))}</td>
      <td><div class="ws-mem">${(cache.memWs[m.id] || []).map((w) => `<span class="tag ${w.role === 'owner' ? '' : 'gray'}">${esc(w.name)} · ${esc(tx('wsrole_' + w.role))}</span>`).join('') || '<span style="color:var(--muted)">—</span>'}</div></td>
      <td>${m.role === 'admin' ? `<span class="tag">${esc(tx('role_admin'))}</span>` : `<span class="tag gray">${esc(tx('role_member'))}</span>`}</td>
      <td class="num">${esc(fmtDate(m.created_at))}</td>
    </tr>`).join('')}</tbody></table></div>`;
}

// ---------- 협업 요청 ----------
async function viewRequests(v) {
  v.innerHTML = loading();
  const { data, error } = await sb.from('partner_requests')
    .select('id,kind,message,status,created_at,profiles(email,display_name)')
    .order('created_at', { ascending: false }).limit(500);
  if (currentRoute() !== 'requests') return;
  if (error) { v.innerHTML = failBox(); return; }
  cache.requests = data || [];
  drawRequests(v);
}

function drawRequests(v) {
  const list = cache.requests || [];
  const count = (k) => (k === 'all' ? list.length : list.filter((r) => r.status === k).length);
  const shown = st.req === 'all' ? list : list.filter((r) => r.status === st.req);
  const kindTag = (k) => (k === 'music' ? 'tag' : k === 'ad' ? 'tag teal' : 'tag gray');
  v.innerHTML = `
    <div class="toolbar" role="group" aria-label="${esc(tx('filter'))}">${[...STATUSES, 'all'].map((k) => chip(`${tx(k === 'all' ? 'all' : 'st_' + k)} ${fmtNum(count(k))}`, st.req === k, `data-f="${k}"`)).join('')}</div>
    <div class="stack" style="gap:12px">${shown.length ? shown.map((r, i) => {
      const p = r.profiles || {};
      return `<article class="card req fu" style="animation-delay:${Math.min(i, 8) * 40}ms">
        <div class="stack" style="gap:8px">
          <div class="meta"><span class="${kindTag(r.kind)}">${esc(tx('kind_' + r.kind))}</span><b style="color:var(--ink)">${esc(p.display_name || '—')}</b><span>${esc(p.email || '')}</span><span class="num">${esc(fmtDate(r.created_at))}</span></div>
          <p>${r.message ? esc(r.message) : `<span style="color:var(--ink-2)">${esc(tx('noMsg'))}</span>`}</p>
        </div>
        <select class="select sm" data-id="${esc(r.id)}" aria-label="${esc(tx('statusChange'))}">${STATUSES.map((s) => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${esc(tx('st_' + s))}</option>`).join('')}</select>
      </article>`;
    }).join('') : `<div class="empty">${esc(tx('none'))}</div>`}</div>`;
  v.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { st.req = b.dataset.f; drawRequests(v); }));
  v.querySelectorAll('select[data-id]').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const row = list.find((x) => x.id === sel.dataset.id);
      const prev = row.status;
      sel.disabled = true;
      const { error } = await sb.from('partner_requests').update({ status: sel.value }).eq('id', row.id);
      sel.disabled = false;
      if (error) { sel.value = prev; snack(tx('saveFail')); return; }
      row.status = sel.value;
      snack(tx('statusSaved'));
      drawRequests(v);
    });
  });
}

// ---------- 문의 ----------
async function viewInquiries(v) {
  v.innerHTML = loading();
  const { data, error } = await sb.from('inquiries')
    .select('id,email,language,message,created_at,handled')
    .order('created_at', { ascending: false }).limit(500);
  if (currentRoute() !== 'inquiries') return;
  if (error) { v.innerHTML = failBox(); return; }
  cache.inquiries = data || [];
  drawInquiries(v);
}

function drawInquiries(v) {
  const list = cache.inquiries || [];
  const pick = { open: (r) => !r.handled, done: (r) => r.handled, all: () => true };
  const shown = list.filter(pick[st.inq]);
  v.innerHTML = `
    <div class="toolbar" role="group" aria-label="${esc(tx('filter'))}">${['open', 'done', 'all'].map((k) => chip(`${tx(k)} ${fmtNum(list.filter(pick[k]).length)}`, st.inq === k, `data-f="${k}"`)).join('')}</div>
    <div class="stack" style="gap:12px">${shown.length ? shown.map((r, i) => `
      <article class="card req fu" style="animation-delay:${Math.min(i, 8) * 40}ms">
        <div class="stack" style="gap:8px">
          <div class="meta"><b style="color:var(--ink)">${esc(r.email)}</b>${r.language ? `<span class="tag gray">${esc(lbl(LANG_NAME, r.language))}</span>` : ''}<span class="num">${esc(fmtDate(r.created_at))}</span>${r.handled ? `<span class="tag teal">${esc(tx('done'))}</span>` : ''}</div>
          <p>${esc(r.message || '')}</p>
          <div class="ws-row-act" style="justify-content:flex-start">${safeEmail(r.email) ? `<a class="btn sm outline rip" href="mailto:${esc(r.email)}?subject=${encodeURIComponent(tx('replySubj'))}">${esc(tx('reply'))}</a>` : ''}<button type="button" class="btn sm rip" data-inq="${esc(String(r.id))}">${esc(tx('inqMake'))}</button></div>
          <div class="ws-inq" data-inq-box="${esc(String(r.id))}"></div>
        </div>
        <div style="display:flex;align-items:center;gap:4px"><span style="font-size:13px;color:var(--ink-2)">${esc(tx('done'))}</span><button type="button" class="switch" role="switch" aria-checked="${!!r.handled}" aria-label="${esc(tx('markDone'))}" data-id="${esc(String(r.id))}"><span class="tr"></span><span class="kn"></span></button></div>
      </article>`).join('') : `<div class="empty">${esc(tx('none'))}</div>`}</div>`;
  v.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { st.inq = b.dataset.f; drawInquiries(v); }));
  v.querySelectorAll('[data-inq]').forEach((b) => b.addEventListener('click', () => {
    const row = list.find((x) => String(x.id) === b.dataset.inq);
    const box = v.querySelector(`[data-inq-box="${b.dataset.inq}"]`);
    const guess = String(row.email || '').split('@')[0].slice(0, 60);
    box.innerHTML = `<form class="ws-form fu" novalidate><label class="grow">${esc(tx('wsNameL'))}<input class="input" name="name" maxlength="60" value="${esc(guess)}" autocomplete="off"></label><label>${esc(tx('wsPlanL'))}<select class="select" name="plan">${planOpts('free')}</select></label><button class="btn rip" type="submit">${esc(tx('wsCreate'))}</button></form>`;
    const f = box.querySelector('form');
    f.elements.name.select();
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = f.elements.name.value.trim();
      if (!name) { f.elements.name.focus(); return; }
      const sb2 = f.querySelector('button');
      sb2.disabled = true;
      const out = await fn({ action: 'ws_create', name, plan: f.elements.plan.value, note: row.email, inquiry_id: Number(row.id) });
      sb2.disabled = false;
      if (!out.ok) { snack(fnErr(out.error)); return; }
      row.handled = true;
      cache.ws = null;
      box.innerHTML = linkBlock(out.url, tx('inqMade'), row.email);
      bindCopy(box);
      copyText(out.url);
    });
  }));
  v.querySelectorAll('.switch[data-id]').forEach((sw) => {
    sw.addEventListener('click', async () => {
      const row = list.find((x) => String(x.id) === sw.dataset.id);
      const next = !row.handled;
      sw.setAttribute('aria-checked', String(next));
      sw.disabled = true;
      const { error } = await sb.from('inquiries').update({ handled: next }).eq('id', row.id);
      sw.disabled = false;
      if (error) { sw.setAttribute('aria-checked', String(row.handled)); snack(tx('saveFail')); return; }
      row.handled = next;
      snack(tx('doneSaved'));
      setTimeout(() => drawInquiries(v), 450);
    });
  });
}

// ---------- 접근 막기 ----------
function deny() {
  renderChrome(false);
  setTitle(tx('denyH'));
  document.getElementById('view').innerHTML = `
    <section class="card stack fu" style="gap:12px;max-width:560px">
      <h2 style="margin:0;font-size:22px">${esc(tx('denyH'))}</h2>
      <p style="margin:0;color:var(--ink-2);line-height:1.7">${esc(tx('denyP'))}</p>
      <a class="btn rip" href="/app" style="align-self:flex-start">${esc(tx('back'))}</a>
    </section>`;
}

// ---------- 운영 준비: 관리자 권한 확인 뒤에 읽기 요청만 실행 ----------
async function viewOperations(v) {
  v.innerHTML = loading();
  const [authResult, overviewResult] = await Promise.allSettled([
    fetch(SUPABASE_URL + '/auth/v1/settings', { headers: { apikey: SUPABASE_KEY } })
      .then((response) => {
        if (!response.ok) throw new Error('Auth settings unavailable');
        return response.json();
      }),
    sb.rpc('radar_overview').then(({ data, error }) => {
      if (error) throw error;
      return data;
    })
  ]);
  if (currentRoute() !== 'operations') return;
  const copy = OPERATIONS[lang] || OPERATIONS.ko;
  const auth = authResult.status === 'fulfilled' ? authResult.value : null;
  const overview = overviewResult.status === 'fulfilled' ? overviewResult.value : null;
  const count = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? fmtNum(value) : '—';
  const time = (value) => value && Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  const firstAt = Date.parse(overview?.first_at || '');
  const lastAt = Date.parse(overview?.last_at || '');
  const minutes = Number.isFinite(firstAt) && Number.isFinite(lastAt) && lastAt >= firstAt
    ? Math.floor((lastAt - firstAt) / 60000) : null;
  const providerState = (name) => {
    if (!auth?.external) return [copy.unknown, 'tag gray'];
    if (auth.external[name] === true) return [copy.enabled, 'tag teal'];
    if (auth.external[name] === false) return [copy.disabled, 'tag gray'];
    return [copy.pending, 'tag gray'];
  };
  const providers = ['google', 'kakao', 'naver', 'email'].map((name) => {
    const [state, cls] = providerState(name);
    return `<tr><td>${esc(lbl(PROVIDER, name))}</td><td><span class="${cls}">${esc(state)}</span></td></tr>`;
  }).join('');
  const collection = [
    [copy.channels, count(overview?.channels?.total)], [copy.shorts, count(overview?.shorts)],
    [copy.longs, count(overview?.longs)], [copy.first, time(overview?.first_at)],
    [copy.last, time(overview?.last_at)], [copy.observed, minutes == null ? '—' : copy.minutes.replace('{n}', fmtNum(minutes))]
  ];
  const integrations = ['CNOL Music', 'CNOL AD', 'PPL', 'Instagram', 'TikTok'];
  v.innerHTML = `<div class="stack" style="gap:20px">
    <p style="margin:0;color:var(--ink-2)">${esc(copy.intro)}</p>
    ${(authResult.status === 'rejected' || overviewResult.status === 'rejected') ? `<div class="empty" role="alert">${esc(copy.failed)}</div>` : ''}
    <section class="card stack" style="gap:12px;padding:20px"><h2 style="margin:0;font-size:18px">${esc(copy.auth)}</h2>
      <div class="scroll-x"><table class="data"><thead><tr><th>${esc(copy.service)}</th><th>${esc(copy.state)}</th></tr></thead><tbody>${providers}</tbody></table></div>
      <p style="margin:0;color:var(--ink-2);font-size:13px">${esc(copy.authNote)}</p>
    </section>
    <section class="card stack" style="gap:12px;padding:20px"><h2 style="margin:0;font-size:18px">${esc(copy.publicData)}</h2>
      <div class="scroll-x"><table class="data"><tbody>${collection.map(([label, value]) => `<tr><th>${esc(label)}</th><td class="num">${esc(value)}</td></tr>`).join('')}</tbody></table></div>
      <p style="margin:0;color:var(--ink-2);font-size:13px">${esc(copy.coverage)}</p>
    </section>
    <section class="card stack" style="gap:12px;padding:20px"><h2 style="margin:0;font-size:18px">${esc(copy.external)}</h2>
      <div class="scroll-x"><table class="data"><thead><tr><th>${esc(copy.service)}</th><th>${esc(copy.state)}</th></tr></thead><tbody>${integrations.map((name) => `<tr><td>${esc(name)}</td><td><span class="tag gray">${esc(copy.deferred)}</span></td></tr>`).join('')}</tbody></table></div>
      <p style="margin:0;color:var(--ink-2);font-size:13px">${esc(copy.externalNote)}</p>
    </section>
    <button type="button" class="btn outline rip" id="readinessRetry" style="align-self:flex-start">${esc(copy.retry)}</button>
  </div>`;
  v.querySelector('#readinessRetry').addEventListener('click', () => { viewOperations(v); });
}

async function init() {
  const session = await requireSession();
  if (!session) return;
  user = session.user;
  const [pRes, aRes] = await Promise.all([
    sb.from('profiles').select('id,email,display_name,language,role').eq('id', user.id).maybeSingle(),
    sb.rpc('is_admin')
  ]);
  me = pRes.data || null;
  if (me && D[me.language]) lang = me.language;
  if (!aRes.data) { deny(); return; }
  window.addEventListener('hashchange', route);
  route();
}

init();
