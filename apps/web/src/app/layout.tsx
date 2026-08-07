import type { Metadata, Viewport } from 'next';
import {
  Bodoni_Moda,
  Bricolage_Grotesque,
  Geist,
  JetBrains_Mono,
  Karla,
  Manrope,
  Newsreader,
  Poppins,
} from 'next/font/google';
import '@/styles/globals.css';

/*
  Uma única passada de fontes para as 4 marcas. Cada escopo [data-brand]
  escolhe quais variáveis usar — ver src/styles/globals.css.

  As três demos usam CATEGORIAS TIPOGRÁFICAS DIFERENTES, não três serifas
  parecidas. Antes eram Fraunces + DM Serif Display + Bodoni Moda: todas
  serifas, e por isso as marcas pareciam parentes.

    Aurea   → grotesca expressiva (Bricolage) + humanista (Karla)
    Vivace  → serifa editorial de baixo contraste (Newsreader) + geométrica (Manrope)
    Oniria  → didone de contraste extremo (Bodoni Moda) + neutra (Geist)

  `Inter` foi removida do projeto: é a fonte-padrão de todo site gerado por IA
  e entrega o jogo na primeira olhada.
*/

/* ---- Anank Studios — tipografia oficial da marca (repo site-anank) ---- */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/* ---- Aurea ---- */
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

/* ---- Vivace ---- */
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

/* ---- Oniria ---- */
const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni-moda',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const fontVars = [
  poppins.variable,
  jetbrainsMono.variable,
  bricolage.variable,
  karla.variable,
  newsreader.variable,
  manrope.variable,
  bodoniModa.variable,
  geist.variable,
].join(' ');

export const metadata: Metadata = {
  title: 'Anank Studios',
  description:
    'Três demonstrações de sites para beleza e estética, do essencial bem-feito ao que se espera de uma marca de luxo. Portfólio da Anank Studios.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F7F7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
