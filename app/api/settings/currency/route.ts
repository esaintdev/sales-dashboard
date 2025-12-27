import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { currency } = body;

        if (!['NGN', 'USD', 'GBP'].includes(currency)) {
            return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
        }

        const { error } = await supabase
            .from('admins')
            .update({ currency })
            .eq('email', session.user.email);

        if (error) {
            console.error('Error updating currency:', error);
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
        }

        return NextResponse.json({ success: true, currency });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
