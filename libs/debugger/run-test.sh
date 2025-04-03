#!/bin/bash

# Run the comprehensive test for the Playwright MCP Debugger

# Create necessary directories
mkdir -p debug/output/snapshots debug/output/results debug/screenshots

# Set Node.js version to 20.x
export NODE_OPTIONS="--max-old-space-size=4096"

# Define MCP server URL - this will be used by the tests
export MCP_SERVER_URL="http://localhost:4444/api/call"

# Run the test directly - the MCP server will be started automatically if needed
echo "Running test..."
echo "MCP Server URL: $MCP_SERVER_URL"
tsx debug/debugger.ts mcp-direct

echo "✅ Test completed!"
echo "Results are available in debug/output/results"
echo "Logs are available in debug/output/bugfixing.md"
echo "Snapshots are available in debug/output/snapshots"
echo "Screenshots are available in debug/screenshots"
