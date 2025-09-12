// Variables globales para el cálculo
let calculationResults = null;
let compoundChart = null;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Calculadora de Rentabilidad Compuesta cargada');
    
    // Agregar listeners para cálculo automático cuando cambien los valores
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(autoCalculate, 500));
    });
    
    // Calcular con valores por defecto al cargar
    calculateCompoundInterest();
});

// Función principal de cálculo
function calculateCompoundInterest(shouldScroll = false) {
    try {
        console.log('🧮 Iniciando cálculo de rentabilidad compuesta...');
        
        // Obtener valores del formulario
        const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
        const investmentPeriod = parseInt(document.getElementById('investmentPeriod').value) || 1;
        const compoundFrequency = parseInt(document.getElementById('compoundFrequency').value) || 12;
        
        // Validar entradas
        if (initialCapital < 0 || monthlyContribution < 0 || annualRate < 0 || investmentPeriod <= 0) {
            alert('Por favor, ingresa valores válidos (no negativos).');
            return;
        }
        
        console.log('📊 Parámetros:', {
            initialCapital,
            monthlyContribution,
            annualRate,
            investmentPeriod,
            compoundFrequency
        });
        
        // Realizar cálculos
        const results = performCompoundCalculation(
            initialCapital,
            monthlyContribution,
            annualRate,
            investmentPeriod,
            compoundFrequency
        );
        
        // Guardar resultados globalmente
        calculationResults = results;
        
        // Mostrar resultados
        displayResults(results, shouldScroll);        
        console.log('✅ Cálculo completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error en el cálculo:', error);
        alert('Error al realizar el cálculo. Por favor, verifica los valores ingresados.');
    }
}

// Función para realizar los cálculos matemáticos
function performCompoundCalculation(principal, monthlyPayment, annualRate, years, compoundingFrequency) {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    const periodsPerYear = compoundingFrequency;
    const ratePerPeriod = annualRate / 100 / periodsPerYear;
    
    let yearlyData = [];
    let currentBalance = principal;
    let totalContributed = principal;
    
    // Cálculo año por año
    for (let year = 1; year <= years; year++) {
        let yearStartBalance = currentBalance;
        let yearContributions = 0;
        let yearInterest = 0;
        
        // Cálculo mes por mes para este año
        for (let month = 1; month <= 12; month++) {
            // Agregar aportación mensual
            currentBalance += monthlyPayment;
            yearContributions += monthlyPayment;
            totalContributed += monthlyPayment;
            
            // Calcular interés compuesto
            if (compoundingFrequency === 12) {
                // Capitalización mensual
                const monthlyInterest = currentBalance * monthlyRate;
                currentBalance += monthlyInterest;
                yearInterest += monthlyInterest;
            } else {
                // Otras frecuencias de capitalización
                const periodsThisMonth = compoundingFrequency / 12;
                for (let period = 0; period < periodsThisMonth; period++) {
                    currentBalance *= (1 + ratePerPeriod);
                }
                yearInterest = currentBalance - yearStartBalance - yearContributions;
            }
        }
        
        yearlyData.push({
            year: year,
            startBalance: yearStartBalance,
            contributions: yearContributions,
            interest: yearInterest,
            endBalance: currentBalance,
            totalContributed: totalContributed
        });
    }
    
    const finalAmount = currentBalance;
    const totalInterest = finalAmount - totalContributed;
    const roi = ((finalAmount - totalContributed) / totalContributed) * 100;
    
    return {
        finalAmount: finalAmount,
        totalContributed: totalContributed,
        totalInterest: totalInterest,
        roi: roi,
        yearlyData: yearlyData,
        parameters: {
            initialCapital: principal,
            monthlyContribution: monthlyPayment,
            annualRate: annualRate,
            investmentPeriod: years,
            compoundFrequency: compoundingFrequency
        }
    };
}

// Mostrar resultados en la interfaz
function displayResults(results, shouldScroll = false) {
    // Mostrar contenedor de resultados
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Actualizar tarjetas de resumen
    document.getElementById('finalAmount').textContent = formatCurrency(results.finalAmount);
    document.getElementById('totalContributed').textContent = formatCurrency(results.totalContributed);
    document.getElementById('interestEarned').textContent = formatCurrency(results.totalInterest);
    document.getElementById('totalROI').textContent = formatPercentage(results.roi);
    
    // Generar tabla detallada
    generateDetailTable(results.yearlyData);
    
    // Generar gráfico
    generateChart(results.yearlyData);
    
    // Solo hacer scroll si se solicita explícitamente (botón manual)
    if (shouldScroll) {
        setTimeout(() => {
            document.getElementById('resultsContainer').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
}

// Generar tabla detallada
function generateDetailTable(yearlyData) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    yearlyData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Año ${data.year}</td>
            <td>${formatCurrency(data.contributions)}</td>
            <td>${formatCurrency(data.interest)}</td>
            <td>${formatCurrency(data.endBalance)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Generar gráfico con Chart.js
function generateChart(yearlyData) {
    const ctx = document.getElementById('compoundChart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (compoundChart) {
        compoundChart.destroy();
    }
    
    const years = yearlyData.map(data => `Año ${data.year}`);
    const balances = yearlyData.map(data => data.endBalance);
    const contributions = yearlyData.map(data => data.totalContributed);
    
    compoundChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Balance Total',
                    data: balances,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Aportado',
                    data: contributions,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolución de la Inversión a lo Largo del Tiempo'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Función para limpiar la calculadora
function resetCalculator() {
    document.getElementById('initialCapital').value = 10000;
    document.getElementById('monthlyContribution').value = 500;
    document.getElementById('annualRate').value = 7;
    document.getElementById('investmentPeriod').value = 20;
    document.getElementById('compoundFrequency').value = 12;
    
    document.getElementById('resultsContainer').style.display = 'none';
    
    if (compoundChart) {
        compoundChart.destroy();
        compoundChart = null;
    }
    
    calculationResults = null;
    console.log('🔄 Calculadora reiniciada');
}

// Cálculo automático con debounce
function autoCalculate() {
    const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const annualRate = parseFloat(document.getElementById('annualRate').value) || 0;
    const investmentPeriod = parseInt(document.getElementById('investmentPeriod').value) || 1;
    
    if (initialCapital >= 0 && monthlyContribution >= 0 && annualRate >= 0 && investmentPeriod > 0) {
        calculateCompoundInterest(false); // No hacer scroll automático
    }
}

// Función debounce para evitar cálculos excesivos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generar PDF con los resultados
function generatePDF() {
    if (!calculationResults) {
        alert('No hay resultados para generar el reporte.');
        return;
    }
    
    try {
        console.log('📄 Generando PDF...');
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const margin = 20;
        let yPosition = margin;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (margin * 2);
        
        // Título
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de Rentabilidad Compuesta', margin, yPosition);
        yPosition += 15;
        
        // Fecha
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const today = new Date().toLocaleDateString('es-ES');
        doc.text(`Fecha: ${today}`, margin, yPosition);
        yPosition += 20;
        
        // Parámetros de inversión
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Parámetros de Inversión:', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const params = calculationResults.parameters;
        doc.text(`• Capital inicial: ${formatCurrency(params.initialCapital)}`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`• Aportación mensual: ${formatCurrency(params.monthlyContribution)}`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`• Tasa de interés anual: ${params.annualRate}%`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`• Período de inversión: ${params.investmentPeriod} años`, margin + 5, yPosition);
        yPosition += 15;
        
        // Resultados principales
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Resultados:', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Capital final: ${formatCurrency(calculationResults.finalAmount)}`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`• Total aportado: ${formatCurrency(calculationResults.totalContributed)}`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`• Intereses generados: ${formatCurrency(calculationResults.totalInterest)}`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`• ROI total: ${formatPercentage(calculationResults.roi)}`, margin + 5, yPosition);
        yPosition += 15;
        
        // Tabla de evolución anual (primeros 10 años)
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Evolución Anual (primeros 10 años):', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        // Encabezados de tabla
        doc.text('Año', margin, yPosition);
        doc.text('Aportaciones', margin + 30, yPosition);
        doc.text('Intereses', margin + 80, yPosition);
        doc.text('Balance Total', margin + 130, yPosition);
        yPosition += 8;
        
        // Datos de tabla (máximo 10 años)
        const maxYears = Math.min(10, calculationResults.yearlyData.length);
        for (let i = 0; i < maxYears; i++) {
            const data = calculationResults.yearlyData[i];
            doc.text(`${data.year}`, margin, yPosition);
            doc.text(`${formatCurrency(data.contributions)}`, margin + 30, yPosition);
            doc.text(`${formatCurrency(data.interest)}`, margin + 80, yPosition);
            doc.text(`${formatCurrency(data.endBalance)}`, margin + 130, yPosition);
            yPosition += 6;
        }
        
        // Pie de página
        const footerY = doc.internal.pageSize.height - 20;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Este reporte es generado por la Calculadora de Rentabilidad Compuesta.', margin, footerY);
        doc.text('Para más información visite: Decisiones de Inversión', margin, footerY + 5);
        
        // Descargar
        const fileName = `rentabilidad-compuesta-${today.replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
        
        console.log('✅ PDF generado exitosamente:', fileName);
        
    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
}

// Compartir resultados (funcionalidad básica)
function shareResults() {
    if (!calculationResults) {
        alert('No hay resultados para compartir.');
        return;
    }
    
    const shareText = `🧮 Mi proyección de inversión:
💰 Capital final: ${formatCurrency(calculationResults.finalAmount)}
📥 Total aportado: ${formatCurrency(calculationResults.totalContributed)}
📊 Intereses generados: ${formatCurrency(calculationResults.totalInterest)}
🎯 ROI: ${formatPercentage(calculationResults.roi)}

Calculado con la Calculadora de Rentabilidad Compuesta`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Proyección de Inversión',
            text: shareText,
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultados copiados al portapapeles');
        });
    }
}

// Funciones de utilidad para formateo
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercentage(percentage) {
    return new Intl.NumberFormat('es-ES', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(percentage / 100);
}

console.log('🎯 Script compound-calculator.js cargado completamente');