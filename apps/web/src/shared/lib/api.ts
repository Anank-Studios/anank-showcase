/**
 * Cliente HTTP do backend. ESTE é o único caminho de dados do front.
 * Nenhum componente pode importar de `apps/api/src/data` — ver specs/00-arquitetura.md.
 *
 * Arquivo do ORQUESTRADOR. Subagentes consomem, não editam.
 */

import type {
  Article,
  AvailabilityResponse,
  BookingRequest,
  CalendarEvent,
  Demo,
  DemoSlug,
  DemoSummary,
  Envelope,
  LeadRequest,
  LeadResponse,
  MonthResponse,
  Practitioner,
  Service,
  TeamMember,
  Testimonial,
} from '@anank/contracts';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: { field: string; message: string }[];

  constructor(
    message: string,
    options: { code: string; status: number; details?: { field: string; message: string }[] }
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }

  /** Mapa `campo -> mensagem`, pronto para exibir sob os inputs. */
  get fieldErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const detail of this.details ?? []) map[detail.field] = detail.message;
    return map;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Não foi possível falar com o servidor. Verifique sua conexão.', {
      code: 'NETWORK',
      status: 0,
    });
  }

  let payload: Envelope<T>;
  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    throw new ApiError('Resposta inválida do servidor.', {
      code: 'INTERNAL',
      status: response.status,
    });
  }

  if (!response.ok || payload.error) {
    const error = payload.error;
    throw new ApiError(error?.message ?? 'Erro inesperado.', {
      code: error?.code ?? 'INTERNAL',
      status: response.status,
      details: error?.details,
    });
  }

  return payload.data as T;
}

function query(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const asString = search.toString();
  return asString ? `?${asString}` : '';
}

/* ------------------------------------------------------------------ */
/* Demos                                                               */
/* ------------------------------------------------------------------ */

export const getDemos = () => request<DemoSummary[]>('/api/demos');
export const getDemo = (slug: DemoSlug) => request<Demo>(`/api/demos/${slug}`);
export const getServices = (slug: DemoSlug) => request<Service[]>(`/api/demos/${slug}/services`);
export const getTestimonials = (slug: DemoSlug) =>
  request<Testimonial[]>(`/api/demos/${slug}/testimonials`);
export const getTeam = (slug: DemoSlug) => request<TeamMember[]>(`/api/demos/${slug}/team`);
export const getArticles = (slug: DemoSlug) => request<Article[]>(`/api/demos/${slug}/articles`);

/* ------------------------------------------------------------------ */
/* Agendamento (Oniria)                                                */
/* ------------------------------------------------------------------ */

export const getPractitioners = () => request<Practitioner[]>('/api/booking/practitioners');

export const getMonth = (params: {
  month: string;
  practitionerId?: string;
  protocolId?: string;
}) => request<MonthResponse>(`/api/booking/month${query(params)}`);

export const getAvailability = (params: {
  date: string;
  practitionerId?: string;
  protocolId?: string;
}) => request<AvailabilityResponse>(`/api/booking/availability${query(params)}`);

export const createBooking = (body: BookingRequest) =>
  request<CalendarEvent>('/api/booking', { method: 'POST', body: JSON.stringify(body) });

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export const createLead = (body: LeadRequest) =>
  request<LeadResponse>('/api/leads', { method: 'POST', body: JSON.stringify(body) });
