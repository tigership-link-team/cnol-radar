import { sb, SUPABASE_URL, SUPABASE_KEY, getLang, setLang, snack, getSession } from '/common.js';

const L = {
  ko: { title: '시작하기', sub: '가입은 편한 계정으로 해요. 내 유튜브 채널은 가입 후 채널마다 그 채널의 구글 계정으로 따로 연결해요.', kakao: '카카오로 시작하기', naver: '네이버로 시작하기', google: 'Google로 시작하기', or: '또는 이메일', email: '이메일', send: '로그인 링크 받기', sent: '메일함을 확인해 주세요. 링크를 누르면 바로 들어와요.', agree: '가입하면 아래 약관에 동의하게 돼요.', terms: '이용약관', privacy: '개인정보처리방침', note: '고른 언어로 화면과 브리핑, 알림이 와요. 설정에서 언제든 바꿀 수 있어요.', soonNaver: '네이버 로그인은 곧 열려요. 지금은 카카오, Google, 이메일로 시작해 주세요.', notReady: '이 로그인 방식은 아직 준비 중이에요. 이메일로 먼저 시작해 주세요.', fail: '로그인 링크를 보내지 못했어요. 잠시 후 다시 해주세요.' },
  en: { title: 'Get started', sub: 'Sign up with any account. After that, connect each YouTube channel with the Google account that owns it.', kakao: 'Continue with Kakao', naver: 'Continue with Naver', google: 'Continue with Google', or: 'or with email', email: 'Email', send: 'Email me a sign-in link', sent: 'Check your inbox — the link signs you right in.', agree: 'By signing up you agree to:', terms: 'Terms', privacy: 'Privacy Policy', note: 'Screens, briefings and alerts arrive in the language you pick. Change it anytime in settings.', soonNaver: 'Naver sign-in is coming soon. Please use Kakao, Google or email for now.', notReady: 'This sign-in option is not ready yet. Please start with email.', fail: "We couldn't send the link. Please try again shortly." },
  ja: { title: 'はじめる', sub: '登録はお好きなアカウントで。YouTubeチャンネルは登録後、チャンネルごとにそのGoogleアカウントで連携します。', kakao: 'カカオではじめる', naver: 'NAVERではじめる', google: 'Googleではじめる', or: 'またはメール', email: 'メールアドレス', send: 'ログインリンクを受け取る', sent: 'メールをご確認ください。リンクを押すとすぐにログインできます。', agree: '登録すると以下に同意したものとみなされます。', terms: '利用規約', privacy: 'プライバシーポリシー', note: '選んだ言語で画面・ブリーフィング・通知が届きます。設定でいつでも変更できます。', soonNaver: 'NAVERログインは近日公開です。今はカカオ、Google、メールでお始めください。', notReady: 'このログイン方法はまだ準備中です。メールでお始めください。', fail: 'リンクを送信できませんでした。しばらくしてからもう一度お試しください。' }
};

let lang = getLang();
const tx = (k) => (L[lang] && L[lang][k]) || L.ko[k];

function apply() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-l]').forEach((el) => { el.textContent = tx(el.dataset.l); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}

document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; setLang(lang); apply(); }));

const redirectTo = location.origin + '/app';

// 켜진 로그인 방식만 Supabase로 보내고, 아직 안 켜진 방식은 안내만 해요
let enabled = null;
fetch(SUPABASE_URL + '/auth/v1/settings', { headers: { apikey: SUPABASE_KEY } })
  .then((r) => (r.ok ? r.json() : null))
  .then((j) => { enabled = j && j.external ? j.external : null; })
  .catch(() => {});

async function oauth(provider) {
  if (enabled && enabled[provider] !== true) { snack(tx('notReady')); return; }
  try {
    const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo, queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined } });
    if (error) throw error;
  } catch (e) {
    snack(tx('notReady'));
  }
}

document.getElementById('kakao').addEventListener('click', () => oauth('kakao'));
document.getElementById('google').addEventListener('click', () => oauth('google'));
document.getElementById('naver').addEventListener('click', () => snack(tx('soonNaver')));

document.getElementById('mailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) return;
  const btn = e.submitter;
  if (btn) btn.disabled = true;
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo, data: { language: lang } } });
  if (btn) btn.disabled = false;
  if (error) { snack(tx('fail')); return; }
  const sent = document.getElementById('sent');
  sent.textContent = tx('sent');
  sent.hidden = false;
});

apply();
getSession().then((s) => { if (s) location.replace('/app'); });
