FROM node:20.17.0

WORKDIR /app

# Copy workspace configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy admin app and its workspace dependencies
COPY apps/admin apps/admin
COPY libs libs        
COPY layers layers        

# Install dependencies for admin workspace only
RUN npm ci --workspace=@astronera/admin --include-workspace-root

# Install nx globally
RUN npm install -g nx

# Build admin dashboard
RUN nx build @astronera/admin --verbose --skip-nx-cache

# Keep the working directory at /app
WORKDIR /app

# Command to run the application
CMD ["node", "apps/admin/.output/server/index.mjs"]

EXPOSE 3000