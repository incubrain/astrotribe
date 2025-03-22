FROM node:20.19-bookworm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_NX_CLOUD=true
RUN corepack prepare pnpm@8.7.6 --activate

RUN npm install -g pnpm
WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Copy necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .nxignore tsconfig.json nx.json ./
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

# Build with nx
RUN pnpx nx reset
RUN pnpx nx build @astronera/admin --skip-nx-cache --verbose

RUN pnpm prune --production

# Set working directory to output
WORKDIR /app/apps/admin/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]