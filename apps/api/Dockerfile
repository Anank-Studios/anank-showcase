# API (Fastify 5) — build a partir da RAIZ do monorepo.
#   docker build -f apps/api/Dockerfile .
# O contexto precisa ser a raiz porque @anank/api depende de @anank/contracts
# via `workspace:*`, e o pnpm-lock.yaml é único para todos os workspaces.

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /repo

# ── deps: só os manifests, para o cache do Docker sobreviver a mudanças de código ──
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @anank/api...

# ── build: compila contracts (tipos) e a API para dist/ ──
FROM deps AS build
COPY packages/contracts packages/contracts
COPY apps/api apps/api
COPY tsconfig.base.json ./
RUN pnpm --filter @anank/contracts build && pnpm --filter @anank/api build

# ── prod-deps: node_modules sem devDependencies ──
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --prod --filter @anank/api...

# ── runner ──
FROM base AS runner
ENV NODE_ENV=production
COPY --from=prod-deps /repo/node_modules ./node_modules
COPY --from=prod-deps /repo/apps/api/node_modules ./apps/api/node_modules
# `packages/contracts` só tem devDependencies (typescript), então em --prod não
# ganha node_modules próprio — nada a copiar aqui, só o dist compilado.
COPY --from=build /repo/packages/contracts/dist ./packages/contracts/dist
COPY packages/contracts/package.json ./packages/contracts/
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/

USER node
WORKDIR /repo/apps/api
EXPOSE 3333
CMD ["node", "dist/server.js"]
