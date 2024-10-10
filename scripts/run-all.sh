#!/bin/bash

# Start auth-service
nx serve auth-service &

# Wait for auth-service to start (adjust sleep time as needed)
sleep 10

# Start other services
nx serve website &
nx serve admin-dashboard &
nx serve main-app &
nx serve monitoring-dashboard &

# Wait for all background processes to finish
wait