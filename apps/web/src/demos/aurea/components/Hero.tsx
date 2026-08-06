import Image from 'next/image';
import type { Demo } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { whatsappLink } from '../lib/format';
import { Reveal } from './Reveal';

export function Hero({ demo }: { demo: Demo }) {
  // Chave garantida por apps/api/src/data/aurea.ts — a demo sempre a inclui.
  const hero = demo.images.hero!;
  const wa = whatsappLink(demo.whatsapp, 'Oi! Vim pelo site do Aurea e quero agendar um horário.');

  return (
    <section id="topo" className="mx-auto max-w-[1400px] px-6 pt-10 pb-16 md:px-10 lg:px-14 lg:py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h1 className="text-display max-w-[14ch] text-ink">
              Seu cabelo merece um tempo bem gasto.
            </h1>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted">
              Corte, cor e cuidado feitos com calma, na Vila Madalena. Sem pressa, sem fórmula
              pronta.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-brand bg-accent px-6 py-3.5 text-center text-sm font-medium text-bg transition-[transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-brand"
              >
                Agendar no WhatsApp
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center justify-center rounded-brand border border-line px-6 py-3.5 text-center text-sm font-medium text-ink transition-colors duration-250 hover:border-accent hover:text-accent"
              >
                Ver serviços
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.06} className="relative">
          <div className="relative lg:-rotate-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-brand shadow-brand lg:aspect-[4/5]">
              <Image
                src={hero.url}
                alt={hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR.aurea}
                className="object-cover saturate-[1.05]"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 flex size-[104px] -translate-x-1/4 translate-y-1/4 flex-col items-center justify-center rounded-full bg-[color:var(--brand-accent-2)] text-center shadow-brand">
            <span className="font-display text-[13px] leading-tight text-ink">Vila Madalena</span>
            <span className="font-display text-[13px] leading-tight text-ink">desde 2019</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
