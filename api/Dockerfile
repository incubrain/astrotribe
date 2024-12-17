# Use Node.js v20 as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install Python and build dependencies
# These are needed for some npm packages that require building from source
RUN apk add --no-cache python3 make g++ gcc

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"] 