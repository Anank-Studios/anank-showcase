import type { Metadata } from 'next';
import { fornoFonts } from '@/app/fonts/forno';
import { FornoHeader } from '@/demos/forno/layout/FornoHeader';
import { SacolaProvider } from '@/demos/_alimentacao/sacola';

export const metadata: Metadata = {
  title: {
    template: '%s · Forno',
    default: 'Forno · Pizzaria napolitana',
  },
  description:
    'Demonstração fictícia da Anank Studios: site premium de pizzaria, com scroll-telling da montagem e pedido pelo site.',
};

/**
 * O `SacolaProvider` mora AQUI, e é o que faz o carrinho existir.
 *
 * Layout de rota não desmonta na navegação de cliente: ir do cardápio para a
 * sacola preserva o estado sem `localStorage` — proibido no projeto — e sem
 * nada persistido sobre quem visita. Recarregar zera, e a tela de sacola vazia
 * diz isso em vez de esconder.
 *
 * O escopo `data-brand` subiu da página para cá quando o Forno ganhou abas:
 * cabeçalho e rodapé também precisam dos tokens, e eles vivem no layout.
 *
 * Só o Forno carrega Instrument Serif e Sora — ver `app/fonts/`.
 */
export default function FornoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-brand="forno" className={`${fornoFonts} min-h-svh`}>
      <SacolaProvider>
        <FornoHeader />
        {children}
      </SacolaProvider>
    </div>
  );
}
