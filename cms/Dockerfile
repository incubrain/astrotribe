# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory
WORKDIR /app

COPY cms/package*.json ./

RUN npm i
# Copy the rest of the application code
COPY cms ./

# Build the admin panel
RUN npm run build

# Expose port 1337
EXPOSE 1337

# Start the Strapi server
CMD ["npm", "run", "start"]
