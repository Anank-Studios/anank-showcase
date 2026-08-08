# Hub por nível, tema claro/escuro e navbar da Oniria

Data: 2026-08-08 · Branch: `feat/hub-tiers-tema-nav-oniria`

## Problema

Três coisas, pedidas pelo cliente depois de ver o hub no ar.

1. O hub vende **marcas fictícias**, não níveis de serviço. O visitante lê "Aurea
   Beauty Studio" e não faz ideia de que aquilo é o degrau de entrada. A foto
   ocupa o card inteiro e compete com a informação que importa.
2. Não há como ver o hub no escuro — que é como a marca Anank realmente se
   apresenta no site institucional.
3. Na Oniria, os nomes das abas somem conforme o fundo. A navegação é
   `absolute` sobre o conteúdo, sem fundo próprio: sobre foto clara, o
   `--brand-muted` (#85817a) desaparece.

## Decisões

Todas confirmadas com o cliente antes de escrever código.

| Questão | Decisão |
| --- | --- |
| O que sobra no card sem foto e sem nome de marca | Card tipográfico com cor, raio e fonte **reais** da marca |
| Persistência do tema (localStorage é proibido no projeto) | Cookie lido no servidor |
| Alcance do tema | Só o hub; as 3 demos mantêm identidade fixa |
| Tema padrão | **Escuro** |
| Formato do badge da Oniria | Duas pílulas separadas: wordmark e links |

### Por que cookie, e não localStorage

O projeto proíbe `localStorage` e `sessionStorage` por regra de ESLint. O cookie
não é só a alternativa que respeita a regra — é a melhor das três:

- sobrevive ao F5;
- **não pisca tema errado**, porque o servidor já entrega o HTML no tema certo;
- não exige script inline bloqueante no `<head>`.

Custa uma leitura de cookie no layout raiz, que normalmente forçaria toda a
aplicação a renderizar dinamicamente. **Aqui não custa nada**: as 14 rotas já
são `force-dynamic` — o hub direto em `app/page.tsx`, as 13 demos via
`app/demo/layout.tsx`. Nenhuma rota perde otimização estática, porque nenhuma
tinha.

### Por que o tema não alcança as demos

A prova comercial do showcase é que as três demos são marcas **diferentes**.
Aurea creme, Vivace clara, Oniria preta. Se o visitante puder trocar o tema
delas, o argumento morre — e ainda exigiria inventar seis paletas em vez de
três, cada uma com nova validação de contraste.

## Arquitetura

### Tema

`data-theme` no elemento `<html>`, escrito pelo servidor a partir do cookie
`anank-theme`. O seletor CSS é deliberadamente estreito:

```css
[data-theme='dark'],
[data-theme='dark'] [data-brand='anank'] { /* tokens escuros */ }
```

As demos ficam intocadas: só `[data-brand='anank']` é alvo, e o bloco
`[data-brand='aurea']` casa diretamente com o elemento, vencendo qualquer
herança vinda do `<html>`.

Paleta escura extraída de `assets/css/shared.css` do repo `site-anank` — não
inventada:

| token | valor | origem | contraste sobre `#060b08` |
| --- | --- | --- | --- |
| `--brand-bg` | `#060b08` | Black | — |
| `--brand-surface` | `#0c1611` | bg-mid | — |
| `--brand-ink` | `#f7f7f7` | Off-white | 18.9:1 |
| `--brand-muted` | `#a7b3ac` | text-secondary | 9.1:1 |
| `--brand-accent` | `#2fae80` | Verde Anank | 6.8:1 |
| `--brand-accent-2` | `#54c99a` | accent-fringe | 9.3:1 |

**A inversão que não pode ser esquecida:** no tema claro o Verde Anank dá 2.6:1
e por isso `--brand-accent-2` é o Pinho `#1c3a2d`, escuro, usado nos numerais.
No tema escuro o Pinho seria invisível. `--brand-accent-2` troca de papel e vira
o fringe `#54c99a`. Sem essa troca os numerais `01/02/03` somem.

O `text-tertiary` oficial `#6e7b74` **não** é usado: dá 4.4:1 sobre o Black,
marginal para texto pequeno.

### Componentes

| Arquivo | Responsabilidade | Depende de |
| --- | --- | --- |
| `shared/lib/theme.ts` | Nome do cookie, tipo `Theme`, leitura no servidor, padrão escuro | `next/headers` |
| `shared/components/ThemeToggle.tsx` | Botão cliente: grava cookie, aplica `data-theme`, sem recarregar | `theme.ts` |
| `shared/components/HubIntro.tsx` | Hub: cabeçalho, toggle, três cards por nível | `TierCard`, `ThemeToggle` |
| `demos/oniria/components/OniriaNav.tsx` | Navegação com duas pílulas translúcidas | — |

O `ThemeToggle` grava o cookie **e** troca o atributo no `<html>` na hora, sem
esperar round-trip: a resposta visual é imediata, e o cookie serve só para o
próximo carregamento.

### Cards por nível

Os três níveis passam a ser dado do componente, não da API — são a oferta
comercial da Anank, não propriedade das marcas fictícias:

```
Demo 1 · Simples
Demo 2 · Intermediário   [Popular]
Demo 3 · Premium
```

Cada card usa `demo.tokens` (cor, raio, fonte display da marca) para que as três
identidades continuem legíveis sem foto. Alinhamento horizontal: caem os
deslocamentos `md:mt-16` / `md:mt-24` e as proporções ficam iguais.

**Custo assumido:** a assimetria dos cards era uma decisão deliberada contra o
visual "gerado por IA". Ela se perde. A diferenciação passa a depender inteira
da linguagem de cada marca — cor, raio e tipografia.

### Campos órfãos no contrato

`demo.thumbnail` e `demo.thumbnailWord` deixam de ser lidos pelo hub, que era o
único consumidor. **Permanecem** no contrato e na API: removê-los mexeria em
`packages/contracts` e nos três arquivos de dados, fora do escopo pedido, e o
cliente pode querer as fotos de volta.

### Navbar da Oniria

Duas pílulas com `backdrop-blur` e fundo escuro translúcido, fio de 1px:

```
╭────────╮        ╭──────────────────────────────────╮
│ ONIRIA │        │ PROTOCOLOS  MANIFESTO  EQUIPE  … │
╰────────╯        ╰──────────────────────────────────╯
```

O wordmark ganha pílula própria porque sofre do mesmo mal — só não foi notado
primeiro. A opacidade do fundo será **medida** sobre o pior caso real (hero
claro), não estimada.

## Critérios de aceite

- [ ] Hub abre no escuro por padrão; toggle troca sem recarregar e sobrevive ao F5
- [ ] Nenhum flash de tema errado no carregamento
- [ ] Cards mostram nível e selo Popular; sem foto, sem nome de marca
- [ ] As três marcas continuam distinguíveis por cor, raio e fonte
- [ ] Cards alinhados horizontalmente nos dois viewports
- [ ] Abas da Oniria legíveis sobre o hero claro, medido
- [ ] Demos inalteradas pelo tema
- [ ] `typecheck`, `lint`, `test` limpos; QA visual em 390 e 1440, nos dois temas
- [ ] Sem `localStorage` / `sessionStorage`
