// Clase principal de la aplicación
class ElectricityCalculator {
    constructor() {
        this.currentTab = 'ohm';
        this.history = [];
        this.electronAnimation = null;
        this.init();
    }

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.initializeElectronAnimation();
        this.trackEvent('app_init');
    }

    // Funciones de formato español (números con coma decimal)
    formatNumber(num, decimals = 2) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        return num.toLocaleString('es-ES', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    parseSpanishNumber(str) {
        if (!str) return 0;
        // Reemplazar coma por punto para parseFloat
        return parseFloat(str.toString().replace(',', '.'));
    }

    // Event Listeners
    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Ley de Ohm - Inputs
        const ohmInputs = ['voltage', 'current', 'resistance'];
        ohmInputs.forEach(id => {
            const input = document.getElementById(id);
            const slider = document.getElementById(`${id}-slider`);

            input.addEventListener('input', (e) => {
                this.calculateOhm(id);
                slider.value = e.target.value;
                this.updateCircuitDisplay();
            });

            slider.addEventListener('input', (e) => {
                input.value = e.target.value;
                this.calculateOhm(id);
                this.updateCircuitDisplay();
            });
        });

        // Potencia - Inputs
        const powerInputs = ['power-voltage', 'power-current'];
        powerInputs.forEach(id => {
            const input = document.getElementById(id);
            const slider = document.getElementById(`${id}-slider`);

            input.addEventListener('input', (e) => {
                this.calculatePower();
                slider.value = e.target.value;
                this.updateCircuitDisplay();
            });

            slider.addEventListener('input', (e) => {
                input.value = e.target.value;
                this.calculatePower();
                this.updateCircuitDisplay();
            });
        });

        // Ejemplos
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadExample(e.currentTarget.dataset.example);
            });
        });

        // Historial
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        // === NUEVOS EVENT LISTENERS PARA FASE 1 ===

        // Serie/Paralelo
        this.setupSeriesParallelListeners();

        // Cables
        this.setupCableListeners();

        // Consumo
        this.setupConsumptionListeners();

        // FAQs desplegables
        this.setupFAQListeners();

        // Interactividad de diagramas Serie/Paralelo
        this.setupDiagramListeners();
    }

    // === SISTEMA DE FAQs DESPLEGABLES ===
    setupFAQListeners() {
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.parentElement;
                const wasActive = faqItem.classList.contains('active');

                // Cerrar todas las FAQs del mismo panel
                const panel = button.closest('.faq-section');
                panel.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Abrir/cerrar la FAQ clickeada
                if (!wasActive) {
                    faqItem.classList.add('active');
                }

                this.trackEvent('faq_toggle', {
                    question: button.textContent,
                    panel: panel.dataset.panel
                });
            });
        });
    }

    // === INTERACTIVIDAD DIAGRAMAS ===
    setupDiagramListeners() {
        // Click en diagrama Serie
        const seriesDiagram = document.getElementById('series-diagram');
        if (seriesDiagram) {
            seriesDiagram.addEventListener('click', () => {
                const seriesRadio = document.querySelector('input[name="circuit-mode"][value="series"]');
                if (seriesRadio) {
                    seriesRadio.checked = true;
                    this.calculateSeriesParallel();
                    this.updateSeriesParallelCircuit();
                    this.trackEvent('diagram_clicked', { mode: 'series' });
                }
            });
        }

        // Click en diagrama Paralelo
        const parallelDiagram = document.getElementById('parallel-diagram');
        if (parallelDiagram) {
            parallelDiagram.addEventListener('click', () => {
                const parallelRadio = document.querySelector('input[name="circuit-mode"][value="parallel"]');
                if (parallelRadio) {
                    parallelRadio.checked = true;
                    this.calculateSeriesParallel();
                    this.updateSeriesParallelCircuit();
                    this.trackEvent('diagram_clicked', { mode: 'parallel' });
                }
            });
        }
    }

    // === FUNCIONALIDADES SERIE/PARALELO ===
    setupSeriesParallelListeners() {
        // Cambio de modo serie/paralelo
        document.querySelectorAll('input[name="circuit-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.calculateSeriesParallel();
                this.updateSeriesParallelCircuit();
            });
        });

        // Añadir resistencia
        document.getElementById('add-resistor').addEventListener('click', () => {
            this.addResistor();
        });

        // Voltaje del circuito serie/paralelo
        document.getElementById('series-voltage').addEventListener('input', () => {
            this.calculateSeriesParallel();
        });

        // Calcular inicial
        this.calculateSeriesParallel();
    }

    addResistor() {
        const resistorsList = document.getElementById('resistors-list');
        const resistorCount = resistorsList.children.length + 1;

        if (resistorCount > 10) {
            alert('Máximo 10 resistencias permitidas');
            return;
        }

        const resistorDiv = document.createElement('div');
        resistorDiv.className = 'resistor-input';
        resistorDiv.innerHTML = `
            <span class="resistor-label">R${resistorCount}:</span>
            <input type="number" class="resistor-value" value="10" step="0.1">
            <span>Ω</span>
            <button class="remove-btn" onclick="this.parentElement.remove(); electricityApp.calculateSeriesParallel()">❌</button>
        `;

        resistorsList.appendChild(resistorDiv);

        // Añadir listener al nuevo input
        resistorDiv.querySelector('.resistor-value').addEventListener('input', () => {
            this.calculateSeriesParallel();
        });

        this.calculateSeriesParallel();
        this.trackEvent('resistor_added', { count: resistorCount });
    }

    calculateSeriesParallel() {
        const mode = document.querySelector('input[name="circuit-mode"]:checked').value;
        const resistorInputs = document.querySelectorAll('.resistor-value');
        const voltage = this.parseSpanishNumber(document.getElementById('series-voltage').value) || 0;

        let totalResistance = 0;
        const resistances = [];

        resistorInputs.forEach(input => {
            const value = this.parseSpanishNumber(input.value) || 0;
            if (value > 0) resistances.push(value);
        });

        if (resistances.length === 0) return;

        if (mode === 'series') {
            // Serie: R_total = R1 + R2 + R3...
            totalResistance = resistances.reduce((sum, r) => sum + r, 0);
            document.getElementById('series-formula').textContent = 'R_total = R₁ + R₂ + R₃...';
            document.querySelector('#series-panel .formula-desc').textContent = 'Resistencias en Serie';
        } else {
            // Paralelo: 1/R_total = 1/R1 + 1/R2 + 1/R3...
            const inverseSum = resistances.reduce((sum, r) => sum + (1 / r), 0);
            totalResistance = 1 / inverseSum;
            document.getElementById('series-formula').textContent = '1/R_total = 1/R₁ + 1/R₂ + 1/R₃...';
            document.querySelector('#series-panel .formula-desc').textContent = 'Resistencias en Paralelo';
        }

        // Calcular corriente
        const current = voltage > 0 && totalResistance > 0 ? voltage / totalResistance : 0;

        // Actualizar displays
        document.getElementById('total-resistance').textContent = this.formatNumber(totalResistance, 1) + ' Ω';
        document.getElementById('series-current').textContent = this.formatNumber(current, 3) + ' A';

        // Actualizar circuito si estamos en esa pestaña
        if (this.currentTab === 'series') {
            this.updateCircuitDisplay();
        }
    }

    updateSeriesParallelCircuit() {
        const mode = document.querySelector('input[name="circuit-mode"]:checked')?.value || 'series';

        // Actualizar estado de los diagramas
        const seriesDiagram = document.getElementById('series-diagram');
        const parallelDiagram = document.getElementById('parallel-diagram');

        if (seriesDiagram && parallelDiagram) {
            if (mode === 'series') {
                seriesDiagram.classList.add('active');
                parallelDiagram.classList.remove('active');
            } else {
                seriesDiagram.classList.remove('active');
                parallelDiagram.classList.add('active');
            }
        }
    }

    // === FUNCIONALIDAD CABLES ===
    setupCableListeners() {
        const cableInputs = ['cable-power', 'cable-voltage', 'cable-length', 'cable-type', 'voltage-drop'];
        cableInputs.forEach(id => {
            const element = document.getElementById(id);
            element.addEventListener(element.tagName === 'SELECT' ? 'change' : 'input', () => {
                this.calculateCableSection();
            });
        });

        // Cálculo inicial
        this.calculateCableSection();
    }

    calculateCableSection() {
        const power = this.parseSpanishNumber(document.getElementById('cable-power').value) || 0;
        const voltage = this.parseSpanishNumber(document.getElementById('cable-voltage').value) || 230;
        const length = this.parseSpanishNumber(document.getElementById('cable-length').value) || 0;
        const installationType = document.getElementById('cable-type').value;
        const maxVoltageDrop = this.parseSpanishNumber(document.getElementById('voltage-drop').value) || 5;

        // Calcular corriente
        const current = power / voltage;

        // Resistividad del cobre (Ω·mm²/m)
        const copperResistivity = 0.0175;

        // Factor de corrección según instalación
        const correctionFactors = {
            'empotrada': 0.7,
            'superficie': 0.85,
            'tubo': 0.8,
            'aire': 1.0
        };
        const factor = correctionFactors[installationType] || 0.8;

        // Secciones estándar de cables y sus corrientes máximas
        const cableSections = [
            { section: 1.5, maxCurrent: 15 * factor },
            { section: 2.5, maxCurrent: 21 * factor },
            { section: 4, maxCurrent: 27 * factor },
            { section: 6, maxCurrent: 36 * factor },
            { section: 10, maxCurrent: 50 * factor },
            { section: 16, maxCurrent: 68 * factor },
            { section: 25, maxCurrent: 89 * factor }
        ];

        // Encontrar sección mínima por corriente
        let recommendedSection = cableSections.find(cable => cable.maxCurrent >= current);

        // Calcular caída de tensión
        const calculateVoltageDrop = (section) => {
            // ΔV = (2 × ρ × L × I) / S para monofásico
            // Factor 2 porque la corriente va y vuelve
            const drop = (2 * copperResistivity * length * current) / section;
            return (drop / voltage) * 100; // Porcentaje
        };

        // Verificar si la sección cumple con la caída de tensión máxima
        if (recommendedSection) {
            let voltageDrop = calculateVoltageDrop(recommendedSection.section);

            // Si la caída es mayor a la permitida, buscar sección mayor
            while (voltageDrop > maxVoltageDrop && cableSections.indexOf(recommendedSection) < cableSections.length - 1) {
                const nextIndex = cableSections.indexOf(recommendedSection) + 1;
                recommendedSection = cableSections[nextIndex];
                voltageDrop = calculateVoltageDrop(recommendedSection.section);
            }

            // Actualizar displays
            document.getElementById('cable-section').textContent = this.formatNumber(recommendedSection.section, 1) + ' mm²';
            document.getElementById('cable-current').textContent = this.formatNumber(current, 2) + ' A';
            document.getElementById('cable-drop').textContent = this.formatNumber(voltageDrop, 2) + '%';
        } else {
            document.getElementById('cable-section').textContent = 'Consultar especialista';
            document.getElementById('cable-current').textContent = this.formatNumber(current, 2) + ' A';
            document.getElementById('cable-drop').textContent = '---';
        }

        this.trackEvent('cable_calculated', { power, voltage, length, current });
    }

    // === FUNCIONALIDAD CONSUMO ===
    setupConsumptionListeners() {
        this.appliances = [
            { name: '💡 Bombilla LED', power: 9, hours: 5 }
        ];

        // Añadir electrodoméstico
        document.getElementById('add-appliance').addEventListener('click', () => {
            this.addAppliance();
        });

        // Configuración de precios
        const priceInputs = ['kwh-price', 'contracted-power', 'power-price'];
        priceInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.calculateConsumption();
            });
        });

        // Cálculo inicial
        this.renderAppliances();
        this.calculateConsumption();
    }

    addAppliance() {
        const name = document.getElementById('appliance-name').value || 'Electrodoméstico';
        const power = this.parseSpanishNumber(document.getElementById('appliance-power').value) || 0;
        const hours = this.parseSpanishNumber(document.getElementById('appliance-hours').value) || 1;

        if (power <= 0) {
            alert('Ingrese una potencia válida');
            return;
        }

        this.appliances.push({ name, power, hours });

        // Limpiar inputs
        document.getElementById('appliance-name').value = '';
        document.getElementById('appliance-power').value = '';
        document.getElementById('appliance-hours').value = '1';

        this.renderAppliances();
        this.calculateConsumption();
        this.trackEvent('appliance_added', { name, power, hours });
    }

    renderAppliances() {
        const list = document.getElementById('appliances-list');
        list.innerHTML = '<h4>Electrodomésticos</h4>';

        this.appliances.forEach((appliance, index) => {
            const monthlyKwh = (appliance.power * appliance.hours * 30) / 1000;
            const item = document.createElement('div');
            item.className = 'appliance-item';
            item.innerHTML = `
                <span>${appliance.name}</span>
                <span>${this.formatNumber(appliance.power, 0)}W × ${this.formatNumber(appliance.hours, 1)}h/día</span>
                <span>${this.formatNumber(monthlyKwh, 2)} kWh/mes</span>
                <button class="remove-btn" data-index="${index}">❌</button>
            `;
            list.appendChild(item);

            // Añadir listener al botón de eliminar
            item.querySelector('.remove-btn').addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                this.appliances.splice(idx, 1);
                this.renderAppliances();
                this.calculateConsumption();
            });
        });
    }

    calculateConsumption() {
        const kwhPrice = this.parseSpanishNumber(document.getElementById('kwh-price').value) || 0.15;
        const contractedPower = this.parseSpanishNumber(document.getElementById('contracted-power').value) || 3.45;
        const powerPrice = this.parseSpanishNumber(document.getElementById('power-price').value) || 3.5;

        // Calcular consumo total
        let totalMonthlyKwh = 0;
        this.appliances.forEach(appliance => {
            totalMonthlyKwh += (appliance.power * appliance.hours * 30) / 1000;
        });

        // Costos
        const energyCost = totalMonthlyKwh * kwhPrice;
        const powerCost = contractedPower * powerPrice;
        const totalCost = energyCost + powerCost;

        // Actualizar displays
        document.getElementById('total-consumption').textContent = this.formatNumber(totalMonthlyKwh, 1) + ' kWh';
        document.getElementById('energy-cost').textContent = this.formatNumber(energyCost, 2) + ' €';
        document.getElementById('power-cost').textContent = this.formatNumber(powerCost, 2) + ' €';
        document.getElementById('total-cost').textContent = this.formatNumber(totalCost, 2) + ' €';

        // Comparación LED vs Incandescente (60W incandescente = 9W LED)
        const incandescentMonthly = (60 * 5 * 30) / 1000; // 5 horas/día
        const ledMonthly = (9 * 5 * 30) / 1000;
        const incandescentCost = incandescentMonthly * kwhPrice;
        const ledCost = ledMonthly * kwhPrice;
        const savings = incandescentCost - ledCost;

        document.getElementById('incandescent-cost').textContent = this.formatNumber(incandescentCost, 2) + ' €/mes';
        document.getElementById('led-cost').textContent = this.formatNumber(ledCost, 2) + ' €/mes';
        document.getElementById('led-savings').textContent = this.formatNumber(savings, 2) + ' €/mes';
    }

    // Cambio de pestañas
    switchTab(tab) {
        this.currentTab = tab;

        // Actualizar botones
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab || btn.closest('.tab-button').dataset.tab === tab);
        });

        // Actualizar paneles
        document.querySelectorAll('.calculator-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tab}-panel`);
        });

        // Ocultar/mostrar elementos según la pestaña
        const showSafetyFor = ['ohm', 'power'];
        const showExamplesFor = ['ohm', 'power'];
        const showGlossaryFor = ['ohm', 'power'];
        const showHistoryFor = ['ohm', 'power', 'series'];

        // Ocultar/mostrar indicador de seguridad
        const safetyIndicator = document.querySelector('.safety-indicator');
        if (safetyIndicator) {
            safetyIndicator.style.display = showSafetyFor.includes(tab) ? 'block' : 'none';
        }

        // Ocultar/mostrar ejemplos
        const examplesSection = document.querySelector('.examples-section');
        if (examplesSection) {
            examplesSection.style.display = showExamplesFor.includes(tab) ? 'block' : 'none';
        }

        // Ocultar/mostrar glosario
        const glossary = document.querySelector('.glossary');
        if (glossary) {
            glossary.style.display = showGlossaryFor.includes(tab) ? 'block' : 'none';
        }

        // Ocultar/mostrar historial
        const historySection = document.querySelector('.history-section');
        if (historySection) {
            historySection.style.display = showHistoryFor.includes(tab) ? 'block' : 'none';
        }

        // Mostrar solo las FAQs de la pestaña actual
        document.querySelectorAll('.faq-section').forEach(faq => {
            faq.style.display = faq.dataset.panel === tab ? 'block' : 'none';
        });

        // Gestionar circuitos y diagramas según pestaña
        const animatedCircuit = document.getElementById('animated-circuit');
        const seriesDiagrams = document.getElementById('series-diagrams');

        if (tab === 'ohm' || tab === 'power') {
            // Mostrar circuito animado
            animatedCircuit.style.display = 'block';
            seriesDiagrams.style.display = 'none';
        } else if (tab === 'series') {
            // Mostrar esquemas Serie/Paralelo
            animatedCircuit.style.display = 'none';
            seriesDiagrams.style.display = 'block';
        } else {
            // Ocultar ambos (Cables y Consumo)
            animatedCircuit.style.display = 'none';
            seriesDiagrams.style.display = 'none';
        }

        // Actualizar circuito según el modo
        if (tab === 'series') {
            this.updateSeriesParallelCircuit();
        }

        this.trackEvent('tab_switch', { tab });
    }

    // Cálculos de Ley de Ohm
    calculateOhm(changedInput) {
        const voltage = this.parseSpanishNumber(document.getElementById('voltage').value) || 0;
        const current = this.parseSpanishNumber(document.getElementById('current').value) || 0;
        const resistance = this.parseSpanishNumber(document.getElementById('resistance').value) || 0;

        let result = {};

        // Determinar qué calcular basándose en los inputs con valores
        const hasVoltage = voltage > 0;
        const hasCurrent = current > 0;
        const hasResistance = resistance > 0;

        if (changedInput === 'voltage' || (!hasVoltage && hasCurrent && hasResistance)) {
            // Calcular voltaje: V = I × R
            if (hasCurrent && hasResistance) {
                const v = current * resistance;
                document.getElementById('voltage').value = this.formatNumber(v, 2);
                document.getElementById('voltage-slider').value = v;
                result = { type: 'ohm', voltage: v, current, resistance };
            }
        } else if (changedInput === 'current' || (!hasCurrent && hasVoltage && hasResistance)) {
            // Calcular corriente: I = V / R
            if (hasVoltage && hasResistance && resistance > 0) {
                const i = voltage / resistance;
                document.getElementById('current').value = this.formatNumber(i, 3);
                document.getElementById('current-slider').value = i;
                result = { type: 'ohm', voltage, current: i, resistance };
            }
        } else if (changedInput === 'resistance' || (!hasResistance && hasVoltage && hasCurrent)) {
            // Calcular resistencia: R = V / I
            if (hasVoltage && hasCurrent && current > 0) {
                const r = voltage / current;
                document.getElementById('resistance').value = this.formatNumber(r, 1);
                document.getElementById('resistance-slider').value = r;
                result = { type: 'ohm', voltage, current, resistance: r };
            }
        }

        // Actualizar seguridad y guardar en historial si hay resultado válido
        if (result.voltage) {
            this.updateSafetyIndicator(result.voltage, result.current);
            this.addToHistory(result);
        }
    }

    // Cálculos de Potencia
    calculatePower() {
        const voltage = this.parseSpanishNumber(document.getElementById('power-voltage').value) || 0;
        const current = this.parseSpanishNumber(document.getElementById('power-current').value) || 0;

        if (voltage > 0 && current > 0) {
            const power = voltage * current;

            // Actualizar displays
            document.getElementById('power').value = this.formatNumber(power, 2);
            document.getElementById('power-kw').textContent = this.formatNumber(power / 1000, 3) + ' kW';

            // Calcular costo mensual (0,15€/kWh promedio, 8h/día, 30 días)
            const monthlyKwh = (power / 1000) * 8 * 30;
            const monthlyCost = monthlyKwh * 0.15;
            document.getElementById('monthly-cost').textContent = this.formatNumber(monthlyCost, 2) + ' €/mes';

            // Actualizar seguridad y historial
            this.updateSafetyIndicator(voltage, current);
            this.addToHistory({ type: 'power', voltage, current, power });
        }
    }

    // Sistema de seguridad
    updateSafetyIndicator(voltage, current) {
        const safetyLevel = document.getElementById('safety-level');
        const safetyTips = document.getElementById('safety-tips');

        let level, icon, text, tips;

        if (voltage <= 24) {
            level = 'safe';
            icon = '🟢';
            text = 'Seguro';
            tips = 'Voltaje seguro para uso doméstico y proyectos educativos. Sin riesgo de electrocución.';
        } else if (voltage <= 50) {
            level = 'caution';
            icon = '🟡';
            text = 'Precaución';
            tips = 'Voltaje moderado. Use herramientas aisladas y evite contacto directo con los conductores.';
        } else {
            level = 'danger';
            icon = '🔴';
            text = 'Peligroso';
            tips = '¡PELIGRO! Voltaje alto. Solo personal cualificado. Use equipo de protección y desconecte antes de manipular.';
        }

        // Añadir tips adicionales según corriente
        if (current > 0.1) {
            tips += ' Corriente elevada detectada. Asegúrese de usar cables del calibre adecuado.';
        }

        safetyLevel.className = `safety-level ${level}`;
        safetyLevel.innerHTML = `
            <span class="safety-icon">${icon}</span>
            <span class="safety-text">${text}</span>
        `;
        safetyTips.textContent = tips;
    }

    // Cargar ejemplos prácticos
    loadExample(type) {
        const examples = {
            led: { voltage: 220, current: 0.041, resistance: 5365, power: 9 },
            phone: { voltage: 5, current: 2, resistance: 2.5, power: 10 },
            car: { voltage: 12, current: 60, resistance: 0.2, power: 720 },
            solar: { voltage: 18, current: 5.5, resistance: 3.27, power: 99 }
        };

        const example = examples[type];
        if (!example) return;

        // Cargar valores según la pestaña activa
        if (this.currentTab === 'ohm') {
            document.getElementById('voltage').value = this.formatNumber(example.voltage, 2);
            document.getElementById('current').value = this.formatNumber(example.current, 3);
            document.getElementById('resistance').value = this.formatNumber(example.resistance, 1);

            document.getElementById('voltage-slider').value = example.voltage;
            document.getElementById('current-slider').value = example.current;
            document.getElementById('resistance-slider').value = Math.min(example.resistance, 1000);
        } else {
            document.getElementById('power-voltage').value = this.formatNumber(example.voltage, 2);
            document.getElementById('power-current').value = this.formatNumber(example.current, 3);

            document.getElementById('power-voltage-slider').value = example.voltage;
            document.getElementById('power-current-slider').value = example.current;

            this.calculatePower();
        }

        this.updateCircuitDisplay();
        this.updateSafetyIndicator(example.voltage, example.current);
        this.trackEvent('example_loaded', { type });
    }

    // Actualizar display del circuito
    updateCircuitDisplay() {
        let voltage, current, resistance;

        if (this.currentTab === 'ohm') {
            voltage = this.parseSpanishNumber(document.getElementById('voltage').value) || 0;
            current = this.parseSpanishNumber(document.getElementById('current').value) || 0;
            resistance = this.parseSpanishNumber(document.getElementById('resistance').value) || 0;
        } else {
            voltage = this.parseSpanishNumber(document.getElementById('power-voltage').value) || 0;
            current = this.parseSpanishNumber(document.getElementById('power-current').value) || 0;
            resistance = voltage > 0 && current > 0 ? voltage / current : 0;
        }

        // Actualizar textos en el SVG
        document.getElementById('voltage-display').textContent = this.formatNumber(voltage, 1) + 'V';
        document.getElementById('current-display').textContent = this.formatNumber(current, 2) + 'A';
        document.getElementById('resistance-display').textContent = this.formatNumber(resistance, 0) + 'Ω';

        // Actualizar brillo del LED basado en la potencia
        const power = voltage * current;
        const bulbGlow = document.getElementById('bulb-glow');
        const maxPower = 100; // Potencia máxima para brillo completo
        const brightness = Math.min(power / maxPower, 1);

        if (power > 0) {
            bulbGlow.style.opacity = 0.3 + (brightness * 0.7);
            bulbGlow.style.fill = brightness > 0.5 ? '#FFD700' : '#FFE4B5';
            bulbGlow.classList.add('active');

            // Cambiar el tamaño del LED según la potencia
            const scale = 1 + (brightness * 0.3);
            bulbGlow.setAttribute('r', 20 * scale);
        } else {
            bulbGlow.style.opacity = 0.3;
            bulbGlow.style.fill = '#FFE4B5';
            bulbGlow.classList.remove('active');
            bulbGlow.setAttribute('r', 20);
        }

        // Actualizar velocidad de animación de electrones
        this.updateElectronSpeed(current);
    }

    // Animación de electrones
    initializeElectronAnimation() {
        const electronsGroup = document.getElementById('electrons');
        const numElectrons = 8;

        // Path del circuito para que sigan los electrones
        const circuitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        circuitPath.setAttribute('id', 'circuit-path');
        circuitPath.setAttribute('d', 'M 70,120 L 350,120 L 350,180 L 70,180 Z');
        circuitPath.style.fill = 'none';
        circuitPath.style.stroke = 'none';
        electronsGroup.appendChild(circuitPath);

        // Crear electrones distribuidos por el circuito
        for (let i = 0; i < numElectrons; i++) {
            const electron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            electron.setAttribute('r', '4');
            electron.setAttribute('fill', '#FFD700');
            electron.setAttribute('opacity', '0');
            electron.classList.add('electron');
            electron.setAttribute('id', `electron-${i}`);

            // Añadir sombra para mejor visibilidad
            electron.setAttribute('filter', 'drop-shadow(0 0 3px #FFD700)');

            electronsGroup.appendChild(electron);
        }

        // Iniciar animación continua
        this.animateElectrons();
    }

    animateElectrons() {
        const electrons = document.querySelectorAll('.electron');
        const circuitPoints = [
            // Camino superior del circuito
            {x: 70, y: 120}, {x: 120, y: 120}, {x: 170, y: 120}, {x: 220, y: 120},
            {x: 270, y: 120}, {x: 320, y: 120}, {x: 350, y: 120},
            // Bajada derecha
            {x: 350, y: 135}, {x: 350, y: 150}, {x: 350, y: 165},
            // Camino inferior (vuelta)
            {x: 350, y: 180}, {x: 300, y: 180}, {x: 250, y: 180}, {x: 200, y: 180},
            {x: 150, y: 180}, {x: 100, y: 180}, {x: 70, y: 180},
            // Subida izquierda
            {x: 70, y: 165}, {x: 70, y: 150}, {x: 70, y: 135}
        ];

        this.electronPositions = electrons.length > 0 ?
            Array.from({length: electrons.length}, (_, i) =>
                Math.floor(i * circuitPoints.length / electrons.length)
            ) : [];

        // Función de animación
        const animate = () => {
            const voltage = this.currentTab === 'ohm' ?
                this.parseSpanishNumber(document.getElementById('voltage').value) || 0 :
                this.parseSpanishNumber(document.getElementById('power-voltage').value) || 0;

            const current = this.currentTab === 'ohm' ?
                this.parseSpanishNumber(document.getElementById('current').value) || 0 :
                this.parseSpanishNumber(document.getElementById('power-current').value) || 0;

            if (current > 0 && voltage > 0) {
                electrons.forEach((electron, i) => {
                    // Mostrar electrón
                    electron.setAttribute('opacity', '0.9');

                    // Mover al siguiente punto
                    const pos = this.electronPositions[i];
                    const point = circuitPoints[pos];

                    electron.setAttribute('cx', point.x);
                    electron.setAttribute('cy', point.y);

                    // Actualizar posición para siguiente frame
                    // Velocidad basada en corriente (más corriente = más rápido)
                    const speed = Math.min(3, Math.max(1, current));
                    this.electronPositions[i] = (pos + speed) % circuitPoints.length;
                });
            } else {
                // Ocultar electrones si no hay corriente
                electrons.forEach(electron => {
                    electron.setAttribute('opacity', '0');
                });
            }

            requestAnimationFrame(animate);
        };

        animate();
    }

    updateElectronSpeed(current) {
        // Esta función ya no es necesaria porque la animación es continua
        // pero la mantengo vacía para no romper las llamadas existentes
    }

    // Gestión de historial con localStorage
    addToHistory(calculation) {
        const historyItem = {
            ...calculation,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        this.history.unshift(historyItem);

        // Mantener solo los últimos 5
        if (this.history.length > 5) {
            this.history = this.history.slice(0, 5);
        }

        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        localStorage.setItem('meskeia_electricity_history', JSON.stringify(this.history));
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('meskeia_electricity_history');
            this.history = saved ? JSON.parse(saved) : [];
            this.renderHistory();
        } catch (error) {
            console.error('Error cargando historial:', error);
            this.history = [];
        }
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');

        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="history-empty">No hay cálculos guardados</p>';
            return;
        }

        historyList.innerHTML = this.history.map(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            let content = '';
            if (item.type === 'ohm') {
                content = `V=${this.formatNumber(item.voltage,1)} I=${this.formatNumber(item.current,2)} R=${this.formatNumber(item.resistance,1)}`;
            } else {
                content = `P=${this.formatNumber(item.power,1)}W V=${this.formatNumber(item.voltage,1)} I=${this.formatNumber(item.current,2)}`;
            }

            return `
                <div class="history-item">
                    <span>${content}</span>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">${timeStr}</span>
                </div>
            `;
        }).join('');
    }

    clearHistory() {
        if (confirm('¿Seguro que quieres borrar el historial?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.trackEvent('history_cleared');
        }
    }

    // Analytics
    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'electricity_calculator',
                ...parameters
            });
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.electricityApp = new ElectricityCalculator();
});