import { getDemo } from '@/shared/lib/api';
import { KaisekiFooter } from './layout/KaisekiFooter';
import { SacolaPainel } from './components/SacolaPainel';

export async function KaisekiSacola() {
  const demo = await getDemo('kaiseki');

  return (
    <>
      <section className="px-5 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            Sacola
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.04]">
            Fechar o pedido.
          </h1>

          <div className="mt-14">
            <SacolaPainel />
          </div>
        </div>
      </section>

      <KaisekiFooter demo={demo} />
    </>
  );
}
