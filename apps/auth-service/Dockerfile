# Use Node.js 20.17.0 as the base image
FROM node:20.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Display the contents of the current directory
RUN ls -la

# Display the contents of package-lock.json
RUN head -n 20 package-lock.json

# Try to install dependencies
RUN npm ci || (echo "npm ci failed, falling back to npm install" && npm install)

# Copy the entire project, including configuration files
COPY . .

# List contents to verify files are copied correctly
RUN ls -la && ls -la apps/auth-service

RUN npm install -g nx

RUN npx nx reset
RUN npx nx --version

# Build the auth-service
RUN nx build auth-service --verbose --skip-nx-cache

# Set the working directory to the auth-service output
WORKDIR /app/apps/auth-service/.output

# Command to run the application
CMD ["node", "server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000