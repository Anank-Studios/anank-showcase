/**
 * @anank/contracts — tipos compartilhados entre apps/api e apps/web.
 * Espelha specs/02-api-contract.md. Nenhuma dependência de runtime.
 */

/*
  `kaiseki` (japonesa) entra quando o banco de foto dela estiver conferido UMA A
  UMA. Não basta o Unsplash devolver 200: entre as candidatas já reprovadas aqui
  havia maçãs verdes no lugar de massa de pizza, um par de fones de ouvido, uma
  formatura, e três fotos com marca real à vista (Coca-Cola, um copo escrito
  "Gourmet Burger Kitchen" e um milkshake coberto de Oreo). Marca real não entra
  em material de estabelecimento fictício.
*/
export const DEMO_SLUGS = ['aurea', 'vivace', 'oniria', 'brasa', 'forno'] as const;
export type DemoSlug = (typeof DEMO_SLUGS)[number];

export function isDemoSlug(value: string): value is DemoSlug {
  return (DEMO_SLUGS as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------ */
/* Nichos                                                              */
/* ------------------------------------------------------------------ */

/**
 * O hub agrupa as demos por NICHO. O nicho vive no dado, não na URL: as rotas
 * seguem `/demo/<slug>` como sempre, então nenhum link já entregue a cliente
 * deixa de funcionar.
 */
export const NICHE_SLUGS = ['estetica', 'alimentacao'] as const;
export type NicheSlug = (typeof NICHE_SLUGS)[number];

export interface Niche {
  slug: NicheSlug;
  label: string;
  /** Frase curta mostrada sob o alternador do hub. */
  tagline: string;
}

export function isNicheSlug(value: string): value is NicheSlug {
  return (NICHE_SLUGS as readonly string[]).includes(value);
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
  /** Nicho ao qual a demo pertence. O hub agrupa por ele. */
  niche: NicheSlug;
  index: '01' | '02' | '03';
  brandName: string;
  category: string;
  tagline: string;
  /** Rótulo de nível mostrado no card do hub, ex.: "Site Premium". */
  tierLabel: string;
  /** Marca o card com o selo "Popular". Um por nicho. */
  popular?: boolean;
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
/* Cardápio e pedido (nicho alimentação)                               */
/* ------------------------------------------------------------------ */

export interface MenuOptionChoice {
  id: string;
  label: string;
  /** Acréscimo em reais. 0 quando não altera o preço. */
  priceDelta: number;
}

/** Grupo de escolhas de um item: tamanho, ponto da carne, borda, etc. */
export interface MenuOptionGroup {
  id: string;
  label: string;
  /** `single` = radio (obrigatório); `multi` = checkbox (opcional). */
  kind: 'single' | 'multi';
  choices: MenuOptionChoice[];
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  /** Em reais inteiros. É o preço base, antes dos acréscimos. */
  price: number;
  image: ImageRef;
  /** Selos curtos: "vegano", "picante", "mais pedido". */
  badges?: string[];
  /** Ingredientes, para o scroll-telling da montagem. */
  ingredients?: string[];
  options?: MenuOptionGroup[];
  /** Fora do ar hoje: aparece no cardápio, mas não entra no carrinho. */
  soldOut?: boolean;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Menu {
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface OrderLineRequest {
  itemId: string;
  quantity: number;
  /** IDs das escolhas selecionadas, de qualquer grupo. */
  choiceIds?: string[];
  note?: string;
}

export type OrderMode = 'entrega' | 'retirada';

export interface OrderRequest {
  demo: DemoSlug;
  mode: OrderMode;
  lines: OrderLineRequest[];
  customerName: string;
  phone: string;
  /** Obrigatório quando `mode` é `entrega`. */
  address?: string;
  payment: 'pix' | 'credito' | 'dinheiro';
  note?: string;
}

export interface OrderLine {
  itemId: string;
  name: string;
  quantity: number;
  /** Rótulos legíveis das escolhas, já resolvidos pelo servidor. */
  choices: string[];
  /** Preço unitário já com os acréscimos. */
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  /** Número curto mostrado ao cliente, ex.: "4821". */
  code: string;
  demo: DemoSlug;
  mode: OrderMode;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Minutos estimados, calculados a partir do modo e do tamanho do pedido. */
  etaMin: number;
  placedAt: string;
  demoNotice: string;
}

/* ------------------------------------------------------------------ */
/* Avisos de demonstração — texto único, usado por API e front          */
/* ------------------------------------------------------------------ */

export const DEMO_NOTICE_BOOKING = 'Demonstração. Nenhum agendamento foi criado de fato.';
export const DEMO_NOTICE_LEAD = 'Demonstração. Nenhum lead foi armazenado.';
export const DEMO_NOTICE_ORDER = 'Demonstração. Nenhum pedido foi feito nem cobrado de fato.';
