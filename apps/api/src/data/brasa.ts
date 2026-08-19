/**
 * BRASA — hamburgueria de chapa fictícia. Nicho alimentação, nível 01.
 *
 * Estabelecimento, endereço, CNPJ, pessoas e depoimentos são FICTÍCIOS.
 *
 * É a demo INFORMATIVA do nicho: tem cardápio completo, mas não vende pelo
 * site. `acceptsOrders: false` — o pedido sai por WhatsApp ou telefone, que é
 * como a maioria das casas pequenas realmente opera. O degrau comercial das
 * outras duas demos é justamente o carrinho.
 *
 * Fotos conferidas UMA A UMA em folha de contato, não por HTTP 200. De 50
 * candidatas levantadas, 17 foram reprovadas — a lista está no fim do arquivo.
 */

import type { Demo, Menu, Testimonial, TeamMember } from '@anank/contracts';
import { img } from './shared.js';
import type { DemoData } from './shared.js';

const demo: Demo = {
  slug: 'brasa',
  niche: 'alimentacao',
  index: '01',
  brandName: 'Brasa',
  category: 'Hamburgueria de chapa',
  tagline: 'Carne moída duas vezes ao dia. Chapa a 250 graus. Nada congelado.',
  tierLabel: 'Site Institucional (sem pedidos)',
  priceRange: 'R$ 4.500+',
  legalName: 'Brasa Alimentos e Bar Ltda.',
  cnpj: '52.907.331/0001-08',
  city: 'São Paulo',
  since: 2019,
  description:
    'Seis hambúrgueres e mais nada. A carne é moída no açougue da casa duas vezes por dia, o pão sai da padaria da esquina de manhã, e a chapa não desce de 250 graus enquanto a porta estiver aberta.',
  phone: '(11) 34xx-xxxx',
  whatsapp: '5511900000000',
  email: 'oi@brasa.exemplo',
  address: 'Rua dos Pinheiros, 1.2xx — Pinheiros, São Paulo',
  hours: [
    { day: 'Terça a quinta', open: '18h — 23h' },
    { day: 'Sexta e sábado', open: '18h — 01h' },
    { day: 'Domingo', open: '17h — 22h' },
    { day: 'Segunda', open: 'Fechado' },
  ],
  socials: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'TikTok', url: 'https://tiktok.com' },
  ],
  tokens: {
    /* Clara de propósito. A Oniria e o Forno já são escuras; uma terceira demo
       escura faria o nicho inteiro parecer a mesma casa com fotos trocadas. */
    bg: '#f4f1ea',
    surface: '#ffffff',
    ink: '#17130f',
    muted: '#6b6259',
    accent: '#c1361f',
    accentAlt: '#8c4a13',
    line: '#ddd6c8',
    radius: '0px',
    fontDisplay: 'Archivo Black',
  },
  /*
    O herói foi TROCADO depois da validação visual. A primeira escolha
    (1615297928064) era bonita e passou na folha de contato, mas em tamanho de
    tela o recheio é claramente EMPANADO — um sanduíche de frango frito abrindo
    uma marca cuja manchete é "carne moída duas vezes ao dia".

    A lição não é sobre esta foto: miniatura de 420 px não resolve o assunto de
    uma imagem que vai ocupar 1440 px. Candidata a herói se confere no tamanho
    em que vai ser usada.
  */
  thumbnail: img('1561758033-d89a9ad46330', 'Hambúrguer de dois discos de carne com queijo derretido, ao lado de batatas fritas'),
  thumbnailWord: 'Brasa',
  images: {
    hero: img('1561758033-d89a9ad46330', 'Hambúrguer de dois discos de carne com queijo derretido, batatas fritas ao lado, fundo preto'),
    carne: img('1529692236671-f1f6cf9683ba', 'Peça de carne fatiada, malpassada no centro, sobre tábua escura'),
    corte: img('1558030006-450675393462', 'Fatias de carne grelhada dispostas em fileira sobre fundo escuro'),
    tabua: img('1544025162-d76694265947', 'Corte de carne assado servido na tábua com tomate e conservas'),
    grelha: img('1555939594-58d7cb561ad1', 'Carnes grelhadas vistas de cima, com molhos e batatas ao redor'),
    salao: img('1517248135467-4c7edcad34c4', 'Salão do restaurante com mesas de madeira e iluminação baixa'),
    balcao: img('1552566626-52f8b828add9', 'Salão amplo com balcão ao fundo e luz quente'),
    mesa: img('1466978913421-dad2ebd01d17', 'Mesa vista de cima com pessoas dividindo pratos e batatas'),
    pitmaster: img('1581299894007-aaa50297cf16', 'Cozinheiro uniformizado sorrindo dentro do salão'),
  },
  stats: [
    { value: '2×', label: 'a carne é moída por dia, no açougue da casa' },
    { value: '180 g', label: 'de acém e peito em cada disco' },
    { value: '250°', label: 'a chapa não desce disso' },
    { value: '6', label: 'hambúrgueres no cardápio — e é de propósito' },
  ],
};

/* ------------------------------------------------------------------ */
/* Cardápio — exposto, mas sem carrinho                                */
/* ------------------------------------------------------------------ */

/*
  Sem `options` em nenhum item. Grupo de escolha existe para montar um pedido,
  e esta casa não recebe pedido pelo site: seria interface prometendo algo que
  o botão não faz.
*/
const menu: Menu = {
  categories: [
    {
      id: 'chapa',
      slug: 'chapa',
      name: 'Da chapa',
      description: 'Os seis. Não giram, não saem de linha, não viram promoção.',
    },
    {
      id: 'dividir',
      slug: 'dividir',
      name: 'Para dividir',
      description: 'Vêm em porção grande. A ideia é o meio da mesa.',
    },
    {
      id: 'beber',
      slug: 'beber',
      name: 'Para beber',
      description: 'Chope tirado na hora e suco feito na hora. Só isso.',
    },
  ],
  items: [
    {
      id: 'brasa',
      slug: 'brasa',
      name: 'Brasa',
      categoryId: 'chapa',
      description:
        'Dois discos prensados na chapa, cheddar derretido entre eles e cebola caramelizada na própria gordura. O que dá nome à casa.',
      price: 38,
      image: img('1607013251379-e6eecfffe234', 'Hambúrguer duplo com queijo derretido escorrendo pelas laterais'),
      badges: ['o mais pedido'],
      ingredients: ['Dois discos de 90 g', 'Cheddar inglês', 'Cebola na chapa', 'Pão de batata'],
    },
    {
      id: 'classico',
      slug: 'classico',
      name: 'O Clássico',
      categoryId: 'chapa',
      description:
        'Um disco de 180 g, queijo prato, alface, tomate e molho da casa. O primeiro que a gente fez, em 2019, e ninguém deixou tirar.',
      price: 32,
      image: img('1568901346375-23c9450c58cd', 'Hambúrguer clássico com alface e tomate sobre tábua de madeira'),
      ingredients: ['Disco de 180 g', 'Queijo prato', 'Alface', 'Tomate', 'Molho da casa'],
    },
    {
      id: 'fumaca',
      slug: 'fumaca',
      name: 'Fumaça',
      categoryId: 'chapa',
      description:
        'Bacon defumado na madeira por seis horas, cheddar e cebola roxa crua para cortar a gordura.',
      price: 42,
      image: img('1550317138-10000687a72b', 'Hambúrguer com bacon e queijo, fundo escuro'),
      badges: ['defumado na casa'],
      ingredients: ['Disco de 180 g', 'Bacon defumado 6 h', 'Cheddar', 'Cebola roxa'],
    },
    {
      id: 'sete-e-meia',
      slug: 'sete-e-meia',
      name: 'Sete e Meia',
      categoryId: 'chapa',
      description:
        'Ovo frito de gema mole, bacon e queijo. Leva esse nome porque foi inventado às 19h30, com o que tinha sobrado da chapa.',
      price: 44,
      image: img('1565299507177-b0ac66763828', 'Hambúrguer com ovo, bacon e queijo derretido'),
      ingredients: ['Disco de 180 g', 'Ovo de gema mole', 'Bacon', 'Queijo prato'],
    },
    {
      id: 'verde',
      slug: 'verde',
      name: 'Verde',
      categoryId: 'chapa',
      description:
        'Disco de grão-de-bico e beterraba, abacate, rúcula e maionese de limão. Vegetariano de verdade, não hambúrguer sem carne.',
      price: 36,
      image: img('1520072959219-c595dc870360', 'Hambúrguer com abacate e folhas verdes sobre fundo claro'),
      badges: ['vegetariano'],
      ingredients: ['Disco de grão-de-bico', 'Abacate', 'Rúcula', 'Maionese de limão'],
    },
    {
      id: 'dobrado',
      slug: 'dobrado',
      name: 'Dobrado',
      categoryId: 'chapa',
      description:
        'Três discos, três fatias de queijo e mais nada. Não pergunte se dá para comer inteiro — não dá.',
      price: 46,
      image: img('1572802419224-296b0aeee0d9', 'Hambúrguer de três andares com queijo derretido'),
      badges: ['para dois'],
      ingredients: ['Três discos de 90 g', 'Três fatias de cheddar', 'Pão de batata'],
    },
    {
      id: 'fritas',
      slug: 'fritas',
      name: 'Fritas da casa',
      categoryId: 'dividir',
      description: 'Batata cortada no dia, cozida e frita duas vezes. Sal grosso por cima.',
      price: 18,
      image: img('1541592106381-b31e9677c0e5', 'Porção de batatas fritas douradas sobre ardósia escura'),
      ingredients: ['Batata asterix', 'Sal grosso'],
    },
    {
      id: 'fritas-ervas',
      slug: 'fritas-ervas',
      name: 'Fritas com ervas',
      categoryId: 'dividir',
      description: 'As mesmas fritas, com alho confitado, salsinha e parmesão ralado na hora.',
      price: 22,
      image: img('1630431341973-02e1b662ec35', 'Batatas fritas com ervas frescas servidas em tigela'),
      ingredients: ['Batata asterix', 'Alho confitado', 'Salsinha', 'Parmesão'],
    },
    {
      id: 'frango',
      slug: 'frango',
      name: 'Frango na cesta',
      categoryId: 'dividir',
      description: 'Coxa e sobrecoxa empanadas em farinha temperada, com molho de páprica defumada.',
      price: 26,
      image: img('1626082927389-6cd097cdc6ec', 'Pedaços de frango empanado sobre grade metálica'),
      badges: ['picante'],
      ingredients: ['Coxa e sobrecoxa', 'Farinha temperada', 'Molho de páprica'],
    },
    {
      id: 'chope',
      slug: 'chope',
      name: 'Chope da casa',
      categoryId: 'beber',
      description: 'Pilsen leve, feita para nós por uma cervejaria de Santo André. Copo de 350 ml.',
      price: 16,
      image: img('1608270586620-248524c67de9', 'Caneca de chope com colarinho, sobre fundo preto'),
    },
    {
      id: 'laranja',
      slug: 'laranja',
      name: 'Laranja na hora',
      categoryId: 'beber',
      description: 'Espremida quando você pede. Sem açúcar, sem gelo, a não ser que peça.',
      price: 12,
      image: img('1600271886742-f049cd451bba', 'Copo de suco de laranja com rodela de limão na borda'),
    },
  ],
};

/* ------------------------------------------------------------------ */

/*
  Sem foto nos depoimentos: o layout da Brasa usa as INICIAIS em um disco, não
  retrato. Foto de rosto de banco em depoimento fictício é a combinação mais
  fácil de confundir com pessoa real. O campo `avatar` do contrato continua
  preenchido porque é obrigatório, mas a tela não o renderiza.
*/
const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Diego Sanches',
    service: 'cliente desde 2019',
    quote:
      'Fui pelo hype e voltei pelo pão. Não é o recheio que faz esse hambúrguer, é o fato de ele não desmontar na terceira mordida.',
    rating: 5,
    avatar: img('1568901346375-23c9450c58cd', 'Ilustração de hambúrguer no lugar do retrato'),
  },
  {
    id: 't2',
    name: 'Priscila Amaral',
    service: 'cliente',
    quote:
      'O cardápio tem seis coisas. Levei quatro visitas para entender que isso é o argumento, não a limitação.',
    rating: 5,
    avatar: img('1568901346375-23c9450c58cd', 'Ilustração de hambúrguer no lugar do retrato'),
  },
  {
    id: 't3',
    name: 'Henrique Bastos',
    service: 'cliente',
    quote:
      'Peço o Verde e minha mulher pede o Dobrado. Saímos os dois satisfeitos, o que em hamburgueria é quase impossível.',
    rating: 5,
    avatar: img('1568901346375-23c9450c58cd', 'Ilustração de hambúrguer no lugar do retrato'),
  },
];

const team: TeamMember[] = [
  {
    id: 'm1',
    name: 'Téo Marchetti',
    role: 'Cozinheiro e sócio',
    bio: 'Passou nove anos em cozinha de restaurante antes de decidir que queria fazer uma coisa só, bem feita. Mói a carne ele mesmo, todo dia, às 15h.',
    photo: img('1581299894007-aaa50297cf16', 'Cozinheiro uniformizado sorrindo dentro do salão'),
  },
];

/* ------------------------------------------------------------------ */

/*
  REPROVADAS na inspeção visual, para ninguém tentar de novo:

  assunto errado, só visível em tamanho grande — passaram na folha de contato
    1615297928064  recheio empanado, não carne moída (era o herói)
    1551782450     idem, sanduíche de frango frito
    1596662951482  recheio de leitura ambígua, aparenta empanado
    1521305916504  discos de textura ambígua, não parecem carne bovina

  marca real à vista
    1610440042657  copo escrito "Gourmet Burger Kitchen"
    1550547660     duas garrafas de Coca-Cola no enquadramento
    1571407970349  garrafa de Coca-Cola no enquadramento
    1572490122747  milkshake coberto de biscoitos Oreo
    1573080496219  batatas embrulhadas em jornal real, manchete legível
    1607631568010  avental com marca escrita no peito
    1577219491135  avental com marca escrita no peito

  assunto errado
    1583394838336  fones de ouvido
    1607013407627  formatura
    1595246140625  caixas de papelão
    1512058564366  tigela de arroz
    1594007654729  pizza
    1516684732162  arroz e missoshiru (guardada para a japonesa)
    1414235077428  prato de alta gastronomia, fora do conceito
    1556910103     cozinha doméstica, fora do conceito
    1436076863939  brinde com garrafas de rótulo incerto

  404
    1594212699903, 1553979459, 1552526881, 1552914953, 1568650436496
*/

export const brasa: DemoData = {
  demo,
  services: [],
  testimonials,
  team,
  menu,
  /* O degrau comercial do nicho. A japonesa e a pizzaria vendem; esta expõe. */
  acceptsOrders: false,
};
