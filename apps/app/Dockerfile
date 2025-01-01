FROM node:22.12.0-bookworm

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN
ARG NUXT_PUBLIC_SUPABASE_URL

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL} \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NX_DAEDOM=false \
    NX_SKIP_NX_CLOUD=true

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    rm -rf /var/lib/apt/lists/*

# Now copy source files
COPY . .

# Install root dependencies with platform specifics
RUN pnpm install

# Prepare all Nuxt layers first
RUN cd layers/base && pnpx nuxi prepare && cd ../..
RUN cd layers/supabase && pnpx nuxi prepare && cd ../..
RUN cd layers/advert && pnpx nuxi prepare && cd ../..
RUN cd layers/referral && pnpx nuxi prepare && cd ../..
RUN cd apps/app && pnpx nuxi prepare && cd ../..


# # Copy only needed source files
# COPY apps/app ./apps/app
# COPY libs ./libs
# COPY layers ./layers
# COPY prisma ./prisma

# Install workspace dependencies
# RUN pnpm install --workspaces

# Generate Prisma client for logger
RUN pnpx prisma generate

# Install nx and build
RUN pnpm install nx@latest -g
RUN nx reset
RUN nx build @astronera/app
    
RUN pnpm prune --production

# Set the working directory to the output
WORKDIR /app/apps/app/.output

# Expose port and start command
EXPOSE 3000
CMD ["node", "server/index.mjs"]