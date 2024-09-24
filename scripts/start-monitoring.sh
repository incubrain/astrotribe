#!/bin/bash

echo "Starting monitoring dashboard..."
lerna run dev --scope=auth-service --scope=monitoring-dashboard --verbose
echo "Monitoring dashboard started."

