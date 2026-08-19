# Manual: scroll-telling por sequência de quadros

Como reproduzir o efeito da pizzaria em outras demos. Escrito depois de duas
tentativas jogadas fora — as armadilhas estão documentadas porque custaram caro.

---

## A regra que resume tudo

> **A coerência vem da FONTE, não da transição.**

Os quadros precisam sair de **um único plano contínuo com câmera travada**. Não
existe truque de transição que faça duas fontes diferentes parecerem o mesmo
objeto. Se você guardar uma frase deste documento, guarde esta.

---

## O que NÃO funciona

Três abordagens testadas e reprovadas, em ordem de quanto pareceram boas ideias:

### 1. Desenhar o objeto em CSS

Círculos para massa, molho e queijo; discos para a calabresa. Funciona
tecnicamente e **não engana ninguém** — de perto é desenho, não comida. Num site
que vende apetite, é o oposto do que se quer.

### 2. Dissolve entre fotos avulsas de banco

Cada troca é **outro objeto**. Uma pizza vira outra pizza. Sem continuidade,
lê como corte de vídeo mal editado. Nenhum `clip-path` ou vinheta salva isso.

### 3. Um ScrollTrigger por etapa de texto

Criar um trigger por etapa com deslocamento calculado à mão. **Nenhum dispara** —
as etapas ficam todas apagadas e o defeito é silencioso. O texto tem que sair do
**mesmo índice de quadro** que a imagem.

---

## O pipeline

### 1. Gerar o vídeo

```bash
node scripts/veo.mjs                       # lite, o padrão — comece aqui
node scripts/veo.mjs --modelo fast         # só se o lite não bastar
node scripts/veo.mjs --saida outro.mp4
```

O script lê `GEMINI_API` do `.env` na raiz. **Nunca coloque a chave em
`.env.example`** — é o único arquivo `.env` versionado, e ela vaza no próximo
commit.

**Comece sempre pelo Lite.** Para descobrir se o modelo respeita "câmera travada,
plano único" — que é o que faz ou quebra o efeito — 720p barato basta. Só suba de
modelo depois que o MOVIMENTO estiver certo; pagar qualidade antes é desperdício.

Na pizzaria o Lite acertou de primeira, por **$0,40**.

| modelo | por segundo | clipe de 8s |
| --- | --- | --- |
| Lite 720p | $0,05 | $0,40 |
| Fast 720p | $0,10 | $0,80 |
| Standard | $0,40 | $3,20 |

### 2. O prompt

As exigências abaixo são **funcionais, não estéticas**. Cada uma corresponde a
uma forma de o efeito quebrar:

| exigência | por que |
| --- | --- |
| `locked-off camera, static tripod, no pan, no zoom` | câmera que se move sozinha **briga com o scroll**: o visitante rola para baixo e a imagem vai para o lado |
| `single continuous take, no cuts` | um corte no meio **lê como falha de carregamento**, não como edição |
| `no text, no letters, no logos, no packaging, no bottles` | é material de estabelecimento **fictício** |
| objeto centralizado no quadro | o recorte no layout não pode cortar a ação |
| `warm low-key lighting, dark background` | fundo escuro esconde a compressão do WebP |

Esqueleto que funcionou:

```
Overhead top-down locked-off camera, absolutely static tripod shot,
no camera movement, no pan, no zoom.
<OBJETO> is assembled step by step on <SUPERFÍCIE> in the center of the frame:
first <ETAPA 1>, then <ETAPA 2>, then <ETAPA 3>, finally <ETAPA 4>.
Warm low-key restaurant lighting from the side, deep shadows, dark background.
Single continuous take, no cuts, no transitions.
No text, no letters, no logos, no packaging, no bottles, no branded objects anywhere.
Photorealistic food cinematography, shallow depth of field, 4k.
```

**Não passe `personGeneration`.** O valor `allow_adult` é recusado com 400 por
estes modelos. Sem o parâmetro, mãos aparecem normalmente — e mãos ajudam: dão
escala e movimento humano.

### 3. Conferir antes de extrair

```bash
FF=$(node -e "process.stdout.write(require('ffmpeg-static'))")
"$FF" -i .tmp/pizza.mp4 -vf "fps=1,scale=420:-1" .tmp/quadros/q%02d.jpg
```

Olhe o **primeiro, o meio e o último**. É no meio que vídeo de IA derrapa. Se a
câmera andou ou houve corte, **gere de novo** — não tente consertar na montagem.

### 4. Extrair a sequência

```bash
FF=$(node -e "process.stdout.write(require('ffmpeg-static'))")
"$FF" -i .tmp/pizza.mp4 \
  -vf "fps=12,scale=880:-1" -c:v libwebp -quality 52 -compression_level 6 \
  apps/web/public/<marca>/montagem/q%03d.webp
```

Os números e o porquê:

| parâmetro | valor | razão |
| --- | --- | --- |
| `fps=12` | 96 quadros em 8s | com `scrub` já lê como contínuo — o visitante controla o tempo, então não há cadência fixa para o olho comparar |
| `scale=880` | 880×495 | é o máximo que o canvas ocupa no layout; maior é byte jogado fora |
| `quality=52` | ~36 kB/quadro | 3,4 MB no total; a 60 dava 5,5 MB sem ganho visível |
| destino | `public/` | arquivos com **extensão** são cacheados pela Cloudflare — `/_next/image` não é, por não ter extensão na URL |

O `ffmpeg-static` precisa estar autorizado em `package.json`
(`pnpm.onlyBuiltDependencies`): o pnpm 10 bloqueia postinstall e o binário não
baixa sozinho.

### 5. O componente

Copie `apps/web/src/demos/forno/components/MontagemPizza.tsx` e ajuste `TOTAL`,
`CAMINHO`, `LARGURA` e `ALTURA`. Os pontos que não podem mudar:

**Canvas, nunca `<img>`.** Trocar `src` 96 vezes durante o scroll faz o navegador
decodificar no meio do gesto e engasgar. No canvas os quadros são decodificados
**uma vez** no pré-carregamento e depois só copiados — `drawImage` é GPU.

**`snap: { i: 1 }` no cursor.** Sem isso `drawImage` recebe `43.7` e o quadro
oscila entre dois.

**Carregamento em duas passadas.** 1 a cada 6 quadros primeiro (16 arquivos, já
dá para percorrer tudo com salto), o resto depois. Baixar 96 de uma vez atrasa o
resto da página; sob demanda o scroll mostra buracos.

**Se o quadro não carregou, mantenha o anterior.** Nunca pinte branco.

**Pin só a partir de 1024px**, via `gsap.matchMedia`. Prender seção alta em tela
pequena rouba o scroll e o efeito vira armadilha.

**`prefers-reduced-motion`**: sem pin, sem timeline. Mostre o último quadro (o
objeto pronto) e o texto completo. O conteúdo tem que ser o mesmo.

**`role="img"` + `aria-label` no canvas.** Sem isso o leitor de tela anuncia
"canvas" e o visitante não sabe o que perdeu.

**O texto sai do índice do quadro**, dentro do `onUpdate`:

```ts
const etapa = Math.min(
  etapas.length - 1,
  Math.floor((cursor.i / (TOTAL - 1)) * etapas.length)
);
```

### 6. Validar

```bash
node .tmp/seq.mjs     # amostra 5 posições e mede se o canvas tem tinta
```

Duas verificações que **precisam** existir:

1. **O canvas está pintado?** Leia `getImageData` e some os canais. Retângulo
   vazio passa por qualquer screenshot desatento.
2. **Imagem e texto estão em sincronia?** Capture no meio e confirme que a etapa
   destacada corresponde ao que a imagem mostra.

E a armadilha que me pegou **três vezes** neste projeto: ao capturar com
Playwright, **espere a animação terminar**. Um card em `opacity: 0` fotografado
antes do tempo parece bug de layout, e eu já reportei um como tal. Meça a caixa
antes de mexer no código.

---

## Fotografia de banco: 200 não basta

Quando o efeito usa foto de banco em vez de vídeo gerado, **olhe cada imagem**.
Neste projeto, 14 candidatas a pizza deram HTTP 200 e **4 foram rejeitadas**:

| id | problema |
| --- | --- |
| `1590005354167` | eram **maçãs verdes** |
| `1509440159596` | pães rústicos, não massa de pizza |
| `1571407970349` | garrafa de **Coca-Cola** à vista |
| `1548369937` | cardápio impresso com **marca real** no enquadramento |

Marca real não entra em material de estabelecimento fictício. Em foto de
hambúrguer a Coca aparece com frequência — desconfie.

---

## Custo de referência

A pizzaria inteira custou **$0,40**: uma geração no Lite, acertada de primeira
por causa do prompt. Orçamento sugerido por marca:

- 1–3 tentativas no Lite para afinar o movimento — $0,40 a $1,20
- 1 no Fast se precisar de qualidade — $0,80
- Standard só como rede de segurança — $3,20

Recusas por parâmetro inválido ou falta de crédito **não são cobradas**.
