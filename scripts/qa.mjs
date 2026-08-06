/**
 * QA visual — o gate obrigatório do projeto.
 *
 * Para cada rota, em 390×844 (mobile) e 1440×900 (desktop):
 *   - screenshot em qa/<viewport>/<nome>.png
 *   - erros e warnings do console
 *   - requisições de rede que falharam (imagem 404 reprova)
 *   - overflow horizontal (scrollWidth > clientWidth)
 *
 * Uso:
 *   node scripts/qa.mjs                  # todas as rotas
 *   node scripts/qa.mjs hub aurea        # só os grupos citados
 */

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3000';
const OUT = path.resolve('qa');

const ROUTES = [
  { group: 'hub', name: 'hub', url: '/' },
  { group: 'aurea', name: 'aurea', url: '/demo/aurea' },
  { group: 'vivace', name: 'vivace-home', url: '/demo/vivace' },
  { group: 'vivace', name: 'vivace-servicos', url: '/demo/vivace/servicos' },
  { group: 'vivace', name: 'vivace-sobre', url: '/demo/vivace/sobre' },
  { group: 'vivace', name: 'vivace-contato', url: '/demo/vivace/contato' },
  { group: 'oniria', name: 'oniria-home', url: '/demo/oniria' },
  { group: 'oniria', name: 'oniria-protocolos', url: '/demo/oniria/protocolos' },
  { group: 'oniria', name: 'oniria-protocolo-aurora', url: '/demo/oniria/protocolos/aurora' },
  { group: 'oniria', name: 'oniria-manifesto', url: '/demo/oniria/manifesto' },
  { group: 'oniria', name: 'oniria-equipe', url: '/demo/oniria/equipe' },
  { group: 'oniria', name: 'oniria-diario', url: '/demo/oniria/diario' },
  { group: 'oniria', name: 'oniria-agendar', url: '/demo/oniria/agendar' },
];

const VIEWPORTS = [
  { id: 'mobile', width: 390, height: 844, deviceScaleFactor: 2 },
  { id: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
];

/** Ruído conhecido do dev server do Next — não é defeito da página. */
const IGNORED = [
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  /react-devtools/i,
];

const filter = process.argv.slice(2);
const routes = filter.length ? ROUTES.filter((r) => filter.includes(r.group)) : ROUTES;

const results = [];

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  await fs.mkdir(path.join(OUT, viewport.id), { recursive: true });

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  });

  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (message) => {
      if (message.type() !== 'error' && message.type() !== 'warning') return;
      const text = message.text();
      if (IGNORED.some((re) => re.test(text))) return;
      consoleErrors.push(`[${message.type()}] ${text}`);
    });

    page.on('pageerror', (error) => consoleErrors.push(`[pageerror] ${error.message}`));

    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url().slice(0, 130)}`);
      }
    });

    let overflow = null;
    let error = null;

    try {
      await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle', timeout: 45_000 });
      // Deixa a sequência de entrada terminar.
      await page.waitForTimeout(1200);

      /* Rola a página inteira antes de capturar.
         `fullPage: true` NÃO rola de verdade, então o IntersectionObserver
         nunca dispara e todo reveal `whileInView` ficaria preso em opacity 0 —
         a captura mostraria seções em branco que na prática funcionam.
         Rolamos em passos de meia viewport, esperamos os reveals, e voltamos
         ao topo para o screenshot sair com a página no estado inicial. */
      await page.evaluate(async () => {
        /* Teto de passos: com `ScrollTrigger` + `pin` (a Oniria usa) a altura do
           documento infla muito, e um passo por meia viewport levaria minutos.
           40 passos cobrem qualquer página real deste projeto. */
        const MAX_STEPS = 40;
        const total = document.body.scrollHeight;
        const step = Math.max(Math.floor(window.innerHeight / 2), Math.ceil(total / MAX_STEPS));

        for (let y = 0; y < total; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 300));
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(700);

      overflow = await page.evaluate(() => {
        const el = document.documentElement;
        return {
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          overflows: el.scrollWidth > el.clientWidth + 1,
        };
      });

      await page.screenshot({
        path: path.join(OUT, viewport.id, `${route.name}.png`),
        fullPage: true,
      });
    } catch (thrown) {
      error = thrown.message;
    }

    results.push({
      viewport: viewport.id,
      route: route.url,
      name: route.name,
      error,
      overflow,
      consoleErrors,
      failedRequests,
    });

    await page.close();
  }

  await context.close();
}

await browser.close();

/* ------------------------------------------------------------------ */
/* Relatório                                                           */
/* ------------------------------------------------------------------ */

await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(results, null, 2));

let failures = 0;
for (const result of results) {
  const problems = [];
  if (result.error) problems.push(`ERRO: ${result.error}`);
  if (result.overflow?.overflows) {
    problems.push(
      `OVERFLOW horizontal: ${result.overflow.scrollWidth}px > ${result.overflow.clientWidth}px`
    );
  }
  for (const message of result.consoleErrors) problems.push(`CONSOLE ${message}`);
  for (const request of result.failedRequests) problems.push(`REDE ${request}`);

  const tag = `${result.viewport.padEnd(7)} ${result.name}`;
  if (problems.length === 0) {
    console.log(`  OK   ${tag}`);
  } else {
    failures += 1;
    console.log(`  FALHA ${tag}`);
    for (const problem of problems) console.log(`         ${problem}`);
  }
}

console.log(`\n${results.length - failures}/${results.length} rotas limpas.`);
console.log(`Screenshots em ${OUT}`);
process.exit(failures > 0 ? 1 : 0);
