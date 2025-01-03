FROM node:18-slim

WORKDIR /app

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Copy CMS app and its dependencies
COPY apps/cms apps/cms
COPY libs/logger libs/logger  

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true
ENV NX_BATCH_MODE=true
ENV NX_SKIP_LOG_GROUPING=true
ENV NX_VERBOSE_LOGGING=true

# Install pnpm
RUN npm install -g pnpm

# Install dependencies for CMS workspace only
RUN pnpm install
RUN pnpm i @aws-sdk/client-s3 --workspace=@astronera/cms
RUN pnpm i typescript @types/node -D --workspace=@astronera/cms

# Create necessary directories and ensure proper file structure
RUN mkdir -p apps/cms/dist/src/providers/supabase
RUN cp -r apps/cms/src/providers apps/cms/dist/src/ || true

# THEN - copy source files
COPY . .

# Install dependencies for this workspace only
RUN pnpm install nx@20.3.0 -g
RUN nx reset
RUN nx build @astronera/cms --configuration=production --skip-nx-cache

# Update working directory to the CMS app
WORKDIR /app/apps/cms

EXPOSE 1337

CMD ["pnpm", "run", "start"]