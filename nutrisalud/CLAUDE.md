# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Proyecto Nutrición

Este es un proyecto de nutrición en desarrollo inicial. El objetivo es crear una aplicación web para el seguimiento nutricional y análisis de alimentos.

## Comandos Comunes

### Configuración inicial del proyecto Flask
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias base
pip install flask sqlalchemy

# Crear requirements.txt
pip freeze > requirements.txt

# Ejecutar aplicación
python app.py
```

### Configuración inicial del proyecto con HTML/JS estático
```bash
# Servidor de desarrollo simple
python -m http.server 8000

# Abrir en navegador (Windows)
start http://localhost:8000
```

## Arquitectura Propuesta

### Estructura de directorios sugerida
```
nutricion/
├── app.py                 # Aplicación principal Flask
├── requirements.txt       # Dependencias Python
├── static/
│   ├── js/               # JavaScript para funcionalidad
│   ├── css/              # Estilos personalizados
│   └── img/              # Imágenes y recursos
├── templates/            # Plantillas HTML
├── data/                 # Base de datos y archivos JSON
│   ├── nutricion.db      # Base de datos SQLite
│   └── alimentos.json    # Datos de alimentos
└── utils/                # Utilidades y helpers
    └── nutrition_calc.py # Cálculos nutricionales
```

## Stack Tecnológico Recomendado

- **Backend**: Flask 2.3+ con SQLAlchemy
- **Frontend**: Bootstrap 5, Chart.js para visualizaciones
- **Base de datos**: SQLite para almacenamiento local
- **API de datos**: Integración con APIs de nutrición (USDA, OpenFoodFacts)

## Funcionalidades Clave a Implementar

1. **Registro de comidas**: Seguimiento diario de alimentación
2. **Base de datos de alimentos**: Información nutricional completa
3. **Cálculo de macros**: Proteínas, carbohidratos, grasas
4. **Objetivos nutricionales**: Personalización según necesidades
5. **Visualizaciones**: Gráficos de progreso y análisis

## Consideraciones del Proyecto

- **Idioma**: Interfaz y documentación en español
- **Diseño responsivo**: Optimizado para móviles
- **Almacenamiento local**: SQLite para datos del usuario
- **Sin autenticación**: Aplicación de uso local/personal
- **Recursos existentes**: Foto Nutrición.jpg disponible para la interfaz

## Notas de Desarrollo

- Todas las rutas de archivos deben usar formato Windows
- Los mensajes al usuario deben estar en español
- Seguir el patrón de otros proyectos en meskeIA
- Priorizar funcionalidad sobre complejidad inicial