FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true

RUN corepack enable

WORKDIR /app

# Copy workspace configuration files
COPY pnpm-*.yaml package.json .npmrc nx.json .nxignore tsconfig.json ./
COPY shared ./shared
COPY libs ./libs/
COPY apps/cms ./apps/cms

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies for CMS workspace only
RUN pnpm install --filter @astronera/cms...

# THEN - copy source files
COPY . .

# Install dependencies for this workspace only
RUN pnpx nx reset
RUN pnpx nx build strapi-supabase --skip-nx-cache
RUN pnpx nx build @astronera/cms --skip-nx-cache

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