'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Service } from '@anank/contracts';
import { ensureGsap, gsap } from '../lib/gsapClient';
import { useReducedMotion } from '../lib/useReducedMotion';
import { OniriaLink } from './transition/OniriaLink';
import { BLUR } from '@/shared/lib/blur';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

/**
 * Os 5 protocolos. Desktop (≥1024px): `ScrollTrigger` com `pin: true` via
 * `gsap.matchMedia`, trilho traduzido em x. Abaixo de 1024px NÃO há pin —
 * vira um carrossel horizontal por scroll-snap normal. Pin em tela pequena
 * é o erro clássico que quebra a página.
 */
export function HorizontalProtocols({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return;

    ensureGsap();
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const distance = () => track.scrollWidth - section.clientWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <div ref={sectionRef} className="relative lg:overflow-hidden">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pl-[6vw] lg:w-max lg:snap-none lg:gap-0 lg:overflow-visible lg:pl-0"
      >
        {services.map((service, index) => (
          <article
            key={service.id}
            className="relative h-[78vh] w-[86vw] shrink-0 snap-center border-line lg:h-screen lg:w-screen lg:border-r"
          >
            <OniriaLink
              href={`/demo/oniria/protocolos/${service.slug}`}
              cursorLabel="VER"
              className="group block h-full w-full"
            >
              <div className="absolute inset-0">
                <Image
                  src={service.image.url}
                  alt={service.image.alt}
                  fill
                  sizes="(min-width: 1024px) 100vw, 86vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR.oniria}
                  style={{ viewTransitionName: `protocolo-${service.slug}` }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent"
                />
              </div>
              <div className="relative flex h-full flex-col justify-end p-6 sm:p-10">
                <span className="font-display text-3xl text-accent">{ROMAN[index] ?? ''}</span>
                <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95]">
                  {service.name}
                </h2>
                <p className="mt-3 max-w-md text-sm text-ink/80">{service.summary}</p>
              </div>
            </OniriaLink>
          </article>
        ))}
      </div>
    </div>
  );
}
