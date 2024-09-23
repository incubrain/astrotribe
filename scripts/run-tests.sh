#!/bin/bash
# scripts/test-all.sh

echo "Running tests for all packages..."
lerna run test
echo "All tests completed."
