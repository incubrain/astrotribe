# ----------------------------
# Build Stage
# ----------------------------
    FROM node:20.17.0 AS build

    # Set the working directory in the container
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install dependencies
    RUN npm ci
    
    # Install nx globally using the version from package.json
    RUN NX_VERSION=$(node -p "require('./package.json').devDependencies.nx") && \
        npm install -g nx@$NX_VERSION
    
    # Copy the entire project
    COPY . .
    
    # Build the website
    RUN nx build website --verbose
    
    # ----------------------------
    # Production Stage
    # ----------------------------
    FROM nginx:alpine
    
    # Remove default Nginx index page
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy the built files from the previous stage
    COPY --from=build /app/apps/website/.output/public/ /usr/share/nginx/html/
    
    # Expose port 80 (the default port for Nginx)
    EXPOSE 80
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    