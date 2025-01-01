FROM node:22.12.0-bookworm

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NX_DAEMON=false \
    NX_SKIP_NX_CLOUD=true

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin ./apps/admin
COPY libs/logger ./libs/logger
COPY layers ./layers
COPY prisma ./prisma
COPY tsconfig.* ./
COPY nx.json ./
COPY shared-runtime.config.ts ./

# Install dependencies for required workspaces
RUN pnpm install --filter @astronera/admin... \
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
RUN pnpx nuxi prepare -r apps/admin

# Generate Prisma client
RUN pnpx prisma generate

# Build with nx
RUN pnpx nx reset
RUN pnpx nx build @astronera/admin

RUN pnpm prune --production

# Set working directory to output
WORKDIR /app/apps/admin/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]