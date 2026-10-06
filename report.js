// CNOL RADAR v14 — 기간 리포트 그리기 (대시보드 #report · 공유 링크 /r 에서 같이 써요)
// · 숫자는 서버 함수 radar_report(기간)가 DB에서 만들어요. 이 파일은 그리기만 해요 (화면 · PDF 인쇄가 같은 모양)
// · 공유 링크로 보는 사람(로그인 없음)도 같은 모양을 봐요. 제목 · 채널 이름은 모두 글자로만 넣어요 (HTML 안 됨)
// · 우리가 계산한 값(기간 조회수 · 평소 대비 · 잘 된 영상)은 'YouTube 지표가 아니에요'라고 꼭 적어요

export const RT = {
  ko: {
    title7: '주간 리포트', title14: '2주 리포트', title28: '4주 리포트',
    period: '{a} ~ {b} · {n}일', prevPeriod: '비교 기간 {a} ~ {b}', made: '만든 시각 {t} (한국 시간)',
    sumH: '한눈에 요약',
    sMine: '내 채널 조회수는 {v}회예요{vs}.', sMineNone: '내 채널 조회수는 아직 비교할 기록이 모이는 중이에요.',
    sVs: ' · 지난 기간보다 {p}', sVsNew: ' · 지난 기간에는 0회였어요',
    sSubsUp: '구독자가 {d}명 늘었어요 (지금 {s}명).', sSubsDown: '구독자가 {d}명 줄었어요 (지금 {s}명).', sSubsFlat: '구독자 수는 그대로예요 ({s}명).',
    sUp: '이번 기간에 영상 {n}개를 올렸어요 (쇼츠 {s} · 롱폼 {l}).', sNoUp: '이번 기간에 올린 영상이 없어요. 업로드 공백이 길어지지 않게 챙겨 보세요.',
    sHits: '레퍼런스에서 평소의 2배 넘게 잘 된 영상이 {n}개 있어요. 가장 좋은 건 “{t}” (평소의 {x}배).',
    sNoHits: '레퍼런스에서 평소보다 크게 터진 영상은 없었어요.',
    sRef: '레퍼런스 {c}개 채널 조회수는 합쳐서 {v}회예요{vs}.',
    sDue: '앞으로 7일 안에 올릴 소재가 {n}개 있어요{late}.', sLate: ' (그중 {n}개는 날짜가 지났어요)',
    sNoMine: '아직 내 채널이 없어요. 내 채널을 넣으면 조회수 · 구독자 변화를 같이 보여 드려요.',
    sEmpty: '지켜보는 채널이 아직 없어요. 채널을 넣으면 다음 리포트부터 숫자가 채워져요.',
    kMine: '내 채널 조회수', kSubs: '내 채널 구독자', kUp: '새로 올린 영상', kRefUp: '레퍼런스 새 영상', kRef: '레퍼런스 조회수', kHits: '평소의 2배 넘은 영상', kWatch: '지켜보는 채널',
    kPrev: '지난 기간보다 {p}', kNoPrev: '지난 기간 기록 없음', kNew: '지난 기간 0회', kFlat: '변화 없음',
    kSubsD: '이번 기간 {d}', kUpD: '쇼츠 {s} · 롱폼 {l}', kHitsD: '레퍼런스 새 영상 {n}개 중', kWatchD: '내 채널 {m} · 레퍼런스 {r}', kBoardD: '아이디어 {i} · 올림 {u}',
    chMine: '일별 조회수 · 내 채널', chRef: '일별 조회수 · 레퍼런스', chCur: '이번 기간', chPrev: '지난 기간 하루 평균 {v}', chToday: '오늘(진행 중)',
    chEmpty: '아직 하루 단위 기록이 부족해요. 매일 쌓여요.',
    chNote: '막대는 매시간 모은 최근 영상들의 조회수가 하루에 늘어난 만큼이에요. 위 숫자 칸의 기간 조회수는 채널 전체 조회수 기준이라 조금 다를 수 있어요 (YouTube가 채널 전체 숫자는 반나절쯤마다 몰아서 올려요).',
    tipDay: '{d} · {v}회',
    secCh: '채널별 성과', cCh: '채널', cSubs: '구독자', cViews: '기간 조회수', cVs: '지난 기간 대비', cUp: '새 영상', cBest: '가장 많이 본 새 영상', mineTag: '내 채널',
    more: '외 {n}개 채널',
    secTop: '이번 기간에 반응이 좋은 영상', topNote: '이번 기간에 올라온 영상 중 같은 채널의 평소 조회수(중앙값)보다 높은 순서예요.',
    noTop: '이번 기간에 올라온 영상이 아직 없어요.',
    ratio: '평소의 {x}배', ratioNew: '막 올라옴',
    secMineUp: '내 채널 새 영상', cDate: '올린 날', cTitle: '제목', cKind: '형식', cViews2: '조회수', cRatio: '평소 대비', short: '쇼츠', long: '롱폼',
    secNext: '다음에 할 일', nextIdeas: '다음 소재 후보', nextNote: '레퍼런스에서 평소보다 잘 된 영상이에요. 내 채널에 맞게 바꿔 만들어 보세요.',
    noNext: '이번 기간에는 따라 해 볼 만큼 튄 영상이 없었어요. 소재 찾기에서 새 소재를 찾아보세요.',
    board: '소재 보드', st_idea: '아이디어', st_script: '대본', st_production: '제작', st_uploaded: '올림',
    due: '다가오는 날짜', dueOn: '{d}까지', overdue: '날짜 지남', noDue: '올릴 날을 정한 소재가 없어요.',
    shipped: '이번 기간에 올린 소재', viewsN: '조회수 {v}',
    secAlerts: '이번 기간 알림', al_breakout: '터진 영상', al_surge: '급상승', al_drop: '급락', al_gap: '업로드 공백', al_missing: '사라진 영상', al_age: '연령 제한', al_region: '지역 차단',
    noAlerts: '이번 기간에는 알림이 없었어요.',
    cover: '데이터를 모으기 시작한 지 {n}일째예요. 기간이 다 차기 전에는 합계와 비교가 작게 나올 수 있어요.',
    foot1: 'YouTube Data API로 받은 공개 데이터 기준이에요.',
    foot2: '기간 조회수 · 평소 대비 · 잘 된 영상은 CNOL RADAR가 계산한 값이에요. YouTube 지표가 아니에요.',
    brand: 'CNOL RADAR · 유튜브 소재 분석 AI 에이전트', openYt: 'YouTube에서 보기'
  },
  en: {
    title7: 'Weekly report', title14: '2-week report', title28: '4-week report',
    period: '{a} – {b} · {n} days', prevPeriod: 'Compared with {a} – {b}', made: 'Made {t} (KST)',
    sumH: 'Summary',
    sMine: 'Your channels got {v} views{vs}.', sMineNone: 'We are still collecting enough history to measure your channels.',
    sVs: ', {p} vs the previous period', sVsNew: ' (0 in the previous period)',
    sSubsUp: 'You gained {d} subscribers (now {s}).', sSubsDown: 'You lost {d} subscribers (now {s}).', sSubsFlat: 'Subscribers held steady ({s}).',
    sUp: 'You uploaded {n} videos this period ({s} Shorts · {l} long-form).', sNoUp: 'No uploads this period. Keep the upload gap from growing.',
    sHits: '{n} reference videos did over 2× their usual. Best: “{t}” ({x}× usual).',
    sNoHits: 'No reference video broke out well above its usual this period.',
    sRef: 'Your {c} reference channels got {v} views combined{vs}.',
    sDue: '{n} ideas are due in the next 7 days{late}.', sLate: ' ({n} overdue)',
    sNoMine: 'No channel of your own yet. Add one to see its views and subscriber changes here.',
    sEmpty: 'You are not watching any channels yet. Add channels and the next report fills in.',
    kMine: 'Your views', kSubs: 'Your subscribers', kUp: 'New uploads', kRefUp: 'New reference videos', kRef: 'Reference views', kHits: 'Videos over 2× usual', kWatch: 'Channels watched',
    kPrev: '{p} vs previous', kNoPrev: 'No previous data', kNew: '0 in previous', kFlat: 'No change',
    kSubsD: '{d} this period', kUpD: '{s} Shorts · {l} long-form', kHitsD: 'of {n} new reference videos', kWatchD: '{m} yours · {r} references', kBoardD: '{i} ideas · {u} uploaded',
    chMine: 'Daily views · your channels', chRef: 'Daily views · references', chCur: 'This period', chPrev: 'Previous daily average {v}', chToday: 'Today (in progress)',
    chEmpty: 'Not enough daily history yet. It builds up every day.',
    chNote: 'Bars show how much the views of recent videos (tracked every hour) grew each day. Period views in the tiles above use each channel’s total views, so they can differ a little (YouTube updates channel totals in batches about every half day).',
    tipDay: '{d} · {v} views',
    secCh: 'By channel', cCh: 'Channel', cSubs: 'Subscribers', cViews: 'Views in period', cVs: 'vs previous', cUp: 'New videos', cBest: 'Most-viewed new video', mineTag: 'Yours',
    more: '+{n} more channels',
    secTop: 'Best-performing videos this period', topNote: 'Videos published this period, ranked by views against the same channel’s usual (median).',
    noTop: 'No videos published this period yet.',
    ratio: '{x}× usual', ratioNew: 'Just posted',
    secMineUp: 'Your new videos', cDate: 'Published', cTitle: 'Title', cKind: 'Type', cViews2: 'Views', cRatio: 'vs usual', short: 'Short', long: 'Long-form',
    secNext: 'What to do next', nextIdeas: 'Topic ideas', nextNote: 'Reference videos that did better than usual. Adapt them to your channel.',
    noNext: 'Nothing stood out enough to copy this period. Try the topic finder for fresh ideas.',
    board: 'Idea board', st_idea: 'Idea', st_script: 'Script', st_production: 'Production', st_uploaded: 'Uploaded',
    due: 'Coming up', dueOn: 'by {d}', overdue: 'Overdue', noDue: 'No ideas have a date yet.',
    shipped: 'Ideas uploaded this period', viewsN: '{v} views',
    secAlerts: 'Alerts this period', al_breakout: 'Breakouts', al_surge: 'Surges', al_drop: 'Drops', al_gap: 'Upload gaps', al_missing: 'Missing videos', al_age: 'Age limits', al_region: 'Region blocks',
    noAlerts: 'No alerts this period.',
    cover: 'We started collecting {n} days ago. Until the period fills up, totals and comparisons may look small.',
    foot1: 'Based on public data from the YouTube Data API.',
    foot2: 'Period views, “vs usual” and best-performing videos are calculated by CNOL RADAR. They are not YouTube metrics.',
    brand: 'CNOL RADAR · AI agent for YouTube topic research', openYt: 'Watch on YouTube'
  },
  ja: {
    title7: '週間レポート', title14: '2週間レポート', title28: '4週間レポート',
    period: '{a}〜{b}・{n}日間', prevPeriod: '比較期間 {a}〜{b}', made: '作成 {t}（韓国時間）',
    sumH: 'まとめ',
    sMine: '自分のチャンネルの再生数は{v}回です{vs}。', sMineNone: '自分のチャンネルは、比較できる記録をまだ集めています。',
    sVs: '・前の期間より{p}', sVsNew: '・前の期間は0回でした',
    sSubsUp: '登録者が{d}人増えました（現在{s}人）。', sSubsDown: '登録者が{d}人減りました（現在{s}人）。', sSubsFlat: '登録者数は変わりません（{s}人）。',
    sUp: 'この期間に{n}本の動画を投稿しました（ショート{s}・長尺{l}）。', sNoUp: 'この期間の投稿はありません。投稿の空白が長くならないよう気をつけましょう。',
    sHits: '参考チャンネルで普段の2倍以上伸びた動画が{n}本あります。一番は「{t}」（普段の{x}倍）。',
    sNoHits: '参考チャンネルで普段より大きく伸びた動画はありませんでした。',
    sRef: '参考チャンネル{c}件の再生数は合計{v}回です{vs}。',
    sDue: 'これから7日以内に投稿予定のネタが{n}件あります{late}。', sLate: '（うち{n}件は日付を過ぎています）',
    sNoMine: 'まだ自分のチャンネルがありません。追加すると再生数・登録者の変化も表示します。',
    sEmpty: 'まだチャンネルを追加していません。追加すると次のレポートから数字が入ります。',
    kMine: '自分の再生数', kSubs: '自分の登録者', kUp: '新しい投稿', kRefUp: '参考チャンネルの新着', kRef: '参考チャンネルの再生数', kHits: '普段の2倍を超えた動画', kWatch: '見ているチャンネル',
    kPrev: '前の期間より{p}', kNoPrev: '前の期間の記録なし', kNew: '前の期間は0回', kFlat: '変化なし',
    kSubsD: 'この期間 {d}', kUpD: 'ショート{s}・長尺{l}', kHitsD: '参考の新着{n}本のうち', kWatchD: '自分{m}・参考{r}', kBoardD: 'アイデア{i}・投稿済み{u}',
    chMine: '日別再生数・自分のチャンネル', chRef: '日別再生数・参考チャンネル', chCur: '今回の期間', chPrev: '前の期間の1日平均 {v}', chToday: '今日（集計中）',
    chEmpty: '日ごとの記録がまだ足りません。毎日たまっていきます。',
    chNote: 'バーは毎時集めている最近の動画の再生数が1日に増えた分です。上の数字の期間再生数はチャンネル全体の再生数が基準のため、少し違うことがあります（YouTubeはチャンネル全体の数字を半日ごとにまとめて更新します）。',
    tipDay: '{d}・{v}回',
    secCh: 'チャンネル別の成果', cCh: 'チャンネル', cSubs: '登録者', cViews: '期間の再生数', cVs: '前の期間比', cUp: '新しい動画', cBest: '一番見られた新着動画', mineTag: '自分',
    more: 'ほか{n}チャンネル',
    secTop: 'この期間に反応が良かった動画', topNote: 'この期間に投稿された動画を、同じチャンネルの普段の再生数（中央値）と比べて高い順に並べています。',
    noTop: 'この期間に投稿された動画はまだありません。',
    ratio: '普段の{x}倍', ratioNew: '投稿直後',
    secMineUp: '自分の新しい動画', cDate: '投稿日', cTitle: 'タイトル', cKind: '形式', cViews2: '再生数', cRatio: '普段比', short: 'ショート', long: '長尺',
    secNext: '次にやること', nextIdeas: '次のネタ候補', nextNote: '参考チャンネルで普段より伸びた動画です。自分のチャンネル向けにアレンジしてみましょう。',
    noNext: 'この期間はまねしたいほど伸びた動画がありませんでした。ネタ検索で新しいネタを探してみましょう。',
    board: 'ネタボード', st_idea: 'アイデア', st_script: '台本', st_production: '制作', st_uploaded: '投稿済み',
    due: 'もうすぐの予定', dueOn: '{d}まで', overdue: '期限切れ', noDue: '投稿日を決めたネタはまだありません。',
    shipped: 'この期間に投稿したネタ', viewsN: '再生数 {v}',
    secAlerts: 'この期間の通知', al_breakout: '急上昇動画', al_surge: '急増', al_drop: '急減', al_gap: '投稿の空白', al_missing: '消えた動画', al_age: '年齢制限', al_region: '地域ブロック',
    noAlerts: 'この期間の通知はありませんでした。',
    cover: 'データを集め始めて{n}日目です。期間がそろうまでは合計や比較が小さく出ることがあります。',
    foot1: 'YouTube Data APIで取得した公開データにもとづいています。',
    foot2: '期間の再生数・普段比・伸びた動画はCNOL RADARが計算した値で、YouTubeの指標ではありません。',
    brand: 'CNOL RADAR・YouTubeネタ分析AIエージェント', openYt: 'YouTubeで見る'
  }
};

const LOC = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' };
const VID = /^[A-Za-z0-9_-]{11}$/;
const CHID = /^UC[A-Za-z0-9_-]{22}$/;
const IMG_OK = /^https:\/\/(yt3\.ggpht\.com|yt3\.googleusercontent\.com|i\.ytimg\.com)\/[^\s"'<>]+$/;
const STAGES = ['idea', 'script', 'production', 'uploaded'];
const ALERTS = ['breakout', 'surge', 'drop', 'gap', 'missing', 'age', 'region'];

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
export const titleKey = (days) => (Number(days) === 14 ? 'title14' : Number(days) === 28 ? 'title28' : 'title7');

// 언어마다 글자 · 숫자 · 날짜 꼴
export function makeFmt(lang) {
  const L = RT[lang] ? lang : 'ko';
  const loc = LOC[L];
  const t = (k, v) => {
    let s = RT[L][k] ?? RT.ko[k] ?? k;
    if (v) for (const x of Object.keys(v)) s = s.split('{' + x + '}').join(String(v[x]));
    return s;
  };
  const nfmt = new Intl.NumberFormat(loc);
  const cfmt = new Intl.NumberFormat(loc, { notation: 'compact', maximumFractionDigits: 1 });
  const nf = (n) => nfmt.format(Math.round(n));
  const cf = (n) => (n == null ? '–' : Math.abs(n) >= 10000 ? cfmt.format(n) : nf(n));
  const day = (s, opt) => { try { return new Intl.DateTimeFormat(loc, { timeZone: 'UTC', ...opt }).format(new Date(String(s).slice(0, 10) + 'T00:00:00Z')); } catch (er) { return String(s || ''); } };
  const dShort = (s) => day(s, { month: 'short', day: 'numeric' });
  const dLong = (s) => day(s, { year: 'numeric', month: 'long', day: 'numeric' });
  const kst = (iso, opt) => { try { return new Intl.DateTimeFormat(loc, { timeZone: 'Asia/Seoul', ...opt }).format(new Date(iso)); } catch (er) { return ''; } };
  const signed = (d) => (d > 0 ? '+' : d < 0 ? '−' : '±') + cf(Math.abs(d));
  // 지난 기간 대비: { txt, cls } 또는 null (비교할 기록이 없으면)
  const pct = (cur, prev) => {
    cur = num(cur); prev = num(prev);
    if (cur == null || prev == null) return null;
    if (prev <= 0) return cur > 0 ? { txt: t('kNew'), cls: 'up', isNew: true } : { txt: t('kFlat'), cls: '' };
    const p = ((cur - prev) / prev) * 100;
    if (Math.abs(p) < 0.5) return { txt: t('kFlat'), cls: '', flat: true };
    const a = Math.abs(p);
    return { txt: (p > 0 ? '+' : '−') + (a >= 100 ? Math.round(a).toLocaleString(loc) : a.toFixed(a < 10 ? 1 : 0)) + '%', cls: p > 0 ? 'up' : 'down', p };
  };
  const ratioTxt = (x) => { x = num(x); return x == null ? '' : x < 0.1 ? t('ratioNew') : t('ratio', { x: x >= 10 ? Math.round(x) : x.toFixed(1) }); };
  return { lang: L, loc, t, nf, cf, dShort, dLong, kst, signed, pct, ratioTxt };
}

const ytVideo = (id, short) => (VID.test(id) ? (short ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`) : null);
const ytThumb = (id) => (VID.test(id) ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null);
const ytChan = (id) => (CHID.test(id) ? `https://www.youtube.com/channel/${id}` : null);
const safeImg = (u) => (typeof u === 'string' && IMG_OK.test(u) ? u : null);
const ICON = {
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  ext: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};

// 보기 좋은 눈금 꼭대기 (1 · 2 · 2.5 · 5 · 10 배수)
function niceMax(v) {
  if (!(v > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (v <= m * p) return m * p;
  return 10 * p;
}

// 일별 막대: 이번 기간 막대 + 지난 기간 하루 평균 점선 (오늘은 진행 중이라 옅게)
//   HTML 막대라 폰에서도 글자가 작아지지 않고, 인쇄해도 또렷해요
function dayChart(F, cap, cur, prev, key, today) {
  const vals = cur.map((r) => Math.max(0, num(r[key]) || 0));
  const pv = prev.map((r) => Math.max(0, num(r[key]) || 0));
  const prevAvg = pv.some((x) => x > 0) ? pv.reduce((a, b) => a + b, 0) / pv.length : null;
  if (!vals.some((x) => x > 0)) return `<figure class="rp-chart"><figcaption>${esc(cap)}</figcaption><div class="rp-chempty">${esc(F.t('chEmpty'))}</div></figure>`;
  const n = vals.length;
  const max = niceMax(Math.max(...vals, prevAvg || 0));
  const pctOf = (v) => Math.max(0, Math.min(100, (v / max) * 100));
  const every = n <= 8 ? 1 : n <= 15 ? 2 : 7;
  const bars = cur.map((r, i) => {
    const v = vals[i];
    const isToday = r.d === today;
    const tip = F.t('tipDay', { d: F.dShort(r.d), v: F.nf(v) }) + (isToday ? ` · ${F.t('chToday')}` : '');
    return `<span class="rp-bar${isToday ? ' today' : ''}" tabindex="0" role="img" aria-label="${esc(tip)}" data-tip="${esc(tip)}"><i style="height:${pctOf(v).toFixed(2)}%"></i></span>`;
  }).join('');
  const tick = (d) => { const p = String(d).slice(5, 10).split('-'); return `${Number(p[0])}/${Number(p[1])}`; }; // 짧게 10/7
  const xl = cur.map((r, i) => `<span>${i % every === 0 || i === n - 1 ? esc(tick(r.d)) : ''}</span>`).join('');
  const avg = prevAvg != null ? `<div class="rp-avg" style="bottom:${pctOf(prevAvg).toFixed(2)}%"></div>` : '';
  const legend = `<div class="rp-lg"><span><i class="cur"></i>${esc(F.t('chCur'))}</span>${prevAvg != null ? `<span><i class="avg"></i>${esc(F.t('chPrev', { v: F.cf(prevAvg) }))}</span>` : ''}${cur.some((r) => r.d === today) ? `<span><i class="today"></i>${esc(F.t('chToday'))}</span>` : ''}</div>`;
  return `<figure class="rp-chart"><figcaption>${esc(cap)}</figcaption>${legend}
    <div class="rp-plot" role="group" aria-label="${esc(cap)}">
      <div class="rp-y" aria-hidden="true"><span>${esc(F.cf(max))}</span><span>${esc(F.cf(max / 2))}</span><span>0</span></div>
      <div class="rp-area"><div class="rp-grid" aria-hidden="true"><i></i><i></i><i></i></div>${avg}<div class="rp-bars" style="--n:${n}">${bars}</div><div class="rp-tip" hidden></div></div>
      <div class="rp-x" aria-hidden="true" style="--n:${n}">${xl}</div>
    </div></figure>`;
}

function tile(label, value, sub, cls = '') {
  return `<div class="rp-kpi"><span class="l">${esc(label)}</span><b class="v">${esc(value)}</b>${sub ? `<span class="s ${cls}">${esc(sub)}</span>` : ''}</div>`;
}

// ---------- 리포트 전체 (HTML 글자) ----------
export function reportHtml(d, opt = {}) {
  const F = makeFmt(opt.lang || 'ko');
  const t = F.t;
  if (!d || typeof d !== 'object') return `<div class="rp-chempty">${esc(t('sEmpty'))}</div>`;
  const days = num(d.days) || 7;
  const S = d.sum || {};
  const mine = S.mine || null, ref = S.ref || null;
  const chans = Array.isArray(d.channels) ? d.channels : [];
  const top = Array.isArray(d.top) ? d.top : [];
  const mineUp = Array.isArray(d.mine_up) ? d.mine_up : [];
  const daily = Array.isArray(d.daily) ? d.daily : [];
  const cur = daily.filter((r) => r.d >= d.from);
  const prev = daily.filter((r) => r.d < d.from);
  const today = d.to;
  const alerts = d.alerts && typeof d.alerts === 'object' ? d.alerts : {};
  const ideas = d.ideas || {};
  const refTop = top.filter((v) => v.role !== 'mine');
  const hits = refTop.filter((v) => num(v.ratio) >= 2);
  const nWatch = (mine?.channels || 0) + (ref?.channels || 0);

  // 머리말
  const head = `<header class="rp-hd">
    <div class="rp-brand"><img src="/logo-96.png" alt="" width="22" height="19"><span>CNOL RADAR</span></div>
    <${opt.h1 ? 'h1' : 'h2'} class="rp-title">${esc(t(titleKey(days)))}</${opt.h1 ? 'h1' : 'h2'}>
    ${d.ws ? `<p class="rp-ws">${esc(d.ws)}</p>` : ''}
    <p class="rp-period">${esc(t('period', { a: F.dLong(d.from), b: F.dLong(d.to), n: days }))}</p>
    <p class="rp-meta">${esc(t('prevPeriod', { a: F.dShort(d.prev_from), b: F.dShort(d.prev_to) }))} · ${esc(t('made', { t: F.kst(d.now, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }))}</p>
  </header>`;

  // 데이터를 모은 날이 기간보다 짧으면 알려요
  let cover = '';
  if (d.first_at) {
    const since = Math.max(1, Math.ceil((Date.parse(d.now) - Date.parse(d.first_at)) / 864e5));
    if (since < days * 2) cover = `<p class="rp-cover">${esc(t('cover', { n: since }))}</p>`;
  }

  // 한눈에 요약 (에이전트 말투)
  const lines = [];
  const vsTxt = (o) => { const p = o ? F.pct(o.views, o.prev) : null; return !p ? '' : p.isNew ? t('sVsNew') : t('sVs', { p: p.txt }); };
  if (!nWatch) lines.push(t('sEmpty'));
  if (mine) {
    lines.push(num(mine.have) ? t('sMine', { v: F.cf(num(mine.views) || 0), vs: vsTxt(mine) }) : t('sMineNone'));
    const sd = num(mine.subs_delta), ss = num(mine.subs);
    if (ss != null) lines.push(sd > 0 ? t('sSubsUp', { d: F.cf(sd), s: F.cf(ss) }) : sd < 0 ? t('sSubsDown', { d: F.cf(-sd), s: F.cf(ss) }) : t('sSubsFlat', { s: F.cf(ss) }));
    const nu = (num(mine.uploads) || 0) + (num(mine.uploads_long) || 0);
    lines.push(nu ? t('sUp', { n: nu, s: num(mine.uploads) || 0, l: num(mine.uploads_long) || 0 }) : t('sNoUp'));
  } else if (nWatch) lines.push(t('sNoMine'));
  if (ref) {
    lines.push(hits.length ? t('sHits', { n: hits.length, t: String(hits[0].title || '').slice(0, 60), x: num(hits[0].ratio) >= 10 ? Math.round(hits[0].ratio) : Number(hits[0].ratio).toFixed(1) }) : t('sNoHits'));
    if (num(ref.have)) lines.push(t('sRef', { c: ref.channels, v: F.cf(num(ref.views) || 0), vs: vsTxt(ref) }));
  }
  const due = Array.isArray(ideas.due) ? ideas.due : [];
  if (due.length) {
    const late = due.filter((x) => x.due_on && x.due_on < today).length;
    lines.push(t('sDue', { n: due.length, late: late ? t('sLate', { n: late }) : '' }));
  }
  const summary = `<section class="rp-sum" aria-labelledby="rpSumH"><h3 id="rpSumH">${esc(t('sumH'))}</h3><ul>${lines.map((l) => `<li>${ICON.check}<span>${esc(l)}</span></li>`).join('')}</ul></section>`;

  // 숫자 칸 4개
  const tiles = [];
  const pTile = (o) => { const p = F.pct(o.views, o.prev); return p ? [t('kPrev', { p: p.txt }), p.cls] : [t('kNoPrev'), 'na']; };
  if (mine) {
    const [s1, c1] = num(mine.have) ? pTile(mine) : [t('kNoPrev'), 'na'];
    tiles.push(tile(t('kMine'), num(mine.have) ? F.cf(num(mine.views) || 0) : '–', s1, c1));
    const sd = num(mine.subs_delta);
    tiles.push(tile(t('kSubs'), num(mine.subs) != null ? F.cf(num(mine.subs)) : '–', sd != null ? t('kSubsD', { d: F.signed(sd) }) : '', sd > 0 ? 'up' : sd < 0 ? 'down' : ''));
    tiles.push(tile(t('kUp'), F.nf((num(mine.uploads) || 0) + (num(mine.uploads_long) || 0)), t('kUpD', { s: num(mine.uploads) || 0, l: num(mine.uploads_long) || 0 })));
  } else {
    tiles.push(tile(t('kWatch'), F.nf(nWatch), t('kWatchD', { m: 0, r: ref?.channels || 0 })));
    const refNew = (num(ref?.uploads) || 0) + (num(ref?.uploads_long) || 0);
    tiles.push(tile(t('kHits'), F.nf(hits.length), t('kHitsD', { n: refNew })));
    tiles.push(tile(t('kRefUp'), F.nf(refNew), t('kUpD', { s: num(ref?.uploads) || 0, l: num(ref?.uploads_long) || 0 })));
  }
  if (ref) {
    const [s2, c2] = num(ref.have) ? pTile(ref) : [t('kNoPrev'), 'na'];
    tiles.push(tile(t('kRef'), num(ref.have) ? F.cf(num(ref.views) || 0) : '–', s2, c2));
  } else {
    const st = ideas.stages && typeof ideas.stages === 'object' ? ideas.stages : {};
    const total = STAGES.reduce((a, k) => a + (num(st[k]) || 0), 0);
    tiles.push(tile(t('board'), F.nf(total), t('kBoardD', { i: num(st.idea) || 0, u: num(st.uploaded) || 0 })));
  }
  const kpis = `<section class="rp-kpis">${tiles.join('')}</section>`;

  // 일별 막대
  const charts = [];
  if (mine) charts.push(dayChart(F, t('chMine'), cur, prev, 'mine', today));
  if (ref) charts.push(dayChart(F, t('chRef'), cur, prev, 'ref', today));
  const chartSec = charts.length ? `<section class="rp-charts${charts.length === 1 ? ' one' : ''}">${charts.join('')}<p class="rp-note">${esc(t('chNote'))}</p></section>` : '';

  // 채널별 성과
  const nShown = chans.length;
  const refTotal = num(ref?.channels) || 0;
  const hidden = Math.max(0, refTotal - chans.filter((c) => !c.mine).length);
  const chRow = (c) => {
    const p = F.pct(c.views, c.prev);
    const img = safeImg(c.thumb);
    const link = ytChan(c.id);
    const best = c.best && VID.test(c.best.id) ? `<a href="${esc(ytVideo(c.best.id, c.best.short))}" target="_blank" rel="noopener">${esc(String(c.best.title || '').slice(0, 70))}</a><small>${esc(F.cf(num(c.best.views) || 0))}${c.best.ratio != null ? ' · ' + esc(F.ratioTxt(c.best.ratio)) : ''}</small>` : '<span class="na">–</span>';
    return `<tr${c.mine ? ' class="mine"' : ''}>
      <th scope="row"><span class="rp-ch">${img ? `<img src="${esc(img)}" alt="" width="28" height="28" loading="lazy" referrerpolicy="no-referrer">` : '<i class="ph"></i>'}<span>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">${esc(c.title)}</a>` : esc(c.title)}${c.mine ? `<em>${esc(t('mineTag'))}</em>` : ''}</span></span></th>
      <td class="r">${c.subs != null ? esc(F.cf(c.subs)) : '<span class="na">–</span>'}${num(c.subs_delta) ? `<small class="${c.subs_delta > 0 ? 'up' : 'down'}">${esc(F.signed(num(c.subs_delta)))}</small>` : ''}</td>
      <td class="r">${num(c.have) ? esc(F.cf(num(c.views) || 0)) : '<span class="na">–</span>'}</td>
      <td class="r">${p ? `<span class="rp-d ${p.cls}">${esc(p.txt)}</span>` : '<span class="na">–</span>'}</td>
      <td class="r">${(num(c.uploads) || 0) + (num(c.uploads_long) || 0)}</td>
      <td class="best">${best}</td></tr>`;
  };
  const chSec = nShown ? `<section class="rp-sec"><h3>${esc(t('secCh'))}</h3><div class="rp-tablewrap" tabindex="0" role="region" aria-label="${esc(t('secCh'))}"><table class="rp-t"><thead><tr><th scope="col">${esc(t('cCh'))}</th><th scope="col" class="r">${esc(t('cSubs'))}</th><th scope="col" class="r">${esc(t('cViews'))}</th><th scope="col" class="r">${esc(t('cVs'))}</th><th scope="col" class="r">${esc(t('cUp'))}</th><th scope="col">${esc(t('cBest'))}</th></tr></thead><tbody>${chans.map(chRow).join('')}</tbody></table></div>${hidden ? `<p class="rp-note">${esc(t('more', { n: hidden }))}</p>` : ''}</section>` : '';

  // 반응 좋은 영상
  const vCard = (v) => {
    const url = ytVideo(v.id, v.short), th = ytThumb(v.id);
    if (!url) return '';
    const hot = num(v.ratio) >= 2;
    return `<li class="rp-v"><a class="th${v.short ? ' sh' : ''}" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(t('openYt'))}: ${esc(v.title)}"><img src="${esc(th)}" alt="" loading="lazy" width="160" height="90"></a>
      <div class="tx"><a class="tt" href="${esc(url)}" target="_blank" rel="noopener">${esc(v.title)}</a>
      <span class="mt">${esc(v.ch_title || '')} · ${esc(F.kst(v.at, { month: 'short', day: 'numeric' }))} · ${esc(v.short ? t('short') : t('long'))}${v.role === 'mine' ? ` · <em>${esc(t('mineTag'))}</em>` : ''}</span>
      <span class="nb"><b>${esc(F.cf(num(v.views) || 0))}</b>${v.ratio != null ? `<span class="rp-rx${hot ? ' hot' : ''}">${esc(F.ratioTxt(v.ratio))}</span>` : ''}</span></div></li>`;
  };
  const topSec = `<section class="rp-sec"><h3>${esc(t('secTop'))}</h3><p class="rp-note">${esc(t('topNote'))}</p>${top.length ? `<ol class="rp-vlist">${top.slice(0, 8).map(vCard).join('')}</ol>` : `<div class="rp-chempty">${esc(t('noTop'))}</div>`}</section>`;

  // 내 채널 새 영상
  const muSec = mine ? `<section class="rp-sec"><h3>${esc(t('secMineUp'))}</h3>${mineUp.length ? `<div class="rp-tablewrap" tabindex="0" role="region" aria-label="${esc(t('secMineUp'))}"><table class="rp-t"><thead><tr><th scope="col">${esc(t('cDate'))}</th><th scope="col">${esc(t('cTitle'))}</th><th scope="col">${esc(t('cKind'))}</th><th scope="col" class="r">${esc(t('cViews2'))}</th><th scope="col" class="r">${esc(t('cRatio'))}</th></tr></thead><tbody>${mineUp.map((v) => {
    const url = ytVideo(v.id, v.short);
    return `<tr><td class="nw">${esc(F.kst(v.at, { month: 'short', day: 'numeric' }))}</td><td class="tt">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(v.title)}</a>` : esc(v.title)}<small class="sub">${esc(v.ch_title || '')}</small></td><td class="nw">${esc(v.short ? t('short') : t('long'))}</td><td class="r">${esc(F.cf(num(v.views) || 0))}</td><td class="r">${v.ratio != null ? `<span class="rp-rx${num(v.ratio) >= 2 ? ' hot' : ''}">${esc(F.ratioTxt(v.ratio))}</span>` : '–'}</td></tr>`;
  }).join('')}</tbody></table></div>` : `<div class="rp-chempty">${esc(t('sNoUp'))}</div>`}</section>` : '';

  // 다음에 할 일: 소재 후보 · 소재 보드 · 다가오는 날짜 · 올린 소재
  const next = refTop.filter((v) => num(v.ratio) >= 1.5).slice(0, 3);
  const stages = ideas.stages && typeof ideas.stages === 'object' ? ideas.stages : {};
  const shipped = Array.isArray(ideas.shipped) ? ideas.shipped : [];
  const nextSec = `<section class="rp-sec rp-next"><h3>${esc(t('secNext'))}</h3>
    <div class="rp-cols">
      <div class="rp-box"><h4>${esc(t('nextIdeas'))}</h4>${next.length ? `<p class="rp-note">${esc(t('nextNote'))}</p><ol class="rp-vlist sm">${next.map(vCard).join('')}</ol>` : `<p class="rp-note">${esc(t('noNext'))}</p>`}</div>
      <div class="rp-box"><h4>${esc(t('board'))}</h4>
        <p class="rp-stages">${STAGES.map((s) => `<span><b>${esc(F.nf(num(stages[s]) || 0))}</b>${esc(t('st_' + s))}</span>`).join('')}</p>
        <h5>${esc(t('due'))}</h5>${due.length ? `<ul class="rp-due">${due.map((x) => { const late = x.due_on && x.due_on < today; return `<li><span>${esc(x.title)}</span><small class="${late ? 'down' : ''}">${esc(late ? t('overdue') : t('dueOn', { d: F.dShort(x.due_on) }))} · ${esc(t('st_' + (STAGES.includes(x.stage) ? x.stage : 'idea')))}</small></li>`; }).join('')}</ul>` : `<p class="rp-note">${esc(t('noDue'))}</p>`}
        ${shipped.length ? `<h5>${esc(t('shipped'))}</h5><ul class="rp-due">${shipped.map((x) => { const url = x.vid ? ytVideo(x.vid, false) : null; return `<li><span>${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(x.title)}</a>` : esc(x.title)}</span>${x.views != null ? `<small>${esc(t('viewsN', { v: F.cf(num(x.views)) }))}</small>` : ''}</li>`; }).join('')}</ul>` : ''}
      </div>
    </div></section>`;

  // 알림 요약
  const al = ALERTS.filter((k) => num(alerts[k]) > 0);
  const alSec = `<section class="rp-sec"><h3>${esc(t('secAlerts'))}</h3>${al.length ? `<p class="rp-alerts">${al.map((k) => `<span class="${k === 'breakout' || k === 'surge' ? 'good' : k === 'drop' || k === 'missing' ? 'bad' : 'warn'}"><b>${esc(F.nf(alerts[k]))}</b>${esc(t('al_' + k))}</span>`).join('')}</p>` : `<p class="rp-note">${esc(t('noAlerts'))}</p>`}</section>`;

  const foot = `<footer class="rp-foot"><p>${esc(t('foot1'))}</p><p>${esc(t('foot2'))}</p><p class="b">${esc(t('brand'))} · <span class="nw">cnol-radar.vercel.app</span></p></footer>`;
  return head + cover + summary + kpis + chartSec + topSec + chSec + muSec + nextSec + alSec + foot;
}

// 막대에 마우스 · 손가락 · 키보드를 올리면 그날 숫자를 보여 줘요
export function bindReport(root) {
  if (!root || root.dataset.rpBound) return;
  root.dataset.rpBound = '1';
  const show = (el) => {
    const area = el.closest('.rp-area');
    const tip = area && area.querySelector('.rp-tip');
    if (!tip) return;
    tip.textContent = el.dataset.tip || '';
    tip.hidden = false;
    const ar = area.getBoundingClientRect(), r = el.getBoundingClientRect();
    const half = Math.min(tip.offsetWidth / 2 || 60, ar.width / 2);
    tip.style.left = Math.min(Math.max(r.left - ar.left + r.width / 2, half), ar.width - half) + 'px';
    area.querySelectorAll('.rp-bar.on').forEach((h) => h.classList.remove('on'));
    el.classList.add('on');
  };
  const hide = (el) => {
    const area = el && el.closest && el.closest('.rp-area');
    if (!area) return;
    const tip = area.querySelector('.rp-tip');
    if (tip) tip.hidden = true;
    area.querySelectorAll('.rp-bar.on').forEach((h) => h.classList.remove('on'));
  };
  const bar = (ev) => ev.target && ev.target.closest && ev.target.closest('.rp-bar');
  root.addEventListener('pointerover', (ev) => { const h = bar(ev); if (h) show(h); });
  root.addEventListener('pointerout', (ev) => { const h = bar(ev); if (h && !h.contains(ev.relatedTarget)) hide(h); });
  root.addEventListener('focusin', (ev) => { const h = bar(ev); if (h) show(h); });
  root.addEventListener('focusout', (ev) => { const h = bar(ev); if (h) hide(h); });
}

// PDF로 저장: 브라우저 인쇄 창 (파일 이름이 되게 제목을 잠깐 바꿔요)
export function printReport(d, lang) {
  const F = makeFmt(lang || 'ko');
  const old = document.title;
  const name = `CNOL RADAR ${F.t(titleKey(d && d.days))} ${d && d.from ? d.from : ''}~${d && d.to ? d.to : ''}${d && d.ws ? ' ' + d.ws : ''}`.replace(/[\\/:*?"<>|]+/g, ' ').trim();
  document.title = name;
  const back = () => { document.title = old; window.removeEventListener('afterprint', back); };
  window.addEventListener('afterprint', back);
  setTimeout(back, 60e3);
  window.print();
}
