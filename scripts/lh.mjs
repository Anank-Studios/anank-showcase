/**
 * Auditoria Lighthouse por rota.
 *
 *   node scripts/lh.mjs /demo/aurea
 *   node scripts/lh.mjs /demo/vivace /demo/vivace/servicos
 *   node scripts/lh.mjs --perf /demo/aurea      # inclui performance
 *
 * Por padrão roda só **acessibilidade, boas práticas e SEO**. Essas três são
 * baseadas no DOM, então medi-las no dev server é legítimo.
 *
 * **Performance NÃO é confiável em dev** (bundle sem minificar, HMR, source
 * maps). Só passe `--perf` rodando contra `pnpm build && pnpm start`.
 *
 * Relatório JSON completo em `qa/lighthouse/<rota>.json`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const args = process.argv.slice(2);
const withPerf = args.includes('--perf');
const routes = args.filter((a) => !a.startsWith('--'));

if (routes.length === 0) {
  console.error('Informe ao menos uma rota. Ex.: node scripts/lh.mjs /demo/aurea');
  process.exit(1);
}

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3000';
const OUT = path.resolve('qa/lighthouse');
await fs.mkdir(OUT, { recursive: true });

const categories = withPerf
  ? ['performance', 'accessibility', 'best-practices', 'seo']
  : ['accessibility', 'best-practices', 'seo'];

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});

let failures = 0;

for (const route of routes) {
  const url = `${BASE}${route}`;
  const result = await lighthouse(
    url,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: categories,
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1 },
        throttlingMethod: 'simulate',
      },
    }
  );

  const lhr = result.lhr;
  const name = route.replace(/^\//, '').replace(/\//g, '-') || 'hub';
  await fs.writeFile(path.join(OUT, `${name}.json`), JSON.stringify(lhr, null, 2));

  const scores = Object.fromEntries(
    Object.entries(lhr.categories).map(([key, cat]) => [key, Math.round((cat.score ?? 0) * 100)])
  );

  console.log(`\n=== ${route} ===`);
  for (const [key, score] of Object.entries(scores)) console.log(`  ${key}: ${score}`);

  /* Auditorias reprovadas de acessibilidade — é o que dá o que corrigir. */
  const a11yFails = Object.values(lhr.audits).filter(
    (audit) =>
      audit.score !== null &&
      audit.score < 1 &&
      lhr.categories.accessibility.auditRefs.some((ref) => ref.id === audit.id)
  );

  if (a11yFails.length) {
    failures += a11yFails.length;
    console.log('  --- acessibilidade a corrigir ---');
    for (const audit of a11yFails) {
      const items = audit.details?.items ?? [];
      console.log(`  • [${audit.id}] ${audit.title}`);
      for (const item of items.slice(0, 4)) {
        const selector = item.node?.selector ?? item.node?.snippet ?? '';
        if (selector) console.log(`      ${String(selector).slice(0, 150)}`);
      }
      if (items.length > 4) console.log(`      … e mais ${items.length - 4}`);
    }
  }
}

/* No Windows o chrome-launcher costuma falhar com EPERM ao apagar o próprio
   diretório temporário — o processo do Chrome ainda segura um handle. É ruído
   de limpeza, DEPOIS da auditoria já ter terminado. Sem este try/catch o
   script morre com stack trace e mascara o resultado real. */
try {
  await chrome.kill();
} catch (error) {
  if (error?.code !== 'EPERM') throw error;
}

console.log(
  `\n${failures === 0 ? 'Nenhuma auditoria de acessibilidade reprovada.' : `${failures} auditoria(s) de acessibilidade a corrigir.`}`
);
process.exit(failures > 0 ? 1 : 0);
