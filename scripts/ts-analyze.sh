#!/bin/bash
# analyze-ts.sh

echo "Analyzing TypeScript file resolution..."

# Run TypeScript with listFiles and time it
time pnpm tsc -p apps/website/tsconfig.diagnostic.json \
  --listFiles \
  --noEmit \
  --extendedDiagnostics \
  > ts-files.log 2>&1

# Analyze the results
echo "=== File Count by Directory ==="
grep "^/" ts-files.log | sed 's/\/.*/\//' | sort | uniq -c | sort -nr

echo "=== Node Modules Being Processed ==="
grep "node_modules" ts-files.log | sed 's/.*node_modules\///' | cut -d'/' -f1 | sort | uniq -c | sort -nr

echo "=== Type Definition Files ==="
grep "\.d\.ts$" ts-files.log | wc -l