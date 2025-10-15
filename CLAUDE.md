# CLAUDE.md - Guía Completa para Claude Code

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# 🚨 PARTE 1: REGLAS OBLIGATORIAS (APLICAR SIEMPRE PRIMERO)

## 🎨 REGLA #1: DISEÑO meskeIA (OBLIGATORIO)

CADA VEZ que generes HTML/CSS, DEBES usar automáticamente:

### Paleta de Colores Oficial meskeIA
```css
:root {
    /* Backgrounds - Inspirados en Claude */
    --bg-primary: #FAFAFA;      /* Background principal */
    --bg-card: #FFFFFF;         /* Cards y contenedores */

    /* Identidad de marca meskeIA */
    --primary: #2E86AB;         /* Azul meskeIA */
    --secondary: #48A9A6;       /* Teal meskeIA */

    /* Textos minimalistas */
    --text-primary: #1A1A1A;    /* Negro suave */
    --text-secondary: #666666;  /* Gris medio */
    --text-muted: #999999;      /* Gris claro */

    /* Elementos estructurales */
    --border: #E5E5E5;          /* Bordes sutiles */
    --hover: #F5F5F5;           /* Estados hover */
    --focus: rgba(46,134,171,0.1); /* Focus con azul meskeIA */
}
```

### Tipografía Oficial
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### ❌ PROHIBIDO ABSOLUTO
- NO usar #7C3AED (violeta) - ES INCORRECTO
- NO usar #2DD4BF (turquesa) - ES INCORRECTO
- NO preguntar si usar meskeIA
- NO generar código sin estos colores
- NO usar otros esquemas de color

### ✅ COLORES OBLIGATORIOS
- Azul principal: #2E86AB (SIEMPRE)
- Teal secundario: #48A9A6 (SIEMPRE)

---

## 🖼️ REGLA #2: LOGO + FOOTER (OBLIGATORIO EN TODA APP WEB)

CADA aplicación web DEBE incluir automáticamente este código EXACTO:

### 1. LOGO meskeIA (CSS - Pegar al final de estilos)
```css
/* Logo meskeIA - Componente oficial */
.meskeia-logo-container {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(46, 134, 171, 0.2);
    border-radius: 12px;
    padding: 8px 16px;
    box-shadow: 0 4px 20px rgba(46, 134, 171, 0.1);
    transition: all 0.3s ease;
}
.meskeia-logo-container:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 25px rgba(46, 134, 171, 0.15);
}
.meskeia-logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #2E86AB 0%, #48A9A6 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.meskeia-logo-icon::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    top: 10px;
    left: 10px;
}
.meskeia-logo-icon::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: #2E86AB;
    border-radius: 50%;
    top: 13px;
    left: 13px;
}
.meskeia-neural-network {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.3;
}
.meskeia-neural-dot {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
}
.meskeia-neural-dot:nth-child(1) { top: 4px; left: 6px; }
.meskeia-neural-dot:nth-child(2) { top: 8px; right: 5px; }
.meskeia-neural-dot:nth-child(3) { bottom: 6px; left: 4px; }
.meskeia-neural-dot:nth-child(4) { bottom: 4px; right: 8px; }
.meskeia-logo-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2C3E50;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.meskeia-logo-text .meske {
    color: #2E86AB;
}
.meskeia-logo-text .ia {
    color: #48A9A6;
    font-weight: 700;
    position: relative;
}
.meskeia-logo-text .ia::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #48A9A6, #7FB3D3);
    border-radius: 1px;
}
@media (max-width: 768px) {
    .meskeia-logo-container {
        top: 10px;
        left: 10px;
        padding: 6px 12px;
        gap: 8px;
    }
    .meskeia-logo-icon {
        width: 24px;
        height: 24px;
    }
    .meskeia-logo-icon::before {
        width: 9px;
        height: 9px;
        top: 7.5px;
        left: 7.5px;
    }
    .meskeia-logo-icon::after {
        width: 4px;
        height: 4px;
        top: 10px;
        left: 10px;
    }
    .meskeia-logo-text {
        font-size: 1rem;
    }
}
```

### 2. LOGO meskeIA (HTML - Pegar después de `<body>`)
```html
<!-- Logo meskeIA -->
<div class="meskeia-logo-container" onclick="window.location.href='../index.html'" style="cursor: pointer;">
    <div class="meskeia-logo-icon">
        <div class="meskeia-neural-network">
            <div class="meskeia-neural-dot"></div>
            <div class="meskeia-neural-dot"></div>
            <div class="meskeia-neural-dot"></div>
            <div class="meskeia-neural-dot"></div>
        </div>
    </div>
    <div class="meskeia-logo-text">
        <span class="meske">meske</span><span class="ia">IA</span>
    </div>
</div>
```

### 3. FOOTER meskeIA (HTML - Pegar antes de `</body>`)
```html
<!-- Footer meskeIA -->
<footer style="position: fixed; bottom: 10px; right: 20px; color: #2d3748; font-size: 0.9rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: rgba(255, 255, 255, 0.9); padding: 5px 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    © 2025 meskeIA
</footer>
```

### 4. FAVICON (HTML - Pegar en `<head>` después de viewport)
```html
<link rel="icon" type="image/png" href="icon_meskeia.png">
```

### ❌ PROHIBIDO
- NO usar imagen externa para logo (como .webp o .svg alojados)
- NO usar otro formato de footer
- NO preguntar si incluirlos
- COPIAR EXACTAMENTE el código completo

---

## 💶 REGLA #3: FORMATO ESPAÑOL (OBLIGATORIO)

SIEMPRE usar formato español automáticamente:

- **Números**: 1.234,56 (punto miles, coma decimal)
- **Fechas**: 30/09/2025 (DD/MM/YYYY)
- **Moneda**: 1.234,56 € (espacio antes de €)
- **Horas**: 14:30 (formato 24h)

### JavaScript
```javascript
// Para números
numero.toLocaleString('es-ES')

// Para moneda
numero.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

// Para fechas
fecha.toLocaleDateString('es-ES')
```

### ❌ PROHIBIDO
- NO usar formato US (1,234.56 o $)
- NO preguntar qué formato usar

---

## 🔐 REGLA #4: API KEYS SEGURAS (NUNCA HARDCODEAR)

NUNCA escribir claves en el código:

### ❌ MAL
```javascript
const API_KEY = "sk-ant-1234567890"
const ANTHROPIC_API_KEY = "sk-ant-api-..."
```

### ✅ BIEN
```javascript
const API_KEY = process.env.ANTHROPIC_API_KEY
```

```python
import os
API_KEY = os.getenv('ANTHROPIC_API_KEY')
```

### Obligatorio
- SIEMPRE crear archivo .env
- SIEMPRE añadir .env a .gitignore
- NO hardcodear claves NUNCA

---

## 🗣️ REGLA #5: TODO EN ESPAÑOL (OBLIGATORIO)

SIEMPRE escribir en español:
- Comentarios de código
- Variables y funciones descriptivas
- Mensajes de error
- Documentación
- Logs y console.log()

### Excepciones permitidas
- Nombres de librerías (React, Flask, etc.)
- Palabras técnicas sin traducción (API, endpoint, etc.)

---

## 🔄 PROCESO AUTOMÁTICO ANTES DE GENERAR CÓDIGO

### 1. Detectar tipo de archivo
- ¿HTML/CSS? → Aplicar diseño meskeIA + logo + footer
- ¿Python Flask? → Aplicar .env + formato español
- ¿JavaScript? → Aplicar formato español + localStorage

### 2. Auto-aplicar reglas SIN PREGUNTAR
- NO decir "voy a aplicar meskeIA"
- NO pedir confirmación
- DIRECTAMENTE generar con estándares

### 3. Verificar antes de entregar
- ✅ ¿Colores meskeIA (#2E86AB) aplicados?
- ✅ ¿Logo y footer oficiales incluidos?
- ✅ ¿Formato español en números?
- ✅ ¿API keys en .env?
- ✅ ¿Todo en español?

---

## 🚫 PROHIBICIONES ABSOLUTAS

NUNCA:
- Generar HTML sin colores meskeIA (#2E86AB)
- Omitir logo oficial en aplicaciones web
- Usar formato US para números/fechas
- Hardcodear API keys
- Generar código en inglés (excepto libs)
- Preguntar "¿quieres aplicar meskeIA?"
- Decir "no he incluido el logo, ¿lo añado?"
- Usar imágenes externas para el logo

---

## ✅ SI OLVIDAS UNA REGLA

Si generas código sin cumplir estas reglas:
1. Auto-corregirte inmediatamente
2. Regenerar código completo con estándares
3. NO esperar a que el usuario te lo recuerde

---

## 📊 CHECKLIST MENTAL OBLIGATORIO

Antes de enviar código, verificar mentalmente:
```
[ ] ¿Paleta oficial #2E86AB? (si HTML/CSS)
[ ] ¿Logo oficial con CSS completo? (si app web)
[ ] ¿Footer oficial "© 2025 meskeIA"? (si app web)
[ ] ¿Formato español? (siempre)
[ ] ¿API keys en .env? (si hay claves)
[ ] ¿Todo en español? (siempre)
```

---

# 📁 PARTE 2: CONTEXTO DE PROYECTOS Y COMANDOS

## Proyecto Principal: API-ANTHROPIC (Cliente Web para Claude)

### Descripción
Aplicación web local para interactuar con la API de Claude (Anthropic) con interfaz intuitiva y gestión de conversaciones.

### Stack Tecnológico
- **Backend**: Flask 2.3+ con Flask-CORS para servidor proxy
- **Frontend**: HTML5, CSS3 con variables CSS personalizadas, JavaScript vanilla
- **API**: Integración con Anthropic API (Claude Sonnet)
- **Diseño**: Paleta minimalista meskeIA (#2E86AB)

### Comandos del Proyecto
```bash
# Iniciar aplicación (Windows)
start_app.bat

# O manualmente:
# 1. Activar entorno virtual
venv\Scripts\activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Ejecutar servidor Flask
python server.py

# El servidor se ejecuta en http://localhost:5000
```

### Estructura del Proyecto
```
api-anthropic/
├── index.html          # Interfaz web principal
├── style.css          # Estilos con paleta meskeIA
├── script.js          # Lógica del cliente
├── server.py          # Servidor Flask/proxy API
├── start_app.bat      # Script inicio rápido (Windows)
├── requirements.txt   # Dependencias Python
├── venv/             # Entorno virtual Python
└── uploads/          # Directorio para archivos subidos
```

---

## Ubicaciones Principales de Proyectos

- **C:\Users\jaceb\meskeIA\Web meskeIA** - Sitio web principal con aplicaciones web
- **C:\Users\jaceb\meskeIA\XElements** - Aplicaciones Flask (Contabilidad, Cartera Inversiones)
- **C:\Users\jaceb\meskeIA\Mis Programas** - Utilidades y herramientas diversas
- **C:\Users\jaceb\meskeIA\Proyectos** - Proyectos en desarrollo

---

## Comandos Comunes

### Proyectos Flask
```bash
# Activar entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar aplicación Flask
python app.py
# o
flask run

# Verificar base de datos SQLite
python check_db.py

# Usar script de inicio rápido (Windows)
start_app.bat
```

### Proyectos Node.js
```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
# o
node server.js
```

### Proyectos Web estáticos
```bash
# Abrir directamente en navegador
start index.html

# O usar servidor Python simple
python -m http.server 8000
```

---

## Stack Tecnológico Principal

- **Backend**: Flask 2.3+ con SQLAlchemy y SQLite
- **Frontend**: HTML5, Bootstrap 5, JavaScript ES6, Chart.js
- **Bases de datos**: SQLite para desarrollo local
- **APIs**: Integración con Anthropic API y Google AI

---

## Consideraciones Importantes

- **Idioma**: Todos los mensajes, comentarios y documentación en español
- **Conversaciones**: SIEMPRE responder en español en VS Code
- **Entorno**: Windows con Git Bash disponible
- **Python**: Usar rutas de Windows con backslashes o raw strings
- **Seguridad**: No incluir claves API en el código, usar archivos .env
- **Base de datos**: SQLite para persistencia local, no usar en producción

---

## 🤖 SISTEMA DE AGENTES DE DESARROLLO

### Ubicación
- **Ruta**: C:\Users\jaceb\Mis Desarrollos\Agentes\
- **Total**: 21 agentes especializados
- **Documentación**: INVENTARIO_AGENTES.md

### 🎭 Testing Automatizado con Playwright

**Configuración de permisos**: Playwright está configurado para ejecutarse SIN confirmaciones continuas.

**Ubicación del archivo de permisos**: `C:\Users\jaceb\.claude\settings.local.json`

**Permisos habilitados**:
```json
{
  "permissions": {
    "allow": [
      "Bash(dir:*)",          // Comandos de directorio
      "Bash(git:*)",          // Operaciones Git sin confirmación
      "mcp__playwright__*",   // TODAS las herramientas Playwright
      "mcp__chrome-devtools__*", // Chrome DevTools para debugging
      "WebFetch(domain:meskeia.com)",
      "WebSearch"
    ]
  }
}
```

**Herramientas Playwright disponibles** (36 herramientas, todas sin confirmación):
- **Navegación**: navigate, new_page, close_page, go_back, go_forward, reload, wait_for
- **Automatización**: click, fill, hover, drag, upload, select, press
- **Captura**: snapshot, take_screenshot, console_messages, network_requests
- **Emulación**: set_viewport, set_user_agent, set_device
- **Performance**: start_trace, stop_trace, get_metrics
- **Debugging**: evaluate_script, list_console_messages, get_dom_snapshot

**Agentes de testing disponibles**:
- `qa_tester_playwright.py` - Testing automatizado completo
- `chrome_devtools_agent.txt` - Debugging con Chrome DevTools
- `qa_testing_automatico.txt` - Suite de pruebas automáticas

**Uso**: Cuando se solicite testing o revisión de aplicaciones, Claude Code ejecutará Playwright automáticamente sin pedir confirmaciones repetitivas.

### Herramientas de Validación

#### Validador de Proyectos
```bash
# Validar proyecto actual
python "C:\Users\jaceb\Mis Desarrollos\Agentes\validar_proyecto.py"

# Validar proyecto específico
python "C:\Users\jaceb\Mis Desarrollos\Agentes\validar_proyecto.py" "ruta/proyecto"
```

El validador verifica:
- ✅ Paleta meskeIA correcta (#2E86AB vs #7C3AED incorrecto)
- ✅ Logo oficial (meskeia-logo-container vs imagen externa)
- ✅ Footer oficial ("© 2025 meskeIA")
- ✅ Formato español en números
- ✅ API keys NO hardcodeadas

#### Aplicar Logo y Footer Automáticamente
```bash
python "C:\Users\jaceb\Mis Desarrollos\Agentes\aplicar_logo_footer.py" index.html
```

---

## 🎯 OBJETIVO FINAL

El usuario NO debe recordarte estas reglas.
Claude debe aplicarlas AUTOMÁTICAMENTE.
**100% cumplimiento en cada generación de código.**