// Public reference cards loop scene thumbnails in their existing image nodes.
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const LABELS = {
  ko: {
    close: '영상 닫기',
    title: 'YouTube 영상',
    heroReference: '공개 영상 레퍼런스 · CNOL 이용 후기와 무관',
    source: 'YouTube에서 보기',
    reference: '공개 참고 영상 · CNOL RADAR 이용 후기나 추천이 아닙니다.'
  },
  en: {
    close: 'Close video',
    title: 'YouTube video',
    heroReference: 'Public video references · Not CNOL testimonials',
    source: 'Watch on YouTube',
    reference: 'Public reference video · Not a CNOL RADAR testimonial or endorsement.'
  },
  ja: {
    close: '動画を閉じる',
    title: 'YouTube動画',
    heroReference: '公開動画リファレンス · CNOLの利用者レビューではありません',
    source: 'YouTubeで見る',
    reference: '公開参考動画 · CNOL RADARへの推薦やレビューではありません。'
  }
};

function labels() {
  const lang = document.documentElement.lang.toLowerCase().split('-')[0];
  return LABELS[lang] || LABELS.ko;
}

function applyMediaLabels() {
  const copy = labels();
  document.querySelectorAll('[data-media-reference]').forEach((node) => {
    node.textContent = copy.heroReference;
  });
}
applyMediaLabels();
new MutationObserver(applyMediaLabels).observe(document.documentElement, {
  attributes: true, attributeFilter: ['lang']
});

// The homepage keeps its existing image nodes and uses public scene thumbnails only.
const IS_PUBLIC_MEDIA_PAGE = document.body.classList.contains('md') || Boolean(document.getElementById('previewMain'));
const thumbnailCache = new Map();
const thumbnailLoops = new Map();
let thumbnailMotionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const thumbnailObserver = IS_PUBLIC_MEDIA_PAGE && 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const loop = thumbnailLoops.get(entry.target);
      if (!loop) continue;
      loop.visible = entry.isIntersecting;
      refreshThumbnailLoop(loop);
    }
  }, { threshold: [0, 0.05] }) : null;

function sceneThumbnails(id) {
  if (thumbnailCache.has(id)) return thumbnailCache.get(id);
  const promise = Promise.all([1, 2, 3].map((number) => new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = (source) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = image.onerror = null;
      resolve(source);
    };
    const timeout = setTimeout(() => finish(null), 10000);
    image.onload = () => finish(image.naturalWidth >= 200 && image.naturalHeight >= 200 ? image.src : null);
    image.onerror = () => finish(null);
    image.src = `https://i.ytimg.com/vi/${id}/hq${number}.jpg`;
  }))).then((sources) => sources.filter(Boolean));
  thumbnailCache.set(id, promise);
  return promise;
}

function stopThumbnailTimer(loop) {
  clearTimeout(loop.timer);
  loop.timer = null;
  loop.animation?.cancel();
  loop.animation = null;
}

function forgetThumbnailLoop(loop) {
  stopThumbnailTimer(loop);
  thumbnailObserver?.unobserve(loop.card);
  thumbnailLoops.delete(loop.card);
}

function scheduleThumbnailLoop(loop) {
  if (loop.timer !== null || loop.sources.length < 2) return;
  loop.timer = setTimeout(() => {
    loop.timer = null;
    if (!loop.card.isConnected) { forgetThumbnailLoop(loop); return; }
    if (!thumbnailMotionEnabled || !loop.requested || !loop.visible || document.hidden) return;
    loop.index = (loop.index + 1) % loop.sources.length;
    loop.image.src = loop.sources[loop.index];
    loop.animation?.cancel();
    loop.animation = typeof loop.image.animate === 'function'
      ? loop.image.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' }) : null;
    scheduleThumbnailLoop(loop);
  }, 2200);
}

function refreshThumbnailLoop(loop) {
  if (!loop.card.isConnected) { forgetThumbnailLoop(loop); return; }
  const running = thumbnailMotionEnabled && loop.requested && loop.visible && !document.hidden;
  loop.card.classList.toggle('is-thumbnail-looping', running);
  loop.card.classList.toggle('is-motion-enabled', running);
  if (!running) { stopThumbnailTimer(loop); return; }
  if (!loop.loading) {
    loop.loading = true;
    sceneThumbnails(loop.id).then((sources) => {
      if (!loop.card.isConnected) { forgetThumbnailLoop(loop); return; }
      loop.sources = [...new Set([loop.original, ...sources])];
      refreshThumbnailLoop(loop);
    });
  }
  scheduleThumbnailLoop(loop);
}

export function setThumbnailMotionEnabled(value) {
  if (!IS_PUBLIC_MEDIA_PAGE) return;
  thumbnailMotionEnabled = Boolean(value);
  for (const loop of thumbnailLoops.values()) refreshThumbnailLoop(loop);
}

export function startThumbnailMotion(card) {
  if (!IS_PUBLIC_MEDIA_PAGE) return false;
  const id = card.dataset.loopVideo || card.dataset.video;
  const image = card.querySelector('img');
  if (!VIDEO_ID.test(id || '') || !image) return false;
  let loop = thumbnailLoops.get(card);
  if (!loop) {
    const original = image.getAttribute('src') || image.src;
    const bounds = card.getBoundingClientRect();
    loop = { card, image, id, original, sources: [original], index: 0, loading: false,
      requested: true, visible: bounds.bottom > 0 && bounds.top < innerHeight,
      timer: null, animation: null };
    thumbnailLoops.set(card, loop);
    thumbnailObserver?.observe(card);
  }
  loop.requested = true;
  refreshThumbnailLoop(loop);
  return true;
}

function toggleThumbnailMotion(card) {
  const loop = thumbnailLoops.get(card);
  if (loop?.requested) {
    loop.requested = false;
    refreshThumbnailLoop(loop);
    return true;
  }
  thumbnailMotionEnabled = true;
  document.dispatchEvent(new Event('radar:motion-request'));
  return startThumbnailMotion(card);
}

if (IS_PUBLIC_MEDIA_PAGE) {
  document.addEventListener('visibilitychange', () => {
    for (const loop of thumbnailLoops.values()) refreshThumbnailLoop(loop);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    for (const loop of thumbnailLoops.values()) {
      if (loop.card.matches('.creator-video')) {
        loop.requested = false;
        refreshThumbnailLoop(loop);
      }
    }
  });
}

document.addEventListener('click', (event) => {
  if (!IS_PUBLIC_MEDIA_PAGE || event.defaultPrevented || event.button !== 0) return;
  const card = event.target instanceof Element
    ? event.target.closest('.creator-video[data-video]') : null;
  if (!card) return;
  event.preventDefault();
  toggleThumbnailMotion(card);
});
