// CNOL RADAR v14 — 대시보드 '주간 리포트' 탭 (#report)
// · 기간 고르기(7 · 14 · 28일) · PDF로 저장(브라우저 인쇄) · 고객에게 보낼 공유 링크 (대표 · 편집만)
// · 리포트 숫자는 서버 함수 radar_report가, 공유 링크 스냅샷은 서버(radar v11)가 DB에서 직접 만들어요
// app.js가 mountReport(ctx)로 공용 함수를 넘겨줘요. 문구(TR)는 app.js가 T에 합쳐요.
import { reportHtml, bindReport, printReport, makeFmt, titleKey } from '/report.js';

let C = null;
const e = (s) => C.esc(s);
const t = (k, v) => C.t(k, v);
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (er) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (er) { /* 저장 못 해도 화면은 그대로 */ } }
};
const DAYS = [7, 14, 28];
const KEEP = [7, 14, 30];
const SITE = 'https://cnol-radar.vercel.app';

export const TR = {
  ko: {
    report: '주간 리포트', tab_report: '주간 리포트',
    rpSub: '기간 성과를 한 장으로 정리했어요. PDF로 저장하거나 링크로 고객 · 팀에게 보내세요.',
    rpPeriod: '기간', rpDays: '{n}일', rpPrint: 'PDF로 저장', rpShare: '공유 링크 만들기', rpSharing: '만드는 중…',
    rpKeep: '링크 열어 둘 기간', rpKeepN: '{n}일 동안',
    rpLinks: '열려 있는 공유 링크', rpLinkMeta: '{title} · {at} 만듦 · {until}까지 · 열람 {v}회', rpSeen: ' · 마지막 열람 {t}',
    rpCopy: '복사', rpCopied: '링크를 복사했어요.', rpOpen: '열기', rpSend: '보내기', rpOff: '링크 끄기',
    rpOffDone: '링크를 껐어요. 이제 이 링크로는 볼 수 없어요.',
    rpMade: '공유 링크를 만들고 복사했어요. 받는 사람은 로그인 없이 볼 수 있어요.', rpMadeNoCopy: '공유 링크를 만들었어요. 아래에서 복사해 보내세요.',
    rpNoLinks: '아직 만든 공유 링크가 없어요.',
    rpLinkNote: '공유 링크는 만든 순간의 리포트를 그대로 보여 줘요. 받는 사람은 로그인 없이 보고 PDF로도 저장할 수 있어요. 정한 기간(최대 30일)이 지나면 저절로 닫히고, 언제든 끌 수 있어요.',
    rpGuest: '로그인하면 고객에게 보낼 공유 링크를 만들 수 있어요.', rpViewer: '공유 링크는 대표 · 편집 권한이 있는 팀원이 만들 수 있어요.',
    rpLoadFail: '리포트를 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.',
    aReport: '주간 리포트에서 기간 성과를 한 장으로 볼 수 있어요. PDF로 저장하거나 공유 링크로 고객에게 보낼 수 있어요.',
    err_REPORT_LIMIT: '공유 링크는 한 번에 20개까지 열어 둘 수 있어요. 안 쓰는 링크를 꺼 주세요.',
    err_REPORT_BUSY: '공유 링크는 한 시간에 10개까지 만들 수 있어요. 잠시 뒤에 다시 해 주세요.',
    err_REPORT_FAIL: '리포트를 만들지 못했어요. 잠시 뒤 다시 해 주세요.'
  },
  en: {
    report: 'Weekly report', tab_report: 'Weekly report',
    rpSub: 'Your period at a glance on one page. Save it as a PDF or send a link to clients and teammates.',
    rpPeriod: 'Period', rpDays: '{n} days', rpPrint: 'Save as PDF', rpShare: 'Create share link', rpSharing: 'Creating…',
    rpKeep: 'Keep link open for', rpKeepN: '{n} days',
    rpLinks: 'Open share links', rpLinkMeta: '{title} · made {at} · open until {until} · {v} views', rpSeen: ' · last viewed {t}',
    rpCopy: 'Copy', rpCopied: 'Link copied.', rpOpen: 'Open', rpSend: 'Send', rpOff: 'Turn off',
    rpOffDone: 'Link turned off. It no longer opens.',
    rpMade: 'Share link created and copied. Recipients can view it without logging in.', rpMadeNoCopy: 'Share link created. Copy it below to send.',
    rpNoLinks: 'No share links yet.',
    rpLinkNote: 'A share link shows the report exactly as it was when you made it. Recipients can view it without logging in and save it as a PDF. It closes on its own after the period you pick (up to 30 days), and you can turn it off anytime.',
    rpGuest: 'Log in to create share links for your clients.', rpViewer: 'Owners and editors can create share links.',
    rpLoadFail: 'Could not load the report. Please try again shortly.',
    aReport: 'The weekly report shows your period on one page. Save it as a PDF or send a share link to clients.',
    err_REPORT_LIMIT: 'You can keep up to 20 share links open. Turn off the ones you no longer need.',
    err_REPORT_BUSY: 'You can create up to 10 share links per hour. Please try again a bit later.',
    err_REPORT_FAIL: 'Could not create the report. Please try again shortly.'
  },
  ja: {
    report: '週間レポート', tab_report: '週間レポート',
    rpSub: '期間の成果を1枚にまとめました。PDFで保存するか、リンクでクライアントやチームに送れます。',
    rpPeriod: '期間', rpDays: '{n}日', rpPrint: 'PDFで保存', rpShare: '共有リンクを作成', rpSharing: '作成中…',
    rpKeep: 'リンクを開いておく期間', rpKeepN: '{n}日間',
    rpLinks: '公開中の共有リンク', rpLinkMeta: '{title}・{at}作成・{until}まで・閲覧{v}回', rpSeen: '・最終閲覧 {t}',
    rpCopy: 'コピー', rpCopied: 'リンクをコピーしました。', rpOpen: '開く', rpSend: '送る', rpOff: 'リンクを停止',
    rpOffDone: 'リンクを停止しました。このリンクではもう見られません。',
    rpMade: '共有リンクを作成してコピーしました。受け取った人はログインなしで見られます。', rpMadeNoCopy: '共有リンクを作成しました。下からコピーして送ってください。',
    rpNoLinks: 'まだ共有リンクはありません。',
    rpLinkNote: '共有リンクは作成した時点のレポートをそのまま表示します。受け取った人はログインなしで見て、PDFでも保存できます。決めた期間（最大30日）が過ぎると自動で閉じ、いつでも停止できます。',
    rpGuest: 'ログインするとクライアント向けの共有リンクを作成できます。', rpViewer: '共有リンクはオーナー・編集者が作成できます。',
    rpLoadFail: 'レポートを読み込めませんでした。少し後でもう一度お試しください。',
    aReport: '週間レポートで期間の成果を1枚で確認できます。PDFで保存したり、共有リンクでクライアントに送ったりできます。',
    err_REPORT_LIMIT: '共有リンクは同時に20件まで公開できます。使わないリンクを停止してください。',
    err_REPORT_BUSY: '共有リンクは1時間に10件まで作成できます。少し後でもう一度お試しください。',
    err_REPORT_FAIL: 'レポートを作成できませんでした。少し後でもう一度お試しください。'
  }
};

const IC = {
  print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  off: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>'
};
const ic = (k, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;

let last = null;     // 지금 보고 있는 리포트 (PDF 이름에 써요)
let links = [];      // 열려 있는 공유 링크

export function mountReport(ctx) { C = ctx; }

const canShare = () => {
  const S = C.S;
  if (!S.ws || S.user?.guest) return false;
  return !!(S.user?.admin || S.ws.role === 'owner' || S.ws.role === 'editor');
};
const daysNow = () => { const d = Number(ls.get('radar.rpDays')); return DAYS.includes(d) ? d : 7; };
const keepNow = () => { const d = Number(ls.get('radar.rpKeep')); return KEEP.includes(d) ? d : 7; };
const linkUrl = (tok) => `${SITE}/r#${tok}`;

function toolsHtml(days) {
  const share = canShare();
  const who = C.S.user?.guest ? t('rpGuest') : !share ? t('rpViewer') : '';
  return `<section class="dk-card rp-tools rp-noprint dk-fade">
    <div class="rp-tbar">
      <div class="dk-seg" role="group" aria-label="${e(t('rpPeriod'))}">${DAYS.map((n) => `<button type="button" data-rpdays="${n}" aria-pressed="${n === days}">${e(t('rpDays', { n }))}</button>`).join('')}</div>
      <div class="rp-acts">
        <button type="button" class="dk-btn line" id="rpPrint">${ic('print')}<span>${e(t('rpPrint'))}</span></button>
        ${share ? `<label class="rp-keep"><span>${e(t('rpKeep'))}</span><select id="rpKeep">${KEEP.map((n) => `<option value="${n}"${n === keepNow() ? ' selected' : ''}>${e(t('rpKeepN', { n }))}</option>`).join('')}</select></label>
        <button type="button" class="dk-btn" id="rpShare">${ic('link')}<span>${e(t('rpShare'))}</span></button>` : ''}
      </div>
    </div>
    ${share ? `<div class="rp-links" id="rpLinks" aria-live="polite"></div><p class="rp-linknote">${e(t('rpLinkNote'))}</p>` : `<p class="rp-linknote">${e(who)}</p>`}
  </section>`;
}

function linksHtml() {
  if (!links.length) return `<p class="rp-nolinks">${e(t('rpNoLinks'))}</p>`;
  const F = makeFmt(C.lang);
  const when = (iso) => F.kst(iso, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const day = (iso) => F.kst(iso, { month: 'short', day: 'numeric' });
  return `<h3 class="rp-lh">${e(t('rpLinks'))} <small>${links.length}</small></h3><ul class="rp-ll">${links.map((l) => {
    const url = linkUrl(l.token);
    const meta = t('rpLinkMeta', { title: F.t(titleKey(l.days)), at: day(l.at), until: day(l.until), v: F.nf(l.views || 0) }) + (l.seen ? t('rpSeen', { t: when(l.seen) }) : '');
    return `<li data-id="${e(l.id)}">
      <div class="u"><code title="${e(url)}">${e(url.replace(/^https:\/\//, '').slice(0, 34))}…</code><small>${e(meta)}</small></div>
      <div class="b">
        <button type="button" class="dk-btn sm line" data-rpcopy="${e(l.token)}">${ic('copy', 14)}<span>${e(t('rpCopy'))}</span></button>
        ${navigator.share ? `<button type="button" class="dk-btn sm line" data-rpsend="${e(l.token)}" data-days="${e(l.days)}">${ic('send', 14)}<span>${e(t('rpSend'))}</span></button>` : ''}
        <a class="dk-btn sm line" href="/r#${e(l.token)}" target="_blank" rel="noopener">${ic('ext', 14)}<span>${e(t('rpOpen'))}</span></a>
        <button type="button" class="dk-btn sm line danger" data-rpoff="${e(l.id)}">${ic('off', 14)}<span>${e(t('rpOff'))}</span></button>
      </div></li>`;
  }).join('')}</ul>`;
}
function paintLinks(v) {
  const box = v.querySelector('#rpLinks');
  if (box) box.innerHTML = linksHtml();
}
async function loadLinks(v, alive) {
  const out = await C.act({ action: 'report_links' });
  if (alive && !alive()) return;
  if (out.ok) { links = out.links || []; paintLinks(v); }
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (er) { /* 아래 방법으로 */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (er) { return false; }
}

export async function vReport(v, r, alive) {
  const days = daysNow();
  C.loading(v, t('tab_report'), e(t('rpSub')));
  let data = null;
  try { data = await C.rpc('radar_report', { p_days: days }); } catch (er) { data = null; }
  if (!alive()) return;
  if (!data) {
    v.innerHTML = C.head(t('tab_report'), e(t('rpSub'))) + `<div class="dk-card"><div class="dk-empty">${e(t('rpLoadFail'))}</div></div>`;
    return;
  }
  last = data;
  v.innerHTML = C.head(t('tab_report'), e(t('rpSub'))) + toolsHtml(days) + `<article class="rp-doc dk-fade" id="rpDoc" aria-label="${e(t('tab_report'))}">${reportHtml(data, { lang: C.lang })}</article>`;
  bindReport(v.querySelector('#rpDoc'));
  v.querySelectorAll('[data-rpdays]').forEach((b) => b.addEventListener('click', () => {
    const n = Number(b.dataset.rpdays);
    if (!DAYS.includes(n) || n === daysNow()) return;
    ls.set('radar.rpDays', String(n));
    C.render();
  }));
  v.querySelector('#rpPrint').addEventListener('click', () => printReport(last, C.lang));
  if (canShare()) {
    paintLinks(v);
    loadLinks(v, alive).catch(() => {});
    v.querySelector('#rpKeep')?.addEventListener('change', (ev) => ls.set('radar.rpKeep', ev.target.value));
    v.querySelector('#rpShare').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      btn.disabled = true;
      const label = btn.querySelector('span');
      label.textContent = t('rpSharing');
      const out = await C.act({ action: 'report_share', days: daysNow(), keep: keepNow(), lang: C.lang });
      btn.disabled = false;
      label.textContent = t('rpShare');
      if (!out.ok) { C.snack(C.errText(out.error)); return; }
      links = [out.link, ...links.filter((l) => l.id !== out.link.id)];
      paintLinks(v);
      const ok = await copy(linkUrl(out.link.token));
      C.snack(ok ? t('rpMade') : t('rpMadeNoCopy'));
    });
    v.querySelector('.rp-tools').addEventListener('click', async (ev) => {
      const cp = ev.target.closest('[data-rpcopy]');
      if (cp) { C.snack((await copy(linkUrl(cp.dataset.rpcopy))) ? t('rpCopied') : linkUrl(cp.dataset.rpcopy)); return; }
      const sd = ev.target.closest('[data-rpsend]');
      if (sd) {
        const F = makeFmt(C.lang);
        try { await navigator.share({ title: `CNOL RADAR · ${F.t(titleKey(sd.dataset.days))}`, url: linkUrl(sd.dataset.rpsend) }); } catch (er) { /* 닫으면 그대로 */ }
        return;
      }
      const off = ev.target.closest('[data-rpoff]');
      if (off) {
        off.disabled = true;
        const out = await C.act({ action: 'report_unshare', id: Number(off.dataset.rpoff) });
        if (!out.ok) { off.disabled = false; C.snack(C.errText(out.error)); return; }
        links = out.links || [];
        paintLinks(v);
        C.snack(t('rpOffDone'));
      }
    });
  }
}
