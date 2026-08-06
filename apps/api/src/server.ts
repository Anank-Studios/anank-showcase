import Fastify from 'fastify';
import cors from '@fastify/cors';
import { demosRoutes } from './routes/demos.routes.js';
import { bookingRoutes } from './routes/booking.routes.js';
import { leadsRoutes } from './routes/leads.routes.js';
import { fail, ok } from './lib/envelope.js';

const PORT = Number(process.env.PORT ?? 3333);
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000';

export async function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : { level: 'info' },
  });

  await app.register(cors, {
    origin: [WEB_ORIGIN, 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  app.get('/api/health', async () => ok({ ok: true, uptime: process.uptime() }));

  await app.register(demosRoutes);
  await app.register(bookingRoutes);
  await app.register(leadsRoutes);

  app.setNotFoundHandler((_request, reply) => {
    reply.code(404).send(fail('NOT_FOUND', 'Rota não encontrada.'));
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.code(500).send(fail('INTERNAL', 'Erro interno do servidor.'));
  });

  return app;
}

const isDirectRun = process.argv[1]?.includes('server');

if (isDirectRun) {
  const app = await buildServer();
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`API da Anank Showcase em http://localhost:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}
