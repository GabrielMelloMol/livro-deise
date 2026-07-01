/**
 * Normaliza o tamanho e a origem dos GLBs de AR.
 *
 * Os modelos do Meshy vêm numa escala arbitrária (~62.000 unidades de altura).
 * Este script reescala cada modelo para ALTURA = 1.0 unidade e reposiciona para
 * que a BASE fique em y=0 e o centro em x=z=0 — ou seja, o modelo "assenta" sobre
 * a página do livro na origem do marcador MindAR.
 *
 * Resultado: no ar-experience.html basta usar scale "0.4 0.4 0.4" (= 40% da
 * largura do marcador) — número limpo e previsível para todos os modelos.
 *
 * Uso (depois de optimize-ar-models.mjs):
 *   node scripts/normalize-ar-models.mjs
 */

import { NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization, EXTTextureWebP } from '@gltf-transform/extensions';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AR_DIR = resolve(__dirname, '..', 'assets/ar');

const FILES = ['deise-capa', 'deise-bale', 'sonhos', 'arvore', 'ponte', 'fada',
  'estrela', 'arong', 'arong-pitch', 'livros', 'starlet', 'familia'];

const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization, EXTTextureWebP])
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });

// bounding box em espaço-mundo da cena
function sceneBounds(doc) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  const root = doc.getRoot();
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const v = [0, 0, 0];
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v);
        // aplica world matrix (column-major)
        const x = m[0]*v[0] + m[4]*v[1] + m[8]*v[2] + m[12];
        const y = m[1]*v[0] + m[5]*v[1] + m[9]*v[2] + m[13];
        const z = m[2]*v[0] + m[6]*v[1] + m[10]*v[2] + m[14];
        min[0]=Math.min(min[0],x); min[1]=Math.min(min[1],y); min[2]=Math.min(min[2],z);
        max[0]=Math.max(max[0],x); max[1]=Math.max(max[1],y); max[2]=Math.max(max[2],z);
      }
    }
  }
  return { min, max };
}

async function normalize(name) {
  const path = resolve(AR_DIR, `${name}.glb`);
  const doc = await io.read(path);
  const { min, max } = sceneBounds(doc);
  const height = max[1] - min[1] || 1;
  const s = 1 / height; // altura final = 1.0
  // centro em X/Z, base em Y=0
  const cx = (min[0] + max[0]) / 2;
  const cz = (min[2] + max[2]) / 2;
  const ty = min[1];

  // Envolve tudo num nó raiz que aplica (translação para origem) e (escala)
  const root = doc.getRoot();
  const scene = root.listScenes()[0];
  const wrapper = doc.createNode('ar-normalized')
    .setScale([s, s, s])
    .setTranslation([-cx * s, -ty * s, -cz * s]);
  for (const node of scene.listChildren()) {
    scene.removeChild(node);
    wrapper.addChild(node);
  }
  scene.addChild(wrapper);

  await io.write(path, doc);
  console.log(`   ✔ ${name.padEnd(12)} altura ${height.toFixed(0)} → 1.0  (escala ${s.toExponential(2)})`);
}

console.log('\n📐 Normalizando tamanho/origem dos modelos…\n');
for (const f of FILES) await normalize(f);
console.log('\n✅ Modelos normalizados: altura 1.0, base em y=0, centrados.\n');
