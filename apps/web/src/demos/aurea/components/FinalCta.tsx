import type { Demo } from '@anank/contracts';
import { Reveal } from './Reveal';
import { whatsappLink } from '../lib/format';

export function FinalCta({ demo }: { demo: Demo }) {
  const wa = whatsappLink(demo.whatsapp, 'Oi! Vim pelo site do Aurea e quero agendar um horário.');

  return (
    <section className="bg-accent">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-20 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:py-24">
        <Reveal>
          <h2 className="text-display max-w-[13ch] text-[2rem] font-bold text-bg md:text-[2.75rem]">
            Sua próxima cor começa
            <br />
            com uma conversa.
          </h2>
        </Reveal>
        <Reveal delay={0.06} className="lg:shrink-0">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-brand bg-bg px-8 py-4 text-sm font-medium text-[#9d5d32] transition-transform duration-250 hover:-translate-y-0.5"
          >
            Chamar no WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
