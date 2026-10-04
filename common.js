// CNOL RADAR — 공통 모듈 (Supabase · 언어 · 알림)
import { createClient } from '/supabase.js'; // @supabase/supabase-js 2.117.2 고정 번들
import { DICT } from './i18n.js';

// 공개용 키 — 행 단위 보안(RLS)으로 보호돼요. 서비스 키는 절대 여기에 넣지 마세요.
export const SUPABASE_URL = 'https://gbgcoxjnjlrzbwclevul.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_u1HixC_2hyoQi9Sd_mnaWQ_0nHSrQ8b';
export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

export const LANGS = ['ko', 'en', 'ja'];

export function getLang() {
  let l = null;
  try { l = localStorage.getItem('radar.lang'); } catch (e) { /* 저장소를 못 쓰는 환경 */ }
  if (!LANGS.includes(l)) {
    const n = (navigator.language || 'ko').slice(0, 2).toLowerCase();
    l = LANGS.includes(n) ? n : 'ko';
  }
  return l;
}

export function setLang(l) {
  if (!LANGS.includes(l)) return;
  try { localStorage.setItem('radar.lang', l); } catch (e) { /* 무시 */ }
}

export function t(key, lang = getLang(), vars) {
  let s = (DICT[lang] && DICT[lang][key]) ?? DICT.ko[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.replace('{' + k + '}', vars[k]);
  return s;
}

export function applyI18n(root = document, lang = getLang()) {
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n, lang); });
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', t(el.dataset.i18nPh, lang)); });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria, lang)); });
  document.documentElement.lang = lang;
}

export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let snackTimer = null;
export function snack(msg) {
  let el = document.getElementById('snack');
  if (!el) {
    el = document.createElement('div');
    el.id = 'snack';
    el.className = 'snack';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// 조회수 표기: 만 단위 숫자를 언어별로
export function fmtViews(man, lang = getLang(), withUnit = true) {
  const v = man * 10000;
  if (lang === 'en') {
    const s = v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 1 : 2).replace(/\.?0+$/, '') + 'M' : Math.round(v / 1e3) + 'K';
    return withUnit ? s + ' views' : s;
  }
  const n = man >= 100 ? Math.round(man).toLocaleString('ko-KR') : (Math.round(man * 10) / 10).toString();
  const u = lang === 'ja' ? '万' : '만';
  return n + u + (withUnit ? (lang === 'ja' ? '回' : ' 회') : '');
}

export async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function requireSession() {
  const s = await getSession();
  if (!s) {
    location.replace('/login');
    return null;
  }
  return s;
}

export function logoSvg(size = 30) {
  const h = Math.round(size * 0.86);
  return `<svg width="${size}" height="${h}" viewBox="0 0 200 172" aria-hidden="true"><path d="M35.65 164.35A91 91 0 0 1 21.19 54.5L48.47 70.25A59.5 59.5 0 0 0 57.93 142.07Z" fill="#1F71F5"/><path d="M21.19 54.5A91 91 0 0 1 123.55 12.1L115.4 42.53A59.5 59.5 0 0 0 48.47 70.25Z" fill="#EC1E79"/><path d="M123.55 12.1A91 91 0 0 1 187.9 76.45L157.47 84.6A59.5 59.5 0 0 0 115.4 42.53Z" fill="#ED1C24"/><path d="M187.9 76.45A91 91 0 0 1 164.35 164.35L142.07 142.07A59.5 59.5 0 0 0 157.47 84.6Z" fill="#FBB116"/><circle cx="100" cy="100" r="15.7" fill="#EC1E79"/><path d="M112.2 90.1L169.8 97.3L112.8 108.7Z" fill="#EC1E79"/></svg>`;
}
