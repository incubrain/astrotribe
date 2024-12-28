FROM node:20.17.0

WORKDIR /app

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy auth service and its dependencies
COPY apps/auth apps/auth
COPY libs/logger libs/logger
COPY layers layers

# Install dependencies for auth workspace only
RUN npm ci --workspace=@astronera/auth --include-workspace-root

# Install nx globally
RUN npm install -g nx

# Build auth service
RUN nx build @astronera/auth --verbose --skip-nx-cache

WORKDIR /app/apps/auth/.output

CMD ["node", "server/index.mjs"]
EXPOSE 3000