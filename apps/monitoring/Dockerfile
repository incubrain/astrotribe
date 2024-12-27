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
RUN ls -la && ls -la apps/monitoring

RUN npm install -g nx

RUN npx nx reset
RUN npx nx --version
# Build the @astronera/monitoring
RUN nx build @astronera/monitoring --verbose --skip-nx-cache

# Set the working directory to the monitoring output
WORKDIR /app/apps/monitoring/.output

# Command to run the application
CMD ["node", "server/index.mjs"]

# Expose the port the app runs on
EXPOSE 3000