#!/bin/bash

# Store the current directory
ORIGINAL_DIR=$(pwd)

# Function to cleanup a directory
cleanup_dir() {
    local dir=$1
    echo "Cleaning up $dir"
    cd "$dir" || return
    npx nuxi cleanup
    cd "$ORIGINAL_DIR" || exit
}

# Cleanup layers
if [ -d "layers" ]; then
    for layer in layers/*/; do
        if [ -d "$layer" ]; then
            cleanup_dir "$layer"
        fi
    done
else
    echo "layers directory not found"
fi

# Cleanup apps
if [ -d "apps" ]; then
    for app in apps/*/; do
        if [ -d "$app" ]; then
            cleanup_dir "$app"
        fi
    done
else
    echo "apps directory not found"
fi

echo "Cleanup complete!"