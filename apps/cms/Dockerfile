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

# Copy all workspace packages needed for strapi-supabase
COPY shared ./shared
COPY libs ./libs/
COPY packages/strapi-supabase ./packages/strapi-supabase
COPY apps/cms ./apps/cms

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies for CMS workspace only
RUN pnpm install --filter @astronera/cms...

# Build strapi-supabase package first
RUN cd packages/strapi-supabase && pnpm build

# Build CMS
RUN cd apps/cms && pnpm build

# Update working directory to the CMS app
WORKDIR /app/apps/cms

# Create a startup script that uses proper Strapi v5 migration commands
RUN echo '#!/bin/bash\n\
echo "Running database migrations..."\n\
NODE_ENV=production pnpm strapi database:migrate || true\n\
NODE_ENV=production pnpm strapi start\n\
' > ./start.sh

RUN chmod +x ./start.sh

EXPOSE 1337

CMD ["./start.sh"]