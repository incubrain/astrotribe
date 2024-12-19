# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy package files first
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema and generate
COPY prisma ./prisma/
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Build the application
RUN npm run build

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]