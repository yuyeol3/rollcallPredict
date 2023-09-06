const CACHE_NAME = "rollcallAppCache"

// Service Worker Installation
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll([
          '/',
          '/static/js/index.js',
          '/static/css/index.css',
          '/static/images/icon.ico'
          // Add more URLs to cache as needed
        ]);
      })
    );
  });
  
  // Service Worker Activation and Cache Cleanup
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  // Service Worker Fetch Event
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
      })
    );
  });

self.addEventListener("push", (event)=>{
    const data = event.data.text();

    event.waitUntil(self.registration.showNotification(data));
});