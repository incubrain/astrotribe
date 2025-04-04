#!/bin/bash
# scripts/debug-build.sh

set -e

APP_NAME=$1
PORT=${2:-3456}
MAX_PAGES=${3:-50}
HEADLESS=${4:-true}


# Validate app name
if [ -z "$APP_NAME" ]; then
  echo "❌ Error: App name is required"
  echo "Usage: ./debug-build.sh <app-name> [port] [max-pages] [headless]"
  echo "Example: ./debug-build.sh website 3456 50 true"
  exit 1
fi

# Map app name to package and output directory
case "$APP_NAME" in
  "website")
    PACKAGE="@astronera/website"
    OUTPUT_PATH="apps/website/.output/public"
    ;;
  "app")
    PACKAGE="@astronera/app"
    OUTPUT_PATH="apps/app/.output/public"
    ;;
  "admin")
    PACKAGE="@astronera/admin"
    OUTPUT_PATH="apps/admin/.output/public"
    ;;
  *)
    echo "❌ Error: Unknown app \"$APP_NAME\". Supported apps: website, app, admin"
    exit 1
    ;;
esac

# Create timestamp-based output directory
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

echo "🔨 Building $APP_NAME..."
PORT=$PORT SITE_URL="http://localhost:$PORT" pnpm --filter $PACKAGE build

if [ ! -d "$OUTPUT_PATH" ]; then
  echo "❌ Error: Build output directory not found: $OUTPUT_PATH"
  exit 1
fi

echo "🚀 Starting server on port $PORT..."
npx serve -s "$OUTPUT_PATH" -p "$PORT" &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "🔍 Running debugger against $APP_NAME build..."
pnpm --filter @astronera/bugger start "http://localhost:$PORT" --max-pages "$MAX_PAGES" --headless "$HEADLESS"
DEBUGGER_EXIT_CODE=$?

# Clean up server
kill $SERVER_PID
echo "🧹 Server stopped"

if [ $DEBUGGER_EXIT_CODE -eq 0 ]; then
  echo "✅ Debugging complete! Results saved to bugger/results"
else
  echo "❌ Debugging failed with exit code $DEBUGGER_EXIT_CODE"
fi

exit $DEBUGGER_EXIT_CODE