# Use Node.js 20.17.0 as the base image
FROM node:20.18.1

# Set the working directory in the container
WORKDIR /app

# Declare build-time arguments and set them as environment variables
ARG NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_URL=${NUXT_PUBLIC_SUPABASE_URL}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project, including configuration files
COPY . .

# List contents to verify files are copied correctly
RUN ls -la && ls -la apps/main-app

RUN npm install -g nx

RUN npx nx reset
RUN npx nx --version

# Build the main-app
RUN nx build main-app --verbose --skip-nx-cache

# Set the working directory to the main-app output
WORKDIR /app/apps/main-app/.output

# Command to run the application
CMD ["node", "server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000