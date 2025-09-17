// visualizaciones.js - Módulo de visualizaciones para estructuras algebraicas

class VisualizadorAlgebraico {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 600;
        this.height = 400;
    }

    // Inicializar canvas para visualización
    inicializarCanvas(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `<canvas id="viz-canvas" width="${this.width}" height="${this.height}"></canvas>`;
        this.canvas = document.getElementById('viz-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Estilo del canvas
        this.canvas.style.border = '1px solid #E5E7EB';
        this.canvas.style.borderRadius = '8px';
        this.canvas.style.background = '#FAFAFA';
    }

    // Dibujar grafo de Cayley
    dibujarGrafoCayley(grupo, generadores) {
        if (!this.ctx) return;

        this.limpiarCanvas();

        const nodos = this.calcularPosicionesNodos(grupo.length);
        const aristas = this.calcularAristas(grupo, generadores);

        // Dibujar aristas
        aristas.forEach(arista => {
            this.dibujarArista(
                nodos[arista.desde],
                nodos[arista.hasta],
                arista.color
            );
        });

        // Dibujar nodos
        nodos.forEach((nodo, idx) => {
            this.dibujarNodo(nodo.x, nodo.y, grupo[idx], idx === 0);
        });
    }

    // Calcular posiciones de nodos en círculo
    calcularPosicionesNodos(n) {
        const nodos = [];
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.35;

        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n - Math.PI / 2;
            nodos.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        return nodos;
    }

    // Calcular aristas del grafo
    calcularAristas(grupo, generadores) {
        const aristas = [];
        const colores = ['#6B46C1', '#9333EA', '#A855F7'];

        generadores.forEach((gen, genIdx) => {
            for (let i = 0; i < grupo.length; i++) {
                const destino = (i + gen) % grupo.length;
                aristas.push({
                    desde: i,
                    hasta: destino,
                    color: colores[genIdx % colores.length]
                });
            }
        });

        return aristas;
    }

    // Dibujar un nodo
    dibujarNodo(x, y, label, esIdentidad = false) {
        const radius = 20;

        // Círculo del nodo
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = esIdentidad ? '#6B46C1' : '#FFFFFF';
        this.ctx.fill();
        this.ctx.strokeStyle = '#6B46C1';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Etiqueta del nodo
        this.ctx.fillStyle = esIdentidad ? '#FFFFFF' : '#1F2937';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, x, y);
    }

    // Dibujar una arista
    dibujarArista(desde, hasta, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(desde.x, desde.y);

        // Si es un bucle (auto-arista)
        if (desde.x === hasta.x && desde.y === hasta.y) {
            this.dibujarBucle(desde.x, desde.y, color);
        } else {
            // Ajustar para no sobreponer los nodos
            const dx = hasta.x - desde.x;
            const dy = hasta.y - desde.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (dx / dist) * 20;
            const offsetY = (dy / dist) * 20;

            this.ctx.moveTo(desde.x + offsetX, desde.y + offsetY);
            this.ctx.lineTo(hasta.x - offsetX, hasta.y - offsetY);

            // Dibujar flecha
            this.dibujarFlecha(
                hasta.x - offsetX,
                hasta.y - offsetY,
                Math.atan2(dy, dx)
            );
        }

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Dibujar bucle (auto-arista)
    dibujarBucle(x, y, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y - 25, 15, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Dibujar punta de flecha
    dibujarFlecha(x, y, angle) {
        const headLength = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - headLength * Math.cos(angle - Math.PI / 6),
            y - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - headLength * Math.cos(angle + Math.PI / 6),
            y - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }

    // Diagrama de Hasse para retículo de subgrupos
    dibujarDiagramaHasse(subgrupos) {
        if (!this.ctx) return;

        this.limpiarCanvas();

        // Organizar subgrupos por niveles (según su orden)
        const niveles = this.organizarNiveles(subgrupos);

        // Calcular posiciones
        const posiciones = this.calcularPosicionesHasse(niveles);

        // Dibujar conexiones
        this.dibujarConexionesHasse(subgrupos, posiciones);

        // Dibujar nodos
        posiciones.forEach(pos => {
            this.dibujarNodoHasse(pos.x, pos.y, pos.label, pos.orden);
        });
    }

    // Organizar subgrupos en niveles según su orden
    organizarNiveles(subgrupos) {
        const niveles = {};

        subgrupos.forEach(sg => {
            const orden = sg.elementos.length;
            if (!niveles[orden]) {
                niveles[orden] = [];
            }
            niveles[orden].push(sg);
        });

        return niveles;
    }

    // Calcular posiciones para diagrama de Hasse
    calcularPosicionesHasse(niveles) {
        const posiciones = [];
        const ordenes = Object.keys(niveles).map(Number).sort((a, b) => a - b);
        const alturaTotal = this.height - 100;
        const nivelHeight = alturaTotal / (ordenes.length - 1 || 1);

        ordenes.forEach((orden, nivelIdx) => {
            const elementosNivel = niveles[orden];
            const anchuraNivel = this.width - 100;
            const espaciado = anchuraNivel / (elementosNivel.length + 1);

            elementosNivel.forEach((elem, elemIdx) => {
                posiciones.push({
                    x: 50 + espaciado * (elemIdx + 1),
                    y: 50 + nivelHeight * nivelIdx,
                    label: elem.notacion,
                    orden: orden,
                    id: elem.id
                });
            });
        });

        return posiciones;
    }

    // Dibujar conexiones en diagrama de Hasse
    dibujarConexionesHasse(subgrupos, posiciones) {
        subgrupos.forEach(sg => {
            sg.contiene.forEach(contenidoId => {
                const posSg = posiciones.find(p => p.id === sg.id);
                const posContenido = posiciones.find(p => p.id === contenidoId);

                if (posSg && posContenido) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(posSg.x, posSg.y);
                    this.ctx.lineTo(posContenido.x, posContenido.y);
                    this.ctx.strokeStyle = '#E5E7EB';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
    }

    // Dibujar nodo en diagrama de Hasse
    dibujarNodoHasse(x, y, label, orden) {
        const radius = Math.min(30, 10 + orden * 2);

        // Nodo
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        this.ctx.strokeStyle = '#6B46C1';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Etiqueta
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, x, y);

        // Orden del subgrupo
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#6B7280';
        this.ctx.fillText(`|${orden}|`, x, y + radius + 15);
    }

    // Visualizar tabla de operación como matriz de colores
    visualizarTablaColores(tabla) {
        if (!this.ctx) return;

        this.limpiarCanvas();

        const n = tabla.length;
        const cellSize = Math.min(this.width, this.height) / (n + 1);
        const offsetX = (this.width - cellSize * (n + 1)) / 2;
        const offsetY = (this.height - cellSize * (n + 1)) / 2;

        // Generar colores para cada elemento
        const colores = this.generarPaletaColores(n);

        // Dibujar celdas
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const valor = tabla[i][j];
                const x = offsetX + cellSize * (j + 1);
                const y = offsetY + cellSize * (i + 1);

                this.ctx.fillStyle = colores[valor];
                this.ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

                // Valor en la celda
                this.ctx.fillStyle = this.esColorOscuro(colores[valor]) ? '#FFFFFF' : '#1F2937';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(valor.toString(), x + cellSize / 2, y + cellSize / 2);
            }
        }

        // Headers
        for (let i = 0; i < n; i++) {
            // Header superior
            const x = offsetX + cellSize * (i + 1);
            const y = offsetY;
            this.ctx.fillStyle = '#6B46C1';
            this.ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(i.toString(), x + cellSize / 2, y + cellSize / 2);

            // Header lateral
            const x2 = offsetX;
            const y2 = offsetY + cellSize * (i + 1);
            this.ctx.fillStyle = '#6B46C1';
            this.ctx.fillRect(x2, y2, cellSize - 1, cellSize - 1);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(i.toString(), x2 + cellSize / 2, y2 + cellSize / 2);
        }

        // Celda esquina
        this.ctx.fillStyle = '#9333EA';
        this.ctx.fillRect(offsetX, offsetY, cellSize - 1, cellSize - 1);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('×', offsetX + cellSize / 2, offsetY + cellSize / 2);
    }

    // Generar paleta de colores
    generarPaletaColores(n) {
        const colores = [];
        for (let i = 0; i < n; i++) {
            const hue = (360 / n) * i;
            colores.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colores;
    }

    // Determinar si un color es oscuro
    esColorOscuro(color) {
        // Simplificado: asume colores HSL
        const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const lightness = parseInt(match[3]);
            return lightness < 50;
        }
        return false;
    }

    // Limpiar canvas
    limpiarCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }

    // Animar transición entre visualizaciones
    animarTransicion(desde, hacia, duracion = 500) {
        const frames = 30;
        const intervalo = duracion / frames;
        let frame = 0;

        const animar = setInterval(() => {
            frame++;
            const progreso = frame / frames;

            // Aplicar easing
            const t = this.easeInOutCubic(progreso);

            // Interpolar y dibujar
            this.limpiarCanvas();
            // Lógica de interpolación aquí

            if (frame >= frames) {
                clearInterval(animar);
            }
        }, intervalo);
    }

    // Función de easing
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Instancia global del visualizador
const visualizador = new VisualizadorAlgebraico();

// Funciones de interfaz
function visualizarGrupo() {
    const tipo = document.getElementById('grupo-visualizar').value;
    const container = 'grafo-cayley';

    visualizador.inicializarCanvas(container);

    switch (tipo) {
        case 'Z4':
            visualizador.dibujarGrafoCayley([0, 1, 2, 3], [1]);
            break;
        case 'Z6':
            visualizador.dibujarGrafoCayley([0, 1, 2, 3, 4, 5], [1]);
            break;
        case 'V4':
            visualizador.dibujarGrafoCayley(['e', 'a', 'b', 'ab'], [1, 2]);
            break;
    }
}

function generarTablaCayleyDemo() {
    const container = document.getElementById('tabla-cayley-demo');
    if (!container) return;

    // Tabla de Klein V4
    const tabla = [
        ['e', 'a', 'b', 'ab'],
        ['a', 'e', 'ab', 'b'],
        ['b', 'ab', 'e', 'a'],
        ['ab', 'b', 'a', 'e']
    ];

    let html = '<table class="tabla-cayley"><thead><tr><th>·</th>';
    tabla[0].forEach(elem => html += `<th>${elem}</th>`);
    html += '</tr></thead><tbody>';

    tabla.forEach((fila, i) => {
        html += `<tr><th>${tabla[0][i]}</th>`;
        fila.forEach(elem => html += `<td>${elem}</td>`);
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function dibujarReticulo() {
    const tipo = document.getElementById('grupo-reticulo').value;
    visualizador.inicializarCanvas('diagrama-hasse');

    // Datos de ejemplo para subgrupos
    const subgrupos = {
        'Z6': [
            { id: 1, notacion: '{0}', elementos: [0], contiene: [] },
            { id: 2, notacion: '{0,3}', elementos: [0, 3], contiene: [1] },
            { id: 3, notacion: '{0,2,4}', elementos: [0, 2, 4], contiene: [1] },
            { id: 4, notacion: 'ℤ₆', elementos: [0, 1, 2, 3, 4, 5], contiene: [2, 3] }
        ],
        'Z12': [
            { id: 1, notacion: '{0}', elementos: [0], contiene: [] },
            { id: 2, notacion: '{0,6}', elementos: [0, 6], contiene: [1] },
            { id: 3, notacion: '{0,4,8}', elementos: [0, 4, 8], contiene: [1] },
            { id: 4, notacion: '{0,3,6,9}', elementos: [0, 3, 6, 9], contiene: [2] },
            { id: 5, notacion: '{0,2,4,6,8,10}', elementos: [0, 2, 4, 6, 8, 10], contiene: [2, 3] },
            { id: 6, notacion: 'ℤ₁₂', elementos: Array.from({length: 12}, (_, i) => i), contiene: [4, 5] }
        ]
    };

    visualizador.dibujarDiagramaHasse(subgrupos[tipo] || subgrupos['Z6']);
}

// Exportar para uso global
window.visualizadorAlgebra = visualizador;