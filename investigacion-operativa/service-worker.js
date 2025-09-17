// ========== SERVICE WORKER - INVESTIGACIÓN OPERATIVA ==========
// PWA Service Worker para cacheo offline y mejor rendimiento
// Versión: 1.0 - meskeIA

const CACHE_NAME = 'investigacion-operativa-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Archivos esenciales para caché
const CORE_CACHE_FILES = [
    '/',
    '/index.html',
    '/script.js',
    '/manifest.json',
    '/offline.html',

    // CDNs esenciales
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.1/jspdf.umd.min.js'
];

// ========== INSTALACIÓN ==========
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching core files');
                return cache.addAll(CORE_CACHE_FILES.map(url => new Request(url, { credentials: 'same-origin' })));
            })
            .then(() => {
                console.log('[SW] Core files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

// ========== ACTIVACIÓN ==========
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Activated successfully');
                return self.clients.claim();
            })
    );
});

// ========== ESTRATEGIAS DE CACHÉ ==========

// Cache First - Para archivos estáticos
function cacheFirst(request) {
    return caches.match(request)
        .then((response) => {
            if (response) {
                return response;
            }

            return fetch(request)
                .then((response) => {
                    // Verificar respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clonar respuesta para caché
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(request, responseClone);
                        });

                    return response;
                });
        });
}

// Network First - Para contenido dinámico
function networkFirst(request) {
    return fetch(request)
        .then((response) => {
            // Si la respuesta es válida, actualizar caché
            if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(request, responseClone);
                    });
            }
            return response;
        })
        .catch(() => {
            // Si falla la red, buscar en caché
            return caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    // Si tampoco está en caché, mostrar página offline
                    if (request.destination === 'document') {
                        return caches.match(OFFLINE_URL);
                    }
                });
        });
}

// Stale While Revalidate - Para archivos que pueden estar algo desactualizados
function staleWhileRevalidate(request) {
    return caches.match(request)
        .then((response) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return networkResponse;
                });

            // Devolver caché inmediatamente, actualizar en background
            return response || fetchPromise;
        });
}

// ========== MANEJO DE FETCH ==========
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Solo manejar peticiones HTTP/HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return;
    }

    // Estrategia según tipo de recurso
    if (event.request.destination === 'document') {
        // HTML pages - Network First
        event.respondWith(networkFirst(event.request));
    }
    else if (event.request.url.includes('cdnjs.cloudflare.com') ||
             event.request.destination === 'script' ||
             event.request.destination === 'style') {
        // CDN y archivos estáticos - Cache First
        event.respondWith(cacheFirst(event.request));
    }
    else {
        // Otros recursos - Stale While Revalidate
        event.respondWith(staleWhileRevalidate(event.request));
    }
});

// ========== SINCRONIZACIÓN EN BACKGROUND ==========
self.addEventListener('sync', (event) => {
    console.log('[SW] Background Sync:', event.tag);

    if (event.tag === 'sync-calculations') {
        event.waitUntil(syncCalculations());
    }
});

function syncCalculations() {
    // Sincronizar cálculos almacenados localmente
    return clients.matchAll()
        .then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: 'SYNC_CALCULATIONS',
                    message: 'Sincronizando cálculos guardados...'
                });
            });
        })
        .then(() => {
            console.log('[SW] Calculations synchronized');
        });
}

// ========== PUSH NOTIFICATIONS ==========
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');

    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Abrir app',
                icon: '/static/icons/open-icon.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/static/icons/close-icon.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Investigación Operativa - meskeIA', options)
    );
});

// ========== CLICK EN NOTIFICACIÓN ==========
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// ========== MANEJO DE ERRORES ==========
self.addEventListener('error', (event) => {
    console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled rejection:', event.reason);
});

// ========== MENSAJES DESDE LA APP ==========
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    switch (event.data.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'CACHE_CLEAR':
            event.waitUntil(
                caches.delete(CACHE_NAME)
                    .then(() => {
                        event.ports[0].postMessage({ success: true });
                    })
            );
            break;

        case 'CACHE_STATUS':
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then((cache) => cache.keys())
                    .then((keys) => {
                        event.ports[0].postMessage({
                            cacheSize: keys.length,
                            cacheName: CACHE_NAME
                        });
                    })
            );
            break;

        case 'SAVE_CALCULATION':
            // Guardar cálculo para sincronización posterior
            event.waitUntil(
                saveCalculationOffline(event.data.calculation)
            );
            break;
    }
});

// ========== FUNCIONES DE UTILIDAD ==========

function saveCalculationOffline(calculation) {
    // Implementación básica de guardado offline
    return new Promise((resolve) => {
        // En una implementación real, se guardaría en IndexedDB
        console.log('[SW] Calculation saved offline:', calculation);
        resolve();
    });
}

// ========== LOG DE INICIO ==========
console.log('[SW] Service Worker de Investigación Operativa inicializado');
console.log('[SW] Cache:', CACHE_NAME);
console.log('[SW] Archivos core:', CORE_CACHE_FILES.length);