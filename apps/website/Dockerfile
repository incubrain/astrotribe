FROM node:22-slim

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=8080
ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_SKIP_NX_CLOUD=true

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/* && \
    corepack enable

WORKDIR /app

# Copy only what we need
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .nxignore tsconfig.json nx.json ./
COPY apps/website ./apps/website
COPY layers ./layers
COPY libs ./libs
COPY shared ./shared

# Install dependencies
RUN --mount=type=cache,id=s/9baea51d-1b5c-467f-973c-df117b403a84-/pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build the application
RUN pnpx nx reset
RUN pnpx nx build @astronera/website --skip-nx-cache

WORKDIR /app/apps/website

CMD ["node", ".output/server/index.mjs"]