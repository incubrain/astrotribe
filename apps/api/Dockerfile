FROM node:22.12.0-bookworm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CLOUD=true
RUN corepack prepare pnpm@8.7.6 --activate

RUN npm install -g pnpm
WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
    

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Copy only the necessary files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .nxignore tsconfig.json nx.json nest-cli.json ./
COPY apps/api ./apps/api
COPY libs ./libs
COPY shared ./shared

# Install dependencies for specific workspaces
RUN pnpm install --filter @astronera/api...

# Generate Prisma client for logger
RUN pnpm prisma:gen

# Install nx and build
RUN pnpx nx reset
RUN pnpx nx build @astronera/api --skip-nx-cache

RUN pnpm prune --production

# Set the working directory to the output
WORKDIR /app/dist/apps/api/src

# Expose port and start command
EXPOSE 8080
CMD ["node", "main.js"]