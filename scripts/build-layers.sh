#!/bin/bash

# Navigate to the root directory of your project
# Adjust this path if the script is not in the root directory
cd "$("../" "$0")"

# Check if the layers directory exists
if [ ! -d "layers" ]; then
    echo "Error: 'layers' directory not found"
    exit 1
fi

# Loop through each subdirectory in the layers directory
for layer in layers/*/; do
    if [ -d "$layer" ]; then
        echo "Building layer: $layer"
        (
            cd "$layer"
            pnpx nuxi build
        )
        if [ $? -eq 0 ]; then
            echo "Successfully built layer: $layer"
        else
            echo "Error building layer: $layer"
        fi
        echo "------------------------"
    fi
done

echo "All layers have been processed"