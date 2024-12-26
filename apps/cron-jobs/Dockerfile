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

# Copy package files
COPY package*.json ./
COPY scripts ./scripts/
COPY apps/cron-jobs/prisma ./prisma/

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install chromium
RUN npx playwright install-deps

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production \
    NX_DAEMON=false \
    NX_CLOUD=false \
    NX_CACHE_SKIP=true

# Generate Prisma client
WORKDIR /app/apps/cron-jobs
RUN npx prisma generate
RUN npm install -g typescript
RUN tsc -p tsconfig.json

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

# Copy necessary files
COPY --from=builder /app/apps/cron-jobs/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

# Install tsx globally in the final stage
COPY --from=builder /app/apps/cron-jobs/dist ./dist

# No need for tsx since we're running compiled JS
CMD ["node", "dist/index.js"]