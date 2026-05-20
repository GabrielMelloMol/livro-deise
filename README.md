# Livro Deise — Experiência Digital

Plataforma digital do livro infantil inclusivo "Deise em... Tudo aqui já foi um sonho!"

Site: https://gabrielmellomol.github.io/livro-deise/

## Como trocar assets

### Atualizar páginas do livro (novo PDF)
1. `python scripts/export_pdf.py "caminho/para/novo.pdf"`
2. Commit e push — GitHub Pages atualiza automaticamente

### Atualizar vídeos de Libras
- Substitua o `.mp4` em `assets/libras/page-XX.mp4`, OU
- Edite a URL `libras` da página em `js/config.js`

### Atualizar narração
- Substitua o `.mp3` em `assets/audio/page-XX.mp3`, OU
- Rode `python scripts/generate_tts.py`

## Stack
StPageFlip · Howler.js · MindAR.js · Lottie · tsParticles · edge-tts · yt-dlp · GitHub Pages

## Desenvolvimento local

```bash
python -m http.server 8080
# Abrir http://localhost:8080
```

> **Nota:** Os arquivos `js/config.js` e `scripts/export_pdf.py` serão criados nas próximas tasks de implementação.
