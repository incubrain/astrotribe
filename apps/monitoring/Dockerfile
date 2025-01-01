FROM node:22.12.0-bookworm

WORKDIR /app

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY shared-runtime.config.ts ./

# Copy monitoring app and its workspace dependencies
COPY apps/monitoring apps/monitoring
COPY libs libs 
COPY layers layers 
COPY layers/crud layers/crud 
COPY layers/auth layers/auth 
COPY theme ./theme

# Install pnpm
RUN npm install -g pnpm

# Install dependencies for monitoring workspace only
RUN pnpm install

# Install nx globally
ENV NX_DISABLE_DB=true
RUN pnpm install -g nx@20.3.0
RUN nx reset
RUN nx build @astronera/monitoring --no-cache --skip-nx-cache

WORKDIR /app/apps/monitoring/.output

CMD ["node", "server/index.mjs"]

EXPOSE 3000