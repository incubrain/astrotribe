# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory
WORKDIR /app

COPY package.json ./

RUN npm i
# Copy the rest of the application code
COPY . .

COPY ./scripts/seed.js ./scripts/

# Build the admin panel
RUN npm run build --debug

# Expose port 1337
EXPOSE 1337

# Start the Strapi server
CMD ["npm", "run", "start"]
