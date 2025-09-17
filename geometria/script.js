// ========== GEOMETRÍA INTERACTIVA - meskeIA ==========
// Aplicación web para explorar geometría con visualizaciones interactivas

'use strict';

// ========== CONFIGURACIÓN GLOBAL ==========
const CONFIG = {
    canvas: {
        width: 400,
        height: 300,
        centerX: 200,
        centerY: 150
    },
    colors: {
        primary: '#2E86AB',
        secondary: '#48A9A6',
        accent: '#F39C12',
        success: '#27AE60',
        danger: '#E74C3C',
        text: '#1A1A1A',
        grid: '#E5E5E5'
    },
    animation: {
        duration: 1000,
        easing: 'ease-in-out'
    }
};

// ========== CLASE PRINCIPAL DE LA APLICACIÓN ==========
class GeometriaApp {
    constructor() {
        this.currentSection = 'inicio';
        this.currentShape = 'triangulo';
        this.current3DShape = 'cubo';
        this.currentTransform = 'traslacion';
        this.animationId = null;
        this.isAnimating = false;
        this.shapes = new Map();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.loadLocalStorage();
        this.showSection('inicio');
        console.log('🎯 Geometría Interactiva meskeIA iniciada');
    }

    // ========== GESTIÓN DE SECCIONES ==========
    setupEventListeners() {
        // Navegación principal
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
                this.updateNavigation(e.target);
            });
        });

        // Cards de características en inicio
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const feature = e.currentTarget.dataset.feature;
                this.showSection(feature);
                this.updateNavigation(document.querySelector(`[data-section="${feature}"]`));
            });
        });

        // Selectores de formas 2D
        document.querySelectorAll('#figuras2d .shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectShape(e.target.dataset.shape);
                this.updateShapeSelection(e.target);
            });
        });

        // Selectores de formas 3D
        document.querySelectorAll('#figuras3d .shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.select3DShape(e.target.dataset.shape);
                this.updateShapeSelection(e.target);
            });
        });

        // Selectores de transformaciones
        document.querySelectorAll('.transform-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTransform(e.target.dataset.transform);
                this.updateTransformSelection(e.target);
            });
        });

        // Controles de canvas
        this.setupCanvasControls();

        // Calculadoras
        this.setupCalculators();

        // Controles de ángulos
        this.setupAngleControls();

        // Animaciones
        this.setupAnimationControls();
    }

    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;

            // Ejecutar lógica específica de la sección
            this.handleSectionChange(sectionId);
        }
    }

    handleSectionChange(sectionId) {
        switch(sectionId) {
            case 'figuras2d':
                this.drawShape2D(this.currentShape);
                break;
            case 'figuras3d':
                this.draw3DShape(this.current3DShape);
                break;
            case 'angulos':
                this.drawAngle();
                break;
            case 'transformaciones':
                this.drawTransformations();
                break;
        }
    }

    updateNavigation(activeBtn) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateShapeSelection(activeBtn) {
        activeBtn.parentNode.querySelectorAll('.shape-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateTransformSelection(activeBtn) {
        activeBtn.parentNode.querySelectorAll('.transform-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // ========== CONFIGURACIÓN DE CANVAS ==========
    setupCanvas() {
        this.canvas2D = document.getElementById('canvas2d');
        this.canvas3D = document.getElementById('canvas3d');
        this.canvasAngles = document.getElementById('canvasAngles');
        this.canvasTransform = document.getElementById('canvasTransform');

        if (this.canvas2D) {
            this.ctx2D = this.canvas2D.getContext('2d');
            this.setupCanvasStyle(this.ctx2D);
        }

        if (this.canvas3D) {
            this.ctx3D = this.canvas3D.getContext('2d');
            this.setupCanvasStyle(this.ctx3D);
        }

        if (this.canvasAngles) {
            this.ctxAngles = this.canvasAngles.getContext('2d');
            this.setupCanvasStyle(this.ctxAngles);
        }

        if (this.canvasTransform) {
            this.ctxTransform = this.canvasTransform.getContext('2d');
            this.setupCanvasStyle(this.ctxTransform);
        }
    }

    setupCanvasStyle(ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    setupCanvasControls() {
        // Control para limpiar canvas
        const clearBtn = document.getElementById('clearCanvas');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCanvas(this.ctx2D);
            });
        }

        // Control para exportar canvas
        const exportBtn = document.getElementById('exportCanvas');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCanvas(this.canvas2D, 'geometria_2d');
            });
        }

        // Controles 3D
        const rotateBtn = document.getElementById('rotate3d');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.rotate3D();
            });
        }

        const resetBtn = document.getElementById('reset3d');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.reset3D();
            });
        }
    }

    clearCanvas(ctx) {
        if (ctx) {
            ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        }
    }

    exportCanvas(canvas, filename) {
        if (canvas) {
            const link = document.createElement('a');
            link.download = `${filename}_${new Date().toLocaleDateString('es-ES')}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    }

    // ========== FIGURAS 2D ==========
    selectShape(shape) {
        this.currentShape = shape;
        this.drawShape2D(shape);
        this.updateCalculatorInputs(shape);
    }

    drawShape2D(shape) {
        if (!this.ctx2D) return;

        this.clearCanvas(this.ctx2D);

        const centerX = CONFIG.canvas.centerX;
        const centerY = CONFIG.canvas.centerY;

        this.ctx2D.strokeStyle = CONFIG.colors.primary;
        this.ctx2D.fillStyle = CONFIG.colors.primary + '20';
        this.ctx2D.lineWidth = 2;

        switch(shape) {
            case 'triangulo':
                this.drawTriangle(centerX, centerY, 80);
                break;
            case 'cuadrado':
                this.drawSquare(centerX, centerY, 80);
                break;
            case 'rectangulo':
                this.drawRectangle(centerX, centerY, 100, 60);
                break;
            case 'circulo':
                this.drawCircle(centerX, centerY, 60);
                break;
            case 'poligono':
                this.drawPolygon(centerX, centerY, 70, 6);
                break;
        }
    }

    drawTriangle(x, y, size) {
        const height = size * Math.sqrt(3) / 2;

        this.ctx2D.beginPath();
        this.ctx2D.moveTo(x, y - height / 2);
        this.ctx2D.lineTo(x - size / 2, y + height / 2);
        this.ctx2D.lineTo(x + size / 2, y + height / 2);
        this.ctx2D.closePath();
        this.ctx2D.fill();
        this.ctx2D.stroke();

        // Etiquetas
        this.ctx2D.fillStyle = CONFIG.colors.text;
        this.ctx2D.font = '12px Arial';
        this.ctx2D.fillText('A', x, y - height / 2 - 15);
        this.ctx2D.fillText('B', x - size / 2 - 15, y + height / 2 + 15);
        this.ctx2D.fillText('C', x + size / 2 + 15, y + height / 2 + 15);
    }

    drawSquare(x, y, size) {
        this.ctx2D.beginPath();
        this.ctx2D.rect(x - size / 2, y - size / 2, size, size);
        this.ctx2D.fill();
        this.ctx2D.stroke();

        // Etiquetas de medidas
        this.ctx2D.fillStyle = CONFIG.colors.text;
        this.ctx2D.font = '12px Arial';
        this.ctx2D.fillText(`${size}`, x, y - size / 2 - 15);
        this.ctx2D.fillText(`${size}`, x - size / 2 - 20, y);
    }

    drawRectangle(x, y, width, height) {
        this.ctx2D.beginPath();
        this.ctx2D.rect(x - width / 2, y - height / 2, width, height);
        this.ctx2D.fill();
        this.ctx2D.stroke();

        // Etiquetas de medidas
        this.ctx2D.fillStyle = CONFIG.colors.text;
        this.ctx2D.font = '12px Arial';
        this.ctx2D.fillText(`${width}`, x, y - height / 2 - 15);
        this.ctx2D.fillText(`${height}`, x - width / 2 - 20, y);
    }

    drawCircle(x, y, radius) {
        this.ctx2D.beginPath();
        this.ctx2D.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx2D.fill();
        this.ctx2D.stroke();

        // Radio
        this.ctx2D.beginPath();
        this.ctx2D.moveTo(x, y);
        this.ctx2D.lineTo(x + radius, y);
        this.ctx2D.strokeStyle = CONFIG.colors.danger;
        this.ctx2D.lineWidth = 1;
        this.ctx2D.stroke();

        // Etiqueta del radio
        this.ctx2D.fillStyle = CONFIG.colors.text;
        this.ctx2D.font = '12px Arial';
        this.ctx2D.fillText(`r = ${radius}`, x + radius / 2, y - 10);
    }

    drawPolygon(x, y, radius, sides) {
        const angle = (2 * Math.PI) / sides;

        this.ctx2D.beginPath();
        for (let i = 0; i < sides; i++) {
            const pointX = x + radius * Math.cos(angle * i - Math.PI / 2);
            const pointY = y + radius * Math.sin(angle * i - Math.PI / 2);

            if (i === 0) {
                this.ctx2D.moveTo(pointX, pointY);
            } else {
                this.ctx2D.lineTo(pointX, pointY);
            }
        }
        this.ctx2D.closePath();
        this.ctx2D.fill();
        this.ctx2D.stroke();

        // Etiqueta del número de lados
        this.ctx2D.fillStyle = CONFIG.colors.text;
        this.ctx2D.font = '12px Arial';
        this.ctx2D.fillText(`${sides} lados`, x, y);
    }

    // ========== FIGURAS 3D BÁSICAS ==========
    select3DShape(shape) {
        this.current3DShape = shape;
        this.draw3DShape(shape);
        this.update3DCalculatorInputs(shape);
    }

    draw3DShape(shape) {
        if (!this.ctx3D) return;

        this.clearCanvas(this.ctx3D);
        this.current3DShape = shape;

        const centerX = CONFIG.canvas.centerX;
        const centerY = CONFIG.canvas.centerY;

        this.ctx3D.strokeStyle = CONFIG.colors.primary;
        this.ctx3D.fillStyle = CONFIG.colors.primary + '30';
        this.ctx3D.lineWidth = 2;

        switch(shape) {
            case 'cubo':
                this.draw3DCube(centerX, centerY, 80);
                break;
            case 'esfera':
                this.draw3DSphere(centerX, centerY, 60);
                break;
            case 'cilindro':
                this.draw3DCylinder(centerX, centerY, 50, 100);
                break;
            case 'cono':
                this.draw3DCone(centerX, centerY, 50, 100);
                break;
            case 'piramide':
                this.draw3DPyramid(centerX, centerY, 80, 80);
                break;
        }
    }

    draw3DCube(x, y, size) {
        const offset = size * 0.3;

        // Cara frontal
        this.ctx3D.beginPath();
        this.ctx3D.rect(x - size / 2, y - size / 2, size, size);
        this.ctx3D.fill();
        this.ctx3D.stroke();

        // Cara trasera (offset)
        this.ctx3D.beginPath();
        this.ctx3D.rect(x - size / 2 + offset, y - size / 2 - offset, size, size);
        this.ctx3D.stroke();

        // Líneas de conexión
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(x - size / 2, y - size / 2);
        this.ctx3D.lineTo(x - size / 2 + offset, y - size / 2 - offset);
        this.ctx3D.moveTo(x + size / 2, y - size / 2);
        this.ctx3D.lineTo(x + size / 2 + offset, y - size / 2 - offset);
        this.ctx3D.moveTo(x + size / 2, y + size / 2);
        this.ctx3D.lineTo(x + size / 2 + offset, y + size / 2 - offset);
        this.ctx3D.moveTo(x - size / 2, y + size / 2);
        this.ctx3D.lineTo(x - size / 2 + offset, y + size / 2 - offset);
        this.ctx3D.stroke();
    }

    draw3DSphere(x, y, radius) {
        // Círculo principal
        this.ctx3D.beginPath();
        this.ctx3D.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx3D.fill();
        this.ctx3D.stroke();

        // Líneas de longitud
        this.ctx3D.beginPath();
        this.ctx3D.ellipse(x, y, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx3D.stroke();

        this.ctx3D.beginPath();
        this.ctx3D.ellipse(x, y, radius * 0.7, radius, 0, 0, 2 * Math.PI);
        this.ctx3D.stroke();
    }

    draw3DCylinder(x, y, radius, height) {
        // Base inferior
        this.ctx3D.beginPath();
        this.ctx3D.ellipse(x, y + height / 2, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx3D.fill();
        this.ctx3D.stroke();

        // Base superior
        this.ctx3D.beginPath();
        this.ctx3D.ellipse(x, y - height / 2, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx3D.stroke();

        // Lados
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(x - radius, y - height / 2);
        this.ctx3D.lineTo(x - radius, y + height / 2);
        this.ctx3D.moveTo(x + radius, y - height / 2);
        this.ctx3D.lineTo(x + radius, y + height / 2);
        this.ctx3D.stroke();
    }

    draw3DCone(x, y, radius, height) {
        // Base
        this.ctx3D.beginPath();
        this.ctx3D.ellipse(x, y + height / 2, radius, radius * 0.3, 0, 0, 2 * Math.PI);
        this.ctx3D.fill();
        this.ctx3D.stroke();

        // Lados
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x - radius, y + height / 2);
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x + radius, y + height / 2);
        this.ctx3D.stroke();

        // Línea central
        this.ctx3D.beginPath();
        this.ctx3D.setLineDash([5, 5]);
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x, y + height / 2);
        this.ctx3D.stroke();
        this.ctx3D.setLineDash([]);
    }

    draw3DPyramid(x, y, base, height) {
        // Base cuadrada
        this.ctx3D.beginPath();
        this.ctx3D.rect(x - base / 2, y + height / 4, base, base * 0.6);
        this.ctx3D.fill();
        this.ctx3D.stroke();

        // Aristas hacia el vértice
        this.ctx3D.beginPath();
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x - base / 2, y + height / 4);
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x + base / 2, y + height / 4);
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x + base / 2, y + height / 4 + base * 0.6);
        this.ctx3D.moveTo(x, y - height / 2);
        this.ctx3D.lineTo(x - base / 2, y + height / 4 + base * 0.6);
        this.ctx3D.stroke();
    }

    rotate3D() {
        // Implementación básica de rotación
        if (this.current3DShape) {
            this.draw3DShape(this.current3DShape);
            console.log('🔄 Rotando figura 3D');
        }
    }

    reset3D() {
        if (this.ctx3D) {
            this.clearCanvas(this.ctx3D);
            this.draw3DShape(this.current3DShape);
            console.log('↻ Reset figura 3D');
        }
    }

    // ========== ÁNGULOS ==========
    setupAngleControls() {
        const angleSlider = document.getElementById('angleSlider');
        const angleValue = document.getElementById('angleValue');

        if (angleSlider && angleValue) {
            angleSlider.addEventListener('input', (e) => {
                const angle = e.target.value;
                angleValue.textContent = `${angle}°`;
                this.drawAngle(angle);
            });
        }

        // Calculadora trigonométrica
        const trigAngle = document.getElementById('trigAngle');
        const angleUnit = document.getElementById('angleUnit');

        if (trigAngle) {
            trigAngle.addEventListener('input', () => {
                this.calculateTrig();
            });
        }

        if (angleUnit) {
            angleUnit.addEventListener('change', () => {
                this.calculateTrig();
            });
        }
    }

    drawAngle(angle = 45) {
        if (!this.ctxAngles) return;

        this.clearCanvas(this.ctxAngles);

        const centerX = CONFIG.canvas.centerX;
        const centerY = CONFIG.canvas.centerY;
        const radius = 100;

        // Línea de referencia (horizontal)
        this.ctxAngles.beginPath();
        this.ctxAngles.moveTo(centerX - radius, centerY);
        this.ctxAngles.lineTo(centerX + radius, centerY);
        this.ctxAngles.strokeStyle = CONFIG.colors.text;
        this.ctxAngles.lineWidth = 1;
        this.ctxAngles.stroke();

        // Línea del ángulo
        const angleRad = (angle * Math.PI) / 180;
        const endX = centerX + radius * Math.cos(angleRad);
        const endY = centerY - radius * Math.sin(angleRad);

        this.ctxAngles.beginPath();
        this.ctxAngles.moveTo(centerX, centerY);
        this.ctxAngles.lineTo(endX, endY);
        this.ctxAngles.strokeStyle = CONFIG.colors.primary;
        this.ctxAngles.lineWidth = 2;
        this.ctxAngles.stroke();

        // Arco del ángulo
        this.ctxAngles.beginPath();
        this.ctxAngles.arc(centerX, centerY, 30, 0, -angleRad, true);
        this.ctxAngles.strokeStyle = CONFIG.colors.accent;
        this.ctxAngles.lineWidth = 2;
        this.ctxAngles.stroke();

        // Etiqueta del ángulo
        this.ctxAngles.fillStyle = CONFIG.colors.text;
        this.ctxAngles.font = '14px Arial';
        this.ctxAngles.fillText(`${angle}°`, centerX + 40, centerY - 10);

        // Clasificación del ángulo
        let tipo = '';
        if (angle == 0) tipo = 'Nulo';
        else if (angle < 90) tipo = 'Agudo';
        else if (angle == 90) tipo = 'Recto';
        else if (angle < 180) tipo = 'Obtuso';
        else if (angle == 180) tipo = 'Llano';
        else if (angle < 360) tipo = 'Completo';

        this.ctxAngles.fillText(`Tipo: ${tipo}`, centerX, centerY + 50);
    }

    calculateTrig() {
        const angleInput = document.getElementById('trigAngle');
        const unitSelect = document.getElementById('angleUnit');
        const resultsDiv = document.getElementById('trigResults');

        if (!angleInput || !unitSelect || !resultsDiv) return;

        const angleValue = parseFloat(angleInput.value) || 0;
        const unit = unitSelect.value;

        // Convertir a radianes si es necesario
        const angleRad = unit === 'degrees' ? (angleValue * Math.PI) / 180 : angleValue;

        // Calcular funciones trigonométricas
        const sin = Math.sin(angleRad);
        const cos = Math.cos(angleRad);
        const tan = Math.tan(angleRad);
        const cot = 1 / tan;
        const sec = 1 / cos;
        const csc = 1 / sin;

        // Formato español para números
        const format = (num) => {
            if (!isFinite(num)) return 'Indefinido';
            return num.toFixed(4).replace('.', ',');
        };

        resultsDiv.innerHTML = `
            <div class="trig-result">
                <div class="label">sen</div>
                <div class="value">${format(sin)}</div>
            </div>
            <div class="trig-result">
                <div class="label">cos</div>
                <div class="value">${format(cos)}</div>
            </div>
            <div class="trig-result">
                <div class="label">tan</div>
                <div class="value">${format(tan)}</div>
            </div>
            <div class="trig-result">
                <div class="label">cot</div>
                <div class="value">${format(cot)}</div>
            </div>
            <div class="trig-result">
                <div class="label">sec</div>
                <div class="value">${format(sec)}</div>
            </div>
            <div class="trig-result">
                <div class="label">csc</div>
                <div class="value">${format(csc)}</div>
            </div>
        `;
    }

    // ========== CALCULADORAS ==========
    setupCalculators() {
        // Calculadoras de áreas
        this.setupAreaCalculators();

        // Calculadoras de volúmenes
        this.setupVolumeCalculators();

        // Calculadora dinámica de figuras 2D
        this.updateCalculatorInputs(this.currentShape);

        // Calculadora dinámica de figuras 3D
        this.update3DCalculatorInputs(this.current3DShape);
    }

    setupAreaCalculators() {
        // Triángulo
        ['triBase', 'triHeight'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.calculateTriangleArea());
            }
        });

        // Cuadrado
        const sqInput = document.getElementById('sqSide');
        if (sqInput) {
            sqInput.addEventListener('input', () => this.calculateSquareArea());
        }

        // Rectángulo
        ['rectBase', 'rectHeight'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.calculateRectangleArea());
            }
        });

        // Círculo
        const circInput = document.getElementById('circRadius');
        if (circInput) {
            circInput.addEventListener('input', () => this.calculateCircleArea());
        }
    }

    setupVolumeCalculators() {
        // Cubo
        const cubeInput = document.getElementById('cubeEdge');
        if (cubeInput) {
            cubeInput.addEventListener('input', () => this.calculateCubeVolume());
        }

        // Esfera
        const sphereInput = document.getElementById('sphereRadius');
        if (sphereInput) {
            sphereInput.addEventListener('input', () => this.calculateSphereVolume());
        }

        // Cilindro
        ['cylRadius', 'cylHeight'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.calculateCylinderVolume());
            }
        });

        // Cono
        ['coneRadius', 'coneHeight'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.calculateConeVolume());
            }
        });
    }

    // Funciones de cálculo de áreas
    calculateTriangleArea() {
        const base = parseFloat(document.getElementById('triBase')?.value) || 0;
        const height = parseFloat(document.getElementById('triHeight')?.value) || 0;
        const area = (base * height) / 2;
        const perimeter = base + 2 * Math.sqrt((base/2)**2 + height**2);

        const resultDiv = document.getElementById('triResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Área: ${this.formatNumber(area)} u²<br>
                Perímetro: ${this.formatNumber(perimeter)} u
            `;
        }
    }

    calculateSquareArea() {
        const side = parseFloat(document.getElementById('sqSide')?.value) || 0;
        const area = side * side;
        const perimeter = side * 4;

        const resultDiv = document.getElementById('sqResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Área: ${this.formatNumber(area)} u²<br>
                Perímetro: ${this.formatNumber(perimeter)} u
            `;
        }
    }

    calculateRectangleArea() {
        const base = parseFloat(document.getElementById('rectBase')?.value) || 0;
        const height = parseFloat(document.getElementById('rectHeight')?.value) || 0;
        const area = base * height;
        const perimeter = 2 * (base + height);

        const resultDiv = document.getElementById('rectResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Área: ${this.formatNumber(area)} u²<br>
                Perímetro: ${this.formatNumber(perimeter)} u
            `;
        }
    }

    calculateCircleArea() {
        const radius = parseFloat(document.getElementById('circRadius')?.value) || 0;
        const area = Math.PI * radius * radius;
        const perimeter = 2 * Math.PI * radius;

        const resultDiv = document.getElementById('circResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Área: ${this.formatNumber(area)} u²<br>
                Perímetro: ${this.formatNumber(perimeter)} u
            `;
        }
    }

    // Funciones de cálculo de volúmenes
    calculateCubeVolume() {
        const edge = parseFloat(document.getElementById('cubeEdge')?.value) || 0;
        const volume = edge ** 3;
        const surface = 6 * edge ** 2;

        const resultDiv = document.getElementById('cubeResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Volumen: ${this.formatNumber(volume)} u³<br>
                Superficie: ${this.formatNumber(surface)} u²
            `;
        }
    }

    calculateSphereVolume() {
        const radius = parseFloat(document.getElementById('sphereRadius')?.value) || 0;
        const volume = (4/3) * Math.PI * radius ** 3;
        const surface = 4 * Math.PI * radius ** 2;

        const resultDiv = document.getElementById('sphereResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Volumen: ${this.formatNumber(volume)} u³<br>
                Superficie: ${this.formatNumber(surface)} u²
            `;
        }
    }

    calculateCylinderVolume() {
        const radius = parseFloat(document.getElementById('cylRadius')?.value) || 0;
        const height = parseFloat(document.getElementById('cylHeight')?.value) || 0;
        const volume = Math.PI * radius ** 2 * height;
        const surface = 2 * Math.PI * radius * (radius + height);

        const resultDiv = document.getElementById('cylResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Volumen: ${this.formatNumber(volume)} u³<br>
                Superficie: ${this.formatNumber(surface)} u²
            `;
        }
    }

    calculateConeVolume() {
        const radius = parseFloat(document.getElementById('coneRadius')?.value) || 0;
        const height = parseFloat(document.getElementById('coneHeight')?.value) || 0;
        const volume = (1/3) * Math.PI * radius ** 2 * height;
        const generatrix = Math.sqrt(radius ** 2 + height ** 2);
        const surface = Math.PI * radius * (radius + generatrix);

        const resultDiv = document.getElementById('coneResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                Volumen: ${this.formatNumber(volume)} u³<br>
                Superficie: ${this.formatNumber(surface)} u²
            `;
        }
    }

    // ========== TRANSFORMACIONES ==========
    selectTransform(transform) {
        this.currentTransform = transform;
        this.updateTransformControls(transform);
        this.drawTransformations();
    }

    updateTransformControls(transform) {
        const controlsDiv = document.getElementById('transformControls');
        if (!controlsDiv) return;

        let controlsHTML = '';

        switch(transform) {
            case 'traslacion':
                controlsHTML = `
                    <div class="form-group">
                        <label>Desplazamiento X:</label>
                        <input type="range" id="translateX" min="-100" max="100" value="50">
                        <span id="translateXValue">50</span>
                    </div>
                    <div class="form-group">
                        <label>Desplazamiento Y:</label>
                        <input type="range" id="translateY" min="-100" max="100" value="30">
                        <span id="translateYValue">30</span>
                    </div>
                `;
                break;
            case 'rotacion':
                controlsHTML = `
                    <div class="form-group">
                        <label>Ángulo de rotación:</label>
                        <input type="range" id="rotateAngle" min="0" max="360" value="45">
                        <span id="rotateAngleValue">45°</span>
                    </div>
                `;
                break;
            case 'reflexion':
                controlsHTML = `
                    <div class="form-group">
                        <label>Eje de reflexión:</label>
                        <select id="reflectionAxis">
                            <option value="x">Eje X</option>
                            <option value="y">Eje Y</option>
                            <option value="diagonal">Diagonal</option>
                        </select>
                    </div>
                `;
                break;
            case 'escala':
                controlsHTML = `
                    <div class="form-group">
                        <label>Factor de escala:</label>
                        <input type="range" id="scaleValue" min="0.5" max="3" step="0.1" value="1.5">
                        <span id="scaleValueLabel">1.5x</span>
                    </div>
                `;
                break;
        }

        controlsDiv.innerHTML = controlsHTML;
        this.setupTransformListeners(transform);
    }

    setupTransformListeners(transform) {
        switch(transform) {
            case 'traslacion':
                ['translateX', 'translateY'].forEach(id => {
                    const control = document.getElementById(id);
                    const valueSpan = document.getElementById(id + 'Value');
                    if (control && valueSpan) {
                        control.addEventListener('input', (e) => {
                            valueSpan.textContent = e.target.value;
                            this.drawTransformations();
                        });
                    }
                });
                break;
            case 'rotacion':
                const rotateControl = document.getElementById('rotateAngle');
                const rotateValue = document.getElementById('rotateAngleValue');
                if (rotateControl && rotateValue) {
                    rotateControl.addEventListener('input', (e) => {
                        rotateValue.textContent = e.target.value + '°';
                        this.drawTransformations();
                    });
                }
                break;
            case 'reflexion':
                const reflectionControl = document.getElementById('reflectionAxis');
                if (reflectionControl) {
                    reflectionControl.addEventListener('change', () => {
                        this.drawTransformations();
                    });
                }
                break;
            case 'escala':
                const scaleControl = document.getElementById('scaleValue');
                const scaleLabel = document.getElementById('scaleValueLabel');
                if (scaleControl && scaleLabel) {
                    scaleControl.addEventListener('input', (e) => {
                        scaleLabel.textContent = e.target.value + 'x';
                        this.drawTransformations();
                    });
                }
                break;
        }
    }

    drawTransformations() {
        if (!this.ctxTransform) return;

        this.clearCanvas(this.ctxTransform);

        const centerX = CONFIG.canvas.centerX;
        const centerY = CONFIG.canvas.centerY;

        // Dibujar figura original (lado izquierdo)
        this.ctxTransform.strokeStyle = CONFIG.colors.text;
        this.ctxTransform.fillStyle = CONFIG.colors.text + '20';
        this.ctxTransform.lineWidth = 1;
        this.drawSquareAt(this.ctxTransform, centerX - 100, centerY, 40);

        // Etiqueta figura original
        this.ctxTransform.fillStyle = CONFIG.colors.text;
        this.ctxTransform.font = '12px Arial';
        this.ctxTransform.textAlign = 'center';
        this.ctxTransform.fillText('Original', centerX - 100, centerY + 40);

        // Dibujar figura transformada (lado derecho)
        this.ctxTransform.strokeStyle = CONFIG.colors.primary;
        this.ctxTransform.fillStyle = CONFIG.colors.primary + '40';
        this.ctxTransform.lineWidth = 2;

        switch(this.currentTransform) {
            case 'traslacion':
                const tx = parseInt(document.getElementById('translateX')?.value) || 50;
                const ty = parseInt(document.getElementById('translateY')?.value) || 30;
                this.drawSquareAt(this.ctxTransform, centerX + 100 + tx, centerY - ty, 40);
                this.ctxTransform.fillStyle = CONFIG.colors.primary;
                this.ctxTransform.fillText('Traslación', centerX + 100 + tx, centerY - ty + 40);
                break;

            case 'rotacion':
                this.ctxTransform.save();
                const angle = parseFloat(document.getElementById('rotateAngle')?.value) || 45;
                this.ctxTransform.translate(centerX + 100, centerY);
                this.ctxTransform.rotate((angle * Math.PI) / 180);
                this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                this.ctxTransform.restore();
                this.ctxTransform.fillStyle = CONFIG.colors.primary;
                this.ctxTransform.fillText(`Rotación ${angle}°`, centerX + 100, centerY + 50);
                break;

            case 'reflexion':
                this.ctxTransform.save();
                const axis = document.getElementById('reflectionAxis')?.value || 'y';

                // Dibujar eje de reflexión
                this.ctxTransform.strokeStyle = CONFIG.colors.danger;
                this.ctxTransform.lineWidth = 1;
                this.ctxTransform.setLineDash([5, 5]);

                if (axis === 'x') {
                    // Eje horizontal
                    this.ctxTransform.beginPath();
                    this.ctxTransform.moveTo(centerX + 50, centerY);
                    this.ctxTransform.lineTo(centerX + 150, centerY);
                    this.ctxTransform.stroke();

                    // Figura reflejada
                    this.ctxTransform.translate(centerX + 100, centerY);
                    this.ctxTransform.scale(1, -1);
                    this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                    this.ctxTransform.restore();

                    this.ctxTransform.fillStyle = CONFIG.colors.primary;
                    this.ctxTransform.fillText('Reflexión eje X', centerX + 100, centerY + 70);

                } else if (axis === 'y') {
                    // Eje vertical
                    this.ctxTransform.beginPath();
                    this.ctxTransform.moveTo(centerX + 100, centerY - 50);
                    this.ctxTransform.lineTo(centerX + 100, centerY + 50);
                    this.ctxTransform.stroke();

                    // Figura reflejada
                    this.ctxTransform.translate(centerX + 100, centerY);
                    this.ctxTransform.scale(-1, 1);
                    this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                    this.ctxTransform.restore();

                    this.ctxTransform.fillStyle = CONFIG.colors.primary;
                    this.ctxTransform.fillText('Reflexión eje Y', centerX + 100, centerY + 70);

                } else {
                    // Diagonal
                    this.ctxTransform.beginPath();
                    this.ctxTransform.moveTo(centerX + 60, centerY - 40);
                    this.ctxTransform.lineTo(centerX + 140, centerY + 40);
                    this.ctxTransform.stroke();

                    // Figura reflejada diagonalmente
                    this.ctxTransform.translate(centerX + 100, centerY);
                    this.ctxTransform.scale(-1, -1);
                    this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                    this.ctxTransform.restore();

                    this.ctxTransform.fillStyle = CONFIG.colors.primary;
                    this.ctxTransform.fillText('Reflexión diagonal', centerX + 100, centerY + 70);
                }

                this.ctxTransform.setLineDash([]);
                break;

            case 'escala':
                const scale = parseFloat(document.getElementById('scaleValue')?.value) || 1.5;
                this.ctxTransform.save();
                this.ctxTransform.translate(centerX + 100, centerY);
                this.ctxTransform.scale(scale, scale);
                this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                this.ctxTransform.restore();
                this.ctxTransform.fillStyle = CONFIG.colors.primary;
                this.ctxTransform.fillText(`Escala ${scale}x`, centerX + 100, centerY + 50);
                break;
        }
    }

    drawSquareAt(ctx, x, y, size) {
        ctx.beginPath();
        ctx.rect(x - size / 2, y - size / 2, size, size);
        ctx.fill();
        ctx.stroke();
    }

    // ========== ANIMACIONES ==========
    setupAnimationControls() {
        const playBtn = document.getElementById('playAnimation');
        const pauseBtn = document.getElementById('pauseAnimation');
        const resetBtn = document.getElementById('resetTransform');

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.playAnimation();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseAnimation();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetTransformation();
            });
        }
    }

    playAnimation() {
        console.log('▶️ Reproduciendo animación');
        this.isAnimating = true;
        this.animateTransformation();
    }

    animateTransformation() {
        if (!this.isAnimating) return;

        let progress = 0;
        const duration = 3000; // 3 segundos
        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            progress = Math.min((currentTime - startTime) / duration, 1);

            // Animar según el tipo de transformación actual
            this.drawAnimatedTransformation(progress);

            if (progress < 1 && this.isAnimating) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                console.log('✅ Animación completada');
            }
        };

        animate();
    }

    drawAnimatedTransformation(progress) {
        if (!this.ctxTransform) return;

        this.clearCanvas(this.ctxTransform);

        const centerX = CONFIG.canvas.centerX;
        const centerY = CONFIG.canvas.centerY;

        // Dibujar figura original (siempre visible)
        this.ctxTransform.strokeStyle = CONFIG.colors.text;
        this.ctxTransform.fillStyle = CONFIG.colors.text + '20';
        this.ctxTransform.lineWidth = 1;
        this.drawSquareAt(this.ctxTransform, centerX - 100, centerY, 40);

        // Dibujar figura transformada con progreso
        this.ctxTransform.strokeStyle = CONFIG.colors.primary;
        this.ctxTransform.fillStyle = CONFIG.colors.primary + '40';
        this.ctxTransform.lineWidth = 2;

        this.ctxTransform.save();

        switch(this.currentTransform) {
            case 'traslacion':
                const maxTx = parseInt(document.getElementById('translateX')?.value) || 50;
                const maxTy = parseInt(document.getElementById('translateY')?.value) || 30;
                const currentTx = maxTx * progress;
                const currentTy = maxTy * progress;
                this.drawSquareAt(this.ctxTransform, centerX - 100 + currentTx, centerY - currentTy, 40);
                break;

            case 'rotacion':
                const maxAngle = parseFloat(document.getElementById('rotateAngle')?.value) || 45;
                const currentAngle = maxAngle * progress;
                this.ctxTransform.translate(centerX + 100, centerY);
                this.ctxTransform.rotate((currentAngle * Math.PI) / 180);
                this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                break;

            case 'escala':
                const maxScale = parseFloat(document.getElementById('scaleValue')?.value) || 1.5;
                const currentScale = 1 + (maxScale - 1) * progress;
                this.ctxTransform.translate(centerX + 100, centerY);
                this.ctxTransform.scale(currentScale, currentScale);
                this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                break;

            case 'reflexion':
                const axis = document.getElementById('reflectionAxis')?.value || 'y';

                // Dibujar eje de reflexión
                this.ctxTransform.save();
                this.ctxTransform.strokeStyle = CONFIG.colors.danger;
                this.ctxTransform.lineWidth = 1;
                this.ctxTransform.setLineDash([5, 5]);

                if (axis === 'x') {
                    this.ctxTransform.beginPath();
                    this.ctxTransform.moveTo(centerX + 50, centerY);
                    this.ctxTransform.lineTo(centerX + 150, centerY);
                    this.ctxTransform.stroke();
                } else if (axis === 'y') {
                    this.ctxTransform.beginPath();
                    this.ctxTransform.moveTo(centerX + 100, centerY - 50);
                    this.ctxTransform.lineTo(centerX + 100, centerY + 50);
                    this.ctxTransform.stroke();
                } else {
                    this.ctxTransform.beginPath();
                    this.ctxTransform.moveTo(centerX + 60, centerY - 40);
                    this.ctxTransform.lineTo(centerX + 140, centerY + 40);
                    this.ctxTransform.stroke();
                }
                this.ctxTransform.restore();

                // Animar la reflexión
                if (progress > 0.5) {
                    this.ctxTransform.translate(centerX + 100, centerY);
                    if (axis === 'x') {
                        this.ctxTransform.scale(1, -1);
                    } else if (axis === 'y') {
                        this.ctxTransform.scale(-1, 1);
                    } else {
                        this.ctxTransform.scale(-1, -1);
                    }
                    this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                } else {
                    // Figura en transición
                    const scaleX = axis === 'y' || axis === 'diagonal' ? (1 - 2 * progress) : 1;
                    const scaleY = axis === 'x' || axis === 'diagonal' ? (1 - 2 * progress) : 1;

                    this.ctxTransform.translate(centerX + 100, centerY);
                    this.ctxTransform.scale(scaleX, scaleY);
                    this.drawSquareAt(this.ctxTransform, 0, 0, 40);
                }
                break;
        }

        this.ctxTransform.restore();
    }

    pauseAnimation() {
        console.log('⏸️ Pausando animación');
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resetTransformation() {
        console.log('↻ Reseteando transformación');
        this.drawTransformations();
    }

    // ========== CALCULADORA DINÁMICA 2D ==========
    updateCalculatorInputs(shape) {
        const inputsDiv = document.getElementById('calcInputs');
        const resultsDiv = document.getElementById('calcResults');

        if (!inputsDiv || !resultsDiv) return;

        let inputsHTML = '';

        switch(shape) {
            case 'triangulo':
                inputsHTML = `
                    <div class="form-group">
                        <label>Base:</label>
                        <input type="number" id="dynTriBase" placeholder="Base">
                    </div>
                    <div class="form-group">
                        <label>Altura:</label>
                        <input type="number" id="dynTriHeight" placeholder="Altura">
                    </div>
                `;
                break;
            case 'cuadrado':
                inputsHTML = `
                    <div class="form-group">
                        <label>Lado:</label>
                        <input type="number" id="dynSqSide" placeholder="Lado">
                    </div>
                `;
                break;
            case 'rectangulo':
                inputsHTML = `
                    <div class="form-group">
                        <label>Base:</label>
                        <input type="number" id="dynRectBase" placeholder="Base">
                    </div>
                    <div class="form-group">
                        <label>Altura:</label>
                        <input type="number" id="dynRectHeight" placeholder="Altura">
                    </div>
                `;
                break;
            case 'circulo':
                inputsHTML = `
                    <div class="form-group">
                        <label>Radio:</label>
                        <input type="number" id="dynCircRadius" placeholder="Radio">
                    </div>
                `;
                break;
            case 'poligono':
                inputsHTML = `
                    <div class="form-group">
                        <label>Número de lados:</label>
                        <input type="number" id="dynPolyN" placeholder="Lados" value="6">
                    </div>
                    <div class="form-group">
                        <label>Lado:</label>
                        <input type="number" id="dynPolySide" placeholder="Longitud del lado">
                    </div>
                `;
                break;
        }

        inputsDiv.innerHTML = inputsHTML;
        resultsDiv.innerHTML = '<div class="text-center text-muted">Introduce valores para calcular</div>';

        // Agregar listeners dinámicos
        inputsDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateDynamicShape(shape);
            });
        });
    }

    calculateDynamicShape(shape) {
        const resultsDiv = document.getElementById('calcResults');
        if (!resultsDiv) return;

        let resultHTML = '';

        switch(shape) {
            case 'triangulo':
                const base = parseFloat(document.getElementById('dynTriBase')?.value) || 0;
                const height = parseFloat(document.getElementById('dynTriHeight')?.value) || 0;
                if (base > 0 && height > 0) {
                    const area = (base * height) / 2;
                    const perimeter = base + 2 * Math.sqrt((base/2)**2 + height**2);
                    resultHTML = `
                        <div><strong>Área:</strong> ${this.formatNumber(area)} u²</div>
                        <div><strong>Perímetro:</strong> ${this.formatNumber(perimeter)} u</div>
                        <div class="mt-1"><em>Fórmula: A = (b × h) ÷ 2</em></div>
                    `;
                }
                break;

            case 'cuadrado':
                const side = parseFloat(document.getElementById('dynSqSide')?.value) || 0;
                if (side > 0) {
                    const area = side * side;
                    const perimeter = side * 4;
                    const diagonal = side * Math.sqrt(2);
                    resultHTML = `
                        <div><strong>Área:</strong> ${this.formatNumber(area)} u²</div>
                        <div><strong>Perímetro:</strong> ${this.formatNumber(perimeter)} u</div>
                        <div><strong>Diagonal:</strong> ${this.formatNumber(diagonal)} u</div>
                        <div class="mt-1"><em>Fórmula: A = l²</em></div>
                    `;
                }
                break;

            case 'rectangulo':
                const rectBase = parseFloat(document.getElementById('dynRectBase')?.value) || 0;
                const rectHeight = parseFloat(document.getElementById('dynRectHeight')?.value) || 0;
                if (rectBase > 0 && rectHeight > 0) {
                    const area = rectBase * rectHeight;
                    const perimeter = 2 * (rectBase + rectHeight);
                    const diagonal = Math.sqrt(rectBase**2 + rectHeight**2);
                    resultHTML = `
                        <div><strong>Área:</strong> ${this.formatNumber(area)} u²</div>
                        <div><strong>Perímetro:</strong> ${this.formatNumber(perimeter)} u</div>
                        <div><strong>Diagonal:</strong> ${this.formatNumber(diagonal)} u</div>
                        <div class="mt-1"><em>Fórmula: A = b × h</em></div>
                    `;
                }
                break;

            case 'circulo':
                const radius = parseFloat(document.getElementById('dynCircRadius')?.value) || 0;
                if (radius > 0) {
                    const area = Math.PI * radius * radius;
                    const perimeter = 2 * Math.PI * radius;
                    const diameter = 2 * radius;
                    resultHTML = `
                        <div><strong>Área:</strong> ${this.formatNumber(area)} u²</div>
                        <div><strong>Perímetro:</strong> ${this.formatNumber(perimeter)} u</div>
                        <div><strong>Diámetro:</strong> ${this.formatNumber(diameter)} u</div>
                        <div class="mt-1"><em>Fórmula: A = π × r²</em></div>
                    `;
                }
                break;

            case 'poligono':
                const n = parseInt(document.getElementById('dynPolyN')?.value) || 6;
                const polySide = parseFloat(document.getElementById('dynPolySide')?.value) || 0;
                if (n >= 3 && polySide > 0) {
                    const perimeter = n * polySide;
                    const apothem = polySide / (2 * Math.tan(Math.PI / n));
                    const area = (perimeter * apothem) / 2;
                    resultHTML = `
                        <div><strong>Área:</strong> ${this.formatNumber(area)} u²</div>
                        <div><strong>Perímetro:</strong> ${this.formatNumber(perimeter)} u</div>
                        <div><strong>Apotema:</strong> ${this.formatNumber(apothem)} u</div>
                        <div class="mt-1"><em>Polígono regular de ${n} lados</em></div>
                    `;
                }
                break;
        }

        resultsDiv.innerHTML = resultHTML || '<div class="text-center text-muted">Introduce valores válidos</div>';
    }

    // ========== CALCULADORA DINÁMICA 3D ==========
    update3DCalculatorInputs(shape) {
        const inputsDiv = document.getElementById('calc3dInputs');
        const resultsDiv = document.getElementById('calc3dResults');

        if (!inputsDiv || !resultsDiv) return;

        let inputsHTML = '';

        switch(shape) {
            case 'cubo':
                inputsHTML = `
                    <div class="form-group">
                        <label>Arista:</label>
                        <input type="number" id="dyn3DCubeEdge" placeholder="Arista">
                    </div>
                `;
                break;
            case 'esfera':
                inputsHTML = `
                    <div class="form-group">
                        <label>Radio:</label>
                        <input type="number" id="dyn3DSphereRadius" placeholder="Radio">
                    </div>
                `;
                break;
            case 'cilindro':
                inputsHTML = `
                    <div class="form-group">
                        <label>Radio:</label>
                        <input type="number" id="dyn3DCylRadius" placeholder="Radio">
                    </div>
                    <div class="form-group">
                        <label>Altura:</label>
                        <input type="number" id="dyn3DCylHeight" placeholder="Altura">
                    </div>
                `;
                break;
            case 'cono':
                inputsHTML = `
                    <div class="form-group">
                        <label>Radio:</label>
                        <input type="number" id="dyn3DConeRadius" placeholder="Radio">
                    </div>
                    <div class="form-group">
                        <label>Altura:</label>
                        <input type="number" id="dyn3DConeHeight" placeholder="Altura">
                    </div>
                `;
                break;
            case 'piramide':
                inputsHTML = `
                    <div class="form-group">
                        <label>Base:</label>
                        <input type="number" id="dyn3DPyramidBase" placeholder="Lado de la base">
                    </div>
                    <div class="form-group">
                        <label>Altura:</label>
                        <input type="number" id="dyn3DPyramidHeight" placeholder="Altura">
                    </div>
                `;
                break;
        }

        inputsDiv.innerHTML = inputsHTML;
        resultsDiv.innerHTML = '<div class="text-center text-muted">Introduce valores para calcular</div>';

        // Agregar listeners dinámicos
        inputsDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateDynamic3DShape(shape);
            });
        });
    }

    calculateDynamic3DShape(shape) {
        const resultsDiv = document.getElementById('calc3dResults');
        if (!resultsDiv) return;

        let resultHTML = '';

        switch(shape) {
            case 'cubo':
                const edge = parseFloat(document.getElementById('dyn3DCubeEdge')?.value) || 0;
                if (edge > 0) {
                    const volume = edge ** 3;
                    const surface = 6 * edge ** 2;
                    const diagonal = edge * Math.sqrt(3);
                    resultHTML = `
                        <div><strong>Volumen:</strong> ${this.formatNumber(volume)} u³</div>
                        <div><strong>Superficie:</strong> ${this.formatNumber(surface)} u²</div>
                        <div><strong>Diagonal:</strong> ${this.formatNumber(diagonal)} u</div>
                        <div class="mt-1"><em>Fórmula: V = a³</em></div>
                    `;
                }
                break;

            case 'esfera':
                const radius = parseFloat(document.getElementById('dyn3DSphereRadius')?.value) || 0;
                if (radius > 0) {
                    const volume = (4/3) * Math.PI * radius ** 3;
                    const surface = 4 * Math.PI * radius ** 2;
                    const diameter = 2 * radius;
                    resultHTML = `
                        <div><strong>Volumen:</strong> ${this.formatNumber(volume)} u³</div>
                        <div><strong>Superficie:</strong> ${this.formatNumber(surface)} u²</div>
                        <div><strong>Diámetro:</strong> ${this.formatNumber(diameter)} u</div>
                        <div class="mt-1"><em>Fórmula: V = 4/3 × π × r³</em></div>
                    `;
                }
                break;

            case 'cilindro':
                const cylRadius = parseFloat(document.getElementById('dyn3DCylRadius')?.value) || 0;
                const cylHeight = parseFloat(document.getElementById('dyn3DCylHeight')?.value) || 0;
                if (cylRadius > 0 && cylHeight > 0) {
                    const volume = Math.PI * cylRadius ** 2 * cylHeight;
                    const surface = 2 * Math.PI * cylRadius * (cylRadius + cylHeight);
                    const baseArea = Math.PI * cylRadius ** 2;
                    resultHTML = `
                        <div><strong>Volumen:</strong> ${this.formatNumber(volume)} u³</div>
                        <div><strong>Superficie:</strong> ${this.formatNumber(surface)} u²</div>
                        <div><strong>Área base:</strong> ${this.formatNumber(baseArea)} u²</div>
                        <div class="mt-1"><em>Fórmula: V = π × r² × h</em></div>
                    `;
                }
                break;

            case 'cono':
                const coneRadius = parseFloat(document.getElementById('dyn3DConeRadius')?.value) || 0;
                const coneHeight = parseFloat(document.getElementById('dyn3DConeHeight')?.value) || 0;
                if (coneRadius > 0 && coneHeight > 0) {
                    const volume = (1/3) * Math.PI * coneRadius ** 2 * coneHeight;
                    const generatrix = Math.sqrt(coneRadius ** 2 + coneHeight ** 2);
                    const surface = Math.PI * coneRadius * (coneRadius + generatrix);
                    resultHTML = `
                        <div><strong>Volumen:</strong> ${this.formatNumber(volume)} u³</div>
                        <div><strong>Superficie:</strong> ${this.formatNumber(surface)} u²</div>
                        <div><strong>Generatriz:</strong> ${this.formatNumber(generatrix)} u</div>
                        <div class="mt-1"><em>Fórmula: V = 1/3 × π × r² × h</em></div>
                    `;
                }
                break;

            case 'piramide':
                const base = parseFloat(document.getElementById('dyn3DPyramidBase')?.value) || 0;
                const height = parseFloat(document.getElementById('dyn3DPyramidHeight')?.value) || 0;
                if (base > 0 && height > 0) {
                    const volume = (1/3) * base ** 2 * height;
                    const baseArea = base ** 2;
                    const lateralEdge = Math.sqrt(height ** 2 + (base/2) ** 2);
                    const surface = baseArea + 2 * base * Math.sqrt((base/2) ** 2 + height ** 2);
                    resultHTML = `
                        <div><strong>Volumen:</strong> ${this.formatNumber(volume)} u³</div>
                        <div><strong>Superficie:</strong> ${this.formatNumber(surface)} u²</div>
                        <div><strong>Arista lateral:</strong> ${this.formatNumber(lateralEdge)} u</div>
                        <div class="mt-1"><em>Pirámide cuadrada: V = 1/3 × a² × h</em></div>
                    `;
                }
                break;
        }

        resultsDiv.innerHTML = resultHTML || '<div class="text-center text-muted">Introduce valores válidos</div>';
    }

    // ========== UTILIDADES ==========
    formatNumber(num) {
        if (!isFinite(num)) return 'Indefinido';
        return num.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    // ========== LOCAL STORAGE ==========
    loadLocalStorage() {
        const saved = localStorage.getItem('meskeia_geometria');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.currentSection) {
                    this.showSection(data.currentSection);
                }
                console.log('📊 Datos cargados desde localStorage');
            } catch (e) {
                console.warn('⚠️ Error cargando localStorage:', e);
            }
        }
    }

    saveToLocalStorage() {
        const data = {
            currentSection: this.currentSection,
            currentShape: this.currentShape,
            current3DShape: this.current3DShape,
            currentTransform: this.currentTransform,
            timestamp: Date.now()
        };

        localStorage.setItem('meskeia_geometria', JSON.stringify(data));
    }

    // ========== DESTRUCTOR ==========
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.saveToLocalStorage();
        console.log('🔄 Aplicación destruida, datos guardados');
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar aplicación principal
    window.geometriaApp = new GeometriaApp();

    // Guardar automáticamente cada 30 segundos
    setInterval(() => {
        if (window.geometriaApp) {
            window.geometriaApp.saveToLocalStorage();
        }
    }, 30000);

    // Guardar al salir de la página
    window.addEventListener('beforeunload', () => {
        if (window.geometriaApp) {
            window.geometriaApp.destroy();
        }
    });

    console.log('🎯 Geometría Interactiva meskeIA v1.0 cargada');
    console.log('📐 Funciones disponibles: Figuras 2D/3D, Ángulos, Áreas, Volúmenes, Transformaciones');
});

// ========== SERVICE WORKER ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('✅ Service Worker registrado:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ Error registrando Service Worker:', error);
            });
    });
}