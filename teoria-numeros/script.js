// Teoría de Números - JavaScript
// meskeIA 2025

// Configuración global para formato español
const LOCALE_CONFIG = {
    locale: 'es-ES',
    currency: 'EUR',
    timezone: 'Europe/Madrid'
};

// ==========================================
// UTILIDADES GENERALES
// ==========================================

// Formatear números con separadores de miles (español)
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Mostrar resultado con estilo
function showResult(elementId, content, isError = false) {
    const element = document.getElementById(elementId);
    element.innerHTML = content;
    element.className = isError ? 'result error' : 'result success';
}

// Validar entrada numérica
function validateNumber(value, min = 1, max = Infinity) {
    const num = parseInt(value);
    if (isNaN(num) || num < min || num > max) {
        return null;
    }
    return num;
}

// ==========================================
// NAVEGACIÓN POR TABS
// ==========================================

function showTab(tabName) {
    // Ocultar todos los contenidos
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Desactivar todos los tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Mostrar contenido seleccionado
    document.getElementById(tabName).classList.add('active');

    // Activar tab seleccionado
    event.target.classList.add('active');
}

// ==========================================
// FUNCIONES MATEMÁTICAS BÁSICAS
// ==========================================

// Verificar si un número es primo
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

// Calcular MCD usando algoritmo de Euclides
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Calcular MCM
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Algoritmo de Euclides extendido
function extendedGcd(a, b) {
    if (a === 0) return [b, 0, 1];

    const [gcd, x1, y1] = extendedGcd(b % a, a);
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;

    return [gcd, x, y];
}

// Factorización prima
function primeFactors(n) {
    const factors = [];

    // Factores de 2
    while (n % 2 === 0) {
        factors.push(2);
        n = n / 2;
    }

    // Factores impares
    for (let i = 3; i * i <= n; i += 2) {
        while (n % i === 0) {
            factors.push(i);
            n = n / i;
        }
    }

    // Si n es primo mayor que 2
    if (n > 2) {
        factors.push(n);
    }

    return factors;
}

// Encontrar todos los divisores
function findAllDivisors(n) {
    const divisors = [];
    for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
            divisors.push(i);
            if (i !== n / i) {
                divisors.push(n / i);
            }
        }
    }
    return divisors.sort((a, b) => a - b);
}

// Función de Euler φ(n)
function eulerTotientFunction(n) {
    let result = n;
    const factors = [...new Set(primeFactors(n))]; // Factores primos únicos

    for (const p of factors) {
        result = result * (p - 1) / p;
    }

    return Math.floor(result);
}

// Potencia modular (exponenciación rápida)
function modularExponentiation(base, exp, mod) {
    let result = 1;
    base = base % mod;

    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }

    return result;
}

// Inverso modular
function modularInverseFunc(a, m) {
    const [g, x, y] = extendedGcd(a, m);
    if (g !== 1) return null; // No existe inverso
    return (x % m + m) % m;
}

// Criba de Eratóstenes
function sieveOfEratosthenesFunc(limit) {
    const primes = [];
    const isPrimeArray = new Array(limit + 1).fill(true);
    isPrimeArray[0] = isPrimeArray[1] = false;

    for (let i = 2; i * i <= limit; i++) {
        if (isPrimeArray[i]) {
            for (let j = i * i; j <= limit; j += i) {
                isPrimeArray[j] = false;
            }
        }
    }

    for (let i = 2; i <= limit; i++) {
        if (isPrimeArray[i]) primes.push(i);
    }

    return primes;
}

// ==========================================
// CALCULADORAS - NÚMEROS PRIMOS
// ==========================================

function checkPrime() {
    const input = document.getElementById('primeInput').value;
    const num = validateNumber(input, 2);

    if (num === null) {
        showResult('primeResult', '❌ Por favor, ingresa un número válido mayor que 1', true);
        return;
    }

    const isPrimeResult = isPrime(num);
    const factors = isPrimeResult ? [] : primeFactors(num);

    let resultHTML = `
        <h4>${isPrimeResult ? '✅' : '❌'} ${formatNumber(num)} ${isPrimeResult ? 'ES' : 'NO ES'} un número primo</h4>
    `;

    if (!isPrimeResult) {
        const factorMap = {};
        factors.forEach(f => factorMap[f] = (factorMap[f] || 0) + 1);

        const factorization = Object.entries(factorMap)
            .map(([prime, exp]) => exp === 1 ? prime : `${prime}^${exp}`)
            .join(' × ');

        resultHTML += `<p><strong>Factorización:</strong> ${formatNumber(num)} = ${factorization}</p>`;
    }

    showResult('primeResult', resultHTML, false);
}

function sieveOfEratosthenes() {
    const input = document.getElementById('sieveLimit').value;
    const limit = validateNumber(input, 2, 1000);

    if (limit === null) {
        showResult('sieveResult', '❌ Por favor, ingresa un número entre 2 y 1.000', true);
        return;
    }

    const primes = sieveOfEratosthenesFunc(limit);

    let resultHTML = `
        <h4>✅ Encontrados ${primes.length} números primos hasta ${formatNumber(limit)}</h4>
        <div class="numbers-list">
    `;

    primes.forEach(prime => {
        resultHTML += `<span class="number-item prime">${prime}</span>`;
    });

    resultHTML += '</div>';

    if (primes.length > 0) {
        resultHTML += `<p class="mt-2 text-muted">
            <strong>Primo más grande:</strong> ${primes[primes.length - 1]}<br>
            <strong>Densidad:</strong> ${((primes.length / limit) * 100).toFixed(2)}%
        </p>`;
    }

    showResult('sieveResult', resultHTML, false);
}

function primeFactorization() {
    const input = document.getElementById('factorInput').value;
    const num = validateNumber(input, 2);

    if (num === null) {
        showResult('factorResult', '❌ Por favor, ingresa un número válido mayor que 1', true);
        return;
    }

    const factors = primeFactors(num);
    const factorMap = {};
    factors.forEach(f => factorMap[f] = (factorMap[f] || 0) + 1);

    const factorization = Object.entries(factorMap)
        .map(([prime, exp]) => exp === 1 ? prime : `${prime}^${exp}`)
        .join(' × ');

    let resultHTML = `
        <h4>🧮 Factorización de ${formatNumber(num)}</h4>
        <div class="number-display">${formatNumber(num)} = ${factorization}</div>
        <div class="numbers-list">
    `;

    factors.forEach(factor => {
        resultHTML += `<span class="number-item prime">${factor}</span>`;
    });

    resultHTML += `</div>
        <p class="mt-2 text-muted">
            <strong>Total de factores primos:</strong> ${factors.length}<br>
            <strong>Factores primos únicos:</strong> ${Object.keys(factorMap).length}
        </p>
    `;

    showResult('factorResult', resultHTML, false);
}

function generatePrimes() {
    const input = document.getElementById('primeCount').value;
    const count = validateNumber(input, 1, 100);

    if (count === null) {
        showResult('generateResult', '❌ Por favor, ingresa un número entre 1 y 100', true);
        return;
    }

    const primes = [];
    let num = 2;

    while (primes.length < count) {
        if (isPrime(num)) {
            primes.push(num);
        }
        num++;
    }

    let resultHTML = `
        <h4>🎲 Primeros ${count} números primos</h4>
        <div class="numbers-list">
    `;

    primes.forEach(prime => {
        resultHTML += `<span class="number-item prime">${prime}</span>`;
    });

    resultHTML += `</div>
        <p class="mt-2 text-muted">
            <strong>Primo más grande:</strong> ${formatNumber(primes[primes.length - 1])}<br>
            <strong>Suma total:</strong> ${formatNumber(primes.reduce((a, b) => a + b, 0))}
        </p>
    `;

    showResult('generateResult', resultHTML, false);
}

// ==========================================
// CALCULADORAS - DIVISIBILIDAD
// ==========================================

function calculateGCD() {
    const a = validateNumber(document.getElementById('gcdA').value);
    const b = validateNumber(document.getElementById('gcdB').value);

    if (a === null || b === null) {
        showResult('gcdResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    const result = gcd(a, b);
    const [g, x, y] = extendedGcd(a, b);

    let resultHTML = `
        <h4>🔄 MCD(${formatNumber(a)}, ${formatNumber(b)}) = ${formatNumber(result)}</h4>
        <div class="number-display">MCD = ${formatNumber(result)}</div>
        <p><strong>Identidad de Bézout:</strong></p>
        <div class="number-display">${formatNumber(a)} × (${x}) + ${formatNumber(b)} × (${y}) = ${formatNumber(result)}</div>
    `;

    showResult('gcdResult', resultHTML, false);
}

function calculateLCM() {
    const a = validateNumber(document.getElementById('lcmA').value);
    const b = validateNumber(document.getElementById('lcmB').value);

    if (a === null || b === null) {
        showResult('lcmResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    const gcdResult = gcd(a, b);
    const lcmResult = lcm(a, b);

    let resultHTML = `
        <h4>🔢 MCM(${formatNumber(a)}, ${formatNumber(b)}) = ${formatNumber(lcmResult)}</h4>
        <div class="number-display">MCM = ${formatNumber(lcmResult)}</div>
        <p><strong>Fórmula:</strong> MCM(a,b) = |a × b| / MCD(a,b)</p>
        <div class="number-display">
            ${formatNumber(lcmResult)} = ${formatNumber(Math.abs(a * b))} ÷ ${formatNumber(gcdResult)}
        </div>
    `;

    showResult('lcmResult', resultHTML, false);
}

function extendedEuclid() {
    const a = validateNumber(document.getElementById('euclidA').value);
    const b = validateNumber(document.getElementById('euclidB').value);

    if (a === null || b === null) {
        showResult('euclidResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    const [g, x, y] = extendedGcd(a, b);

    let resultHTML = `
        <h4>🧠 Algoritmo de Euclides Extendido</h4>
        <p><strong>Resultado:</strong> MCD(${formatNumber(a)}, ${formatNumber(b)}) = ${formatNumber(g)}</p>
        <p><strong>Coeficientes de Bézout:</strong></p>
        <div class="number-display">
            ${formatNumber(a)} × (${x}) + ${formatNumber(b)} × (${y}) = ${formatNumber(g)}
        </div>
        <p class="text-muted">Los números ${x} y ${y} son los coeficientes que satisfacen la identidad de Bézout.</p>
    `;

    showResult('euclidResult', resultHTML, false);
}

function findDivisors() {
    const input = document.getElementById('divisorInput').value;
    const num = validateNumber(input, 1);

    if (num === null) {
        showResult('divisorResult', '❌ Por favor, ingresa un número válido mayor que 0', true);
        return;
    }

    const divisors = findAllDivisors(num);

    let resultHTML = `
        <h4>📋 Divisores de ${formatNumber(num)}</h4>
        <p><strong>Cantidad de divisores:</strong> ${divisors.length}</p>
        <div class="numbers-list">
    `;

    divisors.forEach(divisor => {
        const isPrimeDivisor = isPrime(divisor);
        resultHTML += `<span class="number-item ${isPrimeDivisor ? 'prime' : 'composite'}">${divisor}</span>`;
    });

    resultHTML += `</div>
        <p class="mt-2 text-muted">
            <strong>Suma de divisores:</strong> ${formatNumber(divisors.reduce((a, b) => a + b, 0))}<br>
            <strong>Producto de divisores:</strong> ${formatNumber(Math.pow(num, divisors.length / 2))}
        </p>
    `;

    showResult('divisorResult', resultHTML, false);
}

// ==========================================
// CALCULADORAS - CONGRUENCIAS
// ==========================================

function calculateMod() {
    const a = validateNumber(document.getElementById('modA').value);
    const m = validateNumber(document.getElementById('modM').value, 1);

    if (a === null || m === null) {
        showResult('modResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    const result = ((a % m) + m) % m; // Módulo positivo

    let resultHTML = `
        <h4>🔄 Aritmética Modular</h4>
        <div class="number-display">${formatNumber(a)} ≡ ${formatNumber(result)} (mod ${formatNumber(m)})</div>
        <p><strong>Interpretación:</strong> ${formatNumber(a)} dividido entre ${formatNumber(m)} da resto ${formatNumber(result)}</p>
    `;

    // Mostrar algunos ejemplos de la clase de equivalencia
    const examples = [];
    for (let i = -2; i <= 2; i++) {
        const example = result + i * m;
        if (example !== a) examples.push(example);
    }

    if (examples.length > 0) {
        resultHTML += `<p class="text-muted">
            <strong>Otros números en la misma clase:</strong> ${examples.slice(0, 5).map(n => formatNumber(n)).join(', ')}...
        </p>`;
    }

    showResult('modResult', resultHTML, false);
}

function modularInverse() {
    const a = validateNumber(document.getElementById('invA').value);
    const m = validateNumber(document.getElementById('invM').value, 2);

    if (a === null || m === null) {
        showResult('invResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    const inv = modularInverseFunc(a, m);

    if (inv === null) {
        showResult('invResult', `❌ No existe el inverso modular de ${formatNumber(a)} módulo ${formatNumber(m)}<br>
            <small>Esto ocurre porque MCD(${formatNumber(a)}, ${formatNumber(m)}) ≠ 1</small>`, true);
        return;
    }

    let resultHTML = `
        <h4>🔀 Inverso Modular</h4>
        <div class="number-display">${formatNumber(a)}⁻¹ ≡ ${formatNumber(inv)} (mod ${formatNumber(m)})</div>
        <p><strong>Verificación:</strong></p>
        <div class="number-display">${formatNumber(a)} × ${formatNumber(inv)} ≡ ${formatNumber((a * inv) % m)} ≡ 1 (mod ${formatNumber(m)})</div>
        <p class="text-muted">El inverso modular es útil para resolver ecuaciones modulares.</p>
    `;

    showResult('invResult', resultHTML, false);
}

function modularPower() {
    const a = validateNumber(document.getElementById('powA').value);
    const b = validateNumber(document.getElementById('powB').value, 0);
    const m = validateNumber(document.getElementById('powM').value, 1);

    if (a === null || b === null || m === null) {
        showResult('powResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    const result = modularExponentiation(a, b, m);

    let resultHTML = `
        <h4>⚡ Potencia Modular</h4>
        <div class="number-display">${formatNumber(a)}^${formatNumber(b)} ≡ ${formatNumber(result)} (mod ${formatNumber(m)})</div>
        <p class="text-muted">
            Calculado usando exponenciación rápida para eficiencia.<br>
            Sin módulo: ${formatNumber(a)}^${formatNumber(b)} = ${b <= 20 ? formatNumber(Math.pow(a, b)) : 'número muy grande'}
        </p>
    `;

    showResult('powResult', resultHTML, false);
}

function chineseRemainder() {
    const a1 = validateNumber(document.getElementById('crtA1').value);
    const m1 = validateNumber(document.getElementById('crtM1').value, 2);
    const a2 = validateNumber(document.getElementById('crtA2').value);
    const m2 = validateNumber(document.getElementById('crtM2').value, 2);

    if (a1 === null || m1 === null || a2 === null || m2 === null) {
        showResult('crtResult', '❌ Por favor, ingresa números válidos', true);
        return;
    }

    if (gcd(m1, m2) !== 1) {
        showResult('crtResult', `❌ Los módulos ${formatNumber(m1)} y ${formatNumber(m2)} no son coprimos<br>
            <small>El Teorema Chino del Resto requiere que MCD(m₁, m₂) = 1</small>`, true);
        return;
    }

    // Resolver usando el Teorema Chino del Resto
    const M = m1 * m2;
    const M1 = M / m1;
    const M2 = M / m2;
    const y1 = modularInverseFunc(M1, m1);
    const y2 = modularInverseFunc(M2, m2);

    const x = (a1 * M1 * y1 + a2 * M2 * y2) % M;
    const result = (x + M) % M; // Asegurar resultado positivo

    let resultHTML = `
        <h4>🧮 Sistema de Congruencias (Teorema Chino del Resto)</h4>
        <p><strong>Sistema:</strong></p>
        <div class="number-display">
            x ≡ ${formatNumber(a1)} (mod ${formatNumber(m1)})<br>
            x ≡ ${formatNumber(a2)} (mod ${formatNumber(m2)})
        </div>
        <p><strong>Solución:</strong></p>
        <div class="number-display">x ≡ ${formatNumber(result)} (mod ${formatNumber(M)})</div>
        <p class="text-muted">
            La solución es única módulo ${formatNumber(M)} = ${formatNumber(m1)} × ${formatNumber(m2)}<br>
            Otras soluciones: ${formatNumber(result)}, ${formatNumber(result + M)}, ${formatNumber(result + 2*M)}, ...
        </p>
    `;

    showResult('crtResult', resultHTML, false);
}

// ==========================================
// CALCULADORAS - FUNCIONES ARITMÉTICAS
// ==========================================

function eulerTotient() {
    const input = document.getElementById('eulerN').value;
    const n = validateNumber(input, 1);

    if (n === null) {
        showResult('eulerResult', '❌ Por favor, ingresa un número válido mayor que 0', true);
        return;
    }

    const phi = eulerTotientFunction(n);
    const factors = [...new Set(primeFactors(n))]; // Factores primos únicos

    let resultHTML = `
        <h4>φ Función de Euler</h4>
        <div class="number-display">φ(${formatNumber(n)}) = ${formatNumber(phi)}</div>
        <p><strong>Interpretación:</strong> Hay ${formatNumber(phi)} números menores que ${formatNumber(n)} que son coprimos con él.</p>
    `;

    if (factors.length > 0) {
        const formula = factors.map(p => `(1 - 1/${p})`).join(' × ');
        resultHTML += `
            <p><strong>Fórmula:</strong> φ(n) = n × ∏(1 - 1/p) para todos los primos p que dividen n</p>
            <div class="number-display">φ(${formatNumber(n)}) = ${formatNumber(n)} × ${formula} = ${formatNumber(phi)}</div>
        `;
    }

    const percentage = ((phi / n) * 100).toFixed(2);
    resultHTML += `<p class="text-muted"><strong>Densidad:</strong> ${percentage}% de los números menores que ${formatNumber(n)} son coprimos con él.</p>`;

    showResult('eulerResult', resultHTML, false);
}

function divisorFunction() {
    const input = document.getElementById('tauN').value;
    const n = validateNumber(input, 1);

    if (n === null) {
        showResult('tauResult', '❌ Por favor, ingresa un número válido mayor que 0', true);
        return;
    }

    const divisors = findAllDivisors(n);
    const tau = divisors.length;
    const factors = primeFactors(n);
    const factorMap = {};
    factors.forEach(f => factorMap[f] = (factorMap[f] || 0) + 1);

    let resultHTML = `
        <h4>τ Función Divisor</h4>
        <div class="number-display">τ(${formatNumber(n)}) = ${formatNumber(tau)}</div>
        <p><strong>Interpretación:</strong> El número ${formatNumber(n)} tiene ${formatNumber(tau)} divisores positivos.</p>
        <div class="numbers-list">
    `;

    divisors.forEach(divisor => {
        const isPrimeDivisor = isPrime(divisor);
        resultHTML += `<span class="number-item ${isPrimeDivisor ? 'prime' : 'composite'}">${divisor}</span>`;
    });

    resultHTML += '</div>';

    if (Object.keys(factorMap).length > 0) {
        const formula = Object.entries(factorMap)
            .map(([prime, exp]) => `(${exp} + 1)`)
            .join(' × ');

        resultHTML += `
            <p><strong>Fórmula:</strong> Si n = p₁^a₁ × p₂^a₂ × ... entonces τ(n) = (a₁+1)(a₂+1)...</p>
            <div class="number-display">τ(${formatNumber(n)}) = ${formula} = ${formatNumber(tau)}</div>
        `;
    }

    showResult('tauResult', resultHTML, false);
}

function sumOfDivisors() {
    const input = document.getElementById('sigmaN').value;
    const n = validateNumber(input, 1);

    if (n === null) {
        showResult('sigmaResult', '❌ Por favor, ingresa un número válido mayor que 0', true);
        return;
    }

    const divisors = findAllDivisors(n);
    const sigma = divisors.reduce((a, b) => a + b, 0);
    const factors = primeFactors(n);
    const factorMap = {};
    factors.forEach(f => factorMap[f] = (factorMap[f] || 0) + 1);

    let resultHTML = `
        <h4>σ Suma de Divisores</h4>
        <div class="number-display">σ(${formatNumber(n)}) = ${formatNumber(sigma)}</div>
        <p><strong>Cálculo:</strong> ${divisors.map(d => formatNumber(d)).join(' + ')} = ${formatNumber(sigma)}</p>
        <div class="numbers-list">
    `;

    divisors.forEach(divisor => {
        const isPrimeDivisor = isPrime(divisor);
        resultHTML += `<span class="number-item ${isPrimeDivisor ? 'prime' : 'composite'}">${divisor}</span>`;
    });

    resultHTML += '</div>';

    if (Object.keys(factorMap).length > 0) {
        resultHTML += `<p class="text-muted">
            <strong>Promedio de divisores:</strong> ${(sigma / divisors.length).toFixed(2)}<br>
            <strong>Suma sin el número:</strong> σ(${formatNumber(n)}) - ${formatNumber(n)} = ${formatNumber(sigma - n)}
        </p>`;
    }

    showResult('sigmaResult', resultHTML, false);
}

function checkPerfect() {
    const input = document.getElementById('perfectN').value;
    const n = validateNumber(input, 1);

    if (n === null) {
        showResult('perfectResult', '❌ Por favor, ingresa un número válido mayor que 0', true);
        return;
    }

    const divisors = findAllDivisors(n);
    const properDivisors = divisors.filter(d => d !== n); // Divisores propios (sin incluir n)
    const sumProperDivisors = properDivisors.reduce((a, b) => a + b, 0);

    const isPerfectNum = sumProperDivisors === n;
    const isDeficient = sumProperDivisors < n;
    const isAbundant = sumProperDivisors > n;

    let classification = isPerfectNum ? 'PERFECTO' : (isDeficient ? 'DEFICIENTE' : 'ABUNDANTE');
    let emoji = isPerfectNum ? '✨' : (isDeficient ? '📉' : '📈');

    let resultHTML = `
        <h4>${emoji} ${formatNumber(n)} es un número ${classification}</h4>
        <div class="number-display">
            Suma de divisores propios: ${properDivisors.map(d => formatNumber(d)).join(' + ')} = ${formatNumber(sumProperDivisors)}
        </div>
    `;

    if (isPerfectNum) {
        resultHTML += `
            <p><strong>¡Felicidades!</strong> ${formatNumber(n)} es un número perfecto.</p>
            <p class="text-muted">Los números perfectos son muy raros. Los primeros son: 6, 28, 496, 8128...</p>
        `;
    } else if (isDeficient) {
        resultHTML += `
            <p>La suma de sus divisores propios (${formatNumber(sumProperDivisors)}) es menor que ${formatNumber(n)}.</p>
            <p class="text-muted">Diferencia: ${formatNumber(n - sumProperDivisors)}</p>
        `;
    } else {
        resultHTML += `
            <p>La suma de sus divisores propios (${formatNumber(sumProperDivisors)}) es mayor que ${formatNumber(n)}.</p>
            <p class="text-muted">Exceso: ${formatNumber(sumProperDivisors - n)}</p>
        `;
    }

    resultHTML += `<div class="numbers-list">`;
    properDivisors.forEach(divisor => {
        const isPrimeDivisor = isPrime(divisor);
        resultHTML += `<span class="number-item ${isPrimeDivisor ? 'prime' : 'composite'}">${divisor}</span>`;
    });
    resultHTML += '</div>';

    showResult('perfectResult', resultHTML, false);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Teoría de Números - meskeIA cargada');
    console.log('Configuración regional:', LOCALE_CONFIG);

    // Añadir eventos Enter a los inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Buscar el botón más cercano y hacer click
                const button = this.closest('.card').querySelector('button');
                if (button) button.click();
            }
        });
    });

    // Mostrar mensaje de bienvenida
    console.log('🔢 Aplicación de Teoría de Números iniciada correctamente');
    console.log('📊 Todas las calculadoras están listas para usar');
});