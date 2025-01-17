FROM node:22.12.0-bookworm

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NX_DAEMON=false \
    NX_SKIP_NX_CLOUD=true

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy only the necessary files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Copy the source files for the required workspaces
COPY apps/api ./apps/api
COPY libs ./libs
COPY tsconfig.* ./
COPY nx.json ./
COPY pnpm-workspace.yaml ./

# Install dependencies for specific workspaces
RUN pnpm install --filter @astronera/api

# Generate Prisma client for logger
RUN pnpx prisma generate

# Install nx and build
RUN pnpx nx reset
RUN pnpx nx build @astronera/api --skip-nx-cache

RUN pnpm prune --production

# Set the working directory to the output
WORKDIR /app/apps/api/dist

# Expose port and start command
EXPOSE 8080
CMD ["node", "main.js"]