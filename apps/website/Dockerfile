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
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json tsconfig.json ./
COPY apps/website ./apps/website
COPY libs ./libs
COPY layers ./layers
COPY theme ./theme
COPY shared ./shared

# Install all dependencies
RUN pnpm install --filter @astronera/website...

# Build with turbo (this will automatically build all dependencies)
RUN pnpm turbo run build --filter=@astronera/website

# Prune dependencies for production
WORKDIR /app/apps/website

# Use the correct path to the entry point
CMD ["node", ".output/server/index.mjs"]

# docker build \   --build-arg NUXT_PUBLIC_POSTHOG_URL=$NUXT_PUBLIC_POSTHOG_URL \   --build-arg NUXT_PUBLIC_POSTHOG_KEY=$NUXT_PUBLIC_POSTHOG_KEY \   --build-arg NUXT_PUBLIC_LOG_LEVEL=$NUXT_PUBLIC_LOG_LEVEL \   --build-arg RAILWAY_DOCKERFILE_PATH=$RAILWAY_DOCKERFILE_PATH \   --build-arg NUXT_PUBLIC_LOGIN_URL=$NUXT_PUBLIC_LOGIN_URL \   --build-arg NUXT_PUBLIC_STRAPI_URL=$NUXT_PUBLIC_STRAPI_URL \   --build-arg NUXT_STRAPI_URL=$NUXT_STRAPI_URL \   --build-arg NODE_ENV=$NODE_ENV \   --build-arg NUXT_PUBLIC_APP_URL=$NUXT_PUBLIC_APP_URL \   --build-arg NUXT_PUBLIC_SUPABASE_KEY=$NUXT_PUBLIC_SUPABASE_KEY \   --build-arg NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL \   -t website \   -f apps/website/Dockerfile