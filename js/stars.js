const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let W = 0, H = 0;
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize, { passive: true });
resize();

const stars = Array.from({ length: 200 }, () => ({
  fx:     Math.random(),
  fy:     Math.random(),
  r:      Math.random() * 1.3 + 0.25,
  alpha:  Math.random(),
  dAlpha: (Math.random() - 0.5) * 0.006,
}));

const shooters = [];
let nextShooterAt = Date.now() + 2000 + Math.random() * 4000;

function spawnShooter() {
  const angle = (12 + Math.random() * 28) * Math.PI / 180;
  const spd   = 4 + Math.random() * 5;
  shooters.push({
    x: Math.random() * W * 0.7,
    y: Math.random() * H * 0.4,
    vx: Math.cos(angle) * spd,
    vy: Math.sin(angle) * spd,
    alpha: 1,
  });
  nextShooterAt = Date.now() + 4000 + Math.random() * 8000;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  for (const s of stars) {
    s.alpha += s.dAlpha;
    if (s.alpha <= 0.08) { s.alpha = 0.08; s.dAlpha *= -1; }
    if (s.alpha >= 0.96) { s.alpha = 0.96; s.dAlpha *= -1; }
    ctx.beginPath();
    ctx.arc(s.fx * W, s.fy * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }

  if (Date.now() >= nextShooterAt) spawnShooter();

  for (let i = shooters.length - 1; i >= 0; i--) {
    const s    = shooters[i];
    const spd  = Math.sqrt(s.vx ** 2 + s.vy ** 2);
    const tail = 100;
    const tx   = s.x - (s.vx / spd) * tail;
    const ty   = s.y - (s.vy / spd) * tail;
    const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
    grad.addColorStop(0, `rgba(255,255,210,${s.alpha})`);
    grad.addColorStop(1, 'rgba(255,255,210,0)');
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= 0.013;
    if (s.alpha <= 0 || s.x > W + 150 || s.y > H + 150) shooters.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

draw();
