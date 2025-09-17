/* =========================================
   APLICACIÓN PRINCIPAL - meskeIA
   Tabla Periódica Interactiva
   ========================================= */

class App {
    constructor() {
        this.tabla = null;
        this.juego = null;
        this.vistaActual = 'tabla';

        this.init();
    }

    async init() {
        try {
            // Mostrar loading
            this.mostrarLoading(true);

            // Esperar un momento para que se cargue la UI
            await this.esperarCarga();

            // Inicializar tabla periódica
            this.tabla = new TablaPeriodica('tabla-periodica');

            // Inicializar juego
            this.juego = new JuegoElementos(this.tabla);

            // Configurar eventos de navegación
            this.configurarNavegacion();

            // Ocultar loading y mostrar tabla por defecto
            this.mostrarLoading(false);
            this.mostrarVista('tabla');

            console.log('✅ Aplicación inicializada correctamente');
            console.log(`📊 ${this.tabla.elementos.length} elementos químicos cargados`);

        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            this.mostrarError('Error al cargar la aplicación. Por favor, recarga la página.');
        }
    }

    esperarCarga() {
        return new Promise(resolve => {
            // Verificar que los elementos químicos estén disponibles
            if (typeof elementosQuimicos !== 'undefined' && elementosQuimicos.length > 0) {
                setTimeout(resolve, 500); // Simular carga
            } else {
                setTimeout(() => this.esperarCarga().then(resolve), 100);
            }
        });
    }

    mostrarLoading(mostrar) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarError(mensaje) {
        this.mostrarLoading(false);

        // Crear mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-mensaje';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #E74C3C;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10000;
            max-width: 90%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>${mensaje}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #E74C3C;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
                font-weight: bold;
            ">Recargar Página</button>
        `;

        document.body.appendChild(errorDiv);
    }

    configurarNavegacion() {
        // Botones de navegación
        document.getElementById('btn-vista-tabla').addEventListener('click', () => {
            this.mostrarVista('tabla');
        });

        document.getElementById('btn-modo-juego').addEventListener('click', () => {
            this.mostrarVista('juego');
        });

        document.getElementById('btn-info').addEventListener('click', () => {
            this.mostrarInfoAplicacion();
        });

        // Configurar eventos del teclado
        document.addEventListener('keydown', (e) => {
            // ESC para cerrar modales
            if (e.key === 'Escape') {
                this.cerrarModales();
            }

            // Teclas de acceso rápido
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.mostrarVista('tabla');
                        break;
                    case '2':
                        e.preventDefault();
                        this.mostrarVista('juego');
                        break;
                }
            }
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('info-panel').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.tabla.cerrarInfoPanel();
            }
        });
    }

    mostrarVista(vista) {
        // Actualizar botones de navegación
        document.querySelectorAll('.nav-controls .btn').forEach(btn => {
            btn.removeAttribute('data-active');
        });

        // Ocultar todas las vistas
        document.getElementById('tabla-container').style.display = 'none';
        document.getElementById('juego-container').style.display = 'none';
        document.getElementById('controls-panel').style.display = 'none';

        switch(vista) {
            case 'tabla':
                document.getElementById('btn-vista-tabla').setAttribute('data-active', 'true');
                document.getElementById('tabla-container').style.display = 'block';
                document.getElementById('controls-panel').style.display = 'block';
                this.vistaActual = 'tabla';
                break;

            case 'juego':
                document.getElementById('btn-modo-juego').setAttribute('data-active', 'true');
                document.getElementById('juego-container').style.display = 'block';
                this.vistaActual = 'juego';

                // Iniciar juego si no está activo
                if (!this.juego.juegoActivo) {
                    this.juego.iniciarJuego();
                }
                break;
        }

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    mostrarInfoAplicacion() {
        const modal = this.crearModalInfo();
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    crearModalInfo() {
        const modal = document.createElement('div');
        modal.className = 'info-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 8px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                padding: 30px;
            ">
                <button onclick="this.closest('.info-modal').remove(); document.body.style.overflow='auto'" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #E74C3C;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 16px;
                ">✕</button>

                <h2 style="color: #2C3E50; margin-bottom: 20px;">ℹ️ Acerca de la Aplicación</h2>

                <div style="line-height: 1.6; color: #34495E;">
                    <h3 style="color: #3498DB;">🧪 Tabla Periódica Interactiva</h3>
                    <p>Explora los elementos químicos de forma visual y educativa con esta aplicación web interactiva.</p>

                    <h4 style="color: #27AE60; margin-top: 20px;">✨ Características:</h4>
                    <ul style="margin-left: 20px;">
                        <li><strong>Vista Tabla:</strong> Tabla periódica visual con información detallada</li>
                        <li><strong>Filtros Avanzados:</strong> Por familia, estado, masa atómica y más</li>
                        <li><strong>Modo Juego:</strong> Adivina elementos con pistas progresivas</li>
                        <li><strong>Información Completa:</strong> Propiedades, usos y datos curiosos</li>
                        <li><strong>Diseño Responsivo:</strong> Optimizado para móviles y desktop</li>
                    </ul>

                    <h4 style="color: #8E44AD; margin-top: 20px;">🎮 Cómo Jugar:</h4>
                    <ol style="margin-left: 20px;">
                        <li>Haz clic en "Modo Juego"</li>
                        <li>Lee las pistas del elemento</li>
                        <li>Escribe el nombre o símbolo del elemento</li>
                        <li>Gana puntos por respuestas correctas</li>
                        <li>¡Sube de nivel y mejora tu racha!</li>
                    </ol>

                    <h4 style="color: #E67E22; margin-top: 20px;">⌨️ Atajos de Teclado:</h4>
                    <ul style="margin-left: 20px;">
                        <li><kbd>Ctrl + 1</kbd> → Vista Tabla</li>
                        <li><kbd>Ctrl + 2</kbd> → Modo Juego</li>
                        <li><kbd>ESC</kbd> → Cerrar modales</li>
                        <li><kbd>Enter</kbd> → Responder en el juego</li>
                    </ul>

                    <div style="
                        background: #ECF0F1;
                        padding: 15px;
                        border-radius: 5px;
                        margin-top: 20px;
                        text-align: center;
                    ">
                        <p style="margin: 0;"><strong>© 2025 meskeIA</strong></p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #7F8C8D;">
                            Aplicación educativa gratuita
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });

        return modal;
    }

    cerrarModales() {
        // Cerrar panel de información de elemento
        if (this.tabla && this.tabla.elementoActual) {
            this.tabla.cerrarInfoPanel();
        }

        // Cerrar modal de información de la app
        const modalInfo = document.querySelector('.info-modal');
        if (modalInfo) {
            modalInfo.remove();
            document.body.style.overflow = 'auto';
        }
    }

    // Métodos de utilidad
    obtenerEstadisticasGenerales() {
        return {
            aplicacion: {
                version: '1.0.0',
                elementos: this.tabla ? this.tabla.elementos.length : 0,
                vistaActual: this.vistaActual
            },
            tabla: this.tabla ? this.tabla.obtenerEstadisticas() : null,
            juego: this.juego ? this.juego.obtenerEstadisticas() : null
        };
    }

    exportarDatos() {
        const datos = {
            timestamp: new Date().toISOString(),
            estadisticas: this.obtenerEstadisticasGenerales(),
            configuracion: {
                vista: this.vistaActual
            }
        };

        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tabla-periodica-datos-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Manejo de errores globales
    configurarManejadorErrores() {
        window.addEventListener('error', (e) => {
            console.error('Error global capturado:', e.error);
            this.mostrarMensajeError('Ha ocurrido un error inesperado.');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesa rechazada no manejada:', e.reason);
            this.mostrarMensajeError('Error de conectividad o carga.');
        });
    }

    mostrarMensajeError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #E74C3C;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1001;
            font-weight: bold;
        `;
        errorDiv.textContent = mensaje;
        document.body.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Variables globales
let app;

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Tabla Periódica Interactiva - meskeIA');

    try {
        app = new App();
    } catch (error) {
        console.error('❌ Error fatal al inicializar:', error);
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                background: #ECF0F1;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                ">
                    <h2 style="color: #E74C3C; margin-bottom: 20px;">❌ Error de Inicialización</h2>
                    <p style="color: #34495E; margin-bottom: 20px;">
                        No se pudo cargar la aplicación correctamente.
                    </p>
                    <button onclick="location.reload()" style="
                        background: #3498DB;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Recargar Página</button>
                </div>
            </div>
        `;
    }
});

// Manejo de la visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (app && app.juego) {
        if (document.hidden) {
            app.juego.pausarJuego();
        }
    }
});

// Guardar datos antes de cerrar
window.addEventListener('beforeunload', () => {
    if (app && app.juego) {
        app.juego.guardarEstadisticas();
    }
});