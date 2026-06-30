/**
 * Compila as imagens-alvo do livro em targets.mind para MindAR.
 * Usa jimp (JS puro, sem dependências nativas).
 *
 * Uso:
 *   node scripts/compile-ar-targets.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Imagens na ordem exata dos targetIndex em ar-experience.html
const TARGET_IMAGES = [
  { path: 'assets/pages/cover.jpg',   label: 'Capa'      }, // 0 → deise-capa.glb
  { path: 'assets/pages/page-04.jpg', label: 'Página 4'  }, // 1 → deise.glb
  { path: 'assets/pages/page-08.jpg', label: 'Página 8'  }, // 2 → estrela.glb
  { path: 'assets/pages/page-10.jpg', label: 'Página 10' }, // 3 → globo.glb
  { path: 'assets/pages/page-14.jpg', label: 'Página 14' }, // 4 → arvore.glb
];

const OUTPUT = resolve(ROOT, 'assets/ar/targets.mind');

async function compile() {
  // Importa jimp (leitura de imagem, JS puro)
  let Jimp;
  try {
    const mod = await import('jimp');
    Jimp = mod.Jimp || mod.default;
  } catch {
    console.error('\n❌  jimp não encontrado. Rode:\n   npm install jimp --ignore-scripts\n');
    process.exit(1);
  }

  // Importa o compilador MindAR (ignora a dependência de canvas)
  let Compiler;
  try {
    const mod = await import('mind-ar/src/image-target/compiler.js');
    Compiler = mod.Compiler || mod.default?.Compiler;
    if (!Compiler) throw new Error('classe Compiler não encontrada');
  } catch (err) {
    console.error('\n❌  Erro ao importar compilador MindAR:', err.message);
    console.error('   Rode: npm install mind-ar --ignore-scripts\n');
    process.exit(1);
  }

  console.log('\n🖼️  Carregando imagens-alvo…\n');

  const imageDataList = [];
  for (const { path: imgPath, label } of TARGET_IMAGES) {
    const abs = resolve(ROOT, imgPath);
    try {
      const img    = await Jimp.read(abs);
      const width  = img.bitmap.width;
      const height = img.bitmap.height;
      // Jimp armazena RGBA em bitmap.data — mesmo formato de ImageData
      const imageData = {
        data:   new Uint8ClampedArray(img.bitmap.data),
        width,
        height,
      };
      imageDataList.push(imageData);
      console.log(`   ✔ ${label} (${width}×${height})`);
    } catch (err) {
      console.error(`   ✘ ${label}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\n⚙️  Compilando ${imageDataList.length} alvo(s) — aguarde 1-3 min…\n`);

  const compiler = new Compiler();

  await compiler.compileImageTargets(imageDataList, (progress) => {
    const pct = Math.round(progress * 100);
    const bar = '█'.repeat(Math.floor(pct / 5)).padEnd(20, '░');
    process.stdout.write(`\r   [${bar}] ${pct}%  `);
  });

  const buffer = await compiler.exportData();

  mkdirSync(resolve(ROOT, 'assets/ar'), { recursive: true });
  writeFileSync(OUTPUT, Buffer.from(buffer));

  console.log('\n\n✅  Pronto!\n');
  console.log(`   Arquivo: assets/ar/targets.mind`);
  console.log(`   Tamanho: ${(buffer.byteLength / 1024).toFixed(0)} KB\n`);
  console.log('   Mapeamento:');
  TARGET_IMAGES.forEach(({ label }, i) => {
    console.log(`     targetIndex ${i} → ${label}`);
  });
  console.log('');
}

compile().catch(err => {
  console.error('\n❌  Erro:', err.message, '\n');
  process.exit(1);
});
