import { sb, getLang, setLang, esc, snack, fmtViews, requireSession } from '/common.js';

// ---------- 문구 ----------
const A = {
  ko: {
    home: '레이더 홈', briefing: '오늘의 브리핑', channel: '내 채널', refs: '레퍼런스 채널', ideas: '소재 보드', partners: '음원 · 광고', settings: '설정', admin: '관리자', logout: '로그아웃',
    sample: '예시 데이터', soon: '곧 열려요', saved: '저장했어요', error: '문제가 생겼어요. 잠시 후 다시 해주세요.', agentOn: '에이전트 켜짐', agentDesc: '매일 08:30 브리핑 · 이슈는 바로 알림',
    plan: '{p} 플랜', myCh: '내 채널 · {n}개 연결', noCh: '아직 연결한 채널이 없어요', addCh: '구글 계정으로 채널 추가', demoNote: '채널을 연결하기 전이라 예시 데이터로 보여드려요.',
    pickBy: '에이전트 · 동종 채널 12곳을 보고 골랐어요', pickTitle: '오늘은 ‘욕실 틈새 수납 실측’ 만들어 보세요', pickWhy: '동종 채널 3곳에서 48시간 안에 평소의 4배 이상 나왔고, 내 시청자가 오래 보는 실측 비교 포맷이에요.', brief: '소재 보드에 담기', inBoard: '소재 보드에 담김',
    tabSame: '동종 채널', tabOther: '다른 분야', tabBox: '수집함', platform: '플랫폼', format: '포맷', all: '전체', tr: '번역해서 보기', orig: '원문으로 보기',
    analysis: '레퍼런스 분석', hook: '훅 (0~2초)', len: '길이', music: '음원 무드', why: '왜 떴나', apply: '내 채널에 적용하면', recs: '추천 채널', every: '15분마다 갱신', addRef: '+ 레퍼런스', added: '레퍼런스 ✓',
    bulkT: '링크 한 번에 수집', bulkD: '유튜브 쇼츠 · 틱톡 · 인스타 릴스 링크를 한 줄에 하나씩 넣어요. 최대 50개.', bulkBtn: '한 번에 담기', bulkDone: '링크 {n}개를 수집함에 담았어요. 분석이 끝나면 포맷별로 분류돼요.', bulkBad: '지원하는 링크가 없어요. 유튜브 쇼츠 · 틱톡 · 인스타 릴스 링크를 넣어 주세요.',
    others: '다른 분야 둘러보기', empty: '조건에 맞는 영상이 없어요.', boxEmpty: '아직 수집한 링크가 없어요. 오른쪽에서 링크를 한 번에 넣어 보세요.', fromLang: '{l}에서 번역 · 원문 {o}', usual: '평소의 {x}배', queued: '분석 대기',
    hello: '좋은 아침이에요', sum: '어제 채널 3개의 48시간 조회수는 {v}, 그제보다 23% 늘었어요.', topT: '어제 터진 영상', ideasT: '오늘 만들 소재 3', refUp: '레퍼런스 급상승', issues: '이슈',
    agent: 'CNOL RADAR 에이전트', ask: '에이전트에게 물어보기', send: '보내기', later: '확인해서 내일 아침 브리핑에 반영해 둘게요.',
    rt: '실시간 · 지난 48시간', rtSub: '15분마다 갱신 · 공개 조회수로 계산한 자체 지표', rank: '채널 순위 · 48시간', daily: '일별 조회수 · 지난 28일', confirmed: '유튜브 분석 확정치 · 2~3일 늦게 들어와요', traffic: '어디서 보고 들어왔나',
    tFeed: '쇼츠 피드', tPage: '채널 페이지', tSearch: '검색', tExt: '외부', tEtc: '기타',
    refPh: '참고할 채널 링크 · youtube.com/@핸들 · tiktok.com/@아이디 · instagram.com/아이디', add: '추가', refList: '추적 중인 채널', refNone: '아직 레퍼런스가 없어요. 위에 링크를 넣거나 레이더 홈의 추천 채널을 추가해 보세요.', badUrl: '유튜브 · 틱톡 · 인스타 채널 링크를 넣어 주세요.', dup: '이미 추가한 채널이에요.', del: '삭제',
    ideaPh: '새 소재 제목', stIdea: '아이디어', stScript: '대본', stProd: '제작 중', stUp: '업로드', move: '단계',
    musicT: '내 채널에 어울리는 음원', musicD: '크놀뮤직 · 최근 잘된 영상 무드로 골랐어요', use: '이 음원 쓰기', using: '쓰는 중', collabT: '음원 협업 신청', collabD: '내 채널에 맞춘 음원을 같이 만들고, 영상에 쓰인 만큼 수익을 나눠요. 조건은 계약 단계에서 자세히 안내드려요.', collabBtn: '협업 신청하기', collabDone: '신청했어요. 검토 후 연락드려요.',
    offersT: '광고 · PPL 제안 받기', offersD: '켤 때만 크놀AD 광고와 PPL 제안이 와요. 끄면 제안에 내 정보가 쓰이지 않아요.', pplBtn: 'PPL 문의 남기기', pplDone: '문의를 남겼어요.',
    profT: '내 정보', name: '이름', language: '사용 언어', save: '저장', chT: '내 채널 연결', chRule: '채널은 그 채널을 가진 구글 계정으로 승인해야만 등록돼요. 링크 붙여넣기나 스튜디오 권한 초대로는 등록되지 않아요.', chSoon: '구글 채널 연결은 곧 열려요.',
    agT: '에이전트 · 알림', time: '아침 브리핑 시간', via: '받는 곳', kakao: '카카오톡', email: '이메일', push: '앱 푸시',
    rUp: '48시간 급상승', rDown: '48시간 급락', rRef: '레퍼런스 터짐', rGap: '업로드 공백', rIssue: '채널 이슈 즉시 알림', account: '계정', adminOpen: '관리자 페이지 열기'
  },
  en: {
    home: 'Radar home', briefing: "Today's briefing", channel: 'My channels', refs: 'References', ideas: 'Idea board', partners: 'Music · Deals', settings: 'Settings', admin: 'Admin', logout: 'Log out',
    sample: 'Sample data', soon: 'Coming soon', saved: 'Saved', error: 'Something went wrong. Please try again.', agentOn: 'Agent on', agentDesc: 'Briefing daily at 08:30 · urgent issues right away',
    plan: '{p} plan', myCh: 'My channels · {n} connected', noCh: 'No channels connected yet', addCh: 'Add a channel with Google', demoNote: "You haven't connected a channel yet, so this shows sample data.",
    pickBy: 'Agent · picked after watching 12 similar channels', pickTitle: 'Make “Bathroom gap storage, measured” today', pickWhy: 'It ran 4×+ above usual on 3 similar channels in 48 hours, and it is the measured-comparison format your viewers watch longest.', brief: 'Add to idea board', inBoard: 'On your idea board',
    tabSame: 'Similar channels', tabOther: 'Other niches', tabBox: 'Collected', platform: 'Platform', format: 'Format', all: 'All', tr: 'Show translated', orig: 'Show original',
    analysis: 'Reference analysis', hook: 'Hook (0–2s)', len: 'Length', music: 'Music mood', why: 'Why it worked', apply: 'For your channel', recs: 'Recommended channels', every: 'Updates every 15 min', addRef: '+ Reference', added: 'Reference ✓',
    bulkT: 'Collect links in bulk', bulkD: 'Paste YouTube Shorts, TikTok or Instagram Reels links, one per line. Up to 50.', bulkBtn: 'Collect all', bulkDone: '{n} links added to Collected. They will be sorted by format once analyzed.', bulkBad: 'No supported links found. Paste YouTube Shorts, TikTok or Instagram Reels links.',
    others: 'Browse other niches', empty: 'No videos match these filters.', boxEmpty: 'Nothing collected yet. Paste links on the right to start.', fromLang: 'Translated from {l} · original: {o}', usual: '{x}× usual', queued: 'Queued',
    hello: 'Good morning', sum: 'Your 3 channels got {v} in the last 48 hours, up 23% on the day before.', topT: "Yesterday's breakout", ideasT: '3 ideas for today', refUp: 'Rising references', issues: 'Issues',
    agent: 'CNOL RADAR agent', ask: 'Ask the agent', send: 'Send', later: "Got it — I'll reflect this in tomorrow morning's briefing.",
    rt: 'Realtime · last 48 hours', rtSub: 'Updates every 15 min · our own metric from public view counts', rank: 'Channel ranking · 48h', daily: 'Daily views · last 28 days', confirmed: 'YouTube Analytics data · arrives 2–3 days late', traffic: 'Where viewers came from',
    tFeed: 'Shorts feed', tPage: 'Channel page', tSearch: 'Search', tExt: 'External', tEtc: 'Other',
    refPh: 'Channel link · youtube.com/@handle · tiktok.com/@id · instagram.com/id', add: 'Add', refList: 'Channels you track', refNone: 'No references yet. Paste a link above or add a recommended channel from Radar home.', badUrl: 'Please paste a YouTube, TikTok or Instagram channel link.', dup: 'Already added.', del: 'Remove',
    ideaPh: 'New idea title', stIdea: 'Idea', stScript: 'Script', stProd: 'In production', stUp: 'Uploaded', move: 'Stage',
    musicT: 'Tracks that fit your channel', musicD: 'CNOL Music · picked from the mood of your recent hits', use: 'Use this track', using: 'In use', collabT: 'Music collaboration', collabD: 'Make tracks tailored to your channel and share revenue for every use. Details come at the contract stage.', collabBtn: 'Apply to collaborate', collabDone: "Applied. We'll be in touch after review.",
    offersT: 'Receive brand deals · PPL', offersD: 'CNOL AD deals and PPL arrive only while this is on. When off, your info is never used for offers.', pplBtn: 'Leave a PPL inquiry', pplDone: 'Inquiry sent.',
    profT: 'Profile', name: 'Name', language: 'Language', save: 'Save', chT: 'Connect my channels', chRule: "A channel is added only when the Google account that owns it approves. Pasted links or Studio permission invites can't add it.", chSoon: 'Google channel connection is coming soon.',
    agT: 'Agent · alerts', time: 'Morning briefing time', via: 'Send to', kakao: 'KakaoTalk', email: 'Email', push: 'App push',
    rUp: '48h surge', rDown: '48h drop', rRef: 'Reference breakout', rGap: 'Upload gap', rIssue: 'Instant channel issue alerts', account: 'Account', adminOpen: 'Open admin'
  },
  ja: {
    home: 'レーダーホーム', briefing: '今日のブリーフィング', channel: 'マイチャンネル', refs: 'リファレンス', ideas: 'ネタボード', partners: '音源 · 広告', settings: '設定', admin: '管理者', logout: 'ログアウト',
    sample: 'サンプルデータ', soon: '近日公開', saved: '保存しました', error: '問題が発生しました。しばらくしてからお試しください。', agentOn: 'エージェント稼働中', agentDesc: '毎日08:30にブリーフィング · 急ぎはすぐ通知',
    plan: '{p}プラン', myCh: 'マイチャンネル · {n}件連携', noCh: 'まだ連携したチャンネルがありません', addCh: 'Googleでチャンネルを追加', demoNote: 'チャンネル連携前のため、サンプルデータを表示しています。',
    pickBy: 'エージェント · 同ジャンル12チャンネルを見て選びました', pickTitle: '今日は「浴室すき間収納の実測」を作ってみましょう', pickWhy: '同ジャンル3チャンネルで48時間以内に普段の4倍以上伸び、あなたの視聴者が長く見る実測比較フォーマットです。', brief: 'ネタボードに追加', inBoard: 'ネタボードに追加済み',
    tabSame: '同ジャンル', tabOther: '他ジャンル', tabBox: '収集ボックス', platform: 'プラットフォーム', format: 'フォーマット', all: 'すべて', tr: '翻訳して表示', orig: '原文で表示',
    analysis: 'リファレンス分析', hook: 'フック (0〜2秒)', len: '長さ', music: '音源ムード', why: '伸びた理由', apply: '自分のチャンネルなら', recs: 'おすすめチャンネル', every: '15分ごとに更新', addRef: '+ リファレンス', added: 'リファレンス ✓',
    bulkT: 'リンクをまとめて収集', bulkD: 'YouTubeショート・TikTok・Instagramリールのリンクを1行に1つずつ。最大50件。', bulkBtn: 'まとめて追加', bulkDone: '{n}件のリンクを収集ボックスに追加しました。分析後にフォーマット別に分類されます。', bulkBad: '対応するリンクがありません。YouTubeショート・TikTok・Instagramリールのリンクを入れてください。',
    others: '他ジャンルを見る', empty: '条件に合う動画がありません。', boxEmpty: 'まだ収集したリンクがありません。右側でリンクをまとめて入れてみてください。', fromLang: '{l}から翻訳 · 原文 {o}', usual: '普段の{x}倍', queued: '分析待ち',
    hello: 'おはようございます', sum: '昨日の3チャンネルの48時間再生数は{v}、前日より23%増えました。', topT: '昨日伸びた動画', ideasT: '今日のネタ3つ', refUp: '急上昇リファレンス', issues: '問題',
    agent: 'CNOL RADAR エージェント', ask: 'エージェントに質問', send: '送信', later: '確認して、明日の朝のブリーフィングに反映します。',
    rt: 'リアルタイム · 直近48時間', rtSub: '15分ごとに更新 · 公開再生数から算出した独自指標', rank: 'チャンネル順位 · 48時間', daily: '日別再生数 · 直近28日', confirmed: 'YouTubeアナリティクス確定値 · 2〜3日遅れて反映', traffic: '視聴者の流入元',
    tFeed: 'ショートフィード', tPage: 'チャンネルページ', tSearch: '検索', tExt: '外部', tEtc: 'その他',
    refPh: 'チャンネルリンク · youtube.com/@ハンドル · tiktok.com/@ID · instagram.com/ID', add: '追加', refList: '追跡中のチャンネル', refNone: 'まだリファレンスがありません。上にリンクを入れるか、レーダーホームのおすすめを追加してください。', badUrl: 'YouTube・TikTok・Instagramのチャンネルリンクを入れてください。', dup: 'すでに追加済みです。', del: '削除',
    ideaPh: '新しいネタのタイトル', stIdea: 'アイデア', stScript: '台本', stProd: '制作中', stUp: '投稿済み', move: '段階',
    musicT: 'チャンネルに合う音源', musicD: 'CNOL Music · 最近伸びた動画の雰囲気から選びました', use: 'この音源を使う', using: '使用中', collabT: '音源コラボ申請', collabD: 'チャンネルに合わせた音源を一緒に作り、使われた分の収益を分け合います。条件は契約段階でご案内します。', collabBtn: 'コラボを申請', collabDone: '申請しました。審査後にご連絡します。',
    offersT: '広告 · PPLのオファーを受け取る', offersD: 'オンの間だけCNOL ADの広告・PPLオファーが届きます。オフにするとオファーに情報は使われません。', pplBtn: 'PPLの問い合わせ', pplDone: '問い合わせを送りました。',
    profT: 'プロフィール', name: '名前', language: '使用言語', save: '保存', chT: 'チャンネル連携', chRule: 'チャンネルは、そのチャンネルを持つGoogleアカウントの承認でのみ登録されます。リンクの貼り付けやStudioの権限招待では登録できません。', chSoon: 'Googleチャンネル連携は近日公開です。',
    agT: 'エージェント · 通知', time: '朝のブリーフィング時刻', via: '受け取り先', kakao: 'カカオトーク', email: 'メール', push: 'アプリ通知',
    rUp: '48時間急上昇', rDown: '48時間急落', rRef: 'リファレンスのヒット', rGap: '投稿の空白', rIssue: 'チャンネル問題を即時通知', account: 'アカウント', adminOpen: '管理者ページを開く'
  }
};
let lang = getLang();
const a = (k, vars) => {
  let s = (A[lang] && A[lang][k]) ?? A.ko[k] ?? k;
  if (vars) for (const v of Object.keys(vars)) s = s.replace('{' + v + '}', vars[v]);
  return s;
};
const PLAN = { free: { ko: '무료', en: 'Free', ja: '無料' }, solo: { ko: '솔로', en: 'Solo', ja: 'ソロ' }, plus: { ko: '플러스', en: 'Plus', ja: 'プラス' }, team: { ko: '팀', en: 'Team', ja: 'チーム' }, agency: { ko: '에이전시', en: 'Agency', ja: 'エージェンシー' }, enterprise: { ko: '엔터프라이즈', en: 'Enterprise', ja: 'エンタープライズ' } };
const LANG_NAME = { ko: { ko: '한국어', en: 'Korean', ja: '韓国語' }, en: { ko: '영어', en: 'English', ja: '英語' }, ja: { ko: '일본어', en: 'Japanese', ja: '日本語' } };

const I = {
  home: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12l6-6"/>',
  briefing: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  channel: '<path d="M5 20V11M12 20V5M19 20v-6M3 20h18"/>',
  refs: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  ideas: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
  partners: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  settings: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  admin: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>'
};
const svg = (p, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

// ---------- 상태 ----------
let session = null; let user = null; let profile = null; let isAdmin = false;
let myChannels = []; let refs = []; let ideas = []; let collected = [];
const ui = { tab: 'same', plat: 'all', fmt: 'all', tr: true, sel: 0, todaySaved: false, rtHover: null, lnHover: null, chat: null, used: { 1: true }, collab: false };

// ---------- 예시 데이터 ----------
const FEED = [
  { cat: 'store', plat: 'yt', t: { ko: '욕실 틈새 수납 5종 실측 비교', en: '5 bathroom gap organizers, measured', ja: '浴室すき間収納5種を実測比較' }, ch: '생활꿀템랩', v: 71, x: 6.2, fmt: 'cmp', hook: { ko: '결과 먼저', en: 'Result first', ja: '結果から' }, len: '34s', music: { ko: '밝음 · 116BPM', en: 'Bright · 116BPM', ja: '明るい · 116BPM' }, tone: '#EDE7F6',
    why: { ko: '첫 2초에 “10cm 틈”을 자로 보여줘서 궁금증을 만들었어요.', en: 'It shows a “10 cm gap” with a ruler in the first 2 seconds to spark curiosity.', ja: '最初の2秒で「10cmのすき間」を定規で見せ、興味を引きました。' },
    apply: { ko: '다이소 포맷과 합쳐 “1,000원으로 틈새 채우기”로 가 보세요.', en: 'Blend it with your dollar-store format: “Fill the gap for $1.”', ja: '100均フォーマットと合わせて「100円ですき間を埋める」に。' } },
  { cat: 'store', plat: 'tt', src: { en: 'Does this $1 organizer actually work?' }, srcLang: 'en', t: { ko: '1달러 정리함, 진짜 쓸만할까?', en: 'Does this $1 organizer actually work?', ja: '1ドルの整理ボックス、本当に使える?' }, ch: 'tidy.lab', v: 120, x: 5.1, fmt: 'exp', hook: { ko: '질문형', en: 'Question', ja: '質問型' }, len: '21s', music: { ko: '경쾌 · 122BPM', en: 'Upbeat · 122BPM', ja: '軽快 · 122BPM' }, tone: '#E0F7FA',
    why: { ko: '질문으로 시작하고 답을 마지막까지 미뤄서 끝까지 보게 만들었어요.', en: 'It opens with a question and holds the answer to the end.', ja: '質問で始め、答えを最後まで引っ張って最後まで見せました。' },
    apply: { ko: '국내 1,000원 제품으로 같은 질문을 던지는 실험 편을 추천해요.', en: 'Ask the same question with local budget products.', ja: '国内の100円商品で同じ問いを立てる実験編がおすすめ。' } },
  { cat: 'store', plat: 'ig', src: { ja: '冷蔵庫が広くなる収納3つ' }, srcLang: 'ja', t: { ko: '냉장고가 넓어지는 수납 3가지', en: '3 ways to make your fridge roomier', ja: '冷蔵庫が広くなる収納3つ' }, ch: 'kurashi_note', v: 48, x: 4.4, fmt: 'tut', hook: { ko: '숫자형', en: 'Numbered', ja: '数字型' }, len: '28s', music: { ko: '차분 · 98BPM', en: 'Calm · 98BPM', ja: '落ち着き · 98BPM' }, tone: '#FFF3E0',
    why: { ko: '“3가지”로 끝이 보이게 해서 이탈이 적어요.', en: '“3 ways” makes the end visible, so fewer people leave.', ja: '「3つ」で終わりが見え、離脱が少ないです。' },
    apply: { ko: '냉장고 칸별 정리로 3편 시리즈를 만들 수 있어요.', en: 'Turn it into a 3-part fridge series.', ja: '冷蔵庫の段ごとに3本シリーズにできます。' } },
  { cat: 'store', plat: 'tt', src: { en: 'Before/after: tiny closet' }, srcLang: 'en', t: { ko: '작은 옷장 비포 · 애프터', en: 'Before/after: tiny closet', ja: '小さなクローゼットのビフォーアフター' }, ch: 'roomreset', v: 86, x: 3.9, fmt: 'twist', hook: { ko: '결과 먼저', en: 'Result first', ja: '結果から' }, len: '17s', music: { ko: '팝 · 120BPM', en: 'Pop · 120BPM', ja: 'ポップ · 120BPM' }, tone: '#FCE4EC',
    why: { ko: '애프터를 먼저 보여주고 과정을 빠르게 되감아요.', en: 'It shows the after first, then rewinds the process fast.', ja: 'アフターを先に見せ、過程を早戻しで見せます。' },
    apply: { ko: '“3분 만에 옷장 정리” 타임랩스로 짧게 가세요.', en: 'Try a short “3-minute closet reset” time-lapse.', ja: '「3分でクローゼット整理」のタイムラプスで短く。' } },
  { cat: 'cvs', plat: 'yt', t: { ko: '편의점 신상 블라인드 테스트', en: 'Blind taste test: new snacks', ja: 'コンビニ新商品の目隠しテスト' }, ch: '편의점털이단', v: 29, x: 3.8, fmt: 'react', hook: { ko: '질문형', en: 'Question', ja: '質問型' }, len: '27s', music: { ko: '통통 튀는 · 124BPM', en: 'Bouncy · 124BPM', ja: '弾む · 124BPM' }, tone: '#E8F5E9',
    why: { ko: '눈가리개로 결과를 숨겨 끝까지 보게 해요.', en: 'The blindfold hides the result, so viewers stay.', ja: '目隠しで結果を隠し、最後まで見せます。' },
    apply: { ko: '수납템 블라인드 테스트로 응용할 수 있어요.', en: 'Try a blind test of storage products.', ja: '収納グッズの目隠しテストに応用できます。' } },
  { cat: 'pet', plat: 'yt', t: { ko: '고양이가 박스를 고르는 기준', en: 'How cats choose a box', ja: '猫が箱を選ぶ基準' }, ch: '냥냥극장', v: 44, x: 5.4, fmt: 'exp', hook: { ko: '질문형', en: 'Question', ja: '質問型' }, len: '22s', music: { ko: '귀여운 · 104BPM', en: 'Cute · 104BPM', ja: 'かわいい · 104BPM' }, tone: '#F3E5F5',
    why: { ko: '얼굴 클로즈업으로 시작해 첫 2초 이탈이 적어요.', en: 'A close-up opening keeps early drop-off low.', ja: '顔のアップから始まり、最初の2秒の離脱が少ないです。' },
    apply: { ko: '냥집사 일기의 오프닝을 이렇게 바꿔 보세요.', en: 'Use this opening on your cat channel.', ja: '猫日記のオープニングをこう変えてみましょう。' } },
  { cat: 'trip', plat: 'yt', t: { ko: '캐리어 공간 2배로 접는 법', en: 'Fold to double your suitcase space', ja: 'スーツケースの容量を2倍にする畳み方' }, ch: '짐싸기장인', v: 38, x: 4.6, fmt: 'tut', hook: { ko: '결과 먼저', en: 'Result first', ja: '結果から' }, len: '41s', music: { ko: '산뜻한 팝 · 120BPM', en: 'Fresh pop · 120BPM', ja: '爽やかポップ · 120BPM' }, tone: '#FFFDE7',
    why: { ko: '꽉 찬 가방과 반 빈 가방을 처음에 나란히 보여줘요.', en: 'It opens with a full bag next to a half-empty one.', ja: '最初にパンパンのバッグと半分空のバッグを並べて見せます。' },
    apply: { ko: '여행 시즌에 “캐리어 수납템”으로 연결하면 좋아요.', en: 'Link it to suitcase organizers in travel season.', ja: '旅行シーズンに「スーツケース収納グッズ」へつなげましょう。' } },
  { cat: 'food', plat: 'ig', t: { ko: '3분 계란 요리 3가지', en: '3 three-minute egg dishes', ja: '3分でできる卵料理3つ' }, ch: '혼밥연구소', v: 33, x: 4.1, fmt: 'tut', hook: { ko: '숫자형', en: 'Numbered', ja: '数字型' }, len: '39s', music: { ko: '어쿠스틱 · 96BPM', en: 'Acoustic · 96BPM', ja: 'アコースティック · 96BPM' }, tone: '#E0F2F1',
    why: { ko: '완성샷을 먼저 보여주고 재료를 빠르게 보여줘요.', en: 'It shows the finished dish first, then the ingredients fast.', ja: '完成写真を先に見せ、材料を素早く見せます。' },
    apply: { ko: '자취요리 1분 채널에 바로 쓸 수 있어요.', en: 'Ready to use on your 1-minute cooking channel.', ja: '1分自炊チャンネルにすぐ使えます。' } }
];
const FMT = { cmp: { ko: '비교', en: 'Comparison', ja: '比較' }, exp: { ko: '실험', en: 'Experiment', ja: '実験' }, tut: { ko: '튜토리얼', en: 'Tutorial', ja: 'チュートリアル' }, twist: { ko: '반전', en: 'Twist', ja: '反転' }, react: { ko: '리액션', en: 'Reaction', ja: 'リアクション' } };
const PLAT = { yt: 'YouTube', tt: 'TikTok', ig: 'Instagram' };
const RECS = [
  { k: 'a', init: '생', name: '생활꿀템랩', plat: 'youtube', handle: '@lifehacklab', meta: { ko: 'YouTube · 구독자 42만 · 48시간 ▲ 높음', en: 'YouTube · 420K subs · 48h ▲ high', ja: 'YouTube · 登録者42万 · 48時間 ▲ 高' }, bg: '#E0F7FA', fg: '#006064' },
  { k: 'b', init: 'T', name: 'tidy.lab', plat: 'tiktok', handle: '@tidy.lab', meta: { ko: 'TikTok · 미국 · 팔로워 180만', en: 'TikTok · US · 1.8M followers', ja: 'TikTok · 米国 · フォロワー180万' }, bg: '#FCE4EC', fg: '#880E4F' },
  { k: 'c', init: 'く', name: 'kurashi_note', plat: 'instagram', handle: 'kurashi_note', meta: { ko: 'Instagram · 일본 · 팔로워 65만', en: 'Instagram · Japan · 650K followers', ja: 'Instagram · 日本 · フォロワー65万' }, bg: '#FFF3E0', fg: '#E65100' },
  { k: 'd', init: '다', name: '다이소 탐험대', plat: 'youtube', handle: '@daiso-explorer', meta: { ko: 'YouTube · 구독자 21만 · 48시간 ▲ 보통', en: 'YouTube · 210K subs · 48h ▲ medium', ja: 'YouTube · 登録者21万 · 48時間 ▲ 中' }, bg: '#E8EAF6', fg: '#283593' },
  { k: 'e', init: '살', name: '살림 실험실', plat: 'youtube', handle: '@salim-lab', meta: { ko: 'YouTube · 구독자 9.8만 · 새로 뜨는 채널', en: 'YouTube · 98K subs · rising', ja: 'YouTube · 登録者9.8万 · 急成長' }, bg: '#E8F5E9', fg: '#1B5E20' },
  { k: 'f', init: 'R', name: 'roomreset', plat: 'tiktok', handle: '@roomreset', meta: { ko: 'TikTok · 미국 · 팔로워 92만', en: 'TikTok · US · 920K followers', ja: 'TikTok · 米国 · フォロワー92万' }, bg: '#F3E5F5', fg: '#6A1B9A' }
];

// ---------- 공통 ----------
async function loadData() {
  const [c, r, i, col] = await Promise.all([
    sb.from('channels').select('*').order('connected_at'),
    sb.from('reference_channels').select('*').order('created_at', { ascending: false }),
    sb.from('ideas').select('*').order('created_at', { ascending: false }),
    sb.from('collected_items').select('*').order('created_at', { ascending: false }).limit(60)
  ]);
  myChannels = c.data || []; refs = r.data || []; ideas = i.data || []; collected = col.data || [];
}

function renderChrome() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-a]').forEach((el) => { el.textContent = a(el.dataset.a); });
  document.getElementById('planLine').textContent = a('plan', { p: (PLAN[profile.plan] || PLAN.free)[lang] });
  document.getElementById('who').textContent = profile.display_name || user.email || '';
  const ch = myChannels.length
    ? myChannels.map((c) => `<div style="display:flex;align-items:center;gap:10px;padding:6px 4px"><span style="width:32px;height:32px;border-radius:16px;background:var(--primary-tint);color:var(--primary-dark);display:flex;align-items:center;justify-content:center;font-weight:900;flex:none">${esc((c.title || '?').slice(0, 1))}</span><span style="font-size:14px">${esc(c.title)}</span></div>`).join('')
    : `<span style="font-size:13px;color:var(--ink-2);padding:2px 4px">${esc(a('noCh'))}</span>`;
  document.getElementById('myCh').innerHTML = `<span style="font-size:12px;color:var(--ink-2);padding:0 4px">${esc(a('myCh', { n: myChannels.length }))}</span>${ch}
    <a href="#settings" style="display:flex;align-items:center;gap:8px;min-height:44px;padding:0 4px;font-size:14px;font-weight:700;text-decoration:none">${svg('<path d="M12 5v14M5 12h14"/>', 20)}${esc(a('addCh'))}</a>`;
  const items = ['home', 'briefing', 'channel', 'refs', 'ideas', 'partners', 'settings'];
  const cur = currentRoute();
  let html = items.map((k) => `<a href="#${k}" ${k === cur ? 'aria-current="page"' : ''}>${svg(I[k])}${esc(a(k))}</a>`).join('');
  if (isAdmin) html += `<a href="/admin">${svg(I.admin)}${esc(a('admin'))}</a>`;
  html += `<a href="#logout" id="logoutLink">${svg(I.logout)}${esc(a('logout'))}</a>`;
  document.getElementById('nav').innerHTML = html;
  document.getElementById('logoutLink').addEventListener('click', async (e) => { e.preventDefault(); await sb.auth.signOut(); location.replace('/'); });
}

function currentRoute() {
  const h = (location.hash || '#home').slice(1);
  return ['home', 'briefing', 'channel', 'refs', 'ideas', 'partners', 'settings'].includes(h) ? h : 'home';
}

function setTitle(k) { document.getElementById('title').textContent = a(k); document.title = a(k) + ' · CNOL RADAR'; }

function chip(label, on, attrs) { return `<button type="button" class="chip rip" aria-pressed="${on}" ${attrs}>${on ? '✓ ' : ''}${esc(label)}</button>`; }

function route() {
  renderChrome();
  const r = currentRoute();
  setTitle(r);
  const v = document.getElementById('view');
  ({ home: viewHome, briefing: viewBriefing, channel: viewChannel, refs: viewRefs, ideas: viewIdeas, partners: viewPartners, settings: viewSettings })[r](v);
  v.focus({ preventScroll: true });
}

function demoBanner() {
  return myChannels.length ? '' : `<div role="note" class="fu" style="padding:12px 16px;border-radius:8px;background:var(--warn-bg);color:var(--warn-ink);font-size:14px;line-height:1.6">${esc(a('demoNote'))}</div>`;
}

// ---------- 레이더 홈 ----------
function viewHome(v) {
  const list = FEED.map((f, i) => ({ ...f, i })).filter((f) => {
    if (ui.tab === 'same' && f.cat !== 'store') return false;
    if (ui.tab === 'other' && f.cat === 'store') return false;
    if (ui.plat !== 'all' && f.plat !== ui.plat) return false;
    if (ui.fmt !== 'all' && f.fmt !== ui.fmt) return false;
    return true;
  });
  const sel = FEED[ui.sel];
  const title = (f) => (f.srcLang && !ui.tr ? f.src[f.srcLang] : f.t[lang]);
  const feedHtml = ui.tab === 'box'
    ? (collected.length ? collected.map((c) => `<div class="vcard" style="cursor:default"><div class="thumb" style="background:#F3F1F6"><span class="badge" style="left:8px;background:#fff">${esc(PLAT[{ youtube: 'yt', tiktok: 'tt', instagram: 'ig' }[c.platform]] || c.platform)}</span>${svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>', 34)}</div><div style="padding:10px 12px 12px" class="stack"><b style="font-size:12px;word-break:break-all">${esc(c.url)}</b><span class="tag gray" style="align-self:flex-start">${esc(a('queued'))}</span></div></div>`).join('') : `<div class="empty" style="grid-column:1/-1">${esc(a('boxEmpty'))}</div>`)
    : (list.length ? list.map((f) => `<button type="button" class="vcard tilt" data-sel="${f.i}" aria-pressed="${f.i === ui.sel}">
        <span class="thumb" style="background:${f.tone}"><span class="badge" style="left:8px;background:#fff">${PLAT[f.plat]}</span><span class="badge" style="right:8px;background:var(--primary);color:#fff">${esc(a('usual', { x: f.x }))}</span>${svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>', 34)}<span class="badge num" style="left:8px;top:auto;bottom:8px;background:rgba(0,0,0,.72);color:#fff;border-radius:4px">${esc(fmtViews(f.v, lang, false))}</span></span>
        <span class="stack" style="padding:10px 12px 12px;gap:6px"><b style="font-size:13px;line-height:1.4">${esc(title(f))}</b>${f.srcLang && ui.tr && f.srcLang !== lang ? `<span style="font-size:11px;color:var(--ink-2)">${esc(a('fromLang', { l: LANG_NAME[f.srcLang][lang], o: f.src[f.srcLang] }))}</span>` : ''}<span style="font-size:12px;color:var(--ink-2)">${esc(f.ch)}</span><span style="display:flex;flex-wrap:wrap;gap:4px"><span class="tag gray">${esc(FMT[f.fmt][lang])}</span><span class="tag gray">${esc(f.hook[lang])}</span></span></span>
      </button>`).join('') : `<div class="empty" style="grid-column:1/-1">${esc(a('empty'))}</div>`);
  const refHandles = new Set(refs.map((r) => r.platform + ':' + r.handle));
  v.innerHTML = `${demoBanner()}
  <section class="hero-pick fu">
    <span style="width:56px;height:56px;border-radius:28px;background:var(--secondary);color:#121212;display:flex;align-items:center;justify-content:center;flex:none">${svg(I.briefing, 28)}</span>
    <div class="stack" style="flex:1 1 420px;gap:8px"><span style="font-size:13px;font-weight:700;color:var(--secondary)">${esc(a('pickBy'))}</span><h2 style="margin:0;font-size:24px;line-height:1.35;font-weight:900">${esc(a('pickTitle'))}</h2><span style="font-size:15px;line-height:1.6;color:#E9DDFF">${esc(a('pickWhy'))}</span></div>
    <button type="button" class="btn fab rip" id="todaySave" style="min-height:48px;font-size:15px">${esc(ui.todaySaved ? a('inBoard') : a('brief'))}</button>
  </section>
  <div class="row">
    <section style="flex:2 1 560px;min-width:0" class="stack">
      <div role="tablist" style="display:flex;flex-wrap:wrap;gap:4px;border-bottom:1px solid var(--line)">
        ${['same', 'other', 'box'].map((k) => `<button type="button" role="tab" class="rip" data-tab="${k}" aria-selected="${ui.tab === k}" style="min-height:48px;padding:0 18px;border:0;background:transparent;font-size:15px;font-weight:700;cursor:pointer;color:${ui.tab === k ? 'var(--primary)' : 'var(--ink-2)'};border-bottom:2px solid ${ui.tab === k ? 'var(--primary)' : 'transparent'}">${esc(a({ same: 'tabSame', other: 'tabOther', box: 'tabBox' }[k]))}</button>`).join('')}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span style="font-size:13px;font-weight:700;color:var(--ink-2);min-width:64px">${esc(a('platform'))}</span>
        ${[['all', a('all')], ['yt', 'YouTube'], ['tt', 'TikTok'], ['ig', 'Instagram']].map(([k, l]) => chip(l, ui.plat === k, `data-plat="${k}"`)).join('')}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span style="font-size:13px;font-weight:700;color:var(--ink-2);min-width:64px">${esc(a('format'))}</span>
        ${[['all', a('all')], ...Object.keys(FMT).map((k) => [k, FMT[k][lang]])].map(([k, l]) => chip(l, ui.fmt === k, `data-fmt="${k}"`)).join('')}
        <span style="flex:1 1 auto"></span><button type="button" class="chip" role="switch" aria-checked="${ui.tr}" id="trBtn">${esc(ui.tr ? a('tr') : a('orig'))}</button></div>
      <div class="feed">${feedHtml}</div>
    </section>
    <aside style="flex:1 1 340px;min-width:0" class="stack">
      <section class="card raised stack" style="gap:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><h2 style="margin:0;font-size:16px">${esc(a('analysis'))}</h2><span class="tag">${PLAT[sel.plat]} · ${esc(a('usual', { x: sel.x }))}</span></div>
        <b style="font-size:17px;line-height:1.4">${esc(title(sel))}</b>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">
          ${[[a('hook'), sel.hook[lang]], [a('format'), FMT[sel.fmt][lang]], [a('len'), sel.len], [a('music'), sel.music[lang]]].map(([k, val]) => `<span style="padding:10px;border-radius:8px;background:var(--bg)" class="stack"><span style="font-size:11px;color:var(--ink-2)">${esc(k)}</span><b style="font-size:13px">${esc(val)}</b></span>`).join('')}
        </div>
        <div class="stack" style="gap:4px"><span style="font-size:12px;font-weight:700;color:var(--primary-dark)">${esc(a('why'))}</span><span style="font-size:14px;line-height:1.6">${esc(sel.why[lang])}</span></div>
        <div class="stack" style="gap:4px"><span style="font-size:12px;font-weight:700;color:var(--primary-dark)">${esc(a('apply'))}</span><span style="font-size:14px;line-height:1.6">${esc(sel.apply[lang])}</span></div>
      </section>
      <section class="card stack" style="gap:6px;padding:16px 0 8px">
        <div style="padding:0 20px 6px;display:flex;justify-content:space-between;align-items:center;gap:8px"><h2 style="margin:0;font-size:16px">${esc(a('recs'))}</h2><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-2)"><span class="live" style="width:8px;height:8px;border-radius:4px;background:var(--secondary)"></span>${esc(a('every'))}</span></div>
        ${RECS.map((r) => { const on = refHandles.has(r.plat + ':' + r.handle); return `<div style="display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:12px;align-items:center;padding:8px 20px"><span style="width:36px;height:36px;border-radius:18px;background:${r.bg};color:${r.fg};display:flex;align-items:center;justify-content:center;font-weight:900">${esc(r.init)}</span><span class="stack" style="gap:2px;min-width:0"><b style="font-size:14px">${esc(r.name)}</b><span style="font-size:12px;color:var(--ink-2)">${esc(r.meta[lang])}</span></span><button type="button" class="chip" data-rec="${r.k}" aria-pressed="${on}" ${on ? 'disabled' : ''}>${esc(on ? a('added') : a('addRef'))}</button></div>`; }).join('')}
      </section>
      <section class="card stack" style="gap:12px">
        <h2 style="margin:0;font-size:16px">${esc(a('bulkT'))}</h2>
        <label for="bulk" style="font-size:13px;line-height:1.5;color:var(--ink-2)">${esc(a('bulkD'))}</label>
        <textarea id="bulk" class="textarea" rows="4" placeholder="https://youtube.com/shorts/…&#10;https://www.tiktok.com/@…/video/…&#10;https://www.instagram.com/reel/…"></textarea>
        <button type="button" class="btn rip" id="bulkBtn">${esc(a('bulkBtn'))}</button>
      </section>
    </aside>
  </div>`;
  v.querySelector('#todaySave').onclick = async () => { if (ui.todaySaved) return; const { error } = await sb.from('ideas').insert({ owner_id: user.id, title: a('pickTitle').replace(/^.*‘|’.*$|^.*“|”.*$|^.*「|」.*$/g, '') || a('pickTitle'), note: a('pickWhy') }); if (error) return snack(a('error')); ui.todaySaved = true; await loadData(); snack(a('saved')); viewHome(v); };
  v.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => { ui.tab = b.dataset.tab; viewHome(v); }; });
  v.querySelectorAll('[data-plat]').forEach((b) => { b.onclick = () => { ui.plat = b.dataset.plat; viewHome(v); }; });
  v.querySelectorAll('[data-fmt]').forEach((b) => { b.onclick = () => { ui.fmt = b.dataset.fmt; viewHome(v); }; });
  v.querySelectorAll('[data-sel]').forEach((b) => { b.onclick = () => { ui.sel = Number(b.dataset.sel); viewHome(v); }; });
  v.querySelector('#trBtn').onclick = () => { ui.tr = !ui.tr; viewHome(v); };
  v.querySelectorAll('[data-rec]').forEach((b) => { b.onclick = async () => { const r = RECS.find((x) => x.k === b.dataset.rec); const { error } = await sb.from('reference_channels').insert({ owner_id: user.id, platform: r.plat, handle: r.handle, title: r.name }); if (error && error.code !== '23505') return snack(a('error')); await loadData(); snack(a('saved')); viewHome(v); }; });
  v.querySelector('#bulkBtn').onclick = async () => {
    const lines = v.querySelector('#bulk').value.split(/\s+/).map((s) => s.trim()).filter(Boolean).slice(0, 50);
    const rows = lines.map((u) => ({ u, p: detectPlatform(u) })).filter((x) => x.p).map((x) => ({ owner_id: user.id, platform: x.p, url: x.u }));
    if (!rows.length) return snack(a('bulkBad'));
    const { error } = await sb.from('collected_items').insert(rows);
    if (error) return snack(a('error'));
    await loadData(); ui.tab = 'box'; snack(a('bulkDone', { n: rows.length })); viewHome(v);
  };
}

function detectPlatform(u) {
  const s = u.toLowerCase();
  if (/(^|\/\/|\.)youtube\.com\/|youtu\.be\//.test(s)) return 'youtube';
  if (/(^|\/\/|\.)tiktok\.com\//.test(s)) return 'tiktok';
  if (/(^|\/\/|\.)instagram\.com\//.test(s)) return 'instagram';
  return null;
}

// ---------- 브리핑 ----------
const CANNED = {
  ko: [['이번 주 업로드 계획 짜줘', '이번 주는 수납 2편, 여행 1편, 편의점 1편을 추천해요.\n화·목 19시가 시청이 가장 많은 시간이에요.'], ['레퍼런스 더 찾아줘', '내 채널과 시청자가 겹치는 채널 3곳을 찾았어요. 레이더 홈의 추천 채널에서 한 번에 추가할 수 있어요.'], ['이 무드에 맞는 음원 추천해줘', '밝고 경쾌한 BPM 110~120대 음원 4곡을 골라뒀어요. 음원 · 광고 화면에서 들어볼 수 있어요.']],
  en: [["Plan this week's uploads", 'This week: 2 storage videos, 1 travel, 1 snack video.\nTue and Thu at 7 pm are your busiest hours.'], ['Find more references', 'I found 3 channels whose viewers overlap with yours. Add them from Recommended channels on Radar home.'], ['Suggest music for this mood', "I've picked 4 bright, upbeat tracks at 110–120 BPM. Preview them on Music · Deals."]],
  ja: [['今週の投稿計画を作って', '今週は収納2本、旅行1本、コンビニ1本がおすすめ。\n火・木の19時が最も視聴が多い時間です。'], ['リファレンスをもっと探して', '視聴者が重なるチャンネルを3つ見つけました。レーダーホームのおすすめから追加できます。'], ['この雰囲気に合う音源を教えて', '明るく軽快なBPM110〜120の音源を4曲選びました。音源 · 広告画面で試聴できます。']]
};
function viewBriefing(v) {
  if (!ui.chat) ui.chat = [{ u: false, t: a('agent') + ' · ' + a('hello') }];
  const days = [31, 28, 35, 33, 30, 41, 38, 36, 44, 47, 43, 52, 58, 64];
  const max = Math.max(...days);
  const idea3 = FEED.filter((f) => f.cat === 'store').slice(0, 3);
  v.innerHTML = `${demoBanner()}
  <div class="row">
    <div class="stack" style="flex:2 1 520px;min-width:0;gap:20px">
      <section class="fu" style="background:var(--primary-dark);color:#fff;border-radius:12px;padding:28px;box-shadow:var(--e4);display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;justify-content:space-between">
        <div class="stack" style="flex:1 1 300px;gap:10px"><span style="font-size:14px;color:#E9DDFF">${esc(a('hello'))}</span><p style="margin:0;font-size:22px;line-height:1.45;font-weight:700">${esc(a('sum', { v: fmtViews(128, lang) }))}</p></div>
        <div style="flex:0 1 260px;height:64px;display:flex;align-items:flex-end;gap:4px" aria-hidden="true">${days.map((d, i) => `<span style="flex:1 1 0;border-radius:3px 3px 0 0;height:${Math.round((d / max) * 64)}px;background:${i === days.length - 1 ? 'var(--secondary)' : 'rgba(255,255,255,.55)'}"></span>`).join('')}</div>
      </section>
      <section class="card stack" style="gap:12px"><h2 style="margin:0;font-size:18px">${esc(a('topT'))}</h2>
        <div style="display:grid;grid-template-columns:72px minmax(0,1fr);gap:16px;align-items:center"><span style="width:72px;height:128px;border-radius:8px;background:#EDE7F6"></span><div class="stack" style="gap:8px"><b style="font-size:17px">${esc(FEED[0].t[lang])}</b><span style="font-size:14px;color:var(--ink-2)">${esc(fmtViews(46, lang))} · ${esc(a('usual', { x: 3.1 }))}</span><span style="font-size:14px;line-height:1.6">${esc(FEED[0].why[lang])}</span></div></div>
      </section>
      <section class="stack" style="gap:12px"><h2 style="margin:0;font-size:18px">${esc(a('ideasT'))}</h2>
        <div class="grid-auto">${idea3.map((f) => `<article class="card tilt stack" style="gap:10px"><span class="tag" style="align-self:flex-start">${esc(a('usual', { x: f.x }))}</span><b style="font-size:16px;line-height:1.45">${esc(f.t[lang])}</b><span style="font-size:13px;line-height:1.6;color:var(--ink-2)">${esc(f.apply[lang])}</span><button type="button" class="btn outline rip" data-idea="${esc(f.t[lang])}" style="margin-top:auto">${esc(a('brief'))}</button></article>`).join('')}</div>
      </section>
    </div>
    <aside class="card raised stack" style="flex:1 1 340px;min-width:0;gap:0;padding:0;overflow:hidden">
      <div style="padding:16px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--line)"><span style="width:40px;height:40px;border-radius:20px;background:var(--secondary);color:#121212;display:flex;align-items:center;justify-content:center">${svg(I.briefing)}</span><b>${esc(a('agent'))}</b></div>
      <div class="chat stack" aria-live="polite" style="padding:20px;gap:12px;min-height:360px">${ui.chat.map((m) => `<div class="m ${m.u ? 'u' : 'a'}">${esc(m.t)}</div>`).join('')}</div>
      <div style="padding:0 20px 12px;display:flex;flex-wrap:wrap;gap:8px">${CANNED[lang].map(([q], i) => `<button type="button" class="chip" data-q="${i}">${esc(q)}</button>`).join('')}</div>
      <form id="askForm" style="padding:12px 16px 16px;display:flex;gap:8px;border-top:1px solid var(--line)"><label for="ask" class="sr">${esc(a('ask'))}</label><input id="ask" class="input" style="flex:1 1 auto;min-width:0;border-radius:24px" placeholder="${esc(a('ask'))}"><button class="btn rip" type="submit" aria-label="${esc(a('send'))}" style="border-radius:24px;width:48px;padding:0">${svg('<path d="M4 12l16-8-6 16-2-6z"/>', 20)}</button></form>
    </aside>
  </div>`;
  v.querySelectorAll('[data-idea]').forEach((b) => { b.onclick = async () => { const { error } = await sb.from('ideas').insert({ owner_id: user.id, title: b.dataset.idea }); if (error) return snack(a('error')); b.disabled = true; b.textContent = a('inBoard'); await loadData(); snack(a('saved')); }; });
  v.querySelectorAll('[data-q]').forEach((b) => { b.onclick = () => { const [q, ans] = CANNED[lang][Number(b.dataset.q)]; ui.chat.push({ u: true, t: q }, { u: false, t: ans }); viewBriefing(v); }; });
  v.querySelector('#askForm').onsubmit = (e) => { e.preventDefault(); const q = v.querySelector('#ask').value.trim(); if (!q) return; ui.chat.push({ u: true, t: q }, { u: false, t: a('later') }); viewBriefing(v); };
}

// ---------- 내 채널 ----------
function viewChannel(v) {
  const W = [0.55, 0.42, 0.33, 0.27, 0.24, 0.25, 0.32, 0.45, 0.58, 0.66, 0.7, 0.74, 0.8, 0.78, 0.76, 0.8, 0.86, 0.94, 1.0, 1.08, 1.18, 1.25, 1.15, 0.85];
  const raw = Array.from({ length: 48 }, (_, i) => W[(8 + i) % 24] * (i >= 33 ? 1.4 : 1) * (1 + i * 0.004));
  const k = 128 / raw.reduce((s, x) => s + x, 0);
  const v48 = raw.map((x) => x * k);
  const max = Math.max(...v48);
  const CUR = [38, 41, 39, 44, 42, 40, 47, 45, 48, 44, 50, 53, 49, 51, 57, 54, 56, 52, 60, 55, 58, 63, 59, 62, 68, 66, 73, 71];
  const PREV = [33, 35, 34, 36, 38, 35, 37, 39, 36, 40, 41, 38, 42, 40, 43, 41, 44, 42, 45, 43, 46, 44, 47, 45, 48, 46, 49, 47];
  const X = (i) => 44 + (i / 27) * 586; const Y = (n) => 180 - (n / 80) * 160;
  const pts = (arr) => arr.map((n, i) => `${X(i).toFixed(1)},${Y(n).toFixed(1)}`).join(' ');
  const chs = [['꿀템연구소', 82, '+3,210'], ['자취요리 1분', 32, '+1,040'], ['냥집사 일기', 14, '+380']];
  const tr = [[a('tFeed'), 78], [a('tPage'), 7], [a('tSearch'), 6], [a('tExt'), 4], [a('tEtc'), 5]];
  const head = ui.rtHover === null ? fmtViews(128, lang) : fmtViews(v48[ui.rtHover], lang);
  v.innerHTML = `${demoBanner()}
  <div class="row" style="gap:16px;align-items:stretch">
    <section class="card stack" style="flex:2 1 540px;min-width:0;gap:14px">
      <span style="display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--ink-2)"><span class="live" style="width:8px;height:8px;border-radius:4px;background:var(--down)"></span>${esc(a('rt'))}</span>
      <span class="num" style="font-size:34px;font-weight:900">${esc(head)}</span>
      <div class="bars ${ui.rtHover === null ? '' : 'dim'}" id="b48" style="height:168px">${v48.map((n, i) => `<span data-h="${i}" class="${i === ui.rtHover ? 'hot' : ''}" style="height:${Math.max(4, Math.round((n / max) * 160))}px"></span>`).join('')}</div>
      <span style="font-size:12px;color:var(--ink-2)">${esc(a('rtSub'))}</span>
    </section>
    <section class="card stack" style="flex:1 1 300px;min-width:0;gap:14px"><b>${esc(a('rank'))}</b>
      ${chs.map(([n, val, d], i) => `<div class="stack" style="gap:6px"><div style="display:flex;gap:10px;align-items:center"><span class="tag">${i + 1}</span><span style="flex:1 1 auto">${esc(n)}</span><b class="num">${esc(fmtViews(val, lang, false))}</b><span class="num" style="font-size:12px;color:var(--up);font-weight:700">${d}</span></div><span class="track" style="display:block;height:8px;border-radius:4px;background:#F3F1F6"><span class="grow" style="display:block;height:8px;border-radius:4px;background:var(--primary);width:${Math.round((val / 82) * 100)}%"></span></span></div>`).join('')}
    </section>
  </div>
  <div class="row" style="gap:16px;align-items:stretch">
    <section class="card stack" style="flex:2 1 540px;min-width:0;gap:12px"><b>${esc(a('daily'))}</b>
      <svg viewBox="0 0 640 210" width="100%" role="img" aria-label="${esc(a('daily'))}" style="display:block">
        <line x1="44" y1="20" x2="630" y2="20" stroke="#EEECF1"/><line x1="44" y1="100" x2="630" y2="100" stroke="#EEECF1"/><line x1="44" y1="180" x2="630" y2="180" stroke="#CFCAD8"/>
        <text x="36" y="24" text-anchor="end" font-size="11" fill="#5F5B66">${esc(fmtViews(80, lang, false))}</text><text x="36" y="104" text-anchor="end" font-size="11" fill="#5F5B66">${esc(fmtViews(40, lang, false))}</text>
        <polygon points="44,180 ${pts(CUR)} 630,180" fill="#EDE7F6"/><polyline points="${pts(PREV)}" fill="none" stroke="#8E8A96" stroke-width="2" stroke-dasharray="5 4"/><polyline points="${pts(CUR)}" fill="none" stroke="#6200EE" stroke-width="2"/>
      </svg>
      <span style="font-size:12px;color:var(--ink-2)">${esc(a('confirmed'))}</span>
    </section>
    <section class="card stack" style="flex:1 1 300px;min-width:0;gap:12px"><b>${esc(a('traffic'))}</b>
      ${tr.map(([l, n]) => `<div class="hbar" style="grid-template-columns:96px minmax(0,1fr) 44px"><span style="font-size:14px">${esc(l)}</span><span class="track"><span class="fill grow" style="width:${Math.round((n / 78) * 100)}%"></span></span><b class="num" style="text-align:right">${n}%</b></div>`).join('')}
    </section>
  </div>`;
  const b = v.querySelector('#b48');
  b.querySelectorAll('[data-h]').forEach((s) => { s.onmouseenter = () => { ui.rtHover = Number(s.dataset.h); viewChannel(v); }; });
  b.onmouseleave = () => { ui.rtHover = null; viewChannel(v); };
}

// ---------- 레퍼런스 ----------
function parseChannel(u) {
  const p = detectPlatform(u);
  if (!p) return null;
  let m;
  if (p === 'youtube') m = u.match(/youtube\.com\/(@[\w.\-]+|channel\/[\w\-]+|c\/[\w.\-]+|user\/[\w.\-]+)/i);
  if (p === 'tiktok') m = u.match(/tiktok\.com\/(@[\w.\-]+)/i);
  if (p === 'instagram') m = u.match(/instagram\.com\/([\w.\-]+)/i);
  if (!m) return null;
  const handle = m[1].replace(/\/$/, '');
  if (p === 'instagram' && ['reel', 'p', 'stories', 'explore'].includes(handle)) return null;
  return { platform: p, handle, url: u };
}
function viewRefs(v) {
  v.innerHTML = `<section class="card stack" style="gap:10px">
      <form id="refForm" style="display:flex;flex-wrap:wrap;gap:10px"><label for="refUrl" class="sr">${esc(a('refPh'))}</label><input id="refUrl" class="input" style="flex:1 1 320px" placeholder="${esc(a('refPh'))}"><button class="btn rip" type="submit">${esc(a('add'))}</button></form>
    </section>
    <section class="card" style="padding:0">
      <div style="padding:18px 20px"><h2 style="margin:0;font-size:18px">${esc(a('refList'))}</h2></div>
      ${refs.length ? `<div class="scroll-x"><table class="data" style="min-width:560px"><tbody>${refs.map((r) => `<tr><td><b>${esc(r.title || r.handle)}</b><div style="font-size:12px;color:var(--ink-2)">${esc(r.handle)}</div></td><td><span class="tag gray">${esc(r.platform)}</span></td><td style="text-align:right"><button type="button" class="btn danger" data-del="${esc(r.id)}">${esc(a('del'))}</button></td></tr>`).join('')}</tbody></table></div>` : `<div class="empty" style="box-shadow:none">${esc(a('refNone'))}</div>`}
    </section>`;
  v.querySelector('#refForm').onsubmit = async (e) => {
    e.preventDefault();
    const c = parseChannel(v.querySelector('#refUrl').value.trim());
    if (!c) return snack(a('badUrl'));
    const { error } = await sb.from('reference_channels').insert({ owner_id: user.id, platform: c.platform, handle: c.handle, url: c.url, title: c.handle });
    if (error) return snack(error.code === '23505' ? a('dup') : a('error'));
    await loadData(); snack(a('saved')); viewRefs(v);
  };
  v.querySelectorAll('[data-del]').forEach((b) => { b.onclick = async () => { const { error } = await sb.from('reference_channels').delete().eq('id', b.dataset.del); if (error) return snack(a('error')); await loadData(); viewRefs(v); }; });
}

// ---------- 소재 보드 ----------
function viewIdeas(v) {
  const stages = [['idea', a('stIdea')], ['script', a('stScript')], ['production', a('stProd')], ['uploaded', a('stUp')]];
  v.innerHTML = `<form id="ideaForm" class="card" style="display:flex;flex-wrap:wrap;gap:10px"><label for="ideaT" class="sr">${esc(a('ideaPh'))}</label><input id="ideaT" class="input" style="flex:1 1 320px" placeholder="${esc(a('ideaPh'))}" maxlength="200"><button class="btn rip" type="submit">${esc(a('add'))}</button></form>
    <div class="kanban">${stages.map(([k, l]) => { const items = ideas.filter((i) => i.stage === k); return `<div class="col"><div style="display:flex;justify-content:space-between;align-items:center;padding:2px 4px"><b style="font-size:14px">${esc(l)}</b><span class="tag gray">${items.length}</span></div>${items.map((i) => `<div class="kcard"><b style="font-size:14px;line-height:1.4">${esc(i.title)}</b>${i.note ? `<span style="font-size:12px;color:var(--ink-2);line-height:1.5">${esc(i.note)}</span>` : ''}<label class="sr" for="st-${esc(i.id)}">${esc(a('move'))}</label><select class="select" id="st-${esc(i.id)}" data-move="${esc(i.id)}" style="min-height:36px;font-size:13px">${stages.map(([sk, sl]) => `<option value="${sk}" ${sk === i.stage ? 'selected' : ''}>${esc(sl)}</option>`).join('')}</select></div>`).join('')}</div>`; }).join('')}</div>`;
  v.querySelector('#ideaForm').onsubmit = async (e) => { e.preventDefault(); const t = v.querySelector('#ideaT').value.trim(); if (!t) return; const { error } = await sb.from('ideas').insert({ owner_id: user.id, title: t }); if (error) return snack(a('error')); await loadData(); viewIdeas(v); };
  v.querySelectorAll('[data-move]').forEach((s) => { s.onchange = async () => { const { error } = await sb.from('ideas').update({ stage: s.value }).eq('id', s.dataset.move); if (error) return snack(a('error')); await loadData(); viewIdeas(v); }; });
}

// ---------- 음원 · 광고 ----------
function viewPartners(v) {
  const tracks = [['선반 위의 오후', 'Bright · 116 BPM'], ['작은 방 큰 정리', 'Upbeat · 120 BPM'], ['Click Click Fold', 'Pop · 124 BPM'], ['토요일 정오', 'Calm · 108 BPM']];
  const on = !!profile.offers_opt_in;
  v.innerHTML = `<div class="row">
    <div class="stack" style="flex:3 1 520px;min-width:0;gap:20px">
      <section class="card" style="padding:0"><div style="padding:20px 24px 8px" class="stack"><h2 style="margin:0;font-size:18px">${esc(a('musicT'))}</h2><span style="font-size:13px;color:var(--ink-2)">${esc(a('musicD'))}</span></div>
        <ul class="list">${tracks.map(([n, m], i) => `<li style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 24px;border-top:1px solid #F0EEF3"><span class="stack" style="gap:2px"><b>${esc(n)}</b><span style="font-size:13px;color:var(--ink-2)">${esc(m)}</span></span><button type="button" class="chip" data-use="${i}" aria-pressed="${!!ui.used[i]}">${esc(ui.used[i] ? a('using') : a('use'))}</button></li>`).join('')}</ul></section>
      <section style="background:var(--primary-dark);color:#fff;border-radius:12px;padding:28px;box-shadow:var(--e4)" class="stack"><h2 style="margin:0;font-size:22px">${esc(a('collabT'))}</h2><p style="margin:0;font-size:15px;line-height:1.7;color:#E9DDFF">${esc(a('collabD'))}</p><button type="button" class="btn fab rip" id="collab" style="align-self:flex-start" ${ui.collab ? 'disabled' : ''}>${esc(ui.collab ? a('collabDone') : a('collabBtn'))}</button></section>
    </div>
    <section class="card raised stack" style="flex:2 1 340px;min-width:0;gap:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:16px"><div class="stack" style="gap:4px"><h2 id="offH" style="margin:0;font-size:18px">${esc(a('offersT'))}</h2><span style="font-size:13px;color:var(--ink-2);line-height:1.5">${esc(a('offersD'))}</span></div><button type="button" class="switch" role="switch" aria-labelledby="offH" aria-checked="${on}" id="offSw"><span class="tr"></span><span class="kn"></span></button></div>
      <button type="button" class="btn outline rip" id="ppl">${esc(a('pplBtn'))}</button>
    </section>
  </div>`;
  v.querySelectorAll('[data-use]').forEach((b) => { b.onclick = () => { const i = Number(b.dataset.use); ui.used[i] = !ui.used[i]; viewPartners(v); }; });
  v.querySelector('#collab').onclick = async () => { const { error } = await sb.from('partner_requests').insert({ owner_id: user.id, kind: 'music' }); if (error) return snack(a('error')); ui.collab = true; snack(a('collabDone')); viewPartners(v); };
  v.querySelector('#offSw').onclick = async () => { const { error } = await sb.from('profiles').update({ offers_opt_in: !on }).eq('id', user.id); if (error) return snack(a('error')); profile.offers_opt_in = !on; viewPartners(v); };
  v.querySelector('#ppl').onclick = async () => { const { error } = await sb.from('partner_requests').insert({ owner_id: user.id, kind: 'ppl' }); if (error) return snack(a('error')); snack(a('pplDone')); };
}

// ---------- 설정 ----------
async function viewSettings(v) {
  const { data: ag } = await sb.from('agent_settings').select('*').eq('owner_id', user.id).maybeSingle();
  const s = ag || { briefing_time: '08:30:00', via_kakao: true, via_email: true, via_push: false, rule_up: true, rule_down: true, rule_ref: true, rule_gap: true, rule_issue: true };
  const sw = (k, label) => `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center;padding:8px 0;border-top:1px solid #F0EEF3"><b id="lb-${k}" style="font-size:15px">${esc(label)}</b><button type="button" class="switch" role="switch" aria-labelledby="lb-${k}" aria-checked="${!!s[k]}" data-sw="${k}"><span class="tr"></span><span class="kn"></span></button></div>`;
  v.innerHTML = `<section class="card stack" style="gap:14px"><h2 style="margin:0;font-size:20px">${esc(a('chT'))}</h2>
      <div role="note" style="padding:14px 16px;border-radius:8px;background:var(--primary-soft);font-size:14px;line-height:1.65">${esc(a('chRule'))}</div>
      ${myChannels.length ? myChannels.map((c) => `<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;border-top:1px solid #F0EEF3;padding-top:10px"><span class="stack" style="gap:2px"><b>${esc(c.title)}</b><span style="font-size:13px;color:var(--ink-2)">${esc(c.google_account_hint || '')}</span></span><span class="tag teal">connected</span></div>`).join('') : `<span style="font-size:14px;color:var(--ink-2)">${esc(a('noCh'))}</span>`}
      <button type="button" class="btn rip" id="addCh" style="align-self:flex-start;border-radius:24px">${svg('<path d="M12 5v14M5 12h14"/>', 20)}${esc(a('addCh'))}</button>
    </section>
    <section class="card stack" style="gap:14px"><h2 style="margin:0;font-size:20px">${esc(a('profT'))}</h2>
      <form id="profForm" style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end">
        <div class="field" style="flex:1 1 220px"><label for="pn">${esc(a('name'))}</label><input id="pn" class="input" maxlength="60" value="${esc(profile.display_name || '')}"></div>
        <div class="field" style="flex:0 1 180px"><label for="pl">${esc(a('language'))}</label><select id="pl" class="select">${['ko', 'en', 'ja'].map((l) => `<option value="${l}" ${l === lang ? 'selected' : ''}>${esc(LANG_NAME[l][l])}</option>`).join('')}</select></div>
        <button class="btn rip" type="submit">${esc(a('save'))}</button>
      </form>
    </section>
    <section class="card stack" style="gap:10px"><h2 style="margin:0;font-size:20px">${esc(a('agT'))}</h2>
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end">
        <div class="field"><label for="bt">${esc(a('time'))}</label><input id="bt" type="time" class="input" value="${esc((s.briefing_time || '08:30').slice(0, 5))}"></div>
      </div>
      <span style="font-size:13px;font-weight:700;color:var(--ink-2);margin-top:8px">${esc(a('via'))}</span>
      ${sw('via_kakao', a('kakao'))}${sw('via_email', a('email'))}${sw('via_push', a('push'))}
      ${sw('rule_up', a('rUp'))}${sw('rule_down', a('rDown'))}${sw('rule_ref', a('rRef'))}${sw('rule_gap', a('rGap'))}${sw('rule_issue', a('rIssue'))}
    </section>
    <section class="card stack" style="gap:10px"><h2 style="margin:0;font-size:20px">${esc(a('account'))}</h2><span style="font-size:14px">${esc(user.email || '')} · ${esc((PLAN[profile.plan] || PLAN.free)[lang])}</span>${isAdmin ? `<a class="btn outline rip" href="/admin" style="align-self:flex-start">${esc(a('adminOpen'))}</a>` : ''}</section>`;
  v.querySelector('#addCh').onclick = () => snack(a('chSoon'));
  v.querySelector('#profForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = v.querySelector('#pn').value.trim().slice(0, 60);
    const nl = v.querySelector('#pl').value;
    const { error } = await sb.from('profiles').update({ display_name: name, language: nl }).eq('id', user.id);
    if (error) return snack(a('error'));
    profile.display_name = name; profile.language = nl; lang = nl; setLang(nl);
    snack(a('saved')); route();
  };
  v.querySelector('#bt').onchange = async (e) => { const { error } = await sb.from('agent_settings').update({ briefing_time: e.target.value }).eq('owner_id', user.id); if (error) snack(a('error')); else snack(a('saved')); };
  v.querySelectorAll('[data-sw]').forEach((b) => { b.onclick = async () => { const k = b.dataset.sw; const next = b.getAttribute('aria-checked') !== 'true'; const { error } = await sb.from('agent_settings').update({ [k]: next }).eq('owner_id', user.id); if (error) return snack(a('error')); b.setAttribute('aria-checked', String(next)); }; });
}

// ---------- 시작 ----------
(async function init() {
  session = await requireSession();
  if (!session) return;
  user = session.user;
  const { data: p } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
  profile = p || { id: user.id, display_name: user.email, language: lang, plan: 'free', offers_opt_in: false };
  if (profile.language && profile.language !== lang) { lang = profile.language; setLang(lang); }
  const { data: adm } = await sb.rpc('is_admin');
  isAdmin = !!adm;
  await loadData();
  window.addEventListener('hashchange', route);
  route();
})();
