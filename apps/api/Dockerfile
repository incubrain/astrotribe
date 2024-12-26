# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy key files first
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/api/prisma ./prisma/
COPY scripts ./scripts/

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Make scripts executable (if they exist)
RUN if [ -d "scripts" ]; then chmod +x scripts/*.sh; fi

# Build the application using SWC
RUN npx nx build api --verbose --skip-nx-cache

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy necessary files
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Create a package.json that forces CommonJS
RUN echo '{"type":"commonjs"}' > ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]