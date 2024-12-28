FROM node:20.17.0

WORKDIR /app

# First copy configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --workspace=@astronera/app --include-workspace-root

# Copy only needed source files
COPY apps/app ./apps/app
COPY libs ./libs
COPY layers ./layers

# Set environment variables
ENV NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    NX_SKIP_NX_CACHE=true \
    NX_BATCH_MODE=true \
    NX_SKIP_LOG_GROUPING=true \
    NX_VERBOSE_LOGGING=true

# Install nx and build
RUN npm install nx@20.0.0 -g
RUN nx reset
RUN nx build @astronera/app --configuration=production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]