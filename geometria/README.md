# 📐 Geometría Interactiva - meskeIA

Aplicación web interactiva para explorar el mundo de la geometría con herramientas visuales, calculadoras automáticas y animaciones educativas.

## ✨ Características Principales

### 📐 **Figuras 2D**
- **Triángulos**: Equiláteros, isósceles, escalenos
- **Cuadriláteros**: Cuadrados, rectángulos, rombos, trapecios
- **Círculos**: Radio, diámetro, circunferencia
- **Polígonos**: Regulares e irregulares
- **Visualización Canvas**: Dibujo interactivo en tiempo real
- **Cálculos automáticos**: Áreas, perímetros, propiedades

### 📦 **Figuras 3D**
- **Sólidos regulares**: Cubos, esferas, cilindros, conos, pirámides
- **Visualización 3D**: Perspectiva isométrica interactiva
- **Cálculos de volumen**: Automáticos con fórmulas mostradas
- **Superficies**: Área de superficies de sólidos
- **Rotación**: Controles para rotar y examinar figuras

### 📏 **Ángulos y Trigonometría**
- **Medidor de ángulos**: Slider interactivo 0°-360°
- **Clasificación**: Agudo, recto, obtuso, llano
- **Calculadora trigonométrica**: sen, cos, tan, cot, sec, csc
- **Conversión de unidades**: Grados ⟷ Radianes
- **Visualización**: Representación gráfica de ángulos

### ⬜ **Áreas y Perímetros**
- **Fórmulas interactivas**: Inputs con cálculo automático
- **Figuras incluidas**: Triángulo, cuadrado, rectángulo, círculo
- **Formato español**: Números con comas decimales
- **Validación**: Verificación de valores positivos
- **Resultados detallados**: Área, perímetro y propiedades adicionales

### 🧊 **Volúmenes**
- **Sólidos regulares**: Cubo, esfera, cilindro, cono, pirámide
- **Cálculos automáticos**: Volumen y superficie
- **Fórmulas mostradas**: Educativo y transparente
- **Unidades**: Sistema métrico con formato español

### 🔄 **Transformaciones Geométricas**
- **Traslación**: Desplazamiento en X e Y
- **Rotación**: Ángulo de rotación con preview
- **Reflexión**: Ejes X, Y y diagonal
- **Escala**: Factor de ampliación/reducción
- **Animaciones**: Reproducción de transformaciones
- **Controles interactivos**: Sliders y selectores

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Canvas**: Visualizaciones 2D y 3D nativas
- **Chart.js**: Gráficos y visualizaciones de datos
- **PWA**: Progressive Web App con Service Worker
- **Diseño**: Sistema de diseño meskeIA minimalista

## 🎨 Sistema de Diseño meskeIA

### Paleta de Colores
```css
--bg-primary: #FAFAFA;     /* Fondo principal */
--bg-card: #FFFFFF;        /* Fondo de tarjetas */
--primary: #2E86AB;        /* Azul principal */
--secondary: #48A9A6;      /* Verde azulado */
--accent: #F39C12;         /* Naranja de acento */
--text-primary: #1A1A1A;   /* Texto principal */
--text-secondary: #666666; /* Texto secundario */
```

### Características del Diseño
- **Minimalista**: Inspirado en Claude
- **Responsivo**: Adaptado para móvil y desktop
- **Accesible**: Alto contraste y navegación clara
- **Consistente**: Componentes reutilizables
- **Moderno**: Bordes redondeados y sombras sutiles

## 📱 Progressive Web App (PWA)

### Funcionalidades PWA
- **Instalable**: Se puede instalar como app nativa
- **Offline**: Funciona sin conexión a internet
- **Responsive**: Adaptado a todos los dispositivos
- **Fast**: Carga rápida con Service Worker
- **Secure**: Servido sobre HTTPS

### Iconos y Manifest
- **Iconos**: Múltiples tamaños (72x72 hasta 512x512)
- **Shortcuts**: Accesos rápidos a secciones principales
- **Theme**: Color de tema #2E86AB
- **Orientación**: Optimizado para portrait

## 🚀 Instalación y Uso

### Opción 1: Uso Directo
```bash
# Abrir directamente en navegador
start index.html
```

### Opción 2: Servidor Local
```bash
# Servidor Python simple
python -m http.server 8000

# O servidor Node.js
npx http-server
```

### Opción 3: Instalar como PWA
1. Abrir en navegador compatible
2. Buscar opción "Instalar app" o "Agregar a pantalla de inicio"
3. Confirmar instalación
4. ¡Usar como app nativa!

## 🎯 Características Educativas

### Para Estudiantes
- **Visual**: Representaciones gráficas claras
- **Interactivo**: Manipulación directa de parámetros
- **Inmediato**: Resultados en tiempo real
- **Explicativo**: Fórmulas mostradas paso a paso

### Para Profesores
- **Demostraciones**: Herramienta para clases
- **Ejemplos**: Casos de uso predefinidos
- **Exportación**: Imágenes para materiales
- **Progresivo**: De conceptos básicos a avanzados

## 🔧 Funcionalidades Técnicas

### Canvas 2D/3D
- **Rendering**: HTML5 Canvas nativo
- **Interactividad**: Event listeners para manipulación
- **Animaciones**: RequestAnimationFrame suave
- **Exportación**: Descarga de imágenes PNG

### Calculadoras
- **Tiempo real**: Cálculo automático al escribir
- **Validación**: Verificación de datos de entrada
- **Formato español**: Localización de números
- **Precisión**: Matemática de punto flotante

### Almacenamiento
- **localStorage**: Persistencia de preferencias
- **Configuración**: Estado de la aplicación
- **Historial**: Últimos cálculos realizados

## 📊 SEO y Analytics

### Optimización SEO
- **Meta tags**: Título, descripción, keywords
- **Open Graph**: Compartir en redes sociales
- **Twitter Cards**: Vista previa en Twitter
- **Structured Data**: Datos estructurados para buscadores

### Analytics Integrados
- **Google Analytics 4**: Seguimiento de uso
- **Microsoft Clarity**: Mapas de calor y sesiones
- **Eventos personalizados**: Interacciones específicas
- **Métricas educativas**: Secciones más usadas

## 🌐 Compatibilidad

### Navegadores Soportados
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### Dispositivos
- **Desktop**: Windows, Mac, Linux
- **Móvil**: Android 8+, iOS 13+
- **Tablet**: iPad, Android tablets

### Funcionalidades Progresivas
- **Canvas**: Todas las visualizaciones
- **PWA**: Instalación y offline
- **localStorage**: Persistencia de datos
- **Responsive**: Adaptación automática

## 🔍 Casos de Uso

### Educación Primaria
- Reconocimiento de figuras básicas
- Cálculo de áreas simples
- Medición de ángulos

### Educación Secundaria
- Trigonometría básica
- Geometría plana
- Transformaciones geométricas

### Bachillerato
- Geometría analítica
- Cálculo de volúmenes complejos
- Transformaciones avanzadas

### Uso Profesional
- Herramienta de cálculo rápido
- Visualización de conceptos
- Material didáctico

## 🛣️ Roadmap Futuro

### v1.1 - Mejoras Básicas
- [ ] Más tipos de polígonos
- [ ] Cálculo de apotemas
- [ ] Ángulos en polígonos regulares

### v1.2 - Geometría Avanzada
- [ ] Geometría no euclidiana básica
- [ ] Fractales simples
- [ ] Teoremas clásicos

### v1.3 - Interactividad
- [ ] Construcciones con regla y compás
- [ ] Animaciones de demostraciones
- [ ] Modo tutorial guiado

### v2.0 - Características Avanzadas
- [ ] WebGL para 3D real
- [ ] Realidad aumentada (AR)
- [ ] Colaboración en tiempo real
- [ ] Base de datos de ejercicios

## 📄 Licencia

© 2025 meskeIA - Geometría Interactiva
Aplicación educativa gratuita

## 🤝 Contribuir

¿Ideas para mejorar la aplicación? ¡Contáctanos!

**Email**: info@meskeia.com
**Web**: [meskeIA](https://meskeia.com)

---

**🎯 Hecho con ❤️ para estudiantes y educadores**
*Explora, aprende y descubre el fascinante mundo de la geometría*