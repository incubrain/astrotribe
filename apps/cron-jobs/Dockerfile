FROM node:22-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true
RUN corepack enable

WORKDIR /app

# Enable pnpm and install system dependencies
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .nxignore tsconfig.json nx.json ./
COPY apps/cron-jobs/package.json ./apps/cron-jobs/
COPY libs/logger/package.json ./libs/logger/

# Install dependencies and Playwright
RUN --mount=type=cache,id=s/3c9904ae-05e1-4a46-a525-fca654d7d374-/pnpm/store,target=/pnpm/store \
    pnpm install --frozen-lockfile && \
    pnpm install -g playwright && \
    pnpm exec playwright install chromium && \
    pnpm exec playwright install-deps

# Copy source files and build
COPY . .
RUN pnpm prisma:gen && \
    rm -rf layers/*/dist && \
    pnpm exec nx reset && \
    pnpm exec nx build @astronera/cron-jobs --configuration=production --skip-nx-cache --verbose

WORKDIR /app/apps/cron-jobs

CMD ["node", "dist/src/index.js"]