// js/ar-scenes/cena-coragem.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-coragem');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-coragem';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  const geo = new THREE.SphereGeometry(0.08, 16, 16);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.6 });
  const heart = new THREE.Mesh(geo, mat);
  heart.position.set(0, 0.2, 0.05);
  anchor.group.add(heart);

  const sound = new Howl({ src: ['../assets/audio/page-11.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;
  let t = 0;
  let animating = false;

  return {
    onFound() {
      animating = true;
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-coragem', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 30 },
            color: { value: ['#FFD700', '#FFF176', '#FFAB40'] },
            shape: { type: 'star' },
            opacity: { value: 0.9, random: true },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: 1, direction: 'top', random: true, outModes: { default: 'out' } },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { animating = false; sound.stop(); },
    onFrame() {
      if (!animating) return;
      t += 0.05;
      const s = 1 + Math.abs(Math.sin(t)) * 0.3;
      heart.scale.set(s, s, s);
    },
  };
}
