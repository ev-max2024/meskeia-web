// ========== CONFIGURACIÓN GLOBAL ========== //
const CONFIG = {
    locale: 'es-ES',
    currency: 'EUR',
    decimalPlaces: 4,
    maxHistoryItems: 50
};

// Variables globales
let history = JSON.parse(localStorage.getItem('probabilidad_history')) || [];
let chartInstances = {};
let simulationRunning = false;
let simulationData = [];

// ========== INICIALIZACIÓN ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculadora de Probabilidad meskeIA cargada');

    // Configurar navegación por tabs
    setupTabs();

    // Cargar historial
    loadHistory();

    // Configurar eventos
    setupEventListeners();

    // Inicializar visualizaciones
    initializeVisualizations();
});

// ========== NAVEGACIÓN POR TABS ========== //
function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover active de todos
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Activar tab seleccionado
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');

            // Si es distribuciones, actualizar gráfico
            if (targetTab === 'distribuciones') {
                setTimeout(() => actualizarGraficoDistribucion(), 100);
            }
        });
    });
}

// ========== CONFIGURACIÓN DE EVENTOS ========== //
function setupEventListeners() {
    // Enter en inputs para calcular
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const button = this.closest('.calc-section')?.querySelector('.btn-primary');
                if (button) button.click();
            }
        });
    });
}

// ========== MÓDULO: PROBABILIDAD CLÁSICA ========== //
function calcularProbabilidadSimple() {
    const favorables = parseInt(document.getElementById('casos-favorables').value);
    const totales = parseInt(document.getElementById('casos-totales').value);

    if (isNaN(favorables) || isNaN(totales) || totales <= 0) {
        mostrarError('resultado-simple', 'Introduce valores válidos');
        return;
    }

    if (favorables > totales) {
        mostrarError('resultado-simple', 'Los casos favorables no pueden ser mayores que los totales');
        return;
    }

    const probabilidad = favorables / totales;
    const porcentaje = (probabilidad * 100).toFixed(2);

    const resultado = `
        <div class="formula-result">
            <div>P(A) = ${favorables}/${totales} = ${formatNumber(probabilidad)}</div>
            <div class="result">${porcentaje}%</div>
            <small>1 en ${formatNumber(1/probabilidad)} posibilidades</small>
        </div>
    `;

    document.getElementById('resultado-simple').innerHTML = resultado;

    // Guardar en historial
    addToHistory('Probabilidad Simple', `${favorables}/${totales} = ${formatNumber(probabilidad)} (${porcentaje}%)`);

    // Actualizar diagrama de Venn si está visible
    actualizarDiagramaVenn();
}

function calcularUnion() {
    const pA = parseFloat(document.getElementById('prob-a').value);
    const pB = parseFloat(document.getElementById('prob-b').value);
    const pInterseccion = parseFloat(document.getElementById('prob-interseccion').value);

    if (!validarProbabilidades(pA, pB, pInterseccion)) {
        mostrarError('resultado-compuesta', 'Valores inválidos. Las probabilidades deben estar entre 0 y 1');
        return;
    }

    const union = pA + pB - pInterseccion;

    if (union > 1) {
        mostrarError('resultado-compuesta', 'Error: P(A∪B) no puede ser mayor que 1');
        return;
    }

    const resultado = `
        <div class="formula-result">
            <div>P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</div>
            <div>${formatNumber(pA)} + ${formatNumber(pB)} - ${formatNumber(pInterseccion)}</div>
            <div class="result">${formatNumber(union)} = ${(union * 100).toFixed(2)}%</div>
        </div>
    `;

    document.getElementById('resultado-compuesta').innerHTML = resultado;
    addToHistory('P(A ∪ B)', `${formatNumber(union)}`);
    actualizarDiagramaVenn(pA, pB, pInterseccion);
}

function calcularComplemento() {
    const pA = parseFloat(document.getElementById('prob-a').value);

    if (!validarProbabilidad(pA)) {
        mostrarError('resultado-compuesta', 'P(A) debe estar entre 0 y 1');
        return;
    }

    const complemento = 1 - pA;

    const resultado = `
        <div class="formula-result">
            <div>P(A') = 1 - P(A)</div>
            <div>1 - ${formatNumber(pA)}</div>
            <div class="result">${formatNumber(complemento)} = ${(complemento * 100).toFixed(2)}%</div>
        </div>
    `;

    document.getElementById('resultado-compuesta').innerHTML = resultado;
    addToHistory("P(A')", `${formatNumber(complemento)}`);
}

function calcularDiferencia() {
    const pA = parseFloat(document.getElementById('prob-a').value);
    const pInterseccion = parseFloat(document.getElementById('prob-interseccion').value);

    if (!validarProbabilidades(pA, 0, pInterseccion)) {
        mostrarError('resultado-compuesta', 'Valores inválidos');
        return;
    }

    if (pInterseccion > pA) {
        mostrarError('resultado-compuesta', 'P(A ∩ B) no puede ser mayor que P(A)');
        return;
    }

    const diferencia = pA - pInterseccion;

    const resultado = `
        <div class="formula-result">
            <div>P(A - B) = P(A) - P(A ∩ B)</div>
            <div>${formatNumber(pA)} - ${formatNumber(pInterseccion)}</div>
            <div class="result">${formatNumber(diferencia)} = ${(diferencia * 100).toFixed(2)}%</div>
        </div>
    `;

    document.getElementById('resultado-compuesta').innerHTML = resultado;
    addToHistory('P(A - B)', `${formatNumber(diferencia)}`);
}

// ========== MÓDULO: PROBABILIDAD CONDICIONAL Y BAYES ========== //
function calcularCondicional() {
    const pInterseccion = parseFloat(document.getElementById('cond-interseccion').value);
    const pB = parseFloat(document.getElementById('cond-b').value);

    if (!validarProbabilidades(pInterseccion, pB)) {
        mostrarError('resultado-condicional', 'Valores inválidos');
        return;
    }

    if (pB === 0) {
        mostrarError('resultado-condicional', 'P(B) no puede ser 0');
        return;
    }

    if (pInterseccion > pB) {
        mostrarError('resultado-condicional', 'P(A ∩ B) no puede ser mayor que P(B)');
        return;
    }

    const condicional = pInterseccion / pB;

    const resultado = `
        <div class="formula-result">
            <div>P(A|B) = P(A ∩ B) / P(B)</div>
            <div>${formatNumber(pInterseccion)} / ${formatNumber(pB)}</div>
            <div class="result">${formatNumber(condicional)} = ${(condicional * 100).toFixed(2)}%</div>
        </div>
    `;

    document.getElementById('resultado-condicional').innerHTML = resultado;
    addToHistory('P(A|B)', `${formatNumber(condicional)}`);
}

function calcularBayes() {
    const pA = parseFloat(document.getElementById('bayes-prior').value);
    const pBA = parseFloat(document.getElementById('bayes-likelihood').value);
    const pBnotA = parseFloat(document.getElementById('bayes-likelihood-neg').value);

    if (!validarProbabilidades(pA, pBA, pBnotA)) {
        mostrarError('resultado-bayes', 'Valores inválidos');
        return;
    }

    // Teorema de Bayes: P(A|B) = P(B|A) * P(A) / P(B)
    // P(B) = P(B|A) * P(A) + P(B|A') * P(A')
    const pNotA = 1 - pA;
    const pB = (pBA * pA) + (pBnotA * pNotA);
    const posterior = (pBA * pA) / pB;

    const resultado = `
        <div class="formula-result">
            <h4>Teorema de Bayes</h4>
            <div>P(A) = ${formatNumber(pA)} (Prior)</div>
            <div>P(B|A) = ${formatNumber(pBA)}</div>
            <div>P(B|A') = ${formatNumber(pBnotA)}</div>
            <hr style="margin: 10px 0;">
            <div>P(B) = P(B|A)×P(A) + P(B|A')×P(A')</div>
            <div>P(B) = ${formatNumber(pBA)}×${formatNumber(pA)} + ${formatNumber(pBnotA)}×${formatNumber(pNotA)}</div>
            <div>P(B) = ${formatNumber(pB)}</div>
            <hr style="margin: 10px 0;">
            <div>P(A|B) = P(B|A) × P(A) / P(B)</div>
            <div class="result">P(A|B) = ${formatNumber(posterior)} = ${(posterior * 100).toFixed(2)}%</div>
            <small>Factor de actualización: ${formatNumber(posterior/pA)}x</small>
        </div>
    `;

    document.getElementById('resultado-bayes').innerHTML = resultado;
    addToHistory('Teorema de Bayes', `P(A|B) = ${formatNumber(posterior)}`);

    // Visualizar árbol de Bayes
    visualizarArbolBayes(pA, pBA, pBnotA, posterior);
}

// ========== MÓDULO: DISTRIBUCIONES ========== //
function cambiarDistribucion() {
    const tipo = document.getElementById('tipo-distribucion').value;

    // Ocultar todos los parámetros
    document.querySelectorAll('.distribution-params').forEach(el => {
        el.style.display = 'none';
    });

    // Mostrar parámetros seleccionados
    document.getElementById(`params-${tipo}`).style.display = 'block';

    // Limpiar resultado
    document.getElementById('resultado-distribucion').innerHTML = '<span class="placeholder">Introduce los parámetros y calcula</span>';

    // Actualizar gráfico
    actualizarGraficoDistribucion();
}

function calcularBinomial(tipo) {
    const n = parseInt(document.getElementById('binomial-n').value);
    const p = parseFloat(document.getElementById('binomial-p').value);
    const k = parseInt(document.getElementById('binomial-k').value);

    if (isNaN(n) || isNaN(p) || isNaN(k) || n < 1 || p < 0 || p > 1 || k < 0 || k > n) {
        mostrarError('resultado-distribucion', 'Parámetros inválidos');
        return;
    }

    let probabilidad;
    let explicacion;

    if (tipo === 'exacta') {
        probabilidad = binomialPMF(k, n, p);
        explicacion = `P(X = ${k})`;
    } else if (tipo === 'menor') {
        probabilidad = binomialCDF(k, n, p);
        explicacion = `P(X ≤ ${k})`;
    } else {
        probabilidad = 1 - binomialCDF(k, n, p);
        explicacion = `P(X > ${k})`;
    }

    // Estadísticas
    const media = n * p;
    const varianza = n * p * (1 - p);
    const desviacion = Math.sqrt(varianza);

    const resultado = `
        <div class="formula-result">
            <h4>Distribución Binomial</h4>
            <div>n = ${n}, p = ${formatNumber(p)}, k = ${k}</div>
            <div class="result">${explicacion} = ${formatNumber(probabilidad)} = ${(probabilidad * 100).toFixed(2)}%</div>
        </div>
    `;

    document.getElementById('resultado-distribucion').innerHTML = resultado;

    // Mostrar estadísticas
    mostrarEstadisticasDistribucion({
        'Media (μ)': formatNumber(media),
        'Varianza (σ²)': formatNumber(varianza),
        'Desv. Estándar (σ)': formatNumber(desviacion),
        'Moda': Math.floor((n + 1) * p)
    });

    // Actualizar gráfico
    graficarBinomial(n, p, k, tipo);

    addToHistory(`Binomial ${explicacion}`, formatNumber(probabilidad));
}

function calcularPoisson(tipo) {
    const lambda = parseFloat(document.getElementById('poisson-lambda').value);
    const k = parseInt(document.getElementById('poisson-k').value);

    if (isNaN(lambda) || isNaN(k) || lambda <= 0 || k < 0) {
        mostrarError('resultado-distribucion', 'Parámetros inválidos');
        return;
    }

    let probabilidad;
    let explicacion;

    if (tipo === 'exacta') {
        probabilidad = poissonPMF(k, lambda);
        explicacion = `P(X = ${k})`;
    } else if (tipo === 'menor') {
        probabilidad = poissonCDF(k, lambda);
        explicacion = `P(X ≤ ${k})`;
    } else {
        probabilidad = 1 - poissonCDF(k, lambda);
        explicacion = `P(X > ${k})`;
    }

    const resultado = `
        <div class="formula-result">
            <h4>Distribución Poisson</h4>
            <div>λ = ${formatNumber(lambda)}, k = ${k}</div>
            <div class="result">${explicacion} = ${formatNumber(probabilidad)} = ${(probabilidad * 100).toFixed(2)}%</div>
        </div>
    `;

    document.getElementById('resultado-distribucion').innerHTML = resultado;

    // Mostrar estadísticas
    mostrarEstadisticasDistribucion({
        'Media (μ)': formatNumber(lambda),
        'Varianza (σ²)': formatNumber(lambda),
        'Desv. Estándar (σ)': formatNumber(Math.sqrt(lambda)),
        'Moda': Math.floor(lambda)
    });

    // Actualizar gráfico
    graficarPoisson(lambda, k, tipo);

    addToHistory(`Poisson ${explicacion}`, formatNumber(probabilidad));
}

function calcularNormal(tipo) {
    const mu = parseFloat(document.getElementById('normal-mu').value);
    const sigma = parseFloat(document.getElementById('normal-sigma').value);
    const x = parseFloat(document.getElementById('normal-x').value);

    if (isNaN(mu) || isNaN(sigma) || isNaN(x) || sigma <= 0) {
        mostrarError('resultado-distribucion', 'Parámetros inválidos');
        return;
    }

    let resultado;
    const z = (x - mu) / sigma;

    if (tipo === 'menor') {
        const probabilidad = normalCDF(x, mu, sigma);
        resultado = `
            <div class="formula-result">
                <h4>Distribución Normal</h4>
                <div>μ = ${formatNumber(mu)}, σ = ${formatNumber(sigma)}</div>
                <div>Z = (${formatNumber(x)} - ${formatNumber(mu)}) / ${formatNumber(sigma)} = ${formatNumber(z)}</div>
                <div class="result">P(X ≤ ${formatNumber(x)}) = ${formatNumber(probabilidad)} = ${(probabilidad * 100).toFixed(2)}%</div>
            </div>
        `;
    } else if (tipo === 'mayor') {
        const probabilidad = 1 - normalCDF(x, mu, sigma);
        resultado = `
            <div class="formula-result">
                <h4>Distribución Normal</h4>
                <div>μ = ${formatNumber(mu)}, σ = ${formatNumber(sigma)}</div>
                <div>Z = (${formatNumber(x)} - ${formatNumber(mu)}) / ${formatNumber(sigma)} = ${formatNumber(z)}</div>
                <div class="result">P(X > ${formatNumber(x)}) = ${formatNumber(probabilidad)} = ${(probabilidad * 100).toFixed(2)}%</div>
            </div>
        `;
    } else {
        resultado = `
            <div class="formula-result">
                <h4>Valor Z (Estandarización)</h4>
                <div>Z = (X - μ) / σ</div>
                <div>Z = (${formatNumber(x)} - ${formatNumber(mu)}) / ${formatNumber(sigma)}</div>
                <div class="result">Z = ${formatNumber(z)}</div>
                <small>Percentil: ${(normalCDF(x, mu, sigma) * 100).toFixed(2)}%</small>
            </div>
        `;
    }

    document.getElementById('resultado-distribucion').innerHTML = resultado;

    // Mostrar estadísticas
    mostrarEstadisticasDistribucion({
        'Media (μ)': formatNumber(mu),
        'Varianza (σ²)': formatNumber(sigma * sigma),
        'Desv. Estándar (σ)': formatNumber(sigma),
        'Mediana': formatNumber(mu),
        'Moda': formatNumber(mu)
    });

    // Actualizar gráfico
    graficarNormal(mu, sigma, x, tipo);

    addToHistory(`Normal ${tipo}`, formatNumber(z));
}

// ========== MÓDULO: SIMULADOR MONTE CARLO ========== //
function cambiarSimulacion() {
    const tipo = document.getElementById('tipo-simulacion').value;

    // Ocultar todas las simulaciones
    document.querySelectorAll('.simulation-params').forEach(el => {
        el.style.display = 'none';
    });

    // Mostrar simulación seleccionada
    const simDiv = document.getElementById(`sim-${tipo}`);
    if (simDiv) simDiv.style.display = 'block';

    // Reiniciar
    reiniciarSimulacion();
}

async function ejecutarSimulacion() {
    if (simulationRunning) return;

    const tipo = document.getElementById('tipo-simulacion').value;
    simulationRunning = true;
    simulationData = [];

    // Deshabilitar botones
    document.querySelector('[onclick="ejecutarSimulacion()"]').disabled = true;
    document.querySelector('[onclick="pausarSimulacion()"]').disabled = false;

    let resultado;

    switch(tipo) {
        case 'monedas':
            resultado = await simularMonedas();
            break;
        case 'dados':
            resultado = await simularDados();
            break;
        default:
            resultado = { probabilidad: 0, teorica: 0 };
    }

    mostrarResultadoSimulacion(resultado);

    simulationRunning = false;
    document.querySelector('[onclick="ejecutarSimulacion()"]').disabled = false;
    document.querySelector('[onclick="pausarSimulacion()"]').disabled = true;
}

async function simularMonedas() {
    const cantidad = parseInt(document.getElementById('monedas-cantidad').value);
    const numSims = parseInt(document.getElementById('monedas-sims').value);
    const objetivo = parseInt(document.getElementById('monedas-objetivo').value);

    if (isNaN(cantidad) || isNaN(numSims) || isNaN(objetivo)) {
        return { probabilidad: 0, teorica: 0 };
    }

    let exitos = 0;
    const datos = [];

    for (let i = 0; i < numSims; i++) {
        if (!simulationRunning) break;

        // Simular lanzamiento
        let caras = 0;
        for (let j = 0; j < cantidad; j++) {
            if (Math.random() < 0.5) caras++;
        }

        if (caras === objetivo) exitos++;

        // Actualizar cada 100 iteraciones
        if (i % 100 === 0) {
            const probabilidad = exitos / (i + 1);
            datos.push(probabilidad);
            actualizarProgreso(i, numSims);
            actualizarGraficoConvergencia(datos);
            await sleep(10);
        }
    }

    const probabilidadFinal = exitos / numSims;
    const probabilidadTeorica = binomialPMF(objetivo, cantidad, 0.5);

    return {
        probabilidad: probabilidadFinal,
        teorica: probabilidadTeorica,
        experimento: `${objetivo} caras en ${cantidad} monedas`,
        simulaciones: numSims
    };
}

async function simularDados() {
    const cantidad = parseInt(document.getElementById('dados-cantidad').value);
    const numSims = parseInt(document.getElementById('dados-sims').value);
    const objetivo = parseInt(document.getElementById('dados-objetivo').value);

    if (isNaN(cantidad) || isNaN(numSims) || isNaN(objetivo)) {
        return { probabilidad: 0, teorica: 0 };
    }

    let exitos = 0;
    const datos = [];

    for (let i = 0; i < numSims; i++) {
        if (!simulationRunning) break;

        // Simular lanzamiento
        let suma = 0;
        for (let j = 0; j < cantidad; j++) {
            suma += Math.floor(Math.random() * 6) + 1;
        }

        if (suma === objetivo) exitos++;

        // Actualizar cada 100 iteraciones
        if (i % 100 === 0) {
            const probabilidad = exitos / (i + 1);
            datos.push(probabilidad);
            actualizarProgreso(i, numSims);
            actualizarGraficoConvergencia(datos);
            await sleep(10);
        }
    }

    const probabilidadFinal = exitos / numSims;

    return {
        probabilidad: probabilidadFinal,
        teorica: calcularProbabilidadDados(cantidad, objetivo),
        experimento: `Suma ${objetivo} con ${cantidad} dados`,
        simulaciones: numSims
    };
}

function pausarSimulacion() {
    simulationRunning = false;
}

function reiniciarSimulacion() {
    simulationRunning = false;
    simulationData = [];
    actualizarProgreso(0, 100);
    document.getElementById('resultado-simulacion').innerHTML = '<span class="placeholder">Configura y ejecuta la simulación</span>';

    // Limpiar gráfico
    if (chartInstances['montecarlo']) {
        chartInstances['montecarlo'].destroy();
        delete chartInstances['montecarlo'];
    }
}

function mostrarResultadoSimulacion(resultado) {
    const diferencia = Math.abs(resultado.probabilidad - resultado.teorica);
    const error = (diferencia / resultado.teorica * 100).toFixed(2);

    const html = `
        <div class="formula-result">
            <h4>Resultados de la Simulación</h4>
            <div>Experimento: ${resultado.experimento}</div>
            <div>Simulaciones realizadas: ${formatNumber(resultado.simulaciones)}</div>
            <hr style="margin: 10px 0;">
            <div>Probabilidad simulada: ${formatNumber(resultado.probabilidad)} (${(resultado.probabilidad * 100).toFixed(3)}%)</div>
            <div>Probabilidad teórica: ${formatNumber(resultado.teorica)} (${(resultado.teorica * 100).toFixed(3)}%)</div>
            <div class="result">Error relativo: ${error}%</div>
        </div>
    `;

    document.getElementById('resultado-simulacion').innerHTML = html;
    addToHistory('Simulación Monte Carlo', `P = ${formatNumber(resultado.probabilidad)}`);
}

// ========== MÓDULO: COMBINATORIA ========== //
function calcularPermutacion() {
    const n = parseInt(document.getElementById('comb-n').value);
    const r = parseInt(document.getElementById('comb-r').value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        mostrarError('resultado-combinatoria', 'Parámetros inválidos');
        return;
    }

    const resultado = factorial(n) / factorial(n - r);

    const html = `
        <div class="formula-result">
            <h4>Permutaciones nPr</h4>
            <div>P(${n}, ${r}) = ${n}! / (${n} - ${r})!</div>
            <div>P(${n}, ${r}) = ${n}! / ${n - r}!</div>
            <div class="result">${formatNumber(resultado)}</div>
            <small>Formas de ordenar ${r} elementos de ${n} totales</small>
        </div>
    `;

    document.getElementById('resultado-combinatoria').innerHTML = html;
    addToHistory(`nPr(${n},${r})`, formatNumber(resultado));
}

function calcularCombinacion() {
    const n = parseInt(document.getElementById('comb-n').value);
    const r = parseInt(document.getElementById('comb-r').value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        mostrarError('resultado-combinatoria', 'Parámetros inválidos');
        return;
    }

    const resultado = combination(n, r);

    const html = `
        <div class="formula-result">
            <h4>Combinaciones nCr</h4>
            <div>C(${n}, ${r}) = ${n}! / (${r}! × (${n} - ${r})!)</div>
            <div>C(${n}, ${r}) = ${n}! / (${r}! × ${n - r}!)</div>
            <div class="result">${formatNumber(resultado)}</div>
            <small>Formas de elegir ${r} elementos de ${n} totales</small>
        </div>
    `;

    document.getElementById('resultado-combinatoria').innerHTML = html;
    addToHistory(`nCr(${n},${r})`, formatNumber(resultado));
}

function calcularPermutacionRep() {
    const n = parseInt(document.getElementById('comb-n').value);
    const r = parseInt(document.getElementById('comb-r').value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        mostrarError('resultado-combinatoria', 'Parámetros inválidos');
        return;
    }

    const resultado = Math.pow(n, r);

    const html = `
        <div class="formula-result">
            <h4>Permutaciones con Repetición</h4>
            <div>PR(${n}, ${r}) = ${n}^${r}</div>
            <div class="result">${formatNumber(resultado)}</div>
            <small>Formas de elegir ${r} elementos de ${n} con repetición</small>
        </div>
    `;

    document.getElementById('resultado-combinatoria').innerHTML = html;
    addToHistory(`PR(${n},${r})`, formatNumber(resultado));
}

function calcularCombinacionRep() {
    const n = parseInt(document.getElementById('comb-n').value);
    const r = parseInt(document.getElementById('comb-r').value);

    if (isNaN(n) || isNaN(r) || n < 1 || r < 0) {
        mostrarError('resultado-combinatoria', 'Parámetros inválidos');
        return;
    }

    const resultado = combination(n + r - 1, r);

    const html = `
        <div class="formula-result">
            <h4>Combinaciones con Repetición</h4>
            <div>CR(${n}, ${r}) = C(${n + r - 1}, ${r})</div>
            <div class="result">${formatNumber(resultado)}</div>
            <small>Formas de elegir ${r} elementos de ${n} con repetición</small>
        </div>
    `;

    document.getElementById('resultado-combinatoria').innerHTML = html;
    addToHistory(`CR(${n},${r})`, formatNumber(resultado));
}

function resolverProblemaCartas() {
    const ases = parseInt(document.getElementById('cartas-ases').value);
    const mano = parseInt(document.getElementById('cartas-mano').value);

    if (isNaN(ases) || isNaN(mano) || ases < 0 || ases > 4 || mano < 1 || mano > 52 || ases > mano) {
        mostrarError('resultado-aplicaciones', 'Parámetros inválidos');
        return;
    }

    // Probabilidad = C(4,ases) * C(48,mano-ases) / C(52,mano)
    const numerador = combination(4, ases) * combination(48, mano - ases);
    const denominador = combination(52, mano);
    const probabilidad = numerador / denominador;

    const html = `
        <div class="formula-result">
            <h4>Problema de Cartas</h4>
            <div>Obtener exactamente ${ases} as(es) en ${mano} cartas</div>
            <div>P = C(4,${ases}) × C(48,${mano - ases}) / C(52,${mano})</div>
            <div>P = ${combination(4, ases)} × ${combination(48, mano - ases)} / ${combination(52, mano)}</div>
            <div class="result">${formatNumber(probabilidad)} = ${(probabilidad * 100).toFixed(4)}%</div>
            <small>1 en ${Math.round(1/probabilidad)} manos</small>
        </div>
    `;

    document.getElementById('resultado-aplicaciones').innerHTML = html;
    addToHistory('Problema de Cartas', `P = ${formatNumber(probabilidad)}`);
}

function resolverProblemaLoteria() {
    const elegir = parseInt(document.getElementById('loteria-elegir').value);
    const total = parseInt(document.getElementById('loteria-total').value);

    if (isNaN(elegir) || isNaN(total) || elegir < 1 || total < 1 || elegir > total) {
        mostrarError('resultado-aplicaciones', 'Parámetros inválidos');
        return;
    }

    const combinaciones = combination(total, elegir);
    const probabilidad = 1 / combinaciones;

    const html = `
        <div class="formula-result">
            <h4>Probabilidad de Ganar la Lotería</h4>
            <div>Elegir ${elegir} números de ${total} posibles</div>
            <div>Combinaciones posibles: C(${total},${elegir}) = ${formatNumber(combinaciones)}</div>
            <div>Probabilidad de ganar = 1 / ${formatNumber(combinaciones)}</div>
            <div class="result">${formatNumber(probabilidad)}</div>
            <small>${(probabilidad * 100).toFixed(8)}%</small>
            <div style="margin-top: 10px; color: var(--warning);">
                ⚠️ 1 en ${formatNumber(combinaciones)} posibilidades
            </div>
        </div>
    `;

    document.getElementById('resultado-aplicaciones').innerHTML = html;
    addToHistory('Lotería', `1 en ${formatNumber(combinaciones)}`);
}

// ========== FUNCIONES MATEMÁTICAS ========== //
function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function combination(n, r) {
    if (r > n) return 0;
    if (r === 0 || r === n) return 1;
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function binomialPMF(k, n, p) {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function binomialCDF(k, n, p) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += binomialPMF(i, n, p);
    }
    return sum;
}

function poissonPMF(k, lambda) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function poissonCDF(k, lambda) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += poissonPMF(i, lambda);
    }
    return sum;
}

function normalPDF(x, mu, sigma) {
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return coefficient * Math.exp(exponent);
}

function normalCDF(x, mu, sigma) {
    // Aproximación usando error function
    const z = (x - mu) / (sigma * Math.sqrt(2));
    return 0.5 * (1 + erf(z));
}

function erf(x) {
    // Aproximación de la función error
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

function calcularProbabilidadDados(numDados, suma) {
    // Calcular probabilidad teórica para suma de dados
    // Simplificación: usar aproximación normal para múltiples dados
    const media = numDados * 3.5;
    const varianza = numDados * 35/12;
    const desviacion = Math.sqrt(varianza);

    // Aproximación normal con corrección de continuidad
    const z1 = (suma - 0.5 - media) / desviacion;
    const z2 = (suma + 0.5 - media) / desviacion;

    return normalCDF(suma + 0.5, media, desviacion) - normalCDF(suma - 0.5, media, desviacion);
}

// ========== VISUALIZACIONES ========== //
function initializeVisualizations() {
    // Inicializar diagrama de Venn
    actualizarDiagramaVenn();
}

function actualizarDiagramaVenn(pA = 0.5, pB = 0.3, pInterseccion = 0.1) {
    const canvas = document.getElementById('venn-diagram');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Configuración
    const centerA = { x: width/2 - 50, y: height/2 };
    const centerB = { x: width/2 + 50, y: height/2 };
    const radius = 80;

    // Dibujar círculo A
    ctx.beginPath();
    ctx.arc(centerA.x, centerA.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(46, 134, 171, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#2E86AB';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dibujar círculo B
    ctx.beginPath();
    ctx.arc(centerB.x, centerB.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(72, 169, 166, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#48A9A6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Etiquetas
    ctx.fillStyle = '#2E86AB';
    ctx.font = 'bold 16px Segoe UI';
    ctx.fillText('A', centerA.x - 60, centerA.y - 60);
    ctx.fillText(`P(A) = ${pA}`, centerA.x - 80, height - 20);

    ctx.fillStyle = '#48A9A6';
    ctx.fillText('B', centerB.x + 60, centerB.y - 60);
    ctx.fillText(`P(B) = ${pB}`, centerB.x + 20, height - 20);

    ctx.fillStyle = '#1A1A1A';
    ctx.fillText(`P(A∩B) = ${pInterseccion}`, width/2 - 40, height - 20);
}

function visualizarArbolBayes(pA, pBA, pBnotA, posterior) {
    const container = document.getElementById('bayes-tree');
    if (!container) return;

    // Crear visualización simple del árbol de probabilidad
    const html = `
        <div style="text-align: center; padding: 20px;">
            <h4>Árbol de Probabilidad</h4>
            <div style="display: inline-block; text-align: left; font-family: monospace;">
                <pre>
                      ┌─── B|A (${formatNumber(pBA)}) ─── P(A∩B) = ${formatNumber(pA * pBA)}
           ┌─── A (${formatNumber(pA)}) ─┤
           │          └─── B'|A (${formatNumber(1-pBA)}) ── P(A∩B') = ${formatNumber(pA * (1-pBA))}
    Start ─┤
           │          ┌─── B|A' (${formatNumber(pBnotA)}) ── P(A'∩B) = ${formatNumber((1-pA) * pBnotA)}
           └─── A' (${formatNumber(1-pA)}) ┤
                      └─── B'|A' (${formatNumber(1-pBnotA)}) ─ P(A'∩B') = ${formatNumber((1-pA) * (1-pBnotA))}
                </pre>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: var(--primary-light); border-radius: 8px;">
                <strong>Resultado:</strong> P(A|B) = ${formatNumber(posterior)} = ${(posterior * 100).toFixed(2)}%
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function graficarBinomial(n, p, k, tipo) {
    const canvas = document.getElementById('distribution-chart');
    if (!canvas) return;

    // Destruir gráfico anterior si existe
    if (chartInstances['distribution']) {
        chartInstances['distribution'].destroy();
    }

    // Preparar datos
    const labels = [];
    const data = [];
    const colors = [];

    for (let i = 0; i <= n; i++) {
        labels.push(i);
        const prob = binomialPMF(i, n, p);
        data.push(prob);

        // Colorear según el tipo
        if (tipo === 'exacta' && i === k) {
            colors.push('rgba(239, 68, 68, 0.8)');
        } else if (tipo === 'menor' && i <= k) {
            colors.push('rgba(16, 185, 129, 0.8)');
        } else if (tipo === 'mayor' && i > k) {
            colors.push('rgba(245, 158, 11, 0.8)');
        } else {
            colors.push('rgba(46, 134, 171, 0.6)');
        }
    }

    // Crear gráfico
    chartInstances['distribution'] = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'P(X = k)',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.6', '1').replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: `Distribución Binomial (n=${n}, p=${p})`
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probabilidad'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'k (número de éxitos)'
                    }
                }
            }
        }
    });
}

function graficarPoisson(lambda, k, tipo) {
    const canvas = document.getElementById('distribution-chart');
    if (!canvas) return;

    // Destruir gráfico anterior
    if (chartInstances['distribution']) {
        chartInstances['distribution'].destroy();
    }

    // Preparar datos
    const maxK = Math.max(20, Math.ceil(lambda + 4 * Math.sqrt(lambda)));
    const labels = [];
    const data = [];
    const colors = [];

    for (let i = 0; i <= maxK; i++) {
        labels.push(i);
        const prob = poissonPMF(i, lambda);
        data.push(prob);

        // Colorear según el tipo
        if (tipo === 'exacta' && i === k) {
            colors.push('rgba(239, 68, 68, 0.8)');
        } else if (tipo === 'menor' && i <= k) {
            colors.push('rgba(16, 185, 129, 0.8)');
        } else if (tipo === 'mayor' && i > k) {
            colors.push('rgba(245, 158, 11, 0.8)');
        } else {
            colors.push('rgba(72, 169, 166, 0.6)');
        }
    }

    // Crear gráfico
    chartInstances['distribution'] = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'P(X = k)',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.6', '1').replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: `Distribución Poisson (λ=${lambda})`
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probabilidad'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'k (número de ocurrencias)'
                    }
                }
            }
        }
    });
}

function graficarNormal(mu, sigma, x, tipo) {
    const canvas = document.getElementById('distribution-chart');
    if (!canvas) return;

    // Destruir gráfico anterior
    if (chartInstances['distribution']) {
        chartInstances['distribution'].destroy();
    }

    // Preparar datos
    const minX = mu - 4 * sigma;
    const maxX = mu + 4 * sigma;
    const step = (maxX - minX) / 100;

    const labels = [];
    const data = [];
    const backgroundColors = [];
    const borderColors = [];

    for (let i = minX; i <= maxX; i += step) {
        labels.push(i.toFixed(2));
        data.push(normalPDF(i, mu, sigma));

        // Colorear área según el tipo
        if (tipo === 'menor' && i <= x) {
            backgroundColors.push('rgba(16, 185, 129, 0.3)');
            borderColors.push('rgba(16, 185, 129, 1)');
        } else if (tipo === 'mayor' && i > x) {
            backgroundColors.push('rgba(245, 158, 11, 0.3)');
            borderColors.push('rgba(245, 158, 11, 1)');
        } else {
            backgroundColors.push('rgba(46, 134, 171, 0.2)');
            borderColors.push('rgba(46, 134, 171, 1)');
        }
    }

    // Crear gráfico
    chartInstances['distribution'] = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'f(x)',
                data: data,
                backgroundColor: 'rgba(46, 134, 171, 0.2)',
                borderColor: 'rgba(46, 134, 171, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: `Distribución Normal (μ=${mu}, σ=${sigma})`
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Densidad de Probabilidad'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                }
            }
        }
    });
}

function actualizarGraficoDistribucion() {
    const tipo = document.getElementById('tipo-distribucion').value;

    switch(tipo) {
        case 'binomial':
            const n = parseInt(document.getElementById('binomial-n').value) || 10;
            const p = parseFloat(document.getElementById('binomial-p').value) || 0.5;
            const k = parseInt(document.getElementById('binomial-k').value) || 5;
            graficarBinomial(n, p, k, 'exacta');
            break;
        case 'poisson':
            const lambda = parseFloat(document.getElementById('poisson-lambda').value) || 3;
            const kP = parseInt(document.getElementById('poisson-k').value) || 2;
            graficarPoisson(lambda, kP, 'exacta');
            break;
        case 'normal':
            const mu = parseFloat(document.getElementById('normal-mu').value) || 0;
            const sigma = parseFloat(document.getElementById('normal-sigma').value) || 1;
            const xN = parseFloat(document.getElementById('normal-x').value) || 1;
            graficarNormal(mu, sigma, xN, 'menor');
            break;
    }
}

function actualizarGraficoConvergencia(datos) {
    const canvas = document.getElementById('montecarlo-chart');
    if (!canvas) return;

    // Destruir gráfico anterior si existe
    if (chartInstances['montecarlo']) {
        chartInstances['montecarlo'].destroy();
    }

    // Preparar datos
    const labels = datos.map((_, i) => (i + 1) * 100);

    // Crear gráfico
    chartInstances['montecarlo'] = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probabilidad Simulada',
                data: datos,
                backgroundColor: 'rgba(46, 134, 171, 0.2)',
                borderColor: 'rgba(46, 134, 171, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: 'Convergencia de la Probabilidad'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Probabilidad'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Número de Simulaciones'
                    }
                }
            }
        }
    });
}

function mostrarEstadisticasDistribucion(stats) {
    const container = document.getElementById('stats-distribucion');
    if (!container) return;

    let html = '';
    for (const [key, value] of Object.entries(stats)) {
        html += `
            <div class="stat-item">
                <div class="stat-label">${key}</div>
                <div class="stat-value">${value}</div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function actualizarProgreso(actual, total) {
    const porcentaje = (actual / total * 100).toFixed(0);
    document.getElementById('sim-progress').style.width = `${porcentaje}%`;
    document.getElementById('sim-progress-text').textContent = `${porcentaje}%`;
}

// ========== UTILIDADES ========== //
function formatNumber(num) {
    if (Number.isInteger(num) && Math.abs(num) < 1000000) {
        return num.toLocaleString(CONFIG.locale);
    }

    // Para números muy grandes o muy pequeños, usar notación científica
    if (Math.abs(num) > 1e6 || (Math.abs(num) < 0.0001 && num !== 0)) {
        return num.toExponential(CONFIG.decimalPlaces);
    }

    // Para otros números, redondear según configuración
    return num.toLocaleString(CONFIG.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: CONFIG.decimalPlaces
    });
}

function validarProbabilidad(p) {
    return !isNaN(p) && p >= 0 && p <= 1;
}

function validarProbabilidades(...probs) {
    return probs.every(p => validarProbabilidad(p));
}

function mostrarError(elementId, mensaje) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div style="color: var(--error);">${mensaje}</div>`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========== HISTORIAL ========== //
function addToHistory(operacion, resultado) {
    const item = {
        operacion: operacion,
        resultado: resultado,
        fecha: new Date().toLocaleString(CONFIG.locale)
    };

    history.unshift(item);

    // Mantener máximo de elementos
    if (history.length > CONFIG.maxHistoryItems) {
        history = history.slice(0, CONFIG.maxHistoryItems);
    }

    // Guardar en localStorage
    localStorage.setItem('probabilidad_history', JSON.stringify(history));

    // Actualizar vista
    loadHistory();
}

function loadHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay cálculos en el historial</p>';
        return;
    }

    let html = '';
    history.forEach(item => {
        html += `
            <div class="history-item">
                <div><strong>${item.operacion}</strong></div>
                <div style="color: var(--primary);">${item.resultado}</div>
                <div class="date">${item.fecha}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function limpiarHistorial() {
    if (confirm('¿Estás seguro de que quieres limpiar el historial?')) {
        history = [];
        localStorage.removeItem('probabilidad_history');
        loadHistory();
    }
}

// ========== TOGGLE HISTORIAL ========== //
document.addEventListener('DOMContentLoaded', function() {
    // Botón para mostrar/ocultar historial
    const historyPanel = document.querySelector('.history-panel');

    // Crear botón toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-outline';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.right = '20px';
    toggleBtn.style.top = '100px';
    toggleBtn.style.zIndex = '99';
    toggleBtn.innerHTML = '📊';
    toggleBtn.title = 'Mostrar/Ocultar Historial';

    toggleBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('active');
    });

    document.body.appendChild(toggleBtn);
});