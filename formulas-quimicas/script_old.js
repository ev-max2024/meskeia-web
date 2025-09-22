/**
 * Constructor de Fórmulas Químicas - JavaScript
 * Usando Interact.js para drag & drop y validación química
 * © 2025 meskeIA
 */

// Configuración global
const CONFIG = {
    animation: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    validation: {
        showDetails: true,
        autoSave: true
    },
    storage: {
        key: 'meskeia_formulas_quimicas',
        historyLimit: 20
    }
};

// Base de datos de elementos químicos
const ELEMENTOS = {
    // Metales
    'Na': { nombre: 'Sodio', valencia: [1], tipo: 'metal', numero: 11 },
    'K': { nombre: 'Potasio', valencia: [1], tipo: 'metal', numero: 19 },
    'Li': { nombre: 'Litio', valencia: [1], tipo: 'metal', numero: 3 },
    'Ca': { nombre: 'Calcio', valencia: [2], tipo: 'metal', numero: 20 },
    'Mg': { nombre: 'Magnesio', valencia: [2], tipo: 'metal', numero: 12 },
    'Ba': { nombre: 'Bario', valencia: [2], tipo: 'metal', numero: 56 },
    'Al': { nombre: 'Aluminio', valencia: [3], tipo: 'metal', numero: 13 },
    'Fe': { nombre: 'Hierro', valencia: [2, 3], tipo: 'metal', numero: 26 },
    'Cu': { nombre: 'Cobre', valencia: [1, 2], tipo: 'metal', numero: 29 },
    'Zn': { nombre: 'Zinc', valencia: [2], tipo: 'metal', numero: 30 },
    'Pb': { nombre: 'Plomo', valencia: [2, 4], tipo: 'metal', numero: 82 },

    // No metales
    'H': { nombre: 'Hidrógeno', valencia: [1], tipo: 'no-metal', numero: 1 },
    'C': { nombre: 'Carbono', valencia: [2, 4], tipo: 'no-metal', numero: 6 },
    'N': { nombre: 'Nitrógeno', valencia: [3, 5], tipo: 'no-metal', numero: 7 },
    'O': { nombre: 'Oxígeno', valencia: [2], tipo: 'no-metal', numero: 8 },
    'F': { nombre: 'Flúor', valencia: [1], tipo: 'no-metal', numero: 9 },
    'Cl': { nombre: 'Cloro', valencia: [1, 3, 5, 7], tipo: 'no-metal', numero: 17 },
    'Br': { nombre: 'Bromo', valencia: [1, 3, 5, 7], tipo: 'no-metal', numero: 35 },
    'I': { nombre: 'Iodo', valencia: [1, 3, 5, 7], tipo: 'no-metal', numero: 53 },
    'S': { nombre: 'Azufre', valencia: [2, 4, 6], tipo: 'no-metal', numero: 16 },
    'P': { nombre: 'Fósforo', valencia: [3, 5], tipo: 'no-metal', numero: 15 },

    // Gases nobles
    'He': { nombre: 'Helio', valencia: [0], tipo: 'gas-noble', numero: 2 },
    'Ne': { nombre: 'Neón', valencia: [0], tipo: 'gas-noble', numero: 10 },
    'Ar': { nombre: 'Argón', valencia: [0], tipo: 'gas-noble', numero: 18 },

    // Metaloides
    'Si': { nombre: 'Silicio', valencia: [4], tipo: 'metaloide', numero: 14 },
    'B': { nombre: 'Boro', valencia: [3], tipo: 'metaloide', numero: 5 }
};

// Iones y grupos comunes
const IONES = {
    // Cationes
    'NH4': { nombre: 'Amonio', valencia: [1], tipo: 'cation', formula: 'NH₄⁺' },

    // Aniones
    'SO4': { nombre: 'Sulfato', valencia: [2], tipo: 'anion', formula: 'SO₄²⁻' },
    'SO3': { nombre: 'Sulfito', valencia: [2], tipo: 'anion', formula: 'SO₃²⁻' },
    'NO3': { nombre: 'Nitrato', valencia: [1], tipo: 'anion', formula: 'NO₃⁻' },
    'NO2': { nombre: 'Nitrito', valencia: [1], tipo: 'anion', formula: 'NO₂⁻' },
    'CO3': { nombre: 'Carbonato', valencia: [2], tipo: 'anion', formula: 'CO₃²⁻' },
    'HCO3': { nombre: 'Bicarbonato', valencia: [1], tipo: 'anion', formula: 'HCO₃⁻' },
    'PO4': { nombre: 'Fosfato', valencia: [3], tipo: 'anion', formula: 'PO₄³⁻' },
    'OH': { nombre: 'Hidróxido', valencia: [1], tipo: 'anion', formula: 'OH⁻' }
};

// Fórmulas comunes
const FORMULAS_COMUNES = {
    'H2O': { nombre: 'Agua', tipo: 'covalente', descripcion: 'Molécula esencial para la vida' },
    'NaCl': { nombre: 'Cloruro de sodio', tipo: 'iónico', descripcion: 'Sal común de mesa' },
    'CO2': { nombre: 'Dióxido de carbono', tipo: 'covalente', descripcion: 'Gas de efecto invernadero' },
    'CaCO3': { nombre: 'Carbonato de calcio', tipo: 'iónico', descripcion: 'Componente de la cal y mármol' },
    'H2SO4': { nombre: 'Ácido sulfúrico', tipo: 'ácido', descripcion: 'Ácido fuerte muy corrosivo' },
    'NH3': { nombre: 'Amoníaco', tipo: 'covalente', descripcion: 'Gas con olor característico' },
    'CH4': { nombre: 'Metano', tipo: 'covalente', descripción: 'Principal componente del gas natural' },
    'HCl': { nombre: 'Ácido clorhídrico', tipo: 'ácido', descripcion: 'Ácido fuerte común en laboratorio' }
};

// Estado global de la aplicación
const state = {
    elementosSeleccionados: [],
    formulaActual: '',
    validacionActual: null,
    estadisticas: {
        formulasCreadas: 0,
        correctas: 0,
        tipos: new Set(),
        elementos: new Set()
    },
    historial: []
};

/**
 * Clase principal del Constructor de Fórmulas Químicas
 */
class ConstructorFormulas {
    constructor() {
        this.initializeElements();
        this.setupInteractions();
        this.loadFromStorage();
        this.updateUI();
    }

    /**
     * Inicializa todos los elementos de la interfaz
     */
    initializeElements() {
        this.elementosPanel = document.getElementById('elementos-panel');
        this.zonaReactivos = document.getElementById('zona-reactivos');
        this.zonaProducto = document.getElementById('zona-producto');
        this.formulaResultado = document.getElementById('formula-resultado');
        this.estadoValidacion = document.getElementById('estado-validacion');
        this.valenciasInfo = document.getElementById('valencias-info');
        this.tipoEnlace = document.getElementById('tipo-enlace');
        this.historialFormulas = document.getElementById('historial-formulas');

        // Generar elementos químicos
        this.generarElementos();

        // Configurar event listeners
        this.setupEventListeners();
    }

    /**
     * Genera los elementos químicos en el panel
     */
    generarElementos() {
        const todos = { ...ELEMENTOS, ...IONES };

        Object.entries(todos).forEach(([simbolo, datos]) => {
            const elemento = document.createElement('div');
            elemento.className = `elemento ${datos.tipo}`;
            elemento.dataset.simbolo = simbolo;
            elemento.dataset.tipo = datos.tipo;
            elemento.draggable = false; // Interact.js maneja el dragging

            elemento.innerHTML = `
                <div class="elemento-simbolo">${simbolo}</div>
                <div class="elemento-numero">${datos.numero || ''}</div>
            `;

            // Tooltip con información
            elemento.title = `${datos.nombre} - Valencia: ${datos.valencia.join(', ')}`;

            this.elementosPanel.appendChild(elemento);
        });
    }

    /**
     * Configura las interacciones de drag & drop con Interact.js
     */
    setupInteractions() {
        // Hacer elementos arrastrables
        interact('.elemento').draggable({
            inertia: false,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,

            listeners: {
                start: (event) => {
                    const elemento = event.target;
                    elemento.classList.add('dragging');
                    this.mostrarToast('Arrastra el elemento a la zona de construcción');
                },

                move: (event) => {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },

                end: (event) => {
                    const elemento = event.target;
                    elemento.classList.remove('dragging');

                    // Reset position
                    elemento.style.transform = '';
                    elemento.setAttribute('data-x', 0);
                    elemento.setAttribute('data-y', 0);
                }
            }
        });

        // Configurar zona de drop
        interact('#zona-reactivos').dropzone({
            accept: '.elemento',
            overlap: 0.5,

            ondragenter: (event) => {
                const dropzone = event.target;
                dropzone.classList.add('drag-over');
            },

            ondragleave: (event) => {
                const dropzone = event.target;
                dropzone.classList.remove('drag-over');
            },

            ondrop: (event) => {
                const elemento = event.relatedTarget;
                const simbolo = elemento.dataset.simbolo;

                this.agregarElemento(simbolo);
                event.target.classList.remove('drag-over');

                // Animación de éxito
                this.animateSuccess(elemento);
            }
        });
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Filtro de elementos
        document.getElementById('filtroTipo').addEventListener('change', (e) => {
            this.filtrarElementos(e.target.value);
        });

        // Limpiar área
        document.getElementById('limpiar-area').addEventListener('click', () => {
            this.limpiarArea();
        });

        // Fórmulas comunes
        document.querySelectorAll('.formula-common').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const formula = e.target.dataset.formula;
                this.cargarFormulaComun(formula);
            });
        });

        // Logo flotante
        document.querySelector('.logo-flotante').addEventListener('click', () => {
            this.mostrarInformacion();
        });
    }

    /**
     * Agrega un elemento a la zona de construcción
     */
    agregarElemento(simbolo) {
        const elemento = ELEMENTOS[simbolo] || IONES[simbolo];
        if (!elemento) return;

        // Verificar si ya existe
        const existente = state.elementosSeleccionados.find(e => e.simbolo === simbolo);
        if (existente) {
            existente.cantidad++;
        } else {
            state.elementosSeleccionados.push({
                simbolo,
                cantidad: 1,
                elemento
            });
        }

        this.actualizarZonaReactivos();
        this.calcularFormula();
        this.validarFormula();
        this.updateUI();

        // Efecto de sonido (si está disponible)
        this.playSound('drop');
    }

    /**
     * Actualiza la visualización de la zona de reactivos
     */
    actualizarZonaReactivos() {
        const placeholder = this.zonaReactivos.querySelector('.drop-placeholder');

        if (state.elementosSeleccionados.length === 0) {
            placeholder.style.display = 'block';
            return;
        }

        placeholder.style.display = 'none';

        // Crear elementos de construcción
        const elementosHTML = state.elementosSeleccionados.map((item, index) => {
            return `
                <div class="elemento-construccion" data-index="${index}">
                    <span class="simbolo">${item.simbolo}</span>
                    ${item.cantidad > 1 ? `<span class="cantidad">${item.cantidad}</span>` : ''}
                    <button class="btn-remove" onclick="constructorFormulas.removerElemento(${index})">
                        ×
                    </button>
                </div>
            `;
        }).join('');

        // Actualizar contenido
        const container = this.zonaReactivos.querySelector('.drop-placeholder').parentNode;
        container.innerHTML = `
            <div class="elementos-construccion">${elementosHTML}</div>
            <div class="drop-placeholder" style="display: none;">
                <i class="bi bi-plus-circle-dotted fs-1 text-muted"></i>
                <p class="text-muted mt-2">Arrastra elementos aquí</p>
            </div>
        `;
    }

    /**
     * Remueve un elemento de la construcción
     */
    removerElemento(index) {
        const item = state.elementosSeleccionados[index];
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            state.elementosSeleccionados.splice(index, 1);
        }

        this.actualizarZonaReactivos();
        this.calcularFormula();
        this.validarFormula();
        this.updateUI();

        this.playSound('remove');
    }

    /**
     * Calcula la fórmula química basada en los elementos seleccionados
     */
    calcularFormula() {
        if (state.elementosSeleccionados.length < 2) {
            state.formulaActual = '';
            this.formulaResultado.innerHTML = '<span class="formula-placeholder">Fórmula</span>';
            return;
        }

        // Algoritmo de balanceamiento simple
        const formula = this.balancearFormula(state.elementosSeleccionados);
        state.formulaActual = formula;

        // Mostrar fórmula con subíndices
        const formulaHTML = this.formatearFormula(formula);
        this.formulaResultado.innerHTML = `<span class="formula-result">${formulaHTML}</span>`;
    }

    /**
     * Balancea la fórmula química usando valencias
     */
    balancearFormula(elementos) {
        if (elementos.length !== 2) {
            // Para más de 2 elementos, usa algoritmo más complejo
            return this.construirFormulaCompleja(elementos);
        }

        const [elem1, elem2] = elementos;
        const valencia1 = elem1.elemento.valencia[0];
        const valencia2 = elem2.elemento.valencia[0];

        // Calcular mínimo común múltiplo para balancear
        const mcm = this.calcularMCM(valencia1, valencia2);
        const coef1 = mcm / valencia1;
        const coef2 = mcm / valencia2;

        let formula = '';

        // Construir fórmula
        if (coef1 > 1) formula += elem1.simbolo + coef1;
        else formula += elem1.simbolo;

        if (coef2 > 1) formula += elem2.simbolo + coef2;
        else formula += elem2.simbolo;

        return formula;
    }

    /**
     * Construye fórmula para compuestos complejos
     */
    construirFormulaCompleja(elementos) {
        // Simplificado: concatena elementos con sus cantidades
        return elementos.map(e => {
            return e.cantidad > 1 ? `${e.simbolo}${e.cantidad}` : e.simbolo;
        }).join('');
    }

    /**
     * Formatea la fórmula con subíndices HTML
     */
    formatearFormula(formula) {
        return formula.replace(/(\d+)/g, '<span class="subindice">$1</span>');
    }

    /**
     * Valida la fórmula actual
     */
    validarFormula() {
        if (!state.formulaActual) {
            this.mostrarValidacion('neutral', 'Construye una fórmula para validar');
            return;
        }

        const validacion = this.analizarFormula(state.formulaActual);
        state.validacionActual = validacion;

        if (validacion.esValida) {
            this.mostrarValidacion('success', '¡Fórmula correcta!', validacion);
            this.formulaResultado.parentElement.classList.add('validacion-correcta');
            this.formulaResultado.parentElement.classList.remove('validacion-incorrecta');
        } else {
            this.mostrarValidacion('error', validacion.error, validacion);
            this.formulaResultado.parentElement.classList.add('validacion-incorrecta');
            this.formulaResultado.parentElement.classList.remove('validacion-correcta');
        }

        this.actualizarInformacionQuimica(validacion);
    }

    /**
     * Analiza la validez de una fórmula química
     */
    analizarFormula(formula) {
        const elementos = state.elementosSeleccionados;

        if (elementos.length < 2) {
            return { esValida: false, error: 'Se necesitan al menos 2 elementos' };
        }

        // Verificar balanceamiento de cargas
        let cargaTotal = 0;
        let tipoEnlace = 'covalente';

        elementos.forEach(item => {
            const valencias = item.elemento.valencia;
            const valencia = valencias[0]; // Usar primera valencia por simplicidad

            // Determinar si el elemento es metal o no metal para tipo de enlace
            if (item.elemento.tipo === 'metal' && elementos.some(e => e.elemento.tipo === 'no-metal')) {
                tipoEnlace = 'iónico';
            }

            cargaTotal += valencia * item.cantidad;
        });

        const esBalanceada = Math.abs(cargaTotal) < 0.1; // Tolerancia para errores de redondeo

        return {
            esValida: esBalanceada,
            error: esBalanceada ? null : 'Las cargas no están balanceadas',
            tipoEnlace,
            cargaTotal,
            elementos: elementos.map(e => ({
                simbolo: e.simbolo,
                valencia: e.elemento.valencia[0],
                tipo: e.elemento.tipo
            }))
        };
    }

    /**
     * Muestra el resultado de la validación
     */
    mostrarValidacion(tipo, mensaje, validacion = null) {
        let alertClass, icon;

        switch (tipo) {
            case 'success':
                alertClass = 'alert-success';
                icon = 'bi-check-circle-fill';
                break;
            case 'error':
                alertClass = 'alert-danger';
                icon = 'bi-x-circle-fill';
                break;
            default:
                alertClass = 'alert-secondary';
                icon = 'bi-hourglass-split';
        }

        this.estadoValidacion.innerHTML = `
            <div class="alert ${alertClass}">
                <i class="bi ${icon} me-2"></i>
                ${mensaje}
            </div>
        `;

        if (validacion && validacion.esValida) {
            // Actualizar estadísticas
            this.actualizarEstadisticas();

            // Guardar en historial
            this.guardarEnHistorial(state.formulaActual, validacion.tipoEnlace);

            // Efectos de éxito
            this.celebrarExito();
        }
    }

    /**
     * Actualiza la información química mostrada
     */
    actualizarInformacionQuimica(validacion) {
        // Mostrar valencias
        const valenciasList = state.elementosSeleccionados.map(item => {
            return `<strong>${item.simbolo}</strong>: ${item.elemento.valencia.join(', ')}`;
        }).join(' | ');

        this.valenciasInfo.innerHTML = valenciasList || 'No hay elementos seleccionados';

        // Mostrar tipo de enlace
        if (validacion) {
            let badgeClass = 'bg-secondary';
            if (validacion.tipoEnlace === 'iónico') badgeClass = 'bg-primary';
            if (validacion.tipoEnlace === 'covalente') badgeClass = 'bg-success';

            this.tipoEnlace.className = `badge ${badgeClass}`;
            this.tipoEnlace.textContent = validacion.tipoEnlace.charAt(0).toUpperCase() + validacion.tipoEnlace.slice(1);
        } else {
            this.tipoEnlace.className = 'badge bg-secondary';
            this.tipoEnlace.textContent = 'No determinado';
        }

        // Mostrar información del compuesto si es conocido
        this.mostrarInformacionCompuesto(state.formulaActual);
    }

    /**
     * Muestra información adicional sobre compuestos conocidos
     */
    mostrarInformacionCompuesto(formula) {
        const compuesto = FORMULAS_COMUNES[formula];
        const panelInfo = document.getElementById('info-compuesto');
        const contenido = document.getElementById('info-contenido');

        if (compuesto) {
            contenido.innerHTML = `
                <strong>${compuesto.nombre}</strong><br>
                <small class="text-muted">Tipo: ${compuesto.tipo}</small><br>
                ${compuesto.descripcion}
            `;
            panelInfo.classList.remove('d-none');
        } else {
            panelInfo.classList.add('d-none');
        }
    }

    /**
     * Actualiza las estadísticas del usuario
     */
    actualizarEstadisticas() {
        state.estadisticas.formulasCreadas++;
        if (state.validacionActual && state.validacionActual.esValida) {
            state.estadisticas.correctas++;
            state.estadisticas.tipos.add(state.validacionActual.tipoEnlace);
        }

        state.elementosSeleccionados.forEach(item => {
            state.estadisticas.elementos.add(item.simbolo);
        });
    }

    /**
     * Guarda una fórmula en el historial
     */
    guardarEnHistorial(formula, tipo) {
        const entrada = {
            formula,
            tipo,
            timestamp: new Date(),
            esValida: state.validacionActual.esValida
        };

        state.historial.unshift(entrada);
        if (state.historial.length > CONFIG.storage.historyLimit) {
            state.historial.pop();
        }

        this.actualizarHistorial();
        this.saveToStorage();
    }

    /**
     * Actualiza la visualización del historial
     */
    actualizarHistorial() {
        if (state.historial.length === 0) {
            this.historialFormulas.innerHTML = '<div class="text-muted">Tus fórmulas aparecerán aquí</div>';
            return;
        }

        const historialHTML = state.historial.slice(0, 5).map(entrada => {
            const iconClass = entrada.esValida ? 'bi-check-circle text-success' : 'bi-x-circle text-danger';
            const formulaHTML = this.formatearFormula(entrada.formula);

            return `
                <div class="historial-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="historial-formula">${formulaHTML}</span>
                            <div class="historial-tipo">${entrada.tipo}</div>
                        </div>
                        <i class="bi ${iconClass}"></i>
                    </div>
                </div>
            `;
        }).join('');

        this.historialFormulas.innerHTML = historialHTML;
    }

    /**
     * Filtra elementos por tipo
     */
    filtrarElementos(tipo) {
        const elementos = document.querySelectorAll('.elemento');

        elements.forEach(elemento => {
            if (tipo === 'todos' || elemento.dataset.tipo === tipo) {
                elemento.style.display = 'flex';
            } else {
                elemento.style.display = 'none';
            }
        });
    }

    /**
     * Limpia el área de construcción
     */
    limpiarArea() {
        state.elementosSeleccionados = [];
        state.formulaActual = '';
        state.validacionActual = null;

        this.actualizarZonaReactivos();
        this.formulaResultado.innerHTML = '<span class="formula-placeholder">Fórmula</span>';
        this.formulaResultado.parentElement.classList.remove('validacion-correcta', 'validacion-incorrecta');

        this.mostrarValidacion('neutral', 'Esperando fórmula...');
        this.valenciasInfo.innerHTML = 'Selecciona elementos para ver sus valencias';
        this.tipoEnlace.className = 'badge bg-secondary';
        this.tipoEnlace.textContent = 'No determinado';

        document.getElementById('info-compuesto').classList.add('d-none');

        this.playSound('clear');
    }

    /**
     * Carga una fórmula común predefinida
     */
    cargarFormulaComun(formula) {
        this.limpiarArea();

        // Parsear la fórmula y agregar elementos
        const elementos = this.parsearFormula(formula);
        elementos.forEach(({ simbolo, cantidad }) => {
            for (let i = 0; i < cantidad; i++) {
                this.agregarElemento(simbolo);
            }
        });

        this.mostrarToast(`Fórmula ${formula} cargada`);
    }

    /**
     * Parsea una fórmula química simple
     */
    parsearFormula(formula) {
        const elementos = [];
        const regex = /([A-Z][a-z]?)(\d*)/g;
        let match;

        while ((match = regex.exec(formula)) !== null) {
            const simbolo = match[1];
            const cantidad = parseInt(match[2]) || 1;
            elementos.push({ simbolo, cantidad });
        }

        return elementos;
    }

    /**
     * Actualiza toda la interfaz de usuario
     */
    updateUI() {
        // Actualizar estadísticas
        document.getElementById('stat-formulas').textContent = state.estadisticas.formulasCreadas;
        document.getElementById('stat-correctas').textContent = state.estadisticas.correctas;
        document.getElementById('stat-tipos').textContent = state.estadisticas.tipos.size;
        document.getElementById('stat-elementos').textContent = state.estadisticas.elementos.size;

        // Calcular y mostrar progreso
        const totalPosible = 50; // Objetivo arbitrario
        const progreso = Math.min((state.estadisticas.formulasCreadas / totalPosible) * 100, 100);
        document.getElementById('progreso-porcentaje').textContent = `${Math.round(progreso)}%`;
        document.getElementById('barra-progreso').style.width = `${progreso}%`;
    }

    /**
     * Utilidades matemáticas
     */
    calcularMCM(a, b) {
        return Math.abs(a * b) / this.calcularMCD(a, b);
    }

    calcularMCD(a, b) {
        return b === 0 ? a : this.calcularMCD(b, a % b);
    }

    /**
     * Efectos visuales y sonoros
     */
    animateSuccess(elemento) {
        elemento.style.animation = 'fadeInUp 0.3s ease-out';
        setTimeout(() => {
            elemento.style.animation = '';
        }, 300);
    }

    celebrarExito() {
        // Efecto de confetti (simplificado)
        document.body.style.animation = 'pulse 0.3s ease-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }

    playSound(type) {
        // Placeholder para efectos de sonido
        if ('vibrate' in navigator && type === 'drop') {
            navigator.vibrate(50);
        }
    }

    /**
     * Gestión de almacenamiento local
     */
    saveToStorage() {
        if (!CONFIG.validation.autoSave) return;

        try {
            const data = {
                estadisticas: {
                    ...state.estadisticas,
                    tipos: Array.from(state.estadisticas.tipos),
                    elementos: Array.from(state.estadisticas.elementos)
                },
                historial: state.historial,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem(CONFIG.storage.key, JSON.stringify(data));
        } catch (error) {
            console.warn('No se pudo guardar en localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(CONFIG.storage.key);
            if (data) {
                const parsed = JSON.parse(data);

                if (parsed.estadisticas) {
                    state.estadisticas = {
                        ...parsed.estadisticas,
                        tipos: new Set(parsed.estadisticas.tipos || []),
                        elementos: new Set(parsed.estadisticas.elementos || [])
                    };
                }

                if (parsed.historial) {
                    state.historial = parsed.historial.map(entrada => ({
                        ...entrada,
                        timestamp: new Date(entrada.timestamp)
                    }));
                }
            }
        } catch (error) {
            console.warn('No se pudo cargar desde localStorage:', error);
        }
    }

    /**
     * Muestra información sobre la aplicación
     */
    mostrarInformacion() {
        this.mostrarToast('Constructor de Fórmulas Químicas v1.0 - meskeIA', 'info');
    }

    /**
     * Sistema de notificaciones toast
     */
    mostrarToast(mensaje, tipo = 'info') {
        const toast = document.getElementById('toast-notificacion');
        const mensaje_elem = document.getElementById('toast-mensaje');

        mensaje_elem.textContent = mensaje;

        // Mostrar toast usando Bootstrap
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global
    window.constructorFormulas = new ConstructorFormulas();

    // Registro para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Error al registrar Service Worker'));
    }

    // Configuración de números españoles
    const formatNumber = (num) => {
        return new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(num);
    };

    // Aplicar formato español a números en la interfaz
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-number]').forEach(elem => {
            const number = parseFloat(elem.dataset.number);
            elem.textContent = formatNumber(number);
        });
    });

    console.log('✅ Constructor de Fórmulas Químicas inicializado - meskeIA');
});