#!/bin/bash
# scripts/prepare.sh - Prepare dependencies for a project

set -e  # Exit on any error

# Default log level (0=error, 1=warn, 2=info, 3=debug)
LOG_LEVEL=2

# Colors for terminal output
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_error() { if [ $LOG_LEVEL -ge 0 ]; then echo -e "${RED}ERROR:${NC} $1"; fi; }
log_warn() { if [ $LOG_LEVEL -ge 1 ]; then echo -e "${YELLOW}WARN:${NC} $1"; fi; }
log_info() { if [ $LOG_LEVEL -ge 2 ]; then echo -e "${BLUE}INFO:${NC} $1"; fi; }
log_debug() { if [ $LOG_LEVEL -ge 3 ]; then echo -e "${GREEN}DEBUG:${NC} $1"; fi; }

# Usage information
usage() {
  echo "Usage: $0 <dependencies-list>"
  echo "  <dependencies-list>  Comma-separated list of package names to prepare (e.g. '@astronera/db,@astronera/base')"
  echo ""
  echo "Options:"
  echo "  --verbose    Enable verbose logging"
  echo "  --quiet      Reduce logging output"
  echo "  --help       Display this help message"
  exit 1
}

# Process command line arguments
DEPS=""
for arg in "$@"; do
  case $arg in
    --verbose)
      LOG_LEVEL=3
      shift
      ;;
    --quiet)
      LOG_LEVEL=1
      shift
      ;;
    --help)
      usage
      ;;
    *)
      # Assume this is the dependencies list
      if [ -z "$DEPS" ]; then
        DEPS=$arg
      else
        log_error "Too many arguments provided"
        usage
      fi
      shift
      ;;
  esac
done

if [ -z "$DEPS" ]; then
  log_error "No dependencies specified"
  usage
fi

# Split the dependencies string by comma
IFS=',' read -ra DEP_ARRAY <<< "$DEPS"

# Function to find the package directory based on package name
find_package_dir() {
  local package_name=$1
  # Remove quotes and @ symbol for matching
  local search_name=$(echo "$package_name" | sed 's/"//g' | sed 's/@//')
  
  log_debug "Searching for package: $package_name (search: $search_name)"
  
  # Search for package.json files that contain the package name
  local result=$(find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -exec grep -l "\"name\": \"$package_name\"" {} \; | head -n 1)
  
  if [ -z "$result" ]; then
    log_warn "Could not find package directory for $package_name"
    return 1
  fi
  
  # Get the directory containing the package.json
  local dir=$(dirname "$result")
  log_debug "Found package directory: $dir"
  
  echo "$dir"
  return 0
}

# Function to prepare a single dependency
prepare_dependency() {
  local package_name=$1
  local package_dir=$(find_package_dir "$package_name")
  
  if [ -z "$package_dir" ]; then
    log_error "Could not find package directory for $package_name"
    return 1
  fi
  
  log_info "Preparing dependency: $package_name in $package_dir"
  
  # Check if build script exists in package.json
  if grep -q '"build":' "$package_dir/package.json"; then
    log_info "Building $package_name..."
    (cd "$package_dir" && pnpm run build)
  else
    log_info "No build script found for $package_name, skipping build step"
  fi
  
  # Check if prepare script exists (and it's not the NX loop we're replacing)
  if grep -q '"prepare":' "$package_dir/package.json" && ! grep -q '"prepare": "pnpm nx prepare' "$package_dir/package.json"; then
    log_info "Running prepare script for $package_name..."
    (cd "$package_dir" && pnpm run prepare)
  else
    log_info "No valid prepare script found for $package_name, skipping prepare step"
  fi
  
  log_info "Successfully prepared $package_name"
  return 0
}

# Process all dependencies
log_info "Starting dependency preparation for ${#DEP_ARRAY[@]} packages"

# Track failures
FAILED_DEPS=()

# First, find all dependency directories to verify they exist
for dep in "${DEP_ARRAY[@]}"; do
  if ! find_package_dir "$dep" > /dev/null; then
    log_error "Package $dep not found in workspace"
    FAILED_DEPS+=("$dep")
  fi
done

if [ ${#FAILED_DEPS[@]} -gt 0 ]; then
  log_error "The following packages were not found in the workspace:"
  for failed in "${FAILED_DEPS[@]}"; do
    log_error "  - $failed"
  done
  exit 1
fi

# Reset failed deps for the actual preparation
FAILED_DEPS=()

# Now prepare each dependency
for dep in "${DEP_ARRAY[@]}"; do
  if ! prepare_dependency "$dep"; then
    log_error "Failed to prepare $dep"
    FAILED_DEPS+=("$dep")
  fi
done

# Report summary
if [ ${#FAILED_DEPS[@]} -gt 0 ]; then
  log_error "Failed to prepare ${#FAILED_DEPS[@]} dependencies:"
  for failed in "${FAILED_DEPS[@]}"; do
    log_error "  - $failed"
  done
  exit 1
else
  log_info "Successfully prepared all dependencies"
  exit 0
fi