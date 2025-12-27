import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';

export async function GET() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ user: null });
    }

    // Fetch fresh user data including currency
    const { supabase } = await import('@/app/lib/supabase');
    const { data: admin } = await supabase
        .from('admins')
        .select('currency')
        .eq('email', session.user.email) // Assuming email is the link, or ID if available in session
        .single();

    const userWithCurrency = {
        ...session.user,
        currency: admin?.currency || 'NGN'
    };

    return NextResponse.json({ user: userWithCurrency });
}
