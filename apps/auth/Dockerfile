FROM node:22.12.0-bookworm

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NX_DAEMON=false \
    NX_SKIP_NX_CLOUD=true

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth ./apps/auth
COPY libs ./libs
COPY layers ./layers
COPY theme ./theme
COPY tsconfig.json ./
COPY nx.json ./
COPY shared ./shared

# Install dependencies for required workspaces
RUN pnpm install --filter @astronera/auth...

# Build with nx
RUN pnpx nx reset
RUN pnpx nx build @astronera/auth --configuration=production --skip-nx-cache

RUN pnpm prune --production

# Set working directory to the output folder
WORKDIR /app/apps/auth/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]