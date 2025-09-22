#!/usr/bin/env python3
"""
Generador de sitemap.xml para meskeia.com
Incluye todas las páginas HTML con URLs correctas y prioridades SEO
"""

import os
from pathlib import Path
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

def get_priority(file_path):
    """Asigna prioridad basada en la importancia de la página"""
    # Convertir a ruta relativa
    rel_path = file_path.replace("\\", "/").lower()

    # Página principal
    if rel_path == "index.html":
        return 1.0

    # Páginas principales de secciones
    if rel_path.endswith("/index.html") or rel_path.endswith("/nutrisalud.html"):
        return 0.8

    # Calculadoras y simuladores principales
    if any(x in rel_path for x in ["simulador-hipoteca", "calculadora-jubilacion",
                                    "interes-compuesto", "calculadora-porcentajes",
                                    "regla-de-tres", "margen-equilibrio"]):
        return 0.8

    # Cursos principales
    if "curso-" in rel_path and "/index.html" in rel_path:
        return 0.8

    # Subpáginas de cursos y guías
    if "/guia/" in rel_path or "/herramientas/" in rel_path or "/recursos/" in rel_path:
        return 0.7

    # Aplicaciones y herramientas
    if any(x in rel_path for x in ["tabla-periodica", "calculadora-", "conversor-",
                                    "generador-", "lista-tareas", "cuaderno-"]):
        return 0.7

    # Juegos
    if any(x in rel_path for x in ["juego-", "wordle", "sudoku", "puzzle",
                                    "tres-en-raya", "piedra-papel"]):
        return 0.6

    # Páginas legales
    if any(x in rel_path for x in ["privacidad", "terminos"]):
        return 0.3

    # Páginas offline y auxiliares
    if "offline" in rel_path:
        return 0.1

    # Por defecto
    return 0.5

def get_url_from_path(file_path, base_dir):
    """Genera la URL correcta desde la ruta del archivo"""
    # Obtener ruta relativa
    rel_path = Path(file_path).relative_to(Path(base_dir))
    url_path = str(rel_path).replace("\\", "/")

    # Reglas especiales para URLs
    if url_path == "index.html":
        return "https://meskeia.com/"

    # Para archivos index.html en subdirectorios, usar solo el directorio
    if url_path.endswith("/index.html"):
        return f"https://meskeia.com/{url_path[:-11]}"

    # Para otros archivos .html, quitar la extensión
    if url_path.endswith(".html"):
        return f"https://meskeia.com/{url_path[:-5]}"

    return f"https://meskeia.com/{url_path}"

def should_include_in_sitemap(file_path):
    """Determina si un archivo debe incluirse en el sitemap"""
    file_name = os.path.basename(file_path).lower()

    # Excluir archivos de desarrollo y prueba
    exclude_files = ["generate_icon.html", "seo-health-landing.html",
                     "offline.html", "cuaderno-guia.html"]

    if file_name in exclude_files:
        return False

    # Incluir todos los demás HTML
    return True

def generate_sitemap():
    """Genera el archivo sitemap.xml"""
    base_dir = Path("C:\\Users\\jaceb\\meskeia-web")

    # Crear el elemento raíz
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    # Fecha actual
    today = datetime.now().strftime("%Y-%m-%d")

    # Recolectar todos los archivos HTML
    html_files = []
    for html_file in base_dir.rglob("*.html"):
        if should_include_in_sitemap(str(html_file)):
            html_files.append(html_file)

    # Ordenar por prioridad (mayor a menor)
    html_files.sort(key=lambda x: get_priority(str(x)), reverse=True)

    # Agregar cada URL al sitemap
    for html_file in html_files:
        url_elem = ET.SubElement(urlset, "url")

        # URL
        loc = ET.SubElement(url_elem, "loc")
        loc.text = get_url_from_path(str(html_file), base_dir)

        # Última modificación
        lastmod = ET.SubElement(url_elem, "lastmod")
        lastmod.text = today

        # Frecuencia de cambio
        changefreq = ET.SubElement(url_elem, "changefreq")
        priority_val = get_priority(str(html_file.relative_to(base_dir)))

        if priority_val >= 0.8:
            changefreq.text = "weekly"
        elif priority_val >= 0.6:
            changefreq.text = "monthly"
        else:
            changefreq.text = "yearly"

        # Prioridad
        priority = ET.SubElement(url_elem, "priority")
        priority.text = str(priority_val)

    # Formatear el XML con indentación
    xml_string = ET.tostring(urlset, encoding="unicode")
    dom = minidom.parseString(xml_string)
    pretty_xml = dom.toprettyxml(indent="  ", encoding="UTF-8")

    # Guardar el archivo
    output_file = base_dir / "sitemap.xml"
    with open(output_file, "wb") as f:
        f.write(pretty_xml)

    # Contar URLs
    url_count = len(html_files)
    print(f"Sitemap generado exitosamente con {url_count} URLs")
    print(f"Guardado en: {output_file}")

    # Mostrar estadísticas
    high_priority = sum(1 for f in html_files if get_priority(str(f.relative_to(base_dir))) >= 0.8)
    medium_priority = sum(1 for f in html_files if 0.5 <= get_priority(str(f.relative_to(base_dir))) < 0.8)
    low_priority = sum(1 for f in html_files if get_priority(str(f.relative_to(base_dir))) < 0.5)

    print(f"\nEstadisticas:")
    print(f"- Alta prioridad (>=0.8): {high_priority} paginas")
    print(f"- Media prioridad (0.5-0.7): {medium_priority} paginas")
    print(f"- Baja prioridad (<0.5): {low_priority} paginas")

if __name__ == "__main__":
    generate_sitemap()