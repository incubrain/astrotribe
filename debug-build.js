import { execSync } from 'child_process'
import v8 from 'v8'

// Enable garbage collection exposure
v8.setFlagsFromString('--expose-gc')

function logMemoryUsage() {
  const used = process.memoryUsage()
  console.log('Memory usage:')
  for (let key in used) {
    console.log(`  ${key}: ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`)
  }
  console.log('Heap statistics:', v8.getHeapStatistics())
}

console.log('Starting debug build...')
logMemoryUsage()

try {
  execSync('npx nuxi build --verbose --inspect', { stdio: 'inherit' })
  console.log('Build completed successfully.')
} catch (error) {
  console.error('Build failed:', error)
  process.exit(1)
}

// Force garbage collection
logMemoryUsage()

if (global.gc) {
  global.gc()
  console.log('Garbage collection forced.')
}
