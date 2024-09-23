#!/bin/bash
# scripts/start-website.sh

echo "Starting website..."
lerna run dev --scope=website
echo "Website started."
