FROM node:22.12.0-bookworm AS builder

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NX_DAEMON=false \
    NX_SKIP_NX_CLOUD=true

# Install essential system dependencies for Playwright
RUN apt-get update && apt-get install -y \
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

# Install pnpm
RUN npm install -g pnpm

# Copy only the necessary files first
COPY pnpm-*.yaml package.json ./
COPY apps/cron-jobs/package.json ./apps/cron-jobs/
COPY libs/logger/package.json ./libs/logger/

# Copy the source files for the required workspaces
COPY tsconfig.* ./
COPY nx.json ./
COPY apps/cron-jobs ./apps/cron-jobs
COPY libs/logger ./libs/logger
COPY prisma ./prisma
COPY layers ./layers

# Install dependencies for specific workspaces
RUN pnpm install --filter @astronera/cron-jobs --filter @ib/logger

RUN pnpx playwright install chromium && \
    pnpx playwright install-deps && \
    pnpx prisma generate && \
    pnpx nx build @astronera/cron-jobs --configuration=production && \
    pnpm prune --production

# Final stage
FROM node:22.12.0-bookworm

WORKDIR /app

# Install runtime dependencies for Playwright
RUN apt-get update && apt-get install -y \
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

# Copy only the necessary built files
COPY --from=builder /app/apps/cron-jobs/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

RUN pnpx playwright --version

RUN echo "Verifying Playwright installation in final image:" && \
    ls -la /root/.cache/ms-playwright && \
    node -e "const { chromium } = require('playwright'); \
    async function test() { \
      console.log('Testing browser launch...'); \
      const browser = await chromium.launch(); \
      console.log('Browser launched successfully'); \
      await browser.close(); \
      console.log('Browser closed successfully'); \
    } \
    test().catch(console.error);"

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

CMD ["node", "./dist/src/index.js"]