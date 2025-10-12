# 📅 Generador de Horarios de Estudio

**Versión:** 1.0.0
**Autor:** meskeIA
**Licencia:** Uso personal y educativo

---

## 📖 Descripción

Aplicación web gratuita para crear **horarios de estudio personalizados** con distribución inteligente de tiempo. Ideal para estudiantes universitarios, opositores, estudiantes de bachillerato y autodidactas que desean optimizar su tiempo de estudio.

### ✨ Características Principales

- 📚 **Gestión de Asignaturas**: Añade asignaturas con horas semanales y prioridades
- 🕐 **Disponibilidad Flexible**: Configura tu disponibilidad por días y franjas horarias
- 🎯 **Distribución Inteligente**: Algoritmo que reparte las horas de forma equilibrada
- 📅 **Calendario Visual**: Vista semanal clara con código de colores por asignatura
- ⏱️ **Técnica Pomodoro**: Soporte para sesiones de 25, 50 o 90 minutos
- 💾 **Persistencia Local**: Guarda automáticamente tu configuración en el navegador
- 📸 **Export a PNG**: Descarga tu horario como imagen para imprimirlo o compartirlo
- 🎨 **Diseño Responsive**: Funciona perfectamente en PC, tablet y móvil

---

## 🚀 Uso Rápido

### 1. Añadir Asignaturas

En la sección **"Mis Asignaturas"**:
- Escribe el nombre de la asignatura (ej: "Matemáticas", "Derecho Civil")
- Indica las horas semanales que quieres dedicarle (1-40h)
- Selecciona la prioridad:
  - ⭐ **Baja**: Asignaturas aprobadas o de repaso ligero
  - ⭐⭐ **Media**: Asignaturas sin urgencia especial
  - ⭐⭐⭐ **Alta**: Asignaturas importantes (predeterminado)
  - ⭐⭐⭐⭐ **Muy Alta**: Asignaturas con examen próximo
  - 🔥 **Urgente**: Asignaturas críticas o con examen inminente

**Ejemplo:**
```
Álgebra Lineal      | 6h/semana | ⭐⭐⭐⭐ Muy Alta
Programación Java   | 5h/semana | ⭐⭐⭐ Alta
Historia Moderna    | 3h/semana | ⭐⭐ Media
```

### 2. Configurar Disponibilidad

Marca los checkboxes en la sección **"Disponibilidad Horaria"**:

**Franjas horarias:**
- 🌅 **Mañana**: 9:00 - 14:00 (5 horas disponibles)
- 🌆 **Tarde**: 15:00 - 20:00 (5 horas disponibles)
- 🌙 **Noche**: 21:00 - 23:00 (2 horas disponibles)

**Ejemplo típico (estudiante universitario):**
- **Lunes-Viernes**: Mañana + Tarde ✅
- **Sábado**: Solo Mañana ✅
- **Domingo**: Descanso ❌

### 3. Seleccionar Preferencias

- **⏱️ Duración de sesiones:**
  - `25 min (Pomodoro)`: Para concentración intensa y descansos frecuentes
  - `50 min (Clase estándar)`: Equilibrio entre concentración y descanso (recomendado)
  - `90 min (Sesión larga)`: Para estudio profundo sin interrupciones

- **☕ Descansos:**
  - `5 min`: Para Pomodoro (25 min estudio + 5 min descanso)
  - `10 min`: Para sesiones estándar
  - `15 min`: Para sesiones largas

### 4. Generar Horario

Haz clic en **"🎯 Generar Horario"** y el algoritmo:
1. Calcula el total de horas necesarias
2. Verifica que hay suficientes slots disponibles
3. Distribuye las asignaturas por prioridad
4. Alterna asignaturas para evitar monotonía
5. Respeta tu disponibilidad horaria

### 5. Exportar y Usar

- **📸 Exportar PNG**: Descarga tu horario como imagen
- **🗑️ Limpiar Todo**: Reinicia completamente (elimina asignaturas y horario)
- **⬅️ Volver a Configuración**: Edita asignaturas o disponibilidad

---

## 🧠 Algoritmo de Distribución

### Funcionamiento Interno

El generador utiliza un **algoritmo de distribución proporcional con priorización**:

```javascript
1. Ordenar asignaturas por prioridad (mayor a menor)
2. Para cada asignatura (desde más prioritaria):
   a. Calcular horas restantes por asignar
   b. Buscar slots disponibles en el calendario
   c. Asignar sesiones hasta completar horas semanales
   d. Alternar días para distribución equilibrada
3. Si quedan horas sin asignar → Advertir al usuario
4. Generar vista de calendario con código de colores
```

### Ejemplo de Distribución

**Entrada:**
- Álgebra: 6h/semana, Prioridad 5 (Urgente)
- Programación: 5h/semana, Prioridad 3 (Alta)
- Historia: 3h/semana, Prioridad 2 (Media)
- Disponibilidad: Lunes-Viernes (Mañana + Tarde), Sábado (Mañana)
- Sesiones: 50 min

**Salida:**
```
         Lun       Mar       Mié       Jue       Vie       Sáb
Mañana   Álgebra   Program.  Álgebra   Historia  Program.  Álgebra
Tarde    Program.  Álgebra   Historia  Álgebra   Historia  —
Noche    —         —         —         —         —         —
```

**Resultado:**
- ✅ Álgebra: 5 sesiones × 50 min = ~4h (66% cumplimiento)
- ✅ Programación: 4 sesiones × 50 min = ~3.3h (66% cumplimiento)
- ✅ Historia: 3 sesiones × 50 min = 2.5h (83% cumplimiento)

**Nota:** Si las horas solicitadas superan las disponibles, la app muestra una advertencia.

---

## 💡 Casos de Uso

### 1. Estudiante Universitario (Grado)

**Perfil:**
- 5-7 asignaturas simultáneas
- 30-40h estudio/semana
- Clases presenciales por la mañana

**Configuración recomendada:**
- **Asignaturas:** 5h/semana cada una
- **Disponibilidad:** Lunes-Viernes (Tarde + Noche), Fin de semana (Mañana)
- **Sesiones:** 50 min con 10 min descanso

---

### 2. Opositor

**Perfil:**
- 8-12 temas grandes
- 50-60h estudio/semana
- Dedicación exclusiva

**Configuración recomendada:**
- **Asignaturas:** Por bloques temáticos (ej: "Derecho Administrativo I", "Derecho Administrativo II")
- **Disponibilidad:** Lunes-Domingo (Mañana + Tarde + Noche)
- **Sesiones:** 90 min con 15 min descanso
- **Prioridad:** Urgente para temas de examen próximo

---

### 3. Estudiante de Bachillerato (EBAU)

**Perfil:**
- 10-12 asignaturas
- 20-30h estudio/semana
- Clases por la mañana

**Configuración recomendada:**
- **Asignaturas:** 2-3h/semana cada una
- **Disponibilidad:** Lunes-Viernes (Tarde), Fin de semana (Mañana + Tarde)
- **Sesiones:** 50 min con 10 min descanso
- **Prioridad Alta:** Matemáticas, Lengua, Inglés, asignaturas troncales

---

### 4. Bootcamp/Cursos Online

**Perfil:**
- 3-5 módulos simultáneos
- 40-50h estudio/semana
- Proyectos prácticos + teoría

**Configuración recomendada:**
- **Asignaturas:** "JavaScript", "React", "Node.js", "Proyecto Final"
- **Disponibilidad:** Lunes-Sábado (Mañana + Tarde + Noche)
- **Sesiones:** 90 min para proyectos, 50 min para teoría
- **Prioridad Urgente:** Proyecto Final

---

## 📊 Ventajas vs Alternativas

| Característica | meskeIA | Google Calendar | My Study Life | Notion |
|----------------|---------|-----------------|---------------|--------|
| **Gratuito** | ✅ | ✅ | ✅ Básico | ✅ Básico |
| **Sin registro** | ✅ | ❌ | ❌ | ❌ |
| **Distribución automática** | ✅ | ❌ Manual | ✅ | ❌ Manual |
| **Técnica Pomodoro** | ✅ | ❌ | ❌ | ❌ |
| **Export PNG** | ✅ | ❌ | ❌ | ✅ |
| **Funciona offline** | ✅ | ❌ | ❌ | ❌ |
| **Priorización inteligente** | ✅ | ❌ | ✅ | ❌ |
| **Diseño minimalista** | ✅ | ❌ | ⚠️ | ⚠️ |
| **100% privado** | ✅ | ❌ | ❌ | ❌ |

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid Layout, diseño responsive
- **JavaScript ES6**: Vanilla JS (sin frameworks)
- **LocalStorage**: Persistencia de datos local
- **html2canvas**: Librería para export a PNG
- **Google Analytics**: Estadísticas de uso anónimas

---

## 🎨 Paleta de Colores (meskeIA)

```css
--primary: #2E86AB      /* Azul meskeIA */
--secondary: #48A9A6    /* Teal meskeIA */
--success: #2A9D8F      /* Verde */
--danger: #E76F51       /* Rojo */
--bg-primary: #FAFAFA   /* Background principal */
--bg-card: #FFFFFF      /* Cards */
```

---

## 💾 Almacenamiento de Datos

### LocalStorage Keys

```javascript
'schedule_subjects'  // Array de asignaturas
'schedule_data'      // Horario generado
```

### Estructura de Datos

**Asignatura:**
```javascript
{
    id: 1705075200000,
    name: "Álgebra Lineal",
    hoursPerWeek: 6,
    priority: 5,
    color: "#2E86AB"
}
```

**Sesión de Horario:**
```javascript
{
    day: "lunes",
    slot: "mañana",
    subject: "Álgebra Lineal",
    color: "#2E86AB",
    duration: 50,
    hours: 0.83
}
```

---

## 🔒 Privacidad y Seguridad

- ✅ **100% local**: Todos los datos se guardan en tu navegador (localStorage)
- ✅ **Sin servidores**: No se envía información a servidores externos
- ✅ **Sin registro**: No requiere cuenta ni email
- ✅ **Sin cookies**: Solo Google Analytics para estadísticas anónimas
- ✅ **Código abierto**: Puedes auditar el código fuente

**Nota:** Si borras el caché del navegador, perderás tus datos. Usa la opción "Exportar PNG" para hacer backup visual.

---

## 🐛 Limitaciones Conocidas (v1.0)

1. **No hay edición manual de slots**: Si quieres cambiar una sesión específica, debes regenerar el horario
2. **No hay sincronización**: Los datos solo están en tu navegador actual
3. **No hay recordatorios**: Es un planificador estático, no envía notificaciones
4. **No hay estadísticas de cumplimiento**: No rastrea si cumpliste tu horario
5. **Export solo PNG**: No hay export a PDF ni integración con Google Calendar

---

## 🚀 Futuras Mejoras (v2.0)

- [ ] Edición manual de slots (drag & drop)
- [ ] Export a PDF con más opciones de diseño
- [ ] Modo "Examen próximo" con redistribución automática
- [ ] Estadísticas de cumplimiento (marcar sesiones completadas)
- [ ] Sincronización con Google Calendar (opcional)
- [ ] Plantillas predefinidas (Universitario, Opositor, Bachillerato)
- [ ] Modo oscuro
- [ ] Idioma inglés

---

## 📞 Soporte y Contacto

- **Email:** meskeia24@gmail.com
- **Web:** [meskeia.com](https://meskeia.com)
- **Aplicación:** [meskeia.com/generador-horarios-estudio](https://meskeia.com/generador-horarios-estudio/)

---

## 📜 Notas de Versión

### v1.0.0 (Enero 2025)
- ✅ Lanzamiento inicial
- ✅ Gestión de asignaturas con prioridades
- ✅ Algoritmo de distribución inteligente
- ✅ Calendario visual semanal
- ✅ Export a PNG
- ✅ Persistencia en localStorage
- ✅ Diseño responsive con paleta meskeIA
- ✅ SEO completo con Schema.org

---

## 🎓 Consejos de Estudio

### Técnica Pomodoro
1. **Trabaja 25 minutos** sin distracciones
2. **Descansa 5 minutos** (levántate, hidrátate)
3. **Repite 4 veces**
4. **Descansa 15-30 minutos** largo

### Priorización de Asignaturas
- **Urgente (🔥)**: Examen en < 1 semana
- **Muy Alta (⭐⭐⭐⭐)**: Examen en 1-2 semanas
- **Alta (⭐⭐⭐)**: Asignatura importante general
- **Media (⭐⭐)**: Asignatura sin urgencia
- **Baja (⭐)**: Repaso o asignatura aprobada

### Optimización del Tiempo
- 🌅 **Mañana**: Tareas que requieren máxima concentración (matemáticas, programación)
- 🌆 **Tarde**: Tareas intermedias (teoría, ejercicios)
- 🌙 **Noche**: Repaso ligero, lectura

---

## ❓ Preguntas Frecuentes (FAQ)

**1. ¿El horario se guarda automáticamente?**
Sí, cada cambio se guarda en localStorage de tu navegador.

**2. ¿Puedo usar la app offline?**
Sí, una vez cargada funciona sin internet (excepto el export PNG que requiere la librería html2canvas).

**3. ¿Qué pasa si las horas necesarias superan mi disponibilidad?**
La app muestra una advertencia indicando cuántas horas faltan. Debes reducir horas de asignaturas o añadir más franjas disponibles.

**4. ¿Puedo cambiar manualmente una sesión del horario?**
En v1.0 no. Debes ajustar prioridades o disponibilidad y regenerar el horario.

**5. ¿Los datos se sincronizan entre dispositivos?**
No, los datos solo están en el navegador actual. Usa "Exportar PNG" para hacer backup.

---

**© 2025 meskeIA - Biblioteca de Aplicaciones Web Gratuitas**
