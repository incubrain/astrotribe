#!/bin/bash

# Function to check if a process is running
is_running() {
    pgrep -f "$1" >/dev/null
}

# Start auth service
echo "Starting auth service..."
nx serve auth-service &

# Wait for auth service to be ready
while ! curl -s http://localhost:3009 >/dev/null; do
    sleep 1
done
echo "Auth service is up and running"

# Start main app
echo "Starting main app..."
nx serve main-app &

# Wait for both services to finish (for development)
wait
