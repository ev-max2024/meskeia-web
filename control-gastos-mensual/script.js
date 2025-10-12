// ============================================
// CONTROL DE GASTOS MENSUAL - meskeIA
// ============================================

// Estado global
let currentMonth = new Date().getMonth(); // 0-11
let currentYear = new Date().getFullYear();
let currentTransactionType = 'expense'; // 'expense' o 'income'
let currentFilter = 'all'; // 'all', 'income', 'expense'
let chart = null;

// Categorías con iconos
const CATEGORIES = {
    vivienda: { icon: '🏠', name: 'Vivienda', color: '#E76F51' },
    alimentacion: { icon: '🍔', name: 'Alimentación', color: '#F4A261' },
    transporte: { icon: '🚗', name: 'Transporte', color: '#E9C46A' },
    salud: { icon: '💊', name: 'Salud', color: '#2A9D8F' },
    ocio: { icon: '🎬', name: 'Ocio', color: '#264653' },
    ropa: { icon: '👕', name: 'Ropa', color: '#A8DADC' },
    suscripciones: { icon: '📱', name: 'Suscripciones', color: '#457B9D' },
    otros: { icon: '💰', name: 'Otros', color: '#999999' }
};

const INCOME_CATEGORY = { icon: '📈', name: 'Ingreso', color: '#48A9A6' };

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha actual en el input
    document.getElementById('date').valueAsDate = new Date();

    // Actualizar título del mes
    updateMonthTitle();

    // Cargar y mostrar transacciones
    loadTransactions();
});

// ============================================
// GESTIÓN DE TRANSACCIONES
// ============================================

function getStorageKey() {
    return `transactions_${currentYear}_${currentMonth}`;
}

function getTransactions() {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
}

function saveTransactions(transactions) {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(transactions));
}

function setTransactionType(type) {
    currentTransactionType = type;

    // Actualizar botones
    document.getElementById('btn-expense').classList.toggle('active', type === 'expense');
    document.getElementById('btn-income').classList.toggle('active', type === 'income');

    // Mostrar/ocultar categorías según tipo
    const categoryGroup = document.getElementById('category-group');
    const categorySelect = document.getElementById('category');
    if (type === 'income') {
        categoryGroup.style.display = 'none';
        categorySelect.removeAttribute('required'); // No requerir para ingresos
    } else {
        categoryGroup.style.display = 'flex';
        categorySelect.setAttribute('required', 'required'); // Requerir para gastos
    }

    // Actualizar texto del botón
    const btnText = document.getElementById('btn-text');
    btnText.textContent = type === 'expense' ? '💾 Añadir Gasto' : '💾 Añadir Ingreso';
}

function addTransaction(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = currentTransactionType === 'expense' ?
        document.getElementById('category').value : 'ingreso';
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value ||
        (currentTransactionType === 'expense' ?
            CATEGORIES[category]?.name || 'Gasto' : 'Ingreso');

    // Validación
    if (amount <= 0) {
        alert('La cantidad debe ser mayor que 0');
        return;
    }

    if (currentTransactionType === 'expense' && !category) {
        alert('Selecciona una categoría');
        return;
    }

    // Crear transacción
    const transaction = {
        id: Date.now(),
        type: currentTransactionType,
        amount: amount,
        category: category,
        description: description,
        date: date
    };

    // Guardar
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);

    // Recargar vista
    loadTransactions();

    // Limpiar formulario
    document.getElementById('transaction-form').reset();
    document.getElementById('amount').focus();
    document.getElementById('date').valueAsDate = new Date();

    // Feedback
    showNotification(currentTransactionType === 'expense' ?
        '✓ Gasto añadido' : '✓ Ingreso añadido');
}

function deleteTransaction(id) {
    if (!confirm('¿Eliminar esta transacción?')) {
        return;
    }

    let transactions = getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions(transactions);

    loadTransactions();
    showNotification('✓ Transacción eliminada');
}

function clearAllTransactions() {
    const monthName = getMonthName(currentMonth);
    if (!confirm(`¿Eliminar TODAS las transacciones de ${monthName} ${currentYear}? Esta acción no se puede deshacer.`)) {
        return;
    }

    const key = getStorageKey();
    localStorage.removeItem(key);

    loadTransactions();
    showNotification('✓ Todas las transacciones eliminadas');
}

// ============================================
// VISUALIZACIÓN DE TRANSACCIONES
// ============================================

function loadTransactions() {
    const transactions = getTransactions();

    // Actualizar resumen
    updateSummary(transactions);

    // Actualizar lista
    displayTransactions(transactions);

    // Actualizar gráfico
    updateChart(transactions);

    // Mostrar/ocultar botones de acción
    const hasTransactions = transactions.length > 0;
    document.getElementById('export-btn').style.display = hasTransactions ? 'inline-block' : 'none';
    document.getElementById('clear-btn').style.display = hasTransactions ? 'inline-block' : 'none';
}

function updateSummary(transactions) {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Actualizar valores
    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expenses').textContent = formatCurrency(expenses);
    document.getElementById('balance').textContent = formatCurrency(balance);

    // Cambiar color del balance según sea positivo o negativo
    const balanceCard = document.getElementById('balance-card');
    if (balance < 0) {
        balanceCard.classList.add('negative');
    } else {
        balanceCard.classList.remove('negative');
    }
}

function displayTransactions(allTransactions) {
    // Filtrar según filtro actual
    let transactions = allTransactions;
    if (currentFilter !== 'all') {
        transactions = allTransactions.filter(t => t.type === currentFilter);
    }

    const container = document.getElementById('transactions-container');

    if (transactions.length === 0) {
        const message = currentFilter === 'all' ?
            'No hay transacciones este mes. Añade tu primera transacción arriba.' :
            `No hay ${currentFilter === 'income' ? 'ingresos' : 'gastos'} este mes.`;
        container.innerHTML = `<p class="empty-state">${message}</p>`;
        return;
    }

    // Ordenar por fecha (más recientes primero)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = transactions.map(t => {
        const categoryInfo = t.type === 'income' ?
            INCOME_CATEGORY :
            CATEGORIES[t.category] || { icon: '💰', name: 'Otros' };

        const amountPrefix = t.type === 'income' ? '+' : '-';
        const formattedDate = formatDate(t.date);

        return `
            <div class="transaction-item ${t.type}">
                <div class="transaction-info">
                    <div class="transaction-header">
                        <span class="transaction-category">${categoryInfo.icon}</span>
                        <span class="transaction-description">${t.description}</span>
                    </div>
                    <span class="transaction-date">${formattedDate}</span>
                </div>
                <span class="transaction-amount">${amountPrefix}${formatCurrency(t.amount)}</span>
                <button class="transaction-delete" onclick="deleteTransaction(${t.id})" title="Eliminar">
                    🗑️
                </button>
            </div>
        `;
    }).join('');
}

function filterTransactions(filter) {
    currentFilter = filter;

    // Actualizar botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Recargar transacciones con filtro
    const transactions = getTransactions();
    displayTransactions(transactions);
}

// ============================================
// GRÁFICO DE CATEGORÍAS
// ============================================

function updateChart(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense');

    if (expenses.length === 0) {
        document.getElementById('chart-section').style.display = 'none';
        return;
    }

    document.getElementById('chart-section').style.display = 'block';

    // Agrupar por categoría
    const categoryTotals = {};
    expenses.forEach(t => {
        if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += t.amount;
    });

    // Preparar datos para Chart.js
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const colors = categories.map(cat => CATEGORIES[cat]?.color || '#999999');
    const labels = categories.map(cat => CATEGORIES[cat]?.name || 'Otros');

    // Destruir gráfico anterior si existe
    if (chart) {
        chart.destroy();
    }

    // Crear nuevo gráfico
    const ctx = document.getElementById('expenses-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: amounts,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Crear leyenda personalizada
    createLegend(categories, categoryTotals, colors);
}

function createLegend(categories, totals, colors) {
    const container = document.getElementById('category-legend');

    container.innerHTML = categories.map((cat, index) => {
        const categoryInfo = CATEGORIES[cat] || { icon: '💰', name: 'Otros' };
        const percentage = ((totals[cat] / Object.values(totals).reduce((a,b) => a+b, 0)) * 100).toFixed(1);

        return `
            <div class="legend-item">
                <div class="legend-color" style="background: ${colors[index]}"></div>
                <div class="legend-text">
                    <span class="legend-name">${categoryInfo.icon} ${categoryInfo.name}</span>
                    <span class="legend-amount">${formatCurrency(totals[cat])} (${percentage}%)</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// NAVEGACIÓN DE MESES
// ============================================

function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    updateMonthTitle();
    loadTransactions();
}

function updateMonthTitle() {
    const monthName = getMonthName(currentMonth);
    document.getElementById('current-month').textContent = `${monthName} ${currentYear}`;
}

function getMonthName(month) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
}

// ============================================
// EXPORTAR A CSV (MES ACTUAL)
// ============================================

function exportToCSV() {
    const transactions = getTransactions();

    if (transactions.length === 0) {
        alert('No hay transacciones para exportar este mes');
        return;
    }

    // Crear contenido CSV
    let csv = 'Fecha,Tipo,Categoría,Descripción,Cantidad\n';

    transactions.forEach(t => {
        const categoryInfo = t.type === 'income' ?
            INCOME_CATEGORY :
            (CATEGORIES[t.category] || { name: 'Otros' });

        const tipo = t.type === 'income' ? 'Ingreso' : 'Gasto';
        const cantidad = t.type === 'income' ? t.amount : -t.amount;

        csv += `${t.date},${tipo},${categoryInfo.name},"${t.description}",${cantidad}\n`;
    });

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const monthName = getMonthName(currentMonth);
    link.setAttribute('href', url);
    link.setAttribute('download', `gastos_${monthName}_${currentYear}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('✓ CSV descargado');
}

// ============================================
// EXPORTAR TODO A JSON (TODOS LOS MESES)
// ============================================

function exportAllToJSON() {
    // Obtener todas las claves de localStorage que son transacciones
    const allData = {};
    let totalTransactions = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('transactions_')) {
            const data = localStorage.getItem(key);
            allData[key] = JSON.parse(data);
            totalTransactions += JSON.parse(data).length;
        }
    }

    if (Object.keys(allData).length === 0) {
        alert('No hay datos para exportar. Añade algunas transacciones primero.');
        return;
    }

    // Crear objeto con metadatos
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalMonths: Object.keys(allData).length,
        totalTransactions: totalTransactions,
        data: allData
    };

    // Convertir a JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Nombre del archivo con fecha actual
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `backup_gastos_${today}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(`✓ Backup completo descargado (${Object.keys(allData).length} meses, ${totalTransactions} transacciones)`);
}

// ============================================
// IMPORTAR DESDE JSON
// ============================================

function importFromJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar que sea JSON
    if (!file.name.endsWith('.json')) {
        alert('Error: El archivo debe ser un JSON (.json)');
        event.target.value = ''; // Resetear input
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);

            // Validar estructura
            if (!importData.data || typeof importData.data !== 'object') {
                throw new Error('Formato JSON inválido');
            }

            // Preguntar al usuario si quiere fusionar o reemplazar
            const action = confirm(
                `Se encontraron ${importData.totalMonths || 0} meses con ${importData.totalTransactions || 0} transacciones.\n\n` +
                `¿Deseas FUSIONAR con tus datos actuales?\n\n` +
                `• Aceptar = Fusionar (mantener datos actuales + añadir importados)\n` +
                `• Cancelar = Cancelar importación`
            );

            if (!action) {
                event.target.value = '';
                showNotification('Importación cancelada');
                return;
            }

            // Importar datos (fusionar)
            let monthsImported = 0;
            let transactionsImported = 0;

            for (const [key, transactions] of Object.entries(importData.data)) {
                if (key.startsWith('transactions_')) {
                    // Obtener datos existentes
                    const existing = localStorage.getItem(key);
                    const existingTransactions = existing ? JSON.parse(existing) : [];

                    // Fusionar: evitar duplicados por ID
                    const existingIds = new Set(existingTransactions.map(t => t.id));
                    const newTransactions = transactions.filter(t => !existingIds.has(t.id));

                    // Combinar
                    const merged = [...existingTransactions, ...newTransactions];

                    // Guardar
                    localStorage.setItem(key, JSON.stringify(merged));

                    monthsImported++;
                    transactionsImported += newTransactions.length;
                }
            }

            // Recargar vista
            loadTransactions();

            // Resetear input
            event.target.value = '';

            // Notificar éxito
            showNotification(`✓ Importado: ${monthsImported} meses, ${transactionsImported} transacciones nuevas`);

        } catch (error) {
            alert('Error al importar archivo: ' + error.message + '\n\nAsegúrate de que sea un archivo JSON válido exportado desde esta aplicación.');
            event.target.value = '';
        }
    };

    reader.onerror = function() {
        alert('Error al leer el archivo');
        event.target.value = '';
    };

    reader.readAsText(file);
}

// ============================================
// UTILIDADES
// ============================================

function formatCurrency(amount) {
    return amount.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00'); // Evitar problemas de zona horaria
    return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48A9A6;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Añadir animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
