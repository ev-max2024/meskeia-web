# 💧 Calculadora de Hidratación Diaria - meskeIA

Aplicación web para calcular la cantidad exacta de agua que necesitas beber diariamente según tu peso, actividad física, clima, edad y otros factores personales.

## 🎯 Características Principales

### 📋 Perfil de Usuario
- **Peso corporal** (30-200 kg)
- **Edad** (10-100 años)
- **Sexo** (masculino/femenino)
- Almacenamiento local para uso continuado

### ⚙️ Factores de Ajuste Personalizados

#### Nivel de Actividad Física
- 🛋️ **Sedentario**: Sin ejercicio regular (×1.0)
- 🚶 **Ligero**: 1-3 días/semana (×1.1)
- 🏃 **Moderado**: 3-5 días/semana (×1.2)
- 💪 **Intenso**: 6-7 días/semana (×1.3)
- 🏅 **Atleta**: 2+ entrenamientos/día (×1.5)

#### Clima y Temperatura
- ❄️ **Frío** (< 15°C): Sin ajuste
- 🌤️ **Templado** (15-25°C): Base estándar
- ☀️ **Cálido** (25-35°C): +500ml
- 🔥 **Muy caluroso** (> 35°C): +1000ml

#### Ejercicio Adicional
- Tiempo de ejercicio específico del día
- +600ml por hora de actividad intensa

#### Ajuste por Edad
- Mayores de 60 años: +300ml (compensar menor sensación de sed)

### 📊 Resultados Detallados

#### Visualización Principal
- **Litros totales** recomendados por día
- Equivalencias en:
  - 🥤 Vasos de 250ml
  - 🍾 Botellas de 500ml
  - 💧 Botellas grandes de 1.5L

#### Desglose Completo
- Agua base por peso corporal
- Ajuste por actividad física habitual
- Ajuste por clima/temperatura
- Ajuste por edad
- Ajuste por ejercicio adicional del día

#### ⏰ Horario de Hidratación
- Distribución sugerida en 8 tomas diarias
- Horarios óptimos desde las 7:00 hasta las 21:00
- Cantidad exacta en ml por cada toma

### 📈 Tracker de Progreso Diario
- **Consumo actual** vs objetivo
- **Barra de progreso visual** con porcentaje
- Botones rápidos para añadir:
  - +250ml (1 vaso)
  - +500ml (1 botella)
  - +1L
- Persistencia diaria con localStorage
- Reinicio automático cada nuevo día

### 📜 Historial de Cálculos
- Almacena hasta 20 cálculos recientes
- Fecha y hora completa
- Todos los parámetros utilizados
- Posibilidad de eliminar entradas individuales

### 💡 Consejos de Hidratación
6 tips profesionales sobre:
- 🌅 Hidratación matutina
- 🏃‍♂️ Antes, durante y después del ejercicio
- 🍽️ Agua con las comidas
- 🎨 Monitoreo del color de la orina
- ⏰ Recordatorios regulares
- 🥤 Acceso constante al agua

## 🧮 Fórmulas Científicas Utilizadas

### Cálculo Base
```javascript
agua_base = peso_kg × tasa_ml_por_kg / 1000

// Tasas según sexo:
// Hombres: 35 ml/kg
// Mujeres: 32 ml/kg
```

### Ajuste por Actividad
```javascript
ajuste_actividad = agua_base × (multiplicador_actividad - 1)

// Multiplicadores:
// Sedentario: 1.0
// Ligero: 1.1 (+10%)
// Moderado: 1.2 (+20%)
// Intenso: 1.3 (+30%)
// Atleta: 1.5 (+50%)
```

### Ajuste por Clima
```javascript
ajuste_clima = litros_adicionales

// Adicionales:
// Frío: 0 L
// Templado: 0 L
// Cálido: +0.5 L
// Muy caluroso: +1.0 L
```

### Ajuste por Edad
```javascript
ajuste_edad = edad > 60 ? +0.3 L : 0 L
```

### Ajuste por Ejercicio Adicional
```javascript
ajuste_ejercicio = (minutos / 60) × 0.6 L
// 600ml por hora de ejercicio
```

### Total Final
```javascript
total_agua = agua_base + ajuste_actividad + ajuste_clima + ajuste_edad + ajuste_ejercicio
```

## 🎨 Diseño y UX

### Paleta de Colores meskeIA
- **Azul principal**: `#2E86AB`
- **Teal secundario**: `#48A9A6`
- **Fondo**: `#FAFAFA`
- **Cards**: `#FFFFFF`
- Diseño minimalista inspirado en Claude

### Responsive Design
- ✅ Diseño mobile-first
- ✅ Adaptación perfecta a tablets
- ✅ Grid system flexible
- ✅ Touch-friendly en todos los dispositivos

### Animaciones
- Transiciones suaves en cards
- Efectos hover interactivos
- Barra de progreso animada
- Feedback visual en botones

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript ES6**: Vanilla JS sin dependencias
- **LocalStorage API**: Persistencia de datos
- **Google Analytics**: Seguimiento de uso

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

### Open Graph y Twitter Cards
- Metadatos completos para redes sociales
- Imagen y descripción optimizadas

### Keywords Optimizadas
- calculadora hidratacion
- cuanta agua tomar
- litros agua diarios
- hidratacion por peso
- calculadora agua diaria
- cuantos vasos agua
- hidratacion ejercicio
- agua necesaria

## 🎓 Bases Científicas

### Referencias
- Recomendaciones de la **Organización Mundial de la Salud (OMS)**
- Estudios sobre necesidades hídricas del **American College of Sports Medicine**
- Guidelines de hidratación de la **European Food Safety Authority (EFSA)**

### Principios Aplicados
1. **Base por peso**: 30-35 ml/kg es el estándar internacional
2. **Actividad física**: Pérdidas por sudoración según intensidad
3. **Termorregulación**: Ajuste por temperatura ambiental
4. **Edad**: Menor sensación de sed en personas mayores
5. **Distribución temporal**: 8 tomas optimizan la absorción

## 🚀 Uso de la Aplicación

### Primer Uso
1. **Completa tu perfil**: Peso, edad, sexo
2. **Guarda tu perfil**: Para uso continuado
3. **Selecciona factores**: Actividad, clima, ejercicio del día
4. **Calcula**: Obtén tu recomendación personalizada

### Uso Diario
1. **Revisa tu objetivo**: Total de litros/día
2. **Sigue el horario**: 8 tomas distribuidas
3. **Usa el tracker**: Registra tu consumo
4. **Alcanza tu meta**: 100% de hidratación

### Historial
1. **Guarda cálculos importantes**
2. **Compara diferentes días**
3. **Ajusta según necesites**

## 🌟 Casos de Uso

### Deportistas
- Calcular hidratación pre/post entrenamiento
- Ajustar por intensidad y duración
- Optimizar recuperación

### Personas Mayores
- Compensar menor sensación de sed
- Prevenir deshidratación
- Mantener salud renal

### Climas Extremos
- Viajar a destinos cálidos
- Trabajar en exteriores
- Prevenir golpes de calor

### Control de Peso
- Acompañar dietas equilibradas
- Mejorar metabolismo
- Reducir retención de líquidos

### Salud General
- Mejorar función renal
- Optimizar digestión
- Mantener piel saludable

## 💡 Tips Profesionales

### Hidratación Óptima
- **Nunca esperes a tener sed**: La sed indica deshidratación leve
- **Orina amarillo claro**: Indicador de buena hidratación
- **Distribuye el consumo**: 8 tomas mejor que 2-3 grandes
- **Agua a temperatura ambiente**: Se absorbe más rápido

### Durante el Ejercicio
- **30 min antes**: 400-600ml
- **Cada 15-20 min**: 150-250ml
- **Post-ejercicio**: 500-700ml por cada kg perdido

### Errores Comunes
- ❌ Beber solo cuando tienes sed
- ❌ Consumir toda el agua en 2-3 tomas
- ❌ No ajustar por clima/actividad
- ❌ Sustituir agua por bebidas azucaradas

## 📞 Soporte

Para reportar errores o sugerir mejoras:
- Web: [meskeia.com](https://meskeia.com)
- Sección: Salud & Bienestar > Calculadora de Hidratación

## 📄 Licencia

© 2025 meskeIA - Todos los derechos reservados

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
**Autor**: meskeIA
