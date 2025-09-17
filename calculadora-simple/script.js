// Variables globales
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;
let historyArray = [];
const MAX_DISPLAY_LENGTH = 12; // Máximo de caracteres en pantalla

// Elementos del DOM
const display = document.getElementById('display');
const history = document.getElementById('history');
const historyList = document.getElementById('historyList');

// Formatear número para display
function formatForDisplay(numStr) {
    // Si el número cabe, mostrarlo tal cual
    if (numStr.length <= MAX_DISPLAY_LENGTH) {
        return numStr;
    }
    
    const num = parseFloat(numStr);
    
    // Si es un número muy grande o muy pequeño, usar notación científica
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
    }
    
    // Si tiene decimales, intentar recortar
    if (numStr.includes('.')) {
        const parts = numStr.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];
        
        // Calcular cuántos decimales podemos mostrar
        const availableSpace = MAX_DISPLAY_LENGTH - integerPart.length - 1; // -1 por el punto
        
        if (availableSpace > 0) {
            return integerPart + '.' + decimalPart.substring(0, availableSpace);
        } else {
            // Si no hay espacio para decimales, redondear
            return Math.round(num).toString();
        }
    }
    
    // Para números enteros muy largos, usar notación científica
    return num.toExponential(6);
}

// Actualizar pantalla
function updateDisplay() {
    display.textContent = formatForDisplay(currentInput);
    
    // Ajustar tamaño de fuente si es necesario
    const displayLength = display.textContent.length;
    if (displayLength > 10) {
        display.style.fontSize = '36px';
    } else if (displayLength > 8) {
        display.style.fontSize = '42px';
    } else {
        display.style.fontSize = '48px';
    }
    
    if (operation && previousInput) {
        history.textContent = `${formatForDisplay(previousInput)} ${getOperatorSymbol(operation)}`;
    } else {
        history.textContent = '';
    }
}

// Convertir operador a símbolo visual
function getOperatorSymbol(op) {
    switch(op) {
        case '*': return '×';
        case '/': return '÷';
        case '-': return '−';
        case '+': return '+';
        default: return op;
    }
}

// Agregar número
function appendNumber(num) {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    
    if (currentInput === '0') {
        currentInput = num;
    } else if (currentInput.replace('.', '').replace('-', '').length < MAX_DISPLAY_LENGTH) { // Límite de dígitos
        currentInput += num;
    }
    updateDisplay();
}

// Agregar decimal
function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Agregar operador
function appendOperator(op) {
    if (operation !== null && !shouldResetScreen) {
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
    updateDisplay();
}

// Calcular resultado
function calculate() {
    if (operation === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Error: División por cero');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Redondear para evitar problemas de punto flotante
    result = Math.round(result * 100000000) / 100000000;
    
    // Agregar al historial
    addToHistory(`${previousInput} ${getOperatorSymbol(operation)} ${currentInput}`, result.toString());
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

// NUEVAS FUNCIONES - FASE 1

// Cambiar signo (+/-)
function toggleSign() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        currentInput = (current * -1).toString();
        updateDisplay();
    }
}

// Calcular porcentaje
function percentage() {
    if (operation && previousInput) {
        // Si hay una operación pendiente, calcular el porcentaje del primer número
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (!isNaN(prev) && !isNaN(current)) {
            currentInput = ((prev * current) / 100).toString();
            updateDisplay();
        }
    } else {
        // Si no hay operación, dividir entre 100
        const current = parseFloat(currentInput);
        if (!isNaN(current)) {
            currentInput = (current / 100).toString();
            addToHistory(`${current}%`, currentInput);
            updateDisplay();
            shouldResetScreen = true;
        }
    }
}

// Elevar al cuadrado
function square() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        const result = Math.pow(current, 2);
        addToHistory(`${current}²`, result.toString());
        currentInput = result.toString();
        shouldResetScreen = true;
        updateDisplay();
    }
}

// Raíz cuadrada
function squareRoot() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        if (current < 0) {
            alert('Error: No se puede calcular la raíz cuadrada de un número negativo');
            return;
        }
        const result = Math.sqrt(current);
        // Redondear para evitar problemas de punto flotante
        const roundedResult = Math.round(result * 100000000) / 100000000;
        addToHistory(`√${current}`, roundedResult.toString());
        currentInput = roundedResult.toString();
        shouldResetScreen = true;
        updateDisplay();
    }
}

// NUEVAS FUNCIONES MATEMÁTICAS

// Logaritmo base 10
function log10() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        if (current <= 0) {
            alert('Error: El logaritmo solo está definido para números positivos');
            return;
        }
        const result = Math.log10(current);
        const roundedResult = Math.round(result * 100000000) / 100000000;
        addToHistory(`log(${current})`, roundedResult.toString());
        currentInput = roundedResult.toString();
        shouldResetScreen = true;
        updateDisplay();
    }
}

// Logaritmo natural (base e)
function logNatural() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        if (current <= 0) {
            alert('Error: El logaritmo solo está definido para números positivos');
            return;
        }
        const result = Math.log(current);
        const roundedResult = Math.round(result * 100000000) / 100000000;
        addToHistory(`ln(${current})`, roundedResult.toString());
        currentInput = roundedResult.toString();
        shouldResetScreen = true;
        updateDisplay();
    }
}

// Recíproco (1/x)
function reciprocal() {
    const current = parseFloat(currentInput);
    if (!isNaN(current)) {
        if (current === 0) {
            alert('Error: División por cero');
            return;
        }
        const result = 1 / current;
        const roundedResult = Math.round(result * 100000000) / 100000000;
        addToHistory(`1/${current}`, roundedResult.toString());
        currentInput = roundedResult.toString();
        shouldResetScreen = true;
        updateDisplay();
    }
}

// Insertar constante Pi
function insertPi() {
    if (shouldResetScreen || currentInput === '0') {
        // Limitar Pi a 10 decimales para mejor visualización
        currentInput = (Math.round(Math.PI * 1e10) / 1e10).toString();
        shouldResetScreen = false;
    }
    updateDisplay();
}

// Insertar constante e (número de Euler)
function insertE() {
    if (shouldResetScreen || currentInput === '0') {
        // Limitar e a 10 decimales para mejor visualización
        currentInput = (Math.round(Math.E * 1e10) / 1e10).toString();
        shouldResetScreen = false;
    }
    updateDisplay();
}

// Limpiar todo
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

// Borrar último dígito
function deleteLast() {
    if (currentInput !== '0') {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '' || currentInput === '-') {
            currentInput = '0';
        }
    }
    updateDisplay();
}

// Agregar al historial
function addToHistory(operation, result) {
    const historyItem = {
        operation: operation,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    historyArray.unshift(historyItem); // Agregar al principio
    
    // Limitar el historial a 10 elementos
    if (historyArray.length > 10) {
        historyArray.pop();
    }
    
    renderHistory();
    saveHistoryToLocalStorage();
}

// Renderizar historial
function renderHistory() {
    historyList.innerHTML = '';
    
    historyArray.forEach((item, index) => {
        const historyElement = document.createElement('div');
        historyElement.className = 'history-item';
        historyElement.innerHTML = `
            <div class="operation">${item.operation}</div>
            <div class="result">${item.result}</div>
        `;
        
        // Hacer clickeable para reutilizar el resultado
        historyElement.title = 'Click para usar este resultado';
        historyElement.onclick = () => {
            currentInput = item.result;
            shouldResetScreen = false;
            updateDisplay();
        };
        
        historyList.appendChild(historyElement);
    });
}

// Limpiar historial
function clearHistory() {
    historyArray = [];
    renderHistory();
    localStorage.removeItem('calculatorHistory');
}

// Guardar historial en localStorage
function saveHistoryToLocalStorage() {
    localStorage.setItem('calculatorHistory', JSON.stringify(historyArray));
}

// Cargar historial desde localStorage
function loadHistoryFromLocalStorage() {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
        historyArray = JSON.parse(saved);
        renderHistory();
    }
}

// Manejo del teclado - ACTUALIZADO
document.addEventListener('keydown', (e) => {
    // Prevenir comportamiento por defecto para teclas especiales
    if (['/', '%'].includes(e.key)) {
        e.preventDefault();
    }
    
    // Números
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    }
    // Operadores
    else if (e.key === '+') {
        appendOperator('+');
    }
    else if (e.key === '-') {
        // Distinguir entre operador menos y cambio de signo
        if (e.altKey || e.ctrlKey) {
            toggleSign();
        } else {
            appendOperator('-');
        }
    }
    else if (e.key === '*') {
        appendOperator('*');
    }
    else if (e.key === '/') {
        appendOperator('/');
    }
    // Funciones especiales
    else if (e.key === '%') {
        percentage();
    }
    else if (e.key.toLowerCase() === 'q') {
        square();
    }
    else if (e.key.toLowerCase() === 'r') {
        squareRoot();
    }
    // Decimal
    else if (e.key === '.' || e.key === ',') {
        appendDecimal();
    }
    // Enter o igual
    else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    // Escape o C para limpiar
    else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearAll();
    }
    // Backspace para borrar
    else if (e.key === 'Backspace') {
        deleteLast();
    }
});

// Toggle historial
function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    panel.classList.toggle('show');
}

// Inicializar al cargar la página
window.addEventListener('load', () => {
    loadHistoryFromLocalStorage();
    updateDisplay();
});

// Prevenir el zoom en móviles al hacer doble tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Cerrar historial al hacer click fuera
document.addEventListener('click', (e) => {
    const panel = document.getElementById('historyPanel');
    const toggle = document.querySelector('.history-toggle');
    
    if (!panel.contains(e.target) && !toggle.contains(e.target) && panel.classList.contains('show')) {
        panel.classList.remove('show');
    }
});