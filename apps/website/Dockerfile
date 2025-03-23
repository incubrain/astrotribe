FROM node:20.19-bookworm

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=12288"

# Enable corepack for PNPM
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files for better layer caching
COPY . .

# Install all dependencies
RUN pnpm install --filter @astronera/website...

# Build with turbo (this will automatically build all dependencies)
RUN pnpm turbo run build --filter=@astronera/website

# Prune dependencies for production
WORKDIR /app/apps/website

# Use the correct path to the entry point
CMD ["node", ".output/server/index.mjs"]