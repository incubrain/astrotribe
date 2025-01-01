FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install Playwright system dependencies
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

FROM base AS build
WORKDIR /app

# Copy workspace config files
COPY pnpm-*.yaml package.json ./
COPY apps/cron-jobs/package.json ./apps/cron-jobs/
COPY libs/logger/package.json ./libs/logger/

# Install all dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install -g playwright && \
    pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build application
RUN pnpm exec playwright install chromium && \
    pnpm exec playwright install-deps && \
    pnpx prisma generate

RUN pnpm exec nx reset
RUN pnpx nx build @astronera/cron-jobs --configuration=production

# Create production deployment
RUN pnpm deploy --filter @astronera/cron-jobs --prod /prod/cron-jobs

FROM base

WORKDIR /app

RUN pnpm install -g playwright

# Copy production files
COPY --from=build /prod/cron-jobs ./
COPY --from=build /root/.cache/ms-playwright /root/.cache/ms-playwright

# Verify Playwright installation
RUN pnpm exec playwright --version && \
    node -e "const { chromium } = require('playwright'); \
    async function test() { \
      console.log('Testing browser launch...'); \
      const browser = await chromium.launch(); \
      console.log('Browser launched successfully'); \
      await browser.close(); \
      console.log('Browser closed successfully'); \
    } \
    test().catch(err => { console.error(err); process.exit(1); });"

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

CMD ["pnpm", "start"]