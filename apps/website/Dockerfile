FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

FROM base AS build
WORKDIR /app

# Declare build arguments
ARG NUXT_PUBLIC_POSTHOG_URL
ARG NUXT_PUBLIC_POSTHOG_KEY
ARG NUXT_PUBLIC_LOG_LEVEL
ARG RAILWAY_DOCKERFILE_PATH
ARG NUXT_PUBLIC_AUTH_URL
ARG NUXT_PUBLIC_LOGIN_URL
ARG NUXT_PUBLIC_STRAPI_URL
ARG NUXT_STRAPI_URL
ARG NODE_ENV
ARG NUXT_PUBLIC_APP_URL
ARG NUXT_PUBLIC_SUPABASE_KEY
ARG NUXT_PUBLIC_SUPABASE_URL
ARG NX_CLOUD_ACCESS_TOKEN

# Set build environment variables
ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NX_DAEMON=false \
    NX_SKIP_NX_CLOUD=true \
    NUXT_PUBLIC_POSTHOG_URL=${NUXT_PUBLIC_POSTHOG_URL} \
    NUXT_PUBLIC_POSTHOG_KEY=${NUXT_PUBLIC_POSTHOG_KEY} \
    NUXT_PUBLIC_LOG_LEVEL=${NUXT_PUBLIC_LOG_LEVEL} \
    RAILWAY_DOCKERFILE_PATH=${RAILWAY_DOCKERFILE_PATH} \
    NUXT_PUBLIC_AUTH_URL=${NUXT_PUBLIC_AUTH_URL} \
    NUXT_PUBLIC_LOGIN_URL=${NUXT_PUBLIC_LOGIN_URL} \
    NUXT_PUBLIC_STRAPI_URL=${NUXT_PUBLIC_STRAPI_URL} \
    NUXT_STRAPI_URL=${NUXT_STRAPI_URL} \
    NODE_ENV=${NODE_ENV} \
    NUXT_PUBLIC_APP_URL=${NUXT_PUBLIC_APP_URL} \
    NUXT_PUBLIC_SUPABASE_KEY=${NUXT_PUBLIC_SUPABASE_KEY} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Copy workspace config files first
COPY pnpm-*.yaml package.json ./
COPY apps/website/package.json ./apps/website/
COPY libs/logger/package.json ./libs/logger/
COPY layers/*/package.json ./layers/

# Install dependencies with cache mount
RUN --mount=type=cache,--mount=id=pnpm,--mount=target=/pnpm/store pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Generate Prisma client and build
RUN pnpm exec prisma Generate

# Initialize NX workspace first
RUN pnpm exec nx reset --all && \
    rm -rf .nx/cache && \
    pnpm exec nx-cloud start-local-cache

RUN NODE_ENV=production pnpm exec tsx apps/website/generate-routes.ts

RUN pnpm exec nx build @astronera/website --verbose

# Create production deployment
RUN pnpm deploy --filter @astronera/website --prod /prod/website

FROM base

WORKDIR /app

# Copy production files
COPY --from=build /prod/website /app

# Set runtime environment
ENV PORT=8080 \
    NODE_ENV=production

EXPOSE $PORT

CMD ["node", ".output/server/index.mjs"]