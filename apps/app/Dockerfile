FROM node:20.17.0

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NODE_ENV=production \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    ROLLUP_SKIP_NODE_RESOLVE=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# First copy configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY .npmrc ./

# Copy only needed source files
COPY apps/app ./apps/app
COPY libs ./libs
COPY layers ./layers

# Install dependencies with platform specifics
RUN npm install --no-progress
RUN npm install --workspaces

# Install nx and build
RUN npm install nx@latest -g
RUN nx reset
RUN NODE_ENV=production nx build @astronera/app --configuration=production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]