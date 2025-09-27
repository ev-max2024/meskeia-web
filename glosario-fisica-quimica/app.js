class GlosarioApp {
    constructor() {
        this.terminos = glosarioData;
        this.terminosFiltrados = [...this.terminos];
        this.modoActual = 'glosario';
        this.quizActual = null;
        this.gamification = new GamificationSystem();
        this.quizStartTime = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTerminos();
        this.updateGameUI();
    }

    setupEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => this.buscarTerminos());
        document.getElementById('searchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.buscarTerminos();
        });

        document.getElementById('categoryFilter').addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('levelFilter').addEventListener('change', () => this.aplicarFiltros());

        document.getElementById('glossaryBtn').addEventListener('click', () => this.cambiarModo('glosario'));
        document.getElementById('quizBtn').addEventListener('click', () => this.cambiarModo('quiz'));
        document.getElementById('profileBtn').addEventListener('click', () => this.cambiarModo('profile'));

        document.getElementById('startQuizBtn').addEventListener('click', () => this.iniciarQuiz());
        document.getElementById('resetProgressBtn').addEventListener('click', () => this.resetearProgreso());

        document.querySelector('.close-modal').addEventListener('click', () => this.cerrarModal());

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('termModal');
            if (e.target === modal) this.cerrarModal();
        });
    }

    buscarTerminos() {
        const busqueda = document.getElementById('searchInput').value.toLowerCase().trim();

        if (busqueda === '') {
            this.terminosFiltrados = [...this.terminos];
        } else {
            this.terminosFiltrados = this.terminos.filter(termino =>
                termino.termino.toLowerCase().includes(busqueda) ||
                termino.definicionCorta.toLowerCase().includes(busqueda) ||
                termino.relacionados.some(rel => rel.toLowerCase().includes(busqueda))
            );
        }

        this.aplicarFiltros();
    }

    aplicarFiltros() {
        const categoria = document.getElementById('categoryFilter').value;
        const nivel = document.getElementById('levelFilter').value;
        const busqueda = document.getElementById('searchInput').value.toLowerCase().trim();

        this.terminosFiltrados = this.terminos.filter(termino => {
            let cumpleFiltros = true;

            if (busqueda) {
                cumpleFiltros = termino.termino.toLowerCase().includes(busqueda) ||
                               termino.definicionCorta.toLowerCase().includes(busqueda) ||
                               termino.relacionados.some(rel => rel.toLowerCase().includes(busqueda));
            }

            if (categoria !== 'todos' && cumpleFiltros) {
                cumpleFiltros = termino.categoria === categoria;
            }

            if (nivel !== 'todos' && cumpleFiltros) {
                cumpleFiltros = termino.nivel === nivel;
            }

            return cumpleFiltros;
        });

        this.renderTerminos();
    }

    renderTerminos() {
        const container = document.getElementById('termsContainer');
        const countSpan = document.getElementById('termCount');

        if (this.terminosFiltrados.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="color: var(--text-light); font-size: 1.1rem;">
                        No se encontraron términos que coincidan con tu búsqueda.
                    </p>
                </div>
            `;
            countSpan.textContent = '0 términos encontrados';
            return;
        }

        container.innerHTML = this.terminosFiltrados.map(termino => `
            <div class="term-card" onclick="app.mostrarDetalle(${termino.id})">
                <h3 class="term-title">${termino.termino}</h3>
                <div>
                    <span class="term-category">${this.formatCategoria(termino.categoria)}</span>
                    <span class="term-level level-${termino.nivel}">${this.formatNivel(termino.nivel)}</span>
                </div>
                <p class="term-description">${termino.definicionCorta}</p>
            </div>
        `).join('');

        countSpan.textContent = `${this.terminosFiltrados.length} términos encontrados`;
    }

    mostrarDetalle(id) {
        const termino = this.terminos.find(t => t.id === id);
        if (!termino) return;

        const modal = document.getElementById('termModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = termino.termino;

        body.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <span class="term-category">${this.formatCategoria(termino.categoria)}</span>
                <span class="term-level level-${termino.nivel}">${this.formatNivel(termino.nivel)}</span>
            </div>

            <h4 style="color: var(--primary); margin: 1rem 0 0.5rem;">Definición</h4>
            <p>${termino.definicionCompleta}</p>

            ${termino.formula ? `
                <div class="term-formula">
                    <strong>Fórmula:</strong> ${termino.formula}
                </div>
            ` : ''}

            ${termino.ejemplo ? `
                <div class="term-example">
                    <strong>Ejemplo:</strong> ${termino.ejemplo}
                </div>
            ` : ''}

            ${termino.relacionados.length > 0 ? `
                <h4 style="color: var(--primary); margin: 1.5rem 0 0.5rem;">Términos relacionados</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${termino.relacionados.map(rel => `
                        <span style="padding: 0.25rem 0.75rem; background: var(--primary-light);
                                   color: var(--primary-dark); border-radius: 20px; font-size: 0.9rem;">
                            ${rel}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
        `;

        modal.classList.add('active');
    }

    cerrarModal() {
        document.getElementById('termModal').classList.remove('active');
    }

    cambiarModo(modo) {
        this.modoActual = modo;

        document.getElementById('glossaryBtn').classList.toggle('btn-active', modo === 'glosario');
        document.getElementById('quizBtn').classList.toggle('btn-active', modo === 'quiz');
        document.getElementById('profileBtn').classList.toggle('btn-active', modo === 'profile');

        document.getElementById('glossaryView').classList.toggle('active', modo === 'glosario');
        document.getElementById('quizView').classList.toggle('active', modo === 'quiz');
        document.getElementById('profileView').classList.toggle('active', modo === 'profile');

        if (modo === 'quiz') {
            this.resetQuiz();
        } else if (modo === 'profile') {
            this.updateProfileView();
        }
    }

    iniciarQuiz() {
        this.quizStartTime = Date.now();
        const categoria = document.getElementById('categoryFilter').value;
        const nivel = document.getElementById('levelFilter').value;

        let preguntasDisponibles = this.terminos;

        if (categoria !== 'todos') {
            preguntasDisponibles = preguntasDisponibles.filter(t => t.categoria === categoria);
        }

        if (nivel !== 'todos') {
            preguntasDisponibles = preguntasDisponibles.filter(t => t.nivel === nivel);
        }

        if (preguntasDisponibles.length < 10) {
            alert('No hay suficientes términos con los filtros seleccionados. Se usarán todos los términos.');
            preguntasDisponibles = this.terminos;
        }

        const preguntasAleatorias = this.shuffleArray([...preguntasDisponibles]).slice(0, 10);

        this.quizActual = {
            preguntas: preguntasAleatorias.map(termino => this.generarPregunta(termino)),
            preguntaActual: 0,
            puntuacion: 0,
            respuestas: []
        };

        this.mostrarPregunta();
    }

    generarPregunta(termino) {
        const tiposPregunta = [
            {
                tipo: 'definicion',
                pregunta: `¿Qué es ${termino.termino}?`,
                respuestaCorrecta: termino.definicionCorta,
                generarOpciones: () => {
                    const opciones = [termino.definicionCorta];
                    const otrasDefiniciones = this.terminos
                        .filter(t => t.id !== termino.id && t.categoria === termino.categoria)
                        .map(t => t.definicionCorta)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3);

                    opciones.push(...otrasDefiniciones);

                    while (opciones.length < 4) {
                        const otroTermino = this.terminos[Math.floor(Math.random() * this.terminos.length)];
                        if (!opciones.includes(otroTermino.definicionCorta)) {
                            opciones.push(otroTermino.definicionCorta);
                        }
                    }

                    return this.shuffleArray(opciones);
                }
            },
            {
                tipo: 'categoria',
                pregunta: `¿A qué categoría pertenece el término "${termino.termino}"?`,
                respuestaCorrecta: this.formatCategoria(termino.categoria),
                generarOpciones: () => ['Física', 'Química']
            },
            {
                tipo: 'nivel',
                pregunta: `¿Qué nivel de dificultad tiene el término "${termino.termino}"?`,
                respuestaCorrecta: this.formatNivel(termino.nivel),
                generarOpciones: () => ['Básico', 'Intermedio', 'Avanzado']
            }
        ];

        const tipoPregunta = tiposPregunta[Math.floor(Math.random() * tiposPregunta.length)];

        return {
            pregunta: tipoPregunta.pregunta,
            opciones: tipoPregunta.generarOpciones(),
            respuestaCorrecta: tipoPregunta.respuestaCorrecta,
            termino: termino.termino
        };
    }

    mostrarPregunta() {
        const pregunta = this.quizActual.preguntas[this.quizActual.preguntaActual];
        const container = document.getElementById('quizContent');

        document.getElementById('questionNumber').textContent = this.quizActual.preguntaActual + 1;
        document.getElementById('score').textContent = this.quizActual.puntuacion;

        container.innerHTML = `
            <div class="quiz-question">
                <h3>${pregunta.pregunta}</h3>
                <div class="quiz-options">
                    ${pregunta.opciones.map((opcion, index) => `
                        <button class="quiz-option" data-option="${index}"
                                onclick="app.seleccionarRespuesta(${index})">
                            ${opcion}
                        </button>
                    `).join('')}
                </div>
                <div id="quizFeedback"></div>
                <div class="quiz-navigation">
                    <button id="nextQuestionBtn" class="btn btn-primary"
                            style="display: none;" onclick="app.siguientePregunta()">
                        Siguiente pregunta →
                    </button>
                </div>
            </div>
        `;
    }

    seleccionarRespuesta(index) {
        if (this.quizActual.respuestas[this.quizActual.preguntaActual] !== undefined) {
            return;
        }

        const pregunta = this.quizActual.preguntas[this.quizActual.preguntaActual];
        const opciones = document.querySelectorAll('.quiz-option');
        const respuestaElegida = pregunta.opciones[index];
        const esCorrecta = respuestaElegida === pregunta.respuestaCorrecta;

        this.quizActual.respuestas[this.quizActual.preguntaActual] = {
            elegida: respuestaElegida,
            correcta: esCorrecta
        };

        if (esCorrecta) {
            this.quizActual.puntuacion++;
            document.getElementById('score').textContent = this.quizActual.puntuacion;
        }

        opciones.forEach((opcion, i) => {
            opcion.disabled = true;
            if (i === index) {
                opcion.classList.add(esCorrecta ? 'correct' : 'incorrect');
            }
            if (pregunta.opciones[i] === pregunta.respuestaCorrecta) {
                opcion.classList.add('correct');
            }
        });

        const feedback = document.getElementById('quizFeedback');
        feedback.innerHTML = `
            <div class="quiz-feedback ${esCorrecta ? 'correct' : 'incorrect'}">
                ${esCorrecta ? '¡Correcto! 🎉' : `Incorrecto. La respuesta correcta es: "${pregunta.respuestaCorrecta}"`}
            </div>
        `;

        document.getElementById('nextQuestionBtn').style.display = 'block';
    }

    siguientePregunta() {
        this.quizActual.preguntaActual++;

        if (this.quizActual.preguntaActual < this.quizActual.preguntas.length) {
            this.mostrarPregunta();
        } else {
            this.mostrarResultados();
        }
    }

    mostrarResultados() {
        const container = document.getElementById('quizContent');
        const puntuacion = this.quizActual.puntuacion;
        const total = this.quizActual.preguntas.length;
        const porcentaje = Math.round((puntuacion / total) * 100);

        // Calcular tiempo transcurrido
        const timeElapsed = this.quizStartTime ? (Date.now() - this.quizStartTime) / 1000 : null;

        // Procesar resultados con gamificación
        const gameResults = this.gamification.addQuizResult(
            this.quizActual.preguntas,
            this.quizActual.respuestas,
            timeElapsed
        );

        let mensaje = '';
        if (porcentaje >= 90) {
            mensaje = '¡Excelente! Dominas estos conceptos 🏆';
        } else if (porcentaje >= 70) {
            mensaje = '¡Muy bien! Buen conocimiento del tema 👍';
        } else if (porcentaje >= 50) {
            mensaje = 'Bien, pero puedes mejorar 📚';
        } else {
            mensaje = 'Sigue practicando, ¡lo harás mejor! 💪';
        }

        // Mostrar notificaciones de gamificación
        if (gameResults.levelUp) {
            this.showNotification(`¡Subiste al ${gameResults.currentLevel.name}!`, 'level-up');
        }

        if (gameResults.newBadges.length > 0) {
            gameResults.newBadges.forEach(badge => {
                this.showNotification(`¡Badge desbloqueado: ${badge.name}!`, 'badge');
            });
        }

        // Actualizar UI de gamificación
        this.updateGameUI();

        container.innerHTML = `
            <div class="quiz-results-enhanced">
                <h3>¡Quiz completado!</h3>
                <div class="score-display">${puntuacion}/${total}</div>
                <div class="score-message">${mensaje}</div>
                <p style="color: var(--text-light); margin-bottom: 1rem;">
                    Has acertado ${puntuacion} de ${total} preguntas (${porcentaje}%)
                </p>

                <div class="xp-gained">
                    <h4>🎯 Experiencia Ganada</h4>
                    <p><strong>+${gameResults.xpGained} XP</strong></p>
                    ${timeElapsed && timeElapsed < 120 ? '<p><small>🚀 +20 XP por velocidad</small></p>' : ''}
                    ${gameResults.correctCount === 10 ? '<p><small>🏆 +50 XP por quiz perfecto</small></p>' : ''}
                </div>

                ${gameResults.levelUp ? `
                    <div class="level-up-animation">
                        <h4 style="color: var(--secondary);">🎊 ¡SUBISTE DE NIVEL!</h4>
                        <p>Ahora eres <strong>${gameResults.currentLevel.name}</strong></p>
                    </div>
                ` : ''}

                <button class="btn btn-primary btn-large" onclick="app.resetQuiz()">
                    Nuevo Quiz
                </button>
                <button class="btn" onclick="app.cambiarModo('profile')" style="margin-left: 1rem;">
                    Ver Perfil
                </button>
            </div>
        `;
    }

    resetQuiz() {
        this.quizActual = null;
        const container = document.getElementById('quizContent');
        container.innerHTML = `
            <div class="quiz-welcome">
                <h3>¡Pon a prueba tus conocimientos!</h3>
                <p>Responde 10 preguntas aleatorias sobre los términos del glosario.</p>
                <button id="startQuizBtn" class="btn btn-primary btn-large" onclick="app.iniciarQuiz()">
                    Comenzar Quiz
                </button>
            </div>
        `;
        document.getElementById('questionNumber').textContent = '1';
        document.getElementById('score').textContent = '0';
    }

    formatCategoria(categoria) {
        return categoria === 'fisica' ? 'Física' : 'Química';
    }

    formatNivel(nivel) {
        const niveles = {
            'basico': 'Básico',
            'intermedio': 'Intermedio',
            'avanzado': 'Avanzado'
        };
        return niveles[nivel] || nivel;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateGameUI() {
        const stats = this.gamification.getPlayerStats();

        // Actualizar indicadores en quiz
        document.getElementById('playerLevel').textContent = `${stats.level.name} (Nv.${stats.level.level})`;
        document.getElementById('playerXP').textContent = `${stats.xp} XP`;
    }

    updateProfileView() {
        const stats = this.gamification.getPlayerStats();

        // Información del nivel
        document.getElementById('profileLevelName').textContent = stats.level.name;
        document.getElementById('profileLevelNumber').textContent = `Nivel ${stats.level.level}`;
        document.getElementById('profileXP').textContent = `${stats.xp} XP`;

        // Barra de progreso
        const progressBar = document.getElementById('xpProgress');
        progressBar.style.width = `${stats.progress}%`;

        // Siguiente nivel
        const nextLevelSpan = document.getElementById('nextLevelXP');
        if (stats.nextLevel) {
            nextLevelSpan.textContent = `Siguiente: ${stats.nextLevel.name} (${stats.nextLevel.minXP} XP)`;
        } else {
            nextLevelSpan.textContent = '¡Nivel máximo alcanzado!';
        }

        // Estadísticas generales
        document.getElementById('totalQuestions').textContent = stats.totalQuestions;
        document.getElementById('correctAnswers').textContent = stats.correctAnswers;
        document.getElementById('accuracy').textContent = `${stats.accuracy}%`;
        document.getElementById('streakDays').textContent = stats.streakDays;

        // Estadísticas por categoría
        const fisicaAcc = stats.categoryStats.fisica.questions > 0 ?
            Math.round((stats.categoryStats.fisica.correct / stats.categoryStats.fisica.questions) * 100) : 0;
        const quimicaAcc = stats.categoryStats.quimica.questions > 0 ?
            Math.round((stats.categoryStats.quimica.correct / stats.categoryStats.quimica.questions) * 100) : 0;

        document.getElementById('physicaQuestions').textContent = stats.categoryStats.fisica.questions;
        document.getElementById('physicaCorrect').textContent = stats.categoryStats.fisica.correct;
        document.getElementById('physicaAccuracy').textContent = `${fisicaAcc}%`;

        document.getElementById('quimicaQuestions').textContent = stats.categoryStats.quimica.questions;
        document.getElementById('quimicaCorrect').textContent = stats.categoryStats.quimica.correct;
        document.getElementById('quimicaAccuracy').textContent = `${quimicaAcc}%`;

        // Estadísticas por nivel
        const basicoAcc = stats.levelStats.basico.questions > 0 ?
            Math.round((stats.levelStats.basico.correct / stats.levelStats.basico.questions) * 100) : 0;
        const intermedioAcc = stats.levelStats.intermedio.questions > 0 ?
            Math.round((stats.levelStats.intermedio.correct / stats.levelStats.intermedio.questions) * 100) : 0;
        const avanzadoAcc = stats.levelStats.avanzado.questions > 0 ?
            Math.round((stats.levelStats.avanzado.correct / stats.levelStats.avanzado.questions) * 100) : 0;

        document.getElementById('basicoQuestions').textContent = stats.levelStats.basico.questions;
        document.getElementById('basicoCorrect').textContent = stats.levelStats.basico.correct;
        document.getElementById('basicoAccuracy').textContent = `${basicoAcc}%`;

        document.getElementById('intermedioQuestions').textContent = stats.levelStats.intermedio.questions;
        document.getElementById('intermedioCorrect').textContent = stats.levelStats.intermedio.correct;
        document.getElementById('intermedioAccuracy').textContent = `${intermedioAcc}%`;

        document.getElementById('avanzadoQuestions').textContent = stats.levelStats.avanzado.questions;
        document.getElementById('avanzadoCorrect').textContent = stats.levelStats.avanzado.correct;
        document.getElementById('avanzadoAccuracy').textContent = `${avanzadoAcc}%`;

        // Badges
        this.renderBadges(stats.unlockedBadges);
    }

    renderBadges(badges) {
        const container = document.getElementById('badgesContainer');

        if (badges.length === 0) {
            container.innerHTML = `
                <div class="no-badges">
                    <p>¡Completa quizzes para desbloquear badges!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = badges.map(badge => `
            <div class="badge-card">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    resetearProgreso() {
        if (confirm('¿Estás seguro de que quieres resetear todo tu progreso? Esta acción no se puede deshacer.')) {
            this.gamification.resetProgress();
            this.updateGameUI();
            this.updateProfileView();
            this.showNotification('Progreso reseteado correctamente', 'success');
        }
    }
}

const app = new GlosarioApp();