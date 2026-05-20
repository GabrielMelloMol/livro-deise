// js/ar-scene.js
import { AR_SCENES } from './config.js';

const params = new URLSearchParams(window.location.search);
const cenaId = params.get('cena');
const cena   = AR_SCENES[cenaId];

const loading = document.getElementById('loading');
const caption = document.getElementById('caption');
const hint    = document.getElementById('hint');

if (!cena) {
  if (loading) {
    loading.querySelector('p').textContent = 'Cena não encontrada.';
  }
} else {
  caption.textContent = cena.narration;
  initAR(cenaId);
}

// Sumir com hint depois de 5s
setTimeout(() => hint.classList.add('fade'), 5000);
setTimeout(() => hint.remove(), 6000);

async function initAR(id) {
  const markerSrc = `../assets/markers/${id}.mind`;

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: markerSrc,
    maxTrack: 1,
  });

  const { renderer, scene, camera } = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  const sceneModule = await loadScene(id, anchor, scene);

  anchor.onTargetFound = () => {
    loading.classList.add('hidden');
    sceneModule.onFound?.();
  };
  anchor.onTargetLost = () => {
    sceneModule.onLost?.();
  };

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    sceneModule.onFrame?.();
    renderer.render(scene, camera);
  });
}

// Roteador de cenas
async function loadScene(id, anchor, scene) {
  const scenes = {
    capa:       () => import('./ar-scenes/cena-capa.js'),
    infancia:   () => import('./ar-scenes/cena-infancia.js'),
    sonho:      () => import('./ar-scenes/cena-sonho.js'),
    coragem:    () => import('./ar-scenes/cena-coragem.js'),
    arong:      () => import('./ar-scenes/cena-arong.js'),
    arte:       () => import('./ar-scenes/cena-arte.js'),
    fada:       () => import('./ar-scenes/cena-fada.js'),
    biblioteca: () => import('./ar-scenes/cena-biblioteca.js'),
    final:      () => import('./ar-scenes/cena-final.js'),
  };

  if (!scenes[id]) {
    console.error(`Cena "${id}" não encontrada no roteador`);
    return { onFound: () => {}, onLost: () => {}, onFrame: () => {} };
  }

  const mod = await scenes[id]();
  return mod.init(anchor, scene);
}
