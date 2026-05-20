// js/ar-scenes/cena-biblioteca.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-biblioteca');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-biblioteca';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  // Planos representando livros voando
  const books = [];
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.PlaneGeometry(0.12, 0.16);
    const mat = new THREE.MeshBasicMaterial({
      color: [0xfff9c4, 0xffd54f, 0xffab40, 0xa5d6a7][i],
      transparent: true, opacity: 0.8, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((i - 1.5) * 0.25, 0, 0.05);
    anchor.group.add(mesh);
    books.push({ mesh, offset: i * 0.8 });
  }

  const sound = new Howl({ src: ['../assets/audio/page-22.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;
  let t = 0;
  let animating = false;

  return {
    onFound() {
      animating = true;
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-biblioteca', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 40 },
            color: { value: ['#FFF9C4', '#FFD54F', '#FFFFFF'] },
            shape: { type: 'circle' },
            opacity: { value: 0.8, random: true },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: 1.2, direction: 'top', random: true, outModes: { default: 'out' } },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { animating = false; sound.stop(); },
    onFrame() {
      if (!animating) return;
      t += 0.015;
      books.forEach(b => {
        b.mesh.position.y = 0.1 + Math.sin(t + b.offset) * 0.15;
        b.mesh.rotation.z = Math.sin(t * 0.5 + b.offset) * 0.2;
      });
    },
  };
}
