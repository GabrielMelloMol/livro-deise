// js/ar-scenes/cena-final.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-final');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-final';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  // Flores/pétalas balançando
  const petals = [];
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.CircleGeometry(0.04, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: [0xffd700, 0x87ceeb, 0xffb3c6, 0xa8e6cf, 0xffd700, 0x87ceeb][i],
      transparent: true, opacity: 0.85, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const angle = (i / 6) * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * 0.4, Math.sin(angle) * 0.5, 0.05);
    anchor.group.add(mesh);
    petals.push({ mesh, angle, offset: i * 0.6 });
  }

  const sound = new Howl({ src: ['../assets/audio/page-30.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;
  let t = 0;
  let animating = false;

  return {
    onFound() {
      animating = true;
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-final', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 80 },
            color: { value: ['#FFD700', '#87CEEB', '#FFFFFF', '#FFB3C6'] },
            shape: { type: 'star' },
            opacity: { value: { min: 0.3, max: 1 }, animation: { enable: true, speed: 1 } },
            size: { value: { min: 2, max: 7 } },
            move: { enable: true, speed: 1.5, direction: 'top', random: true, outModes: { default: 'out' } },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { animating = false; sound.stop(); },
    onFrame() {
      if (!animating) return;
      t += 0.02;
      petals.forEach(p => {
        p.mesh.position.y = Math.sin(p.angle) * 0.5 + Math.sin(t + p.offset) * 0.05;
        p.mesh.rotation.z = Math.sin(t * 0.7 + p.offset) * 0.3;
      });
    },
  };
}
