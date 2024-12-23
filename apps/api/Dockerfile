# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy key files first
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/api/tsconfig.json ./
COPY apps/api/prisma ./prisma/

# Disable Nx Daemon, Nx Cloud, and Caching for more reliable builds
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Reset Nx cache and verify version
RUN npx nx reset
RUN npx nx --version

# Copy the rest of the application
COPY . .

# Build the application (using Nx)
RUN npx nx build api --verbose --skip-nx-cache

# Add debugging to see where files are
RUN ls -la /usr/src/app/apps/api/dist

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy necessary files from builder - updated paths based on nest build location
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/apps/api/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]