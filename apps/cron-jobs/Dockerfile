FROM node:22.12.0-bookworm AS builder

WORKDIR /app

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

# First copy configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma

# Copy workspace files needed for build
COPY apps/cron-jobs ./apps/cron-jobs
COPY libs/logger ./libs/logger
COPY layers ./layers

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true \
    NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true

# Install dependencies
RUN pnpm install

# Install Playwright browsers and deps
RUN pnpx playwright install chromium
RUN pnpx playwright install-deps

# Generate Prisma client
RUN pnpx prisma generate

# Install nx globally and build
RUN pnpm install nx@20.3.0 -g
RUN nx reset
RUN nx build @astronera/cron-jobs --configuration=production

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
COPY --from=builder /app/package*.json ./
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright
COPY --from=builder /app/libs/logger/dist ./node_modules/@ib/logger/dist

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

# Run with ESM support
CMD ["node", "./dist/src/index.js"]