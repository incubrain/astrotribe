#!/bin/bash

echo "Starting admin dashboard..."
lerna run dev --scope=auth-service --scope=admin-dashboard --verbose
echo "Admin dashboard started."

