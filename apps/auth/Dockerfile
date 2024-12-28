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

# Install nx globally (if needed)
ENV NX_DISABLE_DB=true
RUN npm install nx@20.0.0 -g
RUN nx reset
RUN nx build @astronera/auth --configuration=production --no-cache --skip-nx-cache

WORKDIR /app/apps/auth/.output

CMD ["node", "server/index.mjs"]
EXPOSE 3000