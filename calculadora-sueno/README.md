# 😴 Calculadora de Sueño y Ciclos - meskeIA

Aplicación web para calcular los mejores horarios de sueño basados en ciclos REM de 90 minutos. Descubre a qué hora acostarte para despertar descansado o cuándo poner la alarma según tu hora de dormir.

## 🎯 Características Principales

### ⏰ Dos Modos de Cálculo

#### Modo 1: Sé mi Hora de Despertar
- Introduces la hora a la que **necesitas despertar**
- La app te muestra **6 opciones de horarios** para acostarte
- Desde 3 hasta 6 ciclos completos (4.5h - 9h)
- Garantiza despertar al final de un ciclo REM

#### Modo 2: Sé mi Hora de Acostarme
- Introduces la hora a la que **te vas a la cama**
- La app te muestra **6 alarmas recomendadas**
- Para despertar al completar 3, 4, 5 o 6 ciclos
- Optimiza el descanso según tus ciclos naturales

### ⏱️ Personalización Avanzada

- **Tiempo de Dormirse**: Ajusta cuánto tardas en dormirte (5-60 min)
- **Valor por defecto**: 14 minutos (promedio científico)
- Cálculo preciso considerando la fase de conciliación del sueño

### 📊 Tracker de Sueño Semanal

#### Registro Diario
- **Hora de acostarse**
- **Hora de despertar**
- **Calidad del sueño** (escala 1-5 estrellas)
- Cálculo automático de:
  - Duración total en horas
  - Número de ciclos completados

#### Estadísticas Personalizadas
- **Promedio de horas** dormidas
- **Promedio de ciclos** completados
- **Noches registradas** en total
- Historial visual de últimos 7 días

#### Persistencia de Datos
- Almacenamiento local con localStorage
- Hasta 30 días de historial
- Eliminar entradas individuales
- Sin necesidad de cuenta o registro

### 📚 Información Educativa

#### Las 4 Fases del Ciclo de Sueño
1. **🌙 Fase 1: Sueño Ligero** (5-10 min)
   - Transición vigilia → sueño
   - Fácil despertar
   - Relajación muscular progresiva

2. **💤 Fase 2: Sueño Profundo Inicial** (20 min)
   - 50% del tiempo total de sueño
   - Disminuye temperatura corporal
   - Ritmo cardíaco se ralentiza

3. **😴 Fase 3-4: Sueño Profundo** (30 min)
   - Fase reparadora del cuerpo
   - Regeneración celular
   - Consolidación de memoria
   - Muy difícil despertar

4. **🌟 Fase REM** (20-25 min)
   - Movimientos oculares rápidos
   - Sueños vívidos
   - Consolidación de aprendizaje
   - Actividad cerebral intensa

**⏱️ Duración total del ciclo**: ~90 minutos (1.5 horas)

### 👥 Recomendaciones por Edad

| Grupo de Edad | Horas Recomendadas | Ciclos |
|--------------|-------------------|---------|
| 👶 **Bebés** (4-12 meses) | 12-16 horas | Incluyendo siestas |
| 🧒 **Niños** (1-5 años) | 10-14 horas | Incluyendo siestas |
| 👦 **Escolares** (6-12 años) | 9-12 horas | 6-8 ciclos |
| 👨‍🎓 **Adolescentes** (13-18 años) | 8-10 horas | 5-6 ciclos |
| 👨 **Adultos** (18-64 años) | **7-9 horas** | **4-6 ciclos** |
| 👴 **Adultos mayores** (65+ años) | 7-8 horas | 4-5 ciclos |

### 💡 Consejos de Higiene del Sueño

#### 🌅 Rutina Constante
- Acuéstate y despierta a la misma hora todos los días
- Incluye fines de semana para regular el ritmo circadiano

#### 🌡️ Temperatura Ideal
- Mantén tu habitación fresca: **15-19°C**
- El cuerpo necesita bajar temperatura para dormir profundo

#### 🌑 Oscuridad Total
- Usa cortinas opacas o antifaz
- La luz inhibe la melatonina (hormona del sueño)

#### 📱 Sin Pantallas
- Evita móviles, tablets y TV **1 hora antes** de dormir
- La luz azul altera el ritmo circadiano natural

#### ☕ Evita Estimulantes
- No consumas cafeína **6 horas antes** de dormir
- Evita alcohol y comidas pesadas antes de acostarte

#### 🏃‍♂️ Ejercicio Regular
- Haz ejercicio durante el día
- Evita ejercicio intenso **3 horas antes** de dormir

## 🧮 Ciencia Detrás de la Calculadora

### Fórmula de Cálculo

#### Para calcular hora de acostarme:
```javascript
hora_acostarme = hora_despertar - (ciclos × 90 min) - tiempo_dormirse

// Ejemplo: Despertar a las 7:00, 5 ciclos, 14 min dormirse
// 7:00 - (5 × 90) - 14 = 7:00 - 450 - 14 = 7:00 - 464 min
// = 7:00 - 7h 44min = 23:16 (del día anterior)
```

#### Para calcular hora de despertar:
```javascript
hora_despertar = hora_acostarme + tiempo_dormirse + (ciclos × 90 min)

// Ejemplo: Acostarme a las 23:00, 14 min dormirse, 6 ciclos
// 23:00 + 14 + (6 × 90) = 23:00 + 14 + 540 = 23:00 + 554 min
// = 23:00 + 9h 14min = 8:14 (del día siguiente)
```

### Base Científica

#### Ciclo de 90 Minutos
- **Descubrimiento**: Dr. Nathaniel Kleitman (1953)
- **Metodología**: Estudios de electroencefalografía (EEG)
- **Consenso**: Validado por National Sleep Foundation

#### Importancia de Despertar Entre Ciclos
- **Fase REM ligera**: Mejor momento para despertar naturalmente
- **Sueño profundo**: Despertar causa inercia del sueño (grogginess)
- **Alertas**: Despertar entre ciclos aumenta sensación de descanso en 40%

#### Tiempo de Conciliación
- **Promedio saludable**: 10-20 minutos
- **< 5 minutos**: Posible privación crónica de sueño
- **> 30 minutos**: Posible insomnio o ansiedad

### Referencias Científicas
- National Sleep Foundation (2015): "Sleep Duration Recommendations"
- American Academy of Sleep Medicine (2017): "Healthy Sleep Habits"
- Journal of Sleep Research (2019): "Sleep Cycles and Wake Quality"

## 🎨 Diseño y UX

### Paleta de Colores meskeIA
- **Azul principal**: `#2E86AB`
- **Teal secundario**: `#48A9A6`
- **Fondo**: `#FAFAFA`
- **Cards**: `#FFFFFF`

### Responsive Design
- ✅ Mobile-first approach
- ✅ Adaptación perfecta a tablets
- ✅ Touch-friendly en todos los dispositivos
- ✅ Selector de tiempo optimizado para móviles

### Animaciones Suaves
- Transiciones en cards
- Efectos hover interactivos
- Pulse animation en opciones de tiempo
- Feedback visual en todas las acciones

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript ES6**: Vanilla JS sin dependencias
- **LocalStorage API**: Persistencia de datos
- **Input Type Time**: Selector nativo de hora

## 📱 Funcionalidad Offline

- ✅ Sin dependencias externas
- ✅ Funciona 100% offline
- ✅ Datos guardados localmente
- ✅ Sin necesidad de conexión

## 🔐 Privacidad

- ✅ Datos almacenados solo en tu navegador
- ✅ No se envía información a servidores
- ✅ Sin cookies de terceros
- ✅ Control total de tus datos

## 📊 SEO y Metadatos

### Schema.org Implementado
- ✅ **WebApplication**: Identificación de la app
- ✅ **BreadcrumbList**: Navegación jerárquica
- ✅ **FAQPage**: Preguntas frecuentes estructuradas

### Keywords Optimizadas
- calculadora sueño
- ciclos de sueño
- a que hora dormir
- calculadora REM
- despertar descansado
- ciclos REM
- cuando acostarme
- alarma optima

## 🚀 Casos de Uso

### 🎓 Estudiantes
- Optimizar horas de estudio vs descanso
- Maximizar consolidación de memoria
- Preparación para exámenes

### 💼 Trabajadores por Turnos
- Ajustar horarios rotativos
- Minimizar jet lag social
- Mantener consistencia de sueño

### 🏋️ Deportistas
- Optimizar recuperación muscular
- Mejorar rendimiento físico
- Planificar entrenamientos matutinos

### 👨‍💼 Profesionales
- Despertar sin alarma estresante
- Empezar día con energía
- Mejorar productividad diaria

### 🧓 Personas Mayores
- Adaptar a cambios de sueño con edad
- Mejorar calidad vs cantidad
- Reducir despertares nocturnos

## 💡 Tips de Uso

### Primera Vez
1. **Elige tu modo**: ¿Sabes cuándo despertar o cuándo dormirás?
2. **Ajusta tiempo de dormirse**: Personaliza según tu experiencia
3. **Revisa las 6 opciones**: Elige la que mejor se adapte
4. **Prueba durante 1 semana**: Observa qué ciclo te funciona mejor

### Uso Diario
1. **Calcula tu horario**: Según tu rutina del día siguiente
2. **Configura alarma**: En la hora recomendada
3. **Registra tu sueño**: Usa el tracker al despertar
4. **Analiza patrones**: Revisa estadísticas semanales

### Optimización
1. **Consistencia es clave**: Usa la misma hora varios días
2. **Ajusta gradualmente**: Cambios de 15-30 min máximo
3. **Trackea calidad**: Correlaciona con actividades del día
4. **Experimenta**: Prueba 5 vs 6 ciclos según tu cuerpo

## ⚠️ Consideraciones Importantes

### No es Diagnóstico Médico
- Esta herramienta es **orientativa**
- No sustituye consejo médico profesional
- Consulta especialista si tienes trastornos del sueño

### Variabilidad Individual
- Los ciclos pueden variar entre **80-110 minutos**
- Edad, genética y salud influyen
- Usa como punto de partida, ajusta según necesites

### Factores Externos
- Estrés, cafeína, alcohol alteran ciclos
- Medicamentos pueden afectar arquitectura del sueño
- Considera estos factores al interpretar resultados

## 📞 Soporte

Para reportar errores o sugerir mejoras:
- Web: [meskeia.com](https://meskeia.com)
- Sección: Salud & Bienestar > Calculadora de Sueño

## 📄 Licencia

© 2025 meskeIA - Todos los derechos reservados

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
**Autor**: meskeIA

## 🌟 Dato Curioso

**¿Sabías que?** Los ciclos de sueño no solo ocurren de noche. Durante el día, tu cuerpo experimenta ciclos ultradianos de ~90 minutos de atención/distracción. Por eso muchas técnicas de productividad recomiendan descansos cada 90 minutos. ¡Tu cerebro ama los ciclos de 90 minutos!
