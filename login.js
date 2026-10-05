// CNOL RADAR 로그인 — 관리자 ID·비밀번호 로그인, 1회용 링크로 관리자 비밀번호 정하기, 가입 알림 신청
import { sb, getLang, setLang, getSession, idToEmail, safeNext } from '/common.js';

const L = {
  ko: {
    badge: '관리자', title: '로그인', sub: '관리자 계정으로 들어가요. 회원가입은 곧 열려요.', id: '아이디', pw: '비밀번호', login: '로그인',
    show: '비밀번호 보기', hide: '비밀번호 숨기기',
    eEmpty: '아이디와 비밀번호를 넣어 주세요.', eCred: '아이디나 비밀번호가 맞지 않아요.', eMany: '너무 여러 번 시도했어요. 잠시 뒤에 다시 해 주세요.', eNet: '연결이 잠시 끊겼어요. 다시 해 주세요.',
    sBadge: '처음 한 번만', sTitle: '관리자 계정 만들기', sSub: '아이디는 hrcompany예요. 쓸 비밀번호를 직접 정해 주세요. 이 링크는 한 번만 쓸 수 있어요.',
    newPw: '새 비밀번호', newPw2: '새 비밀번호 한 번 더', ck1: '8자 이상', ck2: '쉬운 비밀번호가 아니에요 (1234·password·아이디 포함 등은 안 돼요)', ck3: '두 칸이 같아요',
    sBtn: '비밀번호 정하고 시작하기', sNote: '비밀번호는 암호화해서 저장돼서 누구도 볼 수 없어요. 잊어버리면 새 설정 링크로 다시 정할 수 있어요.',
    eCode: '링크가 만료됐거나 이미 쓰인 링크예요. 새 설정 링크를 받아 주세요.', eShort: '비밀번호는 8자 이상이어야 해요.', eWeak: '너무 쉬운 비밀번호예요. 다른 비밀번호로 정해 주세요.', eAuth: '계정을 만들지 못했어요. 잠시 뒤에 다시 해 주세요.',
    sDone: '비밀번호를 정했어요. 들어가는 중이에요…',
    soonT: '회원가입은 곧 열려요', soonD: '지금은 관리자 계정으로만 쓸 수 있어요. 가입이 열리면 바로 알려 드릴게요.', soonBtn: '알림 받기',
    soonOk: '신청했어요. 가입이 열리면 이 메일로 알려 드릴게요.', soonBad: '이메일 주소를 확인해 주세요.', soonFail: '신청하지 못했어요. 잠시 뒤에 다시 해 주세요.',
    home: '소개 페이지', terms: '이용약관', privacy: '개인정보처리방침', doc: '로그인'
  },
  en: {
    badge: 'Admin', title: 'Sign in', sub: 'Sign in with the admin account. Sign-ups open soon.', id: 'ID', pw: 'Password', login: 'Sign in',
    show: 'Show password', hide: 'Hide password',
    eEmpty: 'Enter your ID and password.', eCred: 'Wrong ID or password.', eMany: 'Too many attempts. Please wait a moment and try again.', eNet: 'The connection dropped. Please try again.',
    sBadge: 'One time only', sTitle: 'Create the admin account', sSub: 'Your ID is hrcompany. Choose your own password. This link works only once.',
    newPw: 'New password', newPw2: 'New password again', ck1: 'At least 8 characters', ck2: 'Not an easy password (no 1234, password, or your ID)', ck3: 'Both fields match',
    sBtn: 'Set password and start', sNote: 'Your password is stored encrypted, so no one can read it. If you forget it, a new setup link lets you set it again.',
    eCode: 'This link has expired or was already used. Please get a new setup link.', eShort: 'Use at least 8 characters.', eWeak: 'That password is too easy. Please choose another.', eAuth: "Couldn't create the account. Please try again shortly.",
    sDone: 'Password set. Signing you in…',
    soonT: 'Sign-ups open soon', soonD: 'Right now only the admin account can sign in. Leave your email and we’ll tell you the moment sign-ups open.', soonBtn: 'Notify me',
    soonOk: 'Done. We’ll email you when sign-ups open.', soonBad: 'Please check the email address.', soonFail: "Couldn't sign you up. Please try again shortly.",
    home: 'About CNOL RADAR', terms: 'Terms', privacy: 'Privacy', doc: 'Sign in'
  },
  ja: {
    badge: '管理者', title: 'ログイン', sub: '管理者アカウントでログインします。会員登録はまもなく開始します。', id: 'ID', pw: 'パスワード', login: 'ログイン',
    show: 'パスワードを表示', hide: 'パスワードを隠す',
    eEmpty: 'IDとパスワードを入力してください。', eCred: 'IDまたはパスワードが違います。', eMany: '試行回数が多すぎます。少し待ってからもう一度お試しください。', eNet: '接続が切れました。もう一度お試しください。',
    sBadge: '最初の1回だけ', sTitle: '管理者アカウントを作成', sSub: 'IDは hrcompany です。使うパスワードをご自身で決めてください。このリンクは1回だけ使えます。',
    newPw: '新しいパスワード', newPw2: '新しいパスワード（確認）', ck1: '8文字以上', ck2: '簡単なパスワードではない（1234・password・IDを含むものは不可）', ck3: '2つの欄が一致',
    sBtn: 'パスワードを決めて開始', sNote: 'パスワードは暗号化して保存されるため、誰にも見えません。忘れた場合は新しい設定リンクで再設定できます。',
    eCode: 'リンクの有効期限が切れたか、すでに使われています。新しい設定リンクを受け取ってください。', eShort: 'パスワードは8文字以上にしてください。', eWeak: '簡単すぎるパスワードです。別のパスワードにしてください。', eAuth: 'アカウントを作成できませんでした。しばらくしてからお試しください。',
    sDone: 'パスワードを設定しました。ログインしています…',
    soonT: '会員登録はまもなく開始', soonD: '現在は管理者アカウントのみ利用できます。登録が始まったらすぐにお知らせします。', soonBtn: '通知を受け取る',
    soonOk: '受け付けました。登録が始まったらこのメールでお知らせします。', soonBad: 'メールアドレスを確認してください。', soonFail: '受け付けできませんでした。しばらくしてからお試しください。',
    home: '紹介ページ', terms: '利用規約', privacy: 'プライバシーポリシー', doc: 'ログイン'
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
  $('soonCard').hidden = true;
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
      $('soonCard').hidden = false;
      $('uid').value = out.id || 'hrcompany';
      say($('loginMsg'), authErr(error));
      return;
    }
    location.replace('/app#home');
  });
  checkSetup();
  setTimeout(() => $('np').focus(), 60);
} else {
  getSession().then((s) => { if (s) location.replace(next); }).catch(() => {});
  setTimeout(() => $('uid').focus(), 60);
}

// ---------- 가입 알림 신청 ----------
let soonSent = false;
$('soonForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('soonMail').value.trim();
  const msg = $('soonMsg');
  if (soonSent) return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) { say(msg, tx('soonBad')); return; }
  const btn = $('soonBtn');
  busy(btn, true);
  const { error } = await sb.from('inquiries').insert({ email, language: lang, message: '[가입 알림] 로그인 화면에서 신청' });
  busy(btn, false);
  if (error) { say(msg, tx('soonFail')); return; }
  soonSent = true;
  btn.disabled = true;
  $('soonMail').disabled = true;
  say(msg, tx('soonOk'), 'ok');
});

apply();
