// Script PWA para meskeIA - Versión con Event Listeners Seguros
// v5.0 - Solución definitiva para problemas de clicks

(function() {
    'use strict';

    console.log('🚀 meskeIA PWA: Iniciando script v5.0...');

    let deferredPrompt = null;
    const DISMISSED_KEY = 'meskeia-install-dismissed';
    const INSTALLED_KEY = 'meskeia-installed';

    // Crear y mostrar banner de instalación
    function createInstallBanner() {
        // Verificar si ya existe el banner
        if (document.getElementById('meskeia-pwa-banner')) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'meskeia-pwa-banner';
        
        // Estilos con z-index muy alto y pointer-events
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #2E86AB 0%, #48A9A6 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(46, 134, 171, 0.3);
            z-index: 2147483647;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 90%;
            min-width: 300px;
            text-align: center;
            pointer-events: auto !important;
        `;
        
        // Crear el contenido con IDs únicos para los botones
        const content = document.createElement('div');
        content.style.cssText = 'display: flex; align-items: center; gap: 15px; flex-wrap: wrap; justify-content: center; pointer-events: auto !important;';
        
        // Sección del icono y texto
        const textSection = document.createElement('div');
        textSection.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        textSection.innerHTML = `
            <span style="font-size: 1.5rem;">📱</span>
            <span style="font-weight: 600;">Instalar meskeIA</span>
        `;
        
        // Sección de botones
        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = 'display: flex; gap: 10px;';
        
        // Botón Instalar
        const installBtn = document.createElement('button');
        installBtn.id = 'meskeia-install-btn-unique';
        installBtn.textContent = 'Instalar App';
        installBtn.style.cssText = `
            background: rgba(255,255,255,0.9);
            border: none;
            color: #2E86AB;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            pointer-events: auto !important;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
        `;
        
        // Botón Cancelar
        const dismissBtn = document.createElement('button');
        dismissBtn.id = 'meskeia-dismiss-btn-unique';
        dismissBtn.textContent = 'Más tarde';
        dismissBtn.style.cssText = `
            background: transparent;
            border: 1px solid rgba(255,255,255,0.5);
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            pointer-events: auto !important;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
        `;
        
        // Ensamblar todo
        buttonSection.appendChild(installBtn);
        buttonSection.appendChild(dismissBtn);
        content.appendChild(textSection);
        content.appendChild(buttonSection);
        banner.appendChild(content);
        
        // Añadir al body
        document.body.appendChild(banner);
        
        // Añadir event listeners con timeout para asegurar que el DOM está listo
        setTimeout(() => {
            // Usar addEventListener en lugar de onclick
            const installButton = document.getElementById('meskeia-install-btn-unique');
            const dismissButton = document.getElementById('meskeia-dismiss-btn-unique');
            
            if (installButton) {
                // Múltiples eventos para asegurar que funcione
                installButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    installPWA();
                }, true);
                
                installButton.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    installPWA();
                }, true);
            }
            
            if (dismissButton) {
                dismissButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dismissInstall();
                }, true);
                
                dismissButton.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dismissInstall();
                }, true);
            }
            
            console.log('✅ Banner creado con event listeners');
        }, 100);
    }

    // Ocultar banner
    function hideBanner() {
        const banner = document.getElementById('meskeia-pwa-banner');
        if (banner) {
            banner.remove();
            console.log('🔒 Banner ocultado');
        }
    }

    // Instalar PWA
    async function installPWA() {
        console.log('📱 Función installPWA ejecutada');

        if (!deferredPrompt) {
            console.log('⚠️ No hay prompt disponible, mostrando instrucciones');
            showManualInstructions();
            return;
        }

        try {
            hideBanner();
            console.log('📱 Mostrando prompt nativo...');
            
            // Mostrar el prompt nativo
            deferredPrompt.prompt();
            
            // Esperar la respuesta del usuario
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario eligió: ${outcome}`);

            if (outcome === 'accepted') {
                localStorage.setItem(INSTALLED_KEY, 'true');
                showSuccessMessage();
            }

            deferredPrompt = null;

        } catch (error) {
            console.error('Error al instalar:', error);
            showManualInstructions();
        }
    }

    // Rechazar instalación
    function dismissInstall() {
        console.log('📱 Función dismissInstall ejecutada');
        sessionStorage.setItem(DISMISSED_KEY, 'true');
        hideBanner();
    }

    // Mostrar instrucciones manuales con event listeners seguros
    function showManualInstructions() {
        hideBanner();
        
        const instructions = document.createElement('div');
        instructions.id = 'meskeia-manual-instructions';
        instructions.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: #333;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 2147483647;
            max-width: 90%;
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            pointer-events: auto !important;
        `;
        
        instructions.innerHTML = `
            <h3 style="color: #2E86AB; margin-bottom: 15px; font-size: 1.3rem;">📱 Instalar meskeIA</h3>
            <p style="margin-bottom: 15px; color: #666;">Para instalar la aplicación en tu dispositivo:</p>
            <ol style="text-align: left; margin: 20px 0; color: #444; line-height: 1.8;">
                <li>Toca los <strong>3 puntos</strong> del menú de Chrome ⋮</li>
                <li>Busca y selecciona <strong>"Añadir a pantalla de inicio"</strong> o <strong>"Instalar aplicación"</strong></li>
                <li>Confirma tocando <strong>"Añadir"</strong> o <strong>"Instalar"</strong></li>
            </ol>
            <button id="meskeia-manual-close" style="
                background: #2E86AB;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 10px;
                font-size: 15px;
                pointer-events: auto !important;
            ">Entendido</button>
        `;
        
        document.body.appendChild(instructions);
        
        // Event listener para cerrar
        setTimeout(() => {
            const closeBtn = document.getElementById('meskeia-manual-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    const inst = document.getElementById('meskeia-manual-instructions');
                    if (inst) inst.remove();
                }, true);
            }
        }, 100);
    }

    // Mostrar mensaje de éxito
    function showSuccessMessage() {
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 25px 35px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(39, 174, 96, 0.3);
            z-index: 2147483647;
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            pointer-events: none;
        `;
        
        success.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🎉</div>
            <div style="font-weight: 700; font-size: 1.2rem; margin-bottom: 5px;">¡meskeIA instalado!</div>
            <div style="font-size: 0.95rem; opacity: 0.95;">Ya puedes acceder desde tu pantalla de inicio</div>
        `;
        
        document.body.appendChild(success);
        setTimeout(() => success.remove(), 4000);
    }

    // Registrar Service Worker
    async function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.error('❌ Service Worker no soportado');
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('✅ Service Worker registrado:', registration.scope);
            return true;
        } catch (error) {
            console.error('❌ Error registrando Service Worker:', error);
            return false;
        }
    }

    // Inicialización principal
    async function initialize() {
        console.log('🎯 Inicializando sistema PWA...');

        // Verificar si ya está en modo standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true;

        if (isStandalone) {
            console.log('✅ App ejecutándose en modo standalone');
            return;
        }

        // Registrar Service Worker
        const swOk = await registerServiceWorker();
        if (!swOk) {
            console.error('❌ No se pudo registrar el Service Worker');
            return;
        }

        // Escuchar el evento beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🎯 Evento beforeinstallprompt capturado');
            e.preventDefault();
            deferredPrompt = e;

            // Mostrar banner si no fue rechazado previamente
            if (!sessionStorage.getItem(DISMISSED_KEY) && 
                !localStorage.getItem(INSTALLED_KEY)) {
                setTimeout(() => {
                    createInstallBanner();
                }, 2000);
            }
        });

        // Escuchar cuando se instala
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA instalada exitosamente');
            localStorage.setItem(INSTALLED_KEY, 'true');
            hideBanner();
            showSuccessMessage();
        });

        // Verificar si podemos mostrar el banner manualmente
        setTimeout(() => {
            if (!deferredPrompt && 
                !sessionStorage.getItem(DISMISSED_KEY) && 
                !localStorage.getItem(INSTALLED_KEY) &&
                !isStandalone) {
                console.log('📱 No hay evento beforeinstallprompt, mostrando banner con instrucciones');
                // Crear banner que solo mostrará instrucciones manuales
                createInstallBanner();
            }
        }, 5000);
    }

    // Exponer API global con funciones seguras
    window.meskeIAPWA = {
        install: function() {
            console.log('Llamada manual a install');
            installPWA();
        },
        dismiss: function() {
            console.log('Llamada manual a dismiss');
            dismissInstall();
        },
        showBanner: function() {
            console.log('Llamada manual a showBanner');
            createInstallBanner();
        },
        hideBanner: function() {
            console.log('Llamada manual a hideBanner');
            hideBanner();
        },
        showManual: function() {
            console.log('Llamada manual a showManual');
            showManualInstructions();
        },
        reset: function() {
            console.log('Reset PWA');
            localStorage.removeItem(INSTALLED_KEY);
            sessionStorage.removeItem(DISMISSED_KEY);
            if (deferredPrompt) deferredPrompt = null;
            location.reload();
        },
        status: function() {
            const status = {
                deferredPrompt: !!deferredPrompt,
                dismissed: sessionStorage.getItem(DISMISSED_KEY),
                installed: localStorage.getItem(INSTALLED_KEY),
                standalone: window.matchMedia('(display-mode: standalone)').matches
            };
            console.log('Estado PWA:', status);
            alert('PWA Status:\n' + JSON.stringify(status, null, 2));
            return status;
        }
    };

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    console.log('✅ Script PWA cargado completamente');

})();