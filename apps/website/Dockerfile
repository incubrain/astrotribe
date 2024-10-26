FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Build-time arguments
ARG ENV_VARS

# Parse and set all build arguments as environment variables
RUN echo "$ENV_VARS" | tr ';' '\n' > build_env.sh && \
    cat build_env.sh && \
    source build_env.sh && \
    export $(cut -d= -f1 build_env.sh)

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install nx globally using the version from package.json
RUN NX_VERSION=$(node -p "require('./package.json').devDependencies.nx") && \
    npm install -g nx@$NX_VERSION

# Disable Nx Daemon, Nx Cloud, and Caching
ENV NX_DAEMON=false
ENV NX_CLOUD=false
ENV NX_CACHE_SKIP=true

# Copy the entire project
COPY . .

RUN npx nx reset
RUN npx nx --version

# Build the website
RUN npx tsx apps/website/generate-routes.ts
RUN nx build website --verbose --skip-nx-cache

# Set the port (default to 8080 if not provided)
ENV PORT=8080

# Expose the port
EXPOSE $PORT


# Start the application
CMD ["node", "/app/apps/website/.output/server/index.mjs"]