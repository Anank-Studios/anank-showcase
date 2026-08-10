import { IntentLink } from '@/shared/components/IntentLink';
import { getDemo, getServices, getTeam, getTestimonials } from '@/shared/lib/api';
import { pickImage } from './lib/images';
import { VivaceChrome } from './layout/VivaceChrome';
import { HeroSection } from './components/HeroSection';
import { CountersSection } from './components/CountersSection';
import { TreatmentsCarousel } from './components/TreatmentsCarousel';
import { DifferentialsSection } from './components/DifferentialsSection';
import { TeamCarousel } from './components/TeamCarousel';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { UnitsSection } from './components/UnitsSection';
import { CtaBand } from './components/CtaBand';

/**
 * PONTO DE ENTRADA da demo — o orquestrador importa este componente em
 * `app/demo/...`. O nome e a assinatura NÃO podem mudar.
 */
export async function VivaceHome() {
  const [demo, services, team, testimonials] = await Promise.all([
    getDemo('vivace'),
    getServices('vivace'),
    getTeam('vivace'),
    getTestimonials('vivace'),
  ]);

  return (
    <VivaceChrome demo={demo}>
      <HeroSection image={pickImage(demo.images, 'hero')} />

      <CountersSection stats={demo.stats ?? []} />

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-14 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <h2 className="text-display text-[32px]">Tratamentos</h2>
          <IntentLink
            href="/demo/vivace/servicos"
            className="whitespace-nowrap text-sm font-medium text-accent hover:underline"
          >
            Ver todos os serviços →
          </IntentLink>
        </div>
        <div className="mt-10">
          <TreatmentsCarousel services={services.slice(0, 6)} />
        </div>
      </section>

      <DifferentialsSection images={demo.images} />

      <section className="border-t border-line bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
          <p className="label-caps text-accent">Quem cuida</p>
          <h2 className="text-display mt-3 text-[32px]">Corpo clínico</h2>
          <div className="mt-10">
            <TeamCarousel team={team} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
          <h2 className="text-display text-center text-[32px]">O que dizem nossas pacientes</h2>
          <div className="mt-12">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      <UnitsSection images={demo.images} />

      <CtaBand />
    </VivaceChrome>
  );
}
