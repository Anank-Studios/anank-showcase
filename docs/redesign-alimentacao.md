# Spec: elevar as demos de alimentação de "genéricas" a premium

Estado em 2026-08-19. As três demos funcionam, são acessíveis e passam na
pipeline — mas parecem template. Este documento diz **por quê**, com regra
nomeada, e **o que fazer**, para a próxima sessão não redescobrir o diagnóstico.

Skills consultadas: `ui-ux-pro-max` e `design-taste-frontend` (esta última é a
que cobre scroll-telling e as regras anti-slop).

---

## O diagnóstico, em uma linha

> As três demos repetem o mesmo esqueleto: **rótulo → título → grade de 3
> colunas iguais**, seção após seção.

A regra violada tem nome, e é categórica:

> **NO 3-Column Card Layouts** — a fileira de "3 cards iguais horizontais" é
> BANIDA. Use zig-zag de 2 colunas, grid assimétrico ou rolagem horizontal.
> — `design-taste-frontend`, §7

### Onde exatamente

| Arquivo | Seção | O que está lá |
| --- | --- | --- |
| `demos/brasa/BrasaHome.tsx` | "Os seis" | grade 3 col, 6 cards idênticos |
| `demos/brasa/BrasaHome.tsx` | depoimentos | grade 3 col |
| `demos/brasa/BrasaHome.tsx` | números | 4 caixas iguais |
| `demos/kaiseki/KaisekiHome.tsx` | "Do balcão" | grade 3 col |
| `demos/kaiseki/KaisekiHome.tsx` | depoimentos + números | idem |
| `demos/forno/FornoCasa.tsx` | depoimentos | grade 3 col |
| `demos/kaiseki/KaisekiCardapio.tsx` | itens | grade 3 col |
| `demos/forno/FornoCardapio.tsx` | itens | grade 3 col (mesmo componente) |

O `_alimentacao/ItemCardapio.tsx` é compartilhado: mudar a grade nos dois
cardápios é **uma** mudança, não duas.

---

## Os dials (baseline da skill)

```
DESIGN_VARIANCE: 8   (assimétrico: masonry, grid fracionário, vazios grandes)
MOTION_INTENSITY: 6  (CSS fluido + reveals coreografados)
VISUAL_DENSITY: 4    (arejado, mas não galeria de arte)
```

Hoje o projeto está em **variance ~3** (grades simétricas, paddings iguais) e
**motion ~4** (só fade-up ao entrar em quadro). O buraco está aí.

---

## O que fazer, por demo

O objetivo NÃO é redesenhar do zero — a identidade de marca (paleta, tipografia,
tokens) está resolvida e o usuário aprovou. É trocar **estrutura de layout** e
**coreografia de movimento**.

### Regra transversal

- Substituir toda grade 3×1 por: **zig-zag de 2 colunas**, **grid fracionário**
  (`2fr 1fr 1fr`) ou **rolagem horizontal**.
- Variar proporção das fotos entre vizinhas (4:5 ao lado de 1:1) — hoje todas
  usam a mesma.
- Quebrar o ritmo: nem toda seção começa com rótulo em caixa alta.
- **MOBILE OVERRIDE**: qualquer assimetria acima de `md:` cai para coluna única
  em `< 768px`. Não negociável.

### Brasa — a mais genérica das três

- **"Os seis"**: virar galeria de **rolagem horizontal** com arrasto, numerada
  01–06. Combina com a marca (cardápio curto e assertivo) e mata a grade.
- **Números**: sair das 4 caixas iguais para tipografia grande sobre linhas de
  1px, sem caixa.
- **Depoimentos**: um só, grande, em rotação — não três lado a lado.

### Kaiseki

- **"Do balcão"**: zig-zag de 2 colunas com deslocamento vertical (`mt-16` na
  coluna par), proporções alternadas.
- Aproveitar a mincho: **text mask reveal** no manifesto.

### Forno

- Já tem o scroll-telling, que é o ponto alto. O resto da página precisa estar à
  altura — hoje não está.
- **Sticky scroll stack** nas clássicas do cardápio.

---

## Movimento: o que já existe e o que falta

Pronto e commitado:

- `_alimentacao/motion/Magnetico.tsx` — botão que é puxado pelo cursor.
  Usa `useMotionValue` + `useSpring`, **nunca** `useState`: estado do React a
  cada `pointermove` renderiza a árvore dezenas de vezes por segundo. Ignora
  ponteiro grosso (dedo) e `prefers-reduced-motion`.

A escrever:

- `StaggerGroup` / `StaggerItem` — entrada em cascata, 30–50 ms por item, com
  `type: 'spring', stiffness: 100, damping: 20`. **Pai e filhos precisam estar
  na MESMA árvore de client component** ou o `staggerChildren` não propaga.
- `GaleriaHorizontal` — rolagem vertical vira pan horizontal (GSAP).
- `MarqueeCinetico` — faixa de texto infinita que reage à rolagem.

### Restrições que valem mais que o efeito

- **Nunca misturar GSAP e Motion na mesma árvore de componente.** Motion para
  UI e micro-interação; GSAP isolado para scroll-telling e canvas. O
  `MontagemPizza` já respeita isso — não quebre.
- Animar **só** `transform` e `opacity`. Nunca `width`, `height`, `top`, `left`.
- Toda animação perpétua isolada em client component microscópico e memoizada,
  senão ela re-renderiza o layout inteiro.
- Todo `useEffect` de animação com cleanup estrito.

---

## Armadilhas já pagas neste projeto

Não repita:

1. **`pin: true` do GSAP quebra o React ao desmontar.** O GSAP embrulha a seção
   num `pin-spacer` e troca o pai no DOM; o React tenta `removeChild` num nó que
   não é mais filho daquele pai e a aplicação inteira cai em "Application error".
   A correção é um `<div>` em volta da seção presa — ver `MontagemPizza.tsx`.
2. **Varrer URLs não é testar navegação.** As 24 rotas passavam por acesso
   direto enquanto a navegação por clique quebrava. Teste percurso, não página.
3. **Capturar antes da animação terminar** parece bug de layout. Já reportei um
   como tal. Meça a caixa antes de mexer no código.
4. **`display: contents` não gera caixa** — não há o que transformar, e a
   animação simplesmente não roda.
5. **Foto aprovada em miniatura mente.** Três itens tiveram foto ou descrição
   corrigidas por divergência só visível a 1440px. Confira finalista no tamanho
   de uso.

---

## O que já foi medido (não refazer)

Transição de rota da Oniria, dev com rotas quentes:

| | antes | depois |
| --- | --- | --- |
| tela livre | 2 750 ms | **1 530 ms** |

Produção antes da correção: **3 700 – 7 250 ms**. Falta medir depois do deploy —
o script está em `.tmp/transicao-prod.mjs`.

A causa não era a animação. Era `cache: 'no-store'` em todo fetch somado ao
`router.push` disparando só depois da cortina fechar.

---

## Verificação obrigatória antes de dizer "pronto"

- [ ] Percurso de navegação entre TODAS as abas das 3 marcas, sem exceção de
      cliente (`.tmp/navega.mjs`)
- [ ] Varredura de erro nas 24 rotas × 2 tamanhos (`.tmp/erros.mjs`)
- [ ] Contraste medido, não presumido — o Lighthouse **não** audita contraste de
      não-texto (mínimo 3:1); use `--brand-muted` em borda de componente, nunca
      `--brand-line` (1,3:1)
- [ ] 390 px sem overflow horizontal
- [ ] `prefers-reduced-motion` desliga o movimento sem quebrar o conteúdo
- [ ] `pnpm -r typecheck`, lint nos três workspaces, 19 testes da API

---

## Deriva deliberada da skill

A skill proíbe Unsplash e manda usar `picsum.photos`. **Aqui não se aplica**: o
banco de fotos foi conferido uma a uma, com 21 reprovações registradas por marca
real à vista ou assunto errado. Trocar por placeholder aleatório jogaria fora
essa verificação e devolveria as demos ao genérico. As URLs são estáveis e o
motivo da regra (link quebrado) não existe neste projeto.
