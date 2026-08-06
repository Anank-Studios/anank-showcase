'use client';

import { useEffect, useRef } from 'react';
import { ensureGsap, gsap, ScrollTrigger } from '../lib/gsapClient';
import { splitIntoLines, restorePlainText } from '../lib/splitLines';
import { useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '@/shared/lib/cn';

type Tag = 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'blockquote';

interface SplitTextProps {
  text: string;
  as?: Tag;
  className?: string;
  /** 'scroll' anima quando entra na viewport (once); 'mount' anima ao montar. */
  trigger?: 'scroll' | 'mount';
  /** Só relevante com trigger="mount": espera este sinal ficar true. */
  active?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
}

const RESIZE_DEBOUNCE = 200;

/**
 * Revelação de texto linha a linha. Re-split no resize, aria-label no
 * container e aria-hidden nas linhas internas — ver lib/splitLines.ts.
 */
export function SplitText({
  text,
  as = 'p',
  className,
  trigger = 'scroll',
  active = true,
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
  start = 'top 85%',
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    if (reduced) {
      restorePlainText(el);
      el.textContent = text;
      gsap.set(el, { opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, duration: 0.2, delay }),
      });
      if (trigger === 'mount') gsap.to(el, { opacity: 1, duration: 0.2, delay });
      return () => st.kill();
    }

    ensureGsap();
    let scrollTrigger: ScrollTrigger | undefined;
    let alreadyPlayed = false;
    let resizeTimer: number | undefined;

    function build() {
      if (!el) return [] as HTMLElement[];
      const { lines } = splitIntoLines(el, text);
      gsap.set(lines, { yPercent: 100 });
      return lines;
    }

    function play(lines: HTMLElement[]) {
      alreadyPlayed = true;
      gsap.to(lines, {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
      });
    }

    let lines = build();

    if (trigger === 'mount') {
      play(lines);
    } else {
      scrollTrigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => play(lines),
      });
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        lines = build();
        // Se já tocou (ou dispara ao montar), reaplica o estado final sem re-animar.
        if (alreadyPlayed || trigger === 'mount') gsap.set(lines, { yPercent: 0 });
        if (scrollTrigger) {
          scrollTrigger.kill();
          if (!alreadyPlayed) {
            scrollTrigger = ScrollTrigger.create({
              trigger: el,
              start,
              once: true,
              onEnter: () => play(lines),
            });
          }
        }
      }, RESIZE_DEBOUNCE);
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      scrollTrigger?.kill();
    };
  }, [text, trigger, active, reduced, delay, stagger, duration, start]);

  const Tag = as as 'p';

  return (
    <Tag ref={ref as React.Ref<HTMLParagraphElement>} aria-label={text} className={cn(className)}>
      {text}
    </Tag>
  );
}
