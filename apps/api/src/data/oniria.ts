/**
 * Dados da Demo 3 — ONIRIA CLINIC.
 * Instituto, endereço, CNPJ, profissionais, registros e depoimentos são FICTÍCIOS.
 *
 * Escopo do subagente `oniria`. Ver specs/12-demo-oniria.md.
 */

import type { Article, Practitioner, Service, TeamMember, Testimonial } from '@anank/contracts';
import { img, type DemoData } from './shared.js';

const services: Service[] = [
  {
    id: 'aurora',
    slug: 'aurora',
    name: 'Protocolo Aurora',
    category: 'Bioestímulo',
    summary: 'Bioestimulador de colágeno aplicado em vetores desenhados na avaliação.',
    description:
      'O colágeno não se repõe. Ele se estimula. O Aurora trabalha com bioestimuladores injetáveis distribuídos em vetores que respeitam a arquitetura óssea de cada rosto.',
    durationMin: 90,
    priceFrom: 3200,
    sessions: '3 sessões',
    interval: '45 dias',
    recovery: '48h de vermelhidão leve',
    indications: [
      'Flacidez de terço médio',
      'Perda de densidade',
      'Sulco nasogeniano',
      'Contorno mandibular',
    ],
    contraindications: [
      'Gestação e lactação',
      'Doença autoimune em atividade',
      'Infecção ativa na área',
      'Uso de anticoagulante sem liberação',
    ],
    image: img('1629684027309-92e2cc2de5ed', 'Retrato de pele luminosa em luz editorial'),
    acts: [
      {
        title: 'O diagnóstico',
        body: 'Antes de qualquer agulha, um mapa. Fotografamos em cinco ângulos sob luz controlada e marcamos onde o tecido perdeu sustentação. O rosto envelhece de dentro para fora, e é ali que se trabalha.',
        image: img('1777262080995-da4a45f51af8', 'Macro de cílios e pele em luz escura'),
      },
      {
        title: 'O procedimento',
        body: 'Anestésico tópico, aguardo de vinte minutos, e a aplicação em vetores. Cada ponto é registrado na ficha — não improvisamos o desenho na hora.',
        image: img('1765323337815-1b1c1a47cdaa', 'Interior escuro do instituto com luz quente'),
      },
      {
        title: 'O que muda',
        body: 'Nada acontece na primeira semana. O colágeno leva de trinta a sessenta dias para aparecer. Quem promete resultado imediato está vendendo outra coisa.',
        image: img('1586522471252-68f4b108ff2a', 'Curva arquitetônica branca e minimalista'),
      },
    ],
    faq: [
      {
        question: 'Dói?',
        answer:
          'Com o anestésico tópico, a sensação é de pressão. O desconforto maior costuma ser no dia seguinte, e cede sozinho.',
      },
      {
        question: 'Quando posso voltar ao trabalho?',
        answer: 'No mesmo dia. A vermelhidão some em até 48 horas e é discreta.',
      },
      {
        question: 'Quanto tempo dura?',
        answer: 'De 18 a 24 meses, dependendo do metabolismo e do protocolo de manutenção.',
      },
      {
        question: 'Preciso das três sessões?',
        answer:
          'Na maioria dos casos, sim. Reavaliamos na segunda e, se o resultado já for suficiente, dizemos.',
      },
    ],
  },
  {
    id: 'vortice',
    slug: 'vortice',
    name: 'Protocolo Vórtice',
    category: 'Lifting',
    summary: 'Ultrassom microfocado com visualização, em sessão única anual.',
    description:
      'Energia entregue em três profundidades distintas — derme, SMAS e tecido subcutâneo — com visualização em tempo real da camada tratada.',
    durationMin: 120,
    priceFrom: 6800,
    sessions: '1 sessão',
    interval: 'anual',
    recovery: 'sem downtime',
    indications: ['Flacidez de SMAS', 'Contorno mandibular', 'Papada', 'Sobrancelha caída'],
    contraindications: [
      'Gestação',
      'Implante metálico na área',
      'Doença autoimune em atividade',
      'Ferida aberta na área',
    ],
    image: img('1777262080995-da4a45f51af8', 'Macro de cílios e pele em luz dramática'),
    acts: [
      {
        title: 'O diagnóstico',
        body: 'A visualização mostra a camada exata antes de cada disparo. Sem ela, o aparelho entrega energia às cegas — e é assim que se queima gordura que deveria ficar.',
        image: img('1612864271882-5107e9e3b0ce', 'Macro de olho azul em alto contraste'),
      },
      {
        title: 'O procedimento',
        body: 'Duas horas de aplicação, linha por linha, com contagem registrada. O número de linhas é definido pela área e não pelo relógio.',
        image: img('1734629166615-8e3495a3b869', 'Corredor arqueado em preto e branco'),
      },
      {
        title: 'O que muda',
        body: 'O resultado se instala ao longo de noventa dias. Você não sai da sala diferente. Sai com um processo em curso.',
        image: img('1621260508240-baaeae3b4530', 'Escada branca de concreto em luz difusa'),
      },
    ],
    faq: [
      {
        question: 'É o mesmo que radiofrequência?',
        answer:
          'Não. A radiofrequência aquece a derme; o microfocado entrega energia no SMAS, a camada que sustenta o rosto.',
      },
      {
        question: 'Substitui a cirurgia?',
        answer:
          'Não substitui. Adia, em alguns casos, e melhora o contorno em outros. Quem tem indicação cirúrgica é informado.',
      },
      {
        question: 'Posso repetir antes de um ano?',
        answer: 'Não recomendamos. O tecido precisa desse tempo para completar a resposta.',
      },
      {
        question: 'Dói?',
        answer:
          'É desconfortável em pontos ósseos. Fazemos pausas e ajustamos a energia conforme a sua tolerância.',
      },
    ],
  },
  {
    id: 'meridiano',
    slug: 'meridiano',
    name: 'Protocolo Meridiano',
    category: 'Harmonização',
    summary: 'Harmonização facial guiada por proporção, não por tendência.',
    description:
      'Preenchimento e reposição volumétrica pensados a partir da estrutura óssea de cada rosto. Trabalhamos com o que já existe — não com um molde.',
    durationMin: 90,
    priceFrom: 4500,
    sessions: '2 sessões',
    interval: '30 dias',
    recovery: '5 a 7 dias de edema',
    indications: ['Perda de volume malar', 'Contorno mandibular', 'Sulcos', 'Assimetria leve'],
    contraindications: [
      'Gestação e lactação',
      'Doença autoimune em atividade',
      'Infecção ativa',
      'Expectativa incompatível com a anatomia',
    ],
    image: img('1588683301867-c442a9ed1389', 'Macro de olho e cílios com luz dourada'),
    acts: [
      {
        title: 'O diagnóstico',
        body: 'Medimos. Traçamos as linhas de proporção sobre a fotografia e conversamos sobre o que é possível e o que não é. Alguns pedidos são recusados aqui.',
        image: img('1781503056004-53972080018b', 'Macro de olho castanho e testa'),
      },
      {
        title: 'O procedimento',
        body: 'Cânula sempre que possível, agulha quando necessário. Volume aplicado em duas sessões — a primeira nunca entrega o total.',
        image: img('1570372225974-74fa85214b83', 'Geometria de parede branca em luz lateral'),
      },
      {
        title: 'O que muda',
        body: 'O objetivo é que ninguém saiba. Se a primeira coisa que percebem é o procedimento, o procedimento falhou.',
        image: img('1495462911434-be47104d70fa', 'Retrato editorial em preto e branco'),
      },
    ],
    faq: [
      {
        question: 'Vou ficar com cara de artificial?',
        answer:
          'Não, se o volume respeitar a estrutura. Aplicamos em duas etapas justamente para não passar do ponto.',
      },
      {
        question: 'Quanto tempo dura?',
        answer: 'De 12 a 18 meses, conforme o produto e a região.',
      },
      {
        question: 'Dá para reverter?',
        answer: 'Sim, no caso do ácido hialurônico, com hialuronidase.',
      },
      {
        question: 'Por que duas sessões?',
        answer:
          'Porque o edema da primeira mascara o resultado real. A segunda ajusta o que sobrou.',
      },
    ],
  },
  {
    id: 'nocturne',
    slug: 'nocturne',
    name: 'Protocolo Nocturne',
    category: 'Regeneração',
    summary: 'Regeneração noturna assistida, em sessões curtas e frequentes.',
    description:
      'A pele se repara à noite. O Nocturne trabalha com ativos e estímulos que acompanham esse ciclo, em sessões de sessenta minutos a cada quinze dias.',
    durationMin: 60,
    priceFrom: 1900,
    sessions: '6 sessões',
    interval: '15 dias',
    recovery: 'nenhuma',
    indications: [
      'Pele desidratada',
      'Perda de barreira cutânea',
      'Opacidade',
      'Estresse oxidativo',
    ],
    contraindications: [
      'Alergia a algum ativo do protocolo',
      'Dermatite em atividade',
      'Gestação sem liberação',
      'Uso de ácido em fase de descamação',
    ],
    image: img('1765323337815-1b1c1a47cdaa', 'Interior escuro com luz quente e discreta'),
    acts: [
      {
        title: 'O diagnóstico',
        body: 'Medimos hidratação e perda transepidérmica de água antes da primeira sessão e repetimos na terceira. O número diz mais que o espelho.',
        image: img('1761209355640-14d8d673258f', 'Macro de olho verde em luz baixa'),
      },
      {
        title: 'O procedimento',
        body: 'Limpeza suave, ativos em camadas, e uma máscara oclusiva por vinte minutos no escuro. É deliberadamente monótono.',
        image: img('1544717304-a2db4a7b16ee', 'Pele e ombro em ambiente de repouso'),
      },
      {
        title: 'O que muda',
        body: 'A pele para de reagir. Vermelhidão diminui, a maquiagem assenta diferente, e a rotina de casa encolhe para três produtos.',
        image: img('1738844153737-5d2525178e49', 'Fachada arquitetônica em preto e branco'),
      },
    ],
    faq: [
      {
        question: 'Posso fazer junto com outro protocolo?',
        answer: 'Sim. O Nocturne costuma ser combinado com o Aurora nos intervalos.',
      },
      {
        question: 'Preciso mudar minha rotina de casa?',
        answer: 'Provavelmente sim, e quase sempre para menos produtos.',
      },
      {
        question: 'Serve para pele oleosa?',
        answer: 'Serve. Oleosidade excessiva costuma ser resposta a barreira comprometida.',
      },
      {
        question: 'Seis sessões é o mínimo?',
        answer: 'É o protocolo completo. Efeito perceptível costuma vir na terceira.',
      },
    ],
  },
  {
    id: 'sereno',
    slug: 'sereno',
    name: 'Protocolo Sereno',
    category: 'Pós-procedimento',
    summary: 'Cuidado do tecido depois do procedimento. Não é cortesia, é parte do tratamento.',
    description:
      'Sessões de recuperação para quem passou por bioestímulo, microfocado ou harmonização. Reduz edema, acelera a resolução do hematoma e acompanha a evolução.',
    durationMin: 45,
    priceFrom: 780,
    sessions: 'conforme indicação',
    recovery: 'nenhuma',
    indications: ['Pós-bioestimulador', 'Pós-microfocado', 'Pós-harmonização', 'Edema persistente'],
    contraindications: [
      'Infecção ativa no local',
      'Suspeita de complicação vascular',
      'Febre',
      'Sem liberação do profissional que aplicou',
    ],
    image: img('1544717304-a2db4a7b16ee', 'Repouso em sala de recuperação com toalha branca'),
    acts: [
      {
        title: 'O diagnóstico',
        body: 'A primeira coisa é descartar complicação. Só depois disso o Sereno começa. Palidez, dor desproporcional e alteração de temperatura interrompem tudo.',
        image: img('1611035423909-55f170781d3d', 'Macro de olho azul em close'),
      },
      {
        title: 'O procedimento',
        body: 'Drenagem manual leve, laser de baixa potência e crioterapia controlada, na ordem que o quadro pedir.',
        image: img('1621260508240-baaeae3b4530', 'Escada branca em luz suave'),
      },
      {
        title: 'O que muda',
        body: 'O tempo de recuperação encurta e o resultado final aparece mais limpo. É a parte do trabalho que ninguém fotografa.',
        image: img('1570372225974-74fa85214b83', 'Parede branca em geometria minimalista'),
      },
    ],
    faq: [
      {
        question: 'É obrigatório?',
        answer: 'Não. É recomendado depois do Vórtice e do Meridiano.',
      },
      {
        question: 'Posso fazer se me tratei em outro lugar?',
        answer:
          'Sim, desde que traga a informação do que foi aplicado e a liberação de quem aplicou.',
      },
      {
        question: 'Quantas sessões?',
        answer: 'Normalmente duas. Casos com edema persistente podem precisar de quatro.',
      },
      {
        question: 'Acelera o resultado?',
        answer: 'Não acelera o colágeno. Acelera a resolução do edema, que é outra coisa.',
      },
    ],
  },
];

const practitioners: Practitioner[] = [
  {
    id: 'helena-kruger',
    name: 'Dra. Helena Kruger',
    title: 'Diretora científica · Dermatologista',
    photo: img(
      '1540172777610-b15b605dd68d',
      'Retrato em preto e branco da Dra. Helena Kruger',
      900
    ),
    bio: 'Dermatologista, diretora científica da ONIRIA. Conduz os protocolos Aurora e Vórtice e assina o desenho de cada plano.',
    availabilityNote: 'Agenda concorrida — costuma abrir com três semanas. Não atende aos sábados.',
  },
  {
    id: 'marina-aveline',
    name: 'Dra. Marina Aveline',
    title: 'Dermatologista',
    photo: img(
      '1620122303020-87ec826cf70d',
      'Retrato em preto e branco da Dra. Marina Aveline',
      900
    ),
    bio: 'Dermatologista com foco em regeneração e pós-procedimento. Conduz os protocolos Nocturne e Sereno.',
    availabilityNote: 'Agenda mais aberta. Atende também aos sábados pela manhã.',
  },
  {
    id: 'any',
    name: 'Sem preferência',
    title: 'A primeira profissional disponível',
    photo: img('1734629166615-8e3495a3b869', 'Corredor do instituto em preto e branco', 900),
    bio: 'Você é encaixada com quem tiver o horário mais próximo. O protocolo é o mesmo.',
    availabilityNote: 'Maior chance de horário nas próximas duas semanas.',
  },
];

const team: TeamMember[] = [
  {
    id: 'helena-kruger',
    name: 'Dra. Helena Kruger',
    role: 'Diretora científica',
    registry: 'CRM-SP 118.402 · RQE 41.882',
    bio: 'Dermatologista, membro da Sociedade Brasileira de Dermatologia. Fundou a ONIRIA em 2018 depois de doze anos em consultório.',
    photo: img(
      '1540172777610-b15b605dd68d',
      'Retrato em preto e branco da Dra. Helena Kruger',
      900
    ),
  },
  {
    id: 'marina-aveline',
    name: 'Dra. Marina Aveline',
    role: 'Dermatologista',
    registry: 'CRM-SP 142.907 · RQE 58.114',
    bio: 'Especialista em barreira cutânea e regeneração. Responsável pelos protocolos Nocturne e Sereno.',
    photo: img(
      '1620122303020-87ec826cf70d',
      'Retrato em preto e branco da Dra. Marina Aveline',
      900
    ),
  },
  {
    id: 'iara-benet',
    name: 'Iara Benet',
    role: 'Coordenadora de protocolo',
    registry: 'Biomédica · CRBM 1-14.882',
    bio: 'Escreve e revisa cada plano antes da primeira sessão. É quem garante que o registro fotográfico saia sempre igual.',
    photo: img('1541519481457-763224276691', 'Retrato em preto e branco de Iara Benet', 900),
  },
  {
    id: 'teresa-lund',
    name: 'Teresa Lund',
    role: 'Enfermeira',
    registry: 'COREN-SP 388.201',
    bio: 'Responde pela sala de procedimento e pelo protocolo de biossegurança do instituto.',
    photo: img('1508186225823-0963cf9ab0de', 'Retrato em preto e branco de Teresa Lund', 900),
  },
  {
    id: 'nadia-corvo',
    name: 'Nádia Corvo',
    role: 'Esteticista sênior',
    registry: 'Cadastro técnico 8.114/SP',
    bio: 'Conduz as sessões do Nocturne. Dezoito anos de prática em pele sensível.',
    photo: img('1633355130553-2d90ad3507d3', 'Retrato em preto e branco de Nádia Corvo', 900),
  },
  {
    id: 'olivia-restrepo',
    name: 'Olívia Restrepo',
    role: 'Concierge clínica',
    registry: 'Atendimento · unidade Jardins',
    bio: 'Organiza a agenda, os retornos e o contato entre você e a equipe. Uma pessoa, não um sistema.',
    photo: img('1644718847151-fff2271484a1', 'Retrato em preto e branco de Olívia Restrepo', 900),
  },
];

const testimonials: Testimonial[] = [
  {
    id: 'vera',
    name: 'Vera Lucchesi',
    service: 'Protocolo Vórtice',
    quote:
      'Me explicaram o que o aparelho não faz antes de explicar o que ele faz. Isso me convenceu.',
    rating: 5,
    avatar: img('1504275490777-45f30792f13f', 'Retrato em preto e branco de Vera Lucchesi', 200),
    city: 'São Paulo',
  },
  {
    id: 'antonio',
    name: 'Antônio Sanchez',
    service: 'Protocolo Aurora',
    quote:
      'Três sessões, três reavaliações, nenhum upsell. Saí com menos produtos em casa do que entrei.',
    rating: 5,
    avatar: img('1518611540400-6b85a0704342', 'Retrato em preto e branco de Antônio Sanchez', 200),
    city: 'São Paulo',
  },
  {
    id: 'leonor',
    name: 'Leonor Bastide',
    service: 'Protocolo Meridiano',
    quote: 'Pedi uma coisa que a Dra. Helena disse que não caberia no meu rosto. Ela tinha razão.',
    rating: 5,
    avatar: img('1568633782872-67d29d4615d2', 'Retrato em preto e branco de Leonor Bastide', 200),
    city: 'São Paulo',
  },
  {
    id: 'clara',
    name: 'Clara Vasconcellos',
    service: 'Protocolo Nocturne',
    quote:
      'A pele parou de reagir a tudo. Foi a primeira vez em anos que eu não precisei de corretivo.',
    rating: 5,
    avatar: img('1548207775-a7676e36f20a', 'Retrato em preto e branco de Clara Vasconcellos', 200),
    city: 'São Paulo',
  },
];

const articles: Article[] = [
  {
    id: 'memoria-da-pele',
    slug: 'a-memoria-da-pele',
    title: 'A memória da pele',
    subtitle: 'Por que o tecido lembra de cada verão, e o que se pode fazer com isso.',
    readingMin: 7,
    publishedAt: '2026-06-18',
    image: img('1777262080995-da4a45f51af8', 'Macro de cílios e pele em luz escura'),
    body: [
      'A pele não esquece. Cada exposição solar, cada noite mal dormida, cada ciclo hormonal deixa um registro no tecido — e esse registro não é metafórico. Ele é bioquímico, mensurável, e em grande parte reversível.',
      'O colágeno tipo I, que sustenta a derme, tem meia-vida longa. As fibras que você tem hoje foram produzidas há anos. Quando a produção cai — e ela cai cerca de um por cento ao ano a partir dos vinte e cinco — o que resta é o estoque. É por isso que o rosto muda devagar e depois de repente.',
      'A radiação ultravioleta acelera esse processo por dois caminhos. Fragmenta as fibras existentes e inibe a produção de novas. Um verão sem proteção custa mais do que três meses de tratamento recuperam.',
      'Há uma boa notícia nisso. O fibroblasto — a célula que produz colágeno — continua vivo e responsivo. Ele não morre com a idade. Ele fica quieto. E o que a estética avançada faz, quando é bem feita, é acordá-lo.',
      'Bioestimuladores funcionam assim. Não repõem colágeno; provocam uma resposta inflamatória controlada que faz o fibroblasto voltar ao trabalho. É por isso que o resultado demora sessenta dias. O que se aplica não é o resultado. É o pedido.',
      'O ultrassom microfocado usa outro caminho: entrega energia térmica em pontos precisos do SMAS, a camada muscular que sustenta o rosto. A contração é imediata; a neocolagênese que vem depois é o que sustenta o efeito.',
      'Nada disso funciona sem o básico. Fotoproteção diária, sono, e uma barreira cutânea íntegra. Sem isso, todo procedimento é uma tentativa de encher um balde furado.',
      'A pele tem memória. A boa notícia é que ela também aprende coisas novas.',
    ],
  },
  {
    id: 'contra-o-imediato',
    slug: 'contra-o-imediato',
    title: 'Contra o imediato',
    subtitle: 'O que se perde quando o resultado precisa aparecer na mesma semana.',
    readingMin: 5,
    publishedAt: '2026-05-02',
    image: img('1765323337815-1b1c1a47cdaa', 'Interior escuro com luz quente e discreta'),
  },
  {
    id: 'o-que-nao-fazemos',
    slug: 'o-que-nao-fazemos',
    title: 'O que não fazemos',
    subtitle: 'Uma lista curta de procedimentos que recusamos, e a razão de cada um.',
    readingMin: 6,
    publishedAt: '2026-03-27',
    image: img('1734629166615-8e3495a3b869', 'Corredor arqueado em preto e branco'),
  },
  {
    id: 'a-luz-certa',
    slug: 'a-luz-certa',
    title: 'A luz certa',
    subtitle: 'Como fotografamos resultado sem mentir — e por que quase todo mundo mente.',
    readingMin: 4,
    publishedAt: '2026-02-11',
    image: img('1612864271882-5107e9e3b0ce', 'Macro de olho azul em alto contraste'),
  },
  {
    id: 'barreira',
    slug: 'barreira',
    title: 'Barreira',
    subtitle: 'A camada de dois milímetros que decide se qualquer tratamento vai funcionar.',
    readingMin: 8,
    publishedAt: '2025-12-04',
    image: img('1586522471252-68f4b108ff2a', 'Curva arquitetônica branca e minimalista'),
  },
  {
    id: 'idade-e-outra-coisa',
    slug: 'idade-e-outra-coisa',
    title: 'Idade é outra coisa',
    subtitle: 'Sobre longevidade da pele, e por que ela não se mede em anos.',
    readingMin: 6,
    publishedAt: '2025-10-19',
    image: img('1495462911434-be47104d70fa', 'Retrato editorial em preto e branco'),
  },
];

export const oniria: DemoData = {
  demo: {
    slug: 'oniria',
    index: '03',
    brandName: 'Oniria Clinic',
    category: 'Experiência Premium',
    tagline: 'Transições cinematográficas e agendamento próprio. O site vira parte do produto.',
    priceRange: 'R$ 10.000+',
    thumbnailWord: 'A pele',
    tokens: {
      bg: '#0A0A0B',
      surface: '#131315',
      ink: '#F2EFE9',
      muted: '#85817A',
      accent: '#B08D57',
      accentAlt: '#E5D9C3',
      line: '#26262A',
      radius: '0px',
      fontDisplay: 'var(--font-bodoni-moda)',
    },
    thumbnail: img(
      '1574015974293-817f0ebebb74',
      'Retrato editorial em preto e branco com cabelo em movimento',
      800
    ),
    legalName: 'Oniria Instituto de Longevidade da Pele Ltda.',
    cnpj: '52.914.660/0001-08',
    city: 'São Paulo',
    since: 2018,
    description:
      'Instituto de estética avançada e longevidade da pele. Unidade única nos Jardins, atendimento por hora marcada.',
    phone: '(11) 3062-9040',
    whatsapp: '5511992087744',
    email: 'contato@oniriaclinic.com.br',
    address: 'Rua Bela Cintra, 1842 · Jardins · São Paulo · SP',
    hours: [
      { day: 'Segunda a sexta', open: '09:00 – 19:00' },
      { day: 'Sábado', open: '09:00 – 14:00' },
      { day: 'Domingo', open: 'Fechado' },
    ],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/oniria.clinic' },
      { label: 'WhatsApp', url: 'https://wa.me/5511992087744' },
    ],
    stats: [
      { value: '2018', label: 'ano de fundação' },
      { value: '1', label: 'unidade, por escolha' },
      { value: '5', label: 'protocolos' },
      { value: '90 min', label: 'de sessão, no mínimo' },
    ],
    images: {
      hero: img('1574015974293-817f0ebebb74', 'Retrato em preto e branco com cabelo em movimento'),
      heroAlt: img('1765323337815-1b1c1a47cdaa', 'Interior escuro do instituto com luz quente'),
      manifesto: img('1621260508240-baaeae3b4530', 'Escada branca de concreto em luz difusa'),
      arquitetura: img('1734629166615-8e3495a3b869', 'Corredor arqueado em preto e branco'),
      fachada: img('1738844153737-5d2525178e49', 'Fachada arquitetônica em preto e branco'),
      geometria: img('1570372225974-74fa85214b83', 'Parede branca em geometria minimalista'),
      curva: img('1586522471252-68f4b108ff2a', 'Curva branca minimalista em luz suave'),
      helena: img('1540172777610-b15b605dd68d', 'Retrato em preto e branco da Dra. Helena Kruger'),
      editorial: img('1495462911434-be47104d70fa', 'Retrato editorial de chapéu em preto e branco'),
      antes1: img('1612864271882-5107e9e3b0ce', 'Macro de olho azul antes do protocolo'),
      depois1: img('1611035423909-55f170781d3d', 'Macro de olho azul depois do protocolo'),
      antes2: img('1781503056004-53972080018b', 'Macro de pele e testa antes do protocolo'),
      depois2: img('1761209355640-14d8d673258f', 'Macro de olho verde depois do protocolo'),
      antes3: img('1588683301867-c442a9ed1389', 'Macro de cílios antes do protocolo'),
      depois3: img('1777262080995-da4a45f51af8', 'Macro de cílios e pele depois do protocolo'),
    },
  },
  services,
  testimonials,
  team,
  practitioners,
  articles,
};
