# 10 · Demo 1 — AUREA BEAUTY STUDIO (Landing · Simples)

**Rota:** `/demo/aurea` — página única, scroll vertical. Sem roteamento interno.
**Escopo do subagente:** `apps/web/src/demos/aurea/**` e `apps/api/src/data/aurea.ts`. Nada mais.
**Wrapper:** `<div data-brand="aurea">`.

## O argumento comercial

Esta é a demo de R$ 1.500–2.500. Ela precisa parecer **bem-feita e simples** — não pobre.
A diferença para as outras não é falta de acabamento; é falta de *escopo*.
Tipografia impecável, espaçamento generoso, fotos boas, hover states caprichados.
E só isso: **zero parallax, zero GSAP, zero Lenis, zero scroll-driven**.

Animação permitida, e **apenas** ela:
- `whileInView` com `{ opacity: 0, y: 16 } → { opacity: 1, y: 0 }`, `once: true`,
  `viewport: { margin: '-80px' }`, duração 0.5s, easing `[0.16, 1, 0.3, 1]`.
- Stagger de 60ms entre irmãos de uma mesma grade.
- Hover states com `transition` CSS de 250ms.
- O slider antes/depois (arraste — interação, não animação decorativa).
- Header que ganha blur/sombra após 80px de scroll.

Sob `prefers-reduced-motion: reduce`: os `whileInView` viram estado final imediato
(`initial={false}`), e as transições de hover caem para 0ms.

---

## Marca

Salão de beleza de bairro, premium-acessível. Vila Madalena, São Paulo. Desde 2019.
Dona e cabeleireira-chefe: **Bruna Sartori**.

Tokens em `specs/01-design-tokens.md` §4.1. Resumo operacional:
fundo `#FBF7F2`, tinta `#2A211C`, acento terracota `#C4743F`, champanhe `#E8D5C4`,
raio **24px**, display **Fraunces**, corpo **Inter**.
Sombra assinatura: `0 12px 32px -12px rgb(42 33 28 / .18)`.

**Voz:** próxima, direta, primeira pessoa do plural ou da Bruna. Frases curtas, calorosas,
sem jargão de marketing. Nunca "soluções capilares", nunca "excelência em atendimento".

---

## Wireframe — mobile (base, 390px)

```
┌────────────────────────────┐
│ Aurea            [≡]  [Wpp]│  header sticky, blur após 80px
├────────────────────────────┤
│                            │
│  Seu cabelo merece         │  Fraunces clamp(2.25rem,9vw,4.5rem)
│  um tempo bem gasto.       │
│                            │
│  Corte, cor e cuidado …    │  Inter 16px, --muted
│                            │
│  [ Agendar no WhatsApp ]   │  terracota sólido, r24, full-width
│  [ Ver serviços ]          │  outline, full-width
│                            │
│  ┌──────────────────────┐  │  imagem r24, rotate(-2deg)
│  │                      │  │  sombra suave
│  │      foto salão      │  │
│  │                      │  │  ╭─────────╮ selo circular
│  └──────────────────────┘  │  │Vila Mad.│ sobreposto no canto
│                            │  ╰─────────╯
├────────────────────────────┤
│ +2.400 clientes            │  faixa de confiança
│ 4,9 no Google              │  1 col mobile → 4 col md
│ Produtos veganos           │
│ Estacionamento no local    │
├────────────────────────────┤
│  O que fazemos             │
│  ┌──────────────────────┐  │  6 cards, 1 col → 2 col md → 3 col lg
│  │ ✂  Corte             │  │
│  │ Leitura de rosto e…  │  │
│  │ 60 min · a partir de │  │
│  │ R$ 120               │  │
│  └──────────────────────┘  │
│  … × 6                     │
├────────────────────────────┤
│  Antes & depois            │
│  ┌──────────────────────┐  │  slider arrastável
│  │ antes ┃ depois       │  │  divisor com alça circular
│  └──────────────────────┘  │
│  … × 3                     │
├────────────────────────────┤
│  ┌──────────┐              │
│  │  Bruna   │  Oi, eu sou  │  foto retrato r24
│  │          │  a Bruna.    │
│  └──────────┘  …2 parágraf.│
│                            │
│    Bruna Sartori           │  Fraunces italic, "assinatura"
├────────────────────────────┤
│  Quem já sentou na cadeira │
│  ★★★★★ "…"  Marina         │  3 cards
├────────────────────────────┤
│  Onde estamos              │
│  ┌──────────────────────┐  │  mapa estático (imagem)
│  │      [mapa]          │  │
│  └──────────────────────┘  │
│  Rua Harmonia, 742 …       │
│  Ter–Sáb 09:00–19:00 …     │
├────────────────────────────┤
│ ████ bloco terracota ████  │  CTA final full-width
│  Sua próxima cor começa    │
│  com uma conversa.         │
│  [ Chamar no WhatsApp ]    │
├────────────────────────────┤
│  Aurea · redes · CNPJ      │  rodapé enxuto
└────────────────────────────┘
```

Desktop (`lg`): o hero vira split 50/50 (texto à esquerda, imagem à direita);
serviços em 3×2; sobre em 2 colunas; depoimentos em 3 colunas.

---

## Seções, na ordem

### 1. Header
- Logo `Aurea` (Fraunces, 22px) + `BEAUTY STUDIO` (Inter, 9px, `ls: .22em`, `--muted`).
- Mobile: botão hambúrguer que abre um painel full-screen com os âncoras.
- Desktop: links âncora `Serviços · Transformações · Sobre · Contato` com underline
  animado no hover, + botão `Agendar no WhatsApp`.
- `position: sticky; top: 0`. Após 80px de scroll ganha
  `backdrop-filter: blur(12px)`, `background: rgb(251 247 242 / .82)` e borda inferior 1px.
  Use um listener de scroll com `passive: true` — não `useScroll` do Motion.

### 2. Hero
- **Headline:** `Seu cabelo merece um tempo bem gasto.`
- **Subheadline:** `Corte, cor e cuidado feitos com calma, na Vila Madalena. Sem pressa, sem fórmula pronta.`
- CTAs: `Agendar no WhatsApp` (terracota sólido) · `Ver serviços` (outline, âncora `#servicos`).
- Imagem: `1562322140-8baeececf3df` (cabeleireira escovando cabelo), `priority`, r24,
  `rotate(-2deg)` no desktop, `rotate(0)` no mobile (evita overflow em 390px).
- **Selo circular** sobreposto: círculo de 104px, fundo `--accent-2` champanhe, texto em
  duas linhas Fraunces 13px: `Vila Madalena` / `desde 2019`. Posicionado no canto
  inferior-esquerdo da imagem, `translate(-25%, 25%)`.

### 3. Faixa de confiança
4 itens. Mobile: grid 2×2. Desktop: 4 colunas separadas por linha vertical 1px `--line`.
- `+2.400 clientes` / `atendidos desde 2019`
- `4,9 no Google` / `em 312 avaliações`
- `Produtos veganos` / `livres de crueldade`
- `Estacionamento` / `no local, sem custo`

### 4. Serviços (`#servicos`)
Título: `O que fazemos` · Subtítulo: `Seis serviços. Nenhum no piloto automático.`

6 cards vindos de `GET /api/demos/aurea/services`. Cada card: ícone em linha (SVG inline,
stroke 1.5, 24px, cor `--accent`), nome (Fraunces 20px), `summary` (Inter 14px `--muted`),
e rodapé com `{durationMin} min · a partir de R$ {priceFrom}`.

Hover: `translateY(-4px)`, borda passa de `--line` para `--accent`, sombra intensifica.

| Serviço | Ícone | Duração | A partir de |
|---|---|---|---|
| Corte | tesoura | 60 | R$ 120 |
| Coloração | pincel/tinta | 150 | R$ 280 |
| Mechas | mecha/folha | 210 | R$ 420 |
| Escova | secador | 45 | R$ 70 |
| Tratamento capilar | gota | 90 | R$ 190 |
| Design de sobrancelha | arco/pinça | 30 | R$ 60 |

Copy de exemplo (`summary`) — escreva as 6 nesta voz:
- Corte: `Leitura de rosto, textura e rotina antes de encostar a tesoura.`
- Mechas: `Loiro construído em camadas, respeitando o que o fio aguenta.`

### 5. Antes & Depois (`#transformacoes`)
Título: `Antes & depois` · Subtítulo: `Sem filtro, sem retoque. Arraste para ver.`

3 pares. Componente `BeforeAfter` **próprio**, sem biblioteca:
- Container `relative`, `aspect-[4/5]` no mobile, `aspect-[4/3]` no desktop, `overflow-hidden`, r24.
- Imagem "depois" ocupa o fundo inteiro. Imagem "antes" por cima com
  `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`.
- Divisor: linha vertical branca de 2px em `left: var(--pos)` + alça circular de 40px
  (fundo branco, seta `↔` terracota, sombra).
- Interação via `pointerdown` / `pointermove` / `pointerup` no container, com
  `setPointerCapture`. Atualiza `--pos` em porcentagem.
- **Teclado:** a alça é um `<div role="slider">` focável com `tabIndex={0}`,
  `aria-valuemin/max/now`, `aria-label="Comparar antes e depois"`.
  Setas ←/→ movem 2%, `Home`/`End` vão a 0/100%.
- `touch-action: none` no container para não brigar com o scroll da página.

Pares sugeridos (antes / depois):
1. `1605980766335-d3a41c7332a1` → `1554519934-e32b1629d9ee` — *Mechas em 3 sessões*
2. `1617391654484-2894196c2cc9` → `1470259078422-826894b933aa` — *Coloração fantasia*
3. `1707979577466-2d6109c68a45` → `1712213396688-c6f2d536671f` — *Corte e reconstrução*

### 6. Sobre a Bruna (`#sobre`)
- Foto retrato: `1699899657680-421c2c2d5064`, r24, no mobile acima do texto.
- Headline: `Oi, eu sou a Bruna.`
- 2 parágrafos, primeira pessoa. Menciona: 14 anos de profissão, formação em colorimetria,
  por que abriu o Aurea em 2019, e a regra da casa (um atendimento por vez, sem overbooking).
- **Assinatura:** `Bruna Sartori` em Fraunces italic 30px, `--accent`, levemente rotacionada
  (`rotate(-3deg)`), com um traço de 1px abaixo.

### 7. Depoimentos
Título: `Quem já sentou na cadeira`
3 cards estáticos (sem carrossel — carrossel é território da Vivace) vindos de
`GET /api/demos/aurea/testimonials`. Cada um: 5 estrelas em `--accent`, citação em
Fraunces 17px, avatar circular 44px, nome e serviço realizado.

### 8. Localização & Horários (`#contato`)
2 colunas no desktop, empilhado no mobile.
- **Esquerda:** mapa **estático** (imagem, nunca iframe do Google). Use uma foto de
  fachada/rua como stand-in editorial — `1521590832167-7bcbfaa6381f` — dentro de um card r24
  com um marcador em `--accent` sobreposto, e legenda `Rua Harmonia, 742 · Vila Madalena`.
- **Direita:** endereço completo, tabela de horários, telefone, e o **formulário rápido**.

**Formulário** (único da demo) → `POST /api/leads` com `source: 'contato'`:
- Campos: `Nome` (text), `Telefone` (tel, com máscara `(00) 00000-0000`),
  `Serviço de interesse` (select com os 6 serviços + "Ainda não sei").
- Estados reais: `idle` → `loading` (botão com spinner, campos `disabled`) →
  `success` (card champanhe com check e `Recebemos seu contato. A Bruna responde em até 1 dia útil.`)
  ou `error` (mensagem em vermelho terroso + botão `Tentar de novo`).
- Erros de validação do servidor (422) são mapeados por campo e exibidos sob o input,
  com `aria-invalid` e `aria-describedby`.
- Horários: `Ter–Sex 09:00–19:00` · `Sáb 09:00–18:00` · `Dom–Seg fechado`.

### 9. CTA final
Bloco full-width, fundo `--accent` terracota, texto `--bg` creme.
- Headline (Fraunces, 2 linhas): `Sua próxima cor começa` / `com uma conversa.`
- Botão: `Chamar no WhatsApp` — fundo creme, texto terracota, r24.

### 10. Rodapé
Enxuto, 1–2 linhas no mobile:
`Aurea Beauty Studio` · ícones Instagram / WhatsApp ·
`CNPJ 41.702.883/0001-64 (fictício)` · `© 2026 Aurea Beauty Studio` ·
e a linha obrigatória em 11px `--muted`:
`Empresa, endereço, CNPJ e depoimentos são fictícios. Demonstração criada pela Anank Studios.`

---

## Dados — `apps/api/src/data/aurea.ts`

Preencher `Demo`, `Service[]` (6), `Testimonial[]` (3), `team: []`.
Dados fictícios coerentes:
- `legalName`: `Aurea Studio de Beleza Ltda.`
- `cnpj`: `41.702.883/0001-64`
- `address`: `Rua Harmonia, 742 · Vila Madalena · São Paulo · SP`
- `phone`: `(11) 3081-4420` · `whatsapp`: `5511970041188`
- `email`: `oi@aureastudio.com.br` · `since`: 2019
- `socials`: Instagram `@aurea.studio`, WhatsApp.

---

## Critérios de aceite

- [ ] As 10 seções existem, na ordem, com copy real em pt-BR na voz da Bruna.
- [ ] Slider antes/depois arrasta com mouse **e** com toque, e opera por teclado
      (setas, Home/End) com `role="slider"` e `aria-valuenow`.
- [ ] Formulário faz `POST /api/leads` e mostra os 3 estados (loading / sucesso / erro);
      erro 422 do servidor aparece sob o campo certo.
- [ ] **Zero** parallax, **zero** GSAP, **zero** Lenis, **zero** `useScroll` para efeito visual.
- [ ] Todos os dados vêm de `fetch` à API. Nenhum import de `apps/api/src/data`.
- [ ] Toda imagem com `alt` em pt-BR, `sizes`, `placeholder="blur"`; `priority` só no hero.
- [ ] `prefers-reduced-motion: reduce` remove os reveals e os movimentos de hover.
- [ ] Nenhum `localStorage`/`sessionStorage`, nenhum `TODO`/`lorem`.
- [ ] **Validação visual:** screenshot em **390×844** e **1440×900**, sem overflow horizontal,
      sem erro no console, e nenhuma requisição de imagem com 404.
- [ ] `pnpm typecheck` e `pnpm lint` limpos.
