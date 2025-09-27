class GamificationSystem {
    constructor() {
        this.playerData = this.loadPlayerData();
        this.achievements = this.defineAchievements();
        this.levels = this.defineLevels();
        this.badges = this.defineBadges();
    }

    loadPlayerData() {
        const defaultData = {
            xp: 0,
            level: 1,
            totalQuestions: 0,
            correctAnswers: 0,
            streakDays: 0,
            lastPlayDate: null,
            categoryStats: {
                fisica: { questions: 0, correct: 0 },
                quimica: { questions: 0, correct: 0 }
            },
            levelStats: {
                basico: { questions: 0, correct: 0 },
                intermedio: { questions: 0, correct: 0 },
                avanzado: { questions: 0, correct: 0 }
            },
            unlockedBadges: [],
            achievements: []
        };

        const saved = localStorage.getItem('glosario_player_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    savePlayerData() {
        localStorage.setItem('glosario_player_data', JSON.stringify(this.playerData));
    }

    defineLevels() {
        return [
            { level: 1, name: "Novato", minXP: 0, color: "#7ec699" },
            { level: 2, name: "Aprendiz", minXP: 100, color: "#74c0fc" },
            { level: 3, name: "Estudiante", minXP: 300, color: "#ffa94d" },
            { level: 4, name: "Científico Junior", minXP: 600, color: "#9b87f5" },
            { level: 5, name: "Investigador", minXP: 1000, color: "#ff6b6b" },
            { level: 6, name: "Experto", minXP: 1500, color: "#d6336c" },
            { level: 7, name: "Maestro", minXP: 2200, color: "#495057" },
            { level: 8, name: "Genio", minXP: 3000, color: "#ffd43b" }
        ];
    }

    defineBadges() {
        return {
            firstSteps: {
                name: "Primeros Pasos",
                description: "Completa tu primer quiz",
                icon: "🎯",
                condition: (data) => data.totalQuestions >= 10
            },
            physicsMaster: {
                name: "Maestro de la Física",
                description: "Responde 50 preguntas de Física correctamente",
                icon: "⚛️",
                condition: (data) => data.categoryStats.fisica.correct >= 50
            },
            chemistryExpert: {
                name: "Experto en Química",
                description: "Responde 50 preguntas de Química correctamente",
                icon: "🧪",
                condition: (data) => data.categoryStats.quimica.correct >= 50
            },
            perfectQuiz: {
                name: "Quiz Perfecto",
                description: "Obtén 10/10 en un quiz",
                icon: "🏆",
                condition: () => false // Se activa manualmente
            },
            dedicated: {
                name: "Dedicado",
                description: "Estudia 7 días consecutivos",
                icon: "📚",
                condition: (data) => data.streakDays >= 7
            },
            speedster: {
                name: "Velocista",
                description: "Responde 100 preguntas en total",
                icon: "⚡",
                condition: (data) => data.totalQuestions >= 100
            },
            basicMaster: {
                name: "Dominio Básico",
                description: "90% de aciertos en nivel Básico (mín. 20 preguntas)",
                icon: "🟢",
                condition: (data) => {
                    const stats = data.levelStats.basico;
                    return stats.questions >= 20 && (stats.correct / stats.questions) >= 0.9;
                }
            },
            intermediateMaster: {
                name: "Dominio Intermedio",
                description: "85% de aciertos en nivel Intermedio (mín. 30 preguntas)",
                icon: "🟡",
                condition: (data) => {
                    const stats = data.levelStats.intermedio;
                    return stats.questions >= 30 && (stats.correct / stats.questions) >= 0.85;
                }
            },
            advancedMaster: {
                name: "Dominio Avanzado",
                description: "80% de aciertos en nivel Avanzado (mín. 20 preguntas)",
                icon: "🔴",
                condition: (data) => {
                    const stats = data.levelStats.avanzado;
                    return stats.questions >= 20 && (stats.correct / stats.questions) >= 0.8;
                }
            },
            scholar: {
                name: "Erudito",
                description: "Alcanza el nivel Científico Junior",
                icon: "🎓",
                condition: (data) => data.level >= 4
            }
        };
    }

    defineAchievements() {
        return [
            {
                id: 'first_quiz',
                name: 'Primera Vez',
                description: 'Completa tu primer quiz',
                xp: 10,
                condition: (data) => data.totalQuestions >= 10
            },
            {
                id: 'accuracy_50',
                name: 'Precisión',
                description: 'Mantén 70% de precisión con al menos 50 preguntas',
                xp: 50,
                condition: (data) => data.totalQuestions >= 50 && (data.correctAnswers / data.totalQuestions) >= 0.7
            },
            {
                id: 'marathon',
                name: 'Maratón',
                description: 'Responde 200 preguntas en total',
                xp: 100,
                condition: (data) => data.totalQuestions >= 200
            }
        ];
    }

    addQuizResult(questions, answers, timeElapsed) {
        // Actualizar fecha de última sesión y streak
        this.updateStreak();

        // Calcular estadísticas del quiz
        let correctCount = 0;
        let xpGained = 0;

        questions.forEach((question, index) => {
            this.playerData.totalQuestions++;

            const termino = glosarioData.find(t => t.termino === question.termino);
            if (!termino) return;

            // Actualizar estadísticas por categoría
            this.playerData.categoryStats[termino.categoria].questions++;

            // Actualizar estadísticas por nivel
            this.playerData.levelStats[termino.nivel].questions++;

            if (answers[index] && answers[index].correcta) {
                correctCount++;
                this.playerData.correctAnswers++;
                this.playerData.categoryStats[termino.categoria].correct++;
                this.playerData.levelStats[termino.nivel].correct++;

                // XP por acierto según nivel
                const xpValues = { basico: 10, intermedio: 15, avanzado: 25 };
                xpGained += xpValues[termino.nivel] || 10;
            }
        });

        // Bonus por quiz perfecto
        if (correctCount === 10) {
            xpGained += 50;
            this.unlockBadge('perfectQuiz');
        }

        // Bonus por tiempo (si termina en menos de 2 minutos)
        if (timeElapsed && timeElapsed < 120) {
            xpGained += 20;
        }

        this.playerData.xp += xpGained;
        this.updateLevel();
        this.checkAchievements();
        this.checkBadges();
        this.savePlayerData();

        return {
            correctCount,
            xpGained,
            levelUp: this.checkLevelUp(this.playerData.xp - xpGained),
            newBadges: this.getRecentBadges(),
            currentLevel: this.getCurrentLevel()
        };
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastPlay = this.playerData.lastPlayDate;

        if (!lastPlay) {
            this.playerData.streakDays = 1;
        } else {
            const lastDate = new Date(lastPlay);
            const todayDate = new Date(today);
            const diffTime = todayDate - lastDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                this.playerData.streakDays++;
            } else if (diffDays > 1) {
                this.playerData.streakDays = 1;
            }
            // Si diffDays === 0, ya jugó hoy, no cambiar streak
        }

        this.playerData.lastPlayDate = today;
    }

    updateLevel() {
        const newLevel = this.levels.findLast(level => this.playerData.xp >= level.minXP);
        this.playerData.level = newLevel ? newLevel.level : 1;
    }

    checkLevelUp(previousXP) {
        const previousLevel = this.levels.findLast(level => previousXP >= level.minXP);
        const currentLevel = this.getCurrentLevel();
        return previousLevel && currentLevel && previousLevel.level < currentLevel.level;
    }

    getCurrentLevel() {
        return this.levels.findLast(level => this.playerData.xp >= level.minXP) || this.levels[0];
    }

    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        return this.levels.find(level => level.level > currentLevel.level);
    }

    getProgressToNextLevel() {
        const current = this.getCurrentLevel();
        const next = this.getNextLevel();

        if (!next) return 100; // Nivel máximo alcanzado

        const currentLevelXP = current.minXP;
        const nextLevelXP = next.minXP;
        const playerXP = this.playerData.xp;

        return Math.round(((playerXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.playerData.achievements.includes(achievement.id) &&
                achievement.condition(this.playerData)) {
                this.playerData.achievements.push(achievement.id);
                this.playerData.xp += achievement.xp;
            }
        });
    }

    checkBadges() {
        Object.keys(this.badges).forEach(badgeId => {
            if (!this.playerData.unlockedBadges.includes(badgeId) &&
                this.badges[badgeId].condition(this.playerData)) {
                this.unlockBadge(badgeId);
            }
        });
    }

    unlockBadge(badgeId) {
        if (!this.playerData.unlockedBadges.includes(badgeId)) {
            this.playerData.unlockedBadges.push(badgeId);
        }
    }

    getRecentBadges() {
        // En una implementación real, mantendríamos un registro de badges recién desbloqueados
        return [];
    }

    getPlayerStats() {
        const accuracy = this.playerData.totalQuestions > 0 ?
            Math.round((this.playerData.correctAnswers / this.playerData.totalQuestions) * 100) : 0;

        return {
            level: this.getCurrentLevel(),
            nextLevel: this.getNextLevel(),
            xp: this.playerData.xp,
            progress: this.getProgressToNextLevel(),
            totalQuestions: this.playerData.totalQuestions,
            correctAnswers: this.playerData.correctAnswers,
            accuracy: accuracy,
            streakDays: this.playerData.streakDays,
            unlockedBadges: this.playerData.unlockedBadges.map(id => ({
                id,
                ...this.badges[id]
            })),
            categoryStats: this.playerData.categoryStats,
            levelStats: this.playerData.levelStats
        };
    }

    resetProgress() {
        localStorage.removeItem('glosario_player_data');
        this.playerData = this.loadPlayerData();
        return true;
    }
}