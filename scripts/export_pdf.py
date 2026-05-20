import fitz  # pymupdf
import sys
import os
import argparse

# Qualidade de exportação:
# 250 DPI = padrão atual (1524×2213px) — bom para leitura normal
# 350 DPI = recomendado para zoom — imagens maiores (~70MB total)
# 400 DPI = zoom de alta qualidade — imagens grandes (~100MB total)
# SVG     = vetorial puro — perfeito para PDF com texto/vetor; ruim se o PDF usa rasters

PDF_PATH   = "Deise em tudo aqui já foi um sonho.pdf"
OUTPUT_DIR = "assets/pages"
DPI        = 250
JPG_QUALITY = 95


def export_jpg(doc, output_dir, dpi, quality):
    zoom = dpi / 72
    mat  = fitz.Matrix(zoom, zoom)
    for i, page in enumerate(doc):
        pix      = page.get_pixmap(matrix=mat)
        filename = f"page-{i+1:02d}.jpg"
        pix.save(os.path.join(output_dir, filename), jpg_quality=quality)
        print(f"  JPG: {filename} ({pix.width}x{pix.height}px)")


def export_svg(doc, output_dir):
    for i, page in enumerate(doc):
        svg      = page.get_svg_image()
        filename = f"page-{i+1:02d}.svg"
        with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as f:
            f.write(svg)
        size = os.path.getsize(os.path.join(output_dir, filename)) // 1024
        print(f"  SVG: {filename} ({size}KB)")


def main():
    parser = argparse.ArgumentParser(description="Exporta páginas do PDF para assets/pages")
    parser.add_argument("pdf",    nargs="?", default=PDF_PATH, help="Caminho do PDF")
    parser.add_argument("--dpi",  type=int,  default=DPI,      help="DPI para JPG (padrão: 250)")
    parser.add_argument("--svg",  action="store_true",          help="Exportar SVG (escala infinita, ideal para PDF vetorial)")
    parser.add_argument("--quality", type=int, default=JPG_QUALITY, help="Qualidade JPG 1-100 (padrão: 95)")
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    doc = fitz.open(args.pdf)
    print(f"PDF: {args.pdf} — {len(doc)} páginas")

    if args.svg:
        print("Exportando SVG (zoom perfeito para PDFs vetoriais)...")
        export_svg(doc, OUTPUT_DIR)
        print("\nATENÇÃO: atualize config.js para usar .svg em vez de .jpg nos caminhos das páginas.")
    else:
        print(f"Exportando JPG a {args.dpi} DPI, qualidade {args.quality}%...")
        export_jpg(doc, OUTPUT_DIR, args.dpi, args.quality)

    print(f"\nTotal: {len(doc)} páginas exportadas para {OUTPUT_DIR}/")
    doc.close()


if __name__ == "__main__":
    main()
