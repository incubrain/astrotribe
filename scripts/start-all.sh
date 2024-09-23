#!/bin/bash
# scripts/start-all.sh

echo "Starting all services..."
lerna run --parallel dev
echo "All services started."

