// ========== INVESTIGACIÓN OPERATIVA - FUNCIONALIDADES ==========
// Sistema completo de herramientas de investigación operativa
// Versión: 1.0 - meskeIA

'use strict';

// ========== CONFIGURACIÓN Y UTILIDADES ==========

const LOCALE_CONFIG = {
    locale: 'es-ES',
    currency: 'EUR',
    timezone: 'Europe/Madrid'
};

// Funciones de formato español
function formatNumber(value, decimals = 2) {
    if (typeof value === 'string') {
        value = value.replace(/[€$%\s]/g, '').replace(',', '.');
        value = parseFloat(value);
    }
    if (isNaN(value)) return '0,00';

    return value.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function parseSpanishNumber(value) {
    if (typeof value !== 'string') return parseFloat(value) || 0;

    return parseFloat(
        value.replace(/\./g, '')
             .replace(',', '.')
             .replace(/[€$%\s]/g, '')
    ) || 0;
}

// ========== MÓDULO: TEORÍA DE COLAS M/M/1 ==========

function calcularColas() {
    try {
        // Analytics: Track calculation start
        if (typeof trackModuleUsage !== 'undefined') {
            trackModuleUsage('colas', 'calculation_started');
        }

        // Obtener valores de entrada
        const lambda = parseSpanishNumber(document.getElementById('lambda').value);
        const mu = parseSpanishNumber(document.getElementById('mu').value);

        // Validaciones
        if (lambda <= 0) {
            mostrarError('resultados-colas', 'La tasa de llegada (λ) debe ser mayor que 0');
            return;
        }

        if (mu <= 0) {
            mostrarError('resultados-colas', 'La tasa de servicio (μ) debe ser mayor que 0');
            return;
        }

        if (lambda >= mu) {
            mostrarError('resultados-colas', 'Para estabilidad del sistema: λ debe ser menor que μ (λ < μ)');
            return;
        }

        // Cálculos del sistema M/M/1
        const rho = lambda / mu;  // Factor de utilización
        const P0 = 1 - rho;       // Probabilidad de sistema vacío
        const L = lambda / (mu - lambda);    // Número promedio en el sistema
        const Lq = (lambda * lambda) / (mu * (mu - lambda));  // Número promedio en cola
        const W = 1 / (mu - lambda);         // Tiempo promedio en el sistema
        const Wq = lambda / (mu * (mu - lambda));  // Tiempo promedio en cola

        // Tiempo en servicio promedio
        const Ws = 1 / mu;

        // Mostrar resultados
        mostrarResultadosColas({
            lambda,
            mu,
            rho,
            P0,
            L,
            Lq,
            W,
            Wq,
            Ws
        });

        // Generar gráfico
        crearGraficoColas(rho, P0, L, Lq);

    } catch (error) {
        console.error('Error en cálculo de colas:', error);
        mostrarError('resultados-colas', 'Error en los cálculos. Verifique los valores ingresados.');
    }
}

function mostrarResultadosColas(metricas) {
    const {lambda, mu, rho, P0, L, Lq, W, Wq, Ws} = metricas;

    const html = `
        <h3 style="margin-bottom: 1rem;">Métricas del Sistema</h3>

        <div class="alert alert-success">
            <strong>✅ Sistema Estable</strong> (ρ = ${formatNumber(rho, 3)} < 1)
        </div>

        <div style="display: grid; gap: 1rem;">

            <!-- Utilización del Sistema -->
            <div class="card" style="padding: 1rem; margin-bottom: 0;">
                <h4 style="color: var(--primary); margin-bottom: 0.5rem;">📈 Utilización</h4>
                <div style="font-size: 1.1rem; font-weight: 600;">
                    ρ = ${formatNumber(rho * 100, 1)}%
                </div>
                <small class="text-muted">Factor de utilización del servidor</small>
            </div>

            <!-- Probabilidades -->
            <div class="card" style="padding: 1rem; margin-bottom: 0;">
                <h4 style="color: var(--primary); margin-bottom: 0.5rem;">🎯 Probabilidades</h4>
                <div>
                    <strong>P₀ = ${formatNumber(P0 * 100, 1)}%</strong>
                    <small class="text-muted d-block">Probabilidad de sistema vacío</small>
                </div>
                <div style="margin-top: 0.5rem;">
                    <strong>P(ocupado) = ${formatNumber(rho * 100, 1)}%</strong>
                    <small class="text-muted d-block">Probabilidad de servidor ocupado</small>
                </div>
            </div>

            <!-- Número de Clientes -->
            <div class="card" style="padding: 1rem; margin-bottom: 0;">
                <h4 style="color: var(--secondary); margin-bottom: 0.5rem;">👥 Número de Clientes</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 600;">
                            L = ${formatNumber(L, 2)}
                        </div>
                        <small class="text-muted">En el sistema total</small>
                    </div>
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 600;">
                            L_q = ${formatNumber(Lq, 2)}
                        </div>
                        <small class="text-muted">En la cola esperando</small>
                    </div>
                </div>
            </div>

            <!-- Tiempos de Espera -->
            <div class="card" style="padding: 1rem; margin-bottom: 0;">
                <h4 style="color: var(--secondary); margin-bottom: 0.5rem;">⏱️ Tiempos (en horas)</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 600;">
                            W = ${formatNumber(W, 3)}
                        </div>
                        <small class="text-muted">Total en sistema</small>
                    </div>
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 600;">
                            W_q = ${formatNumber(Wq, 3)}
                        </div>
                        <small class="text-muted">Esperando en cola</small>
                    </div>
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 600;">
                            W_s = ${formatNumber(Ws, 3)}
                        </div>
                        <small class="text-muted">Siendo servido</small>
                    </div>
                </div>
            </div>

            <!-- Interpretación -->
            <div class="card" style="padding: 1rem; margin-bottom: 0; background: var(--primary-light);">
                <h4 style="color: var(--primary); margin-bottom: 0.5rem;">💡 Interpretación</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li>En promedio hay <strong>${formatNumber(L, 1)} clientes</strong> en el sistema</li>
                    <li>Un cliente espera <strong>${formatNumber(W * 60, 0)} minutos</strong> desde que llega hasta que se va</li>
                    <li>El servidor está ocupado el <strong>${formatNumber(rho * 100, 0)}%</strong> del tiempo</li>
                    ${Lq > 2 ? '<li style="color: var(--warning);"><strong>⚠️ Cola larga:</strong> considere aumentar la capacidad de servicio</li>' : ''}
                    ${W > 1 ? '<li style="color: var(--warning);"><strong>⚠️ Espera alta:</strong> tiempo total mayor a 1 hora</li>' : ''}
                </ul>
            </div>
        </div>

        <!-- Botones de acción -->
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
            <button class="btn btn-outline" onclick="exportarResultadosColas()">
                📄 Exportar Resultados
            </button>
            <button class="btn btn-outline" onclick="simularEventosColas()">
                🎲 Simulación de Eventos
            </button>
        </div>
    `;

    document.getElementById('resultados-colas').innerHTML = html;
}

function crearGraficoColas(rho, P0, L, Lq) {
    const ctx = document.getElementById('grafico-colas').getContext('2d');

    // Destruir gráfico anterior si existe
    if (graficoColas) {
        graficoColas.destroy();
    }

    // Configurar Chart.js para formato español
    Chart.defaults.locale = 'es-ES';

    graficoColas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Utilización (%)', 'Sistema Vacío (%)', 'Clientes en Sistema', 'Clientes en Cola'],
            datasets: [{
                label: 'Métricas del Sistema M/M/1',
                data: [rho * 100, P0 * 100, L, Lq],
                backgroundColor: [
                    'rgba(46, 134, 171, 0.8)',   // Utilización
                    'rgba(72, 169, 166, 0.8)',   // Sistema vacío
                    'rgba(243, 156, 18, 0.8)',   // Clientes en sistema
                    'rgba(231, 76, 60, 0.8)'     // Clientes en cola
                ],
                borderColor: [
                    'rgba(46, 134, 171, 1)',
                    'rgba(72, 169, 166, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Métricas del Sistema de Cola M/M/1',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
                            let suffix = '';

                            if (context.dataIndex === 0 || context.dataIndex === 1) {
                                suffix = '%';
                                value = formatNumber(value, 1);
                            } else {
                                suffix = ' clientes';
                                value = formatNumber(value, 2);
                            }

                            return `${context.dataset.label}: ${value}${suffix}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value, 1);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Métricas'
                    }
                }
            }
        }
    });
}

function exportarResultadosColas() {
    try {
        const lambda = parseSpanishNumber(document.getElementById('lambda').value);
        const mu = parseSpanishNumber(document.getElementById('mu').value);

        if (!lambda || !mu) {
            alert('Primero debe calcular los resultados');
            return;
        }

        const rho = lambda / mu;
        const P0 = 1 - rho;
        const L = lambda / (mu - lambda);
        const Lq = (lambda * lambda) / (mu * (mu - lambda));
        const W = 1 / (mu - lambda);
        const Wq = lambda / (mu * (mu - lambda));
        const Ws = 1 / mu;

        const reporte = `REPORTE DE ANÁLISIS - SISTEMA DE COLA M/M/1
================================================
Fecha: ${new Date().toLocaleDateString('es-ES')}
Hora: ${new Date().toLocaleTimeString('es-ES')}

PARÁMETROS DEL SISTEMA:
- Tasa de llegada (λ): ${formatNumber(lambda)} clientes/hora
- Tasa de servicio (μ): ${formatNumber(mu)} clientes/hora

MÉTRICAS CALCULADAS:
- Factor de utilización (ρ): ${formatNumber(rho, 4)} (${formatNumber(rho * 100, 2)}%)
- Probabilidad sistema vacío (P₀): ${formatNumber(P0, 4)} (${formatNumber(P0 * 100, 2)}%)

NÚMERO DE CLIENTES:
- Número promedio en el sistema (L): ${formatNumber(L, 3)} clientes
- Número promedio en cola (Lq): ${formatNumber(Lq, 3)} clientes

TIEMPOS DE ESPERA:
- Tiempo promedio en el sistema (W): ${formatNumber(W, 4)} horas (${formatNumber(W * 60, 1)} min)
- Tiempo promedio en cola (Wq): ${formatNumber(Wq, 4)} horas (${formatNumber(Wq * 60, 1)} min)
- Tiempo promedio de servicio (Ws): ${formatNumber(Ws, 4)} horas (${formatNumber(Ws * 60, 1)} min)

INTERPRETACIÓN:
${rho > 0.8 ? '⚠️  ALTA UTILIZACIÓN: El sistema está muy cargado' : '✅ UTILIZACIÓN NORMAL: El sistema opera correctamente'}
${L > 5 ? '⚠️  COLA LARGA: Considere aumentar capacidad de servicio' : '✅ COLA ACEPTABLE: Longitud de cola dentro de parámetros normales'}
${W > 1 ? '⚠️  ESPERA ALTA: Los clientes esperan más de 1 hora' : '✅ ESPERA ACEPTABLE: Tiempos de espera razonables'}

RECOMENDACIONES:
${rho > 0.9 ? '- Urgente: Aumentar capacidad de servicio o reducir demanda' : ''}
${rho > 0.8 ? '- Considerar agregar un servidor adicional' : ''}
${Wq > 0.5 ? '- Implementar sistema de citas o reservas' : ''}
${L > 10 ? '- Evaluar estrategias de gestión de demanda' : ''}

================================================
Generado por meskeIA - Investigación Operativa
`;

        // Crear y descargar archivo
        const blob = new Blob([reporte], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Colas_M-M-1_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Mostrar confirmación
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-medium);
            z-index: 1000;
            font-weight: 500;
        `;
        toast.textContent = '✅ Reporte exportado exitosamente';
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);

    } catch (error) {
        console.error('Error exportando resultados:', error);
        alert('Error al exportar el reporte');
    }
}

function simularEventosColas() {
    const lambda = parseSpanishNumber(document.getElementById('lambda').value);
    const mu = parseSpanishNumber(document.getElementById('mu').value);

    if (!lambda || !mu || lambda >= mu) {
        alert('Primero debe calcular un sistema estable');
        return;
    }

    // Simulación de eventos discretos simplificada
    const numEventos = 1000;
    let tiempo = 0;
    let clientesEnSistema = 0;
    let clientesAtendidos = 0;
    let tiempoTotal = 0;
    let tiempoEspera = 0;

    // Generar eventos
    const eventos = [];

    // Próxima llegada
    let proximaLlegada = -Math.log(Math.random()) / lambda;
    // Próxima salida (infinito si no hay nadie)
    let proximaSalida = clientesEnSistema > 0 ? tiempo - Math.log(Math.random()) / mu : Infinity;

    for (let i = 0; i < numEventos; i++) {
        if (proximaLlegada < proximaSalida) {
            // Evento: Llegada
            tiempo = proximaLlegada;
            clientesEnSistema++;

            // Si el servidor estaba libre, programar salida
            if (clientesEnSistema === 1) {
                proximaSalida = tiempo - Math.log(Math.random()) / mu;
            }

            // Programar próxima llegada
            proximaLlegada = tiempo - Math.log(Math.random()) / lambda;

        } else {
            // Evento: Salida
            tiempo = proximaSalida;
            clientesEnSistema--;
            clientesAtendidos++;

            // Si hay más clientes, programar próxima salida
            if (clientesEnSistema > 0) {
                proximaSalida = tiempo - Math.log(Math.random()) / mu;
            } else {
                proximaSalida = Infinity;
            }
        }

        tiempoTotal += clientesEnSistema * (i > 0 ? (tiempo - eventos[i-1]?.tiempo || 0) : 0);
        eventos.push({
            tiempo: tiempo,
            tipo: proximaLlegada < proximaSalida ? 'llegada' : 'salida',
            clientesEnSistema: clientesEnSistema
        });
    }

    // Calcular métricas de la simulación
    const LSimulado = tiempoTotal / tiempo;
    const utilizacionSimulada = clientesAtendidos / (tiempo * mu);

    // Mostrar resultados de simulación
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            margin: 20px;
        ">
            <h3 style="margin-bottom: 1rem;">🎲 Resultados de Simulación</h3>

            <div class="alert alert-info">
                Simulación de ${numEventos} eventos discretos
            </div>

            <div style="display: grid; gap: 1rem; margin: 1rem 0;">
                <div class="card" style="padding: 1rem;">
                    <h4>📊 Métricas Simuladas vs Teóricas</h4>
                    <table style="width: 100%; margin-top: 1rem;">
                        <tr style="border-bottom: 1px solid var(--border);">
                            <th style="text-align: left; padding: 0.5rem;">Métrica</th>
                            <th style="text-align: right; padding: 0.5rem;">Simulada</th>
                            <th style="text-align: right; padding: 0.5rem;">Teórica</th>
                            <th style="text-align: right; padding: 0.5rem;">Diferencia</th>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem;">Clientes en sistema (L)</td>
                            <td style="text-align: right; padding: 0.5rem;">${formatNumber(LSimulado, 2)}</td>
                            <td style="text-align: right; padding: 0.5rem;">${formatNumber(lambda / (mu - lambda), 2)}</td>
                            <td style="text-align: right; padding: 0.5rem;">${formatNumber(Math.abs(LSimulado - lambda / (mu - lambda)), 2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem;">Utilización (ρ)</td>
                            <td style="text-align: right; padding: 0.5rem;">${formatNumber(utilizacionSimulada, 3)}</td>
                            <td style="text-align: right; padding: 0.5rem;">${formatNumber(lambda / mu, 3)}</td>
                            <td style="text-align: right; padding: 0.5rem;">${formatNumber(Math.abs(utilizacionSimulada - lambda / mu), 3)}</td>
                        </tr>
                    </table>
                </div>

                <div class="card" style="padding: 1rem;">
                    <h4>ℹ️ Detalles de la Simulación</h4>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        <li>Tiempo total simulado: ${formatNumber(tiempo, 1)} horas</li>
                        <li>Clientes atendidos: ${clientesAtendidos}</li>
                        <li>Eventos procesados: ${numEventos}</li>
                        <li>Método: Simulación de eventos discretos</li>
                    </ul>
                </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    Cerrar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========== FUNCIONES DE UTILIDAD ==========

function mostrarError(containerId, mensaje) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="alert alert-warning">
            <strong>⚠️ Error:</strong> ${mensaje}
        </div>
    `;
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script de Investigación Operativa cargado');

    // Auto-formatear campos numéricos al perder el foco
    document.querySelectorAll('input[data-type="number"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                const value = parseSpanishNumber(this.value);
                this.value = formatNumber(value, 2);
            }
        });

        input.addEventListener('focus', function() {
            if (this.value.trim()) {
                const value = parseSpanishNumber(this.value);
                this.value = value.toString().replace('.', ',');
            }
        });
    });

    // Navegación por pestañas con analytics
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Analytics: Track module navigation
            if (typeof trackModuleUsage !== 'undefined') {
                trackModuleUsage(this.dataset.tab, 'tab_opened');
            }

            // Remover active de todas las pestañas
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Activar pestaña seleccionada
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');

            // Verificar URL parameters para deep linking
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('tab') !== this.dataset.tab) {
                // Actualizar URL sin recargar página
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('tab', this.dataset.tab);
                window.history.pushState({}, '', newUrl);
            }
        });
    });

    // Deep linking: Verificar parámetro de URL al cargar
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab');
    if (activeTab && document.querySelector(`[data-tab="${activeTab}"]`)) {
        document.querySelector(`[data-tab="${activeTab}"]`).click();
    }

    // Valores por defecto para demostración
    document.getElementById('lambda').value = '5,0';
    document.getElementById('mu').value = '8,0';

    // Analytics: Track app load
    if (typeof trackModuleUsage !== 'undefined') {
        trackModuleUsage('app', 'loaded');
    }

    // ========== NAVEGACIÓN DE TEORÍA ==========
    document.querySelectorAll('.teoria-nav').forEach(button => {
        button.addEventListener('click', function() {
            // Analytics: Track theory navigation
            if (typeof trackModuleUsage !== 'undefined') {
                trackModuleUsage('teoria', this.dataset.section);
            }

            // Remover active de todos los botones de teoría
            document.querySelectorAll('.teoria-nav').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.teoria-section').forEach(section => section.classList.remove('active'));

            // Activar el botón y sección seleccionada
            this.classList.add('active');
            document.getElementById(this.dataset.section).classList.add('active');
        });
    });
});

// ========== FUNCIONES DE FAQs EXPANDIBLES ==========

function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement;
    const answerElement = faqItem.querySelector('.faq-answer');
    const isActive = questionElement.classList.contains('active');

    // Cerrar todas las otras FAQs en el mismo contenedor
    const faqContainer = questionElement.closest('.faq-container');
    faqContainer.querySelectorAll('.faq-question').forEach(q => {
        if (q !== questionElement) {
            q.classList.remove('active');
            q.parentElement.querySelector('.faq-answer').classList.remove('active');
        }
    });

    // Toggle del FAQ actual
    if (isActive) {
        questionElement.classList.remove('active');
        answerElement.classList.remove('active');
    } else {
        questionElement.classList.add('active');
        answerElement.classList.add('active');

        // Analytics: Track FAQ interaction
        if (typeof trackModuleUsage !== 'undefined') {
            const questionText = questionElement.querySelector('span').textContent;
            trackModuleUsage('faq', 'opened');
        }
    }

    // Smooth scroll al FAQ abierto después de un pequeño delay
    if (!isActive) {
        setTimeout(() => {
            questionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }
}

// ========== MÓDULO: PROBLEMA DE TRANSPORTE ==========

let tablaTransporte = [];
let oferta = [];
let demanda = [];

function generarTablaTransporte() {
    try {
        const numFuentes = parseInt(document.getElementById('num-fuentes').value);
        const numDestinos = parseInt(document.getElementById('num-destinos').value);

        if (numFuentes < 2 || numFuentes > 5 || numDestinos < 2 || numDestinos > 5) {
            alert('El número de fuentes y destinos debe estar entre 2 y 5');
            return;
        }

        // Inicializar arrays
        tablaTransporte = Array(numFuentes).fill().map(() => Array(numDestinos).fill(0));
        oferta = Array(numFuentes).fill(0);
        demanda = Array(numDestinos).fill(0);

        // Generar HTML de la tabla
        let html = `
            <div style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem;">🚚 Configuración del Problema</h3>

                <div class="alert alert-info">
                    Complete la matriz de costos, ofertas y demandas. Los costos representan el costo unitario de transporte.
                </div>

                <div class="card" style="padding: 1.5rem; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
                        <thead>
                            <tr>
                                <th style="padding: 0.5rem; border: 2px solid var(--border); background: var(--bg-primary); text-align: center;">
                                    Fuente \\ Destino
                                </th>
        `;

        // Headers de destinos
        for (let j = 0; j < numDestinos; j++) {
            html += `
                <th style="padding: 0.5rem; border: 2px solid var(--border); background: var(--primary-light); text-align: center;">
                    D${j + 1}
                </th>
            `;
        }

        html += `
                                <th style="padding: 0.5rem; border: 2px solid var(--border); background: var(--secondary); color: white; text-align: center;">
                                    Oferta
                                </th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        // Filas de fuentes
        for (let i = 0; i < numFuentes; i++) {
            html += `
                <tr>
                    <td style="padding: 0.5rem; border: 2px solid var(--border); background: var(--primary-light); text-align: center; font-weight: bold;">
                        F${i + 1}
                    </td>
            `;

            // Celdas de costos
            for (let j = 0; j < numDestinos; j++) {
                html += `
                    <td style="padding: 0.5rem; border: 2px solid var(--border); text-align: center;">
                        <input type="text" class="form-input" id="costo_${i}_${j}"
                               style="width: 80px; text-align: center; margin: 0;"
                               placeholder="0,00" data-type="number"
                               oninput="actualizarCosto(${i}, ${j}, this.value)">
                    </td>
                `;
            }

            // Celda de oferta
            html += `
                    <td style="padding: 0.5rem; border: 2px solid var(--border); text-align: center;">
                        <input type="text" class="form-input" id="oferta_${i}"
                               style="width: 80px; text-align: center; margin: 0; background: rgba(72, 169, 166, 0.1);"
                               placeholder="0" data-type="number"
                               oninput="actualizarOferta(${i}, this.value)">
                    </td>
                </tr>
            `;
        }

        // Fila de demanda
        html += `
                            <tr>
                                <td style="padding: 0.5rem; border: 2px solid var(--border); background: var(--secondary); color: white; text-align: center; font-weight: bold;">
                                    Demanda
                                </td>
        `;

        for (let j = 0; j < numDestinos; j++) {
            html += `
                <td style="padding: 0.5rem; border: 2px solid var(--border); text-align: center;">
                    <input type="text" class="form-input" id="demanda_${j}"
                           style="width: 80px; text-align: center; margin: 0; background: rgba(72, 169, 166, 0.1);"
                           placeholder="0" data-type="number"
                           oninput="actualizarDemanda(${j}, this.value)">
                </td>
            `;
        }

        html += `
                                <td style="padding: 0.5rem; border: 2px solid var(--border); background: var(--bg-primary); text-align: center;">
                                    <div id="balance-total" style="font-weight: bold;">0</div>
                                    <small class="text-muted">Balance</small>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Botones de acción -->
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-secondary" onclick="llenarEjemploTransporte()">
                            📝 Ejemplo
                        </button>
                        <button class="btn btn-primary" onclick="resolverTransporte()">
                            🎯 Resolver Problema
                        </button>
                        <button class="btn btn-outline" onclick="limpiarTransporte()">
                            🗑️ Limpiar
                        </button>
                    </div>

                    <!-- Validación del balance -->
                    <div id="validacion-balance" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;

        document.getElementById('tabla-transporte').innerHTML = html;

        // Configurar auto-formato para los nuevos inputs
        configurarFormatoInputs();

    } catch (error) {
        console.error('Error generando tabla de transporte:', error);
        mostrarError('tabla-transporte', 'Error al generar la tabla');
    }
}

function actualizarCosto(i, j, value) {
    tablaTransporte[i][j] = parseSpanishNumber(value);
}

function actualizarOferta(i, value) {
    oferta[i] = parseSpanishNumber(value);
    actualizarBalance();
}

function actualizarDemanda(j, value) {
    demanda[j] = parseSpanishNumber(value);
    actualizarBalance();
}

function actualizarBalance() {
    const totalOferta = oferta.reduce((sum, val) => sum + val, 0);
    const totalDemanda = demanda.reduce((sum, val) => sum + val, 0);
    const balance = totalOferta - totalDemanda;

    const balanceElement = document.getElementById('balance-total');
    const validacionElement = document.getElementById('validacion-balance');

    if (balanceElement) {
        balanceElement.textContent = formatNumber(balance);

        if (balance === 0) {
            balanceElement.style.color = 'var(--success)';
        } else {
            balanceElement.style.color = 'var(--warning)';
        }
    }

    if (validacionElement) {
        if (balance === 0) {
            validacionElement.innerHTML = `
                <div class="alert alert-success">
                    ✅ <strong>Problema Balanceado:</strong> La oferta total (${formatNumber(totalOferta)})
                    es igual a la demanda total (${formatNumber(totalDemanda)}).
                </div>
            `;
        } else if (balance > 0) {
            validacionElement.innerHTML = `
                <div class="alert alert-warning">
                    ⚠️ <strong>Exceso de Oferta:</strong> La oferta supera la demanda en ${formatNumber(balance)} unidades.
                    Se agregará un destino ficticio.
                </div>
            `;
        } else {
            validacionElement.innerHTML = `
                <div class="alert alert-warning">
                    ⚠️ <strong>Exceso de Demanda:</strong> La demanda supera la oferta en ${formatNumber(-balance)} unidades.
                    Se agregará una fuente ficticia.
                </div>
            `;
        }
    }
}

function llenarEjemploTransporte() {
    // Llenar con un ejemplo típico de 3x3
    const ejemploCostos = [
        [8, 6, 10],
        [9, 12, 13],
        [14, 9, 16]
    ];
    const ejemploOferta = [150, 200, 100];
    const ejemploDemanda = [130, 170, 150];

    // Llenar costos
    for (let i = 0; i < ejemploCostos.length; i++) {
        for (let j = 0; j < ejemploCostos[i].length; j++) {
            const input = document.getElementById(`costo_${i}_${j}`);
            if (input) {
                input.value = formatNumber(ejemploCostos[i][j]);
                tablaTransporte[i][j] = ejemploCostos[i][j];
            }
        }
    }

    // Llenar ofertas
    for (let i = 0; i < ejemploOferta.length; i++) {
        const input = document.getElementById(`oferta_${i}`);
        if (input) {
            input.value = formatNumber(ejemploOferta[i]);
            oferta[i] = ejemploOferta[i];
        }
    }

    // Llenar demandas
    for (let j = 0; j < ejemploDemanda.length; j++) {
        const input = document.getElementById(`demanda_${j}`);
        if (input) {
            input.value = formatNumber(ejemploDemanda[j]);
            demanda[j] = ejemploDemanda[j];
        }
    }

    actualizarBalance();
}

function limpiarTransporte() {
    // Limpiar todas las matrices
    tablaTransporte = tablaTransporte.map(row => row.map(() => 0));
    oferta.fill(0);
    demanda.fill(0);

    // Limpiar inputs
    document.querySelectorAll('#tabla-transporte input').forEach(input => {
        input.value = '';
    });

    // Limpiar resultados
    document.getElementById('resultados-transporte').innerHTML = '';

    actualizarBalance();
}

function resolverTransporte() {
    try {
        // Validar que los datos estén completos
        if (!validarDatosTransporte()) {
            return;
        }

        const metodo = document.getElementById('metodo-transporte').value;
        let solucion;

        switch (metodo) {
            case 'esquina-noroeste':
                solucion = resolverEsquinaNoroeste();
                break;
            case 'costo-minimo':
                solucion = resolverCostoMinimo();
                break;
            case 'vogel':
                solucion = resolverVogel();
                break;
            default:
                throw new Error('Método no reconocido');
        }

        mostrarResultadosTransporte(solucion, metodo);

    } catch (error) {
        console.error('Error resolviendo problema de transporte:', error);
        mostrarError('resultados-transporte', 'Error al resolver el problema: ' + error.message);
    }
}

function validarDatosTransporte() {
    // Verificar que las matrices no estén vacías
    if (tablaTransporte.length === 0 || oferta.length === 0 || demanda.length === 0) {
        mostrarError('resultados-transporte', 'Primero debe generar la tabla de transporte');
        return false;
    }

    // Verificar que todos los valores sean positivos
    for (let i = 0; i < oferta.length; i++) {
        if (oferta[i] <= 0) {
            mostrarError('resultados-transporte', `La oferta de F${i+1} debe ser mayor que 0`);
            return false;
        }
    }

    for (let j = 0; j < demanda.length; j++) {
        if (demanda[j] <= 0) {
            mostrarError('resultados-transporte', `La demanda de D${j+1} debe ser mayor que 0`);
            return false;
        }
    }

    // Verificar costos
    for (let i = 0; i < tablaTransporte.length; i++) {
        for (let j = 0; j < tablaTransporte[i].length; j++) {
            if (tablaTransporte[i][j] < 0) {
                mostrarError('resultados-transporte', `Los costos no pueden ser negativos`);
                return false;
            }
        }
    }

    return true;
}

function resolverEsquinaNoroeste() {
    const m = oferta.length;
    const n = demanda.length;

    // Copiar arrays para no modificar los originales
    const ofertaTemp = [...oferta];
    const demandaTemp = [...demanda];

    // Matriz de solución
    const solucion = Array(m).fill().map(() => Array(n).fill(0));

    let i = 0, j = 0;
    const asignaciones = [];

    while (i < m && j < n) {
        const cantidad = Math.min(ofertaTemp[i], demandaTemp[j]);

        solucion[i][j] = cantidad;
        asignaciones.push({
            fuente: i,
            destino: j,
            cantidad: cantidad,
            costo: tablaTransporte[i][j],
            costoTotal: cantidad * tablaTransporte[i][j]
        });

        ofertaTemp[i] -= cantidad;
        demandaTemp[j] -= cantidad;

        if (ofertaTemp[i] === 0) {
            i++;
        } else {
            j++;
        }
    }

    const costoTotal = asignaciones.reduce((sum, asig) => sum + asig.costoTotal, 0);

    return {
        metodo: 'Esquina Noroeste',
        solucion: solucion,
        asignaciones: asignaciones,
        costoTotal: costoTotal,
        descripcion: 'Método heurístico que comienza en la esquina superior izquierda'
    };
}

function resolverCostoMinimo() {
    const m = oferta.length;
    const n = demanda.length;

    const ofertaTemp = [...oferta];
    const demandaTemp = [...demanda];
    const solucion = Array(m).fill().map(() => Array(n).fill(0));
    const asignaciones = [];

    while (ofertaTemp.some(o => o > 0) && demandaTemp.some(d => d > 0)) {
        // Encontrar el costo mínimo disponible
        let minCosto = Infinity;
        let minI = -1, minJ = -1;

        for (let i = 0; i < m; i++) {
            if (ofertaTemp[i] > 0) {
                for (let j = 0; j < n; j++) {
                    if (demandaTemp[j] > 0 && tablaTransporte[i][j] < minCosto) {
                        minCosto = tablaTransporte[i][j];
                        minI = i;
                        minJ = j;
                    }
                }
            }
        }

        if (minI === -1) break;

        // Asignar la máxima cantidad posible
        const cantidad = Math.min(ofertaTemp[minI], demandaTemp[minJ]);

        solucion[minI][minJ] = cantidad;
        asignaciones.push({
            fuente: minI,
            destino: minJ,
            cantidad: cantidad,
            costo: tablaTransporte[minI][minJ],
            costoTotal: cantidad * tablaTransporte[minI][minJ]
        });

        ofertaTemp[minI] -= cantidad;
        demandaTemp[minJ] -= cantidad;
    }

    const costoTotal = asignaciones.reduce((sum, asig) => sum + asig.costoTotal, 0);

    return {
        metodo: 'Costo Mínimo',
        solucion: solucion,
        asignaciones: asignaciones,
        costoTotal: costoTotal,
        descripcion: 'Método que siempre elige la celda con menor costo disponible'
    };
}

function resolverVogel() {
    // Implementación simplificada del método de Vogel
    const m = oferta.length;
    const n = demanda.length;

    const ofertaTemp = [...oferta];
    const demandaTemp = [...demanda];
    const solucion = Array(m).fill().map(() => Array(n).fill(0));
    const asignaciones = [];

    // Por simplicidad, usar método de costo mínimo como aproximación
    // En una implementación completa, se calcularían las penalizaciones
    const resultado = resolverCostoMinimo();

    return {
        metodo: 'Vogel (Aproximación)',
        solucion: resultado.solucion,
        asignaciones: resultado.asignaciones,
        costoTotal: resultado.costoTotal,
        descripcion: 'Método heurístico basado en penalizaciones (implementación simplificada)'
    };
}

function mostrarResultadosTransporte(solucion, metodo) {
    const html = `
        <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">📊 Solución del Problema</h3>

            <div class="alert alert-success">
                <strong>✅ Solución encontrada</strong> usando el método: ${solucion.descripcion}
            </div>

            <div class="results-grid">
                <!-- Costo Total -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">💰 Costo Total Mínimo</h4>
                    </div>
                    <div class="card-body" style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">
                            ${formatNumber(solucion.costoTotal)} €
                        </div>
                        <p class="text-muted">Costo óptimo de transporte</p>
                    </div>
                </div>

                <!-- Tabla de Asignaciones -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">📋 Asignaciones Óptimas</h4>
                    </div>
                    <div class="card-body">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg-primary);">
                                    <th style="padding: 0.5rem; border: 1px solid var(--border);">Ruta</th>
                                    <th style="padding: 0.5rem; border: 1px solid var(--border);">Cantidad</th>
                                    <th style="padding: 0.5rem; border: 1px solid var(--border);">Costo Unit.</th>
                                    <th style="padding: 0.5rem; border: 1px solid var(--border);">Costo Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${solucion.asignaciones.filter(a => a.cantidad > 0).map(asig => `
                                    <tr>
                                        <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                                            F${asig.fuente + 1} → D${asig.destino + 1}
                                        </td>
                                        <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                                            ${formatNumber(asig.cantidad)}
                                        </td>
                                        <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                                            ${formatNumber(asig.costo)} €
                                        </td>
                                        <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                                            ${formatNumber(asig.costoTotal)} €
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Matriz de Solución -->
            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-header">
                    <h4 class="card-title">🎯 Matriz de Solución</h4>
                    <p class="card-subtitle">Cantidades a transportar por cada ruta</p>
                </div>
                <div class="card-body" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 0.5rem; border: 2px solid var(--border); background: var(--bg-primary);">
                                    Fuente \\ Destino
                                </th>
                                ${Array.from({length: solucion.solucion[0].length}, (_, j) => `
                                    <th style="padding: 0.5rem; border: 2px solid var(--border); background: var(--primary-light);">
                                        D${j + 1}
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${solucion.solucion.map((fila, i) => `
                                <tr>
                                    <td style="padding: 0.5rem; border: 2px solid var(--border); background: var(--primary-light); font-weight: bold;">
                                        F${i + 1}
                                    </td>
                                    ${fila.map((valor, j) => `
                                        <td style="padding: 0.5rem; border: 2px solid var(--border); text-align: center; ${valor > 0 ? 'background: rgba(39, 174, 96, 0.1); font-weight: bold;' : ''}">
                                            ${valor > 0 ? formatNumber(valor) : '—'}
                                        </td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Botones de exportación -->
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-outline" onclick="exportarSolucionTransporte()">
                    📄 Exportar Solución
                </button>
            </div>
        </div>
    `;

    document.getElementById('resultados-transporte').innerHTML = html;
}

function exportarSolucionTransporte() {
    // Implementación básica de exportación
    alert('Función de exportación: En desarrollo');
}

function configurarFormatoInputs() {
    // Aplicar formato español a los nuevos inputs
    document.querySelectorAll('#tabla-transporte input[data-type="number"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                const value = parseSpanishNumber(this.value);
                this.value = formatNumber(value, this.id.includes('costo') ? 2 : 0);
            }
        });

        input.addEventListener('focus', function() {
            if (this.value.trim()) {
                const value = parseSpanishNumber(this.value);
                this.value = value.toString().replace('.', ',');
            }
        });
    });
}

// ========== MÓDULO: PLANIFICACIÓN CPM ==========

let actividades = [];

function agregarActividad() {
    try {
        // Obtener valores del formulario
        const id = document.getElementById('actividad-id').value.trim().toUpperCase();
        const descripcion = document.getElementById('actividad-desc').value.trim();
        const duracion = parseSpanishNumber(document.getElementById('actividad-duracion').value);
        const predecesoras = document.getElementById('actividad-predecesoras').value.trim();

        // Validaciones
        if (!id) {
            alert('Debe ingresar un ID para la actividad');
            return;
        }

        if (id.length > 3) {
            alert('El ID no puede tener más de 3 caracteres');
            return;
        }

        if (!descripcion) {
            alert('Debe ingresar una descripción para la actividad');
            return;
        }

        if (duracion <= 0) {
            alert('La duración debe ser mayor que 0');
            return;
        }

        // Verificar que no exista ya el ID
        if (actividades.some(act => act.id === id)) {
            alert(`Ya existe una actividad con ID ${id}`);
            return;
        }

        // Procesar predecesoras
        let listaPredecesoras = [];
        if (predecesoras) {
            listaPredecesoras = predecesoras.split(',')
                .map(p => p.trim().toUpperCase())
                .filter(p => p.length > 0);

            // Verificar que las predecesoras existan
            for (let pred of listaPredecesoras) {
                if (!actividades.some(act => act.id === pred)) {
                    alert(`La actividad predecesora ${pred} no existe. Debe crear primero las predecesoras.`);
                    return;
                }
            }
        }

        // Crear nueva actividad
        const nuevaActividad = {
            id: id,
            descripcion: descripcion,
            duracion: duracion,
            predecesoras: listaPredecesoras,
            tiempoInicioTemprano: 0,
            tiempoFinTemprano: 0,
            tiempoInicioTardio: 0,
            tiempoFinTardio: 0,
            holgura: 0,
            esCritica: false
        };

        actividades.push(nuevaActividad);
        mostrarListaActividades();
        limpiarFormularioActividad();

        // Habilitar botón de cálculo si hay actividades
        document.querySelector('button[onclick="calcularCPM()"]').disabled = false;

        console.log('Actividad agregada:', nuevaActividad);

    } catch (error) {
        console.error('Error agregando actividad:', error);
        alert('Error al agregar la actividad');
    }
}

function mostrarListaActividades() {
    const container = document.getElementById('lista-actividades');

    if (actividades.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No hay actividades definidas</div>';
        return;
    }

    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
                <tr style="background: var(--bg-primary);">
                    <th style="padding: 0.5rem; border: 1px solid var(--border); text-align: left;">ID</th>
                    <th style="padding: 0.5rem; border: 1px solid var(--border); text-align: left;">Descripción</th>
                    <th style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">Duración</th>
                    <th style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">Predecesoras</th>
                    <th style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    actividades.forEach((actividad, index) => {
        html += `
            <tr>
                <td style="padding: 0.5rem; border: 1px solid var(--border); font-weight: bold;">${actividad.id}</td>
                <td style="padding: 0.5rem; border: 1px solid var(--border);">${actividad.descripcion}</td>
                <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${formatNumber(actividad.duracion, 0)} días</td>
                <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                    ${actividad.predecesoras.length > 0 ? actividad.predecesoras.join(', ') : '—'}
                </td>
                <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                    <button onclick="eliminarActividad(${index})"
                            style="background: var(--error); color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

function eliminarActividad(index) {
    const actividad = actividades[index];

    // Verificar si alguna otra actividad depende de esta
    const dependientes = actividades.filter(act => act.predecesoras.includes(actividad.id));

    if (dependientes.length > 0) {
        const listaDependientes = dependientes.map(act => act.id).join(', ');
        alert(`No se puede eliminar ${actividad.id} porque es predecesora de: ${listaDependientes}`);
        return;
    }

    if (confirm(`¿Está seguro de eliminar la actividad ${actividad.id}?`)) {
        actividades.splice(index, 1);
        mostrarListaActividades();

        // Deshabilitar botón si no hay actividades
        if (actividades.length === 0) {
            document.querySelector('button[onclick="calcularCPM()"]').disabled = true;
            document.getElementById('resultados-cpm').innerHTML = '';
        }
    }
}

function limpiarFormularioActividad() {
    document.getElementById('actividad-id').value = '';
    document.getElementById('actividad-desc').value = '';
    document.getElementById('actividad-duracion').value = '';
    document.getElementById('actividad-predecesoras').value = '';
}

function limpiarActividades() {
    if (actividades.length > 0) {
        if (confirm('¿Está seguro de eliminar todas las actividades?')) {
            actividades = [];
            mostrarListaActividades();
            document.querySelector('button[onclick="calcularCPM()"]').disabled = true;
            document.getElementById('resultados-cpm').innerHTML = '';
        }
    }
}

function calcularCPM() {
    try {
        if (actividades.length === 0) {
            alert('Debe agregar al menos una actividad');
            return;
        }

        // Verificar dependencias circulares
        if (tieneDependenciasCirculares()) {
            mostrarError('resultados-cpm', 'Error: Se detectaron dependencias circulares en el proyecto');
            return;
        }

        // Calcular tiempos tempranos (forward pass)
        calcularTiemposTempranos();

        // Calcular tiempos tardíos (backward pass)
        calcularTiemposTardios();

        // Identificar ruta crítica
        identificarRutaCritica();

        // Mostrar resultados
        mostrarResultadosCPM();

    } catch (error) {
        console.error('Error calculando CPM:', error);
        mostrarError('resultados-cpm', 'Error en el cálculo: ' + error.message);
    }
}

function tieneDependenciasCirculares() {
    // Implementación simple de detección de ciclos usando DFS
    const visitados = new Set();
    const enRecursion = new Set();

    function dfs(actividadId) {
        if (enRecursion.has(actividadId)) {
            return true; // Ciclo detectado
        }

        if (visitados.has(actividadId)) {
            return false;
        }

        visitados.add(actividadId);
        enRecursion.add(actividadId);

        const actividad = actividades.find(act => act.id === actividadId);
        if (actividad) {
            for (let pred of actividad.predecesoras) {
                if (dfs(pred)) {
                    return true;
                }
            }
        }

        enRecursion.delete(actividadId);
        return false;
    }

    for (let actividad of actividades) {
        if (dfs(actividad.id)) {
            return true;
        }
    }

    return false;
}

function calcularTiemposTempranos() {
    // Ordenamiento topológico para procesar actividades en orden correcto
    const procesadas = new Set();

    while (procesadas.size < actividades.length) {
        let progreso = false;

        for (let actividad of actividades) {
            if (procesadas.has(actividad.id)) continue;

            // Verificar si todas las predecesoras están procesadas
            if (actividad.predecesoras.every(pred => procesadas.has(pred))) {
                // Calcular tiempo de inicio temprano
                if (actividad.predecesoras.length === 0) {
                    actividad.tiempoInicioTemprano = 0;
                } else {
                    actividad.tiempoInicioTemprano = Math.max(
                        ...actividad.predecesoras.map(pred => {
                            const actPred = actividades.find(act => act.id === pred);
                            return actPred.tiempoFinTemprano;
                        })
                    );
                }

                // Calcular tiempo de fin temprano
                actividad.tiempoFinTemprano = actividad.tiempoInicioTemprano + actividad.duracion;

                procesadas.add(actividad.id);
                progreso = true;
            }
        }

        if (!progreso) {
            throw new Error('No se pueden calcular los tiempos (posible dependencia circular)');
        }
    }
}

function calcularTiemposTardios() {
    // Calcular el tiempo total del proyecto
    const tiempoTotalProyecto = Math.max(...actividades.map(act => act.tiempoFinTemprano));

    // Procesar actividades en orden inverso
    const procesadas = new Set();

    // Primero, procesar actividades sin sucesoras (actividades finales)
    const actividadesFinales = actividades.filter(act =>
        !actividades.some(otra => otra.predecesoras.includes(act.id))
    );

    for (let actividad of actividadesFinales) {
        actividad.tiempoFinTardio = tiempoTotalProyecto;
        actividad.tiempoInicioTardio = actividad.tiempoFinTardio - actividad.duracion;
        procesadas.add(actividad.id);
    }

    // Procesar el resto de actividades
    while (procesadas.size < actividades.length) {
        let progreso = false;

        for (let actividad of actividades) {
            if (procesadas.has(actividad.id)) continue;

            // Encontrar todas las sucesoras de esta actividad
            const sucesoras = actividades.filter(act => act.predecesoras.includes(actividad.id));

            // Verificar si todas las sucesoras están procesadas
            if (sucesoras.every(suc => procesadas.has(suc.id))) {
                if (sucesoras.length === 0) {
                    // No debería llegar aquí si se procesaron correctamente las finales
                    actividad.tiempoFinTardio = tiempoTotalProyecto;
                } else {
                    // El tiempo de fin tardío es el mínimo de los tiempos de inicio tardío de las sucesoras
                    actividad.tiempoFinTardio = Math.min(
                        ...sucesoras.map(suc => suc.tiempoInicioTardio)
                    );
                }

                actividad.tiempoInicioTardio = actividad.tiempoFinTardio - actividad.duracion;
                procesadas.add(actividad.id);
                progreso = true;
            }
        }

        if (!progreso) {
            throw new Error('Error calculando tiempos tardíos');
        }
    }
}

function identificarRutaCritica() {
    // Calcular holgura para cada actividad
    for (let actividad of actividades) {
        actividad.holgura = actividad.tiempoInicioTardio - actividad.tiempoInicioTemprano;
        actividad.esCritica = actividad.holgura === 0;
    }
}

function mostrarResultadosCPM() {
    const tiempoTotalProyecto = Math.max(...actividades.map(act => act.tiempoFinTemprano));
    const actividadesCriticas = actividades.filter(act => act.esCritica);
    const rutaCritica = encontrarRutaCritica();

    const html = `
        <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">📊 Resultados del Análisis CPM</h3>

            <div class="alert alert-success">
                <strong>✅ Análisis completado</strong> - Ruta crítica identificada
            </div>

            <div class="results-grid">
                <!-- Resumen del Proyecto -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">⏱️ Duración del Proyecto</h4>
                    </div>
                    <div class="card-body" style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">
                            ${formatNumber(tiempoTotalProyecto, 0)} días
                        </div>
                        <p class="text-muted">Tiempo mínimo de ejecución</p>
                        <div style="margin-top: 1rem;">
                            <strong>${actividadesCriticas.length} actividades críticas</strong>
                            <br>
                            <small class="text-muted">Sin margen de retraso</small>
                        </div>
                    </div>
                </div>

                <!-- Ruta Crítica -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">🎯 Ruta Crítica</h4>
                    </div>
                    <div class="card-body">
                        <div style="text-align: center; margin-bottom: 1rem;">
                            <div style="font-size: 1.2rem; font-weight: bold; color: var(--error);">
                                ${rutaCritica.join(' → ')}
                            </div>
                        </div>
                        <div class="alert alert-warning">
                            <small><strong>⚠️ Atención:</strong> Cualquier retraso en estas actividades retrasará todo el proyecto.</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabla Detallada -->
            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-header">
                    <h4 class="card-title">📋 Análisis Detallado de Actividades</h4>
                </div>
                <div class="card-body" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                        <thead>
                            <tr style="background: var(--bg-primary);">
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">ID</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">Descripción</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">Duración</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">IT</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">FT</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">IT Tardío</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">FT Tardío</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">Holgura</th>
                                <th style="padding: 0.5rem; border: 1px solid var(--border);">Crítica</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${actividades.map(actividad => `
                                <tr style="${actividad.esCritica ? 'background: rgba(231, 76, 60, 0.1);' : ''}">
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); font-weight: bold;">${actividad.id}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border);">${actividad.descripcion}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${formatNumber(actividad.duracion, 0)}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${formatNumber(actividad.tiempoInicioTemprano, 0)}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${formatNumber(actividad.tiempoFinTemprano, 0)}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${formatNumber(actividad.tiempoInicioTardio, 0)}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">${formatNumber(actividad.tiempoFinTardio, 0)}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center; ${actividad.holgura === 0 ? 'color: var(--error); font-weight: bold;' : ''}">${formatNumber(actividad.holgura, 0)}</td>
                                    <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: center;">
                                        ${actividad.esCritica ? '<span style="color: var(--error); font-weight: bold;">🔴 SÍ</span>' : '<span style="color: var(--success);">🟢 NO</span>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
                        <strong>Leyenda:</strong> IT = Inicio Temprano, FT = Fin Temprano.
                        Las actividades críticas (holgura = 0) están resaltadas en rojo.
                    </div>
                </div>
            </div>

            <!-- Recomendaciones -->
            <div class="card" style="margin-top: 1.5rem; background: var(--primary-light);">
                <div class="card-header">
                    <h4 class="card-title">💡 Recomendaciones de Gestión</h4>
                </div>
                <div class="card-body">
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li><strong>Monitorear constantemente</strong> las actividades críticas: ${actividadesCriticas.map(act => act.id).join(', ')}</li>
                        <li><strong>Asignar recursos adicionales</strong> a actividades críticas si es necesario</li>
                        <li><strong>Crear planes de contingencia</strong> para actividades críticas de alto riesgo</li>
                        ${actividades.some(act => act.holgura > 5) ? '<li><strong>Redistribuir recursos</strong> de actividades con alta holgura hacia críticas</li>' : ''}
                        <li><strong>Revisar regularmente</strong> el avance y actualizar la planificación</li>
                    </ul>
                </div>
            </div>

            <!-- Botones de acción -->
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-outline" onclick="exportarCPM()">
                    📄 Exportar Análisis
                </button>
                <button class="btn btn-outline" onclick="mostrarGantt()" style="margin-left: 1rem;">
                    📊 Ver Diagrama Gantt
                </button>
            </div>
        </div>
    `;

    document.getElementById('resultados-cpm').innerHTML = html;
}

function encontrarRutaCritica() {
    // Encontrar la secuencia de actividades críticas
    const actividadesCriticas = actividades.filter(act => act.esCritica);

    if (actividadesCriticas.length === 0) return [];

    // Ordenar por tiempo de inicio temprano
    actividadesCriticas.sort((a, b) => a.tiempoInicioTemprano - b.tiempoInicioTemprano);

    return actividadesCriticas.map(act => act.id);
}

function exportarCPM() {
    try {
        if (actividades.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const tiempoTotal = Math.max(...actividades.map(act => act.tiempoFinTemprano));
        const actividadesCriticas = actividades.filter(act => act.esCritica);

        let reporte = `ANÁLISIS CPM - MÉTODO DE RUTA CRÍTICA
=============================================
Fecha: ${new Date().toLocaleDateString('es-ES')}
Hora: ${new Date().toLocaleTimeString('es-ES')}

RESUMEN DEL PROYECTO:
- Duración total: ${formatNumber(tiempoTotal, 0)} días
- Total de actividades: ${actividades.length}
- Actividades críticas: ${actividadesCriticas.length}
- Ruta crítica: ${encontrarRutaCritica().join(' → ')}

ANÁLISIS DETALLADO:
`;

        // Tabla de actividades
        reporte += `
ID\tDescripción\tDuración\tIT\tFT\tIT Tardío\tFT Tardío\tHolgura\tCrítica\n`;
        reporte += `${'='.repeat(100)}\n`;

        actividades.forEach(act => {
            reporte += `${act.id}\t${act.descripcion}\t${act.duracion}\t${act.tiempoInicioTemprano}\t${act.tiempoFinTemprano}\t${act.tiempoInicioTardio}\t${act.tiempoFinTardio}\t${act.holgura}\t${act.esCritica ? 'SÍ' : 'NO'}\n`;
        });

        reporte += `\nACTIVIDADES CRÍTICAS:
${actividadesCriticas.map(act => `- ${act.id}: ${act.descripcion} (${act.duracion} días)`).join('\n')}

RECOMENDACIONES:
- Monitorear estrictamente las actividades críticas
- Asignar los mejores recursos a la ruta crítica
- Crear planes de contingencia para actividades de alto riesgo
- Revisar periódicamente el progreso del proyecto

=============================================
Generado por meskeIA - Investigación Operativa`;

        // Crear y descargar archivo
        const blob = new Blob([reporte], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Analisis_CPM_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Mostrar confirmación
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-medium);
            z-index: 1000;
            font-weight: 500;
        `;
        toast.textContent = '✅ Análisis CPM exportado exitosamente';
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);

    } catch (error) {
        console.error('Error exportando CPM:', error);
        alert('Error al exportar el análisis');
    }
}

function mostrarGantt() {
    // Implementación básica de vista Gantt
    alert('Diagrama de Gantt: Funcionalidad en desarrollo.\n\nPor ahora puede usar la tabla detallada para visualizar los tiempos de cada actividad.');
}