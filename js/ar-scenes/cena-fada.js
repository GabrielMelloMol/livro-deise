// js/ar-scenes/cena-fada.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-fada');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-fada';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  // Torus como arco-íris animado
  const geo = new THREE.TorusGeometry(0.4, 0.04, 8, 32, Math.PI);
  const mat = new THREE.MeshBasicMaterial({ color: 0xe040fb, transparent: true, opacity: 0.7 });
  const rainbow = new THREE.Mesh(geo, mat);
  rainbow.rotation.x = -Math.PI / 4;
  rainbow.position.set(0, 0.2, 0.05);
  anchor.group.add(rainbow);

  const sound = new Howl({ src: ['../assets/audio/page-19.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;
  let t = 0;
  let animating = false;

  return {
    onFound() {
      animating = true;
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-fada', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 60 },
            color: { value: ['#FF80AB', '#E040FB', '#FFFFFF', '#CE93D8'] },
            shape: { type: 'star' },
            opacity: { value: { min: 0.4, max: 1 }, animation: { enable: true, speed: 2 } },
            size: { value: { min: 2, max: 6 } },
            move: { enable: true, speed: 1.2, random: true, outModes: { default: 'out' } },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { animating = false; sound.stop(); },
    onFrame() {
      if (!animating) return;
      t += 0.02;
      rainbow.rotation.z = Math.sin(t) * 0.1;
      rainbow.material.color.setHSL((t * 0.1) % 1, 0.9, 0.6);
    },
  };
}
