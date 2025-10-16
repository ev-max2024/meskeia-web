/**
 * Service Worker para Constructor de Fórmulas Químicas
 * Funcionalidad offline y caché optimizado
 * © 2025 meskeIA
 */

const CACHE_NAME = 'formulas-quimicas-v1.0.0';
const STATIC_CACHE_NAME = 'formulas-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'formulas-dynamic-v1.0.0';

// Recursos críticos para caché estático
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    // Bootstrap CDN
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
    // Interact.js CDN
    'https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js'
];

// URLs que se cachearán dinámicamente
const DYNAMIC_CACHE_URLS = [
    '/offline.html'
];

/**
 * Evento de instalación del Service Worker
 */
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Instalando...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Cacheando recursos estáticos');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Instalación completada');
                return self.skipWaiting(); // Forzar activación inmediata
            })
            .catch(error => {
                console.error('❌ Service Worker: Error en instalación:', error);
            })
    );
});

/**
 * Evento de activación del Service Worker
 */
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activando...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                // Limpiar cachés antiguos
                const cleanupPromises = cacheNames
                    .filter(cacheName => {
                        return cacheName.startsWith('formulas-') &&
                               cacheName !== STATIC_CACHE_NAME &&
                               cacheName !== DYNAMIC_CACHE_NAME;
                    })
                    .map(cacheName => {
                        console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    });

                return Promise.all(cleanupPromises);
            })
            .then(() => {
                console.log('✅ Service Worker: Activación completada');
                return self.clients.claim(); // Controlar todos los clientes inmediatamente
            })
            .catch(error => {
                console.error('❌ Service Worker: Error en activación:', error);
            })
    );
});

/**
 * Intercepta las peticiones de red
 */
self.addEventListener('fetch', event => {
    // Ignorar peticiones no válidas (extensiones de Chrome, etc.)
    if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
        return;
    }


    const request = event.request;
    const url = new URL(request.url);

    // Solo manejar peticiones HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }

    // Estrategia Cache First para recursos estáticos
    if (STATIC_ASSETS.some(asset => request.url.includes(asset.replace('/', '')))) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Estrategia Network First para el HTML principal
    if (request.destination === 'document') {
        event.respondWith(networkFirst(request));
        return;
    }

    // Estrategia Stale While Revalidate para otros recursos
    event.respondWith(staleWhileRevalidate(request));
});

/**
 * Estrategia Cache First
 * Busca primero en caché, si no encuentra va a red
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        // Cachear la respuesta si es válida
        if (networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Error en Cache First:', error);
        return await getOfflineResponse(request);
    }
}

/**
 * Estrategia Network First
 * Intenta red primero, si falla busca en caché
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cachear la respuesta si es válida
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Red no disponible, buscando en caché...');

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        return await getOfflineResponse(request);
    }
}

/**
 * Estrategia Stale While Revalidate
 * Sirve desde caché mientras actualiza en segundo plano
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // Actualizar caché en segundo plano
    const networkPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => null);

    // Devolver respuesta cacheada inmediatamente si existe
    if (cachedResponse) {
        return cachedResponse;
    }

    // Si no hay caché, esperar a la red
    try {
        return await networkPromise;
    } catch (error) {
        return await getOfflineResponse(request);
    }
}

/**
 * Respuesta para cuando no hay conectividad
 */
async function getOfflineResponse(request) {
    // Para documentos HTML, mostrar página offline
    if (request.destination === 'document') {
        return new Response(
            `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sin conexión - Constructor de Fórmulas Químicas</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #f9fafb 0%, #a7f3d0 100%);
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #374151;
                    }
                    .offline-container {
                        text-align: center;
                        background: white;
                        padding: 40px;
                        border-radius: 16px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 20px;
                    }
                    .offline-title {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-bottom: 10px;
                        color: #10b981;
                    }
                    .offline-message {
                        margin-bottom: 20px;
                        line-height: 1.5;
                    }
                    .retry-btn {
                        background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: transform 0.2s;
                    }
                    .retry-btn:hover {
                        transform: translateY(-2px);
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 0.9rem;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="offline-icon">🔬</div>
                    <h1 class="offline-title">Sin conexión a Internet</h1>
                    <p class="offline-message">
                        No hay conexión disponible, pero puedes seguir usando las
                        funciones básicas del Constructor de Fórmulas Químicas.
                    </p>
                    <button class="retry-btn" onclick="window.location.reload()">
                        Intentar de nuevo
                    </button>
                    <div class="footer">
                        <strong>meskeIA</strong> - Constructor de Fórmulas Químicas
                    </div>
                </div>

                <script>
                    // Intentar reconectar automáticamente
                    window.addEventListener('online', () => {
                        window.location.reload();
                    });
                </script>
            </body>
            </html>`,
            {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            }
        );
    }

    // Para otros recursos, respuesta genérica
    return new Response(
        JSON.stringify({
            error: 'Sin conexión',
            message: 'Este recurso no está disponible offline'
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
    );
}

/**
 * Manejo de mensajes desde la aplicación
 */
self.addEventListener('message', event => {
    const { type, payload } = event.data;

    switch (type) {
        case 'GET_VERSION':
            event.ports[0].postMessage({
                version: '1.0.0',
                cacheName: CACHE_NAME
            });
            break;

        case 'CLEAR_CACHE':
            caches.keys()
                .then(cacheNames => {
                    const deletePromises = cacheNames.map(name => caches.delete(name));
                    return Promise.all(deletePromises);
                })
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
                .catch(error => {
                    event.ports[0].postMessage({ success: false, error });
                });
            break;

        case 'SKIP_WAITING':
            self.skipWaiting();
            event.ports[0].postMessage({ success: true });
            break;

        default:
            console.log('Mensaje desconocido:', type);
    }
});

/**
 * Manejar actualizaciones del Service Worker
 */
self.addEventListener('updatefound', () => {
    console.log('🔄 Service Worker: Actualización encontrada');
});

/**
 * Manejar sincronización en segundo plano
 */
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Service Worker: Sincronización en segundo plano');

        event.waitUntil(
            // Aquí puedes sincronizar datos guardados offline
            syncOfflineData()
        );
    }
});

/**
 * Sincronizar datos offline cuando se restaure la conexión
 */
async function syncOfflineData() {
    try {
        // Obtener datos pendientes del localStorage
        const pendingData = await getPendingData();

        if (pendingData.length > 0) {
            console.log(`📤 Sincronizando ${pendingData.length} elementos...`);

            // Enviar datos al servidor
            for (const data of pendingData) {
                try {
                    await fetch('/api/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    // Remover datos sincronizados
                    await removePendingData(data.id);
                } catch (error) {
                    console.error('Error sincronizando:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error en sincronización:', error);
    }
}

/**
 * Obtener datos pendientes de sincronización
 */
async function getPendingData() {
    // Esta función se implementaría según tus necesidades
    return [];
}

/**
 * Remover datos ya sincronizados
 */
async function removePendingData(id) {
    // Esta función se implementaría según tus necesidades
    return true;
}

console.log('🎉 Service Worker cargado - Constructor de Fórmulas Químicas v1.0.0');