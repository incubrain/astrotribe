FROM local/astrotribe-base:latest

WORKDIR /app

# Copy service-specific files
COPY . .

# Install additional public dependencies if needed
RUN npm install

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
