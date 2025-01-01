FROM node:22.12.0-bookworm

WORKDIR /app

# Declare build arguments first
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

# Set all environment variables
ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
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

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/website ./apps/website
COPY libs/logger ./libs/logger
COPY layers ./layers
COPY prisma ./prisma
COPY tsconfig.* ./
COPY nx.json ./
COPY shared-runtime.config.ts ./

# Install dependencies for required workspaces
RUN pnpm install --filter @astronera/website... \
    --filter @ib/logger \
    --filter @astronera/base-layer \
    --filter @astronera/supabase-layer \
    --filter @astronera/crud-layer \
    --filter @astronera/advert-layer \
    --filter @astronera/referral-layer

# Prepare all Nuxt layers
RUN pnpx nuxi prepare -r layers/base
RUN pnpx nuxi prepare -r layers/supabase
RUN pnpx nuxi prepare -r layers/crud
RUN pnpx nuxi prepare -r layers/advert
RUN pnpx nuxi prepare -r layers/referral
RUN pnpx nuxi prepare -r apps/website

# Generate Prisma client
RUN pnpx prisma generate

# Generate routes and build
RUN pnpx tsx apps/website/generate-routes.ts
RUN pnpx nx reset
RUN pnpx nx build @astronera/website

RUN pnpm prune --production

# Setup production stage
WORKDIR /app/apps/website/.output

# Set and expose port
ENV PORT=8080
EXPOSE $PORT

# Start the application
CMD ["node", "server/index.mjs"]