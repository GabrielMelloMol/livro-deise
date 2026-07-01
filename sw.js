// sw.js — Service Worker do livro Deise (PWA: instalável + leitura offline)
// Estratégia:
//   • Navegação (HTML)  → rede primeiro, cai pro cache quando offline
//   • Assets (mesma origem + CDN) → cache primeiro, busca na rede e guarda
//   • Externos (YouTube/Drive) → não intercepta (precisam de internet)
const VERSION = '1.0.19';
const CACHE   = `deise-${VERSION}`;

const CORE = [
  './',
  './index.html',
  `./css/style.css?v=${VERSION}`,
  `./js/flipbook.js?v=${VERSION}`,
  `./js/config.js?v=${VERSION}`,
  `./js/access.js?v=${VERSION}`,
  `./js/stars.js?v=${VERSION}`,
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-512-maskable.png',
  `./assets/pages/cover.jpg?v=${VERSION}`,
  './assets/audio/audiolivro.mp3',
  './assets/qrcodes/qr-modo-audiolivro.png',
  './assets/qrcodes/qr-modo-audiodescricao.png',
  './assets/qrcodes/qr-modo-libras.png',
  './assets/qrcodes/qr-modo-linguagem-simples.png',
  './assets/qrcodes/qr-modo-caa.png',
  './assets/caa/comunicacao-caa.pdf', // prancha CAA (2 MB) sempre offline
  './ar.html',
  './ar-experience.html',
  'https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js',
  'https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))  // não falha o install se um item faltar
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // HTML / navegação: rede primeiro
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isCDN = url.host === 'cdn.jsdelivr.net';
  if (!sameOrigin && !isCDN) return;   // YouTube, Drive etc. → rede direto

  // Assets: cache primeiro, senão rede (e guarda)
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      });
    })
  );
});
