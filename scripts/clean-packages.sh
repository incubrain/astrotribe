#!/bin/bash

# Function to confirm action
confirm() {
    read -r -p "${1:-Are you sure?} [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            true
            ;;
        *)
            false
            ;;
    esac
}

# Check if we're in the root of the monorepo
if [ ! -f "nx.json" ]; then
    echo "Error: This script must be run from the root of your nx monorepo."
    exit 1
fi

echo "This script will remove all package-lock.json files and node_modules directories in your monorepo."
if ! confirm "Do you want to continue?"; then
    echo "Operation cancelled."
    exit 0
fi

# Remove root package-lock.json and node_modules
echo "Removing root package-lock.json and node_modules..."
rm -f package-lock.json
rm -rf node_modules

# Find and remove package-lock.json and node_modules in all packages
echo "Removing package-lock.json and node_modules from all packages..."
find . -name "package-lock.json" -type f -delete
find . -name "node_modules" -type d -exec rm -rf {} +

echo "Cleanup complete!"

# Optional: Clear npm cache
if confirm "Do you also want to clear the npm cache?"; then
    npm cache clean --force
    echo "npm cache cleared."
fi

echo "You can now run 'npm install'"