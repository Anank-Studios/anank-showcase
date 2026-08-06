import type { FastifyInstance } from 'fastify';
import type { LeadResponse } from '@anank/contracts';
import { DEMO_NOTICE_LEAD } from '@anank/contracts';
import { leadSchema, toDetails } from '../schemas/index.js';
import { sleep } from '../services/calendar.mock.js';
import { fail, ok } from '../lib/envelope.js';

let counter = 0;

export async function leadsRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/leads', async (request, reply) => {
    const parsed = leadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .code(422)
        .send(fail('VALIDATION_ERROR', 'Confira os campos destacados.', toDetails(parsed.error)));
    }

    // Latência artificial: dá função aos estados de loading do formulário.
    await sleep(600);

    counter += 1;
    const response: LeadResponse = {
      id: `lead_${Date.now().toString(36)}_${counter.toString(36)}`,
      receivedAt: new Date().toISOString(),
      demoNotice: DEMO_NOTICE_LEAD,
    };

    // O lead NÃO é armazenado. Só ecoamos o recibo.
    return reply.code(201).send(ok(response));
  });
}
