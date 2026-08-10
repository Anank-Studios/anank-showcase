import { JetBrains_Mono, Poppins } from 'next/font/google';

/*
  UM MÓDULO POR MARCA — e isso não é organização, é o que faz o corte funcionar.

  Antes as 8 famílias moravam num `fonts.ts` único. No dev parecia certo (4-5
  arquivos por rota), mas o build de produção juntava o CSS de todas num chunk
  compartilhado e emitia hint de preload para as 8: 11 arquivos e 289 kB em
  TODA rota, medido em produção. O split só existia na aparência.

  Com um módulo por marca, cada layout importa um arquivo diferente e o
  bundler consegue separar de verdade.
*/

/* Poppins sem o 300: `font-light` tem zero ocorrência no projeto. */
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

/* JetBrains sem o 500: os usos de `font-mono-brand` são só normal e bold. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/**
 * Desce para TODAS as rotas, e com razão: o hub usa as duas, e o `DemoToggle`
 * — presente nas 12 rotas de demo — pede as duas explicitamente.
 */
export const anankFonts = `${poppins.variable} ${jetbrainsMono.variable}`;
