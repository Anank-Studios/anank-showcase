import Image from 'next/image';
import type { Demo, Service } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { Reveal } from './Reveal';
import { ContactForm } from './ContactForm';
import { MarkerIcon } from './icons';

export function Location({ demo, services }: { demo: Demo; services: Service[] }) {
  // Chave garantida por apps/api/src/data/aurea.ts — a demo sempre a inclui.
  const fachada = demo.images.fachada!;

  return (
    <section
      id="contato"
      className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-14 lg:py-28"
    >
      <Reveal>
        <p className="label-caps text-accent">Contato</p>
        <h2 className="text-display mt-3 max-w-[18ch] text-[2rem] text-ink md:text-[2.5rem]">
          Onde estamos
        </h2>
        <p className="mt-3 max-w-[46ch] text-base text-muted">
          Vila Madalena, perto do metrô. Estacionamento no local, sem custo.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal delay={0.06}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-brand shadow-brand">
            <Image
              src={fachada.url}
              alt={fachada.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR.aurea}
              className="object-cover saturate-[1.05]"
            />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[120%] flex-col items-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-bg shadow-brand">
                <MarkerIcon className="size-6" />
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">Rua Harmonia, 742 · Vila Madalena</p>
        </Reveal>

        <Reveal delay={0.12} className="space-y-10">
          <div>
            <h3 className="font-display text-xl text-ink">Endereço e horários</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{demo.address}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              <a href={`tel:${demo.phone.replace(/\D/g, '')}`} className="hover:text-accent">
                {demo.phone}
              </a>
            </p>

            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              {demo.hours.map((hour) => (
                <div key={hour.day} className="flex items-center justify-between py-2.5">
                  <dt className="text-muted">{hour.day}</dt>
                  <dd className="font-medium text-ink">{hour.open}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="font-display text-xl text-ink">Fale com a gente</h3>
            <p className="mt-2 text-sm text-muted">
              Deixa seu contato que a Bruna responde pessoalmente.
            </p>
            <div className="mt-6">
              <ContactForm services={services} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
