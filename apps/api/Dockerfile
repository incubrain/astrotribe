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
RUN npx nx build api --verbose --skip-nx-cache

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy necessary files
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/apps/api/prisma ./prisma

# Copy assets
COPY --from=builder /usr/src/app/apps/api/src/**/*.json ./dist/
COPY --from=builder /usr/src/app/apps/api/src/**/*.yml ./dist/

# Create a new package.json without type: module
RUN node -e "const pkg = JSON.parse(require('fs').readFileSync('./package.json')); \
    delete pkg.type; \
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"

# Rename main.js to main.cjs for explicit CommonJS
RUN mv dist/main.js dist/main.cjs && \
    find dist -type f -name "*.js" -exec sh -c 'mv "$0" "${0%.js}.cjs"' {} \; && \
    find dist -type f -name "*.cjs" -exec sed -i 's/require([^)]*\.js/&.replace(".js", ".cjs")/g' {} \;

EXPOSE 3000

# Run with explicit CommonJS entry point
CMD ["node", "dist/main.cjs"]