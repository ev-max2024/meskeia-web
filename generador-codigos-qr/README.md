# 📱 Generador de Códigos QR - meskeIA

Aplicación web completa para generar códigos QR personalizados con múltiples tipos de contenido.

## ✨ Características

### 🎯 Tipos de Códigos QR Soportados
- **🔗 URL**: Enlaces a sitios web
- **📝 Texto**: Texto libre
- **📧 Email**: Correo electrónico con asunto y mensaje
- **📱 Teléfono**: Número de teléfono para llamar
- **💬 SMS**: Mensaje de texto predefinido
- **📶 WiFi**: Credenciales de red WiFi
- **👤 vCard**: Tarjeta de contacto completa
- **📅 Evento**: Eventos de calendario (iCal)
- **📍 Ubicación**: Coordenadas GPS

### 🎨 Personalización
- **Tamaños**: 200x200, 300x300, 400x400, 500x500 píxeles
- **Colores personalizables**: Color del QR y fondo
- **Paleta meskeIA por defecto**: #2E86AB (azul corporativo)

### 💾 Funcionalidades Adicionales
- **Descarga en PNG**: Alta calidad con nombre descriptivo
- **Historial local**: Últimos 10 QRs generados (localStorage)
- **Regeneración rápida**: Click en historial para regenerar
- **Atajos de teclado**:
  - `Ctrl/Cmd + Enter`: Generar QR
  - `Ctrl/Cmd + S`: Descargar QR

## 🚀 Uso

### Instalación
No requiere instalación. Solo abrir el archivo [index.html](index.html) en un navegador.

### Generar un Código QR
1. Selecciona el tipo de contenido (URL, Texto, Email, etc.)
2. Completa los campos del formulario
3. Personaliza colores y tamaño (opcional)
4. Click en "Generar Código QR"
5. Descarga el QR generado

### Ejemplos de Uso

#### WiFi
```
SSID: Mi_Red_WiFi
Contraseña: MiPassword123
Seguridad: WPA/WPA2
```

#### vCard (Contacto)
```
Nombre: Juan Pérez
Organización: meskeIA
Teléfono: +34 600 000 000
Email: juan@meskeia.com
```

#### Ubicación GPS
```
Latitud: 40.416775
Longitud: -3.703790
Nombre: Puerta del Sol, Madrid
```

## 🎨 Diseño

Sigue los estándares meskeIA:
- **Paleta de colores**: #2E86AB (azul principal), #48A9A6 (teal secundario)
- **Tipografía**: System fonts (-apple-system, Segoe UI, Roboto)
- **Logo oficial**: Componente meskeIA integrado
- **Footer corporativo**: © 2025 meskeIA

## 📂 Estructura de Archivos

```
generador-codigos-qr/
├── index.html          # Interfaz principal
├── styles.css          # Estilos con paleta meskeIA
├── script.js           # Lógica de generación de QR
└── README.md           # Documentación
```

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6**: Vanilla JS con módulos
- **QRCode.js**: Librería para generación de códigos QR (CDN)
- **LocalStorage API**: Persistencia de historial

## 📱 Responsive

- **Desktop**: Layout de 2 columnas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout de 1 columna con optimizaciones táctiles

## 🔒 Privacidad

- **100% Local**: No se envían datos a servidores externos
- **Sin cookies**: No se utilizan cookies
- **LocalStorage**: Datos guardados solo en el navegador del usuario

## 🌐 Integración con Web meskeIA

Para integrar en el sitio principal:

1. Copiar carpeta `generador-codigos-qr` a la raíz de la web
2. Añadir enlace en el menú "Herramientas de Productividad":

```html
<a href="generador-codigos-qr/index.html" class="tool-card">
    <span class="icon">📱</span>
    <h3>Generador de Códigos QR</h3>
    <p>Crea códigos QR para URLs, WiFi, contactos y más</p>
</a>
```

## 📊 Formatos Soportados

### WiFi (formato estándar)
```
WIFI:T:WPA;S:SSID;P:password;H:false;
```

### vCard (formato VCF 3.0)
```
BEGIN:VCARD
VERSION:3.0
FN:Nombre Completo
TEL:+34600000000
EMAIL:email@ejemplo.com
END:VCARD
```

### Evento (formato iCalendar)
```
BEGIN:VEVENT
SUMMARY:Título del evento
LOCATION:Ubicación
DTSTART:20250115T103000
DTEND:20250115T120000
END:VEVENT
```

### Ubicación (formato geo URI)
```
geo:40.416775,-3.703790?q=Puerta del Sol
```

## 🐛 Solución de Problemas

### El QR no se genera
- Verifica que todos los campos requeridos estén completos
- Revisa la consola del navegador (F12) para errores

### El QR no escanea correctamente
- Aumenta el tamaño del QR (500x500)
- Usa colores con mayor contraste
- Verifica que el formato de datos sea correcto

### El historial no se guarda
- Verifica que localStorage esté habilitado en tu navegador
- Comprueba que no estés en modo incógnito

## 📝 Notas de Desarrollo

- **Formato español**: Fechas, números y mensajes en español
- **Código comentado**: Todo el JavaScript está documentado
- **Sin dependencias**: Solo una librería externa (QRCode.js vía CDN)
- **SEO friendly**: Meta tags y estructura semántica

## 🔄 Actualizaciones Futuras

- [ ] Exportar a SVG vectorial
- [ ] Añadir logo/imagen en centro del QR
- [ ] Lector de QR con cámara
- [ ] Códigos QR dinámicos con analytics
- [ ] Compartir QR por redes sociales

## 👨‍💻 Desarrollo

Desarrollado siguiendo las especificaciones de **CLAUDE.md**:
- ✅ Paleta meskeIA (#2E86AB)
- ✅ Logo oficial integrado
- ✅ Footer corporativo
- ✅ Formato español
- ✅ Sin API keys hardcodeadas
- ✅ Código 100% en español

---

**© 2025 meskeIA** - Generador de Códigos QR v1.0
