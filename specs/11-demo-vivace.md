# 11 · Demo 2 — VIVACE ESTÉTICA AVANÇADA (Institucional · Intermediário)

**Rotas:** `/demo/vivace`, `/servicos`, `/sobre`, `/contato`.
**Escopo do subagente:** `apps/web/src/demos/vivace/**` e `apps/api/src/data/vivace.ts`.
**Wrapper:** `<div data-brand="vivace">`.

## O argumento comercial

R$ 3.500–5.000. O salto em relação à Aurea é **escopo e movimento**:
múltiplas páginas com navegação real, três carrosséis de comportamentos diferentes,
contadores animados, filtro com transição de layout, parallax suave e Lenis.

Ainda **não** é cinematográfico. O teto de sofisticação:
- Parallax **máximo 40px** de deslocamento. Nada de pin, nada de scroll horizontal.
- Reveals em stagger de 80ms, duração 0.6s, easing `[0.22, 1, 0.36, 1]`.
- Sem GSAP, sem cursor custom, sem preloader, sem grão, sem View Transitions orquestradas.
- Navegação entre páginas é a transição padrão do Next — nada de overlay.

Lenis: `new Lenis({ lerp: 0.1 })`, montado no layout da Vivace, destruído no unmount,
e **desativado** quando `prefers-reduced-motion: reduce`.

---

## Marca

Clínica de estética facial e corporal. **3 unidades**: Curitiba (matriz), Joinville, Florianópolis.
12 anos de mercado, corpo clínico de 8 profissionais, 40 mil atendimentos.

Tokens em `specs/01-design-tokens.md` §4.2: fundo `#F4F3EE`, tinta `#1F2A24`,
sage `#5A7061`, dourado fosco `#B99A5B`, raio **8px**, display **DM Serif Display**,
corpo **Manrope**.

**Elemento de identidade obrigatório:** linhas divisórias de 1px `--line` e um
**grid rígido de 12 colunas** a partir de `lg`. Sombras quase inexistentes —
profundidade vem de `--surface` (#FFF) sobre `--bg` (#F4F3EE) e de linha.

**Selo de credencial** (componente reutilizável): borda 1px `--accent-2` dourado,
texto caixa alta 11px, `letter-spacing: .14em`, padding 6px 12px, raio 8px.

**Voz:** institucional com calor. Números e credenciais em destaque. Nunca promete resultado
garantido; sempre menciona avaliação prévia. *"12 anos, 3 unidades, 40 mil atendimentos."*

---

## Navegação

Header persistente em todas as 4 rotas.
- Logo `VIVACE` (DM Serif Display 24px) + `ESTÉTICA AVANÇADA` (Manrope 9px, `ls .2em`).
- Links: `Serviços` · `Sobre` · `Unidades` (âncora na home) · `Contato`.
- Underline animado no hover (`scaleX` da esquerda, 220ms) e **indicador de rota ativa**
  (underline sólido permanente em `--accent`) via `usePathname()`.
- Botão `Agendar avaliação` → `/demo/vivace/contato`.
- Mobile: hambúrguer → painel deslizante da direita, largura 88vw, com os 4 links em
  DM Serif 28px e o botão no rodapé do painel. Fecha com `Esc`, com clique no backdrop,
  e ao navegar. `aria-expanded` no botão, foco preso no painel enquanto aberto.

---

## `/demo/vivace` — Home

### 1. Hero
- Imagem full-bleed `1648775507324-b48dd3791fa5` (sala branca com árvore), `priority`.
- Overlay: `linear-gradient(180deg, rgb(31 42 36 / .30), rgb(31 42 36 / .68))`.
- **Parallax suave:** a imagem translada no máximo **40px** conforme o scroll do hero
  (`useScroll` + `useTransform` do Motion, `[0,1] → [0, 40]`). Desligado sob reduced-motion.
- Headline centralizada, DM Serif, branca: `Doze anos cuidando de pele com método.`
- Sub: `Avaliação individual, protocolo escrito e acompanhamento. Em Curitiba, Joinville e Florianópolis.`
- Selo de credencial: `RT: DRA. CAROLINA BETTEGA · CRM-PR 28.114`
- Indicador de scroll: linha vertical de 32px que "escorre" em loop (`scaleY` com
  `transform-origin` alternando), 1.8s.
- Altura: `min-h-[88svh]` no mobile, `min-h-[92vh]` no desktop.

### 2. Contadores
4 números, grid 2×2 no mobile → 4 colunas no desktop, com divisórias de 1px.
`12` anos de clínica · `3` unidades · `40.000` atendimentos · `8` especialistas.

Animam de 0 ao valor ao entrar na viewport (`useInView`, `once: true`), duração 1.6s,
easing `easeOut`, com `Intl.NumberFormat('pt-BR')` na formatação.
Sob reduced-motion: mostram o valor final direto.
Números em DM Serif `clamp(2.5rem, 8vw, 4rem)`, label em Manrope 12px caixa alta.

### 3. Carrossel de Tratamentos — **o carrossel principal**
Título: `Tratamentos` · Link: `Ver todos os serviços →`

- 6 slides de `GET /api/demos/vivace/services` (os 6 principais).
- **Desktop 3 visíveis, mobile 1.2 visíveis** (o corte do próximo card é intencional,
  sinaliza que arrasta).
- Implementação: scroll-snap nativo (`overflow-x: auto`, `scroll-snap-type: x mandatory`,
  `scroll-snap-align: start`) + `scrollBy` nas setas. **Sem biblioteca.**
- Controles: setas ‹ › (desktop, desabilitadas nas pontas quando não há loop),
  dots clicáveis, arrasto por pointer, **autoplay de 5s** que pausa no `hover`,
  no `focus-within` e quando a aba está oculta (`visibilitychange`).
- **Loop infinito:** ao chegar ao fim, volta ao início com `scrollTo({ behavior: 'auto' })`
  no clone — ou, mais simples e aceitável aqui, `scrollTo(0)` com `behavior: 'smooth'`.
- Cada slide: imagem `aspect-[4/3]` r8, nome (DM Serif 22px), `{durationMin} min`,
  linha de indicação (`summary`), link `Saiba mais →` para `/servicos#<slug>`.
- Acessível: container `role="region"` `aria-roledescription="carrossel"` `aria-label="Tratamentos"`,
  setas com `aria-label`, dots com `aria-current`, e um `<div aria-live="polite" class="sr-only">`
  anunciando `Slide 3 de 6`.
- `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.

### 4. Diferenciais
4 blocos em zigue-zague (imagem/texto alternando lado no desktop; empilhado no mobile,
imagem sempre acima). Cada bloco entra com reveal em stagger de 80ms.

1. **Avaliação antes de qualquer aparelho** — `1552693673-1bf958298935`
2. **Protocolo escrito, com previsão de sessões** — `1595871151608-bc7abd1caca3`
3. **Equipamentos com registro Anvisa** — `1551076826-72190fff02d3`
4. **Acompanhamento fotográfico padronizado** — `1570172619644-dfd03ed5d881`

Cada um: título DM Serif 26px, 2 frases Manrope 15px `--muted`, e um selo de credencial.

### 5. Carrossel de Equipe — **formato diferente do primeiro**
Título: `Corpo clínico`

- Cards **retrato** (`aspect-[3/4]`), **4 visíveis** no desktop, 1.4 no mobile.
- **Sem autoplay**, **sem dots** — só arraste e setas. É a diferença deliberada em relação
  ao carrossel 1.
- Foto em `filter: grayscale(1)` que vira `grayscale(0)` no hover/focus, 400ms.
- Sob o retrato: nome (DM Serif 19px), especialidade, e registro fictício
  (`CRM-PR 28.114`, `CRBM 4-8821`, `CRF-SC 12.470`, etc.).
- 8 membros de `GET /api/demos/vivace/team`.

### 6. Depoimentos — **terceiro carrossel, comportamento distinto**
- **Crossfade, não slide.** Uma citação por vez, `opacity` 0↔1 em 500ms, sem movimento lateral.
- Avanço automático a cada **6s**, pausável no hover/focus.
- Citação em DM Serif `clamp(1.25rem, 4vw, 1.75rem)`, centralizada, `max-w-[46ch]`.
- Abaixo: avatar 48px, nome, cidade e serviço.
- Navegação por dots pequenos (traços de 24×2px), o ativo em `--accent`.

### 7. Unidades (`#unidades`)
3 cards, grid 1 → 3 colunas. Cada um: foto da unidade, cidade em DM Serif,
endereço, telefone, horário e link `Como chegar` (âncora para `/contato`).

- **Curitiba (matriz)** — `1758448721162-0c77cf477d6f` — Rua Comendador Araújo, 611 · Batel
- **Joinville** — `1742367539759-6e4fc2e39209` — Rua Otto Boehm, 380 · América
- **Florianópolis** — `1731514693674-a32211b63996` — Av. Rio Branco, 404 · Centro

### 8. CTA + Rodapé completo
- CTA: faixa `--accent` sage, headline branca DM Serif + botão `Agendar avaliação`.
- **Rodapé em 4 colunas** (empilhadas no mobile):
  1. Logo + 2 linhas sobre a clínica + selos (`Anvisa`, `12 anos`).
  2. Mapa do site: os 4 links + âncoras de serviços por categoria.
  3. Unidades: as 3 cidades com telefone.
  4. **Newsletter** → `POST /api/leads` com `source: 'newsletter'`
     (campos `Nome` + `E-mail` + `Telefone`), com os 3 estados.
- Linha final obrigatória, 11px `--muted`:
  `Clínica, unidades, profissionais, registros e depoimentos são fictícios. Demonstração criada pela Anank Studios.`

---

## `/demo/vivace/servicos`

- Cabeçalho de página: título DM Serif + linha de 1px + parágrafo introdutório.
- **Filtro por categoria:** `Todos · Facial · Corporal · Depilação`, como pílulas r8.
  A pílula ativa tem fundo `--accent` e texto claro.
- **Transição de layout animada** ao filtrar: cada card é `<motion.div layout />` dentro de
  `<AnimatePresence mode="popLayout">`, com `transition={{ type: 'spring', stiffness: 260, damping: 30 }}`.
  Sob reduced-motion, `layout` é desativado (troca instantânea).
- Grid 1 → 2 → 3 colunas.
- Cada card abre um **painel expansível** (acordeão) com: descrição completa,
  `sessions` recomendadas, `interval`, `recovery`, indicações, **contraindicações** e
  `A partir de R$ X`. Botão `<button aria-expanded aria-controls>`; painel com
  `height: auto` animado via `motion` e `overflow: hidden`.
- 12 serviços no total. Os 6 do carrossel + 6 extras.

| Serviço | Categoria | Duração | A partir de |
|---|---|---|---|
| Limpeza de pele profunda | Facial | 90 | R$ 220 |
| Peeling químico | Facial | 60 | R$ 320 |
| Microagulhamento | Facial | 75 | R$ 480 |
| Skinbooster | Facial | 60 | R$ 890 |
| Drenagem linfática | Corporal | 60 | R$ 180 |
| Criolipólise | Corporal | 90 | R$ 690 |
| Massagem modeladora | Corporal | 60 | R$ 190 |
| Radiofrequência corporal | Corporal | 60 | R$ 340 |
| Depilação a laser — axilas | Depilação | 20 | R$ 120 |
| Depilação a laser — pernas | Depilação | 60 | R$ 390 |
| Depilação a laser — virilha | Depilação | 30 | R$ 220 |
| Depilação a laser — rosto | Depilação | 20 | R$ 140 |

Contraindicações são obrigatórias e realistas (gestação, uso de isotretinoína,
lesão ativa no local, fototipo alto em laser específico, etc.).

## `/demo/vivace/sobre`

1. **Timeline vertical animada 2014 → 2026.** Linha central de 1px `--line`; cada marco
   entra com reveal alternando lado (desktop) / sempre à direita da linha (mobile).
   Marcos: 2014 fundação em Curitiba · 2017 primeira sala de laser · 2019 unidade Joinville ·
   2021 protocolo fotográfico padronizado · 2023 unidade Florianópolis ·
   2025 40 mil atendimentos · 2026 centro de formação interno.
2. **Missão / Visão / Valores** — 3 blocos separados por linha 1px, sem card, sem sombra.
3. **Galeria da estrutura em masonry** (CSS `columns-1 md:columns-2 lg:columns-3`,
   `break-inside: avoid`) com **lightbox**: clique abre overlay escuro com a imagem grande,
   setas ‹ ›, fecha com `Esc` / clique fora / botão ✕. Foco preso no lightbox,
   `role="dialog"` `aria-modal="true"`, e o foco volta ao thumbnail ao fechar.
   Use 8–10 imagens de interior/tratamento do banco.

## `/demo/vivace/contato`

- **Formulário completo**, validação **Zod no cliente e no servidor**:
  `Nome` · `E-mail` · `Telefone` · `Unidade` (select das 3) · `Serviço de interesse` (select) ·
  `Mensagem` (textarea) · checkbox de consentimento LGPD (obrigatório).
- Validação no cliente com o **mesmo schema** enviado ao servidor. Erros por campo,
  `aria-invalid`, `aria-describedby`, foco no primeiro campo inválido ao submeter.
- `POST /api/leads` com `source: 'contato'`. 3 estados reais.
- Mapa estático (imagem) da unidade selecionada — troca conforme o select.
- Canais diretos: telefone de cada unidade, WhatsApp, e-mail, horários.

---

## Dados — `apps/api/src/data/vivace.ts`

- `legalName`: `Vivace Estética Avançada Ltda.` · `cnpj`: `18.554.037/0001-92`
- `city`: `Curitiba` · `since`: 2014
- `phone`: `(41) 3016-7788` · `whatsapp`: `5541988203344` · `email`: `contato@vivaceestetica.com.br`
- `stats`: os 4 contadores.
- `Service[]` = 12 · `TeamMember[]` = 8 · `Testimonial[]` = 5.
- Equipe: use os 8 retratos coloridos listados em `specs/01-design-tokens.md`.
  Cargos: dermatologista (RT), biomédica esteta, fisioterapeuta dermatofuncional,
  esteticista sênior ×2, enfermeira, farmacêutica esteta, coordenadora clínica.

---

## Critérios de aceite

- [ ] As 4 rotas navegam de verdade, com indicador de rota ativa correto.
- [ ] **3 carrosséis com comportamentos distintos**: (1) slide + autoplay 5s + dots + loop;
      (2) retrato, 4 visíveis, sem autoplay, sem dots, B&W→cor no hover;
      (3) crossfade sem movimento lateral, 6s.
- [ ] Contadores animam de 0 ao entrar na viewport, uma única vez, formatados em pt-BR.
- [ ] Filtro de `/servicos` anima o layout com `motion` `layout` + `AnimatePresence`.
- [ ] Validação Zod no cliente **e** no servidor; erro 422 aparece sob o campo certo.
- [ ] Parallax existe mas **não passa de 40px**. Nenhum pin, nenhum scroll horizontal.
- [ ] Lenis ativo, e desligado sob `prefers-reduced-motion`.
- [ ] Lightbox da `/sobre` prende o foco, fecha com `Esc` e devolve o foco ao thumbnail.
- [ ] Grid de 12 colunas e linhas divisórias de 1px são visíveis como identidade.
- [ ] Nenhum GSAP, cursor custom, preloader ou grão (isso é da Oniria).
- [ ] Todos os dados via `fetch` à API. Toda imagem com `alt` pt-BR, `sizes`, blur.
- [ ] **Validação visual:** screenshots das **4 rotas** em **390×844** e **1440×900**,
      sem overflow horizontal, console limpo, nenhuma imagem 404.
- [ ] `pnpm typecheck` e `pnpm lint` limpos.
