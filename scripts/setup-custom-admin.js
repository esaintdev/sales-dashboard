const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

[envPath, envLocalPath].forEach(path => {
    if (fs.existsSync(path)) {
        const envConfig = dotenv.parse(fs.readFileSync(path));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We need Service Role Key to bypass RLS policies or create tables if using API (but API can't create tables usually)
// Wait, we can't create tables via JS Client unless we use SQL Editor or Extensions.
// Actually, `create-admin.js` was creating a USER in Supabase Auth.
// Now we need to insert a ROW into a TABLE `admins`.
// AND we need that table to exist.
// Limitation: We cannot create the TABLE `admins` from this script unless we execute raw SQL via a Postgres client, or user does it in dashboard.
// I will output the SQL needed for the user to run.

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and key must be set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const args = process.argv.slice(2);
const email = args[0] || 'esaint@esaint.com';
const password = args[1] || 'esaint275';

async function setupAdmin() {
    console.log(`\n--- SETUP ACTION REQUIRED ---`);
    console.log(`Please run the following SQL in your Supabase SQL Editor to create the 'admins' table:\n`);
    console.log(`
    create table if not exists admins (
      id uuid default gen_random_uuid() primary key,
      email text not null unique,
      password_hash text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    
    -- RLS: Only allow read if we are server-side (Service Role) OR... 
    -- Actually, since we use 'supabase-js' in /api/auth/login with ANON key?
    -- No, usually we should use SERVICE_ROLE key in API routes to read this secure table.
    -- BUT if user only has ANON key in .env.local... we have a problem.
    -- We'll assume user might need to add SERVICE_KEY to .env.local for full security,
    -- OR we enable RLS to allow select for anyone (BAD idea for password hashes?),
    -- OR we turn off RLS for this table but rely on it being obscure? No.
    
    -- BEST PRACTICE: Enable RLS. Create policy to allow 'public' to SELECT (to check email) but that exposes hashes?
    -- No. The API route should use SERVICE_ROLE key.
    `);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log(`\nHashes generated.`);
    console.log(`Email: ${email}`);
    console.log(`Password Hash: ${hash}`);

    console.log(`\nAttempting to insert user into 'admins' table (will fail if table doesn't exist or RLS blocks)...`);

    const { data, error } = await supabase
        .from('admins')
        .insert([
            { email: email, password_hash: hash }
        ])
        .select();

    if (error) {
        console.error('Insert failed:', error.message);
        console.log('-> Did you create the table?');
        console.log('-> Does your key have permission? (Service Role Key recommended for this script)');
    } else {
        console.log('Admin user row created successfully:', data);
    }
}

setupAdmin();
