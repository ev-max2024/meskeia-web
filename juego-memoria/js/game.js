// Clase principal del Juego de Memoria
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.gameActive = false;
        this.difficulty = 'medium';
        this.stats = this.loadStats();
        
        // Símbolos para las cartas
        this.symbols = ['🌟', '🎵', '🎨', '🚀', '🌙', '⚡', '🎯', '🔥', '💎', '🎪', '🌈', '🎭', '🎪', '🌸', '🦋', '⭐'];
        
        this.initializeGame();
    }

    // Inicializa el juego
    initializeGame() {
        this.bindEvents();
        this.updateStats();
        this.newGame();
    }

    // Vincula los eventos
    bindEvents() {
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('reset-stats').addEventListener('click', () => this.resetStats());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.newGame();
        });
    }

    // Configuración por dificultad
    getDifficultyConfig() {
        const configs = {
            easy: { pairs: 6, grid: 'easy' },
            medium: { pairs: 8, grid: 'medium' },
            hard: { pairs: 10, grid: 'hard' }
        };
        return configs[this.difficulty];
    }

    // Inicia un nuevo juego
    newGame() {
        this.resetGame();
        this.createBoard();
        this.startTimer();
        this.gameActive = true;
        document.getElementById('game-message').textContent = '¡Encuentra todas las parejas!';
    }

    // Resetea el estado del juego
    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameActive = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.updateMoves();
        this.updateTimer(0);
    }

    // Crea el tablero de juego
    createBoard() {
        const config = this.getDifficultyConfig();
        const board = document.getElementById('memory-board');
        
        // Limpia el tablero anterior
        board.innerHTML = '';
        board.className = `memory-board ${config.grid}`;
        
        // Crea las cartas (pares)
        const gameSymbols = this.symbols.slice(0, config.pairs);
        const cardSymbols = [...gameSymbols, ...gameSymbols]; // Duplica para hacer pares
        
        // Mezcla las cartas
        this.shuffleArray(cardSymbols);
        
        // Crea los elementos de las cartas
        cardSymbols.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            board.appendChild(card);
        });
        
        this.cards = document.querySelectorAll('.memory-card');
    }

    // Crea una carta individual
    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        return card;
    }

    // Voltea una carta
    flipCard(card) {
        if (!this.gameActive || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            this.checkMatch();
        }
    }

    // Verifica si hay coincidencia
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const symbol1 = card1.dataset.symbol;
        const symbol2 = card2.dataset.symbol;

        // Desactiva temporalmente las cartas
        this.cards.forEach(card => card.classList.add('disabled'));

        setTimeout(() => {
            if (symbol1 === symbol2) {
                // Coincidencia encontrada
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                
                if (this.matchedPairs === this.getDifficultyConfig().pairs) {
                    this.gameWon();
                }
            } else {
                // No hay coincidencia - voltea las cartas de vuelta
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            
            // Reactiva las cartas
            this.cards.forEach(card => card.classList.remove('disabled'));
            this.flippedCards = [];
        }, 1000);
    }

    // Juego ganado
    gameWon() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        const finalTime = this.getCurrentTime();
        const finalMoves = this.moves;
        
        // Actualiza estadísticas
        this.updateGameStats(finalTime, finalMoves);
        
        // Mensaje de victoria
        const minutes = Math.floor(finalTime / 60);
        const seconds = finalTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('game-message').innerHTML = 
            `¡Excelente! Completado en <strong>${timeString}</strong> con <strong>${finalMoves}</strong> movimientos`;
        
        document.querySelector('.container').classList.add('game-won');
        
        setTimeout(() => {
            document.querySelector('.container').classList.remove('game-won');
        }, 3000);
    }

    // Actualiza estadísticas del juego
    updateGameStats(time, moves) {
        const difficultyKey = this.difficulty;
        
        if (!this.stats[difficultyKey]) {
            this.stats[difficultyKey] = {
                gamesCompleted: 0,
                bestTime: null,
                bestMoves: null
            };
        }
        
        this.stats[difficultyKey].gamesCompleted++;
        
        if (!this.stats[difficultyKey].bestTime || time < this.stats[difficultyKey].bestTime) {
            this.stats[difficultyKey].bestTime = time;
        }
        
        if (!this.stats[difficultyKey].bestMoves || moves < this.stats[difficultyKey].bestMoves) {
            this.stats[difficultyKey].bestMoves = moves;
        }
        
        this.saveStats();
        this.updateStats();
    }

    // Inicia el cronómetro
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (this.gameActive) {
                const currentTime = this.getCurrentTime();
                this.updateTimer(currentTime);
            }
        }, 1000);
    }

    // Obtiene el tiempo actual de juego
    getCurrentTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    // Actualiza el display del cronómetro
    updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('current-time').textContent = timeString;
    }

    // Actualiza el contador de movimientos
    updateMoves() {
        document.getElementById('moves-count').textContent = this.moves;
    }

    // Actualiza las estadísticas mostradas
    updateStats() {
        const difficultyStats = this.stats[this.difficulty];
        
        if (difficultyStats && difficultyStats.bestTime) {
            const minutes = Math.floor(difficultyStats.bestTime / 60);
            const seconds = difficultyStats.bestTime % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('best-time').textContent = timeString;
        } else {
            document.getElementById('best-time').textContent = '--:--';
        }
        
        if (difficultyStats && difficultyStats.bestMoves) {
            document.getElementById('best-moves').textContent = difficultyStats.bestMoves;
        } else {
            document.getElementById('best-moves').textContent = '--';
        }
        
        // Estadísticas generales
        const totalGames = Object.values(this.stats).reduce((total, diff) => 
            total + (diff.gamesCompleted || 0), 0);
        document.getElementById('games-completed').textContent = totalGames;
    }

    // Resetea las estadísticas
    resetStats() {
        if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas?')) {
            this.stats = {};
            this.saveStats();
            this.updateStats();
            
            // Mensaje temporal
            const originalMessage = document.getElementById('game-message').textContent;
            document.getElementById('game-message').textContent = 'Estadísticas reiniciadas correctamente';
            setTimeout(() => {
                document.getElementById('game-message').textContent = originalMessage;
            }, 2000);
        }
    }

    // Mezcla un array aleatoriamente (Fisher-Yates)
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Guarda estadísticas en localStorage
    saveStats() {
        localStorage.setItem('memoryGameStats', JSON.stringify(this.stats));
    }

    // Carga estadísticas desde localStorage
    loadStats() {
        const saved = localStorage.getItem('memoryGameStats');
        return saved ? JSON.parse(saved) : {};
    }
}

// Inicializa el juego cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});