/**
 * Gera UM vídeo com o Veo e baixa o arquivo.
 *
 * O vídeo existe para virar sequência de quadros do scroll-telling — a técnica
 * que Apple e afins usam: N quadros desenhados num <canvas>, com o índice
 * amarrado ao progresso do scroll. Por isso as exigências do prompt não são
 * estéticas, são funcionais:
 *
 *   CÂMERA TRAVADA. Se a câmera se move sozinha, ela briga com o scroll e o
 *   efeito desanda — o visitante rola para baixo e a imagem vai para o lado.
 *
 *   PLANO ÚNICO, sem corte. Um corte no meio da sequência lê como falha de
 *   carregamento, não como edição.
 *
 *   SEM TEXTO E SEM MARCA. É material de estabelecimento fictício; já
 *   rejeitamos cinco fotos do banco por logo à vista.
 *
 * Uso:  node scripts/veo.mjs [--modelo fast|lite|full] [--saida arquivo.mp4]
 *
 * Custa dinheiro a cada execução. Não roda em CI e não é chamado por nenhum
 * build — é ferramenta de linha de comando, usada de propósito.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { setTimeout as dormir } from 'node:timers/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');

function chave() {
  const env = path.join(RAIZ, '.env');
  if (!existsSync(env)) throw new Error('.env não encontrado na raiz.');
  const linha = readFileSync(env, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('GEMINI_API='));
  if (!linha) throw new Error('GEMINI_API ausente no .env.');
  return linha.slice('GEMINI_API='.length).trim();
}

const MODELOS = {
  fast: 'veo-3.1-fast-generate-preview',
  lite: 'veo-3.1-lite-generate-preview',
  full: 'veo-3.1-generate-preview',
};

const PROMPT = [
  'Overhead top-down locked-off camera, absolutely static tripod shot, no camera movement, no pan, no zoom.',
  'A round pizza is assembled step by step on a dark wooden board in the center of the frame:',
  'first the pale raw dough disc, then red tomato sauce spread with a ladle in a spiral,',
  'then torn white mozzarella scattered over it, then fresh basil leaves placed one by one,',
  'finally a drizzle of olive oil.',
  'Warm low-key restaurant lighting from the side, deep shadows, dark background.',
  'Single continuous take, no cuts, no transitions.',
  'No text, no letters, no logos, no packaging, no bottles, no branded objects anywhere.',
  'Photorealistic food cinematography, shallow depth of field, 4k.',
].join(' ');

const args = process.argv.slice(2);
const pegar = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : padrao;
};

const modelo = MODELOS[pegar('modelo', 'fast')] ?? MODELOS.fast;
const saida = path.join(RAIZ, '.tmp', pegar('saida', 'pizza.mp4'));
const K = chave();

mkdirSync(path.dirname(saida), { recursive: true });

console.log(`modelo: ${modelo}`);
console.log(`saída:  ${path.relative(RAIZ, saida)}`);
console.log('\nprompt:\n  ' + PROMPT.replace(/\. /g, '.\n  '));

/* ---- dispara ------------------------------------------------------ */

const inicio = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:predictLongRunning?key=${K}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: PROMPT }],
      parameters: { aspectRatio: '16:9', personGeneration: 'allow_adult' },
    }),
  }
);

const abertura = await inicio.json();
if (!inicio.ok) {
  console.error('\nfalhou ao iniciar:', JSON.stringify(abertura).slice(0, 500));
  process.exit(1);
}

const operacao = abertura.name;
console.log(`\noperação iniciada: ${operacao}`);

/* ---- aguarda ------------------------------------------------------ */

let resultado;
for (let i = 0; i < 60; i++) {
  await dormir(10_000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operacao}?key=${K}`);
  const j = await r.json();
  if (j.done) {
    resultado = j;
    break;
  }
  process.stdout.write(`  aguardando… ${(i + 1) * 10}s\r`);
}

if (!resultado) {
  console.error('\nestourou o tempo de espera. A operação pode ainda concluir:', operacao);
  process.exit(1);
}

if (resultado.error) {
  console.error('\ngeração falhou:', JSON.stringify(resultado.error).slice(0, 500));
  process.exit(1);
}

/* ---- baixa -------------------------------------------------------- */

const resp = resultado.response ?? {};
const amostras = resp.generatedSamples ?? resp.generateVideoResponse?.generatedSamples ?? [];
const uri = amostras[0]?.video?.uri ?? resp.videos?.[0]?.uri;

if (!uri) {
  console.error('\nnão achei o vídeo na resposta:', JSON.stringify(resultado).slice(0, 700));
  process.exit(1);
}

const bin = await fetch(`${uri}&key=${K}`);
const buf = Buffer.from(await bin.arrayBuffer());
writeFileSync(saida, buf);

console.log(`\n\n✓ vídeo salvo: ${path.relative(RAIZ, saida)} (${Math.round(buf.length / 1024)} kB)`);
console.log('  próximo passo: extrair os quadros com scripts/quadros.mjs');
