import { cookies } from 'next/headers';
import { HubIntro } from '@/shared/components/HubIntro';
import { getDemos } from '@/shared/lib/api';
import { parseTheme, THEME_COOKIE } from '@/shared/lib/theme';

/**
 * Renderização dinâmica: os dados vêm do backend em tempo de requisição.
 * Sem isto, o `next build` tentaria prerenderizar e exigiria a API no ar
 * durante o build — o que quebraria a separação front/back.
 */
export const dynamic = 'force-dynamic';

export default async function HubPage() {
  const [demos, cookieStore] = await Promise.all([getDemos(), cookies()]);
  /* O mesmo cookie que o layout raiz já usou para pintar o <html>. Aqui ele
     serve só para o toggle nascer no estado certo, sem piscar. */
  const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <div data-brand="anank" className="min-h-svh">
      <HubIntro demos={demos} theme={theme} />
    </div>
  );
}
