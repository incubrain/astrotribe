import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');

const TYPE_MAPPINGS = {
  'bookmark_folders.path': 'Unsupported("ltree")',
  'news_summaries.embedding': 'Unsupported("vector")',
  'research_embeddings.embedding': 'Unsupported("vector")',
  'searches.embedding': 'Unsupported("vector")',
  'table_query_performance.avg_duration': 'Unsupported("interval")',
};

async function execCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
}

async function updateSchema(): Promise<void> {
  try {
    console.log('Running prisma db pull...');
    await execCommand('npx prisma db pull');

    console.log('Reading schema file...');
    let schemaContent = await fs.readFile(SCHEMA_PATH, 'utf8');

    // Step 1: Handle custom field types
    console.log('Updating field types...');
    for (const [field, type] of Object.entries(TYPE_MAPPINGS)) {
      const [model, fieldName] = field.split('.');

      const pattern = new RegExp(
        `(\\s+${fieldName}\\s+)(\\w+|Unsupported\\("\\w+"\\))(?:\\("\\w+"\\))?\\??(?=\\s)`,
        'gm',
      );

      const modelPattern = new RegExp(`model\\s+${model}\\s+{([^}]+)}`, 'g');

      schemaContent = schemaContent.replace(modelPattern, (match, modelContent) => {
        const updatedContent = modelContent.replace(pattern, `$1${type}?`);
        return `model ${model} {${updatedContent}}`;
      });
    }

    console.log('Writing updated schema...');
    await fs.writeFile(SCHEMA_PATH, schemaContent, 'utf8');

    console.log('Formatting schema...');
    await execCommand('npx prisma format');

    console.log('Generating Prisma Client...');
    await execCommand('npx prisma generate');

    console.log('Schema update completed successfully!');
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
