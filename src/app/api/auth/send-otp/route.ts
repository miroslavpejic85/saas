import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { supabaseAnon } from '@/server/clients/supabase';

const SendOtpSchema = z.object({
    email: z.string().trim().email('Invalid email'),
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = SendOtpSchema.safeParse(body);

    if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || 'Invalid body';
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    const { error } = await supabaseAnon.auth.signInWithOtp({
        email: parsed.data.email,
        options: {
            emailRedirectTo: `${origin}/login`,
        },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
