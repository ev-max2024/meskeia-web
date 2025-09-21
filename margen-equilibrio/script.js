// Configuración de formato español
const formatoEspanol = {
    decimal: ',',
    miles: '.',
    moneda: '€'
};

// Clase principal de la aplicación
class PuntoEquilibrioApp {
    constructor() {
        this.costosFijos = [];
        this.costosVariables = [];
        this.precioVenta = 0;
        this.chart = null;
        this.init();
    }

    init() {
        this.cargarDatosGuardados();
        this.actualizarTotales();
        this.mostrarSesionesGuardadas();
    }

    // Formatear números al estilo español
    formatearNumero(numero, decimales = 2) {
        return numero.toLocaleString('es-ES', {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        });
    }

    // Parsear número desde formato español
    parsearNumero(texto) {
        if (!texto) return 0;
        // Remover el símbolo de euro y espacios
        texto = texto.toString().replace('€', '').trim();
        // Reemplazar formato español a formato JS
        texto = texto.replace(/\./g, '').replace(',', '.');
        return parseFloat(texto) || 0;
    }

    // Actualizar totales en tiempo real
    actualizarTotales() {
        // Calcular total costos fijos
        let totalFijos = 0;
        document.querySelectorAll('#costosFijos .amount-input').forEach(input => {
            totalFijos += this.parsearNumero(input.value);
        });
        document.getElementById('totalFijos').textContent = this.formatearNumero(totalFijos) + ' €';

        // Calcular total costos variables
        let totalVariables = 0;
        document.querySelectorAll('#costosVariables .amount-input').forEach(input => {
            totalVariables += this.parsearNumero(input.value);
        });
        document.getElementById('totalVariables').textContent = this.formatearNumero(totalVariables) + ' €';
    }

    // Calcular punto de equilibrio
    calcular() {
        // Obtener datos
        const costosFijos = this.obtenerTotalCostosFijos();
        const costosVariables = this.obtenerTotalCostosVariables();
        const precioVenta = this.parsearNumero(document.getElementById('precioVenta').value);

        // Validaciones
        if (precioVenta === 0) {
            this.mostrarError('Por favor, introduce un precio de venta');
            return;
        }

        if (precioVenta <= costosVariables) {
            this.mostrarError('El precio de venta debe ser mayor que el costo variable unitario');
            return;
        }

        // Cálculos
        const margenContribucion = precioVenta - costosVariables;
        const puntoEquilibrioUnidades = Math.ceil(costosFijos / margenContribucion);
        const puntoEquilibrioEuros = puntoEquilibrioUnidades * precioVenta;
        const margenPorcentaje = (margenContribucion / precioVenta) * 100;

        // Mostrar resultados
        this.mostrarResultados({
            puntoEquilibrioUnidades,
            puntoEquilibrioEuros,
            margenContribucion,
            margenPorcentaje,
            costosFijos,
            costosVariables,
            precioVenta
        });
    }

    // Mostrar resultados
    mostrarResultados(datos) {
        // Actualizar valores
        document.getElementById('puntoEquilibrioUnidades').textContent =
            this.formatearNumero(datos.puntoEquilibrioUnidades, 0);
        document.getElementById('puntoEquilibrioEuros').textContent =
            this.formatearNumero(datos.puntoEquilibrioEuros) + ' €';
        document.getElementById('margenContribucion').textContent =
            this.formatearNumero(datos.margenContribucion) + ' €';
        document.getElementById('margenPorcentaje').textContent =
            this.formatearNumero(datos.margenPorcentaje, 1) + '%';

        // Generar tabla de escenarios
        this.generarTablaEscenarios(datos);

        // Crear gráfico
        this.crearGrafico(datos);

        // Mostrar sección de resultados
        document.getElementById('resultados').style.display = 'block';
        document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
    }

    // Generar tabla de escenarios
    generarTablaEscenarios(datos) {
        const tbody = document.querySelector('#scenariosTable tbody');
        tbody.innerHTML = '';

        // Crear escenarios desde 0 hasta 150% del punto de equilibrio
        const maxUnidades = Math.ceil(datos.puntoEquilibrioUnidades * 1.5);
        const step = Math.ceil(maxUnidades / 10);

        for (let unidades = 0; unidades <= maxUnidades; unidades += step) {
            const ventas = unidades * datos.precioVenta;
            const costosTotales = datos.costosFijos + (unidades * datos.costosVariables);
            const beneficio = ventas - costosTotales;

            const tr = document.createElement('tr');

            // Resaltar punto de equilibrio
            if (Math.abs(unidades - datos.puntoEquilibrioUnidades) < step / 2) {
                tr.style.background = 'rgba(255, 107, 53, 0.2)';
                tr.style.fontWeight = 'bold';
            }

            tr.innerHTML = `
                <td>${this.formatearNumero(unidades, 0)}</td>
                <td>${this.formatearNumero(ventas)} €</td>
                <td>${this.formatearNumero(costosTotales)} €</td>
                <td class="${beneficio >= 0 ? 'positive' : 'negative'}">
                    ${this.formatearNumero(beneficio)} €
                </td>
            `;
            tbody.appendChild(tr);
        }
    }

    // Crear gráfico con Chart.js
    crearGrafico(datos) {
        const ctx = document.getElementById('breakEvenChart').getContext('2d');

        // Destruir gráfico anterior si existe
        if (this.chart) {
            this.chart.destroy();
        }

        // Preparar datos para el gráfico
        const maxUnidades = Math.ceil(datos.puntoEquilibrioUnidades * 1.5);
        const labels = [];
        const ingresos = [];
        const costosTotales = [];
        const beneficios = [];

        for (let unidades = 0; unidades <= maxUnidades; unidades += Math.ceil(maxUnidades / 20)) {
            labels.push(unidades);
            const ingreso = unidades * datos.precioVenta;
            const costoTotal = datos.costosFijos + (unidades * datos.costosVariables);

            ingresos.push(ingreso);
            costosTotales.push(costoTotal);
            beneficios.push(ingreso - costoTotal);
        }

        // Crear gráfico
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresos,
                        borderColor: '#27AE60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 3,
                        tension: 0
                    },
                    {
                        label: 'Costos Totales',
                        data: costosTotales,
                        borderColor: '#E74C3C',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 3,
                        tension: 0
                    },
                    {
                        label: 'Beneficio/Pérdida',
                        data: beneficios,
                        borderColor: '#FF6B35',
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis del Punto de Equilibrio',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        color: '#2C3E50'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format(context.parsed.y);
                                return label;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            puntoEquilibrio: {
                                type: 'line',
                                xMin: datos.puntoEquilibrioUnidades,
                                xMax: datos.puntoEquilibrioUnidades,
                                borderColor: '#FF6B35',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    enabled: true,
                                    content: 'Punto de Equilibrio',
                                    position: 'start'
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Unidades Vendidas'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Euros (€)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Obtener total costos fijos
    obtenerTotalCostosFijos() {
        let total = 0;
        document.querySelectorAll('#costosFijos .amount-input').forEach(input => {
            total += this.parsearNumero(input.value);
        });
        return total;
    }

    // Obtener total costos variables
    obtenerTotalCostosVariables() {
        let total = 0;
        document.querySelectorAll('#costosVariables .amount-input').forEach(input => {
            total += this.parsearNumero(input.value);
        });
        return total;
    }

    // Guardar sesión en localStorage
    guardarSesion() {
        const nombre = prompt('Nombre de la sesión:');
        if (!nombre) return;

        const sesion = {
            nombre: nombre,
            fecha: new Date().toISOString(),
            costosFijos: this.obtenerDatosCostos('costosFijos'),
            costosVariables: this.obtenerDatosCostos('costosVariables'),
            precioVenta: document.getElementById('precioVenta').value
        };

        let sesiones = JSON.parse(localStorage.getItem('puntoEquilibrio_sesiones') || '[]');
        sesiones.push(sesion);
        localStorage.setItem('puntoEquilibrio_sesiones', JSON.stringify(sesiones));

        this.mostrarExito('Sesión guardada correctamente');
        this.mostrarSesionesGuardadas();
    }

    // Obtener datos de costos
    obtenerDatosCostos(containerId) {
        const datos = [];
        document.querySelectorAll(`#${containerId} .cost-item`).forEach(item => {
            const concepto = item.querySelector('.concept-input').value;
            const importe = item.querySelector('.amount-input').value;
            if (concepto || importe) {
                datos.push({ concepto, importe });
            }
        });
        return datos;
    }

    // Cargar sesión
    cargarSesion(index) {
        const sesiones = JSON.parse(localStorage.getItem('puntoEquilibrio_sesiones') || '[]');
        const sesion = sesiones[index];
        if (!sesion) return;

        // Cargar costos fijos
        this.cargarCostos('costosFijos', sesion.costosFijos);

        // Cargar costos variables
        this.cargarCostos('costosVariables', sesion.costosVariables);

        // Cargar precio de venta
        document.getElementById('precioVenta').value = sesion.precioVenta;

        this.actualizarTotales();
        this.mostrarExito('Sesión cargada correctamente');
    }

    // Cargar costos en contenedor
    cargarCostos(containerId, datos) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        datos.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cost-item';
            div.innerHTML = `
                <input type="text" placeholder="Concepto" class="concept-input" value="${item.concepto || ''}">
                <input type="number" placeholder="Importe €" class="amount-input" step="0.01" min="0" value="${item.importe || ''}">
                <button class="btn-remove" onclick="removeItem(this)">×</button>
            `;
            container.appendChild(div);
        });

        // Agregar listeners para actualizar totales
        container.querySelectorAll('.amount-input').forEach(input => {
            input.addEventListener('input', () => this.actualizarTotales());
        });
    }

    // Mostrar sesiones guardadas
    mostrarSesionesGuardadas() {
        const sesiones = JSON.parse(localStorage.getItem('puntoEquilibrio_sesiones') || '[]');
        if (sesiones.length === 0) return;

        document.getElementById('sesionesGuardadas').style.display = 'block';
        const lista = document.getElementById('listaSesiones');
        lista.innerHTML = '';

        sesiones.forEach((sesion, index) => {
            const fecha = new Date(sesion.fecha).toLocaleDateString('es-ES');
            const div = document.createElement('div');
            div.className = 'sesion-item';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 8px;">
                    <div>
                        <strong>${sesion.nombre}</strong>
                        <span style="color: #666; margin-left: 10px;">${fecha}</span>
                    </div>
                    <div>
                        <button class="btn-secondary" onclick="app.cargarSesion(${index})">Cargar</button>
                        <button class="btn-remove" onclick="app.eliminarSesion(${index})">×</button>
                    </div>
                </div>
            `;
            lista.appendChild(div);
        });
    }

    // Eliminar sesión
    eliminarSesion(index) {
        if (!confirm('¿Eliminar esta sesión?')) return;

        let sesiones = JSON.parse(localStorage.getItem('puntoEquilibrio_sesiones') || '[]');
        sesiones.splice(index, 1);
        localStorage.setItem('puntoEquilibrio_sesiones', JSON.stringify(sesiones));

        this.mostrarSesionesGuardadas();
        this.mostrarExito('Sesión eliminada');
    }

    // Exportar resultados
    exportarResultados() {
        const datos = {
            fecha: new Date().toISOString(),
            costosFijos: this.obtenerTotalCostosFijos(),
            costosVariables: this.obtenerTotalCostosVariables(),
            precioVenta: this.parsearNumero(document.getElementById('precioVenta').value),
            puntoEquilibrioUnidades: document.getElementById('puntoEquilibrioUnidades').textContent,
            puntoEquilibrioEuros: document.getElementById('puntoEquilibrioEuros').textContent,
            margenContribucion: document.getElementById('margenContribucion').textContent,
            margenPorcentaje: document.getElementById('margenPorcentaje').textContent
        };

        const json = JSON.stringify(datos, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `punto-equilibrio-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.mostrarExito('Resultados exportados');
    }

    // Imprimir resultados
    imprimirResultados() {
        window.print();
    }

    // Cargar datos guardados al iniciar
    cargarDatosGuardados() {
        const datosGuardados = localStorage.getItem('puntoEquilibrio_ultimosDatos');
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);

            if (datos.costosFijos) {
                this.cargarCostos('costosFijos', datos.costosFijos);
            }

            if (datos.costosVariables) {
                this.cargarCostos('costosVariables', datos.costosVariables);
            }

            if (datos.precioVenta) {
                document.getElementById('precioVenta').value = datos.precioVenta;
            }
        }
    }

    // Guardar datos automáticamente
    guardarDatosAutomaticamente() {
        const datos = {
            costosFijos: this.obtenerDatosCostos('costosFijos'),
            costosVariables: this.obtenerDatosCostos('costosVariables'),
            precioVenta: document.getElementById('precioVenta').value
        };
        localStorage.setItem('puntoEquilibrio_ultimosDatos', JSON.stringify(datos));
    }

    // Mostrar mensajes
    mostrarError(mensaje) {
        this.mostrarMensaje(mensaje, 'error');
    }

    mostrarExito(mensaje) {
        this.mostrarMensaje(mensaje, 'success');
    }

    mostrarMensaje(mensaje, tipo) {
        // Crear elemento de mensaje
        const div = document.createElement('div');
        div.className = `mensaje ${tipo}`;
        div.textContent = mensaje;
        div.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${tipo === 'error' ? '#E74C3C' : '#27AE60'};
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(div);

        setTimeout(() => {
            div.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => div.remove(), 300);
        }, 3000);
    }
}

// Instancia global de la aplicación
let app;

// Funciones globales para los botones
function addCostoFijo() {
    const container = document.getElementById('costosFijos');
    const div = document.createElement('div');
    div.className = 'cost-item';
    div.innerHTML = `
        <input type="text" placeholder="Concepto (ej: Alquiler)" class="concept-input">
        <input type="number" placeholder="Importe €" class="amount-input" step="0.01" min="0">
        <button class="btn-remove" onclick="removeItem(this)">×</button>
    `;
    container.appendChild(div);

    // Agregar listener para actualizar totales
    div.querySelector('.amount-input').addEventListener('input', () => app.actualizarTotales());
    app.guardarDatosAutomaticamente();
}

function addCostoVariable() {
    const container = document.getElementById('costosVariables');
    const div = document.createElement('div');
    div.className = 'cost-item';
    div.innerHTML = `
        <input type="text" placeholder="Concepto (ej: Materia prima)" class="concept-input">
        <input type="number" placeholder="Coste/unidad €" class="amount-input" step="0.01" min="0">
        <button class="btn-remove" onclick="removeItem(this)">×</button>
    `;
    container.appendChild(div);

    // Agregar listener para actualizar totales
    div.querySelector('.amount-input').addEventListener('input', () => app.actualizarTotales());
    app.guardarDatosAutomaticamente();
}

function removeItem(button) {
    button.parentElement.remove();
    app.actualizarTotales();
    app.guardarDatosAutomaticamente();
}

function calcularPuntoEquilibrio() {
    app.calcular();
}

function guardarSesion() {
    app.guardarSesion();
}

function exportarResultados() {
    app.exportarResultados();
}

function imprimirResultados() {
    app.imprimirResultados();
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app = new PuntoEquilibrioApp();

    // Agregar listeners a inputs existentes
    document.querySelectorAll('.amount-input').forEach(input => {
        input.addEventListener('input', () => {
            app.actualizarTotales();
            app.guardarDatosAutomaticamente();
        });
    });

    document.getElementById('precioVenta').addEventListener('input', () => {
        app.guardarDatosAutomaticamente();
    });

    // Listener para guardar datos cuando se modifica cualquier input de concepto
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('concept-input')) {
            app.guardarDatosAutomaticamente();
        }
    });
});