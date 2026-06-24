// js/ar-scene.js — AR no livro FÍSICO (MindAR image tracking)
// v1: aponta a câmera para a CAPA impressa → um vídeo animado flutua sobre ela.
// (As cenas 3D por página — ar-scenes/cena-*.js — ficam para a v2.)
import { AR_VIDEO } from './config.js?v=1.0.11';

const THREE   = window.THREE;
const loading = document.getElementById('loading');
const hint    = document.getElementById('hint');
const caption = document.getElementById('caption');

// alvo: marker compilado da capa nova (gerar no compilador do MindAR — ver instruções)
const MARKER_SRC = '../assets/markers/cover.mind';

function showError(msg) {
  if (!loading) return;
  loading.classList.remove('hidden');
  loading.innerHTML =
    `<p style="max-width:320px;text-align:center;line-height:1.55">${msg}</p>` +
    `<button id="ar-back" style="margin-top:18px;padding:10px 18px;border:none;border-radius:8px;background:#fff;color:#111;cursor:pointer">Voltar</button>`;
  const b = document.getElementById('ar-back');
  if (b) b.addEventListener('click', () => history.back());
}

if (caption) caption.textContent = 'Aponte a câmera para a capa do livro.';

async function start() {
  if (!window.MINDAR || !THREE) { showError('Não foi possível carregar a Realidade Aumentada neste navegador.'); return; }

  let mindarThree;
  try {
    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: MARKER_SRC,
      maxTrack: 1,
      uiLoading: 'no', uiScanning: 'no', uiError: 'no',
    });
  } catch (_) {
    showError('Erro ao iniciar a Realidade Aumentada.');
    return;
  }

  const { renderer, scene, camera } = mindarThree;
  const anchor = mindarThree.addAnchor(0);

  // vídeo como textura (mudo → permite autoplay no celular)
  const video = document.createElement('video');
  video.src = AR_VIDEO.src;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');

  const texture  = new THREE.VideoTexture(video);
  const geometry = new THREE.PlaneGeometry(1, 0.5625);          // 16:9 sobre a capa
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane    = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 0.02);
  anchor.group.add(plane);

  anchor.onTargetFound = () => {
    video.play().catch(() => {});
    if (hint) hint.classList.add('fade');
  };
  anchor.onTargetLost = () => { video.pause(); };

  try {
    await mindarThree.start();
  } catch (_) {
    showError('Precisamos da câmera para a Realidade Aumentada. Permita o acesso e tente de novo.<br>(No iPhone, abra pelo Safari. Se o livro ainda não tem o marcador configurado, avise o desenvolvedor.)');
    return;
  }

  if (loading) loading.classList.add('hidden');
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
}

start();
