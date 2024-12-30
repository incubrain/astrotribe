FROM node:22.12.0-bookworm

WORKDIR /app

# First copy package files for dependency installation
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# THEN copy source files
COPY apps/auth ./apps/auth
COPY libs ./libs
COPY layers ./layers

# Install dependencies
RUN npm install

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true \
    NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true

# Install nx globally and build
RUN npm install nx@20.3.0 -g
RUN nx reset
RUN nx build @astronera/auth --configuration=production

# Set working directory to the output folder
WORKDIR /app/apps/auth/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]