// js/ar-scenes/cena-sonho.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-sonho');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-sonho';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  const spheres = [];
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.SphereGeometry(0.04, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xb388ff, transparent: true, opacity: 0.7 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 0.8, Math.random() * 0.4, 0.05);
    anchor.group.add(mesh);
    spheres.push({ mesh, offset: Math.random() * Math.PI * 2 });
  }

  const sound = new Howl({ src: ['../assets/audio/page-08.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;
  let t = 0;

  return {
    onFound() {
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-sonho', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 80 },
            color: { value: ['#B388FF', '#FFFFFF', '#80DEEA'] },
            shape: { type: 'star' },
            opacity: { value: { min: 0.2, max: 0.9 }, animation: { enable: true, speed: 1 } },
            size: { value: { min: 1, max: 4 } },
            move: { enable: true, speed: 0.8, random: true, outModes: { default: 'out' } },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { sound.stop(); },
    onFrame() {
      t += 0.01;
      spheres.forEach((s, i) => {
        s.mesh.position.y = 0.1 + Math.sin(t + s.offset) * 0.15;
      });
    },
  };
}
