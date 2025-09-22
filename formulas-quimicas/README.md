# 🧪 Constructor de Fórmulas Químicas - meskeIA

Una aplicación web interactiva para construir y validar fórmulas químicas mediante drag & drop. Perfecta para estudiantes que quieren aprender química de forma visual y divertida.

## 🎯 Características

### 🔬 Construcción Interactiva
- **Drag & Drop**: Arrastra elementos químicos para formar compuestos
- **Validación automática**: Verifica valencias y balanceo de cargas
- **Detección de tipo de enlace**: Identifica enlaces iónicos vs covalentes
- **Retroalimentación visual**: Colores y animaciones que indican validez

### 📚 Base de Conocimiento
- **50+ elementos químicos** organizados por tipo
- **Iones poliatómicos** comunes (SO₄²⁻, NO₃⁻, etc.)
- **Fórmulas predefinidas** (H₂O, NaCl, CO₂, etc.)
- **Información contextual** sobre compuestos conocidos

### 📊 Seguimiento del Progreso
- **Estadísticas en tiempo real** de aprendizaje
- **Historial de fórmulas** creadas
- **Progreso visual** con barras y métricas
- **Almacenamiento local** persistente

### 📱 Tecnología Moderna
- **Progressive Web App (PWA)**: Instalable y funciona offline
- **Diseño responsivo**: Optimizado para móvil y desktop
- **Paleta meskeIA**: Colores coherentes con la marca
- **Animaciones fluidas**: Transiciones suaves y naturales

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5 semántico** con estructura accesible
- **CSS3 moderno** con variables personalizadas y gradientes
- **JavaScript ES6+** con clases y módulos
- **Bootstrap 5.3.2** para componentes responsivos

### Librerías Especializadas
- **Interact.js 1.10.17** para drag & drop avanzado
- **Service Worker** para funcionalidad offline
- **LocalStorage API** para persistencia de datos

### Herramientas de Desarrollo
- **Context7 MCP** para documentación actualizada automáticamente
- **Paleta de colores meskeIA** para consistencia visual
- **Google Analytics 4** + **Microsoft Clarity** para análisis

## 📋 Instalación y Uso

### Opción 1: Usar directamente
1. Abre `index.html` en tu navegador moderno
2. ¡Listo! La aplicación funciona sin instalación

### Opción 2: Servidor local (recomendado)
```bash
# Con Python
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Luego abre http://localhost:8000
```

### Opción 3: PWA (Instalable)
1. Abre la aplicación en Chrome/Edge/Safari
2. Busca el ícono "Instalar" en la barra de direcciones
3. Haz clic en "Instalar" para usarla como aplicación nativa

## 🎮 Cómo Usar

### Paso 1: Seleccionar Elementos
- Filtra elementos por tipo (metales, no metales, gases nobles)
- Arrastra elementos desde el panel izquierdo

### Paso 2: Construir Fórmula
- Suelta elementos en la "Zona de Reactivos"
- Observa cómo se forma la fórmula automáticamente
- La flecha indica la dirección de la reacción

### Paso 3: Validación
- El sistema verifica automáticamente las valencias
- ✅ Verde = Fórmula correcta
- ❌ Rojo = Necesita corrección
- Información adicional sobre el tipo de enlace

### Paso 4: Aprendizaje
- Lee la información del compuesto si es conocido
- Revisa tus estadísticas de progreso
- Consulta el historial de fórmulas creadas

## 🧪 Ejemplos de Fórmulas

### Compuestos Iónicos
- **NaCl**: Cloruro de sodio (sal común)
- **CaCO₃**: Carbonato de calcio (cal)
- **MgSO₄**: Sulfato de magnesio (sal de Epsom)

### Compuestos Covalentes
- **H₂O**: Agua
- **CO₂**: Dióxido de carbono
- **CH₄**: Metano

### Ácidos
- **HCl**: Ácido clorhídrico
- **H₂SO₄**: Ácido sulfúrico
- **HNO₃**: Ácido nítrico

## 📱 Características PWA

### Funciona Offline
- Caché inteligente de recursos críticos
- Funcionalidad básica sin conexión
- Sincronización automática al reconectar

### Instalable
- Se comporta como aplicación nativa
- Acceso rápido desde el escritorio/inicio
- Notificaciones push (futuro)

### Optimizada
- Carga rápida con Service Worker
- Caché eficiente de recursos
- Actualización automática en segundo plano

## 🎨 Diseño meskeIA

### Paleta de Colores
```css
--meskeia-primary: #10b981;     /* Verde principal */
--meskeia-secondary: #3b82f6;   /* Azul secundario */
--meskeia-accent: #f59e0b;      /* Amarillo acento */
--meskeia-success: #22c55e;     /* Verde éxito */
--meskeia-danger: #ef4444;      /* Rojo error */
```

### Elementos Visuales
- **Logo flotante** animado en esquina superior derecha
- **Gradientes suaves** para profundidad visual
- **Sombras modernas** con múltiples capas
- **Animaciones fluidas** con cubic-bezier

## 🔧 Personalización

### Modificar Elementos
Edita el objeto `ELEMENTOS` en `script.js`:
```javascript
const ELEMENTOS = {
    'Nuevo': {
        nombre: 'Elemento Nuevo',
        valencia: [1, 2],
        tipo: 'metal',
        numero: 999
    }
};
```

### Agregar Fórmulas Comunes
Actualiza `FORMULAS_COMUNES` en `script.js`:
```javascript
const FORMULAS_COMUNES = {
    'H2O2': {
        nombre: 'Peróxido de hidrógeno',
        tipo: 'covalente',
        descripcion: 'Agua oxigenada'
    }
};
```

### Cambiar Colores
Modifica las variables CSS en `style.css`:
```css
:root {
    --meskeia-primary: #tu-color;
}
```

## 📊 Analytics y Métricas

### Google Analytics 4
- Seguimiento de interacciones
- Métricas de aprendizaje
- Fórmulas más construidas

### Microsoft Clarity
- Grabación de sesiones
- Mapas de calor
- Análisis de UX

### Métricas Internas
- Fórmulas creadas
- Tasa de aciertos
- Elementos más utilizados
- Progreso del usuario

## 🛠️ Desarrollo

### Estructura del Proyecto
```
formulas-quimicas/
├── index.html          # Página principal
├── style.css           # Estilos con paleta meskeIA
├── script.js           # Lógica de aplicación
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
└── README.md          # Este archivo
```

### Comandos Útiles
```bash
# Validar HTML
npx html-validate index.html

# Minificar CSS
npx cleancss-cli style.css -o style.min.css

# Validar PWA
npx lighthouse --only-categories=pwa index.html

# Analizar Service Worker
npx workbox-cli --help
```

## 🔄 Context7 Integration

Esta aplicación utiliza **Context7 automáticamente** para:
- Documentación actualizada de Interact.js
- APIs más recientes de Bootstrap 5.3+
- Mejores prácticas de Service Workers
- Sintaxis moderna de JavaScript ES2024+

Context7 trabajó silenciosamente durante el desarrollo para asegurar que todas las librerías y APIs utilizadas estén actualizadas y funcionen correctamente.

## 🤝 Contribuir

### Reportar Bugs
1. Abre un issue describiendo el problema
2. Incluye pasos para reproducir
3. Especifica navegador y versión

### Sugerir Características
1. Verifica que no exista ya la sugerencia
2. Describe el caso de uso
3. Propón implementación si es posible

### Pull Requests
1. Fork del repositorio
2. Crea rama con nombre descriptivo
3. Mantén consistencia con el estilo existente
4. Incluye pruebas si es aplicable

## 📄 Licencia

© 2025 **meskeIA** - Todos los derechos reservados

Este proyecto fue creado con fines educativos y puede ser usado libremente para aprendizaje y enseñanza.

## 📞 Soporte

### FAQ
**P: ¿Funciona sin internet?**
R: Sí, después de la primera carga funciona completamente offline.

**P: ¿Se puede instalar en el móvil?**
R: Sí, es una PWA instalable desde cualquier navegador moderno.

**P: ¿Guarda mi progreso?**
R: Sí, todo se almacena localmente en tu dispositivo.

### Contacto
- **Web**: [meskeIA](https://meskeia.com)
- **GitHub**: Repositorio del proyecto
- **Email**: Contacto disponible en el sitio web

---

**¡Aprende química de forma divertida e interactiva! 🧪✨**

*Desarrollado con ❤️ por meskeIA utilizando tecnologías web modernas y Context7 para documentación siempre actualizada.*