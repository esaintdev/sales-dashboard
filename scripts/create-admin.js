const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env or .env.local
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
// Tries to use Service Key first, then falls back to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and a supabase key (SERVICE_ROLE or ANON) must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const args = process.argv.slice(2);
const email = args[0] || 'esaint@esaint.com';
const password = args[1] || 'esaint275';

async function createAdmin() {
    console.log(`Creating user: ${email}...`);

    // Try admin.createUser first (requires Service Role Key)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (!error) {
            console.log('User created successfully (verified):', data.user);
            return;
        }
        console.log('admin.createUser failed (likely permissions), trying standard signUp...');
    }

    // Fallback to standard signUp (works with Anon Key)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
        return;
    }

    if (data.user && !data.session) {
        console.log('User created successfully! NOTE: You may need to verify your email address before logging in.');
    } else {
        console.log('User created successfully:', data.user);
    }
}

createAdmin();
