import { aureaFonts } from '@/app/fonts/aurea';

/**
 * Só a Aurea carrega Bricolage Grotesque e Karla. O wrapper existe porque as
 * variáveis de `next/font` precisam morar num ancestral do `[data-brand]` que
 * as consome — pôr no layout raiz faria toda rota baixar as duas.
 */
export default function AureaLayout({ children }: { children: React.ReactNode }) {
  return <div className={aureaFonts}>{children}</div>;
}
