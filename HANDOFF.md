# HANDOFF — Anank Showcase

> Arquivo de contexto para troca de sessão. **Atualizado a cada fase.**
> Última atualização: **Fases 0 a 3 concluídas.** As 3 demos estão completas e validadas.
> Ver §7 (estado) e §8 (o que ainda dá para fazer).

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
      hub completo com a identidade real
- [x] 19 testes Vitest da API passando
- [x] **Fase 2** — as 3 demos completas
- [x] **Fase 3** — QA visual, coerência de marca, build de produção, README

### Como a Fase 2 realmente aconteceu

Os 3 subagentes Sonnet foram disparados em paralelo e **os três morreram no meio** por
limite mensal de gastos da conta (erro de API, não do código). O que sobreviveu:

- **Aurea** — completa (13 componentes)
- **Vivace** — completa (19 componentes, 3 de layout, 6 de lib, 4 rotas)
- **Oniria** — só a infraestrutura (preloader, cursor, grão, Lenis, SplitText, transição
  GSAP, geradores de `.ics` e do link do Google Agenda). As 7 páginas e o fluxo de
  agendamento foram escritos pelo **orquestrador** depois.

### Verificado (não presumido)

| Checagem | Resultado |
|---|---|
| `pnpm typecheck` · `pnpm lint` | limpos, zero warning |
| `pnpm test` | 19/19 |
| `pnpm build` | verde, 14 rotas |
| `node scripts/qa.mjs` | **26/26 rotas limpas** nos dois viewports |
| Coerência de marca | fonte display, raio, fundo e acento **todos distintos** entre as 3 |
| Pin do scroll horizontal | `secTop = 0` em qualquer scroll (desktop); **sem pin** < 1024px |
| Carrossel mobile da Oniria | 5 painéis, `scroll-snap: x mandatory`, rola |
| Fluxo de agendamento | skeleton aparece, 7 badges de últimas vagas, 4 erros inline em pt-BR |
| Aviso de demonstração | visível, **12px**, texto vindo do `demoNotice` da API |
| Link do Google Agenda | `text`, `dates`, `ctz`, `location` corretos e codificados |
| Download `.ics` | CRLF, `TZID=America/Sao_Paulo`, `VALARM`, dobra em 75 octetos |

---

## 8. O que ainda dá para fazer

### Acessibilidade — medida, e onde parou

Dois scripts fazem o gate. **Ambos precisam do `pnpm dev` rodando.**

```bash
node scripts/lh.mjs /demo/aurea            # a11y, boas práticas, SEO
node scripts/lh.mjs --perf /demo/aurea     # inclui performance (só contra build de produção)
node scripts/keyboard.mjs /demo/aurea      # percorre a página com Tab
```

> ⚠ Rode-os pelo **PowerShell**, não pelo Git Bash: o Bash no Windows converte o
> argumento `/demo/aurea` em caminho (`C:/Program Files/...`) e o Lighthouse
> devolve `INVALID_URL`.

Pontuações medidas contra o dev server:

| Rota | Acessibilidade |
|---|---|
| `/` (hub) | **100** |
| `/demo/aurea` | **100** |
| `/demo/vivace` | **100** |
| `/demo/vivace/sobre` | **100** |
| `/demo/vivace/contato` | 97 |
| `/demo/vivace/servicos` | 95 |
| Rotas da Oniria | **não medidas** |

**Pendente:**

1. **Medir as 8 rotas da Oniria** (meta ≥ 90) e corrigir o que aparecer. Atenção: o fundo é
   preto e o `--brand-muted` é `#85817A` — se reprovar em contraste, **não clareie o fundo**,
   ajuste o texto.
2. **Reconferir `/vivace/contato` e `/vivace/servicos`** — as últimas correções do toggle e
   do `heading-order` ainda não foram remedidas nessas duas.
3. **Performance nunca foi medida.** A meta do briefing era ≥ 85. Tem que ser contra
   `pnpm build && pnpm start`, nunca contra o dev server.
4. **`node scripts/keyboard.mjs`** só rodou no hub (limpo). Falta rodar nas 12 rotas de demo
   e conferir à mão os pontos que o script não pega: menu mobile da Aurea e da Vivace,
   carrosséis (o foco em card fora da área visível), lightbox da `/sobre`, o pin da Oniria e
   o fluxo de agendamento (foco ao trocar de etapa e ao chegar na tela de sucesso).

### Outros

5. Não há remote git configurado — nada foi publicado.

---

## 8b. Bugs reais encontrados e corrigidos (não repetir)

- **O `pin` do ScrollTrigger não funcionava na Oniria.** O `TransitionProvider` tinha
  `will-change-transform` **permanente** no wrapper da página. Isso cria um *containing
  block*, então todo `position: fixed` descendente se posiciona em relação a ele em vez da
  viewport — a seção de protocolos ficava com `top: -5700px` e rolava para fora da tela.
  O QA dava "OK" porque não havia erro de console nem overflow; **só olhar o screenshot
  revelou**. Correção: aplicar `will-change`/`transform`/`filter` só durante a transição e
  limpar com `clearProps` no fim, seguido de `ScrollTrigger.refresh()`.
- **Reveals presos em `opacity: 0` no QA.** `fullPage: true` do Playwright não rola de
  verdade, então o `IntersectionObserver` nunca dispara. Um subagente "resolveu" com um
  fallback de 700ms que revelava tudo — o que matava o efeito na página real. A causa era
  o script: o `qa.mjs` agora rola a página antes de capturar (com teto de passos, senão
  páginas com `pin` levam minutos).
- **Overflow de 11px na Aurea em 390px.** O valor `"Estacionamento"` na faixa de confiança
  é uma palavra única de 182px numa coluna de 147px, e palavra única não quebra. Corrigido
  encurtando os valores nos dados (`value` curto, texto no `label`) + `break-words`.
- **`.ics` sem dobra de linha.** A RFC 5545 exige 75 **octetos** por linha. A dobra conta
  octetos, não caracteres — cortar no meio de um "ç" (2 bytes) corromperia o arquivo.
- **`capitalize` do CSS** virava "10 De Agosto De 2026". Em pt-BR só a inicial leva
  maiúscula: usar `first-letter:uppercase`.
- **O `DemoToggle` derrubava a nota de acessibilidade das 12 rotas de demo de uma vez.**
  Dois motivos: o `role="tablist"` continha o link de volta e o divisor (`aria-required-children`
  só aceita filhos `role="tab"`), e os rótulos usavam `opacity` sobre um fundo translúcido —
  o que faz o contraste **depender da página atrás**, passando na Oniria (escura) e reprovando
  na Aurea e na Vivace (claras). Lição: em componente flutuante sobre fundo variável, use cor
  explícita e fundo quase opaco, nunca `opacity`.
- **Fade de opacidade reprova contraste de forma intermitente.** O rótulo de dica fazia
  `opacity 0→1` em 350ms; a auditoria às vezes amostrava no meio. Animar só `y` resolve.

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
- **O `next dev` trava e incha** (chegou a 1.7 GB) depois de matar runs do Playwright no
  meio. Sintoma: a API na 3333 responde em 200ms e a web na 3000 dá timeout até na home.
  Diagnóstico: `curl` separado em cada camada isola o culpado na hora. Receita:
  `Get-Process node | Where-Object StartTime -gt <início do run> | Stop-Process -Force`,
  apagar `apps/web/.next`, subir de novo. Filtre por `StartTime` para não derrubar
  processos node não relacionados.
- Mensagem de commit com aspas duplas quebra o here-string do PowerShell. Use
  `git commit -F arquivo.txt`.
