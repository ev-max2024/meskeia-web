# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Comandos Comunes

### Desarrollo local
```bash
# Abrir calculadora en navegador
start index.html

# Servidor web simple para testing
python -m http.server 8000
# Luego navegar a http://localhost:8000
```

### Testing y validación
```bash
# Validar HTML (si tienes html5validator instalado)
html5validator index.html

# Verificar JavaScript con ESLint (si está configurado)
eslint script.js
```

## Arquitectura del Proyecto

### Estructura de archivos
```
calculadora-simple/
├── index.html      # Estructura HTML principal con formulario de calculadora
├── styles.css      # Estilos CSS Grid, diseño responsivo y tema meskeIA
├── script.js       # Lógica JavaScript vanilla con historial y localStorage
└── README.md       # Documentación del usuario
```

### Tecnologías y Patrones

**Stack tecnológico:**
- HTML5 semántico con elementos accesibles
- CSS Grid para layout de botones (6 filas x 4 columnas)
- JavaScript ES6+ vanilla sin frameworks externos
- LocalStorage para persistencia del historial

**Patrones de diseño implementados:**
- **Estado centralizado**: Variables globales para display, operación y historial
- **Event delegation**: Single listener para todos los atajos de teclado
- **Rendering reactivo**: `updateDisplay()` y `renderHistory()` sincronizan UI
- **Persistencia**: Auto-save/load del historial en localStorage

### Arquitectura de Funcionalidades

**Core Calculator (script.js:1-117):**
- Variables de estado: `currentInput`, `previousInput`, `operation`, `shouldResetScreen`
- Funciones básicas: `appendNumber()`, `appendOperator()`, `calculate()`
- Manejo de errores: División por cero, validación de inputs

**Funciones Matemáticas Avanzadas (script.js:119-181):**
- `toggleSign()`: Cambio de signo +/-
- `percentage()`: Cálculo contextual de porcentajes
- `square()`, `squareRoot()`: Operaciones unarias con validación
- Redondeo automático para evitar problemas de punto flotante

**Sistema de Historial (script.js:202-265):**
- Array limitado a 10 operaciones más recientes
- Persistencia automática en localStorage con clave 'calculatorHistory'
- Items clickeables para reutilizar resultados
- Timestamps para referencia temporal

**Controles de Input (script.js:267-323):**
- Mapeo completo de teclado: números, operadores, funciones especiales
- Prevención de zoom en móviles (double-tap protection)
- Soporte para teclas alternativas (coma como decimal)

### Componentes UI y Styling

**Logo meskeIA (styles.css:18-105):**
- Componente fixed positionado reutilizable
- Efectos glassmorphism con backdrop-filter
- Animaciones CSS y pseudo-elementos para neural network

**Layout Responsivo:**
- CSS Grid principal 6x4 para botones de calculadora
- Breakpoints móviles con botones táctiles optimizados
- Gradientes personalizados y variables CSS para colores

**Estados Visuales:**
- `.number-btn`, `.function-btn`, `.special-btn`, `.equals-btn` con diferentes estilos
- Feedback hover/active para todos los botones interactivos
- Display dual: operación actual + historial de cálculo

### Integración con Ecosistema meskeIA

**Navegación:**
- Botón de retorno apunta a `../index.html` (menú principal meskeIA)
- Favicon referencia `../assets/icon_meskeia.png`
- Footer fijo con branding © 2025 meskeIA

**Convenciones de Código:**
- Comentarios y UI completamente en español
- Nombres de funciones descriptivos en inglés (estándar JS)
- Estructura modular preparada para extensiones futuras

## Extensiones Fáciles de Implementar

### Mejoras de UI/UX
- **Temas de color**: Agregar CSS custom properties y toggle
- **Modo nocturno**: Dark theme con preferencia del sistema
- **Animaciones**: Transiciones en operaciones y cambios de estado

### Funcionalidades Matemáticas
- **Modo científico**: sin(), cos(), tan(), log(), ln(), exp()
- **Constantes**: π, e, φ como botones dedicados
- **Memoria**: M+, M-, MR, MC con indicador visual

### Utilidades Prácticas
- **Conversión de unidades**: Temperatura, peso, distancia, moneda
- **Formato de números**: Separadores de miles, notación científica
- **Exportar historial**: CSV, TXT con timestamps

### Mejoras Técnicas
- **Modo offline**: Service Worker para PWA completa
- **Accesibilidad**: ARIA labels, navegación por teclado mejorada
- **Validación mejorada**: Límites de input, manejo de overflow

Todas estas mejoras mantienen la filosofía de "sin dependencias externas" y son implementables con JavaScript vanilla.