// CNOL RADAR v13 — 폰 · PC 알림(웹 푸시) · 앱으로 설치
// · 설정 › 알림(#notify): 이 기기 알림 켜기 · 시험 알림 · 받을 알림 고르기 · 알림 받는 기기 · 앱으로 설치
// · 서비스 워커(/sw.js)가 푸시를 받아 알림을 띄우고, 누르면 대시보드의 그 화면을 열어요 (대시보드를 닫아도 와요)
// · 서버(radar v10)가 매시간 수집 뒤 새 알림을, 아침 8시 30분에 오늘의 보고를 보내요
// app.js가 mountPush(ctx)로 공용 함수를 넘겨줘요. 문구(TP)는 app.js가 T에 합쳐요.
let C = null;
const e = (s) => C.esc(s);
const t = (k, v) => C.t(k, v);
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (er) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (er) { /* 저장 못 해도 화면은 그대로 */ } }
};

export const TP = {
  ko: {
    tab_notify: '알림',
    guestName: '둘러보기', guestPill: '둘러보기 모드', guestTip: '로그인 없이 보고 있어요. 채널 삭제 · 팀 · 폰 알림 · 비밀번호는 로그인하면 써요.',
    guestCardH: '둘러보기 모드', guestCardP: '개발 중이라 로그인 없이 대시보드를 열어 뒀어요. 보기 · 채널 추가 · 소재 찾기 · 소재 보드는 바로 되고, 채널 삭제 · 팀원 · 초대 링크 · 폰 알림 · 비밀번호는 로그인하면 써요.',
    guestLogin: '로그인', aGuest: '팀 · 요금제 · 폰 알림은 로그인하면 쓸 수 있어요.',
    err_GUEST: '로그인하면 할 수 있어요.', err_GUEST_BUSY: '잠깐 쉬었다가 다시 해 주세요. 로그인 없이 쓰는 동안은 10분에 40번까지예요.',
    nfSub: '터진 영상, 내 채널 소식, 아침 보고를 폰과 컴퓨터로 받아요. 대시보드를 닫아도 와요.',
    devCard: '이 기기', dOn: '이 기기에서 알림을 받고 있어요.', dOff: '이 기기는 알림이 꺼져 있어요.',
    dBtnOn: '이 기기에서 알림 받기', dBtnOff: '이 기기 끄기', dTest: '시험 알림 보내기', dWorking: '잠시만요…',
    dTestSent: '시험 알림을 보냈어요. 몇 초 안에 와요.', dTestNone: '시험 알림이 안 왔다면 휴대폰·컴퓨터의 방해 금지 모드와 브라우저 알림 설정을 확인해 주세요.',
    dDenied: '이 브라우저에서 알림이 막혀 있어요. 주소창 왼쪽 자물쇠 → 알림 → 허용으로 바꾼 뒤 다시 눌러 주세요.',
    dDeniedIOS: '알림이 막혀 있어요. 아이폰 설정 → 알림 → CNOL RADAR에서 알림을 허용해 주세요.',
    dNoSupport: '이 브라우저는 푸시 알림을 받을 수 없어요. 크롬 · 엣지 · 삼성 인터넷 · 파이어폭스 · 사파리(맥)에서 열어 주세요.',
    dIOS: '아이폰 · 아이패드는 앱으로 설치해야 알림이 와요. 아래 \'앱으로 설치\'를 따라 한 뒤, 설치한 앱에서 이 화면을 열어 켜 주세요.',
    dOnSnack: '이 기기에서 알림을 받아요.', dOffSnack: '이 기기 알림을 껐어요.', dFail: '알림을 켜지 못했어요. 잠시 뒤 다시 해 보세요.',
    dGone: '이 기기는 다른 곳에서 빠졌어요. 다시 켜 주세요.',
    prefCard: '받을 알림', prefSub: '이 계정의 모든 기기에 똑같이 적용돼요.',
    pMine: '내 채널 소식', pMineD: '내 영상이 터졌을 때 · 48시간 조회수 급상승 · 급락 · 업로드 공백 · 영상이 안 보일 때',
    pRef: '레퍼런스가 뜨는 중', pRefD: '지켜보는 채널에서 막 터지기 시작한 영상 · 평소보다 크게 터진 영상',
    pBrief: '아침 보고', pBriefD: '매일 아침 8시 30분 · 48시간 조회수와 오늘 만들 소재',
    pQuiet: '밤에는 조용히', pQuietD: '밤 11시 ~ 아침 8시에는 보내지 않아요. 밤사이 소식은 아침 보고가 정리해요.',
    pSaved: '저장했어요.',
    devsCard: '알림 받는 기기', devsSub: '한 계정에 10대까지예요. 120일 넘게 안 연 기기는 저절로 빠져요.', devsNone: '아직 알림을 받는 기기가 없어요.',
    devThis: '이 기기', devAdded: '{d} 등록', devLastOk: '마지막 알림 {d}', devNever: '아직 보낸 알림 없음', devRemove: '빼기', devRemoveAll: '모든 기기 끄기',
    devRemoved: '기기를 뺐어요.', devAllRemoved: '모든 기기의 알림을 껐어요.', devSure: '한 번 더 누르면 모든 기기가 꺼져요',
    insCard: '앱으로 설치', insSub: '홈 화면이나 바탕 화면에 앱처럼 두고 바로 열어요.', insDone: '지금 앱으로 쓰고 있어요.',
    insBtn: '앱으로 설치', insIOS1: '사파리 아래쪽의 공유 버튼(네모에 위쪽 화살표)을 눌러요.', insIOS2: '\'홈 화면에 추가\'를 눌러요.',
    insIOS3: '홈 화면에 생긴 CNOL RADAR를 열고, 설정 › 알림에서 켜요.', insIOSNotSafari: '아이폰 · 아이패드에서는 사파리로 이 주소를 열어야 설치할 수 있어요.',
    insOther: '브라우저 메뉴(⋮ 또는 공유)에서 \'앱 설치\'나 \'홈 화면에 추가\'를 눌러 주세요.', pInstalled: '앱으로 설치했어요.',
    fbCard: '대시보드를 열어 둔 동안만 알림',
    stTitle: '폰 · PC 알림', stSub: '터진 영상과 내 채널 소식을 폰과 컴퓨터로 받아요. 대시보드를 닫아도 와요.', stBtn: '알림 설정 열기',
    stOn: '이 기기: 켜짐', stOff: '이 기기: 꺼짐',
    aPush: '설정 › 알림에서 \'이 기기에서 알림 받기\'를 누르면 대시보드를 닫아도 터진 영상 · 내 채널 소식 · 아침 보고가 폰과 컴퓨터로 와요. 아이폰은 먼저 홈 화면에 앱으로 설치해 주세요.', aPushOn: '이 기기는 이미 알림을 받고 있어요.',
    err_PUSH_FAIL: '알림 서버가 받지 않았어요. 잠시 뒤 다시 해 보세요.', err_PUSH_GONE: '이 기기 구독이 끝났어요. 다시 켜 주세요.',
    err_TOO_FAST: '조금 뒤에 다시 눌러 주세요.', err_NO_DEVICE: '알림을 받는 기기가 없어요. 먼저 켜 주세요.', err_BAD_ENDPOINT: '이 브라우저의 알림 주소를 쓸 수 없어요.',
    err_BAD_KEYS: '이 브라우저의 알림 키가 맞지 않아요. 껐다가 다시 켜 주세요.', err_PUSH_KEY: '알림 키를 준비하지 못했어요. 잠시 뒤 다시 해 보세요.', err_NO_PROFILE: '계정 정보를 찾지 못했어요.',
  },
  en: {
    tab_notify: 'Notifications',
    guestName: 'Browsing', guestPill: 'Preview mode', guestTip: 'You’re viewing without signing in. Removing channels, team, phone notifications and passwords need a sign-in.',
    guestCardH: 'Preview mode', guestCardP: 'The dashboard is open without sign-in while we build. Viewing, adding channels, finding ideas and the idea board work right away; removing channels, teammates, invite links, phone notifications and passwords need a sign-in.',
    guestLogin: 'Sign in', aGuest: 'Team, plan and phone notifications are available after you sign in.',
    err_GUEST: 'Sign in to do this.', err_GUEST_BUSY: 'Please take a short break and try again. Without sign-in it’s 40 actions per 10 minutes.',
    nfSub: 'Get breakouts, news about your channel and the morning report on your phone and computer — even with the dashboard closed.',
    devCard: 'This device', dOn: 'This device is getting notifications.', dOff: 'Notifications are off on this device.',
    dBtnOn: 'Turn on for this device', dBtnOff: 'Turn off this device', dTest: 'Send a test', dWorking: 'One moment…',
    dTestSent: 'Test sent. It should arrive in a few seconds.', dTestNone: 'Nothing arrived? Check Do Not Disturb and your browser’s notification settings.',
    dDenied: 'Notifications are blocked in this browser. Click the lock icon in the address bar → Notifications → Allow, then try again.',
    dDeniedIOS: 'Notifications are blocked. Open iPhone Settings → Notifications → CNOL RADAR and allow them.',
    dNoSupport: 'This browser can’t receive push notifications. Open the dashboard in Chrome, Edge, Samsung Internet, Firefox or Safari (Mac).',
    dIOS: 'On iPhone and iPad, notifications work once the app is installed. Follow “Install as an app” below, then open this page in the installed app and turn them on.',
    dOnSnack: 'This device will get notifications.', dOffSnack: 'Notifications turned off on this device.', dFail: 'Couldn’t turn on notifications. Please try again shortly.',
    dGone: 'This device was removed elsewhere. Turn it on again.',
    prefCard: 'What to send', prefSub: 'Applies to every device on this account.',
    pMine: 'My channel', pMineD: 'My video breaks out · 48h views jump or drop · upload gaps · a video disappears',
    pRef: 'References taking off', pRefD: 'Videos just starting to take off on channels you watch · big breakouts',
    pBrief: 'Morning report', pBriefD: 'Every day at 8:30 am KST · 48h views and today’s ideas',
    pQuiet: 'Quiet at night', pQuietD: 'Nothing between 11 pm and 8 am KST. The morning report sums up the night.',
    pSaved: 'Saved.',
    devsCard: 'Devices getting notifications', devsSub: 'Up to 10 per account. Devices not opened for 120 days drop off automatically.', devsNone: 'No devices yet.',
    devThis: 'This device', devAdded: 'Added {d}', devLastOk: 'Last sent {d}', devNever: 'Nothing sent yet', devRemove: 'Remove', devRemoveAll: 'Turn off all devices',
    devRemoved: 'Device removed.', devAllRemoved: 'Notifications are off on all devices.', devSure: 'Press again to turn off every device',
    insCard: 'Install as an app', insSub: 'Keep it on your home screen or desktop and open it in one tap.', insDone: 'You’re using the installed app.',
    insBtn: 'Install app', insIOS1: 'Tap the Share button (square with an up arrow) at the bottom of Safari.', insIOS2: 'Tap “Add to Home Screen”.',
    insIOS3: 'Open CNOL RADAR from your home screen and turn on Settings › Notifications.', insIOSNotSafari: 'On iPhone and iPad, open this address in Safari to install it.',
    insOther: 'Use your browser menu (⋮ or Share) → “Install app” or “Add to Home screen”.', pInstalled: 'Installed as an app.',
    fbCard: 'Notifications while the dashboard is open',
    stTitle: 'Phone & desktop notifications', stSub: 'Get breakouts and news about your channel on your phone and computer, even with the dashboard closed.', stBtn: 'Open notification settings',
    stOn: 'This device: on', stOff: 'This device: off',
    aPush: 'Open Settings › Notifications and press “Turn on for this device” — breakouts, channel news and the morning report then reach your phone and computer even with the dashboard closed. On iPhone, install the app to your home screen first.', aPushOn: 'This device already gets notifications.',
    err_PUSH_FAIL: 'The notification service didn’t accept it. Please try again shortly.', err_PUSH_GONE: 'This device’s subscription ended. Turn it on again.',
    err_TOO_FAST: 'Please wait a moment and try again.', err_NO_DEVICE: 'No device is set up yet. Turn one on first.', err_BAD_ENDPOINT: 'This browser’s notification address can’t be used.',
    err_BAD_KEYS: 'This browser’s notification keys don’t match. Turn it off and on again.', err_PUSH_KEY: 'Couldn’t prepare the notification key. Please try again shortly.', err_NO_PROFILE: 'Couldn’t find your account details.',
  },
  ja: {
    tab_notify: '通知',
    guestName: '閲覧中', guestPill: 'お試し表示モード', guestTip: 'ログインせずに見ています。チャンネル削除・チーム・スマホ通知・パスワードはログインすると使えます。',
    guestCardH: 'お試し表示モード', guestCardP: '開発中のため、ログインなしでダッシュボードを開いています。閲覧・チャンネル追加・ネタ探し・ネタボードはすぐ使えます。チャンネル削除・メンバー・招待リンク・スマホ通知・パスワードはログインすると使えます。',
    guestLogin: 'ログイン', aGuest: 'チーム・プラン・スマホ通知はログインすると使えます。',
    err_GUEST: 'ログインするとできます。', err_GUEST_BUSY: '少し時間をおいてからもう一度お試しください。ログインなしでは10分に40回までです。',
    nfSub: 'バズった動画、自分のチャンネルの動き、朝のレポートをスマホとパソコンで受け取れます。ダッシュボードを閉じていても届きます。',
    devCard: 'この端末', dOn: 'この端末で通知を受け取っています。', dOff: 'この端末の通知はオフです。',
    dBtnOn: 'この端末で通知を受け取る', dBtnOff: 'この端末をオフ', dTest: 'テスト通知を送る', dWorking: '少々お待ちください…',
    dTestSent: 'テスト通知を送りました。数秒で届きます。', dTestNone: '届かない場合は、おやすみモードとブラウザの通知設定を確認してください。',
    dDenied: 'このブラウザで通知がブロックされています。アドレスバー左の鍵アイコン → 通知 → 許可に変えてから、もう一度押してください。',
    dDeniedIOS: '通知がブロックされています。iPhoneの設定 → 通知 → CNOL RADAR で許可してください。',
    dNoSupport: 'このブラウザはプッシュ通知を受け取れません。Chrome・Edge・Samsung Internet・Firefox・Safari(Mac)で開いてください。',
    dIOS: 'iPhone・iPadはアプリとしてインストールすると通知が届きます。下の「アプリとしてインストール」の手順のあと、インストールしたアプリでこの画面を開いてオンにしてください。',
    dOnSnack: 'この端末で通知を受け取ります。', dOffSnack: 'この端末の通知をオフにしました。', dFail: '通知をオンにできませんでした。しばらくしてからもう一度お試しください。',
    dGone: 'この端末はほかの場所で外されました。もう一度オンにしてください。',
    prefCard: '受け取る通知', prefSub: 'このアカウントのすべての端末に同じように適用されます。',
    pMine: '自分のチャンネル', pMineD: '自分の動画がバズったとき · 48時間再生数の急上昇 · 急落 · 投稿の空白 · 動画が見えなくなったとき',
    pRef: 'リファレンスが伸びています', pRefD: '見守っているチャンネルで伸び始めた動画 · いつもより大きくバズった動画',
    pBrief: '朝のレポート', pBriefD: '毎朝8時30分(韓国時間) · 48時間の再生数と今日作るネタ',
    pQuiet: '夜は静かに', pQuietD: '夜11時〜朝8時(韓国時間)は送りません。夜の間の動きは朝のレポートがまとめます。',
    pSaved: '保存しました。',
    devsCard: '通知を受け取る端末', devsSub: '1アカウント10台までです。120日以上開いていない端末は自動で外れます。', devsNone: 'まだ通知を受け取る端末がありません。',
    devThis: 'この端末', devAdded: '{d} 登録', devLastOk: '最後の通知 {d}', devNever: 'まだ送った通知なし', devRemove: '外す', devRemoveAll: 'すべての端末をオフ',
    devRemoved: '端末を外しました。', devAllRemoved: 'すべての端末の通知をオフにしました。', devSure: 'もう一度押すとすべての端末がオフになります',
    insCard: 'アプリとしてインストール', insSub: 'ホーム画面やデスクトップにアプリのように置いて、すぐ開けます。', insDone: 'いまアプリとして使っています。',
    insBtn: 'アプリをインストール', insIOS1: 'Safari下部の共有ボタン(四角に上向き矢印)を押します。', insIOS2: '「ホーム画面に追加」を押します。',
    insIOS3: 'ホーム画面のCNOL RADARを開き、設定 › 通知でオンにします。', insIOSNotSafari: 'iPhone・iPadではSafariでこのアドレスを開くとインストールできます。',
    insOther: 'ブラウザのメニュー(⋮ または共有)から「アプリをインストール」や「ホーム画面に追加」を押してください。', pInstalled: 'アプリとしてインストールしました。',
    fbCard: 'ダッシュボードを開いている間だけ通知',
    stTitle: 'スマホ・PC通知', stSub: 'バズった動画やチャンネルの動きをスマホとパソコンで受け取れます。ダッシュボードを閉じていても届きます。', stBtn: '通知設定を開く',
    stOn: 'この端末: オン', stOff: 'この端末: オフ',
    aPush: '設定 › 通知で「この端末で通知を受け取る」を押すと、ダッシュボードを閉じていてもバズった動画・チャンネルの動き・朝のレポートがスマホとパソコンに届きます。iPhoneは先にホーム画面にアプリとして追加してください。', aPushOn: 'この端末はすでに通知を受け取っています。',
    err_PUSH_FAIL: '通知サーバーが受け付けませんでした。しばらくしてからもう一度お試しください。', err_PUSH_GONE: 'この端末の登録が切れました。もう一度オンにしてください。',
    err_TOO_FAST: '少し待ってからもう一度押してください。', err_NO_DEVICE: '通知を受け取る端末がありません。先にオンにしてください。', err_BAD_ENDPOINT: 'このブラウザの通知アドレスは使えません。',
    err_BAD_KEYS: 'このブラウザの通知キーが合いません。オフにしてからもう一度オンにしてください。', err_PUSH_KEY: '通知キーを準備できませんでした。しばらくしてからもう一度お試しください。', err_NO_PROFILE: 'アカウント情報が見つかりませんでした。',
  },
};

// ---------- 기기 · 브라우저 ----------
let swReg = null;
let installEvt = null;
let info = null; // 서버: { key, prefs, devices }
let mounted = false;
export function pushSupported() {
  return typeof window !== 'undefined' && !!window.isSecureContext && !!navigator.serviceWorker && !!window.PushManager && 'Notification' in window;
}
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
const isSafari = () => /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|Chrome|Android|Whale|SamsungBrowser/.test(navigator.userAgent);
const standalone = () => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (er) { return false; } };
const perm = () => ('Notification' in window ? Notification.permission : 'unsupported');
function uaLabel() {
  const u = navigator.userAgent;
  const os = /iPhone/.test(u) ? 'iPhone' : (/iPad/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1)) ? 'iPad' : /Android/.test(u) ? 'Android'
    : /Windows/.test(u) ? 'Windows' : /Mac OS X|Macintosh/.test(u) ? 'Mac' : /CrOS/.test(u) ? 'ChromeOS' : /Linux/.test(u) ? 'Linux' : '';
  const br = /Edg\//.test(u) ? 'Edge' : /SamsungBrowser/.test(u) ? 'Samsung Internet' : /Whale/.test(u) ? 'Whale' : /Firefox|FxiOS/.test(u) ? 'Firefox'
    : /OPR\//.test(u) ? 'Opera' : /Chrome|CriOS/.test(u) ? 'Chrome' : /Safari/.test(u) ? 'Safari' : 'Browser';
  return (standalone() ? 'App · ' : '') + br + (os ? ' · ' + os : '');
}
function b64u(buf) {
  const b = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64u(s) {
  let x = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  while (x.length % 4) x += '=';
  const bin = atob(x);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const tail = (ep) => String(ep || '').slice(-16);
async function getReg() {
  if (swReg) return swReg;
  if (!('serviceWorker' in navigator)) return null;
  try { swReg = await navigator.serviceWorker.register('/sw.js'); } catch (er) { return null; }
  return swReg;
}
async function currentSub() {
  if (!pushSupported()) return null;
  const reg = await getReg();
  if (!reg || !reg.pushManager) return null;
  try { return await reg.pushManager.getSubscription(); } catch (er) { return null; }
}
function keyOf(sub) {
  try { const k = sub && sub.options && sub.options.applicationServerKey; return k ? b64u(k) : null; } catch (er) { return null; }
}
function setOn(on) {
  ls.set('radar.pushOn', on ? '1' : '0');
  try { C.plus?.startNotify?.(); } catch (er) { /* 페이지 알림 정리 */ }
}
export const pushOn = () => ls.get('radar.pushOn') === '1';

// app.js가 처음에 불러요: 서비스 워커 등록 · 설치 안내 받기 · 알림 눌렀을 때 화면 옮기기
export function mountPush(ctx) {
  C = ctx;
  if (mounted) return;
  mounted = true;
  window.addEventListener('beforeinstallprompt', (ev) => { ev.preventDefault(); installEvt = ev; repaintInstall(); });
  window.addEventListener('appinstalled', () => { installEvt = null; C.snack(t('pInstalled')); repaintInstall(); });
  if ('serviceWorker' in navigator) {
    getReg();
    navigator.serviceWorker.addEventListener('message', (ev) => {
      const go = ev.data && ev.data.go;
      if (typeof go === 'string' && /^#[a-z]+(\/[A-Za-z0-9_-]{1,40})?$/.test(go)) location.hash = go;
    });
  }
}
// 로그인 확인 뒤: 이 기기 구독을 서버와 맞춰요 (하루 한 번 · 언어가 바뀌면 바로)
export async function syncPush(force) {
  if (C.S.user?.guest) return; // 둘러보기(로그인 없이)는 알림 기기가 없어요
  if (!pushSupported() || perm() !== 'granted') { setOn(false); return; }
  const sub = await currentSub();
  if (!sub) { setOn(false); return; }
  setOn(true);
  const [at, lg] = String(ls.get('radar.pushSync') || '').split('|');
  if (!force && Date.now() - Number(at || 0) < 20 * 3600e3 && lg === C.lang) return;
  const j = sub.toJSON();
  if (!j.keys) return;
  const out = await C.act({ action: 'push_sub', endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, lang: C.lang, ua: uaLabel() });
  if (out.ok) { ls.set('radar.pushSync', Date.now() + '|' + C.lang); if (info) info.devices = out.devices; }
}
export function pushLang() { if (pushOn()) syncPush(true).catch(() => {}); }
// 로그아웃할 때: 이 기기로 이 계정 알림이 계속 오지 않게 빼요 (1.5초 안에 못 끝내면 그냥 나가요)
export async function beforeSignOut() {
  if (!pushOn()) return;
  const job = (async () => {
    const sub = await currentSub();
    if (!sub) return;
    const ep = sub.endpoint;
    try { await sub.unsubscribe(); } catch (er) { /* 무시 */ }
    await C.act({ action: 'push_unsub', endpoint: ep });
  })();
  await Promise.race([job.catch(() => {}), new Promise((r) => setTimeout(r, 1500))]);
  setOn(false);
}

// ---------- 설정 › 알림 화면 ----------
let V = null;
let mySub = null;
export async function vNotify(v, r, alive) {
  C.loading(v, t('tab_notify'), e(t('nfSub')));
  const [out, sub] = await Promise.all([C.act({ action: 'push_info' }), currentSub()]);
  if (!alive()) return;
  info = out.ok ? out : null;
  mySub = sub;
  V = v;
  if (!info) {
    v.innerHTML = C.head(t('tab_notify'), e(t('nfSub'))) + `<div class="dk-card"><div class="dk-banner warn">${e(C.errText(out.error))}</div></div>`;
    return;
  }
  const registered = !!(sub && info.devices.some((d) => d.tail === tail(sub.endpoint)));
  setOn(registered && perm() === 'granted');
  const fallback = !pushSupported() && !isIOS() && C.plus?.ntCardHtml;
  v.innerHTML = C.head(t('tab_notify'), e(t('nfSub'))) + `
  <div class="dk-row">
    <section class="dk-card f1 dk-fade pu-dev" id="puDev"></section>
    <section class="dk-card f1 dk-fade pu-pref" id="puPref"></section>
  </div>
  <div class="dk-row">
    <section class="dk-card f2 dk-fade pu-devs" id="puDevs"></section>
    <section class="dk-card f1 dk-fade pu-ins" id="puIns"></section>
  </div>
  ${fallback ? `<div class="dk-row"><section class="dk-card f1 dk-fade" id="ntCard">${C.plus.ntCardHtml()}</section></div>` : ''}`;
  paintDevice();
  paintPrefs();
  paintDevices();
  repaintInstall();
  if (fallback) C.plus.bindNt(v);
}
const $ = (id) => (V && V.isConnected ? V.querySelector('#' + id) : null);
function thisRegistered() { return !!(mySub && info && info.devices.some((d) => d.tail === tail(mySub.endpoint))); }

function paintDevice() {
  const el = $('puDev');
  if (!el) return;
  const p = perm();
  let banner = '', btns = '';
  if (!pushSupported()) {
    banner = isIOS() && !standalone() ? `<div class="dk-banner info">${e(t('dIOS'))}</div>` : `<div class="dk-banner warn">${e(t('dNoSupport'))}</div>`;
  } else if (p === 'denied') {
    banner = `<div class="dk-banner warn">${e(isIOS() ? t('dDeniedIOS') : t('dDenied'))}</div>`;
  } else if (thisRegistered() && p === 'granted') {
    banner = `<div class="dk-banner good">${e(t('dOn'))}</div>`;
    btns = `<button type="button" class="dk-btn" id="puTest">${e(t('dTest'))}</button><button type="button" class="dk-btn line" id="puOff">${e(t('dBtnOff'))}</button>`;
  } else {
    banner = `<div class="dk-banner info">${e(mySub && p === 'granted' ? t('dGone') : t('dOff'))}</div>`;
    btns = `<button type="button" class="dk-btn" id="puOn">${e(t('dBtnOn'))}</button>`;
  }
  el.innerHTML = `<h2>${e(t('devCard'))} <span class="dk-tag gray">${e(uaLabel())}</span></h2>${banner}${btns ? `<div class="pu-btns">${btns}</div>` : ''}<p class="dk-sub pu-note" id="puNote" hidden></p>`;
  el.querySelector('#puOn')?.addEventListener('click', (ev) => turnOn(ev.currentTarget));
  el.querySelector('#puOff')?.addEventListener('click', (ev) => turnOff(ev.currentTarget));
  el.querySelector('#puTest')?.addEventListener('click', (ev) => sendTest(ev.currentTarget));
}
function busy(btn, on) {
  if (!btn) return;
  if (on) { btn.dataset.txt = btn.textContent; btn.textContent = t('dWorking'); btn.disabled = true; }
  else { btn.textContent = btn.dataset.txt || btn.textContent; btn.disabled = false; }
}
async function turnOn(btn) {
  // 알림 허용은 누른 그 순간에 물어요 (사파리는 그래야 해요)
  let p = perm();
  if (p === 'default') { try { p = await Notification.requestPermission(); } catch (er) { p = perm(); } }
  if (p !== 'granted') { paintDevice(); return; }
  busy(btn, true);
  try {
    const reg = await getReg();
    if (!reg) throw new Error('NO_SW');
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (sub && keyOf(sub) && keyOf(sub) !== info.key) { try { await sub.unsubscribe(); } catch (er) { /* 새로 */ } sub = null; }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: unb64u(info.key) });
    const j = sub.toJSON();
    const out = await C.act({ action: 'push_sub', endpoint: j.endpoint, p256dh: j.keys && j.keys.p256dh, auth: j.keys && j.keys.auth, lang: C.lang, ua: uaLabel() });
    if (!out.ok) { busy(btn, false); C.snack(C.errText(out.error)); return; }
    info.devices = out.devices;
    mySub = sub;
    ls.set('radar.pushSync', Date.now() + '|' + C.lang);
    setOn(true);
    C.snack(t('dOnSnack'));
  } catch (er) {
    busy(btn, false);
    C.snack(t('dFail'));
    return;
  }
  paintDevice();
  paintDevices();
}
async function turnOff(btn) {
  busy(btn, true);
  const ep = mySub && mySub.endpoint;
  try { if (mySub) await mySub.unsubscribe(); } catch (er) { /* 서버에서도 빼요 */ }
  const out = ep ? await C.act({ action: 'push_unsub', endpoint: ep }) : { ok: true, devices: info.devices };
  if (out.ok) info.devices = out.devices;
  mySub = null;
  setOn(false);
  C.snack(t('dOffSnack'));
  paintDevice();
  paintDevices();
}
async function sendTest(btn) {
  busy(btn, true);
  const out = await C.act({ action: 'push_test', endpoint: mySub && mySub.endpoint });
  busy(btn, false);
  const note = $('puNote');
  if (!out.ok) {
    C.snack(C.errText(out.error) + (out.codes && out.codes.length ? ` (${out.codes.join(', ')})` : ''));
    if (out.error === 'PUSH_GONE' || out.error === 'NO_DEVICE') { info.devices = info.devices.filter((d) => !mySub || d.tail !== tail(mySub.endpoint)); paintDevice(); paintDevices(); }
    return;
  }
  C.snack(t('dTestSent'));
  if (note) { note.textContent = t('dTestNone'); note.hidden = false; }
}

function paintPrefs() {
  const el = $('puPref');
  if (!el) return;
  const pf = info.prefs || {};
  const row = (k) => `<li><button type="button" class="pu-sw" role="switch" aria-checked="${pf[k] ? 'true' : 'false'}" data-pref="${k}" aria-labelledby="pf_${k}" aria-describedby="pfd_${k}"><i aria-hidden="true"></i></button>
    <span><b id="pf_${k}">${e(t('p' + k[0].toUpperCase() + k.slice(1)))}</b><small id="pfd_${k}">${e(t('p' + k[0].toUpperCase() + k.slice(1) + 'D'))}</small></span></li>`;
  el.innerHTML = `<h2>${e(t('prefCard'))}</h2><p class="dk-sub" style="margin:0">${e(t('prefSub'))}</p><ul class="pu-prefs">${['mine', 'ref', 'brief', 'quiet'].map(row).join('')}</ul>`;
  el.querySelectorAll('[data-pref]').forEach((b) => b.addEventListener('click', async () => {
    const k = b.dataset.pref;
    const next = b.getAttribute('aria-checked') !== 'true';
    b.setAttribute('aria-checked', String(next));
    b.disabled = true;
    const out = await C.act({ action: 'notify_set', [k]: next });
    b.disabled = false;
    if (!out.ok) { b.setAttribute('aria-checked', String(!next)); C.snack(C.errText(out.error)); return; }
    info.prefs = out.prefs;
    C.snack(t('pSaved'));
  }));
}

function paintDevices() {
  const el = $('puDevs');
  if (!el) return;
  const devs = info.devices || [];
  const me = mySub ? tail(mySub.endpoint) : '';
  const day = (iso) => (iso ? new Date(iso).toLocaleDateString(C.loc(), { month: 'short', day: 'numeric' }) : '');
  el.innerHTML = `<div class="tm-h"><h2>${e(t('devsCard'))} <span class="dk-tag gray">${devs.length} / 10</span></h2>
      ${devs.length > 1 ? `<button type="button" class="dk-btn sm line" id="puAll">${e(t('devRemoveAll'))}</button>` : ''}</div>
    <p class="dk-sub" style="margin:0">${e(t('devsSub'))}</p>
    ${devs.length ? `<ul class="pu-devlist">${devs.map((d) => `<li>
        <span class="pu-ic" aria-hidden="true">${C.svg(/iPhone|Android|iPad/.test(d.ua || '') ? '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>' : '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>', 18)}</span>
        <span class="pu-dv"><b>${e(d.ua || t('devCard'))}</b>${d.tail === me ? ` <span class="dk-tag">${e(t('devThis'))}</span>` : ''}
          <small>${e(t('devAdded', { d: day(d.at) }))} · ${e(d.ok_at ? t('devLastOk', { d: C.agoTxt(d.ok_at) }) : t('devNever'))}</small></span>
        <button type="button" class="dk-btn sm line" data-rm="${Number(d.id)}">${e(t('devRemove'))}</button></li>`).join('')}</ul>`
      : `<div class="dk-empty">${e(t('devsNone'))}</div>`}`;
  el.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', async () => {
    b.disabled = true;
    const id = Number(b.dataset.rm);
    const d = devs.find((x) => Number(x.id) === id);
    if (d && d.tail === me) { await turnOff(null); return; }
    const out = await C.act({ action: 'push_unsub', id });
    if (!out.ok) { b.disabled = false; C.snack(C.errText(out.error)); return; }
    info.devices = out.devices;
    C.snack(t('devRemoved'));
    paintDevices();
  }));
  const all = el.querySelector('#puAll');
  all?.addEventListener('click', async () => {
    if (all.dataset.sure !== '1') { all.dataset.sure = '1'; all.textContent = t('devSure'); return; }
    all.disabled = true;
    try { if (mySub) await mySub.unsubscribe(); } catch (er) { /* 서버에서도 빼요 */ }
    const out = await C.act({ action: 'push_unsub', all: true });
    if (!out.ok) { all.disabled = false; C.snack(C.errText(out.error)); return; }
    info.devices = out.devices;
    mySub = null;
    setOn(false);
    C.snack(t('devAllRemoved'));
    paintDevice();
    paintDevices();
  });
}

function repaintInstall() {
  const el = $('puIns');
  if (!el) return;
  let body;
  if (standalone()) body = `<div class="dk-banner good">${e(t('insDone'))}</div>`;
  else if (installEvt) body = `<button type="button" class="dk-btn" id="puInstall">${C.svg('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>', 16)}${e(t('insBtn'))}</button>`;
  else if (isIOS()) body = isSafari() ? `<ol class="pu-steps"><li>${e(t('insIOS1'))}</li><li>${e(t('insIOS2'))}</li><li>${e(t('insIOS3'))}</li></ol>` : `<div class="dk-banner info">${e(t('insIOSNotSafari'))}</div>`;
  else body = `<p class="dk-sub" style="margin:0">${e(t('insOther'))}</p>`;
  el.innerHTML = `<h2>${e(t('insCard'))}</h2><p class="dk-sub" style="margin:0">${e(t('insSub'))}</p>${body}`;
  el.querySelector('#puInstall')?.addEventListener('click', async () => {
    const ev = installEvt;
    if (!ev) return;
    installEvt = null;
    try { ev.prompt(); await ev.userChoice; } catch (er) { /* 닫았어요 */ }
    repaintInstall();
  });
}

// 설정(상태) 화면의 짧은 안내 카드
export function statusCardHtml() {
  if (C.S.user?.guest) return `<h2>${e(t('stTitle'))}</h2><p class="dk-sub" style="margin:0">${e(t('stSub'))}</p><p class="dk-sub" style="margin:0">${e(t('err_GUEST'))}</p>`;
  const on = pushOn();
  return `<h2>${e(t('stTitle'))}</h2><p class="dk-sub" style="margin:0">${e(t('stSub'))}</p>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px"><span class="dk-tag ${on ? 'teal' : 'gray'}">${e(on ? t('stOn') : t('stOff'))}</span>
    <a class="dk-btn sm" href="#notify">${e(t('stBtn'))}</a></div>`;
}
