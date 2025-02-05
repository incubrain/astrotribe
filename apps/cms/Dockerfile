# Use Node.js 20 slim as the base image
FROM node:20-slim

# Environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true

# Install pnpm package manager
RUN corepack prepare pnpm@8.7.6 --activate
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-*.yaml package.json .npmrc nx.json .nxignore tsconfig.json ./
COPY shared ./shared
COPY libs ./libs/
COPY apps/cms ./apps/cms

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies
RUN pnpm install

# Ensure strapi-supabase is installed
RUN pnpm list strapi-supabase || pnpm add strapi-supabase

# Build strapi-supabase first
RUN pnpx nx build strapi-supabase --skip-nx-cache

# Build CMS
RUN pnpx nx build @astronera/cms --skip-nx-cache

# Update working directory to the CMS app
WORKDIR /app/apps/cms

# Create a startup script that uses proper Strapi v5 migration commands
RUN echo '#!/bin/bash\n\
echo "Running database migrations..."\n\
NODE_ENV=production pnpm strapi migrations:run || true\n\
NODE_ENV=production pnpm strapi start\n\
' > ./start.sh

# Make the script executable
RUN chmod +x ./start.sh

# Expose Strapi's default port
EXPOSE 1337

# Run the startup script when the container starts
CMD ["./start.sh"]
