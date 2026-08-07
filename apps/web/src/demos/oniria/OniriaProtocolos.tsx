import Image from 'next/image';
import { getDemo, getServices } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';
import { OniriaLink } from './components/transition/OniriaLink';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

/**
 * Grade editorial assimétrica: colunas de larguras e alturas diferentes, com
 * deslocamento vertical alternado. O hover desatura os irmãos via `:has()`
 * puro em CSS — sem estado React, sem re-render.
 */
export async function OniriaProtocolos() {
  const [demo, services] = await Promise.all([getDemo('oniria'), getServices('oniria')]);

  /* Cada protocolo recebe uma "receita" de layout própria. É isso que faz a
     grade parecer editorial em vez de um grid regular com gap. */
  const layout = [
    { span: 'lg:col-span-7', ratio: 'aspect-[4/5]', offset: '' },
    { span: 'lg:col-span-5', ratio: 'aspect-[3/4]', offset: 'lg:mt-24' },
    { span: 'lg:col-span-5', ratio: 'aspect-[3/4]', offset: 'lg:-mt-12' },
    { span: 'lg:col-span-7', ratio: 'aspect-[16/10]', offset: 'lg:mt-16' },
    {
      span: 'lg:col-span-8 lg:col-start-3',
      ratio: 'aspect-[16/9]',
      offset: 'lg:mt-8',
    },
  ];

  return (
    <div className="relative">
      <OniriaNav />

      <main>
        <section className="px-5 pt-40 pb-16 md:px-10 md:pt-52 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="label-caps text-accent">Cinco protocolos</p>
            <SplitText
              text="Cada um resolve uma coisa. Nenhum resolve tudo."
              as="h1"
              className="mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,9vw,6rem)] leading-[0.96]"
            />
          </div>
        </section>

        <section className="px-5 pb-28 md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12 [&:has(a:hover)_a:not(:hover)]:opacity-45 [&:has(a:hover)_a:not(:hover)]:grayscale">
            {services.map((service, index) => {
              const shape = layout[index] ?? layout[0]!;
              return (
                <OniriaLink
                  key={service.id}
                  href={`/demo/oniria/protocolos/${service.slug}`}
                  cursorLabel="VER"
                  className={`group block transition-[opacity,filter] duration-400 ${shape.span} ${shape.offset}`}
                >
                  <div className={`relative w-full overflow-hidden ${shape.ratio}`}>
                    <Image
                      src={service.image.url}
                      alt={service.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR.oniria}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      /* Elemento compartilhado: este nome reaparece no hero da
                       página de detalhe, e a View Transitions API faz a ponte. */
                      style={{
                        viewTransitionName: `protocolo-${service.slug}`,
                      }}
                    />
                  </div>

                  <div className="mt-5 flex items-baseline gap-4">
                    <span className="font-display text-lg text-accent">{ROMAN[index] ?? ''}</span>
                    <div>
                      <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-tight">
                        {service.name}
                      </h2>
                      <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted">
                        {service.summary}
                      </p>
                      <p className="label-caps mt-3 text-muted">
                        {service.durationMin} min · a partir de R${' '}
                        {service.priceFrom.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </OniriaLink>
              );
            })}
          </div>
        </section>
      </main>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
