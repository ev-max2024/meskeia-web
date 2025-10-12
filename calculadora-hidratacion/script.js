// ============================================
// CALCULADORA DE HIDRATACIÓN DIARIA - meskeIA
// ============================================

// Estado global de la aplicación
let userProfile = {
    weight: null,
    age: null,
    sex: null
};

let currentCalculation = {
    totalWater: 0,
    baseWater: 0,
    activityAdjustment: 0,
    climateAdjustment: 0,
    ageAdjustment: 0,
    exerciseAdjustment: 0
};

let tracker = {
    goal: 0,
    consumed: 0
};

// ============================================
// FACTORES DE AJUSTE
// ============================================

const ACTIVITY_FACTORS = {
    'sedentary': {
        multiplier: 1.0,
        info: 'Sin ejercicio regular. Base de 30 ml/kg'
    },
    'light': {
        multiplier: 1.1,
        info: 'Ejercicio ligero 1-3 días/semana. +10% hidratación'
    },
    'moderate': {
        multiplier: 1.2,
        info: 'Ejercicio moderado 3-5 días/semana. +20% hidratación'
    },
    'intense': {
        multiplier: 1.3,
        info: 'Ejercicio intenso 6-7 días/semana. +30% hidratación'
    },
    'athlete': {
        multiplier: 1.5,
        info: 'Atleta con múltiples entrenamientos diarios. +50% hidratación'
    }
};

const CLIMATE_FACTORS = {
    'cold': {
        adjustment: 0,
        info: 'Clima frío. Sin ajuste adicional necesario'
    },
    'temperate': {
        adjustment: 0,
        info: 'Clima templado. Base estándar'
    },
    'hot': {
        adjustment: 0.5,
        info: 'Clima cálido. +500ml por mayor sudoración'
    },
    'very-hot': {
        adjustment: 1.0,
        info: 'Clima muy caluroso. +1L por pérdidas elevadas'
    }
};

// Ajuste por edad (adultos mayores necesitan más atención a la hidratación)
const AGE_ADJUSTMENT = {
    young: 0,      // < 30 años
    adult: 0,      // 30-60 años
    senior: 0.3    // > 60 años (compensar menor sensación de sed)
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadHistory();
    updateActivityInfo();
    updateClimateInfo();
});

// ============================================
// GESTIÓN DE PERFIL
// ============================================

function saveProfile() {
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const sex = document.getElementById('sex').value;

    // Validación
    if (!weight || weight < 30 || weight > 200) {
        alert('Por favor, introduce un peso válido entre 30 y 200 kg');
        return;
    }

    if (!age || age < 10 || age > 100) {
        alert('Por favor, introduce una edad válida entre 10 y 100 años');
        return;
    }

    if (!sex) {
        alert('Por favor, selecciona tu sexo');
        return;
    }

    // Guardar perfil
    userProfile = { weight, age, sex };
    localStorage.setItem('hydrationProfile', JSON.stringify(userProfile));

    // Feedback visual
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Perfil Guardado';
    btn.style.background = 'linear-gradient(135deg, #48A9A6 0%, #48A9A6 100%)';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

function loadProfile() {
    const saved = localStorage.getItem('hydrationProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
        document.getElementById('weight').value = userProfile.weight;
        document.getElementById('age').value = userProfile.age;
        document.getElementById('sex').value = userProfile.sex;
    }
}

// ============================================
// ACTUALIZACIÓN DE INFO
// ============================================

function updateActivityInfo() {
    const activity = document.getElementById('activity').value;
    const info = ACTIVITY_FACTORS[activity].info;
    document.getElementById('activity-info').textContent = info;
}

function updateClimateInfo() {
    const climate = document.getElementById('climate').value;
    const info = CLIMATE_FACTORS[climate].info;
    document.getElementById('climate-info').textContent = info;
}

// ============================================
// CÁLCULO DE HIDRATACIÓN
// ============================================

function calculateHydration() {
    // Verificar que hay perfil guardado
    if (!userProfile.weight || !userProfile.age || !userProfile.sex) {
        alert('Por favor, guarda tu perfil primero antes de calcular');
        return;
    }

    // Obtener valores
    const activity = document.getElementById('activity').value;
    const climate = document.getElementById('climate').value;
    const exerciseTime = parseInt(document.getElementById('exercise-time').value) || 0;

    // PASO 1: Cálculo base por peso (30-35 ml/kg según sexo)
    const baseRate = userProfile.sex === 'male' ? 35 : 32; // Hombres necesitan ligeramente más
    let baseWater = (userProfile.weight * baseRate) / 1000; // Convertir a litros

    // PASO 2: Ajuste por actividad física habitual
    const activityMultiplier = ACTIVITY_FACTORS[activity].multiplier;
    const activityAdjustment = baseWater * (activityMultiplier - 1);

    // PASO 3: Ajuste por clima
    const climateAdjustment = CLIMATE_FACTORS[climate].adjustment;

    // PASO 4: Ajuste por edad
    let ageAdjustment = 0;
    if (userProfile.age > 60) {
        ageAdjustment = AGE_ADJUSTMENT.senior;
    }

    // PASO 5: Ajuste por ejercicio adicional hoy
    // Se recomienda 400-800ml por hora de ejercicio, usaremos 600ml promedio
    const exerciseAdjustment = (exerciseTime / 60) * 0.6; // 0.6L por hora

    // CÁLCULO TOTAL
    const totalWater = baseWater + activityAdjustment + climateAdjustment + ageAdjustment + exerciseAdjustment;

    // Guardar cálculo actual
    currentCalculation = {
        totalWater: totalWater,
        baseWater: baseWater,
        activityAdjustment: activityAdjustment,
        climateAdjustment: climateAdjustment,
        ageAdjustment: ageAdjustment,
        exerciseAdjustment: exerciseAdjustment
    };

    // Actualizar tracker
    tracker.goal = totalWater;
    tracker.consumed = 0;

    // Mostrar resultados
    displayResults();
    generateSchedule();

    // Mostrar secciones
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('tracker-section').style.display = 'block';

    // Scroll suave a resultados
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// VISUALIZACIÓN DE RESULTADOS
// ============================================

function displayResults() {
    const { totalWater, baseWater, activityAdjustment, climateAdjustment, ageAdjustment, exerciseAdjustment } = currentCalculation;

    // Resultado principal
    document.getElementById('total-water').textContent = totalWater.toFixed(1);

    // Equivalencias
    const glasses = Math.ceil(totalWater * 4); // 1 vaso = 250ml
    const bottles500 = Math.ceil(totalWater * 2); // 1 botella = 500ml
    const bottles1500 = Math.ceil(totalWater / 1.5); // 1 botella = 1.5L

    document.getElementById('glasses-count').textContent = glasses;
    document.getElementById('bottles-500').textContent = bottles500;
    document.getElementById('bottles-1500').textContent = bottles1500;

    // Desglose
    document.getElementById('base-water').textContent = baseWater.toFixed(2) + ' L';
    document.getElementById('activity-adjustment').textContent =
        (activityAdjustment >= 0 ? '+' : '') + activityAdjustment.toFixed(2) + ' L';
    document.getElementById('climate-adjustment').textContent =
        (climateAdjustment >= 0 ? '+' : '') + climateAdjustment.toFixed(2) + ' L';
    document.getElementById('age-adjustment').textContent =
        (ageAdjustment >= 0 ? '+' : '') + ageAdjustment.toFixed(2) + ' L';
    document.getElementById('exercise-adjustment').textContent =
        (exerciseAdjustment >= 0 ? '+' : '') + exerciseAdjustment.toFixed(2) + ' L';

    // Actualizar tracker
    updateTracker();
}

// ============================================
// HORARIO DE HIDRATACIÓN
// ============================================

function generateSchedule() {
    const totalWater = currentCalculation.totalWater;
    const scheduleContainer = document.getElementById('schedule-container');
    scheduleContainer.innerHTML = '';

    // Distribuir agua en 8 tomas a lo largo del día (cada 2 horas aprox)
    const times = ['7:00', '9:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];
    const waterPerTime = totalWater / times.length;

    times.forEach(time => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        item.innerHTML = `
            <span class="schedule-time">${time}</span>
            <span class="schedule-amount">${(waterPerTime * 1000).toFixed(0)} ml</span>
        `;
        scheduleContainer.appendChild(item);
    });
}

// ============================================
// TRACKER DE HIDRATACIÓN
// ============================================

function updateTracker() {
    const consumed = tracker.consumed;
    const goal = tracker.goal;
    const remaining = Math.max(0, goal - consumed);
    const percentage = Math.min(100, (consumed / goal) * 100);

    // Actualizar valores
    document.getElementById('consumed-water').textContent = consumed.toFixed(2);
    document.getElementById('remaining-water').textContent = remaining.toFixed(2);

    // Actualizar barra de progreso
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    progressFill.style.width = percentage + '%';
    progressText.textContent = percentage.toFixed(0) + '%';

    // Cambiar color según progreso
    if (percentage >= 100) {
        progressFill.style.background = 'linear-gradient(90deg, #48A9A6 0%, #48A9A6 100%)';
        progressText.textContent = '¡Meta alcanzada! 🎉';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #2E86AB 0%, #48A9A6 100%)';
    }
}

function addWater(ml) {
    const liters = ml / 1000;
    tracker.consumed += liters;

    // No permitir valores negativos
    if (tracker.consumed < 0) {
        tracker.consumed = 0;
    }

    updateTracker();

    // Guardar en localStorage
    localStorage.setItem('todayTracker', JSON.stringify({
        date: new Date().toLocaleDateString('es-ES'),
        consumed: tracker.consumed,
        goal: tracker.goal
    }));
}

function resetTracker() {
    if (confirm('¿Estás seguro de que quieres reiniciar el tracker de hoy?')) {
        tracker.consumed = 0;
        updateTracker();
        localStorage.removeItem('todayTracker');
    }
}

// ============================================
// HISTORIAL
// ============================================

function saveToHistory() {
    const history = getHistory();

    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        profile: { ...userProfile },
        calculation: { ...currentCalculation },
        activity: document.getElementById('activity').options[document.getElementById('activity').selectedIndex].text,
        climate: document.getElementById('climate').options[document.getElementById('climate').selectedIndex].text
    };

    history.unshift(entry); // Añadir al principio

    // Limitar a 20 entradas
    if (history.length > 20) {
        history.pop();
    }

    localStorage.setItem('hydrationHistory', JSON.stringify(history));
    loadHistory();

    // Feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Guardado en Historial';
    btn.style.background = 'linear-gradient(135deg, #48A9A6 0%, #48A9A6 100%)';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

function getHistory() {
    const saved = localStorage.getItem('hydrationHistory');
    return saved ? JSON.parse(saved) : [];
}

function loadHistory() {
    const history = getHistory();
    const container = document.getElementById('history-container');

    if (history.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay cálculos guardados aún. Realiza tu primer cálculo para comenzar.</p>';
        return;
    }

    container.innerHTML = history.map(entry => `
        <div class="history-item">
            <div class="history-info">
                <div class="history-date">${entry.date}</div>
                <div class="history-details">
                    <div class="history-detail">
                        <strong>${entry.calculation.totalWater.toFixed(1)} L</strong>
                        <small>Total diario</small>
                    </div>
                    <div class="history-detail">
                        <strong>${entry.profile.weight} kg</strong>
                        <small>Peso</small>
                    </div>
                    <div class="history-detail">
                        <strong>${entry.activity}</strong>
                        <small>Actividad</small>
                    </div>
                    <div class="history-detail">
                        <strong>${entry.climate}</strong>
                        <small>Clima</small>
                    </div>
                </div>
            </div>
            <button class="history-delete" onclick="deleteHistory(${entry.id})" title="Eliminar">🗑️</button>
        </div>
    `).join('');
}

function deleteHistory(id) {
    if (!confirm('¿Eliminar este cálculo del historial?')) {
        return;
    }

    let history = getHistory();
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('hydrationHistory', JSON.stringify(history));
    loadHistory();
}

// ============================================
// CARGAR TRACKER DEL DÍA AL INICIAR
// ============================================

window.addEventListener('load', () => {
    const saved = localStorage.getItem('todayTracker');
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toLocaleDateString('es-ES');

        // Solo cargar si es del día de hoy
        if (data.date === today) {
            tracker.consumed = data.consumed;
            tracker.goal = data.goal;

            if (tracker.goal > 0) {
                document.getElementById('tracker-section').style.display = 'block';
                updateTracker();
            }
        } else {
            // Si es de otro día, limpiar
            localStorage.removeItem('todayTracker');
        }
    }
});
