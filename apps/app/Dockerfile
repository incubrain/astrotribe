FROM node:20.17.0

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NX_CLOUD_DISTRIBUTED_EXECUTION
ARG NX_BRANCH
ARG NX_CI_EXECUTION_ID
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NX_CLOUD_DISTRIBUTED_EXECUTION=${NX_CLOUD_DISTRIBUTED_EXECUTION:-false} \
    NX_BRANCH=${NX_BRANCH:-main} \
    NX_CI_EXECUTION_ID=${NX_CI_EXECUTION_ID:-local} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# First copy configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy only needed source files
COPY apps/app ./apps/app
COPY libs ./libs
COPY layers ./layers

# Install dependencies
RUN npm ci --workspace=@astronera/app --include-workspace-root

# Install nx and build
RUN npm install nx@20.3.0 -g
RUN nx reset
RUN nx build @astronera/app --configuration=production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]