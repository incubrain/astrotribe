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

# Copy only the files needed for dependency installation
COPY pnpm-*.yaml ./
COPY package.json ./
COPY apps/website/package.json ./apps/website/
COPY layers/*/package.json ./layers/
COPY libs/*/package.json ./libs/
COPY shared/*/package.json ./shared/

# Install dependencies with pruning
RUN --mount=type=cache,id=s/9baea51d-1b5c-467f-973c-df117b403a84-/pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @astronera/website... --ignore-scripts

# Now copy the rest of the source code
COPY . .

# Build the application
RUN pnpx nx build @astronera/website --configuration=production --skip-nx-cache

WORKDIR /app/apps/website

CMD ["node", ".output/server/index.mjs"]