FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
RUN corepack enable

WORKDIR /app

# Copy workspace configuration files
COPY pnpm-*.yaml package.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Copy CMS app and its dependencies
COPY apps/cms apps/cms

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true
ENV NX_VERBOSE_LOGGING=true

# Install pnpm
RUN npm install -g pnpm

# Install dependencies for CMS workspace only
RUN pnpm install --filter=@astronera/cms --frozen-lockfile

# Create necessary directories and ensure proper file structure
RUN mkdir -p apps/cms/dist/src/providers/supabase
RUN cp -r apps/cms/src/providers apps/cms/dist/src/ || true

# THEN - copy source files
COPY . .

# Install dependencies for this workspace only
RUN pnpm install nx@20.3.0 -g -w
RUN nx reset
RUN nx build @astronera/cms --configuration=production --skip-nx-cache

# Update working directory to the CMS app
WORKDIR /app/apps/cms

# Create a startup script to handle migrations
RUN echo '#!/bin/bash\n\
echo "Forcing database migrations..."\n\
NODE_ENV=production ./node_modules/.bin/strapi database:delete-soft-migrations || true\n\
NODE_ENV=production ./node_modules/.bin/strapi database:migrate-force || true\n\
NODE_ENV=production ./node_modules/.bin/strapi start\n\
' > ./start.sh

RUN chmod +x ./start.sh

EXPOSE 1337

# Use the startup script instead of direct start
CMD ["./start.sh"]