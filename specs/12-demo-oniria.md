# 12 · Demo 3 — ONIRIA CLINIC (Premium · R$ 10.000+)

**Rotas:** `/demo/oniria`, `/protocolos`, `/protocolos/[slug]`, `/manifesto`, `/equipe`,
`/agendar`, `/diario`.
**Escopo do subagente:** `apps/web/src/demos/oniria/**` e `apps/api/src/data/oniria.ts`.
**Wrapper:** `<div data-brand="oniria">`.

> Este spec é ~3× o trabalho dos outros. Orçamento de tempo e passos maior.

## O argumento comercial

Cada detalhe precisa comunicar "isto custou dez mil". O que diferencia não é ter mais seções —
é **tempo de execução percebido**: transições orquestradas, tipografia trabalhada, silêncio.

**Luxo não é lentidão.** Nenhuma transição passa de ~1.1s percebidos. Se ficar arrastado, está errado.

---

## Marca

Instituto de estética avançada e longevidade da pele. Unidade única, Jardins, São Paulo.
Atendimento por hora marcada, ticket alto. Diretora científica: **Dra. Helena Kruger**.

Tokens em `specs/01-design-tokens.md` §4.3: fundo `#0A0A0B`, surface `#131315`,
tinta `#F2EFE9`, bronze `#B08D57`, bronze claro `#E5D9C3`, raio **0px**,
display **Bodoni Moda**, corpo **Inter Tight** com `ls: -0.01em`.

**Voz:** mínima, autoral, quase literária. Frases curtas. Nunca exclamação, nunca emoji,
nunca "clique aqui". *"A pele tem memória. Nós trabalhamos com ela."*

---

## Fundação técnica

### 1. Transições cinematográficas entre páginas

Duas camadas combinadas.

**(a) View Transitions API nativa** — `next.config.ts` já tem `experimental.viewTransition: true`
(configurado pelo orquestrador). Use-a para o **elemento compartilhado**: a imagem de um protocolo
na listagem recebe `style={{ viewTransitionName: 'protocolo-<slug>' }}`, e o hero da página de
detalhe recebe **o mesmo nome**. Só um elemento com cada nome pode estar visível por vez.

**(b) Overlay orquestrado com GSAP**, por cima:

```
clique no link
 ├─ 4 painéis verticais (25vw cada, cor --surface) varrem de baixo para cima
 │    stagger 60ms · power4.inOut · 0.9s
 ├─ conteúdo antigo: scale 1 → 0.96, filter blur(0) → blur(8px)   [0.5s]
 ├─ (sob a máscara) a rota troca
 └─ painéis saem para cima · nova página entra scale 1.04 → 1     [0.7s]
```

Total percebido ≈ **1.1s**. Implementar como um componente `OniriaTransition` que envolve o
conteúdo das rotas da Oniria, com um contexto que expõe `navigate(href)`.
Os links internos da Oniria chamam `navigate()` em vez de `<Link>` puro
(mas continuam sendo `<a href>` reais, com `preventDefault` só quando é clique simples
sem modificador — Ctrl/Cmd/Shift/botão do meio devem abrir normalmente).

**Fallback `prefers-reduced-motion: reduce`:** sem painéis, sem blur, sem scale —
crossfade simples de **200ms**. Verificar com `matchMedia` e reavaliar em mudança.

### 2. Preloader
Só na **primeira visita da sessão**. Estado em um Context do layout da Oniria — **nunca**
`sessionStorage`.
- Contador `00` → `100` em Bodoni Moda `clamp(4rem, 22vw, 12rem)`, canto inferior esquerdo.
- Barra de **1px** em `--accent` bronze crescendo de 0 a 100% da largura, no rodapé.
- Duração 1.4s, `power2.out`.
- Saída em cortina: o painel sobe (`yPercent: 0 → -100`, 0.8s `power4.inOut`) revelando a home.
- Sob reduced-motion: aparece por 300ms e some com fade.

### 3. Lenis
`new Lenis({ lerp: 0.075 })`. Integrado ao ticker do GSAP:
```ts
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```
Destruir no unmount. Desativado sob reduced-motion.

### 4. Cursor customizado
- Ponto de **8px** (`--accent-2`) que segue o mouse sem lag.
- Anel de **32px** (borda 1px `--ink` a 40%) com lag (`lerp` 0.15).
- Sobre elementos com `data-cursor="<rótulo>"`: o anel expande para **64px**, o fundo vira
  `--accent` a 15%, e o rótulo aparece dentro (Inter Tight 10px, caixa alta, `ls .16em`).
  Rótulos: `VER` · `ARRASTAR` · `AGENDAR` · `LER`.
- **Desativado em touch**: `matchMedia('(hover: hover) and (pointer: fine)')`.
  Sob reduced-motion, o anel não tem lag (segue direto).
- `mix-blend-mode: difference` no anel para funcionar sobre imagem clara e fundo escuro.
- `pointer-events: none`, `z-index: 100`.

### 5. Grão de filme
SVG `feTurbulence baseFrequency="0.8" numOctaves="4"` em `<filter>`, aplicado a um `<rect>`
que preenche um SVG `position: fixed; inset: 0`, `opacity: .035`,
`mix-blend-mode: overlay`, `pointer-events: none`, `z-index: 60`.
Estático (não animado) — animar grão custa GPU e não acrescenta.

### 6. Revelação de texto — `SplitText` próprio
**Não usar o plugin pago do GSAP.** Escrever `src/demos/oniria/lib/splitLines.ts`:
- Envolve cada palavra em `<span class="word">`, mede `offsetTop` para agrupar em linhas,
  e envolve cada linha em `<span class="line"><span class="line-inner">…</span></span>`
  com `overflow: hidden` na `.line`.
- Anima `.line-inner` de `y: 100%` a `y: 0`, stagger **60ms**, `power3.out`, 0.9s.
- **Re-split no resize** (debounce 200ms) — senão quebra ao girar o celular.
- Preserva o texto original em um `data-` attribute para poder restaurar.
- Sob reduced-motion: não faz split, só um fade de 200ms no bloco inteiro.
- **Acessibilidade:** o container recebe `aria-label` com o texto completo e os spans
  internos ficam `aria-hidden="true"` — senão o leitor de tela lê palavra a palavra.

### 7. Scroll-driven
- **Hero:** `scale` de 1.08 → 1 e `clip-path: inset(12% 12% 12% 12%)` → `inset(0%)`
  conforme o scroll dos primeiros 60vh.
- **Seção horizontal de protocolos:** `ScrollTrigger` com `pin: true`,
  `scrub: 1`, translada o trilho em `x` de 0 a `-(largura - 100vw)`.
  **No mobile (< 1024px) NÃO usar pin** — vira um carrossel horizontal por scroll-snap normal.
  Pin em telas pequenas é o erro clássico que quebra a página.
- `ScrollTrigger.refresh()` após as fontes carregarem (`document.fonts.ready`).

---

## Os 5 protocolos

| Slug | Nome | Aparelho/ativo | Duração | Sessões | Intervalo | Recuperação | A partir de |
|---|---|---|---|---|---|---|---|
| `aurora` | Protocolo Aurora | bioestimulador de colágeno | 90 | 3 | 45 dias | 48h de vermelhidão leve | R$ 3.200 |
| `vortice` | Protocolo Vórtice | ultrassom microfocado | 120 | 1 | anual | sem downtime | R$ 6.800 |
| `meridiano` | Protocolo Meridiano | harmonização facial | 90 | 2 | 30 dias | 5 a 7 dias de edema | R$ 4.500 |
| `nocturne` | Protocolo Nocturne | regeneração noturna assistida | 60 | 6 | 15 dias | nenhuma | R$ 1.900 |
| `sereno` | Protocolo Sereno | pós-procedimento | 45 | conforme indicação | — | nenhuma | R$ 780 |

Imagens sugeridas: aurora `1629684027309-92e2cc2de5ed` · vortice `1777262080995-da4a45f51af8` ·
meridiano `1588683301867-c442a9ed1389` · nocturne `1765323337815-1b1c1a47cdaa` ·
sereno `1544717304-a2db4a7b16ee`.

---

## Páginas

### `/demo/oniria` — Home

1. **Hero.** Imagem `1574015974293-817f0ebebb74` (B&W, cabelo em movimento) com Ken Burns
   sutil (scale 1 → 1.06 em 12s, `ease: linear`, alternando). Máscara `clip-path` que abre
   ao carregar (0.9s `power4.inOut`).
   Headline: **`A pele tem memória.`** — Bodoni Moda `clamp(2.75rem, 15vw, 11rem)`,
   revelada com `splitLines`.
   Subtítulo: `Instituto de estética avançada e longevidade. Jardins, São Paulo.`
2. **Manifesto curto.** Texto revelado linha a linha conforme o scroll:
   `Não tratamos rugas. Tratamos o tecido que as produz.` + 2 parágrafos.
   Link `Ler o manifesto →` (cursor `LER`).
3. **Scroll horizontal fixado — os 5 protocolos.** Trilho com 5 painéis full-height.
   Cada painel: numeral romano (I–V) em bronze, nome em Bodoni gigante, uma linha de
   descrição, e a imagem em máscara. Cursor `VER`. Desktop com pin; mobile com scroll-snap.
4. **Resultados.** Comparação antes/depois com **máscara arrastável** — mesma mecânica do
   `BeforeAfter` da Aurea, mas visualmente oposta: sem raio, divisor de 1px bronze,
   alça retangular de 2×48px, e as legendas em caixa alta 10px. Cursor `ARRASTAR`.
   3 pares, usando os macros de pele.
5. **Dra. Helena Kruger.** Retrato B&W `1540172777610-b15b605dd68d` em coluna estreita,
   ao lado de um texto curto e uma citação em Bodoni italic.
   Credenciais fictícias: `CRM-SP 118.402 · RQE 41.882 · Membro da SBD`.
6. **CTA de agendamento.** Uma linha de texto e um único link para `/agendar`.
   Cursor `AGENDAR`.

### `/demo/oniria/protocolos`
- **Grid editorial assimétrico**: colunas de alturas diferentes
  (ex.: `lg:grid-cols-12` com itens em `col-span-5 / col-span-7 / col-span-4`,
  e `margin-top` variável para quebrar o alinhamento). No mobile, 1 coluna com
  alturas alternadas 4:5 / 3:4.
- **Hover em um item desatura todos os outros**: o container ganha uma classe quando
  algum filho está em hover; os não-hover recebem `filter: grayscale(1) brightness(.55)`,
  400ms. Implementar com `:has()` em CSS (suportado) + fallback por estado React.
- Clique → transição cinematográfica **com imagem compartilhada** (`viewTransitionName`).

### `/demo/oniria/protocolos/[slug]`
Página editorial longa. `generateStaticParams` com os 5 slugs.
1. **Hero**: nome em Bodoni gigante sobre a imagem compartilhada (recebe o
   `viewTransitionName` correspondente).
2. **Ficha técnica**: grade de 4 células com linha 1px — `Duração` · `Sessões` ·
   `Intervalo` · `Recuperação`. Labels em 10px caixa alta bronze.
3. **Narrativa em 3 atos** — `O diagnóstico` · `O procedimento` · `O que muda` —
   com imagens **full-bleed** intercaladas entre os atos.
4. **Indicações e contraindicações** em duas colunas separadas por linha vertical.
5. **FAQ em acordeão** — 4 perguntas por protocolo, `<button aria-expanded aria-controls>`,
   altura animada.
6. **Navegação "próximo protocolo"** com preview: nome, imagem em miniatura, e a seta.
   Circular (do `sereno` volta para `aurora`).

### `/demo/oniria/manifesto`
Quase sem imagem. Puro tipográfico, `max-w-[62ch]`, centralizado.
Scroll revela **parágrafo a parágrafo** (`whileInView` + `splitLines`).
7 a 9 parágrafos curtos na voz da marca. Uma única imagem, no fim, em largura total e
baixa opacidade. Título: `Manifesto`.

### `/demo/oniria/equipe`
- Retratos **B&W** em grid (2 col mobile → 3 col desktop), `aspect-[3/4]`.
- **Hover revela o retrato colorido em uma máscara circular que segue o cursor**:
  duas camadas empilhadas — a B&W embaixo e a colorida por cima com
  `clip-path: circle(0px at 50% 50%)`; no hover vira `circle(110px at <x>px <y>px)`,
  atualizado no `pointermove` relativo ao card. Raio anima de 0 a 110px em 300ms.
  Em touch, o hover não existe: mostrar a versão colorida direto.
- 6 profissionais. Nome em Bodoni, função e registro fictício em 10px caixa alta.

### `/demo/oniria/diario`
- **6 artigos**: título, subtítulo, tempo de leitura, data, imagem.
- Listagem editorial: o primeiro artigo em destaque (largura total, imagem 21:9),
  os outros 5 em duas colunas.
- **1 artigo completo de exemplo** em `/diario/[slug]` — apenas o primeiro slug resolve
  conteúdo integral; os outros 5 mostram um bloco elegante
  `Este texto faz parte da demonstração e não foi escrito por completo.`
  (isso é intencional e declarado, **não** é um TODO).

### `/demo/oniria/agendar` — o fluxo de agendamento

4 etapas, com **transição horizontal** entre elas (`AnimatePresence` `mode="wait"`,
`x: 40 → 0 → -40`, 400ms) e **barra de progresso** de 1px bronze no topo.

**Etapa 1 — Protocolo.** Os 5, cada um com duração e valor. Seleção com borda bronze.
**Etapa 2 — Profissional.** `Dra. Helena Kruger` · `Dra. Marina Aveline` · `Sem preferência`.
Foto de cada uma + uma linha sobre disponibilidade
(*"Agenda concorrida — costuma abrir com 3 semanas"*).
**Etapa 3 — Data & Hora.**
- **Calendário mensal customizado.** Nunca `<input type="date">`.
  Grid 7×N, cabeçalho `D S T Q Q S S`, navegação ‹ mês › (não permite voltar antes do mês atual).
  Dias sem vaga aparecem **esmaecidos** (`opacity .28`, `cursor: not-allowed`,
  `aria-disabled`). Fonte dos dias: `GET /api/booking/month`.
- Ao selecionar um dia → `GET /api/booking/availability`, com **skeleton shimmer de ~600ms**
  (a latência real vem do backend; o skeleton só precisa aparecer enquanto o fetch corre).
  Shimmer: 8 retângulos com gradiente deslizante, `animation: 1.4s linear infinite`.
- Horários em grid (3 col mobile / 4 col desktop). Badge **`Últimas N vagas`** em bronze
  quando `available && remaining <= 2`.
- Fuso explícito na UI: `Horários em Brasília (America/Sao_Paulo)`.
- Teclado: setas navegam entre os dias, `Enter`/`Space` seleciona, `role="grid"` no calendário.
**Etapa 4 — Confirmação.** Formulário: `Nome` · `E-mail` · `Telefone` ·
`É sua primeira vez na ONIRIA?` (sim/não) · `Observações` (textarea opcional).
Validação **Zod inline**, erro sob o campo, `aria-invalid`. Resumo do agendamento fixo ao lado
(desktop) ou acima (mobile). Botão `Confirmar agendamento`.

#### Tela de sucesso — a peça de resistência

1. **Check desenhado em SVG**: `stroke-dasharray` / `stroke-dashoffset` animando de
   `length` a `0` em 0.7s `power2.out`, traço bronze de 1.5px, sobre um círculo que também
   se desenha. Sob reduced-motion, aparece pronto.
2. **Card no estilo de evento do Google Calendar**:
   - Barra colorida de 4px à esquerda (usar o `colorId` traduzido para bronze).
   - Título: `Protocolo Aurora · ONIRIA Clinic`
   - Data por extenso: `quinta-feira, 20 de agosto de 2026` (via `date-fns` locale `ptBR`).
   - Horário com fuso: `14:30 – 16:00 · Horário de Brasília`
   - Local: `Rua Bela Cintra, 1842 · Jardins · São Paulo · SP`
   - Linha: `Convite enviado para <email do cliente>`
   - Participantes com avatar circular e status.
3. **Botões:**
   - **`Adicionar ao Google Agenda`** — link **real e válido**:
     ```
     https://calendar.google.com/calendar/render?action=TEMPLATE
       &text=<encodeURIComponent(summary)>
       &dates=<YYYYMMDDTHHmmSS>/<YYYYMMDDTHHmmSS>
       &ctz=America/Sao_Paulo
       &details=<encodeURIComponent(description)>
       &location=<encodeURIComponent(location)>
     ```
     `target="_blank" rel="noopener noreferrer"`.
   - **`Baixar .ics`** — gera o arquivo **no cliente**, de verdade:
     `VCALENDAR`/`VEVENT` com `UID`, `DTSTAMP`, `DTSTART;TZID=America/Sao_Paulo`,
     `DTEND`, `SUMMARY`, `DESCRIPTION`, `LOCATION`, `STATUS:CONFIRMED`,
     `BEGIN:VALARM` com `TRIGGER:-PT2H`. Linhas terminadas em `\r\n`.
     Download via `Blob` + `URL.createObjectURL` + `<a download>`; revogar a URL depois.
   - **`Adicionar ao Apple Calendar`** — mesmo `.ics`, com o rótulo apropriado.
4. **Aviso obrigatório de demonstração** — tarja discreta no rodapé do card,
   `--muted`, **12px**, texto vindo do `demoNotice` da API:
   `Demonstração. Nenhum agendamento foi criado de fato.`
   **Nunca esconder, nunca remover, nunca reduzir abaixo de 12px.**

---

## Dados — `apps/api/src/data/oniria.ts`

- `legalName`: `Oniria Instituto de Longevidade da Pele Ltda.` · `cnpj`: `52.914.660/0001-08`
- `address`: `Rua Bela Cintra, 1842 · Jardins · São Paulo · SP`
- `phone`: `(11) 3062-9040` · `whatsapp`: `5511992087744` · `email`: `contato@oniriaclinic.com.br`
- `since`: 2018 · `city`: `São Paulo`
- `Service[]` = os 5 protocolos, com `indications`, `contraindications`, `sessions`,
  `interval`, `recovery` e a narrativa em 3 atos (campos extras no `description`).
- `TeamMember[]` = 6 · `Testimonial[]` = 4 (voz contida, sem exclamação).
- `Practitioner[]` = `helena-kruger`, `marina-aveline` (+ `any` é sintético, não vem dos dados).
- 6 artigos do diário (título, subtítulo, tempo de leitura, data, imagem, slug),
  com o conteúdo integral **apenas** do primeiro.

---

## Critérios de aceite

- [ ] Transição cinematográfica ao navegar entre páginas da Oniria, **com elemento
      compartilhado** (a imagem do protocolo vira o hero do detalhe).
- [ ] Preloader na primeira visita, controlado por Context — **sem** `sessionStorage`.
- [ ] Cursor customizado com rótulos contextuais (`VER`/`ARRASTAR`/`AGENDAR`/`LER`),
      desativado em touch.
- [ ] Grão de filme visível e sutil sobre a página inteira.
- [ ] Scroll horizontal **fixado** nos protocolos no desktop; **sem pin** abaixo de 1024px.
- [ ] `splitLines` próprio funcionando, com re-split no resize e `aria-label` no container.
- [ ] Fluxo de agendamento em 4 etapas, com calendário customizado, carregamento de horários
      e **skeleton shimmer** visível.
- [ ] Badge `Últimas N vagas` aparece quando `remaining <= 2`.
- [ ] Tela de sucesso no formato de evento do Google Calendar, com check desenhado em SVG.
- [ ] Link **`Adicionar ao Google Agenda` abre uma pré-criação real** no Google Calendar.
- [ ] Download `.ics` gera um arquivo que **abre de fato** em um app de calendário.
- [ ] Aviso de demonstração visível na confirmação, 12px, nunca oculto.
- [ ] Resposta da API no formato da Google Calendar API (`kind: 'calendar#event'`).
- [ ] `prefers-reduced-motion: reduce` → sem preloader elaborado, sem painéis, sem lag no
      cursor, sem Lenis, sem pin; crossfade de 200ms.
- [ ] Nenhum `localStorage`/`sessionStorage`. Nenhum `TODO`/`lorem`.
- [ ] Todos os dados via `fetch` à API.
- [ ] **Validação visual:** screenshots das **7 rotas** em **390×844** e **1440×900**,
      incluindo as 4 etapas do agendamento e a tela de sucesso. Console limpo,
      sem overflow horizontal, nenhuma imagem 404.
- [ ] `pnpm typecheck` e `pnpm lint` limpos.
