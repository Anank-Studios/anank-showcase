import { Instrument_Serif, Sora } from 'next/font/google';

/**
 * FORNO — serifa de display com muito contraste + geométrica no corpo.
 * Categoria diferente das outras quatro marcas de propósito: a pizzaria não
 * pode parecer parente do instituto de estética.
 */

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const fornoFonts = `${instrument.variable} ${sora.variable}`;
