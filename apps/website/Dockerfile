
# ----------------------------
    # Build Stage
    # ----------------------------
    FROM node:20.17.0 AS build

    # Set the working directory in the container
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package.json package-lock.json ./
    
    # Install dependencies
    RUN npm ci

    # Install nx globally using the version from package.json
    RUN NX_VERSION=$(node -p "require('./package.json').devDependencies.nx") && \
        npm install -g nx@$NX_VERSION

    # Disable Nx Daemon, Nx Cloud, and Caching
    ENV NX_DAEMON=false
    ENV NX_CLOUD=false
    ENV NX_CACHE_SKIP=true
    
    # Copy the entire project
    COPY . .

    
    RUN npx nx reset
    RUN npx nx --version
    
    # Accept build-time arguments (required for railway when using SSG)
    ARG NUXT_PUBLIC_AE_AUTH_URL
    ARG NUXT_PUBLIC_AE_LOGIN_URL
    ARG NUXT_PUBLIC_AE_APP_URL
    ARG NUXT_PUBLIC_AE_ADMIN_URL
    ARG NUXT_PUBLIC_AE_MONITORING_URL
    ARG NUXT_PUBLIC_AE_WEBSITE_URL
    ARG NUXT_PUBLIC_LOG_LEVEL
    ARG NUXT_PUBLIC_POSTHOG_KEY
    ARG NUXT_PUBLIC_POSTHOG_URL
    ARG NUXT_PUBLIC_STUDIO_TOKENS
    ARG NUXT_PUBLIC_SCRAPER_URL
    ARG NUXT_PUBLIC_STRAPI_URL
    ARG NUXT_STRAPI_URL
    ENV NODE_ENV=production

    RUN echo $NUXT_PUBLIC_POSTHOG_KEY

    # Build the website
    RUN nx build website --verbose --skip-nx-cache
    
    # ----------------------------
    # Production Stage
    # ----------------------------
    FROM nginx:alpine
    ENV PORT=8080
    
    # Remove default Nginx index page
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy the built files from the previous stage
    COPY --from=build /app/apps/website/.output/public/ /usr/share/nginx/html/
    
    COPY apps/website/nginx.conf /etc/nginx/nginx.conf
    COPY apps/website/default.conf.template /etc/nginx/templates/default.conf.template
    
    EXPOSE $PORT
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    