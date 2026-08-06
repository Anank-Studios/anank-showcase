# HANDOFF — Anank Showcase

> Arquivo de contexto para troca de sessão. **Atualizado a cada fase.**
> Última atualização: **Fase 2 em andamento** (3 subagentes rodando).

---

## 1. Onde fica

```
C:\Users\Guilherme Mazzutti\Desktop\Projetos Vibe\anank-showcase
```

Git inicializado, com commits por fase. Sem remote configurado ainda.

## 2. O que é

Portfólio comercial da **Anank Studios**: um hub em `/` que apresenta 3 demos de sites
fictícios de salão de beleza e clínica estética, em 3 níveis de complexidade e preço.
O cliente entra, escolhe uma demo, navega, e alterna entre as versões por um toggle flutuante.

O objetivo comercial: o cliente **sente** a diferença entre um site de R$ 1,5k, um de R$ 4k
e um de R$ 10k sem precisar que ninguém explique.

| Rota | Marca fictícia | Nível | Faixa |
|---|---|---|---|
| `/` | Anank Studios (hub) | — | — |
| `/demo/aurea` | Aurea Beauty Studio | Landing page única | R$ 1.500–2.500 |
| `/demo/vivace` + `/servicos` `/sobre` `/contato` | Vivace Estética Avançada | Institucional | R$ 3.500–5.000 |
| `/demo/oniria` + 6 subrotas | Oniria Clinic | Premium | R$ 10.000+ |

---

## 3. Preferências do usuário (Guilherme) — valem para tudo

1. **Mobile-first.** CSS base = 390px. `md:`/`lg:` só ADICIONAM. Nunca desktop-first.
2. **Sempre validar visualmente.** Screenshot em 390×844 **e** 1440×900, console limpo,
   antes de dizer "pronto". Build verde não basta. Isso vale para subagentes também.
3. **Identidade da Anank vem do repositório real**, não inventada — ver §5.
4. **Modo claro** no hub (o site institucional da Anank é escuro; o showcase é a mesma
   marca em claro).
5. Delegar implementação a subagentes Sonnet em paralelo (pedido explícito no briefing).
6. Zero `localStorage`/`sessionStorage`, zero `TODO`/`lorem`, copy real em pt-BR.

---

## 4. Como rodar

```bash
pnpm install     # já feito
pnpm dev         # web :3000 + api :3333
pnpm build       # contracts → api → web
pnpm typecheck   # tsc --noEmit em todos os workspaces
pnpm lint        # eslint
pnpm test        # 19 testes Vitest da API
node scripts/qa.mjs            # QA visual de TODAS as rotas
node scripts/qa.mjs aurea      # só um grupo: hub | aurea | vivace | oniria
```

`scripts/qa.mjs` abre cada rota em 390×844 e 1440×900, salva screenshot em
`qa/<viewport>/<nome>.png`, e **reprova** em: erro/warning de console, requisição com
status ≥400 (imagem 404 reprova), ou overflow horizontal. Relatório em `qa/report.json`.

---

## 5. Identidade da Anank Studios — oficial

Extraída de `assets/css/shared.css` do repositório
**`github.com/Anank-Studios/site-anank`** (clone local em
`Desktop\Projetos Vibe\Site Anank Studios`).

| Token | Valor |
|---|---|
| Verde Anank (accent) | `#2FAE80` · fringe `#54C99A` · glow `rgb(47 174 128 / .25)` |
| Pinho | `#1C3A2D` |
| Off-white | `#F7F7F7` |
| Black | `#060B08` |
| Texto secondary / tertiary | `#A7B3AC` / `#6E7B74` |
| Fontes | **Poppins** (300/400/500/600) + **JetBrains Mono** (400/500/700) |
| Raios | panel 48 · card 20 · pill 999 · sm 8 |
| Símbolo | estrela de 8 pontas — `apps/web/public/brand/anank-simbolo-*.svg` |

### ⚠ Armadilha de contraste (já resolvida, não regredir)

| Par | Razão | Veredito |
|---|---|---|
| `#2FAE80` sobre `#F7F7F7` | 2.6:1 | ✗ **nunca** como cor de texto |
| `#6E7B74` (tertiary oficial) sobre `#F7F7F7` | 4.1:1 | ✗ abaixo do mínimo |
| `#5A6862` sobre `#F7F7F7` | 5.5:1 | ✔ é o `--brand-muted` do hub |
| `#1C3A2D` (Pinho) sobre `#F7F7F7` | 11.6:1 | ✔ use para "texto verde" |

Na prática: Verde entra como **preenchimento, filete, chip e underline**. Texto na cor da
marca usa **Pinho**. O numeral do card é um chip com fundo `rgb(47 174 128 / .14)` e
numeral em Pinho.

---

## 6. Arquitetura — o essencial

Monorepo pnpm com 3 workspaces:

- `packages/contracts` — `@anank/contracts`, tipos TS puros compartilhados web ↔ api
- `apps/api` — Fastify 5 + Zod, **sem banco**. Dados em módulos TS em `src/data/`
- `apps/web` — Next.js 15 App Router, React 19, Tailwind v4

**Regra central:** o front **nunca** importa de `apps/api/src/data`. Todo dado chega por
`fetch` HTTP através de `apps/web/src/shared/lib/api.ts`. O ESLint reprova a violação.

Toda resposta da API é `{ data, error }`. Erros em pt-BR, com `details: [{field, message}]`
nos 422 — o `ApiError` do cliente expõe isso como `.fieldErrors`.

### Isolamento de escopo (o que permite os 3 subagentes em paralelo)

| Quem | Pode editar |
|---|---|
| Orquestrador | tudo |
| Subagente `aurea` | `apps/web/src/demos/aurea/**` + `apps/api/src/data/aurea.ts` |
| Subagente `vivace` | `apps/web/src/demos/vivace/**` + `apps/api/src/data/vivace.ts` |
| Subagente `oniria` | `apps/web/src/demos/oniria/**` + `apps/api/src/data/oniria.ts` |

As 12 rotas em `app/demo/**` são **cascas finas** do orquestrador que só importam e
renderizam um componente de entrada de `src/demos/<slug>/`. Os nomes desses componentes
são contrato e não mudam:

`AureaHome` · `VivaceHome` `VivaceServicos` `VivaceSobre` `VivaceContato` ·
`OniriaShell({children})` `OniriaHome` `OniriaProtocolos`
`OniriaProtocoloDetalhe({slug})` `OniriaManifesto` `OniriaEquipe` `OniriaAgendar`
`OniriaDiario`

### Acoplamento a vigiar

`apps/api/src/services/availability.ts` lê `oniria.services` e `oniria.practitioners` de
`data/oniria.ts`. Os ids **não podem mudar**: `aurora`, `vortice`, `meridiano`, `nocturne`,
`sereno`, `helena-kruger`, `marina-aveline`, `any`. Depois de mexer nesses dados, rode
`pnpm test`.

---

## 7. Estado atual

- [x] Ambiente verificado (node 24.13.1, pnpm 10.34.5, git, Playwright em cache)
- [x] Banco de **86 imagens Unsplash** validadas (HTTP 200) **e conferidas visualmente**
      em contact sheet — catalogadas por marca em `specs/01-design-tokens.md`
- [x] **Fase 0** — 7 specs em `/specs`
- [x] **Fase 1** — monorepo, API + mock de agenda, tokens das 4 marcas, `DemoToggle`,
      hub completo com a identidade real. Build verde, 26/26 rotas limpas no QA visual.
- [x] 19 testes Vitest da API passando
- [ ] **Fase 2** — 3 subagentes Sonnet construindo Aurea, Vivace e Oniria (EM ANDAMENTO)
- [ ] **Fase 3** — integração, QA visual final, coerência de marca, Lighthouse, README

### Se a sessão cair durante a Fase 2

Os subagentes escrevem direto no disco, então o trabalho deles sobrevive. Para retomar:

1. `git status` — veja o que eles produziram desde o commit `77929ca`.
2. `pnpm typecheck && pnpm lint && pnpm test` — descubra o que está quebrado.
3. `node scripts/qa.mjs` — QA visual completo, e **olhe os screenshots**.
4. Compare cada demo com o seu spec (`specs/10-`, `11-`, `12-`) e feche os buracos.
5. Siga para a Fase 3 (§8).

---

## 8. O que falta (Fase 3)

1. `pnpm typecheck && pnpm lint && pnpm build && pnpm test` — tudo verde.
2. `node scripts/qa.mjs` — 26 rotas × 2 viewports, 0 falhas, screenshots conferidos.
3. **Coerência de marca:** as 3 demos não podem compartilhar fonte display, raio de borda
   ou paleta. Matriz de diferenciação em `specs/01-design-tokens.md`. Se duas parecerem
   parentes, corrigir.
4. Toggle funcionando em todas as 12 rotas de demo, incluindo 390px.
5. Lighthouse: performance ≥85 e acessibilidade ≥95 nas demos 1 e 2; acessibilidade ≥90 na 3.
6. `README.md`: como rodar, o que é fictício, o que é mockado, tabela das 3 demos com
   faixas de preço, e os créditos das fotos do Unsplash.

---

## 9. Avisos que não podem sumir

- Todas as empresas, pessoas, endereços, CNPJs, registros profissionais e depoimentos são
  **fictícios**, e isso está declarado no rodapé de cada demo e vai no README.
- O agendamento da Oniria **não cria nada** em calendário nenhum. O backend responde no
  formato da Google Calendar API mas gera tudo em memória e **nunca persiste**.
  O aviso `"Demonstração. Nenhum agendamento foi criado de fato."` na tela de confirmação
  é **obrigatório**, 12px, e não pode ser removido nem escondido.
- Os únicos pedaços genuinamente funcionais do agendamento são o link
  `Adicionar ao Google Agenda` e o download do `.ics` — ambos por design.

---

## 10. Notas de ambiente descobertas

- `corepack enable pnpm` → **EPERM** nesta máquina. Usar `npm i -g pnpm@10`.
- Build do Next estoura memória se o `pnpm dev` estiver rodando junto — **pare o dev antes
  de `pnpm build`**.
- As rotas que buscam dados usam `export const dynamic = 'force-dynamic'` (em `app/page.tsx`
  e `app/demo/layout.tsx`), para o `next build` não precisar da API no ar.
- pnpm exige `pnpm.onlyBuiltDependencies` no `package.json` da raiz para `sharp`, `esbuild`
  e `unrs-resolver` — sem isso o `next/image` não otimiza.
- `eslint-plugin-react-hooks` precisa ser devDep **direto** de `apps/web` (node_modules
  estrito do pnpm), senão o `next build` falha ao carregar o config.
- Scraping direto de unsplash.com / pexels.com com `curl` é **bloqueado** (0 resultados / 403).
  A ferramenta **WebFetch** funciona e retorna os IDs das fotos.
- Validação de imagem: `curl -s -o /dev/null -w "%{http_code}" "https://images.unsplash.com/photo-<ID>?..."`.
  ID inválido retorna **404**, então o teste de 200 é confiável.
- Contact sheet para conferir imagens em lote: HTML em grid + screenshot via Playwright.
  Muito mais eficiente que abrir uma a uma.
