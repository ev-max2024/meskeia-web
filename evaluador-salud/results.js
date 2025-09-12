// ===== RESULTS.JS - VISUALIZACIÓN AVANZADA DE RESULTADOS CON PROTECCIONES =====

// Variables globales para gráficos
let charts = {};

// ===== CONFIGURACIÓN DE COLORES =====
const COLORS = {
    primary: '#2E86AB',
    secondary: '#48A9A6', 
    light: '#7FB3D3',
    success: '#27AE60',
    warning: '#E67E22',
    danger: '#E74C3C',
    darkDanger: '#C0392B',
    lightGray: '#ECF0F1',
    white: '#FFFFFF',
    darkGray: '#2C3E50'
};

// ===== FUNCIÓN PRINCIPAL DE MOSTRAR RESULTADOS =====
function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    
    // Generar HTML completo de resultados
    container.innerHTML = generateResultsHTML(results);
    
    // Mostrar container con animación
    container.classList.add('visible');
    
    // Crear todos los gráficos después de que el DOM esté listo
    setTimeout(() => {
        createAllCharts(results);
    }, 100);
    
    // Generar recomendaciones
    generateRecommendations(results);
    
    // Generar plan nutricional
    generateNutritionPlan(results);
}

// ===== GENERAR PLAN NUTRICIONAL =====
function generateNutritionPlan(results) {
    const container = document.getElementById('mealsContainer');
    const { tdee, macros, personalData } = results;
    
    // Distribución de comidas según patrón mediterráneo
    const mealDistribution = {
        desayuno: { name: 'Desayuno', icon: '🌅', percentage: 0.25, time: '07:00 - 09:00' },
        mediaMañana: { name: 'Media Mañana', icon: '🥝', percentage: 0.10, time: '10:00 - 11:00' },
        almuerzo: { name: 'Almuerzo', icon: '🍽️', percentage: 0.35, time: '13:00 - 15:00' },
        merienda: { name: 'Merienda', icon: '🍎', percentage: 0.10, time: '17:00 - 18:00' },
        cena: { name: 'Cena', icon: '🌙', percentage: 0.20, time: '20:00 - 21:30' }
    };
    
    let html = '<div class="meals-grid">';
    
    Object.entries(mealDistribution).forEach(([key, meal]) => {
        const calories = tdee * meal.percentage;
        const proteins = macros.proteinas.grams * meal.percentage;
        const carbs = macros.carbohidratos.grams * meal.percentage;
        const fats = macros.grasas.grams * meal.percentage;
        
        html += `
            <div class="meal-card">
                <div class="meal-header">
                    <span class="meal-icon">${meal.icon}</span>
                    <div class="meal-info">
                        <h4 class="meal-name">${meal.name}</h4>
                        <div class="meal-time">${meal.time}</div>
                        <div class="meal-percentage">${(meal.percentage * 100).toFixed(0)}% del día</div>
                    </div>
                </div>
                
                <div class="meal-macros">
                    <div class="macro-row">
                        <span class="macro-label">Calorías:</span>
                        <span class="macro-value">${calories.toFixed(0)} kcal</span>
                    </div>
                    <div class="macro-row">
                        <span class="macro-label">Proteínas:</span>
                        <span class="macro-value">${proteins.toFixed(0)}g</span>
                    </div>
                    <div class="macro-row">
                        <span class="macro-label">Carbohidratos:</span>
                        <span class="macro-value">${carbs.toFixed(0)}g</span>
                    </div>
                    <div class="macro-row">
                        <span class="macro-label">Grasas:</span>
                        <span class="macro-value">${fats.toFixed(0)}g</span>
                    </div>
                </div>
                
                <div class="meal-suggestions">
                    <h5>Sugerencias:</h5>
                    <div class="suggestions-list">
                        ${getMealSuggestions(key, personalData.dieta)}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function getMealSuggestions(mealType, dietType) {
    const suggestions = {
        desayuno: [
            '🥣 Avena con frutos secos y fruta',
            '🍞 Pan integral con aceite de oliva',
            '🥛 Lácteos (yogur griego, leche)',
            '🍊 Frutas frescas de temporada'
        ],
        mediaMañana: [
            '🍌 Fruta fresca (plátano, manzana)',
            '🥜 Puñado de frutos secos',
            '🧀 Porción pequeña de queso',
            '☕ Infusión o café sin azúcar'
        ],
        almuerzo: [
            '🐟 Pescado o carne magra (150-200g)',
            '🍚 Cereales integrales (arroz, pasta)',
            '🥗 Ensalada variada con aceite de oliva',
            '🍅 Verduras cocidas o al vapor'
        ],
        merienda: [
            '🥤 Batido de frutas natural',
            '🍞 Tostada integral con tomate',
            '🥨 Frutos secos y fruta deshidratada',
            '🫖 Té verde o infusión'
        ],
        cena: [
            '🥬 Ensalada abundante',
            '🍗 Proteína ligera (pescado, pollo)',
            '🥑 Verduras a la plancha',
            '🫒 Aceitunas y aceite de oliva'
        ]
    };
    
    let mealSuggestions = suggestions[mealType] || [];
    
    return mealSuggestions.map(suggestion => `<div class="suggestion-item">${suggestion}</div>`).join('');
}

// ===== GENERAR HTML DE RESULTADOS ACTUALIZADO CON AVISOS =====
function generateResultsHTML(results) {
    const { personalData, imc, bodyFat, tmb, tdee, score2, macros, ratioColesterol, ratioCinturaCadera,
            biologicalAge, vo2max, fitnessScore, heartRateZones } = results;
    
    // Agregar avisos médicos contextuales
    const medicalWarnings = generateMedicalWarnings(results);
    
    return `
        <!-- BANNER DE RECORDATORIO MÉDICO -->
        <div class="medical-reminder-banner">
            <div class="reminder-icon">📋</div>
            <div class="reminder-content">
                <strong>Recordatorio Importante:</strong> Estos resultados son únicamente informativos y educativos. 
                No sustituyen el diagnóstico o consejo médico profesional. Consulte siempre con su médico antes de 
                tomar decisiones relacionadas con su salud.
            </div>
        </div>

        ${medicalWarnings}

        <!-- RESUMEN EJECUTIVO -->
        <div class="results-section executive-summary">
            <h2 class="results-title">📊 Resumen Ejecutivo</h2>
            <div class="summary-cards">
                <div class="summary-card ${getStatusClass(imc.status)}">
                    <div class="card-icon">⚖️</div>
                    <div class="card-content">
                        <div class="card-value">${imc.value.toFixed(1)}</div>
                        <div class="card-label">IMC</div>
                        <div class="card-status">${imc.category}</div>
                        ${imc.value < 16 || imc.value > 40 ? '<div class="card-warning">⚠️ Consulte con su médico</div>' : ''}
                    </div>
                </div>
                
                <div class="summary-card ${getStatusClass(score2.status)}">
                    <div class="card-icon">❤️</div>
                    <div class="card-content">
                        <div class="card-value">${score2.value.toFixed(1)}%</div>
                        <div class="card-label">Riesgo CV</div>
                        <div class="card-status">${score2.category}</div>
                        ${score2.value > 10 ? '<div class="card-warning">⚠️ Evaluación médica recomendada</div>' : ''}
                    </div>
                </div>
                
                <div class="summary-card ${getBodyFatStatus(bodyFat, personalData.sexo)}">
                    <div class="card-icon">🏃</div>
                    <div class="card-content">
                        <div class="card-value">${bodyFat.toFixed(1)}%</div>
                        <div class="card-label">Grasa Corporal</div>
                        <div class="card-status">${getBodyFatCategory(bodyFat, personalData.sexo)}</div>
                    </div>
                </div>
                
                <div class="summary-card ${getColesterolStatus(ratioColesterol)}">
                    <div class="card-icon">🩸</div>
                    <div class="card-content">
                        <div class="card-value">${ratioColesterol.toFixed(1)}</div>
                        <div class="card-label">Ratio Colesterol</div>
                        <div class="card-status">${getColesterolCategory(ratioColesterol)}</div>
                        ${ratioColesterol > 6.5 ? '<div class="card-warning">⚠️ Control médico necesario</div>' : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- NUEVA SECCIÓN: INDICADORES DE VITALIDAD -->
        <div class="results-section vitality-section">
            <h2 class="results-title">🌟 Indicadores de Vitalidad y Rendimiento</h2>
            <div class="vitality-grid">
                <!-- Edad Biológica -->
                <div class="vitality-card">
                    <h3 class="vitality-title">⏰ Edad Biológica Estimada</h3>
                    <canvas id="biologicalAgeChart"></canvas>
                    <div class="vitality-info">
                        <p><strong>Tu edad biológica estimada:</strong> ${biologicalAge.value} años</p>
                        <p><strong>Tu edad cronológica:</strong> ${personalData.edad} años</p>
                        <p class="vitality-result ${biologicalAge.difference <= 0 ? 'positive' : 'negative'}">
                            ${biologicalAge.difference < 0 
                                ? `¡Tu cuerpo podría ser ${Math.abs(biologicalAge.difference)} años más joven!` 
                                : biologicalAge.difference === 0 
                                    ? 'Tu edad biológica corresponde a tu edad real'
                                    : `Tu cuerpo podría tener ${biologicalAge.difference} años más de desgaste`}
                        </p>
                        <div class="vitality-category" style="color: ${biologicalAge.category.color}">
                            Estado: ${biologicalAge.category.text}
                        </div>
                        <p class="info-text">
                            <em>Nota: Esta es una estimación basada en factores de estilo de vida. No es un diagnóstico médico.</em>
                        </p>
                    </div>
                </div>

                <!-- VO2 Máximo -->
                <div class="vitality-card">
                    <h3 class="vitality-title">💨 VO2 Máximo Estimado</h3>
                    <div class="vo2-display">
                        <div class="vo2-value" style="color: ${vo2max.category.color}">
                            ${vo2max.value}
                        </div>
                        <div class="vo2-unit">ml/kg/min</div>
                    </div>
                    <canvas id="vo2Chart"></canvas>
                    <div class="vitality-info">
                        <p><strong>Capacidad aeróbica estimada:</strong> ${vo2max.category.text}</p>
                        <p class="info-text">El VO2 máximo mide tu capacidad de utilizar oxígeno durante el ejercicio. 
                        Valores más altos indican mejor condición cardiovascular. Esta es una estimación basada en datos poblacionales.</p>
                    </div>
                </div>

                <!-- Fitness Score -->
                <div class="vitality-card">
                    <h3 class="vitality-title">🏆 Índice de Forma Física</h3>
                    <canvas id="fitnessScoreChart"></canvas>
                    <div class="vitality-info">
                        <p><strong>Tu puntuación estimada:</strong> ${fitnessScore.value}/100</p>
                        <p><strong>Nivel:</strong> <span style="color: ${fitnessScore.category.color}">${fitnessScore.category.text}</span></p>
                        <p class="info-text">Evaluación aproximada basada en composición corporal, capacidad aeróbica y factores de salud.</p>
                    </div>
                </div>

                <!-- Zonas de Entrenamiento -->
                <div class="vitality-card full-width">
                    <h3 class="vitality-title">🎯 Zonas de Frecuencia Cardíaca para Entrenamiento (Estimadas)</h3>
                    <canvas id="heartRateZonesChart"></canvas>
                    <div class="zones-legend">
                        ${heartRateZones.zones.map(zone => `
                            <div class="zone-item">
                                <span class="zone-color" style="background-color: ${zone.color}"></span>
                                <div class="zone-info">
                                    <strong>${zone.name}:</strong> ${zone.min}-${zone.max} bpm
                                    <div class="zone-description">${zone.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <p class="vitality-info"><strong>FC Máxima teórica:</strong> ${heartRateZones.maxima} bpm</p>
                    <p class="info-text">
                        <em>Nota: Estas son estimaciones basadas en la edad. Consulte con un profesional del ejercicio para zonas personalizadas.</em>
                    </p>
                </div>
            </div>
        </div>

        <!-- ANÁLISIS CARDIOVASCULAR -->
        <div class="results-section">
            <h2 class="results-title">❤️ Análisis Cardiovascular</h2>
            <div class="analysis-grid">
                <div class="chart-container">
                    <h3 class="chart-title">Riesgo Cardiovascular SCORE2 Estimado</h3>
                    <canvas id="score2Chart"></canvas>
                    <div class="chart-info">
                        <p>Estimación del riesgo a 10 años de enfermedad cardiovascular</p>
                        <div class="risk-factors" id="riskFactors"></div>
                        <p class="info-text"><em>Esta es una aproximación. Para una evaluación precisa, consulte con su cardiólogo.</em></p>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">Presión Arterial</h3>
                    <canvas id="pressureChart"></canvas>
                    <div class="pressure-info">
                        <p><strong>Sistólica:</strong> ${personalData.presionSistolica} mmHg</p>
                        <p><strong>Diastólica:</strong> ${personalData.presionDiastolica} mmHg</p>
                        <p><strong>Categoría:</strong> ${getPressureCategory(personalData.presionSistolica, personalData.presionDiastolica)}</p>
                        ${personalData.presionSistolica >= 180 || personalData.presionDiastolica >= 120 
                            ? '<p class="warning-text">⚠️ Valores críticos - Consulte con su médico inmediatamente</p>' 
                            : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- COMPOSICIÓN CORPORAL -->
        <div class="results-section">
            <h2 class="results-title">🏋️ Composición Corporal Estimada</h2>
            <div class="analysis-grid">
                <div class="chart-container">
                    <h3 class="chart-title">Índice de Masa Corporal (IMC)</h3>
                    <canvas id="imcChart"></canvas>
                    <div class="chart-info">
                        <p><strong>Tu IMC:</strong> ${imc.value.toFixed(1)} kg/m²</p>
                        <p><strong>Categoría:</strong> ${imc.category}</p>
                        <p><strong>Peso saludable estimado:</strong> ${getHealthyWeightRange(parseFloat(personalData.altura))}</p>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">Distribución Corporal Estimada</h3>
                    <canvas id="bodyCompositionChart"></canvas>
                    <div class="chart-info">
                        <p><strong>Grasa corporal estimada:</strong> ${bodyFat.toFixed(1)}%</p>
                        <p><strong>Ratio cintura/cadera:</strong> ${ratioCinturaCadera.toFixed(2)}</p>
                        <p><strong>Riesgo abdominal:</strong> ${getAbdominalRisk(personalData.cintura, personalData.sexo)}</p>
                        <p class="info-text"><em>Estas son estimaciones basadas en fórmulas poblacionales.</em></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- PERFIL METABÓLICO -->
        <div class="results-section">
            <h2 class="results-title">🔥 Perfil Metabólico y Nutricional Estimado</h2>
            <div class="analysis-grid">
                <div class="chart-container">
                    <h3 class="chart-title">Necesidades Energéticas Estimadas</h3>
                    <canvas id="metabolismChart"></canvas>
                    <div class="chart-info">
                        <p><strong>TMB estimado:</strong> ${tmb.toFixed(0)} kcal/día</p>
                        <p><strong>TDEE estimado:</strong> ${tdee.toFixed(0)} kcal/día</p>
                        <p><strong>Actividad física:</strong> ${getActivityDescription(personalData.actividadFisica)}</p>
                        <p class="info-text"><em>Valores aproximados. Consulte con un nutricionista para un plan personalizado.</em></p>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">Distribución Sugerida de Macronutrientes</h3>
                    <canvas id="macrosChart"></canvas>
                    <div class="macros-details">
                        <div class="macro-item">
                            <span class="macro-color" style="background-color: ${COLORS.primary}"></span>
                            <span><strong>Proteínas:</strong> ${macros.proteinas.grams.toFixed(0)}g (${macros.proteinas.percentage.toFixed(0)}%)</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-color" style="background-color: ${COLORS.secondary}"></span>
                            <span><strong>Carbohidratos:</strong> ${macros.carbohidratos.grams.toFixed(0)}g (${macros.carbohidratos.percentage.toFixed(0)}%)</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-color" style="background-color: ${COLORS.light}"></span>
                            <span><strong>Grasas:</strong> ${macros.grasas.grams.toFixed(0)}g (${macros.grasas.percentage.toFixed(0)}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ANÁLISIS DE COLESTEROL -->
        <div class="results-section">
            <h2 class="results-title">🩸 Perfil Lipídico</h2>
            <div class="analysis-grid">
                <div class="chart-container">
                    <h3 class="chart-title">Análisis de Colesterol</h3>
                    <canvas id="cholesterolChart"></canvas>
                    <div class="chart-info">
                        <p><strong>Colesterol Total:</strong> ${personalData.colesterolTotal} mg/dL</p>
                        <p><strong>HDL (Bueno):</strong> ${personalData.colesterolHDL} mg/dL</p>
                        <p><strong>LDL estimado:</strong> ${(personalData.colesterolTotal - personalData.colesterolHDL).toFixed(0)} mg/dL</p>
                        <p><strong>Ratio Total/HDL:</strong> ${ratioColesterol.toFixed(1)} ${getColesterolRiskText(ratioColesterol)}</p>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">Evaluación de Riesgo Lipídico</h3>
                    <div class="risk-assessment">
                        ${generateLipidRiskAssessment(personalData.colesterolTotal, personalData.colesterolHDL, ratioColesterol)}
                    </div>
                </div>
            </div>
        </div>

        <!-- PLAN NUTRICIONAL DETALLADO -->
        <div class="results-section">
            <h2 class="results-title">🍽️ Plan Nutricional Sugerido (Informativo)</h2>
            <div class="nutrition-plan">
                <div class="nutrition-disclaimer">
                    <p><strong>⚠️ Importante:</strong> Este plan es únicamente orientativo. Para un plan nutricional personalizado y seguro, consulte con un nutricionista profesional.</p>
                </div>
                <div class="plan-summary">
                    <div class="daily-totals">
                        <h3>Requerimientos Diarios Estimados</h3>
                        <div class="totals-grid">
                            <div class="total-item">
                                <span class="total-icon">🔥</span>
                                <div class="total-content">
                                    <div class="total-value">${tdee.toFixed(0)}</div>
                                    <div class="total-label">Calorías aprox.</div>
                                </div>
                            </div>
                            <div class="total-item">
                                <span class="total-icon">🥩</span>
                                <div class="total-content">
                                    <div class="total-value">${macros.proteinas.grams.toFixed(0)}g</div>
                                    <div class="total-label">Proteínas</div>
                                </div>
                            </div>
                            <div class="total-item">
                                <span class="total-icon">🌾</span>
                                <div class="total-content">
                                    <div class="total-value">${macros.carbohidratos.grams.toFixed(0)}g</div>
                                    <div class="total-label">Carbohidratos</div>
                                </div>
                            </div>
                            <div class="total-item">
                                <span class="total-icon">🥑</span>
                                <div class="total-content">
                                    <div class="total-value">${macros.grasas.grams.toFixed(0)}g</div>
                                    <div class="total-label">Grasas</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="meals-distribution">
                    <h3>Distribución Sugerida por Comidas</h3>
                    <div id="mealsContainer">
                        <!-- Las comidas se generarán dinámicamente -->
                    </div>
                </div>
            </div>
        </div>

        <!-- RECOMENDACIONES INFORMATIVAS -->
        <div class="results-section recommendations-section">
            <h2 class="results-title">💡 Sugerencias Informativas de Salud</h2>
            <div class="recommendations-disclaimer">
                <p><strong>📌 Nota:</strong> Estas son sugerencias generales basadas en guías de salud poblacionales. 
                No son prescripciones médicas. Siempre consulte con profesionales de la salud antes de realizar cambios 
                en su estilo de vida, dieta o rutina de ejercicio.</p>
            </div>
            <div id="recommendationsContainer">
                <!-- Las recomendaciones se generarán dinámicamente -->
            </div>
        </div>

        <!-- NOTA DE EMERGENCIA -->
        <div class="results-section emergency-section">
            <div class="emergency-notice">
                <h3>🚨 Información de Emergencia</h3>
                <p>En caso de síntomas graves o emergencia médica, contacte inmediatamente con:</p>
                <div class="emergency-number">112</div>
                <p>(Número de emergencias en España)</p>
            </div>
        </div>

        <!-- EXPORTAR PDF -->
        <div class="results-section">
            <div class="export-container">
                <button id="exportPdfBtn" class="export-btn">
                    📄 EXPORTAR INFORME INFORMATIVO EN PDF
                </button>
                <p class="export-info">Descarga un informe con todos los análisis y gráficos (solo para fines informativos)</p>
            </div>
        </div>
    `;
}

// ===== GENERAR AVISOS MÉDICOS CONTEXTUALES =====
function generateMedicalWarnings(results) {
    let warnings = [];
    
    // Verificar valores críticos
    if (results.personalData.presionSistolica >= 180 || results.personalData.presionDiastolica >= 120) {
        warnings.push({
            level: 'critical',
            message: 'Presión arterial en rango crítico. Busque atención médica inmediata.'
        });
    }
    
    if (results.imc.value < 16 || results.imc.value > 40) {
        warnings.push({
            level: 'critical',
            message: 'IMC en rango que requiere evaluación médica urgente.'
        });
    }
    
    if (results.score2.value > 20) {
        warnings.push({
            level: 'high',
            message: 'Riesgo cardiovascular muy elevado. Consulte con un cardiólogo.'
        });
    }
    
    if (warnings.length === 0) return '';
    
    let html = '<div class="critical-warnings">';
    warnings.forEach(warning => {
        html += `
            <div class="warning-item ${warning.level}">
                <span class="warning-icon">⚠️</span>
                <span class="warning-text">${warning.message}</span>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

// ===== CREAR TODOS LOS GRÁFICOS =====
function createAllCharts(results) {
    // Limpiar gráficos anteriores
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};

    // Gráficos existentes
    charts.score2 = createSCORE2Chart(results.score2, results.personalData);
    charts.pressure = createPressureChart(results.personalData);
    charts.imc = createIMCChart(results.imc, results.personalData);
    charts.bodyComposition = createBodyCompositionChart(results.bodyFat, results.personalData);
    charts.metabolism = createMetabolismChart(results.tmb, results.tdee);
    charts.macros = createMacrosChart(results.macros);
    charts.cholesterol = createCholesterolChart(results.personalData, results.ratioColesterol);
    
    // NUEVOS GRÁFICOS
    charts.biologicalAge = createBiologicalAgeChart(results.biologicalAge, results.personalData);
    charts.vo2 = createVO2Chart(results.vo2max);
    charts.fitnessScore = createFitnessScoreChart(results.fitnessScore);
    charts.heartRateZones = createHeartRateZonesChart(results.heartRateZones);
}

// ===== NUEVOS GRÁFICOS =====

// 1. Gráfico de Edad Biológica (Gauge)
function createBiologicalAgeChart(biologicalAge, personalData) {
    const ctx = document.getElementById('biologicalAgeChart').getContext('2d');
    const edadCronologica = parseInt(personalData.edad);
    
    // Configuración del gauge
    const data = {
        datasets: [{
            data: [biologicalAge.value, 100 - biologicalAge.value],
            backgroundColor: [biologicalAge.category.color, COLORS.lightGray],
            borderWidth: 0
        }]
    };
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: 270,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [{
            id: 'text',
            beforeDraw: function(chart) {
                const width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
                    
                ctx.restore();
                const fontSize = (height / 100).toFixed(2);
                ctx.font = fontSize*8 + "px sans-serif";
                ctx.textBaseline = "middle";
                ctx.fillStyle = biologicalAge.category.color;
                
                const text = biologicalAge.value + " años",
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 1.4;
                    
                ctx.fillText(text, textX, textY);
                
                // Diferencia
                ctx.font = fontSize*5 + "px sans-serif";
                const diff = biologicalAge.difference > 0 ? "+" + biologicalAge.difference : biologicalAge.difference;
                const diffText = "(" + diff + ")",
                    diffX = Math.round((width - ctx.measureText(diffText).width) / 2),
                    diffY = height / 1.15;
                    
                ctx.fillText(diffText, diffX, diffY);
                ctx.save();
            }
        }]
    });
}

// 2. Gráfico VO2 Max (Barra con zonas de referencia)
function createVO2Chart(vo2max) {
    const ctx = document.getElementById('vo2Chart').getContext('2d');
    const value = parseFloat(vo2max.value);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tu VO2 Max Estimado'],
            datasets: [{
                data: [value],
                backgroundColor: [vo2max.category.color],
                borderColor: [vo2max.category.color],
                borderWidth: 2,
                barThickness: 60
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `VO2 Max: ${context.parsed.x.toFixed(1)} ml/kg/min - ${vo2max.category.text}`;
                        },
                        afterLabel: function(context) {
                            let range = '';
                            const val = context.parsed.x;
                            if (val < 25) range = 'Rango: Pobre (< 25)';
                            else if (val < 35) range = 'Rango: Regular (25-35)';
                            else if (val < 45) range = 'Rango: Bueno (35-45)';
                            else if (val < 55) range = 'Rango: Excelente (45-55)';
                            else range = 'Rango: Superior (> 55)';
                            return range + '\n(Estimación poblacional)';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 80,
                    title: {
                        display: true,
                        text: 'VO2 Max (ml/kg/min)'
                    },
                    grid: {
                        color: function(context) {
                            const value = context.tick.value;
                            if (value === 25 || value === 35 || value === 45 || value === 55) {
                                return 'rgba(0, 0, 0, 0.2)';
                            }
                            return 'rgba(0, 0, 0, 0.05)';
                        },
                        lineWidth: function(context) {
                            const value = context.tick.value;
                            if (value === 25 || value === 35 || value === 45 || value === 55) {
                                return 2;
                            }
                            return 1;
                        }
                    }
                },
                y: {
                    display: false
                }
            }
        }
    });
}

// 3. Gráfico de Fitness Score (Radial/Gauge circular)
function createFitnessScoreChart(fitnessScore) {
    const ctx = document.getElementById('fitnessScoreChart').getContext('2d');
    const score = fitnessScore.value;
    
    // Crear gradiente para el gauge
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (score >= 80) {
        gradient.addColorStop(0, COLORS.success);
        gradient.addColorStop(1, COLORS.secondary);
    } else if (score >= 50) {
        gradient.addColorStop(0, COLORS.secondary);
        gradient.addColorStop(1, COLORS.light);
    } else {
        gradient.addColorStop(0, COLORS.warning);
        gradient.addColorStop(1, COLORS.danger);
    }
    
    const data = {
        datasets: [{
            data: [score, 100 - score],
            backgroundColor: [gradient, COLORS.lightGray],
            borderWidth: 0
        }]
    };
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 270,
            rotation: 225,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [{
            id: 'fitnessText',
            beforeDraw: function(chart) {
                const width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
                    
                ctx.restore();
                
                // Puntuación principal
                const fontSize = (height / 100).toFixed(2);
                ctx.font = "bold " + fontSize*12 + "px sans-serif";
                ctx.textBaseline = "middle";
                ctx.fillStyle = fitnessScore.category.color;
                
                const text = score,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 1.7;
                    
                ctx.fillText(text, textX, textY);
                
                // Texto "/100"
                ctx.font = fontSize*6 + "px sans-serif";
                ctx.fillStyle = COLORS.darkGray;
                const subText = "/100",
                    subX = Math.round((width - ctx.measureText(subText).width) / 2),
                    subY = height / 1.3;
                    
                ctx.fillText(subText, subX, subY);
                ctx.save();
            }
        }]
    });
}

// 4. Gráfico de Zonas de Frecuencia Cardíaca
function createHeartRateZonesChart(heartRateZones) {
    const ctx = document.getElementById('heartRateZonesChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: heartRateZones.zones.map(z => z.name),
            datasets: [
                {
                    label: 'Mínimo',
                    data: heartRateZones.zones.map(z => z.min),
                    backgroundColor: heartRateZones.zones.map(z => z.color + '60'),
                    borderColor: heartRateZones.zones.map(z => z.color),
                    borderWidth: 2
                },
                {
                    label: 'Máximo',
                    data: heartRateZones.zones.map(z => z.max),
                    backgroundColor: heartRateZones.zones.map(z => z.color),
                    borderColor: heartRateZones.zones.map(z => z.color),
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const zone = heartRateZones.zones[context.dataIndex];
                            return `${context.dataset.label}: ${context.parsed.y} bpm`;
                        },
                        afterLabel: function(context) {
                            const zone = heartRateZones.zones[context.dataIndex];
                            return zone.description;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: heartRateZones.maxima + 10,
                    title: {
                        display: true,
                        text: 'Frecuencia Cardíaca (bpm)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// ===== GRÁFICOS EXISTENTES (SIN CAMBIOS SIGNIFICATIVOS) =====

// GRÁFICO SCORE2 (BARRA HORIZONTAL)
function createSCORE2Chart(score2Data, personalData) {
    const ctx = document.getElementById('score2Chart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Riesgo Cardiovascular Estimado'],
            datasets: [{
                data: [score2Data.value],
                backgroundColor: [score2Data.color],
                borderColor: [score2Data.color],
                borderWidth: 2,
                barThickness: 40
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Riesgo estimado: ${context.parsed.x.toFixed(1)}% - ${score2Data.category}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 20,
                    title: {
                        display: true,
                        text: 'Porcentaje de Riesgo Estimado (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    display: false
                }
            },
            elements: {
                bar: {
                    borderRadius: 5
                }
            }
        }
    });
}

// GRÁFICO DE PRESIÓN ARTERIAL
function createPressureChart(personalData) {
    const ctx = document.getElementById('pressureChart').getContext('2d');
    
    const sistolica = parseInt(personalData.presionSistolica);
    const diastolica = parseInt(personalData.presionDiastolica);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sistólica', 'Diastólica'],
            datasets: [{
                data: [sistolica, diastolica],
                backgroundColor: [
                    getPressureColor(sistolica, 'sistolica'),
                    getPressureColor(diastolica, 'diastolica')
                ],
                borderWidth: 2,
                borderColor: [
                    getPressureColor(sistolica, 'sistolica'),
                    getPressureColor(diastolica, 'diastolica')
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.y} mmHg`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 200,
                    title: {
                        display: true,
                        text: 'Presión (mmHg)'
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 5
                }
            }
        }
    });
}

// GRÁFICO IMC (BARRA HORIZONTAL)
function createIMCChart(imcData, personalData) {
    const ctx = document.getElementById('imcChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tu IMC'],
            datasets: [{
                data: [imcData.value],
                backgroundColor: [imcData.color],
                borderColor: [imcData.color],
                borderWidth: 2,
                barThickness: 40
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `IMC: ${context.parsed.x.toFixed(1)} - ${imcData.category}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 40,
                    title: {
                        display: true,
                        text: 'IMC (kg/m²)'
                    }
                },
                y: {
                    display: false
                }
            },
            elements: {
                bar: {
                    borderRadius: 5
                }
            }
        }
    });
}

// GRÁFICO DE COMPOSICIÓN CORPORAL
function createBodyCompositionChart(bodyFat, personalData) {
    const ctx = document.getElementById('bodyCompositionChart').getContext('2d');
    
    const muscleMass = 100 - bodyFat;
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Masa Muscular Estimada', 'Grasa Corporal Estimada'],
            datasets: [{
                data: [muscleMass, bodyFat],
                backgroundColor: [COLORS.success, getBodyFatColor(bodyFat, personalData.sexo)],
                borderWidth: 2,
                borderColor: [COLORS.success, getBodyFatColor(bodyFat, personalData.sexo)]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.toFixed(1)}% (estimado)`;
                        }
                    }
                }
            }
        }
    });
}

// GRÁFICO DE METABOLISMO
function createMetabolismChart(tmb, tdee) {
    const ctx = document.getElementById('metabolismChart').getContext('2d');
    
    const activityCalories = tdee - tmb;
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['TMB (Basal)', 'Actividad', 'TDEE (Total)'],
            datasets: [{
                data: [tmb, activityCalories, tdee],
                backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.light],
                borderColor: [COLORS.primary, COLORS.secondary, COLORS.light],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.y.toFixed(0)} kcal (estimado)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Calorías Estimadas (kcal/día)'
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 5
                }
            }
        }
    });
}

// GRÁFICO DE MACRONUTRIENTES
function createMacrosChart(macros) {
    const ctx = document.getElementById('macrosChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
            datasets: [{
                data: [
                    macros.proteinas.percentage,
                    macros.carbohidratos.percentage,
                    macros.grasas.percentage
                ],
                backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.light],
                borderWidth: 2,
                borderColor: [COLORS.primary, COLORS.secondary, COLORS.light]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const macro = context.label.toLowerCase();
                            const percentage = context.parsed.toFixed(0);
                            let grams;
                            
                            if (macro.includes('proteí')) grams = macros.proteinas.grams.toFixed(0);
                            else if (macro.includes('carbo')) grams = macros.carbohidratos.grams.toFixed(0);
                            else grams = macros.grasas.grams.toFixed(0);
                            
                            return `${context.label}: ${percentage}% (${grams}g aprox.)`;
                        }
                    }
                }
            }
        }
    });
}

// GRÁFICO DE COLESTEROL
function createCholesterolChart(personalData, ratio) {
    const ctx = document.getElementById('cholesterolChart').getContext('2d');
    
    const total = parseInt(personalData.colesterolTotal);
    const hdl = parseInt(personalData.colesterolHDL);
    const ldl = total - hdl;
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total', 'HDL (Bueno)', 'LDL Estimado'],
            datasets: [{
                data: [total, hdl, ldl],
                backgroundColor: [
                    getCholesterolColor(total, 'total'),
                    getCholesterolColor(hdl, 'hdl'),
                    getCholesterolColor(ldl, 'ldl')
                ],
                borderWidth: 2,
                borderColor: [
                    getCholesterolColor(total, 'total'),
                    getCholesterolColor(hdl, 'hdl'),
                    getCholesterolColor(ldl, 'ldl')
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.y} mg/dL`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Colesterol (mg/dL)'
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 5
                }
            }
        }
    });
}

// ===== FUNCIONES AUXILIARES =====
function getStatusClass(status) {
    switch(status) {
        case 'good': return 'status-good';
        case 'warning': return 'status-warning';
        case 'danger': return 'status-danger';
        case 'attention': return 'status-attention';
        default: return 'status-good';
    }
}

function getBodyFatStatus(bodyFat, sexo) {
    const category = getBodyFatCategory(bodyFat, sexo);
    if (category.includes('Excelente') || category.includes('Bueno')) return 'status-good';
    if (category.includes('Promedio') || category.includes('Moderado')) return 'status-attention';
    if (category.includes('Alto') || category.includes('Obeso')) return 'status-warning';
    return 'status-danger';
}

function getBodyFatCategory(bodyFat, sexo) {
    if (sexo === 'hombre') {
        if (bodyFat < 6) return 'Muy Bajo';
        if (bodyFat < 14) return 'Excelente';
        if (bodyFat < 18) return 'Bueno';
        if (bodyFat < 25) return 'Promedio';
        if (bodyFat < 30) return 'Alto';
        return 'Obeso';
    } else {
        if (bodyFat < 14) return 'Muy Bajo';
        if (bodyFat < 21) return 'Excelente';
        if (bodyFat < 25) return 'Bueno';
        if (bodyFat < 32) return 'Promedio';
        if (bodyFat < 38) return 'Alto';
        return 'Obeso';
    }
}

function getBodyFatColor(bodyFat, sexo) {
    const category = getBodyFatCategory(bodyFat, sexo);
    if (category.includes('Excelente') || category.includes('Bueno')) return COLORS.success;
    if (category.includes('Promedio')) return COLORS.secondary;
    if (category.includes('Alto')) return COLORS.warning;
    return COLORS.danger;
}

function getColesterolStatus(ratio) {
    if (ratio < 4.5) return 'status-good';
    if (ratio < 5.5) return 'status-attention';
    if (ratio < 6.5) return 'status-warning';
    return 'status-danger';
}

function getColesterolCategory(ratio) {
    if (ratio < 4.5) return 'Excelente';
    if (ratio < 5.5) return 'Bueno';
    if (ratio < 6.5) return 'Moderado';
    return 'Alto Riesgo';
}

function getColesterolRiskText(ratio) {
    if (ratio < 4.5) return '(Bajo riesgo)';
    if (ratio < 5.5) return '(Riesgo promedio)';
    if (ratio < 6.5) return '(Riesgo moderado)';
    return '(Alto riesgo - consulte con su médico)';
}

function getCholesterolColor(value, type) {
    switch(type) {
        case 'total':
            if (value < 200) return COLORS.success;
            if (value < 240) return COLORS.warning;
            return COLORS.danger;
        case 'hdl':
            if (value >= 60) return COLORS.success;
            if (value >= 40) return COLORS.secondary;
            return COLORS.warning;
        case 'ldl':
            if (value < 100) return COLORS.success;
            if (value < 130) return COLORS.secondary;
            if (value < 160) return COLORS.warning;
            return COLORS.danger;
        default:
            return COLORS.primary;
    }
}

function getPressureCategory(sistolica, diastolica) {
    if (sistolica < 120 && diastolica < 80) return 'Normal';
    if (sistolica < 130 && diastolica < 80) return 'Elevada';
    if (sistolica < 140 || diastolica < 90) return 'Hipertensión Grado 1';
    if (sistolica < 180 || diastolica < 120) return 'Hipertensión Grado 2';
    return 'Crisis Hipertensiva - Busque atención médica inmediata';
}

function getPressureColor(value, type) {
    if (type === 'sistolica') {
        if (value < 120) return COLORS.success;
        if (value < 130) return COLORS.secondary;
        if (value < 140) return COLORS.warning;
        return COLORS.danger;
    } else {
        if (value < 80) return COLORS.success;
        if (value < 85) return COLORS.secondary;
        if (value < 90) return COLORS.warning;
        return COLORS.danger;
    }
}

function getHealthyWeightRange(altura) {
    const alturaM = altura / 100;
    const minWeight = (18.5 * alturaM * alturaM).toFixed(1);
    const maxWeight = (24.9 * alturaM * alturaM).toFixed(1);
    return `${minWeight} - ${maxWeight} kg`;
}

function getAbdominalRisk(cintura, sexo) {
    const limite = sexo === 'hombre' ? 102 : 88;
    if (cintura < limite) return 'Bajo';
    if (cintura < limite + 10) return 'Moderado';
    return 'Alto - Consulte con su médico';
}

function getActivityDescription(nivel) {
    const descriptions = {
        'sedentario': 'Sin ejercicio regular',
        'ligero': 'Ejercicio ligero 1-3 días/semana',
        'moderado': 'Ejercicio moderado 3-5 días/semana',
        'activo': 'Ejercicio intenso 6-7 días/semana',
        'muy_activo': 'Ejercicio muy intenso o trabajo físico'
    };
    return descriptions[nivel] || 'No especificado';
}

function generateLipidRiskAssessment(total, hdl, ratio) {
    let assessment = '<div class="risk-items">';
    
    // Evaluación del colesterol total
    if (total < 200) {
        assessment += '<div class="risk-item good">✅ Colesterol total en rango óptimo</div>';
    } else if (total < 240) {
        assessment += '<div class="risk-item warning">⚠️ Colesterol total limítrofe - vigilar</div>';
    } else {
        assessment += '<div class="risk-item danger">❌ Colesterol total elevado - requiere atención médica</div>';
    }
    
    // Evaluación del HDL
    if (hdl >= 60) {
        assessment += '<div class="risk-item good">✅ HDL excelente - protección cardiovascular</div>';
    } else if (hdl >= 40) {
        assessment += '<div class="risk-item attention">💡 HDL adecuado - se puede mejorar</div>';
    } else {
        assessment += '<div class="risk-item danger">❌ HDL bajo - factor de riesgo</div>';
    }
    
    // Evaluación del ratio
    if (ratio < 4.5) {
        assessment += '<div class="risk-item good">✅ Ratio colesterol excelente</div>';
    } else if (ratio < 5.5) {
        assessment += '<div class="risk-item attention">💡 Ratio colesterol aceptable</div>';
    } else {
        assessment += '<div class="risk-item warning">⚠️ Ratio colesterol elevado - consulte con su médico</div>';
    }
    
    assessment += '</div>';
    return assessment;
}

// ===== GENERAR RECOMENDACIONES ACTUALIZADAS (CON LENGUAJE MÁS CAUTELOSO) =====
function generateRecommendations(results) {
    const container = document.getElementById('recommendationsContainer');
    const { personalData, imc, bodyFat, score2, ratioColesterol, biologicalAge, vo2max, fitnessScore } = results;
    
    let recommendations = [];
    
    // Recomendaciones basadas en EDAD BIOLÓGICA
    if (biologicalAge.difference > 3) {
        recommendations.push({
            priority: 'high',
            category: 'Edad Biológica',
            icon: '⏰',
            title: 'Consideraciones sobre Edad Biológica',
            description: `Según las estimaciones, tu edad biológica podría ser ${biologicalAge.difference} años mayor que tu edad cronológica. Considera consultar con tu médico sobre cambios en el estilo de vida.`,
            actions: [
                'Consulte con su médico sobre un programa de ejercicio apropiado',
                'Considere evaluar su calidad del sueño con un especialista',
                'Hable con un profesional sobre técnicas de manejo del estrés',
                'Consulte con un nutricionista sobre patrones alimentarios saludables'
            ]
        });
    } else if (biologicalAge.difference < -3) {
        recommendations.push({
            priority: 'low',
            category: 'Edad Biológica',
            icon: '⏰',
            title: 'Mantener Estado Actual',
            description: `Las estimaciones sugieren que tu cuerpo podría estar en buen estado. Continúa con tus hábitos saludables.`,
            actions: [
                'Mantén tu rutina actual de ejercicio',
                'Continúa con patrones de sueño regulares',
                'Conserva tu dieta equilibrada actual',
                'Realiza chequeos médicos preventivos anuales'
            ]
        });
    }
    
    // Recomendaciones basadas en VO2 MAX
    const vo2Value = parseFloat(vo2max.value);
    if (vo2Value < 30) {
        recommendations.push({
            priority: 'high',
            category: 'Capacidad Aeróbica',
            icon: '💨',
            title: 'Considerar Mejora de Capacidad Aeróbica',
            description: `Tu VO2 máximo estimado (${vo2max.value} ml/kg/min) sugiere que podrías beneficiarte de mejorar tu capacidad aeróbica. Consulta con un profesional del ejercicio.`,
            actions: [
                'Consulte con su médico antes de iniciar cualquier programa de ejercicio',
                'Considere trabajar con un entrenador personal certificado',
                'Empiece gradualmente con actividades de baja intensidad',
                'Monitoree su respuesta al ejercicio con supervisión profesional'
            ]
        });
    }
    
    // Recomendaciones de IMC
    if (imc.value > 25) {
        recommendations.push({
            priority: 'medium',
            category: 'Peso Corporal',
            icon: '⚖️',
            title: 'Consideraciones sobre el Peso',
            description: `Tu IMC actual es ${imc.value.toFixed(1)} (${imc.category}). Consulta con profesionales de la salud sobre opciones saludables.`,
            actions: [
                'Consulte con un nutricionista para un plan alimentario personalizado',
                'Hable con su médico sobre objetivos de peso saludables',
                'Considere un programa de actividad física supervisado',
                'Evite dietas restrictivas sin supervisión profesional'
            ]
        });
    }
    
    // Recomendaciones cardiovasculares
    if (score2.value > 5) {
        recommendations.push({
            priority: 'high',
            category: 'Salud Cardiovascular',
            icon: '❤️',
            title: 'Evaluación Cardiovascular Recomendada',
            description: `Tu riesgo cardiovascular estimado es ${score2.category} (${score2.value.toFixed(1)}%). Es importante consultar con un cardiólogo.`,
            actions: [
                'Programe una consulta con un cardiólogo para evaluación completa',
                'Discuta con su médico sobre factores de riesgo modificables',
                'Pregunte sobre análisis adicionales que puedan ser necesarios',
                'Siga estrictamente las recomendaciones médicas'
            ]
        });
    }
    
    // Recomendaciones de colesterol
    if (ratioColesterol > 5) {
        recommendations.push({
            priority: personalData.colesterolTotal > 240 ? 'high' : 'medium',
            category: 'Perfil Lipídico',
            icon: '🩸',
            title: 'Evaluación del Perfil Lipídico',
            description: `Tu ratio colesterol total/HDL es ${ratioColesterol.toFixed(1)}. Consulta con tu médico sobre tu perfil lipídico.`,
            actions: [
                'Solicite a su médico un análisis completo de lípidos',
                'Consulte con un nutricionista sobre cambios dietéticos apropiados',
                'Pregunte a su médico si necesita medicación',
                'Realice seguimientos regulares según indicación médica'
            ]
        });
    }
    
    // Recomendaciones de presión arterial
    const sistolica = parseInt(personalData.presionSistolica);
    const diastolica = parseInt(personalData.presionDiastolica);
    if (sistolica >= 140 || diastolica >= 90) {
        recommendations.push({
            priority: sistolica >= 180 || diastolica >= 120 ? 'urgent' : 'high',
            category: 'Presión Arterial',
            icon: '🩺',
            title: 'Control de Presión Arterial Necesario',
            description: `Tu presión arterial (${sistolica}/${diastolica} mmHg) requiere evaluación médica.`,
            actions: [
                'Busque atención médica lo antes posible',
                'Monitoree su presión arterial regularmente',
                'Siga estrictamente el tratamiento prescrito',
                'Informe a su médico sobre cualquier síntoma'
            ]
        });
    }
    
    // Recomendaciones de tabaquismo
    if (personalData.tabaquismo === 'fumador') {
        recommendations.push({
            priority: 'urgent',
            category: 'Cesación Tabáquica',
            icon: '🚭',
            title: 'Cesación del Tabaquismo',
            description: 'El tabaquismo es un factor de riesgo mayor. Consulte con su médico sobre métodos para dejar de fumar.',
            actions: [
                'Hable con su médico sobre programas de cesación tabáquica',
                'Pregunte sobre medicamentos que pueden ayudar',
                'Considere grupos de apoyo profesionales',
                'Busque ayuda psicológica si es necesario'
            ]
        });
    }
    
    // Recomendaciones generales de salud
    recommendations.push({
        priority: 'low',
        category: 'Salud General',
        icon: '🏥',
        title: 'Chequeos Médicos Regulares',
        description: 'Mantenga un seguimiento regular con profesionales de la salud.',
        actions: [
            'Realice chequeos médicos anuales completos',
            'Mantenga al día sus vacunaciones',
            'Informe a su médico sobre cualquier cambio en su salud',
            'Guarde registro de sus valores de salud'
        ]
    });
    
    // Renderizar recomendaciones
    container.innerHTML = renderRecommendations(recommendations);
}

function renderRecommendations(recommendations) {
    // Ordenar por prioridad
    const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    let html = '<div class="recommendations-grid">';
    
    recommendations.forEach(rec => {
        html += `
            <div class="recommendation-card ${rec.priority}">
                <div class="rec-header">
                    <div class="rec-icon">${rec.icon}</div>
                    <div class="rec-title-section">
                        <h3 class="rec-title">${rec.title}</h3>
                        <div class="rec-category">${rec.category}</div>
                        <div class="rec-priority ${rec.priority}">${getPriorityText(rec.priority)}</div>
                    </div>
                </div>
                <div class="rec-description">${rec.description}</div>
                <div class="rec-actions">
                    <h4>Sugerencias:</h4>
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function getPriorityText(priority) {
    const texts = {
        'urgent': 'URGENTE',
        'high': 'ALTA PRIORIDAD',
        'medium': 'PRIORIDAD MEDIA',
        'low': 'PRIORIDAD BAJA'
    };
    return texts[priority] || 'NORMAL';
}

// ===== EXPORTAR PDF ACTUALIZADO =====
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para exportar PDF
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'exportPdfBtn') {
            exportToPDF();
        }
    });
});

function exportToPDF() {
    const button = document.getElementById('exportPdfBtn');
    const originalText = button.textContent;
    
    // Cambiar texto del botón
    button.textContent = '📄 Generando PDF...';
    button.disabled = true;
    
    // Configuración del PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Añadir contenido al PDF
    addPDFContent(doc).then(() => {
        // Restaurar botón
        button.textContent = originalText;
        button.disabled = false;
        
        // Descargar PDF
        const fecha = new Date().toLocaleDateString('es-ES');
        const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        doc.save(`Informe_Salud_meskeIA_${fecha.replace(/\//g, '-')}.pdf`);
    }).catch(error => {
        console.error('Error generando PDF:', error);
        button.textContent = originalText;
        button.disabled = false;
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    });
}

async function addPDFContent(doc) {
    const fecha = new Date().toLocaleDateString('es-ES');
    const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(46, 134, 171);
    doc.text('INFORME DE SALUD - SOLO INFORMATIVO', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('meskeIA - Evaluador de Salud', 20, 30);
    doc.text(`Fecha: ${fecha} - Hora: ${hora}`, 20, 35);
    
    // AVISO IMPORTANTE
    doc.setFontSize(10);
    doc.setTextColor(231, 76, 60);
    doc.setFont(undefined, 'bold');
    doc.text('AVISO IMPORTANTE:', 20, 45);
    doc.setFont(undefined, 'normal');
    doc.text('Este informe es únicamente informativo y no sustituye una consulta médica.', 20, 50);
    doc.text('Los resultados son estimaciones basadas en fórmulas poblacionales.', 20, 55);
    doc.text('Consulte siempre con profesionales de la salud para decisiones médicas.', 20, 60);
    
    // Datos del paciente
    const personalData = calculationResults.personalData;
    let yPos = 75;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    if (personalData.nombre) {
        doc.text(`Paciente: ${personalData.nombre}`, 20, yPos);
        yPos += 5;
    }
    doc.text(`Edad: ${personalData.edad} años | Sexo: ${personalData.sexo}`, 20, yPos);
    yPos += 5;
    doc.text(`Altura: ${personalData.altura} cm | Peso: ${personalData.peso} kg`, 20, yPos);
    
    // Resultados principales
    yPos += 15;
    doc.setFontSize(14);
    doc.setTextColor(46, 134, 171);
    doc.text('RESULTADOS PRINCIPALES (ESTIMACIONES)', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const results = calculationResults;
    doc.text(`• IMC: ${results.imc.value.toFixed(1)} kg/m² (${results.imc.category})`, 25, yPos);
    yPos += 5;
    doc.text(`• Riesgo Cardiovascular Estimado: ${results.score2.value.toFixed(1)}% (${results.score2.category})`, 25, yPos);
    yPos += 5;
    doc.text(`• Grasa Corporal Estimada: ${results.bodyFat.toFixed(1)}%`, 25, yPos);
    yPos += 5;
    doc.text(`• Metabolismo Basal Estimado: ${results.tmb.toFixed(0)} kcal/día`, 25, yPos);
    yPos += 5;
    doc.text(`• Gasto Energético Total Estimado: ${results.tdee.toFixed(0)} kcal/día`, 25, yPos);
    yPos += 5;
    doc.text(`• Ratio Colesterol: ${results.ratioColesterol.toFixed(1)}`, 25, yPos);
    
    // Nuevos indicadores
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(46, 134, 171);
    doc.text('INDICADORES DE VITALIDAD (ESTIMACIONES)', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`• Edad Biológica Estimada: ${results.biologicalAge.value} años`, 25, yPos);
    yPos += 5;
    doc.text(`• VO2 Máximo Estimado: ${results.vo2max.value} ml/kg/min`, 25, yPos);
    yPos += 5;
    doc.text(`• Índice de Forma Física: ${results.fitnessScore.value}/100`, 25, yPos);
    
    // Recordatorio final
    yPos = 250;
    doc.setFontSize(10);
    doc.setTextColor(231, 76, 60);
    doc.setFont(undefined, 'bold');
    doc.text('RECORDATORIO MÉDICO:', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text('Para una evaluación médica precisa y personalizada, consulte con profesionales sanitarios.', 20, yPos + 5);
    doc.text('Este informe no debe utilizarse para tomar decisiones médicas.', 20, yPos + 10);
    
    // Footer
    yPos = 280;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('© 2025 meskeIA - Herramienta informativa de salud', 20, yPos);
    doc.text('Los cálculos se basan en fórmulas científicas validadas para población adulta europea.', 20, yPos + 4);
}

// ===== ESTILOS CSS ADICIONALES =====
const additionalCSS = `
/* ===== ESTILOS PARA RESULTADOS CON PROTECCIONES ===== */

/* Banner de recordatorio médico */
.medical-reminder-banner {
    background: linear-gradient(135deg, #fff9e6, #fff3cd);
    border: 2px solid #ffc107;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.reminder-icon {
    font-size: 2rem;
}

.reminder-content {
    flex: 1;
    color: #856404;
    line-height: 1.6;
}

/* Avisos críticos */
.critical-warnings {
    margin-bottom: 2rem;
}

.warning-item {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.warning-item.critical {
    background: rgba(231, 76, 60, 0.1);
    border: 2px solid #e74c3c;
    color: #c0392b;
}

.warning-item.high {
    background: rgba(230, 126, 34, 0.1);
    border: 2px solid #e67e22;
    color: #d35400;
}

.warning-icon {
    font-size: 1.5rem;
}

.warning-text {
    font-weight: 600;
}

/* Disclaimer en nutrición */
.nutrition-disclaimer {
    background: rgba(231, 76, 60, 0.05);
    border-left: 4px solid #e74c3c;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
}

.nutrition-disclaimer p {
    color: #c0392b;
    font-weight: 500;
}

/* Disclaimer en recomendaciones */
.recommendations-disclaimer {
    background: rgba(46, 134, 171, 0.05);
    border-left: 4px solid #2e86ab;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
}

.recommendations-disclaimer p {
    color: #2e86ab;
}

/* Sección de emergencia */
.emergency-section {
    background: linear-gradient(135deg, #fff5f5, #ffe0e0);
}

.emergency-notice {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    border: 2px solid #e74c3c;
}

.emergency-notice h3 {
    color: #e74c3c;
    margin-bottom: 1rem;
}

.emergency-number {
    font-size: 3rem;
    font-weight: bold;
    color: #e74c3c;
    margin: 1rem 0;
}

/* Avisos en cards */
.card-warning {
    font-size: 0.75rem;
    color: #e74c3c;
    margin-top: 0.5rem;
    font-weight: 600;
}

/* Textos informativos */
.info-text {
    font-size: 0.85rem;
    color: #7f8c8d;
    font-style: italic;
    margin-top: 0.5rem;
}

.warning-text {
    color: #e74c3c;
    font-weight: 600;
    background: rgba(231, 76, 60, 0.1);
    padding: 0.5rem;
    border-radius: 6px;
    margin-top: 0.5rem;
}

/* Resto de estilos originales */
.results-section {
    background: var(--white);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
}

.results-title {
    color: var(--primary-blue);
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--light-gray);
}

.executive-summary {
    background: linear-gradient(135deg, var(--primary-blue), var(--secondary-teal));
    color: var(--white);
}

.executive-summary .results-title {
    color: var(--white);
    border-bottom-color: rgba(255,255,255,0.3);
}

.summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.summary-card {
    background: rgba(255,255,255,0.15);
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

.card-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.card-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
}

.card-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.2rem;
}

.card-status {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

/* Nueva sección vitalidad */
.vitality-section {
    background: linear-gradient(135deg, var(--light-gray), var(--white));
}

.vitality-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.vitality-card {
    background: var(--white);
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-top: 4px solid var(--secondary-teal);
}

.vitality-card.full-width {
    grid-column: 1 / -1;
}

.vitality-title {
    color: var(--primary-blue);
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
}

.vitality-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--text-dark);
}

.vitality-result {
    font-weight: 600;
    padding: 0.5rem;
    border-radius: 8px;
    margin: 0.5rem 0;
}

.vitality-result.positive {
    background: rgba(39, 174, 96, 0.1);
    color: var(--success-green);
}

.vitality-result.negative {
    background: rgba(231, 76, 60, 0.1);
    color: var(--danger);
}

.vitality-category {
    font-weight: 600;
    text-align: center;
    padding: 0.5rem;
    margin-top: 0.5rem;
}

.vo2-display {
    text-align: center;
    margin: 1.5rem 0;
}

.vo2-value {
    font-size: 3rem;
    font-weight: bold;
}

.vo2-unit {
    font-size: 1rem;
    color: var(--text-dark);
    opacity: 0.8;
}

.zones-legend {
    margin-top: 1.5rem;
    display: grid;
    gap: 0.5rem;
}

.zone-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.zone-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}

.zone-info {
    flex: 1;
}

.zone-description {
    font-size: 0.85rem;
    color: var(--text-dark);
    opacity: 0.8;
}

#biologicalAgeChart {
    max-height: 200px;
}

#vo2Chart {
    max-height: 150px;
}

#fitnessScoreChart {
    max-height: 250px;
}

#heartRateZonesChart {
    max-height: 300px;
}

/* Estilos existentes */
.analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}

.chart-container {
    background: var(--light-gray);
    border-radius: 15px;
    padding: 1.5rem;
}

.chart-title {
    color: var(--text-dark);
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
}

.chart-container canvas {
    max-height: 300px;
}

.chart-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--text-dark);
}

.macros-details {
    margin-top: 1rem;
}

.macro-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.macro-color {
    width: 15px;
    height: 15px;
    border-radius: 3px;
}

.risk-assessment {
    padding: 1rem;
    background: var(--white);
    border-radius: 10px;
}

.risk-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.risk-item {
    padding: 0.5rem;
    border-radius: 5px;
    font-size: 0.9rem;
}

.risk-item.good { background: rgba(39, 174, 96, 0.1); color: var(--success-green); }
.risk-item.attention { background: rgba(72, 169, 166, 0.1); color: var(--secondary-teal); }
.risk-item.warning { background: rgba(230, 126, 34, 0.1); color: var(--warning-orange); }
.risk-item.danger { background: rgba(231, 76, 60, 0.1); color: var(--danger); }

.recommendations-section {
    background: linear-gradient(135deg, var(--light-gray), var(--white));
}

.recommendations-grid {
    display: grid;
    gap: 1.5rem;
}

.recommendation-card {
    background: var(--white);
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-left: 5px solid;
}

.recommendation-card.urgent { border-left-color: var(--danger); }
.recommendation-card.high { border-left-color: var(--warning-orange); }
.recommendation-card.medium { border-left-color: var(--secondary-teal); }
.recommendation-card.low { border-left-color: var(--success-green); }

.rec-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
}

.rec-icon {
    font-size: 2rem;
}

.rec-title {
    color: var(--text-dark);
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
}

.rec-category {
    color: var(--secondary-teal);
    font-size: 0.9rem;
    font-weight: 500;
}

.rec-priority {
    font-size: 0.7rem;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    text-transform: uppercase;
    margin-top: 0.3rem;
    display: inline-block;
}

.rec-priority.urgent { background: var(--danger); color: white; }
.rec-priority.high { background: var(--warning-orange); color: white; }
.rec-priority.medium { background: var(--secondary-teal); color: white; }
.rec-priority.low { background: var(--success-green); color: white; }

.rec-description {
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-size: 0.95rem;
    line-height: 1.5;
}

.rec-actions h4 {
    color: var(--primary-blue);
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.rec-actions ul {
    list-style: none;
    padding: 0;
}

.rec-actions li {
    padding: 0.3rem 0;
    padding-left: 1.5rem;
    position: relative;
    font-size: 0.9rem;
    line-height: 1.4;
}

.rec-actions li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--secondary-teal);
    font-weight: bold;
}

.export-container {
    text-align: center;
    padding: 2rem;
}

.export-btn {
    background: linear-gradient(135deg, var(--primary-blue), var(--secondary-teal));
    color: var(--white);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: var(--shadow);
}

.export-btn:hover {
    transform: translateY(-2px);
}

.export-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.export-info {
    margin-top: 0.5rem;
    color: var(--text-dark);
    font-size: 0.9rem;
}

.status-good { border-left-color: var(--success-green); }
.status-attention { border-left-color: var(--secondary-teal); }
.status-warning { border-left-color: var(--warning-orange); }
.status-danger { border-left-color: var(--danger); }

/* Plan nutricional */
.nutrition-plan {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.plan-summary {
    background: linear-gradient(135deg, #48A9A6, #7FB3D3);
    border-radius: 15px;
    padding: 2rem;
    color: white;
}

.plan-summary h3 {
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    text-align: center;
}

.totals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.total-item {
    background: rgba(255,255,255,0.15);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

.total-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: block;
}

.total-value {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
}

.total-label {
    font-size: 0.9rem;
    opacity: 0.9;
}

.meals-distribution h3 {
    color: #2E86AB;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.meals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.meal-card {
    background: #ECF0F1;
    border-radius: 15px;
    padding: 1.5rem;
    border-left: 5px solid #48A9A6;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meal-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(72, 169, 166, 0.15);
}

.meal-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid rgba(46, 134, 171, 0.1);
}

.meal-icon {
    font-size: 2.5rem;
}

.meal-name {
    color: #2E86AB;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
}

.meal-time {
    color: #48A9A6;
    font-size: 0.9rem;
    font-weight: 500;
}

.meal-percentage {
    color: #7FB3D3;
    font-size: 0.8rem;
    font-style: italic;
}

.meal-macros {
    margin-bottom: 1rem;
}

.macro-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0;
    border-bottom: 1px solid rgba(46, 134, 171, 0.1);
}

.macro-label {
    color: #2C3E50;
    font-size: 0.9rem;
    font-weight: 500;
}

.macro-value {
    color: #2E86AB;
    font-weight: bold;
    font-size: 0.95rem;
}

.meal-suggestions h5 {
    color: #2E86AB;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.suggestion-item {
    background: rgba(255,255,255,0.6);
    padding: 0.5rem;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #2C3E50;
    border-left: 3px solid #48A9A6;
}

/* Responsive */
@media (max-width: 768px) {
    .totals-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .meals-grid {
        grid-template-columns: 1fr;
    }
    
    .meal-header {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
    
    .vitality-grid {
        grid-template-columns: 1fr;
    }
    
    .analysis-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Añadir estilos al documento
if (!document.getElementById('resultsStyles')) {
    const style = document.createElement('style');
    style.id = 'resultsStyles';
    style.textContent = additionalCSS;
    document.head.appendChild(style);
}