#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para añadir botón "Compartir" en footer de todas las apps meskeIA

Autor: Claude Code
Fecha: 08/11/2025
Versión: 1.0
"""

import os
import re
import sys
from pathlib import Path

# Configurar encoding UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Configuración
BASE_DIR = Path(r"C:\Users\jaceb\meskeia-web")

# Código a añadir
FOOTER_NUEVO = '''    <!-- Footer meskeIA -->
<footer style="position: fixed; bottom: 10px; right: 20px; display: flex; align-items: center; gap: 10px; color: #2d3748; font-size: 0.9rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: rgba(255, 255, 255, 0.9); padding: 5px 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <span>© 2025 meskeIA</span>
    <span style="color: #E5E5E5; user-select: none;">|</span>
    <button type="button"
            onclick="compartirApp()"
            style="background: none; border: none; color: #2E86AB; cursor: pointer; font-size: 0.9rem; padding: 0; display: flex; align-items: center; gap: 4px; font-family: inherit; transition: opacity 0.2s;"
            onmouseover="this.style.opacity='0.7'"
            onmouseout="this.style.opacity='1'"
            title="Compartir esta herramienta">
        🔗 <span style="text-decoration: underline;">Compartir</span>
    </button>
</footer>'''

ANIMACIONES_CSS = '''
        /* Animaciones para mensaje de compartir */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(10px);
            }
        }'''

FUNCION_COMPARTIR = '''
    // Función para compartir la aplicación
    async function compartirApp() {
        const titulo = document.title;
        const url = window.location.href;
        const texto = '¡Mira esta herramienta útil de meskeIA!';

        // Intentar usar Web Share API nativa (móviles y algunos navegadores modernos)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: titulo,
                    text: texto,
                    url: url
                });
                console.log('✅ Compartido exitosamente');
            } catch (err) {
                // Usuario canceló el compartir, no hacer nada
                if (err.name !== 'AbortError') {
                    console.error('Error al compartir:', err);
                }
            }
        } else {
            // Fallback: copiar enlace al portapapeles (escritorio)
            try {
                await navigator.clipboard.writeText(url);

                // Mostrar mensaje temporal de confirmación
                const mensaje = document.createElement('div');
                mensaje.textContent = '✅ Enlace copiado al portapapeles';
                mensaje.style.cssText = 'position: fixed; bottom: 60px; right: 20px; background: #2E86AB; color: white; padding: 10px 15px; border-radius: 8px; font-size: 0.9rem; font-family: inherit; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; animation: fadeIn 0.3s;';
                document.body.appendChild(mensaje);

                // Remover mensaje después de 3 segundos
                setTimeout(() => {
                    mensaje.style.animation = 'fadeOut 0.3s';
                    setTimeout(() => mensaje.remove(), 300);
                }, 3000);
            } catch (err) {
                // Último fallback: mostrar prompt manual
                prompt('Copia este enlace para compartir:', url);
            }
        }
    }'''


def encontrar_apps(modo_test=True):
    """Encuentra todas las apps o solo 2 para testing"""
    apps = []

    if modo_test:
        # Solo 2 apps para probar
        apps_test = ['conversor-divisas', 'calculadora-cocina']
        for app in apps_test:
            index_path = BASE_DIR / app / 'index.html'
            if index_path.exists():
                apps.append(index_path)
    else:
        # Todas las apps
        for item in BASE_DIR.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                index_path = item / 'index.html'
                if index_path.exists():
                    apps.append(index_path)

        # Añadir index.html principal
        index_principal = BASE_DIR / 'index.html'
        if index_principal.exists():
            apps.append(index_principal)

    return sorted(apps)


def ya_tiene_boton_compartir(contenido):
    """Verifica si ya tiene el botón compartir COMPLETO (footer + función)"""
    tiene_boton = '🔗 Compartir' in contenido
    tiene_funcion = 'async function compartirApp()' in contenido
    return tiene_boton and tiene_funcion


def procesar_archivo(archivo_path, dry_run=True):
    """Procesa un archivo HTML para añadir el botón compartir"""

    print(f"\n{'='*80}")
    print(f"📄 Procesando: {archivo_path.relative_to(BASE_DIR)}")
    print(f"{'='*80}")

    # Leer contenido
    try:
        with open(archivo_path, 'r', encoding='utf-8') as f:
            contenido = f.read()
    except Exception as e:
        print(f"❌ Error al leer archivo: {e}")
        return False

    # Verificar si ya tiene el botón
    if ya_tiene_boton_compartir(contenido):
        print("⚠️  Ya tiene botón compartir - SALTANDO")
        return False

    contenido_modificado = contenido
    cambios = 0

    # 1. Reemplazar footer antiguo
    patron_footer_antiguo = r'<!-- Footer meskeIA -->.*?</footer>'
    match_footer = re.search(patron_footer_antiguo, contenido, re.DOTALL)

    if match_footer:
        print("✅ Footer antiguo encontrado - Reemplazando...")
        contenido_modificado = re.sub(
            patron_footer_antiguo,
            FOOTER_NUEVO,
            contenido_modificado,
            flags=re.DOTALL
        )
        cambios += 1
    else:
        print("⚠️  No se encontró footer antiguo")

    # 2. Añadir animaciones CSS (antes de </style> final)
    if '@keyframes fadeIn' not in contenido:
        print("✅ Añadiendo animaciones CSS...")

        # Buscar el último </style> antes de </head>
        patron_style = r'(.*)(    </style>\s*</head>)'
        match_style = re.search(patron_style, contenido_modificado, re.DOTALL)

        if match_style:
            contenido_modificado = re.sub(
                patron_style,
                r'\1' + ANIMACIONES_CSS + r'\n\2',
                contenido_modificado,
                flags=re.DOTALL
            )
            cambios += 1
        else:
            print("⚠️  No se encontró </style></head> para añadir animaciones")
    else:
        print("⏭️  Animaciones CSS ya existen")

    # 3. Añadir función compartir (antes de meskeIA Analytics)
    if 'function compartirApp()' not in contenido:
        print("✅ Añadiendo función compartirApp()...")

        # Patrón 1: Intentar insertar antes de </script> + Analytics
        patron_script = r'(    </script>)\s*\n\s*<!-- meskeIA Analytics'
        match_script = re.search(patron_script, contenido_modificado)

        if match_script:
            contenido_modificado = re.sub(
                patron_script,
                '\n' + FUNCION_COMPARTIR + r'\n\1\n\n    <!-- meskeIA Analytics',
                contenido_modificado
            )
            cambios += 1
        else:
            # Patrón 2: Apps sin script previo - insertar script antes de Analytics
            patron_analytics = r'(\n)(    <!-- meskeIA Analytics)'
            match_analytics = re.search(patron_analytics, contenido_modificado)

            if match_analytics:
                print("   Insertando nuevo bloque <script>...")
                contenido_modificado = re.sub(
                    patron_analytics,
                    r'\n<script>\n' + FUNCION_COMPARTIR + r'\n</script>\n\n\2',
                    contenido_modificado
                )
                cambios += 1
            else:
                print("⚠️  No se encontró ubicación para función compartir")
    else:
        print("⏭️  Función compartirApp() ya existe")

    # Resumen
    print(f"\n📊 Resumen: {cambios} cambios realizados")

    if cambios == 0:
        print("⏭️  No se realizaron cambios")
        return False

    # Guardar archivo (solo si no es dry_run)
    if not dry_run:
        try:
            # Crear backup
            backup_path = archivo_path.with_suffix('.html.backup')
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(contenido)
            print(f"💾 Backup creado: {backup_path.name}")

            # Guardar modificado
            with open(archivo_path, 'w', encoding='utf-8') as f:
                f.write(contenido_modificado)
            print(f"✅ Archivo guardado: {archivo_path.name}")
            return True
        except Exception as e:
            print(f"❌ Error al guardar: {e}")
            return False
    else:
        print("🔍 DRY RUN - No se guardaron cambios")
        return True


def main():
    """Función principal"""
    print("\n" + "="*60)
    print("  SCRIPT: Anadir Boton Compartir - meskeIA")
    print("            Version 1.0")
    print("="*60 + "\n")

    # Configuración
    MODO_TEST = False  # Cambiar a False para procesar todas
    DRY_RUN = False    # Cambiar a True para solo simular

    if MODO_TEST:
        print("🧪 MODO TEST: Solo procesando 2 aplicaciones")
    else:
        print("🚀 MODO PRODUCCIÓN: Procesando todas las aplicaciones")

    if DRY_RUN:
        print("🔍 DRY RUN: Solo simulación, no se guardarán cambios\n")
    else:
        print("💾 GUARDANDO CAMBIOS: Se modificarán los archivos\n")

    # Encontrar apps
    apps = encontrar_apps(modo_test=MODO_TEST)
    print(f"📁 Archivos encontrados: {len(apps)}\n")

    if not apps:
        print("❌ No se encontraron archivos index.html")
        return

    # Confirmar (solo en modo producción)
    if not DRY_RUN and not MODO_TEST:
        respuesta = input(f"¿Proceder a modificar {len(apps)} archivos? (s/n): ")
        if respuesta.lower() != 's':
            print("❌ Operación cancelada")
            return
    elif not DRY_RUN:
        print(f"✅ Modo TEST - Procesando automáticamente {len(apps)} archivos\n")

    # Procesar archivos
    exitosos = 0
    saltados = 0
    errores = 0

    for app_path in apps:
        try:
            resultado = procesar_archivo(app_path, dry_run=DRY_RUN)
            if resultado:
                exitosos += 1
            else:
                saltados += 1
        except Exception as e:
            print(f"❌ Error procesando {app_path.name}: {e}")
            errores += 1

    # Resumen final
    print(f"\n{'='*80}")
    print("📊 RESUMEN FINAL")
    print(f"{'='*80}")
    print(f"✅ Exitosos: {exitosos}")
    print(f"⏭️  Saltados:  {saltados}")
    print(f"❌ Errores:   {errores}")
    print(f"📁 Total:     {len(apps)}")

    if exitosos > 0 and not DRY_RUN:
        print("\n💡 Recuerda hacer commit y push de los cambios!")

    print("\n✨ Script finalizado")


if __name__ == '__main__':
    main()
