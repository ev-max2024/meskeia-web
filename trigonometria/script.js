// Aplicación de Trigonometría - meskeIA
// =====================================

// Constantes
const PI = Math.PI;

// Utilidades para formato español
function formatNumber(num, decimals = 4) {
    // Manejo de valores especiales
    if (isNaN(num)) return 'No definido';
    if (!isFinite(num)) {
        return num > 0 ? '∞' : '-∞';
    }
    // Para valores muy grandes pero finitos
    if (Math.abs(num) > 9999) {
        return num > 0 ? '∞' : '-∞';
    }
    // Para valores muy pequeños (cercanos a cero)
    if (Math.abs(num) < 0.0001 && num !== 0) {
        return '≈0';
    }
    return num.toFixed(decimals).replace('.', ',');
}

// Conversiones
function degreesToRadians(degrees) {
    return degrees * (PI / 180);
}

function radiansToDegrees(radians) {
    return radians * (180 / PI);
}

// Clase principal de la aplicación
class TrigCalculator {
    constructor() {
        this.currentAngleDegrees = 45;
        this.unitCircleCanvas = null;
        this.triangleCanvas = null;
        this.functionCanvas = null;
        this.currentFunction = 'sin';

        this.init();
    }

    init() {
        this.setupCanvases();
        this.setupEventListeners();
        this.updateCalculations();
        this.drawUnitCircle();
        this.drawFunctionGraph();
    }

    setupCanvases() {
        this.unitCircleCanvas = document.getElementById('unit-circle');
        this.unitCircleCtx = this.unitCircleCanvas.getContext('2d');

        this.triangleCanvas = document.getElementById('triangle-canvas');
        this.triangleCtx = this.triangleCanvas.getContext('2d');

        this.functionCanvas = document.getElementById('function-graph');
        this.functionCtx = this.functionCanvas.getContext('2d');
    }

    setupEventListeners() {
        // Conversión de ángulos
        const degreesInput = document.getElementById('degrees');
        const radiansInput = document.getElementById('radians');

        degreesInput.addEventListener('input', (e) => {
            const degrees = parseFloat(e.target.value) || 0;
            const radians = degreesToRadians(degrees);
            radiansInput.value = formatNumber(radians).replace(',', '.');
        });

        radiansInput.addEventListener('input', (e) => {
            const radians = parseFloat(e.target.value.replace(',', '.')) || 0;
            const degrees = radiansToDegrees(radians);
            degreesInput.value = formatNumber(degrees, 2).replace(',', '.');
        });

        // Funciones trigonométricas
        const angleInput = document.getElementById('angle-input');
        const angleUnit = document.getElementById('angle-unit');

        const updateTrigFunctions = () => {
            const value = parseFloat(angleInput.value) || 0;
            const unit = angleUnit.value;
            const angleInRadians = unit === 'degrees' ? degreesToRadians(value) : value;
            const angleInDegrees = unit === 'degrees' ? value : radiansToDegrees(value);

            this.currentAngleDegrees = angleInDegrees;
            this.updateCalculations(angleInRadians);
            this.updateSlider(angleInDegrees);
            this.drawUnitCircle();
        };

        angleInput.addEventListener('input', updateTrigFunctions);
        angleUnit.addEventListener('change', updateTrigFunctions);

        // Slider del círculo unitario
        const angleSlider = document.getElementById('angle-slider');
        angleSlider.addEventListener('input', (e) => {
            const degrees = parseFloat(e.target.value);
            this.currentAngleDegrees = degrees;
            document.getElementById('angle-display').textContent = `${degrees}°`;
            document.getElementById('angle-input').value = degrees;
            document.getElementById('angle-unit').value = 'degrees';
            this.updateCalculations(degreesToRadians(degrees));
            this.drawUnitCircle();
        });

        // Resolver triángulo
        document.getElementById('solve-triangle').addEventListener('click', () => {
            this.solveTriangle();
        });

        document.getElementById('clear-triangle').addEventListener('click', () => {
            this.clearTriangle();
        });

        // Botones de funciones
        document.querySelectorAll('.btn-function').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-function').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFunction = e.target.dataset.function;
                this.drawFunctionGraph();
            });
        });
    }

    updateCalculations(angleInRadians) {
        const sin = Math.sin(angleInRadians);
        const cos = Math.cos(angleInRadians);
        const tan = Math.tan(angleInRadians);

        // Manejar casos especiales para funciones recíprocas
        const csc = Math.abs(sin) < 0.0001 ? (sin >= 0 ? Infinity : -Infinity) : 1 / sin;
        const sec = Math.abs(cos) < 0.0001 ? (cos >= 0 ? Infinity : -Infinity) : 1 / cos;
        const cot = Math.abs(tan) < 0.0001 ? (tan >= 0 ? Infinity : -Infinity) : 1 / tan;

        // Manejar tangente en ángulos especiales (90°, 270°, etc.)
        const tanValue = Math.abs(cos) < 0.0001 ? (sin >= 0 ? Infinity : -Infinity) : tan;

        document.getElementById('sin-result').textContent = formatNumber(sin);
        document.getElementById('cos-result').textContent = formatNumber(cos);
        document.getElementById('tan-result').textContent = formatNumber(tanValue);
        document.getElementById('csc-result').textContent = formatNumber(csc);
        document.getElementById('sec-result').textContent = formatNumber(sec);
        document.getElementById('cot-result').textContent = formatNumber(cot);
    }

    updateSlider(degrees) {
        document.getElementById('angle-slider').value = degrees;
        document.getElementById('angle-display').textContent = `${Math.round(degrees)}°`;
    }

    drawUnitCircle() {
        const canvas = this.unitCircleCanvas;
        const ctx = this.unitCircleCtx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configurar estilos
        ctx.lineWidth = 2;
        ctx.font = '14px Arial';

        // Dibujar ejes
        ctx.strokeStyle = '#e1e8ed';
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();

        // Dibujar círculo unitario
        ctx.strokeStyle = '#4a90e2';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * PI);
        ctx.stroke();

        // Calcular posición del punto
        const angleRad = degreesToRadians(this.currentAngleDegrees);
        const x = Math.cos(angleRad);
        const y = Math.sin(angleRad);
        const pointX = centerX + x * radius;
        const pointY = centerY - y * radius; // Invertir Y para sistema de coordenadas matemático

        // Dibujar radio
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pointX, pointY);
        ctx.stroke();

        // Dibujar punto
        ctx.fillStyle = '#0066cc';
        ctx.beginPath();
        ctx.arc(pointX, pointY, 8, 0, 2 * PI);
        ctx.fill();

        // Dibujar proyecciones (seno y coseno)
        ctx.strokeStyle = '#00a8ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Proyección horizontal (coseno)
        ctx.beginPath();
        ctx.moveTo(pointX, pointY);
        ctx.lineTo(pointX, centerY);
        ctx.stroke();

        // Proyección vertical (seno)
        ctx.beginPath();
        ctx.moveTo(pointX, pointY);
        ctx.lineTo(centerX, pointY);
        ctx.stroke();

        ctx.setLineDash([]);

        // Etiquetas
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(`cos: ${formatNumber(x)}`, pointX + 10, centerY - 10);
        ctx.fillText(`sen: ${formatNumber(y)}`, centerX + 10, pointY - 10);
        ctx.fillText(`(${formatNumber(x)}, ${formatNumber(y)})`, pointX + 10, pointY + 20);

        // Dibujar ángulo
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, -angleRad, true);
        ctx.stroke();

        // Etiqueta del ángulo
        ctx.fillStyle = '#ff9800';
        const labelX = centerX + Math.cos(-angleRad/2) * 60;
        const labelY = centerY + Math.sin(-angleRad/2) * 60;
        ctx.fillText(`${this.currentAngleDegrees.toFixed(0)}°`, labelX, labelY);
    }

    drawTriangle(a = null, b = null, c = null, angleA = null, angleB = null) {
        const canvas = this.triangleCanvas;
        const ctx = this.triangleCtx;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Si no hay valores, dibujar triángulo ejemplo
        if (!a && !b && !c && !angleA && !angleB) {
            a = 3;
            b = 4;
            c = 5;
            angleA = radiansToDegrees(Math.asin(a/c));
            angleB = radiansToDegrees(Math.asin(b/c));
        }

        // Escalar para que quepa en el canvas
        const maxSide = Math.max(a || 0, b || 0, c || 0);
        const scale = 200 / maxSide;
        const margin = 50;

        // Posiciones de los vértices
        const Cx = margin;
        const Cy = canvas.height - margin;
        const Bx = Cx + (b || 0) * scale;
        const By = Cy;
        const Ax = Cx + ((b || 0) - (a || 0) * Math.cos(degreesToRadians(angleA || 0))) * scale;
        const Ay = Cy - (a || 0) * Math.sin(degreesToRadians(angleA || 0)) * scale;

        // Dibujar triángulo
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(Cx, Cy);
        ctx.lineTo(Bx, By);
        ctx.lineTo(Ax, Ay);
        ctx.closePath();
        ctx.stroke();

        // Rellenar triángulo
        ctx.fillStyle = 'rgba(0, 102, 204, 0.1)';
        ctx.fill();

        // Dibujar ángulo recto
        const squareSize = 20;
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Cx, Cy - squareSize);
        ctx.lineTo(Cx + squareSize, Cy - squareSize);
        ctx.lineTo(Cx + squareSize, Cy);
        ctx.stroke();

        // Etiquetas
        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Arial';

        // Lados
        if (a) ctx.fillText(`a = ${formatNumber(a, 2)}`, (Cx + Ax) / 2 - 30, (Cy + Ay) / 2);
        if (b) ctx.fillText(`b = ${formatNumber(b, 2)}`, (Cx + Bx) / 2, Cy + 25);
        if (c) ctx.fillText(`c = ${formatNumber(c, 2)}`, (Bx + Ax) / 2 + 10, (By + Ay) / 2);

        // Ángulos
        if (angleA) ctx.fillText(`A = ${formatNumber(angleA, 1)}°`, Ax - 20, Ay - 10);
        if (angleB) ctx.fillText(`B = ${formatNumber(angleB, 1)}°`, Bx + 10, By - 10);

        // Actualizar información del triángulo
        if (a && b) {
            const area = (a * b) / 2;
            const perimeter = a + b + (c || Math.sqrt(a*a + b*b));
            document.getElementById('triangle-area').textContent = formatNumber(area, 2);
            document.getElementById('triangle-perimeter').textContent = formatNumber(perimeter, 2);
        }
    }

    drawFunctionGraph() {
        const canvas = this.functionCanvas;
        const ctx = this.functionCtx;
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);

        // Dibujar ejes
        ctx.strokeStyle = '#e1e8ed';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Dibujar función
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const scale = 50;
        const xRange = width / scale;

        for (let px = 0; px <= width; px++) {
            const x = (px / width) * xRange * PI - xRange * PI / 2;
            let y;

            switch(this.currentFunction) {
                case 'sin':
                    y = Math.sin(x);
                    break;
                case 'cos':
                    y = Math.cos(x);
                    break;
                case 'tan':
                    y = Math.tan(x);
                    // Limitar tangente para visualización
                    if (Math.abs(y) > 5) continue;
                    break;
            }

            const py = centerY - y * scale;

            if (px === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();

        // Etiquetas
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.fillText('−2π', 10, centerY + 20);
        ctx.fillText('−π', width/4 - 10, centerY + 20);
        ctx.fillText('0', width/2 - 5, centerY + 20);
        ctx.fillText('π', 3*width/4 - 5, centerY + 20);
        ctx.fillText('2π', width - 25, centerY + 20);
    }

    solveTriangle() {
        // Obtener valores de los inputs
        let a = parseFloat(document.getElementById('side-a').value) || null;
        let b = parseFloat(document.getElementById('side-b').value) || null;
        let c = parseFloat(document.getElementById('side-c').value) || null;
        let angleA = parseFloat(document.getElementById('angle-A').value) || null;
        let angleB = parseFloat(document.getElementById('angle-B').value) || null;

        // Contador de valores conocidos
        let knownValues = 0;
        if (a) knownValues++;
        if (b) knownValues++;
        if (c) knownValues++;
        if (angleA) knownValues++;
        if (angleB) knownValues++;

        // Necesitamos al menos 2 valores para resolver
        if (knownValues < 2) {
            alert('Por favor, ingresa al menos 2 valores para resolver el triángulo');
            return;
        }

        // Resolver el triángulo según los datos disponibles

        // Si tenemos los 3 lados
        if (a && b && c) {
            // Verificar que sea un triángulo válido
            if (a + b <= c || a + c <= b || b + c <= a) {
                alert('Los lados no forman un triángulo válido');
                return;
            }
            // Calcular ángulos usando ley de cosenos
            angleA = radiansToDegrees(Math.acos((b*b + c*c - a*a) / (2*b*c)));
            angleB = radiansToDegrees(Math.acos((a*a + c*c - b*b) / (2*a*c)));
        }
        // Si tenemos 2 lados y el ángulo entre ellos
        else if (a && b && !c) {
            // Teorema de Pitágoras
            c = Math.sqrt(a*a + b*b);
            angleA = radiansToDegrees(Math.atan(a/b));
            angleB = radiansToDegrees(Math.atan(b/a));
        }
        else if (a && c && !b) {
            // Teorema de Pitágoras
            b = Math.sqrt(c*c - a*a);
            if (isNaN(b)) {
                alert('El lado a no puede ser mayor que la hipotenusa c');
                return;
            }
            angleA = radiansToDegrees(Math.asin(a/c));
            angleB = radiansToDegrees(Math.acos(a/c));
        }
        else if (b && c && !a) {
            // Teorema de Pitágoras
            a = Math.sqrt(c*c - b*b);
            if (isNaN(a)) {
                alert('El lado b no puede ser mayor que la hipotenusa c');
                return;
            }
            angleA = radiansToDegrees(Math.acos(b/c));
            angleB = radiansToDegrees(Math.asin(b/c));
        }
        // Si tenemos un lado y un ángulo
        else if (c && angleA && !a) {
            a = c * Math.sin(degreesToRadians(angleA));
            b = c * Math.cos(degreesToRadians(angleA));
            angleB = 90 - angleA;
        }
        else if (c && angleB && !b) {
            b = c * Math.sin(degreesToRadians(angleB));
            a = c * Math.cos(degreesToRadians(angleB));
            angleA = 90 - angleB;
        }
        else if (a && angleA && !c) {
            c = a / Math.sin(degreesToRadians(angleA));
            b = a / Math.tan(degreesToRadians(angleA));
            angleB = 90 - angleA;
        }
        else if (b && angleB && !c) {
            c = b / Math.sin(degreesToRadians(angleB));
            a = b / Math.tan(degreesToRadians(angleB));
            angleA = 90 - angleB;
        }

        // Actualizar los campos con los valores calculados
        if (a) document.getElementById('side-a').value = formatNumber(a, 3).replace(',', '.');
        if (b) document.getElementById('side-b').value = formatNumber(b, 3).replace(',', '.');
        if (c) document.getElementById('side-c').value = formatNumber(c, 3).replace(',', '.');
        if (angleA) document.getElementById('angle-A').value = formatNumber(angleA, 2).replace(',', '.');
        if (angleB) document.getElementById('angle-B').value = formatNumber(angleB, 2).replace(',', '.');

        // Dibujar el triángulo
        this.drawTriangle(a, b, c, angleA, angleB);
    }

    clearTriangle() {
        document.getElementById('side-a').value = '';
        document.getElementById('side-b').value = '';
        document.getElementById('side-c').value = '';
        document.getElementById('angle-A').value = '';
        document.getElementById('angle-B').value = '';
        document.getElementById('triangle-area').textContent = '0';
        document.getElementById('triangle-perimeter').textContent = '0';

        // Limpiar canvas
        const ctx = this.triangleCtx;
        ctx.clearRect(0, 0, this.triangleCanvas.width, this.triangleCanvas.height);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new TrigCalculator();

    // Dibujar triángulo ejemplo inicial
    app.drawTriangle();

    // Animación suave del logo meskeIA
    const logo = document.querySelector('.meskeia-logo-container');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.02)';
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1)';
        });
    }

    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registrado exitosamente:', registration.scope);
                })
                .catch((error) => {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }

    // Mensaje de bienvenida en consola
    console.log('%c🎯 Calculadora de Trigonometría - meskeIA', 'color: #0066cc; font-size: 20px; font-weight: bold;');
    console.log('%cExplora las funciones trigonométricas de forma visual e interactiva', 'color: #4a90e2; font-size: 14px;');
    console.log('%c📱 App instalable como PWA', 'color: #48A9A6; font-size: 12px;');
});