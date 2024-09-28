# Use an official Node runtime as a parent image
FROM node:20.17.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json from the monorepo root
COPY ../../package*.json ./

RUN npm install -g npm@10.8.2

# Install dependencies
RUN npm ci

# Copy the entire monorepo into the container
# This is necessary because of hoisted dependencies and potential shared modules
COPY ../.. .

# Build the website
RUN npx nx build website

# Set the working directory to the website's output
WORKDIR /app/apps/website

# Command to run the application
CMD ["node", ".output/server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000