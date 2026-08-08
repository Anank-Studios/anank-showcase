import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
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
import { parseTheme, THEME_COOKIE } from '@/shared/lib/theme';
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

/**
 * `themeColor` acompanha o tema escolhido. Fixo em off-white, a barra do
 * navegador no celular sairia clara com o hub escuro atrás — a emenda mais
 * visível que existe no mobile.
 *
 * Não dá para resolver com `prefers-color-scheme`: a escolha aqui é do
 * usuário, guardada em cookie, e não a do sistema operacional.
 */
export async function generateViewport(): Promise<Viewport> {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: theme === 'dark' ? '#060B08' : '#F7F7F7',
  };
}

/**
 * Ler o cookie aqui normalmente forçaria a aplicação inteira a renderizar
 * dinamicamente. Aqui não custa nada: as 14 rotas JÁ são `force-dynamic` — o
 * hub em `app/page.tsx` e as 13 demos em `app/demo/layout.tsx`. Nenhuma rota
 * perde otimização estática, porque nenhuma tinha.
 *
 * O tema sai já resolvido no HTML do servidor, e é por isso que não existe
 * flash de tema errado no carregamento.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="pt-BR" className={fontVars} data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
