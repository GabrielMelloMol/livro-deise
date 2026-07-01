# Deise em… Tudo aqui já foi um sonho! — Documentação técnica do site/app

Documento explicativo do funcionamento técnico da experiência digital do livro
inclusivo **"Deise em… Tudo aqui já foi um sonho!"**, disponível em
**livrodeise.com.br**. Escrito para as pessoas que participam do projeto
(inclusive para fins de referência acadêmica / tese).

---

## 1. Visão geral

O site é uma **aplicação web** (roda no navegador do celular ou computador, sem
instalar nada) que oferece:

- Um **livro digital** que folheia as páginas com efeito de virada realista;
- Cinco **modos de acessibilidade** espelhando os QR codes do livro físico:
  audiolivro, áudio com audiodescrição, Libras, linguagem simples e CAA
  (Comunicação Aumentativa e Alternativa);
- Uma experiência de **Realidade Aumentada (RA)**: apontando a câmera do celular
  para as páginas do livro impresso, aparecem objetos 3D sobre elas;
- Guias de apoio (Guia para a Mediação Pedagógica Inclusiva) e links para as
  edições impressa e em Braille.

Também é um **PWA** (Progressive Web App): pode ser "instalado" na tela inicial
do celular e funciona parcialmente offline.

---

## 2. Linguagens e tecnologias utilizadas

O projeto foi feito com as **três linguagens base da web**, sem framework pesado:

| Linguagem | Papel no projeto |
|-----------|------------------|
| **HTML** | Estrutura das páginas (semântica, acessível a leitores de tela) |
| **CSS**  | Layout, responsividade, animações e identidade visual |
| **JavaScript** | Toda a interatividade (folhear, zoom, gestos, RA, modos de acesso) |

O JavaScript é **"vanilla"** (puro), organizado em **módulos ES** (`config.js`,
`flipbook.js`, `access.js`, `stars.js`) — ou seja, **não usa React, Vue ou
Angular**. A escolha por código leve e sem framework foi proposital: garante
carregamento rápido, funcionamento offline e facilidade de manutenção.

### Bibliotecas de apoio (código aberto, carregadas via CDN)

| Biblioteca | Versão | Para quê |
|------------|--------|----------|
| **StPageFlip** (page-flip.js) | 2.0.7 | Efeito de folhear/virar as páginas |
| **Howler.js** | 2.2.4 | Reprodução de áudio (com fallback) |
| **A-Frame** | 1.4.2 | Motor de cena 3D/WebXR usado na Realidade Aumentada |
| **MindAR** | 1.2.5 | Rastreamento de imagem (image tracking) para a RA |

### Ferramentas de preparação de conteúdo (rodam só no desenvolvimento)

- **gltf-transform** — otimização dos modelos 3D;
- **jimp** + **MindAR compiler** — geração do "mapa" de rastreamento da RA;
- **pdftoppm** (Poppler) + **Pillow (Python)** — conversão/compressão de PDFs
  (prancha CAA e guia de mediação) em imagens.

### Hospedagem

- Publicado no **GitHub Pages** (hospedagem estática gratuita);
- Domínio próprio **livrodeise.com.br** apontado via DNS (Hostinger);
- Servido por **HTTPS** (obrigatório para a câmera da RA funcionar).

---

## 3. O efeito de "virar a página"

O movimento de folhear é feito pela biblioteca **StPageFlip**. Ela pega as imagens
das páginas (a capa, as 38 páginas do miolo e a contracapa) e as trata como folhas
de um livro real, calculando em tempo real a **dobra do papel** conforme o dedo (ou
o clique) arrasta a página. Recursos implementados por cima dela:

- **Responsividade**: em celular mostra **uma página por vez**; no computador,
  **as duas páginas abertas** (como um livro aberto).
- **Zoom e arraste**: dá para ampliar (pinça no celular, roda do mouse no PC) e
  arrastar para ver detalhes; ao virar a página o zoom volta ao normal.
- **Renderização em alta definição**: o livro é desenhado numa resolução 2× maior
  e exibido reduzido, deixando as ilustrações mais nítidas.
- **Pré-carregamento**: a tela de abertura só libera o livro depois de **baixar
  todas as imagens**, para folhear sem "engasgos".

---

## 4. O som de virar a página

Este é um detalhe interessante: **não existe um arquivo de som de página.** O som é
**gerado (sintetizado) em tempo real** pelo navegador, usando a **Web Audio API**.

A cada virada, o código cria dois "ruídos" curtinhos e os combina:

1. Um **chiado agudo de papel** — ruído branco passado por um filtro passa-altas
   (~2800 Hz), com envelope rápido de ataque e decaimento (~0,3 s);
2. Um **"baque" grave** logo depois — ruído filtrado por passa-baixas (~400 Hz),
   simulando a folha assentando.

Ou seja, o som é **procedural** (feito por matemática/DSP no próprio navegador),
não uma gravação. Isso deixa o site mais leve (nenhum arquivo de áudio a baixar) e o
som nunca "desafina" nem depende de licença de terceiros.

> Observação: o código ainda aceita um arquivo `assets/sounds/page-turn.mp3`
> (royalty-free) caso um dia se prefira um som gravado; se o arquivo não existir,
> ele usa automaticamente a síntese descrita acima.

---

## 5. Modos de acessibilidade

Acessíveis pelo botão **♿ Acessibilidade**. Cada modo espelha um recurso do livro
físico (os mesmos dos QR codes impressos):

- **Audiolivro** e **Áudio com audiodescrição** — arquivos MP3 tocados na própria
  página (com opção de abrir no YouTube como alternativa).
- **Libras** — vídeo com intérprete de Língua Brasileira de Sinais.
- **Linguagem simples** — vídeo com a história contada de forma mais acessível
  (há também a transcrição em texto para leitura na tela).
- **CAA — pictogramas** — a prancha de Comunicação Aumentativa e Alternativa,
  exibida como **galeria de imagens** rolável (mais legível no celular do que um
  PDF embutido), com opção de baixar o PDF completo.

Os vídeos maiores (Libras, linguagem simples) são **comprimidos** e
**pré-carregados em segundo plano** para não travar quando a pessoa abre o modo.

### Acessibilidade "invisível"

- **Textos alternativos (alt)** em todas as 38 páginas: quando a página tem texto,
  o leitor de tela lê o texto; quando é só ilustração, lê uma **descrição da cena**.
- HTML **semântico**, navegação por **teclado**, foco preso nos diálogos, e
  respeito à preferência de **movimento reduzido** do sistema.

---

## 6. Os objetos 3D

Os modelos 3D usados na Realidade Aumentada foram **gerados no Meshy.ai** (a partir
de descrições/imagens das cenas do livro) e depois **preparados para a web**:

1. **Exportados do Meshy** em formato **GLB** (padrão glTF para 3D na web).
2. **Otimizados** com a ferramenta *gltf-transform*: as texturas foram reduzidas e
   convertidas para **WebP**, e a geometria comprimida (quantização). Isso derruba o
   tamanho de cada modelo de ~10–20 MB para **menos de 1 MB**, sem perda visual
   perceptível — essencial para carregar rápido no celular.
3. **Normalizados**: todos ajustados para a **mesma altura** e com a **base no
   chão**, para "assentarem" corretamente sobre a página.

São **12 objetos**, um para cada dupla de páginas da história (ex.: a estrela do
sonho, a Deise jogando bola, a ARONG, o saxofone da música, a fada madrinha etc.).

---

## 7. A Realidade Aumentada (RA / AR)

A RA funciona **direto no navegador do celular**, sem baixar aplicativo. É baseada
em **rastreamento de imagem (image tracking)** com **MindAR** + **A-Frame**.

### Como foi feita, passo a passo

1. **Marcadores (o que a câmera reconhece):** as imagens das páginas escolhidas são
   processadas por um compilador do MindAR, que extrai os **pontos característicos**
   de cada imagem (cantos, bordas, contrastes) e gera um único arquivo de "mapa"
   (`targets.mind`). É esse mapa que permite ao celular reconhecer qual página está
   sendo apontada.
2. **A cena 3D:** o A-Frame monta uma cena onde, para cada página reconhecida, existe
   um "âncora" invisível. Quando a câmera detecta a página, o objeto 3D
   correspondente **aparece ancorado sobre ela** e acompanha o movimento do livro.
3. **Renderização:** os modelos GLB otimizados são carregados e exibidos com
   iluminação e animações suaves (flutuar, girar levemente).
4. **Gestos:** depois que o objeto aparece, a pessoa pode **girar** (arrastar com um
   dedo) e **dar zoom** (pinça com dois dedos).
5. **Estabilização:** foram ajustados parâmetros de suavização do rastreamento para
   reduzir tremores/distorções do objeto.
6. **1 objeto por dupla de páginas:** os marcadores foram distribuídos em páginas
   **espaçadas**, para nunca aparecerem dois objetos 3D juntos quando o livro está
   aberto nas duas páginas.

### Roteamento por dispositivo

Ao acessar **livrodeise.com.br**:

- No **celular**, o site abre uma tela de escolha: *ver o livro digital* ou
  *experimentar a Realidade Aumentada*;
- No **computador** (sem câmera traseira), vai direto para o livro digital.

### Detalhes técnicos que fizeram a RA funcionar

- É necessário **HTTPS** (a câmera do celular só liga em conexão segura);
- A versão do A-Frame precisa ser a **1.4.2** (versões mais novas eram incompatíveis
  com o MindAR usado);
- Os modelos usam **compressão nativa** do glTF (o navegador entende sem plug-ins).

---

## 8. Infraestrutura e funcionamento offline (PWA)

- Um **Service Worker** guarda os arquivos principais em cache, permitindo abrir o
  livro mesmo com internet instável e carregar mais rápido nas próximas visitas.
- Um **manifesto** (`manifest.webmanifest`) permite **instalar** o site como app na
  tela inicial do celular.
- Um número de **versão** aparece discretamente no canto da tela, para sempre saber
  qual versão está no ar.

---

## 9. Resumo de uma frase

> Um livro digital inclusivo feito em **HTML, CSS e JavaScript puro**, com efeito de
> folhear (**StPageFlip**), som de página **sintetizado por Web Audio API**, cinco
> modos de acessibilidade, e uma camada de **Realidade Aumentada no navegador**
> (**MindAR + A-Frame**) que mostra **objetos 3D do Meshy.ai** — otimizados para a
> web — sobre as páginas do livro impresso.

---

*Documento gerado para a equipe do projeto Deise. Site: livrodeise.com.br*
