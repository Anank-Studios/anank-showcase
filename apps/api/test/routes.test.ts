import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../src/server.js';
import { LEAD_TIME_DAYS } from '../src/services/calendar.mock.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('rotas de demos', () => {
  it('GET /api/demos devolve os 6 itens agrupados por nicho, na ordem do hub', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/demos' });
    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.error).toBeNull();
    expect(body.data).toHaveLength(6);
    /* A ordem importa: e a sequencia dos cards no hub. Estetica primeiro, do
       nivel 01 ao 03; alimentacao depois, na mesma escada. */
    expect(body.data.map((d: { slug: string }) => d.slug)).toEqual([
      'aurea',
      'vivace',
      'oniria',
      'brasa',
      'kaiseki',
      'forno',
    ]);
    expect(body.data.map((d: { niche: string }) => d.niche)).toEqual([
      'estetica',
      'estetica',
      'estetica',
      'alimentacao',
      'alimentacao',
      'alimentacao',
    ]);
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
  /*
    As datas sao RELATIVAS A HOJE, nunca fixas.

    A versao anterior varria de 2026-08-10 a 2026-08-28 e passou meses sem
    reclamar — ate a propria data alcancar a janela. Com `LEAD_TIME_DAYS = 3`,
    todo dia dentro da antecedencia minima devolve zero horario, entao a busca
    queimava ~11 requisicoes invalidas, cada uma com a latencia artificial do
    mock, e estourava os 5s do vitest. O teste do horario ocupado quebrava pelo
    mesmo motivo: 2026-08-20 tinha virado "lead-time".

    Comecar em hoje + LEAD_TIME_DAYS acerta na primeira tentativa e nao vence.
  */
  function dataEm(diasAFrente: number): string {
    const d = new Date();
    d.setDate(d.getDate() + diasAFrente);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  async function horariosDe(date: string) {
    const response = await app.inject({
      method: 'GET',
      url: `/api/booking/availability?date=${date}&practitionerId=marina-aveline&protocolId=aurora`,
    });
    return response.json().data.slots as { time: string; available: boolean }[];
  }

  /** Primeira data valida a partir da antecedencia minima que satisfaca `quer`. */
  async function acharDia(quer: (s: { available: boolean }) => boolean) {
    for (let i = LEAD_TIME_DAYS; i <= LEAD_TIME_DAYS + 20; i++) {
      const date = dataEm(i);
      const slot = (await horariosDe(date)).find(quer);
      if (slot) return { date, time: slot.time };
    }
    throw new Error('nenhum horário encontrado na janela de teste');
  }

  /** Encontra um horário realmente livre, para o teste não depender de sorte. */
  const findFreeSlot = () => acharDia((s) => s.available);

  it('payload inválido devolve 422 com details em português', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/booking',
      payload: {
        protocolId: 'aurora',
        practitionerId: 'marina-aveline',
        date: dataEm(LEAD_TIME_DAYS + 1),
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
    const taken = await acharDia((s) => !s.available);
    expect(taken, 'o mock deveria ter ao menos um horário ocupado').toBeDefined();

    const booking = await app.inject({
      method: 'POST',
      url: '/api/booking',
      payload: {
        protocolId: 'aurora',
        practitionerId: 'marina-aveline',
        date: taken.date,
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
