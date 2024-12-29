FROM node:20.17.0

WORKDIR /app

ARG NX_CLOUD_ACCESS_TOKEN

ENV NX_CLOUD_ACCESS_TOKEN=${NX_CLOUD_ACCESS_TOKEN} \
    NX_DAEDOM=false \
    npm_config_build_from_source=true \
    npm_config_target_libc=glibc \
    NX_SKIP_NX_CLOUD=true

# Install required build dependencies
RUN apk add --no-cache python3 make g++ gcc openssl

# Copy entire project
COPY . .

# Install root dependencies with platform specifics
RUN npm install

# Generate Prisma client for logger
RUN npx prisma generate

# Install nx and build
RUN npm install nx@latest -g
RUN nx reset
RUN nx build @astronera/api

RUN npm prune --production

# Set the working directory to the output
WORKDIR /app/apps/api/dist

# Expose port and start command
EXPOSE 3000
CMD ["node", "main.js"]