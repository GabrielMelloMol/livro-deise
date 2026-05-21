// js/flipbook.js
import { PAGES, SITE_URL, VERSION } from './config.js';
import './stars.js';

// ----- DOM refs -----
const flipbook          = document.getElementById('flipbook');
const flipbookContainer = document.getElementById('flipbook-container');
const btnPrev           = document.getElementById('btn-prev');
const btnNext           = document.getElementById('btn-next');
const pageIndicator     = document.getElementById('page-indicator');
const btnZoomIn         = document.getElementById('btn-zoom-in');
const btnZoomOut        = document.getElementById('btn-zoom-out');
const zoomIndicator     = document.getElementById('zoom-indicator');
const btnFullscreen     = document.getElementById('btn-fullscreen');

// ----- Versão -----
const versionEl = document.getElementById('app-version');
if (versionEl) versionEl.textContent = `v${VERSION}`;

// ----- Rebuild limpo (remove zoom-wrapper para não herdar estado do StPageFlip) -----
let resizeTimer;
function rebuildFlipbook() {
  try { if (pageFlip) pageFlip.destroy(); } catch (_) {}
  pageFlip = null;

  // Remove zoom-wrapper completamente para evitar estilos residuais do StPageFlip
  if (zoomWrapper) {
    if (flipbook.parentNode === zoomWrapper) flipbookContainer.appendChild(flipbook);
    zoomWrapper.remove();
    zoomWrapper = null;
  }

  flipbook.innerHTML = '';
  flipbook.removeAttribute('style'); // limpa estilos inline do StPageFlip anterior
  initFlipbook();
}

// ----- Tela cheia -----
if (btnFullscreen) {
  const applyFS = inFS => {
    document.documentElement.classList.toggle('is-fullscreen', inFS);
    btnFullscreen.setAttribute('aria-label', inFS ? 'Sair da tela cheia' : 'Tela cheia');
    btnFullscreen.title = inFS ? 'Sair da tela cheia' : 'Tela cheia';
  };

  btnFullscreen.addEventListener('click', () => {
    const inFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!inFS) {
      const el = document.documentElement;
      const fn = el.requestFullscreen || el.webkitRequestFullscreen;
      if (fn) fn.call(el).catch(() => { applyFS(true); rebuildFlipbook(); });
      else { applyFS(true); rebuildFlipbook(); }
    } else {
      const fn = document.exitFullscreen || document.webkitExitFullscreen;
      if (fn) fn.call(document).catch(() => { applyFS(false); rebuildFlipbook(); });
      else { applyFS(false); rebuildFlipbook(); }
    }
  });

  const onFSChange = () => {
    applyFS(!!(document.fullscreenElement || document.webkitFullscreenElement));
    // Rebuild com as dimensões corretas do novo viewport
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildFlipbook, 150);
  };
  document.addEventListener('fullscreenchange', onFSChange);
  document.addEventListener('webkitfullscreenchange', onFSChange);
}

// ----- Zoom — RENDER_SCALE renderiza o livro a 2× e escala para baixo -----
// Isso faz o zoom aproximar dos pixels nativos em vez de afastar deles,
// eliminando a perda de qualidade que existe no transform: scale() puro.
const RENDER_SCALE = 2;
let zoomLevel   = 1;     // 1 = visual 100% (scale CSS = 1/RENDER_SCALE)
const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 3;
const ZOOM_STEP = 0.25;
let zoomWrapper = null;
let zoomTransTimer = null;

function applyZoom() {
  // CSS scale = zoomLevel / RENDER_SCALE → a 100% o livro parece normal mas renderiza a 2×
  if (zoomWrapper) zoomWrapper.style.transform = `scale(${zoomLevel / RENDER_SCALE})`;
  zoomIndicator.textContent = `${Math.round(zoomLevel * 100)}%`;
}

function setZoom(delta, smooth = false) {
  zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel + delta));
  if (zoomWrapper) {
    zoomWrapper.style.transition = smooth ? 'transform 0.12s ease' : 'none';
    if (smooth) {
      clearTimeout(zoomTransTimer);
      zoomTransTimer = setTimeout(() => {
        if (zoomWrapper) zoomWrapper.style.transition = 'none';
      }, 200);
    }
  }
  applyZoom();
}

function resetZoom() {
  if (zoomWrapper) zoomWrapper.style.transition = 'transform 0.2s ease';
  zoomLevel = 1;
  applyZoom();
  setTimeout(() => { if (zoomWrapper) zoomWrapper.style.transition = 'none'; }, 300);
}

btnZoomIn.addEventListener('click',  () => setZoom(+ZOOM_STEP, true));
btnZoomOut.addEventListener('click', () => setZoom(-ZOOM_STEP, true));

flipbookContainer.addEventListener('wheel', e => {
  e.preventDefault();
  setZoom(e.deltaY < 0 ? +ZOOM_STEP : -ZOOM_STEP, false); // instantâneo
}, { passive: false });

flipbookContainer.addEventListener('dblclick', resetZoom);

// Clique simples: metade esquerda = voltar, metade direita = avançar
flipbookContainer.addEventListener('click', e => {
  if (e.target.closest('.page-icon')) return;
  if (!pageFlip) return;
  const rect = flipbookContainer.getBoundingClientRect();
  if (e.clientX - rect.left < rect.width / 2) {
    playPageTurn(); pageFlip.flipPrev();
  } else {
    playPageTurn(); pageFlip.flipNext();
  }
});

// ----- Touch: pinch (zoom) + swipe (virar página) — num único handler -----
const touch = { startX: null, startY: null, pinchDist: null };

flipbookContainer.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    touch.pinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    touch.startX = null; // cancela tracking de swipe
  } else if (e.touches.length === 1) {
    touch.startX   = e.touches[0].clientX;
    touch.startY   = e.touches[0].clientY;
    touch.pinchDist = null;
  }
}, { passive: true });

flipbookContainer.addEventListener('touchmove', e => {
  if (e.touches.length === 2 && touch.pinchDist !== null) {
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    setZoom((dist - touch.pinchDist) / 180, false);
    touch.pinchDist = dist;
  }
}, { passive: false });

flipbookContainer.addEventListener('touchend', e => {
  if (e.touches.length === 0) {
    // todos os dedos levantados
    if (touch.startX !== null && touch.pinchDist === null) {
      const dx = e.changedTouches[0].clientX - touch.startX;
      const dy = e.changedTouches[0].clientY - touch.startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) { playPageTurn(); pageFlip.flipNext(); }
        else         { playPageTurn(); pageFlip.flipPrev(); }
      }
    }
    touch.startX = touch.startY = touch.pinchDist = null;
  } else if (e.touches.length === 1) {
    // saiu do pinch — não vira página
    touch.pinchDist = null;
    touch.startX    = null;
  }
}, { passive: true });

// ----- Dimensões responsivas (multiplicadas por RENDER_SCALE) -----
function getBookSize() {
  const portrait = window.innerWidth < 700;
  if (portrait) {
    // Modo retrato: uma página por vez, ocupa toda a tela
    const maxH = window.innerHeight - 54;  // controles compactos
    const maxW = window.innerWidth;
    return { width: maxW * RENDER_SCALE * 2, height: maxH * RENDER_SCALE };
  }
  const maxH = window.innerHeight - 130;
  const maxW = window.innerWidth - 40;
  const pageH = Math.min(maxH, 600)  * RENDER_SCALE;
  const pageW = Math.min(maxW / 2, 420) * RENDER_SCALE;
  return { width: pageW * 2, height: pageH };
}

// ----- Botões de página: bloqueiam eventos antes que o StPageFlip os registre -----
function blockFlip(btn) {
  ['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
    btn.addEventListener(evt, e => e.stopPropagation(), { passive: false });
  });
}

// ----- Construir páginas -----
function buildPages() {
  PAGES.forEach(p => {
    const div = document.createElement('div');
    div.className = 'page';
    div.dataset.pageId = p.id;

    const img = document.createElement('img');
    img.src     = p.image;
    img.alt     = `Página ${p.id} do livro`;
    img.loading = p.id <= 4 ? 'eager' : 'lazy';
    div.appendChild(img);

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

// ----- localStorage: última página visitada -----
const LS_KEY = 'livro-deise-page';
function savePage(idx) {
  try { localStorage.setItem(LS_KEY, idx); } catch (_) {}
}
function loadSavedPage() {
  try { return Math.max(0, parseInt(localStorage.getItem(LS_KEY), 10) || 0); } catch (_) { return 0; }
}

// ----- StPageFlip -----
let pageFlip;

function initFlipbook() {
  const { width, height } = getBookSize();
  buildPages();

  if (!zoomWrapper) {
    zoomWrapper = document.createElement('div');
    zoomWrapper.id = 'zoom-wrapper';
    zoomWrapper.style.transition = 'none';
    flipbookContainer.appendChild(zoomWrapper);
    zoomWrapper.appendChild(flipbook);
  }
  applyZoom();

  pageFlip = new St.PageFlip(flipbook, {
    width:    width / 2,
    height,
    size:     'fixed',
    minWidth: 150,  maxWidth: 1400,
    minHeight: 200, maxHeight: 2000,
    showCover:           true,
    mobileScrollSupport: false,
    swipeDistance:       9999,
    drawShadow:          false,
    showPageCorners:     false,
    usePortrait:    window.innerWidth < 700,
  });

  initPageTurnSound();
  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  const savedPage = loadSavedPage();
  if (savedPage > 0) requestAnimationFrame(() => pageFlip.turnToPage(savedPage));

  pageFlip.on('flip', e => {
    const idx = e.data;
    pageIndicator.textContent = `${idx + 1} / ${PAGES.length}`;
    savePage(idx);
    closeOverlays();
  });

  pageIndicator.textContent = `${savedPage + 1} / ${PAGES.length}`;

  hideLoading();
}

// ----- Som de virada de página -----
// Coloque assets/sounds/page-turn.mp3 para som real. Enquanto isso: síntese.
let audioCtx     = null;
let pageTurnSnd  = null;

function initPageTurnSound() {
  if (pageTurnSnd) return;
  pageTurnSnd = new Howl({
    src: ['assets/sounds/page-turn.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => { pageTurnSnd = null; },
  });
}

function playPageTurn() {
  try {
    if (pageTurnSnd && pageTurnSnd.state() === 'loaded') { pageTurnSnd.play(); return; }
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const sr  = audioCtx.sampleRate;

    // Rustle: highpass noise, ataque rápido, decaimento exponencial
    const b1 = audioCtx.createBuffer(1, sr * 0.32, sr);
    const d1  = b1.getChannelData(0);
    for (let i = 0; i < d1.length; i++) {
      const t = i / sr;
      d1[i] = (Math.random() * 2 - 1) * (t < 0.025 ? t / 0.025 : Math.exp(-(t - 0.025) * 14));
    }
    const s1 = audioCtx.createBufferSource(); s1.buffer = b1;
    const hpf = audioCtx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 2800;
    const g1 = audioCtx.createGain(); g1.gain.value = 0.13;
    s1.connect(hpf).connect(g1).connect(audioCtx.destination); s1.start(now);

    // Thump: lowpass no final (página pousando)
    const b2 = audioCtx.createBuffer(1, sr * 0.08, sr);
    const d2  = b2.getChannelData(0);
    for (let i = 0; i < d2.length; i++) {
      d2[i] = (Math.random() * 2 - 1) * Math.exp(-(i / sr) * 60);
    }
    const s2 = audioCtx.createBufferSource(); s2.buffer = b2;
    const lpf = audioCtx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 400;
    const g2 = audioCtx.createGain(); g2.gain.value = 0.10;
    s2.connect(lpf).connect(g2).connect(audioCtx.destination); s2.start(now + 0.22);
  } catch (_) {}
}

// ----- Controles -----
btnPrev.addEventListener('click', () => { playPageTurn(); pageFlip.flipPrev(); });
btnNext.addEventListener('click', () => { playPageTurn(); pageFlip.flipNext(); });

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { playPageTurn(); pageFlip.flipPrev(); }
  if (e.key === 'ArrowRight') { playPageTurn(); pageFlip.flipNext(); }
  if (e.key === 'Escape')     closeOverlays();
});

// ----- Overlay Libras -----
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
  videoLibras.pause(); videoLibras.src = '';
  overlayLibras.classList.add('hidden');
}

// ----- Overlay Áudio -----
let currentSound = null;
const overlayAudio = document.getElementById('overlay-audio');
document.getElementById('btn-audio-close').addEventListener('click', stopAudio);

function playAudio(src) {
  stopAudio();
  currentSound = new Howl({
    src: [src], html5: true,
    onend:   () => { overlayAudio.classList.add('hidden'); currentSound = null; },
    onerror: () => {  overlayAudio.classList.add('hidden'); },
  });
  currentSound.play();
  overlayAudio.classList.remove('hidden');
}
function stopAudio() {
  if (currentSound) { currentSound.stop(); currentSound = null; }
  overlayAudio.classList.add('hidden');
}
function closeOverlays() { closeLibras(); stopAudio(); }

// ----- Loading screen -----
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  const app     = document.getElementById('app');
  if (!overlay) return;
  setTimeout(() => {
    overlay.classList.add('done');
    if (app) app.classList.add('ready');
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 800);
  }, 500);
}

// ----- Responsividade (debounced) — fullscreen já tratado no onFSChange -----
window.addEventListener('resize', () => {
  if (document.fullscreenElement || document.webkitFullscreenElement) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(rebuildFlipbook, 250);
});

initFlipbook();
