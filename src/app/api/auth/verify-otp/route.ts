import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { supabaseAnon } from '@/server/clients/supabase';
import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '@/server/config/cookies';

const VerifyOtpSchema = z.object({
    email: z.string().trim().email('Invalid email'),
    token: z.string().trim().min(1, 'Missing token'),
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = VerifyOtpSchema.safeParse(body);

    if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || 'Invalid body';
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const { data, error } = await supabaseAnon.auth.verifyOtp({
        email: parsed.data.email,
        token: parsed.data.token,
        type: 'email',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data?.session?.access_token) return NextResponse.json({ error: 'No session returned' }, { status: 400 });

    const res = NextResponse.json({ ok: true, user: data.user });

    res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.session.access_token, COOKIE_OPTIONS);
    if (data.session.refresh_token) {
        res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.session.refresh_token, COOKIE_OPTIONS);
    }

    return res;
}
