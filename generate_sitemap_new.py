#!/usr/bin/env python3
"""
Generador de sitemap.xml para meskeia.com
Escanea todos los archivos HTML y genera un sitemap actualizado
"""

import os
from pathlib import Path
from datetime import datetime
from xml.etree import ElementTree as ET
from xml.dom import minidom

def prettify_xml(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = ET.tostring(elem, encoding='utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ", encoding='utf-8').decode('utf-8')

def get_url_for_file(filepath):
    """Genera la URL correcta para un archivo HTML"""
    parts = Path(filepath).parts

    # Casos especiales para archivos en raíz
    if len(parts) == 1:
        filename = parts[0]
        if filename == 'index.html':
            return 'https://meskeia.com/'
        elif filename == 'privacidad.html':
            return 'https://meskeia.com/privacidad/'
        elif filename == 'terminos.html':
            return 'https://meskeia.com/terminos/'
        elif filename == 'offline.html':
            return None  # No incluir offline.html
        else:
            return None

    # Archivos en subdirectorios
    folder = parts[0]
    filename = parts[1] if len(parts) > 1 else 'index.html'

    # No incluir archivos de generación o test
    if 'generate' in filename or 'test' in filename or 'guia' in filename:
        return None

    # No incluir archivos offline o de SEO landing
    if filename in ['offline.html', 'seo-health-landing.html']:
        return None

    if filename == 'index.html':
        return f'https://meskeia.com/{folder}/'
    else:
        # Si el archivo se llama igual que la carpeta
        base = filename.replace('.html', '')
        if base == folder:
            return f'https://meskeia.com/{folder}/'
        else:
            return f'https://meskeia.com/{folder}/{base}/'

def get_priority(url):
    """Asigna prioridad según la importancia de la página"""
    if url == 'https://meskeia.com/':
        return '1.0'
    elif any(x in url for x in ['/calculadora-', '/simulador-', '/conversor-']):
        return '0.8'
    elif any(x in url for x in ['/curso-', '/algebra', '/calculo', '/geometria']):
        return '0.9'
    elif any(x in url for x in ['/juego-', '/puzzle-', '/tres-en-raya']):
        return '0.6'
    elif any(x in url for x in ['/privacidad/', '/terminos/']):
        return '0.3'
    else:
        return '0.7'

def get_changefreq(url):
    """Asigna frecuencia de cambio según el tipo de contenido"""
    if url == 'https://meskeia.com/':
        return 'weekly'
    elif any(x in url for x in ['/curso-', '/nutrisalud']):
        return 'monthly'
    elif any(x in url for x in ['/privacidad/', '/terminos/']):
        return 'yearly'
    else:
        return 'monthly'

def generate_sitemap():
    """Genera el sitemap.xml"""

    # Crear el elemento raíz
    urlset = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')

    # Lista para almacenar todas las URLs
    urls = []

    # Escanear archivos HTML
    for root, dirs, files in os.walk('.'):
        # Ignorar directorios específicos
        dirs[:] = [d for d in dirs if d not in ['venv', 'node_modules', '.git', '__pycache__']]

        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file).replace('\\', '/').replace('./', '')
                url = get_url_for_file(filepath)

                if url:
                    urls.append(url)

    # Eliminar duplicados y ordenar
    urls = sorted(list(set(urls)))

    # Fecha actual
    lastmod = datetime.now().strftime('%Y-%m-%d')

    # Crear elementos URL
    for url in urls:
        url_elem = ET.SubElement(urlset, 'url')

        loc = ET.SubElement(url_elem, 'loc')
        loc.text = url

        lastmod_elem = ET.SubElement(url_elem, 'lastmod')
        lastmod_elem.text = lastmod

        changefreq = ET.SubElement(url_elem, 'changefreq')
        changefreq.text = get_changefreq(url)

        priority = ET.SubElement(url_elem, 'priority')
        priority.text = get_priority(url)

    # Generar XML formateado
    xml_str = prettify_xml(urlset)

    # Limpiar líneas vacías
    lines = [line for line in xml_str.split('\n') if line.strip()]
    xml_str = '\n'.join(lines)

    # Guardar archivo
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(xml_str)

    print(f"Sitemap generado con {len(urls)} URLs")
    print("\nPrimeras 10 URLs:")
    for url in urls[:10]:
        print(f"  - {url}")

    return len(urls)

if __name__ == "__main__":
    total = generate_sitemap()
    print(f"\nSitemap.xml creado exitosamente con {total} URLs")