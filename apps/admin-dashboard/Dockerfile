# Use Node.js 20.17.0 as the base image
FROM node:20.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project, including configuration files
COPY . .

# List contents to verify files are copied correctly
RUN ls -la && ls -la apps/admin-dashboard

RUN npm install -g nx

# Build the admin-dashboard
RUN nx build admin-dashboard --verbose

# Set the working directory to the admin-dashboard output
WORKDIR /app/apps/admin-dashboard/.output

# Command to run the application
CMD ["node", "server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000