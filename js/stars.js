// Céu mágico com PROFUNDIDADE (parallax) — nebulosas, estrelas, poeira mágica,
// brilhos e estrelas cadentes. As camadas se deslocam em ritmos diferentes
// conforme o mouse / giro do celular, criando sensação 3D em todas as páginas.
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let W = 0, H = 0;
let nebulaImg = null;

const REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// ----- Parallax: alvo (−1..1) suavizado para pixels -----
const MAXP = REDUCE ? 0 : 24;
let pmx = 0, pmy = 0;      // alvo normalizado
let px = 0, py = 0;        // deslocamento suavizado (px)

if (!REDUCE) {
  window.addEventListener('mousemove', e => {
    pmx = (e.clientX / W - 0.5) * 2;
    pmy = (e.clientY / H - 0.5) * 2;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) {
      pmx = (e.touches[0].clientX / W - 0.5) * 2;
      pmy = (e.touches[0].clientY / H - 0.5) * 2;
    }
  }, { passive: true });
  window.addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;                 // Android dá direto; iOS exige permissão (ignorado)
    pmx = Math.max(-1, Math.min(1, e.gamma / 35));
    pmy = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
  }, { passive: true });
}

function buildNebula() {
  const nc = document.createElement('canvas');
  nc.width = W; nc.height = H;
  const c = nc.getContext('2d');

  const g1 = c.createRadialGradient(W * 0.12, H * 0.18, 0, W * 0.12, H * 0.18, W * 0.38);
  g1.addColorStop(0, 'rgba(90,20,140,0.14)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g1; c.fillRect(0, 0, W, H);

  const g2 = c.createRadialGradient(W * 0.88, H * 0.3, 0, W * 0.88, H * 0.3, W * 0.3);
  g2.addColorStop(0, 'rgba(20,50,140,0.10)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g2; c.fillRect(0, 0, W, H);

  const g3 = c.createRadialGradient(W * 0.5, H * 0.85, 0, W * 0.5, H * 0.85, W * 0.25);
  g3.addColorStop(0, 'rgba(120,30,80,0.08)'); g3.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g3; c.fillRect(0, 0, W, H);

  const gh = c.createLinearGradient(0, H * 0.65, 0, H);
  gh.addColorStop(0, 'rgba(0,0,0,0)'); gh.addColorStop(1, 'rgba(50,20,90,0.18)');
  c.fillStyle = gh; c.fillRect(0, 0, W, H);

  nebulaImg = nc;
}

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildNebula();
}
window.addEventListener('resize', resize, { passive: true });
resize();

// ----- Estrelas pequenas (camada distante) -----
const COLORS_SMALL = ['255,255,255', '220,230,255', '255,245,215', '200,220,255'];
const smallStars = Array.from({ length: 280 }, () => ({
  fx: Math.random(), fy: Math.random(),
  r: Math.random() * 0.85 + 0.18,
  a: Math.random() * 0.5 + 0.15,
  da: (Math.random() - 0.5) * 0.004,
  col: COLORS_SMALL[Math.floor(Math.random() * COLORS_SMALL.length)],
}));

// ----- Estrelas médias com halo (camada média) -----
const medStars = Array.from({ length: 55 }, () => ({
  fx: Math.random(), fy: Math.random(),
  r:  Math.random() * 1.4 + 0.9,
  gr: Math.random() * 6 + 3,
  a:  Math.random() * 0.45 + 0.4,
  da: (Math.random() - 0.5) * 0.0035,
  col: Math.random() > 0.5 ? '200,220,255' : '255,240,200',
}));

// ----- Estrelas de destaque com brilho em cruz (camada próxima) -----
const sparkles = Array.from({ length: 10 }, () => ({
  fx: Math.random(), fy: Math.random(),
  r:  Math.random() * 1.2 + 1.6,
  ph: Math.random() * Math.PI * 2,
  sp: Math.random() * 0.025 + 0.008,
}));

// ----- Poeira mágica dourada (camada mais próxima, sobe devagar) -----
const DUST_COLORS = ['255,228,150', '255,205,120', '255,246,205', '190,220,255'];
const magicDust = Array.from({ length: REDUCE ? 18 : 48 }, () => ({
  fx: Math.random(), fy: Math.random(),
  r:  Math.random() * 1.6 + 0.7,
  a:  Math.random() * 0.5 + 0.22,
  ph: Math.random() * Math.PI * 2,
  sp: Math.random() * 2.2 + 0.8,
  vy: -(Math.random() * 0.00016 + 0.00005),
  vx: (Math.random() - 0.5) * 0.00009,
  col: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
}));

// ----- Estrelas cadentes -----
const shooters = [];
let nextShoot = Date.now() + 800;

function spawnShooter() {
  const angle = (8 + Math.random() * 38) * Math.PI / 180;
  const spd   = 5 + Math.random() * 8;
  const warm  = Math.random();
  shooters.push({
    x: Math.random() * W * 0.78, y: Math.random() * H * 0.48,
    vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
    tail: 90 + Math.random() * 120, w: 1.2 + Math.random() * 1.8, a: 1,
    col: warm > 0.55 ? '255,255,200' : warm > 0.3 ? '200,220,255' : '255,255,255',
  });
  if (Math.random() > 0.62) setTimeout(spawnShooter, 250 + Math.random() * 600);
  nextShoot = Date.now() + 1800 + Math.random() * 2800;
}

// ----- Loop -----
function draw() {
  // suaviza o parallax + leve balanço automático (vida mesmo parado)
  const tms = Date.now();
  const autoX = Math.sin(tms * 0.0003) * 6;
  const autoY = Math.cos(tms * 0.00023) * 5;
  px += ((pmx * MAXP + autoX) - px) * 0.05;
  py += ((pmy * MAXP + autoY) - py) * 0.05;

  ctx.clearRect(0, 0, W, H);
  if (nebulaImg) ctx.drawImage(nebulaImg, px * 0.15, py * 0.15);

  // Pequenas (profundidade 0.3)
  const ox1 = px * 0.3, oy1 = py * 0.3;
  for (const s of smallStars) {
    s.a += s.da;
    if (s.a < 0.08) { s.a = 0.08; s.da *= -1; }
    if (s.a > 0.82) { s.a = 0.82; s.da *= -1; }
    ctx.beginPath();
    ctx.arc(s.fx * W + ox1, s.fy * H + oy1, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.col},${s.a})`;
    ctx.fill();
  }

  // Médias com halo (profundidade 0.6)
  const ox2 = px * 0.6, oy2 = py * 0.6;
  for (const s of medStars) {
    s.a += s.da;
    if (s.a < 0.28) { s.a = 0.28; s.da *= -1; }
    if (s.a > 0.92) { s.a = 0.92; s.da *= -1; }
    const x = s.fx * W + ox2, y = s.fy * H + oy2;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, s.gr);
    grd.addColorStop(0, `rgba(${s.col},${s.a * 0.55})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(x, y, s.gr, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${s.col},${s.a})`; ctx.fill();
  }

  // Brilhos em cruz (profundidade 1.0)
  const t = tms / 1000;
  const ox3 = px * 1.0, oy3 = py * 1.0;
  for (const s of sparkles) {
    const pulse = 0.5 + 0.5 * Math.sin(t * s.sp * 60 + s.ph);
    const a = 0.45 + pulse * 0.55;
    const r = s.r * (0.75 + pulse * 0.5);
    const x = s.fx * W + ox3, y = s.fy * H + oy3;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#fffde8'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x - r * 3.5, y); ctx.lineTo(x + r * 3.5, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - r * 3.5); ctx.lineTo(x, y + r * 3.5); ctx.stroke();
    ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(x - r * 2, y - r * 2); ctx.lineTo(x + r * 2, y + r * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + r * 2, y - r * 2); ctx.lineTo(x - r * 2, y + r * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,240,1)'; ctx.fill();
    ctx.restore();
  }

  // Poeira mágica (profundidade 1.4) — sobe devagar e cintila
  const ox4 = px * 1.4, oy4 = py * 1.4;
  for (const d of magicDust) {
    d.fx += d.vx; d.fy += d.vy;
    if (d.fy < -0.02) { d.fy = 1.02; d.fx = Math.random(); }
    if (d.fx < -0.02) d.fx = 1.02; else if (d.fx > 1.02) d.fx = -0.02;
    const tw = 0.45 + 0.55 * Math.sin(t * d.sp + d.ph);
    const a  = d.a * tw;
    const x  = d.fx * W + ox4, y = d.fy * H + oy4;
    const r  = d.r * (0.8 + tw * 0.5);
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    grd.addColorStop(0, `rgba(${d.col},${a})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${d.col},${a})`; ctx.fill();
  }

  // Estrelas cadentes (sem parallax — voam livres)
  if (Date.now() >= nextShoot && shooters.length < 5) spawnShooter();
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s = shooters[i];
    const spd = Math.sqrt(s.vx ** 2 + s.vy ** 2);
    const tx = s.x - (s.vx / spd) * s.tail, ty = s.y - (s.vy / spd) * s.tail;
    const gr = ctx.createLinearGradient(s.x, s.y, tx, ty);
    gr.addColorStop(0, `rgba(${s.col},${s.a})`);
    gr.addColorStop(0.25, `rgba(${s.col},${s.a * 0.45})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty);
    ctx.strokeStyle = gr; ctx.lineWidth = s.w; ctx.stroke();
    const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5);
    hg.addColorStop(0, `rgba(${s.col},${s.a})`); hg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();
    s.x += s.vx; s.y += s.vy; s.a -= 0.011;
    if (s.a <= 0 || s.x > W + 250 || s.y > H + 250) shooters.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

draw();
