import Image from 'next/image';
import { IntentLink } from '@/shared/components/IntentLink';
import type { ImageRef } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { VIVACE_UNITS } from '../lib/units';
import { RevealItem } from './RevealItem';

export function UnitsSection({ images }: { images: Record<string, ImageRef> }) {
  return (
    <section id="unidades" className="border-t border-line bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        <p className="label-caps text-accent">Onde estamos</p>
        <h2 className="text-display mt-3 text-[32px]">Três unidades, um único padrão</h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {VIVACE_UNITS.map((unit, i) => {
            const image = images[unit.imageKey];
            return (
              <RevealItem key={unit.slug} index={i}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-brand bg-line">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 32vw, 92vw"
                      placeholder="blur"
                      blurDataURL={BLUR.vivace}
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <h3 className="text-display mt-5 text-[22px]">
                  {unit.city}
                  {unit.matriz ? (
                    <span className="ml-2 text-sm text-[#636e67]">(matriz)</span>
                  ) : null}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#636e67]">{unit.address}</p>
                <p className="mt-1 text-sm text-[#636e67]">{unit.phone}</p>
                <p className="mt-1 text-sm text-[#636e67]">{unit.hours}</p>
                <IntentLink
                  href="/demo/vivace/contato"
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Como chegar →
                </IntentLink>
              </RevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
