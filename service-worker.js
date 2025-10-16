// Service Worker meskeIA - Versión Simplificada
const CACHE_NAME = 'meskeia-v3';

// Instalación
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', event => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch - Estrategia simple: Network First, Cache Fallback
self.addEventListener('fetch', event => {
    // Ignorar peticiones no válidas (extensiones de Chrome, etc.)
    if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
        return;
    }


  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar la respuesta antes de guardarla
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en caché
        return caches.match(event.request);
      })
  );
});