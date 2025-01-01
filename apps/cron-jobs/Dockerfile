FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install system dependencies in base to be reused
RUN apt-get update && apt-get install -y \
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
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

# Copy workspace config files
COPY pnpm-*.yaml package.json ./
COPY apps/cron-jobs/package.json ./apps/cron-jobs/
COPY libs/logger/package.json ./libs/logger/

# Install dependencies with proper cache mounting
RUN --mount=type=cache,--mount=id=/pnpm/store,--mount=target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app

# Copy remaining source files
COPY . .

# Install Playwright
RUN pnpm install -g playwright

RUN pnpm exec playwright install chromium && \
    pnpm exec playwright install-deps

# Generate Prisma client
RUN pnpx prisma generate

# Build application
RUN pnpm exec nx reset && \
    NODE_ENV=production pnpx nx build @astronera/cron-jobs --configuration=production

# Create production deployment with only necessary files
RUN pnpm deploy --filter @astronera/cron-jobs --prod /prod/cron-jobs

FROM base AS runner
WORKDIR /app

# Install only Playwright in the final stage
RUN pnpm install -g playwright

# Copy production files and Playwright cache
COPY --from=builder /prod/cron-jobs ./
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

# Health check for Playwright
RUN pnpm exec playwright --version && \
    node -e "const { chromium } = require('playwright'); \
    async function test() { \
      const browser = await chromium.launch(); \
      await browser.close(); \
      console.log('Playwright health check passed'); \
    } \
    test().catch(err => { console.error('Playwright health check failed:', err); process.exit(1); });"

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright


CMD ["pnpm", "start"]