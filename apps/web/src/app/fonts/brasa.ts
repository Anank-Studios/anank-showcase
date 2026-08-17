import { Archivo, Archivo_Black } from 'next/font/google';

/**
 * BRASA — grotesca pesadíssima no display, a irmã de texto no corpo.
 *
 * UM MÓDULO POR MARCA, e isso é estrutural: quando as oito famílias do projeto
 * moravam em um `fonts.ts` só, o Next juntava todo o CSS num chunk comum e a
 * produção baixava 11 arquivos de fonte em qualquer rota. Em `next dev` o
 * problema não aparece — por isso nunca se mede peso de bundle em dev.
 *
 * Archivo Black é o contraponto direto da Instrument Serif do Forno: as duas
 * demos são do mesmo nicho e não podem parecer a mesma casa.
 */

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

export const brasaFonts = `${archivoBlack.variable} ${archivo.variable}`;
