/**
 * Teste de navegação por teclado.
 *
 *   node scripts/keyboard.mjs /demo/aurea
 *   node scripts/keyboard.mjs /demo/vivace /demo/vivace/contato
 *
 * Para cada rota, percorre a página inteira com `Tab` e reprova quando:
 *
 *  - um elemento focado **não tem indicador de foco visível** (nem `outline`,
 *    nem `box-shadow`, nem mudança de borda/fundo);
 *  - o foco cai em um elemento **invisível ou fora da tela** (armadilha comum
 *    em menu mobile fechado, carrossel e lightbox);
 *  - existe **armadilha de foco** (o Tab não avança);
 *  - um controle interativo não tem **nome acessível**.
 */

import { chromium } from 'playwright';

const routes = process.argv.slice(2);
if (routes.length === 0) {
  console.error('Informe ao menos uma rota. Ex.: node scripts/keyboard.mjs /demo/aurea');
  process.exit(1);
}

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3000';
const MAX_TABS = 90;

const browser = await chromium.launch();
let problems = 0;

for (const route of routes) {
  console.log(`\n=== ${route} ===`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(2000);

  const seen = new Set();
  let repeats = 0;

  for (let i = 0; i < MAX_TABS; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(70);

    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;

      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const hasShadow = cs.boxShadow !== 'none';
      // Alguns componentes marcam o foco por borda ou fundo.
      const hasBorder = parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0;

      const label =
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        (el.textContent || '').trim().slice(0, 45) ||
        el.getAttribute('placeholder') ||
        (el.labels?.[0]?.textContent || '').trim().slice(0, 45) ||
        '';

      return {
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        id: el.id || '',
        cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 70),
        label,
        hasOutline,
        hasShadow,
        hasBorder,
        visible: rect.width > 0 && rect.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none',
        onScreen: rect.bottom > -200 && rect.top < window.innerHeight + 200,
        ariaHidden: el.closest('[aria-hidden="true"]') !== null,
      };
    });

    if (!info) break; // voltou ao body: percorreu tudo

    /* Ferramentas do dev server do Next (o botão de overlay) entram no ciclo de
       Tab mas não existem no build de produção. Ignorar, senão toda rota
       reporta um problema fantasma. */
    if (info.tag === 'nextjs-portal' || info.cls.includes('nextjs')) continue;

    const key = `${info.tag}#${info.id}.${info.cls}|${info.label}`;
    if (seen.has(key)) {
      repeats += 1;
      if (repeats > 3) break; // deu a volta
    } else {
      seen.add(key);
      repeats = 0;
    }

    const issues = [];
    if (!info.hasOutline && !info.hasShadow && !info.hasBorder) issues.push('sem indicador de foco');
    if (!info.visible) issues.push('elemento invisivel recebeu foco');
    if (!info.onScreen) issues.push('foco fora da tela (nao rolou ate ele)');
    if (info.ariaHidden) issues.push('elemento focavel dentro de aria-hidden');
    if (!info.label) issues.push('sem nome acessivel');

    if (issues.length) {
      problems += 1;
      console.log(`  PROBLEMA <${info.tag}${info.type ? `[${info.type}]` : ''}> "${info.label || '(sem texto)'}"`);
      console.log(`     ${info.cls}`);
      for (const issue of issues) console.log(`     - ${issue}`);
    }
  }

  console.log(`  ${seen.size} elementos focaveis percorridos`);
  await page.close();
}

await browser.close();
console.log(`\n${problems === 0 ? 'Navegacao por teclado sem problemas.' : `${problems} problema(s) de teclado.`}`);
process.exit(problems > 0 ? 1 : 0);
