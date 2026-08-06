import { HubIntro } from '@/shared/components/HubIntro';
import { getDemos } from '@/shared/lib/api';

/**
 * Renderização dinâmica: os dados vêm do backend em tempo de requisição.
 * Sem isto, o `next build` tentaria prerenderizar e exigiria a API no ar
 * durante o build — o que quebraria a separação front/back.
 */
export const dynamic = 'force-dynamic';

export default async function HubPage() {
  const demos = await getDemos();

  return (
    <div data-brand="anank" className="min-h-svh">
      <HubIntro demos={demos} />
    </div>
  );
}
