# Deploy — Anank Showcase

Produção: **https://demo.anankstudios.com.br** (VPS Anank Studios).

## Como o tráfego chega

```
navegador → Cloudflare (proxy/TLS) → Cloudflare Tunnel → Traefik :80 → containers
                                                            ├─ /api/*  → anank-showcase-api  (Fastify :3333)
                                                            └─ /*      → anank-showcase-web  (Next.js :3000)
```

Front e API compartilham a mesma origem pública, então o navegador nunca faz
requisição cross-origin — sem CORS, sem preflight. Duas consequências no código:

- **No navegador** o `fetch` usa caminho relativo (`NEXT_PUBLIC_API_URL` é `""`
  no build da imagem).
- **Na renderização no servidor** o Next fala direto com `http://api:3333` pela
  rede interna do Compose (`API_INTERNAL_URL`) — não sai para a internet e volta.

Nenhum container publica porta no host: quem alcança é o Traefik, pela rede
externa `traefik-public`.

## Deploy automático

Push na `main` dispara `.github/workflows/pipeline.yml`. O deploy só roda depois
que **ci**, **secret-scan** e **docker-build** passam — o gate é o `needs:` do
Actions, não um `if:`. Na VPS o job faz `git reset --hard origin/main`, rebuilda,
sobe e só declara sucesso após `/` e `/api/health` responderem 200 através do
Traefik com o Host público.

Secrets necessários no repositório: `SSH_HOST`, `SSH_USER`, `SSH_PORT`,
`SSH_PRIVATE_KEY` (chave `~/.ssh/github-actions-showcase` da VPS).

## Deploy manual

```bash
cd ~/anank-showcase
git pull
docker compose build
docker compose up -d
curl -H "Host: demo.anankstudios.com.br" http://localhost/api/health
```

O `.env` da raiz **não é versionado** e no servidor contém apenas:

```
SHOWCASE_HOST=demo.anankstudios.com.br
```

## Domínio

O hostname vive em `/etc/cloudflared/config.yml` na VPS (+ `systemctl restart
cloudflared`) e aponta para `http://localhost:80`. O DNS é um CNAME proxied para
`<tunnel-id>.cfargotunnel.com`.

> Nunca adicione hostname pelo painel da Cloudflare: o túnel usa configuração
> local, e salvar pelo dashboard substitui o arquivo inteiro, derrubando todos os
> outros domínios da VPS.

## Diagnóstico

```bash
docker compose ps
docker compose logs -f web        # ou api
docker compose exec api node -e "fetch('http://127.0.0.1:3333/api/health').then(r=>r.text()).then(console.log)"
```
