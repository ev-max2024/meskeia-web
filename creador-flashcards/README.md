# 📚 Creador de Flashcards - meskeIA

Aplicación web para crear y estudiar con tarjetas de memoria (flashcards). Gestiona mazos organizados por categorías, estudia con modo interactivo flip, importa/exporta tus tarjetas. 100% privado y gratuito.

## 🎯 Características Principales

### 📦 Gestión de Mazos
- **Crear mazos ilimitados** con nombre personalizado
- **8 categorías predefinidas**: Idiomas, Medicina, Derecho, Programación, Historia, Ciencias, Matemáticas, Otros
- **6 colores** para identificar visualmente tus mazos
- **Editar y eliminar** mazos con confirmación
- **Estadísticas**: Número de tarjetas por mazo
- **Última vez estudiado**: Seguimiento automático

### 📇 Gestión de Tarjetas
- **CRUD completo**: Crear, editar, eliminar tarjetas
- **Formato simple**: Pregunta (frente) y Respuesta (reverso)
- **Vista de lista**: Todas las tarjetas del mazo visibles
- **Sin límite** de tarjetas por mazo
- **Contador automático** de tarjetas

### 📖 Modo Estudio Interactivo
- **Flip animation 3D**: Clic para voltear la tarjeta
- **Navegación**: Botones Anterior/Siguiente
- **Contador de progreso**: 5/47 tarjetas
- **🔀 Barajar**: Orden aleatorio para evitar patrones de memorización
- **Diseño minimalista**: Foco en el contenido
- **Atajos de teclado**: Escape para salir

### 💾 Backup y Restauración
**3 opciones de exportación:**

1. **📦 Exportar TODO a JSON**
   - Descarga TODOS los mazos con todas las tarjetas
   - Formato versionado con metadatos
   - Nombre: `flashcards_backup_2025-01-12.json`
   - Ideal para backup en la nube

2. **📥 Exportar CSV (por mazo)**
   - Descarga solo el mazo actual en CSV
   - Compatible con Excel/Google Sheets
   - Formato: Pregunta, Respuesta
   - Nombre: `flashcards_nombre_mazo.csv`

3. **📥 Importar desde JSON**
   - Restaura backups previos
   - **Fusión inteligente**: No duplica mazos existentes por ID
   - Validación de formato automática
   - Ideal para compartir mazos con compañeros

## 🔒 Privacidad y Seguridad

### 100% Privado
- ✅ **Datos solo en tu navegador**: localStorage local
- ✅ **Sin servidores**: No se envía nada a la nube
- ✅ **Sin registro**: No requiere cuenta ni email
- ✅ **Sin cookies de terceros**
- ✅ **Control total**: Tú decides cuándo borrar

### Offline First
- ✅ Funciona **sin conexión a internet**
- ✅ Sin dependencias de APIs externas
- ✅ Rápido y responsive
- ✅ **Portabilidad**: Importa backups en cualquier navegador

## 🎨 Diseño y UX

### Paleta de Colores meskeIA
- **Azul principal**: `#2E86AB`
- **Teal secundario**: `#48A9A6`
- **6 colores** para personalizar mazos

### UX Destacada
- **Mobile-first**: Optimizado para móviles
- **Responsive perfecto**: Tablet y desktop
- **Flip animation 3D**: Efecto realista de voltear tarjeta
- **Animaciones suaves**: Transiciones fluidas
- **Notificaciones**: Feedback visual inmediato
- **Modales**: Creación/edición sin cambiar de página

## 💾 Estructura de Datos

### Mazo (Deck)
```javascript
{
  id: 1705067234567,              // timestamp único
  name: "Vocabulario Inglés B2",  // nombre del mazo
  category: "Idiomas",            // categoría
  color: "#2E86AB",               // color personalizado
  cards: [...],                   // array de tarjetas
  created: "2025-01-12T10:30:00Z",// fecha creación
  lastStudied: "2025-01-13T..."   // última vez estudiado
}
```

### Tarjeta (Card)
```javascript
{
  id: 1705067234567,          // timestamp único
  front: "Resilience",        // pregunta (frente)
  back: "Capacidad de...",    // respuesta (reverso)
  created: "2025-01-12T...",  // fecha creación
  reviewCount: 5,             // veces repasada
  lastReviewed: "2025-01-13T..."// último repaso
}
```

### Almacenamiento LocalStorage
```javascript
// Clave única
localStorage.setItem('flashcards_decks', JSON.stringify(decks))

// Estructura completa
[
  { id: 1, name: "Inglés", cards: [...] },
  { id: 2, name: "Medicina", cards: [...] },
  { id: 3, name: "Derecho", cards: [...] }
]
```

## 📊 Formato de Exportación

### JSON (Backup Completo)
```json
{
  "version": "1.0",
  "exportDate": "2025-01-12T14:30:00.000Z",
  "totalDecks": 3,
  "totalCards": 147,
  "decks": [
    {
      "id": 1705067234567,
      "name": "Vocabulario Inglés B2",
      "category": "Idiomas",
      "color": "#2E86AB",
      "cards": [
        {
          "id": 1705067234568,
          "front": "Resilience",
          "back": "Capacidad de recuperarse rápidamente",
          "created": "2025-01-12T10:30:00.000Z",
          "reviewCount": 0,
          "lastReviewed": null
        }
      ],
      "created": "2025-01-12T10:00:00.000Z",
      "lastStudied": null
    }
  ]
}
```

### CSV (Por Mazo)
```csv
Pregunta,Respuesta
"Resilience","Capacidad de recuperarse rápidamente de dificultades"
"Ubiquitous","Que está presente en todas partes al mismo tiempo"
"Pragmatic","Enfoque práctico basado en consideraciones útiles"
```

## 🚀 Casos de Uso

### 🎓 Estudiantes Universitarios
- Memorizar conceptos de múltiples asignaturas
- Preparar exámenes con repaso espaciado
- Compartir mazos con compañeros (exportar/importar)

### 📚 Oposiciones
- Memorizar temarios extensos por temas
- Repasar legislación, artículos, conceptos clave
- Organizar por bloques con categorías

### 🌍 Aprendizaje de Idiomas
- Vocabulario con traducciones
- Verbos irregulares
- Frases y expresiones idiomáticas
- Pronunciación fonética

### 🩺 Estudiantes de Medicina
- Anatomía (huesos, músculos, órganos)
- Fármacos y posología
- Patologías y síntomas
- Protocolos médicos

### 💻 Programación
- Sintaxis de lenguajes
- Comandos Git/Terminal
- Conceptos de algoritmos
- Patrones de diseño

### ⚖️ Derecho
- Artículos de códigos
- Jurisprudencia
- Conceptos legales
- Procedimientos

## 💡 Metodología de Estudio Recomendada

### Configuración Inicial (10 min)
1. **Crear mazos por tema/asignatura**
2. **Asignar colores** para identificar rápidamente
3. **Categorizar** correctamente

### Añadir Contenido (continuo)
1. **Una tarjeta = Un concepto**: No mezclar ideas
2. **Pregunta clara y concisa**: Evitar ambigüedad
3. **Respuesta completa**: Incluye contexto si necesario
4. **Añadir diariamente**: Después de cada clase/tema

### Sesiones de Estudio (15-30 min/día)
1. **Barajar al inicio**: Evita memorizar por orden
2. **Intenta recordar** antes de voltear
3. **Repasa diariamente**: Mejor poco y frecuente que mucho de golpe
4. **Prioriza mazos olvidados**: Usa "Última vez estudiado"

### Workflow Óptimo
```
Lunes: Crear 10 tarjetas tema nuevo
Martes: Repasar ayer + Crear 10 nuevas
Miércoles: Repasar lunes + martes + Crear 10 nuevas
Jueves: Repasar lunes-miércoles + Crear 10 nuevas
Viernes: Repasar TODO + Crear 10 nuevas
Sábado: Repasar solo difíciles
Domingo: Descanso o repaso general
```

## 🔄 Import/Export: Casos Prácticos

### Caso 1: Backup Regular
```
Usuario → Exportar TODO a JSON → Guardar en Google Drive
Periodicidad: Cada semana o después de añadir muchas tarjetas
```

### Caso 2: Cambiar de Dispositivo
```
PC antiguo → Exportar JSON → Nuevo PC → Importar JSON
Resultado: Todos los mazos migrados sin duplicados
```

### Caso 3: Compartir con Compañeros
```
Estudiante A → Exportar JSON → Enviar por email → Estudiante B → Importar JSON
Resultado: Estudiante B tiene copia completa del mazo
```

### Caso 4: Análisis en Excel
```
Modo estudio → Exportar CSV mazo → Abrir en Excel → Revisar/editar → Crear nuevo mazo
```

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones 3D
- **JavaScript ES6**: Vanilla JS sin frameworks
- **LocalStorage API**: Persistencia de datos
- **Google Analytics**: Tracking de uso

## 📊 SEO y Metadatos

### Schema.org Implementado
- ✅ **EducationalApplication**: App educativa
- ✅ **BreadcrumbList**: Navegación jerárquica
- ✅ **FAQPage**: 5 preguntas frecuentes

### Keywords Optimizadas
- flashcards
- tarjetas estudio
- memorizar
- anki alternativa
- repaso espaciado
- fichas estudio
- app estudio
- oposiciones
- idiomas
- medicina

## ⚠️ Limitaciones y Consideraciones

### Limitaciones Técnicas
- **LocalStorage**: Límite ~5-10MB (suficiente para 10.000+ tarjetas)
- **Sin sincronización automática**: Datos en un navegador (usa JSON para migrar)
- **Sin imágenes**: Solo texto (posible añadir en futuras versiones)
- **Sin rich text**: No negrita/cursiva (solo texto plano)

### No es Recomendado Para
- ❌ Sistemas de repetición espaciada complejos (usa Anki)
- ❌ Tarjetas con mucho contenido multimedia (imágenes, audio, vídeo)
- ❌ Sincronización automática entre dispositivos

### Es Perfecto Para
- ✅ Estudio personal con tarjetas de texto
- ✅ Memorización rápida de conceptos
- ✅ Oposiciones, idiomas, medicina, derecho, programación
- ✅ Estudiantes que valoran privacidad
- ✅ Alternativa simple a Anki/Quizlet

## 🆚 Comparación con Otras Apps

| Característica | meskeIA | Anki | Quizlet |
|---------------|---------|------|---------|
| **Sin registro** | ✅ | ❌ | ❌ |
| **100% offline** | ✅ | ✅ | ❌ |
| **Privacidad total** | ✅ | ✅ | ❌ |
| **Gratis** | ✅ | ✅ | ⚠️ Freemium |
| **Simplicidad** | ✅ | ❌ Complejo | ✅ |
| **Flip animation** | ✅ | ⚠️ | ✅ |
| **Import/Export** | ✅ JSON/CSV | ✅ | ⚠️ Premium |
| **Repetición espaciada** | ❌ | ✅ Avanzado | ⚠️ Premium |
| **Imágenes** | ❌ | ✅ | ✅ |
| **Curva aprendizaje** | Baja | Alta | Media |

## 📞 Soporte

Para reportar errores o sugerir mejoras:
- Web: [meskeia.com](https://meskeia.com)
- Sección: Cursos Educativos > Creador de Flashcards

## 📄 Licencia

© 2025 meskeIA - Todos los derechos reservados

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
**Autor**: meskeIA

## 🌟 Dato Curioso

**¿Sabías que?** Estudios demuestran que el **repaso activo** con flashcards mejora la retención de memoria en un 150% comparado con solo releer apuntes. La técnica Feynman (explicar con tus palabras) combinada con flashcards es una de las formas más efectivas de aprender. ¡Estudiar inteligente, no solo mucho! 🧠
