When you change the DB schema
Do this:
1. Create a new migration file.
2. Put the schema change in that file.
3. Push it to Supabase.
4. Update app code/types/seed data if needed.
Typical command:
npx supabase migration new describe_your_change
npx supabase db push --linked
Important rules
- Don’t edit old migration files for a new schema change.
- Don’t manually change tables in the dashboard if you want the change to be permanent.
- If you test SQL manually in the editor, copy the final version into a migration file.
- If you add or rename columns/tables, also update:
- src/lib/problems.ts
- any API routes using those tables
- supabase/seed.sql or supabase/seed/problems.ts if seeded data changed