// ========================================
// GENERADOR DE CÓDIGOS QR - meskeIA
// ========================================

// Estado de la aplicación
let currentType = 'url';
let currentQRCode = null;
let qrHistory = [];

// Elementos del DOM
const typeButtons = document.querySelectorAll('.type-btn');
const forms = document.querySelectorAll('.qr-form');
const generateBtn = document.getElementById('generate-btn');
const qrPreview = document.getElementById('qr-preview');
const qrActions = document.getElementById('qr-actions');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');
const qrSizeSelect = document.getElementById('qr-size');
const qrColorInput = document.getElementById('qr-color');
const qrBgColorInput = document.getElementById('qr-bg-color');
const historyContainer = document.getElementById('history-container');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Cargar historial desde localStorage
    loadHistory();

    // Event listeners para botones de tipo
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            switchType(type);
        });
    });

    // Event listener para generar QR
    generateBtn.addEventListener('click', generateQR);

    // Event listeners para acciones
    downloadBtn.addEventListener('click', downloadQR);
    clearBtn.addEventListener('click', clearQR);
    clearHistoryBtn.addEventListener('click', clearHistoryConfirm);

    // Actualizar valores de colores al cambiar
    qrColorInput.addEventListener('input', (e) => {
        document.querySelector('#qr-color + .color-value').textContent = e.target.value.toUpperCase();
    });

    qrBgColorInput.addEventListener('input', (e) => {
        document.querySelector('#qr-bg-color + .color-value').textContent = e.target.value.toUpperCase();
    });

    console.log('✅ Aplicación de códigos QR inicializada correctamente');
}

// ========================================
// CAMBIO DE TIPO DE QR
// ========================================

function switchType(type) {
    currentType = type;

    // Actualizar botones activos
    typeButtons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Mostrar formulario correspondiente
    forms.forEach(form => {
        if (form.id === `form-${type}`) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });

    console.log(`📝 Tipo de QR cambiado a: ${type}`);
}

// ========================================
// GENERACIÓN DE CÓDIGOS QR
// ========================================

function generateQR() {
    const data = getFormData(currentType);

    if (!data) {
        alert('⚠️ Por favor, completa todos los campos requeridos');
        return;
    }

    const qrText = formatQRData(currentType, data);
    const size = parseInt(qrSizeSelect.value);
    const color = qrColorInput.value;
    const bgColor = qrBgColorInput.value;

    // Limpiar preview anterior
    qrPreview.innerHTML = '';

    // Crear nuevo QR
    try {
        currentQRCode = new QRCode(qrPreview, {
            text: qrText,
            width: size,
            height: size,
            colorDark: color,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H
        });

        // Mostrar acciones
        qrActions.style.display = 'flex';

        // Guardar en historial
        saveToHistory({
            type: currentType,
            data: data,
            text: qrText,
            size: size,
            color: color,
            bgColor: bgColor,
            timestamp: new Date().toISOString()
        });

        console.log('✅ Código QR generado correctamente');
        console.log('📊 Datos:', qrText);

    } catch (error) {
        console.error('❌ Error al generar código QR:', error);
        alert('Error al generar el código QR. Por favor, verifica los datos.');
    }
}

// ========================================
// OBTENCIÓN DE DATOS DEL FORMULARIO
// ========================================

function getFormData(type) {
    switch (type) {
        case 'url':
            const url = document.getElementById('url').value.trim();
            return url ? { url } : null;

        case 'text':
            const text = document.getElementById('text').value.trim();
            return text ? { text } : null;

        case 'email':
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('email-subject').value.trim();
            const body = document.getElementById('email-body').value.trim();
            return email ? { email, subject, body } : null;

        case 'phone':
            const phone = document.getElementById('phone').value.trim();
            return phone ? { phone } : null;

        case 'sms':
            const smsNumber = document.getElementById('sms-number').value.trim();
            const smsMessage = document.getElementById('sms-message').value.trim();
            return (smsNumber && smsMessage) ? { number: smsNumber, message: smsMessage } : null;

        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value.trim();
            const password = document.getElementById('wifi-password').value.trim();
            const encryption = document.getElementById('wifi-encryption').value;
            const hidden = document.getElementById('wifi-hidden').checked;
            return (ssid && password) ? { ssid, password, encryption, hidden } : null;

        case 'vcard':
            const name = document.getElementById('vcard-name').value.trim();
            const org = document.getElementById('vcard-org').value.trim();
            const title = document.getElementById('vcard-title').value.trim();
            const vcardPhone = document.getElementById('vcard-phone').value.trim();
            const vcardEmail = document.getElementById('vcard-email').value.trim();
            const website = document.getElementById('vcard-website').value.trim();
            const address = document.getElementById('vcard-address').value.trim();
            return name ? { name, org, title, phone: vcardPhone, email: vcardEmail, website, address } : null;

        case 'event':
            const eventTitle = document.getElementById('event-title').value.trim();
            const location = document.getElementById('event-location').value.trim();
            const start = document.getElementById('event-start').value;
            const end = document.getElementById('event-end').value;
            const description = document.getElementById('event-description').value.trim();
            return (eventTitle && start && end) ? { title: eventTitle, location, start, end, description } : null;

        case 'location':
            const lat = document.getElementById('location-lat').value.trim();
            const lng = document.getElementById('location-lng').value.trim();
            const locationName = document.getElementById('location-name').value.trim();
            return (lat && lng) ? { lat, lng, name: locationName } : null;

        default:
            return null;
    }
}

// ========================================
// FORMATEO DE DATOS PARA QR
// ========================================

function formatQRData(type, data) {
    switch (type) {
        case 'url':
            return data.url;

        case 'text':
            return data.text;

        case 'email':
            let emailText = `mailto:${data.email}`;
            if (data.subject || data.body) {
                emailText += '?';
                if (data.subject) emailText += `subject=${encodeURIComponent(data.subject)}`;
                if (data.subject && data.body) emailText += '&';
                if (data.body) emailText += `body=${encodeURIComponent(data.body)}`;
            }
            return emailText;

        case 'phone':
            return `tel:${data.phone}`;

        case 'sms':
            return `SMSTO:${data.number}:${data.message}`;

        case 'wifi':
            const hidden = data.hidden ? 'H:true' : '';
            return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};${hidden};`;

        case 'vcard':
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            vcard += `FN:${data.name}\n`;
            if (data.org) vcard += `ORG:${data.org}\n`;
            if (data.title) vcard += `TITLE:${data.title}\n`;
            if (data.phone) vcard += `TEL:${data.phone}\n`;
            if (data.email) vcard += `EMAIL:${data.email}\n`;
            if (data.website) vcard += `URL:${data.website}\n`;
            if (data.address) vcard += `ADR:;;${data.address}\n`;
            vcard += 'END:VCARD';
            return vcard;

        case 'event':
            const startDate = formatDateForCalendar(data.start);
            const endDate = formatDateForCalendar(data.end);
            let vevent = 'BEGIN:VEVENT\n';
            vevent += `SUMMARY:${data.title}\n`;
            if (data.location) vevent += `LOCATION:${data.location}\n`;
            vevent += `DTSTART:${startDate}\n`;
            vevent += `DTEND:${endDate}\n`;
            if (data.description) vevent += `DESCRIPTION:${data.description}\n`;
            vevent += 'END:VEVENT';
            return vevent;

        case 'location':
            const geoText = `geo:${data.lat},${data.lng}`;
            return data.name ? `${geoText}?q=${encodeURIComponent(data.name)}` : geoText;

        default:
            return '';
    }
}

// ========================================
// UTILIDADES
// ========================================

function formatDateForCalendar(dateString) {
    // Convierte "2025-01-15T10:30" a "20250115T103000"
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}00`;
}

function getTypeLabel(type) {
    const labels = {
        'url': 'URL',
        'text': 'Texto',
        'email': 'Email',
        'phone': 'Teléfono',
        'sms': 'SMS',
        'wifi': 'WiFi',
        'vcard': 'Contacto',
        'event': 'Evento',
        'location': 'Ubicación'
    };
    return labels[type] || type;
}

function getDataPreview(type, data) {
    switch (type) {
        case 'url':
            return data.url;
        case 'text':
            return data.text.substring(0, 50) + (data.text.length > 50 ? '...' : '');
        case 'email':
            return data.email;
        case 'phone':
            return data.phone;
        case 'sms':
            return `${data.number}: ${data.message.substring(0, 30)}...`;
        case 'wifi':
            return data.ssid;
        case 'vcard':
            return data.name;
        case 'event':
            return data.title;
        case 'location':
            return data.name || `${data.lat}, ${data.lng}`;
        default:
            return 'Sin vista previa';
    }
}

// ========================================
// DESCARGA DE QR
// ========================================

function downloadQR() {
    if (!currentQRCode) {
        alert('⚠️ Primero genera un código QR');
        return;
    }

    try {
        const canvas = qrPreview.querySelector('canvas');
        if (!canvas) {
            throw new Error('No se encontró el canvas del QR');
        }

        // Crear nombre de archivo descriptivo
        const timestamp = new Date().toLocaleString('es-ES').replace(/[/:]/g, '-');
        const filename = `QR_${getTypeLabel(currentType)}_${timestamp}.png`;

        // Convertir canvas a blob y descargar
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`✅ Código QR descargado: ${filename}`);
        });

    } catch (error) {
        console.error('❌ Error al descargar QR:', error);
        alert('Error al descargar el código QR');
    }
}

// ========================================
// LIMPIAR QR
// ========================================

function clearQR() {
    qrPreview.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">📱</span>
            <p>Configura los datos y genera tu código QR</p>
        </div>
    `;
    qrActions.style.display = 'none';
    currentQRCode = null;
    console.log('🗑️ Código QR limpiado');
}

// ========================================
// HISTORIAL (LocalStorage)
// ========================================

function saveToHistory(qrData) {
    // Agregar al inicio del array
    qrHistory.unshift(qrData);

    // Limitar historial a 10 elementos
    if (qrHistory.length > 10) {
        qrHistory = qrHistory.slice(0, 10);
    }

    // Guardar en localStorage
    try {
        localStorage.setItem('qr_history', JSON.stringify(qrHistory));
        renderHistory();
        console.log('💾 QR guardado en historial');
    } catch (error) {
        console.error('❌ Error al guardar en historial:', error);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('qr_history');
        if (saved) {
            qrHistory = JSON.parse(saved);
            renderHistory();
            console.log(`📋 Historial cargado: ${qrHistory.length} elementos`);
        }
    } catch (error) {
        console.error('❌ Error al cargar historial:', error);
        qrHistory = [];
    }
}

function renderHistory() {
    if (qrHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>No hay códigos QR generados aún</p>
            </div>
        `;
        clearHistoryBtn.style.display = 'none';
        return;
    }

    historyContainer.innerHTML = '';
    clearHistoryBtn.style.display = 'block';

    qrHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        // Crear miniatura del QR
        const qrContainer = document.createElement('div');
        qrContainer.className = 'history-qr';

        const miniQR = new QRCode(qrContainer, {
            text: item.text,
            width: 60,
            height: 60,
            colorDark: item.color,
            colorLight: item.bgColor,
            correctLevel: QRCode.CorrectLevel.L
        });

        // Información del QR
        const info = document.createElement('div');
        info.className = 'history-info';

        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        info.innerHTML = `
            <div class="history-type">${getTypeLabel(item.type)}</div>
            <div class="history-data">${getDataPreview(item.type, item.data)}</div>
            <div class="history-date">${formattedDate}</div>
        `;

        historyItem.appendChild(qrContainer);
        historyItem.appendChild(info);

        // Click para regenerar
        historyItem.addEventListener('click', () => {
            regenerateFromHistory(item);
        });

        historyContainer.appendChild(historyItem);
    });
}

function regenerateFromHistory(item) {
    // Cambiar al tipo correcto
    switchType(item.type);

    // Rellenar formulario con datos guardados
    populateForm(item.type, item.data);

    // Aplicar configuración de colores y tamaño
    qrSizeSelect.value = item.size;
    qrColorInput.value = item.color;
    qrBgColorInput.value = item.bgColor;

    // Actualizar valores mostrados
    document.querySelector('#qr-color + .color-value').textContent = item.color.toUpperCase();
    document.querySelector('#qr-bg-color + .color-value').textContent = item.bgColor.toUpperCase();

    // Generar QR
    generateQR();

    // Scroll al preview
    qrPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });

    console.log('🔄 QR regenerado desde historial');
}

function populateForm(type, data) {
    switch (type) {
        case 'url':
            document.getElementById('url').value = data.url;
            break;
        case 'text':
            document.getElementById('text').value = data.text;
            break;
        case 'email':
            document.getElementById('email').value = data.email;
            document.getElementById('email-subject').value = data.subject || '';
            document.getElementById('email-body').value = data.body || '';
            break;
        case 'phone':
            document.getElementById('phone').value = data.phone;
            break;
        case 'sms':
            document.getElementById('sms-number').value = data.number;
            document.getElementById('sms-message').value = data.message;
            break;
        case 'wifi':
            document.getElementById('wifi-ssid').value = data.ssid;
            document.getElementById('wifi-password').value = data.password;
            document.getElementById('wifi-encryption').value = data.encryption;
            document.getElementById('wifi-hidden').checked = data.hidden;
            break;
        case 'vcard':
            document.getElementById('vcard-name').value = data.name;
            document.getElementById('vcard-org').value = data.org || '';
            document.getElementById('vcard-title').value = data.title || '';
            document.getElementById('vcard-phone').value = data.phone || '';
            document.getElementById('vcard-email').value = data.email || '';
            document.getElementById('vcard-website').value = data.website || '';
            document.getElementById('vcard-address').value = data.address || '';
            break;
        case 'event':
            document.getElementById('event-title').value = data.title;
            document.getElementById('event-location').value = data.location || '';
            document.getElementById('event-start').value = data.start;
            document.getElementById('event-end').value = data.end;
            document.getElementById('event-description').value = data.description || '';
            break;
        case 'location':
            document.getElementById('location-lat').value = data.lat;
            document.getElementById('location-lng').value = data.lng;
            document.getElementById('location-name').value = data.name || '';
            break;
    }
}

function clearHistoryConfirm() {
    if (confirm('¿Estás seguro de que quieres eliminar todo el historial de códigos QR?')) {
        qrHistory = [];
        localStorage.removeItem('qr_history');
        renderHistory();
        console.log('🗑️ Historial eliminado');
    }
}

// ========================================
// ATAJOS DE TECLADO
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para generar QR
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateQR();
    }

    // Ctrl/Cmd + S para descargar QR
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentQRCode) {
        e.preventDefault();
        downloadQR();
    }
});

console.log('🚀 Script de códigos QR cargado correctamente - meskeIA 2025');
