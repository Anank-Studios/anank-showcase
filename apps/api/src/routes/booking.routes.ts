import type { FastifyInstance } from 'fastify';
import {
  buildCalendarEvent,
  getAvailability,
  getMonth,
  getPractitioners,
  isSlotAvailable,
} from '../services/availability.js';
import { availabilityLatency, sleep } from '../services/calendar.mock.js';
import {
  availabilityQuerySchema,
  bookingSchema,
  monthQuerySchema,
  toDetails,
} from '../schemas/index.js';
import { fail, ok } from '../lib/envelope.js';

export async function bookingRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/booking/practitioners', async () => ok(getPractitioners()));

  app.get('/api/booking/month', async (request, reply) => {
    const parsed = monthQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply
        .code(422)
        .send(fail('VALIDATION_ERROR', 'Parâmetros inválidos.', toDetails(parsed.error)));
    }
    await sleep(250);
    return ok(getMonth(parsed.data));
  });

  app.get('/api/booking/availability', async (request, reply) => {
    const parsed = availabilityQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply
        .code(422)
        .send(fail('VALIDATION_ERROR', 'Parâmetros inválidos.', toDetails(parsed.error)));
    }
    // Latência artificial: dá função ao skeleton shimmer do front. Não remover.
    await sleep(availabilityLatency(parsed.data.date));
    return ok(getAvailability(parsed.data));
  });

  app.post('/api/booking', async (request, reply) => {
    const parsed = bookingSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .code(422)
        .send(fail('VALIDATION_ERROR', 'Confira os campos destacados.', toDetails(parsed.error)));
    }

    await sleep(900);

    const input = parsed.data;
    if (!isSlotAvailable(input.date, input.time, input.practitionerId, input.protocolId)) {
      return reply
        .code(422)
        .send(
          fail('VALIDATION_ERROR', 'Este horário acabou de ser ocupado. Escolha outro.', [
            { field: 'time', message: 'Este horário acabou de ser ocupado. Escolha outro.' },
          ])
        );
    }

    // Gerado em memória e devolvido. Nada é persistido.
    return reply.code(201).send(ok(buildCalendarEvent(input)));
  });
}
