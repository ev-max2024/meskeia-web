// Este archivo contiene utilidades adicionales para la generación de puzzles
// La funcionalidad principal ya está incluida en sudoku.js

// Configuración de niveles de dificultad
const DIFFICULTY_LEVELS = {
    1: { name: 'Muy Fácil', cellsToRemove: 30, description: 'Perfecto para principiantes' },
    2: { name: 'Fácil', cellsToRemove: 40, description: 'Ideal para practicar' },
    3: { name: 'Medio', cellsToRemove: 50, description: 'Nivel intermedio' },
    4: { name: 'Difícil', cellsToRemove: 60, description: 'Para jugadores experimentados' },
    5: { name: 'Muy Difícil', cellsToRemove: 65, description: 'Desafío extremo' }
};

// Utilidades adicionales para el generador
class SudokuGenerator {
    // Valida que un puzzle tenga solución única
    static hasUniqueSolution(puzzle) {
        const solver = new SudokuSolver();
        return solver.countSolutions(puzzle) === 1;
    }

    // Genera estadísticas del puzzle
    static analyzePuzzle(puzzle) {
        let filledCells = 0;
        let emptyCells = 0;
        const regionStats = {
            rows: Array(9).fill(0),
            cols: Array(9).fill(0),
            boxes: Array(9).fill(0)
        };

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (puzzle[row][col] !== 0) {
                    filledCells++;
                    regionStats.rows[row]++;
                    regionStats.cols[col]++;
                    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
                    regionStats.boxes[box]++;
                } else {
                    emptyCells++;
                }
            }
        }

        return {
            filledCells,
            emptyCells,
            regionStats,
            difficulty: this.estimateDifficulty(emptyCells, regionStats)
        };
    }

    // Estima la dificultad basada en las celdas vacías y distribución
    static estimateDifficulty(emptyCells, regionStats) {
        // Calcula la desviación estándar de la distribución
        const avgPerRegion = emptyCells / 9;
        const variance = regionStats.rows.reduce((sum, count) => {
            return sum + Math.pow(9 - count - avgPerRegion, 2);
        }, 0) / 9;
        
        const standardDeviation = Math.sqrt(variance);
        
        // Estima dificultad basada en celdas vacías y distribución
        let difficulty = 1;
        if (emptyCells >= 60) difficulty = 5;
        else if (emptyCells >= 55) difficulty = 4;
        else if (emptyCells >= 45) difficulty = 3;
        else if (emptyCells >= 35) difficulty = 2;
        
        // Ajusta por distribución irregular
        if (standardDeviation > 2) difficulty = Math.min(5, difficulty + 1);
        
        return difficulty;
    }

    // Genera múltiples puzzles y selecciona el mejor
    static generateOptimalPuzzle(difficulty, attempts = 5) {
        let bestPuzzle = null;
        let bestScore = -1;
        
        for (let i = 0; i < attempts; i++) {
            const puzzle = sudokuGame.generatePuzzle(difficulty);
            const analysis = this.analyzePuzzle(puzzle);
            
            // Puntuación basada en qué tan cerca está de la dificultad objetivo
            const score = this.scorePuzzle(analysis, difficulty);
            
            if (score > bestScore) {
                bestScore = score;
                bestPuzzle = sudokuGame.copyBoard(puzzle);
            }
        }
        
        return bestPuzzle;
    }

    // Puntuación de calidad del puzzle
    static scorePuzzle(analysis, targetDifficulty) {
        const difficultyMatch = 100 - Math.abs(analysis.difficulty - targetDifficulty) * 20;
        const distributionBonus = this.calculateDistributionBonus(analysis.regionStats);
        
        return difficultyMatch + distributionBonus;
    }

    // Bonus por distribución equilibrada
    static calculateDistributionBonus(regionStats) {
        const calculateBalance = (stats) => {
            const avg = stats.reduce((a, b) => a + b) / stats.length;
            const variance = stats.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / stats.length;
            return Math.max(0, 10 - variance);
        };

        return (
            calculateBalance(regionStats.rows) +
            calculateBalance(regionStats.cols) +
            calculateBalance(regionStats.boxes)
        ) / 3;
    }

    // Obtiene información sobre un nivel de dificultad
    static getDifficultyInfo(level) {
        return DIFFICULTY_LEVELS[level] || DIFFICULTY_LEVELS[3];
    }

    // Genera un puzzle con patrón específico (opcional)
    static generatePatternPuzzle(difficulty, pattern = 'random') {
        const puzzle = sudokuGame.generatePuzzle(difficulty);
        
        switch (pattern) {
            case 'symmetric':
                return this.makeSymmetric(puzzle);
            case 'diagonal':
                return this.emphasizeDiagonal(puzzle);
            default:
                return puzzle;
        }
    }

    // Hace el puzzle simétrico
    static makeSymmetric(puzzle) {
        const symmetric = sudokuGame.copyBoard(puzzle);
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const mirrorRow = 8 - row;
                const mirrorCol = 8 - col;
                
                // Si una celda está vacía, hace que su espejo también lo esté
                if (symmetric[row][col] === 0 || symmetric[mirrorRow][mirrorCol] === 0) {
                    symmetric[row][col] = 0;
                    symmetric[mirrorRow][mirrorCol] = 0;
                }
            }
        }
        
        return symmetric;
    }

    // Enfatiza la diagonal principal
    static emphasizeDiagonal(puzzle) {
        const diagonal = sudokuGame.copyBoard(puzzle);
        
        // Mantiene más números en las diagonales
        for (let i = 0; i < 9; i++) {
            if (Math.random() > 0.3) { // 70% probabilidad de mantener
                // Restaura números en diagonales si fueron removidos
                if (diagonal[i][i] === 0 && sudokuGame.solution[i][i] !== 0) {
                    diagonal[i][i] = sudokuGame.solution[i][i];
                }
                if (diagonal[i][8-i] === 0 && sudokuGame.solution[i][8-i] !== 0) {
                    diagonal[i][8-i] = sudokuGame.solution[i][8-i];
                }
            }
        }
        
        return diagonal;
    }
}

// Solver adicional para validación
class SudokuSolver {
    constructor() {
        this.solutionCount = 0;
    }

    // Cuenta el número de soluciones posibles
    countSolutions(board, maxSolutions = 2) {
        const workingBoard = board.map(row => [...row]);
        this.solutionCount = 0;
        this.solveWithCount(workingBoard, maxSolutions);
        return this.solutionCount;
    }

    // Resuelve contando soluciones
    solveWithCount(board, maxSolutions) {
        if (this.solutionCount >= maxSolutions) return;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (sudokuGame.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            this.solveWithCount(board, maxSolutions);
                            board[row][col] = 0;
                        }
                    }
                    return;
                }
            }
        }
        this.solutionCount++;
    }
}

// Exporta utilidades globales
window.SudokuGenerator = SudokuGenerator;
window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;