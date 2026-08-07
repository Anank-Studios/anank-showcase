import Image from 'next/image';
import type { Testimonial } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { Reveal } from './Reveal';
import { StarIcon } from './icons';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        <Reveal>
          <p className="label-caps text-[#9d5d32]">Depoimentos</p>
          <h2 className="text-display mt-3 max-w-[18ch] text-[2rem] text-ink md:text-[2.5rem]">
            Quem já sentou na cadeira
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.06}>
              <article className="h-full rounded-brand border border-line bg-bg p-7">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <StarIcon key={starIndex} className="size-4" />
                  ))}
                </div>
                <p className="font-display mt-4 text-[17px] leading-snug text-ink">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar.url}
                      alt={testimonial.avatar.alt}
                      fill
                      sizes="44px"
                      placeholder="blur"
                      blurDataURL={BLUR.aurea}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{testimonial.name}</p>
                    <p className="text-[13px] text-[#75685e]">{testimonial.service}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
