// ===== JAVASCRIPT GLOBAL ===== 

// Función para inicializar elementos comunes
document.addEventListener('DOMContentLoaded', function() {
    initializeGlobalFeatures();
});

// Inicializar características globales
function initializeGlobalFeatures() {
    // Navegación móvil
    initMobileNavigation();
    
    // Animaciones al hacer scroll
    initScrollAnimations();
    
    // Tooltips y elementos interactivos
    initInteractiveElements();
    
    // Smooth scrolling para enlaces internos
    initSmoothScrolling();
}

// ===== NAVEGACIÓN MÓVIL =====
function initMobileNavigation() {
    // Crear botón hamburguesa si no existe
    const nav = document.querySelector('.main-nav');
    const navMenu = document.querySelector('.nav-menu');
    
    if (nav && navMenu && window.innerWidth <= 768) {
        // Crear botón hamburguesa
        if (!nav.querySelector('.nav-toggle')) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'nav-toggle';
            toggleButton.innerHTML = '☰';
            toggleButton.addEventListener('click', () => {
                navMenu.classList.toggle('nav-menu-active');
                toggleButton.classList.toggle('active');
            });
            
            nav.querySelector('.nav-container').appendChild(toggleButton);
        }
    }
}

// ===== ANIMACIONES AL SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que pueden animarse
    const animatableElements = document.querySelectorAll('.card, .recommendation-item, .allocation-item');
    animatableElements.forEach(el => observer.observe(el));
}

// ===== ELEMENTOS INTERACTIVOS =====
function initInteractiveElements() {
    // Añadir efectos hover a cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Tooltips para elementos con atributo data-tooltip
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FUNCIONES AUXILIARES =====

// Mostrar tooltip
function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.getAttribute('data-tooltip');
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

// Ocultar tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Formatear números con separadores de miles
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Formatear moneda
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos CSS en línea para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        maxWidth: '300px'
    });
    
    // Colores según el tipo
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)';
            notification.style.color = '#2d3436';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)';
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función para cargar contenido dinámicamente
function loadContent(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Mostrar loading
    container.innerHTML = '<div class="loading">Cargando...</div>';
    
    fetch(url)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
        })
        .catch(error => {
            container.innerHTML = '<div class="error">Error al cargar el contenido</div>';
            console.error('Error:', error);
        });
}

// ===== UTILIDADES MATEMÁTICAS =====

// Calcular interés compuesto
function calculateCompoundInterest(principal, rate, time, frequency = 1) {
    return principal * Math.pow((1 + (rate / frequency)), (frequency * time));
}

// Calcular anualidad
function calculateAnnuity(payment, rate, periods) {
    if (rate === 0) return payment * periods;
    return payment * ((Math.pow(1 + rate, periods) - 1) / rate);
}

// Calcular valor presente
function calculatePresentValue(futureValue, rate, periods) {
    return futureValue / Math.pow(1 + rate, periods);
}

// ===== EXPORT PARA MÓDULOS =====
// Si se usa como módulo, exportar funciones principales
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        formatCurrency,
        validateEmail,
        showNotification,
        calculateCompoundInterest,
        calculateAnnuity,
        calculatePresentValue
    };
}