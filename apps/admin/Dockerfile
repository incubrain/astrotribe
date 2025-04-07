FROM node:20.19-bookworm

# Enable corepack for PNPM
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

WORKDIR /app

ARG NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Copy necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json tsconfig.json ./
COPY apps/admin ./apps/admin
COPY libs ./libs
COPY layers ./layers
COPY theme ./theme
COPY shared ./shared

# Install Playwright dependencies and browsers
RUN npx playwright install-deps && \
    npx playwright install chromium

# Install dependencies for required workspaces
RUN pnpm install --filter @astronera/admin...

# Build with turbo
RUN pnpm turbo run build --filter=@astronera/admin

RUN pnpm prune --production

# Set working directory to output
WORKDIR /app/apps/admin/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]