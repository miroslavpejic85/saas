import { NextResponse } from 'next/server';

import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '@/server/config/cookies';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
    res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return res;
}
