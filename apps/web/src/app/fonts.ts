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

/*
  As fontes ficam AQUI, não no layout raiz, porque cada rota carrega só as suas.

  Antes as 8 famílias das 4 marcas viviam no layout raiz e desciam para toda
  rota: 367 kB em 13 arquivos, em toda página. A Aurea baixava Bodoni Moda e
  Newsreader sem usar uma letra sequer.

  Agora:
    raiz          Poppins + JetBrains Mono   (hub e o DemoToggle, que roda em
                                              TODA rota de demo e pede as duas
                                              explicitamente)
    /demo/aurea   + Bricolage + Karla
    /demo/vivace  + Newsreader + Manrope
    /demo/oniria  + Bodoni Moda + Geist

  As três demos usam CATEGORIAS TIPOGRÁFICAS DIFERENTES, não três serifas
  parecidas — é o que impede que pareçam a mesma marca. `Inter` está fora do
  projeto de propósito: é a fonte-padrão de todo site gerado por IA.
*/

/* ---- Anank Studios — em todas as rotas ---------------------------------- */

export const poppins = Poppins({
  subsets: ['latin'],
  /* Sem o 300: `font-light` tem zero ocorrência no projeto — era um arquivo
     baixado à toa em toda página. */
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  /* Sem o 500: os usos de `font-mono-brand` são só peso normal e bold. */
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const anankFonts = `${poppins.variable} ${jetbrainsMono.variable}`;

/* ---- Aurea — grotesca expressiva + humanista ---------------------------- */

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

/* ---- Vivace — serifa editorial de baixo contraste + geométrica ---------- */

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

/* ---- Oniria — didone de contraste extremo + neutra ---------------------- */

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  /* Itálico FICA: a citação da home da Oniria usa `font-display italic`, e
     numa didone o itálico sintetizado pelo navegador fica grotesco. */
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
