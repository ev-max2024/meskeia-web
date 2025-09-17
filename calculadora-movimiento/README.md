# 🚀 Calculadora de Movimiento - meskeIA

Calculadora interactiva de cinemática para estudiantes de física. Permite resolver problemas de movimiento y visualizar trayectorias mediante gráficos y animaciones.

## ✨ Características

### 🎯 Tipos de Movimiento
- **MRU** - Movimiento Rectilíneo Uniforme
- **MRUA** - Movimiento Rectilíneo Uniformemente Acelerado
- **Caída Libre** - Movimiento vertical con gravedad
- **Tiro Parabólico** - Movimiento de proyectiles

### 📊 Visualización
- Gráficos interactivos con Chart.js
- Animaciones Canvas en tiempo real
- Vectores de velocidad animados
- Trayectorias trazadas paso a paso

### 🎮 Funcionalidades
- Ejemplos predefinidos (pelota, coche, cohete, caída)
- Controles de reproducción (play/pause/reset)
- Control de velocidad de animación
- Cálculos automáticos con fórmulas
- Formato numérico español (comas decimales)

### 📱 PWA (Progressive Web App)
- Instalable como aplicación
- Funciona offline
- Diseño responsivo
- Shortcuts para tipos de movimiento

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Gráficos**: Chart.js para gráficos, Canvas API para animaciones
- **PWA**: Service Worker, Web App Manifest
- **Diseño**: Paleta de colores meskeIA

## 🚀 Uso

1. Abrir `index.html` in navegador
2. Seleccionar tipo de movimiento
3. Introducir parámetros (velocidad inicial, aceleración, tiempo)
4. Hacer clic en "Calcular"
5. Visualizar resultados, gráfico y animación

### Ejemplos Rápidos
- **⚽ Pelota lanzada**: Tiro parabólico a 45°
- **🚗 Coche frenando**: MRUA con desaceleración
- **🚀 Cohete acelerando**: MRUA con aceleración positiva
- **📦 Objeto en caída**: Caída libre desde altura

## 📐 Fórmulas Incluidas

### MRU
- `x = v₀ × t`
- `v = v₀` (constante)

### MRUA
- `v = v₀ + a × t`
- `x = v₀ × t + ½ × a × t²`
- `v² = v₀² + 2 × a × x`

### Caída Libre
- `y = v₀ × t - ½ × g × t²`
- `v = v₀ - g × t`
- `h_máx = v₀² / (2 × g)`

### Tiro Parabólico
- `x = v₀ × cos(α) × t`
- `y = v₀ × sin(α) × t - ½ × g × t²`
- `Alcance = v₀² × sin(2α) / g`
- `h_máx = (v₀ × sin(α))² / (2 × g)`

## 🎨 Diseño meskeIA

Utiliza la paleta de colores característica:
- **Primary Dark**: #2D3436
- **Primary Blue**: #00B4D8
- **Primary Cyan**: #00D4FF
- **Background**: #F5F7FA

## 📄 Licencia

© 2025 meskeIA - Herramientas educativas de física