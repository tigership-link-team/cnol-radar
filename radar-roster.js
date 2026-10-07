// CNOL RADAR v15 — 크리에이터 현황 (#roster): MCN · 대행사처럼 여러 크리에이터(내 채널)를 맡을 때
// · 포트폴리오 숫자: 크리에이터 수 · 총 구독자 · 48시간 조회수(이전 48시간 대비) · 7일 새 영상 · 72시간 터진 영상 · 주의 필요
// · 먼저 챙길 크리에이터: 업로드 공백 · 급락 · 오류 (내 채널은 3일 넘게 안 올리면 공백)
// · 크리에이터 카드: 숫자 · 48시간 비교 막대 · 주간 리포트(크리에이터 전용 · 공유 링크) · 상세 · 비교 고르기
// · 한꺼번에 추가: 링크 · @핸들을 줄마다 → 30개씩 차례로 (손님은 10개씩)
// 숫자는 모두 radar_channel_list(지금 워크스페이스만)에서 와요. 평소 조회수 · 히트율 · 성장률은 우리가 계산한 값이에요.
let C = null;
export function mountRoster(ctx) { C = ctx; }
const e = (s) => C.esc(s);
const t = (k, v) => C.t(k, v);
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (er) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (er) { /* 저장 못 해도 화면은 그대로 */ } }
};

export const TR = {
  ko: {
    g_crG: '크리에이터', tab_roster: '크리에이터 현황', roster: '크리에이터 현황',
    roLead: '소속 크리에이터(내 채널)를 한눈에 보고, 챙길 채널부터 알려 드려요. MCN · 대행사처럼 여러 채널을 맡을 때 좋아요.',
    roAdd: '크리에이터 추가', roAddH: '크리에이터 한꺼번에 추가', roAddSub: '채널 링크나 @핸들을 줄마다 넣으세요. 30개씩 차례로 넣어요.',
    roAddPh: 'https://www.youtube.com/@채널이름\n@handle\n…', roAs: '넣을 곳', roAsMine: '내 크리에이터', roAsRef: '레퍼런스', roAddGo: '한꺼번에 추가',
    roAdding: '{a} / {b} 넣는 중…', roAddDone: '{n}개 채널을 넣었어요 · 영상 {v}개를 모았어요', roAddFail: '못 넣은 것 {n}개', roClose: '닫기', roAddEmpty: '넣을 채널 링크나 @핸들을 적어 주세요.',
    roK_n: '크리에이터', roK_nSub: '레퍼런스 {r}개', roK_nLim: '한도 {m}명', roK_subs: '총 구독자', roK_v48: '48시간 조회수', roK_up: '7일 새 영상', roK_br: '72시간 터진 영상', roK_attn: '먼저 챙길 곳', roK_attnSub: '업로드 공백 · 급락 · 오류',
    roVs: '이전 48시간보다 {p}', roVsNa: '이전 48시간 기록 부족', roUpSub: '쇼츠 {s} · 롱폼 {l}', roBrSub: '평소의 3배 넘게',
    roAttnH: '먼저 챙길 크리에이터', roAttnNone: '지금은 챙길 크리에이터가 없어요. 모두 잘 돌아가고 있어요.',
    roSort: '정렬', roS_attn: '챙길 순', roS_v48: '48시간 조회수', roS_chg: '성장률', roS_subs: '구독자', roS_last: '최근 업로드',
    roLabels: '라벨', roAll: '전체', roNoLabel: '라벨 없음', roSearch: '크리에이터 찾기',
    roM_subs: '구독자', roM_v48: '48시간 조회수', roM_n7: '7일 새 영상', roM_med: '평소 조회수', roM_hit: '히트율',
    roCmp48: '48시간 {a} · 이전 48시간 {b}', roReport: '주간 리포트', roDetail: '상세', roPick: '비교', roCmpGo: '{n}개 비교하기',
    roLastUp: '마지막 업로드 {t}', roNoUp: '올린 영상 기록 없음', roMineBadge: '크리에이터',
    roEmptyH: '아직 크리에이터가 없어요', roEmptyP: '내 채널(소속 크리에이터)을 넣으면 성장 · 정체 · 업로드 공백을 한눈에 챙겨 드려요. 레퍼런스로 지켜보던 채널은 채널 목록에서 ‘내 채널’로 바꿀 수 있어요.',
    roNone: '조건에 맞는 크리에이터가 없어요.', roShown: '{n}명'
  },
  en: {
    g_crG: 'Creators', tab_roster: 'Creator roster', roster: 'Creator roster',
    roLead: 'See every creator you manage (your channels) at a glance, with the ones that need attention first. Built for MCNs and agencies running many channels.',
    roAdd: 'Add creators', roAddH: 'Add creators in bulk', roAddSub: 'Put one channel link or @handle per line. We add them 30 at a time.',
    roAddPh: 'https://www.youtube.com/@channel\n@handle\n…', roAs: 'Add as', roAsMine: 'My creators', roAsRef: 'References', roAddGo: 'Add all',
    roAdding: 'Adding {a} / {b}…', roAddDone: 'Added {n} channels · collected {v} videos', roAddFail: '{n} could not be added', roClose: 'Close', roAddEmpty: 'Type the channel links or @handles to add.',
    roK_n: 'Creators', roK_nSub: '{r} references', roK_nLim: 'limit {m}', roK_subs: 'Total subscribers', roK_v48: 'Views · last 48h', roK_up: 'New videos · 7 days', roK_br: 'Breakouts · 72h', roK_attn: 'Needs attention', roK_attnSub: 'Upload gaps · drops · errors',
    roVs: '{p} vs previous 48h', roVsNa: 'Not enough previous 48h data', roUpSub: '{s} Shorts · {l} long-form', roBrSub: 'Over 3× their usual',
    roAttnH: 'Creators to check first', roAttnNone: 'Nothing needs attention right now. Everyone is on track.',
    roSort: 'Sort', roS_attn: 'Needs attention', roS_v48: 'Views · 48h', roS_chg: 'Growth', roS_subs: 'Subscribers', roS_last: 'Latest upload',
    roLabels: 'Label', roAll: 'All', roNoLabel: 'No label', roSearch: 'Find a creator',
    roM_subs: 'Subscribers', roM_v48: 'Views · 48h', roM_n7: 'New · 7 days', roM_med: 'Usual views', roM_hit: 'Hit rate',
    roCmp48: '48h {a} · previous 48h {b}', roReport: 'Weekly report', roDetail: 'Details', roPick: 'Compare', roCmpGo: 'Compare {n}',
    roLastUp: 'Last upload {t}', roNoUp: 'No uploads on record', roMineBadge: 'Creator',
    roEmptyH: 'No creators yet', roEmptyP: 'Add your channels (the creators you manage) and we will flag growth, stalls and upload gaps at a glance. Channels you already watch as references can be switched to “Mine” in the channel list.',
    roNone: 'No creators match.', roShown: '{n}'
  },
  ja: {
    g_crG: 'クリエイター', tab_roster: 'クリエイター一覧', roster: 'クリエイター一覧',
    roLead: '所属クリエイター（自分のチャンネル）をひと目で確認し、気をつけるべきチャンネルから知らせます。MCN・代理店のように多くのチャンネルを担当する方に。',
    roAdd: 'クリエイターを追加', roAddH: 'クリエイターをまとめて追加', roAddSub: 'チャンネルのリンクか@ハンドルを1行に1つずつ。30件ずつ順番に追加します。',
    roAddPh: 'https://www.youtube.com/@channel\n@handle\n…', roAs: '追加先', roAsMine: '自分のクリエイター', roAsRef: '参考チャンネル', roAddGo: 'まとめて追加',
    roAdding: '{a} / {b} を追加中…', roAddDone: '{n}チャンネルを追加しました・動画{v}本を集めました', roAddFail: '追加できなかったもの{n}件', roClose: '閉じる', roAddEmpty: '追加するチャンネルのリンクか@ハンドルを入力してください。',
    roK_n: 'クリエイター', roK_nSub: '参考{r}件', roK_nLim: '上限{m}人', roK_subs: '総登録者', roK_v48: '48時間の再生数', roK_up: '7日間の新着', roK_br: '72時間の急上昇', roK_attn: '要チェック', roK_attnSub: '投稿の空白・急減・エラー',
    roVs: '前の48時間より{p}', roVsNa: '前の48時間の記録不足', roUpSub: 'ショート{s}・長尺{l}', roBrSub: '普段の3倍超',
    roAttnH: '先にチェックするクリエイター', roAttnNone: '今は気をつけるクリエイターはいません。すべて順調です。',
    roSort: '並べ替え', roS_attn: '要チェック順', roS_v48: '48時間の再生数', roS_chg: '伸び率', roS_subs: '登録者', roS_last: '最近の投稿',
    roLabels: 'ラベル', roAll: 'すべて', roNoLabel: 'ラベルなし', roSearch: 'クリエイターを探す',
    roM_subs: '登録者', roM_v48: '48時間の再生数', roM_n7: '7日間の新着', roM_med: '普段の再生数', roM_hit: 'ヒット率',
    roCmp48: '48時間 {a}・前の48時間 {b}', roReport: '週間レポート', roDetail: '詳細', roPick: '比較', roCmpGo: '{n}件を比較',
    roLastUp: '最終投稿 {t}', roNoUp: '投稿の記録なし', roMineBadge: 'クリエイター',
    roEmptyH: 'まだクリエイターがいません', roEmptyP: '自分のチャンネル（所属クリエイター）を追加すると、伸び・停滞・投稿の空白をひと目で知らせます。参考として見ていたチャンネルは、チャンネル一覧で「自分」に切り替えられます。',
    roNone: '条件に合うクリエイターはいません。', roShown: '{n}人'
  }
};

const IC = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  doc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  warn: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  compare: '<path d="M8 4v16M16 4v16M4 8h8M12 16h8"/>'
};
const ic = (k, s = 16) => C.svg(IC[k] || C.IC[k] || '', s);
const SORTS = ['attn', 'v48', 'chg', 'subs', 'last'];
const ST_ORDER = { err: 0, idle: 1, down: 2, br: 3, up: 4, new: 5, ok: 6 };
const R = { sort: null, label: '', q: '', pick: new Set(), addOpen: false };
const num = (x) => (x == null || x === '' || !Number.isFinite(Number(x)) ? null : Number(x));
const pctTxt = (p) => (p > 0 ? '+' : p < 0 ? '−' : '±') + Math.abs(p) + '%';

function kpi(label, value, sub, cls = '', subCls = '') {
  return `<div class="ro-k ${cls}"><span>${e(label)}</span><b>${e(value)}</b>${sub ? `<small class="${subCls}">${e(sub)}</small>` : ''}</div>`;
}
function attnOf(c) {
  const k = c._st.k;
  return k === 'err' || k === 'idle' || k === 'down';
}
function sortRows(list, sort) {
  const by = {
    attn: (a, b) => ((ST_ORDER[a._st.k] ?? 9) - (ST_ORDER[b._st.k] ?? 9)) || ((Number(b.v48) || 0) - (Number(a.v48) || 0)),
    v48: (a, b) => (Number(b.v48) || 0) - (Number(a.v48) || 0),
    chg: (a, b) => (b._ch ?? -1e9) - (a._ch ?? -1e9),
    subs: (a, b) => (b.subs_hidden ? -1 : Number(b.subs) || 0) - (a.subs_hidden ? -1 : Number(a.subs) || 0),
    last: (a, b) => (Date.parse(b.last_upload || 0) || 0) - (Date.parse(a.last_upload || 0) || 0)
  };
  return [...list].sort(by[sort] || by.attn);
}
function cardHtml(c) {
  const long = C.S.kind === 'long';
  const n7 = (Number(c.n7) || 0) + (Number(c.n7_long) || 0);
  const med = num(long ? c.median_long : c.median);
  const hit = num(long ? c.hit_long : c.hit);
  const a = num(c.v48) || 0, b = num(c.v48_prev);
  const mx = Math.max(a, b || 0, 1);
  const chg = c._ch;
  const lastTxt = c.last_upload ? t('roLastUp', { t: C.agoTxt(c.last_upload) }) : t('roNoUp');
  return `<article class="ro-card dk-fade" data-tilt="3">
    <div class="ro-top">${C.avatar(c.thumb)}<span class="ro-nm"><a href="#ch/${e(c.id)}">${e(c.title)}</a><small>${e(c.handle || '')}${c.category ? ' · ' + e(c.category) : ''}</small></span><span class="dk-tag ${e(c._st.cls)}">${e(c._st.txt)}</span></div>
    <div class="ro-ms">
      <div><span>${e(t('roM_subs'))}</span><b>${e(c.subs_hidden ? '–' : C.fmtN(c.subs))}</b></div>
      <div><span>${e(t('roM_v48'))}</span><b>${e(C.fmtN(a))}</b>${chg != null ? `<small class="${chg > 0 ? 'up' : chg < 0 ? 'dn' : ''}">${e(pctTxt(chg))}</small>` : ''}</div>
      <div><span>${e(t('roM_n7'))}</span><b>${e(C.fmtFull(n7))}</b></div>
      <div><span>${e(t(hit != null ? 'roM_hit' : 'roM_med'))}</span><b>${e(hit != null ? Math.round(hit * 100) + '%' : med != null ? C.fmtN(med) : '–')}</b></div>
    </div>
    <div class="ro-cmp" role="img" aria-label="${e(t('roCmp48', { a: C.fmtN(a), b: b != null ? C.fmtN(b) : '–' }))}"><div class="lb"><span>${e(t('roCmp48', { a: C.fmtN(a), b: b != null ? C.fmtN(b) : '–' }))}</span><span>${e(lastTxt)}</span></div><div class="bar"><i style="width:${((a / mx) * 100).toFixed(1)}%"></i>${b != null ? `<em style="left:calc(${((b / mx) * 100).toFixed(1)}% - 1px)"></em>` : ''}</div></div>
    <div class="ro-acts"><a class="dk-btn sm" href="#report?ch=${encodeURIComponent(c.id)}">${ic('doc', 15)}<span>${e(t('roReport'))}</span></a><a class="dk-btn sm line" href="#ch/${e(c.id)}" data-mi="slide">${e(t('roDetail'))}<span class="mi-sa b" aria-hidden="true">${ic('arrow', 15)}</span></a><label class="ro-ck"><input type="checkbox" data-rocmp="${e(c.id)}" ${R.pick.has(c.id) ? 'checked' : ''} ${!R.pick.has(c.id) && R.pick.size >= 4 ? 'disabled' : ''}>${e(t('roPick'))}</label></div>
  </article>`;
}
function addHtml() {
  return `<section class="dk-card full ro-add dk-fade" id="roAdd" data-viewer-hide${R.addOpen ? '' : ' hidden'}>
    <div class="dk-ch"><h2>${e(t('roAddH'))}</h2><button type="button" class="md-icon" id="roAddX" aria-label="${e(t('roClose'))}">${ic('x', 18)}</button></div>
    <span class="dk-sub">${e(t('roAddSub'))}</span>
    <label class="sr" for="roAddIn">${e(t('roAddH'))}</label>
    <textarea class="dk-textarea" id="roAddIn" rows="5" spellcheck="false" autocomplete="off" placeholder="${e(t('roAddPh'))}"></textarea>
    <div class="ro-bar"><span class="dk-sub" style="font-weight:700">${e(t('roAs'))}</span><div class="dk-seg" role="group" aria-label="${e(t('roAs'))}"><button type="button" data-roas="mine" aria-pressed="true">${e(t('roAsMine'))}</button><button type="button" data-roas="reference" aria-pressed="false">${e(t('roAsRef'))}</button></div>
      <button type="button" class="dk-btn" id="roAddGo" style="margin-left:auto">${ic('plus', 16)}<span>${e(t('roAddGo'))}</span></button></div>
    <div class="ro-prog" id="roProg" hidden><i></i></div>
    <div id="roAddMsg" aria-live="polite"></div>
  </section>`;
}

export async function vRoster(v, r, alive) {
  C.loading(v, t('roster'), e(t('roLead')));
  const list = await C.getChans(true);
  if (!alive()) return;
  if (!R.sort) { const s = ls.get('radar.roSort'); R.sort = SORTS.includes(s) ? s : 'attn'; }
  const long = C.S.kind === 'long';
  const all = (list || []).map((c) => ({ ...c, _st: C.plus.chanState(c, long), _ch: C.plus.chanChange(c) }));
  const mine = all.filter((c) => c.role === 'mine');
  const refs = all.length - mine.length;
  for (const id of [...R.pick]) if (!mine.some((c) => c.id === id)) R.pick.delete(id);
  const head = C.head(t('roster'), e(t('roLead')), `<button type="button" class="dk-hbtn" id="roAddBtn" data-viewer-hide>${ic('plus', 17)}<span>${e(t('roAdd'))}</span></button>`);
  if (!mine.length) {
    R.addOpen = true;
    v.innerHTML = head + `<section class="dk-card full dk-fade"><div class="dk-ch"><h2>${e(t('roEmptyH'))}</h2></div><p class="dk-sub" style="margin:0;font-size:14.5px">${e(t('roEmptyP'))}</p><div><a class="dk-btn line" href="#channels">${e(t('channels'))}</a></div></section>` + addHtml();
    bind(v);
    return;
  }
  // 포트폴리오 숫자
  const subs = mine.filter((c) => !c.subs_hidden).reduce((a, c) => a + (Number(c.subs) || 0), 0);
  const v48 = mine.reduce((a, c) => a + (Number(c.v48) || 0), 0);
  const prevOk = mine.filter((c) => num(c.v48_prev) != null);
  const v48p = prevOk.reduce((a, c) => a + (Number(c.v48_prev) || 0), 0);
  const chg = prevOk.length && v48p >= 1000 ? Math.round(((mine.filter((c) => num(c.v48_prev) != null).reduce((a, c) => a + (Number(c.v48) || 0), 0) - v48p) / v48p) * 100) : null;
  const n7s = mine.reduce((a, c) => a + (Number(c.n7) || 0), 0), n7l = mine.reduce((a, c) => a + (Number(c.n7_long) || 0), 0);
  const br = mine.reduce((a, c) => a + (Number(c.br72) || 0), 0);
  const attn = mine.filter(attnOf).sort((a, b) => (ST_ORDER[a._st.k] - ST_ORDER[b._st.k]) || ((Date.parse(a.last_upload || 0) || 0) - (Date.parse(b.last_upload || 0) || 0)));
  const lim = C.S.ws && C.S.ws.limits && num(C.S.ws.limits.mine);
  const kpis = `<section class="ro-kpis dk-fade">
    ${kpi(t('roK_n'), C.fmtFull(mine.length), t('roK_nSub', { r: refs }) + (lim ? ' · ' + t('roK_nLim', { m: lim }) : ''), 'hot')}
    ${kpi(t('roK_subs'), C.fmtN(subs), '')}
    ${kpi(t('roK_v48'), C.fmtN(v48), chg != null ? t('roVs', { p: pctTxt(chg) }) : t('roVsNa'), '', chg > 0 ? 'up' : chg < 0 ? 'dn' : '')}
    ${kpi(t('roK_up'), C.fmtFull(n7s + n7l), t('roUpSub', { s: n7s, l: n7l }))}
    ${kpi(t('roK_br'), C.fmtFull(br), t('roBrSub'))}
    ${kpi(t('roK_attn'), C.fmtFull(attn.length), t('roK_attnSub'), attn.length ? 'warn' : '')}
  </section>`;
  const attnSec = `<section class="dk-card full ro-attn dk-fade"><div class="dk-ch"><h2>${ic('warn', 18)} ${e(t('roAttnH'))}</h2></div>${attn.length ? `<ul class="ro-alist">${attn.slice(0, 12).map((c) => `<li><a href="#ch/${e(c.id)}">${C.avatar(c.thumb)}<span class="tx"><b>${e(c.title)}</b><small>${e(c.handle || '')}</small></span><span class="dk-tag ${e(c._st.cls)}">${e(c._st.txt)}</span></a></li>`).join('')}</ul>` : `<p class="dk-sub" style="margin:0">${e(t('roAttnNone'))}</p>`}</section>`;
  // 고르기 · 정렬
  const labels = [...new Set(mine.map((c) => c.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const hasNoLabel = mine.some((c) => !c.category);
  if (R.label && R.label !== '-' && !labels.includes(R.label)) R.label = '';
  const ql = R.q.trim().toLowerCase();
  let rows = mine.filter((c) => (!R.label || (R.label === '-' ? !c.category : c.category === R.label)) && (!ql || (c.title || '').toLowerCase().includes(ql) || (c.handle || '').toLowerCase().includes(ql) || (c.category || '').toLowerCase().includes(ql)));
  rows = sortRows(rows, R.sort);
  const labChip = (val, lab) => `<button type="button" class="dk-chip" data-rolab="${e(val)}" aria-pressed="${String(R.label === val)}">${e(lab)}</button>`;
  const bar = `<section class="ro-bar dk-fade">
    <div class="dk-seg" role="group" aria-label="${e(t('roSort'))}">${SORTS.map((s) => `<button type="button" data-rosort="${s}" aria-pressed="${String(R.sort === s)}">${e(t('roS_' + s))}</button>`).join('')}</div>
    <label class="sr" for="roQ">${e(t('roSearch'))}</label><input class="dk-input" id="roQ" type="text" inputmode="search" autocomplete="off" placeholder="${e(t('roSearch'))}" value="${e(R.q)}">
    <button type="button" class="dk-btn sm tonal" id="roCmpGo" ${R.pick.size >= 2 ? '' : 'disabled'}>${ic('compare', 15)}<span>${e(t('roCmpGo', { n: R.pick.size }))}</span></button>
  </section>
  ${labels.length ? `<div class="dk-chips dk-fade" role="group" aria-label="${e(t('roLabels'))}">${labChip('', t('roAll') + ' ' + mine.length)}${labels.map((l) => labChip(l, l)).join('')}${hasNoLabel ? labChip('-', t('roNoLabel')) : ''}</div>` : ''}`;
  const grid = rows.length ? `<div class="ro-grid">${rows.map(cardHtml).join('')}</div>` : `<div class="dk-empty dk-fade">${e(t('roNone'))}</div>`;
  v.innerHTML = head + kpis + addHtml() + attnSec + bar + grid;
  bind(v);
}

function bind(v) {
  const reload = () => C.render();
  v.querySelector('#roAddBtn')?.addEventListener('click', () => {
    R.addOpen = true;
    const box = v.querySelector('#roAdd');
    if (box) { box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => v.querySelector('#roAddIn')?.focus(), 250); }
  });
  v.querySelector('#roAddX')?.addEventListener('click', () => { R.addOpen = false; v.querySelector('#roAdd').hidden = true; v.querySelector('#roAddBtn')?.focus(); });
  let role = 'mine';
  v.querySelectorAll('[data-roas]').forEach((b) => b.addEventListener('click', () => {
    role = b.dataset.roas;
    v.querySelectorAll('[data-roas]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));
  v.querySelector('#roAddGo')?.addEventListener('click', async (ev) => {
    const btn = ev.currentTarget;
    const msg = v.querySelector('#roAddMsg');
    const raw = v.querySelector('#roAddIn').value;
    const inputs = [...new Set(raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean))].slice(0, 300);
    if (!inputs.length) { msg.innerHTML = `<div class="dk-banner warn">${e(t('roAddEmpty'))}</div>`; return; }
    const size = C.S.user?.guest ? 10 : 30;
    const prog = v.querySelector('#roProg');
    btn.disabled = true;
    prog.hidden = false;
    let done = 0, okN = 0, vids = 0;
    const bad = [];
    for (let i = 0; i < inputs.length; i += size) {
      const chunk = inputs.slice(i, i + size);
      msg.innerHTML = `<div class="dk-banner info"><span class="dk-spin"></span> ${e(t('roAdding', { a: Math.min(i + chunk.length, inputs.length), b: inputs.length }))}</div>`;
      const out = await C.act({ action: 'add', inputs: chunk, role });
      if (!out.ok) { bad.push(...chunk.map((x) => ({ input: x, error: out.error }))); }
      else for (const x of out.results || []) { if (x.ok) { okN++; vids += (x.shorts || 0) + (x.longs || 0); } else bad.push(x); }
      done += chunk.length;
      prog.querySelector('i').style.width = Math.round((done / inputs.length) * 100) + '%';
      if (!out.ok && (out.error === 'PLAN_LIMIT' || out.error === 'GUEST_BUSY' || out.error === 'QUOTA')) break;
    }
    btn.disabled = false;
    C.S.chansAt = 0; C.S.profAt = 0;
    msg.innerHTML = (okN ? `<div class="dk-banner good">${e(t('roAddDone', { n: okN, v: C.fmtFull(vids) }))}</div>` : '')
      + (bad.length ? `<div class="dk-banner bad"><div><b>${e(t('roAddFail', { n: bad.length }))}</b>${bad.slice(0, 8).map((x) => `<div>${e(x.input || '')} · ${e(C.errText(x.error))}</div>`).join('')}</div></div>` : '');
    if (okN) { v.querySelector('#roAddIn').value = bad.map((x) => x.input).filter(Boolean).join('\n'); setTimeout(reload, 1400); }
  });
  v.querySelectorAll('[data-rosort]').forEach((b) => b.addEventListener('click', () => { R.sort = b.dataset.rosort; ls.set('radar.roSort', R.sort); reload(); }));
  v.querySelectorAll('[data-rolab]').forEach((b) => b.addEventListener('click', () => { R.label = b.dataset.rolab; reload(); }));
  let timer = 0;
  v.querySelector('#roQ')?.addEventListener('input', (ev) => {
    R.q = ev.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => C.render().then(() => { const el = document.getElementById('roQ'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }), 300);
  });
  v.querySelectorAll('[data-rocmp]').forEach((ck) => ck.addEventListener('change', () => {
    if (ck.checked) R.pick.add(ck.dataset.rocmp); else R.pick.delete(ck.dataset.rocmp);
    const n = R.pick.size;
    v.querySelectorAll('[data-rocmp]').forEach((x) => { x.disabled = !x.checked && n >= 4; });
    const go = v.querySelector('#roCmpGo');
    if (go) { go.disabled = n < 2; go.querySelector('span').textContent = t('roCmpGo', { n }); }
  }));
  v.querySelector('#roCmpGo')?.addEventListener('click', () => { const ids = [...R.pick].slice(0, 4); if (ids.length >= 2) { C.S.cmpIds = ids; location.hash = '#compare?ids=' + ids.join(','); } });
}
