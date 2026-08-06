import { getDemo, getServices, getTestimonials } from '@/shared/lib/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Services } from './components/Services';
import { Transformations } from './components/Transformations';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Location } from './components/Location';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

/**
 * PONTO DE ENTRADA da demo — o orquestrador importa este componente em
 * `app/demo/...`. O nome e a assinatura NÃO podem mudar.
 *
 * Landing page única, scroll vertical, 10 seções — ver specs/10-demo-aurea.md.
 */
export async function AureaHome() {
  const [demo, services, testimonials] = await Promise.all([
    getDemo('aurea'),
    getServices('aurea'),
    getTestimonials('aurea'),
  ]);

  return (
    <div data-brand="aurea" className="min-h-svh">
      <Header demo={demo} />
      <main>
        <Hero demo={demo} />
        <TrustBar stats={demo.stats ?? []} />
        <Services services={services} />
        <Transformations demo={demo} />
        <About demo={demo} />
        <Testimonials testimonials={testimonials} />
        <Location demo={demo} services={services} />
        <FinalCta demo={demo} />
      </main>
      <Footer demo={demo} />
    </div>
  );
}
