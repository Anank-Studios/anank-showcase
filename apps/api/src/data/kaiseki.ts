/**
 * KAISEKI — cozinha japonesa fictícia. Nicho alimentação, nível 02.
 *
 * Estabelecimento, endereço, CNPJ, pessoas e depoimentos são FICTÍCIOS.
 *
 * É a demo do MEIO do nicho: tem cardápio e RECEBE PEDIDO pelo site. É o
 * degrau que a Brasa não tem — e a diferença é inteira no `acceptsOrders`,
 * não em quantidade de página.
 *
 * Fotos conferidas em folha de contato e, nas finalistas, também em tamanho de
 * uso. As reprovadas e o porquê estão no fim do arquivo.
 */

import type { Demo, Menu, Testimonial, TeamMember } from '@anank/contracts';
import { img } from './shared.js';
import type { DemoData } from './shared.js';

const demo: Demo = {
  slug: 'kaiseki',
  niche: 'alimentacao',
  index: '02',
  brandName: 'Kaiseki',
  category: 'Cozinha japonesa',
  tagline: 'Balcão de dez lugares. O peixe muda todo dia.',
  tierLabel: 'Site com Pedidos',
  /* Um "popular" por nicho, como na estética: é o degrau que a maioria dos
     clientes acaba comprando. */
  popular: true,
  priceRange: 'R$ 7.500+',
  legalName: 'Kaiseki Restaurante e Comércio de Alimentos Ltda.',
  cnpj: '38.412.659/0001-24',
  city: 'São Paulo',
  since: 2015,
  description:
    'Dez lugares no balcão e catorze mesas no salão. O itamae compra na peixaria às cinco da manhã e o cardápio do balcão é decidido depois disso — por isso ele não está impresso em lugar nenhum.',
  phone: '(11) 32xx-xxxx',
  whatsapp: '5511900000000',
  email: 'reservas@kaiseki.exemplo',
  address: 'Alameda Lorena, 1.4xx — Jardins, São Paulo',
  hours: [
    { day: 'Terça a sexta', open: '19h — 23h' },
    { day: 'Sábado', open: '13h — 16h · 19h — 23h30' },
    { day: 'Domingo', open: '13h — 17h' },
    { day: 'Segunda', open: 'Fechado' },
  ],
  socials: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'Facebook', url: 'https://facebook.com' },
  ],
  tokens: {
    /* Azul-tinta sobre quase-preto, com um acento FRIO — o único do projeto
       inteiro. As outras cinco marcas variam entre âmbar, dourado, verde e
       vermelho; um índigo separa esta de todas de relance. */
    bg: '#0d0f14',
    surface: '#151922',
    ink: '#f2f0ec',
    muted: '#98a0ae',
    accent: '#7aa5d2',
    accentAlt: '#d9563c',
    line: '#232936',
    radius: '0px',
    fontDisplay: 'Shippori Mincho',
  },
  thumbnail: img('1512132411229-c30391241dd8', 'Mão finalizando um prato de sashimi sobre louça escura'),
  thumbnailWord: 'Balcão',
  images: {
    hero: img('1512132411229-c30391241dd8', 'Mão do itamae finalizando um prato de sashimi sobre louça escura'),
    balcao: img('1617196034796-73dfa7b1fd56', 'Fileira de nigiris sobre ardósia preta, ao lado de shoyu e hashi'),
    detalhe: img('1615361200141-f45040f367be', 'Nigiri de salmão erguido por um par de hashi, sobre fundo preto'),
    tabua: img('1607301405390-d831c242f59b', 'Peças de sushi servidas em tábua de madeira, com gengibre e wasabi'),
    ramen: img('1618889482923-38250401a84e', 'Tigela de ramen com barriga de porco e ovo, vista de cima'),
    noite: img('1526318896980-cf78c088247c', 'Hashi erguendo macarrão de uma tigela, em luz baixa'),
    salao: img('1590846406792-0adc7f938f1d', 'Salão do restaurante com luminárias pendentes e mesas de madeira'),
    mesa: img('1533777419517-3e4017e2e15a', 'Duas pessoas brindando sentadas ao balcão, em luz quente'),
  },
  stats: [
    { value: '10', label: 'lugares no balcão, e só' },
    { value: '5h', label: 'da manhã na peixaria, todo dia' },
    { value: '18', label: 'peixes diferentes na última semana' },
    { value: '0', label: 'itens congelados no balcão' },
  ],
};

/* ------------------------------------------------------------------ */
/* Cardápio — com grupos de escolha, porque esta casa VENDE             */
/* ------------------------------------------------------------------ */

const tamanhoOmakase = {
  id: 'tamanho-omakase',
  label: 'Quantas peças',
  kind: 'single' as const,
  choices: [
    { id: 'dez', label: '10 peças', priceDelta: 0 },
    { id: 'quinze', label: '15 peças', priceDelta: 62 },
    { id: 'vinte', label: '20 peças', priceDelta: 118 },
  ],
};

const pontoDoOvo = {
  id: 'ovo',
  label: 'Ponto do ovo',
  kind: 'single' as const,
  choices: [
    { id: 'mole', label: 'Gema mole', priceDelta: 0 },
    { id: 'duro', label: 'Gema cozida', priceDelta: 0 },
    { id: 'sem', label: 'Sem ovo', priceDelta: 0 },
  ],
};

const extrasRamen = {
  id: 'extras-ramen',
  label: 'Adicionais',
  kind: 'multi' as const,
  choices: [
    { id: 'chashu', label: 'Chashu extra', priceDelta: 18 },
    { id: 'menma', label: 'Menma', priceDelta: 8 },
    { id: 'nori', label: 'Nori', priceDelta: 6 },
    { id: 'ovo-extra', label: 'Ovo marinado extra', priceDelta: 9 },
  ],
};

const menu: Menu = {
  categories: [
    {
      id: 'balcao',
      slug: 'balcao',
      name: 'Do balcão',
      description:
        'Cortado na hora, à vista. O que tem hoje depende do que tinha na peixaria às cinco.',
    },
    {
      id: 'quentes',
      slug: 'quentes',
      name: 'Da cozinha',
      description:
        'Caldo de doze horas e macarrão cozido no minuto. Sai pela porta lateral, sem passar pelo balcão.',
    },
    {
      id: 'entradas',
      slug: 'entradas',
      name: 'Para começar',
      description: 'Chegam antes de tudo, para segurar a mesa enquanto o resto sai.',
    },
  ],
  items: [
    {
      id: 'omakase',
      slug: 'omakase',
      name: 'Omakase do itamae',
      categoryId: 'balcao',
      description:
        'Você não escolhe. Ele decide na hora, olhando o que comprou de manhã e o que você comeu nas peças anteriores. É o motivo de existirem só dez lugares.',
      price: 148,
      image: img('1617196034796-73dfa7b1fd56', 'Fileira de nigiris variados sobre ardósia preta'),
      badges: ['só no balcão'],
      options: [tamanhoOmakase],
    },
    {
      id: 'nigiri-salmao',
      slug: 'nigiri-salmao',
      name: 'Nigiri de salmão · 4 peças',
      categoryId: 'balcao',
      description:
        'Salmão maçaricado de leve, shoyu pincelado e nada mais. Sem cream cheese, sem crocante.',
      price: 42,
      image: img('1583623025817-d180a2221d0a', 'Nigiris de salmão com gergelim preto sobre ardósia'),
      badges: ['o mais pedido'],
    },
    {
      id: 'sashimi',
      slug: 'sashimi',
      name: 'Sashimi do dia · 9 fatias',
      categoryId: 'balcao',
      description:
        'Três peixes, três fatias de cada. Quais são, o salão informa quando o pedido entra.',
      price: 68,
      image: img('1512132411229-c30391241dd8', 'Prato de sashimi sendo finalizado à mão'),
    },
    {
      id: 'uramaki',
      slug: 'uramaki',
      name: 'Uramaki da casa · 8 peças',
      categoryId: 'balcao',
      description: 'Arroz por fora, salmão e pepino por dentro, ovas de massago na cobertura.',
      price: 54,
      image: img('1580822184713-fc5400e7fe10', 'Uramaki coberto de ovas alaranjadas, em close'),
    },
    {
      id: 'hosomaki',
      slug: 'hosomaki',
      name: 'Hosomaki de pepino · 8 peças',
      categoryId: 'balcao',
      description:
        'O rolinho mais simples do balcão, e o teste mais difícil: só arroz, nori e pepino.',
      price: 32,
      image: img('1564489563601-c53cfc451e93', 'Hosomaki alinhados no prato, com molho ao lado'),
      badges: ['vegano'],
    },
    {
      id: 'combinado',
      slug: 'combinado',
      name: 'Combinado Kaiseki · 24 peças',
      categoryId: 'balcao',
      description:
        'Para dividir entre dois. Nigiri, uramaki, hosomaki e sashimi, na proporção que a casa escolhe.',
      price: 186,
      image: img('1553621042-f6e147245754', 'Barca de madeira com combinado variado de sushi'),
      badges: ['para dois'],
    },
    {
      id: 'ramen-shoyu',
      slug: 'ramen-shoyu',
      name: 'Ramen shoyu',
      categoryId: 'quentes',
      description:
        'Caldo de porco e frango de doze horas, chashu selado, menma, cebolinha e ovo marinado.',
      price: 62,
      image: img('1618889482923-38250401a84e', 'Ramen com barriga de porco e ovo marinado, visto de cima'),
      options: [pontoDoOvo, extrasRamen],
    },
    {
      id: 'ramen-miso',
      slug: 'ramen-miso',
      name: 'Ramen miso apimentado',
      categoryId: 'quentes',
      description: 'O mesmo caldo, com missô vermelho e óleo de pimenta feito na casa. Pede água.',
      price: 66,
      image: img('1607330289024-1535c6b4e1c1', 'Tigela de ramen avermelhado com legumes, vista de cima'),
      badges: ['picante'],
      options: [pontoDoOvo, extrasRamen],
    },
    {
      id: 'karaage',
      slug: 'karaage',
      name: 'Karaage',
      categoryId: 'entradas',
      description:
        'Coxa de frango marinada em shoyu, gengibre e saquê, empanada em fécula e frita duas vezes.',
      price: 38,
      image: img('1602273660127-a0000560a4c1', 'Frango karaage empanado servido em louça escura'),
    },
    {
      id: 'poke-tofu',
      slug: 'poke-tofu',
      name: 'Poke de tofu grelhado',
      categoryId: 'quentes',
      description:
        'Arroz avinagrado com tofu grelhado na chapa, tomate, milho, pepino, alface e ovo cozido. Leva molho de gergelim à parte.',
      price: 52,
      image: img(
        '1546069901-ba9599a7e63c',
        'Tigela com tofu grelhado em cubos, tomate, milho, pepino, alface e ovo cozido'
      ),
      badges: ['vegetariano'],
    },
    {
      id: 'torisoba',
      slug: 'torisoba',
      name: 'Torisoba',
      categoryId: 'quentes',
      description:
        'Caldo claro de frango com macarrão fino, peito desfiado, brócolis, pimentão e coentro. Vem com limão para espremer na hora.',
      price: 54,
      image: img(
        '1503764654157-72d979d9af2f',
        'Tigela clara com macarrão, frango desfiado, brócolis, pimentão e coentro, vista de cima'
      ),
    },
    {
      id: 'missoshiru',
      slug: 'missoshiru',
      name: 'Missoshiru',
      categoryId: 'entradas',
      description: 'Dashi de katsuobushi coado na hora, missô branco, tofu e cebolinha.',
      price: 22,
      image: img('1516684732162-798a0062be99', 'Tigela de missoshiru ao lado de uma tigela de arroz'),
    },
  ],
};

/* ------------------------------------------------------------------ */

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Marina Kubo',
    service: 'cliente desde 2016',
    quote:
      'Sentei no balcão sem saber o que ia comer e saí sem saber o nome de metade. Foi a melhor parte.',
    rating: 5,
    avatar: img('1615361200141-f45040f367be', 'Ilustração de nigiri no lugar do retrato'),
  },
  {
    id: 't2',
    name: 'Rafael Duarte',
    service: 'cliente',
    quote:
      'Peço o ramen pelo site quase toda quinta. Chega com o caldo e o macarrão separados, e isso muda tudo.',
    rating: 5,
    avatar: img('1615361200141-f45040f367be', 'Ilustração de nigiri no lugar do retrato'),
  },
  {
    id: 't3',
    name: 'Bianca Sartori',
    service: 'cliente',
    quote:
      'O hosomaki de pepino tem três ingredientes e é o melhor que já comi. Não sei o que fazer com essa informação.',
    rating: 5,
    avatar: img('1615361200141-f45040f367be', 'Ilustração de nigiri no lugar do retrato'),
  },
];

/*
  Sem equipe: nenhuma foto de rosto do lote passou sem marca visível no
  uniforme, e inventar um itamae com retrato de banco é justamente o que se
  evita em material fictício. A página conta a casa pelo balcão, não por
  crachás.
*/
const team: TeamMember[] = [];

/* ------------------------------------------------------------------ */

/*
  REPROVADAS na inspeção visual:
    1553163147     bibimbap — prato coreano, não japonês
    1558985250     sanduíche de pão de forma
    1554797589     rua com placas de negócios REAIS legíveis
    1571997478779  pizza
    1576402187878  refogado com massa curta, fora do conceito
    1596464716127  criança desenhando com canetinha

  E duas que passaram na folha de contato e SÓ se revelaram em tamanho de uso —
  o mesmo erro do herói da Brasa, cometido de novo no mesmo dia:
    1503764654157  tem frango e brócolis; estava descrita como sunomono VEGANO
    1546069901     os cubos são de tofu, com milho e tomate; estava descrita
                   como donburi de SALMÃO
  Nos dois casos a foto ficou e o ITEM foi reescrito para dizer o que ela
  mostra. O caminho contrário — manter o texto e procurar outra foto — teria
  custado mais e mentido menos só por sorte.
*/

export const kaiseki: DemoData = {
  demo,
  services: [],
  testimonials,
  team,
  menu,
  acceptsOrders: true,
  deliveryFee: 12,
};
