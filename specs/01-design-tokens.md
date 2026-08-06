# 01 · Design Tokens — 4 marcas

Quatro identidades visuais **sem parentesco**. Se duas demos parecerem "o mesmo template com outra
cor", está errado. Elas divergem em: grid, densidade, raio de borda, escala tipográfica, ritmo de
animação e voz do copy — não só na paleta.

## Mecanismo

`globals.css` declara as vars por escopo. Cada demo é envolvida em `<div data-brand="...">`.

```css
@import "tailwindcss";

@theme inline {
  --color-bg:        var(--brand-bg);
  --color-surface:   var(--brand-surface);
  --color-ink:       var(--brand-ink);
  --color-muted:     var(--brand-muted);
  --color-accent:    var(--brand-accent);
  --color-accent-2:  var(--brand-accent-2);
  --color-line:      var(--brand-line);
  --radius-brand:    var(--brand-radius);
  --font-display:    var(--brand-font-display);
  --font-body:       var(--brand-font-body);
}

:root, [data-brand="anank"] { /* … */ }
[data-brand="aurea"]  { /* … */ }
[data-brand="vivace"] { /* … */ }
[data-brand="oniria"] { /* … */ }
```

Uso em componentes: `bg-bg text-ink border-line rounded-[--radius-brand] font-display`.

---

## 4.0 ANANK STUDIOS — o hub

Estúdio de web design de alto padrão. Galeria de arte, não agência.

```css
[data-brand="anank"] {
  --brand-bg:       #F7F6F3;
  --brand-surface:  #FFFFFF;
  --brand-ink:      #0E0E10;
  --brand-muted:    #6B6B70;
  --brand-accent:   #C6FF4F;   /* verde-limão elétrico — SÓ micro-detalhe */
  --brand-accent-2: #E4E3DE;
  --brand-line:     #DEDCD6;
  --brand-radius:   2px;
  --brand-font-display: var(--font-instrument-serif);
  --brand-font-body:    var(--font-inter-tight);
}
```

- **Display:** Instrument Serif (400, normal + italic)
- **UI:** Inter Tight (400/500/600)
- **Sensação:** preto sobre off-white, silencioso, muito respiro, tipografia gigante,
  **uma única** cor de acento usada com avareza.
- **Escala display (mobile-first):** `clamp(2.75rem, 13vw, 8.5rem)`, `line-height: 0.92`,
  `letter-spacing: -0.03em`.
- **Regra do acento:** no máximo **um** elemento acentuado por card. Nunca dois.

## 4.1 AUREA BEAUTY STUDIO — Demo 1 (Landing)

Salão de bairro premium-acessível. Vila Madalena, SP. Dona: Bruna Sartori. Desde 2019.

```css
[data-brand="aurea"] {
  --brand-bg:       #FBF7F2;
  --brand-surface:  #FFFFFF;
  --brand-ink:      #2A211C;
  --brand-muted:    #8A7A6E;
  --brand-accent:   #C4743F;   /* terracota */
  --brand-accent-2: #E8D5C4;   /* champanhe */
  --brand-line:     #EADFD2;
  --brand-radius:   24px;
  --brand-font-display: var(--font-fraunces);
  --brand-font-body:    var(--font-inter);
}
```

- **Display:** Fraunces (variable, `opsz` alto, 400/600, italic disponível para a assinatura)
- **Texto:** Inter (400/500/600)
- **Raio:** 24px em tudo — cards, botões, imagens. Acolhedor.
- **Sombra:** `0 12px 32px -12px rgb(42 33 28 / .18)` — suave, difusa, nunca dura.
- **Grid:** 1 col (mobile) → 2 col (md) → 3 col (lg). Generoso, sem rigidez.
- **Escala display:** `clamp(2.25rem, 9vw, 4.5rem)`, `line-height: 1.05`, `letter-spacing: -0.02em`.
- **Fotografia:** dominante âmbar/quente. `filter: saturate(1.05)` sutil permitido.
- **Voz:** próxima, direta, primeira pessoa. *"Seu cabelo merece um tempo bem gasto."*
- **Animação:** só `whileInView` fade + slide-up 16px, `once: true`, e hover states.
  **Zero parallax. Zero GSAP. Zero Lenis.**

## 4.2 VIVACE ESTÉTICA AVANÇADA — Demo 2 (Institucional)

Clínica de estética facial e corporal. 3 unidades: Curitiba, Joinville, Florianópolis.
12 anos, 8 profissionais, 40 mil atendimentos.

```css
[data-brand="vivace"] {
  --brand-bg:       #F4F3EE;
  --brand-surface:  #FFFFFF;
  --brand-ink:      #1F2A24;
  --brand-muted:    #6E7A72;
  --brand-accent:   #5A7061;   /* sage */
  --brand-accent-2: #B99A5B;   /* dourado fosco */
  --brand-line:     #DDDCD3;
  --brand-radius:   8px;
  --brand-font-display: var(--font-dm-serif-display);
  --brand-font-body:    var(--font-manrope);
}
```

- **Display:** DM Serif Display (400)
- **Texto:** Manrope (400/500/700)
- **Raio:** 8px — profissional, contido.
- **Grid:** rigoroso de 12 colunas a partir de `lg`. Linhas divisórias de 1px `--brand-line`
  são um elemento de identidade — use-as.
- **Escala display:** `clamp(2rem, 7vw, 3.75rem)`, `line-height: 1.12`.
- **Sombra:** quase nenhuma. Profundidade vem de linha e de fundo `--brand-surface` sobre `--brand-bg`.
- **Selo de credenciais:** bloco com borda 1px `--brand-accent-2`, texto em caixa alta,
  `letter-spacing: 0.14em`, 11px.
- **Voz:** institucional com calor. Números e credenciais em destaque.
  *"12 anos, 3 unidades, 40 mil atendimentos."*
- **Animação:** reveals em stagger, contadores, carrosséis, parallax **suave** (máx. 40px). Lenis ativo.

## 4.3 ONIRIA CLINIC — Demo 3 (Premium)

Instituto de estética avançada e longevidade da pele. Unidade única nos Jardins, SP.
Diretora científica: Dra. Helena Kruger.

```css
[data-brand="oniria"] {
  --brand-bg:          #0A0A0B;
  --brand-surface:     #131315;
  --brand-ink:         #F2EFE9;
  --brand-muted:       #85817A;
  --brand-accent:      #B08D57;   /* bronze */
  --brand-accent-2:    #E5D9C3;   /* bronze claro */
  --brand-line:        #26262A;
  --brand-radius:      0px;
  --brand-font-display: var(--font-bodoni-moda);
  --brand-font-body:    var(--font-inter-tight);
}
```

- **Display:** Bodoni Moda (variable, 400/700, italic) — alto contraste, editorial.
- **Texto:** Inter Tight com `letter-spacing: -0.01em`.
- **Raio:** 0. Arestas vivas em tudo, inclusive botões e inputs.
- **Escala display:** `clamp(2.75rem, 15vw, 11rem)`, `line-height: 0.88`, `letter-spacing: -0.04em`.
- **Grão de filme:** SVG `feTurbulence` `baseFrequency="0.8"`, `position: fixed`, `inset: 0`,
  `opacity: .035`, `mix-blend-mode: overlay`, `pointer-events: none`, `z-index: 60`.
- **Sombra:** nenhuma. Profundidade vem de `--brand-surface` e de luz nas imagens.
- **Voz:** mínima, autoral, quase literária. Frases curtas.
  *"A pele tem memória. Nós trabalhamos com ela."*
- **Animação:** o pacote completo — preloader, cursor custom, Lenis `lerp: 0.075`,
  GSAP + ScrollTrigger, View Transitions, SplitText próprio.

---

## Matriz de diferenciação (checagem de Fase 3)

| | Anank | Aurea | Vivace | Oniria |
|---|---|---|---|---|
| Display | Instrument Serif | Fraunces | DM Serif Display | Bodoni Moda |
| Corpo | Inter Tight | Inter | Manrope | Inter Tight |
| Raio | 2px | 24px | 8px | 0px |
| Fundo | off-white | creme quente | bege frio | preto |
| Acento | verde-limão | terracota | sage | bronze |
| Profundidade | respiro | sombra suave | linha 1px | luz/contraste |
| Grid | assimétrico | generoso | 12 col rígido | editorial assimétrico |
| Ritmo | 1 entrada, depois quieto | fade curto 0.5s | stagger 0.08s | cinematográfico 0.9–1.1s |

Nenhuma célula pode se repetir entre Aurea, Vivace e Oniria.

---

## Fontes — carregamento

Em `app/layout.tsx`, via `next/font/google`, todas com `display: 'swap'` e `variable`:

```ts
Instrument_Serif  → --font-instrument-serif   (400, 400 italic)
Inter_Tight       → --font-inter-tight        (variable)
Fraunces          → --font-fraunces           (variable, axes opsz/SOFT/WONK)
Inter             → --font-inter              (variable)
DM_Serif_Display  → --font-dm-serif-display   (400, 400 italic)
Manrope           → --font-manrope            (variable)
Bodoni_Moda       → --font-bodoni-moda        (variable, 400/700 + italic)
```

As 7 variáveis são aplicadas no `<html className={...}>`, e cada escopo `[data-brand]` escolhe
quais usar. Isso evita FOUT e mantém o custo em uma única passada.

---

## Banco de imagens validado

**86 URLs Unsplash validadas com HTTP 200 e conferidas visualmente em contact sheet.**
Formato: `https://images.unsplash.com/photo-<ID>?auto=format&fit=crop&w=<W>&q=80`

Nenhum subagente deve inventar IDs. Use os desta lista, ou busque novos **via WebFetch** em
`https://unsplash.com/s/photos/<termo>` e valide com `curl` antes de usar.

### Aurea — salão, cabelo, luz quente

| ID | Conteúdo |
|---|---|
| `1634449571010-02389ed0f9b0` | lavagem de cabelo no lavatório |
| `1521590832167-7bcbfaa6381f` | interior de salão claro, cadeira rosa |
| `1503951914875-452162b0f3f1` | corte masculino, luz dramática |
| `1560066984-138dadb4c035` | salão B&W, fileira de cadeiras |
| `1595475884562-073c30d45670` | mãos segurando tesoura e escova, fundo branco |
| `1562322140-8baeececf3df` | cabeleireira escovando cabelo de cliente |
| `1712213396688-c6f2d536671f` | corte com tesoura, close |
| `1707979577466-2d6109c68a45` | coloração sendo aplicada, luvas azuis |
| `1470259078422-826894b933aa` | cabelo rosa em movimento, editorial |
| `1605980766335-d3a41c7332a1` | cabelo loiro ondulado, close |
| `1626383137804-ff908d2753a2` | salão claro, fileira de estações |
| `1695527081848-1e46c06e6458` | cabeleireira atendendo cliente na janela |
| `1637777277435-3c44f82fd0c9` | neon "You're like, Really pretty" |
| `1695527081782-33e110235ade` | prateleira com produtos capilares |
| `1580618672591-eb180b1a973f` | secagem com escova redonda |
| `1554519934-e32b1629d9ee` | retrato, cabelo loiro longo |
| `1617391654484-2894196c2cc9` | mechas com papel alumínio |
| `1600948836101-f9ffda59d250` | salão escuro, espelhos redondos |
| `1637777269327-c4d5c7944d7b` | lavatórios pretos enfileirados |

Retrato da Bruna Sartori: `1699899657680-421c2c2d5064` ou `1631377307479-99d966c84eff`.
Depoimentos: `1494790108377-be9c29b29330`, `1701096374092-bb70915fdc5c`, `1609371497456-3a55a205d5eb`.

### Vivace — clínica estética, sage/branco

| ID | Conteúdo |
|---|---|
| `1570172619644-dfd03ed5d881` | máscara facial aplicada com pincel |
| `1616394584738-fc6e612e71b9` | máscara facial branca, cliente relaxada |
| `1552693673-1bf958298935` | procedimento com touca cirúrgica |
| `1713085085470-fba013d67e65` | aparelho de peeling/microagulhamento no rosto |
| `1761718209852-54ca4210183e` | aparelho facial metálico |
| `1639162906614-0603b0ae95fd` | massagem nas costas |
| `1519823551278-64ac92734fb1` | massagem corporal, close |
| `1745327883508-b6cd32e5dde5` | mãos de massoterapeuta |
| `1696841212541-449ca29397cc` | massagem com óleo |
| `1741522509438-a120c0bb5e88` | drenagem nas costas |
| `1758448721162-0c77cf477d6f` | recepção moderna, mármore e madeira |
| `1742367539759-6e4fc2e39209` | interior claro minimalista |
| `1648775507324-b48dd3791fa5` | sala branca com árvore central |
| `1731514721772-329626f84c8b` | sala de espera clara |
| `1731514693674-a32211b63996` | recepção de clínica com logo |
| `1551076826-72190fff02d3` | equipamento clínico com frascos |
| `1595871151608-bc7abd1caca3` | sala de tratamento com maca |
| `1540555700478-4be289fbecef` | frasco pump, tulipas, toalha |
| `1515377905703-c4788e51af15` | conta-gotas de sérum |
| `1544717304-a2db4a7b16ee` | ombro/pele, toalha branca |
| `1629684027309-92e2cc2de5ed` | retrato de beleza, pele luminosa |
| `1643684391140-c5056cfd3436` | close de pele e lábios |

Equipe Vivace (8 pessoas, retratos coloridos):
`1573497019940-1c28c88b4f3e`, `1594824476967-48c8b964273f`, `1659353888906-adb3e0041693`,
`1673865641073-4479f93a7776`, `1612349317150-e413f6a5b16d`, `1622253692010-333f2da6031d`,
`1637059824899-a441006a6875`, `1643297654416-05795d62e39c`.
Extras/depoimentos: `1586522434115-38d718beeca5`, `1607746882042-944635dfe10e`,
`1701728667207-54b43dbdab97`, `1655249481446-25d575f1c054`, `1589729132389-8f0e0b55b91e`,
`1645066928295-2506defde470`, `1712215544003-af10130f8eb3`.

### Oniria — editorial escuro, macro de pele, B&W, arquitetura

| ID | Conteúdo |
|---|---|
| `1765323337815-1b1c1a47cdaa` | interior escuro, luz quente — **hero** |
| `1574015974293-817f0ebebb74` | mulher, cabelo esvoaçante, B&W — **hero alt** |
| `1777262080995-da4a45f51af8` | cílios/pele macro, escuro |
| `1588683301867-c442a9ed1389` | olho com cílios, dourado |
| `1612864271882-5107e9e3b0ce` | olho azul macro |
| `1611035423909-55f170781d3d` | olho azul macro, alt |
| `1781503056004-53972080018b` | olho castanho e testa, macro |
| `1761209355640-14d8d673258f` | olho verde macro |
| `1629684027309-92e2cc2de5ed` | retrato de beleza, pele luminosa |
| `1621260508240-baaeae3b4530` | escada branca de concreto |
| `1734629166615-8e3495a3b869` | corredor arqueado, ladrilho P&B |
| `1738844153737-5d2525178e49` | fachada arquitetônica B&W |
| `1570372225974-74fa85214b83` | canto de parede branca, geometria |
| `1586522471252-68f4b108ff2a` | curva branca minimalista |
| `1495462911434-be47104d70fa` | mulher de chapéu, B&W editorial |

Retratos B&W (equipe / editorial):
`1506863530036-1efeddceb993`, `1540172777610-b15b605dd68d`, `1541519481457-763224276691`,
`1508186225823-0963cf9ab0de`, `1504275490777-45f30792f13f`, `1518611540400-6b85a0704342`,
`1633355130553-2d90ad3507d3`, `1644718847151-fff2271484a1`, `1620122303020-87ec826cf70d`,
`1568633782872-67d29d4615d2`, `1548207775-a7676e36f20a`.

**Dra. Helena Kruger** (diretora científica): `1540172777610-b15b605dd68d` (B&W, rosto).
**Dra. Marina Aveline**: `1620122303020-87ec826cf70d` (B&W).

### Regras de uso de imagem

- Toda URL vive em `apps/api/src/data/<slug>.ts`, campo `images`, com `alt` descritivo em pt-BR.
- Todo `<Image>` recebe `sizes` explícito, `placeholder="blur"` + `blurDataURL`, e `priority`
  **só** no hero.
- `blurDataURL`: use um SVG base64 de cor sólida da marca (helper compartilhado será fornecido
  em `shared/lib/blur.ts`).
- `next.config.ts` → `images.remotePatterns` para `images.unsplash.com`.
