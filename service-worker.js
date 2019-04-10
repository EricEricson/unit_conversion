// Files to Cache 
var dataCacheName = 'unit_conversion';
var cacheName = 'unit_conversion';
var filesToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/calc.js',
  '/js/units.js',
  '/style/favicon.ico',
  '/style/favicon.png',
  '/style/unit_conversion.png',
  '/style/style.css',
];


// Install ServiceWorker
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Fetch Data
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


// New Version Update Message
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});