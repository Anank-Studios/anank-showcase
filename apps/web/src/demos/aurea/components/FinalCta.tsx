import type { Demo } from '@anank/contracts';
import { Reveal } from './Reveal';
import { whatsappLink } from '../lib/format';

export function FinalCta({ demo }: { demo: Demo }) {
  const wa = whatsappLink(demo.whatsapp, 'Oi! Vim pelo site do Aurea e quero agendar um horário.');

  return (
    <section className="bg-accent">
      <div className="mx-auto max-w-[1400px] px-6 py-20 text-center md:px-10 lg:px-14 lg:py-28">
        <Reveal>
          <h2 className="text-display text-[2rem] text-bg md:text-[2.75rem]">
            Sua próxima cor começa
            <br />
            com uma conversa.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-brand bg-bg px-8 py-4 text-sm font-medium text-accent transition-transform duration-250 hover:-translate-y-0.5"
          >
            Chamar no WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
