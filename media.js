// Homepage reference videos. Cards stay ordinary YouTube links without JavaScript.
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

let dialog;
let returnFocus;
let bodyOverflow;

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

function element(tag, className, content) {
  const node = document.createElement(tag);
  node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function cleanUp() {
  if (!dialog) return;
  // Removing the iframe stops playback, releases its connection and clears its state.
  dialog.querySelector('iframe')?.remove();
  if (bodyOverflow !== undefined) {
    document.body.style.overflow = bodyOverflow;
    bodyOverflow = undefined;
  }
  const focusTarget = returnFocus;
  returnFocus = undefined;
  if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
  document.dispatchEvent(new Event('radar:video-close'));
}

function closeVideo() {
  if (dialog?.open) dialog.close();
  cleanUp();
}

function getDialog() {
  if (dialog) return dialog;
  dialog = element('dialog', 'media-dialog');
  dialog.setAttribute('aria-labelledby', 'media-video-title');
  dialog.setAttribute('aria-describedby', 'media-video-reference');
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeVideo();
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) cleanUp();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) closeVideo();
  });
  document.body.append(dialog);
  return dialog;
}

function openVideo(card) {
  const videoId = card.dataset.video;
  if (!VIDEO_ID.test(videoId || '')) return false;
  const copy = labels();
  const modal = getDialog();
  const shorts = card.dataset.format === 'shorts';
  const title = card.dataset.title || copy.title;

  if (modal.open) closeVideo();
  document.dispatchEvent(new Event('radar:video-open'));
  modal.replaceChildren();
  modal.classList.toggle('is-shorts', shorts);

  const closeButton = element('button', 'media-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', copy.close);
  closeButton.addEventListener('click', closeVideo);

  const player = element('div', 'media-player');
  player.classList.toggle('is-shorts', shorts);
  const frame = element('iframe', 'media-frame');
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embed.search = new URLSearchParams({ autoplay: '0', controls: '1', playsinline: '1', rel: '0' }).toString();
  frame.src = embed.href;
  frame.title = title;
  frame.width = shorts ? '360' : '960';
  frame.height = shorts ? '640' : '540';
  frame.style.minWidth = '200px';
  frame.style.minHeight = '200px';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  player.append(frame);

  const caption = element('div', 'media-caption');
  const heading = element('h2', 'media-title', title);
  heading.id = 'media-video-title';
  const channel = card.dataset.channel;
  if (channel) caption.append(element('p', 'media-channel', channel));
  const source = element('span', 'media-source', 'YouTube');
  const reference = element('p', 'media-reference', copy.reference);
  reference.id = 'media-video-reference';
  caption.prepend(heading);
  caption.append(source, reference);
  modal.append(closeButton, player, caption);

  returnFocus = card;
  bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  try {
    modal.showModal();
    closeButton.focus({ preventScroll: true });
    return true;
  } catch {
    cleanUp();
    modal.replaceChildren();
    return false;
  }
}

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey
    || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (typeof HTMLDialogElement === 'undefined'
    || typeof HTMLDialogElement.prototype.showModal !== 'function') return;
  const card = event.target instanceof Element
    ? event.target.closest('.creator-video[data-video]') : null;
  if (card && openVideo(card)) event.preventDefault();
});
