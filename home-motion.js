// One visible, muted YouTube loop. Other cards stay lightweight reference images.
const featured = document.querySelector('.creator-card:nth-child(2)');
const poster = featured?.querySelector('.creator-video');
const toggle = document.querySelector('[data-motion-toggle]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let player;
let enabled = !reduce.matches;
let visible = false;
let modalOpen = false;
let ready = false;
const copy = {
  ko: ['모션 일시정지', '모션 재생', '영상 크게 보기', '무음 반복 재생'],
  en: ['Pause motion', 'Play motion', 'Watch full video', 'Muted video loop'],
  ja: ['モーションを停止', 'モーションを再生', '動画を大きく見る', 'ミュートでループ再生']
};
function labels() { return copy[document.documentElement.lang] || copy.ko; }
function update() {
  if (toggle) {
    toggle.textContent = labels()[enabled ? 0 : 1];
    toggle.setAttribute('aria-pressed', String(enabled));
  }
  document.querySelector('[data-motion-full]')?.replaceChildren(labels()[2]);
  document.querySelector('[data-motion-note]')?.replaceChildren(labels()[3]);
  if (!ready) return;
  if (enabled && visible && !document.hidden && !modalOpen) player.playVideo();
  else player.pauseVideo();
}
function loadAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = reject;
    document.head.append(script);
  });
}
async function start() {
  if (!featured || !poster || featured.querySelector('.creator-loop')) return;
  const host = document.createElement('div');
  host.className = 'creator-loop';
  const frame = document.createElement('iframe');
  const url = new URL(`https://www.youtube-nocookie.com/embed/${poster.dataset.video}`);
  url.search = new URLSearchParams({ enablejsapi:'1', origin:location.origin, autoplay:'0', controls:'0', playsinline:'1', loop:'1', playlist:poster.dataset.video, rel:'0' });
  frame.src = url.href;
  frame.title = poster.dataset.title;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allowFullscreen = true;
  frame.width = '240'; frame.height = '340';
  host.append(frame);
  featured.append(host);
  poster.hidden = true;
  featured.classList.add('has-loop');
  try {
    const YT = await loadAPI();
    player = new YT.Player(frame, {
      events: {
        onReady: () => { ready = true; player.mute(); update(); },
        onAutoplayBlocked: () => { enabled = false; update(); },
        onError: () => { ready = false; host.remove(); poster.hidden = false; featured.classList.remove('has-loop'); }
      }
    });
  } catch {
    host.remove(); poster.hidden = false; featured.classList.remove('has-loop');
    enabled = false; update();
  }
}
if (featured && poster) {
  new IntersectionObserver(entries => {
    visible = entries[0].intersectionRatio > .5;
    if (visible && enabled) start();
    update();
  }, {threshold:[0,.51,1]}).observe(featured);
  toggle?.addEventListener('click', () => { enabled = !enabled; if (enabled) start(); update(); });
  document.addEventListener('visibilitychange', update);
  document.addEventListener('radar:video-open', () => { modalOpen = true; update(); });
  document.addEventListener('radar:video-close', () => { modalOpen = false; update(); });
  reduce.addEventListener('change', () => { enabled = !reduce.matches; update(); });
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  update();
}
