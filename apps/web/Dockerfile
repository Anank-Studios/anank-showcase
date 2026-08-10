# Front (Next.js 15, App Router) — build a partir da RAIZ do monorepo.
#   docker build -f apps/web/Dockerfile .
# Usa `output: 'standalone'` (next.config.ts): o runner leva só o server.js
# traçado e as dependências realmente alcançadas, não o node_modules inteiro.

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /repo

# ── deps ──
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @anank/web...

# ── build ──
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/contracts packages/contracts
COPY apps/web apps/web

# Inlinado no bundle do navegador. Vazio = caminho relativo no mesmo host
# (a API é servida em /api pelo Traefik), que é o que queremos em produção.
ARG NEXT_PUBLIC_API_URL=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @anank/contracts build && pnpm --filter @anank/web build

# ── runner ──
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=node:node /repo/apps/web/public ./apps/web/public

# Cache de imagem otimizada. Criado AQUI, com dono `node`, de propósito: o
# Docker copia o conteúdo e a permissão desta pasta para o volume nomeado na
# primeira montagem. Sem isso o volume nasceria como root e o processo, que
# roda como `node`, não conseguiria escrever — o cache ficaria sempre vazio,
# em silêncio.
RUN mkdir -p apps/web/.next/cache/images && chown -R node:node apps/web/.next/cache

USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
