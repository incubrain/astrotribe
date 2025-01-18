FROM node:22.12.0-bookworm

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
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
COPY apps/app ./apps/app
COPY libs ./libs
COPY layers ./layers
COPY theme ./theme
COPY tsconfig.* ./
COPY nx.json ./
COPY shared ./shared
COPY tailwind.config.base.ts ./

# Install dependencies for all required workspaces
RUN pnpm install --filter @astronera/app...

# Build with nx
RUN pnpx nx reset
RUN pnpx nx build @astronera/app --skip-nx-cache

RUN pnpm prune --production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]