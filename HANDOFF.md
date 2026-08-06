# HANDOFF — Anank Showcase

> Arquivo de contexto para troca de sessão. **Atualizado a cada fase.**
> Última atualização: Fase 0 em andamento.

## Onde fica o projeto

```
C:\Users\Guilherme Mazzutti\Desktop\Projetos Vibe\anank-showcase
```

Git inicializado. `pnpm` foi instalado globalmente via `npm i -g pnpm@10` (v10.34.5) —
o `corepack enable` falha nesta máquina com EPERM em `C:\Program Files\nodejs`.
Node v24.13.1. Playwright browsers já em cache em `%LOCALAPPDATA%\ms-playwright`.

## O que é

Portfólio comercial da Anank Studios: um hub em `/` que apresenta 3 demos de sites fictícios
de salão/estética, em 3 níveis de preço. Briefing completo original está reproduzido nos specs.

- `/` — Hub Anank Studios
- `/demo/aurea` — Landing page simples (R$ 1.500–2.500)
- `/demo/vivace` + 3 subrotas — Institucional (R$ 3.500–5.000)
- `/demo/oniria` + 6 subrotas — Premium (R$ 10.000+)

## Preferências do usuário (Guilherme) — valem para tudo

1. **Mobile-first.** CSS base = 390px. `md:`/`lg:` só adicionam. Nunca desktop-first.
2. **Sempre validar visualmente.** Screenshot em 390×844 **e** 1440×900, console limpo,
   antes de dizer "pronto". Build verde não basta.
3. Delegar implementação a subagentes Sonnet em paralelo (pedido explícito no briefing).
4. Zero `localStorage`/`sessionStorage`, zero `TODO`/`lorem`, copy real em pt-BR.

## Estado atual

- [x] Ambiente verificado (node/pnpm/git/playwright)
- [x] Banco de 86 imagens Unsplash validadas (HTTP 200) **e conferidas visualmente**
      via contact sheet — ver `specs/01-design-tokens.md` e os specs de cada demo
- [ ] Fase 0 — specs em `/specs` (em andamento)
- [ ] Fase 1 — fundação (monorepo, tokens, API, DemoToggle, Hub)
- [ ] Fase 2 — 3 subagentes Sonnet em paralelo
- [ ] Fase 3 — integração, QA visual, Lighthouse, README

## Como retomar

1. `cd "C:\Users\Guilherme Mazzutti\Desktop\Projetos Vibe\anank-showcase"`
2. Ler `specs/00-arquitetura.md` primeiro — define a regra de isolamento de escopo.
3. Ver a seção "Estado atual" acima e continuar da primeira caixa não marcada.
4. `pnpm install && pnpm dev` sobe web (3000) e api (3333).

## Notas de ambiente descobertas

- `corepack enable pnpm` → EPERM. Usar `npm i -g pnpm@10`.
- Scraping direto de unsplash.com/pexels.com com `curl` → bloqueado (0 resultados / 403).
  A ferramenta **WebFetch** funciona e retorna os IDs das fotos. Usar ela para achar imagens.
- Validação de imagem: `curl -s -o /dev/null -w "%{http_code}" "https://images.unsplash.com/photo-<ID>?..."`.
  ID inválido retorna **404** — então o teste de 200 é confiável.
- Contact sheet para conferência visual em lote: `.tmp/sheet.mjs` (HTML grid + screenshot Playwright).
