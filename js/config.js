// js/config.js
// CONFIG CENTRAL — edite aqui para trocar assets sem mexer no código

export const VERSION  = '0.5.0';
export const SITE_URL = "https://gabrielmellomol.github.io/livro-deise";

// Cenas de RA: chave = id, valor = páginas do livro e narração
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

// Mapeamento página → assets
// audio e libras: null = ainda não disponível (sem ícone no flipbook)
// arScene: null = sem cena RA para essa página
export const PAGES = [
  { id: 1,  image: "assets/pages/page-01.jpg", audio: null,                       libras: null,                        arScene: "capa" },
  { id: 2,  image: "assets/pages/page-02.jpg", audio: null,                       libras: null,                        arScene: null },
  { id: 3,  image: "assets/pages/page-03.jpg", audio: null,                       libras: null,                        arScene: null },
  { id: 4,  image: "assets/pages/page-04.jpg", audio: "assets/audio/page-04.mp3", libras: "assets/libras/page-04.mp4", arScene: "infancia" },
  { id: 5,  image: "assets/pages/page-05.jpg", audio: "assets/audio/page-05.mp3", libras: "assets/libras/page-05.mp4", arScene: "infancia" },
  { id: 6,  image: "assets/pages/page-06.jpg", audio: "assets/audio/page-06.mp3", libras: "assets/libras/page-06.mp4", arScene: null },
  { id: 7,  image: "assets/pages/page-07.jpg", audio: "assets/audio/page-07.mp3", libras: "assets/libras/page-07.mp4", arScene: null },
  { id: 8,  image: "assets/pages/page-08.jpg", audio: "assets/audio/page-08.mp3", libras: "assets/libras/page-08.mp4", arScene: "sonho" },
  { id: 9,  image: "assets/pages/page-09.jpg", audio: "assets/audio/page-09.mp3", libras: "assets/libras/page-09.mp4", arScene: "sonho" },
  { id: 10, image: "assets/pages/page-10.jpg", audio: "assets/audio/page-10.mp3", libras: "assets/libras/page-10.mp4", arScene: "sonho" },
  { id: 11, image: "assets/pages/page-11.jpg", audio: "assets/audio/page-11.mp3", libras: "assets/libras/page-11.mp4", arScene: "coragem" },
  { id: 12, image: "assets/pages/page-12.jpg", audio: "assets/audio/page-12.mp3", libras: "assets/libras/page-12.mp4", arScene: null },
  { id: 13, image: "assets/pages/page-13.jpg", audio: "assets/audio/page-13.mp3", libras: "assets/libras/page-13.mp4", arScene: null },
  { id: 14, image: "assets/pages/page-14.jpg", audio: "assets/audio/page-14.mp3", libras: "assets/libras/page-14.mp4", arScene: "arong" },
  { id: 15, image: "assets/pages/page-15.jpg", audio: "assets/audio/page-15.mp3", libras: "assets/libras/page-15.mp4", arScene: null },
  { id: 16, image: "assets/pages/page-16.jpg", audio: "assets/audio/page-16.mp3", libras: "assets/libras/page-16.mp4", arScene: "arte" },
  { id: 17, image: "assets/pages/page-17.jpg", audio: "assets/audio/page-17.mp3", libras: "assets/libras/page-17.mp4", arScene: "arte" },
  { id: 18, image: "assets/pages/page-18.jpg", audio: "assets/audio/page-18.mp3", libras: "assets/libras/page-18.mp4", arScene: "arte" },
  { id: 19, image: "assets/pages/page-19.jpg", audio: "assets/audio/page-19.mp3", libras: "assets/libras/page-19.mp4", arScene: "fada" },
  { id: 20, image: "assets/pages/page-20.jpg", audio: "assets/audio/page-20.mp3", libras: "assets/libras/page-20.mp4", arScene: "fada" },
  { id: 21, image: "assets/pages/page-21.jpg", audio: "assets/audio/page-21.mp3", libras: "assets/libras/page-21.mp4", arScene: "fada" },
  { id: 22, image: "assets/pages/page-22.jpg", audio: "assets/audio/page-22.mp3", libras: "assets/libras/page-22.mp4", arScene: "biblioteca" },
  { id: 23, image: "assets/pages/page-23.jpg", audio: "assets/audio/page-23.mp3", libras: "assets/libras/page-23.mp4", arScene: null },
  { id: 24, image: "assets/pages/page-24.jpg", audio: "assets/audio/page-24.mp3", libras: "assets/libras/page-24.mp4", arScene: null },
  { id: 25, image: "assets/pages/page-25.jpg", audio: "assets/audio/page-25.mp3", libras: "assets/libras/page-25.mp4", arScene: null },
  { id: 26, image: "assets/pages/page-26.jpg", audio: "assets/audio/page-26.mp3", libras: "assets/libras/page-26.mp4", arScene: null },
  { id: 27, image: "assets/pages/page-27.jpg", audio: "assets/audio/page-27.mp3", libras: "assets/libras/page-27.mp4", arScene: null },
  { id: 28, image: "assets/pages/page-28.jpg", audio: "assets/audio/page-28.mp3", libras: "assets/libras/page-28.mp4", arScene: null },
  { id: 29, image: "assets/pages/page-29.jpg", audio: "assets/audio/page-29.mp3", libras: "assets/libras/page-29.mp4", arScene: null },
  { id: 30, image: "assets/pages/page-30.jpg", audio: "assets/audio/page-30.mp3", libras: "assets/libras/page-30.mp4", arScene: "final" },
  { id: 31, image: "assets/pages/page-31.jpg", audio: "assets/audio/page-31.mp3", libras: "assets/libras/page-31.mp4", arScene: "final" },
  { id: 32, image: "assets/pages/page-32.jpg", audio: "assets/audio/page-32.mp3", libras: "assets/libras/page-32.mp4", arScene: "final" },
  { id: 33, image: "assets/pages/page-33.jpg", audio: "assets/audio/page-33.mp3", libras: "assets/libras/page-33.mp4", arScene: "final" },
  { id: 34, image: "assets/pages/page-34.jpg", audio: null,                       libras: null,                        arScene: null },
  { id: 35, image: "assets/pages/page-35.jpg", audio: null,                       libras: null,                        arScene: null },
  { id: 36, image: "assets/pages/page-36.jpg", audio: null,                       libras: null,                        arScene: null },
  { id: 37, image: "assets/pages/page-37.jpg", audio: null,                       libras: null,                        arScene: null },
];

// Textos das páginas para narração TTS e EPUB3
// Completar com o texto completo após receber o PDF final
export const PAGE_TEXTS = {
  4:  "Esta é a história de uma menina chamada Deise, que vivia em uma comunidade de ruas apertadas e casas simples, onde a vida nem sempre era fácil, mas até que era muito divertida.",
  5:  "Ela morava com seus irmãos, passavam o dia brincando de queimada naquelas ruelas. Seus dias eram cheios de risadas e, também, de muitos desafios.",
  8:  "E dentro do coração daquela garotinha morava uma pergunta: Por que os adultos esquecem de seus sonhos? Ei, sonho, aonde vai com tanta pressa? Tá certo, você tem razão! Viviam várias perguntas. E você vai ficar aí, parada? Não vai fazer nada? Vai deixar seu sonho morrer também? Mas por onde eu começo? E se?",
  10: "Deise imaginava um lugar mágico, repleto de livros, música, dança e, acima de tudo, esperança. Algumas pessoas diziam: Isso é grande demais para você!",
};
