# syntax=docker/dockerfile:1.6

# Base image with pnpm enabled via corepack.
# Node 22 LTS — required by pnpm 11.x (>= v22.13).
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Full deps (used for build)
FROM base AS development-dependencies-env
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Prod-only deps (used in runtime image)
FROM base AS production-dependencies-env
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build the React Router app
FROM base AS build-env
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN pnpm run build

# Runtime image
FROM base
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server.js ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build
EXPOSE 3000
CMD ["pnpm", "run", "start"]