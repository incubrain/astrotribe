#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warnings
print_warning() {
    echo -e "${YELLOW}! $1${NC}"
}

# Function to check package manager
check_package_manager() {
    if [ -f "package.json" ]; then
        PACKAGE_MANAGER=$(node -p "require('./package.json').packageManager || ''")
        if [[ $PACKAGE_MANAGER == *"pnpm"* ]]; then
            echo "pnpm"
        elif [[ $PACKAGE_MANAGER == *"yarn"* ]]; then
            echo "yarn"
        else
            echo "npm"
        fi
    else
        echo "npm"
    fi
}

# Function to clean node_modules
clean_node_modules() {
    print_section "Cleaning node_modules"
    
    # Remove root node_modules
    rm -rf node_modules
    print_success "Removed root node_modules"
    
    # Clean libs directory node_modules
    if [ -d "libs" ]; then
        cd libs
        # First remove top-level node_modules in each lib
        rm -rf */node_modules
        # Then find and remove any nested node_modules
        find . -name "node_modules" -type d -exec rm -rf {} +
        cd ..
        print_success "Cleaned all node_modules in libs directory"
    fi
}

# Function to clean lock files
clean_lock_files() {
    print_section "Cleaning lock files"
    
    local pkg_manager=$(check_package_manager)
    print_warning "Detected package manager: $pkg_manager"
    
    # Remove all types of lock files to ensure clean slate
    rm -rf pnpm-lock.yaml yarn.lock package-lock.json
    find . -name "pnpm-lock.yaml" -type f -delete
    find . -name "yarn.lock" -type f -delete
    find . -name "package-lock.json" -type f -delete
    print_success "Removed all lock files"
}

# List of build artifact directories to clean
BUILD_ARTIFACTS=(dist .output .nuxt .turbo .data)

# Function to clean build artifacts
clean_build_artifacts() {
    print_section "Cleaning build artifacts"

    for dir in "${BUILD_ARTIFACTS[@]}"; do
        find . -type d -name "$dir" -exec rm -rf {} + 2>/dev/null
        print_success "Removed all '$dir' directories"
    done
}

# Function to clean cache
clean_cache() {
    print_section "Cleaning cache"
    local pkg_manager=$(check_package_manager)
    
    # Remove common cache directories
    rm -rf .cache .temp
    
    # Clean package manager cache based on detected package manager
    case $pkg_manager in
        "pnpm")
            print_warning "Using pnpm commands for cache cleaning"
            pnpm store prune
            ;;
        "yarn")
            print_warning "Using yarn commands for cache cleaning"
            yarn cache clean
            ;;
        "npm")
            print_warning "Using npm commands for cache cleaning"
            npm cache clean --force
            ;;
    esac
    
    print_success "Cleaned all caches"
}

# Function to reinstall dependencies
reinstall_dependencies() {
    print_section "Reinstalling dependencies"
    local pkg_manager=$(check_package_manager)
    
    case $pkg_manager in
        "pnpm")
            print_warning "Using pnpm to reinstall dependencies"
            pnpm install
            ;;
        "yarn")
            print_warning "Using yarn to reinstall dependencies"
            yarn install
            ;;
        "npm")
            print_warning "Using npm to reinstall dependencies"
            npm install
            ;;
    esac
    
    print_success "Dependencies reinstalled"
}

# Main cleanup function
main() {
    echo -e "${BLUE}Starting deep cleanup of the project...${NC}"
    
    clean_node_modules
    clean_lock_files
    clean_build_artifacts
    clean_cache
    
    # Ask if user wants to reinstall dependencies
    read -p "Do you want to reinstall dependencies? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        reinstall_dependencies
    fi
    
    echo -e "\n${GREEN}✨ Cleanup completed successfully!${NC}"
}

# Run the script
main