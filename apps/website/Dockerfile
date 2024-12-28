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

ARG NUXT_PUBLIC_AUTH_URL
ENV NUXT_PUBLIC_AUTH_URL=${NUXT_PUBLIC_AUTH_URL}

ARG NUXT_PUBLIC_LOGIN_URL
ENV NUXT_PUBLIC_LOGIN_URL=${NUXT_PUBLIC_LOGIN_URL}

ARG NUXT_PUBLIC_STRAPI_URL
ENV NUXT_PUBLIC_STRAPI_URL=${NUXT_PUBLIC_STRAPI_URL}

ARG NUXT_STRAPI_URL
ENV NUXT_STRAPI_URL=${NUXT_STRAPI_URL}

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG NUXT_PUBLIC_APP_URL
ENV NUXT_PUBLIC_APP_URL=${NUXT_PUBLIC_APP_URL}

ARG NUXT_PUBLIC_SUPABASE_KEY
ENV NUXT_PUBLIC_SUPABASE_KEY=${NUXT_PUBLIC_SUPABASE_KEY}

ARG NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Copy the entire project (excluding node_modules via .dockerignore)
# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy auth service and its dependencies
COPY apps/website apps/website
COPY libs libs 
COPY layers layers

# Install dependencies for website workspace only
RUN npm ci --workspace=@astronera/website --include-workspace-root

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Build auth service
ENV NX_DISABLE_DB=true
RUN npm install nx@20.0.0 -g
RUN nx reset
RUN npx tsx apps/website/generate-routes.ts
RUN nx build @astronera/website --configuration=production --no-cache --skip-nx-cache

WORKDIR /app/apps/website/.output

# Set the port (default to 8080 if not provided)
ENV PORT=8080

# Expose the port
EXPOSE $PORT

CMD ["node", "server/index.mjs"]