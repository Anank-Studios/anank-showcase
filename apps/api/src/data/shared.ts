/**
 * Tipos e helpers compartilhados pelos módulos de dados das demos.
 * Arquivo do ORQUESTRADOR — subagentes importam, não editam.
 */

import type {
  Article,
  Demo,
  ImageRef,
  Menu,
  Practitioner,
  Service,
  TeamMember,
  Testimonial,
} from '@anank/contracts';

export interface DemoData {
  demo: Demo;
  services: Service[];
  testimonials: Testimonial[];
  team: TeamMember[];
  /** Somente a Oniria usa. */
  practitioners?: Practitioner[];
  /** Somente a Oniria usa (o diário). */
  articles?: Article[];
  /** Nicho alimentação: cardápio. A hamburgueria tem cardápio mas não vende. */
  menu?: Menu;
  /** `false` na hamburgueria, que é apenas informativa. */
  acceptsOrders?: boolean;
  /** Taxa de entrega em reais. Ausente quando a casa não entrega. */
  deliveryFee?: number;
}

/**
 * Monta a URL de uma foto do Unsplash.
 * Todo `id` usado no projeto foi validado com HTTP 200 — ver specs/01-design-tokens.md.
 */
export function unsplash(id: string, width = 1600, quality = 80): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Açúcar para declarar uma imagem com alt obrigatório em pt-BR. */
export function img(id: string, alt: string, width = 1600): ImageRef {
  return { url: unsplash(id, width), alt, credit: 'Unsplash' };
}
