FROM node:18-alpine AS builder

WORKDIR /app

# Declare build-time arguments and set them as environment variables
ARG NUXT_PUBLIC_POSTHOG_URL
ENV NUXT_PUBLIC_POSTHOG_URL=${NUXT_PUBLIC_POSTHOG_URL}

ARG NUXT_PUBLIC_POSTHOG_KEY
ENV NUXT_PUBLIC_POSTHOG_KEY=${NUXT_PUBLIC_POSTHOG_KEY}

ARG NUXT_PUBLIC_LOG_LEVEL
ENV NUXT_PUBLIC_LOG_LEVEL=${NUXT_PUBLIC_LOG_LEVEL}

ARG RAILWAY_DOCKERFILE_PATH
ENV RAILWAY_DOCKERFILE_PATH=${RAILWAY_DOCKERFILE_PATH}

ARG NUXT_PUBLIC_AE_AUTH_URL
ENV NUXT_PUBLIC_AE_AUTH_URL=${NUXT_PUBLIC_AE_AUTH_URL}

ARG NUXT_PUBLIC_AE_LOGIN_URL
ENV NUXT_PUBLIC_AE_LOGIN_URL=${NUXT_PUBLIC_AE_LOGIN_URL}

ARG NUXT_PUBLIC_STRAPI_URL
ENV NUXT_PUBLIC_STRAPI_URL=${NUXT_PUBLIC_STRAPI_URL}

ARG NUXT_STRAPI_URL
ENV NUXT_STRAPI_URL=${NUXT_STRAPI_URL}

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG NUXT_PUBLIC_AE_APP_URL
ENV NUXT_PUBLIC_AE_APP_URL=${NUXT_PUBLIC_AE_APP_URL}

ARG NUXT_PUBLIC_SUPABASE_KEY
ENV NUXT_PUBLIC_SUPABASE_KEY=${NUXT_PUBLIC_SUPABASE_KEY}

ARG NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Copy the entire project (excluding node_modules via .dockerignore)
COPY package.json package-lock.json ./
COPY . .

# Install dependencies
RUN npm ci && \
npm install -g nx@latest

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Reset Nx cache and verify version
RUN npx nx reset
RUN npx nx --version

# Build the website
RUN npx tsx apps/website/generate-routes.ts
RUN npx nx build website --verbose --skip-nx-cache

# Set the port (default to 8080 if not provided)
ENV PORT=8080

# Expose the port
EXPOSE $PORT

# Start the application
CMD ["node", "/app/apps/website/.output/server/index.mjs"]