// js/ar-scenes/cena-arong.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-arong');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-arong';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  // Plano com brilho verde/rosa representando nascimento da ARONG
  const geo = new THREE.PlaneGeometry(1.2, 1.6);
  const mat = new THREE.MeshBasicMaterial({ color: 0x66bb6a, transparent: true, opacity: 0, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geo, mat);
  anchor.group.add(plane);

  const sound = new Howl({ src: ['../assets/audio/page-14.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;
  let t = 0;
  let glowInterval = null;

  return {
    onFound() {
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-arong', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 50 },
            color: { value: ['#66BB6A', '#F48FB1', '#FFFFFF', '#FFD700'] },
            shape: { type: 'circle' },
            opacity: { value: 0.8, random: true },
            size: { value: { min: 2, max: 7 } },
            move: { enable: true, speed: 1.5, direction: 'top', random: true, outModes: { default: 'out' } },
          },
        });
      }
      glowInterval = setInterval(() => {
        t += 0.04;
        mat.opacity = 0.03 + Math.abs(Math.sin(t)) * 0.06;
      }, 50);
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() {
      clearInterval(glowInterval);
      glowInterval = null;
      mat.opacity = 0;
      sound.stop();
    },
    onFrame() {},
  };
}
