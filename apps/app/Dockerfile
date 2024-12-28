# Use Node.js 20.17.0 as the base image
FROM node:20.17.0

# Set the working directory in the container
WORKDIR /app

# Declare build-time arguments and set them as environment variables
ARG NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Copy root workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy only the app and its dependencies
COPY apps/app apps/app
COPY libs libs
COPY layers layers

# Install dependencies for this workspace only
RUN npm ci --workspace=@astronera/app --include-workspace-root

# Install nx globally (if needed)
RUN npm install -g nx

# Build the app
RUN npx nx build @astronera/app --verbose --skip-nx-cache

# Set the working directory to the /app output
WORKDIR /app/apps/app/.output

# Command to run the application
CMD ["node", "server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000