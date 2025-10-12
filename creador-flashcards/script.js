// ============================================
// CREADOR DE FLASHCARDS - meskeIA
// ============================================

// Estado global
let decks = [];
let currentDeckId = null;
let currentCardIndex = 0;
let isFlipped = false;
let editingDeckId = null;
let editingCardId = null;
let studyCards = []; // Cartas en modo estudio

// Categorías con iconos
const CATEGORIES = {
    'Idiomas': { icon: '🌍', color: '#2E86AB' },
    'Medicina': { icon: '🩺', color: '#E76F51' },
    'Derecho': { icon: '⚖️', color: '#264653' },
    'Programación': { icon: '💻', color: '#2A9D8F' },
    'Historia': { icon: '📜', color: '#F4A261' },
    'Ciencias': { icon: '🔬', color: '#48A9A6' },
    'Matemáticas': { icon: '🔢', color: '#E9C46A' },
    'Otros': { icon: '📌', color: '#999999' }
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadDecks();
    displayDecks();
});

// ============================================
// GESTIÓN DE DATOS (LocalStorage)
// ============================================

function loadDecks() {
    const saved = localStorage.getItem('flashcards_decks');
    decks = saved ? JSON.parse(saved) : [];
}

function saveDecks() {
    localStorage.setItem('flashcards_decks', JSON.stringify(decks));
}

// ============================================
// GESTIÓN DE MAZOS
// ============================================

function showCreateDeckModal() {
    editingDeckId = null;
    document.getElementById('deck-modal-title').textContent = 'Crear Nuevo Mazo';
    document.getElementById('deck-form').reset();
    document.getElementById('deck-modal').style.display = 'flex';
}

function showEditDeckModal(deckId) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    editingDeckId = deckId;
    document.getElementById('deck-modal-title').textContent = 'Editar Mazo';
    document.getElementById('deck-name').value = deck.name;
    document.getElementById('deck-category').value = deck.category;

    // Seleccionar color
    document.querySelectorAll('input[name="deck-color"]').forEach(input => {
        input.checked = input.value === deck.color;
    });

    document.getElementById('deck-modal').style.display = 'flex';
}

function closeDeckModal() {
    document.getElementById('deck-modal').style.display = 'none';
    document.getElementById('deck-form').reset();
    editingDeckId = null;
}

function saveDeck(event) {
    event.preventDefault();

    const name = document.getElementById('deck-name').value.trim();
    const category = document.getElementById('deck-category').value;
    const colorInput = document.querySelector('input[name="deck-color"]:checked');
    const color = colorInput ? colorInput.value : '#2E86AB';

    if (!name) {
        alert('El nombre del mazo es obligatorio');
        return;
    }

    if (editingDeckId) {
        // Editar mazo existente
        const deck = decks.find(d => d.id === editingDeckId);
        if (deck) {
            deck.name = name;
            deck.category = category;
            deck.color = color;
        }
        showNotification('✓ Mazo actualizado');
    } else {
        // Crear nuevo mazo
        const newDeck = {
            id: Date.now(),
            name: name,
            category: category,
            color: color,
            cards: [],
            created: new Date().toISOString(),
            lastStudied: null
        };
        decks.push(newDeck);
        showNotification('✓ Mazo creado');
    }

    saveDecks();
    displayDecks();
    closeDeckModal();
}

function deleteDeck(deckId) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    const cardCount = deck.cards.length;
    const message = cardCount > 0
        ? `¿Eliminar el mazo "${deck.name}" con ${cardCount} tarjetas? Esta acción no se puede deshacer.`
        : `¿Eliminar el mazo "${deck.name}"?`;

    if (!confirm(message)) return;

    decks = decks.filter(d => d.id !== deckId);
    saveDecks();
    displayDecks();
    showNotification('✓ Mazo eliminado');
}

function displayDecks() {
    const container = document.getElementById('decks-container');

    if (decks.length === 0) {
        container.innerHTML = '<p class="empty-state">No tienes mazos todavía. Crea tu primer mazo para empezar a estudiar.</p>';
        return;
    }

    // Ordenar por última modificación (más recientes primero)
    const sortedDecks = [...decks].sort((a, b) => {
        const dateA = a.lastStudied || a.created;
        const dateB = b.lastStudied || b.created;
        return new Date(dateB) - new Date(dateA);
    });

    container.innerHTML = sortedDecks.map(deck => {
        const categoryInfo = CATEGORIES[deck.category] || CATEGORIES['Otros'];
        const cardCount = deck.cards.length;

        return `
            <div class="deck-card" style="border-left: 4px solid ${deck.color}">
                <div class="deck-card-header">
                    <span class="deck-icon">${categoryInfo.icon}</span>
                    <h3 class="deck-name">${deck.name}</h3>
                </div>
                <div class="deck-card-info">
                    <span class="deck-count">${cardCount} tarjeta${cardCount !== 1 ? 's' : ''}</span>
                    <span class="deck-category">${deck.category}</span>
                </div>
                <div class="deck-card-actions">
                    <button onclick="openDeck(${deck.id})" class="btn btn-secondary">
                        📝 Gestionar
                    </button>
                    <button onclick="startStudyModeFromDashboard(${deck.id})" class="btn btn-primary" ${cardCount === 0 ? 'disabled' : ''}>
                        📖 Estudiar
                    </button>
                    <div class="deck-menu">
                        <button onclick="showEditDeckModal(${deck.id})" class="btn-icon" title="Editar mazo">
                            ✏️
                        </button>
                        <button onclick="deleteDeck(${deck.id})" class="btn-icon" title="Eliminar mazo">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// GESTIÓN DE TARJETAS
// ============================================

function openDeck(deckId) {
    currentDeckId = deckId;
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    document.getElementById('deck-title').textContent = deck.name;
    document.getElementById('deck-stats').textContent = `${deck.cards.length} tarjeta${deck.cards.length !== 1 ? 's' : ''}`;

    // Mostrar/ocultar botones según si hay tarjetas
    document.getElementById('study-deck-btn').disabled = deck.cards.length === 0;
    document.getElementById('export-deck-btn').disabled = deck.cards.length === 0;

    displayCards();
    showView('deck-view');
}

function showDashboard() {
    currentDeckId = null;
    showView('dashboard-view');
}

function showAddCardModal() {
    editingCardId = null;
    document.getElementById('card-modal-title').textContent = 'Añadir Nueva Tarjeta';
    document.getElementById('card-form').reset();
    document.getElementById('card-modal').style.display = 'flex';
}

function showEditCardModal(cardId) {
    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck) return;

    const card = deck.cards.find(c => c.id === cardId);
    if (!card) return;

    editingCardId = cardId;
    document.getElementById('card-modal-title').textContent = 'Editar Tarjeta';
    document.getElementById('card-front-input').value = card.front;
    document.getElementById('card-back-input').value = card.back;
    document.getElementById('card-modal').style.display = 'flex';
}

function closeCardModal() {
    document.getElementById('card-modal').style.display = 'none';
    document.getElementById('card-form').reset();
    editingCardId = null;
}

function saveCard(event) {
    event.preventDefault();

    const front = document.getElementById('card-front-input').value.trim();
    const back = document.getElementById('card-back-input').value.trim();

    if (!front || !back) {
        alert('Completa ambos campos (pregunta y respuesta)');
        return;
    }

    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck) return;

    if (editingCardId) {
        // Editar tarjeta existente
        const card = deck.cards.find(c => c.id === editingCardId);
        if (card) {
            card.front = front;
            card.back = back;
        }
        showNotification('✓ Tarjeta actualizada');
    } else {
        // Crear nueva tarjeta
        const newCard = {
            id: Date.now(),
            front: front,
            back: back,
            created: new Date().toISOString(),
            reviewCount: 0,
            lastReviewed: null
        };
        deck.cards.push(newCard);
        showNotification('✓ Tarjeta añadida');
    }

    saveDecks();
    displayCards();
    closeCardModal();

    // Actualizar contador
    document.getElementById('deck-stats').textContent = `${deck.cards.length} tarjeta${deck.cards.length !== 1 ? 's' : ''}`;
    document.getElementById('study-deck-btn').disabled = false;
    document.getElementById('export-deck-btn').disabled = false;
}

function deleteCard(cardId) {
    if (!confirm('¿Eliminar esta tarjeta?')) return;

    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck) return;

    deck.cards = deck.cards.filter(c => c.id !== cardId);
    saveDecks();
    displayCards();
    showNotification('✓ Tarjeta eliminada');

    // Actualizar contador
    document.getElementById('deck-stats').textContent = `${deck.cards.length} tarjeta${deck.cards.length !== 1 ? 's' : ''}`;
    document.getElementById('study-deck-btn').disabled = deck.cards.length === 0;
    document.getElementById('export-deck-btn').disabled = deck.cards.length === 0;
}

function displayCards() {
    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck) return;

    const container = document.getElementById('cards-container');

    if (deck.cards.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay tarjetas en este mazo. Añade tu primera tarjeta.</p>';
        return;
    }

    container.innerHTML = deck.cards.map(card => {
        return `
            <div class="card-item">
                <div class="card-item-content">
                    <div class="card-item-front">
                        <strong>❓ Pregunta:</strong>
                        <p>${escapeHtml(card.front)}</p>
                    </div>
                    <div class="card-item-back">
                        <strong>✅ Respuesta:</strong>
                        <p>${escapeHtml(card.back)}</p>
                    </div>
                </div>
                <div class="card-item-actions">
                    <button onclick="showEditCardModal(${card.id})" class="btn btn-outline" title="Editar">
                        ✏️
                    </button>
                    <button onclick="deleteCard(${card.id})" class="btn btn-outline" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// MODO ESTUDIO
// ============================================

function startStudyModeFromDashboard(deckId) {
    currentDeckId = deckId;
    startStudyMode();
}

function startStudyMode() {
    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck || deck.cards.length === 0) {
        alert('Este mazo no tiene tarjetas para estudiar');
        return;
    }

    // Copiar tarjetas y resetear índice
    studyCards = [...deck.cards];
    currentCardIndex = 0;
    isFlipped = false;

    // Actualizar última vez estudiado
    deck.lastStudied = new Date().toISOString();
    saveDecks();

    showView('study-view');
    updateStudyCard();
}

function exitStudyMode() {
    // Actualizar contador de repasos
    const deck = decks.find(d => d.id === currentDeckId);
    if (deck) {
        studyCards.forEach(studyCard => {
            const originalCard = deck.cards.find(c => c.id === studyCard.id);
            if (originalCard) {
                originalCard.reviewCount++;
                originalCard.lastReviewed = new Date().toISOString();
            }
        });
        saveDecks();
    }

    if (document.getElementById('deck-view').style.display === 'none') {
        showDashboard();
    } else {
        showView('deck-view');
    }
}

function updateStudyCard() {
    const card = studyCards[currentCardIndex];
    if (!card) return;

    // Resetear flip
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    isFlipped = false;

    // Actualizar contenido
    document.getElementById('card-front').textContent = card.front;
    document.getElementById('card-back').textContent = card.back;

    // Actualizar contador
    document.getElementById('study-counter').textContent = `${currentCardIndex + 1}/${studyCards.length}`;

    // Actualizar botones
    document.getElementById('prev-btn').disabled = currentCardIndex === 0;
    document.getElementById('next-btn').disabled = currentCardIndex === studyCards.length - 1;
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateStudyCard();
    }
}

function nextCard() {
    if (currentCardIndex < studyCards.length - 1) {
        currentCardIndex++;
        updateStudyCard();
    }
}

function shuffleCards() {
    if (!confirm('¿Barajar las tarjetas? Perderás el progreso actual.')) return;

    // Algoritmo Fisher-Yates
    for (let i = studyCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [studyCards[i], studyCards[j]] = [studyCards[j], studyCards[i]];
    }

    currentCardIndex = 0;
    updateStudyCard();
    showNotification('✓ Tarjetas barajadas');
}

// ============================================
// EXPORTAR / IMPORTAR
// ============================================

function exportAllToJSON() {
    if (decks.length === 0) {
        alert('No hay mazos para exportar');
        return;
    }

    const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);

    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalDecks: decks.length,
        totalCards: totalCards,
        decks: decks
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `flashcards_backup_${today}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(`✓ Backup descargado (${decks.length} mazos, ${totalCards} tarjetas)`);
}

function importFromJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
        alert('Error: El archivo debe ser un JSON (.json)');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);

            if (!importData.decks || !Array.isArray(importData.decks)) {
                throw new Error('Formato JSON inválido');
            }

            const action = confirm(
                `Se encontraron ${importData.totalDecks || 0} mazos con ${importData.totalCards || 0} tarjetas.\n\n` +
                `¿Deseas FUSIONAR con tus mazos actuales?\n\n` +
                `• Aceptar = Fusionar (mantener mazos actuales + añadir importados)\n` +
                `• Cancelar = Cancelar importación`
            );

            if (!action) {
                event.target.value = '';
                showNotification('Importación cancelada');
                return;
            }

            // Fusionar: evitar duplicados por ID
            const existingIds = new Set(decks.map(d => d.id));
            const newDecks = importData.decks.filter(d => !existingIds.has(d.id));

            decks = [...decks, ...newDecks];
            saveDecks();
            displayDecks();

            event.target.value = '';
            showNotification(`✓ Importado: ${newDecks.length} mazos nuevos`);

        } catch (error) {
            alert('Error al importar: ' + error.message);
            event.target.value = '';
        }
    };

    reader.onerror = function() {
        alert('Error al leer el archivo');
        event.target.value = '';
    };

    reader.readAsText(file);
}

function exportDeckToCSV() {
    const deck = decks.find(d => d.id === currentDeckId);
    if (!deck || deck.cards.length === 0) {
        alert('No hay tarjetas para exportar');
        return;
    }

    let csv = 'Pregunta,Respuesta\n';

    deck.cards.forEach(card => {
        const front = `"${card.front.replace(/"/g, '""')}"`;
        const back = `"${card.back.replace(/"/g, '""')}"`;
        csv += `${front},${back}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const safeName = deck.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('href', url);
    link.setAttribute('download', `flashcards_${safeName}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('✓ CSV descargado');
}

// ============================================
// UTILIDADES
// ============================================

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
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

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cerrar modales con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDeckModal();
        closeCardModal();
    }
});

// Cerrar modales al clicar fuera
window.onclick = function(event) {
    const deckModal = document.getElementById('deck-modal');
    const cardModal = document.getElementById('card-modal');

    if (event.target === deckModal) {
        closeDeckModal();
    }
    if (event.target === cardModal) {
        closeCardModal();
    }
};

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
