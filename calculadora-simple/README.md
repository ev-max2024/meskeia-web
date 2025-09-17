# Calculadora Simple - meskeIA

## 📱 Descripción
Calculadora web moderna y responsiva con funcionalidades mejoradas respecto a la calculadora estándar de Windows.

## ✨ Características principales

### Funcionalidades básicas
- ➕ Operaciones básicas: suma, resta, multiplicación y división
- 🔢 Números decimales
- ⌫ Botón de borrado y limpieza completa
- ⌨️ Compatible con teclado físico

### Funcionalidades mejoradas
- 📜 **Historial de operaciones**: Guarda las últimas 10 operaciones
- 💾 **Persistencia**: El historial se mantiene aunque cierres el navegador
- 🖱️ **Reutilización de resultados**: Click en cualquier resultado del historial para usarlo
- 📱 **Diseño responsive**: Optimizado para móviles y tablets
- 🎨 **Interfaz moderna**: Diseño atractivo con animaciones suaves

## 🎮 Controles de teclado

| Tecla | Acción |
|-------|--------|
| 0-9 | Números |
| + - * / | Operadores |
| . o , | Punto decimal |
| Enter o = | Calcular |
| Escape o C | Limpiar todo |
| Backspace | Borrar último dígito |

## 📂 Estructura de archivos

```
calculadora-simple/
├── index.html      # Estructura HTML
├── styles.css      # Estilos y diseño
├── script.js       # Lógica de la calculadora
└── README.md       # Documentación
```

## 🚀 Instalación

1. Copia todos los archivos en la carpeta `calculadora-simple/`
2. Asegúrate de que el favicon esté en `../assets/icon_meskeia.png`
3. Abre `index.html` en tu navegador

## 🔗 Integración con la web principal

En tu página principal, agrega un card con enlace:
```html
<a href="calculadora-simple/index.html">Calculadora Simple</a>
```

## 🎯 Futuras mejoras planificadas

- [ ] Modo científico con funciones avanzadas
- [ ] Temas de color personalizables
- [ ] Exportar historial en formato CSV
- [ ] Conversión de unidades
- [ ] Modo programador (binario, hexadecimal)

## 👨‍💻 Autor
**meskeIA** - Desarrollo web y aplicaciones

## 📅 Versión
v1.0 - Enero 2025

## 📝 Notas técnicas

- Sin dependencias externas
- JavaScript vanilla (ES6+)
- CSS Grid para el layout de botones
- LocalStorage para persistencia de datos
- Compatible con todos los navegadores modernos