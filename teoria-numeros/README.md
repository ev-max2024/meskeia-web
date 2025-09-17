# 🔢 Teoría de Números - meskeIA

Aplicación educativa interactiva para el estudio de la teoría de números con calculadoras especializadas y recursos educativos.

## 🚀 Características

### 📊 Números Primos
- **Verificador de primalidad**: Determina si un número es primo
- **Criba de Eratóstenes**: Encuentra todos los primos hasta un límite
- **Factorización prima**: Descompone números en factores primos
- **Generador de primos**: Produce secuencias de números primos

### ➗ Divisibilidad
- **Calculadora MCD**: Máximo Común Divisor con algoritmo de Euclides
- **Calculadora MCM**: Mínimo Común Múltiplo
- **Algoritmo de Euclides Extendido**: Coeficientes de Bézout
- **Buscador de divisores**: Encuentra todos los divisores de un número

### ⚡ Congruencias Modulares
- **Aritmética modular**: Cálculos con módulos
- **Inverso modular**: Encuentra inversos multiplicativos
- **Potencia modular**: Exponenciación modular eficiente
- **Sistema de congruencias**: Teorema Chino del Resto

### 📈 Funciones Aritméticas
- **Función φ(n) de Euler**: Cuenta números coprimos
- **Función τ(n)**: Cuenta divisores
- **Función σ(n)**: Suma de divisores
- **Números perfectos**: Verificador de perfección

### 📚 Recursos Educativos
- Teoremas fundamentales con demostraciones
- Explicaciones paso a paso
- Interpretaciones matemáticas
- Historia y contexto

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsivo con variables CSS
- **JavaScript ES6+**: Lógica de cálculos matemáticos
- **PWA**: Aplicación web progresiva con service worker
- **Diseño meskeIA**: Paleta minimalista inspirada en Claude

## 🎨 Diseño

### Paleta de Colores meskeIA
- **Primario**: `#2E86AB` (Azul identidad)
- **Secundario**: `#48A9A6` (Verde complementario)
- **Fondos**: `#FAFAFA` (Gris muy claro)
- **Texto**: `#1A1A1A` (Negro suave)

### Responsive Design
- Adaptado para móviles y tablets
- Grid flexible para calculadoras
- Navegación por tabs intuitiva
- Botones y formularios táctiles

## 🌍 Localización Española

- **Formato de números**: Puntos para miles, comas para decimales
- **Idioma**: Interfaz completamente en español
- **Moneda**: Euro (EUR) como referencia
- **Timezone**: Europe/Madrid

## 📱 Progressive Web App (PWA)

- **Instalable**: Se puede instalar en dispositivo
- **Offline**: Funciona sin conexión a internet
- **Rápida**: Caché inteligente con service worker
- **Responsive**: Adaptada a cualquier pantalla

## 🚀 Inicio Rápido

### Opción 1: Abrir directamente
```bash
# Abrir en navegador
start index.html
```

### Opción 2: Servidor local
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Luego abrir: http://localhost:8000
```

## 📖 Uso de las Calculadoras

### Números Primos
1. **Verificar si es primo**: Introduce un número y verifica su primalidad
2. **Criba de Eratóstenes**: Establece un límite para encontrar todos los primos
3. **Factorización**: Descompone cualquier número en factores primos
4. **Generar primos**: Especifica cuántos primos consecutivos generar

### Divisibilidad
1. **MCD/MCM**: Introduce dos números para calcular MCD y MCM
2. **Euclides Extendido**: Encuentra coeficientes de la identidad de Bézout
3. **Divisores**: Lista todos los divisores de un número

### Congruencias
1. **Módulo**: Calcula a mod m
2. **Inverso**: Encuentra a⁻¹ mod m (si existe)
3. **Potencia**: Calcula aᵇ mod m eficientemente
4. **Sistema**: Resuelve sistemas de congruencias con TRC

### Funciones Aritméticas
1. **φ(n)**: Cuenta números menores que n coprimos con n
2. **τ(n)**: Cuenta la cantidad de divisores de n
3. **σ(n)**: Suma todos los divisores de n
4. **Perfecto**: Verifica si un número es perfecto, deficiente o abundante

## 🧮 Algoritmos Implementados

- **Test de primalidad**: Optimizado hasta √n
- **Criba de Eratóstenes**: Eficiente para rangos grandes
- **Algoritmo de Euclides**: Iterativo para MCD
- **Euclides Extendido**: Para coeficientes de Bézout
- **Exponenciación rápida**: Para potencias modulares
- **Teorema Chino del Resto**: Para sistemas de congruencias

## 🔧 Características Técnicas

### Validación de Entrada
- Verificación automática de números válidos
- Rangos apropiados para evitar overflow
- Mensajes de error claros y educativos

### Formato de Resultados
- Números grandes formateados con separadores
- Explicaciones paso a paso
- Interpretaciones matemáticas
- Ejemplos adicionales cuando es relevante

### Performance
- Algoritmos optimizados para números grandes
- Carga diferida de librerías externas
- Service worker para velocidad offline
- Minimización de cálculos redundantes

## 📊 Funcionalidades Avanzadas

### Visualización
- Listas de números con códigos de color
- Distinción visual entre primos y compuestos
- Resultados destacados en cajas especiales
- Animaciones sutiles para mejor UX

### Educación
- Fórmulas matemáticas mostradas
- Explicaciones del proceso de cálculo
- Referencias a teoremas relevantes
- Interpretación práctica de resultados

### Accesibilidad
- Navegación por teclado completa
- Enter para ejecutar cálculos
- Contraste apropiado para lectura
- Etiquetas semánticas HTML5

## 🎯 Casos de Uso

### Estudiantes de Matemáticas
- Verificar ejercicios de teoría de números
- Explorar propiedades de números específicos
- Aprender algoritmos paso a paso
- Practicar con ejemplos interactivos

### Profesores
- Generar ejemplos para clases
- Demonstrar algoritmos visualmente
- Crear ejercicios con respuestas verificadas
- Explorar casos particulares

### Investigadores
- Verificar conjeturas numéricas
- Calcular funciones aritméticas
- Analizar patrones en secuencias
- Confirmar resultados teóricos

## 🔮 Próximas Características

- [ ] Calculadora de ecuaciones diofánticas
- [ ] Visualización gráfica de funciones aritméticas
- [ ] Generador de problemas aleatorios
- [ ] Exportar resultados a PDF/CSV
- [ ] Modo oscuro opcional
- [ ] Historial de cálculos
- [ ] Calculadora científica integrada
- [ ] Tests de primalidad avanzados (Miller-Rabin)

## 🏗️ Arquitectura

```
teoria-numeros/
├── index.html          # Interfaz principal
├── script.js          # Lógica de cálculos
├── manifest.json      # Configuración PWA
├── service-worker.js  # Cache y offline
├── icon_meskeia.png   # Icono de la aplicación
└── README.md          # Esta documentación
```

## 🤝 Contribuciones

Este es un proyecto educativo open source. Las contribuciones son bienvenidas:

1. **Nuevos algoritmos**: Implementar más funciones matemáticas
2. **Mejoras de UI**: Optimizar la experiencia de usuario
3. **Documentación**: Ampliar explicaciones matemáticas
4. **Testing**: Verificar precision de cálculos
5. **Localización**: Traducir a otros idiomas

## 📜 Licencia

© 2025 meskeIA - Proyecto educativo libre

## 🔗 Enlaces

- **meskeIA Web**: [https://meskeia.com](https://meskeia.com)
- **Otras Apps**: [https://meskeia.com/aplicaciones](https://meskeia.com/aplicaciones)
- **Soporte**: [contacto@meskeia.com](mailto:contacto@meskeia.com)

---

**Desarrollado con ❤️ por meskeIA**
*Herramientas educativas gratuitas para estudiantes y profesores*