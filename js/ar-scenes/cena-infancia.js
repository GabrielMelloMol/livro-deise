// js/ar-scenes/cena-infancia.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-infancia');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-infancia';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  const light = new THREE.PointLight(0xff9500, 2, 3);
  light.position.set(0, 0.5, 0.5);
  anchor.group.add(light);

  const sound = new Howl({ src: ['../assets/audio/page-04.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;

  return {
    onFound() {
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-infancia', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 40 },
            color: { value: ['#FF9500', '#FFD700', '#FF6B6B'] },
            shape: { type: 'circle' },
            opacity: { value: 0.7, random: true },
            size: { value: { min: 3, max: 8 } },
            move: { enable: true, speed: 2, direction: 'top', random: true, outModes: { default: 'out' } },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { sound.stop(); },
    onFrame() {},
  };
}
