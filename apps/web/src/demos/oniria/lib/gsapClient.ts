/**
 * Registro único do GSAP + ScrollTrigger para a Oniria.
 * GSAP só é usado nesta demo — ver specs/00-arquitetura.md.
 */
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
