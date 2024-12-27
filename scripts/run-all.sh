#!/bin/bash

# Start @astronera/auth
nx serve @astronera/auth &

# Wait for @astronera/auth to start (adjust sleep time as needed)
sleep 10

# Start other services
nx serve @astronera/website &
nx serve @astronera/admin &
nx serve @astronera/app &
nx serve @astronera/monitoring &

# Wait for all background processes to finish
wait