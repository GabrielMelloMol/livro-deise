import qrcode
import os

SITE_URL = "https://gabrielmellomol.github.io/livro-deise"
OUTPUT_DIR = "assets/qrcodes"

SCENES = [
    ("capa",       "Capa — O Livro Desperta"),
    ("infancia",   "Infância e Comunidade (págs. 4-5)"),
    ("sonho",      "O Sonho Começa a Nascer (págs. 8-10)"),
    ("coragem",    "A Coragem de Continuar (pág. 11)"),
    ("arong",      "O Nascimento da ARONG (pág. 14)"),
    ("arte",       "A Arte Transforma Vidas (págs. 16-18)"),
    ("fada",       "A Fada Madrinha (págs. 19-21)"),
    ("biblioteca", "A Biblioteca dos Sonhos (pág. 22)"),
    ("final",      "Final — O Sonho Continua (págs. 30-33)"),
]

def generate():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for scene_id, description in SCENES:
        url = f"{SITE_URL}/ar/?cena={scene_id}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        filename = os.path.join(OUTPUT_DIR, f"qr-{scene_id}.png")
        img.save(filename)
        print(f"  {filename}")
        print(f"    → {url}")
    print(f"\n{len(SCENES)} QR codes gerados em {OUTPUT_DIR}/")

if __name__ == "__main__":
    generate()
