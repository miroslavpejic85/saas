import { NextResponse, type NextRequest } from 'next/server';

import { getPaidForUser } from '@/server/data/userAccess';
import { getUserFromRequest } from '@/server/auth/session';
import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '@/server/config/cookies';
import { jsonError } from '@/server/http/json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { user, refreshedSession } = await getUserFromRequest(request);

    if (!user) {
        return jsonError('Not logged in', 401);
    }

    let paid = false;
    try {
        paid = await getPaidForUser(user.id);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Server error';
        return jsonError(message, 500);
    }

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email }, paid });

    if (refreshedSession?.access_token) {
        res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, refreshedSession.access_token, COOKIE_OPTIONS);
        if (refreshedSession.refresh_token) {
            res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshedSession.refresh_token, COOKIE_OPTIONS);
        }
    }

    return res;
}
