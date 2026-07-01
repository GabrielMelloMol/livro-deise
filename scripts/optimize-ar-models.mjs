/**
 * Otimiza os modelos 3D do AR (Meshy AI) para uso em mobile.
 *
 * Os exports do Meshy vêm com geometria leve (~12k tris) mas texturas PNG
 * gigantes (2K/4K) e sem compressão → 10-21 MB cada. Este script:
 *   - redimensiona texturas para 1024px
 *   - converte para WebP
 *   - aplica compressão de malha meshopt + quantização
 * Resultado típico: 20 MB → ~1 MB, sem perda visual perceptível.
 *
 * Uso:
 *   node scripts/optimize-ar-models.mjs
 *
 * Requer (baixados on-demand por npx): @gltf-transform/cli
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC_DIR = resolve(ROOT, '../3d/otimizados');
const OUT_DIR = resolve(ROOT, 'assets/ar');

// Mapa: arquivo de origem (3d/otimizados, já renomeado) → nome final do GLB no AR.
// A ordem segue as páginas em ar-experience.html (AR_TARGETS).
const MODELS = [
  { src: 'deise-capa.glb', out: 'deise-capa.glb' }, // Capa — Deise + estrela (Meshy "Deise and the Star")
  { src: 'deise-bale.glb', out: 'deise-bale.glb' }, // Pág 4 — infância/dança (Meshy "Golden Pirouette")
  { src: 'sonhos.glb',     out: 'sonhos.glb'     }, // Pág 8 — os sonhos (Meshy "Meus Sonhos não têm")
  { src: 'arvore.glb',     out: 'arvore.glb'     }, // Pág 10 — sonhe grande (Meshy "Tree of Inclusion")
  { src: 'ponte.glb',      out: 'ponte.glb'      }, // Pág 14 — a ARONG nasce (Meshy "Ponte da Empatia")
  { src: 'fada.glb',       out: 'fada.glb'       }, // Elemento mágico flutuante (Meshy "Azure Stardust Fairy")
];

const TEXTURE_SIZE = 1024;

function optimize({ src, out }) {
  const input = resolve(SRC_DIR, src);
  const output = resolve(OUT_DIR, out);
  if (!existsSync(input)) {
    console.error(`   ✘ origem não encontrada: ${src}`);
    return false;
  }
  console.log(`   ⚙ ${out}  ←  ${src}`);
  execFileSync('npx', [
    '--yes', '@gltf-transform/cli@latest', 'optimize', input, output,
    '--texture-compress', 'webp',
    '--texture-size', String(TEXTURE_SIZE),
    '--simplify', 'false',     // geometria já está leve — não distorcer
    '--compress', 'quantize',  // SEM meshopt: quantização é suportada nativamente
                               // pelo three.js/A-Frame (meshopt exigiria decoder JS
                               // que o A-Frame não liga por padrão → modelo não carrega)
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
  return true;
}

mkdirSync(OUT_DIR, { recursive: true });
console.log('\n🛠️  Otimizando modelos do AR…\n');
let ok = 0;
for (const m of MODELS) if (optimize(m)) ok++;
console.log(`\n✅  ${ok}/${MODELS.length} modelos otimizados em assets/ar/\n`);
