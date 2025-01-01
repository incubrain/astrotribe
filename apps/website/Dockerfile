FROM node:22.12.0-bookworm

WORKDIR /app

# Declare build arguments first
ARG NUXT_PUBLIC_POSTHOG_URL
ARG NUXT_PUBLIC_POSTHOG_KEY
ARG NUXT_PUBLIC_LOG_LEVEL
ARG RAILWAY_DOCKERFILE_PATH
ARG NUXT_PUBLIC_AUTH_URL
ARG NUXT_PUBLIC_LOGIN_URL
ARG NUXT_PUBLIC_STRAPI_URL
ARG NUXT_STRAPI_URL
ARG NODE_ENV
ARG NUXT_PUBLIC_APP_URL
ARG NUXT_PUBLIC_SUPABASE_KEY
ARG NUXT_PUBLIC_SUPABASE_URL

# First copy package files for dependency installation
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy source files (only what's needed)
COPY apps/website ./apps/website
COPY apps/admin ./apps/admin
COPY libs ./libs
COPY layers ./layers

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true \
    NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true

# Now set the environment variables from build args
ENV NUXT_PUBLIC_POSTHOG_URL=${NUXT_PUBLIC_POSTHOG_URL} \
    NUXT_PUBLIC_POSTHOG_KEY=${NUXT_PUBLIC_POSTHOG_KEY} \
    NUXT_PUBLIC_LOG_LEVEL=${NUXT_PUBLIC_LOG_LEVEL} \
    RAILWAY_DOCKERFILE_PATH=${RAILWAY_DOCKERFILE_PATH} \
    NUXT_PUBLIC_AUTH_URL=${NUXT_PUBLIC_AUTH_URL} \
    NUXT_PUBLIC_LOGIN_URL=${NUXT_PUBLIC_LOGIN_URL} \
    NUXT_PUBLIC_STRAPI_URL=${NUXT_PUBLIC_STRAPI_URL} \
    NUXT_STRAPI_URL=${NUXT_STRAPI_URL} \
    NODE_ENV=${NODE_ENV} \
    NUXT_PUBLIC_APP_URL=${NUXT_PUBLIC_APP_URL} \
    NUXT_PUBLIC_SUPABASE_KEY=${NUXT_PUBLIC_SUPABASE_KEY} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}
    
# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install



# Install nx globally and run builds
RUN pnpm install nx@20.3.0 -g
RUN nx reset
RUN pnpx tsx apps/website/generate-routes.ts
RUN nx build @astronera/admin --configuration=production

# Setup production stage
WORKDIR /app/apps/website/.output

# Set and expose port
ENV PORT=8080
EXPOSE $PORT

# Start the application
CMD ["node", "server/index.mjs"]