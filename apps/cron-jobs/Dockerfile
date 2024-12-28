FROM node:20.17.0-bookworm AS builder

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

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy only needed workspace packages
COPY apps/cron-jobs apps/cron-jobs
COPY libs/logger libs/logger
COPY layers layers 
COPY prisma prisma

# Set NX environment variables
ENV NODE_ENV=production \
    NX_DAEMON=false \
    NX_CLOUD=false \
    NX_CACHE_SKIP=true

# Install dependencies for cron-jobs workspace only
RUN npm ci --workspace=@astronera/cron-jobs --no-cache --include-workspace-root

# Install Playwright browsers
RUN npx playwright install chromium
RUN npx playwright install-deps

# Generate Prisma client
RUN npx prisma generate

# Build the project using NX
RUN npx nx build @astronera/cron-jobs --verbose

# Final stage
FROM node:20.17.0-bookworm

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
CMD ["node", "--experimental-specifier-resolution=node", "./dist/src/index.js"]