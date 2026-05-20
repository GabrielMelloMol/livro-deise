import fitz  # pymupdf
import sys
import os

PDF_PATH = "Deise em tudo aqui já foi um sonho.pdf"
OUTPUT_DIR = "assets/pages"
DPI = 250  # 250dpi = extrema qualidade para retina/mobile
JPG_QUALITY = 95

def export_pages(pdf_path=PDF_PATH, output_dir=OUTPUT_DIR, dpi=DPI):
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat)
        filename = f"page-{i+1:02d}.jpg"
        pix.save(os.path.join(output_dir, filename), jpg_quality=JPG_QUALITY)
        print(f"  Exportada: {filename} ({pix.width}x{pix.height}px)")
    print(f"\nTotal: {len(doc)} páginas exportadas para {output_dir}/")
    doc.close()

if __name__ == "__main__":
    pdf = sys.argv[1] if len(sys.argv) > 1 else PDF_PATH
    export_pages(pdf)
