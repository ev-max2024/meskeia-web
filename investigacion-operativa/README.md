# 📊 Investigación Operativa - Herramientas meskeIA

Aplicación web interactiva con calculadoras y simuladores para **Investigación Operativa**. Incluye módulos de **Teoría de Colas**, **Problema del Transporte** y **Planificación CPM**.

## 🚀 Características

### 📈 Módulos Disponibles

1. **Teoría de Colas M/M/1**
   - Calculadora completa de sistemas de cola
   - Métricas: utilización, longitud de cola, tiempos de espera
   - Visualización con gráficos interactivos
   - Simulación de eventos discretos
   - Exportación de reportes en texto

2. **Problema del Transporte**
   - Matriz interactiva configurable (2-5 fuentes/destinos)
   - Métodos: Esquina Noroeste, Costo Mínimo, Vogel
   - Validación automática de balance
   - Visualización de la solución óptima
   - Ejemplo precargado para demostración

3. **Planificación CPM (Critical Path Method)**
   - Gestión de actividades con dependencias
   - Cálculo automático de ruta crítica
   - Análisis de tiempos tempranos y tardíos
   - Identificación de holguras
   - Exportación de análisis completo

### 🎨 Características de Diseño
- **Paleta meskeIA**: Diseño minimalista inspirado en Claude
- **Formato español**: Números con coma decimal, fechas DD/MM/YYYY
- **Responsivo**: Adaptado para móvil y desktop
- **PWA**: Progressive Web App con funcionamiento offline
- **Accesible**: Estructura semántica y navegación por teclado

### ⚡ Tecnología
- **Frontend**: HTML5, CSS3 (Variables CSS), JavaScript ES6
- **Gráficos**: Chart.js con configuración española
- **PWA**: Service Worker, Manifest, Cache API
- **Formato**: Intl API para localización española
- **Analytics**: Google Analytics 4 integrado

## 🛠️ Instalación y Uso

### Opción 1: Servidor Local Python
```bash
# Clonar o descargar los archivos
cd investigacion-operativa

# Iniciar servidor de desarrollo
python -m http.server 8000

# Abrir en navegador
http://localhost:8000
```

### Opción 2: Servidor Web
Subir todos los archivos a un servidor web y acceder a `index.html`.

### Opción 3: Archivo Local
Abrir directamente `index.html` en el navegador (funcionalidad limitada).

## 📱 Instalación como PWA

La aplicación se puede instalar como **Progressive Web App**:

1. Abrir en navegador compatible (Chrome, Edge, Firefox, Safari)
2. Después de 30 segundos aparecerá el banner de instalación
3. Hacer clic en "Instalar"
4. La app funcionará offline y tendrá icono en el dispositivo

## 🔧 Estructura del Proyecto

```
investigacion-operativa/
├── index.html          # Aplicación principal
├── script.js          # Lógica de todos los módulos
├── manifest.json      # Configuración PWA
├── service-worker.js  # Cache offline y optimización
├── offline.html       # Página para modo sin conexión
└── README.md          # Documentación
```

## 💡 Uso de los Módulos

### 🔄 Teoría de Colas
1. Ingresar **tasa de llegada (λ)** en clientes/hora
2. Ingresar **tasa de servicio (μ)** en clientes/hora
3. Hacer clic en "Calcular Métricas"
4. Ver resultados, interpretación y gráfico
5. Opcional: Exportar reporte o ejecutar simulación

### 🚚 Problema de Transporte
1. Configurar número de **fuentes** y **destinos** (2-5)
2. Hacer clic en "Generar Tabla"
3. Completar matriz de **costos**, **ofertas** y **demandas**
4. Seleccionar método de resolución
5. Hacer clic en "Resolver Problema"
6. Ver solución óptima y costos

### 📅 Planificación CPM
1. Agregar actividades con:
   - **ID** único (1-3 caracteres)
   - **Descripción** de la actividad
   - **Duración** en días
   - **Predecesoras** (opcional, separadas por comas)
2. Hacer clic en "Calcular Ruta Crítica"
3. Ver duración total, actividades críticas y recomendaciones
4. Exportar análisis completo

## 🎯 Casos de Uso Educativos

### Para Estudiantes
- **Verificar cálculos** de ejercicios manuales
- **Visualizar conceptos** con gráficos interactivos
- **Experimentar** con diferentes parámetros
- **Comparar métodos** de resolución

### Para Profesores
- **Demostrar conceptos** en clase
- **Generar ejercicios** con parámetros variables
- **Explicar interpretación** de resultados
- **Mostrar casos extremos** y sus implicaciones

### Para Profesionales
- **Análisis rápido** de sistemas de cola
- **Optimización de costos** de transporte
- **Planificación de proyectos** con ruta crítica
- **Reportes profesionales** exportables

## 📊 Ejemplos Incluidos

### Teoría de Colas - Ejemplo Típico
- **λ = 5** clientes/hora (llegadas)
- **μ = 8** clientes/hora (servicio)
- **Resultado**: Sistema estable con 62,5% de utilización

### Transporte - Ejemplo 3x3
- **3 fuentes** con ofertas: 150, 200, 100
- **3 destinos** con demandas: 130, 170, 150
- **Matriz de costos** balanceada incluida

### CPM - Ejemplo de Construcción
- **Actividades típicas** de proyecto
- **Dependencias realistas** entre tareas
- **Cálculo automático** de ruta crítica

## 🔬 Características Técnicas

### Algoritmos Implementados
- **M/M/1**: Fórmulas analíticas de Little
- **Transporte**: Esquina Noroeste, Costo Mínimo, Vogel básico
- **CPM**: Forward/Backward pass, detección de ciclos

### Validaciones
- **Entrada de datos**: Formato, rangos, dependencias
- **Estabilidad**: Verificación λ < μ en colas
- **Balance**: Oferta vs demanda en transporte
- **Consistencia**: Dependencias circulares en CPM

### Optimizaciones
- **Caché**: Service Worker para funcionamiento offline
- **Formato**: Localización automática española
- **Responsivo**: Grid CSS y Flexbox
- **Rendimiento**: JavaScript optimizado, lazy loading

## 🧪 Para Desarrolladores

### Extensión de Módulos
```javascript
// Agregar nuevo módulo en script.js
function nuevoModulo() {
    // Implementación del módulo
    if (typeof trackModuleUsage !== 'undefined') {
        trackModuleUsage('nuevo_modulo', 'calculation_started');
    }
}
```

### Configuración Analytics
```javascript
// En index.html, reemplazar el ID de Google Analytics
gtag('config', 'G-TU-ID-REAL');
```

### Personalización CSS
```css
/* Cambiar colores en las variables CSS */
:root {
    --primary: #TU-COLOR-PRIMARIO;
    --secondary: #TU-COLOR-SECUNDARIO;
}
```

## 📄 Licencia

**Uso Educativo Libre** - Esta aplicación es de **código abierto** para uso educativo y académico.

### ✅ Permitido
- Usar en clases y cursos
- Modificar para necesidades específicas
- Distribuir con crédito a meskeIA
- Integrar en plataformas educativas

### ❌ Restricciones
- No uso comercial directo sin autorización
- Mantener créditos originales
- No redistribuir como producto propio

## 🤝 Contribuciones

### Reportar Problemas
- **Errores de cálculo**: Verificar con fuentes académicas
- **Problemas de interfaz**: Incluir navegador y dispositivo
- **Sugerencias**: Proponer mejoras específicas

### Mejoras Sugeridas
- [ ] Método Simplex para transporte
- [ ] PERT con distribuciones de probabilidad
- [ ] Teoría de colas con múltiples servidores
- [ ] Exportación a Excel/PDF
- [ ] Modo oscuro
- [ ] Más idiomas

## 📞 Soporte

**meskeIA** - Herramientas Educativas
- **Web**: https://meskeia.com
- **Email**: contacto@meskeia.com
- **GitHub**: https://github.com/meskeia

---

### 🎓 Créditos Académicos

Basado en textos clásicos de Investigación Operativa:
- **Hillier & Lieberman** - Introduction to Operations Research
- **Winston** - Operations Research: Applications and Algorithms
- **Taha** - Operations Research: An Introduction

**Desarrollado con fines educativos por meskeIA © 2025**