/*
 * Minimal service worker for the Amin Mansori portfolio PWA.
 *
 * Strategy:
 *  - Precache the app shell (icons, manifest) on install.
 *  - Navigations (HTML pages): network-first, fall back to cached page when
 *    offline. Keeps content fresh while still working offline.
 *  - Static assets (_next/static, images, icons): cache-first, then network,
 *    and cache a copy for next time.
 *
 * Bump CACHE_VERSION whenever you ship a breaking SW change; the activate
 * step will delete old caches.
 */
const CACHE_VERSION = 'v3';
const STATIC_CACHE = `amin-static-${CACHE_VERSION}`;
const PAGE_CACHE = `amin-pages-${CACHE_VERSION}`;

// Assets to precache on install (app shell).
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        // addAll fails atomically if any URL 404s; guard each request instead.
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Helper: is this a navigation request (HTML page)?
function isHtmlRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept') &&
      request.headers.get('accept').includes('text/html'))
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET; let the browser handle everything else.
  if (request.method !== 'GET') return;

  // Don't try to handle cross-origin requests (e.g. Google Fonts) here.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never touch dev/HMR traffic or Next data requests (stale JSON / chunks break hydration).
  if (
    url.pathname.startsWith('/_next/data') ||
    url.pathname.includes('webpack-hmr') ||
    url.pathname.includes('hot-update') ||
    url.pathname.startsWith('/_next/static/development') ||
    url.pathname.startsWith('/__nextjs')
  ) {
    return;
  }

  // 1) Navigations -> network-first.
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match('/') ||
              new Response('Offline', {
                status: 503,
                headers: { 'Content-Type': 'text/html' },
              })
          )
        )
    );
    return;
  }

  // 2) Static assets -> cache-first, then network, cache a copy.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Only cache successful, same-origin, basic responses.
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
