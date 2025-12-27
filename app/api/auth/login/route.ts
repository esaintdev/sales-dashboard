import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase'; // Using Supabase just as DB
import bcrypt from 'bcryptjs';
import { login } from '@/app/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Fetch user from 'admins' table
        // Note: We need to create this table. It's custom, not Supabase Auth.
        const { data: user, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        await login({ email: user.email, id: user.id });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
