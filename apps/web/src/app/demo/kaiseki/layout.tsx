import type { Metadata } from 'next';
import { kaisekiFonts } from '@/app/fonts/kaiseki';
import { KaisekiHeader } from '@/demos/kaiseki/layout/KaisekiHeader';
import { SacolaProvider } from '@/demos/_alimentacao/sacola';

export const metadata: Metadata = {
  title: {
    template: '%s · Kaiseki',
    default: 'Kaiseki · Cozinha japonesa',
  },
  description:
    'Demonstração fictícia da Anank Studios: site de restaurante japonês com cardápio e pedido pelo site.',
};

/**
 * O `SacolaProvider` mora AQUI, e é o que faz o carrinho existir.
 *
 * Layout de rota não desmonta na navegação de cliente: ir do cardápio para a
 * sacola preserva o estado sem `localStorage` — que é proibido no projeto — e
 * sem nada persistido sobre quem visita. Recarregar a página zera, e essa é a
 * escolha honesta para uma demonstração.
 *
 * O escopo `data-brand` também vive no layout porque cabeçalho e rodapé
 * precisam dos tokens da marca.
 */
export default function KaisekiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-brand="kaiseki" className={`${kaisekiFonts} min-h-svh`}>
      <SacolaProvider>
        <KaisekiHeader />
        {children}
      </SacolaProvider>
    </div>
  );
}
