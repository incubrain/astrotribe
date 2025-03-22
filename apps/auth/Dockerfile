FROM node:20.19-bookworm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CLOUD=true
RUN corepack enable

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN}
    

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Copy necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .nxignore tsconfig.json nx.json ./
COPY apps/auth ./apps/auth
COPY libs ./libs
COPY layers ./layers
COPY theme ./theme
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