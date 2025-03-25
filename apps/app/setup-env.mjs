// Script to copy environment variables from root .env to app's process.env
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import { config } from 'dotenv';
import { execSync } from 'child_process';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to .env files
const rootEnvPath = resolve(__dirname, '../../.env');

console.log('Setting up environment variables...');

// Check if root .env exists
if (fs.existsSync(rootEnvPath)) {
  console.log('Root .env file found.');
  
  // Load environment variables from root .env
  const result = config({ path: rootEnvPath });
  
  if (result.error) {
    console.error('Error loading environment variables:', result.error);
    process.exit(1);
  }
  
  console.log('Environment variables loaded successfully.');
  
  // Check if key variables are now defined
  console.log('NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL);
  console.log('NUXT_PUBLIC_SUPABASE_KEY:', process.env.NUXT_PUBLIC_SUPABASE_KEY);
  
  // Create a temporary script to run the app with the environment variables
  console.log('Creating a script to run the app with environment variables...');
  
  try {
    // Run the app with the environment variables
    console.log('Running the app...');
    execSync('pnpm dev', { 
      env: process.env, 
      stdio: 'inherit',
      cwd: __dirname
    });
  } catch (error) {
    console.error('Error running the app:', error.message);
  }
} else {
  console.error('Root .env file not found at:', rootEnvPath);
  process.exit(1);
}
