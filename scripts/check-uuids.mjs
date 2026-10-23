import fs from 'fs';
import path from 'path';

const files = [
  'supabase/seed.sql',
  'supabase/full_setup.sql',
  'supabase/migrations/20261018000001_initial_schema.sql',
  'supabase/migrations/20261018000002_rls_policies.sql'
];

for (const f of files) {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const regex = /['"]([0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12})['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[1];
    const isValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(raw);
    if (!isValid) {
      console.log(`${f} -> INVALID UUID: ${raw}`);
    }
  }
}
