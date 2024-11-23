// alter table "public"."role_permissions" add column "inherit_from" (public.)app_role_enum[];

// create table "public"."role_hierarchy" (
//   "parent_role" public.app_role_enum not null,
//   "child_role" public.app_role_enum not null
// );

// create policy "delete_policy"
// on "public"."bookmark_folders"
// as permissive
// for delete
// to public
// using ((public.)authorize('bookmark_folders.delete'::text));

// alter table "public"."user_profiles" alter column "role" set default 'user'::public.app_role_enum;

// p_role_key::app_role_enum,

// alter table "public"."categories" alter column "id" set default nextval('public.categories_id_seq'::regclass);

// CREATE OR REPLACE FUNCTION public.get_inherited_permissions(p_role app_role_enum)

// scripts/fix-migration.ts
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

function ensureBackupDirExists() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Replacement {
  find: RegExp
  replace: string
}

// Get the migration file path from command-line arguments
const migrationFilePath = process.argv[2]

if (!migrationFilePath) {
  console.error('Usage: npx ts-node scripts/fix-migration.ts <migration_file.sql>')
  process.exit(1)
}

// List of replacements to perform
const replacements: Replacement[] = [
  {
    // Add 'public.' schema to unqualified function calls
    find: /EXECUTE FUNCTION (\w+\(.*?\))/g,
    replace: 'EXECUTE FUNCTION public.$1',
  },
  // Add more replacements as needed
]

const backupDir = path.join(migrationFilePath, '../migration_backups')

function backupMigrationFile(filePath: string) {
  ensureBackupDirExists()

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const fileName = path.basename(filePath)
  const backupFileName = `${fileName}.${timestamp}.bak`
  const backupFilePath = path.join(backupDir, backupFileName)

  fs.copyFileSync(filePath, backupFilePath)
  console.log(`Backup created: ${backupFilePath}`)

  // Clean up old backups (keep last 10)
  const backups = fs
    .readdirSync(backupDir)
    .filter((file) => file.startsWith(fileName))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(backupDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  if (backups.length > 10) {
    const oldBackups = backups.slice(10)
    for (const backup of oldBackups) {
      fs.unlinkSync(path.join(backupDir, backup.name))
      console.log(`Old backup removed: ${backup.name}`)
    }
  }
}

function performReplacements(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8')
  let updatedContent = content

  replacements.forEach(({ find, replace }) => {
    updatedContent = updatedContent.replace(find, replace)
  })

  fs.writeFileSync(filePath, updatedContent, 'utf-8')
  console.log(`Migration file updated: ${filePath}`)
}

backupMigrationFile(migrationFilePath)
performReplacements(migrationFilePath)
