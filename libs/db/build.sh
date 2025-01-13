#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf dist generated

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p dist/generated

# Ensure dependencies are installed
echo "📦 Ensuring dependencies are installed..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Generate Prisma client
echo "🔨 Generating Prisma client..."
pnpx prisma generate --schema=./src/prisma/schema.prisma

# Build TypeScript using local dependency
echo "📦 Building TypeScript..."
node_modules/.bin/tsc -p tsconfig.json

# Copy generated Prisma client to dist
echo "📋 Copying generated Prisma client..."
if [ -d "src/generated" ]; then
    cp -r src/generated dist/
    echo "✅ Successfully copied generated Prisma client"
else
    echo "❌ Error: Generated Prisma client not found in src/generated"
    exit 1
fi

# Copy schema and other necessary files
echo "📋 Copying Prisma schema and related files..."
mkdir -p dist/prisma
cp src/prisma/schema.prisma dist/prisma/
cp src/prisma/update-prisma.ts dist/prisma/

# Verify build
echo "🔍 Verifying build..."
if [ ! -d "dist" ] || [ ! -d "dist/generated" ]; then
    echo "❌ Build verification failed!"
    exit 1
fi

echo "✨ Build completed successfully!"