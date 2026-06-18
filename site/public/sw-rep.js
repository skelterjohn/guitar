const CACHE = 'rep-shell-v1';
const SHELL_URL = '/rep.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(SHELL_URL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;

  const { pathname } = new URL(event.request.url);
  if (pathname !== '/rep' && !pathname.startsWith('/rep/')) return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(SHELL_URL);
      if (cached) return cached;
      throw new Error('offline');
    }),
  );
});
