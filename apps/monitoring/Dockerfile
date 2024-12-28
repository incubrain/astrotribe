FROM node:20.17.0

WORKDIR /app

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy monitoring app and its workspace dependencies
COPY apps/monitoring apps/monitoring
COPY libs libs 
COPY layers layers 
COPY layers/crud layers/crud 
COPY layers/auth layers/auth 

# Install dependencies for monitoring workspace only
RUN npm ci --workspace=@astronera/monitoring --include-workspace-root

# Install nx globally
ENV NX_DISABLE_DB=true
RUN npm install -g nx@20.3.0
RUN nx reset
RUN nx build @astronera/monitoring --no-cache --skip-nx-cache

WORKDIR /app/apps/monitoring/.output

CMD ["node", "server/index.mjs"]

EXPOSE 3000