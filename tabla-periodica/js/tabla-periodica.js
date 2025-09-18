/* =========================================
   TABLA PERIÓDICA INTERACTIVA - meskeIA
   Clase principal para manejo de la tabla
   ========================================= */

class TablaPeriodica {
    constructor(contenedorId) {
        this.contenedor = document.getElementById(contenedorId);
        this.elementos = elementosQuimicos;
        this.elementosFiltrados = [...this.elementos];
        this.elementoActual = null;

        this.init();
    }

    init() {
        this.crearTabla();
        this.configurarEventos();
        this.aplicarFiltros();
    }

    crearTabla() {
        // Limpiar contenedor
        this.contenedor.innerHTML = '';

        // Crear grid de 18x7 para tabla periódica estándar
        this.contenedor.style.gridTemplateColumns = 'repeat(18, 1fr)';
        this.contenedor.style.gridTemplateRows = 'repeat(10, 1fr)';

        // Crear array para posiciones de la tabla
        const posiciones = this.crearPosicionesTabla();

        // Crear elementos HTML
        this.elementos.forEach(elemento => {
            const elementoDiv = this.crearElementoHTML(elemento);

            // Posicionar elemento según su posición en la tabla
            const pos = posiciones[elemento.numero] || this.calcularPosicion(elemento);
            elementoDiv.style.gridColumn = pos.columna;
            elementoDiv.style.gridRow = pos.fila;

            this.contenedor.appendChild(elementoDiv);
        });
    }

    crearPosicionesTabla() {
        // Posiciones específicas para algunos elementos clave
        const posicionesEspeciales = {
            // Período 1
            1: { fila: 1, columna: 1 },    // H
            2: { fila: 1, columna: 18 },   // He

            // Período 2
            3: { fila: 2, columna: 1 },    // Li
            4: { fila: 2, columna: 2 },    // Be
            5: { fila: 2, columna: 13 },   // B
            6: { fila: 2, columna: 14 },   // C
            7: { fila: 2, columna: 15 },   // N
            8: { fila: 2, columna: 16 },   // O
            9: { fila: 2, columna: 17 },   // F
            10: { fila: 2, columna: 18 },  // Ne

            // Período 3
            11: { fila: 3, columna: 1 },   // Na
            12: { fila: 3, columna: 2 },   // Mg
            13: { fila: 3, columna: 13 },  // Al
            14: { fila: 3, columna: 14 },  // Si
            15: { fila: 3, columna: 15 },  // P
            16: { fila: 3, columna: 16 },  // S
            17: { fila: 3, columna: 17 },  // Cl
            18: { fila: 3, columna: 18 },  // Ar

            // Período 4
            19: { fila: 4, columna: 1 },   // K
            20: { fila: 4, columna: 2 },   // Ca
            21: { fila: 4, columna: 3 },   // Sc
            22: { fila: 4, columna: 4 },   // Ti
            23: { fila: 4, columna: 5 },   // V
            24: { fila: 4, columna: 6 },   // Cr
            25: { fila: 4, columna: 7 },   // Mn
            26: { fila: 4, columna: 8 },   // Fe
            27: { fila: 4, columna: 9 },   // Co
            28: { fila: 4, columna: 10 },  // Ni
            29: { fila: 4, columna: 11 },  // Cu
            30: { fila: 4, columna: 12 },  // Zn
            31: { fila: 4, columna: 13 },  // Ga
            32: { fila: 4, columna: 14 },  // Ge
            33: { fila: 4, columna: 15 },  // As
            34: { fila: 4, columna: 16 },  // Se
            35: { fila: 4, columna: 17 },  // Br
            36: { fila: 4, columna: 18 },  // Kr

            // Período 5 - elementos clave
            37: { fila: 5, columna: 1 },   // Rb
            47: { fila: 5, columna: 11 },  // Ag
            53: { fila: 5, columna: 17 },  // I
            54: { fila: 5, columna: 18 },  // Xe

            // Período 6 - elementos clave
            79: { fila: 6, columna: 11 },  // Au
            80: { fila: 6, columna: 12 },  // Hg
            82: { fila: 6, columna: 14 },  // Pb
            86: { fila: 6, columna: 18 },  // Rn

            // Lantánidos (fila 8)
            92: { fila: 9, columna: 4 },   // U (representativo de actínidos)

            // Elementos sintéticos
            118: { fila: 7, columna: 18 }  // Og
        };

        return posicionesEspeciales;
    }

    calcularPosicion(elemento) {
        // Posición por defecto basada en período y grupo
        let fila = elemento.periodo;
        let columna = elemento.grupo;

        // Ajustar para lantánidos y actínidos
        if (elemento.familia === 'lantanidos') {
            fila = 8;
            columna = elemento.numero - 56; // Ajuste aproximado
        } else if (elemento.familia === 'actinidos') {
            fila = 9;
            columna = elemento.numero - 88; // Ajuste aproximado
        }

        return { fila, columna };
    }

    crearElementoHTML(elemento) {
        const div = document.createElement('div');
        div.className = `elemento ${elemento.familia}`;
        div.dataset.numero = elemento.numero;
        div.dataset.simbolo = elemento.simbolo;

        div.innerHTML = `
            <div class="numero-atomico">${elemento.numero}</div>
            <div class="simbolo">${elemento.simbolo}</div>
            <div class="nombre">${elemento.nombre}</div>
            <div class="masa">${elemento.masa.toFixed(elemento.masa % 1 === 0 ? 0 : 1)}</div>
        `;

        // Eventos - Diferentes para dispositivos táctiles y ratón
        if (this.esPantallaTouch()) {
            // En dispositivos táctiles: SOLO click para modal, NO tooltips NUNCA
            div.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.limpiarTodosLosTooltips();
                this.mostrarInfoElemento(elemento);
            });

            // Prevenir cualquier evento que pueda generar tooltips
            div.addEventListener('touchstart', (e) => {
                this.limpiarTodosLosTooltips();
            });

            div.addEventListener('touchend', (e) => {
                this.limpiarTodosLosTooltips();
            });

            // Desactivar hover completamente
            div.style.pointerEvents = 'auto';
            div.addEventListener('mouseenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.limpiarTodosLosTooltips();
            });

            div.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.limpiarTodosLosTooltips();
            });

        } else {
            // En dispositivos con ratón: hover para tooltip y click para modal
            div.addEventListener('click', () => {
                this.ocultarTooltip();
                this.mostrarInfoElemento(elemento);
            });
            div.addEventListener('mouseenter', (e) => this.mostrarTooltip(e, elemento));
            div.addEventListener('mouseleave', () => this.ocultarTooltip());
        }

        return div;
    }

    esPantallaTouch() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    mostrarTooltip(event, elemento) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <strong>${elemento.nombre}</strong><br>
            Número: ${elemento.numero}<br>
            Masa: ${elemento.masa} u<br>
            Estado: ${elemento.estado}
        `;

        // Agregar al DOM primero para obtener dimensiones reales
        tooltip.style.opacity = '0';
        tooltip.style.position = 'fixed';
        document.body.appendChild(tooltip);

        // Obtener dimensiones del elemento y tooltip
        const rect = event.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Calcular posición centrada horizontalmente
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 5; // Solo 5px de separación

        // Ajustar si el tooltip se sale del viewport
        // Verificar límite izquierdo
        if (left < 5) {
            left = 5;
        }
        // Verificar límite derecho
        if (left + tooltipRect.width > window.innerWidth - 5) {
            left = window.innerWidth - tooltipRect.width - 5;
        }

        // Si no hay espacio arriba, mostrar debajo
        if (top < 5) {
            top = rect.bottom + 5;
            tooltip.classList.add('tooltip-below');
        }

        // Aplicar posición final
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';

        // Pequeño retraso para asegurar transición suave
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        this.tooltipActual = tooltip;
    }

    ocultarTooltip() {
        if (this.tooltipActual) {
            this.tooltipActual.remove();
            this.tooltipActual = null;
        }
    }

    limpiarTodosLosTooltips() {
        // Método ultra-agresivo para eliminar TODOS los tooltips

        // Limpiar referencia actual
        this.tooltipActual = null;

        // Eliminar por múltiples selectores
        const selectores = [
            '.tooltip',
            '[class*="tooltip"]',
            '[style*="position: fixed"]',
            '[style*="z-index: 1000"]',
            '[style*="pointer-events: none"]'
        ];

        selectores.forEach(selector => {
            try {
                const elementos = document.querySelectorAll(selector);
                elementos.forEach(el => {
                    if (el.classList.contains('tooltip') ||
                        el.textContent.includes('Número:') ||
                        el.textContent.includes('Masa:') ||
                        el.style.position === 'fixed') {
                        el.remove();
                    }
                });
            } catch (e) {
                // Ignorar errores de selector
            }
        });

        // Eliminar cualquier elemento con contenido similar a tooltip
        const todosLosElementos = document.querySelectorAll('*');
        todosLosElementos.forEach(el => {
            if (el.style.position === 'fixed' &&
                el.style.zIndex >= 1000 &&
                el !== document.getElementById('info-panel') &&
                !el.classList.contains('meskeia-logo-container')) {
                el.remove();
            }
        });

        // Forzar limpieza del DOM
        setTimeout(() => {
            const tooltipsRestantes = document.querySelectorAll('.tooltip');
            tooltipsRestantes.forEach(t => t.remove());
        }, 1);
    }

    mostrarInfoElemento(elemento) {
        // Limpieza ultra-agresiva usando el nuevo método
        this.limpiarTodosLosTooltips();

        // Limpieza inmediata y repetitiva para casos extremos
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.limpiarTodosLosTooltips();
            }, i * 10);
        }

        const panel = document.getElementById('info-panel');

        // Actualizar información
        document.getElementById('info-simbolo').textContent = elemento.simbolo;
        document.getElementById('info-simbolo').className = `elemento-simbolo ${elemento.familia}`;
        document.getElementById('info-nombre').textContent = elemento.nombre;
        document.getElementById('info-numero').textContent = `Número atómico: ${elemento.numero}`;
        document.getElementById('info-masa').textContent = `Masa atómica: ${this.formatearNumero(elemento.masa)} u`;
        document.getElementById('info-grupo').textContent = elemento.grupo;
        document.getElementById('info-periodo').textContent = elemento.periodo;
        document.getElementById('info-familia').textContent = this.formatearFamilia(elemento.familia);
        document.getElementById('info-estado').textContent = this.formatearEstado(elemento.estado);
        document.getElementById('info-radio').textContent = elemento.radioAtomico ? `${elemento.radioAtomico} pm` : 'No disponible';
        document.getElementById('info-electronegatividad').textContent = elemento.electronegatividad ? this.formatearNumero(elemento.electronegatividad) : 'No disponible';

        // Usos
        const usosLista = document.getElementById('info-usos');
        usosLista.innerHTML = '';
        elemento.usos.forEach(uso => {
            const li = document.createElement('li');
            li.textContent = uso;
            usosLista.appendChild(li);
        });

        // Dato curioso
        document.getElementById('info-dato-curioso').textContent = elemento.datoCurioso;

        // Mostrar panel
        panel.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        this.elementoActual = elemento;
    }

    cerrarInfoPanel() {
        const panel = document.getElementById('info-panel');
        panel.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.elementoActual = null;
    }

    configurarEventos() {
        // Botón cerrar info
        document.getElementById('btn-cerrar-info').addEventListener('click', () => {
            this.cerrarInfoPanel();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elementoActual) {
                this.cerrarInfoPanel();
            }
        });

        // Filtros
        document.getElementById('filtro-familia').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtro-estado').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('buscar-elemento').addEventListener('input', () => this.aplicarFiltros());

        // Sliders
        document.getElementById('rango-masa').addEventListener('input', () => this.aplicarFiltros());
        document.getElementById('rango-radio').addEventListener('input', () => this.aplicarFiltros());

        // Limpiar filtros
        document.getElementById('btn-limpiar-filtros').addEventListener('click', () => this.limpiarFiltros());
    }

    aplicarFiltros() {
        const filtroFamilia = document.getElementById('filtro-familia').value;
        const filtroEstado = document.getElementById('filtro-estado').value;
        const textoBusqueda = document.getElementById('buscar-elemento').value.toLowerCase();
        const rangoMasa = parseFloat(document.getElementById('rango-masa').value);
        const rangoRadio = parseFloat(document.getElementById('rango-radio').value);

        // Actualizar etiquetas de valores
        document.getElementById('valor-masa').textContent = `1 - ${rangoMasa}`;
        document.getElementById('valor-radio').textContent = `30 - ${rangoRadio}`;

        // Filtrar elementos
        this.elementosFiltrados = this.elementos.filter(elemento => {
            // Filtro por familia
            if (filtroFamilia !== 'todos' && elemento.familia !== filtroFamilia) {
                return false;
            }

            // Filtro por estado
            if (filtroEstado !== 'todos' && elemento.estado !== filtroEstado) {
                return false;
            }

            // Filtro por texto
            if (textoBusqueda && !this.coincideTexto(elemento, textoBusqueda)) {
                return false;
            }

            // Filtro por masa
            if (elemento.masa > rangoMasa) {
                return false;
            }

            // Filtro por radio atómico
            if (elemento.radioAtomico && elemento.radioAtomico > rangoRadio) {
                return false;
            }

            return true;
        });

        this.actualizarVisualizacion();
    }

    coincideTexto(elemento, texto) {
        return elemento.nombre.toLowerCase().includes(texto) ||
               elemento.simbolo.toLowerCase().includes(texto) ||
               elemento.numero.toString().includes(texto);
    }

    actualizarVisualizacion() {
        const todosElementos = this.contenedor.querySelectorAll('.elemento');

        todosElementos.forEach(div => {
            const numero = parseInt(div.dataset.numero);
            const estaFiltrado = this.elementosFiltrados.some(el => el.numero === numero);

            if (estaFiltrado) {
                div.classList.remove('filtrado', 'oculto');
            } else {
                div.classList.add('filtrado');
            }
        });
    }

    limpiarFiltros() {
        document.getElementById('filtro-familia').value = 'todos';
        document.getElementById('filtro-estado').value = 'todos';
        document.getElementById('buscar-elemento').value = '';
        document.getElementById('rango-masa').value = 300;
        document.getElementById('rango-radio').value = 300;

        this.aplicarFiltros();
    }

    formatearFamilia(familia) {
        const familias = {
            'metales-alcalinos': 'Metales Alcalinos',
            'metales-alcalinoterreos': 'Metales Alcalinotérreos',
            'metales-transicion': 'Metales de Transición',
            'metaloides': 'Metaloides',
            'no-metales': 'No Metales',
            'halogenos': 'Halógenos',
            'gases-nobles': 'Gases Nobles',
            'lantanidos': 'Lantánidos',
            'actinidos': 'Actínidos'
        };
        return familias[familia] || familia;
    }

    formatearEstado(estado) {
        const estados = {
            'solido': 'Sólido',
            'liquido': 'Líquido',
            'gas': 'Gas',
            'sintetico': 'Sintético'
        };
        return estados[estado] || estado;
    }

    formatearNumero(numero) {
        return numero.toString().replace('.', ',');
    }

    // Método para obtener elemento aleatorio (para el juego)
    obtenerElementoAleatorio() {
        return this.elementosFiltrados[Math.floor(Math.random() * this.elementosFiltrados.length)];
    }

    // Resaltar elemento específico
    resaltarElemento(numero, clase = 'destacado') {
        const elemento = this.contenedor.querySelector(`[data-numero="${numero}"]`);
        if (elemento) {
            elemento.classList.add(clase);
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Quitar resaltado
    quitarResaltado(numero, clase = 'destacado') {
        const elemento = this.contenedor.querySelector(`[data-numero="${numero}"]`);
        if (elemento) {
            elemento.classList.remove(clase);
        }
    }

    // Obtener estadísticas
    obtenerEstadisticas() {
        return {
            total: this.elementos.length,
            filtrados: this.elementosFiltrados.length,
            porFamilia: this.contarPorPropiedad('familia'),
            porEstado: this.contarPorPropiedad('estado')
        };
    }

    contarPorPropiedad(propiedad) {
        const conteo = {};
        this.elementosFiltrados.forEach(elemento => {
            const valor = elemento[propiedad];
            conteo[valor] = (conteo[valor] || 0) + 1;
        });
        return conteo;
    }
}