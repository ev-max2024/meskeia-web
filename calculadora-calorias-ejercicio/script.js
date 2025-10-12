// ========================================
// CALCULADORA DE CALORÍAS POR EJERCICIO - meskeIA
// ========================================

// Valores MET por actividad (Metabolic Equivalent of Task)
const MET_VALUES = {
    'walking-slow': 2.5,        // Caminar lento 3 km/h
    'walking-normal': 3.5,      // Caminar normal 4 km/h
    'walking-fast': 4.5,        // Caminar rápido 5-6 km/h
    'jogging': 7.0,             // Trotar 7 km/h
    'running': 8.5,             // Correr 8-9 km/h
    'running-fast': 11.0,       // Correr rápido 10+ km/h
    'cycling-moderate': 6.0,    // Ciclismo moderado
    'cycling-intense': 10.0,    // Ciclismo intenso
    'swimming': 6.0,            // Natación moderada
    'stairs': 8.0,              // Subir escaleras
    'hiking': 6.5,              // Senderismo
    'dancing': 4.5              // Bailar
};

// Nombres descriptivos de actividades
const ACTIVITY_NAMES = {
    'walking-slow': 'Caminar lento',
    'walking-normal': 'Caminar normal',
    'walking-fast': 'Caminar rápido',
    'jogging': 'Trotar',
    'running': 'Correr',
    'running-fast': 'Correr rápido',
    'cycling-moderate': 'Ciclismo moderado',
    'cycling-intense': 'Ciclismo intenso',
    'swimming': 'Natación',
    'stairs': 'Subir escaleras',
    'hiking': 'Senderismo',
    'dancing': 'Bailar'
};

// Equivalencias de alimentos (calorías)
const FOOD_EQUIVALENCES = [
    { name: 'manzana', icon: '🍎', calories: 52 },
    { name: 'plátano', icon: '🍌', calories: 89 },
    { name: 'refresco (lata)', icon: '🥤', calories: 140 },
    { name: 'chocolate (barra)', icon: '🍫', calories: 235 },
    { name: 'croissant', icon: '🥐', calories: 231 },
    { name: 'porción de pizza', icon: '🍕', calories: 285 },
    { name: 'donut', icon: '🍩', calories: 250 },
    { name: 'cerveza', icon: '🍺', calories: 153 }
];

// Estado de la aplicación
let userProfile = null;
let currentResults = null;
let activityHistory = [];

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Cargar perfil guardado
    loadProfile();

    // Cargar historial
    loadHistory();

    console.log('✅ Calculadora de Calorías inicializada correctamente');
}

// ========================================
// GESTIÓN DE PERFIL
// ========================================

function loadProfile() {
    try {
        const saved = localStorage.getItem('user_profile');
        if (saved) {
            userProfile = JSON.parse(saved);

            // Rellenar formulario con datos guardados
            document.getElementById('weight').value = userProfile.weight;
            document.getElementById('height').value = userProfile.height;
            document.getElementById('age').value = userProfile.age;
            document.querySelector(`input[name="sex"][value="${userProfile.sex}"]`).checked = true;

            // Mostrar mensaje de perfil guardado
            document.getElementById('profile-saved').style.display = 'block';

            // Colapsar perfil automáticamente
            setTimeout(() => {
                collapseProfile();
            }, 500);

            console.log('👤 Perfil cargado:', userProfile);
        }
    } catch (error) {
        console.error('❌ Error al cargar perfil:', error);
    }
}

function saveProfile() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const sex = document.querySelector('input[name="sex"]:checked').value;

    // Validación
    if (!weight || !height || !age) {
        alert('⚠️ Por favor, completa todos los campos obligatorios del perfil');
        return;
    }

    if (weight < 30 || weight > 300) {
        alert('⚠️ El peso debe estar entre 30 y 300 kg');
        return;
    }

    if (height < 100 || height > 250) {
        alert('⚠️ La altura debe estar entre 100 y 250 cm');
        return;
    }

    if (age < 10 || age > 120) {
        alert('⚠️ La edad debe estar entre 10 y 120 años');
        return;
    }

    // Guardar perfil
    userProfile = { weight, height, age, sex };

    try {
        localStorage.setItem('user_profile', JSON.stringify(userProfile));

        // Mostrar confirmación
        const savedMsg = document.getElementById('profile-saved');
        savedMsg.style.display = 'block';

        // Ocultar después de 3 segundos
        setTimeout(() => {
            savedMsg.style.display = 'none';
        }, 3000);

        console.log('💾 Perfil guardado:', userProfile);

    } catch (error) {
        console.error('❌ Error al guardar perfil:', error);
        alert('Error al guardar el perfil');
    }
}

function toggleProfile() {
    const content = document.getElementById('profile-content');
    const toggle = document.getElementById('profile-toggle');

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
        toggle.classList.remove('rotated');
    } else {
        content.classList.add('collapsed');
        content.style.maxHeight = '0';
        toggle.classList.add('rotated');
    }
}

function collapseProfile() {
    const content = document.getElementById('profile-content');
    const toggle = document.getElementById('profile-toggle');

    content.classList.add('collapsed');
    content.style.maxHeight = '0';
    toggle.classList.add('rotated');
}

// ========================================
// CÁLCULO DE CALORÍAS
// ========================================

function calculateCalories() {
    // Verificar perfil
    if (!userProfile) {
        alert('⚠️ Por favor, completa y guarda tu perfil primero');
        document.getElementById('weight').focus();
        return;
    }

    // Obtener datos de actividad
    const activity = document.getElementById('activity').value;
    const steps = parseInt(document.getElementById('steps').value) || 0;
    const duration = parseInt(document.getElementById('duration').value);

    // Validación
    if (!duration || duration < 1) {
        alert('⚠️ Por favor, introduce la duración del ejercicio');
        document.getElementById('duration').focus();
        return;
    }

    // Obtener MET de la actividad
    const met = MET_VALUES[activity];

    // Calcular calorías quemadas
    // Fórmula: Calorías = MET × Peso(kg) × Tiempo(horas)
    const timeInHours = duration / 60;
    const calories = Math.round(met * userProfile.weight * timeInHours);

    // Calcular distancia si hay pasos
    let distance = 0;
    if (steps > 0) {
        // Zancada promedio: Hombre 78cm, Mujer 70cm
        const strideLength = userProfile.sex === 'male' ? 0.78 : 0.70;
        distance = (steps * strideLength) / 1000; // En kilómetros
        distance = Math.round(distance * 10) / 10; // 1 decimal
    }

    // Guardar resultados actuales
    currentResults = {
        activity,
        activityName: ACTIVITY_NAMES[activity],
        calories,
        met,
        steps,
        distance,
        duration,
        timestamp: new Date().toISOString()
    };

    // Mostrar resultados
    displayResults();

    console.log('🔥 Calorías calculadas:', currentResults);
}

function displayResults() {
    const resultsCard = document.getElementById('results-card');

    // Mostrar card de resultados
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Llenar datos principales
    document.getElementById('calories-result').textContent = currentResults.calories.toLocaleString('es-ES');
    document.getElementById('met-result').textContent = currentResults.met.toFixed(1);

    // Distancia (si aplica)
    const distanceContainer = document.getElementById('distance-result-container');
    if (currentResults.distance > 0) {
        distanceContainer.style.display = 'flex';
        document.getElementById('distance-result').textContent = currentResults.distance.toFixed(1);
    } else {
        distanceContainer.style.display = 'none';
    }

    // Equivalencias de alimentos
    displayFoodEquivalences();

    // Progreso de pasos (si aplica)
    if (currentResults.steps > 0) {
        displayStepsProgress();
    } else {
        document.getElementById('progress-section').style.display = 'none';
    }
}

function displayFoodEquivalences() {
    const container = document.getElementById('equivalences-list');
    container.innerHTML = '';

    const calories = currentResults.calories;

    // Filtrar alimentos que se puedan mostrar (al menos 0.5 unidades)
    const relevantFoods = FOOD_EQUIVALENCES.filter(food => calories >= (food.calories * 0.5));

    // Tomar máximo 5 equivalencias
    const foodsToShow = relevantFoods.slice(0, 5);

    if (foodsToShow.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Quema más calorías para ver equivalencias</p>';
        return;
    }

    foodsToShow.forEach(food => {
        const quantity = (calories / food.calories).toFixed(1);
        const quantityText = quantity === '1.0' ? '1' : quantity;

        const item = document.createElement('div');
        item.className = 'equivalence-item';
        item.innerHTML = `
            <span class="equivalence-icon">${food.icon}</span>
            <span class="equivalence-text">≈ ${quantityText} ${food.name}${quantityText !== '1' ? 's' : ''}</span>
        `;
        container.appendChild(item);
    });
}

function displayStepsProgress() {
    const section = document.getElementById('progress-section');
    section.style.display = 'block';

    const steps = currentResults.steps;
    const goal = 10000;
    const percentage = Math.min((steps / goal) * 100, 100);

    document.getElementById('steps-progress-text').textContent =
        `${steps.toLocaleString('es-ES')} / ${goal.toLocaleString('es-ES')} pasos`;
    document.getElementById('steps-progress-percent').textContent =
        `${Math.round(percentage)}%`;

    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = percentage + '%';
}

function clearResults() {
    // Limpiar formulario
    document.getElementById('steps').value = '';
    document.getElementById('duration').value = '';

    // Ocultar resultados
    document.getElementById('results-card').style.display = 'none';

    currentResults = null;

    console.log('🗑️ Resultados limpiados');
}

// ========================================
// HISTORIAL DE ACTIVIDADES
// ========================================

function saveActivity() {
    if (!currentResults) {
        alert('⚠️ No hay resultados para guardar');
        return;
    }

    // Agregar al inicio del historial
    activityHistory.unshift(currentResults);

    // Limitar historial a 20 actividades
    if (activityHistory.length > 20) {
        activityHistory = activityHistory.slice(0, 20);
    }

    // Guardar en localStorage
    try {
        localStorage.setItem('activity_history', JSON.stringify(activityHistory));
        console.log('💾 Actividad guardada en historial');

        // Actualizar vista del historial
        renderHistory();

        // Mostrar confirmación
        alert('✓ Actividad guardada en el historial');

    } catch (error) {
        console.error('❌ Error al guardar actividad:', error);
        alert('Error al guardar en el historial');
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('activity_history');
        if (saved) {
            activityHistory = JSON.parse(saved);
            renderHistory();
            console.log(`📊 Historial cargado: ${activityHistory.length} actividades`);
        }
    } catch (error) {
        console.error('❌ Error al cargar historial:', error);
        activityHistory = [];
    }
}

function renderHistory() {
    const container = document.getElementById('history-container');
    const clearBtn = document.getElementById('clear-history-btn');

    if (activityHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>Aún no hay actividades registradas</p>
                <small>Calcula y guarda tus actividades para ver un historial</small>
            </div>
        `;
        clearBtn.style.display = 'none';
        return;
    }

    container.innerHTML = '';
    clearBtn.style.display = 'block';

    activityHistory.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const date = new Date(activity.timestamp);
        const formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let details = `${activity.duration} min`;
        if (activity.steps > 0) {
            details += ` • ${activity.steps.toLocaleString('es-ES')} pasos`;
        }
        if (activity.distance > 0) {
            details += ` • ${activity.distance.toFixed(1)} km`;
        }

        item.innerHTML = `
            <div class="history-info">
                <div class="history-activity">${activity.activityName}</div>
                <div class="history-details">${details}</div>
                <div class="history-date">${formattedDate}</div>
            </div>
            <div>
                <span class="history-calories">${activity.calories.toLocaleString('es-ES')}</span>
                <span style="color: var(--text-secondary); font-size: 0.9rem;">kcal</span>
            </div>
        `;

        container.appendChild(item);
    });
}

function clearHistory() {
    if (!confirm('¿Estás seguro de que quieres eliminar todo el historial de actividades?')) {
        return;
    }

    activityHistory = [];
    localStorage.removeItem('activity_history');
    renderHistory();

    console.log('🗑️ Historial eliminado');
}

// ========================================
// ATAJOS DE TECLADO
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para calcular
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calculateCalories();
    }

    // Ctrl/Cmd + S para guardar perfil
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProfile();
    }
});

// ========================================
// AUTO-GUARDADO DE PERFIL AL CAMBIAR VALORES
// ========================================

// Auto-guardar perfil al perder foco de los inputs
['weight', 'height', 'age'].forEach(id => {
    document.getElementById(id).addEventListener('blur', () => {
        if (userProfile) {
            // Solo si ya existe un perfil guardado
            saveProfile();
        }
    });
});

document.querySelectorAll('input[name="sex"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (userProfile) {
            saveProfile();
        }
    });
});

console.log('🚀 Script de Calculadora de Calorías cargado - meskeIA 2025');
