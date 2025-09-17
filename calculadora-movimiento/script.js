// Calculadora de Movimiento - meskeIA
// ===================================

class CalculadoraMovimiento {
    constructor() {
        this.tipoMovimiento = 'mru';
        this.chart = null;
        this.animacion = null;
        this.velocidadAnimacion = 1;

        this.initEventListeners();
        this.initCanvas();
        this.setupChart();
    }

    // Inicializar event listeners
    initEventListeners() {
        // Selector de tipo de movimiento
        document.querySelectorAll('.btn-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.cambiarTipoMovimiento(e.target.dataset.type);
            });
        });

        // Formulario de cálculo
        document.getElementById('parametros-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calcular();
        });

        // Ejemplos predefinidos
        document.querySelectorAll('.btn-example').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.cargarEjemplo(e.target.dataset.example);
            });
        });

        // Controles de animación
        document.getElementById('btn-play').addEventListener('click', () => this.playAnimacion());
        document.getElementById('btn-pause').addEventListener('click', () => this.pauseAnimacion());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetAnimacion());

        // Control de velocidad
        const speedSlider = document.getElementById('speed-slider');
        speedSlider.addEventListener('input', (e) => {
            this.velocidadAnimacion = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = `${e.target.value}x`;
        });
    }

    // Cambiar tipo de movimiento
    cambiarTipoMovimiento(tipo) {
        this.tipoMovimiento = tipo;

        // Actualizar botones activos
        document.querySelectorAll('.btn-type').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${tipo}"]`).classList.add('active');

        // Mostrar/ocultar campos según el tipo
        const aceleracionGroup = document.getElementById('aceleracion-group');
        const anguloGroup = document.getElementById('angulo-group');

        switch(tipo) {
            case 'mru':
                aceleracionGroup.style.display = 'none';
                anguloGroup.style.display = 'none';
                document.getElementById('aceleracion').value = '0';
                break;
            case 'mrua':
            case 'caida':
                aceleracionGroup.style.display = 'block';
                anguloGroup.style.display = 'none';
                if (tipo === 'caida') {
                    document.getElementById('aceleracion').value = '-9.81';
                }
                break;
            case 'parabolico':
                aceleracionGroup.style.display = 'block';
                anguloGroup.style.display = 'block';
                document.getElementById('aceleracion').value = '-9.81';
                break;
        }

        // Limpiar resultados
        this.limpiarResultados();
    }

    // Cargar ejemplos predefinidos
    cargarEjemplo(ejemplo) {
        const ejemplos = {
            'pelota': {
                tipo: 'parabolico',
                velocidadInicial: 20,
                aceleracion: -9.81,
                tiempo: 4,
                angulo: 45
            },
            'coche': {
                tipo: 'mrua',
                velocidadInicial: 30,
                aceleracion: -5,
                tiempo: 6,
                angulo: 0
            },
            'cohete': {
                tipo: 'mrua',
                velocidadInicial: 0,
                aceleracion: 15,
                tiempo: 10,
                angulo: 0
            },
            'caida-libre': {
                tipo: 'caida',
                velocidadInicial: 0,
                aceleracion: -9.81,
                tiempo: 3,
                angulo: 0
            }
        };

        const ej = ejemplos[ejemplo];
        if (!ej) return;

        this.cambiarTipoMovimiento(ej.tipo);
        document.getElementById('velocidad-inicial').value = ej.velocidadInicial;
        document.getElementById('aceleracion').value = ej.aceleracion;
        document.getElementById('tiempo').value = ej.tiempo;
        document.getElementById('angulo').value = ej.angulo;

        // Calcular automáticamente
        setTimeout(() => this.calcular(), 100);
    }

    // Función principal de cálculo
    calcular() {
        const params = this.obtenerParametros();
        let resultados = {};

        switch(this.tipoMovimiento) {
            case 'mru':
                resultados = this.calcularMRU(params);
                break;
            case 'mrua':
                resultados = this.calcularMRUA(params);
                break;
            case 'caida':
                resultados = this.calcularCaidaLibre(params);
                break;
            case 'parabolico':
                resultados = this.calcularTiroParabolico(params);
                break;
        }

        this.mostrarResultados(resultados);
        this.actualizarGrafico(params, resultados);
        this.actualizarFormulas(params);
        this.prepararAnimacion(params, resultados);
    }

    // Obtener parámetros del formulario
    obtenerParametros() {
        return {
            v0: parseFloat(document.getElementById('velocidad-inicial').value) || 0,
            a: parseFloat(document.getElementById('aceleracion').value) || 0,
            t: parseFloat(document.getElementById('tiempo').value) || 1,
            angulo: parseFloat(document.getElementById('angulo').value) || 0,
            tipo: this.tipoMovimiento
        };
    }

    // Cálculos cinemáticos
    calcularMRU(params) {
        const { v0, t } = params;
        return {
            velocidadFinal: v0,
            distancia: v0 * t,
            alturaMax: null,
            alcance: null,
            datos: this.generarDatosMRU(v0, t)
        };
    }

    calcularMRUA(params) {
        const { v0, a, t } = params;
        return {
            velocidadFinal: v0 + a * t,
            distancia: v0 * t + 0.5 * a * t * t,
            alturaMax: a < 0 && v0 > 0 ? (v0 * v0) / (2 * Math.abs(a)) : null,
            alcance: null,
            datos: this.generarDatosMRUA(v0, a, t)
        };
    }

    calcularCaidaLibre(params) {
        const { v0, t } = params;
        const g = 9.81;
        return {
            velocidadFinal: v0 - g * t,
            distancia: v0 * t - 0.5 * g * t * t,
            alturaMax: v0 > 0 ? (v0 * v0) / (2 * g) : 0,
            alcance: null,
            datos: this.generarDatosCaidaLibre(v0, t)
        };
    }

    calcularTiroParabolico(params) {
        const { v0, angulo, t } = params;
        const anguloRad = angulo * Math.PI / 180;
        const vx = v0 * Math.cos(anguloRad);
        const vy = v0 * Math.sin(anguloRad);
        const g = 9.81;

        // Tiempo de vuelo completo
        const tiempoVuelo = 2 * vy / g;
        const tiempoMax = Math.min(t, tiempoVuelo);

        return {
            velocidadFinal: Math.sqrt(vx * vx + Math.pow(vy - g * tiempoMax, 2)),
            distancia: Math.sqrt(Math.pow(vx * tiempoMax, 2) + Math.pow(vy * tiempoMax - 0.5 * g * tiempoMax * tiempoMax, 2)),
            alturaMax: (vy * vy) / (2 * g),
            alcance: (v0 * v0 * Math.sin(2 * anguloRad)) / g,
            datos: this.generarDatosParabolico(vx, vy, tiempoMax),
            vx, vy, tiempoVuelo
        };
    }

    // Generar datos para gráficos
    generarDatosMRU(v0, t) {
        const puntos = 100;
        const dt = t / puntos;
        const datos = [];

        for (let i = 0; i <= puntos; i++) {
            const tiempo = i * dt;
            datos.push({
                t: tiempo,
                x: v0 * tiempo,
                y: 0,
                v: v0
            });
        }
        return datos;
    }

    generarDatosMRUA(v0, a, t) {
        const puntos = 100;
        const dt = t / puntos;
        const datos = [];

        for (let i = 0; i <= puntos; i++) {
            const tiempo = i * dt;
            datos.push({
                t: tiempo,
                x: v0 * tiempo + 0.5 * a * tiempo * tiempo,
                y: 0,
                v: v0 + a * tiempo
            });
        }
        return datos;
    }

    generarDatosCaidaLibre(v0, t) {
        const puntos = 100;
        const dt = t / puntos;
        const datos = [];
        const g = 9.81;

        for (let i = 0; i <= puntos; i++) {
            const tiempo = i * dt;
            datos.push({
                t: tiempo,
                x: 0,
                y: v0 * tiempo - 0.5 * g * tiempo * tiempo,
                v: v0 - g * tiempo
            });
        }
        return datos;
    }

    generarDatosParabolico(vx, vy, t) {
        const puntos = 100;
        const dt = t / puntos;
        const datos = [];
        const g = 9.81;

        for (let i = 0; i <= puntos; i++) {
            const tiempo = i * dt;
            const y = vy * tiempo - 0.5 * g * tiempo * tiempo;
            if (y < 0) break; // No mostrar por debajo del suelo
            datos.push({
                t: tiempo,
                x: vx * tiempo,
                y: y,
                v: Math.sqrt(vx * vx + Math.pow(vy - g * tiempo, 2))
            });
        }
        return datos;
    }

    // Mostrar resultados
    mostrarResultados(resultados) {
        document.getElementById('resultados').style.display = 'block';

        // Formatear números con comas decimales (formato español)
        const formatear = (num) => {
            if (num === null || num === undefined) return '-';
            return num.toFixed(2).replace('.', ',');
        };

        document.getElementById('velocidad-final').textContent = formatear(resultados.velocidadFinal);
        document.getElementById('distancia').textContent = formatear(resultados.distancia);
        document.getElementById('altura-max').textContent = formatear(resultados.alturaMax);
        document.getElementById('alcance').textContent = formatear(resultados.alcance);

        // Mostrar/ocultar campos según el tipo de movimiento
        const resultItems = document.querySelectorAll('.result-item');
        resultItems[0].style.display = 'block'; // Velocidad final
        resultItems[1].style.display = 'block'; // Distancia
        resultItems[2].style.display = this.tipoMovimiento === 'caida' || this.tipoMovimiento === 'parabolico' ? 'block' : 'none';
        resultItems[3].style.display = this.tipoMovimiento === 'parabolico' ? 'block' : 'none';
    }

    // Actualizar fórmulas mostradas
    actualizarFormulas(params) {
        const formulasElement = document.getElementById('formulas-content');
        let formulas = '';

        switch(this.tipoMovimiento) {
            case 'mru':
                formulas = `
                    <div class="formula">x = v₀ × t</div>
                    <div class="formula">v = v₀ (constante)</div>
                `;
                break;
            case 'mrua':
                formulas = `
                    <div class="formula">v = v₀ + a × t</div>
                    <div class="formula">x = v₀ × t + ½ × a × t²</div>
                    <div class="formula">v² = v₀² + 2 × a × x</div>
                `;
                break;
            case 'caida':
                formulas = `
                    <div class="formula">y = v₀ × t - ½ × g × t²</div>
                    <div class="formula">v = v₀ - g × t</div>
                    <div class="formula">h_máx = v₀² / (2 × g)</div>
                `;
                break;
            case 'parabolico':
                formulas = `
                    <div class="formula">x = v₀ × cos(α) × t</div>
                    <div class="formula">y = v₀ × sin(α) × t - ½ × g × t²</div>
                    <div class="formula">Alcance = v₀² × sin(2α) / g</div>
                    <div class="formula">h_máx = (v₀ × sin(α))² / (2 × g)</div>
                `;
                break;
        }

        formulasElement.innerHTML = formulas;
    }

    // Configurar Chart.js
    setupChart() {
        const ctx = document.getElementById('chart-posicion').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Posición',
                    data: [],
                    borderColor: '#2E86AB',
                    backgroundColor: 'rgba(46, 134, 171, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#1A1A1A'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (s)',
                            color: '#666666'
                        },
                        grid: {
                            color: '#E5E5E5'
                        },
                        ticks: {
                            color: '#666666',
                            callback: function(value) {
                                return value.toFixed(1).replace('.', ',') + 's';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Posición (m)',
                            color: '#666666'
                        },
                        grid: {
                            color: '#E5E5E5'
                        },
                        ticks: {
                            color: '#666666',
                            callback: function(value) {
                                return value.toFixed(1).replace('.', ',') + 'm';
                            }
                        }
                    }
                }
            }
        });
    }

    // Actualizar gráfico
    actualizarGrafico(params, resultados) {
        const datos = resultados.datos;

        let labels, values, yLabel;

        if (this.tipoMovimiento === 'parabolico') {
            // Para tiro parabólico, mostrar trayectoria x vs y
            labels = datos.map(d => d.x.toFixed(1).replace('.', ','));
            values = datos.map(d => d.y);
            this.chart.options.scales.x.title.text = 'Distancia horizontal (m)';
            this.chart.options.scales.y.title.text = 'Altura (m)';
        } else if (this.tipoMovimiento === 'caida') {
            // Para caída libre, mostrar altura vs tiempo
            labels = datos.map(d => d.t.toFixed(1).replace('.', ','));
            values = datos.map(d => Math.abs(d.y)); // Valor absoluto para mostrar altura
            this.chart.options.scales.x.title.text = 'Tiempo (s)';
            this.chart.options.scales.y.title.text = 'Altura (m)';
        } else {
            // Para MRU y MRUA, mostrar posición vs tiempo
            labels = datos.map(d => d.t.toFixed(1).replace('.', ','));
            values = datos.map(d => d.x);
            this.chart.options.scales.x.title.text = 'Tiempo (s)';
            this.chart.options.scales.y.title.text = 'Posición (m)';
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values;
        this.chart.update();
    }

    // Inicializar canvas de animación
    initCanvas() {
        this.canvas = document.getElementById('canvas-animation');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    // Preparar animación
    prepararAnimacion(params, resultados) {
        this.datosAnimacion = {
            params,
            resultados,
            indice: 0,
            reproduciendo: false
        };
        this.dibujarFrame();
    }

    // Controles de animación
    playAnimacion() {
        if (!this.datosAnimacion) return;
        this.datosAnimacion.reproduciendo = true;
        this.animarFrame();
    }

    pauseAnimacion() {
        if (this.datosAnimacion) {
            this.datosAnimacion.reproduciendo = false;
        }
    }

    resetAnimacion() {
        if (this.datosAnimacion) {
            this.datosAnimacion.indice = 0;
            this.datosAnimacion.reproduciendo = false;
            this.dibujarFrame();
        }
    }

    // Animar frame por frame
    animarFrame() {
        if (!this.datosAnimacion || !this.datosAnimacion.reproduciendo) return;

        this.dibujarFrame();

        this.datosAnimacion.indice += this.velocidadAnimacion;

        if (this.datosAnimacion.indice >= this.datosAnimacion.resultados.datos.length - 1) {
            this.datosAnimacion.indice = 0;
        }

        requestAnimationFrame(() => this.animarFrame());
    }

    // Dibujar frame actual
    dibujarFrame() {
        if (!this.datosAnimacion) return;

        const { params, resultados } = this.datosAnimacion;
        const datos = resultados.datos;
        const indice = Math.floor(this.datosAnimacion.indice);

        this.ctx.clearRect(0, 0, this.canvas.width / devicePixelRatio, this.canvas.height / devicePixelRatio);

        const width = this.canvas.width / devicePixelRatio;
        const height = this.canvas.height / devicePixelRatio;

        // Dibujar suelo
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, height * 0.8, width, height * 0.2);

        // Dibujar cielo
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, width, height * 0.8);

        if (indice < datos.length) {
            const punto = datos[indice];
            this.dibujarObjeto(punto, width, height);
            this.dibujarTrayectoria(datos, indice, width, height);
            this.dibujarInfo(punto, params, width);
        }
    }

    // Dibujar objeto en movimiento
    dibujarObjeto(punto, width, height) {
        let x, y;
        const radio = 8;

        if (this.tipoMovimiento === 'parabolico') {
            // Escalar para que quepa en el canvas
            const maxX = Math.max(...this.datosAnimacion.resultados.datos.map(d => d.x));
            const maxY = Math.max(...this.datosAnimacion.resultados.datos.map(d => d.y));
            x = (punto.x / maxX) * width * 0.9 + width * 0.05;
            y = height * 0.8 - (punto.y / maxY) * height * 0.7;
        } else if (this.tipoMovimiento === 'caida') {
            x = width / 2;
            const maxY = Math.max(...this.datosAnimacion.resultados.datos.map(d => Math.abs(d.y)));
            y = height * 0.8 - (Math.abs(punto.y) / maxY) * height * 0.7;
        } else {
            // MRU y MRUA
            const maxX = Math.max(...this.datosAnimacion.resultados.datos.map(d => Math.abs(d.x)));
            x = (Math.abs(punto.x) / maxX) * width * 0.9 + width * 0.05;
            y = height * 0.75;
        }

        // Dibujar objeto
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.strokeStyle = '#2D3436';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radio, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();

        // Dibujar vector de velocidad
        if (punto.v > 0) {
            const vScale = 20;
            let vx, vy;

            if (this.tipoMovimiento === 'parabolico') {
                const { vx: velX, vy: velY } = this.datosAnimacion.resultados;
                const g = 9.81;
                vx = velX / Math.abs(velX) * vScale;
                vy = -(velY - g * punto.t) / Math.abs(velY) * vScale;
            } else {
                vx = punto.v > 0 ? vScale : -vScale;
                vy = 0;
            }

            this.ctx.strokeStyle = '#2E86AB';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + vx, y + vy);
            this.ctx.stroke();

            // Flecha
            const angle = Math.atan2(vy, vx);
            this.ctx.beginPath();
            this.ctx.moveTo(x + vx, y + vy);
            this.ctx.lineTo(x + vx - 8 * Math.cos(angle - Math.PI/6), y + vy - 8 * Math.sin(angle - Math.PI/6));
            this.ctx.moveTo(x + vx, y + vy);
            this.ctx.lineTo(x + vx - 8 * Math.cos(angle + Math.PI/6), y + vy - 8 * Math.sin(angle + Math.PI/6));
            this.ctx.stroke();
        }
    }

    // Dibujar trayectoria
    dibujarTrayectoria(datos, indiceFinal, width, height) {
        if (indiceFinal < 1) return;

        this.ctx.strokeStyle = 'rgba(46, 134, 171, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i <= indiceFinal && i < datos.length; i++) {
            const punto = datos[i];
            let x, y;

            if (this.tipoMovimiento === 'parabolico') {
                const maxX = Math.max(...datos.map(d => d.x));
                const maxY = Math.max(...datos.map(d => d.y));
                x = (punto.x / maxX) * width * 0.9 + width * 0.05;
                y = height * 0.8 - (punto.y / maxY) * height * 0.7;
            } else if (this.tipoMovimiento === 'caida') {
                x = width / 2;
                const maxY = Math.max(...datos.map(d => Math.abs(d.y)));
                y = height * 0.8 - (Math.abs(punto.y) / maxY) * height * 0.7;
            } else {
                const maxX = Math.max(...datos.map(d => Math.abs(d.x)));
                x = (Math.abs(punto.x) / maxX) * width * 0.9 + width * 0.05;
                y = height * 0.75;
            }

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();
    }

    // Dibujar información en tiempo real
    dibujarInfo(punto, params, width) {
        this.ctx.fillStyle = '#1A1A1A';
        this.ctx.font = '14px Arial';
        const y = 30;

        // Formatear números
        const format = (num) => num.toFixed(1).replace('.', ',');

        this.ctx.fillText(`Tiempo: ${format(punto.t)} s`, 10, y);
        this.ctx.fillText(`Velocidad: ${format(punto.v)} m/s`, 10, y + 20);

        if (this.tipoMovimiento === 'parabolico') {
            this.ctx.fillText(`Posición: (${format(punto.x)}, ${format(punto.y)}) m`, 10, y + 40);
        } else {
            this.ctx.fillText(`Posición: ${format(Math.abs(punto.x || punto.y))} m`, 10, y + 40);
        }
    }

    // Limpiar resultados
    limpiarResultados() {
        document.getElementById('resultados').style.display = 'none';
        if (this.chart) {
            this.chart.data.labels = [];
            this.chart.data.datasets[0].data = [];
            this.chart.update();
        }
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width / devicePixelRatio, this.canvas.height / devicePixelRatio);
        }
    }
}

// Inicializar aplicación cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    window.calculadora = new CalculadoraMovimiento();

    // Cargar ejemplo inicial
    setTimeout(() => {
        window.calculadora.cargarEjemplo('pelota');
    }, 500);

    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registrado con éxito:', registration.scope);
                })
                .catch((error) => {
                    console.log('SW falló al registrarse:', error);
                });
        });
    }
});