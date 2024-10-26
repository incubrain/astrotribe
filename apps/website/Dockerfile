# Define all environment variables in one place at the top
ARG ENVIRONMENT_VARIABLES="NUXT_PUBLIC_POSTHOG_URL \
    NUXT_PUBLIC_POSTHOG_KEY \
    NUXT_PUBLIC_LOG_LEVEL \
    RAILWAY_DOCKERFILE_PATH \
    NUXT_PUBLIC_AE_AUTH_URL \
    NUXT_PUBLIC_AE_LOGIN_URL \
    NUXT_PUBLIC_STRAPI_URL \
    NUXT_STRAPI_URL \
    NODE_ENV \
    NUXT_PUBLIC_AE_APP_URL \
    NUXT_PUBLIC_SUPABASE_KEY \
    NUXT_PUBLIC_SUPABASE_URL"


# Dynamically set environment variables

# Rest of your Dockerfile...

FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

ARG ENVIRONMENT_VARIABLES

# Dynamically set environment variables
SHELL ["/bin/sh", "-c"]
RUN for var in ${ENVIRONMENT_VARIABLES}; do \
        echo "ARG $var" >> env.args; \
        echo "ENV $var=\${$var}" >> env.args; \
    done; \
    cat env.args | while read line; do eval "$line"; done


# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install nx globally using the version from package.json
RUN NX_VERSION=$(node -p "require('./package.json').devDependencies.nx") && \
    npm install -g nx@$NX_VERSION

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Copy the entire project
COPY . .

RUN npx nx reset
RUN npx nx --version

# Build the website
RUN npx tsx apps/website/generate-routes.ts
RUN nx build website --verbose --skip-nx-cache

# Set the port (default to 8080 if not provided)
ENV PORT=8080

# Expose the port
EXPOSE $PORT

# Start the application
CMD ["node", "/app/apps/website/.output/server/index.mjs"]