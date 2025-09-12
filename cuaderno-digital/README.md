# Biblioteca Personal meskeIA

Una aplicación web local para gestionar y visualizar tu colección personal de documentos.

## 🚀 Características

- **Interfaz intuitiva** con diseño responsive
- **Tarjetas personalizables** con colores y categorías
- **Búsqueda rápida** por título, categoría o contenido
- **Lectura integrada** de documentos HTML
- **Exportación e impresión** de documentos
- **Almacenamiento local** - todos tus datos se quedan en tu PC

## 📁 Estructura del Proyecto

```
biblioteca-personal/
├── index.html          # Aplicación principal
├── styles.css          # Estilos y diseño
├── app.js              # Lógica JavaScript
├── documents.json      # Estructura de datos (referencia)
└── README.md           # Esta guía
```

## 🛠️ Instalación

1. **Descargar archivos**: Guarda todos los archivos en una carpeta local
2. **Abrir aplicación**: Abre `index.html` en tu navegador web
3. **¡Listo!**: La aplicación funciona completamente offline

## 📖 Cómo Usar

### Migrar desde Google Docs

1. **Exportar documento**:
   - Abre tu Google Doc
   - Ve a `Archivo > Descargar > Página web (.html, comprimido)`
   - Descomprime el archivo ZIP
   - Usa el archivo `.html` principal

2. **Añadir a la biblioteca**:
   - Haz clic en "Añadir Documento"
   - Completa el título y categoría
   - Selecciona el archivo HTML exportado
   - Elige un color para la tarjeta
   - Guarda

### Gestionar Documentos

- **Ver documento**: Haz clic en cualquier tarjeta
- **Editar**: Hover sobre la tarjeta y haz clic en ✏️
- **Eliminar**: Hover sobre la tarjeta y haz clic en 🗑️
- **Buscar**: Usa la barra de búsqueda superior
- **Filtrar**: Selecciona una categoría específica

### Lectura y Exportación

- **Leer**: Haz clic en una tarjeta para abrir el lector
- **Imprimir**: Botón 🖨️ en el lector
- **Exportar**: Botón 💾 para descargar como HTML

## 🎨 Personalización

### Colores Disponibles

- **Azul Corporativo** (#2E86AB) - Color principal meskeIA
- **Verde Azulado** (#48A9A6) - Color secundario meskeIA  
- **Azul Claro** (#7FB3D3)
- **Gris Carbón** (#2C3E50)
- **Verde Esmeralda** (#16A085)
- **Púrpura** (#8E44AD)

### Categorías Sugeridas

- **Ficción**: Relatos, novelas, cuentos
- **Ensayos**: Reflexiones, análisis, opiniones
- **Técnico**: Documentación, tutoriales, guías
- **Personal**: Diarios, notas personales
- **Investigación**: Estudios, papers, investigaciones
- **Ideas**: Borradores, conceptos, proyectos

## 💾 Almacenamiento

- Los datos se guardan en `localStorage` del navegador
- **Backup**: Exporta documentos individuales como HTML
- **Importación**: Usa "Añadir Documento" para restaurar

## 🔧 Solución de Problemas

### El documento no se muestra correctamente
- Verifica que el archivo sea HTML válido
- Algunos estilos de Google Docs pueden perderse
- Usa la función "Exportar" para obtener una versión limpia

### Error al cargar archivo
- Asegúrate de seleccionar el archivo `.html` principal
- El archivo debe ser menor a 5MB
- Verifica que el navegador soporte FileReader API

### Los datos desaparecieron
- Revisa si has cambiado de navegador o borrado datos
- Los datos están en localStorage del navegador específico
- Exporta regularmente documentos importantes

## 🌐 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Offline**: Funciona completamente sin internet
- **Responsive**: Optimizado para desktop y móvil

## 📝 Notas de Desarrollo

- **Tecnologías**: HTML5, CSS3, JavaScript ES6+
- **Sin dependencias**: No requiere frameworks externos
- **Local first**: Todos los datos se mantienen en tu PC

## 🔄 Actualizaciones Futuras

- [ ] Exportación masiva de documentos
- [ ] Etiquetas múltiples por documento  
- [ ] Vista de lista alternativa
- [ ] Búsqueda avanzada por contenido
- [ ] Temas de color personalizables

---

**meskeIA Biblioteca Personal** - Tu colección de documentos, organizada y accesible.