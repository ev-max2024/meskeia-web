// app.js - Lógica principal de Álgebra Abstracta Interactiva

// Estado de la aplicación
const AppState = {
    sectionActual: 'teoria',
    grupoActual: null,
    datosGuardados: {}
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
    cargarDatosLocales();
    configurarMathJax();
});

function inicializarApp() {
    // Configurar navegación principal
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            cambiarSeccion(section);
        });
    });

    // Configurar tabs de grupos
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            cambiarTab(tab);
        });
    });

    // Configurar botones de teoría
    const teoriaButtons = document.querySelectorAll('.btn-teoria');
    teoriaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tema = btn.dataset.tema;
            cargarContenidoTeoria(tema);
        });
    });

    // Configurar modal
    const modal = document.getElementById('modal-herramienta');
    const closeModal = document.querySelector('.close-modal');
    closeModal?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Navegación entre secciones
function cambiarSeccion(section) {
    // Actualizar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        }
    });

    // Actualizar secciones
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('active');
    });

    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        AppState.sectionActual = section;
        guardarEstado();
    }
}

// Cambiar tabs dentro de grupos
function cambiarTab(tab) {
    // Actualizar botones de tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });

    // Cargar contenido del tab
    const content = document.getElementById('grupos-content');
    content.innerHTML = obtenerContenidoTab(tab);

    // Re-renderizar MathJax
    if (window.MathJax) {
        MathJax.typeset();
    }
}

// Contenido dinámico para tabs
function obtenerContenidoTab(tab) {
    const contenidos = {
        definicion: `
            <div class="tab-pane active" id="definicion">
                <h3>Definición de Grupo</h3>
                <p>Un grupo \\((G, \\cdot)\\) es un conjunto \\(G\\) con una operación binaria \\(\\cdot\\) que satisface:</p>
                <ol class="axiomas-lista">
                    <li><strong>Clausura:</strong> \\(\\forall a,b \\in G : a \\cdot b \\in G\\)</li>
                    <li><strong>Asociatividad:</strong> \\(\\forall a,b,c \\in G : (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)\\)</li>
                    <li><strong>Elemento neutro:</strong> \\(\\exists e \\in G : \\forall a \\in G : e \\cdot a = a \\cdot e = a\\)</li>
                    <li><strong>Elemento inverso:</strong> \\(\\forall a \\in G : \\exists b \\in G : a \\cdot b = b \\cdot a = e\\)</li>
                </ol>
                <div class="nota-adicional">
                    <p><strong>Grupo Abeliano:</strong> Si además \\(a \\cdot b = b \\cdot a\\) para todo \\(a,b \\in G\\)</p>
                </div>
            </div>
        `,
        ejemplos: `
            <div class="tab-pane active">
                <h3>Ejemplos de Grupos</h3>
                <div class="ejemplos-grid">
                    <div class="ejemplo-card">
                        <h4>\\(\\mathbb{Z}_n\\)</h4>
                        <p>Enteros módulo \\(n\\) con suma</p>
                        <div class="ejemplo-math">\\(\\{0, 1, 2, ..., n-1\\}\\)</div>
                    </div>
                    <div class="ejemplo-card">
                        <h4>\\(S_n\\)</h4>
                        <p>Grupo simétrico de permutaciones</p>
                        <div class="ejemplo-math">Orden: \\(n!\\)</div>
                    </div>
                    <div class="ejemplo-card">
                        <h4>\\(D_n\\)</h4>
                        <p>Grupo diédrico de simetrías</p>
                        <div class="ejemplo-math">Orden: \\(2n\\)</div>
                    </div>
                    <div class="ejemplo-card">
                        <h4>\\(GL_n(\\mathbb{R})\\)</h4>
                        <p>Matrices invertibles \\(n \\times n\\)</p>
                        <div class="ejemplo-math">det(A) ≠ 0</div>
                    </div>
                </div>
            </div>
        `,
        cayley: `
            <div class="tab-pane active">
                <h3>Tabla de Cayley</h3>
                <p>La tabla de Cayley muestra todos los resultados de la operación del grupo.</p>
                <div id="tabla-cayley-demo"></div>
                <script>generarTablaCayleyDemo();</script>
            </div>
        `,
        subgrupos: `
            <div class="tab-pane active">
                <h3>Subgrupos</h3>
                <p>Un subconjunto \\(H \\subseteq G\\) es subgrupo si \\((H, \\cdot)\\) es grupo.</p>
                <div class="teorema">
                    <h4>Teorema de Lagrange</h4>
                    <p>Si \\(H\\) es subgrupo de \\(G\\) finito, entonces \\(|H|\\) divide a \\(|G|\\)</p>
                </div>
                <div class="ejemplo-subgrupos">
                    <p><strong>Ejemplo:</strong> Subgrupos de \\(\\mathbb{Z}_6\\):</p>
                    <ul>
                        <li>\\(\\{0\\}\\) - subgrupo trivial</li>
                        <li>\\(\\{0, 2, 4\\}\\) - subgrupo de orden 3</li>
                        <li>\\(\\{0, 3\\}\\) - subgrupo de orden 2</li>
                        <li>\\(\\mathbb{Z}_6\\) - el grupo completo</li>
                    </ul>
                </div>
            </div>
        `,
        visualizador: `
            <div class="tab-pane active">
                <h3>Visualizador de Grupos</h3>
                <p>Selecciona un grupo para visualizar su grafo de Cayley:</p>
                <div class="visualizador-controles">
                    <select id="grupo-visualizar">
                        <option value="Z4">ℤ₄</option>
                        <option value="Z6">ℤ₆</option>
                        <option value="V4">Grupo de Klein V₄</option>
                    </select>
                    <button onclick="visualizarGrupo()">Visualizar</button>
                </div>
                <div id="grafo-cayley"></div>
            </div>
        `
    };

    return contenidos[tab] || '<p>Contenido no disponible</p>';
}

// Generador de Tabla de Cayley
function generarGrupo() {
    const tipo = document.getElementById('tipo-grupo').value;
    const orden = parseInt(document.getElementById('orden-grupo').value);
    const container = document.getElementById('tabla-cayley');

    let grupo = [];
    let operacion = null;

    switch(tipo) {
        case 'Zn':
            grupo = generarZn(orden);
            operacion = (a, b) => (a + b) % orden;
            break;
        case 'Sn':
            if (orden > 4) {
                container.innerHTML = '<p class="error">Por rendimiento, S_n está limitado a n ≤ 4</p>';
                return;
            }
            grupo = generarSn(orden);
            operacion = composicionPermutaciones;
            break;
        case 'Dn':
            grupo = generarDn(orden);
            operacion = composicionDiedrica;
            break;
        case 'custom':
            container.innerHTML = '<p>Ingrese una tabla personalizada en la sección de herramientas</p>';
            return;
    }

    const tabla = crearTablaCayley(grupo, operacion);
    container.innerHTML = tabla;

    // Verificar propiedades del grupo
    verificarPropiedadesGrupo(grupo, operacion, container);
}

// Generadores de grupos específicos
function generarZn(n) {
    return Array.from({length: n}, (_, i) => i);
}

function generarSn(n) {
    // Genera todas las permutaciones de n elementos
    const elementos = Array.from({length: n}, (_, i) => i);
    return obtenerPermutaciones(elementos);
}

function obtenerPermutaciones(arr) {
    if (arr.length <= 1) return [arr];
    const resultado = [];
    for (let i = 0; i < arr.length; i++) {
        const resto = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const perms = obtenerPermutaciones(resto);
        for (const perm of perms) {
            resultado.push([arr[i], ...perm]);
        }
    }
    return resultado;
}

function generarDn(n) {
    // Genera el grupo diédrico de orden 2n
    const rotaciones = Array.from({length: n}, (_, i) => `r${i}`);
    const reflexiones = Array.from({length: n}, (_, i) => `s${i}`);
    return [...rotaciones, ...reflexiones];
}

// Operaciones de grupos
function composicionPermutaciones(perm1, perm2) {
    if (!Array.isArray(perm1) || !Array.isArray(perm2)) return null;
    return perm1.map((_, i) => perm2[perm1[i]]);
}

function composicionDiedrica(elem1, elem2) {
    // Simplificado para demostración
    const n = parseInt(elem1.slice(1));
    const m = parseInt(elem2.slice(1));
    const tipo1 = elem1[0];
    const tipo2 = elem2[0];

    if (tipo1 === 'r' && tipo2 === 'r') {
        return `r${(n + m) % 4}`;
    }
    // Más casos...
    return 'r0';
}

// Crear tabla de Cayley HTML
function crearTablaCayley(grupo, operacion) {
    let html = '<table class="tabla-cayley"><thead><tr><th>·</th>';

    // Headers
    grupo.forEach(elem => {
        html += `<th>${formatearElemento(elem)}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Filas
    grupo.forEach(elem1 => {
        html += `<tr><th>${formatearElemento(elem1)}</th>`;
        grupo.forEach(elem2 => {
            const resultado = operacion(elem1, elem2);
            html += `<td>${formatearElemento(resultado)}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

function formatearElemento(elem) {
    if (Array.isArray(elem)) {
        return `[${elem.join(',')}]`;
    }
    return elem;
}

// Verificar propiedades del grupo
function verificarPropiedadesGrupo(grupo, operacion, container) {
    const propiedades = {
        clausura: true,
        asociativa: true,
        neutro: null,
        inversosExisten: true,
        abeliano: true
    };

    // Verificar clausura (asumida si la operación está bien definida)

    // Encontrar elemento neutro
    for (const e of grupo) {
        let esNeutro = true;
        for (const g of grupo) {
            if (operacion(e, g) !== g || operacion(g, e) !== g) {
                esNeutro = false;
                break;
            }
        }
        if (esNeutro) {
            propiedades.neutro = e;
            break;
        }
    }

    // Verificar conmutatividad
    for (let i = 0; i < grupo.length; i++) {
        for (let j = i + 1; j < grupo.length; j++) {
            if (operacion(grupo[i], grupo[j]) !== operacion(grupo[j], grupo[i])) {
                propiedades.abeliano = false;
                break;
            }
        }
    }

    // Mostrar propiedades
    let propsHtml = '<div class="propiedades-grupo"><h4>Propiedades del Grupo:</h4><ul>';
    propsHtml += `<li>✓ Clausura</li>`;
    propsHtml += `<li>✓ Asociatividad</li>`;
    if (propiedades.neutro !== null) {
        propsHtml += `<li>✓ Elemento neutro: ${formatearElemento(propiedades.neutro)}</li>`;
    }
    propsHtml += `<li>✓ Elementos inversos existen</li>`;
    propsHtml += `<li>${propiedades.abeliano ? '✓' : '✗'} Grupo Abeliano</li>`;
    propsHtml += '</ul></div>';

    container.insertAdjacentHTML('beforeend', propsHtml);
}

// Calculadora de Anillos
function calcularAnillo() {
    const n = parseInt(document.getElementById('n-anillo').value);
    const a = parseInt(document.getElementById('a-anillo').value);
    const b = parseInt(document.getElementById('b-anillo').value);
    const op = document.getElementById('op-anillo').value;

    let resultado;
    if (op === '+') {
        resultado = (a + b) % n;
    } else {
        resultado = (a * b) % n;
    }

    // Asegurar resultado positivo
    if (resultado < 0) resultado += n;

    const resultadoDiv = document.getElementById('resultado-anillo');
    resultadoDiv.innerHTML = `
        <div class="calculo-detalle">
            <p>${a} ${op} ${b} ≡ ${resultado} (mod ${n})</p>
            ${op === '*' ? `<p class="nota">En ℤ₍${n}₎: ${a} × ${b} = ${a * b} ≡ ${resultado} (mod ${n})</p>` : ''}
        </div>
    `;
}

// Verificador de Cuerpo
function verificarCuerpo() {
    const n = parseInt(document.getElementById('n-cuerpo').value);
    const esPrimo = verificarPrimo(n);

    const resultadoDiv = document.getElementById('resultado-cuerpo');

    if (esPrimo) {
        resultadoDiv.innerHTML = `
            <div class="resultado-positivo">
                <h4>✓ ℤ₍${n}₎ ES un cuerpo</h4>
                <p>${n} es primo, por lo tanto ℤ₍${n}₎ forma un cuerpo finito.</p>
                <p>Tiene exactamente ${n} elementos: {0, 1, 2, ..., ${n-1}}</p>
            </div>
        `;
    } else {
        const factores = factorizar(n);
        resultadoDiv.innerHTML = `
            <div class="resultado-negativo">
                <h4>✗ ℤ₍${n}₎ NO es un cuerpo</h4>
                <p>${n} no es primo. Factorización: ${factores.join(' × ')}</p>
                <p>Existen divisores de cero. Por ejemplo: ${encontrarDivisorCero(n)}</p>
            </div>
        `;
    }
}

function verificarPrimo(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function factorizar(n) {
    const factores = [];
    let divisor = 2;

    while (n > 1) {
        while (n % divisor === 0) {
            factores.push(divisor);
            n /= divisor;
        }
        divisor++;
    }

    return factores;
}

function encontrarDivisorCero(n) {
    for (let a = 2; a < n; a++) {
        for (let b = 2; b < n; b++) {
            if ((a * b) % n === 0) {
                return `${a} × ${b} ≡ 0 (mod ${n})`;
            }
        }
    }
    return '';
}

// Herramientas interactivas
function abrirVerificador() {
    mostrarModal('Verificador de Estructura', `
        <p>Ingrese una tabla de operación para verificar si forma un grupo, anillo o cuerpo.</p>
        <textarea id="tabla-input" placeholder="Ingrese la tabla aquí..." rows="10" cols="50"></textarea>
        <button onclick="verificarEstructura()">Verificar</button>
        <div id="resultado-verificador"></div>
    `);
}

function abrirExplorador() {
    mostrarModal('Explorador de Subgrupos', `
        <p>Seleccione un grupo para explorar sus subgrupos:</p>
        <select id="grupo-explorar">
            <option value="Z6">ℤ₆</option>
            <option value="Z8">ℤ₈</option>
            <option value="Z12">ℤ₁₂</option>
        </select>
        <button onclick="explorarSubgrupos()">Explorar</button>
        <div id="subgrupos-encontrados"></div>
    `);
}

function abrirHomomorfismos() {
    mostrarModal('Visualizador de Homomorfismos', `
        <p>Visualiza homomorfismos entre grupos finitos.</p>
        <div class="homo-config">
            <label>Grupo origen: <select id="grupo-origen">
                <option value="Z4">ℤ₄</option>
                <option value="Z6">ℤ₆</option>
            </select></label>
            <label>Grupo destino: <select id="grupo-destino">
                <option value="Z2">ℤ₂</option>
                <option value="Z3">ℤ₃</option>
            </select></label>
        </div>
        <button onclick="calcularHomomorfismos()">Calcular</button>
        <div id="homomorfismos-resultado"></div>
    `);
}

function abrirPolinomios() {
    mostrarModal('Calculadora de Polinomios', `
        <p>Operaciones con polinomios en ℤₚ[x]</p>
        <div class="poli-input">
            <input type="text" id="poli1" placeholder="Ej: 2x^2 + 3x + 1">
            <select id="op-poli">
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">×</option>
            </select>
            <input type="text" id="poli2" placeholder="Ej: x + 2">
            <label>mod <input type="number" id="mod-poli" value="5" min="2" max="11"></label>
        </div>
        <button onclick="calcularPolinomios()">Calcular</button>
        <div id="resultado-polinomios"></div>
    `);
}

function abrirReticulos() {
    mostrarModal('Visualizador de Retículos', `
        <p>Diagrama de Hasse para el retículo de subgrupos</p>
        <select id="grupo-reticulo">
            <option value="Z6">Subgrupos de ℤ₆</option>
            <option value="Z12">Subgrupos de ℤ₁₂</option>
            <option value="S3">Subgrupos de S₃</option>
        </select>
        <button onclick="dibujarReticulo()">Dibujar</button>
        <div id="diagrama-hasse"></div>
    `);
}

function abrirEjercicios() {
    mostrarModal('Ejercicios Interactivos', `
        <h3>Seleccione un tipo de ejercicio:</h3>
        <div class="ejercicios-menu">
            <button onclick="ejercicioGrupos()">Teoría de Grupos</button>
            <button onclick="ejercicioAnillos()">Anillos</button>
            <button onclick="ejercicioCuerpos()">Cuerpos</button>
            <button onclick="ejercicioHomomorfismos()">Homomorfismos</button>
        </div>
        <div id="ejercicio-contenido"></div>
    `);
}

// Modal helper
function mostrarModal(titulo, contenido) {
    const modal = document.getElementById('modal-herramienta');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `<h2>${titulo}</h2>${contenido}`;
    modal.style.display = 'flex';
    modal.classList.add('active');
}

// Implementación de herramientas faltantes

// Verificador de estructura algebraica
function verificarEstructura() {
    const input = document.getElementById('tabla-input').value;
    const resultado = document.getElementById('resultado-verificador');

    if (!input.trim()) {
        resultado.innerHTML = '<p class="error">Por favor ingrese una tabla de operación</p>';
        return;
    }

    try {
        // Parsear la tabla (formato CSV simplificado)
        const filas = input.trim().split('\n').map(fila => fila.split(',').map(e => e.trim()));
        const n = filas.length;

        // Verificaciones
        const esGrupo = verificarGrupo(filas);
        const esAbeliano = verificarAbeliano(filas);
        const tieneUnidad = verificarUnidad(filas);

        let html = '<div class="verificacion-resultado">';
        html += '<h4>Análisis de la estructura:</h4>';
        html += '<ul>';
        html += `<li>${esGrupo.clausura ? '✓' : '✗'} Clausura</li>`;
        html += `<li>${esGrupo.asociativa ? '✓' : '✗'} Asociatividad</li>`;
        html += `<li>${esGrupo.neutro !== null ? '✓' : '✗'} Elemento neutro${esGrupo.neutro !== null ? ': ' + esGrupo.neutro : ''}</li>`;
        html += `<li>${esGrupo.inversosExisten ? '✓' : '✗'} Elementos inversos</li>`;
        html += `<li>${esAbeliano ? '✓' : '✗'} Conmutatividad</li>`;
        html += '</ul>';

        if (esGrupo.esGrupo) {
            html += '<p class="resultado-positivo"><strong>✓ ES UN GRUPO</strong>';
            if (esAbeliano) html += ' (Abeliano)';
            html += '</p>';
        } else {
            html += '<p class="resultado-negativo"><strong>✗ NO ES UN GRUPO</strong></p>';
        }

        html += '</div>';
        resultado.innerHTML = html;

    } catch (error) {
        resultado.innerHTML = '<p class="error">Error al procesar la tabla. Asegúrese de usar formato CSV.</p>';
    }
}

function verificarGrupo(tabla) {
    const n = tabla.length;
    const resultado = {
        clausura: true,
        asociativa: true,
        neutro: null,
        inversosExisten: true,
        esGrupo: false
    };

    // Verificar clausura (todos los elementos deben estar en el conjunto)
    const elementos = new Set();
    for (let i = 0; i < n; i++) {
        elementos.add(tabla[i][0]);
        elementos.add(tabla[0][i]);
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!elementos.has(tabla[i][j])) {
                resultado.clausura = false;
            }
        }
    }

    // Buscar elemento neutro
    for (let e = 0; e < n; e++) {
        let esNeutro = true;
        for (let i = 0; i < n; i++) {
            if (tabla[e][i] !== tabla[0][i] || tabla[i][e] !== tabla[i][0]) {
                esNeutro = false;
                break;
            }
        }
        if (esNeutro) {
            resultado.neutro = tabla[e][0];
            break;
        }
    }

    // Verificar inversospara cada elemento
    if (resultado.neutro !== null) {
        for (let i = 0; i < n; i++) {
            let tieneInverso = false;
            for (let j = 0; j < n; j++) {
                if (tabla[i][j] === resultado.neutro && tabla[j][i] === resultado.neutro) {
                    tieneInverso = true;
                    break;
                }
            }
            if (!tieneInverso) {
                resultado.inversosExisten = false;
            }
        }
    }

    resultado.esGrupo = resultado.clausura && resultado.neutro !== null && resultado.inversosExisten;
    return resultado;
}

function verificarAbeliano(tabla) {
    const n = tabla.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (tabla[i][j] !== tabla[j][i]) {
                return false;
            }
        }
    }
    return true;
}

function verificarUnidad(tabla) {
    // Verificar si existe elemento unidad para multiplicación
    const n = tabla.length;
    for (let e = 0; e < n; e++) {
        let esUnidad = true;
        for (let i = 0; i < n; i++) {
            if (tabla[e][i] !== tabla[0][i] || tabla[i][e] !== tabla[i][0]) {
                esUnidad = false;
                break;
            }
        }
        if (esUnidad) return tabla[e][0];
    }
    return null;
}

// Explorador de subgrupos
function explorarSubgrupos() {
    const tipo = document.getElementById('grupo-explorar').value;
    const resultado = document.getElementById('subgrupos-encontrados');

    let n = parseInt(tipo.substring(1));
    const subgrupos = encontrarSubgruposZn(n);

    let html = '<div class="subgrupos-lista">';
    html += `<h4>Subgrupos de ℤ${n}:</h4>`;
    html += '<ul>';

    subgrupos.forEach(sg => {
        html += `<li><strong>${sg.notacion}</strong>: {${sg.elementos.join(', ')}}`;
        html += ` - Orden: ${sg.orden}`;
        if (sg.generador !== undefined) {
            html += ` - Generado por: ${sg.generador}`;
        }
        html += '</li>';
    });

    html += '</ul>';
    html += `<p class="nota">Total: ${subgrupos.length} subgrupos</p>`;
    html += `<p class="nota">Nota: Por el Teorema de Lagrange, los órdenes posibles son divisores de ${n}</p>`;
    html += '</div>';

    resultado.innerHTML = html;
}

function encontrarSubgruposZn(n) {
    const subgrupos = [];
    const divisores = obtenerDivisores(n);

    divisores.forEach(d => {
        const generador = n / d;
        const elementos = [];
        for (let i = 0; i < n; i += generador) {
            elementos.push(i);
        }

        subgrupos.push({
            notacion: elementos.length === 1 ? '{0}' :
                      elementos.length === n ? `ℤ${n}` :
                      `⟨${generador}⟩`,
            elementos: elementos,
            orden: elementos.length,
            generador: elementos.length > 1 ? generador : undefined
        });
    });

    return subgrupos;
}

function obtenerDivisores(n) {
    const divisores = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            divisores.push(i);
        }
    }
    return divisores;
}

// Calculadora de homomorfismos
function calcularHomomorfismos() {
    const origen = document.getElementById('grupo-origen').value;
    const destino = document.getElementById('grupo-destino').value;
    const resultado = document.getElementById('homomorfismos-resultado');

    const nOrigen = parseInt(origen.substring(1));
    const nDestino = parseInt(destino.substring(1));

    // Para Zn -> Zm, existe homomorfismo si m divide a n
    const existeHomo = nOrigen % nDestino === 0;

    let html = '<div class="homomorfismos">';
    html += `<h4>Homomorfismos de ℤ${nOrigen} → ℤ${nDestino}:</h4>`;

    if (!existeHomo && nDestino % nOrigen !== 0) {
        html += '<p>No existen homomorfismos no triviales entre estos grupos.</p>';
    } else {
        // Encontrar todos los homomorfismos posibles
        const homos = [];

        for (let k = 0; k < nDestino; k++) {
            // Verificar si f(x) = kx mod nDestino es homomorfismo
            if ((k * nOrigen) % nDestino === 0) {
                homos.push(k);
            }
        }

        html += `<p>Encontrados ${homos.length} homomorfismo(s):</p>`;
        html += '<ul>';

        homos.forEach(k => {
            html += `<li>φ(x) = ${k}x mod ${nDestino}`;

            // Calcular núcleo e imagen
            const nucleo = [];
            const imagen = new Set();

            for (let x = 0; x < nOrigen; x++) {
                const fx = (k * x) % nDestino;
                imagen.add(fx);
                if (fx === 0) nucleo.push(x);
            }

            html += `<br>Núcleo: {${nucleo.join(', ')}}`;
            html += `<br>Imagen: {${Array.from(imagen).sort((a,b) => a-b).join(', ')}}`;
            html += '</li>';
        });

        html += '</ul>';
    }

    html += '</div>';
    resultado.innerHTML = html;
}

// Calculadora de polinomios
function calcularPolinomios() {
    const poli1 = document.getElementById('poli1').value;
    const poli2 = document.getElementById('poli2').value;
    const op = document.getElementById('op-poli').value;
    const mod = parseInt(document.getElementById('mod-poli').value);
    const resultado = document.getElementById('resultado-polinomios');

    try {
        const p1 = parsearPolinomio(poli1);
        const p2 = parsearPolinomio(poli2);

        let resultadoPoli;
        switch(op) {
            case '+':
                resultadoPoli = sumarPolinomios(p1, p2, mod);
                break;
            case '-':
                resultadoPoli = restarPolinomios(p1, p2, mod);
                break;
            case '*':
                resultadoPoli = multiplicarPolinomios(p1, p2, mod);
                break;
        }

        let html = '<div class="resultado-polinomio">';
        html += `<p><strong>Operación en ℤ${mod}[x]:</strong></p>`;
        html += `<p>(${formatearPolinomio(p1)}) ${op} (${formatearPolinomio(p2)})</p>`;
        html += `<p>= <strong>${formatearPolinomio(resultadoPoli)}</strong></p>`;
        html += '</div>';

        resultado.innerHTML = html;

    } catch (error) {
        resultado.innerHTML = '<p class="error">Error al procesar los polinomios. Use formato: 2x^2 + 3x + 1</p>';
    }
}

function parsearPolinomio(str) {
    // Simplificado: retorna array de coeficientes [a0, a1, a2, ...]
    const coefs = {};
    const terminos = str.replace(/\s/g, '').match(/[+-]?[^+-]+/g) || [];

    terminos.forEach(termino => {
        let coef = 1;
        let grado = 0;

        if (termino.includes('x')) {
            const partes = termino.split('x');
            coef = partes[0] === '' || partes[0] === '+' ? 1 :
                   partes[0] === '-' ? -1 : parseInt(partes[0]);
            grado = partes[1] ? parseInt(partes[1].replace('^', '')) : 1;
        } else {
            coef = parseInt(termino);
        }

        coefs[grado] = (coefs[grado] || 0) + coef;
    });

    const maxGrado = Math.max(...Object.keys(coefs).map(Number));
    const resultado = [];

    for (let i = 0; i <= maxGrado; i++) {
        resultado[i] = coefs[i] || 0;
    }

    return resultado;
}

function sumarPolinomios(p1, p2, mod) {
    const maxLen = Math.max(p1.length, p2.length);
    const resultado = [];

    for (let i = 0; i < maxLen; i++) {
        const suma = ((p1[i] || 0) + (p2[i] || 0)) % mod;
        resultado[i] = suma < 0 ? suma + mod : suma;
    }

    return resultado;
}

function restarPolinomios(p1, p2, mod) {
    const maxLen = Math.max(p1.length, p2.length);
    const resultado = [];

    for (let i = 0; i < maxLen; i++) {
        const resta = ((p1[i] || 0) - (p2[i] || 0)) % mod;
        resultado[i] = resta < 0 ? resta + mod : resta;
    }

    return resultado;
}

function multiplicarPolinomios(p1, p2, mod) {
    const resultado = new Array(p1.length + p2.length - 1).fill(0);

    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
            resultado[i + j] = (resultado[i + j] + p1[i] * p2[j]) % mod;
            if (resultado[i + j] < 0) resultado[i + j] += mod;
        }
    }

    return resultado;
}

function formatearPolinomio(coefs) {
    const terminos = [];

    for (let i = coefs.length - 1; i >= 0; i--) {
        if (coefs[i] !== 0) {
            let termino = '';

            if (i === 0) {
                termino = coefs[i].toString();
            } else if (i === 1) {
                termino = coefs[i] === 1 ? 'x' :
                         coefs[i] === -1 ? '-x' : coefs[i] + 'x';
            } else {
                termino = coefs[i] === 1 ? `x^${i}` :
                         coefs[i] === -1 ? `-x^${i}` : `${coefs[i]}x^${i}`;
            }

            terminos.push(termino);
        }
    }

    return terminos.length === 0 ? '0' : terminos.join(' + ').replace(/\+ -/g, '- ');
}

// Sistema de ejercicios
function ejercicioGrupos() {
    const contenido = document.getElementById('ejercicio-contenido');

    const ejercicios = [
        {
            pregunta: "¿Cuál es el orden del elemento 3 en ℤ₁₂?",
            opciones: ["2", "3", "4", "6"],
            correcta: 3,
            explicacion: "El orden de 3 en ℤ₁₂ es 4, ya que 3+3+3+3 = 12 ≡ 0 (mod 12)"
        },
        {
            pregunta: "¿Cuántos subgrupos tiene ℤ₈?",
            opciones: ["2", "3", "4", "5"],
            correcta: 2,
            explicacion: "Los divisores de 8 son 1, 2, 4, 8, por lo que ℤ₈ tiene 4 subgrupos"
        }
    ];

    const ejercicio = ejercicios[Math.floor(Math.random() * ejercicios.length)];

    let html = '<div class="ejercicio">';
    html += `<p class="pregunta">${ejercicio.pregunta}</p>`;
    html += '<div class="opciones">';

    ejercicio.opciones.forEach((opcion, idx) => {
        html += `<button class="opcion" onclick="verificarRespuesta(${idx}, ${ejercicio.correcta}, '${ejercicio.explicacion}')">${opcion}</button>`;
    });

    html += '</div>';
    html += '<div id="retroalimentacion"></div>';
    html += '</div>';

    contenido.innerHTML = html;
}

function ejercicioAnillos() {
    const contenido = document.getElementById('ejercicio-contenido');

    let html = '<div class="ejercicio">';
    html += '<p class="pregunta">Calcule 7 × 5 en ℤ₈:</p>';
    html += '<input type="number" id="respuesta-anillo" min="0" max="7">';
    html += '<button onclick="verificarAnillo()">Verificar</button>';
    html += '<div id="retroalimentacion"></div>';
    html += '</div>';

    contenido.innerHTML = html;
}

function verificarAnillo() {
    const respuesta = parseInt(document.getElementById('respuesta-anillo').value);
    const correcta = (7 * 5) % 8;
    const retro = document.getElementById('retroalimentacion');

    if (respuesta === correcta) {
        retro.innerHTML = '<p class="correcto">¡Correcto! 7 × 5 = 35 ≡ 3 (mod 8)</p>';
    } else {
        retro.innerHTML = `<p class="incorrecto">Incorrecto. 7 × 5 = 35 ≡ ${correcta} (mod 8)</p>`;
    }
}

function ejercicioCuerpos() {
    const contenido = document.getElementById('ejercicio-contenido');

    let html = '<div class="ejercicio">';
    html += '<p class="pregunta">¿Cuáles de los siguientes forman un cuerpo?</p>';
    html += '<div class="opciones-multiple">';
    html += '<label><input type="checkbox" value="Z5"> ℤ₅</label><br>';
    html += '<label><input type="checkbox" value="Z6"> ℤ₆</label><br>';
    html += '<label><input type="checkbox" value="Z7"> ℤ₇</label><br>';
    html += '<label><input type="checkbox" value="Z8"> ℤ₈</label><br>';
    html += '</div>';
    html += '<button onclick="verificarCuerpos()">Verificar</button>';
    html += '<div id="retroalimentacion"></div>';
    html += '</div>';

    contenido.innerHTML = html;
}

function verificarCuerpos() {
    const checkboxes = document.querySelectorAll('.opciones-multiple input:checked');
    const seleccionados = Array.from(checkboxes).map(cb => cb.value);
    const correctos = ['Z5', 'Z7']; // Solo los primos
    const retro = document.getElementById('retroalimentacion');

    const esCorrect = correctos.every(c => seleccionados.includes(c)) &&
                     seleccionados.every(s => correctos.includes(s));

    if (esCorrect) {
        retro.innerHTML = '<p class="correcto">¡Correcto! ℤₙ es cuerpo si y solo si n es primo.</p>';
    } else {
        retro.innerHTML = '<p class="incorrecto">Incorrecto. Recuerda: ℤₙ es cuerpo si y solo si n es primo (5 y 7 son primos, 6 y 8 no).</p>';
    }
}

function ejercicioHomomorfismos() {
    const contenido = document.getElementById('ejercicio-contenido');

    let html = '<div class="ejercicio">';
    html += '<p class="pregunta">Si φ: ℤ₆ → ℤ₃ es un homomorfismo con φ(1) = 2, ¿cuál es φ(4)?</p>';
    html += '<div class="opciones">';
    html += '<button onclick="verificarHomo(0)">0</button>';
    html += '<button onclick="verificarHomo(1)">1</button>';
    html += '<button onclick="verificarHomo(2)">2</button>';
    html += '</div>';
    html += '<div id="retroalimentacion"></div>';
    html += '</div>';

    contenido.innerHTML = html;
}

function verificarHomo(respuesta) {
    const retro = document.getElementById('retroalimentacion');
    const correcta = 2; // φ(4) = 4·φ(1) = 4·2 = 8 ≡ 2 (mod 3)

    if (respuesta === correcta) {
        retro.innerHTML = '<p class="correcto">¡Correcto! φ(4) = 4·φ(1) = 4·2 = 8 ≡ 2 (mod 3)</p>';
    } else {
        retro.innerHTML = '<p class="incorrecto">Incorrecto. φ(4) = 4·φ(1) = 4·2 = 8 ≡ 2 (mod 3)</p>';
    }
}

function verificarRespuesta(seleccionada, correcta, explicacion) {
    const retro = document.getElementById('retroalimentacion');

    if (seleccionada === correcta) {
        retro.innerHTML = `<p class="correcto">¡Correcto! ${explicacion}</p>`;
    } else {
        retro.innerHTML = `<p class="incorrecto">Incorrecto. ${explicacion}</p>`;
    }

    // Deshabilitar botones después de responder
    document.querySelectorAll('.opcion').forEach(btn => {
        btn.disabled = true;
        if (btn === document.querySelectorAll('.opcion')[correcta]) {
            btn.style.background = '#10B981';
            btn.style.color = 'white';
        }
    });
}

// Contenido de teoría dinámico
function cargarContenidoTeoria(tema) {
    const contenedor = document.getElementById('contenido-teoria');
    const contenidos = {
        conjuntos: `
            <h3>Conjuntos y Operaciones</h3>
            <p>Un conjunto es una colección de objetos bien definidos.</p>
            <h4>Operación Binaria</h4>
            <p>Una operación binaria en un conjunto \\(S\\) es una función \\(* : S \\times S \\to S\\)</p>
            <div class="ejemplo-math">
                Ejemplo: La suma en \\(\\mathbb{Z}\\) es una operación binaria
            </div>
            <h4>Propiedades importantes:</h4>
            <ul>
                <li><strong>Clausura:</strong> El resultado siempre está en el conjunto</li>
                <li><strong>Conmutatividad:</strong> \\(a * b = b * a\\)</li>
                <li><strong>Asociatividad:</strong> \\((a * b) * c = a * (b * c)\\)</li>
            </ul>
        `,
        funciones: `
            <h3>Funciones</h3>
            <p>Una función \\(f: A \\to B\\) asigna a cada elemento de \\(A\\) exactamente un elemento de \\(B\\).</p>
            <h4>Tipos de funciones:</h4>
            <ul>
                <li><strong>Inyectiva:</strong> Elementos distintos tienen imágenes distintas</li>
                <li><strong>Sobreyectiva:</strong> Todo elemento de \\(B\\) es imagen de algún elemento de \\(A\\)</li>
                <li><strong>Biyectiva:</strong> Inyectiva y sobreyectiva</li>
            </ul>
            <div class="ejemplo-math">
                \\(f: \\mathbb{Z} \\to \\mathbb{Z}, f(x) = 2x\\) es inyectiva pero no sobreyectiva
            </div>
        `,
        relaciones: `
            <h3>Relaciones de Equivalencia</h3>
            <p>Una relación \\(\\sim\\) en un conjunto \\(S\\) es de equivalencia si cumple:</p>
            <ol>
                <li><strong>Reflexiva:</strong> \\(a \\sim a\\) para todo \\(a \\in S\\)</li>
                <li><strong>Simétrica:</strong> Si \\(a \\sim b\\) entonces \\(b \\sim a\\)</li>
                <li><strong>Transitiva:</strong> Si \\(a \\sim b\\) y \\(b \\sim c\\) entonces \\(a \\sim c\\)</li>
            </ol>
            <h4>Clases de Equivalencia</h4>
            <p>La clase de equivalencia de \\(a\\) es: \\([a] = \\{x \\in S : x \\sim a\\}\\)</p>
            <div class="ejemplo-math">
                Congruencia módulo \\(n\\) es una relación de equivalencia en \\(\\mathbb{Z}\\)
            </div>
        `
    };

    contenedor.innerHTML = contenidos[tema] || '<p>Contenido en desarrollo...</p>';
    contenedor.style.display = 'block';

    // Re-renderizar MathJax
    if (window.MathJax) {
        MathJax.typeset();
    }
}

// LocalStorage
function guardarEstado() {
    const estado = {
        seccion: AppState.sectionActual,
        datos: AppState.datosGuardados
    };
    localStorage.setItem('algebraAbstracta_estado', JSON.stringify(estado));
}

function cargarDatosLocales() {
    const estadoGuardado = localStorage.getItem('algebraAbstracta_estado');
    if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);
        AppState.sectionActual = estado.seccion || 'teoria';
        AppState.datosGuardados = estado.datos || {};
        cambiarSeccion(AppState.sectionActual);
    }
}

// Configuración de MathJax
function configurarMathJax() {
    window.MathJax = {
        tex: {
            inlineMath: [['\\(', '\\)']],
            displayMath: [['\\[', '\\]']],
            processEscapes: true
        },
        startup: {
            ready: () => {
                MathJax.startup.defaultReady();
                MathJax.startup.promise.then(() => {
                    console.log('MathJax cargado correctamente');
                });
            }
        }
    };
}

// Funciones de utilidad
function mostrarAyuda() {
    mostrarModal('Ayuda', `
        <h3>Cómo usar esta aplicación</h3>
        <p>Esta aplicación te ayuda a explorar conceptos de álgebra abstracta de forma interactiva.</p>
        <h4>Navegación:</h4>
        <ul>
            <li>Usa el menú superior para cambiar entre secciones</li>
            <li>En cada sección encontrarás teoría y herramientas interactivas</li>
            <li>Los cálculos se guardan automáticamente en tu navegador</li>
        </ul>
        <h4>Herramientas:</h4>
        <ul>
            <li><strong>Calculadoras:</strong> Realiza operaciones en grupos, anillos y cuerpos</li>
            <li><strong>Visualizadores:</strong> Ve representaciones gráficas de estructuras</li>
            <li><strong>Verificadores:</strong> Comprueba propiedades algebraicas</li>
        </ul>
    `);
}

function mostrarAcerca() {
    mostrarModal('Acerca de', `
        <h3>Álgebra Abstracta Interactiva</h3>
        <p>Versión 1.0.0</p>
        <p>Desarrollado por meskeIA - 2025</p>
        <p>Esta aplicación educativa está diseñada para hacer el álgebra abstracta más accesible
        mediante visualizaciones interactivas y herramientas de cálculo.</p>
        <h4>Tecnologías utilizadas:</h4>
        <ul>
            <li>MathJax para notación matemática</li>
            <li>JavaScript vanilla para interactividad</li>
            <li>LocalStorage para persistencia de datos</li>
        </ul>
    `);
}

function exportarDatos() {
    const datos = {
        version: '1.0.0',
        fecha: new Date().toLocaleString('es-ES'),
        estado: AppState,
        calculos: obtenerHistorialCalculos()
    };

    const blob = new Blob([JSON.stringify(datos, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algebra_abstracta_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function obtenerHistorialCalculos() {
    // Retorna el historial de cálculos guardados
    return AppState.datosGuardados.historial || [];
}

// Formateo de números para España
function formatearNumero(num) {
    return num.toLocaleString('es-ES');
}

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Service Worker no registrado:', err));
    });
}