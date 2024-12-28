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

# Install nx globally (if needed)
ENV NX_DISABLE_DB=true
RUN npm install nx@20.0.0 -g
RUN nx reset
RUN nx build @astronera/admin --configuration=production --no-cache --skip-nx-cache

# Keep the working directory at /app
WORKDIR /app

# Command to run the application
CMD ["node", "apps/admin/.output/server/index.mjs"]

EXPOSE 3000