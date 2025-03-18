FROM node:20.19-bookworm

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=8080
ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_SKIP_NX_CLOUD=true
# Add Node memory limit - this is the key change to address your out of memory error
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN corepack prepare pnpm@8.7.6 --activate

# No need to install pnpm globally if you're using corepack
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

# Install dependencies with better caching
RUN pnpm install --filter @astronera/website...

# Build the application with increased memory limit
RUN pnpx nx reset
RUN NODE_OPTIONS="--max-old-space-size=8192" pnpx nx build @astronera/website --skip-nx-cache --verbose

# Prune dependencies for production
RUN pnpm prune --production

WORKDIR /app/apps/website

CMD ["node", ".output/server/index.mjs"]