# Supabase DB Workflow Notes

This project uses Supabase Auth plus app tables for coding problems, submissions,
test results, and solved progress. The database schema should be managed through
SQL migration files in `supabase/migrations`.

## Current migration files

- `20260704030003_create_profiles_schema.sql`
  - Creates `public.profiles`.
  - Links profiles to `auth.users`.
  - Adds a trigger so every new Auth user gets a profile row.
  - Backfills profile rows for users that already exist.

- `20260704030004_create_problem_schema.sql`
  - Creates `problems`, `submissions`, `test_case_results`, and `problem_solved`.
  - Adds indexes, RLS policies, and grants.

- `20260711085544_create_profiles_schema.sql`
  - No-op migration kept only because the remote Supabase project already has
    this migration version recorded in its migration history.

## Golden rule

Do not manually create or edit production tables in the Supabase Table Editor.
Use migration files for schema changes so the database can be recreated and kept
in sync.

Manual SQL in the Supabase SQL Editor is okay for quick testing, but if the
schema change should stay, copy it into a migration file.

## Making a schema change

Example changes:

- Add a new table.
- Add/remove/rename a column.
- Add an index.
- Add or update an RLS policy.
- Add a trigger or database function.

Steps:

1. Create a new migration:

   ```powershell
   npx supabase migration new describe_your_change
   ```

2. Open the new file in `supabase/migrations`.

3. Write the SQL change inside that file.

4. Push it to the linked remote Supabase project:

   ```powershell
   npx supabase db push --linked
   ```

5. Verify in Supabase Dashboard:

   - Table Editor: check tables/columns exist.
   - SQL Editor: run a simple `select`.
   - App: restart Expo and test the screen that uses the table.

## When the remote history has migrations missing locally

If `db push` says something like:

```text
Remote migration versions not found in local migrations directory.
```

It means Supabase has a migration version recorded remotely that does not exist
as a local file.

Fix options:

1. Best option: restore or recreate the missing migration file locally.
2. If the missing migration was accidental/no-op, keep a no-op file with the same
   timestamp so local and remote history match.
3. If Supabase tells you to repair a migration, only do that when you are sure
   the remote migration history is wrong.

For this repo, `20260711085544_create_profiles_schema.sql` is intentionally a
no-op local file because the remote project already recorded that version.

## Seeding data

Seed data lives in:

```text
supabase/seed.sql
```

This repo uses it to insert starter coding problems.

After migrations are pushed, seed with:

```powershell
npx supabase db push --linked --include-seed
```

If that does not work, paste the contents of `supabase/seed.sql` into:

```text
Supabase Dashboard -> SQL Editor
```

Then run it manually.

The seed file is written to be safe to rerun for existing problem titles.

## Local vs remote commands

Use remote commands for this project because the Expo app points to the hosted
Supabase project in `.env.local`.

Remote:

```powershell
npx supabase db push --linked
npx supabase db push --linked --include-all
npx supabase db push --linked --include-seed
```

Local-only commands require a local Supabase Docker database. Do not use these
unless you have run `npx supabase start`:

```powershell
npx supabase db query --file supabase/seed.sql
npx supabase db reset
```

If a command says `Connecting to local database...`, it is not targeting the
hosted Supabase project.

## Common checks

Check problem rows:

```sql
select count(*) from public.problems;
```

Check submissions:

```sql
select count(*) from public.submissions;
```

Check profiles:

```sql
select count(*) from public.profiles;
```

Check migration history:

```sql
select * from supabase_migrations.schema_migrations order by version;
```

## App-specific table usage

The app reads problem and submission data from:

```text
src/lib/problems.ts
```

Important queries:

- `fetchProblems()` reads `public.problems`.
- `fetchProblemById()` reads one problem.
- `fetchSolvedCount()` reads `public.problem_solved`.
- `fetchUserSubmissionsForProblem()` reads `public.submissions`.
- `fetchUserSubmissionActivity()` reads `public.submissions`.

The submit API writes submissions here:

```text
src/app/api/submit+api.ts
```

It uses the service role key through `src/lib/supabase-admin.ts`.

## When adding a new table for the app

Minimum checklist:

1. Create the table in a migration.
2. Enable RLS:

   ```sql
   alter table public.your_table enable row level security;
   ```

3. Add policies for the client role that needs access.
4. Add indexes for columns used in filters, joins, and ordering.
5. Grant only the needed privileges to `authenticated`.
6. Push with `npx supabase db push --linked`.
7. Test from the app.

## Quick recovery if app says table is missing

If Expo logs show:

```text
PGRST205: Could not find the table 'public.some_table' in the schema cache
```

Check these in order:

1. Is `.env.local` pointing to the Supabase project you migrated?
2. Does the table exist in Supabase Dashboard -> Table Editor?
3. Did `npx supabase db push --linked` succeed?
4. Did a migration fail partway through?
5. Does the table name in code match the SQL table name?

After creating tables, restart Expo:

```powershell
npm start
```
