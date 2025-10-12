# 🏃 Calculadora de Calorías por Ejercicio - meskeIA

Aplicación web para calcular las calorías quemadas según el tipo de ejercicio, pasos realizados y tiempo de actividad física.

## ✨ Características

### 🎯 Funcionalidades Principales

#### 1. **Perfil Personal**
- Peso (kg)
- Altura (cm)
- Edad (años)
- Sexo biológico (para cálculos precisos)
- Guardado automático en localStorage

#### 2. **12 Tipos de Ejercicio**
- 🚶 Caminar lento (3 km/h) - 2.5 MET
- 🚶 Caminar normal (4 km/h) - 3.5 MET
- 🚶‍♂️ Caminar rápido (5-6 km/h) - 4.5 MET
- 🏃 Trotar (7 km/h) - 7.0 MET
- 🏃‍♂️ Correr (8-9 km/h) - 8.5 MET
- 🏃‍♂️ Correr rápido (10+ km/h) - 11.0 MET
- 🚴 Ciclismo moderado - 6.0 MET
- 🚴‍♂️ Ciclismo intenso - 10.0 MET
- 🏊 Natación moderada - 6.0 MET
- 🪜 Subir escaleras - 8.0 MET
- ⛰️ Senderismo - 6.5 MET
- 💃 Bailar - 4.5 MET

#### 3. **Resultados Completos**
- 🔥 Calorías quemadas (kcal)
- 📏 Distancia recorrida (km) - si introduces pasos
- ⚡ MET de la actividad
- 🍎 Equivalencias de alimentos
- 📊 Progreso hacia meta de 10.000 pasos

#### 4. **Equivalencias de Alimentos**
Muestra cuántos alimentos has quemado:
- 🍎 Manzana (52 kcal)
- 🍌 Plátano (89 kcal)
- 🥤 Refresco lata (140 kcal)
- 🍫 Chocolate (235 kcal)
- 🥐 Croissant (231 kcal)
- 🍕 Porción pizza (285 kcal)
- 🍩 Donut (250 kcal)
- 🍺 Cerveza (153 kcal)

#### 5. **Historial de Actividades**
- Últimas 20 actividades guardadas
- Fecha, hora, tipo de ejercicio
- Calorías, pasos, distancia, duración
- Almacenamiento local (localStorage)

---

## 🧮 Fórmulas Utilizadas

### Cálculo de Calorías
```
Calorías = MET × Peso (kg) × Tiempo (horas)
```

**Donde**:
- **MET** (Metabolic Equivalent of Task) = Intensidad de la actividad
- **Peso** = Peso corporal en kilogramos
- **Tiempo** = Duración del ejercicio en horas

### Conversión Pasos → Distancia
```
Distancia (km) = Pasos × Zancada / 100.000

Zancada promedio:
- Hombre: 78 cm
- Mujer: 70 cm
```

### Progreso de Pasos
```
Porcentaje = (Pasos realizados / 10.000) × 100
Meta estándar: 10.000 pasos/día (OMS)
```

---

## 🎨 Diseño

### Paleta de Colores meskeIA
```css
--primary: #2E86AB       /* Azul meskeIA */
--secondary: #48A9A6     /* Teal meskeIA */
--bg-primary: #FAFAFA    /* Fondo principal */
--bg-card: #FFFFFF       /* Cards */
```

### Responsive Design
- ✅ Desktop (1024px+): Layout 2 columnas
- ✅ Tablet (768-1023px): Layout 1 columna
- ✅ Móvil (<768px): Optimizado táctil

---

## 🚀 Uso

### 1. Configurar Perfil (Primera Vez)
```
1. Completa peso, altura, edad y sexo
2. Click en "Guardar Perfil"
3. El perfil se colapsará automáticamente
```

### 2. Calcular Calorías
```
1. Selecciona tipo de ejercicio
2. Introduce pasos (opcional)
3. Introduce duración en minutos
4. Click en "Calcular Calorías"
```

### 3. Ver Resultados
- Calorías quemadas en grande
- Distancia (si hay pasos)
- MET de la actividad
- Equivalencias de alimentos
- Progreso hacia 10.000 pasos

### 4. Guardar Actividad
```
Click en "Guardar en Historial"
→ Se guarda en localStorage
→ Aparece en historial abajo
```

---

## 📊 Valores MET Estándar

| Actividad | MET | Intensidad |
|-----------|-----|------------|
| Caminar lento | 2.5 | Muy ligera |
| Caminar normal | 3.5 | Ligera |
| Caminar rápido | 4.5 | Moderada |
| Trotar | 7.0 | Vigorosa |
| Correr | 8.5 | Muy vigorosa |
| Correr rápido | 11.0 | Muy vigorosa |
| Ciclismo moderado | 6.0 | Moderada |
| Ciclismo intenso | 10.0 | Muy vigorosa |
| Natación | 6.0 | Moderada |
| Subir escaleras | 8.0 | Vigorosa |
| Senderismo | 6.5 | Moderada |
| Bailar | 4.5 | Moderada |

Fuente: Compendio de Actividades Físicas (Ainsworth et al.)

---

## 💾 Almacenamiento Local

### LocalStorage Keys

#### `user_profile`
```json
{
  "weight": 70,
  "height": 170,
  "age": 30,
  "sex": "male"
}
```

#### `activity_history`
```json
[
  {
    "activity": "walking-fast",
    "activityName": "Caminar rápido",
    "calories": 324,
    "met": 4.5,
    "steps": 8500,
    "distance": 6.6,
    "duration": 60,
    "timestamp": "2025-01-12T10:30:00.000Z"
  }
]
```

---

## ⚠️ Disclaimer Importante

Los cálculos son **estimaciones** basadas en fórmulas estándar (MET). Los valores reales pueden variar según:

- Metabolismo basal individual
- Condición física actual
- Eficiencia del movimiento
- Temperatura ambiente
- Pendiente del terreno
- Peso del equipo/ropa

**Consulta a un profesional de la salud** para planes de ejercicio personalizados.

---

## 🎯 Casos de Uso

### Ejemplo 1: Caminar para Perder Peso
```
Perfil: Mujer, 65kg, 165cm, 35 años
Actividad: Caminar rápido (5-6 km/h)
Duración: 45 minutos
Pasos: 6.000

Resultado: ~219 kcal quemadas
Distancia: ~4.2 km
Equivalencia: ≈ 4 manzanas o 1.5 refrescos
```

### Ejemplo 2: Correr para Fitness
```
Perfil: Hombre, 80kg, 180cm, 28 años
Actividad: Correr (8-9 km/h)
Duración: 30 minutos
Pasos: 4.500

Resultado: ~340 kcal quemadas
Distancia: ~3.5 km
Equivalencia: ≈ 1.4 croissants
```

### Ejemplo 3: Meta 10.000 Pasos
```
Perfil: Mujer, 60kg, 160cm, 45 años
Actividad: Caminar normal (4 km/h)
Duración: 90 minutos
Pasos: 10.000

Resultado: ~315 kcal quemadas
Distancia: ~7 km
Progreso: 100% de meta diaria ✓
```

---

## 📱 Atajos de Teclado

- **Ctrl/Cmd + Enter**: Calcular calorías
- **Ctrl/Cmd + S**: Guardar perfil
- **Tab**: Navegar entre campos

---

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox
- **JavaScript ES6**: Vanilla JS
- **LocalStorage API**: Persistencia de datos
- **Fórmulas MET**: Estándares científicos

---

## 📈 SEO Optimizado

### Keywords
- calculadora calorias ejercicio
- contador pasos calorias
- cuantas calorias quemo caminando
- calcular calorias quemadas corriendo
- MET ejercicio
- equivalencia pasos kilometros

### Schema.org
- ✅ WebApplication
- ✅ BreadcrumbList
- ✅ FAQPage

---

## 🌐 Integración en meskeIA

### Categoría
**Salud & Bienestar**

### Enlace
```html
<li><a href="calculadora-calorias-ejercicio/index.html">
    Calculadora de Calorías por Ejercicio
</a></li>
```

---

## 📊 Métricas de Éxito

### KPIs Esperados
- **Uso promedio**: 70% de visitantes calculan
- **Perfil guardado**: 50% guardan perfil
- **Historial**: 30% guardan actividades
- **Retorno**: 40% vuelven a usar

### Público Objetivo
- Personas activas (running, gym, walking)
- Usuarios intentando perder peso
- Deportistas aficionados
- Personas con metas de pasos diarios

---

## 🐛 Solución de Problemas

### No se calculan calorías
✓ Verifica que hayas guardado tu perfil
✓ Completa todos los campos obligatorios
✓ Introduce duración mayor a 0

### No se guarda el historial
✓ Verifica que localStorage esté habilitado
✓ No estés en modo incógnito
✓ Espacio disponible en navegador

### Los resultados parecen incorrectos
✓ Revisa que tu peso sea correcto
✓ Verifica la duración en minutos
✓ Comprueba el tipo de actividad seleccionado

---

## 🔄 Actualizaciones Futuras

- [ ] Gráficos de evolución semanal/mensual
- [ ] Exportar historial a CSV/PDF
- [ ] Más tipos de ejercicio (yoga, pilates, boxeo)
- [ ] Calculadora de zonas de frecuencia cardíaca
- [ ] Integración con API de fitness trackers
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

---

## 📝 Notas de Desarrollo

- **Fecha creación**: 12 de enero de 2025
- **Versión**: 1.0
- **Última actualización**: 12/01/2025
- **Desarrollado siguiendo**: CLAUDE.md estándares meskeIA

---

## 📞 Soporte

- **Email**: meskeia24@gmail.com
- **Web**: https://meskeia.com
- **Documentación**: Este archivo README.md

---

**© 2025 meskeIA** - Calculadora de Calorías por Ejercicio v1.0
Desarrollado con ❤️ siguiendo estándares meskeIA
