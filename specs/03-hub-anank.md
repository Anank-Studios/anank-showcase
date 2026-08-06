# 03 · Hub Anank Studios (`/`)

Primeira impressão do estúdio. Silencioso, muito respiro, tipografia grande.
**Se parecer "site de agência", está errado — refazer.** A referência é galeria de arte.

Escopo: `[data-brand="anank"]`. Implementado pelo **orquestrador**.

---

## Wireframe — mobile (390px, base)

```
┌──────────────────────────────┐
│                              │  ← 88px de respiro
│                              │
│   ANANK                      │  clamp(2.75rem,13vw,8.5rem)
│   STUDIOS                    │  Instrument Serif, ls -0.03em
│   ────────────────────────   │  1px, cresce da esquerda
│                              │
│   Três níveis. Um padrão.    │  Inter Tight 500, 15px
│   Três demonstrações de      │  --muted, 14px, max 34ch
│   sites para beleza e        │
│   estética.                  │
│                              │  ← 64px
│  ┌────────────────────────┐  │
│  │ ░░░ mini-mockup ░░░░░░ │  │  thumbnail vivo, 4:3
│  │ ░░ Aurea ░░░░░░░░░░░░░ │  │
│  ├────────────────────────┤  │
│  │ 01              Landing│  │  01 em --accent
│  │ Aurea Beauty Studio    │  │  Instrument Serif 26px
│  │ Salão de bairro que    │  │  --muted 13px
│  │ não parece de bairro.  │  │
│  │ R$ 1.500–2.500     →   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │  … Vivace …            │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │  … Oniria …            │  │
│  └────────────────────────┘  │
│                              │  ← 72px
│  Anank Studios · Demonstra…  │  11px, --muted, 1 linha
└──────────────────────────────┘
```

## Wireframe — desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                                                                        │  ← 15vh
│   ANANK STUDIOS                                                        │  8.5rem
│   ──────────────────────────────────────────────────────────────────   │
│                                          Três níveis. Um padrão.       │  ← subtítulo à direita
│                                          Três demonstrações de sites   │
│                                          para beleza e estética.       │
│                                                                        │  ← 12vh
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐               │
│   │ ░ mockup ░░░ │   │ ░ mockup ░░░ │   │ ░ mockup ░░░ │               │
│   ├──────────────┤   ├──────────────┤   ├──────────────┤               │
│   │01     Landing│   │02 Institucio.│   │03     Premium│               │
│   │Aurea Beauty  │   │Vivace Estét. │   │Oniria Clinic │               │
│   │Studio        │   │Avançada      │   │              │               │
│   │…             │   │…             │   │…             │               │
│   │R$ 1.500–2.500│   │R$ 3.500–5.000│   │R$ 10.000+    │               │
│   └──────────────┘   └──────────────┘   └──────────────┘               │
│                                                                        │
│   Anank Studios · Demonstrações fictícias criadas para fins de portfólio · 2026 │
└────────────────────────────────────────────────────────────────────────┘
```

Layout: `grid-cols-1` → `md:grid-cols-3`, `gap-6` → `lg:gap-8`.
Container: `px-6 md:px-10 lg:px-14`, `max-w-[1400px] mx-auto`.

---

## Sequência de entrada

Total ≈ **1.6s**. Easing padrão `[0.16, 1, 0.3, 1]`.
Sob `prefers-reduced-motion: reduce`, **tudo** vira um único fade de 200ms sem blur nem movimento.

| t | Elemento | Animação |
|---|---|---|
| 0.00s | tela | fundo `--paper` (#F7F6F3) vazio |
| 0.15s | wordmark **ANANK STUDIOS** | `opacity 0→1`, `filter: blur(12px)→blur(0)`, `y: 16→0`, `letter-spacing: 0.4em→0.12em`. Duração 0.9s. |
| 0.70s | régua de 1px | `scaleX: 0→1`, `transform-origin: left`. Duração 0.7s. |
| 0.90s | subtítulo + descrição | `opacity 0→1`, `y: 12→0`. Duração 0.6s. |
| 1.10s | 3 cards | stagger de **90ms**, `opacity 0→1`, `y: 24→0`. Duração 0.7s cada. |

Implementação: `motion/react` com `variants` + `staggerChildren`, ou `transition.delay` explícito.
O wordmark anima `letterSpacing` — use `style={{ letterSpacing }}` via `motion.h1` (não é
propriedade transformável, então é uma animação de layout barata mas aceitável **uma única vez**).

---

## Os 3 cards

Estrutura de um card:

```
<Link href="/demo/<slug>" style={{ viewTransitionName: `demo-card-${slug}` }}>
  <Thumbnail />                    ← mini-mockup vivo, aspect-[4/3]
  <div>                            ← faixa de informação
    <row>  01                Landing Page </row>
    <h3>   Aurea Beauty Studio            </h3>
    <p>    Salão de bairro que não…       </p>
    <row>  R$ 1.500–2.500          Abrir demo → </row>
  </div>
</Link>
```

### Thumbnail vivo (não é screenshot)

Mini-mockup em CSS que já usa **a paleta e a fonte display reais daquela marca**.
Composição, dentro de um `div` com `background: <marca>.bg`:

- Uma barra superior de 6px na cor `<marca>.accent` (ou, na Oniria, um filete de 1px).
- Uma linha de "nav" simulada: 3 retângulos de 4px em `<marca>.muted` a 30% de opacidade.
- Uma headline curta escrita **na fonte display da marca**, na cor `<marca>.ink`
  — Aurea: *"Seu cabelo"* · Vivace: *"12 anos"* · Oniria: *"A pele"*.
- Um bloco de imagem real (`next/image`, o `thumbnail` vindo da API) ocupando ~55% da área,
  com o `borderRadius` da marca.
- Um "botão" simulado: pílula/retângulo em `<marca>.accent` com o raio da marca.

Isso faz os 3 thumbnails serem visivelmente diferentes em raio, cor e tipografia —
que é exatamente o argumento comercial.

### Hover (desktop, `@media (hover: hover)`)

- Card: `scale: 1.03`, 300ms.
- Imagem interna: `scale: 1.08` com `translateX` de 6px (pan leve), 600ms.
- Bloco *"Abrir demo →"*: entra deslizando da direita (`x: 8→0`, `opacity 0→1`), 250ms.
- Underline do nome da marca: `scaleX 0→1` na cor `--accent` da **Anank** (verde-limão).
- Nenhuma sombra. A elevação é sugerida por escala e pela borda que escurece.

### Uso do acento Anank

**Exatamente um** elemento acentuado por card: o número (`01`/`02`/`03`).
No hover, o underline do nome também usa o acento — mas aí o número volta a `--ink`.
Nunca dois elementos em verde-limão ao mesmo tempo.

---

## Copy (final, pt-BR)

**Wordmark:** `ANANK STUDIOS`

**Subtítulo:** `Três níveis. Um padrão.`

**Descrição:**
`Três demonstrações de sites para beleza e estética — do essencial bem-feito ao que se espera de uma marca de luxo.`

### Card 01
- Categoria: `Landing Page`
- Marca: `Aurea Beauty Studio`
- Descrição: `Uma página. Tudo que um salão de bairro precisa para lotar a agenda.`
- Faixa: `R$ 1.500–2.500`

### Card 02
- Categoria: `Site Institucional`
- Marca: `Vivace Estética Avançada`
- Descrição: `Múltiplas páginas, carrosséis e credenciais. Para quem precisa provar autoridade.`
- Faixa: `R$ 3.500–5.000`

### Card 03
- Categoria: `Experiência Premium`
- Marca: `Oniria Clinic`
- Descrição: `Transições cinematográficas e agendamento próprio. O site vira parte do produto.`
- Faixa: `R$ 10.000+`

**Rodapé:** `Anank Studios · Demonstrações fictícias criadas para fins de portfólio · 2026`

---

## Dados

O hub consome `GET /api/demos` (server component, `cache: 'no-store'`) e recebe `DemoSummary[]`.
Os tokens de cada marca vêm no payload e alimentam o thumbnail vivo via `style` inline —
**não** via classes Tailwind, porque as cores são dados.

---

## Acessibilidade

- `<h1>` é o wordmark. Os nomes das marcas são `<h2>`.
- Cada card é um `<Link>` único e focável; nada de link aninhado dentro de link.
- Foco visível: `outline: 2px solid var(--brand-ink); outline-offset: 4px`.
  **Não** remover outline sem substituto.
- `aria-label` do link: `"Abrir demonstração 01 — Aurea Beauty Studio, Landing Page"`.
- Contraste: `--muted` #6B6B70 sobre #F7F6F3 = 5.4:1 ✔. O acento verde-limão **nunca** é usado
  como cor de texto sobre o fundo claro (contraste insuficiente) — só como fundo, borda ou
  filete decorativo.
- Ordem de tabulação natural: wordmark → card 01 → 02 → 03 → rodapé.

---

## Critérios de aceite

- [ ] Sequência de entrada executa na ordem e no timing descritos (~1.6s).
- [ ] `prefers-reduced-motion: reduce` reduz tudo a um fade de 200ms.
- [ ] Os 3 thumbnails usam a **paleta e a fonte display reais** de cada marca, e são
      visivelmente distintos em raio de borda.
- [ ] Máximo 1 elemento em verde-limão por card por vez.
- [ ] Card inteiro clicável com `view-transition-name` único.
- [ ] Navegação por teclado completa, foco sempre visível.
- [ ] Screenshot em **390×844** e **1440×900** sem overflow horizontal e sem console error.
- [ ] Layout limpo — sem badges, sem gradientes chamativos, sem "trust bar", sem depoimento.
