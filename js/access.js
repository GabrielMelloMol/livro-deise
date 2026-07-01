// js/access.js
// Menu de acessibilidade: audiolivro, audiodescrição, Libras, linguagem simples e CAA.
// Foco em uso por teclado e leitor de tela (foco preso no diálogo, Escape fecha, foco volta).
import { ACCESS_MODES, PURCHASE_URL, BRAILLE_URL, INSTAGRAM_URL, MEDIATION_GUIDE_URL, CAA_PAGES, SIMPLE_TEXT } from './config.js?v=1.0.27';

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
let lastFocused = null;

function visibleFocusables(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
}

function trapFocus(e, container) {
  const items = visibleFocusables(container);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function initAccess() {
  const trigger       = document.getElementById('btn-access');
  const panel         = document.getElementById('access-panel');
  const list          = document.getElementById('access-list');
  const purchase      = document.getElementById('access-purchase');
  const overlayVideo  = document.getElementById('overlay-video');
  const videoFrame    = document.getElementById('video-frame');
  const videoTitle    = document.getElementById('video-title');
  const overlaySimple = document.getElementById('overlay-simple');
  const simpleBody    = document.getElementById('simple-body');
  const btnRead       = document.getElementById('btn-simple-read');
  const overlayAr     = document.getElementById('overlay-arvideo');
  const arVideo       = document.getElementById('ar-video');
  const arTitle       = document.getElementById('arvideo-title');
  const arYt          = document.getElementById('arvideo-yt');
  const overlayAudio  = document.getElementById('overlay-audioplayer');
  const audioPlayer   = document.getElementById('audio-player');
  const audioTitle    = document.getElementById('audioplayer-title');
  const audioDesc     = document.getElementById('audioplayer-desc');
  const audioYt       = document.getElementById('audioplayer-yt');
  const audioQrWrap   = document.getElementById('audioplayer-qr-wrap');
  const audioQrImg    = document.getElementById('audioplayer-qr-img');
  const arVideoQrWrap = document.getElementById('arvideo-qr-wrap');
  const arVideoQrImg  = document.getElementById('arvideo-qr-img');
  const videoQrWrap   = document.getElementById('video-qr-wrap');
  const videoQrImg    = document.getElementById('video-qr-img');
  const overlayCaa    = document.getElementById('overlay-caa');
  const caaFrame      = document.getElementById('caa-frame');
  const caaExternalBtn = document.getElementById('caa-external-btn');
  const overlayQr     = document.getElementById('overlay-qr');
  const qrLightboxImg = document.getElementById('qr-lightbox-img');
  const qrLightboxLabel = document.getElementById('qr-lightbox-label');
  if (!trigger || !panel) return;

  // ---- lightbox QR: clique em qualquer imagem QR dos overlays ----
  function openQrLightbox(src, label) {
    if (!overlayQr || !qrLightboxImg) return;
    qrLightboxImg.src = src;
    qrLightboxImg.alt = label || 'QR code';
    if (qrLightboxLabel) qrLightboxLabel.textContent = label || '';
    overlayQr.classList.remove('hidden');
    overlayQr.querySelector('.overlay-close').focus();
  }
  [audioQrImg, arVideoQrImg, videoQrImg].filter(Boolean).forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => { if (img.src) openQrLightbox(img.src, img.dataset.label); });
  });
  if (overlayQr) {
    overlayQr.querySelector('.overlay-close').addEventListener('click', () => overlayQr.classList.add('hidden'));
    overlayQr.addEventListener('click', e => { if (e.target === overlayQr) overlayQr.classList.add('hidden'); });
    overlayQr.addEventListener('keydown', e => { if (e.key === 'Escape') overlayQr.classList.add('hidden'); });
  }

  // ---- monta os itens do menu a partir do config ----
  ACCESS_MODES.forEach(mode => {
    const li  = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'access-item';
    btn.innerHTML =
      `<span class="ai-icon" aria-hidden="true">${mode.icon}</span>` +
      `<span class="ai-text"><span class="ai-label">${mode.label}</span>` +
      `<span class="ai-desc">${mode.desc}</span></span>`;
    btn.addEventListener('click', () => { closePanel(); openMode(mode); });
    li.appendChild(btn);
    list.appendChild(li);
  });
  if (purchase) purchase.href = PURCHASE_URL;
  const braille = document.getElementById('access-braille');
  if (braille) braille.href = BRAILLE_URL;
  const instagram = document.getElementById('access-instagram');
  if (instagram) instagram.href = INSTAGRAM_URL;
  const mediation = document.getElementById('access-mediation');
  if (mediation && MEDIATION_GUIDE_URL) { mediation.href = MEDIATION_GUIDE_URL; mediation.classList.remove('hidden'); }

  // ---- leitor de texto simples (conteúdo) ----
  if (simpleBody) {
    const sub = document.createElement('p');
    sub.className = 'simple-sub';
    sub.textContent = SIMPLE_TEXT.subtitle;
    simpleBody.appendChild(sub);
    SIMPLE_TEXT.paragraphs.forEach(t => {
      const p = document.createElement('p');
      p.textContent = t;
      simpleBody.appendChild(p);
    });
  }

  // ================= painel =================
  function openPanel() {
    lastFocused = document.activeElement;
    panel.classList.remove('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onPanelKey);
    const first = visibleFocusables(panel)[0];
    if (first) first.focus();
  }
  function closePanel() {
    panel.classList.add('hidden');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onPanelKey);
    if (lastFocused) lastFocused.focus();
  }
  function onPanelKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closePanel(); }
    else if (e.key === 'Tab') trapFocus(e, panel);
  }
  trigger.addEventListener('click', () => {
    panel.classList.contains('hidden') ? openPanel() : closePanel();
  });
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
  panel.querySelector('.overlay-close').addEventListener('click', closePanel);

  // ================= abrir um modo =================
  function openMode(mode) {
    if (mode.type === 'audio') openAudio(mode);
    else if (mode.type === 'localvideo') openLocalVideo(mode);
    else if (mode.type === 'youtube') openVideo(mode);
    else if (mode.type === 'simple') openSimple();
    else if (mode.type === 'caa') openCaa(mode);
    else if (mode.url) window.open(mode.url, '_blank', 'noopener');
  }

  // CAA: galeria de imagens rolável (funciona bem no mobile) + botão pro PDF completo
  function openCaa(mode) {
    if (!overlayCaa) return;
    lastFocused = trigger;
    const gallery = document.getElementById('caa-gallery');
    if (gallery && !gallery.dataset.built) {
      CAA_PAGES.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Prancha de comunicação CAA — página ${i + 1} de ${CAA_PAGES.length}`;
        img.loading = i < 2 ? 'eager' : 'lazy';
        img.className = 'caa-page';
        gallery.appendChild(img);
      });
      gallery.dataset.built = '1';
    }
    if (gallery) gallery.scrollTop = 0;
    if (caaExternalBtn) caaExternalBtn.href = mode.externalUrl || mode.url || '#';
    overlayCaa.classList.remove('hidden');
    document.addEventListener('keydown', onOverlayKey);
    overlayCaa.querySelector('.overlay-close').focus();
  }

  // Áudio local (audiolivro / audiodescrição) — funciona offline depois de tocar 1× online
  function openAudio(mode) {
    if (!overlayAudio || !audioPlayer) return;
    lastFocused = trigger;
    if (audioTitle) audioTitle.textContent = mode.label;
    if (audioDesc)  audioDesc.textContent  = mode.desc || '';
    audioPlayer.src = mode.src;
    if (audioYt) {
      if (mode.youtubeId) { audioYt.href = `https://youtu.be/${mode.youtubeId}`; audioYt.classList.remove('hidden'); }
      else audioYt.classList.add('hidden');
    }
    if (audioQrImg && mode.qrCode) {
      audioQrImg.src = mode.qrCode;
      audioQrImg.alt = `QR code — ${mode.label}`;
      audioQrImg.dataset.label = `${mode.label} — escaneie com o celular`;
      audioQrWrap.classList.remove('hidden');
    } else if (audioQrWrap) {
      audioQrWrap.classList.add('hidden');
    }
    overlayAudio.classList.remove('hidden');
    document.addEventListener('keydown', onOverlayKey);
    overlayAudio.querySelector('.overlay-close').focus();
    audioPlayer.play().catch(() => {});
  }

  function openVideo(mode) {
    lastFocused = trigger;
    videoTitle.textContent = mode.label;
    videoFrame.src = `https://www.youtube-nocookie.com/embed/${mode.youtubeId}?rel=0&autoplay=1`;
    if (videoQrImg && mode.qrCode) {
      videoQrImg.src = mode.qrCode;
      videoQrImg.alt = `QR code para abrir ${mode.label} no celular`;
      videoQrWrap.classList.remove('hidden');
    } else if (videoQrWrap) {
      videoQrWrap.classList.add('hidden');
    }
    overlayVideo.classList.remove('hidden');
    document.addEventListener('keydown', onOverlayKey);
    overlayVideo.querySelector('.overlay-close').focus();
  }

  function openSimple() {
    lastFocused = trigger;
    overlaySimple.classList.remove('hidden');
    document.addEventListener('keydown', onOverlayKey);
    overlaySimple.querySelector('.overlay-close').focus();
  }

  // Vídeo local (Libras) — funciona offline depois de tocar 1× online
  function openLocalVideo(mode) {
    if (!overlayAr || !arVideo) return;
    lastFocused = trigger;
    if (arTitle) arTitle.textContent = mode.label || 'Vídeo';
    arVideo.src = mode.src;
    if (arYt) {
      if (mode.youtubeId) { arYt.href = `https://youtu.be/${mode.youtubeId}`; arYt.classList.remove('hidden'); }
      else arYt.classList.add('hidden');
    }
    if (arVideoQrImg && mode.qrCode) {
      arVideoQrImg.src = mode.qrCode;
      arVideoQrImg.alt = `QR code — ${mode.label}`;
      arVideoQrImg.dataset.label = `${mode.label} — escaneie com o celular`;
      arVideoQrWrap.classList.remove('hidden');
    } else if (arVideoQrWrap) {
      arVideoQrWrap.classList.add('hidden');
    }
    overlayAr.classList.remove('hidden');
    document.addEventListener('keydown', onOverlayKey);
    overlayAr.querySelector('.overlay-close').focus();
    arVideo.play().catch(() => {});
  }

  function closeOverlays() {
    overlayVideo.classList.add('hidden');
    overlaySimple.classList.add('hidden');
    videoFrame.src = '';
    if (overlayAr) {
      overlayAr.classList.add('hidden');
      if (arVideo) { arVideo.pause(); arVideo.removeAttribute('src'); arVideo.load(); }
    }
    if (overlayAudio) {
      overlayAudio.classList.add('hidden');
      if (audioPlayer) { audioPlayer.pause(); }
    }
    if (overlayCaa) {
      overlayCaa.classList.add('hidden');
      if (caaFrame) caaFrame.src = '';
    }
    stopReading();
    document.removeEventListener('keydown', onOverlayKey);
    if (lastFocused) lastFocused.focus();
  }
  function onOverlayKey(e) {
    const open = !overlayVideo.classList.contains('hidden')  ? overlayVideo
               : !overlaySimple.classList.contains('hidden') ? overlaySimple
               : (overlayAr    && !overlayAr.classList.contains('hidden'))    ? overlayAr
               : (overlayAudio && !overlayAudio.classList.contains('hidden')) ? overlayAudio
               : (overlayCaa   && !overlayCaa.classList.contains('hidden'))   ? overlayCaa : null;
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeOverlays(); }
    else if (e.key === 'Tab') trapFocus(e, open);
  }
  [overlayVideo, overlaySimple, overlayAr, overlayAudio, overlayCaa].filter(Boolean).forEach(ov => {
    ov.querySelector('.overlay-close').addEventListener('click', closeOverlays);
    ov.addEventListener('click', e => { if (e.target === ov) closeOverlays(); });
  });

  // ================= ler texto simples em voz alta (TTS) =================
  let reading = false;
  function stopReading() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    reading = false;
    if (btnRead) { btnRead.setAttribute('aria-pressed', 'false'); btnRead.textContent = '🔊 Ouvir em voz alta'; }
  }
  if (btnRead) {
    btnRead.addEventListener('click', () => {
      if (!window.speechSynthesis) return;
      if (reading || speechSynthesis.speaking) { stopReading(); return; }
      const full = SIMPLE_TEXT.subtitle + ' ' + SIMPLE_TEXT.paragraphs.join(' ');
      const utt = new SpeechSynthesisUtterance(full);
      utt.lang = 'pt-BR';
      utt.rate = 0.9;
      utt.onend = stopReading;
      utt.onerror = stopReading;
      speechSynthesis.cancel();
      speechSynthesis.speak(utt);
      reading = true;
      btnRead.setAttribute('aria-pressed', 'true');
      btnRead.textContent = '⏹ Parar leitura';
    });
  }

  // exposto para o flipbook fechar tudo ao virar a página
  window.__deiseCloseAccessOverlays = () => { closeOverlays(); };

  // Deep-link via QR do livro físico: ?modo=audiolivro, ?modo=libras etc.
  const deepModo = new URLSearchParams(location.search).get('modo');
  if (deepModo) {
    const slug = deepModo.toLowerCase().replace(/-/g, '');
    const modeTarget = ACCESS_MODES.find(m =>
      m.key.toLowerCase() === slug ||
      m.key.toLowerCase().replace(/-/g, '') === slug
    );
    if (modeTarget) setTimeout(() => openMode(modeTarget), 950);
  }
}
