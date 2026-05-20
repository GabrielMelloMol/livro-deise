# Guia — Montar EPUB3 no Sigil

## Download
Baixar em: https://sigil-ebook.com/sigil/download/

## Passo a passo

### 1. Novo livro
File → New Book

### 2. Importar imagens
Book Browser (painel esquerdo) → Images → Add Existing Files
Selecionar todas as imagens de `assets/pages/`

### 3. Criar capítulos
Para cada página com texto, criar um arquivo HTML no Sigil:
Book Browser → Text → Add Blank HTML File

### 4. Estrutura HTML de cada capítulo

```html
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR">
<head>
  <title>Página X — Deise em... Tudo aqui já foi um sonho!</title>
</head>
<body>
  <figure>
    <img src="../Images/page-04.jpg"
         alt="[ALT TEXT DO ARQUIVO epub3-alt-texts.md]" />
  </figure>
  <p>[TEXTO DA PÁGINA]</p>
</body>
</html>
```

### 5. Metadados
Tools → Metadata Editor:
- Title: Deise em... Tudo aqui já foi um sonho!
- Author: Tatiana Nóbrega Onofre
- Language: pt-BR (selecionar Portuguese, Brazil)
- Publisher: Editora Saber Online
- Date: 2026

### 6. Salvar e validar
File → Save Book → salvar como `livro-deise.epub` em `assets/`

Validar: Tools → Validate EPUB with FlightCrew
Corrigir qualquer erro crítico antes de publicar.

### 7. Testar
- iPhone: AirDrop do .epub para o iPhone → abre no Livros → ativar VoiceOver
- Android: copiar via USB → abrir no KOReader ou Google Play Livros → ativar TalkBack

### 8. Publicar no site
Após validação, adicionar link no index.html:
```html
<a href="assets/livro-deise.epub" download
   style="color:#aaa;font-size:0.8rem;padding:8px;display:block;text-align:center;">
  ♿ Baixar versão acessível (.epub) para leitores de tela
</a>
```
