#!/bin/bash

# scripts/package-ai-context.sh

# Create output directory if it doesn't exist
mkdir -p ai-context

# Option 1: Run sequentially (safer, easier to debug)
run_sequential() {
    echo "🚀 Packaging Admin Dashboard..."
    npm run ai:admin
    
    echo "🚀 Packaging Auth Service..."
    npm run ai:auth
    
    echo "🚀 Packaging Main App..."
    npm run ai:main
    
    echo "🚀 Packaging Website..."
    npm run ai:website
    
    echo "🚀 Packaging CMS..."
    npm run ai:cms
    
    echo "🚀 Packaging Monitoring Dashboard..."
    npm run ai:monitoring
    
    echo "✨ All applications packaged successfully!"
}

# Option 2: Run in parallel (faster, but harder to debug)
run_parallel() {
    echo "🚀 Packaging all applications..."
    
    npm run ai:admin & \
    npm run ai:auth & \
    npm run ai:main & \
    npm run ai:website & \
    npm run ai:cms & \
    npm run ai:monitoring & \
    wait
    
    echo "✨ All applications packaged successfully!"
}

# Default to sequential execution unless --parallel flag is passed
if [ "$1" == "--parallel" ]; then
    run_parallel
else
    run_sequential
fi