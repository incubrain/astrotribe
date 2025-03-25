// Debug script to check runtime config loading in the Nuxt app context
console.log('Starting debug script...');

// Log the environment variables that should be loaded from .env
console.log('Environment variables:');
console.log('NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL);
console.log('NUXT_PUBLIC_SUPABASE_KEY:', process.env.NUXT_PUBLIC_SUPABASE_KEY);

// Log the import paths being used
console.log('\nImport paths:');
console.log('Runtime config path:', '../../shared/runtime.config');
console.log('Paths config path:', '../../shared/paths.config');

// Check if the files exist
const fs = require('fs');
const path = require('path');

const runtimeConfigPath = path.resolve(__dirname, '../../shared/runtime.config.ts');
const pathsConfigPath = path.resolve(__dirname, '../../shared/paths.config.ts');

console.log('\nFile existence check:');
console.log('Runtime config exists:', fs.existsSync(runtimeConfigPath));
console.log('Paths config exists:', fs.existsSync(pathsConfigPath));

// Log the resolved absolute paths
console.log('\nResolved absolute paths:');
console.log('Runtime config:', runtimeConfigPath);
console.log('Paths config:', pathsConfigPath);

// Try to read the file contents
console.log('\nFile contents:');
try {
  const runtimeConfigContent = fs.readFileSync(runtimeConfigPath, 'utf8');
  console.log('Runtime config content (first 200 chars):', runtimeConfigContent.substring(0, 200));
} catch (error) {
  console.error('Error reading runtime config:', error.message);
}

console.log('\nDebug script completed.');
