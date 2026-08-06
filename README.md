# Anank Showcase

Portfólio comercial da **Anank Studios**: um hub que apresenta três demonstrações de sites
para o nicho de beleza e estética, cada uma em um nível de complexidade e preço diferente.

O objetivo é simples: o cliente entra, navega, e **sente** a diferença entre um site de
R$ 1,5k, um de R$ 4k e um de R$ 10k sem precisar que ninguém explique.

---

## As três demos

| | Marca | Categoria | O que a distingue | Faixa |
|---|---|---|---|---|
| **01** | [Aurea Beauty Studio](http://localhost:3000/demo/aurea) | Landing page | Página única. Bem-feita e simples — sem parallax, sem carrossel, sem scroll-driven. A diferença para as outras não é acabamento, é escopo. | R$ 1.500–2.500 |
| **02** | [Vivace Estética Avançada](http://localhost:3000/demo/vivace) | Site institucional | Quatro rotas, três carrosséis de comportamentos distintos, contadores animados, filtro com transição de layout, parallax suave e scroll com Lenis. | R$ 3.500–5.000 |
| **03** | [Oniria Clinic](http://localhost:3000/demo/oniria) | Experiência premium | Sete rotas, transições cinematográficas com elemento compartilhado, preloader, cursor customizado, grão de filme, scroll horizontal fixado e agendamento próprio em quatro etapas. | R$ 10.000+ |

Um toggle flutuante permite alternar entre as três em qualquer rota.

---

## Como rodar

Requisitos: **Node ≥ 20.11** e **pnpm 10**.

```bash
pnpm install
pnpm dev
```

- Front (Next.js): http://localhost:3000
- API (Fastify): http://localhost:3333

### Outros comandos

```bash
pnpm build       # contracts → api → web
pnpm typecheck   # tsc --noEmit em todos os workspaces
pnpm lint        # eslint
pnpm test        # 19 testes Vitest da API
pnpm qa          # QA visual: screenshots em 390×844 e 1440×900
node scripts/qa.mjs aurea   # só um grupo: hub | aurea | vivace | oniria
```

O `pnpm qa` precisa do `pnpm dev` rodando. Ele abre cada rota nos dois viewports, salva os
screenshots em `qa/`, e **reprova** se houver erro de console, requisição com status ≥ 400
(imagem 404 reprova) ou overflow horizontal.

> **Atenção:** pare o `pnpm dev` antes de rodar `pnpm build` — os dois juntos estouram a
> memória do worker do Next nesta configuração.

---

## Arquitetura

Monorepo pnpm com três workspaces:

```
packages/contracts   @anank/contracts — tipos TS compartilhados, sem runtime
apps/api             Fastify 5 + Zod. Sem banco: os dados vivem em módulos TS
apps/web             Next.js 15 App Router, React 19, Tailwind v4
```

**A separação front/back é real e demonstrável.** O front nunca importa de
`apps/api/src/data`; todo dado chega por `fetch` HTTP através de
`apps/web/src/shared/lib/api.ts`. O ESLint reprova a violação.

Toda resposta da API usa o envelope `{ data, error }`, com mensagens de erro em português
e `details: [{ field, message }]` nos 422 — que o cliente expõe como `ApiError.fieldErrors`
para exibir sob o campo certo do formulário.

A especificação completa está em [`specs/`](specs/), e o contexto para retomar o trabalho
em [`HANDOFF.md`](HANDOFF.md).

### Princípios aplicados

- **Mobile-first.** O CSS base é o layout de 390px; `md:`/`lg:` apenas adicionam.
- **`prefers-reduced-motion: reduce`** desliga ou reduz todas as animações das três demos —
  inclusive o Lenis, o pin do ScrollTrigger, o preloader e o lag do cursor.
- **Zero `localStorage` / `sessionStorage`.** O estado "uma vez por sessão" (a dica do
  toggle, o preloader da Oniria) vive num Context no layout de `/demo`.
- Cada demo é envolvida em `<div data-brand="…">`, e o tema inteiro troca por CSS
  custom properties.

---

## O que é fictício

**Tudo.** Nenhuma das três empresas existe.

- **Aurea Beauty Studio** — salão fictício na Vila Madalena, São Paulo. A cabeleireira
  "Bruna Sartori" é um personagem.
- **Vivace Estética Avançada** — clínica fictícia com três unidades no Sul. As oito
  profissionais, os registros de conselho (CRM, CRBM, CREFITO, COREN, CRF) e os depoimentos
  são inventados.
- **Oniria Clinic** — instituto fictício nos Jardins, São Paulo. "Dra. Helena Kruger" e
  "Dra. Marina Aveline" são personagens; os números de CRM e RQE são inventados.

Endereços, telefones, e-mails, CNPJs e avaliações também são fictícios. Cada demo declara
isso no rodapé.

## O que é mockado

### Agendamento da Oniria — **não cria nada em calendário nenhum**

O fluxo parece real de ponta a ponta, e é isso que ele demonstra: que a integração de
verdade é um passo pequeno. Mas:

- O backend responde no **formato de um evento da Google Calendar API**
  (`kind: 'calendar#event'`, `htmlLink`, `start.dateTime`, `attendees`, `conferenceData`…),
  gerado **em memória** e **nunca persistido**. Não existe banco nem array global de eventos.
- A tela de confirmação exibe, obrigatoriamente e sem possibilidade de ocultar, a tarja
  **"Demonstração. Nenhum agendamento foi criado de fato."**
- Os **únicos** pedaços genuinamente funcionais são o link **"Adicionar ao Google Agenda"**
  (que abre uma pré-criação real) e o download do **`.ics`** (gerado no cliente, conforme a
  RFC 5545, com dobra de linha em 75 octetos, `TZID=America/Sao_Paulo` e `VALARM`).

### Disponibilidade da agenda

`apps/api/src/services/calendar.mock.ts` é **determinístico**: a mesma combinação de data,
protocolo e profissional devolve sempre os mesmos horários, via um PRNG com seed.

- Segunda a sexta 09:00–19:00, sábado 09:00–14:00, domingo fechado
- Grade de 30 em 30 minutos; a duração do protocolo bloqueia os slots seguintes
- Almoço 12:30–13:30 sempre bloqueado
- Hoje e os dois dias seguintes indisponíveis (antecedência mínima)
- Feriados nacionais de 2026 marcados como fechados
- A Dra. Helena tem a agenda mais cheia (55%) e não atende aos sábados; a Dra. Marina, 30%
- **Latência artificial** de 400–700ms em `/availability` e 900ms no `POST /booking` — ela
  existe de propósito, para o skeleton shimmer e os estados de carregamento terem função

### Formulários de captura

`POST /api/leads` valida com Zod e responde 201, mas **não armazena o lead**. A resposta
inclui `"Demonstração. Nenhum lead foi armazenado."`

---

## Fotografias

Todas as imagens vêm do **[Unsplash](https://unsplash.com)**, sob a
[licença Unsplash](https://unsplash.com/license), carregadas diretamente de
`images.unsplash.com`.

As 86 URLs usadas no projeto foram validadas por HTTP 200 **e conferidas visualmente** antes
de entrarem no código. Elas estão catalogadas por marca em
[`specs/01-design-tokens.md`](specs/01-design-tokens.md), e todas carregam um `alt`
descritivo em português.

O símbolo e a paleta da Anank Studios vêm do repositório da própria marca
(`Anank-Studios/site-anank`) — o site institucional é escuro, e este showcase é a mesma
identidade em modo claro.

---

## Licença

Projeto de portfólio. As demonstrações e todas as marcas fictícias nelas contidas foram
criadas pela **Anank Studios**, 2026.
