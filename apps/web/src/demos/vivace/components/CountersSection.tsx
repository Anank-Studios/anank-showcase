import type { Stat } from '@anank/contracts';
import { Counter } from './Counter';

export function CountersSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-line md:grid-cols-4 md:divide-y-0">
        {stats.map((stat) => (
          <Counter key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
