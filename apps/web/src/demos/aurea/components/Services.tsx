import type { Service } from '@anank/contracts';
import { Reveal } from './Reveal';
import { SERVICE_ICONS, ScissorsIcon } from './icons';

/** Seis serviços vindos de `GET /api/demos/aurea/services`. */
export function Services({ services }: { services: Service[] }) {
  return (
    <section id="servicos" className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-14 lg:py-28">
      <Reveal>
        <p className="label-caps text-accent">Serviços</p>
        <h2 className="text-display mt-3 max-w-[18ch] text-[2rem] text-ink md:text-[2.5rem]">
          O que fazemos
        </h2>
        <p className="mt-3 max-w-[46ch] text-base text-muted">
          Seis serviços. Nenhum no piloto automático.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = SERVICE_ICONS[service.icon ?? ''] ?? ScissorsIcon;
          return (
            <Reveal key={service.id} delay={(index % 3) * 0.06}>
              <article className="group h-full rounded-brand border border-line bg-surface p-7 shadow-none transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-1 hover:border-accent hover:shadow-brand">
                <Icon className="size-6 text-accent" />
                <h3 className="font-display mt-5 text-xl text-ink">{service.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{service.summary}</p>
                <p className="mt-6 text-[13px] font-medium text-ink">
                  {service.durationMin} min · a partir de{' '}
                  {service.priceFrom.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                  })}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
