import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { anankFonts } from './fonts';
import { parseTheme, THEME_COOKIE } from '@/shared/lib/theme';
import '@/styles/globals.css';

/*
  Só as duas fontes da Anank descem para todas as rotas — e elas descem porque
  são realmente necessárias em todas: o hub usa Poppins e JetBrains Mono, e o
  `DemoToggle`, que roda em TODA rota de demo, pede as duas explicitamente
  (`font-[family-name:var(--font-poppins)]` e `--font-jetbrains-mono`).

  As 6 fontes das marcas ficam nos layouts de cada demo. Ver `app/fonts.ts`.
*/

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
    <html lang="pt-BR" className={anankFonts} data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
