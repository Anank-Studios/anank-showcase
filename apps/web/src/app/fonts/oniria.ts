import { Bodoni_Moda, Geist } from 'next/font/google';

/** Didone de contraste extremo + neutra silenciosa. Só as rotas `/demo/oniria*`. */

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  /* Itálico FICA: a citação da home usa `font-display italic`, e numa didone o
     itálico sintetizado pelo navegador fica grotesco. */
  style: ['normal', 'italic'],
  variable: '--font-bodoni-moda',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const oniriaFonts = `${bodoniModa.variable} ${geist.variable}`;
