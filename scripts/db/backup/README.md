# Fixed CSV Export Command

The issue with your CSV export not working was due to several problems:

1. The `createBackup` function wasn't declared as `async`, but we were using `await` inside it
2. The CSV export command had path escaping issues
3. Error handling wasn't properly showing failures in the special export process

I've fixed these issues by:

1. Making `createBackup` an async function
2. Improving path handling with `path.resolve()`
3. Using a temporary SQL file approach instead of direct command execution
4. Adding better error handling and logging

## Try This Command:

```bash
pnpm db:backup --connection="postgresql://postgres.idsifamzvzlpgnmlnldw:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true" --pg-dump-path="/opt/homebrew/opt/postgresql@15/bin/pg_dump" --data-only --export-format=csv --verbose
```

## Where to Find Your CSV Files

After running the command, you'll find your CSV files in:

```
./backups/export-TIMESTAMP/
```

Each table will have its own CSV file in this directory.

## Common Issues and Solutions

If you're still having trouble:

1. Check if you're using `pgbouncer=true` in your connection string - pgbouncer can cause issues
   with some COPY commands
2. Try a simple test with just one table: `--tables=your_table_name`
3. Check if the PostgreSQL user has permissions to run COPY commands
4. Try removing the `?pgbouncer=true` from your connection string when doing exports

## Adding to package.json

```json
{
  "scripts": {
    "db:backup": "tsx scripts/db/backup.ts",
    "db:backup:csv": "tsx scripts/db/backup.ts --data-only --export-format=csv --verbose",
    "db:backup:inserts": "tsx scripts/db/backup.ts --data-only --export-format=inserts --verbose",
    "db:backup:json": "tsx scripts/db/backup.ts --data-only --export-format=json --verbose",
    "db:backup:schema": "tsx scripts/db/backup.ts --schema-only --verbose"
  }
}
```
