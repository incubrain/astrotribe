#!/bin/bash

echo "Building all packages in order..."

# Build base layer first
echo "Building base layer..."
npx lerna run build --scope=base-nuxt-layer

# Check if base layer build was successful
if [ $? -ne 0 ]; then
    echo "Base layer build failed. Exiting."
    exit 1
fi

# Build auth-service next
echo "Building auth-service..."
npx lerna run build --scope=auth-service

# Check if auth-service build was successful
if [ $? -ne 0 ]; then
    echo "Auth-service build failed. Exiting."
    exit 1
fi

# Build all remaining packages
echo "Building remaining packages..."
npx lerna run build --ignore=base-nuxt-layer --ignore=auth-service

echo "All packages built."