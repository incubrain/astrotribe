#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -d "scripts" ]; then
    echo -e "${RED}Error: Must be run from project root${NC}"
    exit 1
fi

# Ensure bundler directories exist
mkdir -p "scripts/bundler/ai-context"
mkdir -p "scripts/bundler/repomix-configs"

# Run the CLI
npx tsx scripts/bundler/bundler-cli.ts "$@"