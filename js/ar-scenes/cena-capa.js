// js/ar-scenes/cena-capa.js
// Cena 1: CAPA — O Livro Desperta
// Efeitos: partículas douradas + brilho pulsante + som ambiente

const THREE = window.THREE; // exposto globalmente pelo <script> do A-Frame em ar-experience.html

export async function init(anchor, scene) {
  // Container DOM para partículas (overlay CSS sobre a câmera)
  const particleContainer = document.createElement('div');
  particleContainer.id = 'particles-capa';
  particleContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
  document.body.appendChild(particleContainer);

  // Plano 3D sobre a ilustração com brilho pulsante
  const geometry = new THREE.PlaneGeometry(1, 1.4);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  anchor.group.add(plane);

  // Áudio (toca quando disponível, silencia graciosamente se não encontrar)
  const sound = new Howl({
    src: ['../assets/audio/page-01.mp3'],
    html5: true,
    volume: 0.8,
    onloaderror: () => { /* áudio ainda não disponível — ok */ },
  });

  let particlesStarted = false;
  let glowInterval = null;
  let t = 0;

  return {
    onFound() {
      // Iniciar partículas douradas
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-capa', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 60 },
            color: { value: ['#FFD700', '#FFF8DC', '#FFA500'] },
            shape: { type: 'star' },
            opacity: { value: 0.8, random: true },
            size: { value: { min: 2, max: 6 } },
            move: {
              enable: true,
              speed: 1.5,
              direction: 'top',
              random: true,
              outModes: { default: 'out' },
            },
          },
        });
      }

      // Pulsar brilho dourado no plano
      glowInterval = setInterval(() => {
        t += 0.05;
        plane.material.opacity = 0.05 + Math.abs(Math.sin(t)) * 0.08;
      }, 50);

      // Tocar áudio
      if (sound.state() === 'loaded') sound.play();
    },

    onLost() {
      clearInterval(glowInterval);
      glowInterval = null;
      plane.material.opacity = 0;
      sound.stop();
    },

    onFrame() {},
  };
}
