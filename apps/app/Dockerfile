FROM node:20.17.0

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NODE_ENV=production \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    ROLLUP_SKIP_NODE_RESOLVE=true \
    npm_config_build_from_source=true \
    npm_config_target_libc=glibc


# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# First copy configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY .npmrc ./

# Pre-install specific platform dependencies
RUN npm install -g @rollup/rollup-linux-x64-gnu --no-save

# Install root dependencies with platform specifics
RUN npm install --no-progress --platform=linux --arch=x64 --libc=glibc

# Copy only needed source files
COPY apps/app ./apps/app
COPY libs ./libs
COPY layers ./layers

# Install workspace dependencies
RUN npm install --workspaces

# Now copy source files
COPY . .

# Install nx and build
RUN npm install nx@latest -g
RUN nx reset
RUN NODE_ENV=production nx build @astronera/app --configuration=production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]