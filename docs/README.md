# 📁 Documentación del Proyecto meskeIA

Esta carpeta contiene documentación interna y archivos de referencia para el desarrollo del proyecto. **Estos archivos NO deben subirse al hosting de producción.**

---

## 📋 Contenido de la Carpeta

### Instrucciones de Desarrollo
- **CLAUDE.md** - Guía completa para Claude Code con reglas de diseño y estándares del proyecto

### Documentación Técnica
- **AUDITORIA-MEJORAS-2025.md** - Auditoría y propuestas de mejoras (octubre 2025)
- **REPORTE_AUDITORIA_SEO_COMPLETO.md** - Reporte completo de auditoría SEO
- **SOLUCION_INDEXACION_GOOGLE.md** - Documentación del cambio masivo de nomenclatura de archivos para resolver problemas de indexación en Google (26 carpetas: de `calculadora-hipotecas.html` a `index.html`)

### Referencias de Diseño
- **🎨 Paleta Diseño Minimalista meskeIA.txt** - Paleta de colores oficial del proyecto
- **📋 logo-footer-favicon de Aplicaciones meskeIA.txt** - Especificaciones del logo, footer y favicon

---

## ⚠️ Importante

Esta carpeta está en el repositorio Git pero **NO debe sincronizarse con el hosting de producción**. Solo los archivos en la raíz del proyecto y las carpetas de aplicaciones deben subirse al servidor web.

---

## 🗂️ Estructura del Proyecto

```
meskeia-web/
├── index.html              # Página principal
├── manifest.json           # PWA manifest
├── service-worker.js       # Service Worker PWA
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── [aplicaciones]/         # Carpetas de aplicaciones
│
└── docs/                   # 📁 Esta carpeta (solo en Git)
    ├── README.md
    ├── CLAUDE.md
    ├── AUDITORIA-MEJORAS-2025.md
    ├── REPORTE_AUDITORIA_SEO_COMPLETO.md
    ├── SOLUCION_INDEXACION_GOOGLE.md
    ├── 🎨 Paleta Diseño Minimalista meskeIA.txt
    └── 📋 logo-footer-favicon de Aplicaciones meskeIA.txt
```

---

*Última actualización: 16 de octubre de 2025*
