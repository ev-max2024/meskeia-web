// Biblioteca Personal meskeIA - App Principal
class BibliotecaPersonal {
    constructor() {
        this.documents = [];
        this.currentFilter = '';
        this.currentCategory = '';
        this.currentLayout = 'grid';
        this.editingDocument = null;
        
        this.init();
    }

    async init() {
        await this.loadDocuments();
        this.setupEventListeners();
        this.updateCategoryFilter();
        this.renderDocuments();
    }

    // Cargar documentos desde localStorage
    async loadDocuments() {
        try {
            const savedDocs = localStorage.getItem('biblioteca-documents');
            if (savedDocs) {
                this.documents = JSON.parse(savedDocs);
            }
        } catch (error) {
            console.error('Error al cargar documentos:', error);
            this.documents = [];
        }
    }

    // Guardar documentos en localStorage
    saveDocuments() {
        try {
            localStorage.setItem('biblioteca-documents', JSON.stringify(this.documents));
        } catch (error) {
            console.error('Error al guardar documentos:', error);
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botón añadir documento
        document.getElementById('addDocBtn').addEventListener('click', () => {
            this.openDocumentModal();
        });

        // Búsqueda
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilter = e.target.value.toLowerCase();
            this.renderDocuments();
        });

        // Filtro de categoría
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.renderDocuments();
        });

        // Toggle de layout
        document.getElementById('layoutToggle').addEventListener('click', () => {
            this.toggleLayout();
        });

        // Modal de documento
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeDocumentModal();
        });

        document.getElementById('modalCancel').addEventListener('click', () => {
            this.closeDocumentModal();
        });

        document.getElementById('documentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDocument();
        });

        // Modal de lectura
        document.getElementById('readerClose').addEventListener('click', () => {
            this.closeReaderModal();
        });

        document.getElementById('readerPrint').addEventListener('click', () => {
            this.printDocument();
        });

        document.getElementById('readerExport').addEventListener('click', () => {
            this.exportDocument();
        });

        // Overlay
        document.getElementById('modalOverlay').addEventListener('click', () => {
            this.closeAllModals();
        });

        // Teclas de escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Abrir modal de documento
    openDocumentModal(document = null) {
        this.editingDocument = document;
        const modal = document ? 'Editar Documento' : 'Añadir Documento';
        
        document.getElementById('modalTitle').textContent = modal;
        document.getElementById('modalSave').textContent = document ? 'Actualizar' : 'Guardar';

        // Limpiar o llenar formulario
        const form = document.getElementById('documentForm');
        form.reset();

        if (document) {
            document.getElementById('docTitle').value = document.title;
            document.getElementById('docCategory').value = document.category;
            document.getElementById('docDescription').value = document.description || '';
            
            // Seleccionar color
            const colorInputs = form.querySelectorAll('input[name="color"]');
            colorInputs.forEach(input => {
                input.checked = input.value === document.color;
            });

            // Ocultar campo de archivo para edición
            const fileGroup = document.getElementById('docFile').parentElement;
            fileGroup.style.display = 'none';
        } else {
            const fileGroup = document.getElementById('docFile').parentElement;
            fileGroup.style.display = 'block';
        }

        this.showModal('documentModal');
    }

    // Cerrar modal de documento
    closeDocumentModal() {
        this.hideModal('documentModal');
        this.editingDocument = null;
    }

    // Guardar documento
    async saveDocument() {
        const form = document.getElementById('documentForm');
        const formData = new FormData(form);
        
        const title = formData.get('title').trim();
        const category = formData.get('category').trim();
        const description = formData.get('description').trim();
        const color = formData.get('color');
        const file = formData.get('file');

        if (!title) {
            alert('El título es obligatorio');
            return;
        }

        try {
            let documentData = {
                id: this.editingDocument ? this.editingDocument.id : Date.now(),
                title,
                category: category || 'Sin categoría',
                description,
                color,
                dateAdded: this.editingDocument ? this.editingDocument.dateAdded : new Date().toISOString(),
                dateModified: new Date().toISOString()
            };

            // Si hay archivo nuevo, procesarlo
            if (file && file.size > 0) {
                const content = await this.processHTMLFile(file);
                documentData.content = content.body;
                documentData.preview = this.generatePreview(content.body);
                documentData.originalFileName = file.name;
            } else if (this.editingDocument) {
                // Mantener contenido existente si solo se editan metadatos
                documentData.content = this.editingDocument.content;
                documentData.preview = this.editingDocument.preview;
                documentData.originalFileName = this.editingDocument.originalFileName;
            } else {
                alert('Debe seleccionar un archivo HTML');
                return;
            }

            if (this.editingDocument) {
                // Actualizar documento existente
                const index = this.documents.findIndex(doc => doc.id === this.editingDocument.id);
                this.documents[index] = documentData;
            } else {
                // Añadir nuevo documento
                this.documents.push(documentData);
            }

            this.saveDocuments();
            this.updateCategoryFilter();
            this.renderDocuments();
            this.closeDocumentModal();

        } catch (error) {
            console.error('Error al guardar documento:', error);
            alert('Error al procesar el documento. Verifique que sea un archivo HTML válido.');
        }
    }

    // Procesar archivo HTML
    async processHTMLFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const htmlContent = e.target.result;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlContent, 'text/html');
                    
                    // Limpiar el contenido del body
                    const body = doc.body;
                    
                    // Remover scripts y elementos no deseados
                    const scriptsAndStyles = body.querySelectorAll('script, style, meta, link');
                    scriptsAndStyles.forEach(el => el.remove());
                    
                    // Limpiar atributos innecesarios pero mantener estilos básicos
                    const allElements = body.querySelectorAll('*');
                    allElements.forEach(el => {
                        // Mantener solo atributos esenciales
                        const keepAttrs = ['src', 'href', 'alt', 'title', 'style'];
                        const attrs = [...el.attributes];
                        attrs.forEach(attr => {
                            if (!keepAttrs.includes(attr.name)) {
                                el.removeAttribute(attr.name);
                            }
                        });
                    });

                    resolve({
                        body: body.innerHTML,
                        title: doc.title || file.name
                    });
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    // Generar preview del contenido
    generatePreview(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Extraer solo texto, sin HTML
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // Limpiar y truncar
        const preview = textContent
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200);
            
        return preview + (textContent.length > 200 ? '...' : '');
    }

    // Renderizar documentos
    renderDocuments() {
        const grid = document.getElementById('documentsGrid');
        let filteredDocs = this.documents;

        // Aplicar filtros
        if (this.currentFilter) {
            filteredDocs = filteredDocs.filter(doc =>
                doc.title.toLowerCase().includes(this.currentFilter) ||
                doc.category.toLowerCase().includes(this.currentFilter) ||
                (doc.description && doc.description.toLowerCase().includes(this.currentFilter))
            );
        }

        if (this.currentCategory) {
            filteredDocs = filteredDocs.filter(doc => doc.category === this.currentCategory);
        }

        // Ordenar por fecha de modificación (más recientes primero)
        filteredDocs.sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified));

        if (filteredDocs.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // Renderizar tarjetas
        grid.innerHTML = filteredDocs.map(doc => this.createDocumentCard(doc)).join('');

        // Añadir event listeners a las tarjetas
        this.setupCardEventListeners();
    }

    // Crear tarjeta de documento
    createDocumentCard(doc) {
        const colorIndex = this.getColorIndex(doc.color);
        const dateFormatted = new Date(doc.dateModified).toLocaleDateString('es-ES');
        
        return `
            <div class="document-card card-color-${colorIndex}" data-id="${doc.id}">
                <div class="document-card-header">
                    <div class="document-title">${this.escapeHtml(doc.title)}</div>
                    <div class="document-category">${this.escapeHtml(doc.category)}</div>
                    <div class="document-actions">
                        <button class="action-btn edit-btn" title="Editar">✏️</button>
                        <button class="action-btn delete-btn" title="Eliminar">🗑️</button>
                    </div>
                </div>
                <div class="document-card-body">
                    <div class="document-preview">
                        ${this.escapeHtml(doc.preview)}
                    </div>
                    <div class="document-meta">
                        <span>Modificado: ${dateFormatted}</span>
                        <span>${doc.content.length > 1000 ? '📄' : '📃'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Configurar event listeners de las tarjetas
    setupCardEventListeners() {
        // Click en tarjeta para abrir documento
        document.querySelectorAll('.document-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.document-actions')) {
                    const docId = parseInt(card.dataset.id);
                    this.openDocument(docId);
                }
            });
        });

        // Botones de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const docId = parseInt(btn.closest('.document-card').dataset.id);
                const doc = this.documents.find(d => d.id === docId);
                this.openDocumentModal(doc);
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const docId = parseInt(btn.closest('.document-card').dataset.id);
                this.deleteDocument(docId);
            });
        });
    }

    // Abrir documento para lectura
    openDocument(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        document.getElementById('readerTitle').textContent = doc.title;
        document.getElementById('readerBody').innerHTML = doc.content;
        
        this.currentReadingDoc = doc;
        this.showModal('readerModal');
    }

    // Cerrar modal de lectura
    closeReaderModal() {
        this.hideModal('readerModal');
        this.currentReadingDoc = null;
    }

    // Imprimir documento
    printDocument() {
        if (!this.currentReadingDoc) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${this.currentReadingDoc.title}</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 2rem;
                    }
                    h1, h2, h3 { color: #2C3E50; }
                    @media print {
                        body { margin: 0; padding: 1rem; }
                    }
                </style>
            </head>
            <body>
                <h1>${this.currentReadingDoc.title}</h1>
                ${this.currentReadingDoc.content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    // Exportar documento
    exportDocument() {
        if (!this.currentReadingDoc) return;
        
        const content = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.currentReadingDoc.title}</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 2rem;
                        color: #2C3E50;
                    }
                    h1, h2, h3 { color: #2E86AB; }
                </style>
            </head>
            <body>
                <h1>${this.currentReadingDoc.title}</h1>
                ${this.currentReadingDoc.content}
            </body>
            </html>
        `;
        
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentReadingDoc.title}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Eliminar documento
    deleteDocument(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        if (confirm(`¿Estás seguro de que quieres eliminar "${doc.title}"?`)) {
            this.documents = this.documents.filter(d => d.id !== docId);
            this.saveDocuments();
            this.updateCategoryFilter();
            this.renderDocuments();
        }
    }

    // Actualizar filtro de categorías
    updateCategoryFilter() {
        const select = document.getElementById('categoryFilter');
        const categories = [...new Set(this.documents.map(doc => doc.category))].sort();
        
        select.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach(category => {
            select.innerHTML += `<option value="${category}">${category}</option>`;
        });
        
        select.value = this.currentCategory;
    }

    // Toggle layout (para futuras mejoras)
    toggleLayout() {
        // Placeholder para diferentes vistas (grid, lista, etc.)
        console.log('Toggle layout - función por implementar');
    }

    // Mostrar modal
    showModal(modalId) {
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Ocultar modal
    hideModal(modalId) {
        document.getElementById('modalOverlay').style.display = 'none';
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Cerrar todos los modales
    closeAllModals() {
        this.closeDocumentModal();
        this.closeReaderModal();
    }

    // Obtener índice de color
    getColorIndex(color) {
        const colors = ['#2E86AB', '#48A9A6', '#7FB3D3', '#2C3E50', '#16A085', '#8E44AD'];
        return colors.indexOf(color) + 1 || 1;
    }

    // Escapar HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // HTML para estado vacío
    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <h3>No hay documentos</h3>
                <p>Comienza añadiendo tu primer documento a la biblioteca</p>
                <button class="btn btn-primary" onclick="bibliotecaApp.openDocumentModal()">
                    <span class="icon">📄</span>
                    Añadir Documento
                </button>
            </div>
        `;
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.bibliotecaApp = new BibliotecaPersonal();
});