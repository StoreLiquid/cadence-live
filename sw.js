// cadence live: Mitteilungen vom Raspberry Pi (cadence-push) anzeigen; Tipp öffnet die App (nicht Safari)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = {body: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.title || 'cadence', {
    body: d.body || '', icon: 'logo-192.png', badge: 'logo-64.png', tag: d.tag, data: {url: d.url || './'}
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data || {}).url || './';
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(liste => {
    for (const c of liste) { if ('focus' in c) { c.navigate(url).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
