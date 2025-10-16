// service-worker.js - Service Worker para Álgebra Abstracta PWA

const CACHE_NAME = 'algebra-abstracta-v1.0.1';
const urlsToCache = [
    '/algebra-abstracta/',
    '/algebra-abstracta/index.html',
    '/algebra-abstracta/styles.css',
    '/algebra-abstracta/app.js',
    '/algebra-abstracta/manifest.json',
    '/algebra-abstracta/logo.svg',
    '/algebra-abstracta/favicon.png',
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Error en instalación:', err))
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Estrategia de caché: Network First con fallback a caché
self.addEventListener('fetch', event => {
    // Para MathJax y recursos externos, siempre intentar red primero
    if (event.request.url.includes('cdn.jsdelivr.net') ||
        event.request.url.includes('polyfill.io') ||
        event.request.url.includes('googletagmanager.com')) {

        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Clonar la respuesta antes de guardar en caché
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                })
                .catch(() => {
                    // Si falla la red, buscar en caché
                    return caches.match(event.request);
                })
        );
    } else {
        // Para recursos locales, caché primero
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request)
                        .then(response => {
                            // Verificar que la respuesta sea válida
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // Clonar la respuesta
                            const responseToCache = response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        });
                })
        );
    }
});

// Manejo de mensajes del cliente
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                console.log('Caché limpiado');
            })
        );
    }
});

// Sincronización en segundo plano (si el navegador lo soporta)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-datos') {
        event.waitUntil(sincronizarDatos());
    }
});

async function sincronizarDatos() {
    // Aquí se podría sincronizar datos guardados localmente
    // con un servidor cuando se recupere la conexión
    console.log('Sincronizando datos...');
}

// Push notifications (preparado para futuro uso)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Álgebra Abstracta', options)
    );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});