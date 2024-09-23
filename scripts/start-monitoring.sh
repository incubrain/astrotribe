#!/bin/bash

echo "Starting monitoring dashboard..."
lerna run dev --scope=auth-service,monitoring-dashboard
echo "Monitoring dashboard started."

