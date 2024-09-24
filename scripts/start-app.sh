#!/bin/bash
# scripts/start-main-app.sh

echo "Starting main app..."
lerna run dev --scope=auth-service --scope=main-app --verbose
echo "Main app started."
