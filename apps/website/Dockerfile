FROM node:22.14.0-bookworm

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=8080
ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_SKIP_NX_CLOUD=true
RUN corepack prepare pnpm@8.7.6 --activate

RUN npm install -g pnpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only what we need
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .nxignore tsconfig.json nx.json ./
COPY apps/website ./apps/website
COPY layers ./layers
COPY theme ./theme
COPY libs ./libs
COPY shared ./shared

# Install dependencies
RUN pnpm install --filter @astronera/website...

# Build the application
RUN pnpx nx reset
RUN pnpx nx build @astronera/website --skip-nx-cache --verbose

RUN pnpm prune --production

WORKDIR /app/apps/website

CMD ["node", ".output/server/index.mjs"]