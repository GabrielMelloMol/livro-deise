// js/config.js
// CONFIG CENTRAL — edite aqui para trocar assets sem mexer no código

export const VERSION  = '1.0.20';
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

export const PURCHASE_URL = "https://editorasaberonline.com.br/produto/deise-em-tudo-aqui-ja-foi-um-sonho/";

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
