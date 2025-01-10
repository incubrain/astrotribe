#!/bin/bash

echo "Running TypeScript diagnostics..."

# Create timestamp and directories
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="ts-diagnostic-results"
BUILD_DIR="apps/website/.build"  # Add build directory
mkdir -p $RESULTS_DIR
mkdir -p $BUILD_DIR

# Create trace directory
TRACE_DIR="$RESULTS_DIR/trace_$TIMESTAMP"
mkdir -p $TRACE_DIR

echo "Analyzing TypeScript configuration..."

# Run initial analysis with build directory
pnpm tsc --noEmit --extendedDiagnostics \
  --outDir $BUILD_DIR \
  > "$RESULTS_DIR/diagnostics_$TIMESTAMP.txt" 2>&1

# Run project reference analysis
pnpm tsc -b apps/website \
  --outDir $BUILD_DIR \
  --verbose > "$RESULTS_DIR/build_$TIMESTAMP.txt" 2>&1

# Run type checking with tracing
TS_PERF_PROFILE=1 pnpm tsc -p apps/website/tsconfig.diagnostic.json \
  --outDir $BUILD_DIR \
  --generateTrace "$TRACE_DIR" \
  --listFiles \
  --extendedDiagnostics \
  > "$RESULTS_DIR/trace_output_$TIMESTAMP.txt" 2>&1

echo "Results saved to:"
echo "- Build analysis: $RESULTS_DIR/build_$TIMESTAMP.txt"
echo "- Diagnostics: $RESULTS_DIR/diagnostics_$TIMESTAMP.txt"
echo "- Trace output: $RESULTS_DIR/trace_output_$TIMESTAMP.txt"