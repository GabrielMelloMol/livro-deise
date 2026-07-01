// js/flipbook.js
import { COVER, PAGES, BACK_COVER, PAGE_TEXTS, PAGE_ALT, VERSION } from './config.js?v=1.0.27';
import { initAccess } from './access.js?v=1.0.27';
import './stars.js?v=1.0.27';

// ----- DOM refs -----
const flipbook          = document.getElementById('flipbook');
const flipbookContainer = document.getElementById('flipbook-container');
const btnPrev           = document.getElementById('btn-prev');
const btnNext           = document.getElementById('btn-next');
const pageIndicator     = document.getElementById('page-indicator');
const srStatus          = document.getElementById('sr-status');
const btnZoomIn         = document.getElementById('btn-zoom-in');
const btnZoomOut        = document.getElementById('btn-zoom-out');
const zoomIndicator     = document.getElementById('zoom-indicator');
const btnFullscreen     = document.getElementById('btn-fullscreen');

// ----- Versão -----
const versionEl = document.getElementById('app-version');
if (versionEl) versionEl.textContent = `v${VERSION}`;

// ----- Folhas do livro: capa + 38 páginas + contracapa -----
const leaves = [
  { image: COVER.image, label: COVER.label, alt: COVER.alt },
  ...PAGES.map(p => ({
    image: p.image,
    label: String(p.id),
    alt: PAGE_TEXTS[p.id] ? `Página ${p.id}. ${PAGE_TEXTS[p.id]}`
       : PAGE_ALT[p.id]   ? `Página ${p.id}. ${PAGE_ALT[p.id]}`
       : `Página ${p.id} do livro. Ilustração.`,
  })),
  { image: BACK_COVER.image, label: BACK_COVER.label, alt: BACK_COVER.alt },
];

function leafTitle(i) {
  const l = leaves[i].label;
  return (l === 'Capa' || l === 'Contracapa') ? l : `Página ${l}`;
}

// ----- Rebuild limpo (remove zoom-wrapper para não herdar estado do StPageFlip) -----
let resizeTimer;
function rebuildFlipbook() {
  try { if (pageFlip) pageFlip.destroy(); } catch (_) {}
  pageFlip = null;
  if (zoomWrapper) {
    if (flipbook.parentNode === zoomWrapper) flipbookContainer.appendChild(flipbook);
    zoomWrapper.remove();
    zoomWrapper = null;
  }
  flipbook.innerHTML = '';
  flipbook.removeAttribute('style');
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
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildFlipbook, 150);
  };
  document.addEventListener('fullscreenchange', onFSChange);
  document.addEventListener('webkitfullscreenchange', onFSChange);
}

// ----- Zoom & Pan — o zoom segue o cursor; arraste para deslocar quando ampliado -----
// RENDER_SCALE renderiza o livro a 2× e exibe a 1/2, aproximando dos pixels nativos.
const RENDER_SCALE = 2;
const BASE_SCALE   = 1 / RENDER_SCALE;
let   zoomLevel    = 1;
const ZOOM_MIN     = 1;
const ZOOM_MAX     = 4;
const ZOOM_STEP    = 0.25;
let   zoomWrapper  = null;
let   zoomTransTimer = null;
let   panX = 0, panY = 0;
let   bookW = 0, bookH = 0;

const effScale = () => zoomLevel * BASE_SCALE;
const isZoomed = () => zoomLevel > 1.001;

function refreshBookSize() {
  bookW = flipbook.offsetWidth;
  bookH = flipbook.offsetHeight;
}

function clampPan() {
  if (!bookW || !bookH) return;
  const cont = flipbookContainer.getBoundingClientRect();
  const w = bookW * effScale();
  const h = bookH * effScale();
  panX = w <= cont.width  ? (cont.width  - w) / 2 : Math.min(0, Math.max(cont.width  - w, panX));
  panY = h <= cont.height ? (cont.height - h) / 2 : Math.min(0, Math.max(cont.height - h, panY));
}

function applyZoom() {
  if (!zoomWrapper) return;
  clampPan();
  zoomWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${effScale()})`;
  zoomIndicator.textContent = `${Math.round(zoomLevel * 100)}%`;
  flipbookContainer.style.cursor = isZoomed() ? 'grab' : 'pointer';
}

function setSmooth(on) {
  if (!zoomWrapper) return;
  zoomWrapper.style.transition = on ? 'transform 0.15s ease' : 'none';
  if (on) {
    clearTimeout(zoomTransTimer);
    zoomTransTimer = setTimeout(() => { if (zoomWrapper) zoomWrapper.style.transition = 'none'; }, 220);
  }
}

function zoomToPoint(newLevel, clientX, clientY, smooth = false) {
  newLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, newLevel));
  if (Math.abs(newLevel - zoomLevel) < 0.0001) return;
  const cont  = flipbookContainer.getBoundingClientRect();
  const mx    = clientX - cont.left;
  const my    = clientY - cont.top;
  const ratio = (newLevel * BASE_SCALE) / effScale();
  panX = mx - (mx - panX) * ratio;
  panY = my - (my - panY) * ratio;
  zoomLevel = newLevel;
  setSmooth(smooth);
  applyZoom();
}

function zoomByCenter(delta) {
  const c = flipbookContainer.getBoundingClientRect();
  zoomToPoint(zoomLevel + delta, c.left + c.width / 2, c.top + c.height / 2, true);
}
function resetZoom() {
  const c = flipbookContainer.getBoundingClientRect();
  zoomToPoint(1, c.left + c.width / 2, c.top + c.height / 2, true);
}

btnZoomIn.addEventListener('click',  () => zoomByCenter(+ZOOM_STEP));
btnZoomOut.addEventListener('click', () => zoomByCenter(-ZOOM_STEP));

flipbookContainer.addEventListener('wheel', e => {
  e.preventDefault();
  zoomToPoint(zoomLevel + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP), e.clientX, e.clientY, false);
}, { passive: false });

// ----- Arraste com o mouse para deslocar (só quando ampliado) -----
let drag = null;
flipbookContainer.addEventListener('mousedown', e => {
  if (!isZoomed()) return;
  drag = { x: e.clientX, y: e.clientY, moved: false };
  flipbookContainer.style.cursor = 'grabbing';
  e.preventDefault();
});
document.addEventListener('mousemove', e => {
  if (!drag) return;
  panX += e.clientX - drag.x;
  panY += e.clientY - drag.y;
  drag.x = e.clientX; drag.y = e.clientY;
  drag.moved = true;
  applyZoom();
});
document.addEventListener('mouseup', () => {
  if (drag) flipbookContainer.style.cursor = isZoomed() ? 'grab' : 'pointer';
  drag = null;
});

// ----- Clique simples: vira página (esq=voltar, dir=avançar). Com zoom, vira e volta ao 100%.
//       Arrastar (pan) não vira — o guard drag.moved cuida disso. -----
flipbookContainer.addEventListener('click', e => {
  if (!pageFlip) return;
  if (drag && drag.moved) return;
  const rect = flipbookContainer.getBoundingClientRect();
  if (e.clientX - rect.left < rect.width / 2) flipPrev();
  else                                        flipNext();
});

// ----- Touch: pinch (zoom no ponto médio) · 1 dedo arrasta com zoom / vira sem zoom -----
const touch = { startX: null, startY: null, lastX: null, lastY: null, pinchDist: null, panning: false };

flipbookContainer.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    touch.pinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    touch.startX = null;
  } else if (e.touches.length === 1) {
    touch.startX = touch.lastX = e.touches[0].clientX;
    touch.startY = touch.lastY = e.touches[0].clientY;
    touch.pinchDist = null;
    touch.panning   = isZoomed();
  }
}, { passive: true });

flipbookContainer.addEventListener('touchmove', e => {
  if (e.touches.length === 2 && touch.pinchDist !== null) {
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    zoomToPoint(zoomLevel + (dist - touch.pinchDist) / 180, midX, midY, false);
    touch.pinchDist = dist;
  } else if (e.touches.length === 1 && touch.panning) {
    e.preventDefault();
    panX += e.touches[0].clientX - touch.lastX;
    panY += e.touches[0].clientY - touch.lastY;
    touch.lastX = e.touches[0].clientX;
    touch.lastY = e.touches[0].clientY;
    applyZoom();
  }
}, { passive: false });

flipbookContainer.addEventListener('touchend', e => {
  if (e.touches.length === 0) {
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    const rect = flipbookContainer.getBoundingClientRect();
    if (touch.panning) {
      // toque curto com zoom → vira a página (e volta ao 100%)
      if (touch.startX !== null && Math.hypot(ex - touch.startX, ey - touch.startY) < 10) {
        (ex - rect.left < rect.width / 2) ? flipPrev() : flipNext();
      }
    } else if (touch.startX !== null && touch.pinchDist === null) {
      // swipe normal (sem zoom)
      const dx = ex - touch.startX, dy = ey - touch.startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        (dx < 0) ? flipNext() : flipPrev();
      }
    }
    touch.startX = touch.startY = touch.pinchDist = null;
    touch.panning = false;
  } else if (e.touches.length === 1) {
    touch.pinchDist = null;
    touch.startX = touch.lastX = e.touches[0].clientX;
    touch.startY = touch.lastY = e.touches[0].clientY;
    touch.panning = isZoomed();
  }
}, { passive: true });

// ----- Dimensões responsivas (multiplicadas por RENDER_SCALE) -----
function getBookSize() {
  const portrait = window.innerWidth < 700;
  if (portrait) {
    // Reserva a altura REAL do cabeçalho + barra de botões (antes era fixo 54px,
    // que no Android deixava os botões saindo da tela).
    const header   = document.getElementById('book-title');
    const controls = document.getElementById('controls');
    const chrome = (header ? header.offsetHeight : 54)
                 + (controls ? controls.offsetHeight : 56) + 6;
    const maxH = Math.max(240, window.innerHeight - chrome);
    const maxW = window.innerWidth;
    return { width: maxW * RENDER_SCALE * 2, height: maxH * RENDER_SCALE };
  }
  const maxH = window.innerHeight - 130;
  const maxW = window.innerWidth - 40;
  const pageH = Math.min(maxH, 600)  * RENDER_SCALE;
  const pageW = Math.min(maxW / 2, 420) * RENDER_SCALE;
  return { width: pageW * 2, height: pageH };
}

// ----- Construir páginas -----
function buildPages() {
  leaves.forEach((leaf, i) => {
    const div = document.createElement('div');
    div.className = 'page';
    div.dataset.leaf = i;
    const img = document.createElement('img');
    img.src       = `${leaf.image}?v=${VERSION}`;   // versão na URL evita cache de imagem trocada
    img.alt       = leaf.alt;
    img.loading   = i <= 3 ? 'eager' : 'lazy';
    img.draggable = false;
    div.appendChild(img);
    flipbook.appendChild(div);
  });
}

// ----- StPageFlip -----
let pageFlip;

function updateIndicator(i) {
  pageIndicator.textContent = leafTitle(i);
  if (srStatus) srStatus.textContent = leafTitle(i);
}

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
  zoomLevel = 1; panX = 0; panY = 0;
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
  requestAnimationFrame(() => { refreshBookSize(); applyZoom(); });

  pageFlip.on('flip', e => {
    updateIndicator(e.data);
    if (window.__deiseCloseAccessOverlays) window.__deiseCloseAccessOverlays();
  });

  updateIndicator(0);
  // hideLoading() agora é chamado após o preload das páginas (ver final do arquivo)

  // Deep-link: ?page=N — abre direto numa página (ex: livrodeise.com.br?page=5)
  const deepPage = parseInt(new URLSearchParams(location.search).get('page'), 10);
  if (!isNaN(deepPage) && deepPage >= 1 && deepPage < leaves.length) {
    setTimeout(() => { pageFlip.flip(deepPage); updateIndicator(deepPage); }, 700);
  }
}

// ----- Som de virada de página -----
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

    const b1 = audioCtx.createBuffer(1, sr * 0.32, sr);
    const d1 = b1.getChannelData(0);
    for (let i = 0; i < d1.length; i++) {
      const t = i / sr;
      d1[i] = (Math.random() * 2 - 1) * (t < 0.025 ? t / 0.025 : Math.exp(-(t - 0.025) * 14));
    }
    const s1 = audioCtx.createBufferSource(); s1.buffer = b1;
    const hpf = audioCtx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 2800;
    const g1 = audioCtx.createGain(); g1.gain.value = 0.13;
    s1.connect(hpf).connect(g1).connect(audioCtx.destination); s1.start(now);

    const b2 = audioCtx.createBuffer(1, sr * 0.08, sr);
    const d2 = b2.getChannelData(0);
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
// Vira a página sempre voltando ao 100% — assim a navegação nunca fica "presa" no zoom.
function resetZoomInstant() {
  if (!isZoomed()) return;
  zoomLevel = 1; panX = 0; panY = 0;
  setSmooth(true);
  applyZoom();
}
function flipPrev() { resetZoomInstant(); playPageTurn(); pageFlip.flipPrev(); }
function flipNext() { resetZoomInstant(); playPageTurn(); pageFlip.flipNext(); }

btnPrev.addEventListener('click', flipPrev);
btnNext.addEventListener('click', flipNext);

document.addEventListener('keydown', e => {
  // não interferir quando um diálogo está aberto (eles tratam o próprio teclado)
  if (document.querySelector('.access-panel:not(.hidden), .overlay:not(.hidden)')) return;
  if (e.key === 'ArrowLeft')  flipPrev();
  if (e.key === 'ArrowRight') flipNext();
});

// ----- Loading screen: baixa TODAS as páginas antes de revelar o livro -----
// (experiência fluida: nenhuma página aparece "carregando" ao virar a folha)
const _loadFill = document.getElementById('loading-fill');

// A barra enche conforme as páginas baixam, mas SEM mostrar contagem/técnico —
// a mensagem fica mágica ("Preparando a magia…", definida no HTML). O download
// acontece por baixo dos panos.
function setLoadProgress(loaded, total) {
  const pct = Math.min(100, Math.round((loaded / total) * 100));
  if (_loadFill) _loadFill.style.width = pct + '%';
}

// Carrega todas as imagens do livro; resolve quando terminam (ou após 20s de segurança).
function preloadPages() {
  const urls  = leaves.map(l => `${l.image}?v=${VERSION}`);
  const total = urls.length;
  let loaded = 0, settled = false;
  setLoadProgress(0, total);
  return new Promise(resolve => {
    const finish = () => { if (!settled) { settled = true; resolve(); } };
    const safety = setTimeout(finish, 20000); // nunca trava o usuário
    const tick = () => {
      loaded++;
      setLoadProgress(loaded, total);
      if (loaded >= total) { clearTimeout(safety); finish(); }
    };
    urls.forEach(src => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick; // conta mesmo se uma falhar, pra não travar
      img.src = src;
    });
  });
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  const app     = document.getElementById('app');
  if (!overlay) return;
  if (_loadFill) _loadFill.style.width = '100%';
  setTimeout(() => {
    overlay.classList.add('done');
    if (app) app.classList.add('ready');
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 950);
  }, 300);
}

// ----- Responsividade (debounced) -----
window.addEventListener('resize', () => {
  if (document.fullscreenElement || document.webkitFullscreenElement) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(rebuildFlipbook, 250);
});

// Pré-carrega os vídeos (Libras / linguagem simples) em segundo plano, DEPOIS que o
// livro já abriu — assim quando a pessoa abre o modo, o vídeo já está em cache e não trava.
function preloadVideos() {
  // URLs idênticas às que o player usa (js/access.js → mode.src, sem query),
  // pra o browser reaproveitar o cache e não baixar duas vezes.
  ['assets/video/libras.mp4', 'assets/video/linguagem-simples.mp4'].forEach(src => {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.src = src;
    v.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none';
    v.load();
    document.body.appendChild(v);
  });
}

// ----- Inicialização -----
initAccess();
initFlipbook();
// Só revela o livro depois que todas as páginas foram baixadas → zero pop-in ao virar.
preloadPages().then(() => {
  hideLoading();
  // vídeos baixam em segundo plano, sem segurar a entrada
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
  idle(preloadVideos);
});
