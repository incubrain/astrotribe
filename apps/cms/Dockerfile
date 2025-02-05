# Use official Node.js image
FROM node:20-slim

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true

# Install PNPM package manager
RUN corepack prepare pnpm@8.7.6 --activate
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-*.yaml package.json .npmrc nx.json .nxignore tsconfig.json ./ 
COPY shared ./shared
COPY libs ./libs/
COPY apps/cms ./apps/cms

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies and build the Supabase provider first
RUN pnpm install
RUN pnpx nx build strapi-supabase --skip-nx-cache

# Build CMS
RUN pnpx nx build @astronera/cms --skip-nx-cache

# Set working directory to the CMS app (Strapi project directory)
WORKDIR /app/apps/cms

# Ensure necessary modules are installed
RUN pnpm install --prod

# Expose Strapi port
EXPOSE 1337

# Start Strapi inside its project directory
CMD ["pnpx", "strapi", "start"]
