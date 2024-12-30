FROM node:20.17.0

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NX_DAEDOM=false \
    npm_config_build_from_source=true \
    npm_config_target_libc=glibc \
    NX_SKIP_NX_CLOUD=true

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Now copy source files
COPY . .

# Install root dependencies with platform specifics
RUN npm install

# Prepare all Nuxt layers first
RUN cd layers/base && npx nuxi prepare && cd ../..
RUN cd layers/supabase && npx nuxi prepare && cd ../..
RUN cd layers/advert && npx nuxi prepare && cd ../..
RUN cd layers/referral && npx nuxi prepare && cd ../..
RUN cd apps/app && npx nuxi prepare && cd ../..


# # Copy only needed source files
# COPY apps/app ./apps/app
# COPY libs ./libs
# COPY layers ./layers
# COPY prisma ./prisma

# Install workspace dependencies
# RUN npm install --workspaces

# Generate Prisma client for logger
RUN npx prisma generate

# Install nx and build
RUN npm install nx@latest -g
RUN nx reset
RUN nx build @astronera/app
    
RUN npm prune --production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]