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

// Imagens na ordem exata dos targetIndex em ar-experience.html.
// 1 objeto por virada (spread), na página mais ilustrada de cada uma.
// Alvos em páginas que NUNCA caem na mesma dupla aberta (espaçadas ≥2 páginas):
// assim jamais aparecem dois objetos 3D juntos, independente de como o livro abre.
const TARGET_IMAGES = [
  { path: 'assets/pages/cover.jpg',   label: 'Capa'      }, //  0 → deise-capa  (Deise + estrela)
  { path: 'assets/pages/page-04.jpg', label: 'Página 4'  }, //  1 → arong-pitch (Deise jogando bola)
  { path: 'assets/pages/page-06.jpg', label: 'Página 6'  }, //  2 → familia     (afeto/corações)
  { path: 'assets/pages/page-08.jpg', label: 'Página 8'  }, //  3 → sonhos      (as perguntas/sonhos)
  { path: 'assets/pages/page-10.jpg', label: 'Página 10' }, //  4 → deise-bale  (lugar mágico: música/dança)
  { path: 'assets/pages/page-12.jpg', label: 'Página 12' }, //  5 → starlet     (a estrela do sonho)
  { path: 'assets/pages/page-14.jpg', label: 'Página 14' }, //  6 → arong       (funda a ARONG)
  { path: 'assets/pages/page-18.jpg', label: 'Página 18' }, //  7 → arvore      (crianças aprendem)
  { path: 'assets/pages/page-20.jpg', label: 'Página 20' }, //  8 → fada        (Deise fada madrinha)
  { path: 'assets/pages/page-22.jpg', label: 'Página 22' }, //  9 → livros      (leitura/semente)
  { path: 'assets/pages/page-25.jpg', label: 'Página 25' }, // 10 → ponte       (empatia/celebração)
  { path: 'assets/pages/page-16.jpg', label: 'Página 16' }, // 11 → saxofone    (música na ARONG)
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

  // Compilador MindAR para Node — SEM `canvas` nativo (não compila no Node 25).
  // O `compiler.js` oficial usa Web Worker (import Vite `?worker&inline`, não roda
  // em Node) e o `offline-compiler.js` usa `canvas`. Aqui estendemos o CompilerBase:
  //   - createProcessCanvas: stub que devolve os pixels RGBA que o jimp já leu
  //     (o canvas só servia pra rasterizar a imagem em ImageData — nós já temos)
  //   - compileTrack: versão JS-pura idêntica à do offline-compiler
  let Compiler;
  try {
    const { CompilerBase } = await import('mind-ar/src/image-target/compiler-base.js');
    const { buildTrackingImageList } = await import('mind-ar/src/image-target/image-list.js');
    const { extractTrackingFeatures } = await import('mind-ar/src/image-target/tracker/extract-utils.js');
    await import('mind-ar/src/image-target/detector/kernels/cpu/index.js'); // registra kernels tfjs CPU

    Compiler = class NodeCompiler extends CompilerBase {
      createProcessCanvas(img) {
        // img = { data: RGBA Uint8ClampedArray, width, height } — devolvemos direto
        return {
          getContext: () => ({
            drawImage: () => {},
            getImageData: () => ({ data: img.data, width: img.width, height: img.height }),
          }),
        };
      }
      compileTrack({ progressCallback, targetImages, basePercent }) {
        return new Promise((resolve) => {
          const percentPerImage = (100 - basePercent) / targetImages.length;
          let percent = 0;
          const list = [];
          for (let i = 0; i < targetImages.length; i++) {
            const imageList = buildTrackingImageList(targetImages[i]);
            const percentPerAction = percentPerImage / imageList.length;
            const trackingData = extractTrackingFeatures(imageList, () => {
              percent += percentPerAction;
              progressCallback(basePercent + percent);
            });
            list.push(trackingData);
          }
          resolve(list);
        });
      }
    };
  } catch (err) {
    console.error('\n❌  Erro ao montar compilador MindAR:', err.message, '\n', err.stack);
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
