FROM node:20.17.0

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NODE_ENV=production \
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
RUN npm install nx@latest -g
RUN nx reset
RUN nx build @astronera/app --configuration=production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]