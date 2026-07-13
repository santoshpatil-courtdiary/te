/* Court Case Diary - service worker (offline app shell + runtime cache) */
const CACHE = "court-diary-v3";
const SHELL = [
  './',
  './court-diary.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Do NOT cache live API calls (Firebase auth/Firestore, Google sign-in, Drive).
function isLiveApi(url) {
  return /googleapis\.com|firestore|identitytoolkit|securetoken|accounts\.google\.com|graph\.microsoft\.com|login\.microsoftonline\.com|msauth\.net|msftauth\.net|jsdelivr\.net|unpkg\.com/.test(url.host);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;              // POST/PATCH go straight to network
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (isLiveApi(url)) return;                     // let the network handle APIs

  // cache-first for app shell + static CDN assets (SheetJS, fonts, firebase SDK)
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => { try { c.put(req, copy); } catch (_) {} });
        return res;
      }).catch(() => cached)
    )
  );
});
