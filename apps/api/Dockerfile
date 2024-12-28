# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy API and its dependencies
COPY apps/api apps/api
COPY libs/logger libs/logger
COPY prisma prisma 

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Install dependencies for API workspace only
RUN npm ci --workspace=@astronera/api --include-workspace-root

# Generate Prisma client
RUN apk add --no-cache openssl
RUN npx prisma generate

# Build the application using SWC
RUN npx nx build @astronera/api --verbose --skip-nx-cache

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/libs/logger/dist ./node_modules/@ib/logger/dist

# Create a package.json that forces CommonJS
# RUN echo '{"type":"commonjs"}' > ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]