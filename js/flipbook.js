// js/flipbook.js
import { PAGES, SITE_URL } from './config.js';

const flipbook = document.getElementById('flipbook');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageIndicator = document.getElementById('page-indicator');

// Dimensões responsivas
function getBookSize() {
  const maxH = window.innerHeight - 120;
  const maxW = window.innerWidth - 40;
  const pageH = Math.min(maxH, 600);
  const pageW = Math.min(maxW / 2, 420);
  return { width: pageW * 2, height: pageH };
}

// Criar elementos <div> de página para o StPageFlip
function buildPages() {
  PAGES.forEach(p => {
    const div = document.createElement('div');
    div.className = 'page';
    div.dataset.pageId = p.id;

    const img = document.createElement('img');
    img.src = p.image;
    img.alt = `Página ${p.id} do livro`;
    img.loading = 'lazy';
    div.appendChild(img);

    // Ícone Libras
    if (p.libras) {
      const btn = document.createElement('button');
      btn.className = 'page-icon icon-libras';
      btn.title = 'Ver em Libras';
      btn.setAttribute('aria-label', 'Abrir vídeo em Libras');
      btn.innerHTML = '&#128075;';
      btn.addEventListener('click', e => { e.stopPropagation(); openLibras(p.libras); });
      div.appendChild(btn);
    }

    // Ícone Áudio
    if (p.audio) {
      const btn = document.createElement('button');
      btn.className = 'page-icon icon-audio';
      btn.title = 'Ouvir narração';
      btn.setAttribute('aria-label', 'Ouvir narração desta página');
      btn.innerHTML = '&#128266;';
      btn.addEventListener('click', e => { e.stopPropagation(); playAudio(p.audio); });
      div.appendChild(btn);
    }

    // Ícone RA
    if (p.arScene) {
      const btn = document.createElement('button');
      btn.className = 'page-icon icon-ar';
      btn.title = 'Experiência de Realidade Aumentada';
      btn.setAttribute('aria-label', 'Abrir Realidade Aumentada');
      btn.innerHTML = '&#x1F4F1;';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        window.open(`${SITE_URL}/ar/?cena=${p.arScene}`, '_blank');
      });
      div.appendChild(btn);
    }

    flipbook.appendChild(div);
  });
}

// Inicializar StPageFlip
let pageFlip;

function initFlipbook() {
  const { width, height } = getBookSize();
  buildPages();

  pageFlip = new St.PageFlip(flipbook, {
    width: width / 2,
    height: height,
    size: 'fixed',
    minWidth: 150,
    maxWidth: 420,
    minHeight: 300,
    maxHeight: 600,
    showCover: true,
    mobileScrollSupport: false,
    swipeDistance: 30,
    usePortrait: window.innerWidth < 700,
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  pageFlip.on('flip', e => {
    pageIndicator.textContent = `${e.data + 1} / ${PAGES.length}`;
    stopAudio();
  });

  pageIndicator.textContent = `1 / ${PAGES.length}`;
}

// Controles
btnPrev.addEventListener('click', () => pageFlip.flipPrev());
btnNext.addEventListener('click', () => pageFlip.flipNext());

// Teclado
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  pageFlip.flipPrev();
  if (e.key === 'ArrowRight') pageFlip.flipNext();
  if (e.key === 'Escape')     closeOverlays();
});

// Libras overlay
const overlayLibras = document.getElementById('overlay-libras');
const videoLibras   = document.getElementById('video-libras');
overlayLibras.querySelector('.overlay-close').addEventListener('click', closeLibras);
overlayLibras.addEventListener('click', e => { if (e.target === overlayLibras) closeLibras(); });

function openLibras(src) {
  videoLibras.src = src;
  overlayLibras.classList.remove('hidden');
  videoLibras.play();
}
function closeLibras() {
  videoLibras.pause();
  videoLibras.src = '';
  overlayLibras.classList.add('hidden');
}

// Áudio (Howler)
let currentSound = null;
const overlayAudio = document.getElementById('overlay-audio');
document.getElementById('btn-audio-close').addEventListener('click', stopAudio);

function playAudio(src) {
  stopAudio();
  currentSound = new Howl({
    src: [src],
    html5: true,
    onend: () => { overlayAudio.classList.add('hidden'); currentSound = null; },
    onerror: () => { overlayAudio.classList.add('hidden'); },
  });
  currentSound.play();
  overlayAudio.classList.remove('hidden');
}
function stopAudio() {
  if (currentSound) { currentSound.stop(); currentSound = null; }
  overlayAudio.classList.add('hidden');
}

function closeOverlays() {
  closeLibras();
  stopAudio();
}

// Responsividade
window.addEventListener('resize', () => {
  if (pageFlip) pageFlip.destroy();
  flipbook.innerHTML = '';
  initFlipbook();
});

initFlipbook();
