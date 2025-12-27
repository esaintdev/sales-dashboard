import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // 1. Check if user is trying to access a protected route
    // We protect root "/" and any sub-routes, except "/login" and "/api/auth/*"
    // Actually, we can just protect "/" since that's the main dashboard.
    // And maybe "/api/clients", "/api/jobs" if we had them.
    // For now, let's protect everything that is NOT login or public assets.

    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path.startsWith('/_next') || path.startsWith('/static') || path === '/favicon.ico' || path.startsWith('/api/auth');

    if (isPublicPath) {
        // If user is logged in and trying to go to login, redirect to dashboard
        if (path === '/login' && session) {
            try {
                await decrypt(session.value);
                return NextResponse.redirect(new URL('/', request.url));
            } catch (e) {
                // Invalid session, let them go to login
            }
        }
        return NextResponse.next();
    }

    // 2. Validate session for protected routes
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await decrypt(session.value);
        return NextResponse.next();
    } catch (error) {
        // Session invalid/expired
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
