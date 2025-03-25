// Debug script to check runtime config loading in the Nuxt app context (ESM version)
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

console.log('Starting debug script...');

// Log the environment variables that should be loaded from .env
console.log('Environment variables:');
console.log('NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL);
console.log('NUXT_PUBLIC_SUPABASE_KEY:', process.env.NUXT_PUBLIC_SUPABASE_KEY);

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log the import paths being used
console.log('\nImport paths:');
console.log('Runtime config path:', '../../shared/runtime.config');
console.log('Paths config path:', '../../shared/paths.config');

// Check if the files exist
const runtimeConfigPath = resolve(__dirname, '../../shared/runtime.config.ts');
const pathsConfigPath = resolve(__dirname, '../../shared/paths.config.ts');

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

// Check for .env file in the app directory and root directory
const appEnvPath = resolve(__dirname, '.env');
const rootEnvPath = resolve(__dirname, '../../.env');

console.log('\nEnvironment file check:');
console.log('App .env exists:', fs.existsSync(appEnvPath));
console.log('Root .env exists:', fs.existsSync(rootEnvPath));

console.log('\nDebug script completed.');
