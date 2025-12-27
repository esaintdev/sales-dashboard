const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Envs missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- DIAGNOSIS START ---');
    console.log(`Using Key Type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE (Good)' : 'ANON (Might fail due to RLS)'}`);

    // 1. Check if admins table exists by selecting count
    const { count, error: countError } = await supabase
        .from('admins')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('❌ Error checking admins table:', countError.message);
        console.log('   -> Most likely the table "admins" does not exist.');
        console.log('   -> ACTION: Run the SQL Create Table script in Supabase.');
        return;
    }
    console.log('✅ Admins table exists.');

    // 2. Check for user
    const email = 'esaint@esaint.com';
    const { data: user, error: userError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

    if (userError || !user) {
        console.error(`❌ User ${email} not found.`);
        console.log('   -> ACTION: Run "node scripts/setup-custom-admin.js" to create the user.');
        return;
    }
    console.log(`✅ User ${email} found.`);

    // 3. Verify password
    const testPass = 'esaint275';
    const match = await bcrypt.compare(testPass, user.password_hash);
    if (match) {
        console.log('✅ Password hash matches.');
    } else {
        console.error('❌ Password hash does NOT match.');
        console.log('   -> ACTION: Delete user and re-run setup, or update password.');
    }
}

diagnose();
