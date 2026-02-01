import { NextResponse, type NextRequest } from 'next/server';

import { supabaseAnon } from '@/server/clients/supabase';
import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '@/server/config/cookies';
import { verifyOtpRequestSchema } from '@/schemas/requests';
import { parseJsonBody } from '@/server/http/parseJsonBody';
import { jsonError } from '@/server/http/json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const parsed = await parseJsonBody(request, verifyOtpRequestSchema);
    if (!parsed.ok) return parsed.response;

    const { data, error } = await supabaseAnon.auth.verifyOtp({
        email: parsed.data.email,
        token: parsed.data.token,
        type: 'email',
    });

    if (error) return jsonError(error.message, 400);
    if (!data?.session?.access_token) return jsonError('No session returned', 400);

    const res = NextResponse.json({ ok: true, user: data.user });

    res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.session.access_token, COOKIE_OPTIONS);
    if (data.session.refresh_token) {
        res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.session.refresh_token, COOKIE_OPTIONS);
    }

    return res;
}
