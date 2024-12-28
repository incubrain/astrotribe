# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ gcc openssl

# Copy configuration files first
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --workspace=@astronera/api --include-workspace-root

# Copy only needed source files
COPY apps/api ./apps/api
COPY libs ./libs
COPY layers ./layers

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true \
    NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true

# Generate Prisma client and build
RUN npx prisma generate
RUN npm install nx@20.0.0 -g
RUN nx reset
RUN nx build @astronera/api --configuration=production

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/libs/logger/dist ./node_modules/@ib/logger/dist

EXPOSE 3000
CMD ["node", "dist/main"]