import { Bricolage_Grotesque, Karla } from 'next/font/google';

/** Grotesca expressiva + humanista. Só `/demo/aurea` carrega. */

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
});

export const aureaFonts = `${bricolage.variable} ${karla.variable}`;
