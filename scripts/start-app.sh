#!/bin/bash
# scripts/start-main-app.sh

echo "Starting main app..."
lerna run dev --scope=auth-service,main-app
echo "Main app started."
