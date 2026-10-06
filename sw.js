// CNOL RADAR 알림 서비스 워커 (v13)
// · 푸시를 받으면 알림을 띄우고, 누르면 대시보드의 그 화면을 열어요 (대시보드를 닫아도 와요)
// · 페이지를 저장하거나 가로채지 않아요 (오프라인 캐시 없음)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (ev) => ev.waitUntil(self.clients.claim()));

self.addEventListener('push', (ev) => {
  let d = {};
  try { d = ev.data ? ev.data.json() : {}; } catch (er) { d = { body: ev.data ? ev.data.text() : '' }; }
  const title = String(d.title || 'CNOL RADAR').slice(0, 120);
  const opt = {
    body: String(d.body || '').slice(0, 300),
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: { url: typeof d.url === 'string' ? d.url : '/app#alerts' },
    timestamp: Number(d.at) || Date.now(),
  };
  if (d.tag) { opt.tag = String(d.tag).slice(0, 64); opt.renotify = true; }
  if (d.lang) opt.lang = String(d.lang).slice(0, 5);
  ev.waitUntil(self.registration.showNotification(title, opt));
});

self.addEventListener('notificationclick', (ev) => {
  ev.notification.close();
  let url;
  try { url = new URL((ev.notification.data && ev.notification.data.url) || '/app#alerts', self.location.origin); } catch (er) { url = new URL('/app', self.location.origin); }
  if (url.origin !== self.location.origin) url = new URL('/app', self.location.origin); // 다른 사이트로는 안 열어요
  ev.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      let u;
      try { u = new URL(c.url); } catch (er) { continue; }
      if (u.origin === url.origin && u.pathname === '/app') {
        try { await c.focus(); } catch (er) { /* 포커스를 못 줘도 화면은 옮겨요 */ }
        c.postMessage({ go: url.hash || '#home' });
        return;
      }
    }
    await self.clients.openWindow(url.href);
  })());
});
