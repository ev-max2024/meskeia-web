# 🏥 Calculadora de Salud - meskeIA

**Calculadora profesional de análisis de salud con recomendaciones médicas personalizadas y plan nutricional adaptado a la población mediterránea.**

![meskeIA Logo](https://img.shields.io/badge/meskeIA-Salud-48A9A6?style=for-the-badge&logo=health&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-2E86AB?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-27AE60?style=for-the-badge)

## 📋 Descripción

La **Calculadora de Salud meskeIA** es una aplicación web completa que proporciona un análisis integral del estado de salud basado en parámetros científicos validados. Incluye cálculos médicos precisos, gráficos informativos, recomendaciones personalizadas y un plan nutricional detallado.

### 🎯 Características Principales

- **Análisis Médico Completo**: IMC, grasa corporal, riesgo cardiovascular (SCORE2), perfil metabólico
- **Gráficos Interactivos**: Visualizaciones claras con Chart.js y colores semánticos
- **Plan Nutricional Personalizado**: Distribución de 5 comidas con macronutrientes específicos
- **Recomendaciones Médicas**: Consejos priorizados y accionables según resultados
- **Exportación PDF**: Informe completo para consulta médica
- **Diseño Profesional**: Interfaz moderna con paleta de colores meskeIA

## 🚀 Demo en Vivo

Puedes probar la calculadora directamente abriendo el archivo `index.html` en tu navegador Chrome.

## 📊 Capturas de Pantalla

### Interfaz Principal
- Formulario completo con validación en tiempo real
- Barra de progreso visual del llenado

### Resultados del Análisis
- Resumen ejecutivo con 4 métricas clave
- Gráficos de análisis cardiovascular y composición corporal
- Plan nutricional con distribución de comidas
- Recomendaciones médicas personalizadas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Gráficos**: Chart.js v3.9.1
- **Exportación**: jsPDF v2.5.1, html2canvas v1.4.1
- **Diseño**: CSS Grid, Flexbox, Gradientes personalizados
- **Validación**: JavaScript nativo con validación cruzada

## 📁 Estructura del Proyecto

```
calculadora-salud-pro/
├── index.html              # Página principal con formulario
├── results.js               # Lógica de resultados y visualización
├── README.md               # Este archivo
└── meskeia_logo.html       # Showcase del logo (opcional)
```

### Arquitectura Simplificada

La aplicación utiliza una **arquitectura minimalista** con solo 2 archivos principales:
- `index.html`: Contiene HTML, CSS y JavaScript básico
- `results.js`: Maneja gráficos, cálculos avanzados y generación de resultados

## 🧮 Cálculos Médicos Implementados

### Índice de Masa Corporal (IMC)
```javascript
IMC = peso(kg) / altura(m)²
```

### Grasa Corporal (Fórmula Marina US adaptada)
**Hombres:**
```javascript
% Grasa = 495 / (1.0324 - 0.19077 × log10(cintura - cuello) + 0.15456 × log10(altura)) - 450
```

**Mujeres:**
```javascript
% Grasa = 495 / (1.29579 - 0.35004 × log10(cintura + cadera - cuello) + 0.22100 × log10(altura)) - 450
```

### Metabolismo Basal (TMB) - Fórmula Mifflin-St Jeor
**Hombres:**
```javascript
TMB = (10 × peso) + (6.25 × altura) - (5 × edad) + 5
```

**Mujeres:**
```javascript
TMB = (10 × peso) + (6.25 × altura) - (5 × edad) - 161
```

*Ajuste mediterráneo: +3% para adaptación regional*

### Gasto Energético Total (TDEE)
```javascript
TDEE = TMB × Factor de Actividad
```

Factores de actividad:
- Sedentario: 1.2
- Ligero: 1.375
- Moderado: 1.55
- Activo: 1.725
- Muy Activo: 1.9

### Riesgo Cardiovascular SCORE2
Implementación adaptada para **región de bajo riesgo** (España) considerando:
- Edad (factor principal)
- Sexo
- Tabaquismo
- Presión arterial sistólica
- Ratio colesterol total/HDL

## 🍽️ Plan Nutricional

### Distribución de Comidas (Patrón Mediterráneo)
- **Desayuno**: 25% (07:00-09:00)
- **Media Mañana**: 10% (10:00-11:00)
- **Almuerzo**: 35% (13:00-15:00)
- **Merienda**: 10% (17:00-18:00)
- **Cena**: 20% (20:00-21:30)

### Macronutrientes por Tipo de Dieta
- **Mediterránea**: 20% proteínas, 50% carbohidratos, 30% grasas
- **Occidental**: 15% proteínas, 55% carbohidratos, 30% grasas
- **Cetogénica**: 25% proteínas, 5% carbohidratos, 70% grasas

## 📋 Campos de Entrada

### Datos Básicos (Obligatorios)
- Nombre (opcional)
- Edad (18-100 años)
- Sexo (hombre/mujer)
- Altura (140-220 cm)
- Peso (40-200 kg)

### Medidas Corporales (Obligatorias)
- Circunferencia de cintura
- Circunferencia de cadera
- Circunferencia del cuello
- Circunferencia de muñeca (opcional)

### Parámetros Cardiovasculares (Obligatorios)
- Presión arterial sistólica/diastólica
- Frecuencia cardíaca en reposo (opcional)
- Colesterol total y HDL
- Glucosa en ayunas (opcional)
- Medicación antihipertensiva (checkbox)

### Estilo de Vida (Obligatorios/Opcionales)
- Nivel de actividad física
- Hábito tabáquico
- Consumo de alcohol
- Horas de sueño
- Nivel de estrés
- Tipo de dieta

### Condiciones Médicas (Opcionales)
- Diabetes tipo 2
- Hipertensión arterial
- Problemas cardíacos previos
- Problemas tiroideos
- Otras condiciones relevantes

## 🎨 Sistema de Colores Semánticos

### Paleta meskeIA
- **Azul Corporativo**: `#2E86AB` - Valores neutrales/totales
- **Verde Azulado**: `#48A9A6` - Valores buenos
- **Azul Claro**: `#7FB3D3` - Valores de atención
- **Verde**: `#27AE60` - Valores excelentes/saludables
- **Anaranjado**: `#E67E22` - Valores de advertencia
- **Rojo Suave**: `#E74C3C` - Valores de riesgo

### Aplicación en Gráficos
- **Verde**: Masa muscular, HDL alto, valores óptimos
- **Azul**: Colesterol total, proteínas, valores neutros
- **Anaranjado**: LDL, grasa corporal alta, advertencias
- **Rojo**: Valores peligrosos que requieren atención médica

## 🔧 Instalación y Uso

### Requisitos del Sistema
- **Navegador**: Google Chrome (recomendado)
- **Conexión**: Internet (para cargar librerías CDN)
- **Dispositivo**: Optimizado para escritorio

### Instalación
1. **Descarga** los archivos del proyecto
2. **Coloca** `index.html` y `results.js` en la misma carpeta
3. **Abre** `index.html` en Google Chrome

### Uso Básico
1. **Completa** todos los campos obligatorios (*)
2. **Observa** la barra de progreso del formulario
3. **Presiona** "🧮 CALCULAR ANÁLISIS DE SALUD"
4. **Revisa** los resultados en las secciones inferiores
5. **Exporta** el informe en PDF si lo deseas

## 📄 Funcionalidades Avanzadas

### Validación de Datos
- **Validación en tiempo real** de rangos de valores
- **Validación cruzada** (ej: presión diastólica < sistólica)
- **Mensajes de error** específicos y útiles
- **Indicadores visuales** de campos incorrectos

### Recomendaciones Inteligentes
- **Priorizadas por urgencia**: Urgente → Alta → Media → Baja
- **Específicas por área**: Cardiovascular, Peso, Nutrición, Actividad Física
- **Accionables**: Incluyen pasos concretos a seguir
- **Adaptadas**: Según edad, sexo y condiciones médicas

### Exportación PDF
- **Informe completo** con datos del paciente
- **Resultados principales** con interpretación
- **Plan nutricional** incluido
- **Disclaimers médicos** apropiados
- **Fecha y branding** meskeIA

## 🔬 Precisión Científica

### Fórmulas Validadas
- **IMC**: Estándar internacional OMS
- **Grasa Corporal**: Fórmula Marina US (precisión ±3-4%)
- **TMB**: Mifflin-St Jeor (más precisa que Harris-Benedict)
- **SCORE2**: Adaptado para población europea de bajo riesgo

### Adaptaciones Regionales
- **Población mediterránea**: Ajustes en TMB (+3%)
- **Patrones alimentarios**: Distribución horaria española
- **Factores de riesgo**: Adaptados a prevalencia regional

## ⚠️ Limitaciones y Disclaimers

### Limitaciones Técnicas
- **No sustituye** consulta médica profesional
- **Estimaciones**: Basadas en fórmulas poblacionales
- **Precisión variable**: Según características individuales
- **Solo adultos**: Validado para edades 18-100 años

### Avisos Médicos
- Los resultados son **orientativos** y educativos
- Consulte **siempre** con profesionales sanitarios
- **No tome decisiones** médicas basándose únicamente en estos resultados
- Para diagnósticos precisos, realice **análisis clínicos** completos

## 📈 Casos de Uso

### Para Usuarios Individuales
- **Autoevaluación** periódica del estado de salud
- **Seguimiento** de objetivos de peso y composición corporal
- **Planificación nutricional** básica
- **Preparación** para consultas médicas

### Para Profesionales de la Salud
- **Herramienta complementaria** de evaluación
- **Educación** del paciente con gráficos claros
- **Documentación** con informes en PDF
- **Seguimiento** de parámetros en el tiempo

### Para Nutricionistas y Entrenadores
- **Cálculo rápido** de necesidades energéticas
- **Distribución** de macronutrientes
- **Evaluación** de composición corporal
- **Recomendaciones** estructuradas

## 🛡️ Privacidad y Seguridad

### Tratamiento de Datos
- **Sin almacenamiento**: Los datos NO se guardan en servidores
- **Local únicamente**: Procesamiento en el navegador del usuario
- **Sin envío**: Información NO transmitida a terceros
- **Temporal**: Datos eliminados al cerrar la aplicación

### Cumplimiento RGPD
- **Sin cookies** de seguimiento
- **Sin identificadores** personales requeridos
- **Control total** del usuario sobre sus datos
- **Transparencia** completa en el procesamiento

## 🤝 Contribuciones

### Cómo Contribuir
1. **Fork** del repositorio
2. **Crea** una rama para tu funcionalidad
3. **Implementa** mejoras siguiendo el estilo de código
4. **Prueba** exhaustivamente en Chrome
5. **Envía** pull request con descripción detallada

### Áreas de Mejora
- **Más tipos de dieta** (vegana, paleo, etc.)
- **Gráficos adicionales** (tendencias, comparativas)
- **Idiomas adicionales** (catalán, inglés)
- **Adaptaciones regionales** (otras poblaciones)
- **Integración con dispositivos** (básculas inteligentes)

## 📞 Soporte y Contacto

### Reporte de Problemas
- **Issues**: Utiliza el sistema de issues del repositorio
- **Descripción**: Incluye pasos para reproducir el problema
- **Navegador**: Especifica versión de Chrome utilizada
- **Screenshots**: Adjunta capturas si es posible

### Preguntas Frecuentes

**P: ¿Por qué solo funciona en Chrome?**
R: Optimizado para Chrome para garantizar compatibilidad con todas las librerías y funcionalidades avanzadas.

**P: ¿Los datos se envían a algún servidor?**
R: No, todos los cálculos se realizan localmente en tu navegador.

**P: ¿Qué precisión tienen los cálculos?**
R: Las fórmulas utilizadas tienen precisión médica estándar (±3-5% según el parámetro).

**P: ¿Puedo usar esto para diagnósticos médicos?**
R: No, es una herramienta informativa. Siempre consulte con profesionales sanitarios.

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.

```
MIT License

Copyright (c) 2025 meskeIA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🏆 Reconocimientos

### Fuentes Científicas
- **Organización Mundial de la Salud (OMS)**: Criterios de IMC
- **European Society of Cardiology**: Directrices SCORE2
- **American College of Sports Medicine**: Fórmulas de composición corporal
- **Sociedad Española de Endocrinología y Nutrición**: Adaptaciones mediterráneas

### Tecnologías Utilizadas
- **Chart.js**: Biblioteca de gráficos (Apache License 2.0)
- **jsPDF**: Generación de PDF (MIT License)
- **html2canvas**: Captura de elementos DOM (MIT License)

---

**Desarrollado con ❤️ por meskeIA**  
*Calculadora de Salud Profesional - Versión 1.0.0*

---

## 📋 Changelog

### v1.0.0 (2025-08-10)
- ✅ Lanzamiento inicial
- ✅ Cálculos médicos completos implementados
- ✅ Gráficos interactivos con Chart.js
- ✅ Plan nutricional personalizado
- ✅ Recomendaciones médicas inteligentes
- ✅ Exportación PDF funcional
- ✅ Diseño responsive con paleta meskeIA
- ✅ Validación completa de formularios
- ✅ Documentación completa

---

### 🔗 Enlaces Útiles

- [Documentación Chart.js](https://www.chartjs.org/docs/)
- [Guías ESC SCORE2](https://www.escardio.org/Guidelines)
- [Calculadoras Nutricionales WHO](https://www.who.int/tools)
- [Estándares SEEDO](https://www.seedo.es/)

---

*Este README fue generado automáticamente y se actualiza regularmente. Última actualización: Agosto 2025*