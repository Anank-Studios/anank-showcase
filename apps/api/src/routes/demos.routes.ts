import type { FastifyInstance } from 'fastify';
import type { DemoSummary } from '@anank/contracts';
import { isDemoSlug } from '@anank/contracts';
import { DEMOS } from '../data/index.js';
import { fail, ok } from '../lib/envelope.js';

const ORDER = ['aurea', 'vivace', 'oniria'] as const;

export async function demosRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/demos', async () => {
    const summaries: DemoSummary[] = ORDER.map((slug) => {
      const { demo } = DEMOS[slug];
      return {
        slug: demo.slug,
        index: demo.index,
        brandName: demo.brandName,
        category: demo.category,
        tagline: demo.tagline,
        priceRange: demo.priceRange,
        tokens: demo.tokens,
        thumbnail: demo.thumbnail,
        thumbnailWord: demo.thumbnailWord,
      };
    });
    return ok(summaries);
  });

  app.get<{ Params: { slug: string } }>('/api/demos/:slug', async (request, reply) => {
    const { slug } = request.params;
    if (!isDemoSlug(slug)) {
      return reply.code(404).send(fail('NOT_FOUND', 'Demonstração não encontrada.'));
    }
    return ok(DEMOS[slug].demo);
  });

  app.get<{ Params: { slug: string } }>('/api/demos/:slug/services', async (request, reply) => {
    const { slug } = request.params;
    if (!isDemoSlug(slug)) {
      return reply.code(404).send(fail('NOT_FOUND', 'Demonstração não encontrada.'));
    }
    return ok(DEMOS[slug].services);
  });

  app.get<{ Params: { slug: string } }>('/api/demos/:slug/testimonials', async (request, reply) => {
    const { slug } = request.params;
    if (!isDemoSlug(slug)) {
      return reply.code(404).send(fail('NOT_FOUND', 'Demonstração não encontrada.'));
    }
    return ok(DEMOS[slug].testimonials);
  });

  /** Aurea devolve [] — ausência de equipe é resposta válida, não erro. */
  app.get<{ Params: { slug: string } }>('/api/demos/:slug/team', async (request, reply) => {
    const { slug } = request.params;
    if (!isDemoSlug(slug)) {
      return reply.code(404).send(fail('NOT_FOUND', 'Demonstração não encontrada.'));
    }
    return ok(DEMOS[slug].team);
  });

  /** Diário editorial — só a Oniria tem. */
  app.get<{ Params: { slug: string } }>('/api/demos/:slug/articles', async (request, reply) => {
    const { slug } = request.params;
    if (!isDemoSlug(slug)) {
      return reply.code(404).send(fail('NOT_FOUND', 'Demonstração não encontrada.'));
    }
    return ok(DEMOS[slug].articles ?? []);
  });
}
