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

# Install dependencies for CMS workspace only
RUN npm ci --workspace=@astronera/cms --include-workspace-root
RUN npm i @aws-sdk/client-s3 --workspace=@astronera/cms
RUN npm i typescript @types/node -D --workspace=@astronera/cms

# Create necessary directories and ensure proper file structure
RUN mkdir -p apps/cms/dist/src/providers/supabase
RUN cp -r apps/cms/src/providers apps/cms/dist/src/ || true

# Copy scripts
COPY apps/cms/scripts/seed.js apps/cms/scripts/

# Build the admin panel
RUN nx build @astronera/cms --no-cache --skip-nx-cache

# Update working directory to the CMS app
WORKDIR /app/apps/cms

EXPOSE 1337

CMD ["npm", "run", "start"]