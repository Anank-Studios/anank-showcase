import { Shippori_Mincho, Zen_Kaku_Gothic_New } from 'next/font/google';

/**
 * KAISEKI — mincho de verdade no display, gotica japonesa no corpo.
 *
 * UM MODULO POR MARCA, e isso e estrutural: com as familias todas em um
 * `fonts.ts` unico, o Next juntava o CSS num chunk comum e a producao baixava
 * 11 arquivos de fonte em qualquer rota. Em `next dev` o problema nao aparece
 * — por isso nunca se mede peso de bundle em dev.
 *
 * Shippori Mincho e uma serifa JAPONESA, nao uma didone europeia: separa esta
 * marca da Bodoni da Oniria e da Instrument do Forno sem depender da cor.
 * Ambas trazem latino completo, entao nao ha risco de fallback no texto em
 * portugues.
 */

const mincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mincho',
  display: 'swap',
});

const zen = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-zen',
  display: 'swap',
});

export const kaisekiFonts = `${mincho.variable} ${zen.variable}`;
