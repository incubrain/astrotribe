# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app/cms

# Install PNPM globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml before running install (better caching)
COPY cms/package.json cms/pnpm-lock.yaml ./

# Install dependencies using PNPM
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files
COPY cms ./

# Build Strapi (if needed)
RUN pnpm build

# Expose the necessary port
EXPOSE 1337

# Start the Strapi application
CMD ["pnpm", "start"]
