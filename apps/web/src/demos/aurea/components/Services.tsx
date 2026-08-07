import Image from 'next/image';
import type { Service } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { Reveal } from './Reveal';
import { SERVICE_ICONS, ScissorsIcon } from './icons';

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
}

/**
 * Seis serviços vindos de `GET /api/demos/aurea/services`.
 *
 * Nada de grade 3×2 com cards idênticos — é o padrão mais reconhecível de
 * site gerado por IA (ver specs/10-demo-aurea.md). Em vez disso: um serviço
 * em destaque (foto de fundo cheia, a especialidade da casa) ao lado de uma
 * lista com filetes de 1px para os outros cinco — proporções diferentes,
 * hierarquia de verdade, sem repetir a mesma caixa seis vezes.
 */
export function Services({ services }: { services: Service[] }) {
  const featured = services.find((service) => service.slug === 'mechas') ?? services[0];
  const rest = services.filter((service) => service.id !== featured?.id);

  return (
    <section
      id="servicos"
      tabIndex={-1}
      className="mx-auto max-w-[1400px] px-6 py-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:px-10 lg:px-14 lg:py-28"
    >
      <Reveal>
        <p className="label-caps text-[#9d5d32]">Serviços</p>
        <h2 className="text-display mt-3 max-w-[18ch] text-[2rem] font-bold text-ink md:text-[2.5rem]">
          O que fazemos
        </h2>
        <p className="mt-3 max-w-[46ch] text-base text-[#75685e]">
          Seis serviços. Nenhum no piloto automático.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
        {featured && (
          <Reveal className="lg:sticky lg:top-28">
            <article className="group relative aspect-[4/5] overflow-hidden rounded-brand shadow-brand lg:aspect-[3/4]">
              <Image
                src={featured.image.url}
                alt={featured.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR.aurea}
                className="object-cover saturate-[1.05] transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(42_33_28_/_0.92)] from-0% via-[rgb(42_33_28_/_0.55)] via-55% to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-8">
                <p
                  className="text-[11px] font-medium text-[color:var(--brand-accent-2)] uppercase"
                  style={{ letterSpacing: '.16em' }}
                >
                  A especialidade da casa
                </p>
                <h3 className="font-display mt-2 text-3xl font-bold text-bg lg:text-4xl">
                  {featured.name}
                </h3>
                <p className="mt-2.5 max-w-[36ch] text-sm leading-relaxed text-[rgb(251_247_242_/_0.82)]">
                  {featured.summary}
                </p>
                <p className="mt-4 text-[13px] font-medium text-bg">
                  {featured.durationMin} min · a partir de {formatPrice(featured.priceFrom)}
                </p>
              </div>
            </article>
          </Reveal>
        )}

        <ul className="border-t border-line">
          {rest.map((service, index) => {
            const Icon = SERVICE_ICONS[service.icon ?? ''] ?? ScissorsIcon;
            return (
              <Reveal as="li" key={service.id} delay={index * 0.06} className="border-b border-line">
                <div className="group flex flex-col gap-2 py-6 transition-colors duration-250 sm:flex-row sm:items-center sm:gap-6">
                  <span className="font-display shrink-0 text-sm text-[#75685e] tabular-nums sm:w-9">
                    0{index + 2}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-5 shrink-0 text-accent" />
                      <h3 className="font-display text-xl font-semibold text-ink transition-colors duration-250 group-hover:text-accent sm:text-[22px]">
                        {service.name}
                      </h3>
                    </div>
                    <p className="mt-1.5 max-w-[42ch] pl-[30px] text-sm leading-relaxed text-[#75685e] sm:pl-0">
                      {service.summary}
                    </p>
                  </div>
                  <p className="pl-[30px] text-[13px] font-medium whitespace-nowrap text-ink sm:pl-0 sm:text-right">
                    {service.durationMin} min · a partir de {formatPrice(service.priceFrom)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
