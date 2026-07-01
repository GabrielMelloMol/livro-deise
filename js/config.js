// js/config.js
// CONFIG CENTRAL — edite aqui para trocar assets sem mexer no código

export const VERSION  = '1.0.24';
export const SITE_URL = "https://livrodeise.com.br";

// ---------------------------------------------------------------------------
// CAPA / CONTRACAPA
// ---------------------------------------------------------------------------
export const COVER = {
  image: "assets/pages/cover.jpg",
  label: "Capa",
  alt: "Capa do livro Deise em… Tudo aqui já foi um sonho! Uma menina de cabelo cacheado, apoiada nas mãos, sonha acordada. Acima dela, uma nuvem mostra crianças tocando música, dançando balé e praticando luta. Autoras e autor: Tatiana Nóbrega Onofre, Sheila Arantes e Gabriel Mol. Selo: Livro Inclusivo, com áudio, Libras e Braille.",
};

export const BACK_COVER = {
  image: "assets/pages/back-cover.jpg",
  label: "Contracapa",
  alt: "Contracapa do livro. Texto: Antes da ONG ARONG existir, havia uma menina cheia de perguntas, coragem e vontade de transformar o mundo ao seu redor. O livro é narrado em Libras e conta com audiodescrição, Braille, Comunicação Aumentativa e Alternativa e linguagem simplificada, além de um Guia Prático de Inclusão.",
};

// ---------------------------------------------------------------------------
// MODOS DE ACESSO — espelham os QR codes do livro físico (livro inteiro)
//   type: 'youtube' (embed) | 'simple' (leitor de texto na tela) | 'pdf' | 'link'
// ---------------------------------------------------------------------------
export const ACCESS_MODES = [
  { key: "audiolivro",     icon: "🔊", label: "Audiolivro",
    desc: "Narração completa do livro em áudio.",
    type: "audio", src: "assets/audio/audiolivro.mp3", youtubeId: "gu6BcrX6POA",
    qrCode: "assets/qrcodes/qr-modo-audiolivro.png" },

  { key: "audiodescricao", icon: "👁️", label: "Áudio com audiodescrição",
    desc: "Narração que também descreve as ilustrações — para quem não enxerga.",
    type: "audio", src: "assets/audio/audiodescricao.mp3", youtubeId: "gfdhPw-AuKU",
    qrCode: "assets/qrcodes/qr-modo-audiodescricao.png" },

  { key: "libras",         icon: "🤟", label: "Libras",
    desc: "Vídeo do livro com intérprete de Língua Brasileira de Sinais.",
    type: "localvideo", src: "assets/video/libras.mp4", youtubeId: "ksQqd6suIyw",
    qrCode: "assets/qrcodes/qr-modo-libras.png" },

  { key: "linguagemSimples", icon: "📖", label: "Linguagem simples",
    desc: "Vídeo com a história contada em linguagem simples e acessível.",
    type: "localvideo", src: "assets/video/linguagem-simples.mp4", youtubeId: "4foeRCmB2TQ",
    qrCode: "assets/qrcodes/qr-modo-linguagem-simples.png" },

  { key: "caa",            icon: "🔣", label: "CAA — pictogramas",
    desc: "Prancha de Comunicação Aumentativa e Alternativa (os pictogramas também estão em cada página).",
    type: "caa", url: "assets/caa/comunicacao-caa.pdf",
    externalUrl: "https://drive.google.com/file/d/1oMIImqPGptp_aKcwfzumfsRzgjOUmTHW/view",
    qrCode: "assets/qrcodes/qr-modo-caa.png" },
];

export const PURCHASE_URL  = "https://editorasaberonline.com.br/produto/deise-em-tudo-aqui-ja-foi-um-sonho/";
export const BRAILLE_URL   = "https://editorasaberonline.com.br/produto/deise-em-tudo-aqui-ja-foi-um-sonho-edicao-em-braille/";
export const INSTAGRAM_URL = "https://www.instagram.com/projetodeise.inclusao";

// Vídeo animado (AR no web) — PLACEHOLDER por enquanto; trocar pelos vídeos finais.
export const AR_VIDEO = {
  src: "assets/ar/animacao-placeholder.mp4",
  label: "Animação do livro",
};

// ---------------------------------------------------------------------------
// TEXTO EM LINGUAGEM SIMPLES (modo de leitura na tela) — transcrição oficial
// ---------------------------------------------------------------------------
export const SIMPLE_TEXT = {
  title: "Deise em… Tudo aqui já foi um sonho!",
  subtitle: "Uma história de amor, coragem e esperança. Nunca desista dos seus sonhos.",
  paragraphs: [
    "Essa é a história de uma menina chamada Deise. Deise mora em um lugar com ruas pequenas e simples. A vida nem sempre era fácil, mas era muito divertida.",
    "Deise mora com os seus irmãos. Durante o dia brincam muito nas ruas do bairro. Às vezes falta dinheiro, mas nunca falta amor. Quem tem amor tem tudo.",
    "Deise era uma menina muito especial. Ela sabia olhar ao redor com carinho. Enquanto muitos viam problemas e tristeza, Deise enxergava possibilidades e sonhos.",
    "E no coração de Deise morava uma pergunta: por que os adultos esquecem dos seus sonhos? Ela se perguntava: Ei, sonho, aonde você vai com tanta pressa? O que eu vou fazer para não deixar o meu sonho morrer? Por onde eu começo?",
    "Deise sonhava com um lugar mágico, cheio de livros, música, dança e esperança. Algumas pessoas diziam: isso é grande demais para você. Mas Deise guardava seu sonho com muito cuidado. Ela acreditava, e isso era o mais importante.",
    "O tempo passou. Deise cresceu. Ela trabalhou muito e ajudou sua família, aprendeu coisas novas e, mesmo cansada, nunca desistiu dos seus sonhos. Cada dificuldade a tornava mais forte.",
    "Chegou o grande momento. Deise decidiu: não bastava só imaginar, era hora de construir. Com muita determinação, ela criou um espaço especial: a ARONG. O que era só um desejo virou um lugar para toda a comunidade.",
    "Hoje, quando você entra na ARONG, percebe que tudo ali já foi um sonho. Onde antes era silêncio, agora tem o som do saxofone e do teclado. Onde antes tinha tristeza, agora tem crianças com brilho nos olhos.",
    "Na ARONG, as crianças aprenderam a ler, a dançar, a lutar, a cantar e a acreditar em si mesmas. Deise virou uma fada madrinha.",
    "Havia uma menina tímida. Ela achava que a beleza e a arte não eram para ela. Plim! No balé, a menina descobriu que tinha direito de ser feliz. Ela aprendeu que podia voar para qualquer palco que quisesse.",
    "Havia também um menino, e ninguém ouvia a voz dele. Plim! A fada madrinha chegou e mostrou que a arte também combate a violência. A voz do menino se tornou forte. Ele inspirou outros jovens da comunidade.",
    "Deise também criou um cantinho cheio de livros. Cada livro é a semente de um sonho — como este livro que você está lendo agora. Ele foi escrito para te lembrar de nunca desistir dos seus sonhos.",
    "Um sonho que nasce para fazer o bem pode se tornar a esperança de muitas pessoas. Os anos passaram e o amor continua alcançando vidas até hoje.",
    "Você pode visitar a ARONG se quiser. Lá você vai ver que os sonhos podem virar realidade e que fadas madrinhas podem existir de verdade.",
    "Tudo começou com uma menina que decidiu não desistir. A história de Deise foi escrita para te lembrar que tudo é possível. Acredite, persista e sonhe. Um dia você também vai olhar para trás e dizer: tudo que eu construí também já foi um sonho.",
  ],
};

// ---------------------------------------------------------------------------
// PÁGINAS DO MIOLO (38) — id + imagem. O alt usa PAGE_TEXTS quando houver.
// ---------------------------------------------------------------------------
export const PAGES = Array.from({ length: 38 }, (_, i) => {
  const id = i + 1;
  return { id, image: `assets/pages/page-${String(id).padStart(2, "0")}.jpg` };
});

// ---------------------------------------------------------------------------
// TEXTO DA NARRAÇÃO POR PÁGINA — usado para alt-text e fallback de voz (TTS).
// Confirmado a partir do PDF/áudio. Páginas só de ilustração ficam sem texto.
// TODO: completar as páginas restantes conferindo o PDF página a página.
// ---------------------------------------------------------------------------
export const PAGE_TEXTS = {
  4:  "Esta é a história de uma menina chamada Deise, que vivia em uma comunidade de ruas apertadas e casas simples, onde a vida nem sempre era fácil, mas até que era muito divertida.",
  5:  "Ela morava com seus irmãos, passavam o dia brincando de queimada naquelas ruelas. Seus dias eram cheios de risadas e, também, de muitos desafios.",
  6:  "Sim, faltava dinheiro também, mas não faltava afeto. Dizem que quem tem amor, tem tudo, não é mesmo?",
  7:  "Enquanto muitos viam apenas as dificuldades e a tristeza, ela enxergava as possibilidades e os sonhos que as pessoas acabavam esquecendo pelo caminho.",
  8:  "E dentro do coração daquela garotinha morava uma pergunta: por que os adultos esquecem dos seus sonhos? Ei, sonho, aonde vai com tanta pressa? E você, vai ficar aí parada? Vai deixar seu sonho morrer também? Mas por onde eu começo? E se?",
  10: "Deise imaginava um lugar mágico, repleto de livros, música, dança e, acima de tudo, esperança. Algumas pessoas diziam: isso é grande demais para você!",
  11: "Mas Deise guardava seu sonho com a coragem e a ousadia que só quem acredita de verdade possui.",
  13: "O tempo passou, Deise cresceu, trabalhou muito, ajudou sua família e aprendeu muitas coisas. Mesmo cansada, nunca deixou seu sonho adormecer. Ela entendeu que cada desafio era um aprendizado e que cada passo difícil a tornava mais forte.",
  14: "A grande virada aconteceu quando ela decidiu que não bastava apenas imaginar; era preciso construir! Com uma determinação inabalável, ela fundou um espaço mágico, cheio de acolhimento e cuidado… a ARONG! O que era apenas um desejo se tornou um porto seguro para sua comunidade inteira.",
  17: "Hoje, quando você entra na ARONG, percebe que tudo ali já foi um sonho. Onde antes havia silêncio, agora existe o som do saxofone e do teclado. Onde havia desânimo, agora há o brilho nos olhos de crianças que descobrem que sua cultura e o som da periferia podem ecoar no mundo.",
  18: "Ali crianças aprenderam a ler, dançar, lutar, cantar e acreditar em si mesmas.",
  19: "Deise foi se tornando uma espécie de fada madrinha, abrindo caminhos onde existia uma menina tímida que achava que a beleza e a arte não eram para ela.",
  21: "Onde tinha um menino que ninguém ouvia a voz. Plim!! Vinha nossa fada madrinha para mostrar que a violência também se combate com arte. A voz do menino se tornou potência e ecoou como um acorde de esperança, inspirando outros jovens da comunidade.",
  23: "E não para por aí! A Deise idealizou um lugar cheinho de livros: porque cada livro é a semente de um novo sonho. Como esse que você está lendo agora: ele foi escrito para te lembrar de nunca desistir dos seus! Um sonho que nasce para fazer o bem tem o poder de florescer e se tornar a esperança de todo um coletivo.",
  24: "Os anos se passaram… E o amor continua alcançando vidas até hoje. Você pode ir à ARONG conferir, se quiser! Você vai ver que sonhos podem virar realidade e que fadas madrinhas podem existir de verdade!",
  26: "E só de pensar que tudo começou com uma menina que decidiu não desistir… A história da Deise foi escrita para te lembrar que tudo é possível e que é preciso acreditar e persistir! Que um dia você também possa olhar para trás e dizer que tudo o que você construiu também já foi um sonho…",
};

// ---------------------------------------------------------------------------
// DESCRIÇÃO DAS ILUSTRAÇÕES (alt-text) — para páginas sem texto narrado e para
// as páginas de rosto/créditos. Usado pelo leitor de tela quando não há PAGE_TEXTS.
// ---------------------------------------------------------------------------
export const PAGE_ALT = {
  1:  "Página de rosto: o título “Deise em… Tudo aqui já foi um sonho!” e o selo Livro Inclusivo, com áudio, Libras e Braille.",
  2:  "Página de créditos e ficha catalográfica da Editora Saber Online.",
  3:  "Página de patrocinadores e apoio, com QR codes para acessar os recursos da obra.",
  9:  "Ilustração: Deise, ainda menina, em pé num campo florido com o braço erguido para o céu. Ao redor flutuam seus sonhos — um barquinho, a lua, balões e um gramofone.",
  12: "Ilustração: Deise, já jovem, numa cozinha simples, segurando com carinho uma pequena estrela dourada que brilha em suas mãos — o sonho que ela guardou.",
  15: "Ilustração: Deise adulta, orgulhosa, em frente à ARONG — uma casinha colorida com o letreiro “ARONG”, cercada de flores.",
  16: "Ilustração: na ARONG, um senhor toca saxofone e crianças tocam teclado e cantam ao lado de Deise. Notas musicais flutuam no ar.",
  20: "Ilustração: Deise transformada em fada madrinha, com asas e varinha, sob um arco-íris. Uma pomba branca voa e um menino observa, encantado.",
  22: "Ilustração: Deise sentada lendo um livro, ao lado de uma casa na árvore da ARONG, com crianças brincando entre as flores.",
  25: "Ilustração: festa na ARONG — Deise com um vestido de fada, cercada de crianças, balões e alegria, celebrando a comunidade.",
  27: "Ilustração: Deise adulta, de costas, olhando com esperança para a sua comunidade colorida ao longe, entre flores.",
  28: "Página sobre a ARONG Aliança Resgate ONG, com foto de Deise Xavier dos Santos Teixeira, presidente e inspiração da história.",
  29: "Foto de um evento real da ARONG, com crianças reunidas na comunidade.",
  30: "Atividade para a criança: “Qual é o seu sonho?” — espaço para escrever e desenhar um sonho.",
  31: "Página sobre o material de apoio para o uso dos recursos de inclusão, com QR code de acesso.",
  32: "Mini biografias da equipe: Tatiana Nóbrega e Sheila Arantes.",
  33: "Mini biografias da equipe: Gabriel Mol e Viviane dos Santos.",
  34: "Mini biografias da equipe: Luciana Dantas e Elizabeth de Jesus.",
  35: "Mini biografias da equipe: Doriane Vasconcelos e Joselaine Sousa.",
  36: "Mini biografias da equipe: Vânia Ferreira e Clemilton Lopes.",
  37: "Mini biografias da equipe: Fábio Coelho e Vanessa Duarte.",
  38: "Página final: esta obra é fruto do trabalho da disciplina de Empreendedorismo e Liderança do Programa de Pós-Graduação da UniCarioca. Uma obra construída coletivamente, por muitas mãos e corações.",
};

// ---------------------------------------------------------------------------
// CENAS DE REALIDADE AUMENTADA — usadas por /ar (mantidas como estão)
// ---------------------------------------------------------------------------
export const AR_SCENES = {
  "capa":       { pages: [1],                narration: "Toda grande transformação começa com um sonho." },
  "infancia":   { pages: [4, 5],             narration: "Esta é a história de Deise, uma menina cheia de sonhos." },
  "sonho":      { pages: [8, 9, 10],         narration: "Mas por onde eu começo? E se eu tentar?" },
  "coragem":    { pages: [11],               narration: "Quem acredita nos sonhos encontra forças para continuar." },
  "arong":      { pages: [14],               narration: "E assim nasceu a ARONG." },
  "arte":       { pages: [16, 17, 18],       narration: "A arte transforma vidas." },
  "fada":       { pages: [19, 20, 21],       narration: "Algumas pessoas chegam como fadas madrinhas." },
  "biblioteca": { pages: [22],               narration: "Cada livro é uma semente de um novo sonho." },
  "final":      { pages: [30, 31, 32, 33],   narration: "Tudo aqui já foi um sonho. E novos sonhos ainda podem nascer." },
};
