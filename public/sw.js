const CACHE_STATIC = 'chaguo-app-shell-v2';
const CACHE_IMAGES = 'chaguo-candidate-photos-v2';
const CACHE_RECORDS = 'chaguo-db-records-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install Event - Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      console.log('[SW] Pre-caching Core App Shell');
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Cleanup obsolete caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_STATIC, CACHE_IMAGES, CACHE_RECORDS].includes(cacheName)) {
            console.log('[SW] Deleting Old Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Specialized caching strategies for Images, DB Records, and Shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Candidate Profile Images Caching Strategy (Cache-First + Background Network Cache)
  const isImageRequest = 
    event.request.destination === 'image' || 
    url.hostname.includes('images.unsplash.com') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

  if (isImageRequest) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately, fetch network in background to revalidate
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                caches.open(CACHE_IMAGES).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {/* Silent offline fallback */});
          return cachedResponse;
        }

        // Not in cache: Fetch from network and store in Candidate Images cache
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_IMAGES).then((cache) => cache.put(event.request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // If offline and image not cached, return offline SVG placeholder
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="#262626">
                <rect width="200" height="200" fill="#171717"/>
                <circle cx="100" cy="80" r="40" fill="#404040"/>
                <path d="M30 180 C30 130 70 120 100 120 C130 120 170 130 170 180 Z" fill="#404040"/>
                <text x="100" y="190" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-size="12" font-weight="bold">OFFLINE DOSSIER</text>
              </svg>`,
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
      })
    );
    return;
  }

  // 2. Local Database Records / API & Data Requests (Stale-While-Revalidate)
  const isDataRequest = url.pathname.includes('/api/') || url.pathname.endsWith('.json');
  if (isDataRequest) {
    event.respondWith(
      caches.open(CACHE_RECORDS).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Navigation Requests & Static App Assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch network update in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_STATIC).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // If navigating offline, serve app shell index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
