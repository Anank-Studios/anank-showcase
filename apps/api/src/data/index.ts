/**
 * Registro dos dados das 3 demos.
 *
 * Este arquivo pertence ao ORQUESTRADOR. Os subagentes editam apenas
 * `aurea.ts`, `vivace.ts` e `oniria.ts`, respeitando a forma `DemoData`
 * declarada em `shared.ts`.
 */

import type { DemoSlug } from '@anank/contracts';
import type { DemoData } from './shared.js';
import { aurea } from './aurea.js';
import { vivace } from './vivace.js';
import { oniria } from './oniria.js';
import { brasa } from './brasa.js';
import { kaiseki } from './kaiseki.js';
import { forno } from './forno.js';

export const DEMOS: Record<DemoSlug, DemoData> = { aurea, vivace, oniria, brasa, kaiseki, forno };

export { aurea, vivace, oniria, brasa, kaiseki, forno };
export type { DemoData };
export { unsplash, img } from './shared.js';
