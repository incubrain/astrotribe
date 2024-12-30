FROM node:22.12.0-bookworm

WORKDIR /app

# First copy package files for dependency installation
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy source files (only what's needed)
COPY apps/admin ./apps/admin
COPY libs ./libs 
COPY layers ./layers

# Install dependencies
RUN npm install

ARG NX_CLOUD_ACCESS_TOKEN

# Set Nx environment variables
ENV NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    NX_DAEDOM=false \
    npm_config_build_from_source=true \
    npm_config_target_libc=glibc \
    NX_SKIP_NX_CLOUD=true

# Install nx and build
RUN npm install nx@20.3.0 -g
RUN nx reset
RUN nx build @astronera/admin

# Set working directory to output
WORKDIR /app/apps/admin/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]