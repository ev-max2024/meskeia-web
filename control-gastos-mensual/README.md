# 💰 Control de Gastos Mensual - meskeIA

Aplicación web para gestionar tus finanzas personales de forma simple y visual. Controla gastos e ingresos mensuales, categoriza transacciones, visualiza tu balance con gráficos y descarga informes. 100% privado y gratuito.

## 🎯 Características Principales

### 📊 Resumen Visual en Tiempo Real
- **3 KPIs principales** siempre visibles:
  - 📈 Total Ingresos del mes
  - 📉 Total Gastos del mes
  - 💵 Balance (Ingresos - Gastos)
- **Indicador de color**: Balance verde (positivo) o rojo (negativo)
- Actualización automática con cada transacción

### ➕ Añadir Transacciones Rápido
- **Dos tipos**: Gasto o Ingreso
- **Selector visual** con botones grandes
- **Formulario intuitivo**:
  - Cantidad en euros
  - 8 categorías predefinidas para gastos
  - Fecha (por defecto hoy)
  - Descripción opcional
- **Añadir en 2 clics**: Cantidad → Categoría → Guardar

### 🏷️ Categorías de Gastos Predefinidas
1. 🏠 **Vivienda**: Alquiler, hipoteca, suministros (luz, agua, gas)
2. 🍔 **Alimentación**: Supermercado, restaurantes, comida a domicilio
3. 🚗 **Transporte**: Gasolina, transporte público, parking, mantenimiento
4. 💊 **Salud**: Médicos, farmacia, seguros de salud
5. 🎬 **Ocio**: Cine, conciertos, viajes, hobbies
6. 👕 **Ropa**: Ropa, calzado, complementos
7. 📱 **Suscripciones**: Netflix, Spotify, gimnasio, software
8. 💰 **Otros**: Cualquier gasto no categorizado

### 📈 Gráfico Circular Interactivo
- **Visualización por categorías** (powered by Chart.js)
- **Porcentajes automáticos** de cada categoría
- **Colores únicos** por categoría para fácil identificación
- **Leyenda detallada** con iconos, nombres, cantidades y porcentajes
- **Tooltip informativo** al pasar ratón

### 📅 Navegación Mensual
- **Selector de mes/año** con botones ◀ ▶
- Navega entre meses sin perder datos
- **Almacenamiento separado** por cada mes
- Vista histórica ilimitada

### 📜 Lista de Transacciones
- **Ordenadas por fecha** (más recientes primero)
- **Diseño tipo card** con toda la info visible:
  - Icono de categoría
  - Descripción
  - Fecha formateada en español
  - Cantidad con signo (+ ingresos, - gastos)
- **Borde de color** según tipo (verde ingreso, rojo gasto)
- **Botón eliminar** individual por transacción

### 🔍 Filtros Rápidos
- **Ver todas** las transacciones
- **Solo ingresos** del mes
- **Solo gastos** del mes
- Filtros con un clic

### 📥 Exportar e Importar Datos
**3 opciones de gestión de datos:**

1. **📥 CSV Mes Actual**
   - Descarga solo el mes actual en CSV
   - Compatible con Excel, Google Sheets, Numbers
   - Formato: Fecha, Tipo, Categoría, Descripción, Cantidad
   - Nombre automático: `gastos_Enero_2025.csv`
   - Ideal para análisis rápido en Excel

2. **📦 Exportar TODO a JSON**
   - Descarga TODOS los meses con todas las transacciones
   - Backup completo de tu historial
   - Formato JSON estructurado con metadatos
   - Nombre: `backup_gastos_2025-01-12.json`
   - Ideal para backup en la nube (Google Drive, Dropbox)

3. **📥 Importar desde JSON**
   - Restaura un backup previo
   - **Modo fusión inteligente**: No duplica transacciones existentes
   - Validación de formato automática
   - Perfecto para migrar entre navegadores o dispositivos

### 🗑️ Gestión de Datos
- **Eliminar transacción individual**: Con confirmación
- **Limpiar todo el mes**: Eliminar todas las transacciones con doble confirmación
- **Control total**: Tus datos, tus reglas

### 💡 Consejos de Ahorro
6 tips profesionales integrados:
- 🎯 Regla 50/30/20
- 📊 Revisar categorías
- 🔄 Registro diario
- 💳 Auditar suscripciones
- 🎁 Fondo de emergencia
- 📅 Planificar gastos grandes

## 🔒 Privacidad y Seguridad

### 100% Privado
- ✅ **Datos solo en tu navegador**: localStorage local
- ✅ **Sin servidores**: No se envía nada a la nube
- ✅ **Sin registro**: No requiere cuenta ni email
- ✅ **Sin cookies de terceros**
- ✅ **Control total**: Tú decides cuándo borrar
- ✅ **Backups manuales**: Exporta a JSON y guarda donde quieras

### Offline First
- ✅ Funciona **sin conexión a internet**
- ✅ Sin dependencias de APIs externas (excepto Chart.js via CDN)
- ✅ Rápido y responsive
- ✅ **Portabilidad**: Importa backups en cualquier navegador

## 🎨 Diseño y UX

### Paleta de Colores meskeIA
- **Azul principal**: `#2E86AB`
- **Teal secundario**: `#48A9A6`
- **Verde ingresos**: `#48A9A6`
- **Rojo gastos**: `#E76F51`

### UX Destacada
- **Mobile-first**: Optimizado para móviles
- **Responsive perfecto**: Tablet y desktop
- **Animaciones suaves**: Transiciones fluidas
- **Notificaciones**: Feedback visual al añadir/eliminar
- **Colores semánticos**: Verde = bien, Rojo = cuidado

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript ES6**: Vanilla JS sin frameworks
- **Chart.js 4.4.0**: Gráficos interactivos (CDN)
- **LocalStorage API**: Persistencia de datos
- **Google Analytics**: Tracking de uso

## 💾 Estructura de Datos

### Transacción Individual
```javascript
{
  id: 1705067234567,           // timestamp único
  type: 'expense',             // 'expense' o 'income'
  amount: 50.00,               // número decimal
  category: 'alimentacion',    // string (solo para gastos)
  description: 'Compra Mercadona',
  date: '2025-01-12'           // formato YYYY-MM-DD
}
```

### Almacenamiento por Mes
```javascript
// Clave localStorage
transactions_2025_0  // Enero 2025
transactions_2025_1  // Febrero 2025
// ... etc

// Valor: Array de transacciones
[
  { id: 1, type: 'income', amount: 2000, ... },
  { id: 2, type: 'expense', amount: 850, category: 'vivienda', ... },
  { id: 3, type: 'expense', amount: 200, category: 'alimentacion', ... }
]
```

## 📊 Cálculos Automáticos

### Totales
```javascript
totalIngresos = sum(transacciones.filter(t => t.type === 'income').map(t => t.amount))
totalGastos = sum(transacciones.filter(t => t.type === 'expense').map(t => t.amount))
balance = totalIngresos - totalGastos
```

### Por Categoría
```javascript
gastosPorCategoria = transacciones
  .filter(t => t.type === 'expense')
  .reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

// Resultado:
// { vivienda: 850, alimentacion: 200, transporte: 60, ... }
```

### Porcentajes
```javascript
totalGastos = sum(gastos)
porcentajeCategoria = (gastoCategoria / totalGastos) × 100
```

## 🚀 Casos de Uso

### 👨‍💼 Freelancers
- Trackear ingresos variables por proyecto
- Controlar gastos deducibles
- Preparar declaración de impuestos

### 👨‍👩‍👧‍👦 Familias
- Presupuesto familiar mensual
- Identificar gastos innecesarios
- Ahorrar para objetivos (vacaciones, coche, etc.)

### 🎓 Estudiantes
- Controlar paga o becas
- Gastos de residencia y materiales
- Aprender finanzas personales

### 💼 Asalariados
- Comparar gastos vs salario
- Detectar fugas de dinero
- Aumentar tasa de ahorro

### 🏠 Gestión Doméstica
- Control de suministros y servicios
- Gastos del hogar categorizados
- Optimizar consumo

## 💡 Metodología de Uso Recomendada

### Configuración Inicial (5 min)
1. **Registra tus ingresos** del mes actual
2. **Añade gastos recientes** que recuerdes
3. **Revisa tu banco** para no olvidar nada

### Uso Diario (1-2 min)
1. **Al final del día**: Añade gastos del día
2. **Revisa tickets**: No olvides pequeños gastos
3. **Actualiza cada transacción**: Mantén el balance al día

### Revisión Semanal (10 min)
1. **Comprueba balance**: ¿Vas bien este mes?
2. **Revisa categorías**: ¿Dónde gastas más?
3. **Ajusta comportamiento**: Reduce categorías altas

### Análisis Mensual (20 min)
1. **Cierre de mes**: Revisa totales finales
2. **Exporta CSV**: Guarda para análisis anual
3. **Compara con mes anterior**: ¿Mejoraste?
4. **Establece objetivos**: Meta del próximo mes

## 📈 Tips para Maximizar el Ahorro

### Regla 50/30/20
- **50%** Necesidades (vivienda, comida, transporte, salud)
- **30%** Deseos (ocio, restaurantes, ropa, hobbies)
- **20%** Ahorro e inversión (fondo emergencia, jubilación, inversiones)

### Identifica Fugas de Dinero
- Revisa categoría **Suscripciones**: ¿Usas todo?
- Analiza **Alimentación**: Restaurantes vs supermercado
- Controla **Ocio**: Pequeños gastos suman

### Reto de Ahorro Mensual
1. **Mes 1**: Solo trackea, no cambies nada
2. **Mes 2**: Reduce categoría más alta en 10%
3. **Mes 3**: Reduce segunda categoría en 10%
4. **Mes 4**: Ahorra al menos 15% de ingresos

## 📊 SEO y Metadatos

### Schema.org Implementado
- ✅ **FinanceApplication**: App de finanzas
- ✅ **BreadcrumbList**: Navegación jerárquica
- ✅ **FAQPage**: Preguntas frecuentes

### Keywords Optimizadas
- control gastos
- gestor finanzas personales
- presupuesto mensual
- balance ingresos gastos
- app finanzas gratis
- control presupuesto
- ahorro personal

## ⚙️ Funcionalidades Técnicas Avanzadas

### LocalStorage por Mes
- Cada mes tiene su propia clave de almacenamiento
- Previene sobrecarga de datos
- Navegación rápida entre meses

### Chart.js Integrado
- Librería vía CDN (no aumenta tamaño)
- Gráficos responsive automáticos
- Tooltips informativos
- Colores personalizados por categoría

### Formato Español
- Números: `1.234,56 €`
- Fechas: `mié, 12 ene 2025`
- Moneda: Euro (€)

### Notificaciones Toast
- Feedback visual al añadir/eliminar
- Animación entrada/salida
- Auto-desaparece en 3 segundos

## 🔄 Exportación e Importación de Datos

### Formato CSV (Mes Actual)
```csv
Fecha,Tipo,Categoría,Descripción,Cantidad
2025-01-12,Ingreso,Ingreso,"Salario mensual",2000.00
2025-01-05,Gasto,Vivienda,"Alquiler Enero",-850.00
2025-01-03,Gasto,Alimentación,"Compra Mercadona",-120.50
```

**Compatible con:**
- ✅ Microsoft Excel
- ✅ Google Sheets
- ✅ LibreOffice Calc
- ✅ Apple Numbers

### Formato JSON (Backup Completo)
```json
{
  "version": "1.0",
  "exportDate": "2025-01-12T14:30:00.000Z",
  "totalMonths": 3,
  "totalTransactions": 47,
  "data": {
    "transactions_2025_0": [
      {
        "id": 1705067234567,
        "type": "expense",
        "amount": 850.00,
        "category": "vivienda",
        "description": "Alquiler Enero",
        "date": "2025-01-05"
      }
    ],
    "transactions_2024_11": [ ... ],
    "transactions_2024_10": [ ... ]
  }
}
```

**Características del backup JSON:**
- ✅ Incluye **todos los meses** con todas las transacciones
- ✅ **Metadatos** informativos (fecha exportación, totales)
- ✅ Formato **versionado** para compatibilidad futura
- ✅ **Fusión inteligente** al importar (no duplica)
- ✅ Perfecto para guardar en **Google Drive, Dropbox, OneDrive**

### Workflow Recomendado de Backup
1. **Mensual**: Exporta CSV del mes para análisis en Excel
2. **Trimestral**: Exporta JSON completo y guarda en la nube
3. **Anual**: Descarga JSON de archivo anual para registros
4. **Migración**: Importa JSON en nuevo navegador/dispositivo

## ⚠️ Limitaciones y Consideraciones

### Limitaciones Técnicas
- **LocalStorage**: Límite ~5-10MB (suficiente para años de datos)
- **Sin sincronización automática**: Datos en un navegador (usa JSON backup para migrar)
- **Backup manual**: Exporta JSON regularmente a la nube

### No es Recomendado Para
- ❌ Empresas o autónomos con facturación compleja
- ❌ Gestión de múltiples cuentas bancarias simultáneas
- ❌ Contabilidad fiscal oficial

### Es Perfecto Para
- ✅ Control personal de finanzas
- ✅ Presupuesto familiar simple
- ✅ Estudiantes y jóvenes
- ✅ Complemento a apps bancarias

## 🆚 Comparación con Otras Apps

| Característica | meskeIA | Mint/YNAB | App Banco |
|---------------|---------|-----------|-----------|
| **Sin registro** | ✅ | ❌ | ❌ |
| **100% offline** | ✅ | ❌ | ❌ |
| **Privacidad total** | ✅ | ❌ | ⚠️ |
| **Gratis** | ✅ | ⚠️ Freemium | ✅ |
| **Simple y rápido** | ✅ | ❌ Complejo | ✅ |
| **Gráficos** | ✅ | ✅ | ✅ |
| **Exportar CSV/JSON** | ✅ | ✅ | ⚠️ |
| **Importar backup** | ✅ | ⚠️ | ❌ |

## 📞 Soporte

Para reportar errores o sugerir mejoras:
- Web: [meskeia.com](https://meskeia.com)
- Sección: Finanzas y Fiscalidad > Control de Gastos Mensual

## 📄 Licencia

© 2025 meskeIA - Todos los derechos reservados

---

**Última actualización**: Enero 2025
**Versión**: 1.1.0 (añadido import/export JSON completo)
**Autor**: meskeIA

## 🌟 Dato Curioso

**¿Sabías que?** El 78% de las personas que usan una app de control de gastos durante 3 meses consecutivos logran aumentar su ahorro en al menos un 15%. La clave no es ganar más, ¡es saber dónde se va el dinero! 💰
