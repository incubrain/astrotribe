# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy key files first
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/cron-jobs/tsconfig.json ./apps/cron-jobs/
COPY apps/cron-jobs/prisma ./prisma/
COPY scripts ./scripts/

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application using SWC
RUN npx nx build cron-jobs --verbose --skip-nx-cache

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy necessary files
COPY --from=builder /usr/src/app/apps/cron-jobs/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]