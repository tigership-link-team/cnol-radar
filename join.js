// CNOL RADAR 초대 링크 — 받은 사람이 아이디 · 비밀번호를 직접 정해 워크스페이스에 들어와요 (메일 인증 없이)
// · 링크 코드(#code=…)는 주소창에서 바로 지우고 이 탭에서만 기억해요 (기록 · 공유에 남지 않게)
// · 이미 로그인한 계정이면 그 계정으로 바로 들어갈 수 있어요
// · 비밀번호 다시 정하기 링크도 같은 화면에서 처리해요
import { sb, getLang, setLang, getSession, idToEmail } from '/common.js?v=15';

const L = {
  ko: {
    doc: '초대', checking: '초대 링크를 확인하는 중이에요…',
    badBadge: '링크 확인', badT: '쓸 수 없는 링크예요', badP: '링크가 만료됐거나 이미 쓰인 링크예요. 보낸 분께 새 링크를 받아 주세요.', badNet: '연결이 잠시 끊겼어요. 새로고침해 주세요.', toLogin: '로그인 화면으로',
    roleAs: '{r} 권한으로 초대', joinT: '{w}에 초대받았어요', joinSub: '아이디와 비밀번호만 정하면 바로 함께 쓸 수 있어요.', joinSubBy: '{n}님이 함께 쓰자고 초대했어요. 아이디와 비밀번호만 정하면 바로 시작해요.',
    role_owner: '대표', role_editor: '편집', role_viewer: '보기 전용',
    roleHelp_owner: '팀원 초대 · 역할 · 요금제까지 모두 관리해요', roleHelp_editor: '채널 · 소재 보드 · 찾기를 바꿀 수 있어요', roleHelp_viewer: '데이터를 보기만 해요 · RADAR에게 묻기는 돼요',
    expires: '{d}까지 한 번 쓸 수 있어요', seatFull: '이 워크스페이스 자리가 다 찼어요. 대표에게 요금제를 올려 달라고 해 주세요.',
    asMe: '이 계정으로 들어가기', orNew: '또는', other: '다른 아이디로 새로 만들기',
    name: '이름 (팀원에게 보여요)', nameHint: '비워 두면 아이디로 보여요', id: '아이디', idHint: '영문 소문자 · 숫자 · . _ - 로 3~30자 · 로그인할 때 써요',
    pw: '비밀번호', pw2: '비밀번호 한 번 더', newPw: '새 비밀번호',
    ck1: '8자 이상', ck2: '쉬운 비밀번호가 아니에요 (1234 · password · 아이디 포함은 안 돼요)', ck3: '두 칸이 같아요',
    agreeA: '', terms: '이용약관', agreeB: '과 ', privacy: '개인정보처리방침', agreeC: '에 동의해요 (필수)',
    joinBtn: '가입하고 시작하기', joinNote: '비밀번호는 암호화해서 저장돼요. 잊어버리면 대표에게 비밀번호 링크를 받아 다시 정할 수 있어요.',
    eId: '아이디는 영문 소문자 · 숫자 · . _ - 로 3~30자예요. (admin처럼 쓸 수 없는 아이디도 있어요)', eTaken: '이미 쓰는 아이디예요. 다른 아이디로 정해 주세요.',
    eShort: '비밀번호는 8자 이상이어야 해요.', eWeak: '너무 쉬운 비밀번호예요. 다른 비밀번호로 정해 주세요.', eLong: '비밀번호가 너무 길어요 (72자까지).',
    eSeat: '자리가 다 찼어요. 대표에게 요금제를 올려 달라고 해 주세요.', eUnauth: '로그인이 풀렸어요. 새 아이디를 만들거나 다시 로그인해 주세요.', eFail: '들어가지 못했어요. 잠시 뒤에 다시 해 주세요.', eAgree: '약관에 동의해 주세요.',
    resetBadge: '비밀번호 다시 정하기', resetT: '새 비밀번호를 정해 주세요', resetSub: '{id} 계정의 비밀번호를 새로 정해요. 이 링크는 한 번만 쓸 수 있어요.', resetBtn: '비밀번호 정하고 들어가기',
    doneBadge: '준비됐어요', doneT: '{w}에 들어왔어요', doneP: '아래 버튼으로 시작하세요. 다음부터는 로그인 화면에서 아이디 ‘{id}’를 넣고 들어오면 돼요.', doneReset: '비밀번호를 바꿨어요', doneResetP: '다음부터 새 비밀번호로 로그인하세요.', go: '시작하기',
    signing: '들어가는 중이에요…',
    sideH: '팀이 함께 쓰는 소재 에이전트', sideP: '지켜보는 채널의 공개 데이터를 매시간 모아, 지금 뜨는 영상과 다음에 찍을 소재를 함께 봐요.',
    pt1h: '같은 시간 대비 속도', pt1: '올린 지 몇 시간 만에 평소보다 빨리 크는 영상을 바로 알려요',
    pt2h: '링크는 한 번만', pt2: '초대 링크는 한 사람이 한 번만 쓸 수 있고, 비밀번호는 암호화해서 저장해요',
    pt3h: 'RADAR에게 묻기', pt3: '지금 뭐가 떴는지, 내 채널이 어떤지 말로 물어보세요',
    fine: '유튜브 공식 API로 받은 공개 데이터만 써요 · 에이치알컴퍼니', home: '소개 페이지', show: '비밀번호 보기', hide: '비밀번호 숨기기'
  },
  en: {
    doc: 'Invite', checking: 'Checking your invite link…',
    badBadge: 'Link check', badT: 'This link can’t be used', badP: 'It has expired or was already used. Please ask the sender for a new link.', badNet: 'The connection dropped. Please refresh.', toLogin: 'Go to sign in',
    roleAs: 'Invited as {r}', joinT: 'You’re invited to {w}', joinSub: 'Pick an ID and password and you can start right away.', joinSubBy: '{n} invited you to work together. Pick an ID and password to get started.',
    role_owner: 'Owner', role_editor: 'Editor', role_viewer: 'Viewer',
    roleHelp_owner: 'Manages invites, roles and the plan', roleHelp_editor: 'Can change channels, the idea board and searches', roleHelp_viewer: 'View only · can still ask RADAR',
    expires: 'Works once until {d}', seatFull: 'This workspace has no free seats. Ask the owner to upgrade the plan.',
    asMe: 'Join with this account', orNew: 'or', other: 'Create a new ID instead',
    name: 'Name (shown to teammates)', nameHint: 'Leave empty to show your ID', id: 'ID', idHint: '3–30 lowercase letters, numbers, . _ - · used to sign in',
    pw: 'Password', pw2: 'Password again', newPw: 'New password',
    ck1: 'At least 8 characters', ck2: 'Not an easy password (no 1234, password, or your ID)', ck3: 'Both fields match',
    agreeA: 'I agree to the ', terms: 'Terms', agreeB: ' and ', privacy: 'Privacy Policy', agreeC: ' (required)',
    joinBtn: 'Sign up and start', joinNote: 'Your password is stored encrypted. If you forget it, ask the owner for a password link.',
    eId: 'Use 3–30 lowercase letters, numbers, . _ - (some IDs like admin are reserved).', eTaken: 'That ID is taken. Please choose another.',
    eShort: 'Use at least 8 characters.', eWeak: 'That password is too easy. Please choose another.', eLong: 'That password is too long (72 max).',
    eSeat: 'No free seats. Ask the owner to upgrade the plan.', eUnauth: 'You were signed out. Create a new ID or sign in again.', eFail: 'Couldn’t join. Please try again shortly.', eAgree: 'Please agree to the terms.',
    resetBadge: 'Reset password', resetT: 'Choose a new password', resetSub: 'Set a new password for {id}. This link works only once.', resetBtn: 'Set password and sign in',
    doneBadge: 'All set', doneT: 'You joined {w}', doneP: 'Start with the button below. Next time, sign in with the ID {id}.', doneReset: 'Password changed', doneResetP: 'Sign in with your new password next time.', go: 'Start',
    signing: 'Signing you in…',
    sideH: 'A topic agent your team shares', sideP: 'We collect public data from the channels you track every hour so your team sees what’s rising now and what to make next.',
    pt1h: 'Pace at the same age', pt1: 'Know within hours when a video is growing faster than usual',
    pt2h: 'One-time links', pt2: 'Each invite link works once for one person, and passwords are stored encrypted',
    pt3h: 'Ask RADAR', pt3: 'Ask in plain words what’s rising or how your channel is doing',
    fine: 'Uses only public data from the official YouTube API · HR Company', home: 'About CNOL RADAR', show: 'Show password', hide: 'Hide password'
  },
  ja: {
    doc: '招待', checking: '招待リンクを確認しています…',
    badBadge: 'リンクの確認', badT: '使えないリンクです', badP: 'リンクの期限が切れたか、すでに使われています。送った方に新しいリンクをもらってください。', badNet: '接続が切れました。再読み込みしてください。', toLogin: 'ログイン画面へ',
    roleAs: '{r}として招待', joinT: '{w}に招待されました', joinSub: 'IDとパスワードを決めるだけで、すぐ一緒に使えます。', joinSubBy: '{n}さんから招待が届きました。IDとパスワードを決めるとすぐ始められます。',
    role_owner: 'オーナー', role_editor: '編集', role_viewer: '閲覧のみ',
    roleHelp_owner: '招待・役割・プランまですべて管理します', roleHelp_editor: 'チャンネル・ネタボード・検索を変更できます', roleHelp_viewer: '閲覧のみ・RADARへの質問はできます',
    expires: '{d}まで1回だけ使えます', seatFull: 'このワークスペースの席が埋まっています。オーナーにプランを上げてもらってください。',
    asMe: 'このアカウントで参加', orNew: 'または', other: '別のIDを新しく作る',
    name: '名前（メンバーに表示）', nameHint: '空欄ならIDが表示されます', id: 'ID', idHint: '英小文字・数字・. _ - で3〜30文字・ログインに使います',
    pw: 'パスワード', pw2: 'パスワード（確認）', newPw: '新しいパスワード',
    ck1: '8文字以上', ck2: '簡単なパスワードではない（1234・password・IDを含むものは不可）', ck3: '2つの欄が一致',
    agreeA: '', terms: '利用規約', agreeB: 'と', privacy: 'プライバシーポリシー', agreeC: 'に同意します（必須）',
    joinBtn: '登録して始める', joinNote: 'パスワードは暗号化して保存されます。忘れた場合はオーナーにパスワードリンクをもらってください。',
    eId: 'IDは英小文字・数字・. _ - で3〜30文字です（adminなど使えないIDもあります）。', eTaken: 'そのIDは使われています。別のIDにしてください。',
    eShort: 'パスワードは8文字以上にしてください。', eWeak: '簡単すぎるパスワードです。別のパスワードにしてください。', eLong: 'パスワードが長すぎます（72文字まで）。',
    eSeat: '席が埋まっています。オーナーにプランを上げてもらってください。', eUnauth: 'ログインが切れました。新しいIDを作るか、もう一度ログインしてください。', eFail: '参加できませんでした。しばらくしてからお試しください。', eAgree: '規約に同意してください。',
    resetBadge: 'パスワード再設定', resetT: '新しいパスワードを決めてください', resetSub: '{id} のパスワードを新しく決めます。このリンクは1回だけ使えます。', resetBtn: 'パスワードを決めてログイン',
    doneBadge: '準備できました', doneT: '{w}に参加しました', doneP: '下のボタンから始めてください。次からはログイン画面でID {id} を使います。', doneReset: 'パスワードを変更しました', doneResetP: '次から新しいパスワードでログインしてください。', go: '始める',
    signing: 'ログインしています…',
    sideH: 'チームで使うネタエージェント', sideP: '追跡中のチャンネルの公開データを毎時集め、今伸びている動画と次に撮るネタを一緒に見ます。',
    pt1h: '同じ経過時間での速度', pt1: '投稿から数時間で、いつもより速く伸びている動画をすぐ知らせます',
    pt2h: 'リンクは1回だけ', pt2: '招待リンクは1人が1回だけ使えて、パスワードは暗号化して保存します',
    pt3h: 'RADARに聞く', pt3: '今なにが伸びているか、自分のチャンネルはどうか、言葉で聞いてください',
    fine: 'YouTube公式APIの公開データのみ使います · HR Company', home: '紹介ページ', show: 'パスワードを表示', hide: 'パスワードを隠す'
  }
};

let lang = getLang();
const tx = (k, v) => { let s = (L[lang] && L[lang][k]) ?? L.ko[k] ?? k; if (v) for (const x of Object.keys(v)) s = s.split('{' + x + '}').join(v[x]); return s; };
const $ = (id) => document.getElementById(id);
const EYE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const ID_RE = /^[a-z0-9][a-z0-9._-]{2,29}$/;
const RESERVED = new Set(['hrcompany', 'admin', 'administrator', 'root', 'support', 'help', 'cnol', 'cnolradar', 'radar', 'system', 'owner', 'staff', 'official', 'youtube', 'google',
  'test', 'null', 'undefined', 'api', 'www', 'mail', 'master', 'manager', 'operator']);
const WEAK = new Set(['password', 'password1', 'password12', 'password123', 'passw0rd', 'qwerty', 'qwerty12', 'qwerty123', 'qwertyui', 'qwer1234', 'asdf1234', 'asdfasdf', 'zxcvbnm1',
  '1q2w3e4r', '1q2w3e4r5t', '1qaz2wsx', 'abcd1234', 'abc12345', 'abcd12345', 'iloveyou', 'admin123', 'admin1234', 'administrator', 'letmein1', 'welcome1', 'sunshine', 'princess',
  'football', 'baseball', '11111111', '00000000', '12341234', '12121212', '87654321', 'cnolradar', 'cnol1234', 'radar1234', 'youtube1']);
function weak(pw, id) {
  const low = pw.toLowerCase();
  return WEAK.has(low) || /^(.)\1+$/.test(pw) || '01234567890123456789'.includes(low) || '98765432109876543210'.includes(low)
    || 'abcdefghijklmnopqrstuvwxyz'.includes(low) || 'qwertyuiopasdfghjklzxcvbnm'.includes(low) || (id && id.length >= 3 && low.includes(id.toLowerCase()));
}

// 링크 코드: 주소창에서 바로 지우고 이 탭에서만 기억해요
const hm = /(?:^#|[#&])code=([A-Za-z0-9_-]{24,128})/.exec(location.hash || '');
let code = hm ? hm[1] : null;
try { if (code) sessionStorage.setItem('radar.join', code); else code = sessionStorage.getItem('radar.join'); } catch (e) { /* 저장 못 해도 이번엔 돼요 */ }
if (hm) history.replaceState(null, '', '/join');
const forget = () => { try { sessionStorage.removeItem('radar.join'); } catch (e) { /* 무시 */ } };

let inv = null;
let session = null;
let cards = 'loadCard';

function apply() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-l]').forEach((el) => { el.textContent = tx(el.dataset.l); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.querySelectorAll('[data-eye]').forEach(eyeIcon);
  $('agreeTxt').innerHTML = `${tx('agreeA')}<a href="/terms" target="_blank" rel="noopener">${tx('terms')}</a>${tx('agreeB')}<a href="/privacy" target="_blank" rel="noopener">${tx('privacy')}</a>${tx('agreeC')}`;
  document.title = tx('doc') + ' · CNOL RADAR';
  if (inv) paint();
}
function eyeIcon(b) {
  const on = $(b.dataset.eye).type === 'text';
  b.innerHTML = on ? EYE_OFF : EYE;
  b.setAttribute('aria-label', tx(on ? 'hide' : 'show'));
  b.setAttribute('aria-pressed', String(on));
}
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; setLang(lang); apply(); checkJoin(); checkReset(); }));
document.querySelectorAll('[data-eye]').forEach((b) => b.addEventListener('click', () => {
  const inp = $(b.dataset.eye);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  eyeIcon(b);
  inp.focus();
}));
function show(id) {
  cards = id;
  ['loadCard', 'badCard', 'joinCard', 'resetCard', 'doneCard'].forEach((k) => { $(k).hidden = k !== id; });
}
function busy(btn, on) {
  btn.disabled = on;
  if (on) { btn.dataset.html = btn.innerHTML; btn.innerHTML = '<span class="spin" aria-hidden="true"></span>'; }
  else if (btn.dataset.html) { btn.innerHTML = btn.dataset.html; apply(); }
}
function say(el, text, cls = 'err') { el.className = 'msg ' + cls; el.textContent = text || ''; }
async function fnCall(body) {
  try {
    const { data, error } = await sb.functions.invoke('radar', { body });
    if (!error) return data || { ok: false, error: 'EMPTY' };
    let c = 'NET';
    try { const j = await error.context?.json?.(); if (j?.error) c = j.error; } catch (e) { /* 그대로 */ }
    return { ok: false, error: c };
  } catch (e) { return { ok: false, error: 'NET' }; }
}
const errMsg = (c) => ({ BAD_LOGIN_ID: 'eId', ID_TAKEN: 'eTaken', PW_SHORT: 'eShort', PW_WEAK: 'eWeak', PW_LONG: 'eLong', SEAT_FULL: 'eSeat', UNAUTHORIZED: 'eUnauth' }[c] || 'eFail');
const fmtDay = (iso) => new Date(iso).toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });

function paint() {
  if (inv.kind === 'reset') {
    $('resetSub').textContent = tx('resetSub', { id: inv.id || '' });
    $('rId').value = inv.id || '';
    return;
  }
  const role = tx('role_' + inv.role);
  $('roleBadge').textContent = tx('roleAs', { r: role });
  $('jh').textContent = tx('joinT', { w: inv.workspace });
  $('joinSub').textContent = inv.inviter ? tx('joinSubBy', { n: inv.inviter }) : tx('joinSub');
  $('invBox').innerHTML = '';
  const b = document.createElement('b'); b.textContent = inv.workspace;
  const r = document.createElement('span'); r.textContent = `${role} · ${tx('roleHelp_' + inv.role)}`;
  const d = document.createElement('span'); d.textContent = tx('expires', { d: fmtDay(inv.expires_at) });
  $('invBox').append(b, r, d);
  $('seatMsg').hidden = !inv.seat_full;
  $('seatMsg').textContent = tx('seatFull');
  if (session) {
    const id = String(session.user?.email || '').replace(/@cnol-radar\.vercel\.app$/, '');
    $('meAv').textContent = (id || '?').slice(0, 1).toUpperCase();
    $('meName').textContent = id;
    $('meId').textContent = session.user?.email && /@cnol-radar\.vercel\.app$/.test(session.user.email) ? '' : session.user.email;
  }
}

function checkJoin() {
  if (cards !== 'joinCard') return false;
  const id = $('jId').value.trim().toLowerCase();
  const a = $('jPw').value, b = $('jPw2').value;
  const c1 = a.length >= 8 && a.length <= 72, c2 = a.length > 0 && !weak(a, id), c3 = a.length > 0 && a === b;
  $('c1').classList.toggle('on', c1);
  $('c2').classList.toggle('on', c2);
  $('c3').classList.toggle('on', c3);
  const idOk = ID_RE.test(id) && !RESERVED.has(id);
  const ok = idOk && c1 && c2 && c3 && $('jAgree').checked && !(inv && inv.seat_full);
  $('joinBtn').disabled = !ok;
  return ok;
}
function checkReset() {
  if (cards !== 'resetCard') return false;
  const a = $('rPw').value, b = $('rPw2').value;
  const c1 = a.length >= 8 && a.length <= 72, c2 = a.length > 0 && !weak(a, inv?.id || ''), c3 = a.length > 0 && a === b;
  $('r1').classList.toggle('on', c1);
  $('r2').classList.toggle('on', c2);
  $('r3').classList.toggle('on', c3);
  const ok = c1 && c2 && c3;
  $('resetBtn').disabled = !ok;
  return ok;
}
['jId', 'jPw', 'jPw2'].forEach((k) => $(k).addEventListener('input', () => { checkJoin(); say($('joinMsg'), ''); }));
$('jId').addEventListener('blur', () => {
  const id = $('jId').value.trim().toLowerCase();
  $('jId').value = id;
  if (id && (!ID_RE.test(id) || RESERVED.has(id))) say($('joinMsg'), tx('eId'));
});
$('jAgree').addEventListener('change', checkJoin);
['rPw', 'rPw2'].forEach((k) => $(k).addEventListener('input', () => { checkReset(); say($('resetMsg'), ''); }));

async function enter(id, pw, wsName, kind) {
  forget();
  const { error } = await sb.auth.signInWithPassword({ email: idToEmail(id), password: pw });
  if (!error) { location.replace('/app#home'); return; }
  // 계정은 준비됐어요 → 로그인 화면으로 안내
  show('doneCard');
  $('dh').textContent = kind === 'reset' ? tx('doneReset') : tx('doneT', { w: wsName });
  $('doneSub').textContent = kind === 'reset' ? tx('doneResetP') : tx('doneP', { id });
  $('doneGo').setAttribute('href', '/login');
  $('doneGo').dataset.l = 'toLogin';
  $('doneGo').textContent = tx('toLogin');
}

$('joinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('joinMsg');
  if (!$('jAgree').checked) { say(msg, tx('eAgree')); return; }
  if (!checkJoin()) { const id = $('jId').value.trim().toLowerCase(); if (!ID_RE.test(id) || RESERVED.has(id)) say(msg, tx('eId')); return; }
  const id = $('jId').value.trim().toLowerCase();
  const pw = $('jPw').value;
  const btn = $('joinBtn');
  busy(btn, true);
  const out = await fnCall({ action: 'join', code, id, password: pw, name: $('jName').value.trim(), lang });
  if (!out.ok) {
    busy(btn, false);
    checkJoin();
    if (out.error === 'BAD_CODE') { forget(); show('badCard'); return; }
    say(msg, tx(errMsg(out.error)));
    if (out.error === 'ID_TAKEN' || out.error === 'BAD_LOGIN_ID') $('jId').select();
    return;
  }
  say(msg, tx('signing'), 'ok');
  await enter(out.id || id, pw, out.workspace || inv.workspace, 'join');
});
$('asMeBtn').addEventListener('click', async () => {
  const btn = $('asMeBtn');
  busy(btn, true);
  const out = await fnCall({ action: 'join', code, as_me: true });
  if (!out.ok) {
    busy(btn, false);
    if (out.error === 'BAD_CODE') { forget(); show('badCard'); return; }
    say($('joinMsg'), tx(errMsg(out.error)));
    return;
  }
  forget();
  location.replace('/app#home');
});
$('otherBtn').addEventListener('click', async () => {
  try { await sb.auth.signOut({ scope: 'local' }); } catch (e) { /* 그래도 새로 만들어요 */ }
  session = null;
  $('meBox').hidden = true;
  $('joinForm').hidden = false;
  setTimeout(() => $('jName').focus(), 40);
});
$('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!checkReset()) return;
  const pw = $('rPw').value;
  const btn = $('resetBtn');
  busy(btn, true);
  const out = await fnCall({ action: 'join', code, password: pw });
  if (!out.ok) {
    busy(btn, false);
    checkReset();
    if (out.error === 'BAD_CODE') { forget(); show('badCard'); return; }
    say($('resetMsg'), tx(errMsg(out.error)));
    return;
  }
  say($('resetMsg'), tx('signing'), 'ok');
  try { await sb.auth.signOut({ scope: 'local' }); } catch (er) { /* 무시 */ }
  await enter(out.id || inv.id, pw, '', 'reset');
});

// 이 화면에서 다른 초대 링크를 열면(주소의 #만 바뀌면) 새로 확인해요
addEventListener('hashchange', () => { if (/(?:^#|[#&])code=[A-Za-z0-9_-]{24,128}/.test(location.hash)) location.reload(); });

async function start() {
  apply();
  if (!code) { show('badCard'); return; }
  const [peek, s] = await Promise.all([fnCall({ action: 'invite_peek', code }), getSession().catch(() => null)]);
  session = s;
  if (!peek.ok) {
    if (peek.error === 'NET') { const sub = $('badCard').querySelector('.sub'); sub.dataset.l = 'badNet'; sub.textContent = tx('badNet'); }
    else forget();
    show('badCard');
    return;
  }
  inv = peek;
  paint();
  if (inv.kind === 'reset') {
    show('resetCard');
    checkReset();
    setTimeout(() => $('rPw').focus(), 60);
    return;
  }
  show('joinCard');
  if (session && !inv.seat_full) {
    $('meBox').hidden = false;
    $('joinForm').hidden = true;
  } else {
    $('meBox').hidden = true;
    $('joinForm').hidden = false;
    setTimeout(() => $('jName').focus(), 60);
  }
  checkJoin();
}
start();
