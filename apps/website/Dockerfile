FROM node:20.19-bookworm

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=12288"

# Enable corepack for PNPM
RUN corepack enable && corepack prepare pnpm@8.7.6 --activate

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./
COPY apps/website ./apps/website
COPY libs ./libs
COPY layers ./layers
COPY theme ./theme
COPY shared ./shared
COPY content ./content

# Install all dependencies
RUN pnpm install --filter @astronera/website...

# Build with turbo (this will automatically build all dependencies)
RUN pnpm turbo run build --filter=@astronera/website

# Prune dependencies for production
WORKDIR /app
RUN pnpm prune --production

# Use the correct path to the entry point
WORKDIR /app/apps/website
CMD ["node", ".output/server/index.mjs"]