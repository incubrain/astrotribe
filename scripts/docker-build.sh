#!/bin/bash

# Build the base image with a local reference
docker build --load -f Dockerfile.base -t local/astrotribe-base:latest --secret id=npm_token,src=.npm_token .

# Verify the image is built
docker images | grep local/astrotribe-base

# Build the services
DOCKER_BUILDKIT=0 docker compose build --no-cache