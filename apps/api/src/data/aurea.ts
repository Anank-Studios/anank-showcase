/**
 * Dados da Demo 1 — AUREA BEAUTY STUDIO.
 * Empresa, endereço, CNPJ, pessoas e depoimentos são FICTÍCIOS.
 *
 * Escopo do subagente `aurea`. Ver specs/10-demo-aurea.md.
 * Todas as imagens foram validadas com HTTP 200 (specs/01-design-tokens.md).
 */

import type { Service, TeamMember, Testimonial } from '@anank/contracts';
import { img, type DemoData } from './shared.js';

const services: Service[] = [
  {
    id: 'corte',
    slug: 'corte',
    name: 'Corte',
    category: 'Cabelo',
    summary: 'Leitura de rosto, textura e rotina antes de encostar a tesoura.',
    description:
      'Começa com uma conversa de dez minutos: como você acorda, quanto tempo tem de manhã, o que já deu errado antes. Só depois vem o corte. A ideia é você conseguir repetir em casa.',
    durationMin: 60,
    priceFrom: 120,
    icon: 'scissors',
    image: img('1712213396688-c6f2d536671f', 'Cabeleireira cortando cabelo com tesoura em close'),
  },
  {
    id: 'coloracao',
    slug: 'coloracao',
    name: 'Coloração',
    category: 'Cabelo',
    summary: 'Cor escolhida na luz natural, com teste de mecha antes.',
    description:
      'Fazemos o teste de mecha na primeira visita e guardamos a fórmula. Da segunda vez em diante, a cor sai igual — e a gente sabe exatamente quanto o seu fio aguenta.',
    durationMin: 150,
    priceFrom: 280,
    icon: 'palette',
    image: img('1707979577466-2d6109c68a45', 'Aplicação de coloração no cabelo com luvas'),
  },
  {
    id: 'mechas',
    slug: 'mechas',
    name: 'Mechas',
    category: 'Cabelo',
    summary: 'Loiro construído em camadas, respeitando o que o fio aguenta.',
    description:
      'Loiro não se faz em um dia. Montamos um plano de duas ou três visitas, com reconstrução entre elas. Você sai clara sem sair com o cabelo destruído.',
    durationMin: 210,
    priceFrom: 420,
    icon: 'layers',
    image: img('1617391654484-2894196c2cc9', 'Mechas sendo aplicadas com papel alumínio'),
  },
  {
    id: 'escova',
    slug: 'escova',
    name: 'Escova',
    category: 'Cabelo',
    summary: 'Lavagem com massagem de verdade e finalização que dura três dias.',
    description:
      'A lavagem é metade do serviço aqui. Massagem no couro cabeludo sem pressa, depois a escova no formato que combina com o seu corte.',
    durationMin: 45,
    priceFrom: 70,
    icon: 'wind',
    image: img('1580618672591-eb180b1a973f', 'Secagem de cabelo com escova redonda e secador'),
  },
  {
    id: 'tratamento',
    slug: 'tratamento',
    name: 'Tratamento capilar',
    category: 'Cabelo',
    summary: 'Diagnóstico do fio antes de escolher a máscara. Nada de receita pronta.',
    description:
      'Cabelo poroso, elástico e quebradiço pedem coisas diferentes. Avaliamos o fio molhado e seco, e montamos o protocolo — normalmente três sessões com quinze dias de intervalo.',
    durationMin: 90,
    priceFrom: 190,
    icon: 'droplet',
    image: img('1634449571010-02389ed0f9b0', 'Lavagem de cabelo no lavatório do salão'),
  },
  {
    id: 'sobrancelha',
    slug: 'sobrancelha',
    name: 'Design de sobrancelha',
    category: 'Estética',
    summary: 'Desenho feito com o rosto em repouso, não com a régua.',
    description:
      'Marcamos com você sentada e olhando para a frente, do jeito que as pessoas te veem. Tiramos pouco na primeira vez — dá pra tirar mais depois, tirar de menos não tem volta.',
    durationMin: 30,
    priceFrom: 60,
    icon: 'brow',
    image: img('1595475884562-073c30d45670', 'Mãos segurando tesoura e escova sobre fundo branco'),
  },
];

const testimonials: Testimonial[] = [
  {
    id: 'marina',
    name: 'Marina Belluco',
    service: 'Mechas',
    quote:
      'Tinha desistido de ser loira depois de duas experiências ruins. A Bruna me explicou por que ia levar três visitas — e levou três visitas exatamente como ela disse.',
    rating: 5,
    avatar: img('1494790108377-be9c29b29330', 'Retrato sorridente de Marina Belluco', 200),
    city: 'São Paulo',
  },
  {
    id: 'tais',
    name: 'Taís Okamoto',
    service: 'Corte',
    quote:
      'Primeira vez na vida que saí de um salão com um corte que eu consigo repetir sozinha em casa. Isso vale mais que o corte em si.',
    rating: 5,
    avatar: img('1701096374092-bb70915fdc5c', 'Retrato de Taís Okamoto ao ar livre', 200),
    city: 'São Paulo',
  },
  {
    id: 'renata',
    name: 'Renata Vilas Boas',
    service: 'Tratamento capilar',
    quote:
      'Elas não empurram produto. Na segunda sessão a Bruna disse que eu não precisava da terceira. Voltei mesmo assim, mas por gosto.',
    rating: 5,
    avatar: img('1609371497456-3a55a205d5eb', 'Retrato de Renata Vilas Boas', 200),
    city: 'São Paulo',
  },
];

/** A Aurea não tem seção de equipe — array vazio é resposta válida, não erro. */
const team: TeamMember[] = [];

export const aurea: DemoData = {
  demo: {
    slug: 'aurea',
    index: '01',
    brandName: 'Aurea Beauty Studio',
    category: 'Landing Page',
    tagline: 'Uma página. Tudo que um salão de bairro precisa para lotar a agenda.',
    priceRange: 'R$ 1.500–2.500',
    thumbnailWord: 'Seu cabelo',
    tokens: {
      bg: '#FBF7F2',
      surface: '#FFFFFF',
      ink: '#2A211C',
      muted: '#8A7A6E',
      accent: '#C4743F',
      accentAlt: '#E8D5C4',
      line: '#EADFD2',
      radius: '24px',
      fontDisplay: 'var(--font-fraunces)',
    },
    thumbnail: img(
      '1562322140-8baeececf3df',
      'Cabeleireira escovando o cabelo de uma cliente',
      800
    ),
    legalName: 'Aurea Studio de Beleza Ltda.',
    cnpj: '41.702.883/0001-64',
    city: 'São Paulo',
    since: 2019,
    description:
      'Salão de beleza na Vila Madalena. Corte, cor e cuidado feitos com calma, um atendimento por vez.',
    phone: '(11) 3081-4420',
    whatsapp: '5511970041188',
    email: 'oi@aureastudio.com.br',
    address: 'Rua Harmonia, 742 · Vila Madalena · São Paulo · SP',
    hours: [
      { day: 'Terça a sexta', open: '09:00 – 19:00' },
      { day: 'Sábado', open: '09:00 – 18:00' },
      { day: 'Domingo e segunda', open: 'Fechado' },
    ],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/aurea.studio' },
      { label: 'WhatsApp', url: 'https://wa.me/5511970041188' },
    ],
    /* `value` fica curto de propósito: a faixa de confiança é uma grade 2×2 em
       390px, e uma palavra longa como "Estacionamento" não quebra — estourava
       a coluna em 11px. O texto descritivo vai todo no `label`. */
    stats: [
      { value: '+2.400', label: 'clientes atendidos desde 2019' },
      { value: '4,9', label: 'no Google, em 312 avaliações' },
      { value: '100%', label: 'produtos veganos e livres de crueldade' },
      { value: 'Grátis', label: 'estacionamento no local' },
    ],
    images: {
      hero: img('1562322140-8baeececf3df', 'Cabeleireira escovando o cabelo de uma cliente'),
      interior: img('1521590832167-7bcbfaa6381f', 'Interior claro do salão com cadeira rosa'),
      bruna: img('1699899657680-421c2c2d5064', 'Retrato de Bruna Sartori, dona do Aurea', 900),
      produtos: img('1695527081782-33e110235ade', 'Prateleira com produtos capilares'),
      neon: img('1637777277435-3c44f82fd0c9', 'Letreiro de neon na parede do salão'),
      fachada: img('1521590832167-7bcbfaa6381f', 'Rua da Vila Madalena onde fica o Aurea', 1200),
      antes1: img('1605980766335-d3a41c7332a1', 'Cabelo loiro ondulado antes das mechas'),
      depois1: img('1554519934-e32b1629d9ee', 'Cabelo loiro finalizado depois das mechas'),
      antes2: img('1617391654484-2894196c2cc9', 'Cabelo com papel alumínio durante a coloração'),
      depois2: img('1470259078422-826894b933aa', 'Cabelo colorido em movimento depois do processo'),
      antes3: img('1707979577466-2d6109c68a45', 'Cabelo durante a aplicação de coloração'),
      depois3: img(
        '1712213396688-c6f2d536671f',
        'Cabelo finalizado depois do corte e reconstrução'
      ),
    },
  },
  services,
  testimonials,
  team,
};
