// js/ar-scenes/cena-arte.js
const THREE = window.THREE;

export async function init(anchor, scene) {
  let container = document.getElementById('particles-arte');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles-arte';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    document.body.appendChild(container);
  }

  const sound = new Howl({ src: ['../assets/audio/page-16.mp3'], html5: true, volume: 0.8, onloaderror: () => {} });
  let particlesStarted = false;

  return {
    onFound() {
      if (!particlesStarted) {
        particlesStarted = true;
        tsParticles.load('particles-arte', {
          fullScreen: { enable: false },
          particles: {
            number: { value: 70 },
            color: { value: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94'] },
            shape: { type: ['circle', 'square'] },
            opacity: { value: 0.9, random: true },
            size: { value: { min: 3, max: 9 } },
            rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 5, sync: false } },
            move: {
              enable: true, speed: 3,
              direction: 'top', random: true,
              outModes: { default: 'out' },
              gravity: { enable: false },
            },
          },
        });
      }
      if (sound.state() === 'loaded') sound.play();
    },
    onLost() { sound.stop(); },
    onFrame() {},
  };
}
