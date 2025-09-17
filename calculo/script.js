// ========== CONFIGURACIÓN GLOBAL ========== //
const LOCALE_CONFIG = {
    locale: 'es-ES',
    currency: 'EUR',
    timezone: 'Europe/Madrid'
};

// Variables globales
let historialCalculos = JSON.parse(localStorage.getItem('calculo_historial')) || [];
let currentChart = null;

// ========== INICIALIZACIÓN ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculadora de Cálculo meskeIA cargada');

    // Configurar navegación por pestañas
    configurarNavegacion();

    // Configurar eventos de entrada
    configurarEventos();

    // Cargar historial
    cargarHistorial();

    // Mostrar sección activa
    mostrarSeccion('derivadas');
});

// ========== NAVEGACIÓN POR PESTAÑAS ========== //
function configurarNavegacion() {
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const seccion = this.dataset.section;

            // Actualizar pestañas activas
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Mostrar sección correspondiente
            mostrarSeccion(seccion);
        });
    });
}

function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('.calc-section');

    secciones.forEach(s => {
        s.classList.remove('active');
    });

    const seccionActiva = document.getElementById(seccion);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
}

// ========== CONFIGURACIÓN DE EVENTOS ========== //
function configurarEventos() {
    // Eventos para integrales (mostrar/ocultar límites)
    const tipoIntegral = document.querySelectorAll('input[name="integral-tipo"]');
    tipoIntegral.forEach(radio => {
        radio.addEventListener('change', function() {
            const limitesDiv = document.getElementById('limites-integracion');
            if (this.value === 'definida') {
                limitesDiv.style.display = 'block';
            } else {
                limitesDiv.style.display = 'none';
            }
        });
    });

    // Eventos de Enter en inputs para cálculo automático
    const mathInputs = document.querySelectorAll('.math-input');
    mathInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const seccionActiva = document.querySelector('.calc-section.active');
                if (seccionActiva) {
                    const seccionId = seccionActiva.id;
                    switch(seccionId) {
                        case 'derivadas':
                            calcularDerivada();
                            break;
                        case 'integrales':
                            calcularIntegral();
                            break;
                        case 'limites':
                            calcularLimite();
                            break;
                        case 'graficos':
                            dibujarGrafico();
                            break;
                    }
                }
            }
        });
    });
}

// ========== CÁLCULO DE DERIVADAS ========== //
function calcularDerivada() {
    const funcionInput = document.getElementById('derivada-funcion').value.trim();
    const variable = document.getElementById('derivada-variable').value.trim() || 'x';
    const orden = document.getElementById('derivada-orden').value;

    if (!funcionInput) {
        mostrarError('derivada', 'Por favor, introduce una función');
        return;
    }

    try {
        let resultado;
        let pasos = [];

        if (typeof Algebrite !== 'undefined') {
            // Usar Algebrite para cálculo simbólico (necesita formato original con ^)
            const funcionAlgebrite = prepararParaAlgebrite(funcionInput);

            if (orden === 'n') {
                const ordenCustom = prompt('Introduce el orden de derivación:', '1');
                if (!ordenCustom || isNaN(ordenCustom)) return;
                resultado = Algebrite.run(`derivative(${funcionAlgebrite}, ${variable}, ${ordenCustom})`);
            } else {
                let derivadaExpr = funcionAlgebrite;
                for (let i = 0; i < parseInt(orden); i++) {
                    derivadaExpr = Algebrite.run(`derivative(${derivadaExpr}, ${variable})`);
                    pasos.push(`Derivada ${i + 1}: ${derivadaExpr}`);
                }
                resultado = derivadaExpr;
            }
        } else {
            // Fallback usando math.js (convierte ^ a **)
            console.warn('Algebrite no disponible, usando math.js');
            const funcionLimpia = limpiarFuncionMathJs(funcionInput);
            const expr = math.parse(funcionLimpia);
            const derivada = math.derivative(expr, variable);
            resultado = derivada.toString();
        }

        // Mostrar resultado
        mostrarResultado('derivada', {
            titulo: `Derivada de orden ${orden}`,
            funcion: funcionInput,
            variable: variable,
            resultado: resultado,
            pasos: pasos
        });

        // Guardar en historial
        guardarEnHistorial('Derivada', funcionInput, resultado);

    } catch (error) {
        console.error('Error en derivada:', error);
        mostrarError('derivada', 'Error al calcular la derivada. Verifica la sintaxis de la función.');
    }
}

// ========== CÁLCULO DE INTEGRALES ========== //
function calcularIntegral() {
    const funcionInput = document.getElementById('integral-funcion').value.trim();
    const variable = document.getElementById('integral-variable').value.trim() || 'x';
    const tipo = document.querySelector('input[name="integral-tipo"]:checked').value;

    if (!funcionInput) {
        mostrarError('integral', 'Por favor, introduce una función');
        return;
    }

    try {
        let resultado;
        let pasos = [];

        if (tipo === 'indefinida') {
            // Integral indefinida
            if (typeof Algebrite !== 'undefined') {
                const funcionAlgebrite = prepararParaAlgebrite(funcionInput);
                resultado = Algebrite.run(`integral(${funcionAlgebrite}, ${variable})`);
                pasos.push(`∫ ${funcionInput} d${variable} = ${resultado} + C`);
            } else {
                // Fallback: aproximación numérica no es adecuada para indefinidas
                resultado = 'Integral simbólica no disponible sin Algebrite';
            }
        } else {
            // Integral definida
            const limiteInf = document.getElementById('limite-inferior').value.trim();
            const limiteSup = document.getElementById('limite-superior').value.trim();

            if (!limiteInf || !limiteSup) {
                mostrarError('integral', 'Por favor, introduce los límites de integración');
                return;
            }

            if (typeof Algebrite !== 'undefined') {
                const funcionAlgebrite = prepararParaAlgebrite(funcionInput);
                resultado = Algebrite.run(`integral(${funcionAlgebrite}, ${variable}, ${limiteInf}, ${limiteSup})`);
                pasos.push(`∫[${limiteInf} a ${limiteSup}] ${funcionInput} d${variable} = ${resultado}`);
            } else {
                // Usar math.js para integración numérica
                const funcionLimpia = limpiarFuncionMathJs(funcionInput);
                const expr = math.parse(funcionLimpia);
                const compiled = expr.compile();

                // Integración por regla de Simpson
                const a = parseFloat(limiteInf);
                const b = parseFloat(limiteSup);
                const n = 1000; // número de subdivisiones

                resultado = integrarSimpson(compiled, a, b, n, variable);
                pasos.push(`Aproximación numérica (Regla de Simpson): ${resultado}`);
            }
        }

        // Mostrar resultado
        mostrarResultado('integral', {
            titulo: tipo === 'indefinida' ? 'Integral Indefinida' : 'Integral Definida',
            funcion: funcionInput,
            variable: variable,
            resultado: resultado,
            pasos: pasos
        });

        // Guardar en historial
        guardarEnHistorial('Integral', funcionInput, resultado);

    } catch (error) {
        console.error('Error en integral:', error);
        mostrarError('integral', 'Error al calcular la integral. Verifica la sintaxis de la función.');
    }
}

// ========== CÁLCULO DE LÍMITES ========== //
function calcularLimite() {
    const funcionInput = document.getElementById('limite-funcion').value.trim();
    const variable = document.getElementById('limite-variable').value.trim() || 'x';
    const tiende = document.getElementById('limite-tiende').value.trim();
    const direccion = document.querySelector('input[name="limite-direccion"]:checked').value;

    if (!funcionInput || !tiende) {
        mostrarError('limite', 'Por favor, introduce la función y el valor al que tiende');
        return;
    }

    try {
        let resultado;
        let pasos = [];

        if (typeof Algebrite !== 'undefined') {
            // Usar Algebrite para límites simbólicos (formato original con ^)
            const funcionAlgebrite = prepararParaAlgebrite(funcionInput);

            if (tiende.toLowerCase() === 'infinity') {
                resultado = Algebrite.run(`limit(${funcionAlgebrite}, ${variable}, infinity)`);
            } else if (tiende.toLowerCase() === '-infinity') {
                resultado = Algebrite.run(`limit(${funcionAlgebrite}, ${variable}, -infinity)`);
            } else {
                resultado = Algebrite.run(`limit(${funcionAlgebrite}, ${variable}, ${tiende})`);
            }

            pasos.push(`lim[${variable}→${tiende}] ${funcionInput} = ${resultado}`);
        } else {
            // Fallback: evaluación numérica aproximada
            console.warn('Algebrite no disponible, usando evaluación numérica');
            const funcionLimpia = limpiarFuncionMathJs(funcionInput);
            const expr = math.parse(funcionLimpia);
            const compiled = expr.compile();

            if (tiende.toLowerCase().includes('infinity')) {
                resultado = 'Límite infinito - requiere Algebrite para cálculo simbólico';
            } else {
                const punto = parseFloat(tiende);
                const epsilon = 0.0001;

                if (direccion === 'izquierda') {
                    const valor = compiled.evaluate({[variable]: punto - epsilon});
                    resultado = valor.toString();
                } else if (direccion === 'derecha') {
                    const valor = compiled.evaluate({[variable]: punto + epsilon});
                    resultado = valor.toString();
                } else {
                    // Bilateral
                    const valorIzq = compiled.evaluate({[variable]: punto - epsilon});
                    const valorDer = compiled.evaluate({[variable]: punto + epsilon});

                    if (Math.abs(valorIzq - valorDer) < 0.001) {
                        resultado = valorIzq.toString();
                    } else {
                        resultado = 'El límite no existe (límites laterales diferentes)';
                    }
                }
            }

            pasos.push(`Evaluación numérica aproximada: ${resultado}`);
        }

        // Mostrar resultado
        mostrarResultado('limite', {
            titulo: `Límite ${direccion}`,
            funcion: funcionInput,
            variable: variable,
            tiende: tiende,
            resultado: resultado,
            pasos: pasos
        });

        // Guardar en historial
        guardarEnHistorial('Límite', `${funcionInput} cuando ${variable}→${tiende}`, resultado);

    } catch (error) {
        console.error('Error en límite:', error);
        mostrarError('limite', 'Error al calcular el límite. Verifica la sintaxis de la función.');
    }
}

// ========== GRAFICADOR DE FUNCIONES ========== //
function dibujarGrafico() {
    const funcionInput = document.getElementById('grafico-funcion').value.trim();
    const xMin = parseFloat(document.getElementById('grafico-xmin').value) || -10;
    const xMax = parseFloat(document.getElementById('grafico-xmax').value) || 10;
    const yMin = parseFloat(document.getElementById('grafico-ymin').value) || -10;
    const yMax = parseFloat(document.getElementById('grafico-ymax').value) || 10;

    if (!funcionInput) {
        mostrarError('grafico', 'Por favor, introduce una función para graficar');
        return;
    }

    try {
        const funcionLimpia = limpiarFuncionMathJs(funcionInput);
        const expr = math.parse(funcionLimpia);
        const compiled = expr.compile();

        // Generar puntos para la gráfica
        const puntos = [];
        const step = (xMax - xMin) / 1000;

        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = compiled.evaluate({x: x});
                if (typeof y === 'number' && isFinite(y)) {
                    puntos.push({x: x, y: y});
                }
            } catch (e) {
                // Ignorar puntos problemáticos
            }
        }

        // Crear gráfico con Chart.js
        crearGrafico(puntos, funcionInput, xMin, xMax, yMin, yMax);

        // Guardar en historial
        guardarEnHistorial('Gráfico', funcionInput, 'Gráfico generado');

    } catch (error) {
        console.error('Error en gráfico:', error);
        mostrarError('grafico', 'Error al generar el gráfico. Verifica la sintaxis de la función.');
    }
}

function crearGrafico(puntos, funcion, xMin, xMax, yMin, yMax) {
    const canvas = document.getElementById('grafico-canvas');
    const ctx = canvas.getContext('2d');

    // Destruir gráfico anterior si existe
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `f(x) = ${funcion}`,
                data: puntos,
                borderColor: '#2E86AB',
                backgroundColor: 'rgba(46, 134, 171, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Gráfico de f(x) = ${funcion}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: xMin,
                    max: xMax,
                    title: {
                        display: true,
                        text: 'x'
                    },
                    grid: {
                        color: '#E5E5E5'
                    }
                },
                y: {
                    min: yMin,
                    max: yMax,
                    title: {
                        display: true,
                        text: 'f(x)'
                    },
                    grid: {
                        color: '#E5E5E5'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ========== FUNCIONES AUXILIARES ========== //
function prepararParaAlgebrite(funcion) {
    // Algebrite usa formato matemático estándar con ^
    let limpia = funcion
        .replace(/(\d)([a-zA-Z])/g, '$1*$2')  // 2x -> 2*x
        .replace(/ln/g, 'log')               // ln -> log
        .replace(/sqrt/g, 'sqrt')
        .replace(/abs/g, 'abs')
        .replace(/pi/g, 'pi')
        .replace(/e(?![a-zA-Z])/g, 'exp(1)');

    // IMPORTANTE: NO tocar sin, cos, tan - Algebrite los entiende nativamente
    // NO aplicar regex de multiplicación implícita a funciones trigonométricas

    // Solo aplicar multiplicación implícita fuera de funciones
    // Evitar cambiar sin(x) por sin*(x)
    limpia = limpia.replace(/(\d)([a-zA-Z])(?!\()/g, '$1*$2');  // 2x -> 2*x (pero no 2sin(x))

    return limpia.trim();
}

function limpiarFuncionMathJs(funcion) {
    // Math.js usa ^ para potencias (NO **), similar al formato matemático
    let limpia = funcion
        // NO convertir ^ a **, math.js usa ^ nativamente
        .replace(/(\d)([a-zA-Z])/g, '$1*$2')  // 2x -> 2*x
        .replace(/(\))([a-zA-Z])/g, '$1*$2')  // )x -> )*x
        .replace(/([a-zA-Z])\(/g, '$1*(')     // x( -> x*(
        .replace(/\s+/g, ' ')           // Normalizar espacios
        .replace(/sin/g, 'sin')
        .replace(/cos/g, 'cos')
        .replace(/tan/g, 'tan')
        .replace(/ln/g, 'log')
        .replace(/sqrt/g, 'sqrt')
        .replace(/abs/g, 'abs')
        .replace(/pi/g, 'pi')
        .replace(/e(?![a-zA-Z])/g, 'e');

    return limpia.trim();
}

function integrarSimpson(func, a, b, n, variable) {
    // Regla de Simpson para integración numérica
    const h = (b - a) / n;
    let sum = func.evaluate({[variable]: a}) + func.evaluate({[variable]: b});

    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        const y = func.evaluate({[variable]: x});
        sum += (i % 2 === 0) ? 2 * y : 4 * y;
    }

    return (h / 3) * sum;
}

function mostrarResultado(tipo, datos) {
    const container = document.getElementById(`resultado-${tipo}`);

    let html = `
        <div class="result-title">${datos.titulo}</div>
        <div class="result-math">
            <strong>Función:</strong> ${datos.funcion}<br>
            <strong>Resultado:</strong> ${datos.resultado}
        </div>
    `;

    if (datos.pasos && datos.pasos.length > 0) {
        html += '<div class="result-steps"><strong>Pasos:</strong>';
        datos.pasos.forEach(paso => {
            html += `<div class="result-step">${paso}</div>`;
        });
        html += '</div>';
    }

    container.innerHTML = html;
    container.classList.add('show');
}

function mostrarError(tipo, mensaje) {
    const container = document.getElementById(`resultado-${tipo}`);
    container.innerHTML = `<div class="error-message">${mensaje}</div>`;
    container.classList.add('show');
}

// ========== HISTORIAL ========== //
function guardarEnHistorial(tipo, funcion, resultado) {
    const item = {
        tipo: tipo,
        funcion: funcion,
        resultado: resultado,
        fecha: new Date().toLocaleString('es-ES', LOCALE_CONFIG)
    };

    historialCalculos.unshift(item);

    // Mantener solo los últimos 10 cálculos
    if (historialCalculos.length > 10) {
        historialCalculos = historialCalculos.slice(0, 10);
    }

    localStorage.setItem('calculo_historial', JSON.stringify(historialCalculos));
    cargarHistorial();
}

function cargarHistorial() {
    const lista = document.getElementById('historial-lista');

    if (historialCalculos.length === 0) {
        lista.innerHTML = '<p class="historial-vacio">No hay cálculos recientes</p>';
        return;
    }

    let html = '';
    historialCalculos.forEach(item => {
        html += `
            <div class="historial-item">
                <div class="historial-funcion">${item.tipo}: ${item.funcion}</div>
                <div class="historial-resultado">${item.resultado}</div>
                <div class="historial-fecha">${item.fecha}</div>
            </div>
        `;
    });

    lista.innerHTML = html;
}

function limpiarHistorial() {
    if (confirm('¿Estás seguro de que quieres limpiar el historial?')) {
        historialCalculos = [];
        localStorage.removeItem('calculo_historial');
        cargarHistorial();
    }
}

// ========== FORMATEO ESPAÑOL ========== //
function formatearNumero(numero) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
    }).format(numero);
}

// ========== INICIALIZACIÓN AL CARGAR LIBRERÍAS ========== //
window.addEventListener('load', function() {
    // Verificar disponibilidad de librerías
    if (typeof math === 'undefined') {
        console.warn('Math.js no está disponible');
    }

    if (typeof Algebrite === 'undefined') {
        console.warn('Algebrite no está disponible - funcionalidad simbólica limitada');
    }

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js no está disponible - gráficos deshabilitados');
    }

    console.log('Todas las librerías verificadas');
});