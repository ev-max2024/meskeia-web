#!/usr/bin/env python3
"""
Script para agregar etiquetas canonical faltantes a todas las páginas HTML
y corregir URLs vacías en meta tags Open Graph y JSON-LD
"""

import os
import re
from pathlib import Path

def get_canonical_url(file_path):
    """Genera la URL canonical correcta basada en la ruta del archivo"""
    # Convertir path a ruta relativa desde la raíz del proyecto
    relative_path = Path(file_path).relative_to(Path("C:\\Users\\jaceb\\meskeia-web"))

    # Convertir a URL con formato Unix
    url_path = str(relative_path).replace("\\", "/")

    # Si es index.html, usar solo el directorio
    if url_path.endswith("/index.html"):
        if url_path == "index.html":
            return "https://meskeia.com/"
        else:
            # Quitar /index.html del final
            return f"https://meskeia.com/{url_path[:-11]}"
    else:
        # Para otros archivos HTML, usar la ruta completa sin .html
        if url_path.endswith(".html"):
            return f"https://meskeia.com/{url_path[:-5]}"
        return f"https://meskeia.com/{url_path}"

def fix_html_file(file_path):
    """Agrega canonical URL y corrige URLs vacías en el archivo HTML"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    canonical_url = get_canonical_url(file_path)
    changes_made = False

    # Verificar si ya tiene canonical
    if '<link rel="canonical"' not in content:
        # Buscar dónde insertar el canonical (después del título o descripción)
        insert_patterns = [
            r'(</title>\s*\n)',
            r'(<meta name="description"[^>]*>\s*\n)',
            r'(<meta name="keywords"[^>]*>\s*\n)'
        ]

        for pattern in insert_patterns:
            match = re.search(pattern, content)
            if match:
                insertion_point = match.end()
                # Agregar canonical después del punto de inserción
                canonical_tag = f'    <link rel="canonical" href="{canonical_url}">\n'
                content = content[:insertion_point] + canonical_tag + content[insertion_point:]
                changes_made = True
                print(f"+ Agregado canonical a: {file_path}")
                break
    else:
        print(f"  Ya tiene canonical: {file_path}")

    # Corregir og:url vacío
    og_url_pattern = r'<meta property="og:url" content=""'
    if re.search(og_url_pattern, content):
        content = re.sub(og_url_pattern, f'<meta property="og:url" content="{canonical_url}"', content)
        changes_made = True
        print(f"  + Corregido og:url vacio")

    # Corregir URL vacía en JSON-LD
    json_ld_pattern = r'"url"\s*:\s*""'
    if re.search(json_ld_pattern, content):
        content = re.sub(json_ld_pattern, f'"url": "{canonical_url}"', content)
        changes_made = True
        print(f"  + Corregido URL en JSON-LD")

    # Guardar cambios si se hicieron modificaciones
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    """Procesa todos los archivos HTML que necesitan canonical"""

    # Lista de archivos que Google reporta sin canonical
    problematic_files = [
        "curso-decisiones-inversion/guia/aspectos-fiscales.html",
        "evaluador-salud/evaluador-salud.html",
        "simulador-hipoteca/simulador-hipoteca.html",
        "interes-compuesto/interes-compuesto.html",
        "tabla-periodica/index.html",
        "calculadora-jubilacion/calculadora-jubilacion.html",
        "curso-decisiones-inversion/index.html",
        "simulador-irpf/simulador-irpf.html"
    ]

    base_dir = Path("C:\\Users\\jaceb\\meskeia-web")
    files_fixed = 0

    print("=== Iniciando corrección de canonical URLs ===\n")

    # Primero procesar los archivos problemáticos reportados
    print("Procesando archivos reportados por Google Search Console:")
    for file_path in problematic_files:
        full_path = base_dir / file_path
        if full_path.exists():
            if fix_html_file(str(full_path)):
                files_fixed += 1
        else:
            print(f"! Archivo no encontrado: {file_path}")

    # Luego buscar otros archivos HTML sin canonical
    print("\n=== Buscando otros archivos HTML sin canonical ===\n")

    for html_file in base_dir.rglob("*.html"):
        # Saltar archivos ya procesados
        relative = html_file.relative_to(base_dir)
        if str(relative).replace("\\", "/") not in problematic_files:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Solo procesar si no tiene canonical
            if '<link rel="canonical"' not in content:
                print(f"Procesando: {relative}")
                if fix_html_file(str(html_file)):
                    files_fixed += 1

    print(f"\n=== Proceso completado ===")
    print(f"Total de archivos corregidos: {files_fixed}")
    print("\nProximos pasos:")
    print("1. Subir los cambios a tu servidor")
    print("2. Solicitar nueva indexacion en Google Search Console")
    print("3. Esperar 1-2 semanas para ver los resultados")

if __name__ == "__main__":
    main()