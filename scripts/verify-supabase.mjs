import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.error('❌ Supabase credentials are missing or still placeholder in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const tablesToCheck = [
  'roles',
  'profiles',
  'academic_sessions',
  'courses',
  'subjects',
  'teachers',
  'batches',
  'students',
  'attendance_records',
  'assignments',
  'examinations',
  'invoices',
  'payments',
  'announcements',
  'audit_logs'
];

async function verify() {
  console.log('\nChecking table existence and record counts in Supabase...');
  let existingCount = 0;
  const missingTables = [];

  for (const table of tablesToCheck) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      missingTables.push(table);
    } else {
      existingCount++;
      console.log(`  ✅ Table '${table}': ${count ?? 0} rows`);
    }
  }

  if (existingCount === 0) {
    console.log('\n⚠️  No tables found in Supabase yet.');
    console.log('👉 To create all tables and insert seed data:');
    console.log('   1. Open: https://supabase.com/dashboard/project/ukhhqkymdrtvwldkalxc/sql/new');
    console.log('   2. Paste the contents of supabase/full_setup.sql');
    console.log('   3. Click "Run"');
  } else if (missingTables.length > 0) {
    console.log(`\n⚠️  ${existingCount}/${tablesToCheck.length} tables found. Missing: ${missingTables.join(', ')}`);
  } else {
    console.log(`\n🎉 All ${tablesToCheck.length} tables are online and connected to Supabase!`);
  }
}

verify().catch(console.error);
