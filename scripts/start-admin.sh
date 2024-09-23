#!/bin/bash

echo "Starting admin dashboard..."
lerna run dev --scope=auth-service,admin-dashboard
echo "Admin dashboard started."

