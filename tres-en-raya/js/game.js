// Clase principal del juego Tres en Raya
class TresEnRayaGame {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X'; // X = Humano, O = IA
        this.gameActive = true;
        this.difficulty = 'medium';
        this.stats = this.loadStats();
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]             // Diagonales
        ];
        
        this.initializeGame();
    }

    // Inicializa el juego
    initializeGame() {
        this.bindEvents();
        this.updateStats();
        this.updateGameStatus();
    }

    // Vincula los eventos
    bindEvents() {
        // Células del tablero
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        // Botones
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('reset-stats').addEventListener('click', () => this.resetStats());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
    }

    // Maneja el click en una celda
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== 'X') {
            return;
        }

        this.makeMove(index, 'X');

        if (this.gameActive && !this.checkWinner() && !this.checkDraw()) {
            // Turno de la IA después de un pequeño delay
            setTimeout(() => {
                this.aiMove();
            }, 500);
        }
    }

    // Realiza un movimiento
    makeMove(index, player) {
        this.board[index] = player;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add('filled', player.toLowerCase());

        if (this.checkWinner()) {
            this.endGame(player);
        } else if (this.checkDraw()) {
            this.endGame('draw');
        } else {
            this.currentPlayer = player === 'X' ? 'O' : 'X';
            this.updateGameStatus();
        }
    }

    // IA hace su movimiento
    aiMove() {
        if (!this.gameActive) return;

        let move;
        
        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getMediumMove();
                break;
            case 'hard':
                move = this.getBestMove();
                break;
        }

        if (move !== -1) {
            this.makeMove(move, 'O');
        }
    }

    // Movimiento aleatorio (fácil)
    getRandomMove() {
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) return -1;
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Movimiento intermedio (50% estratégico, 50% aleatorio)
    getMediumMove() {
        if (Math.random() < 0.5) {
            return this.getBestMove();
        } else {
            return this.getRandomMove();
        }
    }

    // Mejor movimiento usando minimax (difícil)
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    // Algoritmo minimax
    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinnerForBoard(board);
        
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        if (this.isBoardFull(board)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    // Obtiene movimientos disponibles
    getAvailableMoves() {
        return this.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    }

    // Verifica si hay un ganador
    checkWinner() {
        return this.checkWinnerForBoard(this.board);
    }

    // Verifica ganador para un tablero específico
    checkWinnerForBoard(board) {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    // Verifica si hay empate
    checkDraw() {
        return this.isBoardFull(this.board) && !this.checkWinner();
    }

    // Verifica si el tablero está lleno
    isBoardFull(board) {
        return board.every(cell => cell !== '');
    }

    // Termina el juego
    endGame(result) {
        this.gameActive = false;
        document.getElementById('game-board').classList.add('game-disabled');

        if (result === 'X') {
            this.stats.wins++;
            this.showMessage('¡Felicidades! Has ganado esta partida.', 'success');
            this.highlightWinningCells();
        } else if (result === 'O') {
            this.stats.losses++;
            this.showMessage('La IA ha ganado esta vez. ¡Inténtalo de nuevo!', 'lose');
            this.highlightWinningCells();
        } else if (result === 'draw') {
            this.stats.draws++;
            this.showMessage('¡Empate! Ambos jugaron muy bien.', 'draw');
        }

        this.saveStats();
        this.updateStats();
        this.updateGameStatus('Partida terminada');
    }

    // Resalta las celdas ganadoras
    highlightWinningCells() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                document.querySelector(`[data-index="${a}"]`).classList.add('winner');
                document.querySelector(`[data-index="${b}"]`).classList.add('winner');
                document.querySelector(`[data-index="${c}"]`).classList.add('winner');
                break;
            }
        }
    }

    // Nueva partida
    newGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Limpia el tablero visual
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('filled', 'x', 'o', 'winner');
        });
        
        document.getElementById('game-board').classList.remove('game-disabled');
        this.updateGameStatus();
        this.clearMessage();
    }

    // Actualiza el estado del juego
    updateGameStatus(customMessage = null) {
        const statusElement = document.getElementById('current-player');
        
        if (customMessage) {
            statusElement.innerHTML = customMessage;
            return;
        }

        if (this.currentPlayer === 'X') {
            statusElement.innerHTML = 'Tu turno - Eres las <strong>X</strong>';
        } else {
            statusElement.innerHTML = 'Turno de la IA - <strong>O</strong>';
        }
    }

    // Actualiza las estadísticas
    updateStats() {
        document.getElementById('wins').textContent = this.stats.wins;
        document.getElementById('draws').textContent = this.stats.draws;
        document.getElementById('losses').textContent = this.stats.losses;
    }

    // Resetea las estadísticas
    resetStats() {
        if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas?')) {
            this.stats = { wins: 0, draws: 0, losses: 0 };
            this.saveStats();
            this.updateStats();
            this.showMessage('Estadísticas reiniciadas correctamente.', 'info');
        }
    }

    // Guarda estadísticas en localStorage
    saveStats() {
        localStorage.setItem('tresEnRayaStats', JSON.stringify(this.stats));
    }

    // Carga estadísticas desde localStorage
    loadStats() {
        const saved = localStorage.getItem('tresEnRayaStats');
        return saved ? JSON.parse(saved) : { wins: 0, draws: 0, losses: 0 };
    }

    // Muestra un mensaje
    showMessage(text, type = 'info') {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = text;
        messageElement.className = `game-message message-${type}`;
        
        // Auto-oculta mensajes informativos después de 4 segundos
        if (type === 'info') {
            setTimeout(() => this.clearMessage(), 4000);
        }
    }

    // Limpia el mensaje
    clearMessage() {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = '';
        messageElement.className = 'game-message';
    }
}

// Inicializa el juego cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    new TresEnRayaGame();
});