// Datos del cuestionario
const questions = [
    {
        id: 1,
        question: "¿Cuál es tu edad?",
        options: [
            { text: "18-25 años", value: 4 },
            { text: "26-35 años", value: 3 },
            { text: "36-50 años", value: 2 },
            { text: "51-65 años", value: 1 },
            { text: "Más de 65 años", value: 0 }
        ]
    },
    {
        id: 2,
        question: "¿Cuál es tu experiencia con inversiones?",
        options: [
            { text: "Soy principiante, tengo poca o ninguna experiencia", value: 0 },
            { text: "Tengo conocimiento básico", value: 1 },
            { text: "Tengo experiencia moderada", value: 2 },
            { text: "Soy un inversor experimentado", value: 3 },
            { text: "Soy un experto en inversiones", value: 4 }
        ]
    },
    {
        id: 3,
        question: "¿Cuál es tu situación financiera actual?",
        options: [
            { text: "Muy estable, tengo ahorros significativos", value: 4 },
            { text: "Estable, tengo un fondo de emergencia", value: 3 },
            { text: "Moderadamente estable", value: 2 },
            { text: "Algo inestable", value: 1 },
            { text: "Muy inestable", value: 0 }
        ]
    },
    {
        id: 4,
        question: "¿Por cuánto tiempo planeas mantener tus inversiones?",
        options: [
            { text: "Menos de 1 año", value: 0 },
            { text: "1-3 años", value: 1 },
            { text: "3-5 años", value: 2 },
            { text: "5-10 años", value: 3 },
            { text: "Más de 10 años", value: 4 }
        ]
    },
    {
        id: 5,
        question: "Si tus inversiones perdieran el 20% de su valor en un mes, ¿qué harías?",
        options: [
            { text: "Vendería inmediatamente para evitar más pérdidas", value: 0 },
            { text: "Me preocuparía mucho y consideraría vender", value: 1 },
            { text: "Me mantendría neutral", value: 2 },
            { text: "Mantendría mis inversiones", value: 3 },
            { text: "Compraría más aprovechando el precio bajo", value: 4 }
        ]
    },
    {
        id: 6,
        question: "¿Qué porcentaje de tus ingresos puedes destinar a inversiones?",
        options: [
            { text: "Menos del 5%", value: 0 },
            { text: "5-10%", value: 1 },
            { text: "10-20%", value: 2 },
            { text: "20-30%", value: 3 },
            { text: "Más del 30%", value: 4 }
        ]
    },
    {
        id: 7,
        question: "¿Cuál es tu objetivo principal al invertir?",
        options: [
            { text: "Preservar mi capital", value: 0 },
            { text: "Generar ingresos estables", value: 1 },
            { text: "Crecimiento moderado", value: 2 },
            { text: "Crecimiento agresivo", value: 3 },
            { text: "Maximizar ganancias a largo plazo", value: 4 }
        ]
    },
    {
        id: 8,
        question: "¿Qué tan cómodo te sientes con la volatilidad del mercado?",
        options: [
            { text: "Muy incómodo, prefiero estabilidad", value: 0 },
            { text: "Algo incómodo", value: 1 },
            { text: "Neutral", value: 2 },
            { text: "Bastante cómodo", value: 3 },
            { text: "Muy cómodo, no me molesta la volatilidad", value: 4 }
        ]
    },
    {
        id: 9,
        question: "¿Tienes deudas significativas (hipoteca, préstamos)?",
        options: [
            { text: "Sí, tengo deudas altas con intereses elevados", value: 0 },
            { text: "Sí, tengo algunas deudas", value: 1 },
            { text: "Tengo deudas menores", value: 2 },
            { text: "Tengo pocas deudas", value: 3 },
            { text: "No tengo deudas", value: 4 }
        ]
    },
    {
        id: 10,
        question: "¿Cómo reaccionas ante las noticias económicas negativas?",
        options: [
            { text: "Me preocupo mucho y tomo decisiones impulsivas", value: 0 },
            { text: "Me preocupo pero trato de mantener la calma", value: 1 },
            { text: "Mantengo una posición neutral", value: 2 },
            { text: "Las considero pero no afectan mis decisiones", value: 3 },
            { text: "Las veo como oportunidades", value: 4 }
        ]
    }
];

// Perfiles de riesgo
const riskProfiles = {
    conservador: {
        name: "Conservador",
        range: [0, 12],
        description: "Prefieres la seguridad y estabilidad por encima de altos rendimientos.",
        characteristics: [
            "Baja tolerancia al riesgo",
            "Prioriza la preservación del capital",
            "Prefiere inversiones estables y predecibles",
            "Horizonte de inversión corto a mediano plazo"
        ],
        recommendations: [
            "Bonos gubernamentales",
            "Certificados de depósito",
            "Fondos de renta fija",
            "Cuentas de ahorro de alto rendimiento"
        ],
        allocation: "10% Acciones, 80% Bonos, 10% Efectivo",
        color: "#4CAF50"
    },
    moderado: {
        name: "Moderado",
        range: [13, 25],
        description: "Buscas un equilibrio entre seguridad y crecimiento.",
        characteristics: [
            "Tolerancia al riesgo media",
            "Busca equilibrio entre seguridad y rendimiento",
            "Acepta cierta volatilidad por mayores retornos",
            "Horizonte de inversión mediano plazo"
        ],
        recommendations: [
            "Fondos mixtos",
            "ETFs diversificados",
            "Combinación de acciones y bonos",
            "Fondos de inversión balanceados"
        ],
        allocation: "50% Acciones, 40% Bonos, 10% Efectivo",
        color: "#FF9800"
    },
    agresivo: {
        name: "Agresivo",
        range: [26, 40],
        description: "Estás dispuesto a asumir riesgos significativos por mayores rendimientos.",
        characteristics: [
            "Alta tolerancia al riesgo",
            "Prioriza el crecimiento del capital",
            "Acepta alta volatilidad",
            "Horizonte de inversión largo plazo"
        ],
        recommendations: [
            "Acciones de crecimiento",
            "ETFs de mercados emergentes",
            "Fondos de pequeña capitalización",
            "Inversiones alternativas"
        ],
        allocation: "80% Acciones, 15% Bonos, 5% Efectivo",
        color: "#F44336"
    }
};

// Variables globales
let currentQuestionIndex = 0;
let answers = [];
let totalScore = 0;

// Debug: Agregar logs para diagnóstico
console.log('🔍 Script cargado');
console.log('📝 Número de preguntas:', questions.length);

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado, inicializando quiz...');
    initializeQuiz();
});

function initializeQuiz() {
    console.log('⚙️ Inicializando quiz...');
    
    // Verificar que los elementos existen
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const quizContainer = document.getElementById('quizContainer');
    
    if (!totalQuestionsElement) {
        console.error('❌ No se encontró el elemento totalQuestions');
        return;
    }
    
    if (!quizContainer) {
        console.error('❌ No se encontró el elemento quizContainer');
        return;
    }
    
    totalQuestionsElement.textContent = questions.length;
    console.log('✅ Total de preguntas establecido:', questions.length);
    
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    console.log('📋 Mostrando pregunta:', index + 1);
    
    const question = questions[index];
    const container = document.getElementById('quizContainer');
    
    if (!container) {
        console.error('❌ No se encontró el contenedor del quiz');
        return;
    }
    
    if (!question) {
        console.error('❌ No se encontró la pregunta con índice:', index);
        return;
    }
    
    console.log('📝 Pregunta actual:', question.question);
    
    const questionHTML = `
        <div class="question-card">
            <h3>Pregunta ${index + 1}</h3>
            <p class="question-text">${question.question}</p>
            <div class="options-container">
                ${question.options.map((option, optionIndex) => `
                    <button class="option-btn" onclick="selectAnswer(${option.value}, ${optionIndex})" data-option="${optionIndex}">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = questionHTML;
    console.log('✅ HTML de la pregunta insertado');
    
    updateProgress();
}

function selectAnswer(value, optionIndex) {
    console.log('👆 Respuesta seleccionada:', value, 'opción:', optionIndex);
    
    // Marcar opción seleccionada visualmente
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => btn.classList.remove('selected'));
    
    if (options[optionIndex]) {
        options[optionIndex].classList.add('selected');
    }
    
    // Guardar respuesta
    answers[currentQuestionIndex] = value;
    console.log('💾 Respuesta guardada. Respuestas actuales:', answers);
    
    // Continuar después de un breve delay
    setTimeout(() => {
        nextQuestion();
    }, 500);
}

function nextQuestion() {
    console.log('➡️ Avanzando a siguiente pregunta...');
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        console.log('🎯 Quiz completado, calculando resultados...');
        calculateResults();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const currentQuestionElement = document.getElementById('currentQuestion');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = currentQuestionIndex + 1;
    }
    
    console.log('📊 Progreso actualizado:', Math.round(progress) + '%');
}

function calculateResults() {
    totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    console.log('🧮 Puntuación total:', totalScore);
    
    let userProfile;
    for (const profile in riskProfiles) {
        const profileData = riskProfiles[profile];
        if (totalScore >= profileData.range[0] && totalScore <= profileData.range[1]) {
            userProfile = profileData;
            break;
        }
    }
    
    console.log('🎭 Perfil determinado:', userProfile.name);
    showResults(userProfile);
}

function showResults(profile) {
    console.log('📋 Mostrando resultados para perfil:', profile.name);
    
    const quizContainer = document.getElementById('quizContainer');
    const resultContainer = document.getElementById('resultContainer');
    
    if (quizContainer) quizContainer.style.display = 'none';
    
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar) progressBar.style.display = 'none';
    if (progressText) progressText.style.display = 'none';
    
    if (!resultContainer) {
        console.error('❌ No se encontró el contenedor de resultados');
        return;
    }
    
    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div class="profile-badge" style="background-color: ${profile.color}">
                    ${profile.name}
                </div>
                <h2>Tu Perfil de Riesgo</h2>
                <p class="score">Puntuación: ${totalScore}/40</p>
            </div>
            
            <div class="result-content">
                <div class="description-section">
                    <h3>Descripción</h3>
                    <p>${profile.description}</p>
                </div>
                
                <div class="characteristics-section">
                    <h3>Características</h3>
                    <ul>
                        ${profile.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="recommendations-section">
                    <h3>Inversiones Recomendadas</h3>
                    <ul>
                        ${profile.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="allocation-section">
                    <h3>Distribución Sugerida</h3>
                    <div class="allocation-bar" style="background: linear-gradient(to right, #2196F3 0% 50%, #4CAF50 50% 90%, #FFC107 90% 100%);">
                        <div class="allocation-text">${profile.allocation}</div>
                    </div>
                </div>
                
                <div class="actions-section">
                    <button class="btn primary" onclick="generatePDF()">📄 Descargar Reporte PDF</button>
                    <button class="btn secondary" onclick="restartQuiz()">🔄 Realizar Test Nuevamente</button>
                </div>
            </div>
        </div>
    `;
    
    resultContainer.style.display = 'block';
    console.log('✅ Resultados mostrados correctamente');
}

function restartQuiz() {
    console.log('🔄 Reiniciando quiz...');
    
    currentQuestionIndex = 0;
    answers = [];
    totalScore = 0;
    
    const quizContainer = document.getElementById('quizContainer');
    const resultContainer = document.getElementById('resultContainer');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (quizContainer) quizContainer.style.display = 'block';
    if (resultContainer) resultContainer.style.display = 'none';
    if (progressBar) progressBar.style.display = 'block';
    if (progressText) progressText.style.display = 'block';
    
    initializeQuiz();
}

function generatePDF() {
    console.log('📄 Generando PDF...');
    
    try {
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined') {
            console.error('❌ jsPDF no está disponible');
            alert('Error: La librería jsPDF no está cargada correctamente.');
            return;
        }

        console.log('✅ jsPDF está disponible');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Obtener el perfil actual
        let currentProfile;
        for (const profile in riskProfiles) {
            const profileData = riskProfiles[profile];
            if (totalScore >= profileData.range[0] && totalScore <= profileData.range[1]) {
                currentProfile = profileData;
                break;
            }
        }

        console.log('📊 Generando PDF para perfil:', currentProfile.name);

        // Configurar fuente y márgenes
        const margin = 20;
        let yPosition = margin;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (margin * 2);

        // Título principal
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de Perfil de Riesgo', margin, yPosition);
        yPosition += 15;

        // Fecha
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const today = new Date().toLocaleDateString('es-ES');
        doc.text(`Fecha: ${today}`, margin, yPosition);
        yPosition += 20;

        // Perfil de riesgo
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Perfil: ${currentProfile.name}`, margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Puntuación: ${totalScore}/40`, margin, yPosition);
        yPosition += 15;

        // Descripción
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Descripción:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const descriptionLines = doc.splitTextToSize(currentProfile.description, contentWidth);
        doc.text(descriptionLines, margin, yPosition);
        yPosition += (descriptionLines.length * 6) + 10;

        // Características
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Características:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        currentProfile.characteristics.forEach(char => {
            doc.text(`• ${char}`, margin + 5, yPosition);
            yPosition += 6;
        });
        yPosition += 10;

        // Inversiones recomendadas
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Inversiones Recomendadas:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        currentProfile.recommendations.forEach(rec => {
            doc.text(`• ${rec}`, margin + 5, yPosition);
            yPosition += 6;
        });
        yPosition += 10;

        // Distribución sugerida
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Distribución Sugerida:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(currentProfile.allocation, margin + 5, yPosition);
        yPosition += 15;

        // Pie de página
        const footerY = doc.internal.pageSize.height - 20;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Este reporte es generado por la Calculadora de Perfil de Riesgo.', margin, footerY);
        doc.text('Para más información visite: Decisiones de Inversión', margin, footerY + 5);

        // Descargar el PDF
        const fileName = `perfil-riesgo-${currentProfile.name.toLowerCase()}-${today.replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
        
        console.log('✅ PDF generado exitosamente:', fileName);
        
    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
}

// Test inicial para verificar que el script se carga
console.log('🎯 Script risk-calculator.js cargado completamente');