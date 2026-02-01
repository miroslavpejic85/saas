import { NextResponse, type NextRequest } from 'next/server';

import { supabaseAnon } from '@/server/clients/supabase';
import { sendOtpRequestSchema } from '@/schemas/requests';
import { parseJsonBody } from '@/server/http/parseJsonBody';
import { jsonError } from '@/server/http/json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const parsed = await parseJsonBody(request, sendOtpRequestSchema);
    if (!parsed.ok) return parsed.response;

    const origin = request.nextUrl.origin;

    const { error } = await supabaseAnon.auth.signInWithOtp({
        email: parsed.data.email,
        options: {
            emailRedirectTo: `${origin}/login`,
        },
    });

    if (error) return jsonError(error.message, 400);
    return NextResponse.json({ ok: true });
}
