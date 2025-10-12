// ============================================
// ESTADO GLOBAL
// ============================================
let subjects = [];
let schedule = [];
let availability = {};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeEventListeners();
    renderSubjects();
    updateGenerateButtonState();
});

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Añadir asignatura
    document.getElementById('add-subject-btn').addEventListener('click', addSubject);
    document.getElementById('subject-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSubject();
    });

    // Generar horario
    document.getElementById('generate-schedule-btn').addEventListener('click', generateSchedule);

    // Navegación
    document.getElementById('back-to-config-btn').addEventListener('click', () => {
        showView('config-view');
    });

    // Exportar PNG
    document.getElementById('export-png-btn').addEventListener('click', exportToPNG);

    // Limpiar horario
    document.getElementById('clear-schedule-btn').addEventListener('click', clearSchedule);

    // Detectar cambios en inputs para habilitar/deshabilitar botón generar
    document.getElementById('subject-name').addEventListener('input', updateGenerateButtonState);
    document.querySelectorAll('.day-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateGenerateButtonState);
    });
}

// ============================================
// GESTIÓN DE ASIGNATURAS
// ============================================
function addSubject() {
    const nameInput = document.getElementById('subject-name');
    const hoursInput = document.getElementById('subject-hours');
    const prioritySelect = document.getElementById('subject-priority');

    const name = nameInput.value.trim();
    const hoursPerWeek = parseInt(hoursInput.value);
    const priority = parseInt(prioritySelect.value);

    if (!name) {
        alert('Por favor, introduce el nombre de la asignatura');
        nameInput.focus();
        return;
    }

    if (hoursPerWeek < 1 || hoursPerWeek > 40) {
        alert('Las horas semanales deben estar entre 1 y 40');
        hoursInput.focus();
        return;
    }

    // Verificar si ya existe
    if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        alert('Ya existe una asignatura con ese nombre');
        nameInput.focus();
        return;
    }

    const subject = {
        id: Date.now(),
        name,
        hoursPerWeek,
        priority,
        color: generateColor()
    };

    subjects.push(subject);
    saveToLocalStorage();
    renderSubjects();
    updateGenerateButtonState();

    // Limpiar inputs
    nameInput.value = '';
    hoursInput.value = '3';
    prioritySelect.value = '3';
    nameInput.focus();
}

function deleteSubject(id) {
    if (!confirm('¿Eliminar esta asignatura del horario?')) return;

    subjects = subjects.filter(s => s.id !== id);
    saveToLocalStorage();
    renderSubjects();
    updateGenerateButtonState();
}

function renderSubjects() {
    const container = document.getElementById('subjects-list');

    if (subjects.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay asignaturas. Añade tu primera asignatura arriba.</p>';
        return;
    }

    container.innerHTML = subjects.map(subject => `
        <div class="subject-item" style="border-left: 4px solid ${subject.color}">
            <div class="subject-info">
                <strong>${subject.name}</strong>
                <span class="subject-meta">
                    ${subject.hoursPerWeek}h/semana • ${getPriorityLabel(subject.priority)}
                </span>
            </div>
            <button class="btn-icon" onclick="deleteSubject(${subject.id})" title="Eliminar asignatura">
                🗑️
            </button>
        </div>
    `).join('');
}

function getPriorityLabel(priority) {
    const labels = {
        1: '⭐ Baja',
        2: '⭐⭐ Media',
        3: '⭐⭐⭐ Alta',
        4: '⭐⭐⭐⭐ Muy Alta',
        5: '🔥 Urgente'
    };
    return labels[priority] || 'Media';
}

function generateColor() {
    const colors = [
        '#2E86AB', // Azul meskeIA
        '#48A9A6', // Teal meskeIA
        '#E76F51', // Naranja
        '#F4A261', // Amarillo
        '#2A9D8F', // Verde azulado
        '#264653', // Azul oscuro
        '#E63946', // Rojo
        '#06A77D', // Verde
        '#9B59B6', // Morado
        '#3498DB'  // Azul claro
    ];

    // Evitar colores repetidos
    const usedColors = subjects.map(s => s.color);
    const availableColors = colors.filter(c => !usedColors.includes(c));

    return availableColors.length > 0
        ? availableColors[0]
        : colors[Math.floor(Math.random() * colors.length)];
}

// ============================================
// GENERACIÓN DE HORARIO
// ============================================
function generateSchedule() {
    if (subjects.length === 0) {
        alert('Añade al menos una asignatura para generar el horario');
        return;
    }

    // Obtener disponibilidad
    availability = getAvailability();

    if (Object.keys(availability).length === 0) {
        alert('Selecciona al menos una franja horaria disponible');
        return;
    }

    // Obtener preferencias
    const sessionDuration = parseInt(document.getElementById('session-duration').value);
    const breakDuration = parseInt(document.getElementById('break-duration').value);

    // Generar horario con algoritmo de distribución
    schedule = distributeSchedule(subjects, availability, sessionDuration, breakDuration);

    // Guardar y mostrar
    saveToLocalStorage();
    renderSchedule();
    showView('schedule-view');
}

function getAvailability() {
    const checkboxes = document.querySelectorAll('.day-checkbox:checked');
    const availability = {};

    checkboxes.forEach(checkbox => {
        const day = checkbox.dataset.day;
        const slot = checkbox.dataset.slot;

        if (!availability[day]) {
            availability[day] = [];
        }
        availability[day].push(slot);
    });

    return availability;
}

function distributeSchedule(subjects, availability, sessionDuration, breakDuration) {
    const schedule = [];
    const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const slots = ['mañana', 'tarde', 'noche'];

    // Calcular total de horas necesarias
    const totalHoursNeeded = subjects.reduce((sum, s) => sum + s.hoursPerWeek, 0);

    // Calcular slots disponibles
    let availableSlots = [];
    days.forEach(day => {
        if (availability[day]) {
            availability[day].forEach(slot => {
                availableSlots.push({ day, slot });
            });
        }
    });

    // Calcular horas disponibles por slot (según duración de sesión)
    const hoursPerSlot = sessionDuration / 60;
    const totalAvailableHours = availableSlots.length * hoursPerSlot;

    if (totalHoursNeeded > totalAvailableHours) {
        alert(`⚠️ Necesitas ${totalHoursNeeded.toFixed(1)}h pero solo tienes ${totalAvailableHours.toFixed(1)}h disponibles.\n\nReducirás las horas de algunas asignaturas o añade más franjas horarias.`);
    }

    // Ordenar asignaturas por prioridad (mayor primero)
    const sortedSubjects = [...subjects].sort((a, b) => b.priority - a.priority);

    // Distribuir asignaturas en los slots
    let slotIndex = 0;
    sortedSubjects.forEach(subject => {
        let remainingHours = subject.hoursPerWeek;

        while (remainingHours > 0 && slotIndex < availableSlots.length) {
            const { day, slot } = availableSlots[slotIndex];

            // Verificar si ya hay una sesión en este slot
            const existingSession = schedule.find(s => s.day === day && s.slot === slot);

            if (!existingSession) {
                const sessionHours = Math.min(hoursPerSlot, remainingHours);

                schedule.push({
                    day,
                    slot,
                    subject: subject.name,
                    color: subject.color,
                    duration: sessionDuration,
                    hours: sessionHours
                });

                remainingHours -= sessionHours;
                slotIndex++;
            } else {
                slotIndex++;
            }
        }

        // Si quedan horas sin asignar, repartir en slots ya ocupados (sesiones dobles)
        if (remainingHours > 0) {
            console.warn(`No se pudieron asignar ${remainingHours.toFixed(1)}h de ${subject.name}`);
        }
    });

    return schedule;
}

// ============================================
// RENDERIZADO DE HORARIO
// ============================================
function renderSchedule() {
    const container = document.getElementById('weekly-calendar');
    const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const slots = [
        { key: 'mañana', label: 'Mañana', time: '9:00-14:00' },
        { key: 'tarde', label: 'Tarde', time: '15:00-20:00' },
        { key: 'noche', label: 'Noche', time: '21:00-23:00' }
    ];

    let html = '<div class="calendar-grid">';

    // Header con días
    html += '<div class="calendar-header"></div>'; // Esquina vacía
    days.forEach(day => {
        html += `<div class="calendar-header">${capitalizeFirst(day)}</div>`;
    });

    // Filas de slots
    slots.forEach(slot => {
        html += `<div class="calendar-slot-label">
            <strong>${slot.label}</strong><br>
            <small>${slot.time}</small>
        </div>`;

        days.forEach(day => {
            const session = schedule.find(s => s.day === day && s.slot === slot.key);

            if (session) {
                html += `
                    <div class="calendar-cell filled" style="background: ${session.color}; border-color: ${session.color}">
                        <div class="session-content">
                            <strong>${session.subject}</strong>
                            <small>${session.duration} min</small>
                        </div>
                    </div>
                `;
            } else {
                html += '<div class="calendar-cell empty">—</div>';
            }
        });
    });

    html += '</div>';
    container.innerHTML = html;

    // Renderizar resumen
    renderSummary();
}

function renderSummary() {
    const container = document.getElementById('schedule-summary');

    // Calcular estadísticas
    const totalSessions = schedule.length;
    const totalHours = schedule.reduce((sum, s) => sum + s.hours, 0);

    // Horas por asignatura
    const hoursBySubject = {};
    schedule.forEach(session => {
        if (!hoursBySubject[session.subject]) {
            hoursBySubject[session.subject] = 0;
        }
        hoursBySubject[session.subject] += session.hours;
    });

    let html = `
        <div class="summary-stats">
            <div class="stat-item">
                <span class="stat-label">Total sesiones:</span>
                <span class="stat-value">${totalSessions}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Horas semanales:</span>
                <span class="stat-value">${totalHours.toFixed(1)}h</span>
            </div>
        </div>
        <h4>Distribución por asignatura:</h4>
        <ul class="subject-distribution">
    `;

    Object.entries(hoursBySubject).forEach(([subject, hours]) => {
        const subjectData = subjects.find(s => s.name === subject);
        const color = subjectData ? subjectData.color : '#666';

        html += `
            <li>
                <span class="subject-color-badge" style="background: ${color}"></span>
                <span>${subject}:</span>
                <strong>${hours.toFixed(1)}h</strong>
            </li>
        `;
    });

    html += '</ul>';
    container.innerHTML = html;
}

// ============================================
// EXPORTAR A PNG
// ============================================
function exportToPNG() {
    const scheduleContainer = document.getElementById('schedule-container');

    // Ocultar botones temporalmente
    const buttons = document.querySelector('.schedule-header');
    buttons.style.display = 'none';

    html2canvas(scheduleContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
    }).then(canvas => {
        // Restaurar botones
        buttons.style.display = 'flex';

        // Crear enlace de descarga
        const link = document.createElement('a');
        link.download = `horario-estudio-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// ============================================
// LIMPIAR HORARIO
// ============================================
function clearSchedule() {
    if (!confirm('¿Eliminar el horario actual y todas las asignaturas?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    subjects = [];
    schedule = [];
    availability = {};

    localStorage.removeItem('schedule_subjects');
    localStorage.removeItem('schedule_data');

    renderSubjects();
    updateGenerateButtonState();
    showView('config-view');
}

// ============================================
// NAVEGACIÓN ENTRE VISTAS
// ============================================
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    document.getElementById(viewId).classList.add('active');
}

// ============================================
// LOCAL STORAGE
// ============================================
function saveToLocalStorage() {
    localStorage.setItem('schedule_subjects', JSON.stringify(subjects));
    localStorage.setItem('schedule_data', JSON.stringify(schedule));
}

function loadFromLocalStorage() {
    const savedSubjects = localStorage.getItem('schedule_subjects');
    const savedSchedule = localStorage.getItem('schedule_data');

    if (savedSubjects) {
        subjects = JSON.parse(savedSubjects);
    }

    if (savedSchedule) {
        schedule = JSON.parse(savedSchedule);
    }
}

// ============================================
// UTILIDADES
// ============================================
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateGenerateButtonState() {
    const btn = document.getElementById('generate-schedule-btn');
    const hasSubjects = subjects.length > 0;
    const hasAvailability = document.querySelectorAll('.day-checkbox:checked').length > 0;

    btn.disabled = !hasSubjects || !hasAvailability;

    if (!hasSubjects) {
        btn.textContent = '➕ Añade asignaturas primero';
    } else if (!hasAvailability) {
        btn.textContent = '📅 Selecciona disponibilidad horaria';
    } else {
        btn.textContent = '🎯 Generar Horario';
    }
}
