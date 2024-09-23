#!/bin/bash
# scripts/start-auth-service.sh

echo "Starting auth service..."
lerna run dev --scope=auth-service
echo "Auth service started.