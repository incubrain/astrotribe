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
    
    # Run nx build command for the current library
    nx build "$lib_name"
    
    # Check if the build was successful
    if [ $? -eq 0 ]; then
        echo "Successfully built $lib_name"
    else
        echo "Failed to build $lib_name"
    fi
    
    echo "------------------------"
done

echo "All libraries have been processed."