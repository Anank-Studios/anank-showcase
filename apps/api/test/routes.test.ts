import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../src/server.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('rotas de demos', () => {
  it('GET /api/demos devolve 3 itens na ordem aurea, vivace, oniria', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/demos' });
    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.error).toBeNull();
    expect(body.data).toHaveLength(3);
    expect(body.data.map((d: { slug: string }) => d.slug)).toEqual(['aurea', 'vivace', 'oniria']);
  });

  it('slug desconhecido devolve 404 NOT_FOUND em português', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/demos/inexistente' });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
    expect(response.json().error.message).toBe('Demonstração não encontrada.');
  });

  it('a Aurea devolve equipe vazia — ausência não é erro', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/demos/aurea/team' });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual([]);
  });

  it('toda imagem tem alt descritivo em pt-BR', async () => {
    for (const slug of ['aurea', 'vivace', 'oniria']) {
      const response = await app.inject({ method: 'GET', url: `/api/demos/${slug}` });
      const images: Record<string, { url: string; alt: string }> = response.json().data.images;
      for (const [key, image] of Object.entries(images)) {
        expect(image.url, `${slug}.${key}`).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
        expect(image.alt.length, `${slug}.${key} sem alt`).toBeGreaterThan(10);
      }
    }
  });
});

describe('POST /api/leads', () => {
  it('telefone com 9 dígitos é rejeitado com 422 em português', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: { demo: 'aurea', name: 'Ana Prado', phone: '119700411', source: 'contato' },
    });

    expect(response.statusCode).toBe(422);
    const error = response.json().error;
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toContainEqual({
      field: 'phone',
      message: 'Informe um telefone válido com DDD.',
    });
  });

  it('lead válido devolve 201 com o aviso de demonstração', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: {
        demo: 'aurea',
        name: 'Ana Prado',
        phone: '(11) 97004-1188',
        source: 'contato',
      },
    });

    expect(response.statusCode).toBe(201);
    const data = response.json().data;
    expect(data.id).toMatch(/^lead_/);
    expect(data.demoNotice).toBe('Demonstração. Nenhum lead foi armazenado.');
  });
});

describe('POST /api/booking', () => {
  /** Encontra um horário realmente livre, para o teste não depender de sorte. */
  async function findFreeSlot() {
    for (let day = 10; day <= 28; day++) {
      const date = `2026-08-${String(day).padStart(2, '0')}`;
      const response = await app.inject({
        method: 'GET',
        url: `/api/booking/availability?date=${date}&practitionerId=marina-aveline&protocolId=aurora`,
      });
      const slot = response
        .json()
        .data.slots.find((s: { available: boolean }) => s.available);
      if (slot) return { date, time: slot.time };
    }
    throw new Error('nenhum horário livre encontrado no período de teste');
  }

  it('payload inválido devolve 422 com details em português', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/booking',
      payload: {
        protocolId: 'aurora',
        practitionerId: 'marina-aveline',
        date: '2026-08-20',
        time: '14:30',
        name: 'A',
        email: 'nao-e-email',
        phone: '123',
        firstVisit: true,
      },
    });

    expect(response.statusCode).toBe(422);
    const fields = response.json().error.details.map((d: { field: string }) => d.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'phone']));
    for (const detail of response.json().error.details) {
      expect(detail.message).toMatch(/[áàâãéêíóôõúç]|Informe|Confira/i);
    }
  });

  it('agendamento válido devolve 201 no formato da Google Calendar API', async () => {
    const { date, time } = await findFreeSlot();

    const response = await app.inject({
      method: 'POST',
      url: '/api/booking',
      payload: {
        protocolId: 'aurora',
        practitionerId: 'marina-aveline',
        date,
        time,
        name: 'Vera Lucchesi',
        email: 'vera@exemplo.com.br',
        phone: '(11) 99208-7744',
        firstVisit: false,
      },
    });

    expect(response.statusCode).toBe(201);
    const event = response.json().data;

    expect(event.kind).toBe('calendar#event');
    expect(event.status).toBe('confirmed');
    expect(event.id).toHaveLength(26);
    expect(event.htmlLink).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/event\?eid=/);
    expect(event.summary).toBe('Protocolo Aurora · ONIRIA Clinic');
    expect(event.start.timeZone).toBe('America/Sao_Paulo');
    expect(event.end.timeZone).toBe('America/Sao_Paulo');
    expect(event.start.dateTime).toBe(`${date}T${time}:00-03:00`);
    expect(event.attendees).toHaveLength(2);
    expect(event.attendees[0].email).toBe('vera@exemplo.com.br');
    expect(event.conferenceData.conferenceSolution.name).toBe('ONIRIA Concierge');
    expect(event.demoNotice).toBe('Demonstração. Nenhum agendamento foi criado de fato.');
  });

  it('horário ocupado é recusado na revalidação do servidor', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/booking/availability?date=2026-08-20&practitionerId=marina-aveline&protocolId=aurora',
    });
    const taken = response
      .json()
      .data.slots.find((s: { available: boolean }) => !s.available);
    expect(taken, 'o mock deveria ter ao menos um horário ocupado').toBeDefined();

    const booking = await app.inject({
      method: 'POST',
      url: '/api/booking',
      payload: {
        protocolId: 'aurora',
        practitionerId: 'marina-aveline',
        date: '2026-08-20',
        time: taken.time,
        name: 'Vera Lucchesi',
        email: 'vera@exemplo.com.br',
        phone: '(11) 99208-7744',
        firstVisit: false,
      },
    });

    expect(booking.statusCode).toBe(422);
    expect(booking.json().error.message).toBe(
      'Este horário acabou de ser ocupado. Escolha outro.'
    );
  });
});
