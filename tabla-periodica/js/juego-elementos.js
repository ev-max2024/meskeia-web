/* =========================================
   JUEGO DE ELEMENTOS QUÍMICOS - meskeIA
   Sistema de juego para adivinar elementos
   ========================================= */

class JuegoElementos {
    constructor(tablaPeriodica) {
        this.tabla = tablaPeriodica;
        this.puntuacion = 0;
        this.racha = 0;
        this.nivel = 1;
        this.elementoActual = null;
        this.pistasReveladas = 0;
        this.juegoActivo = false;
        this.maxPistas = 5;

        this.cargarEstadisticas();
        this.configurarEventos();
    }

    configurarEventos() {
        document.getElementById('btn-responder').addEventListener('click', () => this.verificarRespuesta());
        document.getElementById('btn-pista').addEventListener('click', () => this.mostrarPista());
        document.getElementById('btn-saltar').addEventListener('click', () => this.saltarElemento());

        // Enter para responder
        document.getElementById('respuesta-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.verificarRespuesta();
            }
        });
    }

    iniciarJuego() {
        this.juegoActivo = true;
        this.siguienteElemento();
        this.actualizarUI();
    }

    siguienteElemento() {
        this.elementoActual = this.tabla.obtenerElementoAleatorio();
        this.pistasReveladas = 0;
        this.mostrarPistas();
        this.limpiarRespuesta();
        this.tabla.resaltarElemento(this.elementoActual.numero);
    }

    mostrarPistas() {
        const contenedorPistas = document.getElementById('pistas-elemento');
        contenedorPistas.innerHTML = '';

        const todasLasPistas = this.generarPistas(this.elementoActual);
        const pistasAMostrar = todasLasPistas.slice(0, Math.min(this.pistasReveladas + 1, this.maxPistas));

        pistasAMostrar.forEach((pista, index) => {
            const pistaDiv = document.createElement('div');
            pistaDiv.className = 'pista';
            pistaDiv.innerHTML = `<strong>Pista ${index + 1}:</strong> ${pista}`;
            contenedorPistas.appendChild(pistaDiv);
        });

        // Actualizar contador de pistas
        const btnPista = document.getElementById('btn-pista');
        if (this.pistasReveladas >= this.maxPistas - 1) {
            btnPista.disabled = true;
            btnPista.textContent = '💡 Sin más pistas';
        } else {
            btnPista.disabled = false;
            btnPista.textContent = `💡 Más Pista (${this.pistasReveladas + 1}/${this.maxPistas})`;
        }
    }

    generarPistas(elemento) {
        const pistas = [];

        // Pista 1: Familia y estado
        pistas.push(`Es un ${this.tabla.formatearFamilia(elemento.familia).toLowerCase()} en estado ${this.tabla.formatearEstado(elemento.estado).toLowerCase()}.`);

        // Pista 2: Período y grupo
        pistas.push(`Se encuentra en el período ${elemento.periodo} y grupo ${elemento.grupo} de la tabla periódica.`);

        // Pista 3: Masa atómica aproximada
        const masaRedondeada = Math.round(elemento.masa);
        pistas.push(`Su masa atómica es aproximadamente ${masaRedondeada} u.`);

        // Pista 4: Uso principal
        if (elemento.usos && elemento.usos.length > 0) {
            const usoAleatorio = elemento.usos[Math.floor(Math.random() * elemento.usos.length)];
            pistas.push(`Se utiliza principalmente en: ${usoAleatorio.toLowerCase()}.`);
        }

        // Pista 5: Dato específico
        if (elemento.radioAtomico) {
            pistas.push(`Su radio atómico es ${elemento.radioAtomico} picómetros.`);
        } else if (elemento.electronegatividad) {
            pistas.push(`Su electronegatividad es ${elemento.electronegatividad}.`);
        } else {
            pistas.push(`${elemento.datoCurioso}`);
        }

        // Pista extra: Primera letra del símbolo
        if (pistas.length < this.maxPistas) {
            pistas.push(`Su símbolo químico comienza con la letra "${elemento.simbolo[0]}".`);
        }

        return pistas;
    }

    mostrarPista() {
        if (this.pistasReveladas < this.maxPistas - 1) {
            this.pistasReveladas++;
            this.mostrarPistas();

            // Reducir puntos por pista extra
            const penalizacion = 5;
            this.mostrarMensaje(`Pista adicional revelada. -${penalizacion} puntos.`, 'info');
        }
    }

    verificarRespuesta() {
        const respuesta = document.getElementById('respuesta-input').value.trim().toLowerCase();

        if (!respuesta) {
            this.mostrarMensaje('Por favor, escribe una respuesta.', 'advertencia');
            return;
        }

        const esCorrecta = this.esRespuestaCorrecta(respuesta);

        if (esCorrecta) {
            this.respuestaCorrecta();
        } else {
            this.respuestaIncorrecta();
        }
    }

    esRespuestaCorrecta(respuesta) {
        const elemento = this.elementoActual;
        return respuesta === elemento.nombre.toLowerCase() ||
               respuesta === elemento.simbolo.toLowerCase();
    }

    respuestaCorrecta() {
        this.racha++;

        // Calcular puntos base
        let puntos = 100;

        // Bonus por racha
        if (this.racha >= 5) puntos += 50;
        else if (this.racha >= 3) puntos += 25;

        // Bonus por nivel
        puntos += (this.nivel - 1) * 10;

        // Penalización por pistas extra
        puntos -= this.pistasReveladas * 5;

        // Bonus por pocas pistas
        if (this.pistasReveladas === 0) puntos += 25;

        this.puntuacion += Math.max(puntos, 10); // Mínimo 10 puntos

        this.tabla.resaltarElemento(this.elementoActual.numero, 'correcto');
        this.mostrarResultado(true, puntos);

        // Verificar subida de nivel
        this.verificarNivel();

        setTimeout(() => {
            this.tabla.quitarResaltado(this.elementoActual.numero, 'correcto');
            this.siguienteElemento();
        }, 2000);
    }

    respuestaIncorrecta() {
        this.racha = 0;
        this.tabla.resaltarElemento(this.elementoActual.numero, 'incorrecto');
        this.mostrarResultado(false);

        setTimeout(() => {
            this.tabla.quitarResaltado(this.elementoActual.numero, 'incorrecto');
            this.siguienteElemento();
        }, 3000);
    }

    saltarElemento() {
        this.racha = 0;
        this.mostrarResultado(false, 0, true);

        setTimeout(() => {
            this.siguienteElemento();
        }, 2000);
    }

    mostrarResultado(correcto, puntos = 0, saltado = false) {
        const contenedor = document.getElementById('resultado-container');
        contenedor.style.display = 'block';

        let mensaje, clase;

        if (saltado) {
            mensaje = `Elemento saltado: ${this.elementoActual.nombre} (${this.elementoActual.simbolo})`;
            clase = 'resultado-incorrecto';
        } else if (correcto) {
            mensaje = `¡Correcto! ${this.elementoActual.nombre} (${this.elementoActual.simbolo})<br>+${puntos} puntos`;
            clase = 'resultado-correcto';
        } else {
            mensaje = `Incorrecto. Era: ${this.elementoActual.nombre} (${this.elementoActual.simbolo})`;
            clase = 'resultado-incorrecto';
        }

        contenedor.innerHTML = mensaje;
        contenedor.className = `resultado-container ${clase}`;

        setTimeout(() => {
            contenedor.style.display = 'none';
        }, saltado ? 2000 : (correcto ? 2000 : 3000));
    }

    verificarNivel() {
        const puntosParaNivel = this.nivel * 500;
        if (this.puntuacion >= puntosParaNivel) {
            this.nivel++;
            this.mostrarMensaje(`¡Nivel ${this.nivel} alcanzado!`, 'exito');
        }
    }

    mostrarMensaje(texto, tipo) {
        // Crear y mostrar mensaje temporal
        const mensaje = document.createElement('div');
        mensaje.className = `mensaje-juego ${tipo}`;
        mensaje.textContent = texto;
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1001;
            transition: opacity 0.3s ease;
        `;

        switch(tipo) {
            case 'exito': mensaje.style.backgroundColor = '#27AE60'; break;
            case 'info': mensaje.style.backgroundColor = '#3498DB'; break;
            case 'advertencia': mensaje.style.backgroundColor = '#F39C12'; break;
            default: mensaje.style.backgroundColor = '#E74C3C';
        }

        document.body.appendChild(mensaje);

        setTimeout(() => {
            mensaje.style.opacity = '0';
            setTimeout(() => mensaje.remove(), 300);
        }, 2000);
    }

    limpiarRespuesta() {
        document.getElementById('respuesta-input').value = '';
        document.getElementById('respuesta-input').focus();
    }

    actualizarUI() {
        document.getElementById('puntuacion').textContent = this.puntuacion;
        document.getElementById('racha').textContent = this.racha;
        document.getElementById('nivel').textContent = this.nivel;
    }

    guardarEstadisticas() {
        const estadisticas = {
            puntuacion: this.puntuacion,
            nivel: this.nivel,
            mejorRacha: Math.max(this.racha, this.cargarMejorRacha()),
            partidasJugadas: this.cargarPartidasJugadas() + 1,
            fechaUltimaPartida: new Date().toISOString()
        };

        localStorage.setItem('tablaPeriodicaJuego', JSON.stringify(estadisticas));
    }

    cargarEstadisticas() {
        const datos = localStorage.getItem('tablaPeriodicaJuego');
        if (datos) {
            const estadisticas = JSON.parse(datos);
            this.puntuacion = estadisticas.puntuacion || 0;
            this.nivel = estadisticas.nivel || 1;
        }
    }

    cargarMejorRacha() {
        const datos = localStorage.getItem('tablaPeriodicaJuego');
        return datos ? (JSON.parse(datos).mejorRacha || 0) : 0;
    }

    cargarPartidasJugadas() {
        const datos = localStorage.getItem('tablaPeriodicaJuego');
        return datos ? (JSON.parse(datos).partidasJugadas || 0) : 0;
    }

    reiniciarJuego() {
        this.puntuacion = 0;
        this.racha = 0;
        this.nivel = 1;
        this.pistasReveladas = 0;
        this.actualizarUI();

        if (this.juegoActivo) {
            this.siguienteElemento();
        }
    }

    pausarJuego() {
        this.juegoActivo = false;
        this.guardarEstadisticas();
    }

    obtenerEstadisticas() {
        return {
            puntuacionActual: this.puntuacion,
            rachaActual: this.racha,
            nivelActual: this.nivel,
            mejorRacha: this.cargarMejorRacha(),
            partidasJugadas: this.cargarPartidasJugadas(),
            promedioRacha: this.cargarPartidasJugadas() > 0 ? this.cargarMejorRacha() / this.cargarPartidasJugadas() : 0
        };
    }

    // Métodos de dificultad
    configurarDificultad(dificultad) {
        switch(dificultad) {
            case 'facil':
                this.maxPistas = 6;
                break;
            case 'medio':
                this.maxPistas = 4;
                break;
            case 'dificil':
                this.maxPistas = 3;
                break;
            case 'extremo':
                this.maxPistas = 2;
                break;
        }
    }
}