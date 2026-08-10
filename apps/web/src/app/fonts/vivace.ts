import { Manrope, Newsreader } from 'next/font/google';

/** Serifa editorial de baixo contraste + geométrica. Só as rotas `/demo/vivace*`. */

const newsreader = Newsreader({
  subsets: ['latin'],
  /* Só `normal`: os dois itálicos do projeto são da Aurea e da Oniria.
     O itálico da Newsreader era arquivo baixado para nada. */
  style: ['normal'],
  variable: '--font-newsreader',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const vivaceFonts = `${newsreader.variable} ${manrope.variable}`;
