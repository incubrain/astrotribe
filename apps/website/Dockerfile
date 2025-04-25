FROM node:20.19-bookworm

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=12288"

ARG RAILWAY_DOCKERFILE_PATH
ARG NUXT_PUBLIC_POSTHOG_URL
ARG NUXT_PUBLIC_POSTHOG_KEY

ARG NUXT_PUBLIC_LOGIN_PATH
ARG NUXT_PUBLIC_REGISTER_PATH
ARG NUXT_PUBLIC_APP_URL
ARG NUXT_PUBLIC_API_URL
ARG NUXT_PUBLIC_AUTH_URL
ARG NUXT_PUBLIC_ADMIN_URL

ARG NUXT_PUBLIC_LOG_LEVEL
ARG NODE_ENV
ARG NUXT_PUBLIC_SUPABASE_KEY
ARG NUXT_PUBLIC_SUPABASE_URL

# Expose as environment variables in final image
ENV RAILWAY_DOCKERFILE_PATH=$RAILWAY_DOCKERFILE_PATH
ENV NUXT_PUBLIC_POSTHOG_URL=$NUXT_PUBLIC_POSTHOG_URL
ENV NUXT_PUBLIC_POSTHOG_KEY=$NUXT_PUBLIC_POSTHOG_KEY

ENV NUXT_PUBLIC_LOGIN_PATH=$NUXT_PUBLIC_LOGIN_PATH
ENV NUXT_PUBLIC_REGISTER_PATH=$NUXT_PUBLIC_REGISTER_PATH
ENV NUXT_PUBLIC_APP_URL=$NUXT_PUBLIC_APP_URL
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_AUTH_URL=$NUXT_PUBLIC_AUTH_URL
ENV NUXT_PUBLIC_ADMIN_URL=$NUXT_PUBLIC_ADMIN_URL

ENV NUXT_PUBLIC_LOG_LEVEL=$NUXT_PUBLIC_LOG_LEVEL
ENV NODE_ENV=$NODE_ENV
ENV NUXT_PUBLIC_SUPABASE_KEY=$NUXT_PUBLIC_SUPABASE_KEY
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL

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
WORKDIR /app/apps/website/.output

# Use the correct path to the entry point
CMD ["node", "server/index.mjs"]

# docker build \ 
#   --build-arg NUXT_PUBLIC_POSTHOG_URL=$NUXT_PUBLIC_POSTHOG_URL \ 
#   --build-arg NUXT_PUBLIC_POSTHOG_KEY=$NUXT_PUBLIC_POSTHOG_KEY \ 
#   --build-arg NUXT_PUBLIC_LOG_LEVEL=$NUXT_PUBLIC_LOG_LEVEL \ 
#   --build-arg RAILWAY_DOCKERFILE_PATH=$RAILWAY_DOCKERFILE_PATH \ 
#   --build-arg NODE_ENV=$NODE_ENV \ 
#   --build-arg NUXT_PUBLIC_LOGIN_PATH=$NUXT_PUBLIC_LOGIN_PATH \ 
#   --build-arg NUXT_PUBLIC_REGISTER_PATH=$NUXT_PUBLIC_REGISTER_PATH \ 
#   --build-arg NUXT_PUBLIC_APP_URL=$NUXT_PUBLIC_APP_URL \ 
#   --build-arg NUXT_PUBLIC_ADMIN_URL=$NUXT_PUBLIC_ADMIN_URL \ 
#   --build-arg NUXT_PUBLIC_AUTH_URL=$NUXT_PUBLIC_AUTH_URL \ 
#   --build-arg NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL \ 
#   --build-arg NUXT_PUBLIC_SUPABASE_KEY=$NUXT_PUBLIC_SUPABASE_KEY \ 
#   --build-arg NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL \ 
#   -t website \ 
#   -f apps/website/Dockerfile
