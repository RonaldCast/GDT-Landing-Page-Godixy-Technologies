# syntax=docker/dockerfile:1

ARG NODE_IMAGE=node:22-alpine

# ---- deps: full dependency tree for the build ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- build: static client + standalone server handler ----
FROM ${NODE_IMAGE} AS build
WORKDIR /app
# SITE_URL is read by astro.config.mjs at build time (canonical and hreflang links).
ARG SITE_URL=https://godixy.com
ENV SITE_URL=${SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- prod-deps: runtime dependencies only ----
FROM ${NODE_IMAGE} AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# ---- runtime ----
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json package-lock.json server.mjs ./
COPY --from=build /app/dist ./dist

USER node
EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/health" || exit 1

CMD ["node", "server.mjs"]
