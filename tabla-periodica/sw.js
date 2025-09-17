/* =========================================
   SERVICE WORKER - meskeIA
   Tabla Periódica Interactiva PWA
   ========================================= */

const CACHE_NAME = 'tabla-periodica-v1.0.0';
const STATIC_CACHE = 'tabla-periodica-static-v1';
const DYNAMIC_CACHE = 'tabla-periodica-dynamic-v1';

// Archivos para cachear al instalar
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/elementos-data.js',
    '/js/tabla-periodica.js',
    '/js/juego-elementos.js',
    '/js/app.js',
    '/manifest.json'
];

// Archivos opcionales (imágenes, iconos)
const OPTIONAL_FILES = [
    '/img/favicon-32x32.png',
    '/img/favicon-16x16.png',
    '/img/apple-touch-icon.png',
    '/img/icon-192x192.png',
    '/img/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Service Worker: Cacheando archivos estáticos');

                // Cachear archivos críticos
                return cache.addAll(STATIC_FILES)
                    .then(() => {
                        // Intentar cachear archivos opcionales sin fallar
                        return Promise.allSettled(
                            OPTIONAL_FILES.map(file =>
                                cache.add(file).catch(err =>
                                    console.warn(`⚠️ No se pudo cachear ${file}:`, err)
                                )
                            )
                        );
                    });
            })
            .then(() => {
                console.log('✅ Service Worker: Instalación completada');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Error en instalación:', error);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activando...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar cachés antiguos
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activación completada');
                return self.clients.claim();
            })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Solo manejar peticiones HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }

    // Estrategia Cache First para archivos estáticos
    if (isStaticFile(request)) {
        event.respondWith(cacheFirst(request));
    }
    // Estrategia Network First para el HTML principal
    else if (request.destination === 'document') {
        event.respondWith(networkFirst(request));
    }
    // Estrategia Stale While Revalidate para otros recursos
    else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Verificar si es un archivo estático
function isStaticFile(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/css/') ||
           url.pathname.includes('/js/') ||
           url.pathname.includes('/img/') ||
           url.pathname.endsWith('.json') ||
           url.pathname.endsWith('.ico');
}

// Estrategia Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;

    } catch (error) {
        console.error('Error en Cache First:', error);
        return new Response('Contenido no disponible sin conexión', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Estrategia Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;

    } catch (error) {
        console.warn('Red no disponible, usando caché:', error);
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Página offline de respaldo
        return new Response(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sin Conexión - Tabla Periódica</title>
                <style>
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #2C3E50, #34495E);
                        color: white;
                        text-align: center;
                    }
                    .offline-container {
                        background: rgba(255,255,255,0.1);
                        padding: 40px;
                        border-radius: 10px;
                        backdrop-filter: blur(10px);
                    }
                    .icon { font-size: 4rem; margin-bottom: 20px; }
                    h1 { margin-bottom: 10px; }
                    button {
                        background: #3498DB;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 20px;
                    }
                    button:hover { background: #2980B9; }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="icon">📡</div>
                    <h1>Sin Conexión</h1>
                    <p>No se puede conectar a internet.<br>
                    Verifica tu conexión e intenta nuevamente.</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Estrategia Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    // Fetch en segundo plano para actualizar caché
    const fetchPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(error => {
            console.warn('Error en fetch de background:', error);
        });

    // Devolver caché inmediatamente si existe, sino esperar al fetch
    return cachedResponse || fetchPromise;
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_STATUS') {
        // Enviar estado del caché al cliente
        caches.keys().then(cacheNames => {
            event.ports[0].postMessage({
                caches: cacheNames,
                version: CACHE_NAME
            });
        });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        // Limpiar cachés específicos
        const cachesToClear = event.data.caches || [DYNAMIC_CACHE];
        Promise.all(
            cachesToClear.map(cacheName => caches.delete(cacheName))
        ).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Manejar sincronización en segundo plano
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Evento de sincronización:', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Realizar tareas en segundo plano
            performBackgroundSync()
        );
    }
});

async function performBackgroundSync() {
    try {
        // Actualizar datos críticos
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(['/js/elementos-data.js']);
        console.log('✅ Sincronización en segundo plano completada');
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
    }
}

// Manejar notificaciones push (para futuras funcionalidades)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();

        const options = {
            body: data.body || 'Nueva actualización disponible',
            icon: '/img/icon-192x192.png',
            badge: '/img/icon-96x96.png',
            vibrate: [100, 50, 100],
            data: data.data || {},
            actions: [
                {
                    action: 'open',
                    title: 'Abrir App',
                    icon: '/img/icon-96x96.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(
                data.title || 'Tabla Periódica Interactiva',
                options
            )
        );
    }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Log de inicio
console.log('🚀 Service Worker cargado - Tabla Periódica Interactiva v1.0.0');