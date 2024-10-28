# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Declare build-time args
ARG SUPABASE_STORAGE_URL
ENV SUPABASE_STORAGE_URL=${SUPABASE_STORAGE_URL}

# Install dependencies
RUN npm i
RUN npm i @aws-sdk/client-s3
RUN npm i typescript @types/node -D

# Copy the rest of the application code
COPY . .

# Create necessary directories and ensure proper file structure
RUN mkdir -p dist/src/providers/supabase
RUN cp -r src/providers dist/src/ || true

COPY ./scripts/seed.js ./scripts/

# Build the admin panel
RUN npm run build --debug

# Expose port 1337
EXPOSE 1337

# Start the Strapi server
CMD ["npm", "run", "start"]
