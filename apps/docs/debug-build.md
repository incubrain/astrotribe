# Building and Testing Inside Docker

This document explains how to build and test your Nx monorepo applications inside Docker containers
to closely replicate the production environment. By doing so, you can catch Docker-specific issues
early and ensure that your application behaves consistently across development and production
environments.

## Overview

Building your application inside Docker during development offers several benefits:

- **Consistency:** Ensures the development environment matches the production environment.
- **Early Issue Detection:** Identifies Docker-specific build and runtime issues before deployment.
- **Streamlined Workflow:** Automates the build process with logging for easier debugging.

## Prerequisites

- **Docker Installed:** Make sure Docker is installed and running on your development machine.
- **Nx Monorepo Setup:** Your projects are managed within an Nx monorepo structure.
- **Project-Specific Dockerfile:** Each project has its own `Dockerfile` located at
  `apps/{project-name}/Dockerfile`.

## How to Use

### Build the Docker Image

We have a custom build script that automates the Docker image creation process for your application.
To build your application inside a Docker container, run the following command:

```bash
npm run build:docker -- --project your-project-name
```

**Example:**

```bash
npm run build:docker -- --project website
```

This command will:

- Use the Dockerfile located at `apps/website/Dockerfile`.
- Set the build context to the monorepo root directory.
- Build a Docker image named `website-image`.
- Log the build process and errors to the `debug` directory.

### Run the Docker Image

After building the Docker image, you can run it to test your application:

```bash
docker run -p 3000:3000 website-image
```

Access your application at [http://localhost:3000](http://localhost:3000).

### Understand the Build Script

The build script performs the following steps:

1. **Sets the Build Context:** The build context is set to the monorepo root to include all
   necessary files and dependencies.
2. **Specifies the Dockerfile Path:** Points to the project-specific Dockerfile.
3. **Builds the Docker Image:** Executes the `docker build` command with appropriate arguments.
4. **Logs Output:** Captures standard output and error logs for debugging purposes.

### Logs and Debugging

- **Error Logs:** If the build fails, errors are logged to
  `debug/{project}-docker-build-errors.log`.
- **Full Build Logs:** The entire build output is logged to `debug/{project}-docker-full-build.log`.

## Dockerfile Structure

Your project's `Dockerfile` should be structured to work with the monorepo setup. Below is an
example Dockerfile located at `apps/{project-name}/Dockerfile`:

```dockerfile
# Use an argument to specify the project name
ARG PROJECT_NAME

# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the monorepo root
COPY package*.json ./

# Copy monorepo configuration files (if needed)
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy the project files and shared libraries
COPY apps/$PROJECT_NAME ./apps/$PROJECT_NAME
COPY libs ./libs

# Build the specific Nx project
RUN npx nx build $PROJECT_NAME

# Expose the port (adjust according to your app's configuration)
EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/$PROJECT_NAME/main.js"]
```

### Notes:

- **Build Argument:** `ARG PROJECT_NAME` allows passing the project name during the build process.
- **Working Directory:** The working directory is set to `/app`, matching where the files are
  copied.
- **Dependencies:** `npm install` is run in the context of the monorepo root, installing all
  dependencies.
- **Build Command:** `npx nx build $PROJECT_NAME` builds the specified project.

## Optimize Build Context with .dockerignore

To prevent unnecessary files from being sent to the Docker daemon and to speed up the build process,
create a `.dockerignore` file in the monorepo root:

```dockerignore
# Exclude node_modules and build output directories
node_modules
dist
build
tmp
coverage

# Exclude Git files
.git
.gitignore

# Exclude environment and local configuration files
.env
.env.local

# Exclude logs and temporary files
npm-debug.log
yarn-error.log
*.swp
```

## Benefits of This Approach

- **Environment Parity:** Ensures your development environment mirrors production.
- **Early Detection of Issues:** Identifies problems that may only surface in a Dockerized
  environment.
- **Automated Logging:** Simplifies troubleshooting with comprehensive logs.

## Best Practices

- **Consistent Node.js Versions:** Use the same Node.js version in your Dockerfile as in your local
  development environment.
- **Update Dependencies:** Regularly update your `package.json` and lock files to keep dependencies
  current.
- **Optimize Docker Images:** Use multi-stage builds to keep your Docker images lean and efficient.

## Troubleshooting

### Build Failures

- **Check Logs:** Review the error and full build logs in the `debug` directory.
- **Verify Paths:** Ensure that all paths in your `Dockerfile` are correct and that files exist in
  the specified locations.
- **Dependency Issues:** Make sure all dependencies are correctly specified in your `package.json`.

### Missing Files

- **Build Context:** Confirm that the build context includes all necessary files. Since we're using
  the monorepo root as the build context, all files should be available.
- **Dockerfile COPY Commands:** Double-check the `COPY` commands in your Dockerfile to ensure
  they're copying the correct files.

## Additional Tips

- **Testing Changes:** After making changes to your application or Dockerfile, rebuild the Docker
  image to test the updates.
- **Cleaning Up:** Periodically clean up unused Docker images and containers to free up system
  resources.

## Conclusion

Building your application inside Docker during development helps maintain consistency and catch
potential issues early. By following this guide, you can ensure that your development and production
environments are closely aligned, leading to more reliable deployments.

---

Feel free to reach out to the development team if you have any questions or need further assistance
with this process.
