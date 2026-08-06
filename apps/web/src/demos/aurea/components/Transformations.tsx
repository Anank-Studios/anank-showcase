import type { Demo } from '@anank/contracts';
import { Reveal } from './Reveal';
import { BeforeAfterSlider } from './BeforeAfterSlider';

const PAIRS: { before: string; after: string; title: string }[] = [
  { before: 'antes1', after: 'depois1', title: 'Mechas em 3 sessões' },
  { before: 'antes2', after: 'depois2', title: 'Coloração fantasia' },
  { before: 'antes3', after: 'depois3', title: 'Corte e reconstrução' },
];

export function Transformations({ demo }: { demo: Demo }) {
  return (
    <section
      id="transformacoes"
      className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-14 lg:py-28"
    >
      <Reveal>
        <p className="label-caps text-accent">Transformações</p>
        <h2 className="text-display mt-3 max-w-[18ch] text-[2rem] text-ink md:text-[2.5rem]">
          Antes &amp; depois
        </h2>
        <p className="mt-3 max-w-[46ch] text-base text-muted">
          Sem filtro, sem retoque. Arraste para ver.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {PAIRS.map((pair, index) => {
          const before = demo.images[pair.before];
          const after = demo.images[pair.after];
          if (!before || !after) return null;
          return (
            <Reveal key={pair.title} delay={index * 0.06}>
              <BeforeAfterSlider before={before} after={after} title={pair.title} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
