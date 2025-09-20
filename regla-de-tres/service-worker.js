// Service Worker para Calculadora de Regla de Tres meskeIA
// Versión del cache
const CACHE_NAME = 'meskeia-regla-tres-v1.0.0';
const urlsToCache = [
    './regla-de-tres.html',
    './manifest.json',
    '../icon_meskeia.png',
    // Chart.js desde CDN se cachea automáticamente por el navegador
];

// Eventos del Service Worker

// Instalación - Cachear recursos
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker para Calculadora Regla de Tres meskeIA');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cache abierto, añadiendo recursos');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('[SW] Error durante la instalación:', error);
            })
    );

    // Forzar activación inmediata
    self.skipWaiting();
});

// Activación - Limpiar caches antiguos
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando Service Worker');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Eliminar caches que no coincidan con la versión actual
                    if (cacheName !== CACHE_NAME && cacheName.startsWith('meskeia-regla-tres-')) {
                        console.log('[SW] Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // Tomar control inmediato de todas las páginas
    self.clients.claim();
});

// Intercepción de peticiones - Estrategia Cache First para recursos estáticos
self.addEventListener('fetch', (event) => {
    // Solo manejar requests GET
    if (event.request.method !== 'GET') {
        return;
    }

    // No interceptar requests de extensiones del navegador
    if (event.request.url.startsWith('chrome-extension://') ||
        event.request.url.startsWith('moz-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si el recurso está en cache, devolverlo
                if (response) {
                    console.log('[SW] Sirviendo desde cache:', event.request.url);
                    return response;
                }

                // Si no está en cache, fetch desde la red
                console.log('[SW] Fetch desde red:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Verificar si es una respuesta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonar la respuesta (se puede consumir solo una vez)
                        const responseToCache = response.clone();

                        // Añadir al cache solo recursos de la misma origin
                        if (event.request.url.startsWith(self.location.origin)) {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch falló:', error);

                        // Para archivos HTML, devolver una página offline básica
                        if (event.request.destination === 'document') {
                            return new Response(`
                                <!DOCTYPE html>
                                <html lang="es">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Sin conexión - meskeIA</title>
                                    <style>
                                        body {
                                            font-family: system-ui, -apple-system, sans-serif;
                                            text-align: center;
                                            padding: 50px 20px;
                                            color: #1A1A1A;
                                            background: #FAFAFA;
                                        }
                                        .offline-container {
                                            max-width: 400px;
                                            margin: 0 auto;
                                            background: white;
                                            padding: 2rem;
                                            border-radius: 8px;
                                            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                                        }
                                        h1 { color: #2E86AB; margin-bottom: 1rem; }
                                        p { color: #666; line-height: 1.5; }
                                        .retry-btn {
                                            background: #2E86AB;
                                            color: white;
                                            border: none;
                                            padding: 12px 24px;
                                            border-radius: 6px;
                                            cursor: pointer;
                                            margin-top: 1rem;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline-container">
                                        <h1>Sin conexión a Internet</h1>
                                        <p>No es posible cargar la Calculadora de Regla de Tres en este momento.</p>
                                        <p>Por favor, verifica tu conexión a Internet e inténtalo de nuevo.</p>
                                        <button class="retry-btn" onclick="window.location.reload()">
                                            Reintentar
                                        </button>
                                        <p style="font-size: 0.9rem; margin-top: 2rem; color: #999;">
                                            © 2025 meskeIA
                                        </p>
                                    </div>
                                </body>
                                </html>
                            `, {
                                headers: {
                                    'Content-Type': 'text/html; charset=utf-8'
                                }
                            });
                        }

                        // Para otros recursos, re-lanzar el error
                        throw error;
                    });
            })
    );
});

// Mensajes desde la aplicación principal
self.addEventListener('message', (event) => {
    console.log('[SW] Mensaje recibido:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME,
            urls: urlsToCache
        });
    }
});

// Notificaciones de actualización
self.addEventListener('updatefound', () => {
    console.log('[SW] Nueva versión encontrada');
});

console.log('[SW] Service Worker de Calculadora Regla de Tres meskeIA cargado');