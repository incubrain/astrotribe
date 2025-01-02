FROM node:22.12.0-bookworm

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
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
COPY apps/auth ./apps/auth
COPY libs/logger ./libs/logger
COPY layers ./layers
COPY prisma ./prisma
COPY theme ./theme
COPY tsconfig.* ./
COPY nx.json ./
COPY shared-runtime.config.ts ./
COPY tailwind.config.base.ts ./

# Install dependencies for required workspaces
RUN pnpm install --filter @astronera/auth... \
    --filter @ib/logger \
    --filter @astronera/base \
    --filter @astronera/supabase \
    --filter @astronera/crud \
    --filter @astronera/referral

# Prepare all Nuxt layers
RUN pnpx nuxi prepare -r layers/base
RUN pnpx nuxi prepare -r layers/supabase
RUN pnpx nuxi prepare -r layers/crud
RUN pnpx nuxi prepare -r layers/referral
RUN pnpx nuxi prepare -r apps/auth

# Generate Prisma client
RUN pnpx prisma generate

# Build with nx
RUN pnpx nx reset
RUN pnpx nx build @astronera/auth --configuration=production --offline

RUN pnpm prune --production

# Set working directory to the output folder
WORKDIR /app/apps/auth/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]