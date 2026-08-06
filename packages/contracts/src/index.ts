/**
 * @anank/contracts — tipos compartilhados entre apps/api e apps/web.
 * Espelha specs/02-api-contract.md. Nenhuma dependência de runtime.
 */

export const DEMO_SLUGS = ['aurea', 'vivace', 'oniria'] as const;
export type DemoSlug = (typeof DEMO_SLUGS)[number];

export function isDemoSlug(value: string): value is DemoSlug {
  return (DEMO_SLUGS as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------ */
/* Envelope                                                            */
/* ------------------------------------------------------------------ */

export interface ApiErrorBody {
  code: 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL';
  message: string;
  details?: { field: string; message: string }[];
}

export type Envelope<T> = { data: T; error: null } | { data: null; error: ApiErrorBody };

/* ------------------------------------------------------------------ */
/* Marca e demo                                                        */
/* ------------------------------------------------------------------ */

export interface BrandTokens {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentAlt: string;
  line: string;
  radius: string;
  /** Nome legível da fonte display, para o thumbnail vivo do hub. */
  fontDisplay: string;
}

export interface ImageRef {
  url: string;
  alt: string;
  credit?: string;
}

export interface DemoSummary {
  slug: DemoSlug;
  index: '01' | '02' | '03';
  brandName: string;
  category: string;
  tagline: string;
  priceRange: string;
  tokens: BrandTokens;
  thumbnail: ImageRef;
  /** Palavra curta escrita na fonte display da marca dentro do mini-mockup. */
  thumbnailWord: string;
}

export interface OpeningHour {
  day: string;
  open: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Demo extends DemoSummary {
  legalName: string;
  cnpj: string;
  city: string;
  since: number;
  description: string;
  phone: string;
  /** E.164 sem o "+", pronto para wa.me */
  whatsapp: string;
  email: string;
  address: string;
  hours: OpeningHour[];
  socials: SocialLink[];
  images: Record<string, ImageRef>;
  stats?: Stat[];
}

/* ------------------------------------------------------------------ */
/* Conteúdo                                                            */
/* ------------------------------------------------------------------ */

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  durationMin: number;
  /** Em reais inteiros. */
  priceFrom: number;
  sessions?: string;
  interval?: string;
  recovery?: string;
  indications?: string[];
  contraindications?: string[];
  image: ImageRef;
  /** Nome do ícone em linha (Aurea). */
  icon?: string;
  /** Narrativa em 3 atos (Oniria). */
  acts?: { title: string; body: string; image?: ImageRef }[];
  faq?: { question: string; answer: string }[];
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
  registry?: string;
  bio: string;
  photo: ImageRef;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  readingMin: number;
  publishedAt: string;
  image: ImageRef;
  /** Presente apenas no artigo de exemplo. */
  body?: string[];
}

/* ------------------------------------------------------------------ */
/* Agendamento (Oniria)                                                */
/* ------------------------------------------------------------------ */

export const SAO_PAULO_TZ = 'America/Sao_Paulo' as const;
export type SaoPauloTz = typeof SAO_PAULO_TZ;

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  photo: ImageRef;
  bio: string;
  /** Linha exibida na etapa 2 do fluxo. */
  availabilityNote: string;
}

export interface Slot {
  time: string;
  available: boolean;
  remaining: number;
}

export interface AvailabilityResponse {
  date: string;
  timeZone: SaoPauloTz;
  slots: Slot[];
}

export type UnavailableReason = 'past' | 'lead-time' | 'closed' | 'holiday' | 'full';

export interface MonthDay {
  date: string;
  hasAvailability: boolean;
  reason?: UnavailableReason;
}

export interface MonthResponse {
  month: string;
  timeZone: SaoPauloTz;
  days: MonthDay[];
}

export interface BookingRequest {
  protocolId: string;
  practitionerId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  firstVisit: boolean;
  notes?: string;
}

export interface EventAttendee {
  email: string;
  displayName: string;
  responseStatus: 'accepted' | 'needsAction' | 'declined' | 'tentative';
  organizer?: boolean;
}

export interface EventDateTime {
  dateTime: string;
  timeZone: SaoPauloTz;
}

/** Espelha a Google Calendar API. Gerado em memória, nunca persistido. */
export interface CalendarEvent {
  kind: 'calendar#event';
  id: string;
  status: 'confirmed';
  htmlLink: string;
  created: string;
  summary: string;
  description: string;
  location: string;
  colorId: string;
  start: EventDateTime;
  end: EventDateTime;
  attendees: EventAttendee[];
  organizer: { email: string; displayName: string; self: boolean };
  conferenceData: {
    conferenceId: string;
    conferenceSolution: { key: { type: string }; name: string };
    entryPoints: { entryPointType: string; uri: string; label: string }[];
  };
  reminders: {
    useDefault: false;
    overrides: { method: 'email' | 'popup'; minutes: number }[];
  };
  /** Sempre preenchido. O front DEVE renderizar este texto na confirmação. */
  demoNotice: string;
}

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export type LeadSource = 'hero' | 'contato' | 'newsletter' | 'cta-final';

export interface LeadRequest {
  demo: DemoSlug;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message?: string;
  source: LeadSource;
}

export interface LeadResponse {
  id: string;
  receivedAt: string;
  demoNotice: string;
}

/* ------------------------------------------------------------------ */
/* Avisos de demonstração — texto único, usado por API e front          */
/* ------------------------------------------------------------------ */

export const DEMO_NOTICE_BOOKING = 'Demonstração. Nenhum agendamento foi criado de fato.';
export const DEMO_NOTICE_LEAD = 'Demonstração. Nenhum lead foi armazenado.';
