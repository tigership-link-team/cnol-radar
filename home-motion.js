import { setThumbnailMotionEnabled, startThumbnailMotion } from './media.js';
// 첫 화면 인물 이미지(AI로 만든 이미지)를 천천히 움직여요. 화면에 보일 때만, 움직임 줄이기 설정을 지켜요.
const portraits = [...document.querySelectorAll('.creator-portrait')];
const toggle = document.querySelector('[data-motion-toggle]');
const note = document.querySelector('[data-motion-note]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const copy = {
  ko: ['모션 일시정지', '모션 재생', 'AI로 만든 인물 이미지예요 · 실제 이용자가 아니에요'],
  en: ['Pause motion', 'Play motion', 'AI-generated portraits · Not actual users'],
  ja: ['モーションを停止', 'モーションを再生', 'AIで生成した人物画像です · 実際の利用者ではありません']
};
const labels = () => copy[document.documentElement.lang] || copy.ko;
let enabled = !reduce.matches;
let userChoice = null;
let visible = false;
function update() {
  if (toggle) {
    toggle.textContent = labels()[enabled ? 0 : 1];
    toggle.setAttribute('aria-pressed', String(enabled));
  }
  if (note) note.textContent = labels()[2];
  const running = enabled && visible && !document.hidden;
  portraits.forEach((el) => {
    el.classList.toggle('is-motion-enabled', running);
    if (running && el.dataset.loopVideo) startThumbnailMotion(el);
  });
  setThumbnailMotionEnabled(enabled);
}
if (portraits.length) {
  const collage = document.querySelector('.creator-collage');
  if (collage && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries.some((e) => e.isIntersecting); update(); }, { threshold: [0, 0.05] }).observe(collage);
  } else visible = true;
  toggle?.addEventListener('click', () => { enabled = !enabled; userChoice = enabled; update(); });
  document.addEventListener('visibilitychange', update);
  document.addEventListener('radar:motion-request', () => { enabled = true; userChoice = true; update(); });
  reduce.addEventListener('change', () => { if (userChoice === null) enabled = !reduce.matches; update(); });
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  update();
}
