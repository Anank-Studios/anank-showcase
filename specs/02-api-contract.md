# 02 · Contrato da API

Base: `http://localhost:3333`. CORS liberado para `http://localhost:3000`.
**Toda** resposta segue o envelope `{ data, error }`.

```ts
type Envelope<T> =
  | { data: T; error: null }
  | { data: null; error: { code: string; message: string; details?: unknown } };
```

Códigos de erro: `NOT_FOUND` (404), `VALIDATION_ERROR` (422), `INTERNAL` (500).
Mensagens de erro **em português do Brasil**.

---

## Tipos compartilhados — `packages/contracts/src/index.ts`

```ts
export type DemoSlug = 'aurea' | 'vivace' | 'oniria';

export interface BrandTokens {
  bg: string; surface: string; ink: string; muted: string;
  accent: string; accentAlt: string; line: string;
  radius: string; fontDisplay: string;
}

export interface DemoSummary {
  slug: DemoSlug;
  index: '01' | '02' | '03';
  brandName: string;        // "Aurea Beauty Studio"
  category: string;         // "Landing Page"
  tagline: string;          // 1 linha
  priceRange: string;       // "R$ 1.500–2.500"
  tokens: BrandTokens;
  thumbnail: ImageRef;
}

export interface ImageRef {
  url: string;              // https://images.unsplash.com/photo-...
  alt: string;              // descritivo, pt-BR
  credit?: string;          // "Foto: Nome — Unsplash"
}

export interface Demo extends DemoSummary {
  legalName: string;        // razão social fictícia
  cnpj: string;             // fictício
  city: string;
  since: number;
  description: string;
  phone: string;
  whatsapp: string;         // formato E.164 sem +
  email: string;
  address: string;
  hours: { day: string; open: string }[];
  socials: { label: string; url: string }[];
  images: Record<string, ImageRef>;
  stats?: { value: string; label: string }[];
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;         // Aurea: "Cabelo"|"Estética"; Vivace: "Facial"|"Corporal"|"Depilação"
  summary: string;          // 1 linha
  description: string;      // parágrafo
  durationMin: number;
  priceFrom: number;        // centavos? NÃO — reais inteiros
  sessions?: string;        // "4 a 6 sessões"
  interval?: string;        // "21 dias"
  recovery?: string;        // "sem downtime"
  indications?: string[];
  contraindications?: string[];
  image: ImageRef;
  icon?: string;            // nome do ícone em linha (lucide-like), Aurea
}

export interface Testimonial {
  id: string;
  name: string;
  service: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  avatar: ImageRef;
  city?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  registry?: string;        // "CRM-PR 00.000" / "CRBM 0000" — fictício
  bio: string;
  photo: ImageRef;
}

/* ---- Booking (Oniria) ---- */

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  photo: ImageRef;
  bio: string;
}

export interface Slot {
  time: string;             // "14:30"
  available: boolean;
  remaining: number;        // 0..3 — usado para o badge "Últimas 2 vagas"
}

export interface AvailabilityResponse {
  date: string;             // "2026-08-20"
  timeZone: 'America/Sao_Paulo';
  slots: Slot[];
}

export interface MonthDay {
  date: string;             // "2026-08-20"
  hasAvailability: boolean;
  reason?: 'past' | 'lead-time' | 'closed' | 'holiday' | 'full';
}

export interface MonthResponse {
  month: string;            // "2026-08"
  timeZone: 'America/Sao_Paulo';
  days: MonthDay[];
}

export interface BookingRequest {
  protocolId: string;
  practitionerId: string;   // ou "any"
  date: string;             // YYYY-MM-DD
  time: string;             // HH:mm
  name: string;
  email: string;
  phone: string;
  firstVisit: boolean;
  notes?: string;
}

/** Formato espelhando a Google Calendar API — gerado em memória, nunca persistido. */
export interface CalendarEvent {
  kind: 'calendar#event';
  id: string;
  status: 'confirmed';
  htmlLink: string;
  created: string;          // ISO
  summary: string;          // "Protocolo Aurora · ONIRIA Clinic"
  description: string;
  location: string;
  colorId: string;
  start: { dateTime: string; timeZone: 'America/Sao_Paulo' };
  end:   { dateTime: string; timeZone: 'America/Sao_Paulo' };
  attendees: { email: string; displayName: string; responseStatus: string; organizer?: boolean }[];
  organizer: { email: string; displayName: string; self: boolean };
  conferenceData: {
    conferenceId: string;
    conferenceSolution: { key: { type: string }; name: string };
    entryPoints: { entryPointType: string; uri: string; label: string }[];
  };
  reminders: { useDefault: false; overrides: { method: string; minutes: number }[] };
  /** SEMPRE true. O front usa isto para renderizar o aviso de demonstração. */
  demoNotice: string;       // "Demonstração. Nenhum agendamento foi criado de fato."
}

export interface LeadRequest {
  demo: DemoSlug;
  name: string;
  phone: string;
  email?: string;
  interest?: string;        // serviço de interesse / unidade
  message?: string;
  source: string;           // "hero" | "contato" | "newsletter" | "cta-final"
}

export interface LeadResponse {
  id: string;
  receivedAt: string;
  demoNotice: string;       // "Demonstração. Nenhum lead foi armazenado."
}
```

---

## Rotas

| Método | Rota | Resposta `data` |
|---|---|---|
| GET | `/api/health` | `{ ok: true, uptime: number }` |
| GET | `/api/demos` | `DemoSummary[]` (3 itens, ordem 01→03) |
| GET | `/api/demos/:slug` | `Demo` |
| GET | `/api/demos/:slug/services` | `Service[]` |
| GET | `/api/demos/:slug/testimonials` | `Testimonial[]` |
| GET | `/api/demos/:slug/team` | `TeamMember[]` |
| GET | `/api/booking/practitioners` | `Practitioner[]` |
| GET | `/api/booking/month?month=YYYY-MM&practitionerId=&protocolId=` | `MonthResponse` |
| GET | `/api/booking/availability?date=YYYY-MM-DD&practitionerId=&protocolId=` | `AvailabilityResponse` |
| POST | `/api/booking` | `CalendarEvent` (201) |
| POST | `/api/leads` | `LeadResponse` (201) |

`:slug` fora de `aurea|vivace|oniria` → 404 `NOT_FOUND`.
`GET /api/demos/aurea/team` retorna `[]` (Aurea não tem seção de equipe) — não é erro.

---

## Mock de disponibilidade — `services/calendar.mock.ts`

**Determinístico.** A mesma data + profissional + protocolo devolve sempre os mesmos horários.

### Seed

```ts
function seed(...parts: string[]): () => number {
  let h = 2166136261;
  for (const p of parts) for (let i = 0; i < p.length; i++) {
    h ^= p.charCodeAt(i); h = Math.imul(h, 16777619);
  }
  return () => { h += 0x6D2B79F5; let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
```

### Regras

1. **Horário de funcionamento** (`America/Sao_Paulo`):
   - Seg–Sex: 09:00–19:00
   - Sábado: 09:00–14:00
   - Domingo: fechado (`reason: 'closed'`)
2. **Grade de 30 em 30 minutos.** A duração do protocolo bloqueia os slots seguintes:
   um protocolo de 90min ocupa 3 slots; slots cujo fim ultrapassa o fechamento não são ofertados.
3. **Almoço 12:30–13:30** sempre bloqueado.
4. **~35% dos slots já ocupados**, decidido pelo PRNG com seed `(date, practitionerId, protocolId)`.
5. **Antecedência mínima:** hoje e os **próximos 2 dias** são indisponíveis (`reason: 'lead-time'`).
   Datas passadas → `reason: 'past'`.
6. **Feriados nacionais de 2026** → `reason: 'holiday'`:
   `01-01` Confraternização · `02-16`/`02-17` Carnaval · `04-03` Sexta-feira Santa ·
   `04-21` Tiradentes · `05-01` Dia do Trabalho · `06-04` Corpus Christi ·
   `09-07` Independência · `10-12` Nossa Senhora Aparecida · `11-02` Finados ·
   `11-15` Proclamação da República · `11-20` Consciência Negra · `12-25` Natal.
7. **`remaining`**: `1..3`, derivado do PRNG. O front mostra o badge *"Últimas N vagas"*
   quando `available && remaining <= 2`.
8. **Disponibilidade por profissional:**
   - `helena-kruger` — agenda mais cheia: **55%** ocupada, e não atende sábado.
   - `marina-aveline` — 30% ocupada.
   - `any` — união das duas (um slot está livre se qualquer uma tiver).
9. **Latência artificial:**
   - `GET /availability` → 400–700ms (PRNG)
   - `GET /month` → 250ms
   - `POST /booking` → 900ms
   Ela existe para o skeleton shimmer ter função. Não remover.

### `POST /api/booking`

- Valida com Zod. Erro → **422** com `error.details` listando `{ field, message }` em pt-BR.
- Revalida no servidor que o slot está realmente disponível. Se não estiver →
  422 `"Este horário acabou de ser ocupado. Escolha outro."`
- Monta o `CalendarEvent` em memória:
  - `id`: 26 chars base32 lowercase, estilo Google.
  - `htmlLink`: `https://calendar.google.com/calendar/event?eid=<base64url(id)>`
  - `summary`: `` `${protocolo.name} · ONIRIA Clinic` ``
  - `location`: `Rua Bela Cintra, 1842 · Jardins · São Paulo · SP`
  - `organizer`: `{ email: 'agenda@oniriaclinic.com.br', displayName: 'ONIRIA Clinic', self: true }`
  - `attendees`: o cliente (`responseStatus: 'accepted'`) + a profissional (`'accepted'`).
  - `conferenceData`: solução fictícia `"ONIRIA Concierge"`, entry point `tel:` da clínica.
  - `reminders.overrides`: `[{ method: 'email', minutes: 1440 }, { method: 'popup', minutes: 120 }]`
  - `demoNotice`: `"Demonstração. Nenhum agendamento foi criado de fato."`
- **Nunca persiste.** Não há array global de eventos.

### `POST /api/leads`

- Valida `{ demo, name, phone }` obrigatórios; `email` opcional mas validado se presente.
- Telefone: aceita máscara brasileira, normaliza para dígitos, exige 10 ou 11 dígitos.
  Mensagem de erro: `"Informe um telefone válido com DDD."`
- Retorna **201** com `{ id, receivedAt, demoNotice }`.
- Latência artificial de 600ms (para os estados de loading do formulário terem função).

---

## Cliente — `apps/web/src/shared/lib/api.ts`

Assinaturas que os subagentes vão consumir (o orquestrador implementa; subagentes **não editam**):

```ts
export class ApiError extends Error {
  code: string;
  details?: unknown;
  status: number;
}

/** Base URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333' */
export const API_URL: string;

export function getDemos(): Promise<DemoSummary[]>;
export function getDemo(slug: DemoSlug): Promise<Demo>;
export function getServices(slug: DemoSlug): Promise<Service[]>;
export function getTestimonials(slug: DemoSlug): Promise<Testimonial[]>;
export function getTeam(slug: DemoSlug): Promise<TeamMember[]>;

export function getPractitioners(): Promise<Practitioner[]>;
export function getMonth(params: {
  month: string; practitionerId?: string; protocolId?: string;
}): Promise<MonthResponse>;
export function getAvailability(params: {
  date: string; practitionerId?: string; protocolId?: string;
}): Promise<AvailabilityResponse>;
export function createBooking(body: BookingRequest): Promise<CalendarEvent>;
export function createLead(body: LeadRequest): Promise<LeadResponse>;
```

- Todas lançam `ApiError` em falha (inclusive 422, com `details` preenchido).
- Chamadas server-side usam `{ cache: 'no-store' }`.
- Não há retry automático — o front decide.

---

## Testes (Vitest, `apps/api/test/`)

1. `calendar.mock` é determinístico: 20 chamadas com os mesmos parâmetros → resultado idêntico.
2. Domingo retorna `hasAvailability: false, reason: 'closed'`.
3. Feriado de 2026 retorna `reason: 'holiday'`.
4. Hoje e D+1, D+2 retornam `reason: 'lead-time'`.
5. Almoço 12:30 e 13:00 nunca disponíveis.
6. Protocolo de 120min não oferta slot que ultrapasse o fechamento.
7. `POST /booking` com payload inválido → 422 com `details` em pt-BR.
8. `POST /booking` válido → 201, `kind === 'calendar#event'`, `demoNotice` presente.
9. `POST /leads` com telefone de 9 dígitos → 422.
10. `GET /api/demos` → 3 itens na ordem `aurea, vivace, oniria`.
