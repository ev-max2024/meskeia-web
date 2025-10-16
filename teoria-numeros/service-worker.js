// Service Worker para Teoría de Números - meskeIA
// Versión: 1.0.0

const CACHE_NAME = 'teoria-numeros-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/script.js',
    '/manifest.json',
    '/icon_meskeia.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Archivos en caché');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Error al cachear archivos:', err);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activando...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Eliminar cachés antiguos
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepción de requests
self.addEventListener('fetch', event => {
    // Ignorar peticiones no válidas (extensiones de Chrome, etc.)
    if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
        return;
    }


    // Solo manejar requests GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en caché, devolverlo
                if (response) {
                    return response;
                }

                // Si no está en caché, hacer fetch
                return fetch(event.request)
                    .then(response => {
                        // Verificar si la respuesta es válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonar la respuesta
                        const responseToCache = response.clone();

                        // Añadir al caché
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(err => {
                        console.error('Error en fetch:', err);

                        // Si falla la conexión, intentar servir desde caché
                        return caches.match('/index.html');
                    });
            })
    );
});

// Manejo de mensajes del cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Sincronización en background (opcional)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Sincronización en background');
        // Aquí se pueden sincronizar datos cuando vuelva la conexión
    }
});

// Notificaciones push (opcional)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();

        const options = {
            body: data.body || 'Nueva actualización disponible',
            icon: '/icon_meskeia.png',
            badge: '/icon_meskeia.png',
            vibrate: [200, 100, 200],
            data: data.url || '/',
            actions: [
                {
                    action: 'open',
                    title: 'Abrir aplicación',
                    icon: '/icon_meskeia.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'Teoría de Números', options)
        );
    }
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data || '/')
        );
    }
});

console.log('Service Worker: Teoría de Números cargado - meskeIA 2025');