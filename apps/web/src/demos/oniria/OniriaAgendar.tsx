import { getDemo, getPractitioners, getServices } from '@/shared/lib/api';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { BookingFlow } from './components/agendar/BookingFlow';

export async function OniriaAgendar() {
  const [demo, services, practitioners] = await Promise.all([
    getDemo('oniria'),
    getServices('oniria'),
    getPractitioners(),
  ]);

  return (
    <div className="relative">
      <OniriaNav />

      <section className="px-5 pt-40 pb-12 md:px-10 md:pt-52 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-accent">Agendar</p>
          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.25rem,9vw,5.5rem)] leading-[0.96]">
            Quatro passos. Nenhum formulário longo.
          </h1>
        </div>
      </section>

      <section className="px-5 pb-28 md:px-10 lg:px-14">
        <BookingFlow services={services} practitioners={practitioners} />
      </section>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
