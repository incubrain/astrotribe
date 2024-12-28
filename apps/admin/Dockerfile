FROM node:20.17.0

WORKDIR /app

# First copy package files for dependency installation
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --workspace=@astronera/admin --include-workspace-root

# Copy source files (only what's needed)
COPY apps/admin ./apps/admin
COPY libs ./libs 
COPY layers ./layers 

# Set Nx environment variables
ENV NX_SKIP_NX_CACHE=true \
    NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true

# Install nx and build
RUN npm install nx@20.0.0 -g
RUN nx reset
RUN nx build @astronera/admin --configuration=production

# Set working directory to output
WORKDIR /app/apps/admin/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]