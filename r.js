// CNOL RADAR v14 — 공유 리포트 보기 (/r#열쇠) · 로그인 없이 봐요
// · 열쇠는 주소의 # 뒤에 있어요 (# 뒤는 서버 기록 · 다른 사이트로 넘어가지 않아요)
// · 리포트는 링크를 만든 순간의 스냅샷이에요. 링크가 닫히면(기한 · 끄기) 바로 못 봐요
import { reportHtml, bindReport, printReport, makeFmt, titleKey, esc } from '/report.js';

const FN = 'https://gbgcoxjnjlrzbwclevul.supabase.co/functions/v1/radar';
const KEY = 'sb_publishable_u1HixC_2hyoQi9Sd_mnaWQ_0nHSrQ8b'; // 공개용 키 (서비스 키 아님)
const TOKEN_RE = /^[A-Za-z0-9_-]{32,64}$/;
const UI = {
  ko: {
    loading: '리포트를 불러오는 중이에요…', gone: '이 링크는 닫혔거나 주소가 맞지 않아요.', goneSub: '리포트를 보낸 분께 새 링크를 부탁해 주세요.',
    busy: '잠깐 사이에 너무 많이 열었어요. 조금 뒤에 다시 열어 주세요.', fail: '리포트를 불러오지 못했어요. 인터넷 연결을 확인하고 다시 열어 주세요.', retry: '다시 열기',
    print: 'PDF로 저장', shared: '공유 리포트', until: '이 링크는 {d}까지 열려 있어요 · 링크를 만든 {m} 기준 숫자예요',
    cta: '이 리포트는 CNOL RADAR로 만들었어요', ctaSub: '레퍼런스 채널을 매시간 지켜보고, 다음에 만들 소재를 먼저 찾아 주는 유튜브 소재 분석 AI 에이전트예요.', ctaBtn: 'CNOL RADAR 알아보기',
    lang: '언어'
  },
  en: {
    loading: 'Loading the report…', gone: 'This link is closed or the address is not right.', goneSub: 'Please ask the person who sent it for a new link.',
    busy: 'Opened too many times in a short while. Please try again in a moment.', fail: 'Could not load the report. Check your connection and try again.', retry: 'Try again',
    print: 'Save as PDF', shared: 'Shared report', until: 'This link stays open until {d} · Numbers as of {m}, when the link was made',
    cta: 'This report was made with CNOL RADAR', ctaSub: 'An AI agent for YouTube topic research that watches reference channels every hour and finds your next topic first.', ctaBtn: 'Learn about CNOL RADAR',
    lang: 'Language'
  },
  ja: {
    loading: 'レポートを読み込んでいます…', gone: 'このリンクは閉じられたか、アドレスが正しくありません。', goneSub: '送ってくれた方に新しいリンクをお願いしてください。',
    busy: '短時間に何度も開かれました。少し後でもう一度開いてください。', fail: 'レポートを読み込めませんでした。接続を確認してもう一度開いてください。', retry: 'もう一度開く',
    print: 'PDFで保存', shared: '共有レポート', until: 'このリンクは{d}まで開いています・リンク作成時（{m}）の数字です',
    cta: 'このレポートはCNOL RADARで作成しました', ctaSub: '参考チャンネルを毎時チェックし、次に作るネタを先に見つけるYouTubeネタ分析AIエージェントです。', ctaBtn: 'CNOL RADARについて',
    lang: '言語'
  }
};
const LANGS = ['ko', 'en', 'ja'];
let lang = (() => { const n = (navigator.language || 'ko').slice(0, 2).toLowerCase(); return LANGS.includes(n) ? n : 'ko'; })();
let got = null; // 서버에서 받은 리포트
const u = (k, v) => { let s = UI[lang][k] ?? UI.ko[k] ?? k; if (v) for (const x of Object.keys(v)) s = s.split('{' + x + '}').join(String(v[x])); return s; };
const $ = (id) => document.getElementById(id);

function tokenOf() {
  let h = location.hash.replace(/^#/, '');
  if (h.startsWith('t=')) h = h.slice(2);
  try { h = decodeURIComponent(h); } catch (er) { /* 그대로 */ }
  return TOKEN_RE.test(h) ? h : null;
}

function chrome() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-l]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === lang)));
  $('rpgLangs').setAttribute('aria-label', u('lang'));
  $('rpgPrint').querySelector('span').textContent = u('print');
  $('rpgPrint').hidden = !got;
  $('rpgCtaH').textContent = u('cta');
  $('rpgCtaP').textContent = u('ctaSub');
  $('rpgCtaA').textContent = u('ctaBtn');
}

let lastState = null; // 언어를 바꾸면 같은 안내를 새 언어로 다시 그려요
function state(msg, sub, retry) {
  lastState = [msg, sub, retry];
  $('rpg').innerHTML = `<div class="rpg-state" role="status"><p class="m">${esc(msg)}</p>${sub ? `<p class="s">${esc(sub)}</p>` : ''}${retry ? `<button type="button" class="rpg-btn" id="rpgRetry">${esc(u('retry'))}</button>` : ''}</div>`;
  $('rpgRetry')?.addEventListener('click', load);
}

function paint() {
  chrome();
  if (!got) return;
  const F = makeFmt(lang);
  const d = got.report;
  document.title = `${F.t(titleKey(d && d.days))}${d && d.ws ? ' · ' + d.ws : ''} · CNOL RADAR`;
  const until = got.until ? F.kst(got.until, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const made = got.at ? F.kst(got.at, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
  $('rpg').innerHTML = `<p class="rpg-badge rp-noprint"><span>${esc(u('shared'))}</span>${until ? `<small>${esc(u('until', { d: until, m: made }))}</small>` : ''}</p><article class="rp-doc" id="rpDoc">${reportHtml(d, { lang, h1: true })}</article>`;
  bindReport($('rpDoc'));
}

async function load() {
  const tok = tokenOf();
  chrome();
  if (!tok) { state(u('gone'), u('goneSub')); return; }
  state(u('loading'));
  try {
    const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json', apikey: KEY }, body: JSON.stringify({ action: 'report_get', token: tok }) });
    const j = await r.json().catch(() => null);
    if (!j || !j.ok) {
      if (j && j.error === 'BUSY') state(u('busy'), '', true);
      else if (j && j.error === 'LINK_GONE') state(u('gone'), u('goneSub'));
      else state(u('fail'), '', true);
      return;
    }
    got = j;
    if (LANGS.includes(j.lang)) lang = j.lang; // 보낸 사람이 고른 언어로 먼저 보여요 (위에서 바꿀 수 있어요)
    paint();
  } catch (er) {
    state(u('fail'), '', true);
  }
}

document.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('click', () => {
  const keys = lastState && !got ? lastState.map((x) => (typeof x === 'string' ? Object.keys(UI[lang]).find((k) => UI[lang][k] === x) : x)) : null;
  lang = b.dataset.l;
  if (got) { paint(); return; }
  chrome();
  if (keys) state(keys[0] ? u(keys[0]) : '', keys[1] ? u(keys[1]) : '', keys[2]);
}));
$('rpgPrint').addEventListener('click', () => { if (got) printReport(got.report, lang); });
window.addEventListener('hashchange', () => { got = null; load(); });
load();
