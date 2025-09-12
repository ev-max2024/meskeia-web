// Manejo de la interfaz de usuario
class SudokuUI {
    constructor() {
        this.gridElement = document.getElementById('sudoku-grid');
        this.messageElement = document.getElementById('message');
        this.difficultySelect = document.getElementById('difficulty');
        
        this.initializeGrid();
        this.bindEvents();
        this.loadOrCreateGame();
    }

    // Inicializa el grid del sudoku
    initializeGrid() {
        this.gridElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.dataset.row = row;
                input.dataset.col = col;
                
                cell.appendChild(input);
                this.gridElement.appendChild(cell);
            }
        }
    }

    // Vincula los eventos a los elementos
    bindEvents() {
        // Botones
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('verify').addEventListener('click', () => this.verifyGame());
        document.getElementById('solve').addEventListener('click', () => this.solveGame());
        document.getElementById('reset').addEventListener('click', () => this.resetGame());
        
        // Inputs del grid
        this.gridElement.addEventListener('input', (e) => this.handleCellInput(e));
        this.gridElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Selector de dificultad
        this.difficultySelect.addEventListener('change', () => this.newGame());
    }

    // Maneja la entrada en las celdas
    handleCellInput(event) {
        const input = event.target;
        if (input.tagName !== 'INPUT') return;
        
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        
        // Solo permite números del 1-9
        let value = input.value.replace(/[^1-9]/g, '');
        
        if (value.length > 1) {
            value = value.charAt(0);
        }
        
        input.value = value;
        
        // Actualiza el modelo
        const numValue = value ? parseInt(value) : 0;
        sudokuGame.setCell(row, col, numValue);
        
        // Guarda el estado
        sudokuGame.saveToStorage();
        
        // Limpia mensajes anteriores
        this.clearMessage();
        
        // Verifica si el juego está completo
        if (sudokuGame.isComplete()) {
            this.showMessage('¡Excelente! Has completado el Sudoku correctamente.', 'success');
        }
    }

    // Maneja las teclas especiales
    handleKeyDown(event) {
        const input = event.target;
        if (input.tagName !== 'INPUT') return;
        
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        
        // Navegación con flechas
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.focusCell(Math.max(0, row - 1), col);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.focusCell(Math.min(8, row + 1), col);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.focusCell(row, Math.max(0, col - 1));
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.focusCell(row, Math.min(8, col + 1));
                break;
            case 'Delete':
            case 'Backspace':
                event.preventDefault();
                input.value = '';
                sudokuGame.setCell(row, col, 0);
                sudokuGame.saveToStorage();
                this.clearMessage();
                break;
        }
    }

    // Enfoca una celda específica
    focusCell(row, col) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
        if (input) {
            input.focus();
            input.select();
        }
    }

    // Actualiza la visualización del grid
    updateGrid() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
                const cell = input.parentElement;
                const value = sudokuGame.getCell(row, col);
                
                // Establece el valor
                input.value = value === 0 ? '' : value;
                
                // Establece el estado de la celda
                if (sudokuGame.isPredefined(row, col)) {
                    cell.classList.add('predefined');
                    input.readOnly = true;
                } else {
                    cell.classList.remove('predefined');
                    input.readOnly = false;
                }
                
                // Limpia clases de estado
                cell.classList.remove('error', 'correct');
            }
        }
    }

    // Inicia un nuevo juego
    newGame() {
        const difficulty = parseInt(this.difficultySelect.value);
        const difficultyNames = {
            1: 'Principiante',
            2: 'Fácil', 
            3: 'Intermedio',
            4: 'Avanzado',
            5: 'Experto'
        };
        
        sudokuGame.generatePuzzle(difficulty);
        this.updateGrid();
        this.clearMessage();
        this.showMessage(`Nuevo puzzle generado - Nivel ${difficultyNames[difficulty]}`, 'info');
    }

    // Verifica el estado actual del juego
    verifyGame() {
        const errors = sudokuGame.getErrors();
        
        // Limpia errores anteriores
        document.querySelectorAll('.sudoku-cell').forEach(cell => {
            cell.classList.remove('error', 'correct');
        });
        
        if (errors.length === 0) {
            if (sudokuGame.isComplete()) {
                this.showMessage('¡Perfecto! El Sudoku está completo y correcto.', 'success');
                // Marca todas las celdas como correctas
                document.querySelectorAll('.sudoku-cell').forEach(cell => {
                    if (!cell.classList.contains('predefined')) {
                        cell.classList.add('correct');
                    }
                });
            } else {
                this.showMessage('Todo correcto hasta ahora. ¡Continúa!', 'info');
            }
        } else {
            // Marca las celdas con errores
            errors.forEach(([row, col]) => {
                const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
                input.parentElement.classList.add('error');
            });
            
            const errorText = errors.length === 1 ? 
                'Se encontró 1 error' : 
                `Se encontraron ${errors.length} errores`;
            this.showMessage(`${errorText}. Revisa las celdas resaltadas.`, 'error');
        }
    }

    // Resuelve el juego automáticamente
    solveGame() {
        if (confirm('¿Estás seguro de que quieres resolver el Sudoku automáticamente?')) {
            sudokuGame.solve();
            this.updateGrid();
            this.showMessage('Sudoku resuelto automáticamente.', 'info');
        }
    }

    // Resetea el juego al estado original
    resetGame() {
        if (confirm('¿Estás seguro de que quieres reiniciar el puzzle actual?')) {
            sudokuGame.reset();
            this.updateGrid();
            this.clearMessage();
            this.showMessage('Puzzle reiniciado al estado inicial.', 'info');
        }
    }

    // Muestra un mensaje al usuario
    showMessage(text, type = 'info') {
        this.messageElement.textContent = text;
        this.messageElement.className = `game-message message-${type}`;
        
        // Auto-oculta el mensaje después de 4 segundos para mensajes informativos
        if (type === 'info') {
            setTimeout(() => this.clearMessage(), 4000);
        }
    }

    // Limpia el mensaje
    clearMessage() {
        this.messageElement.textContent = '';
        this.messageElement.className = 'game-message';
    }

    // Carga un juego guardado o crea uno nuevo
    loadOrCreateGame() {
        if (sudokuGame.loadFromStorage()) {
            this.updateGrid();
            this.showMessage('Sesión anterior restaurada.', 'info');
        } else {
            this.newGame();
        }
    }
}

// Inicializa la interfaz cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    new SudokuUI();
});