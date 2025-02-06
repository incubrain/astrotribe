FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true

# Activate PNPM
RUN corepack prepare pnpm@8.7.6 --activate
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration files
COPY pnpm-*.yaml package.json .npmrc nx.json .nxignore tsconfig.json ./

# Copy shared libraries
COPY shared ./shared
COPY libs ./libs/
COPY apps/cms ./apps/cms

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies for CMS workspace only
RUN pnpm install --filter @astronera/cms

# Explicitly install `strapi-supabase`
RUN pnpm install --filter @astronera/strapi-supabase

# Copy source files
COPY . .

# Build the Strapi provider & CMS
RUN pnpx nx reset
RUN pnpx nx build @astronera/strapi-supabase --skip-nx-cache
RUN pnpx nx build @astronera/cms --skip-nx-cache

# Update working directory to the CMS app
WORKDIR /app/apps/cms

# Ensure Strapi CLI is installed
RUN pnpm install @strapi/strapi

# Create a startup script
RUN echo '#!/bin/bash\n\
NODE_ENV=production pnpm strapi start\n\
' > ./start.sh

RUN chmod +x ./start.sh

EXPOSE 1337

# Use the startup script
CMD ["./start.sh"]
