#!/bin/bash

echo "Building Nuxt layers..."
scripts/build-layers.sh
if [ $? -ne 0 ]; then
    echo "Error building Nuxt layers"
    exit 1
fi
echo "Nuxt layers built successfully"

# Function to build a project
build_project() {
    echo "Building $1..."
    pnpm turbo run build --filter=$1
    if [ $? -ne 0 ]; then
        echo "Error building $1"
        exit 1
    fi
}

# Build @astronera/auth first
build_project @astronera/auth

# Build other projects in parallel
build_project @astronera/website &
build_project @astronera/admin &
build_project @astronera/app &
build_project @astronera/monitoring &

# Wait for all background processes to finish
wait

echo "All projects built successfully!"