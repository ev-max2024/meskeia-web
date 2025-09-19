// Service Worker para PWA - Calculadora de Electricidad meskeIA
const CACHE_NAME = 'electricity-calc-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icon_meskeia.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith('electricity-calc')) {
                        console.log('Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia de caché: Network First con fallback a caché
self.addEventListener('fetch', event => {
    // Skip para recursos externos (analytics, fonts, etc)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si la respuesta es válida, la clonamos y guardamos en caché
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // Si falla la red, intentar desde el caché
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }

                        // Si no está en caché, devolver página offline
                        if (event.request.destination === 'document') {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
});

// Mensaje para actualizar la aplicación
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});