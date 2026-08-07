import type { Stat } from '@anank/contracts';
import { Reveal } from './Reveal';

/** Faixa de confiança: 4 itens vindos de `demo.stats`. 2×2 no mobile, 4 colunas no desktop. */
export function TrustBar({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="Números do Aurea" className="border-y border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 0.06}
            className="border-line px-6 py-8 text-center [&:not(:nth-child(2n))]:border-r md:border-r md:px-4 md:py-10 md:last:border-r-0"
          >
            {/* `break-words` é a rede de segurança: mesmo que um valor longo
                volte aos dados, ele quebra em vez de estourar a coluna. */}
            <p className="font-display text-2xl break-words text-ink md:text-3xl">{stat.value}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-[#75685e]">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
