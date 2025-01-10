FROM node:22-slim

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=8080
ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_SKIP_NX_CLOUD=true
ENV NODE_PATH=/app/node_modules

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/* && \
    corepack enable

WORKDIR /app

# Copy all files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/website ./apps/website
COPY layers ./layers
COPY libs ./libs
COPY theme ./theme
COPY prisma ./prisma
COPY tsconfig.* ./
COPY nx.json ./
COPY shared ./shared
COPY tailwind.config.base.ts ./

RUN pnpx prisma generate

# Install only website dependencies and build
RUN --mount=type=cache,id=s/9baea51d-1b5c-467f-973c-df117b403a84-/pnpm-store,target=/pnpm/store \
    pnpm install --filter @astronera/website... --frozen-lockfile && \
    rm -rf layers/*/dist && \
    NODE_ENV=production pnpm exec nx build @astronera/website --verbose --skip-nx-cache

EXPOSE $PORT

WORKDIR /app/apps/website

CMD ["node", ".output/server/index.mjs"]