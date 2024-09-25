#!/bin/bash

# Function to build a project
build_project() {
    echo "Building $1..."
    nx build $1
    if [ $? -ne 0 ]; then
        echo "Error building $1"
        exit 1
    fi
}

# Build auth-service first
build_project auth-service

# Build other projects in parallel
build_project website &
build_project admin-dashboard &
build_project main-app &
build_project monitoring-dashboard &

# Wait for all background processes to finish
wait

echo "All projects built successfully!"