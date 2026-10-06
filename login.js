// CNOL RADAR 로그인 — 팀원 ID·비밀번호 로그인, 1회용 링크로 관리자 비밀번호 정하기, 사용 신청(→ 관리자가 초대 링크를 보내요)
import { sb, getLang, setLang, getSession, idToEmail, safeNext } from '/common.js';

const L = {
  ko: {
    badge: '팀 로그인', title: '로그인', sub: '아이디(또는 이메일)와 비밀번호로 들어가요.', id: '아이디', pw: '비밀번호', login: '로그인',
    show: '비밀번호 보기', hide: '비밀번호 숨기기', forgot: '비밀번호를 잊었나요?',
    forgotP: '대표에게 설정 › 팀 · 요금제에서 ‘비밀번호 링크’를 받아 주세요. 대표 계정이라면 support@whrcompany.com으로 알려 주세요.',
    eEmpty: '아이디와 비밀번호를 넣어 주세요.', eCred: '아이디나 비밀번호가 맞지 않아요.', eMany: '너무 여러 번 시도했어요. 잠시 뒤에 다시 해 주세요.', eNet: '연결이 잠시 끊겼어요. 다시 해 주세요.',
    sBadge: '처음 한 번만', sTitle: '관리자 계정 만들기', sSub: '아이디는 hrcompany예요. 쓸 비밀번호를 직접 정해 주세요. 이 링크는 한 번만 쓸 수 있어요.',
    newPw: '새 비밀번호', newPw2: '새 비밀번호 한 번 더', ck1: '8자 이상', ck2: '쉬운 비밀번호가 아니에요 (1234·password·아이디 포함 등은 안 돼요)', ck3: '두 칸이 같아요',
    sBtn: '비밀번호 정하고 시작하기', sNote: '비밀번호는 암호화해서 저장돼서 누구도 볼 수 없어요. 잊어버리면 새 설정 링크로 다시 정할 수 있어요.',
    eCode: '링크가 만료됐거나 이미 쓰인 링크예요. 새 설정 링크를 받아 주세요.', eShort: '비밀번호는 8자 이상이어야 해요.', eWeak: '너무 쉬운 비밀번호예요. 다른 비밀번호로 정해 주세요.', eAuth: '계정을 만들지 못했어요. 잠시 뒤에 다시 해 주세요.',
    sDone: '비밀번호를 정했어요. 들어가는 중이에요…',
    startT: '처음이신가요?', startD: '초대 링크를 받았다면 그 링크를 열면 바로 가입돼요. 아직 없다면 사용 신청을 남겨 주세요. 확인한 뒤 초대 링크를 메일로 보내 드려요.',
    orgPh: '회사 또는 채널 이름 (선택)', startBtn: '사용 신청',
    startOk: '신청했어요. 확인한 뒤 {e} 주소로 초대 링크를 보내 드릴게요.', startBad: '이메일 주소를 확인해 주세요.', startFail: '신청하지 못했어요. 잠시 뒤에 다시 해 주세요.',
    sideH: '내 채널 전담 소재 에이전트', sideP: '지켜보는 채널의 공개 데이터를 매시간 모아, 지금 뜨는 영상과 다음에 찍을 소재를 골라 드려요.',
    pt1h: '같은 시간 대비 속도', pt1: '올린 지 몇 시간 만에 평소보다 빨리 크는 영상을 바로 알려요',
    pt2h: '팀이 함께', pt2: '초대 링크로 팀원을 부르고 대표 · 편집 · 보기 전용으로 나눠 써요',
    pt3h: 'RADAR에게 묻기', pt3: '지금 뭐가 떴는지, 내 채널이 어떤지 말로 물어보세요',
    fine: '유튜브 공식 API로 받은 공개 데이터만 써요 · 에이치알컴퍼니',
    home: '소개 페이지', terms: '이용약관', privacy: '개인정보처리방침', doc: '로그인',
    pvT: '로그인 없이 둘러보기', pvD: '개발 중이라 지금은 로그인 없이 대시보드를 볼 수 있어요. 채널 삭제 · 팀 · 폰 알림은 로그인하면 써요.', pvBtn: '대시보드 바로 열기'
  },
  en: {
    badge: 'Team sign-in', title: 'Sign in', sub: 'Sign in with your ID (or email) and password.', id: 'ID', pw: 'Password', login: 'Sign in',
    show: 'Show password', hide: 'Hide password', forgot: 'Forgot your password?',
    forgotP: 'Ask your workspace owner for a “password link” under Settings › Team & plan. If you are the owner, email support@whrcompany.com.',
    eEmpty: 'Enter your ID and password.', eCred: 'Wrong ID or password.', eMany: 'Too many attempts. Please wait a moment and try again.', eNet: 'The connection dropped. Please try again.',
    sBadge: 'One time only', sTitle: 'Create the admin account', sSub: 'Your ID is hrcompany. Choose your own password. This link works only once.',
    newPw: 'New password', newPw2: 'New password again', ck1: 'At least 8 characters', ck2: 'Not an easy password (no 1234, password, or your ID)', ck3: 'Both fields match',
    sBtn: 'Set password and start', sNote: 'Your password is stored encrypted, so no one can read it. If you forget it, a new setup link lets you set it again.',
    eCode: 'This link has expired or was already used. Please get a new setup link.', eShort: 'Use at least 8 characters.', eWeak: 'That password is too easy. Please choose another.', eAuth: "Couldn't create the account. Please try again shortly.",
    sDone: 'Password set. Signing you in…',
    startT: 'New here?', startD: 'If you got an invite link, just open it to sign up. If not, leave a request and we’ll email you an invite link once we’ve checked it.',
    orgPh: 'Company or channel name (optional)', startBtn: 'Request access',
    startOk: 'Request sent. We’ll email an invite link to {e} once we’ve checked it.', startBad: 'Please check the email address.', startFail: "Couldn't send your request. Please try again shortly.",
    sideH: 'Your channel’s own topic agent', sideP: 'We collect public data from the channels you track every hour and pick what’s rising now and what to make next.',
    pt1h: 'Pace at the same age', pt1: 'Know within hours when a video is growing faster than usual',
    pt2h: 'Built for teams', pt2: 'Invite teammates by link and split roles: owner, editor, viewer',
    pt3h: 'Ask RADAR', pt3: 'Ask in plain words what’s rising or how your channel is doing',
    fine: 'Uses only public data from the official YouTube API · HR Company',
    home: 'About CNOL RADAR', terms: 'Terms', privacy: 'Privacy', doc: 'Sign in',
    pvT: 'Look around without signing in', pvD: 'While we build, the dashboard is open without sign-in. Removing channels, team and phone notifications need a sign-in.', pvBtn: 'Open the dashboard'
  },
  ja: {
    badge: 'チームログイン', title: 'ログイン', sub: 'ID（またはメール）とパスワードでログインします。', id: 'ID', pw: 'パスワード', login: 'ログイン',
    show: 'パスワードを表示', hide: 'パスワードを隠す', forgot: 'パスワードを忘れましたか？',
    forgotP: 'オーナーに 設定 › チーム・プラン で「パスワードリンク」をもらってください。オーナーの方は support@whrcompany.com までご連絡ください。',
    eEmpty: 'IDとパスワードを入力してください。', eCred: 'IDまたはパスワードが違います。', eMany: '試行回数が多すぎます。少し待ってからもう一度お試しください。', eNet: '接続が切れました。もう一度お試しください。',
    sBadge: '最初の1回だけ', sTitle: '管理者アカウントを作成', sSub: 'IDは hrcompany です。使うパスワードをご自身で決めてください。このリンクは1回だけ使えます。',
    newPw: '新しいパスワード', newPw2: '新しいパスワード（確認）', ck1: '8文字以上', ck2: '簡単なパスワードではない（1234・password・IDを含むものは不可）', ck3: '2つの欄が一致',
    sBtn: 'パスワードを決めて開始', sNote: 'パスワードは暗号化して保存されるため、誰にも見えません。忘れた場合は新しい設定リンクで再設定できます。',
    eCode: 'リンクの有効期限が切れたか、すでに使われています。新しい設定リンクを受け取ってください。', eShort: 'パスワードは8文字以上にしてください。', eWeak: '簡単すぎるパスワードです。別のパスワードにしてください。', eAuth: 'アカウントを作成できませんでした。しばらくしてからお試しください。',
    sDone: 'パスワードを設定しました。ログインしています…',
    startT: '初めての方', startD: '招待リンクを受け取った方は、そのリンクを開くとすぐ登録できます。まだの方は利用申請を残してください。確認後、招待リンクをメールでお送りします。',
    orgPh: '会社名またはチャンネル名（任意）', startBtn: '利用申請',
    startOk: '申請しました。確認後、{e} に招待リンクをお送りします。', startBad: 'メールアドレスを確認してください。', startFail: '申請できませんでした。しばらくしてからお試しください。',
    sideH: '自分のチャンネル専属のネタエージェント', sideP: '追跡中のチャンネルの公開データを毎時集め、今伸びている動画と次に撮るネタを選びます。',
    pt1h: '同じ経過時間での速度', pt1: '投稿から数時間で、いつもより速く伸びている動画をすぐ知らせます',
    pt2h: 'チームで一緒に', pt2: '招待リンクでメンバーを呼び、オーナー・編集・閲覧のみで分けて使えます',
    pt3h: 'RADARに聞く', pt3: '今なにが伸びているか、自分のチャンネルはどうか、言葉で聞いてください',
    fine: 'YouTube公式APIの公開データのみ使います · HR Company',
    home: '紹介ページ', terms: '利用規約', privacy: 'プライバシーポリシー', doc: 'ログイン',
    pvT: 'ログインせずに見る', pvD: '開発中のため、いまはログインなしでダッシュボードを見られます。チャンネル削除・チーム・スマホ通知はログインすると使えます。', pvBtn: 'ダッシュボードを開く'
  }
};

let lang = getLang();
const tx = (k) => (L[lang] && L[lang][k]) || L.ko[k] || k;
const $ = (id) => document.getElementById(id);
const EYE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

// 1회용 설정 코드는 주소창에서 바로 지워요 (기록·공유에 남지 않게)
const setupMatch = /(?:^#|[#&])setup=([A-Za-z0-9_-]{24,128})/.exec(location.hash || '');
const setupCode = setupMatch ? setupMatch[1] : null;
const next = safeNext(new URLSearchParams(location.search).get('next'), '/app');
if (setupCode) history.replaceState(null, '', '/login');

function apply() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-l]').forEach((el) => { el.textContent = tx(el.dataset.l); });
  document.querySelectorAll('[data-l-ph]').forEach((el) => { el.setAttribute('placeholder', tx(el.dataset.lPh)); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.querySelectorAll('[data-eye]').forEach(eyeIcon);
  document.title = (setupCode ? tx('sTitle') : tx('doc')) + ' · CNOL RADAR';
}
function eyeIcon(b) {
  const on = $(b.dataset.eye).type === 'text';
  b.innerHTML = on ? EYE_OFF : EYE;
  b.setAttribute('aria-label', tx(on ? 'hide' : 'show'));
  b.setAttribute('aria-pressed', String(on));
}
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; setLang(lang); apply(); checkSetup(); }));
document.querySelectorAll('[data-eye]').forEach((b) => b.addEventListener('click', () => {
  const inp = $(b.dataset.eye);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  eyeIcon(b);
  inp.focus();
}));

function busy(btn, on) {
  btn.disabled = on;
  if (on) { btn.dataset.html = btn.innerHTML; btn.innerHTML = '<span class="spin" aria-hidden="true"></span>'; }
  else if (btn.dataset.html) { btn.innerHTML = btn.dataset.html; apply(); }
}
function say(el, text, cls = 'err') { el.className = 'msg ' + cls; el.textContent = text || ''; }
const authErr = (e) => {
  const m = String((e && (e.message || e.code)) || '');
  const st = e && e.status;
  if (st === 429 || /rate|too many/i.test(m)) return tx('eMany');
  if (st === 400 || /invalid login|credentials|not confirmed/i.test(m)) return tx('eCred');
  return tx('eNet');
};

// ---------- 로그인 ----------
$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('uid').value.trim();
  const pw = $('pw').value;
  const msg = $('loginMsg');
  if (!id || !pw) { say(msg, tx('eEmpty')); (id ? $('pw') : $('uid')).focus(); return; }
  say(msg, '');
  const btn = $('loginBtn');
  busy(btn, true);
  try {
    const { error } = await sb.auth.signInWithPassword({ email: idToEmail(id), password: pw });
    if (error) throw error;
    location.replace(next);
  } catch (er) {
    busy(btn, false);
    say(msg, authErr(er));
    $('pw').select();
  }
});

$('forgotLink').addEventListener('click', (e) => {
  e.preventDefault();
  const m = $('forgotMsg');
  m.hidden = !m.hidden;
});

// ---------- 1회용 관리자 계정 만들기 ----------
const WEAK = new Set(['password', 'password1', 'password12', 'password123', 'passw0rd', 'qwerty', 'qwerty12', 'qwerty123', 'qwertyui', 'qwer1234',
  'asdf1234', 'asdfasdf', 'zxcvbnm1', '1q2w3e4r', '1q2w3e4r5t', '1qaz2wsx', 'abcd1234', 'abc12345', 'abcd12345', 'iloveyou', 'admin123', 'admin1234',
  'administrator', 'letmein1', 'welcome1', 'sunshine', 'princess', 'football', 'baseball', '11111111', '00000000', '12341234', '12121212', '87654321',
  'cnolradar', 'cnol1234', 'radar1234', 'youtube1']);
function weak(pw) {
  const low = pw.toLowerCase();
  return WEAK.has(low) || /^(.)\1+$/.test(pw) || '01234567890123456789'.includes(low) || '98765432109876543210'.includes(low)
    || 'abcdefghijklmnopqrstuvwxyz'.includes(low) || 'qwertyuiopasdfghjklzxcvbnm'.includes(low) || low.includes('hrcompany');
}
function checkSetup() {
  if (!setupCode) return false;
  const a = $('np').value, b = $('np2').value;
  const c1 = a.length >= 8 && a.length <= 72, c2 = a.length > 0 && !weak(a), c3 = a.length > 0 && a === b;
  $('ck1').classList.toggle('on', c1);
  $('ck2').classList.toggle('on', c2);
  $('ck3').classList.toggle('on', c3);
  const ok = c1 && c2 && c3;
  $('setupBtn').disabled = !ok;
  return ok;
}
async function fnCall(body) {
  const { data, error } = await sb.functions.invoke('radar', { body });
  if (!error) return data || { ok: false, error: 'EMPTY' };
  let code = 'NET';
  try { const j = await error.context?.json?.(); if (j?.error) code = j.error; } catch (e) { /* 그대로 */ }
  return { ok: false, error: code };
}
if (setupCode) {
  $('loginCard').hidden = true;
  $('startCard').hidden = true;
  $('setupCard').hidden = false;
  ['np', 'np2'].forEach((k) => $(k).addEventListener('input', () => { checkSetup(); say($('setupMsg'), ''); }));
  $('setupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!checkSetup()) return;
    const btn = $('setupBtn');
    const msg = $('setupMsg');
    busy(btn, true);
    const pw = $('np').value;
    const out = await fnCall({ action: 'admin_setup', code: setupCode, password: pw });
    if (!out.ok) {
      busy(btn, false);
      checkSetup();
      say(msg, tx(out.error === 'BAD_CODE' ? 'eCode' : out.error === 'PW_SHORT' ? 'eShort' : out.error === 'PW_WEAK' ? 'eWeak' : out.error === 'NET' ? 'eNet' : 'eAuth'));
      return;
    }
    say(msg, tx('sDone'), 'ok');
    const { error } = await sb.auth.signInWithPassword({ email: idToEmail(out.id || 'hrcompany'), password: pw });
    if (error) {
      // 계정은 만들어졌어요 → 로그인 화면으로
      busy(btn, false);
      $('setupCard').hidden = true;
      $('loginCard').hidden = false;
      $('startCard').hidden = false;
      $('uid').value = out.id || 'hrcompany';
      say($('loginMsg'), authErr(error));
      return;
    }
    location.replace('/app#home');
  });
  checkSetup();
  setTimeout(() => $('np').focus(), 60);
} else {
  getSession().then((s) => {
    if (s) { location.replace(next); return; }
    // 둘러보기 모드(개발 중): 서버가 열어 두면 '대시보드 바로 열기'를 보여 줘요
    fnCall({ action: 'status' }).then((o) => { if (o && o.ok && o.guest) $('previewCard').hidden = false; }).catch(() => {});
  }).catch(() => {});
  setTimeout(() => $('uid').focus(), 60);
}

// ---------- 사용 신청 (관리자가 확인하고 초대 링크를 보내요) ----------
let startSent = false;
$('startForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('startMail').value.trim();
  const org = $('startOrg').value.trim().slice(0, 80);
  const msg = $('startMsg');
  if (startSent) return;
  if ($('startHp').value) { say(msg, tx('startOk').replace('{e}', email), 'ok'); return; } // 자동 입력 봇
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) { say(msg, tx('startBad')); $('startMail').focus(); return; }
  const btn = $('startBtn');
  busy(btn, true);
  const { error } = await sb.from('inquiries').insert({ email, language: lang, message: '[사용 신청] 로그인 화면' + (org ? ' · 회사·채널: ' + org : '') });
  busy(btn, false);
  if (error) { say(msg, tx('startFail')); return; }
  startSent = true;
  btn.disabled = true;
  $('startMail').disabled = true;
  $('startOrg').disabled = true;
  say(msg, tx('startOk').replace('{e}', email), 'ok');
});

apply();
