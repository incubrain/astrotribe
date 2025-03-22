#!/bin/bash

# Change to the root directory where the libs folder is located
cd "$(dirname "$(realpath "$0")")/.." || { echo "Failed to navigate to the root directory"; exit 1; }

# Check if libs directory exists
if [ ! -d "libs" ]; then
    echo "Error: libs directory not found in the current location."
    exit 1
fi

# Loop through each subdirectory in the libs folder
for lib in libs/*/; do
    # Remove trailing slash from lib path
    lib=${lib%/}
    
    # Extract the library name from the path
    lib_name=$(basename "$lib")
    
    echo "Building $lib_name..."
    
    # Check if it's an @ib library
    if [[ "$lib_name" == "logger" || "$lib_name" == "cache" || "$lib_name" == "core" || "$lib_name" == "testing" ]]; then
        project_name="@ib/$lib_name"
    else
        project_name="@astronera/$lib_name"
    fi
    
    # Run turbo build command for the current library
    pnpm turbo run build --filter=$project_name
    
    # Check if the build was successful
    if [ $? -eq 0 ]; then
        echo "Successfully built $project_name"
    else
        echo "Failed to build $project_name"
    fi
    
    echo "------------------------"
done

echo "All libraries have been processed."