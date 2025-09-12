// Clase principal para manejar el juego de Sudoku
class SudokuGame {
    constructor() {
        this.board = this.createEmptyBoard();
        this.originalBoard = this.createEmptyBoard();
        this.solution = this.createEmptyBoard();
    }

    // Crea un tablero vacío 9x9
    createEmptyBoard() {
        return Array(9).fill(null).map(() => Array(9).fill(0));
    }

    // Copia un tablero
    copyBoard(board) {
        return board.map(row => [...row]);
    }

    // Verifica si un número es válido en una posición específica
    isValid(board, row, col, num) {
        // Comprueba si 'num' ya está en la fila
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
                return false;
            }
        }

        // Comprueba si 'num' ya está en la columna
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                return false;
            }
        }

        // Comprueba si 'num' ya está en el cuadro 3x3
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    // Resuelve el sudoku usando backtracking
    solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Genera un tablero completo y válido
    generateCompleteBoard() {
        const board = this.createEmptyBoard();
        this.fillBoard(board);
        return board;
    }

    // Llena el tablero con números aleatorios válidos
    fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (let num of numbers) {
                        if (this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.fillBoard(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Mezcla un array aleatoriamente
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Genera un puzzle removiendo números según la dificultad
    generatePuzzle(difficulty) {
        // Genera un tablero completo
        const completeBoard = this.generateCompleteBoard();
        this.solution = this.copyBoard(completeBoard);
        
        // Número de casillas a remover según dificultad
        const cellsToRemove = {
            1: 30, // Fácil
            2: 40,
            3: 50, // Medio
            4: 60,
            5: 65  // Difícil
        };

        const puzzle = this.copyBoard(completeBoard);
        const toRemove = cellsToRemove[difficulty] || 50;
        
        // Crea una lista de todas las posiciones
        const positions = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                positions.push([row, col]);
            }
        }
        
        // Mezcla las posiciones aleatoriamente
        const shuffledPositions = this.shuffleArray(positions);
        
        // Remueve números de las posiciones seleccionadas
        for (let i = 0; i < toRemove && i < shuffledPositions.length; i++) {
            const [row, col] = shuffledPositions[i];
            puzzle[row][col] = 0;
        }
        
        this.board = puzzle;
        this.originalBoard = this.copyBoard(puzzle);
        
        return puzzle;
    }

    // Verifica si el puzzle está completo y correcto
    isComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return this.isValidBoard();
    }

    // Verifica si el tablero actual es válido
    isValidBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] !== 0) {
                    const num = this.board[row][col];
                    this.board[row][col] = 0; // Temporalmente vacía la celda
                    if (!this.isValid(this.board, row, col, num)) {
                        this.board[row][col] = num; // Restaura el valor
                        return false;
                    }
                    this.board[row][col] = num; // Restaura el valor
                }
            }
        }
        return true;
    }

    // Establece un valor en una celda específica
    setCell(row, col, value) {
        if (this.originalBoard[row][col] === 0) { // Solo si no es una celda predefinida
            this.board[row][col] = value;
        }
    }

    // Obtiene el valor de una celda
    getCell(row, col) {
        return this.board[row][col];
    }

    // Verifica si una celda es predefinida (no editable)
    isPredefined(row, col) {
        return this.originalBoard[row][col] !== 0;
    }

    // Resetea el tablero al estado original
    reset() {
        this.board = this.copyBoard(this.originalBoard);
    }

    // Resuelve el puzzle actual
    solve() {
        this.board = this.copyBoard(this.solution);
    }

    // Obtiene errores en el tablero actual
    getErrors() {
        const errors = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] !== 0) {
                    const num = this.board[row][col];
                    this.board[row][col] = 0;
                    if (!this.isValid(this.board, row, col, num)) {
                        errors.push([row, col]);
                    }
                    this.board[row][col] = num;
                }
            }
        }
        return errors;
    }

    // Guarda el estado actual en localStorage
    saveToStorage() {
        const gameState = {
            board: this.board,
            originalBoard: this.originalBoard,
            solution: this.solution
        };
        localStorage.setItem('sudokuGame', JSON.stringify(gameState));
    }

    // Carga el estado desde localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('sudokuGame');
        if (saved) {
            const gameState = JSON.parse(saved);
            this.board = gameState.board;
            this.originalBoard = gameState.originalBoard;
            this.solution = gameState.solution;
            return true;
        }
        return false;
    }
}

// Instancia global del juego
const sudokuGame = new SudokuGame();