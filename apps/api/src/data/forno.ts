/**
 * FORNO — pizzaria napolitana fictícia. Nicho alimentação, nível premium.
 *
 * Estabelecimento, endereço, CNPJ, pessoas e depoimentos são FICTÍCIOS.
 *
 * Todas as fotos foram conferidas UMA A UMA, não só por HTTP 200. No primeiro
 * lote testado, um candidato a "massa de pizza" eram maçãs verdes e outro
 * trazia uma garrafa de Coca-Cola à vista — marca real não entra em material
 * de estabelecimento fictício. Os cinco ids abaixo foram vistos e aprovados.
 */

import type { Demo, Menu, Testimonial, TeamMember } from '@anank/contracts';
import { img } from './shared.js';
import type { DemoData } from './shared.js';

/* Fotos conferidas visualmente:
   1579751626657  napolitana saindo do forno a lenha   -> herói
   1541745537411  fatia erguida, queijo puxando, fundo escuro
   1628840042765  pizza inteira de cima, madeira escura
   1513104890138  pizza na tábua com tomate e alecrim
   1552539618     pizza vegetariana de cima             */

const demo: Demo = {
  slug: 'forno',
  niche: 'alimentacao',
  index: '03',
  brandName: 'Forno',
  category: 'Pizzaria napolitana',
  tagline: 'Massa de 48 horas. Forno a lenha a 480 graus.',
  tierLabel: 'Site Premium',
  priceRange: 'R$ 10.000+',
  legalName: 'Forno Panificação e Restaurante Ltda.',
  cnpj: '41.882.507/0001-63',
  city: 'São Paulo',
  since: 2017,
  description:
    'Napolitana de verdade: fermentação longa, farinha tipo 00 e um forno a lenha que não desce de 480 graus. A pizza fica 90 segundos lá dentro e sai com a borda pintada de fogo.',
  phone: '(11) 35xx-xxxx',
  whatsapp: '5511900000000',
  email: 'reservas@forno.exemplo',
  address: 'Rua Fidalga, 8xx — Vila Madalena, São Paulo',
  hours: [
    { day: 'Terça a quinta', open: '18h — 23h' },
    { day: 'Sexta e sábado', open: '18h — 00h30' },
    { day: 'Domingo', open: '18h — 22h30' },
    { day: 'Segunda', open: 'Fechado' },
  ],
  socials: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'TikTok', url: 'https://tiktok.com' },
  ],
  tokens: {
    bg: '#120c08',
    surface: '#1c1310',
    ink: '#f6ece0',
    muted: '#a3897a',
    accent: '#e2652b',
    accentAlt: '#f2c078',
    line: '#2e211a',
    radius: '2px',
    fontDisplay: 'Instrument Serif',
  },
  thumbnail: img('1579751626657-72bc17010498', 'Pizza napolitana saindo do forno a lenha'),
  thumbnailWord: 'A massa',
  images: {
    hero: img('1579751626657-72bc17010498', 'Pizza napolitana sobre a pá, diante da boca do forno a lenha'),
    fatia: img('1541745537411-b8046dc6d66c', 'Fatia de pizza erguida com o queijo derretido escorrendo'),
    inteira: img('1628840042765-356cda07504e', 'Pizza inteira vista de cima sobre madeira escura'),
    tabua: img('1513104890138-7c749659a591', 'Pizza na tábua de madeira ao lado de tomates-cereja e alecrim'),
    vegetariana: img('1552539618-7eec9b4d1796', 'Pizza vegetariana vista de cima, coberta de legumes'),
  },
  stats: [
    { value: '48h', label: 'de fermentação na massa' },
    { value: '480°', label: 'a temperatura do forno' },
    { value: '90s', label: 'é o tempo dentro dele' },
    { value: '2 sacas', label: 'de farinha tipo 00 por semana' },
  ],
};

/* ------------------------------------------------------------------ */
/* Cardápio                                                            */
/* ------------------------------------------------------------------ */

const tamanho = {
  id: 'tamanho',
  label: 'Tamanho',
  kind: 'single' as const,
  choices: [
    { id: 'individual', label: 'Individual (25 cm)', priceDelta: 0 },
    { id: 'media', label: 'Média (32 cm)', priceDelta: 18 },
    { id: 'grande', label: 'Grande (40 cm)', priceDelta: 34 },
  ],
};

const borda = {
  id: 'borda',
  label: 'Borda',
  kind: 'single' as const,
  choices: [
    { id: 'tradicional', label: 'Tradicional', priceDelta: 0 },
    { id: 'catupiry', label: 'Recheada com catupiry', priceDelta: 12 },
    { id: 'parmesao', label: 'Crosta de parmesão', priceDelta: 14 },
  ],
};

const extras = {
  id: 'extras',
  label: 'Adicionais',
  kind: 'multi' as const,
  choices: [
    { id: 'burrata', label: 'Burrata inteira', priceDelta: 22 },
    { id: 'nduja', label: "'Nduja calabresa", priceDelta: 16 },
    { id: 'mel', label: 'Fio de mel picante', priceDelta: 8 },
    { id: 'rucula', label: 'Rúcula fresca', priceDelta: 7 },
  ],
};

const menu: Menu = {
  categories: [
    {
      id: 'classicas',
      slug: 'classicas',
      name: 'Clássicas',
      description: 'As quatro que o forno faz desde 2017. Não mudam, e é de propósito.',
    },
    {
      id: 'autorais',
      slug: 'autorais',
      name: 'Autorais',
      description: 'Mudam conforme a feira. Estas são as da temporada.',
    },
    {
      id: 'entradas',
      slug: 'entradas',
      name: 'Para começar',
      description: 'Sai do mesmo forno, enquanto a pizza descansa.',
    },
  ],
  items: [
    {
      id: 'margherita',
      slug: 'margherita',
      name: 'Margherita',
      categoryId: 'classicas',
      description:
        'San Marzano, fior di latte, manjericão colhido na hora e azeite. A prova dos nove de qualquer napolitana.',
      price: 62,
      image: img('1579751626657-72bc17010498', 'Margherita recém-saída do forno a lenha'),
      badges: ['a mais pedida'],
      ingredients: ['Massa de 48 horas', 'Molho San Marzano', 'Fior di latte', 'Manjericão', 'Azeite'],
      options: [tamanho, borda, extras],
    },
    {
      id: 'diavola',
      slug: 'diavola',
      name: 'Diavola',
      categoryId: 'classicas',
      description: "'Nduja calabresa, fior di latte, orégano e um fio de mel para segurar o ardido.",
      price: 74,
      image: img('1628840042765-356cda07504e', 'Pizza coberta de embutidos vista de cima'),
      badges: ['picante'],
      ingredients: ['Massa de 48 horas', 'Molho San Marzano', "'Nduja", 'Fior di latte', 'Mel picante'],
      options: [tamanho, borda, extras],
    },
    {
      id: 'quatro-queijos',
      slug: 'quatro-queijos',
      name: 'Quattro Formaggi',
      categoryId: 'classicas',
      description: 'Fior di latte, gorgonzola, parmesão e taleggio. Sem molho — o queijo é o molho.',
      price: 78,
      image: img('1541745537411-b8046dc6d66c', 'Fatia erguida com queijo derretido escorrendo'),
      ingredients: ['Massa de 48 horas', 'Fior di latte', 'Gorgonzola', 'Parmesão', 'Taleggio'],
      options: [tamanho, borda, extras],
    },
    {
      id: 'horta',
      slug: 'horta',
      name: 'Da Horta',
      categoryId: 'autorais',
      description:
        'Abobrinha, berinjela, pimentão assado e tomate confitado. Vegana quando você tira o queijo — e fica boa assim.',
      price: 69,
      image: img('1552539618-7eec9b4d1796', 'Pizza vegetariana coberta de legumes'),
      badges: ['vegetariana'],
      ingredients: ['Massa de 48 horas', 'Molho San Marzano', 'Legumes assados', 'Tomate confitado'],
      options: [tamanho, borda, extras],
    },
    {
      id: 'alecrim',
      slug: 'alecrim',
      name: 'Alecrim e Burrata',
      categoryId: 'autorais',
      description:
        'Sai branca do forno e recebe a burrata fria em cima, com alecrim e pimenta-do-reino moída na hora.',
      price: 92,
      image: img('1513104890138-7c749659a591', 'Pizza na tábua ao lado de alecrim e tomates-cereja'),
      badges: ['da temporada'],
      ingredients: ['Massa de 48 horas', 'Fior di latte', 'Burrata', 'Alecrim', 'Pimenta-do-reino'],
      options: [tamanho, borda, extras],
    },
    {
      id: 'focaccia',
      slug: 'focaccia',
      name: 'Focaccia do forno',
      categoryId: 'entradas',
      description: 'A mesma massa, assada com azeite e sal grosso. Serve dois enquanto a pizza não sai.',
      price: 28,
      image: img('1513104890138-7c749659a591', 'Massa assada servida na tábua de madeira'),
      ingredients: ['Massa de 48 horas', 'Azeite', 'Sal grosso', 'Alecrim'],
    },
  ],
};

/* ------------------------------------------------------------------ */

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Renata Vasques',
    service: 'cliente desde 2019',
    quote:
      'Levei um amigo napolitano achando que ele ia reclamar de alguma coisa. Ele pediu a segunda antes de terminar a primeira.',
    rating: 5,
    avatar: img('1513104890138-7c749659a591', 'Foto de perfil ilustrativa'),
  },
  {
    id: 't2',
    name: 'Caio Bertoldo',
    service: 'cliente',
    quote:
      'A borda é o motivo de eu voltar. Fica leve e com aquelas bolhas queimadas que nenhuma pizzaria de forno elétrico consegue.',
    rating: 5,
    avatar: img('1513104890138-7c749659a591', 'Foto de perfil ilustrativa'),
  },
  {
    id: 't3',
    name: 'Marina Toledo',
    service: 'cliente',
    quote: 'Peço entrega toda sexta e chega quente. Não sei como conseguem, mas chega.',
    rating: 5,
    avatar: img('1513104890138-7c749659a591', 'Foto de perfil ilustrativa'),
  },
];

const team: TeamMember[] = [
  {
    id: 'm1',
    name: 'Salvatore Pipitone',
    role: 'Pizzaiolo-chefe',
    bio: 'Aprendeu em Nápoles, com o avô, e passou onze anos ali antes de abrir o Forno na Vila Madalena.',
    photo: img('1579751626657-72bc17010498', 'Pizza sendo levada ao forno pelo pizzaiolo'),
  },
  {
    id: 'm2',
    name: 'Ana Clara Ferraz',
    role: 'Sócia e responsável pelo salão',
    bio: 'Cuida da casa, da carta de vinhos e de lembrar o nome de quem vem sempre.',
    photo: img('1513104890138-7c749659a591', 'Mesa montada com pizza na tábua'),
  },
];

export const forno: DemoData = {
  demo,
  services: [],
  testimonials,
  team,
  menu,
  acceptsOrders: true,
  deliveryFee: 9,
};
