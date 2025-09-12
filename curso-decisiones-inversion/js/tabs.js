// ===== SISTEMA DE PESTAÑAS - TABS.JS =====

class TabSystem {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.bindSectionNavigation();
        this.setInitialState();
    }

    bindEvents() {
        // Navegación principal de pestañas
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Teclado para accesibilidad
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleKeyboardNavigation(e);
            }
        });
    }

    bindSectionNavigation() {
        // Navegación dentro de cada pestaña
        const sectionLinks = document.querySelectorAll('.section-link');
        sectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.switchSection(targetId, link);
            });
        });
    }

    switchTab(tabId) {
        // Actualizar botones
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Actualizar paneles
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // Activar primera sección de la nueva pestaña
        const firstSectionLink = document.querySelector(`#${tabId} .section-link`);
        if (firstSectionLink) {
            const firstSectionId = firstSectionLink.getAttribute('href').substring(1);
            this.switchSection(firstSectionId, firstSectionLink);
        }

        // Scroll al top de la pestaña
        document.querySelector('.tabs-container').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        // Analytics (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'tab_switch', {
                'tab_name': tabId
            });
        }
    }

    switchSection(sectionId, clickedLink) {
        // Encontrar el contenedor padre de la sección actual
        const currentTab = clickedLink.closest('.tab-panel');
        
        // Actualizar links de sección
        currentTab.querySelectorAll('.section-link').forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');

        // Actualizar contenido de sección
        currentTab.querySelectorAll('.content-placeholder').forEach(content => {
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(sectionId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    handleKeyboardNavigation(e) {
        const activeTab = document.querySelector('.tab-button.active');
        const allTabs = Array.from(document.querySelectorAll('.tab-button'));
        const currentIndex = allTabs.indexOf(activeTab);
        
        let nextIndex;
        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % allTabs.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
        }
        
        if (nextIndex !== undefined) {
            e.preventDefault();
            const nextTab = allTabs[nextIndex];
            const tabId = nextTab.getAttribute('data-tab');
            this.switchTab(tabId);
            nextTab.focus();
        }
    }

    setInitialState() {
        // Verificar si hay un hash en la URL para navegar directamente
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Buscar en qué pestaña está la sección
            const targetElement = document.getElementById(hash);
            if (targetElement) {
                const parentTab = targetElement.closest('.tab-panel');
                if (parentTab) {
                    const tabId = parentTab.id;
                    this.switchTab(tabId);
                    
                    // Buscar el link de sección correspondiente
                    const sectionLink = parentTab.querySelector(`[href="#${hash}"]`);
                    if (sectionLink) {
                        this.switchSection(hash, sectionLink);
                    }
                }
            }
        }
        
        // Configurar observador de scroll para navegación automática
        this.setupScrollObserver();
    }

    setupScrollObserver() {
        // Observar qué sección está visible para actualizar la navegación
        const options = {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const activeTab = document.querySelector('.tab-panel.active');
                    const correspondingLink = activeTab.querySelector(`[href="#${sectionId}"]`);
                    
                    if (correspondingLink && !correspondingLink.classList.contains('active')) {
                        this.switchSection(sectionId, correspondingLink);
                    }
                }
            });
        }, options);

        // Observar todas las secciones de contenido
        document.querySelectorAll('.content-placeholder').forEach(section => {
            observer.observe(section);
        });
    }

    // Método para navegar programáticamente (útil para enlaces externos)
    navigateTo(tabId, sectionId = null) {
        this.switchTab(tabId);
        
        if (sectionId) {
            setTimeout(() => {
                const activeTab = document.getElementById(tabId);
                const sectionLink = activeTab.querySelector(`[href="#${sectionId}"]`);
                if (sectionLink) {
                    this.switchSection(sectionId, sectionLink);
                }
            }, 100);
        }
    }

    // Método para obtener el estado actual
    getCurrentState() {
        const activeTab = document.querySelector('.tab-button.active');
        const activeSection = document.querySelector('.tab-panel.active .section-link.active');
        
        return {
            tab: activeTab ? activeTab.getAttribute('data-tab') : null,
            section: activeSection ? activeSection.getAttribute('href').substring(1) : null
        };
    }
}

// Utilidades adicionales
class TabUtils {
    static updateURL(tabId, sectionId = null) {
        if (sectionId) {
            history.replaceState(null, null, `#${sectionId}`);
        } else {
            history.replaceState(null, null, window.location.pathname);
        }
    }

    static showLoadingState() {
        document.querySelector('.tabs-container').classList.add('loading');
    }

    static hideLoadingState() {
        document.querySelector('.tabs-container').classList.remove('loading');
    }

    static isMobile() {
        return window.innerWidth <= 768;
    }

    static preloadTabContent(tabId) {
        // Método para precargar contenido de pestañas (útil para la Fase 2)
        console.log(`Precargando contenido de la pestaña: ${tabId}`);
    }
}

// Funciones de utilidad para navegación externa
window.TabNavigation = {
    goToTab: (tabId, sectionId = null) => {
        if (window.tabSystem) {
            window.tabSystem.navigateTo(tabId, sectionId);
        }
    },
    
    getCurrentTab: () => {
        return window.tabSystem ? window.tabSystem.getCurrentState() : null;
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tabSystem = new TabSystem();
    
    // Mejorar UX en móviles
    if (TabUtils.isMobile()) {
        // Ajustar comportamiento táctil si es necesario
        document.body.classList.add('mobile-tabs');
    }
    
    // Logging para debug (remover en producción)
    console.log('Sistema de pestañas inicializado correctamente');
});

// Manejar cambios de tamaño de ventana
window.addEventListener('resize', () => {
    // Reajustar navegación si es necesario
    if (TabUtils.isMobile() && !document.body.classList.contains('mobile-tabs')) {
        document.body.classList.add('mobile-tabs');
    } else if (!TabUtils.isMobile() && document.body.classList.contains('mobile-tabs')) {
        document.body.classList.remove('mobile-tabs');
    }
});

// Manejar navegación del navegador (botones atrás/adelante)
window.addEventListener('popstate', () => {
    if (window.tabSystem) {
        window.tabSystem.setInitialState();
    }
});

// Exportar para uso en otros módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TabSystem, TabUtils };
}