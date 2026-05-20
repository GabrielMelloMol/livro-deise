// js/flipbook.js
import { PAGES, SITE_URL } from './config.js';
import './stars.js';

const flipbook        = document.getElementById('flipbook');
const flipbookContainer = document.getElementById('flipbook-container');
const btnPrev         = document.getElementById('btn-prev');
const btnNext         = document.getElementById('btn-next');
const pageIndicator   = document.getElementById('page-indicator');
const btnZoomIn       = document.getElementById('btn-zoom-in');
const btnZoomOut      = document.getElementById('btn-zoom-out');
const zoomIndicator   = document.getElementById('zoom-indicator');

// --- Zoom ---
let zoomLevel = 1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

// Wrapper aplicado no container para não interferir no StPageFlip
let zoomWrapper = null;

function applyZoom() {
  if (zoomWrapper) zoomWrapper.style.transform = `scale(${zoomLevel})`;
  zoomIndicator.textContent = `${Math.round(zoomLevel * 100)}%`;
}

function setZoom(delta) {
  zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel + delta));
  applyZoom();
}

function resetZoom() { zoomLevel = 1; applyZoom(); }

btnZoomIn.addEventListener('click',  () => setZoom(+ZOOM_STEP));
btnZoomOut.addEventListener('click', () => setZoom(-ZOOM_STEP));

// Scroll → zoom
flipbookContainer.addEventListener('wheel', e => {
  if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 0) {
    e.preventDefault();
    setZoom(e.deltaY < 0 ? +ZOOM_STEP : -ZOOM_STEP);
  }
}, { passive: false });

// Pinch to zoom (mobile)
let lastPinchDist = null;
flipbookContainer.addEventListener('touchstart', e => {
  if (e.touches.length === 2) lastPinchDist = Math.hypot(
    e.touches[0].clientX - e.touches[1].clientX,
    e.touches[0].clientY - e.touches[1].clientY
  );
}, { passive: true });
flipbookContainer.addEventListener('touchmove', e => {
  if (e.touches.length === 2 && lastPinchDist) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const delta = (dist - lastPinchDist) / 200;
    setZoom(delta);
    lastPinchDist = dist;
  }
}, { passive: true });
flipbookContainer.addEventListener('touchend', () => { lastPinchDist = null; }, { passive: true });

// Duplo clique → reset zoom
flipbookContainer.addEventListener('dblclick', resetZoom);

// Dimensões responsivas
function getBookSize() {
  const maxH = window.innerHeight - 120;
  const maxW = window.innerWidth - 40;
  const pageH = Math.min(maxH, 600);
  const pageW = Math.min(maxW / 2, 420);
  return { width: pageW * 2, height: pageH };
}

// Para cada botão: bloqueia propagação em todos os eventos de ponteiro
// para evitar que o StPageFlip inicie a animação de virar página ao clicar nos ícones
function blockFlip(btn) {
  ['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
    btn.addEventListener(evt, e => e.stopPropagation(), { passive: false });
  });
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
      blockFlip(btn);
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
      blockFlip(btn);
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
      blockFlip(btn);
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

  // Criar wrapper de zoom ao redor do flipbook
  if (!zoomWrapper) {
    zoomWrapper = document.createElement('div');
    zoomWrapper.id = 'zoom-wrapper';
    flipbookContainer.appendChild(zoomWrapper);
    zoomWrapper.appendChild(flipbook);
  }
  applyZoom();

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
    swipeDistance: 80,       // era 30 — reduzia falsos positivos de clique
    startUserInteraction: 30, // pixels mínimos para iniciar fold visual
    usePortrait: window.innerWidth < 700,
  });

  initPageTurnSound();

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  pageFlip.on('flip', e => {
    pageIndicator.textContent = `${e.data + 1} / ${PAGES.length}`;
    closeOverlays();
  });

  // Som dispara no evento changeState (início do fold visual), não no flip (fim)
  pageFlip.on('changeState', ({ data }) => {
    if (data === 'flipping') playPageTurn();
  });

  pageIndicator.textContent = `1 / ${PAGES.length}`;
}

// --- Som de virada de página ---
// Para som realista coloque um arquivo em assets/sounds/page-turn.mp3
// O código usa Howler se o arquivo existir, Web Audio como fallback.
let audioCtx = null;
let pageTurnSound = null;

function initPageTurnSound() {
  if (pageTurnSound) return;
  const src = 'assets/sounds/page-turn.mp3';
  pageTurnSound = new Howl({
    src: [src],
    volume: 0.25,
    preload: true,
    onloaderror: () => { pageTurnSound = null; }, // fallback para síntese
  });
}

function playPageTurn() {
  try {
    if (pageTurnSound && pageTurnSound.state() === 'loaded') {
      pageTurnSound.play();
      return;
    }
    // Fallback: síntese em camadas (rustle + thump)
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;

    // Camada 1: rustle (papel deslizando)
    const sr  = audioCtx.sampleRate;
    const buf1 = audioCtx.createBuffer(1, sr * 0.32, sr);
    const d1   = buf1.getChannelData(0);
    for (let i = 0; i < d1.length; i++) {
      const t = i / sr;
      // Sino assimétrico: ataque em 25ms, decaimento exponencial
      const env = t < 0.025 ? t / 0.025 : Math.exp(-(t - 0.025) * 14);
      d1[i] = (Math.random() * 2 - 1) * env;
    }
    const s1 = audioCtx.createBufferSource();
    s1.buffer = buf1;
    const hpf = audioCtx.createBiquadFilter();
    hpf.type = 'highpass'; hpf.frequency.value = 2800;
    const g1 = audioCtx.createGain(); g1.gain.value = 0.13;
    s1.connect(hpf).connect(g1).connect(audioCtx.destination);
    s1.start(now);

    // Camada 2: thump suave (página pousando)
    const buf2 = audioCtx.createBuffer(1, sr * 0.08, sr);
    const d2   = buf2.getChannelData(0);
    for (let i = 0; i < d2.length; i++) {
      const t = i / sr;
      d2[i] = (Math.random() * 2 - 1) * Math.exp(-t * 60);
    }
    const s2 = audioCtx.createBufferSource();
    s2.buffer = buf2;
    const lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass'; lpf.frequency.value = 400;
    const g2 = audioCtx.createGain(); g2.gain.value = 0.10;
    s2.connect(lpf).connect(g2).connect(audioCtx.destination);
    s2.start(now + 0.22); // thump no final do rustle
  } catch (_) { /* silencia se o navegador bloquear */ }
}

// Controles
btnPrev.addEventListener('click', () => { playPageTurn(); pageFlip.flipPrev(); });
btnNext.addEventListener('click', () => { playPageTurn(); pageFlip.flipNext(); });

// Teclado
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { playPageTurn(); pageFlip.flipPrev(); }
  if (e.key === 'ArrowRight') { playPageTurn(); pageFlip.flipNext(); }
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

// Responsividade (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (pageFlip) pageFlip.destroy();
    flipbook.innerHTML = '';
    initFlipbook();
  }, 200);
});

initFlipbook();
