// Public YouTube scene thumbnails, crossfaded as images. No video player is loaded.
const portraits = [...document.querySelectorAll('.creator-portrait[data-loop-video]')];
const toggle = document.querySelector('[data-motion-toggle]');
const note = document.querySelector('[data-motion-note]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const items = portraits.map(element => {
  const poster = element.querySelector('img');
  poster?.classList.add('portrait-frame', 'is-active');
  element.setAttribute('role', 'button');
  element.tabIndex = 0;
  return { element, frames: poster ? [poster] : [], index: 0, loading: false, timer: null };
});
let enabled = !reduce.matches;
let userChoice = null;
let visible = false;
let modalOpen = false;
const copy = {
  ko: ['모션 일시정지', '모션 재생', '반복 모션', '이미지 모션 재생'],
  en: ['Pause motion', 'Play motion', 'Looping image motion', 'Play image motion'],
  ja: ['モーションを停止', 'モーションを再生', '画像のループモーション', '画像モーションを再生']
};
function labels() { return copy[document.documentElement.lang] || copy.ko; }
function stop(item) {
  clearTimeout(item.timer);
  item.timer = null;
}
function advance(item) {
  if (item.frames.length < 2) return;
  item.frames[item.index].classList.remove('is-active');
  item.index = (item.index + 1) % item.frames.length;
  item.frames[item.index].classList.add('is-active');
}
function schedule(item, delay) {
  if (item.timer !== null) return;
  item.timer = setTimeout(() => {
    item.timer = null;
    if (!enabled || !visible || document.hidden || modalOpen) return;
    advance(item);
    schedule(item, 3200);
  }, delay);
}
function loadFrame(id, number) {
  return new Promise(resolve => {
    const image = new Image();
    image.className = 'portrait-frame';
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.decoding = 'async';
    let settled = false;
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = image.onerror = null;
      resolve(result);
    };
    const timeout = setTimeout(() => finish(null), 10000);
    image.onload = () => finish(image.naturalWidth >= 200 && image.naturalHeight >= 200 ? image : null);
    image.onerror = () => finish(null);
    image.src = `https://i.ytimg.com/vi/${id}/hq${number}.jpg`;
  });
}
async function loadFrames(item) {
  if (item.loading || !item.frames.length) return;
  const id = item.element.dataset.loopVideo;
  if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return;
  item.loading = true;
  const frames = await Promise.all([1, 2, 3].map(number => loadFrame(id, number)));
  for (const frame of frames.filter(Boolean)) {
    item.element.append(frame);
    item.frames.push(frame);
  }
  update();
}
function update() {
  if (toggle) {
    toggle.textContent = labels()[enabled ? 0 : 1];
    toggle.setAttribute('aria-pressed', String(enabled));
  }
  if (note) note.textContent = labels()[2];
  const running = enabled && visible && !document.hidden && !modalOpen;
  items.forEach((item, index) => {
    item.element.title = labels()[3];
    item.element.classList.toggle('is-motion-enabled', running);
    if (running) {
      loadFrames(item);
      if (item.frames.length > 1) schedule(item, 2100 + index * 380);
    } else stop(item);
  });
}
function enableMotion() {
  enabled = true;
  userChoice = true;
  update();
}
if (portraits.length) {
  const collage = document.querySelector('.creator-collage');
  if (collage && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      update();
    }, { threshold: [0, .05] }).observe(collage);
  } else visible = true;
  portraits.forEach(element => {
    element.addEventListener('click', enableMotion);
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        enableMotion();
      }
    });
  });
  toggle?.addEventListener('click', () => {
    enabled = !enabled;
    userChoice = enabled;
    update();
  });
  document.addEventListener('visibilitychange', update);
  document.addEventListener('radar:video-open', () => { modalOpen = true; update(); });
  document.addEventListener('radar:video-close', () => { modalOpen = false; update(); });
  reduce.addEventListener('change', () => {
    if (userChoice === null) enabled = !reduce.matches;
    update();
  });
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  update();
}
