# Use Node.js 20.17.0 as the base image
FROM node:20.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the monorepo root
# Use two separate COPY commands to ensure both files are copied
COPY ../../package.json ./
COPY ../../package-lock.json ./

# Debugging: List contents of the current directory
RUN ls -la

# Update npm to the exact version used in local development
RUN npm install -g npm@10.8.2

# Install dependencies
RUN npm ci

# Copy the entire monorepo into the container
COPY ../.. .

# Debugging: List contents after copying the entire monorepo
RUN ls -la

# Build the website
RUN npx nx build website

# Set the working directory to the website's output
WORKDIR /app/apps/website

# Command to run the application
CMD ["node", ".output/server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000