import Image from 'next/image';
import type { Testimonial } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { Reveal } from './Reveal';
import { StarIcon } from './icons';

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 text-accent ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: rating }).map((_, starIndex) => (
        <StarIcon key={starIndex} className="size-3.5" />
      ))}
    </div>
  );
}

/**
 * Um depoimento em destaque como citação grande (a voz que carrega a prova
 * social), e o resto numa lista com filete — não três caixas idênticas
 * repetindo o mesmo peso visual.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [featured, ...rest] = testimonials;

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        <Reveal>
          <p className="label-caps text-[#9d5d32]">Depoimentos</p>
          <h2 className="text-display mt-3 max-w-[18ch] text-[2rem] font-bold text-ink md:text-[2.5rem]">
            Quem já sentou na cadeira
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {featured && (
            <Reveal>
              <span className="font-display block text-6xl leading-none text-[color:var(--brand-accent-2)]">
                &ldquo;
              </span>
              <Stars rating={featured.rating} className="mt-1" />
              <p className="font-display mt-4 max-w-[26ch] text-2xl leading-snug font-medium text-ink md:text-[28px]">
                {featured.quote}
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={featured.avatar.url}
                    alt={featured.avatar.alt}
                    fill
                    sizes="48px"
                    placeholder="blur"
                    blurDataURL={BLUR.aurea}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{featured.name}</p>
                  <p className="text-[13px] text-[#75685e]">{featured.service}</p>
                </div>
              </div>
            </Reveal>
          )}

          <ul className="divide-y divide-line border-t border-line lg:border-t-0 lg:border-l lg:pl-12">
            {rest.map((testimonial, index) => (
              <Reveal as="li" key={testimonial.id} delay={index * 0.06} className="py-6 first:pt-0 lg:first:pt-0">
                <div className="flex items-start gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar.url}
                      alt={testimonial.avatar.alt}
                      fill
                      sizes="40px"
                      placeholder="blur"
                      blurDataURL={BLUR.aurea}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">{testimonial.name}</p>
                      <span className="text-[#75685e]">·</span>
                      <p className="text-[13px] text-[#75685e]">{testimonial.service}</p>
                    </div>
                    <Stars rating={testimonial.rating} className="mt-1" />
                    <p className="mt-2 text-sm leading-relaxed text-[#75685e]">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
