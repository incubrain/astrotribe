FROM node:20.19-bookworm

# Enable corepack for PNPM
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

WORKDIR /app

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Copy only the necessary files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json tsconfig.json nest-cli.json ./
COPY apps/api ./apps/api
COPY libs ./libs
COPY shared ./shared

# Install dependencies for specific workspaces
RUN pnpm install --filter @astronera/api...

# Generate Prisma client
RUN pnpm prisma:gen

# Build with turbo
RUN pnpm turbo run build --filter=@astronera/api

RUN pnpm prune --production

# Set the working directory to the output
WORKDIR /app/dist/apps/api/src

# Expose port and start command
EXPOSE 8080
CMD ["node", "main.js"]