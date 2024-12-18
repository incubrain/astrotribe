# Install dependencies stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++ gcc
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Final image stage
FROM node:20-alpine AS final
WORKDIR /app
COPY --from=builder /usr/src/app/dist /app
EXPOSE 3000
CMD ["npm", "run", "start:prod"]