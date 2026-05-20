#!/bin/bash
# scripts/download_libras.sh
# Baixar vídeos de Libras do YouTube para uso local no flipbook
#
# COMO USAR:
#   1. Escanear os QR codes do livro físico com o celular
#   2. Copiar a URL do YouTube de cada página para a variável correspondente
#   3. Rodar: bash scripts/download_libras.sh
#
# Os arquivos .mp4 são salvos em assets/libras/ e ficam NO gitignore (pesados)
# Para usar URL do YouTube diretamente (sem baixar), edite js/config.js:
#   libras: "https://www.youtube.com/watch?v=XXXX"

set -e
OUTPUT_DIR="assets/libras"
mkdir -p "$OUTPUT_DIR"

# Função de download
download_libras() {
  local page="$1"
  local url="$2"
  local output="$OUTPUT_DIR/page-$(printf '%02d' $page).mp4"

  if [ -z "$url" ] || [ "$url" = "PENDENTE" ]; then
    echo "  [PULANDO] Página $page — URL não preenchida"
    return
  fi

  echo "  Baixando página $page..."
  yt-dlp \
    -o "$output" \
    -f "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best" \
    --merge-output-format mp4 \
    "$url"
  echo "  Salvo: $output"
}

echo "Iniciando download de vídeos de Libras..."
echo "Diretório de saída: $OUTPUT_DIR"
echo ""

# === PREENCHER AS URLS ABAIXO ===
# Escanear o QR code de cada página do livro e copiar a URL aqui

download_libras 4  "PENDENTE"   # Página 4  — Deise na comunidade
download_libras 5  "PENDENTE"   # Página 5  — Ela morava com seus irmãos
download_libras 6  "PENDENTE"   # Página 6  — Faltava dinheiro, mas não afeto
download_libras 7  "PENDENTE"   # Página 7  — Ela enxergava possibilidades
download_libras 8  "PENDENTE"   # Página 8  — Pergunta no coração
download_libras 9  "PENDENTE"   # Página 9  — Ilustração
download_libras 10 "PENDENTE"   # Página 10 — Lugar mágico
download_libras 11 "PENDENTE"   # Página 11 — A coragem
download_libras 12 "PENDENTE"   # Página 12
download_libras 13 "PENDENTE"   # Página 13
download_libras 14 "PENDENTE"   # Página 14 — ARONG
download_libras 15 "PENDENTE"   # Página 15
download_libras 16 "PENDENTE"   # Página 16 — Arte transforma
download_libras 17 "PENDENTE"   # Página 17
download_libras 18 "PENDENTE"   # Página 18
download_libras 19 "PENDENTE"   # Página 19 — Fada Madrinha
download_libras 20 "PENDENTE"   # Página 20
download_libras 21 "PENDENTE"   # Página 21
download_libras 22 "PENDENTE"   # Página 22 — Biblioteca
download_libras 23 "PENDENTE"   # Página 23
download_libras 24 "PENDENTE"   # Página 24 — Final
download_libras 25 "PENDENTE"   # Página 25
download_libras 26 "PENDENTE"   # Página 26
download_libras 27 "PENDENTE"   # Página 27

echo ""
echo "Concluído! Arquivos em $OUTPUT_DIR/"
echo "Para páginas PENDENTE, preencha as URLs no script e rode novamente."
