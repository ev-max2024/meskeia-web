# Glosario Interactivo de Física y Química | meskeIA

Aplicación web educativa que combina un glosario de términos científicos con un sistema de quizzes interactivos para reforzar el aprendizaje de Física y Química.

## 🚀 Características

- **25 términos científicos** organizados por categoría (Física/Química) y nivel de dificultad
- **Búsqueda inteligente** por término, definición o términos relacionados
- **Filtros avanzados** por categoría y nivel (Básico, Intermedio, Avanzado)
- **Sistema de quizzes** con 10 preguntas aleatorias y puntuación
- **Diseño responsivo** adaptado para móviles y desktop
- **PWA (Progressive Web App)** con soporte offline
- **Paleta meskeIA** con diseño minimalista

## 🎯 Modo Glosario

- Visualización en tarjetas de todos los términos
- Modal con información detallada (definición completa, fórmulas, ejemplos)
- Términos relacionados para facilitar la navegación
- Contador dinámico de resultados

## 🧠 Modo Quiz

- 10 preguntas aleatorias basadas en los filtros seleccionados
- Tipos de pregunta: definición, categoría y nivel de dificultad
- Feedback inmediato con la respuesta correcta
- Puntuación final con mensaje motivacional
- Reinicio automático para nueva ronda

## 📊 Base de Datos

La aplicación incluye términos fundamentales como:
- **Física**: Velocidad, Fuerza, Energía, Onda, Momentum, Campo eléctrico...
- **Química**: Átomo, Molécula, pH, Enlace químico, Reacción química, Catalizador...

Cada término contiene:
- Definición corta y completa
- Categoría (Física/Química)
- Nivel de dificultad
- Fórmulas matemáticas (cuando aplica)
- Ejemplos prácticos
- Términos relacionados

## 🛠️ Instalación y Uso

### Inicio Rápido
```bash
# Ejecutar directamente
start.bat

# O abrir manualmente
start index.html
```

### Estructura del Proyecto
```
glosario-interactivo/
├── index.html          # Página principal
├── styles.css          # Estilos con paleta meskeIA
├── app.js              # Lógica de la aplicación
├── data.js             # Base de datos de términos
├── manifest.json       # Configuración PWA
├── service-worker.js   # Caché offline
├── favicon.svg         # Icono de la aplicación
├── start.bat           # Script de inicio (Windows)
└── README.md           # Documentación
```

## 🎨 Diseño

- **Colores principales**: Violeta #9b87f5 y amarillo #ffd66e
- **Tipografía**: Sistema de fuentes nativo (-apple-system, Segoe UI)
- **Componentes**: Tarjetas, modales, botones con hover effects
- **Responsive**: Grid adaptativo y navegación mobile-first

## 📱 PWA Features

- Instalable como aplicación nativa
- Funciona offline después de la primera carga
- Manifest.json con iconos optimizados
- Service Worker para cache estratégico

## 🔧 Tecnologías

- **Frontend**: HTML5, CSS3 con Custom Properties, JavaScript Vanilla
- **Arquitectura**: SPA (Single Page Application) con clases ES6
- **Almacenamiento**: Datos estáticos en JSON (no requiere servidor)
- **PWA**: Service Worker + Web App Manifest

## 🎯 Casos de Uso

### Estudiantes
- Repasar conceptos antes de exámenes
- Practicar con quizzes por temas específicos
- Consultar definiciones rápidas

### Profesores
- Material de apoyo para clases
- Evaluaciones rápidas en clase
- Referencia de términos técnicos

### Autodidactas
- Aprendizaje progresivo por niveles
- Refuerzo de conocimientos científicos
- Consulta offline disponible

## 🚀 Integración Web meskeIA

Esta aplicación está diseñada para integrarse fácilmente en la plataforma Web meskeIA:

- **URL sugerida**: `/fisica-quimica/glosario/`
- **Categoría**: Física y Química
- **Descripción**: "Glosario interactivo con quizzes educativos"
- **Tags**: educación, física, química, quiz, glosario

## 📈 Posibles Mejoras

- [ ] Más términos (objetivo: 100+ términos)
- [ ] Sistema de favoritos con localStorage
- [ ] Exportación de resultados de quiz
- [ ] Modo estudio con repetición espaciada
- [ ] Integración con API de fórmulas matemáticas
- [ ] Animaciones y efectos visuales
- [ ] Modo oscuro
- [ ] Soporte multiidioma

## 📄 Licencia

Aplicación gratuita desarrollada por meskeIA para fines educativos.

---

**© 2025 meskeIA** - Herramientas educativas gratuitas