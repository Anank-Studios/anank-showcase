import { getDemo } from '@/shared/lib/api';
import { FornoFooter } from './layout/FornoFooter';
import { SacolaPainel } from '@/demos/_alimentacao/SacolaPainel';

export async function FornoSacola() {
  const demo = await getDemo('forno');

  return (
    <>
      <section className="px-5 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-[color:var(--brand-accent)]">Sacola</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.0]">
            Fechar o pedido.
          </h1>

          <div className="mt-14">
            {/* `taxaEntrega` aqui e so a ESTIMATIVA de tela. Quem calcula a
                conta e o servidor, a partir de `DemoData.deliveryFee` -- o
                corpo do pedido nao leva preco nenhum. */}
            <SacolaPainel slug="forno" taxaEntrega={9} rotaCardapio="/demo/forno/cardapio" />
          </div>
        </div>
      </section>

      <FornoFooter demo={demo} />
    </>
  );
}
