# 00 · Arquitetura

## Objetivo do produto

Uma única aplicação que serve de **portfólio comercial da Anank Studios**. Um hub apresenta 3 demos
de sites fictícios do nicho de beleza/estética, cada um em um nível de complexidade e preço distinto.
O cliente navega e **sente** a diferença entre R$ 1,5k, R$ 4k e R$ 10k sem precisar de explicação.

## Princípios não-negociáveis

1. **Mobile-first.** O CSS base é o layout de 390px. `md:` e `lg:` só *adicionam* complexidade.
   Nunca escrever desktop-first com overrides para baixo. Grid começa em 1 coluna.
   Tipografia display usa `clamp()` para não estourar em 390px.
2. **Validação visual obrigatória.** Nada é "pronto" sem screenshot em 390×844 **e** 1440×900,
   com console limpo. Build verde não é evidência suficiente.
3. **Separação front/back real.** O front nunca importa de `apps/api/src/data`. Todo dado chega
   por `fetch` HTTP ao backend.
4. **Zero placeholder.** Nada de `TODO`, `FIXME`, `lorem ipsum`, componente vazio.
   Copy real em português do Brasil, na voz de cada marca.
5. **Zero `localStorage` / `sessionStorage`.** Estado efêmero vive em React state / Context.
6. **`prefers-reduced-motion: reduce` desliga ou reduz todas as animações.**

## Árvore do repositório

```
anank-showcase/
├─ pnpm-workspace.yaml
├─ package.json                 # scripts orquestrados com concurrently
├─ tsconfig.base.json
├─ .gitignore
├─ README.md
├─ specs/
├─ packages/
│  └─ contracts/                # @anank/contracts — tipos TS compartilhados
│     ├─ src/index.ts
│     ├─ package.json
│     └─ tsconfig.json
└─ apps/
   ├─ api/                      # @anank/api — Fastify 5
   │  ├─ src/
   │  │  ├─ server.ts
   │  │  ├─ routes/{demos,booking,leads}.routes.ts
   │  │  ├─ services/{calendar.mock,availability}.ts
   │  │  ├─ data/{aurea,vivace,oniria}.ts
   │  │  └─ schemas/index.ts
   │  ├─ test/*.test.ts          # Vitest
   │  └─ package.json
   └─ web/                      # @anank/web — Next.js 15 App Router
      ├─ next.config.ts
      ├─ src/
      │  ├─ app/
      │  │  ├─ layout.tsx
      │  │  ├─ page.tsx                     # Hub Anank
      │  │  └─ demo/
      │  │     ├─ layout.tsx                # injeta DemoToggle + DemoChromeProvider
      │  │     ├─ aurea/page.tsx
      │  │     ├─ vivace/{page,servicos,sobre,contato}
      │  │     └─ oniria/{page,protocolos,manifesto,equipe,agendar,diario}
      │  ├─ demos/                          # TERRITÓRIO DOS SUBAGENTES
      │  │  ├─ aurea/**
      │  │  ├─ vivace/**
      │  │  └─ oniria/**
      │  ├─ shared/                         # TERRITÓRIO DO ORQUESTRADOR
      │  │  ├─ components/{DemoToggle,AnankMark,DemoChromeProvider}.tsx
      │  │  ├─ lib/{api,motion,cn}.ts
      │  │  └─ types/index.ts
      │  └─ styles/globals.css              # @theme + 4 escopos [data-brand]
      └─ package.json
```

## Regra de escopo (isolamento de subagentes)

| Agente | Pode criar/editar | Proibido |
|---|---|---|
| Orquestrador | tudo | — |
| Subagente `aurea` | `apps/web/src/demos/aurea/**`, `apps/api/src/data/aurea.ts` | qualquer outro caminho |
| Subagente `vivace` | `apps/web/src/demos/vivace/**`, `apps/api/src/data/vivace.ts` | qualquer outro caminho |
| Subagente `oniria` | `apps/web/src/demos/oniria/**`, `apps/api/src/data/oniria.ts` | qualquer outro caminho |

As páginas em `app/demo/<slug>/**` são criadas pelo orquestrador na Fase 1 como cascas finas que
apenas importam e renderizam o componente-raiz correspondente de `src/demos/<slug>/`. Exemplo:

```tsx
// app/demo/aurea/page.tsx  (orquestrador — subagente NÃO edita)
import { AureaHome } from '@/demos/aurea/AureaHome';
export default function Page() { return <AureaHome />; }
```

Se um subagente precisar de algo fora do seu escopo, ele **para e reporta ao orquestrador**.

## Stack

| Camada | Escolha | Observação |
|---|---|---|
| Front | Next.js 15 App Router, React 19, TS strict | RSC onde faz sentido |
| Estilo | Tailwind CSS v4 (`@theme inline`) | vars por marca via `[data-brand]` |
| Animação | `motion/react` | GSAP **só** em `demos/oniria` |
| Transição de rota | View Transitions API nativa | `experimental.viewTransition: true` |
| Scroll suave | Lenis | **só** em Vivace e Oniria |
| Back | Fastify 5, Zod, `@fastify/cors` | sem banco |
| Datas | `date-fns`, `date-fns-tz` | fuso `America/Sao_Paulo` |
| Fontes | `next/font/google` + `next/font/local` | ver 01-design-tokens |
| Testes | Vitest (api) + Playwright (visual) | |

## Portas e ambiente

- Web: `http://localhost:3000`
- API: `http://localhost:3333`
- `NEXT_PUBLIC_API_URL` — default `http://localhost:3333`
- CORS liberado para `http://localhost:3000`

## Scripts na raiz

```
pnpm dev        # concurrently: api (tsx watch) + web (next dev)
pnpm build      # contracts → api → web
pnpm lint       # eslint em todos os workspaces
pnpm typecheck  # tsc --noEmit em todos os workspaces
pnpm test       # vitest run (api)
pnpm qa         # playwright: screenshots + console check das 3 demos
```

## Fluxo de dados

```
apps/api/src/data/<slug>.ts   (fonte da verdade, módulo TS tipado)
        │
        ▼  rota Fastify, resposta { data, error }
   GET /api/demos/<slug>/...
        │
        ▼  fetch (server component ou client)
apps/web/src/shared/lib/api.ts
        │
        ▼  props tipadas por @anank/contracts
apps/web/src/demos/<slug>/**
```

Todo `fetch` server-side usa `{ cache: 'no-store' }` para que a demo sempre reflita o mock atual.
