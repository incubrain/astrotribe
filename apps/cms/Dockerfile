FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true

RUN corepack prepare pnpm@8.7.6 --activate

RUN npm install -g pnpm
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-*.yaml package.json .npmrc nx.json .nxignore tsconfig.json ./
COPY shared ./shared
COPY libs ./libs/
COPY apps/cms ./apps/cms

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies and build strapi-supabase first
RUN pnpm install
RUN pnpx nx build strapi-supabase --skip-nx-cache

# Build CMS
RUN pnpx nx build @astronera/cms --skip-nx-cache

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