// ============================================
// CALCULADORA DE SUEÑO Y CICLOS - meskeIA
// ============================================

// Constantes
const CYCLE_DURATION = 90; // minutos por ciclo
const MAX_CYCLES = 6; // máximo de ciclos a mostrar
const MIN_CYCLES = 3; // mínimo de ciclos recomendados

let currentMode = 'wakeup'; // 'wakeup' o 'sleep'

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadSleepHistory();
    updateTrackerStats();

    // Establecer hora actual por defecto
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Hora de despertar por defecto: 7:00
    document.getElementById('wakeup-time').value = '07:00';

    // Hora de acostarme por defecto: 23:00
    document.getElementById('sleep-time').value = '23:00';
});

// ============================================
// CAMBIO DE MODO
// ============================================

function setMode(mode) {
    currentMode = mode;

    // Actualizar botones
    document.getElementById('btn-wakeup').classList.toggle('active', mode === 'wakeup');
    document.getElementById('btn-sleep').classList.toggle('active', mode === 'sleep');

    // Mostrar/ocultar secciones
    document.getElementById('wakeup-mode').style.display = mode === 'wakeup' ? 'block' : 'none';
    document.getElementById('sleep-mode').style.display = mode === 'sleep' ? 'block' : 'none';

    // Ocultar resultados
    document.getElementById('wakeup-results').style.display = 'none';
    document.getElementById('sleep-results').style.display = 'none';
}

// ============================================
// CÁLCULO: HORA DE DESPERTAR → HORAS PARA ACOSTARME
// ============================================

function calculateBedtimes() {
    const wakeupTime = document.getElementById('wakeup-time').value;
    const fallAsleepTime = parseInt(document.getElementById('fall-asleep-time-wakeup').value) || 14;

    if (!wakeupTime) {
        alert('Por favor, introduce la hora a la que quieres despertar');
        return;
    }

    // Convertir hora de despertar a minutos desde medianoche
    const [wakeHours, wakeMinutes] = wakeupTime.split(':').map(Number);
    const wakeupMinutes = wakeHours * 60 + wakeMinutes;

    const bedtimeOptions = [];

    // Calcular 6 opciones (3 a 6 ciclos)
    for (let cycles = MIN_CYCLES; cycles <= MAX_CYCLES; cycles++) {
        // Total de sueño = ciclos × 90 minutos
        const sleepDuration = cycles * CYCLE_DURATION;

        // Hora de acostarme = hora de despertar - duración sueño - tiempo para dormirse
        let bedtimeMinutes = wakeupMinutes - sleepDuration - fallAsleepTime;

        // Ajustar si es negativo (día anterior)
        if (bedtimeMinutes < 0) {
            bedtimeMinutes += 24 * 60; // Añadir 24 horas
        }

        // Convertir de vuelta a horas:minutos
        const bedHours = Math.floor(bedtimeMinutes / 60);
        const bedMinutes = bedtimeMinutes % 60;
        const bedtime = `${bedHours.toString().padStart(2, '0')}:${bedMinutes.toString().padStart(2, '0')}`;

        // Calcular horas totales
        const totalHours = (sleepDuration / 60).toFixed(1);

        bedtimeOptions.push({
            time: bedtime,
            cycles: cycles,
            hours: totalHours
        });
    }

    // Mostrar resultados
    displayBedtimeOptions(bedtimeOptions);
    document.getElementById('wakeup-results').style.display = 'block';

    // Scroll suave
    document.getElementById('wakeup-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayBedtimeOptions(options) {
    const container = document.getElementById('bedtime-options');
    container.innerHTML = '';

    // Invertir orden para mostrar más horas primero
    const sortedOptions = [...options].reverse();

    sortedOptions.forEach(option => {
        const div = document.createElement('div');
        div.className = 'time-option';
        div.innerHTML = `
            <span class="time-option-time">${option.time}</span>
            <span class="time-option-cycles">${option.cycles} ciclos</span>
            <span class="time-option-hours">(${option.hours} horas)</span>
        `;
        container.appendChild(div);
    });
}

// ============================================
// CÁLCULO: HORA DE ACOSTARME → HORAS PARA DESPERTAR
// ============================================

function calculateWakeupTimes() {
    const sleepTime = document.getElementById('sleep-time').value;
    const fallAsleepTime = parseInt(document.getElementById('fall-asleep-time-sleep').value) || 14;

    if (!sleepTime) {
        alert('Por favor, introduce la hora a la que te vas a acostar');
        return;
    }

    // Convertir hora de acostarme a minutos desde medianoche
    const [sleepHours, sleepMinutes] = sleepTime.split(':').map(Number);
    const sleepMinutes_total = sleepHours * 60 + sleepMinutes;

    const wakeupOptions = [];

    // Calcular 6 opciones (3 a 6 ciclos)
    for (let cycles = MIN_CYCLES; cycles <= MAX_CYCLES; cycles++) {
        // Total de sueño = ciclos × 90 minutos
        const sleepDuration = cycles * CYCLE_DURATION;

        // Hora de despertar = hora de acostarme + tiempo para dormirse + duración sueño
        let wakeupMinutes = sleepMinutes_total + fallAsleepTime + sleepDuration;

        // Ajustar si supera 24 horas (día siguiente)
        if (wakeupMinutes >= 24 * 60) {
            wakeupMinutes -= 24 * 60;
        }

        // Convertir de vuelta a horas:minutos
        const wakeHours = Math.floor(wakeupMinutes / 60);
        const wakeMinutes_remainder = wakeupMinutes % 60;
        const wakeupTime = `${wakeHours.toString().padStart(2, '0')}:${wakeMinutes_remainder.toString().padStart(2, '0')}`;

        // Calcular horas totales
        const totalHours = (sleepDuration / 60).toFixed(1);

        wakeupOptions.push({
            time: wakeupTime,
            cycles: cycles,
            hours: totalHours
        });
    }

    // Mostrar resultados
    displayWakeupOptions(wakeupOptions);
    document.getElementById('sleep-results').style.display = 'block';

    // Scroll suave
    document.getElementById('sleep-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayWakeupOptions(options) {
    const container = document.getElementById('wakeup-options');
    container.innerHTML = '';

    options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'time-option';
        div.innerHTML = `
            <span class="time-option-time">${option.time}</span>
            <span class="time-option-cycles">${option.cycles} ciclos</span>
            <span class="time-option-hours">(${option.hours} horas)</span>
        `;
        container.appendChild(div);
    });
}

// ============================================
// TRACKER DE SUEÑO
// ============================================

function saveSleepEntry() {
    const sleptAt = document.getElementById('slept-at').value;
    const wokeAt = document.getElementById('woke-at').value;
    const quality = parseInt(document.getElementById('sleep-quality').value);

    if (!sleptAt || !wokeAt) {
        alert('Por favor, completa ambas horas (acostarse y despertar)');
        return;
    }

    // Calcular duración
    const [sleepHours, sleepMinutes] = sleptAt.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wokeAt.split(':').map(Number);

    let sleepMinutes_total = sleepHours * 60 + sleepMinutes;
    let wakeMinutes_total = wakeHours * 60 + wakeMinutes;

    // Si despertar es antes que acostarme, es del día siguiente
    if (wakeMinutes_total < sleepMinutes_total) {
        wakeMinutes_total += 24 * 60;
    }

    const durationMinutes = wakeMinutes_total - sleepMinutes_total;
    const durationHours = (durationMinutes / 60).toFixed(1);
    const cycles = Math.round(durationMinutes / CYCLE_DURATION);

    // Crear entrada
    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        sleptAt: sleptAt,
        wokeAt: wokeAt,
        duration: durationHours,
        cycles: cycles,
        quality: quality
    };

    // Guardar en localStorage
    let history = getSleepHistory();
    history.unshift(entry); // Añadir al principio

    // Limitar a 30 días
    if (history.length > 30) {
        history = history.slice(0, 30);
    }

    localStorage.setItem('sleepHistory', JSON.stringify(history));

    // Recargar historial y stats
    loadSleepHistory();
    updateTrackerStats();

    // Limpiar formulario
    document.getElementById('slept-at').value = '';
    document.getElementById('woke-at').value = '';
    document.getElementById('sleep-quality').value = '3';

    // Feedback
    alert('✓ Registro de sueño guardado correctamente');
}

function getSleepHistory() {
    const saved = localStorage.getItem('sleepHistory');
    return saved ? JSON.parse(saved) : [];
}

function loadSleepHistory() {
    const history = getSleepHistory();
    const container = document.getElementById('history-container');

    if (history.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay registros aún. Comienza a trackear tu sueño.</p>';
        return;
    }

    // Mostrar solo últimos 7 días
    const last7 = history.slice(0, 7);

    container.innerHTML = last7.map(entry => {
        const stars = '⭐'.repeat(entry.quality);

        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-date">${entry.date}</div>
                    <div class="history-details">
                        <div class="history-detail">
                            <strong>${entry.sleptAt}</strong>
                            <small>Acostado</small>
                        </div>
                        <div class="history-detail">
                            <strong>${entry.wokeAt}</strong>
                            <small>Despertado</small>
                        </div>
                        <div class="history-detail">
                            <strong>${entry.duration}h</strong>
                            <small>${entry.cycles} ciclos</small>
                        </div>
                        <div class="history-detail">
                            <span class="quality-stars">${stars}</span>
                            <small>Calidad</small>
                        </div>
                    </div>
                </div>
                <button class="history-delete" onclick="deleteSleepEntry(${entry.id})" title="Eliminar">🗑️</button>
            </div>
        `;
    }).join('');
}

function deleteSleepEntry(id) {
    if (!confirm('¿Eliminar este registro de sueño?')) {
        return;
    }

    let history = getSleepHistory();
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('sleepHistory', JSON.stringify(history));

    loadSleepHistory();
    updateTrackerStats();
}

function updateTrackerStats() {
    const history = getSleepHistory();

    if (history.length === 0) {
        document.getElementById('avg-hours').textContent = '0';
        document.getElementById('avg-cycles').textContent = '0';
        document.getElementById('nights-tracked').textContent = '0';
        return;
    }

    // Calcular promedios
    const totalHours = history.reduce((sum, entry) => sum + parseFloat(entry.duration), 0);
    const totalCycles = history.reduce((sum, entry) => sum + entry.cycles, 0);

    const avgHours = (totalHours / history.length).toFixed(1);
    const avgCycles = Math.round(totalCycles / history.length);

    document.getElementById('avg-hours').textContent = avgHours;
    document.getElementById('avg-cycles').textContent = avgCycles;
    document.getElementById('nights-tracked').textContent = history.length;
}
